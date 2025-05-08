

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "wrappers" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."calculate_quiz_score"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
declare
    v_total_points numeric;
    v_earned_points numeric;
    v_passing_score integer;
begin
    -- Calculate total and earned points
    select 
        sum(q.points) as total_points,
        sum(ua.points_earned) as earned_points
    into v_total_points, v_earned_points
    from quiz_questions q
    left join user_answers ua on ua.question_id = q.id and ua.attempt_id = new.id
    where q.quiz_id = new.quiz_id;

    -- Calculate score as percentage
    new.score := (v_earned_points / v_total_points * 100)::numeric(5,2);

    -- Get passing score and determine if passed
    select passing_score into v_passing_score
    from quizzes
    where id = new.quiz_id;

    new.passed := new.score >= v_passing_score;

    return new;
end;
$$;


ALTER FUNCTION "public"."calculate_quiz_score"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_course_completion_percentage"("p_course_id" "uuid", "p_user_id" "uuid") RETURNS integer
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  v_section_count INTEGER;
  v_section_completed INTEGER;
  v_character_count INTEGER;
  v_character_completed INTEGER;
  v_total_count INTEGER;
  v_total_completed INTEGER;
  v_percentage INTEGER;
BEGIN
  -- Count sections in the course
  SELECT COUNT(*) INTO v_section_count
  FROM sections s
  JOIN chapters c ON s.chapter_id = c.id
  WHERE c.course_id = p_course_id;
  
  -- Count completed sections
  SELECT COUNT(*) INTO v_section_completed
  FROM user_section_progress usp
  JOIN sections s ON usp.section_id = s.id
  JOIN chapters c ON s.chapter_id = c.id
  WHERE 
    c.course_id = p_course_id AND
    usp.profile_id = p_user_id AND
    usp.completion_percentage >= 80;
    
  -- Count characters in the course
  SELECT COUNT(*) INTO v_character_count
  FROM characters ch
  JOIN character_sets cs ON ch.character_set_id = cs.id
  JOIN character_categories cc ON cs.category_id = cc.id
  WHERE cc.course_id = p_course_id;
  
  -- Count mastered characters
  SELECT COUNT(*) INTO v_character_completed
  FROM user_character_progress ucp
  JOIN characters ch ON ucp.character_id = ch.id
  JOIN character_sets cs ON ch.character_set_id = cs.id
  JOIN character_categories cc ON cs.category_id = cc.id
  WHERE 
    cc.course_id = p_course_id AND
    ucp.profile_id = p_user_id AND
    ucp.proficiency_level >= 4;
    
  -- Calculate overall percentage
  v_total_count := v_section_count + v_character_count;
  v_total_completed := v_section_completed + v_character_completed;
  
  IF v_total_count = 0 THEN
    RETURN 0;
  ELSE
    v_percentage := (v_total_completed * 100) / v_total_count;
    RETURN v_percentage;
  END IF;
END;
$$;


ALTER FUNCTION "public"."get_course_completion_percentage"("p_course_id" "uuid", "p_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_course_data_with_counts"() RETURNS TABLE("id" "uuid", "title" "text", "short_description" "text", "thumbnail" "text", "language_taught" "text", "course_language" "text", "author_id" "uuid", "author_name" "text", "author_subtitle" "text", "author_avatar_url" "text", "enrolled_students" integer, "created_at" timestamp without time zone)
    LANGUAGE "plpgsql" STABLE
    AS $$
BEGIN
  RETURN QUERY 
  SELECT 
    c.id::UUID,
    c.title::TEXT,
    c.short_description::TEXT,
    c.thumbnail::TEXT,
    lt.name_en::TEXT AS language_taught,
    cl.name_en::TEXT AS course_language,
    p.id::UUID AS author_id,
    p.name::TEXT AS author_name,
    p.subtitle::TEXT AS author_subtitle,
    p.avatar_url::TEXT AS author_avatar_url,
    get_enrollment_count(c.id) AS enrolled_students,
    c.created_at::TIMESTAMP
  FROM courses c
  LEFT JOIN languages lt ON c.language_taught = lt.id
  LEFT JOIN languages cl ON c.course_language = cl.id
  LEFT JOIN profiles p ON c.profile_id = p.id
  WHERE c.is_published = TRUE;
END;
$$;


ALTER FUNCTION "public"."get_course_data_with_counts"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_due_character_reviews"("p_profile_id" "uuid", "p_limit" integer DEFAULT 20) RETURNS TABLE("character_id" "uuid", "character" "text", "meaning" "text", "pronunciation" "text", "examples" "jsonb", "difficulty_level" integer, "due_date" timestamp with time zone, "proficiency_level" integer)
    LANGUAGE "sql" SECURITY DEFINER
    AS $$
  SELECT 
    c.id AS character_id,
    c."character",
    c.meaning,
    c.pronunciation,
    c.examples,
    c.difficulty_level,
    ucp.due_date,
    ucp.proficiency_level
  FROM user_character_progress ucp
  JOIN characters c ON ucp.character_id = c.id
  WHERE 
    ucp.profile_id = p_profile_id AND
    ucp.due_date <= NOW()
  ORDER BY ucp.due_date ASC
  LIMIT p_limit;
$$;


ALTER FUNCTION "public"."get_due_character_reviews"("p_profile_id" "uuid", "p_limit" integer) OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."flashcards" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "chapter_id" "uuid",
    "front_content" "text" NOT NULL,
    "back_content" "text" NOT NULL,
    "front_content_html" "text",
    "back_content_html" "text",
    "hint" "text",
    "difficulty_level" integer DEFAULT 1,
    "serial_number" integer NOT NULL,
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "section_id" "uuid"
);


ALTER TABLE "public"."flashcards" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_due_flashcards"("p_profile_id" "uuid", "p_course_id" "uuid", "p_limit" integer DEFAULT 10) RETURNS SETOF "public"."flashcards"
    LANGUAGE "sql" SECURITY DEFINER
    AS $$
  SELECT f.*
  FROM user_flashcard_progress ufp
  JOIN flashcards f ON ufp.flashcard_id = f.id
  LEFT JOIN sections s ON f.section_id = s.id
  LEFT JOIN chapters c ON s.chapter_id = c.id
  LEFT JOIN characters ch ON f.character_id = ch.id
  LEFT JOIN character_sets cs ON ch.character_set_id = cs.id
  LEFT JOIN character_categories cc ON cs.category_id = cc.id
  WHERE 
    ufp.profile_id = p_profile_id AND
    ufp.due_date <= NOW() AND
    (
      (c.course_id = p_course_id) OR
      (cc.course_id = p_course_id)
    )
  ORDER BY ufp.due_date ASC
  LIMIT p_limit;
