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
      batches: {
        Row: {
          capacity: number
          created_at: string
          id: string
          program_id: string
          schedule: string | null
          spots_left: number
          start_date: string
        }
        Insert: {
          capacity?: number
          created_at?: string
          id?: string
          program_id: string
          schedule?: string | null
          spots_left?: number
          start_date: string
        }
        Update: {
          capacity?: number
          created_at?: string
          id?: string
          program_id?: string
          schedule?: string | null
          spots_left?: number
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "batches_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          age: number | null
          city: string | null
          created_at: string
          email: string | null
          goal: string | null
          health_conditions: string[]
          id: string
          is_trial: boolean
          mode: string | null
          name: string
          payment_status: string
          phone: string
          plan: string | null
          primary_slot: string | null
          program: string
          reschedule_count: number
          rules_accepted: boolean
          secondary_slot: string | null
          status: string
        }
        Insert: {
          age?: number | null
          city?: string | null
          created_at?: string
          email?: string | null
          goal?: string | null
          health_conditions?: string[]
          id?: string
          is_trial?: boolean
          mode?: string | null
          name: string
          payment_status?: string
          phone: string
          plan?: string | null
          primary_slot?: string | null
          program: string
          reschedule_count?: number
          rules_accepted?: boolean
          secondary_slot?: string | null
          status?: string
        }
        Update: {
          age?: number | null
          city?: string | null
          created_at?: string
          email?: string | null
          goal?: string | null
          health_conditions?: string[]
          id?: string
          is_trial?: boolean
          mode?: string | null
          name?: string
          payment_status?: string
          phone?: string
          plan?: string | null
          primary_slot?: string | null
          program?: string
          reschedule_count?: number
          rules_accepted?: boolean
          secondary_slot?: string | null
          status?: string
        }
        Relationships: []
      }
      diet_plans: {
        Row: {
          created_at: string
          goal: string | null
          id: string
          meals: Json
          notes: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          goal?: string | null
          id?: string
          meals?: Json
          notes?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          goal?: string | null
          id?: string
          meals?: Json
          notes?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      food_logs: {
        Row: {
          id: string
          image_path: string
          logged_at: string
          meal_type: string | null
          notes: string | null
          user_id: string
        }
        Insert: {
          id?: string
          image_path: string
          logged_at?: string
          meal_type?: string | null
          notes?: string | null
          user_id: string
        }
        Update: {
          id?: string
          image_path?: string
          logged_at?: string
          meal_type?: string | null
          notes?: string | null
          user_id?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          age: number | null
          city: string | null
          created_at: string
          email: string | null
          full_name: string
          goal: string | null
          id: string
          notes: string | null
          path: Database["public"]["Enums"]["path_choice"]
          phone: string
          status: string
        }
        Insert: {
          age?: number | null
          city?: string | null
          created_at?: string
          email?: string | null
          full_name: string
          goal?: string | null
          id?: string
          notes?: string | null
          path: Database["public"]["Enums"]["path_choice"]
          phone: string
          status?: string
        }
        Update: {
          age?: number | null
          city?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          goal?: string | null
          id?: string
          notes?: string | null
          path?: Database["public"]["Enums"]["path_choice"]
          phone?: string
          status?: string
        }
        Relationships: []
      }
      longevity_checkins: {
        Row: {
          created_at: string
          energy: number
          id: string
          member_id: string
          note: string | null
          pain_level: number
          pain_part: string | null
          sleep: number
        }
        Insert: {
          created_at?: string
          energy: number
          id?: string
          member_id: string
          note?: string | null
          pain_level: number
          pain_part?: string | null
          sleep: number
        }
        Update: {
          created_at?: string
          energy?: number
          id?: string
          member_id?: string
          note?: string | null
          pain_level?: number
          pain_part?: string | null
          sleep?: number
        }
        Relationships: [
          {
            foreignKeyName: "longevity_checkins_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "longevity_members"
            referencedColumns: ["id"]
          },
        ]
      }
      longevity_members: {
        Row: {
          created_at: string
          family_name: string | null
          family_phone: string | null
          family_share_token: string | null
          first_name: string
          id: string
          next_session_at: string | null
          program_name: string
          sessions_completed: number
          sessions_total: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          family_name?: string | null
          family_phone?: string | null
          family_share_token?: string | null
          first_name: string
          id?: string
          next_session_at?: string | null
          program_name?: string
          sessions_completed?: number
          sessions_total?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          family_name?: string | null
          family_phone?: string | null
          family_share_token?: string | null
          first_name?: string
          id?: string
          next_session_at?: string | null
          program_name?: string
          sessions_completed?: number
          sessions_total?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      longevity_milestones: {
        Row: {
          id: string
          member_id: string
          more_energy: boolean
          sit_stand: boolean
          sleep_better: boolean
          stairs: boolean
          stronger: boolean
          updated_at: string
        }
        Insert: {
          id?: string
          member_id: string
          more_energy?: boolean
          sit_stand?: boolean
          sleep_better?: boolean
          stairs?: boolean
          stronger?: boolean
          updated_at?: string
        }
        Update: {
          id?: string
          member_id?: string
          more_energy?: boolean
          sit_stand?: boolean
          sleep_better?: boolean
          stairs?: boolean
          stronger?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "longevity_milestones_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: true
            referencedRelation: "longevity_members"
            referencedColumns: ["id"]
          },
        ]
      }
      longevity_sessions: {
        Row: {
          created_at: string
          id: string
          member_id: string
          modification: string | null
          observation: string | null
          session_date: string
          session_number: number
          share_with_family: boolean
          workout: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          member_id: string
          modification?: string | null
          observation?: string | null
          session_date?: string
          session_number: number
          share_with_family?: boolean
          workout?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          member_id?: string
          modification?: string | null
          observation?: string | null
          session_date?: string
          session_number?: number
          share_with_family?: boolean
          workout?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "longevity_sessions_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "longevity_members"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_history: {
        Row: {
          attachments: Json
          conditions: Json
          created_at: string
          id: string
          notes: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          attachments?: Json
          conditions?: Json
          created_at?: string
          id?: string
          notes?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          attachments?: Json
          conditions?: Json
          created_at?: string
          id?: string
          notes?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      membership_pauses: {
        Row: {
          created_at: string
          days: number
          id: string
          membership_id: string
          pause_end: string
          pause_start: string
          reason: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          days: number
          id?: string
          membership_id: string
          pause_end: string
          pause_start: string
          reason?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          days?: number
          id?: string
          membership_id?: string
          pause_end?: string
          pause_start?: string
          reason?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "membership_pauses_membership_id_fkey"
            columns: ["membership_id"]
            isOneToOne: false
            referencedRelation: "memberships"
            referencedColumns: ["id"]
          },
        ]
      }
      memberships: {
        Row: {
          created_at: string
          delivery: string
          end_date: string
          id: string
          pause_balance_days: number
          price_inr: number
          program: string
          start_date: string
          status: string
          tier: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          delivery?: string
          end_date: string
          id?: string
          pause_balance_days?: number
          price_inr?: number
          program: string
          start_date?: string
          status?: string
          tier: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          delivery?: string
          end_date?: string
          id?: string
          pause_balance_days?: number
          price_inr?: number
          program?: string
          start_date?: string
          status?: string
          tier?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number | null
          city: string | null
          created_at: string
          full_name: string | null
          goal_path: Database["public"]["Enums"]["path_choice"] | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          age?: number | null
          city?: string | null
          created_at?: string
          full_name?: string | null
          goal_path?: Database["public"]["Enums"]["path_choice"] | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          age?: number | null
          city?: string | null
          created_at?: string
          full_name?: string | null
          goal_path?: Database["public"]["Enums"]["path_choice"] | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      programs: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          duration_weeks: number | null
          id: string
          path: Database["public"]["Enums"]["path_choice"]
          price_inr: number | null
          slug: string
          title: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          duration_weeks?: number | null
          id?: string
          path: Database["public"]["Enums"]["path_choice"]
          price_inr?: number | null
          slug: string
          title: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          duration_weeks?: number | null
          id?: string
          path?: Database["public"]["Enums"]["path_choice"]
          price_inr?: number | null
          slug?: string
          title?: string
        }
        Relationships: []
      }
      progress_logs: {
        Row: {
          attended: boolean | null
          created_at: string
          id: string
          log_date: string
          notes: string | null
          user_id: string
          weight_kg: number | null
        }
        Insert: {
          attended?: boolean | null
          created_at?: string
          id?: string
          log_date?: string
          notes?: string | null
          user_id: string
          weight_kg?: number | null
        }
        Update: {
          attended?: boolean | null
          created_at?: string
          id?: string
          log_date?: string
          notes?: string | null
          user_id?: string
          weight_kg?: number | null
        }
        Relationships: []
      }
      slot_bookings: {
        Row: {
          age: number | null
          city: string | null
          conditions: Json
          created_at: string
          email: string | null
          full_name: string
          id: string
          mode: Database["public"]["Enums"]["slot_mode"]
          needs_rehab: boolean
          notes: string | null
          phone: string
          primary_slot_id: string | null
          program: Database["public"]["Enums"]["slot_program"]
          secondary_slot_id: string | null
          status: Database["public"]["Enums"]["booking_status"]
          tier: Database["public"]["Enums"]["bootcamp_tier"] | null
          tnc_accepted: Json
          user_id: string | null
        }
        Insert: {
          age?: number | null
          city?: string | null
          conditions?: Json
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          mode: Database["public"]["Enums"]["slot_mode"]
          needs_rehab?: boolean
          notes?: string | null
          phone: string
          primary_slot_id?: string | null
          program: Database["public"]["Enums"]["slot_program"]
          secondary_slot_id?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          tier?: Database["public"]["Enums"]["bootcamp_tier"] | null
          tnc_accepted?: Json
          user_id?: string | null
        }
        Update: {
          age?: number | null
          city?: string | null
          conditions?: Json
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          mode?: Database["public"]["Enums"]["slot_mode"]
          needs_rehab?: boolean
          notes?: string | null
          phone?: string
          primary_slot_id?: string | null
          program?: Database["public"]["Enums"]["slot_program"]
          secondary_slot_id?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          tier?: Database["public"]["Enums"]["bootcamp_tier"] | null
          tnc_accepted?: Json
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "slot_bookings_primary_slot_id_fkey"
            columns: ["primary_slot_id"]
            isOneToOne: false
            referencedRelation: "slots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "slot_bookings_secondary_slot_id_fkey"
            columns: ["secondary_slot_id"]
            isOneToOne: false
            referencedRelation: "slots"
            referencedColumns: ["id"]
          },
        ]
      }
      slots: {
        Row: {
          batch_start_date: string
          capacity: number
          confirmed_count: number
          created_at: string
          id: string
          is_locked: boolean
          program: Database["public"]["Enums"]["slot_program"]
          start_time: string
        }
        Insert: {
          batch_start_date?: string
          capacity: number
          confirmed_count?: number
          created_at?: string
          id?: string
          is_locked?: boolean
          program: Database["public"]["Enums"]["slot_program"]
          start_time: string
        }
        Update: {
          batch_start_date?: string
          capacity?: number
          confirmed_count?: number
          created_at?: string
          id?: string
          is_locked?: boolean
          program?: Database["public"]["Enums"]["slot_program"]
          start_time?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          batch_id: string | null
          created_at: string
          end_date: string | null
          id: string
          program_id: string | null
          start_date: string | null
          status: string
          user_id: string
        }
        Insert: {
          batch_id?: string | null
          created_at?: string
          end_date?: string | null
          id?: string
          program_id?: string | null
          start_date?: string | null
          status?: string
          user_id: string
        }
        Update: {
          batch_id?: string | null
          created_at?: string
          end_date?: string | null
          id?: string
          program_id?: string | null
          start_date?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_family_progress: { Args: { _token: string }; Returns: Json }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      program_slot_availability: {
        Args: { _program: Database["public"]["Enums"]["slot_program"] }
        Returns: {
          booked: number
          capacity: number
          is_locked: boolean
          remaining: number
          slot_id: string
          start_time: string
        }[]
      }
      request_membership_pause: {
        Args: {
          _days: number
          _membership_id: string
          _reason?: string
          _start: string
        }
        Returns: {
          created_at: string
          days: number
          id: string
          membership_id: string
          pause_end: string
          pause_start: string
          reason: string | null
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "membership_pauses"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      slot_availability: { Args: { _slot_id: string }; Returns: Json }
    }
    Enums: {
      app_role: "admin" | "coach" | "member"
      booking_status: "pending" | "consult_requested" | "paid" | "cancelled"
      bootcamp_tier: "standard" | "intensive"
      path_choice: "bohofit" | "bootcamp" | "longevity"
      slot_mode: "online" | "offline"
      slot_program: "bootcamp" | "longevity"
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
      app_role: ["admin", "coach", "member"],
      booking_status: ["pending", "consult_requested", "paid", "cancelled"],
      bootcamp_tier: ["standard", "intensive"],
      path_choice: ["bohofit", "bootcamp", "longevity"],
      slot_mode: ["online", "offline"],
      slot_program: ["bootcamp", "longevity"],
    },
  },
} as const
