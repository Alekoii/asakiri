import type { PageServerLoad } from "./$types";
import type { Database } from "$types/database.types";
import { error } from '@sveltejs/kit';

type Course = Database["public"]["Tables"]["courses"]["Row"];

export const load: PageServerLoad = async ({locals}) => {
    const { supabase } = locals;
    const { data, error: courseError } = await supabase.rpc("get_course_data_with_counts");

    if (courseError) {
        console.error("Error loading courses:", courseError.message);
        return { courses: [] };
    }
    const { data: instances, error: fetchError } = await supabase
      .from("federation_instances")
      .select("*")
      .order("created_at", { ascending: false });

    if (fetchError) {
        console.error("Error fetching federation instances:", fetchError);
        throw error(500, "Failed to load federation instances");
    }
    const federationCourses = [];
    for (const instance of instances) {
        try {
            const response = await fetch(
              `${new URL(instance.url).origin}/api/federation/courses`
            );
            if (!response.ok) continue;
            const data = await response.json();
            for (const course of data.courses) {
                course.federation_instance_id = instance.id;
                course.federation_instance_name = instance.name;
                course.federation_instance_url = instance.url;
            }
            federationCourses.push(...data.courses)
        } catch (e) {
            console.error("Error fetching courses from instance:", instance.name, e);
        }
    }
    const courses = (data ?? []) satisfies Course[];
    const federationCoursesFinal = (federationCourses ?? []) satisfies Course[];
    return { courses, federatedCourses: federationCoursesFinal };
};