$$;


ALTER FUNCTION "public"."get_due_flashcards"("p_profile_id" "uuid", "p_course_id" "uuid", "p_limit" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_enrollment_count"("course_uuid" "uuid") RETURNS integer
    LANGUAGE "sql" STABLE SECURITY DEFINER
    AS $$
  SELECT COUNT(*) FROM enrollments WHERE course_id = course_uuid;
$$;


ALTER FUNCTION "public"."get_enrollment_count"("course_uuid" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_full_course"("p_course_id" "uuid") RETURNS "json"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
  return (
    select json_build_object(
      'id', c.id,
      'title', c.title,
      'short_description', c.short_description,
      'description', c.description,
      'thumbnail_url', c.thumbnail_url,
      'course_language', c.course_language,
      'language_taught', c.language_taught,
      'is_published', c.is_published,
      'author', json_build_object(
        'id', p.id,
        'name', p.name,
        'subtitle', p.subtitle,
        'avatar_url', p.avatar_url
      ),
      'chapters', (
        select json_agg(
          json_build_object(
            'id', ch.id,
            'title', ch.title,
            'subtitle', ch.subtitle,
            'serial_number', ch.serial_number,
            'sections', (
              select json_agg(
                json_build_object(
                  'id', s.id,
                  'title', s.title,
                  'subtitle', s.subtitle,
                  'content_html', s.content_html,
                  'content_json', s.content_json,
                  'serial_number', s.serial_number
                ) order by s.serial_number
              )
              from public.sections s
              where s.chapter_id = ch.id
            )
          ) order by ch.serial_number
        )
        from public.chapters ch
        where ch.course_id = c.id
      )
    )
    from public.courses c
    join public.profiles p on c.author_id = p.id
    where c.id = p_course_id
  );
end;
$$;


ALTER FUNCTION "public"."get_full_course"("p_course_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_home_page_courses"() RETURNS TABLE("id" "uuid", "title" "text", "short_description" "text", "thumbnail" "text", "language_taught" "text", "course_language" "text", "author_id" "uuid", "author_name" "text", "author_subtitle" "text", "author_avatar_url" "text", "enrolled_students" integer, "created_at" timestamp without time zone, "category" "text")
    LANGUAGE "plpgsql" STABLE
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.title,
    c.short_description,
    c.thumbnail,
    c.language_taught,
    c.course_language,
    c.author_id,
    c.author_name,
    c.author_subtitle,
    c.author_avatar_url,
    c.enrolled_students,
    c.created_at,
    'popular' AS category
  FROM get_course_data_with_counts() c
  ORDER BY c.enrolled_students DESC
  LIMIT 8;

  RETURN QUERY
  SELECT 
    c.id,
    c.title,
    c.short_description,
    c.thumbnail,
    c.language_taught,
    c.course_language,
    c.author_id,
    c.author_name,
    c.author_subtitle,
    c.author_avatar_url,
    c.enrolled_students,  -- Fix: Use existing enrolled_students count
    c.created_at,
    'trending' AS category
  FROM get_course_data_with_counts() c
  WHERE c.created_at >= NOW() - INTERVAL '7 days'
  ORDER BY c.enrolled_students DESC
  LIMIT 8;

  RETURN QUERY
  SELECT 
    c.id,
    c.title,
    c.short_description,
    c.thumbnail,
    c.language_taught,
    c.course_language,
    c.author_id,
    c.author_name,
    c.author_subtitle,
    c.author_avatar_url,
    c.enrolled_students,
    c.created_at,
    'recent' AS category
  FROM get_course_data_with_counts() c
  ORDER BY c.created_at DESC
  LIMIT 8;
END;
$$;


ALTER FUNCTION "public"."get_home_page_courses"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_my_learning_courses"("input_profile_id" "uuid") RETURNS TABLE("id" "uuid", "title" "text", "short_description" "text", "thumbnail" "text", "language_taught" "text", "course_language" "text", "author_id" "uuid", "author_name" "text", "author_subtitle" "text", "author_avatar_url" "text", "enrolled_students" integer, "enrolled_at" timestamp without time zone)
    LANGUAGE "plpgsql" STABLE
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.title::TEXT,
    c.short_description::TEXT,
    c.thumbnail::TEXT,
    lt.name_en::TEXT AS language_taught,
    cl.name_en::TEXT AS course_language,
    p.id AS author_id,
    p.name::TEXT AS author_name,
    p.subtitle::TEXT AS author_subtitle,
    p.avatar_url::TEXT AS author_avatar_url,
    get_enrollment_count(c.id) AS enrolled_students,
    e.created_at AS enrolled_at
  FROM enrollments e
  INNER JOIN courses c ON e.course_id = c.id
  LEFT JOIN languages lt ON c.language_taught = lt.id
  LEFT JOIN languages cl ON c.course_language = cl.id
  LEFT JOIN profiles p ON c.profile_id = p.id
  WHERE e.profile_id = input_profile_id
  ORDER BY e.created_at DESC;
END;
$$;


ALTER FUNCTION "public"."get_my_learning_courses"("input_profile_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_next_flashcard_serial"("chapter_id" "uuid") RETURNS integer
    LANGUAGE "plpgsql"
    AS $_$
DECLARE
  next_serial INTEGER;
BEGIN
  SELECT COALESCE(MAX(serial_number) + 1, 1)
  INTO next_serial
  FROM flashcards
  WHERE flashcards.chapter_id = $1;
  
  RETURN next_serial;
END;
$_$;


ALTER FUNCTION "public"."get_next_flashcard_serial"("chapter_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_sorted_courses"() RETURNS TABLE("id" "uuid", "title" "text", "short_description" "text", "thumbnail" "text", "language_taught" "text", "course_language" "text", "author_id" "uuid", "author_name" "text", "author_subtitle" "text", "author_avatar_url" "text", "enrolled_students" integer, "created_at" timestamp without time zone, "category" "text")
    LANGUAGE "plpgsql" STABLE
    AS $$
BEGIN
  -- ✅ Popular Courses (sorted by total enrollments)
  RETURN QUERY
  SELECT *, 'popular' AS category
  FROM get_course_data_with_counts()
  ORDER BY enrolled_students DESC
  LIMIT 8;

  -- ✅ Trending Courses (sorted by enrollments in last 7 days)
  RETURN QUERY
  SELECT *, 'trending' AS category
  FROM get_course_data_with_counts()
  WHERE created_at >= NOW() - INTERVAL '7 days'
  ORDER BY enrolled_students DESC
  LIMIT 8;

  -- ✅ Recent Courses (sorted by created_at)
  RETURN QUERY
  SELECT *, 'recent' AS category
  FROM get_course_data_with_counts()
  ORDER BY created_at DESC
  LIMIT 8;
END;
$$;


ALTER FUNCTION "public"."get_sorted_courses"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_teach_courses"("input_profile_id" "uuid") RETURNS TABLE("id" "uuid", "title" "text", "short_description" "text", "thumbnail" "text", "language_taught" "text", "course_language" "text", "author_id" "uuid", "author_name" "text", "author_subtitle" "text", "author_avatar_url" "text", "enrolled_students" integer, "is_published" boolean, "created_at" timestamp without time zone, "category" "text")
    LANGUAGE "plpgsql" STABLE
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.title::TEXT,
    c.short_description::TEXT,
    c.thumbnail::TEXT,
    lt.name_en::TEXT AS language_taught,
    cl.name_en::TEXT AS course_language,
    p.id AS author_id,
    p.name::TEXT AS author_name,
    p.subtitle::TEXT AS author_subtitle,
    p.avatar_url::TEXT AS author_avatar_url,
    get_enrollment_count(c.id) AS enrolled_students,
    c.is_published,
    c.created_at,
    'published' AS category
  FROM courses c
  LEFT JOIN languages lt ON c.language_taught = lt.id
  LEFT JOIN languages cl ON c.course_language = cl.id
  LEFT JOIN profiles p ON c.profile_id = p.id
  WHERE c.profile_id = input_profile_id AND c.is_published = TRUE
  ORDER BY c.created_at DESC;

  RETURN QUERY
  SELECT 
    c.id,
    c.title::TEXT,
    c.short_description::TEXT,
    c.thumbnail::TEXT,
    lt.name_en::TEXT AS language_taught,
    cl.name_en::TEXT AS course_language,
    p.id AS author_id,
    p.name::TEXT AS author_name,
    p.subtitle::TEXT AS author_subtitle,
    p.avatar_url::TEXT AS author_avatar_url,
    get_enrollment_count(c.id) AS enrolled_students,
    c.is_published,
    c.created_at,
    'draft' AS category
  FROM courses c
  LEFT JOIN languages lt ON c.language_taught = lt.id
  LEFT JOIN languages cl ON c.course_language = cl.id
  LEFT JOIN profiles p ON c.profile_id = p.id
  WHERE c.profile_id = input_profile_id AND c.is_published = FALSE
  ORDER BY c.created_at DESC;
END;
$$;


ALTER FUNCTION "public"."get_teach_courses"("input_profile_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), -- Extract name from metadata or use email as fallback
    NEW.email
  );
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."import_language"("p_code" "text", "p_name_en" "text", "p_name_native" "text" DEFAULT NULL::"text") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
begin
    insert into public.languages (code, name_en, name_native)
    values (lower(trim(p_code)), trim(p_name_en), trim(p_name_native))
    on conflict (code) do update set
        name_en = trim(excluded.name_en),
        name_native = trim(excluded.name_native),
        updated_at = now();
end;
$$;


ALTER FUNCTION "public"."import_language"("p_code" "text", "p_name_en" "text", "p_name_native" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."reorder_chapter_vocabulary"("p_chapter_id" "uuid", "p_vocabulary_orders" "jsonb") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
declare
    v_record record;
begin
    for v_record in 
        select * from jsonb_each(p_vocabulary_orders)
    loop
        update chapter_vocabulary
        set serial_number = (v_record.value)::integer
        where id = (v_record.key)::uuid
        and chapter_id = p_chapter_id;
    end loop;
end;
$$;


ALTER FUNCTION "public"."reorder_chapter_vocabulary"("p_chapter_id" "uuid", "p_vocabulary_orders" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."reorder_chapters"("course_id" "uuid", "chapter_ids" "uuid"[]) RETURNS "void"
    LANGUAGE "plpgsql"
    AS $_$
DECLARE
  chapter_id uuid;
  i integer;
BEGIN
  i := 1;
  FOREACH chapter_id IN ARRAY chapter_ids
  LOOP
    UPDATE chapters
    SET serial_number = i
    WHERE id = chapter_id AND course_id = $1;
    i := i + 1;
  END LOOP;
END;
$_$;


ALTER FUNCTION "public"."reorder_chapters"("course_id" "uuid", "chapter_ids" "uuid"[]) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."reorder_flashcards"("chapter_id" "uuid", "flashcard_ids" "uuid"[]) RETURNS "void"
    LANGUAGE "plpgsql"
    AS $_$
DECLARE
  i INTEGER;
  fid UUID;
BEGIN
  FOR i IN 1..array_length(flashcard_ids, 1) LOOP
    fid := flashcard_ids[i];
    UPDATE flashcards
    SET serial_number = i
    WHERE id = fid AND chapter_id = $1;
  END LOOP;
END;
$_$;


ALTER FUNCTION "public"."reorder_flashcards"("chapter_id" "uuid", "flashcard_ids" "uuid"[]) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."reorder_sections"("chapter_id" "uuid", "section_ids" "uuid"[]) RETURNS "void"
    LANGUAGE "plpgsql"
    AS $_$
DECLARE
  section_id uuid;
  i integer;
BEGIN
  i := 1;
  FOREACH section_id IN ARRAY section_ids
  LOOP
    UPDATE sections
    SET serial_number = i
    WHERE id = section_id AND chapter_id = $1;
    i := i + 1;
  END LOOP;
END;
$_$;


ALTER FUNCTION "public"."reorder_sections"("chapter_id" "uuid", "section_ids" "uuid"[]) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_chapter_serial"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF NEW.serial_number IS NULL THEN
    NEW.serial_number := get_next_chapter_serial(NEW.course_id);
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."set_chapter_serial"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_chapter_serial_number"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF NEW.serial_number IS NULL THEN
    NEW.serial_number := (
      SELECT COALESCE(MAX(serial_number), 0) + 1
      FROM public.chapters
      WHERE course_id = NEW.course_id
    );
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."set_chapter_serial_number"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_section_serial"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF NEW.serial_number IS NULL THEN
    NEW.serial_number := get_next_section_serial(NEW.chapter_id);
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."set_section_serial"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_section_serial_number"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF NEW.serial_number IS NULL THEN
    NEW.serial_number := (
      SELECT COALESCE(MAX(serial_number), 0) + 1
      FROM public.sections
      WHERE chapter_id = NEW.chapter_id
    );
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."set_section_serial_number"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_vocabulary_serial_number"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
    if new.serial_number is null then
        select coalesce(max(serial_number), 0) + 1
        into new.serial_number
        from chapter_vocabulary
        where chapter_id = new.chapter_id;
    end if;
    return new;
end;
$$;


ALTER FUNCTION "public"."set_vocabulary_serial_number"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sync_profile_email"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  -- For new users
  IF TG_OP = 'INSERT' THEN
    -- Create a profile with basic info
    INSERT INTO public.profiles (
      id, 
      name,
      email
    ) VALUES (
      NEW.id,
      NEW.email, -- Just use email as the name initially
      NEW.email
    );
  -- For updated users
  ELSIF TG_OP = 'UPDATE' THEN
    -- Update just the email
    UPDATE public.profiles 
    SET 
      email = NEW.email,
      updated_at = NOW()
    WHERE id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."sync_profile_email"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_chapter_completion_stats"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
    -- Update the chapter's completion statistics
    update chapters
    set 
        completion_count = (
            select count(*)
            from chapter_completions
            where chapter_id = new.chapter_id
            and is_completed = true
        ),
        average_time_spent = (
            select avg(time_spent_seconds)::numeric(10,2)
            from chapter_completions
            where chapter_id = new.chapter_id
            and is_completed = true
            and time_spent_seconds is not null
        )
    where id = new.chapter_id;
    
    return new;
end;
$$;


ALTER FUNCTION "public"."update_chapter_completion_stats"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_character_progress"("p_profile_id" "uuid", "p_character_id" "uuid", "p_performance_rating" integer) RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  -- Get or create progress record
  DECLARE
    v_progress user_character_progress;
    v_ease_factor FLOAT;
    v_interval INTEGER;
  BEGIN
    SELECT * INTO v_progress FROM user_character_progress
    WHERE profile_id = p_profile_id AND character_id = p_character_id;
    
    IF NOT FOUND THEN
      INSERT INTO user_character_progress (
        profile_id, character_id, proficiency_level, 
        times_reviewed, times_correct, times_incorrect
      )
      VALUES (
        p_profile_id, p_character_id, 0, 0, 0, 0
      )
      RETURNING * INTO v_progress;
    END IF;
    
    -- Update counters
    UPDATE user_character_progress SET
      times_reviewed = times_reviewed + 1,
      times_correct = CASE WHEN p_performance_rating >= 3 THEN times_correct + 1 ELSE times_correct END,
      times_incorrect = CASE WHEN p_performance_rating < 3 THEN times_incorrect + 1 ELSE times_incorrect END,
      proficiency_level = LEAST(5, CASE 
        WHEN p_performance_rating >= 4 THEN proficiency_level + 1
        WHEN p_performance_rating <= 2 THEN GREATEST(0, proficiency_level - 1)
        ELSE proficiency_level
      END),
      last_reviewed = NOW()
    WHERE id = v_progress.id;
    
    -- Calculate new interval using SM-2 spaced repetition algorithm
    v_ease_factor := GREATEST(1.3, 2.5 + (0.1 - (5 - p_performance_rating) * 0.08 - (5 - p_performance_rating) * 0.02));
    
    IF p_performance_rating < 3 THEN
      -- If rating is less than 3, reset interval to 1 day
      v_interval := 1;
    ELSE
      -- Calculate new interval
      IF v_progress.times_reviewed <= 1 THEN
        v_interval := 1;
      ELSIF v_progress.times_reviewed = 2 THEN
        v_interval := 6;
      ELSE
        v_interval := GREATEST(1, ROUND(v_progress.interval * v_ease_factor));
      END IF;
    END IF;
    
    -- Update interval and due date
    UPDATE user_character_progress SET
      interval = v_interval,
      due_date = NOW() + (v_interval * INTERVAL '1 day'),
      updated_at = NOW()
    WHERE id = v_progress.id;
  END;
END;
$$;


ALTER FUNCTION "public"."update_character_progress"("p_profile_id" "uuid", "p_character_id" "uuid", "p_performance_rating" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_course_enrollment_count"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
    -- Update the course's enrollment count
    update courses
    set total_enrollments = (
        select count(*)
        from course_enrollments
        where course_id = new.course_id
    )
    where id = new.course_id;
    
    return new;
end;
$$;


ALTER FUNCTION "public"."update_course_enrollment_count"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_course_rating_stats"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
    -- Update the course's rating statistics
    update courses
    set 
        average_rating = (
            select round(avg(rating)::numeric, 2)
            from course_ratings
            where course_id = new.course_id
        ),
        total_ratings = (
            select count(*)
            from course_ratings
            where course_id = new.course_id
        )
    where id = new.course_id;
    
    return new;
end;
$$;


ALTER FUNCTION "public"."update_course_rating_stats"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
    new.updated_at = now();
    return new;
end;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."validate_chapter_completion"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
declare
    v_course_id uuid;
    v_is_enrolled boolean;
begin
    -- Get the course ID for this chapter
    select course_id into v_course_id
    from chapters
    where id = new.chapter_id;

    -- Check if the user is enrolled in the course
    select exists(
        select 1
        from course_enrollments
        where course_id = v_course_id
        and user_id = new.user_id
    ) into v_is_enrolled;

    if not v_is_enrolled then
        raise exception 'User must be enrolled in the course to mark chapters as complete';
    end if;

    return new;
end;
$$;


ALTER FUNCTION "public"."validate_chapter_completion"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."validate_quiz_attempt"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
declare
    v_max_attempts integer;
    v_attempt_count integer;
begin
    -- Get max attempts for this quiz
    select max_attempts into v_max_attempts
    from quizzes
    where id = new.quiz_id;

    -- If max_attempts is set, check the count
    if v_max_attempts is not null then
        select count(*) into v_attempt_count
        from quiz_attempts
        where quiz_id = new.quiz_id
        and user_id = new.user_id;

        if v_attempt_count >= v_max_attempts then
            raise exception 'Maximum number of attempts reached for this quiz';
        end if;
    end if;

    return new;
end;
$$;


ALTER FUNCTION "public"."validate_quiz_attempt"() OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."chapters" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" character varying(150) NOT NULL,
    "course_id" "uuid" NOT NULL,
    "sub_title" character varying(100),
    "description" character varying(300),
    "serial_number" integer NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."chapters" OWNER TO "postgres";


ALTER TABLE "public"."chapters" ALTER COLUMN "serial_number" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."chapters_serial_number_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."courses" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" character varying(150) NOT NULL,
    "short_description" character varying(500),
    "description" character varying(10000),
    "thumbnail" "text",
    "is_published" boolean,
    "published_at" timestamp without time zone,
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "profile_id" "uuid" NOT NULL,
    "course_language" integer,
    "language_taught" integer,
    "description_html" "text",
    "support_link" "text",
    "description_json" "text",
    "course_language_dialect" bigint,
    "language_taught_dialect" bigint,
    "is_federated" boolean DEFAULT false,
    CONSTRAINT "courses_description_html_check" CHECK (("length"("description_html") <= 10000))
);


ALTER TABLE "public"."courses" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."dialects" (
    "id" bigint NOT NULL,
    "language_id" bigint NOT NULL,
    "name_en" "text" NOT NULL,
    "name_native" "text",
    "description" "text",
    "region" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."dialects" OWNER TO "postgres";


ALTER TABLE "public"."dialects" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."dialects_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."enrollments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "profile_id" "uuid" NOT NULL,
    "course_id" "uuid" NOT NULL,
    "created_at" timestamp without time zone NOT NULL,
    "updated_at" timestamp without time zone NOT NULL
);


ALTER TABLE "public"."enrollments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."federation_instances" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "url" "text" NOT NULL,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp without time zone DEFAULT "now"(),
    "updated_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."federation_instances" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."languages" (
    "id" bigint NOT NULL,
    "code" "text" NOT NULL,
    "name_en" "text" NOT NULL,
    "name_native" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name_jpn" "text"
);


ALTER TABLE "public"."languages" OWNER TO "postgres";


ALTER TABLE "public"."languages" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."languages_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "name" character varying(50) NOT NULL,
    "bio" character varying(500),
    "subtitle" character varying(45),
    "avatar_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "email" "text",
    "is_admin" boolean DEFAULT false
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."reading" (
    "id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "text" "text" DEFAULT ''::"text" NOT NULL,
    "translation" "text" DEFAULT ''::"text" NOT NULL,
    "serial_number" integer NOT NULL,
    "chapter_id" "uuid" NOT NULL
);


ALTER TABLE "public"."reading" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."sections" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" character varying(150) NOT NULL,
    "chapter_id" "uuid" NOT NULL,
    "content_html" "text",
    "content_json" "json",
    "serial_number" integer NOT NULL,
    "created_at" timestamp without time zone NOT NULL,
    "updated_at" timestamp without time zone NOT NULL,
    "sub_title" character varying(300)
);


ALTER TABLE "public"."sections" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_flashcard_progress" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "profile_id" "uuid",
    "flashcard_id" "uuid",
    "ease_factor" double precision DEFAULT 2.5,
    "interval" integer DEFAULT 1,
    "due_date" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "review_count" integer DEFAULT 0,
    "correct_count" integer DEFAULT 0,
    "incorrect_count" integer DEFAULT 0,
    "last_reviewed" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."user_flashcard_progress" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_section_progress" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "profile_id" "uuid" NOT NULL,
    "section_id" "uuid" NOT NULL,
    "completion_percentage" integer DEFAULT 0,
    "last_viewed" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."user_section_progress" OWNER TO "postgres";


ALTER TABLE ONLY "public"."chapters"
    ADD CONSTRAINT "chapters_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."courses"
    ADD CONSTRAINT "courses_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."dialects"
    ADD CONSTRAINT "dialects_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."enrollments"
    ADD CONSTRAINT "enrollments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."federation_instances"
    ADD CONSTRAINT "federation_instances_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."flashcards"
    ADD CONSTRAINT "flashcards_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."languages"
    ADD CONSTRAINT "languages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."reading"
    ADD CONSTRAINT "reading_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."sections"
    ADD CONSTRAINT "sections_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_flashcard_progress"
    ADD CONSTRAINT "user_flashcard_progress_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_flashcard_progress"
    ADD CONSTRAINT "user_flashcard_progress_profile_id_flashcard_id_key" UNIQUE ("profile_id", "flashcard_id");



ALTER TABLE ONLY "public"."user_section_progress"
    ADD CONSTRAINT "user_section_progress_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_section_progress"
    ADD CONSTRAINT "user_section_progress_profile_id_section_id_key" UNIQUE ("profile_id", "section_id");



CREATE INDEX "idx_courses_course_language_dialect" ON "public"."courses" USING "btree" ("course_language_dialect");



CREATE INDEX "idx_courses_language_taught_dialect" ON "public"."courses" USING "btree" ("language_taught_dialect");



CREATE INDEX "idx_dialects_language_id" ON "public"."dialects" USING "btree" ("language_id");



CREATE INDEX "idx_flashcards_section_id" ON "public"."flashcards" USING "btree" ("section_id");



CREATE INDEX "idx_languages_code" ON "public"."languages" USING "btree" ("code");



CREATE INDEX "idx_user_section_progress_profile_id" ON "public"."user_section_progress" USING "btree" ("profile_id");



CREATE INDEX "idx_user_section_progress_section_id" ON "public"."user_section_progress" USING "btree" ("section_id");



CREATE OR REPLACE TRIGGER "set_chapter_serial_trigger" BEFORE INSERT ON "public"."chapters" FOR EACH ROW EXECUTE FUNCTION "public"."set_chapter_serial"();



CREATE OR REPLACE TRIGGER "set_section_serial_trigger" BEFORE INSERT ON "public"."sections" FOR EACH ROW EXECUTE FUNCTION "public"."set_section_serial"();



CREATE OR REPLACE TRIGGER "sync_profile_email_trigger" BEFORE INSERT OR UPDATE ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."sync_profile_email"();

ALTER TABLE "public"."profiles" DISABLE TRIGGER "sync_profile_email_trigger";



CREATE OR REPLACE TRIGGER "update_dialects_updated_at" BEFORE UPDATE ON "public"."dialects" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_languages_updated_at" BEFORE UPDATE ON "public"."languages" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."chapters"
    ADD CONSTRAINT "chapters_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."courses"
    ADD CONSTRAINT "courses_course_language_dialect_fkey" FOREIGN KEY ("course_language_dialect") REFERENCES "public"."dialects"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."courses"
    ADD CONSTRAINT "courses_course_language_fkey" FOREIGN KEY ("course_language") REFERENCES "public"."languages"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."courses"
    ADD CONSTRAINT "courses_language_taught_dialect_fkey" FOREIGN KEY ("language_taught_dialect") REFERENCES "public"."dialects"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."courses"
    ADD CONSTRAINT "courses_language_taught_fkey" FOREIGN KEY ("language_taught") REFERENCES "public"."languages"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."courses"
    ADD CONSTRAINT "courses_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."dialects"
    ADD CONSTRAINT "dialects_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "public"."languages"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."enrollments"
    ADD CONSTRAINT "enrollments_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."enrollments"
    ADD CONSTRAINT "enrollments_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."flashcards"
    ADD CONSTRAINT "flashcards_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapters"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."flashcards"
    ADD CONSTRAINT "flashcards_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "public"."sections"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."reading"
    ADD CONSTRAINT "reading_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapters"("id");



ALTER TABLE ONLY "public"."sections"
    ADD CONSTRAINT "sections_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapters"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_flashcard_progress"
    ADD CONSTRAINT "user_flashcard_progress_flashcard_id_fkey" FOREIGN KEY ("flashcard_id") REFERENCES "public"."flashcards"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_flashcard_progress"
    ADD CONSTRAINT "user_flashcard_progress_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_section_progress"
    ADD CONSTRAINT "user_section_progress_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_section_progress"
    ADD CONSTRAINT "user_section_progress_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "public"."sections"("id") ON DELETE CASCADE;



CREATE POLICY "Admins can create dialects" ON "public"."dialects" FOR INSERT WITH CHECK ((("auth"."role"() = 'authenticated'::"text") AND (EXISTS ( SELECT 1
   FROM "auth"."users"
  WHERE (("auth"."uid"() = "users"."id") AND (("users"."role")::"text" = 'admin'::"text"))))));



CREATE POLICY "Admins can delete dialects" ON "public"."dialects" FOR DELETE USING ((("auth"."role"() = 'authenticated'::"text") AND (EXISTS ( SELECT 1
   FROM "auth"."users"
  WHERE (("auth"."uid"() = "users"."id") AND (("users"."role")::"text" = 'admin'::"text"))))));



CREATE POLICY "Admins can update dialects" ON "public"."dialects" FOR UPDATE USING ((("auth"."role"() = 'authenticated'::"text") AND (EXISTS ( SELECT 1
   FROM "auth"."users"
  WHERE (("auth"."uid"() = "users"."id") AND (("users"."role")::"text" = 'admin'::"text")))))) WITH CHECK ((("auth"."role"() = 'authenticated'::"text") AND (EXISTS ( SELECT 1
   FROM "auth"."users"
  WHERE (("auth"."uid"() = "users"."id") AND (("users"."role")::"text" = 'admin'::"text"))))));



CREATE POLICY "Allow insert for authenticated users" ON "public"."profiles" FOR INSERT WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "Allow insert for authenticated users" ON "public"."reading" FOR INSERT WITH CHECK (("auth"."uid"() IS NOT NULL));



CREATE POLICY "Allow select for authenticated users" ON "public"."reading" FOR SELECT USING (("auth"."uid"() IS NOT NULL));



CREATE POLICY "Anyone can read dialects" ON "public"."dialects" FOR SELECT USING (true);



CREATE POLICY "Chapters of published courses are viewable by everyone" ON "public"."chapters" FOR SELECT TO "authenticated", "anon" USING ((EXISTS ( SELECT 1
   FROM "public"."courses"
  WHERE (("courses"."id" = "chapters"."course_id") AND ("courses"."is_published" = true)))));



CREATE POLICY "Course creators can view enrollments in their courses" ON "public"."enrollments" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."courses"
  WHERE (("courses"."id" = "enrollments"."course_id") AND ("courses"."profile_id" = "auth"."uid"())))));



CREATE POLICY "Course owners can manage flashcards" ON "public"."flashcards" USING ((EXISTS ( SELECT 1
   FROM ("public"."chapters"
     JOIN "public"."courses" ON (("chapters"."course_id" = "courses"."id")))
  WHERE (("chapters"."id" = "flashcards"."chapter_id") AND ("courses"."profile_id" = "auth"."uid"())))));



CREATE POLICY "Course owners can manage reading content" ON "public"."reading" USING ((EXISTS ( SELECT 1
   FROM ("public"."chapters"
     JOIN "public"."courses" ON (("chapters"."course_id" = "courses"."id")))
  WHERE (("chapters"."id" = "reading"."chapter_id") AND ("courses"."profile_id" = "auth"."uid"())))));



CREATE POLICY "Enrolled user can view sections" ON "public"."sections" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM (("public"."chapters"
     JOIN "public"."courses" ON (("courses"."id" = "chapters"."course_id")))
     LEFT JOIN "public"."enrollments" ON (("courses"."id" = "enrollments"."course_id")))
  WHERE (("chapters"."id" = "sections"."chapter_id") AND (("courses"."profile_id" = "auth"."uid"()) OR ("enrollments"."profile_id" = "auth"."uid"()))))));



