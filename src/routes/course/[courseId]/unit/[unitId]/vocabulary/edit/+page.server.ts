import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { Database } from '$lib/database.types';
import { v4 as uuidv4 } from 'uuid';

type FlashCards = Database['public']['Tables']['flashcards']['Row'];

export const load: PageServerLoad = async ({ params, locals }) => {
	const { user, supabase } = locals;

	if (!user) {
		throw redirect(303, `/auth/login?redirectTo=/course/${params.courseId}/edit`);
	}

	const { data, error: fetchError } = await supabase
		.from('flashcards')
		.select(
			`
        *
      `
		)
		.eq('chapter_id', params.unitId)
		.order('serial_number', { ascending: true });
	if (fetchError) {
		throw error(500, 'Failed to fetch sections: ' + fetchError.message);
	}

	const terms = (data ?? []) satisfies FlashCards[];

	return { terms, courseId: params.courseId, unitId: params.unitId };
};

export const actions: Actions = {
	saveVocabularySection: async ({ request, params, locals }) => {
		const { supabase, user } = locals;

		if (!user) {
			throw redirect(303, `/auth/login?redirectTo=/course/${params.courseId}/edit`);
		}
		const formData = await request.formData();
		const terms = JSON.parse(formData.get('terms') as string);

		for (let i = 0; i < terms.length; i++) {
			const term: FlashCards = terms[i];
			const { error: termError } = await supabase
				.from('flashcards')
				.upsert({
					id: term.id || uuidv4(),
					chapter_id: params.unitId,
					front_content: term.front_content,
					back_content: term.back_content,
					hint: term.hint,
					difficulty_level: term.difficulty_level,
					serial_number: term.serial_number || i + 1,
					created_at: term.created_at || new Date().toISOString(),
					updated_at: new Date().toISOString()
				});
			console.log(termError);
			if (termError) {
				throw error(500, `Failed to save term ${term.front_content}: ` + termError.message);
			}
		}

		return { success: true };
	},
	deleteTerm: async ({ request, params, locals }) => {
		const { supabase, user } = locals;
		if (!user) {
			throw redirect(303, `/auth/login?redirectTo=/course/${params.courseId}/edit`);
		}
		const formData = await request.formData();
		const id = formData.get('id') as string;
		const { error: deleteError } = await supabase
			.from('flashcards')
			.delete()
			.eq('id', id);

		if (deleteError) {
			throw error(500, 'Failed to delete term: ' + deleteError.message);
		}

		return { success: true };
	}

};
