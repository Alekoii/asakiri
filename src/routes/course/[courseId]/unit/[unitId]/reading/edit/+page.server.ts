import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { Database } from '$lib/database.types';
import { v4 as uuidv4 } from 'uuid';

type Reading = Database['public']['Tables']['reading']['Row'];

export const load: PageServerLoad = async ({ params, locals }) => {
	const { user, supabase } = locals;

	if (!user) {
		throw redirect(303, `/auth/login?redirectTo=/course/${params.courseId}/edit`);
	}

	const { data, error: fetchError } = await supabase
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

	const readings = (data ?? []) satisfies Reading[];

	return { readings, courseId: params.courseId, unitId: params.unitId };
};

export const actions: Actions = {
	saveReadingSection: async ({ request, params, locals }) => {
		const { supabase, user } = locals;

		if (!user) {
			throw redirect(303, `/auth/login?redirectTo=/course/${params.courseId}/edit`);
		}

		const formData = await request.formData();
		const sentences = JSON.parse(formData.get('sentences') as string);

		for (let i = 0; i < sentences.length; i++) {
			const sentence = sentences[i];
			const { error: insertError } = await supabase
				.from('reading')
				.upsert({
					id: sentence.id || uuidv4(),
					chapter_id: params.unitId,
					text: sentence.text,
					translation: sentence.translation,
					serial_number: i + 1,
					created_at: sentence.created_at || new Date().toISOString(),
				});
			if (insertError) {
				throw error(500, `Failed to save sentence ${i + 1}: ` + insertError.message);
			}
		}

		return { success: true };
	},
	deleteReading: async ({ request, params, locals }) => {
		const { supabase, user } = locals;
		if (!user) {
			throw redirect(303, `/auth/login?redirectTo=/course/${params.courseId}/edit`);
		}
		const formData = await request.formData();
		const id = formData.get('id') as string;
		const { error: deleteError } = await supabase
			.from('reading')
			.delete()
			.eq('id', id);

		if (deleteError) {
			throw error(500, 'Failed to delete reading: ' + deleteError.message);
		}

		return { success: true };
	}
};