CREATE POLICY "Enrolled users can view flashcards" ON "public"."flashcards" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM (("public"."chapters"
     JOIN "public"."courses" ON (("chapters"."course_id" = "courses"."id")))
     JOIN "public"."enrollments" ON (("courses"."id" = "enrollments"."course_id")))
  WHERE (("chapters"."id" = "flashcards"."chapter_id") AND ("enrollments"."profile_id" = "auth"."uid"())))));



CREATE POLICY "Enrolled users can view reading content" ON "public"."reading" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM (("public"."chapters"
     JOIN "public"."courses" ON (("chapters"."course_id" = "courses"."id")))
     JOIN "public"."enrollments" ON (("courses"."id" = "enrollments"."course_id")))
  WHERE (("chapters"."id" = "reading"."chapter_id") AND ("enrollments"."profile_id" = "auth"."uid"())))));



CREATE POLICY "Languages are viewable by everyone" ON "public"."languages" FOR SELECT USING (true);



CREATE POLICY "Only admins can manage federation instances" ON "public"."federation_instances" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."is_admin" = true)))));



CREATE POLICY "Only admins can modify languages" ON "public"."languages" TO "authenticated" USING ((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text")) WITH CHECK ((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text"));



CREATE POLICY "Prevent users from updating enrollments" ON "public"."enrollments" FOR UPDATE USING (false);



