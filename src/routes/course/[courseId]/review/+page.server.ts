import { error, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, locals }) => {
    const { courseId } = params;
    const { user, supabase } = locals;

    // Redirect to login if not authenticated
    if (!user) {
        throw redirect(
            303,
            `/auth/login?redirectTo=/course/${courseId}/review`,
        );
    }

    try {
        // 1. Check if user is enrolled in this specific course
        const { data: enrollment, error: enrollmentError } = await supabase
            .from("enrollments")
            .select("course_id")
            .eq("profile_id", user.id)
            .eq("course_id", courseId)
            .single();
        if (enrollmentError && enrollmentError.code !== "PGRST116") {
            throw error(
                500,
                "Failed to check course enrollment: " + enrollmentError.message,
            );
        }

        if (!enrollment) {
            // User isn't enrolled in this course
            throw redirect(303, `/course/${courseId}`);
        }

        // 2. Get course details
        const { data: course, error: courseError } = await supabase
            .from("courses")
            .select("id, title, profile_id")
            .eq("id", courseId)
            .single();

        if (courseError) {
            throw error(
                500,
                "Failed to fetch course details: " + courseError.message,
            );
        }

        if (!course) {
            throw error(404, "Course not found");
        }

        // 3. Get chapters for this course
        const { data: chapters, error: chaptersError } = await supabase
            .from("chapters")
            .select("id, title, course_id")
            .eq("course_id", courseId);

        if (chaptersError) {
            throw error(
                500,
                "Failed to fetch chapters: " + chaptersError.message,
            );
        }

        if (!chapters || chapters.length === 0) {
            return {
                course,
                reviewItems: [],
                totalCards: 0,
            };
        }

        // 4. Get all flashcards for these chapters
        const chapterIds = chapters.map((c) => c.id);

        const { data: allFlashcards, error: flashcardsError } = await supabase
            .from("flashcards")
            .select("*")
            .in("chapter_id", chapterIds);

        if (flashcardsError) {
            throw error(
                500,
                "Failed to fetch flashcards: " + flashcardsError.message,
            );
        }
        if (!allFlashcards || allFlashcards.length === 0) {
            return {
                course,
                reviewItems: [],
                totalCards: allFlashcards.length,
                dueCards: 0,
                stats: {
                    successRate: 0,
                    lastPracticed: 0,
                    totalReviews: 0,
                },
            };
        }

        // 5. Get progress data for these flashcards
        const flashcardIds = allFlashcards.map((f) => f.id);

        const { data: progressData, error: progressError } = await supabase
            .from("user_flashcard_progress")
            .select("*")
            .eq("profile_id", user.id)
            .in("flashcard_id", flashcardIds);

        if (progressError) {
            throw error(
                500,
                "Failed to fetch progress data: " + progressError.message,
            );
        }

        // 6. Filter for cards that are either new or due
        const now = new Date();

        const dueFlashcards = allFlashcards.filter((flashcard) => {
            const progress = progressData?.find((p) =>
                p.flashcard_id === flashcard.id
            );

            // Include cards that have never been reviewed
            if (!progress) return true;

            // Include cards with due_date in the past
            if (progress.due_date) {
                const dueDate = new Date(progress.due_date);
                return dueDate <= now;
            }

            return true; // Include if no due date set
        });

        // 7. Organize cards with their progress data and chapter info
        const reviewItems = dueFlashcards.map((card) => {
            const progress = progressData?.find((p) =>
                p.flashcard_id === card.id
            );
            const chapter = chapters.find((c) => c.id === card.chapter_id);

            return {
                flashcard: card,
                progress: progress || null,
                chapterId: chapter?.id || null,
                chapterName: chapter?.title || null,
            };
        });

        // 8. Calculate review statistics
        let totalReviews = 0;
        let correctCount = 0;
        let lastReviewDate = null;

        progressData?.forEach((progress) => {
            totalReviews += progress.review_count || 0;
            correctCount += progress.correct_count || 0;

            if (progress.last_reviewed) {
                const reviewDate = new Date(progress.last_reviewed);
                if (!lastReviewDate || reviewDate > lastReviewDate) {
                    lastReviewDate = reviewDate;
                }
            }
        });

        const successRate = totalReviews > 0
            ? Math.round((correctCount / totalReviews) * 100)
            : 0;

        // Format last review date
        let lastPracticed = "Never";
        if (lastReviewDate) {
            const now = new Date();
            const diffTime = Math.abs(now.getTime() - lastReviewDate.getTime());
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 0) lastPracticed = "Today";
            else if (diffDays === 1) lastPracticed = "Yesterday";
            else lastPracticed = `${diffDays} days ago`;
        }

        return {
            course,
            reviewItems,
            totalCards: allFlashcards.length,
            dueCards: dueFlashcards.length,
            stats: {
                successRate,
                lastPracticed,
                totalReviews,
            },
        };
    } catch (err) {
        console.error("Error in course review page load:", err);

        if (err.status && err.message) {
            throw error(err.status, err.message);
        }

        throw error(500, "Failed to load review data");
    }
};

