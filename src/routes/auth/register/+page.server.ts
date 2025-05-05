interface ActionResponse {
    success: boolean;
    message: string;
    name?: string;
    email?: string;
}

export const actions = {
    default: async ({ request, locals: { supabase } }) => {
        const formData = await request.formData();

        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const passwordConfirmation = formData.get("passwordConfirmation") as string;

        // Name validation
        if (!name || name.replace(/\s/g, '').length < 4) {
            return {
                success: false,
                message: "Name should be at least 4 characters long",
                name,
                email
            };
        }

        // Email validation
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return {
                success: false,
                message: "Please fill in your email",
                name,
                email
            };
        }

        // Password validation - both required
        if (!password || !passwordConfirmation) {
            return {
                success: false,
                message: "Password and confirmation password are required",
                name,
                email
            };
        }

        // Password complexity check
        if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) ||
            !/[0-9]/.test(password) || !/[!@#$%^&*]/.test(password)) {
            return {
                success: false,
                message: "Password must be at least 8 characters and contain uppercase, lowercase, number, and special character (!@#$%^&*)",
                name,
                email
            };
        }

        // Password match check
        if (password !== passwordConfirmation) {
            return {
                success: false,
                message: "Password should match the confirm password",
                name,
                email
            };
        }

        // Attempt signup
        const { data, error } = await supabase.auth.signUp({
            email,
            password
        });

        if (error || !data.user) {
            return {
                success: false,
                message: error?.message || "An unknown error occurred",
                name,
                email
            };
        }

        const userId = data.user.id;
        await supabase.from("profiles").insert([
            {
                user_id: userId,
                name,
                email
            }
        ]);

        return {
            success: true,
            message: `You have been registered, ${name}. Please verify your email to login.`
        };
    },
};