CREATE POLICY "Profiles are viewable by everyone" ON "public"."profiles" FOR SELECT TO "authenticated", "anon" USING (true);



CREATE POLICY "Published courses are viewable by everyone" ON "public"."courses" FOR SELECT TO "authenticated", "anon" USING (("is_published" = true));



CREATE POLICY "Service role has full access" ON "public"."enrollments" USING (("auth"."role"() = 'service_role'::"text"));



CREATE POLICY "Users can create chapters in own courses" ON "public"."chapters" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."courses"
  WHERE (("courses"."id" = "chapters"."course_id") AND ("courses"."profile_id" = "auth"."uid"())))));



CREATE POLICY "Users can create courses" ON "public"."courses" FOR INSERT TO "authenticated" WITH CHECK (("profile_id" = "auth"."uid"()));



CREATE POLICY "Users can delete chapters in own courses" ON "public"."chapters" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."courses"
  WHERE (("courses"."id" = "chapters"."course_id") AND ("courses"."profile_id" = "auth"."uid"())))));



CREATE POLICY "Users can delete own courses" ON "public"."courses" FOR DELETE TO "authenticated" USING (("profile_id" = "auth"."uid"()));



CREATE POLICY "Users can delete sections in own courses" ON "public"."sections" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM ("public"."chapters"
     JOIN "public"."courses" ON (("courses"."id" = "chapters"."course_id")))
  WHERE (("chapters"."id" = "sections"."chapter_id") AND ("courses"."profile_id" = "auth"."uid"())))));



