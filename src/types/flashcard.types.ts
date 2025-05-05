export interface FlashcardProgress {
    id: string;
    profile_id: string;
    vocabulary_id: string;
    ease_factor: number;
    interval: number; // in days
    due_date: string;
    review_count: number;
    correct_count: number;
    incorrect_count: number;
    last_reviewed?: string;
    created_at: string;
    updated_at: string;
}
