import { PUBLIC_FRONTEND_URL } from '$env/static/public';
import { redirect } from '@sveltejs/kit';

interface ActionResponse {
    success: boolean;
    errors?: string[];
    message?: string;
    email?: string;
}

export const actions = {
    signInWithEmail: async ({ request, locals: { supabase } }) => {
        const formData = await request.formData();

        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        // Initialize response
        const response: ActionResponse = {
            success: false
        };

        // Validate inputs
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return {
                success: false,
                errors: ["Please fill in your email"],
                email
            };
        }

        if (!password) {
            return {
                success: false,
                errors: ["Please fill in your password"],
                email
            };
        }

        // Attempt sign in
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error || !data.user) {
            return {
                success: false,
                errors: [error?.message || "An unknown error occurred"],
                email
            };
        }

        redirect(303, "/");

    },
    googleSignIn: async ({ locals: { supabase } }) => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${PUBLIC_FRONTEND_URL}/auth/callback`
            }
        });

        if (error) {
            return fail(400, {
                message: "Something went wrong while trying to sign in with Google",
            })
        }

        throw redirect(303, data.url);
    }
};
function fail(status: number, { message }: { message: string }) {
    return {
        status,
        body: {
            success: false,
            message
        }
    };
}
