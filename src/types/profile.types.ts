export interface Profile {
    id: string;
    name: string;
    email?: string | null;
    avatar_url?: string | null;
    bio?: string | null;
    subtitle?: string | null;
    created_at: string;
    updated_at: string;
}
