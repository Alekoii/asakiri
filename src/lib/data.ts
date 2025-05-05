// src/lib/data.ts
import { dummyCourses } from "../dummy/courses";
import { dummyUnits } from "../dummy/units";
import { dummySections } from "../dummy/sections";
import { dummyVocabularyItems } from "../dummy/vocabulary";
import { dummyFlashcardProgress } from "../dummy/flashcard_progress";
import { dummyProfiles } from "../dummy/profiles";
import { dummyLanguages } from "../dummy/languages";

// Courses
export const getCourses = () => {
    return dummyCourses;
};

export const getCourseById = (id: string) => {
    return dummyCourses.find((course) => course.id === id);
};

// Units
export const getUnitsByCourseId = (courseId: string) => {
    return dummyUnits.filter((unit) => unit.course_id === courseId)
        .sort((a, b) => a.serial_number - b.serial_number);
};

export const getUnitById = (id: string) => {
    return dummyUnits.find((unit) => unit.id === id);
};

// Sections
export const getSectionsByUnitId = (unitId: string) => {
    return dummySections.filter((section) => section.unit_id === unitId)
        .sort((a, b) => a.serial_number - b.serial_number) || [];
};

export const getStandaloneSectionsByCourseId = (
    courseId: string,
    sectionType: string,
) => {
    // In a real app, this would query by course ID, but for our dummy data
    // we'll just filter by is_standalone and section_type
    return dummySections.filter((section) =>
        section.is_standalone && section.section_type === sectionType
    );
};

export const getSectionById = (id: string) => {
    return dummySections.find((section) => section.id === id);
};

// Vocabulary
export const getVocabularyBySectionId = (sectionId: string) => {
    return dummyVocabularyItems.filter((item) => item.section_id === sectionId)
        .sort((a, b) => a.serial_number - b.serial_number);
};

// Flashcard progress
export const getFlashcardProgressByProfileId = (profileId: string) => {
    return dummyFlashcardProgress.filter((progress) =>
        progress.profile_id === profileId
    );
};

export const getDueFlashcards = (profileId: string, limit = 10) => {
    const now = new Date().toISOString();
    return dummyFlashcardProgress
        .filter((progress) =>
            progress.profile_id === profileId && progress.due_date <= now
        )
        .slice(0, limit);
};

// Profile/User
export const getProfileById = (id: string) => {
    return dummyProfiles.find((profile) => profile.id === id);
};

// Languages
export const getLanguageById = (id: number) => {
    return dummyLanguages.find((language) => language.id === id);
};
