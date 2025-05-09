import { json } from '@sveltejs/kit';

export async function GET({ locals }) {
    const { supabase } = locals;

    const { data: formattedCourses, error: courseError } = await supabase.rpc("get_federated_courses");
    if (courseError) {
        console.error("Error loading courses:", courseError.message);
        return json({ courses: [] });
    }
    return json({ courses: formattedCourses });
}