export const actions: Actions = {
    updateProgress: async ({ request, locals, params }) => {
        const { user, supabase } = locals;
        const { courseId } = params;

        if (!user) {
            throw error(401, "Unauthorized");
        }

        try {
            const formData = await request.formData();
            const flashcardId = formData.get("flashcardId") as string;
            const rating = parseInt(formData.get("rating") as string);

            if (!flashcardId || isNaN(rating) || rating < 1 || rating > 5) {
                throw error(400, "Invalid input");
            }

            // Get existing progress
            const { data: existingProgress, error: getError } = await supabase
                .from("user_flashcard_progress")
                .select("*")
                .eq("profile_id", user.id)
                .eq("flashcard_id", flashcardId)
                .single();

            if (getError && getError.code !== "PGRST116") { // Not found error is fine
                throw error(500, "Failed to check existing progress");
            }

            // Calculate spaced repetition parameters based on rating
            const now = new Date();

            // Default values for new cards
            let easeFactor = 2.5;
            let interval = 1; // Days
            let reviewCount = 1;
            let correctCount = rating >= 3 ? 1 : 0;
            let incorrectCount = rating < 3 ? 1 : 0;

            if (existingProgress) {
                // Update existing values based on performance
                reviewCount = (existingProgress.review_count || 0) + 1;
                correctCount = (existingProgress.correct_count || 0) +
                    (rating >= 3 ? 1 : 0);
                incorrectCount = (existingProgress.incorrect_count || 0) +
                    (rating < 3 ? 1 : 0);

                // Calculate new ease factor (between 1.3 and 2.5)
                easeFactor = Math.max(
                    1.3,
                    Math.min(
                        2.5,
                        (existingProgress.ease_factor || 2.5) +
                            (0.1 * (rating - 3)),
                    ),
                );

                // Calculate new interval
                if (rating < 3) {
                    // Reset interval for cards rated difficult
                    interval = 1;
                } else {
                    // Increase interval based on previous interval
                    const prevInterval = existingProgress.interval || 1;

                    if (reviewCount <= 1) {
                        interval = 1;
                    } else if (reviewCount === 2) {
                        interval = 3;
                    } else {
                        interval = Math.round(prevInterval * easeFactor);
                    }
                }
            }

            // Calculate due date
            const dueDate = new Date(now);
            dueDate.setDate(dueDate.getDate() + interval);

            // Update or insert progress
            const { error: updateError } = await supabase
                .from("user_flashcard_progress")
                .upsert({
                    id: existingProgress?.id || undefined,
                    profile_id: user.id,
                    flashcard_id: flashcardId,
                    ease_factor: easeFactor,
                    interval: interval,
                    due_date: dueDate.toISOString(),
                    review_count: reviewCount,
                    correct_count: correctCount,
                    incorrect_count: incorrectCount,
                    last_reviewed: now.toISOString(),
                    created_at: existingProgress?.created_at ||
                        now.toISOString(),
                    updated_at: now.toISOString(),
                });

            if (updateError) {
                throw error(
                    500,
                    "Failed to update progress: " + updateError.message,
                );
            }

            return { success: true };
        } catch (err) {
            console.error("Error updating flashcard progress:", err);
            throw error(500, "Failed to update flashcard progress");
        }
    },
};
