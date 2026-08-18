export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      custom_pages: {
        Row: {
          blocks: Json
          created_at: string
          id: string
          published: boolean
          show_in_nav: boolean
          slug: string
          sort_order: number
          title_ar: string | null
          title_en: string
          updated_at: string
        }
        Insert: {
          blocks?: Json
          created_at?: string
          id?: string
          published?: boolean
          show_in_nav?: boolean
          slug: string
          sort_order?: number
          title_ar?: string | null
          title_en: string
          updated_at?: string
        }
        Update: {
          blocks?: Json
          created_at?: string
          id?: string
          published?: boolean
          show_in_nav?: boolean
          slug?: string
          sort_order?: number
          title_ar?: string | null
          title_en?: string
          updated_at?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          created_at: string
          email: string | null
          id: string
          message: string | null
          name: string | null
          phone: string | null
          source: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          message?: string | null
          name?: string | null
          phone?: string | null
          source?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          message?: string | null
          name?: string | null
          phone?: string | null
          source?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          accent: string | null
          created_at: string
          desc_ar: string | null
          desc_en: string | null
          features_ar: Json
          features_en: Json
          gallery: Json
          id: string
          image: string | null
          name: string
          slug: string
          sort_order: number
          specs: Json
          subtitle_ar: string | null
          subtitle_en: string | null
          tag: string | null
          tagline_ar: string | null
          tagline_en: string | null
          updated_at: string
          video_url: string | null
          visible: boolean
        }
        Insert: {
          accent?: string | null
          created_at?: string
          desc_ar?: string | null
          desc_en?: string | null
          features_ar?: Json
          features_en?: Json
          gallery?: Json
          id?: string
          image?: string | null
          name: string
          slug: string
          sort_order?: number
          specs?: Json
          subtitle_ar?: string | null
          subtitle_en?: string | null
          tag?: string | null
          tagline_ar?: string | null
          tagline_en?: string | null
          updated_at?: string
          video_url?: string | null
          visible?: boolean
        }
        Update: {
          accent?: string | null
          created_at?: string
          desc_ar?: string | null
          desc_en?: string | null
          features_ar?: Json
          features_en?: Json
          gallery?: Json
          id?: string
          image?: string | null
          name?: string
          slug?: string
          sort_order?: number
          specs?: Json
          subtitle_ar?: string | null
          subtitle_en?: string | null
          tag?: string | null
          tagline_ar?: string | null
          tagline_en?: string | null
          updated_at?: string
          video_url?: string | null
          visible?: boolean
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      team_members: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          password: string
          role: string
          username: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id?: string
          password: string
          role?: string
          username: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          password?: string
          role?: string
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
