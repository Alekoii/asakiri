import { supabase } from '$lib/supabase/supabaseClient';
import type { PageServerLoad } from './$types';
import type { Database } from '$lib/database.types';

type Course = Database['public']['Tables']['courses']['Row'];

export const load: PageServerLoad = async () => {
    const { data, error } = await supabase.rpc('get_course_data_with_counts');

    if (error) {
        console.error('Error loading courses:', error.message);
        return { courses: [] };
    }

    const courses = (data ?? []) satisfies Course[];

    return { courses };
};
