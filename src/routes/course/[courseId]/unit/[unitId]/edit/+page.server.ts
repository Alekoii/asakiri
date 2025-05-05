import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { Database } from '$lib/database.types';

type Chapter = Database['public']['Tables']['chapters']['Row'];

export const load: PageServerLoad = async ({ params, locals }) => {
	const { user, supabase } = locals;

	if (!user) {
		throw redirect(303, `/auth/login?redirectTo=/course/${params.courseId}/edit`);
	}

	const { data: chapter, error: fetchError } = await supabase
		.from('chapters')
		.select(
			`
        *
      `
		)
		.eq('id', params.unitId)
		.single();
	const { count: sectionsCount, error: sectionsCountError } = await supabase
		.from('sections')
		.select('*', { count: 'exact', head: true })
		.eq('chapter_id', params.unitId);
	const { count: vocabularyCount, error: vocabularyCountError } = await supabase
		.from('flashcards')
		.select('*', { count: 'exact', head: true })
		.eq('chapter_id', params.unitId);
	const { count: readingCount, error: readingCountError } = await supabase
		.from('reading')
		.select('*', { count: 'exact', head: true })
		.eq('chapter_id', params.unitId);
	if (fetchError || sectionsCountError || vocabularyCountError|| readingCountError) {
		throw error(500, 'Failed to fetch unit: ' + fetchError.message);
	}

	if (!chapter) {
		throw error(404, 'Chapter not found');
	}
	return {
		unit: chapter as Chapter,
		sectionsCount,
		vocabularyCount,
		readingCount,
	};
};
export const actions: Actions = {
	saveUnit: async ({ request, params, locals }) => {
		const { supabase, user } = locals;

		if (!user) {
			throw redirect(303, `/auth/login?redirectTo=/course/${params.courseId}/edit`);
		}

		const formData = await request.formData();

		const updatedChapter = {
			title: formData.get('title') as string,
			description: formData.get('description') as string,
		};
		const { error: updateError } = await supabase
			.from('chapters')
			.update(updatedChapter)
			.eq('id', params.unitId);

		if (updateError) {
			console.error(updateError);
			throw error(500, 'Failed to update course');
		}

		return {
			success: true
		};
	}
};
