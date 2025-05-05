
export type SectionType = "grammar" | "vocabulary" | "reading" | "alphabet";

export interface Section {
    id: string;
    title: string;
    description?: string;
    section_type: SectionType;
    content_json?: any;
    unit_id?: string; // null for standalone alphabet sections
    is_standalone: boolean;
    serial_number: number;
    created_at: string;
    updated_at: string;
}