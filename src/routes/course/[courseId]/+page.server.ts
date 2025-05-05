import type { Actions, PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ params, locals }) => {
    const { supabase } = locals;
    const courseId = params.courseId;

    try {
        // Get course details with author information
        const { data: course, error: courseError } = await supabase
            .from("courses")
            .select(`
                *,
                profile:profiles(
                    id,
                    name,
                    avatar_url,
                    subtitle,
                    bio
                )
            `)
            .eq("id", courseId)
            .single();

        if (courseError) throw courseError;
        if (!course) throw error(404, "Course not found");
        // Format the teacher information
        course.author_name = course.profile?.name || "Unknown Instructor";
        course.author_avatar_url = course.profile?.avatar_url || null;
        course.author_bio = course.profile?.bio || null;
        course.author_subtitle = course.profile?.subtitle ||
            "Language Instructor";

        // Get units (chapters) for this course
        const { data: units, error: unitsError } = await supabase
            .from("chapters")
            .select("*")
            .eq("course_id", courseId)
            .order("serial_number", { ascending: true });

        if (unitsError) throw unitsError;

        // Get sections for all units
        const unitIds = units.map((unit) => unit.id);

        let sections = [];
        if (unitIds.length > 0) {
            const { data: sectionsData, error: sectionsError } = await supabase
                .from("sections")
                .select("*")
                .in("chapter_id", unitIds)
                .order("serial_number", { ascending: true });

            if (sectionsError) throw sectionsError;
            sections = sectionsData || [];
        }

        // Get language information
        const { data: languages, error: langsError } = await supabase
            .from("languages")
            .select("*")
            .in("id", [course.language_taught, course.course_language]);

        if (langsError) throw langsError;

        const courseTaughtLanguage = languages.find((lang) =>
            lang.id === course.language_taught
        ) || null;
        const courseInLanguage = languages.find((lang) =>
            lang.id === course.course_language
        ) || null;

        // Check if user is enrolled
        let isEnrolled = false;
        if (locals.user) {
            const { data: enrollment } = await supabase
                .from("enrollments")
                .select("id")
                .eq("course_id", courseId)
                .eq("profile_id", locals.user.id)
                .single();

            isEnrolled = !!enrollment;
        }

        // Get enrollment count
        const { data: enrollmentCount } = await supabase
            .rpc("get_enrollment_count", { course_uuid: courseId });

        course.enrolled_students = enrollmentCount || 0;

        return {
            course,
            units: units || [],
            sections,
            courseTaughtLanguage,
            courseInLanguage,
            isEnrolled,
        };
    } catch (err) {
        console.error("Error loading course data:", err);
        throw error(500, "Failed to load course data");
    }
};

export const actions: Actions = {
    enroll: async ({ locals, params }) => {
        const { supabase, user } = locals;
        const courseId = params.courseId;

        if (!user) {
            throw error(401, "You must be logged in to enroll in a course");
        }

        try {
            const { error: enrollError } = await supabase
              .from("enrollments")
              .insert({
                  course_id: courseId,
                  profile_id: user.id,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
              });

            if (enrollError) {
                console.error("Error enrolling in course:", enrollError);
                throw error(500, "Failed to enroll in the course");
            }

            return {
                success: true,
                message: "Successfully enrolled in the course",
            };
        } catch (err) {
            console.error("Error during enrollment:", err);
            throw error(500, "Failed to enroll in the course");
        }
    },
};
