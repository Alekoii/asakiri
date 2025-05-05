export interface VocabularyItem {
    id: string;
    section_id: string;
    term: string;
    definition: string;
    example?: string;
    pronunciation?: string;
    audio_url?: string;
    image_url?: string;
    serial_number: number;
    created_at: string;
    updated_at: string;
}