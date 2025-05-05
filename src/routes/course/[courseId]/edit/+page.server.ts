import { error, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import type { Database } from "$lib/database.types";

type Course = Database["public"]["Tables"]["courses"]["Row"];
type Language = Database["public"]["Tables"]["languages"]["Row"];

export const load: PageServerLoad = async ({ params, locals }) => {
    const { user, supabase } = locals;

    if (!user) {
        throw redirect(
            303,
            `/auth/login?redirectTo=/course/${params.courseId}/edit`,
        );
    }

    const { data: course, error: fetchError } = await supabase
        .from("courses")
        .select(`
        *,
        chapters (
          id,
          title,
          sub_title,
          description,
          serial_number
        )
      `)
        .eq("id", params.courseId)
        .order("serial_number", { foreignTable: "chapters", ascending: true })
        .single();

    // Get total languages count for pagination
    const { count: languagesCount, error: countError } = await supabase
        .from("languages")
        .select("*", { count: "exact", head: true });

    // Get initial languages for the current course (taught and course languages)
    let initialLanguages = [];
    if (course?.language_taught || course?.course_language) {
        const languageIds = [course.language_taught, course.course_language]
            .filter(Boolean);
        const { data: languages } = await supabase
            .from("languages")
            .select("*")
            .in("id", languageIds);

        initialLanguages = languages || [];
    }

    if (fetchError || countError) {
        throw error(
            500,
            "Failed to fetch course: " +
                (fetchError?.message || countError?.message),
        );
    }

    if (!course) {
        throw error(404, "Course not found");
    }

    const isAuthorized = course.profile_id === user.id;

    if (!isAuthorized) {
        throw error(403, "You don't have permission to edit this course");
    }

    return {
        course: course as Course,
        initialLanguages,
        languagesCount: languagesCount || 0,
    };
};

export const actions: Actions = {
    saveCourse: async ({ request, params, locals }) => {
        const { supabase, user } = locals;

        if (!user) {
            throw redirect(
                303,
                `/auth/login?redirectTo=/course/${params.courseId}/edit`,
            );
        }

        const formData = await request.formData();

        const updatedCourse = {
            title: formData.get("title") as string,
            description: formData.get("description") as string,
            short_description: formData.get("short_description") as string,
            language_taught: parseInt(
                formData.get("language_taught") as string,
            ),
            course_language: parseInt(
                formData.get("course_language") as string,
            ),
            updated_at: new Date().toISOString(),
        };

        const { error: updateError } = await supabase
            .from("courses")
            .update(updatedCourse)
            .eq("id", params.courseId)
            .eq("profile_id", user.id);

        if (updateError) {
            console.error(updateError);
            throw error(500, "Failed to update course");
        }

        const units = JSON.parse(formData.get("units") as string);
        for (let i = 0; i < units.length; i++) {
            const unit = units[i];
            await supabase
                .from("chapters")
                .update({ serial_number: i + 1 })
                .eq("id", unit.id);
        }

        return {
            success: true,
        };
    },

    deleteChapter: async ({ request, locals }) => {
        const { supabase, user } = locals;
        if (!user) throw redirect(303, "/auth/login");

        const formData = await request.formData();
        const chapterId = formData.get("chapter_id");

        if (typeof chapterId !== "string") {
            throw error(400, "Invalid chapter ID");
        }

        const { error: deleteError } = await supabase
            .from("chapters")
            .delete()
            .eq("id", chapterId);

        if (deleteError) {
            console.error(deleteError);
            throw error(500, "Failed to delete chapter");
        }

        return {
            success: true,
        };
    },

    addNewUnit: async ({ params, locals }) => {
        const { supabase, user } = locals;
        if (!user) throw redirect(303, "/auth/login");

        const { data, error: insertError } = await supabase
            .from("chapters")
            .insert([
                {
                    title: "New Unit",
                    course_id: params.courseId,
                },
            ])
            .select()
            .single();

        if (insertError) {
            console.error(insertError);
            throw error(500, "Failed to create new unit");
        }

        return {
            success: true,
            newUnit: data,
        };
    },

    togglePublish: async ({ request, params, locals }) => {
        const { supabase, user } = locals;
        if (!user) {
            throw redirect(
                303,
                `/auth/login?redirectTo=/course/${params.courseId}/edit`,
            );
        }

        const formData = await request.formData();
        const newState = formData.get("is_published") === "true";

        const { error: publishError } = await supabase
            .from("courses")
            .update({
                is_published: newState,
                updated_at: new Date().toISOString(),
            })
            .eq("id", params.courseId)
            .eq("profile_id", user.id);

        if (publishError) {
            console.error(publishError);
            throw error(500, "Failed to update publish status");
        }

        return { success: true };
    },
};