CREATE POLICY "Users can delete their own section progress" ON "public"."user_section_progress" FOR DELETE USING (("profile_id" = "auth"."uid"()));



CREATE POLICY "Users can enroll themselves" ON "public"."enrollments" FOR INSERT WITH CHECK (("auth"."uid"() = "profile_id"));



CREATE POLICY "Users can insert sections into their own courses" ON "public"."sections" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM ("public"."chapters"
     JOIN "public"."courses" ON (("courses"."id" = "chapters"."course_id")))
  WHERE (("chapters"."id" = "sections"."chapter_id") AND ("courses"."profile_id" = "auth"."uid"())))));



CREATE POLICY "Users can insert their own section progress" ON "public"."user_section_progress" FOR INSERT WITH CHECK (("profile_id" = "auth"."uid"()));



CREATE POLICY "Users can unenroll themselves" ON "public"."enrollments" FOR DELETE USING (("auth"."uid"() = "profile_id"));



CREATE POLICY "Users can update chapters in own courses" ON "public"."chapters" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."courses"
  WHERE (("courses"."id" = "chapters"."course_id") AND ("courses"."profile_id" = "auth"."uid"())))));



CREATE POLICY "Users can update own courses" ON "public"."courses" FOR UPDATE TO "authenticated" USING (("profile_id" = "auth"."uid"())) WITH CHECK (("profile_id" = "auth"."uid"()));



