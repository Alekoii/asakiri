export interface Course {
    id: string;
    title: string;
    description?: string;
    short_description?: string;
    thumbnail?: string;
    profile_id: string;
    language_taught_id: number;
    course_language_id: number;
    is_published: boolean;
    created_at: string;
    updated_at: string;
}
