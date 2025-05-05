import { json } from "@sveltejs/kit";

export async function GET({ url, locals }) {
    const { supabase } = locals;

    const page = parseInt(url.searchParams.get("page") || "0");
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const search = url.searchParams.get("search") || "";

    const from = page * limit;
    const to = from + limit - 1;

    let query = supabase
        .from("languages")
        .select("*", { count: "exact" });

    if (search) {
        query = query.or(
            `name_en.ilike.%${search}%,code.ilike.%${search}%,name_native.ilike.%${search}%`,
        );
    }

    const { data, count, error } = await query
        .order("name_en")
        .range(from, to);

    if (error) {
        return json({ error: error.message }, { status: 500 });
    }

    return json({
        languages: data || [],
        total: count || 0,
    });
}
