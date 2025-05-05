import type { Session, SupabaseClient, User } from "@supabase/supabase-js";

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

export interface PageData {
    session: Session | null;
    user: User | null;
    supabase: SupabaseClient;
    courses: TeacherCourse[];
}
