export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      chapters: {
        Row: {
          course_id: string
          created_at: string
          description: string | null
          id: string
          serial_number: number
          sub_title: string | null
          title: string
          updated_at: string
        }
        Insert: {
          course_id: string
          created_at?: string
          description?: string | null
          id?: string
          serial_number?: number
          sub_title?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string | null
          id?: string
          serial_number?: number
          sub_title?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chapters_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          course_language: number | null
          course_language_dialect: number | null
          created_at: string
          description: string | null
          description_html: string | null
          description_json: string | null
          id: string
          is_federated: boolean | null
          is_published: boolean | null
          language_taught: number | null
          language_taught_dialect: number | null
          profile_id: string
          published_at: string | null
          short_description: string | null
          support_link: string | null
          thumbnail: string | null
          title: string
          updated_at: string
        }
        Insert: {
          course_language?: number | null
          course_language_dialect?: number | null
          created_at?: string
          description?: string | null
          description_html?: string | null
          description_json?: string | null
          id?: string
          is_federated?: boolean | null
          is_published?: boolean | null
          language_taught?: number | null
          language_taught_dialect?: number | null
          profile_id: string
          published_at?: string | null
          short_description?: string | null
          support_link?: string | null
          thumbnail?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          course_language?: number | null
          course_language_dialect?: number | null
          created_at?: string
          description?: string | null
          description_html?: string | null
          description_json?: string | null
          id?: string
          is_federated?: boolean | null
          is_published?: boolean | null
          language_taught?: number | null
          language_taught_dialect?: number | null
          profile_id?: string
          published_at?: string | null
          short_description?: string | null
          support_link?: string | null
          thumbnail?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_course_language_dialect_fkey"
            columns: ["course_language_dialect"]
            isOneToOne: false
            referencedRelation: "dialects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courses_course_language_fkey"
            columns: ["course_language"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courses_language_taught_dialect_fkey"
            columns: ["language_taught_dialect"]
            isOneToOne: false
            referencedRelation: "dialects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courses_language_taught_fkey"
            columns: ["language_taught"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courses_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      dialects: {
        Row: {
          created_at: string
          description: string | null
          id: number
          language_id: number
          name_en: string
          name_native: string | null
          region: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          language_id: number
          name_en: string
          name_native?: string | null
          region?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          language_id?: number
          name_en?: string
          name_native?: string | null
          region?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dialects_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollments: {
        Row: {
          course_id: string
          created_at: string
          id: string
          profile_id: string
          updated_at: string
        }
        Insert: {
          course_id: string
          created_at: string
          id?: string
          profile_id: string
          updated_at: string
        }
        Update: {
          course_id?: string
          created_at?: string
          id?: string
          profile_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      federation_instances: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: []
      }
      flashcards: {
        Row: {
          back_content: string
          back_content_html: string | null
          chapter_id: string | null
          created_at: string | null
          difficulty_level: number | null
          front_content: string
          front_content_html: string | null
          hint: string | null
          id: string
          section_id: string | null
          serial_number: number
          updated_at: string | null
        }
        Insert: {
          back_content: string
          back_content_html?: string | null
          chapter_id?: string | null
          created_at?: string | null
          difficulty_level?: number | null
          front_content: string
          front_content_html?: string | null
          hint?: string | null
          id?: string
          section_id?: string | null
          serial_number: number
          updated_at?: string | null
        }
        Update: {
          back_content?: string
          back_content_html?: string | null
          chapter_id?: string | null
          created_at?: string | null
          difficulty_level?: number | null
          front_content?: string
          front_content_html?: string | null
          hint?: string | null
          id?: string
          section_id?: string | null
          serial_number?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "flashcards_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flashcards_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["id"]
          },
        ]
      }
      languages: {
        Row: {
          code: string
          created_at: string
          id: number
          name_en: string
          name_jpn: string | null
          name_native: string | null
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: number
          name_en: string
          name_jpn?: string | null
          name_native?: string | null
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: number
          name_en?: string
          name_jpn?: string | null
          name_native?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string | null
          id: string
          is_admin: boolean | null
          name: string
          subtitle: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          id: string
          is_admin?: boolean | null
          name: string
          subtitle?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_admin?: boolean | null
          name?: string
          subtitle?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reading: {
        Row: {
          chapter_id: string
          created_at: string
          id: string
          serial_number: number
          text: string
          translation: string
        }
        Insert: {
          chapter_id: string
          created_at?: string
          id: string
          serial_number: number
          text?: string
          translation?: string
        }
        Update: {
          chapter_id?: string
          created_at?: string
          id?: string
          serial_number?: number
          text?: string
          translation?: string
        }
        Relationships: [
          {
            foreignKeyName: "reading_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
        ]
      }
      sections: {
        Row: {
          chapter_id: string
          content_html: string | null
          content_json: Json | null
          created_at: string
          id: string
          serial_number: number
          sub_title: string | null
          title: string
          updated_at: string
        }
        Insert: {
          chapter_id: string
          content_html?: string | null
          content_json?: Json | null
          created_at: string
          id?: string
          serial_number: number
          sub_title?: string | null
          title: string
          updated_at: string
        }
        Update: {
          chapter_id?: string
          content_html?: string | null
          content_json?: Json | null
          created_at?: string
          id?: string
          serial_number?: number
          sub_title?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sections_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
        ]
      }
      user_flashcard_progress: {
        Row: {
          correct_count: number | null
          created_at: string | null
          due_date: string | null
          ease_factor: number | null
          flashcard_id: string | null
          id: string
          incorrect_count: number | null
          interval: number | null
          last_reviewed: string | null
          profile_id: string | null
          review_count: number | null
          updated_at: string | null
        }
        Insert: {
          correct_count?: number | null
          created_at?: string | null
          due_date?: string | null
          ease_factor?: number | null
          flashcard_id?: string | null
          id?: string
          incorrect_count?: number | null
          interval?: number | null
          last_reviewed?: string | null
          profile_id?: string | null
          review_count?: number | null
          updated_at?: string | null
        }
        Update: {
          correct_count?: number | null
          created_at?: string | null
          due_date?: string | null
          ease_factor?: number | null
          flashcard_id?: string | null
          id?: string
          incorrect_count?: number | null
          interval?: number | null
          last_reviewed?: string | null
          profile_id?: string | null
          review_count?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_flashcard_progress_flashcard_id_fkey"
            columns: ["flashcard_id"]
            isOneToOne: false
            referencedRelation: "flashcards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_flashcard_progress_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_section_progress: {
        Row: {
          completion_percentage: number | null
          created_at: string
          id: string
          last_viewed: string | null
          profile_id: string
          section_id: string
          updated_at: string
        }
        Insert: {
          completion_percentage?: number | null
          created_at?: string
          id?: string
          last_viewed?: string | null
          profile_id: string
          section_id: string
          updated_at?: string
        }
        Update: {
          completion_percentage?: number | null
          created_at?: string
          id?: string
          last_viewed?: string | null
          profile_id?: string
          section_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_section_progress_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_section_progress_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_course_completion_percentage: {
        Args: { p_course_id: string; p_user_id: string }
        Returns: number
      }
      get_course_data_with_counts: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          title: string
          short_description: string
          thumbnail: string
          language_taught: string
          course_language: string
          author_id: string
          author_name: string
          author_subtitle: string
          author_avatar_url: string
          enrolled_students: number
          created_at: string
        }[]
      }
      get_due_character_reviews: {
        Args: { p_profile_id: string; p_limit?: number }
        Returns: {
          character_id: string
          character: string
          meaning: string
          pronunciation: string
          examples: Json
          difficulty_level: number
          due_date: string
          proficiency_level: number
        }[]
      }
      get_due_flashcards: {
        Args: { p_profile_id: string; p_course_id: string; p_limit?: number }
        Returns: {
          back_content: string
          back_content_html: string | null
          chapter_id: string | null
          created_at: string | null
          difficulty_level: number | null
          front_content: string
          front_content_html: string | null
          hint: string | null
          id: string
          section_id: string | null
          serial_number: number
          updated_at: string | null
        }[]
      }
      get_enrollment_count: {
        Args: { course_uuid: string }
        Returns: number
      }
      get_full_course: {
        Args: { p_course_id: string }
        Returns: Json
      }
      get_home_page_courses: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          title: string
          short_description: string
          thumbnail: string
          language_taught: string
          course_language: string
          author_id: string
          author_name: string
          author_subtitle: string
          author_avatar_url: string
          enrolled_students: number
          created_at: string
          category: string
        }[]
      }
      get_my_learning_courses: {
        Args: { input_profile_id: string }
        Returns: {
          id: string
          title: string
          short_description: string
          thumbnail: string
          language_taught: string
          course_language: string
          author_id: string
          author_name: string
          author_subtitle: string
          author_avatar_url: string
          enrolled_students: number
          enrolled_at: string
        }[]
      }
      get_next_flashcard_serial: {
        Args: { chapter_id: string }
        Returns: number
      }
      get_sorted_courses: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          title: string
          short_description: string
          thumbnail: string
          language_taught: string
          course_language: string
          author_id: string
          author_name: string
          author_subtitle: string
          author_avatar_url: string
          enrolled_students: number
          created_at: string
          category: string
        }[]
      }
      get_teach_courses: {
        Args: { input_profile_id: string }
        Returns: {
          id: string
          title: string
          short_description: string
          thumbnail: string
          language_taught: string
          course_language: string
          author_id: string
          author_name: string
          author_subtitle: string
          author_avatar_url: string
          enrolled_students: number
          is_published: boolean
          created_at: string
          category: string
        }[]
      }
      import_language: {
        Args: { p_code: string; p_name_en: string; p_name_native?: string }
        Returns: undefined
      }
      reorder_chapter_vocabulary: {
        Args: { p_chapter_id: string; p_vocabulary_orders: Json }
        Returns: undefined
      }
      reorder_chapters: {
        Args: { course_id: string; chapter_ids: string[] }
        Returns: undefined
      }
      reorder_flashcards: {
        Args: { chapter_id: string; flashcard_ids: string[] }
        Returns: undefined
      }
      reorder_sections: {
        Args: { chapter_id: string; section_ids: string[] }
        Returns: undefined
      }
      update_character_progress: {
        Args: {
          p_profile_id: string
          p_character_id: string
          p_performance_rating: number
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
