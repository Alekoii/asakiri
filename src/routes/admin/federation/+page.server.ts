import { error, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
    const { user, supabase } = locals;

    if (!user) {
        throw redirect(303, "/auth/login?redirectTo=/admin/federation");
    }

    const { data, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    if (profileError) {
        throw error(500, "Failed to load user profile");
    }
    if (data.is_admin === false) {
        throw redirect(303, "/");
    }
    const { data: instances, error: fetchError } = await supabase
      .from("federation_instances")
      .select("*")
      .order("created_at", { ascending: false });

    if (fetchError) {
        console.error("Error fetching federation instances:", fetchError);
        throw error(500, "Failed to load federation instances");
    }

    return {
        instances: instances || [],
    };
};

export const actions: Actions = {
    addInstance: async ({ request, locals }) => {
        const { user, supabase } = locals;

        if (!user) {
            throw error(401, "Unauthorized");
        }

        try {
            const formData = await request.formData();
            const name = formData.get("name") as string;
            const url = formData.get("url") as string;

            // Validate input
            if (!name || !url) {
                return { success: false, message: "Name and URL are required" };
            }

            // Format URL (ensure it has https:// and no trailing slash)
            let formattedUrl = url.trim();
            if (!formattedUrl.startsWith("http")) {
                formattedUrl = "https://" + formattedUrl;
            }
            if (formattedUrl.endsWith("/")) {
                formattedUrl = formattedUrl.slice(0, -1);
            }

            // Check if instance with this URL already exists
            const { data: existingInstance } = await supabase
              .from("federation_instances")
              .select("id")
              .eq("url", formattedUrl)
              .single();

            if (existingInstance) {
                return {
                    success: false,
                    message: "An instance with this URL already exists",
                };
            }

            // Insert new instance
            const { data, error: insertError } = await supabase
              .from("federation_instances")
              .insert({
                  name,
                  url: formattedUrl,
                  is_active: true,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
              })
              .select()
              .single();

            if (insertError) {
                throw insertError;
            }

            return { success: true, instance: data };
        } catch (err) {
            console.error("Error adding federation instance:", err);
            throw error(500, "Failed to add federation instance");
        }
    },

    toggleInstance: async ({ request, locals }) => {
        const { user, supabase } = locals;

        if (!user) {
            throw error(401, "Unauthorized");
        }

        try {
            const body = await request.json();
            const { id, status } = body;

            const { error: updateError } = await supabase
              .from("federation_instances")
              .update({
                  is_active: status,
                  updated_at: new Date().toISOString(),
              })
              .eq("id", id);

            if (updateError) {
                throw updateError;
            }

            return { success: true };
        } catch (err) {
            console.error("Error toggling federation instance:", err);
            throw error(500, "Failed to update federation instance");
        }
    },

    removeInstance: async ({ request, locals }) => {
        const { user, supabase } = locals;

        if (!user) {
            throw error(401, "Unauthorized");
        }

        try {
            const body = await request.json();
            const { id } = body;

            const { error: deleteError } = await supabase
              .from("federation_instances")
              .delete()
              .eq("id", id);

            if (deleteError) {
                throw deleteError;
            }

            return { success: true };
        } catch (err) {
            console.error("Error removing federation instance:", err);
            throw error(500, "Failed to remove federation instance");
        }
    },

    testConnection: async ({ request }) => {
        try {
            const formData = await request.formData();
            const url = formData.get("url") as string;

            const response = await fetch(`${url}/api/federation/ping`, {
                method: "GET",
            });
            if (response.ok) {
                const data = await response.json();
                return {
                    success: true,
                    message: `Connection successful! Instance "${
                      data.name || url
                    }" is available.`,
                };
            } else {
                return {
                    success: false,
                    message:
                      `Connection failed: ${response.status} ${response.statusText}`,
                };
            }
        } catch (err) {
            console.error("Error testing federation connection:", err);
            return {
                success: false,
                message: "Connection failed: Could not reach the instance.",
            };
        }
    },
};
