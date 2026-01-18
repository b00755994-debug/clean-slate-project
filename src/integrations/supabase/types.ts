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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      billable_users: {
        Row: {
          avatar_url: string | null
          billability_validated: boolean | null
          billable_user_type:
            | Database["public"]["Enums"]["billable_user_type"]
            | null
          connections: number | null
          created_at: string | null
          followers: number | null
          id: string
          linkedin_title: string | null
          linkedin_url: string
          profile_name: string
          profile_picture: string | null
          slack_user_id: string | null
          urn: string | null
          user_id: string
          workspace_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          billability_validated?: boolean | null
          billable_user_type?:
            | Database["public"]["Enums"]["billable_user_type"]
            | null
          connections?: number | null
          created_at?: string | null
          followers?: number | null
          id?: string
          linkedin_title?: string | null
          linkedin_url: string
          profile_name: string
          profile_picture?: string | null
          slack_user_id?: string | null
          urn?: string | null
          user_id: string
          workspace_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          billability_validated?: boolean | null
          billable_user_type?:
            | Database["public"]["Enums"]["billable_user_type"]
            | null
          connections?: number | null
          created_at?: string | null
          followers?: number | null
          id?: string
          linkedin_title?: string | null
          linkedin_url?: string
          profile_name?: string
          profile_picture?: string | null
          slack_user_id?: string | null
          urn?: string | null
          user_id?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "linkedin_profiles_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      bookmarks: {
        Row: {
          created_at: string | null
          id: string
          post_id: string | null
          user_id: string
          vetted_content_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id: string
          vetted_content_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string
          vetted_content_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookmarks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookmarks_vetted_content_id_fkey"
            columns: ["vetted_content_id"]
            isOneToOne: false
            referencedRelation: "vetted_content"
            referencedColumns: ["id"]
          },
        ]
      }
      kpis: {
        Row: {
          billable_user_id: string | null
          created_at: string
          id: number
          name: string | null
          period: string | null
          type: string | null
          value: number | null
          workspace_id: string | null
        }
        Insert: {
          billable_user_id?: string | null
          created_at?: string
          id?: number
          name?: string | null
          period?: string | null
          type?: string | null
          value?: number | null
          workspace_id?: string | null
        }
        Update: {
          billable_user_id?: string | null
          created_at?: string
          id?: number
          name?: string | null
          period?: string | null
          type?: string | null
          value?: number | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kpis_billable_user_id_fkey"
            columns: ["billable_user_id"]
            isOneToOne: false
            referencedRelation: "billable_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kpis_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      people: {
        Row: {
          connections: number | null
          created_at: string
          current_job: string | null
          first_name: string | null
          followerCount: number | null
          id: string
          last_name: string | null
          post_id: string[] | null
          public_url: string | null
          urn: string | null
        }
        Insert: {
          connections?: number | null
          created_at?: string
          current_job?: string | null
          first_name?: string | null
          followerCount?: number | null
          id?: string
          last_name?: string | null
          post_id?: string[] | null
          public_url?: string | null
          urn?: string | null
        }
        Update: {
          connections?: number | null
          created_at?: string
          current_job?: string | null
          first_name?: string | null
          followerCount?: number | null
          id?: string
          last_name?: string | null
          post_id?: string[] | null
          public_url?: string | null
          urn?: string | null
        }
        Relationships: []
      }
      post_history: {
        Row: {
          appreciation: number | null
          comment: number | null
          created_at: string
          empathy: number | null
          id: string
          impressions: number | null
          interest: number | null
          likes: number | null
          linkedin_post_id: string | null
          post_id: string | null
          praise: number | null
          reactions: number | null
          shares: number | null
          url: string | null
        }
        Insert: {
          appreciation?: number | null
          comment?: number | null
          created_at?: string
          empathy?: number | null
          id?: string
          impressions?: number | null
          interest?: number | null
          likes?: number | null
          linkedin_post_id?: string | null
          post_id?: string | null
          praise?: number | null
          reactions?: number | null
          shares?: number | null
          url?: string | null
        }
        Update: {
          appreciation?: number | null
          comment?: number | null
          created_at?: string
          empathy?: number | null
          id?: string
          impressions?: number | null
          interest?: number | null
          likes?: number | null
          linkedin_post_id?: string | null
          post_id?: string | null
          praise?: number | null
          reactions?: number | null
          shares?: number | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "history_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          appreciation: number | null
          avatar_url: string | null
          comments: number | null
          content: string | null
          created_at: string
          empathy: number | null
          id: string
          impressions: number | null
          interest: number | null
          likes: number | null
          linkedin_post_id: string | null
          linkedin_profiles: string | null
          monitored_by_supermpup: boolean | null
          post_image: string | null
          praise: number | null
          reactions: number | null
          shares: number | null
          status: Database["public"]["Enums"]["post_status"] | null
          url: string | null
          user_id: number | null
          workspace_id: string | null
        }
        Insert: {
          appreciation?: number | null
          avatar_url?: string | null
          comments?: number | null
          content?: string | null
          created_at?: string
          empathy?: number | null
          id?: string
          impressions?: number | null
          interest?: number | null
          likes?: number | null
          linkedin_post_id?: string | null
          linkedin_profiles?: string | null
          monitored_by_supermpup?: boolean | null
          post_image?: string | null
          praise?: number | null
          reactions?: number | null
          shares?: number | null
          status?: Database["public"]["Enums"]["post_status"] | null
          url?: string | null
          user_id?: number | null
          workspace_id?: string | null
        }
        Update: {
          appreciation?: number | null
          avatar_url?: string | null
          comments?: number | null
          content?: string | null
          created_at?: string
          empathy?: number | null
          id?: string
          impressions?: number | null
          interest?: number | null
          likes?: number | null
          linkedin_post_id?: string | null
          linkedin_profiles?: string | null
          monitored_by_supermpup?: boolean | null
          post_image?: string | null
          praise?: number | null
          reactions?: number | null
          shares?: number | null
          status?: Database["public"]["Enums"]["post_status"] | null
          url?: string | null
          user_id?: number | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_2_linkedin_profiles_fkey"
            columns: ["linkedin_profiles"]
            isOneToOne: false
            referencedRelation: "billable_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      posts_activity: {
        Row: {
          billable_user_id: string | null
          commentary: string | null
          company_url: string | null
          created_at: string
          id: string
          linkedin_post_id: string | null
          linkedin_urn: string | null
          name: string | null
          people_id: string | null
          picture_url: string | null
          post_id: string | null
          published_at: string | null
          reaction_id: string | null
          type: string | null
          user_type: string | null
        }
        Insert: {
          billable_user_id?: string | null
          commentary?: string | null
          company_url?: string | null
          created_at?: string
          id?: string
          linkedin_post_id?: string | null
          linkedin_urn?: string | null
          name?: string | null
          people_id?: string | null
          picture_url?: string | null
          post_id?: string | null
          published_at?: string | null
          reaction_id?: string | null
          type?: string | null
          user_type?: string | null
        }
        Update: {
          billable_user_id?: string | null
          commentary?: string | null
          company_url?: string | null
          created_at?: string
          id?: string
          linkedin_post_id?: string | null
          linkedin_urn?: string | null
          name?: string | null
          people_id?: string | null
          picture_url?: string | null
          post_id?: string | null
          published_at?: string | null
          reaction_id?: string | null
          type?: string | null
          user_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_billable_user_id_fkey"
            columns: ["billable_user_id"]
            isOneToOne: false
            referencedRelation: "billable_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_activity_people_id_fkey"
            columns: ["people_id"]
            isOneToOne: true
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_activity_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          plan: string | null
          updated_at: string | null
          workspace_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          plan?: string | null
          updated_at?: string | null
          workspace_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          plan?: string | null
          updated_at?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      slack_workspace_auth: {
        Row: {
          id: string
          installed_at: string
          post_channel: string | null
          scopes: string | null
          slack_id: string | null
          superpump_workspace_id: string | null
          token: string | null
        }
        Insert: {
          id?: string
          installed_at?: string
          post_channel?: string | null
          scopes?: string | null
          slack_id?: string | null
          superpump_workspace_id?: string | null
          token?: string | null
        }
        Update: {
          id?: string
          installed_at?: string
          post_channel?: string | null
          scopes?: string | null
          slack_id?: string | null
          superpump_workspace_id?: string | null
          token?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "slack_workspace_auth_superpump_workspace_id_fkey"
            columns: ["superpump_workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
          workspace_id: string | null
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
          workspace_id?: string | null
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      vetted_content: {
        Row: {
          category: string | null
          content: string
          created_at: string | null
          created_by: string
          id: string
          image_url: string | null
          title: string
          updated_at: string | null
          workspace_id: string
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string | null
          created_by: string
          id?: string
          image_url?: string | null
          title: string
          updated_at?: string | null
          workspace_id: string
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string | null
          created_by?: string
          id?: string
          image_url?: string | null
          title?: string
          updated_at?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vetted_content_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vetted_content_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspaces: {
        Row: {
          connected_at: string | null
          created_at: string | null
          id: string
          is_connected: boolean | null
          slack_workspace_auth: string | null
          user_id: string
          workspace_name: string
        }
        Insert: {
          connected_at?: string | null
          created_at?: string | null
          id?: string
          is_connected?: boolean | null
          slack_workspace_auth?: string | null
          user_id: string
          workspace_name: string
        }
        Update: {
          connected_at?: string | null
          created_at?: string | null
          id?: string
          is_connected?: boolean | null
          slack_workspace_auth?: string | null
          user_id?: string
          workspace_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspaces_slack_workspace_auth_fkey"
            columns: ["slack_workspace_auth"]
            isOneToOne: false
            referencedRelation: "slack_workspace_auth"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      billable_user_type: "employee" | "marketing"
      post_status: "new" | "stopped" | "ongoing" | "old"
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
    Enums: {
      app_role: ["admin", "user"],
      billable_user_type: ["employee", "marketing"],
      post_status: ["new", "stopped", "ongoing", "old"],
    },
  },
} as const
