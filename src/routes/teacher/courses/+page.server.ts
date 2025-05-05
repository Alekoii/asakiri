import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

interface TeacherCourse {
    id: string;
    title: string;
    short_description: string | null;
    thumbnail: string | null;
    language_taught: string;
    course_language: string;
    author_id: string;
    author_name: string;
    author_subtitle: string | null;
    author_avatar_url: string | null;
    enrolled_students: number;
    is_published: boolean;
    created_at: string;
    category: string;
}

export const load: PageServerLoad = async ({ locals }) => {
    const { user, supabase } = locals;

    if (!user) {
        redirect(303, "/auth/login?redirectTo=/teacher/courses");
    }

    const { data, error } = await supabase.rpc("get_teach_courses", {
        input_profile_id: user.id,
    });

    if (error) {
        console.error("Error loading teacher courses:", error);
        return {
            courses: [] as TeacherCourse[],
        };
    }

    return {
        courses: (data || []) as TeacherCourse[],
    };
};
