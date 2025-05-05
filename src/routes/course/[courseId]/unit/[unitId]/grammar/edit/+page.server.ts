import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { Database } from '$lib/database.types';
import { v4 as uuidv4 } from 'uuid';

type Sections = Database['public']['Tables']['sections']['Row'];

export const load: PageServerLoad = async ({ params, locals }) => {
	const { user, supabase } = locals;

	if (!user) {
		throw redirect(303, `/auth/login?redirectTo=/course/${params.courseId}/edit`);
	}

	const { data, error: fetchError } = await supabase
		.from('sections')
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

	const sections = (data ?? []) satisfies Sections[];

	return { sections, courseId: params.courseId };
};

export const actions: Actions = {
	saveGrammarSection: async ({ request, params, locals }) => {
		const { supabase, user } = locals;

		if (!user) {
			throw redirect(303, `/auth/login?redirectTo=/course/${params.courseId}/edit`);
		}

		const formData = await request.formData();
		const section = JSON.parse(formData.get('section') as string);
		const subsections = JSON.parse(formData.get('subsections') as string);

		const { error: sectionError } = await supabase
			.from('sections')
			.upsert({
				id: section.id || uuidv4(),
				chapter_id: params.unitId,
				title: section.title,
				sub_title: null,
				content_html: section.content_html || null,
				content_json: section.content_json || null,
				serial_number: 1,
				created_at: section.created_at || new Date().toISOString(),
				updated_at: new Date().toISOString()
			});

		if (sectionError) {
			throw error(500, 'Failed to save main section: ' + sectionError.message);
		}

		for (let i = 0; i < subsections.length; i++) {
			const subsection = subsections[i];
			const { error: subsectionError } = await supabase
				.from('sections')
				.upsert({
					id: subsection.id || uuidv4(),
					chapter_id: params.unitId,
					title: subsection.title,
					sub_title: null,
					content_html: subsection.content_html || null,
					content_json: subsection.content_json,
					serial_number: i + 2,
					created_at: subsection.created_at || new Date().toISOString(),
					updated_at: new Date().toISOString()
				});

			if (subsectionError) {
				throw error(500, `Failed to save subsection ${subsection.title}: ` + subsectionError.message);
			}
		}

		return { success: true };
	},
	deleteGrammar: async ({ request, params, locals }) => {
		const { supabase, user } = locals;
		if (!user) {
			throw redirect(303, `/auth/login?redirectTo=/course/${params.courseId}/edit`);
		}
		const formData = await request.formData();
		const id = formData.get('id') as string;
		const { error: deleteError } = await supabase
			.from('sections')
			.delete()
			.eq('id', id);

		if (deleteError) {
			throw error(500, 'Failed to delete grammar: ' + deleteError.message);
		}

		return { success: true };
	}
};
