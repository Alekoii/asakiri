import { error, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { v4 as uuidv4 } from "uuid";

export const load: PageServerLoad = async ({ locals }) => {
    const { user, supabase } = locals;

    if (!user) {
        throw redirect(303, "/auth/login?redirectTo=/profile");
    }

    try {
        // Fetch user profile
        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

        if (profileError && profileError.code !== "PGRST116") {
            console.error("Error fetching profile:", profileError);
            throw error(500, "Failed to load profile data");
        }

        // Fetch courses the user is teaching
        const { data: teachingCourses, error: teachingError } = await supabase
            .from("courses")
            .select("id, title, thumbnail, is_published")
            .eq("profile_id", user.id);

        if (teachingError) {
            console.error("Error fetching teaching courses:", teachingError);
        }

        // Fetch courses the user is enrolled in
        const { data: enrollments, error: enrollmentError } = await supabase
            .from("enrollments")
            .select(`
                id,
                course:courses (
                    id, 
                    title,
                    thumbnail
                )
            `)
            .eq("profile_id", user.id);

        if (enrollmentError) {
            console.error("Error fetching enrollments:", enrollmentError);
        }

        // Extract courses from enrollments
        const learningCourses = enrollments?.map((enrollment) =>
            enrollment.course
        ) || [];

        return {
            profile,
            courses: {
                teaching: teachingCourses || [],
                learning: learningCourses,
            },
        };
    } catch (err) {
        console.error("Error in profile page load:", err);
        throw error(500, "An unexpected error occurred");
    }
};

export const actions: Actions = {
    updateProfile: async ({ request, locals }) => {
        const { user, supabase } = locals;

        if (!user) {
            throw error(401, "You must be logged in to update your profile");
        }

        const formData = await request.formData();

        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const bio = formData.get("bio") as string;
        const subtitle = formData.get("subtitle") as string;

        if (!name) {
            return { success: false, error: "Name is required" };
        }

        try {
            const { error: updateError } = await supabase
                .from("profiles")
                .update({
                    name,
                    email,
                    bio,
                    subtitle,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", user.id);

            if (updateError) {
                throw updateError;
            }

            return { success: true };
        } catch (err) {
            console.error("Error updating profile:", err);
            throw error(500, "Failed to update profile");
        }
    },

    uploadAvatar: async ({ request, locals }) => {
        const { user, supabase } = locals;

        if (!user) {
            throw error(401, "You must be logged in to upload an avatar");
        }

        try {
            const formData = await request.formData();
            const avatarFile = formData.get("avatar") as File;

            if (!avatarFile) {
                throw new Error("No file uploaded");
            }

            // Generate a unique filename
            const fileExtension = avatarFile.name.split(".").pop();
            const fileName = `profile/${user.id}-${uuidv4()}.${fileExtension}`;
            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from("media")
                .upload(fileName, avatarFile, {
                    cacheControl: "3600",
                    upsert: true,
                });

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from('media').getPublicUrl(fileName);
            await supabase
              .from("profiles")
              .update({
                  avatar_url: data.publicUrl,
                  updated_at: new Date().toISOString(),
              })
              .eq("id", user.id);
            return { success: true, avatarUrl: data.publicUrl };
        } catch (err) {
            console.error("Error uploading avatar:", err);
            throw error(500, "Failed to upload avatar");
        }
    },
};
