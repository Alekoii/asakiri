import type { Course } from "../types/course.types";

export const dummyCourses: Course[] = [
    {
        id: "course-001",
        title: "Japanese for Beginners",
        short_description:
            "Learn essential Japanese vocabulary, grammar, and writing systems.",
        description:
            "This course provides a comprehensive introduction to Japanese language for complete beginners. You will learn hiragana, katakana, basic kanji, essential vocabulary, and fundamental grammar structures.",
        thumbnail: "https://placehold.co/600x400/e6f2ff/0066cc?text=Japanese",
        profile_id: "user-001",
        language_taught_id: 1, // Japanese
        course_language_id: 2, // English
        is_published: true,
        created_at: "2023-01-15T08:30:00Z",
        updated_at: "2023-02-20T14:45:00Z",
    },
    {
        id: "course-002",
        title: "Spanish Conversation",
        short_description:
            "Practical Spanish for everyday conversations and travel.",
        description:
            "Build your Spanish speaking confidence with this conversation-focused course. Learn practical vocabulary, phrases, and grammar for travel, work, and social interactions.",
        thumbnail: "https://placehold.co/600x400/fff5e6/ff9900?text=Spanish",
        profile_id: "user-002",
        language_taught_id: 3, // Spanish
        course_language_id: 2, // English
        is_published: true,
        created_at: "2023-03-10T09:15:00Z",
        updated_at: "2023-04-05T11:20:00Z",
    },
    {
        id: "course-003",
        title: "Mandarin Chinese Essentials",
        short_description:
            "Master Mandarin pronunciation, characters, and basic conversation.",
        description:
            "Start your journey to Mandarin fluency with this beginner-friendly course covering pronunciation, tones, characters, and essential grammar patterns for everyday communication.",
        thumbnail: "https://placehold.co/600x400/f5e6e6/cc0000?text=Chinese",
        profile_id: "user-003",
        language_taught_id: 4, // Mandarin Chinese
        course_language_id: 2, // English
        is_published: false,
        created_at: "2023-05-20T10:00:00Z",
        updated_at: "2023-06-15T16:30:00Z",
    },
];
