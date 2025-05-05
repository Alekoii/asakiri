import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, locals }) => {
    const { courseId, unitId } = params;
    const { supabase, user } = locals;
    try {
        const { data: unitData, error: unitError } = await supabase
            .from("chapters")
            .select("*")
            .eq("id", unitId)
            .single();

        if (unitError) {
            throw error(500, "Failed to fetch unit: " + unitError.message);
        }

        if (!unitData) {
            throw error(404, "Unit not found");
        }

        // Validate the unit belongs to the correct course
        if (unitData.course_id !== courseId) {
            throw error(404, "Unit not found in this course");
        }
        const { data: sectionsData, error: sectionsError } = await supabase
          .from('sections')
          .select(
            `
            *
          `
          )
          .eq('chapter_id', params.unitId)
          .order('serial_number', { ascending: true });
        if (sectionsError) {
            throw error(
                500,
                "Failed to fetch sections: " + sectionsError.message,
            );
        }
        const { data: readingData, error: fetchError } = await supabase
          .from('reading')
          .select(
            `
        *
      `
          )
          .eq('chapter_id', params.unitId)
          .order('serial_number', { ascending: true });

        if (fetchError) {
            throw error(500, 'Failed to fetch reading: ' + fetchError.message);
        }

        const { data: vocabularyData, error: vocabularyError } = await supabase
          .from('flashcards')
          .select(
            `
        *
      `
          )
          .eq('chapter_id', params.unitId)
          .order('serial_number', { ascending: true });

        if (vocabularyError) {
            throw error(500, 'Failed to fetch vocabulary: ' + fetchError.message);
        }

        let isEnrolled = false;
        if (user) {
            const { data: enrollmentData } = await supabase
                .from("enrollments")
                .select("id")
                .eq("course_id", courseId)
                .eq("profile_id", user.id)
                .single();

            isEnrolled = !!enrollmentData;
        }

        return {
            courseId,
            unit: unitData,
            sections: sectionsData,
            reading: readingData,
            vocabulary: vocabularyData,
            isEnrolled,
        };
    } catch (err) {
        if (err.status && err.message) {
            throw error(err.status, err.message);
        }
        throw error(500, "An unexpected error occurred");
    }
};
