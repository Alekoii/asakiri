import type { PageLoad } from "./$types";
import {
    getCourseById,
    getSectionById,
    getSectionsByUnitId,
    getUnitById,
    getVocabularyBySectionId,
} from "$lib/data";
import { error } from "@sveltejs/kit";

export const load: PageLoad = async ({ params }) => {
    const { courseId, unitId, sectionType, sectionId } = params;

    try {
        // Fetch course, unit, and section details
        const course = getCourseById(courseId);
        const unit = getUnitById(unitId);
        const section = getSectionById(sectionId);

        if (!course) {
            throw error(404, "Course not found");
        }

        if (!unit) {
            throw error(404, "Unit not found");
        }

        if (!section) {
            throw error(404, "Section not found");
        }

        // Validate relationships
        if (unit.course_id !== courseId) {
            throw error(404, "Unit not found in this course");
        }

        if (section.unit_id !== unitId) {
            throw error(404, "Section not found in this unit");
        }

        if (section.section_type !== sectionType) {
            throw error(404, "Invalid section type");
        }

        // Get all sections for this unit for navigation
        const unitSections = getSectionsByUnitId(unitId) || [];

        // Get vocabulary items if this is a vocabulary section
        let vocabularyItems = [];
        if (sectionType === "vocabulary") {
            vocabularyItems = getVocabularyBySectionId(sectionId) || [];
        }

        return {
            course,
            unit,
            section,
            unitSections,
            vocabularyItems,
            isEnrolled: false,
        };
    } catch (err) {
        console.error("Error loading section data:", err);
        // Return a minimal data object to avoid undefined errors
        return {
            course: { id: courseId, title: "Course" },
            unit: { id: unitId },
            section: { id: sectionId },
            unitSections: [],
            vocabularyItems: [],
            isEnrolled: false,
        };
    }
};