CREATE POLICY "Users can update own profile" ON "public"."profiles" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "id")) WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "Users can update their own course sections" ON "public"."sections" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM ("public"."chapters"
     JOIN "public"."courses" ON (("courses"."id" = "chapters"."course_id")))
  WHERE (("chapters"."id" = "sections"."chapter_id") AND ("courses"."profile_id" = "auth"."uid"())))));



CREATE POLICY "Users can update their own section progress" ON "public"."user_section_progress" FOR UPDATE USING (("profile_id" = "auth"."uid"()));



CREATE POLICY "Users can view chapters of own courses" ON "public"."chapters" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."courses"
  WHERE (("courses"."id" = "chapters"."course_id") AND ("courses"."profile_id" = "auth"."uid"())))));



CREATE POLICY "Users can view own courses" ON "public"."courses" FOR SELECT TO "authenticated" USING (("profile_id" = "auth"."uid"()));



CREATE POLICY "Users can view their own enrollments" ON "public"."enrollments" FOR SELECT USING (("auth"."uid"() = "profile_id"));



CREATE POLICY "Users can view their own section progress" ON "public"."user_section_progress" FOR SELECT USING (("profile_id" = "auth"."uid"()));



ALTER TABLE "public"."chapters" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "chapters_delete_policy" ON "public"."chapters" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM "public"."courses" "c"
  WHERE (("c"."id" = "chapters"."course_id") AND ("c"."profile_id" = "auth"."uid"())))));



