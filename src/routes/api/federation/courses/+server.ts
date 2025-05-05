import { json } from "@sveltejs/kit";

export async function GET({ locals }) {
    const { supabase } = locals;

    // Only return courses marked as federated and published
    const { data, error } = await supabase
        .from("courses")
        .select(`
            id,
            title,
            short_description,
            thumbnail,
            language_taught,
            course_language,
            profile_id,
            profiles:profiles(name, avatar_url, subtitle)
        `)
        .eq("is_published", true)
        .eq("is_federated", true);

    if (error) {
        return json({ error: error.message }, { status: 500 });
    }

    // Get language information
    const languageIds = Array.from(
        new Set(
            data.flatMap((course) =>
                [course.language_taught, course.course_language].filter(Boolean)
            ),
        ),
    );

    const { data: languages } = await supabase
        .from("languages")
        .select("id, name_en")
        .in("id", languageIds);

    const languageMap = (languages || []).reduce((map, lang) => {
        map[lang.id] = lang.name_en;
        return map;
    }, {});

    // Format the response
    const formattedCourses = data.map((course) => ({
        id: course.id,
        title: course.title,
        description: course.short_description,
        thumbnail: course.thumbnail,
        author: {
            name: course.profiles?.name || "Unknown Author",
            avatar: course.profiles?.avatar_url,
            subtitle: course.profiles?.subtitle,
        },
        languages: {
            taught: languageMap[course.language_taught] || "Unknown",
            instructedIn: languageMap[course.course_language] || "English",
        },
    }));

    return json({ courses: formattedCourses });
}
