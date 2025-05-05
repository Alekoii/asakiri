import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
    const { user } = locals;

    if (!user) {
        redirect(303, "/auth/login?redirectTo=/course/create");
    }

    return {};
};

export const actions: Actions = {
    default: async ({ request, locals }) => {
        const { user, supabase } = locals;

        if (!user) {
            return fail(401, {
                error: "You must be logged in to create a course",
            });
        }

        const formData = await request.formData();
        const courseName = formData.get("courseName")?.toString().trim();

        if (!courseName) {
            return fail(400, {
                error: "Course name is required",
            });
        }

        if (courseName.length > 150) {
            return fail(400, {
                error: "Course name must be 150 characters or less",
            });
        }

        const now = new Date().toISOString();

        const { data, error: courseError } = await supabase
            .from("courses")
            .insert({
                title: courseName,
                profile_id: user.id,
                created_at: now,
                updated_at: now,
                is_published: false,
            })
            .select()
            .single();

        if (courseError) {
            console.error("Error creating course:", courseError);
            return fail(500, {
                error: "Failed to create course",
            });
        }

        if (!data) {
            return fail(500, {
                error: "Failed to create course - no data returned",
            });
        }

        throw redirect(303, `/course/${data.id}/edit`);
    },
};