CREATE POLICY "chapters_insert_policy" ON "public"."chapters" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."courses"
  WHERE (("courses"."id" = "chapters"."course_id") AND ("courses"."profile_id" = "auth"."uid"())))));



CREATE POLICY "chapters_select_policy" ON "public"."chapters" FOR SELECT USING (true);



CREATE POLICY "chapters_update_policy" ON "public"."chapters" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."courses" "c"
  WHERE (("c"."id" = "chapters"."course_id") AND ("c"."profile_id" = "auth"."uid"())))));



ALTER TABLE "public"."courses" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "creators_can_manage_own_flashcards" ON "public"."flashcards" USING ((EXISTS ( SELECT 1
   FROM ("public"."chapters" "c"
     JOIN "public"."courses" "co" ON (("c"."course_id" = "co"."id")))
  WHERE (("c"."id" = "flashcards"."chapter_id") AND ("co"."profile_id" = "auth"."uid"())))));



CREATE POLICY "creators_can_view_course_progress" ON "public"."user_flashcard_progress" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM (("public"."flashcards" "f"
     JOIN "public"."chapters" "c" ON (("f"."chapter_id" = "c"."id")))
     JOIN "public"."courses" "co" ON (("c"."course_id" = "co"."id")))
  WHERE (("f"."id" = "user_flashcard_progress"."flashcard_id") AND ("co"."profile_id" = "auth"."uid"())))));



ALTER TABLE "public"."dialects" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."enrollments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."federation_instances" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."flashcards" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."languages" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."reading" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."sections" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "students_can_read_enrolled_flashcards" ON "public"."flashcards" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM ("public"."chapters" "c"
     JOIN "public"."enrollments" "e" ON (("c"."course_id" = "e"."course_id")))
  WHERE (("c"."id" = "flashcards"."chapter_id") AND ("e"."profile_id" = "auth"."uid"())))));



ALTER TABLE "public"."user_flashcard_progress" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_section_progress" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "users_can_manage_own_progress" ON "public"."user_flashcard_progress" USING (("profile_id" = "auth"."uid"()));





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";









GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";









































































































































































































































































































