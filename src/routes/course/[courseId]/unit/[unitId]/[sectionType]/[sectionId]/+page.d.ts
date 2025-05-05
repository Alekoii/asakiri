import type { Course } from '$types/course.types';
import type { Unit } from '$types/unit.types';
import type { Section } from '$types/section.types';
import type { VocabularyItem } from '$types/vocabulary.types';
import type { Session, SupabaseClient, User } from '@supabase/supabase-js';

export interface PageData {
    session: Session | null;
    user: User | null;
    supabase: SupabaseClient;
    course: Course;
    unit: Unit;
    section: Section;
    unitSections: Section[];
    vocabularyItems?: VocabularyItem[];
    isEnrolled: boolean;
}