GRANT ALL ON FUNCTION "public"."calculate_quiz_score"() TO "anon";
GRANT ALL ON FUNCTION "public"."calculate_quiz_score"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."calculate_quiz_score"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_course_completion_percentage"("p_course_id" "uuid", "p_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_course_completion_percentage"("p_course_id" "uuid", "p_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_course_completion_percentage"("p_course_id" "uuid", "p_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_course_data_with_counts"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_course_data_with_counts"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_course_data_with_counts"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_due_character_reviews"("p_profile_id" "uuid", "p_limit" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_due_character_reviews"("p_profile_id" "uuid", "p_limit" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_due_character_reviews"("p_profile_id" "uuid", "p_limit" integer) TO "service_role";



GRANT ALL ON TABLE "public"."flashcards" TO "anon";
GRANT ALL ON TABLE "public"."flashcards" TO "authenticated";
GRANT ALL ON TABLE "public"."flashcards" TO "service_role";



GRANT ALL ON FUNCTION "public"."get_due_flashcards"("p_profile_id" "uuid", "p_course_id" "uuid", "p_limit" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_due_flashcards"("p_profile_id" "uuid", "p_course_id" "uuid", "p_limit" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_due_flashcards"("p_profile_id" "uuid", "p_course_id" "uuid", "p_limit" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_enrollment_count"("course_uuid" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_enrollment_count"("course_uuid" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_enrollment_count"("course_uuid" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_full_course"("p_course_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_full_course"("p_course_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_full_course"("p_course_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_home_page_courses"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_home_page_courses"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_home_page_courses"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_my_learning_courses"("input_profile_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_my_learning_courses"("input_profile_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_my_learning_courses"("input_profile_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_next_flashcard_serial"("chapter_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_next_flashcard_serial"("chapter_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_next_flashcard_serial"("chapter_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_sorted_courses"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_sorted_courses"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_sorted_courses"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_teach_courses"("input_profile_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_teach_courses"("input_profile_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_teach_courses"("input_profile_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."import_language"("p_code" "text", "p_name_en" "text", "p_name_native" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."import_language"("p_code" "text", "p_name_en" "text", "p_name_native" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."import_language"("p_code" "text", "p_name_en" "text", "p_name_native" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."reorder_chapter_vocabulary"("p_chapter_id" "uuid", "p_vocabulary_orders" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."reorder_chapter_vocabulary"("p_chapter_id" "uuid", "p_vocabulary_orders" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."reorder_chapter_vocabulary"("p_chapter_id" "uuid", "p_vocabulary_orders" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."reorder_chapters"("course_id" "uuid", "chapter_ids" "uuid"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."reorder_chapters"("course_id" "uuid", "chapter_ids" "uuid"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."reorder_chapters"("course_id" "uuid", "chapter_ids" "uuid"[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."reorder_flashcards"("chapter_id" "uuid", "flashcard_ids" "uuid"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."reorder_flashcards"("chapter_id" "uuid", "flashcard_ids" "uuid"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."reorder_flashcards"("chapter_id" "uuid", "flashcard_ids" "uuid"[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."reorder_sections"("chapter_id" "uuid", "section_ids" "uuid"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."reorder_sections"("chapter_id" "uuid", "section_ids" "uuid"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."reorder_sections"("chapter_id" "uuid", "section_ids" "uuid"[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."set_chapter_serial"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_chapter_serial"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_chapter_serial"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_chapter_serial_number"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_chapter_serial_number"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_chapter_serial_number"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_section_serial"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_section_serial"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_section_serial"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_section_serial_number"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_section_serial_number"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_section_serial_number"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_vocabulary_serial_number"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_vocabulary_serial_number"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_vocabulary_serial_number"() TO "service_role";



GRANT ALL ON FUNCTION "public"."sync_profile_email"() TO "anon";
GRANT ALL ON FUNCTION "public"."sync_profile_email"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."sync_profile_email"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_chapter_completion_stats"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_chapter_completion_stats"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_chapter_completion_stats"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_character_progress"("p_profile_id" "uuid", "p_character_id" "uuid", "p_performance_rating" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."update_character_progress"("p_profile_id" "uuid", "p_character_id" "uuid", "p_performance_rating" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_character_progress"("p_profile_id" "uuid", "p_character_id" "uuid", "p_performance_rating" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."update_course_enrollment_count"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_course_enrollment_count"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_course_enrollment_count"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_course_rating_stats"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_course_rating_stats"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_course_rating_stats"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";



GRANT ALL ON FUNCTION "public"."validate_chapter_completion"() TO "anon";
GRANT ALL ON FUNCTION "public"."validate_chapter_completion"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."validate_chapter_completion"() TO "service_role";



GRANT ALL ON FUNCTION "public"."validate_quiz_attempt"() TO "anon";
GRANT ALL ON FUNCTION "public"."validate_quiz_attempt"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."validate_quiz_attempt"() TO "service_role";





















GRANT ALL ON TABLE "public"."chapters" TO "anon";
GRANT ALL ON TABLE "public"."chapters" TO "authenticated";
GRANT ALL ON TABLE "public"."chapters" TO "service_role";



GRANT ALL ON SEQUENCE "public"."chapters_serial_number_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."chapters_serial_number_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."chapters_serial_number_seq" TO "service_role";



GRANT ALL ON TABLE "public"."courses" TO "anon";
GRANT ALL ON TABLE "public"."courses" TO "authenticated";
GRANT ALL ON TABLE "public"."courses" TO "service_role";



GRANT ALL ON TABLE "public"."dialects" TO "anon";
GRANT ALL ON TABLE "public"."dialects" TO "authenticated";
GRANT ALL ON TABLE "public"."dialects" TO "service_role";



GRANT ALL ON SEQUENCE "public"."dialects_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."dialects_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."dialects_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."enrollments" TO "anon";
GRANT ALL ON TABLE "public"."enrollments" TO "authenticated";
GRANT ALL ON TABLE "public"."enrollments" TO "service_role";



GRANT ALL ON TABLE "public"."federation_instances" TO "anon";
GRANT ALL ON TABLE "public"."federation_instances" TO "authenticated";
GRANT ALL ON TABLE "public"."federation_instances" TO "service_role";



GRANT ALL ON TABLE "public"."languages" TO "anon";
GRANT ALL ON TABLE "public"."languages" TO "authenticated";
GRANT ALL ON TABLE "public"."languages" TO "service_role";



GRANT ALL ON SEQUENCE "public"."languages_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."languages_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."languages_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."reading" TO "anon";
GRANT ALL ON TABLE "public"."reading" TO "authenticated";
GRANT ALL ON TABLE "public"."reading" TO "service_role";



GRANT ALL ON TABLE "public"."sections" TO "anon";
GRANT ALL ON TABLE "public"."sections" TO "authenticated";
GRANT ALL ON TABLE "public"."sections" TO "service_role";
GRANT SELECT ON TABLE "public"."sections" TO PUBLIC;



GRANT ALL ON TABLE "public"."user_flashcard_progress" TO "anon";
GRANT ALL ON TABLE "public"."user_flashcard_progress" TO "authenticated";
GRANT ALL ON TABLE "public"."user_flashcard_progress" TO "service_role";



GRANT ALL ON TABLE "public"."user_section_progress" TO "anon";
GRANT ALL ON TABLE "public"."user_section_progress" TO "authenticated";
GRANT ALL ON TABLE "public"."user_section_progress" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
