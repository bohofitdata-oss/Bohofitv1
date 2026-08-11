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
      coach_interventions: {
        Row: {
          coach_user_id: string | null
          created_at: string
          id: string
          member_user_id: string
          notes: string | null
          reason: string
          resolved_at: string | null
          status: string
        }
        Insert: {
          coach_user_id?: string | null
          created_at?: string
          id?: string
          member_user_id: string
          notes?: string | null
          reason: string
          resolved_at?: string | null
          status?: string
        }
        Update: {
          coach_user_id?: string | null
          created_at?: string
          id?: string
          member_user_id?: string
          notes?: string | null
          reason?: string
          resolved_at?: string | null
          status?: string
        }
        Relationships: []
      }
      coaches: {
        Row: {
          band: string | null
          bio: string | null
          created_at: string
          id: string
          name: string
          photo_url: string | null
          user_id: string | null
        }
        Insert: {
          band?: string | null
          bio?: string | null
          created_at?: string
          id?: string
          name: string
          photo_url?: string | null
          user_id?: string | null
        }
        Update: {
          band?: string | null
          bio?: string | null
          created_at?: string
          id?: string
          name?: string
          photo_url?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      concern_intake: {
        Row: {
          booking_id: string | null
          concern_selected: Database["public"]["Enums"]["concern_kind"]
          consent_given: boolean
          created_at: string
          id: string
          person_id: string | null
          symptom_chips_selected: string[]
        }
        Insert: {
          booking_id?: string | null
          concern_selected: Database["public"]["Enums"]["concern_kind"]
          consent_given?: boolean
          created_at?: string
          id?: string
          person_id?: string | null
          symptom_chips_selected?: string[]
        }
        Update: {
          booking_id?: string | null
          concern_selected?: Database["public"]["Enums"]["concern_kind"]
          consent_given?: boolean
          created_at?: string
          id?: string
          person_id?: string | null
          symptom_chips_selected?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "concern_intake_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      consents: {
        Row: {
          consented_at: string
          created_at: string
          health_data_opt_in: boolean
          id: string
          marketing_opt_in: boolean
          member_id: string
          version: string
          waiver_accepted: boolean
        }
        Insert: {
          consented_at?: string
          created_at?: string
          health_data_opt_in?: boolean
          id?: string
          marketing_opt_in?: boolean
          member_id: string
          version?: string
          waiver_accepted?: boolean
        }
        Update: {
          consented_at?: string
          created_at?: string
          health_data_opt_in?: boolean
          id?: string
          marketing_opt_in?: boolean
          member_id?: string
          version?: string
          waiver_accepted?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "consents_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      consultations: {
        Row: {
          age: number | null
          consult_date: string
          consult_time: string
          created_at: string
          email: string
          full_name: string
          id: string
          notes: string | null
          notified_at: string | null
          phone: string
          problem_areas: string[]
          program: string
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          age?: number | null
          consult_date: string
          consult_time: string
          created_at?: string
          email: string
          full_name: string
          id?: string
          notes?: string | null
          notified_at?: string | null
          phone: string
          problem_areas?: string[]
          program: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          age?: number | null
          consult_date?: string
          consult_time?: string
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          notes?: string | null
          notified_at?: string | null
          phone?: string
          problem_areas?: string[]
          program?: string
          status?: string
          updated_at?: string
          user_id?: string | null
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
      doctors: {
        Row: {
          clinic: string | null
          created_at: string
          id: string
          name: string
          photo_url: string | null
          specialty: string | null
        }
        Insert: {
          clinic?: string | null
          created_at?: string
          id?: string
          name: string
          photo_url?: string | null
          specialty?: string | null
        }
        Update: {
          clinic?: string | null
          created_at?: string
          id?: string
          name?: string
          photo_url?: string | null
          specialty?: string | null
        }
        Relationships: []
      }
      episodes: {
        Row: {
          block_number: number
          created_at: string
          end_date: string | null
          id: string
          member_id: string
          program_track: Database["public"]["Enums"]["concern_kind"]
          sessions_completed: number
          sessions_total: number
          start_date: string
          status: Database["public"]["Enums"]["episode_status_kind"]
          updated_at: string
        }
        Insert: {
          block_number?: number
          created_at?: string
          end_date?: string | null
          id?: string
          member_id: string
          program_track: Database["public"]["Enums"]["concern_kind"]
          sessions_completed?: number
          sessions_total?: number
          start_date?: string
          status?: Database["public"]["Enums"]["episode_status_kind"]
          updated_at?: string
        }
        Update: {
          block_number?: number
          created_at?: string
          end_date?: string | null
          id?: string
          member_id?: string
          program_track?: Database["public"]["Enums"]["concern_kind"]
          sessions_completed?: number
          sessions_total?: number
          start_date?: string
          status?: Database["public"]["Enums"]["episode_status_kind"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "episodes_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      family_invites: {
        Row: {
          created_at: string
          id: string
          invitee_email: string | null
          invitee_name: string
          invitee_phone: string | null
          inviter_user_id: string
          joined_user_id: string | null
          relation: string
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          invitee_email?: string | null
          invitee_name: string
          invitee_phone?: string | null
          inviter_user_id: string
          joined_user_id?: string | null
          relation: string
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          invitee_email?: string | null
          invitee_name?: string
          invitee_phone?: string | null
          inviter_user_id?: string
          joined_user_id?: string | null
          relation?: string
          status?: string
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
      gynae_reports: {
        Row: {
          created_at: string
          doctor_id: string | null
          episode_id: string | null
          file_url: string | null
          id: string
          member_id: string
          summary: string | null
        }
        Insert: {
          created_at?: string
          doctor_id?: string | null
          episode_id?: string | null
          file_url?: string | null
          id?: string
          member_id: string
          summary?: string | null
        }
        Update: {
          created_at?: string
          doctor_id?: string | null
          episode_id?: string | null
          file_url?: string | null
          id?: string
          member_id?: string
          summary?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gynae_reports_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gynae_reports_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "episodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gynae_reports_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      gynec_consultations: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          preferred_date: string | null
          preferred_time: string | null
          report_filename: string | null
          report_path: string | null
          report_uploaded_at: string | null
          status: Database["public"]["Enums"]["consultation_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          preferred_date?: string | null
          preferred_time?: string | null
          report_filename?: string | null
          report_path?: string | null
          report_uploaded_at?: string | null
          status?: Database["public"]["Enums"]["consultation_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          preferred_date?: string | null
          preferred_time?: string | null
          report_filename?: string | null
          report_path?: string | null
          report_uploaded_at?: string | null
          status?: Database["public"]["Enums"]["consultation_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      intake_responses: {
        Row: {
          clearance_required: boolean
          concern: Database["public"]["Enums"]["concern_kind"]
          created_at: string
          goal_text: string | null
          id: string
          member_id: string
          par_q: Json
          responses: Json
        }
        Insert: {
          clearance_required?: boolean
          concern: Database["public"]["Enums"]["concern_kind"]
          created_at?: string
          goal_text?: string | null
          id?: string
          member_id: string
          par_q?: Json
          responses?: Json
        }
        Update: {
          clearance_required?: boolean
          concern?: Database["public"]["Enums"]["concern_kind"]
          created_at?: string
          goal_text?: string | null
          id?: string
          member_id?: string
          par_q?: Json
          responses?: Json
        }
        Relationships: [
          {
            foreignKeyName: "intake_responses_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
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
          package_size: number
          package_status: Database["public"]["Enums"]["package_status_kind"]
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
          package_size?: number
          package_status?: Database["public"]["Enums"]["package_status_kind"]
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
          package_size?: number
          package_status?: Database["public"]["Enums"]["package_status_kind"]
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
      measures: {
        Row: {
          created_at: string
          episode_id: string | null
          id: string
          measure_type: Database["public"]["Enums"]["measure_kind"]
          member_id: string
          metric_name: string
          recorded_at: string
          recorded_by: string | null
          unit: string | null
          value: number
        }
        Insert: {
          created_at?: string
          episode_id?: string | null
          id?: string
          measure_type: Database["public"]["Enums"]["measure_kind"]
          member_id: string
          metric_name: string
          recorded_at?: string
          recorded_by?: string | null
          unit?: string | null
          value: number
        }
        Update: {
          created_at?: string
          episode_id?: string | null
          id?: string
          measure_type?: Database["public"]["Enums"]["measure_kind"]
          member_id?: string
          metric_name?: string
          recorded_at?: string
          recorded_by?: string | null
          unit?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "measures_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "episodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "measures_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
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
      member_milestones: {
        Row: {
          earned_at: string
          id: string
          milestone_id: string
          user_id: string
        }
        Insert: {
          earned_at?: string
          id?: string
          milestone_id: string
          user_id: string
        }
        Update: {
          earned_at?: string
          id?: string
          milestone_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "member_milestones_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "milestone_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      member_progress: {
        Row: {
          attendance_score: number
          coach_score: number
          completion_score: number
          milestone_score: number
          next_milestone: string | null
          next_step: string | null
          progress_to_next_level: number
          score: number
          sessions_lifetime: number
          updated_at: string
          user_id: string
        }
        Insert: {
          attendance_score?: number
          coach_score?: number
          completion_score?: number
          milestone_score?: number
          next_milestone?: string | null
          next_step?: string | null
          progress_to_next_level?: number
          score?: number
          sessions_lifetime?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          attendance_score?: number
          coach_score?: number
          completion_score?: number
          milestone_score?: number
          next_milestone?: string | null
          next_step?: string | null
          progress_to_next_level?: number
          score?: number
          sessions_lifetime?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      member_session_logs: {
        Row: {
          exercises: Json
          flags: Json
          id: string
          logged_at: string
          logged_by: string | null
          notes: string | null
          session_id: string
        }
        Insert: {
          exercises?: Json
          flags?: Json
          id?: string
          logged_at?: string
          logged_by?: string | null
          notes?: string | null
          session_id: string
        }
        Update: {
          exercises?: Json
          flags?: Json
          id?: string
          logged_at?: string
          logged_by?: string | null
          notes?: string | null
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "member_session_logs_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "member_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      member_sessions: {
        Row: {
          coach_id: string | null
          completed_at: string | null
          created_at: string
          episode_id: string
          id: string
          member_id: string
          mode: Database["public"]["Enums"]["session_mode_kind"] | null
          scheduled_at: string | null
          status: Database["public"]["Enums"]["session_status_kind"]
        }
        Insert: {
          coach_id?: string | null
          completed_at?: string | null
          created_at?: string
          episode_id: string
          id?: string
          member_id: string
          mode?: Database["public"]["Enums"]["session_mode_kind"] | null
          scheduled_at?: string | null
          status?: Database["public"]["Enums"]["session_status_kind"]
        }
        Update: {
          coach_id?: string | null
          completed_at?: string | null
          created_at?: string
          episode_id?: string
          id?: string
          member_id?: string
          mode?: Database["public"]["Enums"]["session_mode_kind"] | null
          scheduled_at?: string | null
          status?: Database["public"]["Enums"]["session_status_kind"]
        }
        Relationships: [
          {
            foreignKeyName: "member_sessions_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coaches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_sessions_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "episodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_sessions_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      member_streaks: {
        Row: {
          current_streak: number
          last_attended_date: string | null
          longest_streak: number
          updated_at: string
          user_id: string
          weeks_consistent: number
        }
        Insert: {
          current_streak?: number
          last_attended_date?: string | null
          longest_streak?: number
          updated_at?: string
          user_id: string
          weeks_consistent?: number
        }
        Update: {
          current_streak?: number
          last_attended_date?: string | null
          longest_streak?: number
          updated_at?: string
          user_id?: string
          weeks_consistent?: number
        }
        Relationships: []
      }
      members: {
        Row: {
          age: number | null
          city: string | null
          created_at: string
          dob: string | null
          email: string | null
          gender: Database["public"]["Enums"]["gender_kind"] | null
          id: string
          language: string | null
          menopause_stage:
            | Database["public"]["Enums"]["menopause_stage_kind"]
            | null
          name: string
          phone: string | null
          primary_concern: Database["public"]["Enums"]["concern_kind"] | null
          source: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          age?: number | null
          city?: string | null
          created_at?: string
          dob?: string | null
          email?: string | null
          gender?: Database["public"]["Enums"]["gender_kind"] | null
          id?: string
          language?: string | null
          menopause_stage?:
            | Database["public"]["Enums"]["menopause_stage_kind"]
            | null
          name: string
          phone?: string | null
          primary_concern?: Database["public"]["Enums"]["concern_kind"] | null
          source?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          age?: number | null
          city?: string | null
          created_at?: string
          dob?: string | null
          email?: string | null
          gender?: Database["public"]["Enums"]["gender_kind"] | null
          id?: string
          language?: string | null
          menopause_stage?:
            | Database["public"]["Enums"]["menopause_stage_kind"]
            | null
          name?: string
          phone?: string | null
          primary_concern?: Database["public"]["Enums"]["concern_kind"] | null
          source?: string | null
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
      milestone_definitions: {
        Row: {
          code: string
          description: string | null
          id: string
          level_required: Database["public"]["Enums"]["rebel_level"] | null
          points: number
          sort_order: number
          threshold_kind: string
          threshold_value: number
          title: string
        }
        Insert: {
          code: string
          description?: string | null
          id?: string
          level_required?: Database["public"]["Enums"]["rebel_level"] | null
          points?: number
          sort_order?: number
          threshold_kind: string
          threshold_value?: number
          title: string
        }
        Update: {
          code?: string
          description?: string | null
          id?: string
          level_required?: Database["public"]["Enums"]["rebel_level"] | null
          points?: number
          sort_order?: number
          threshold_kind?: string
          threshold_value?: number
          title?: string
        }
        Relationships: []
      }
      nutrition_scores: {
        Row: {
          consistency_pct: number
          hydration_pct: number
          protein_pct: number
          updated_at: string
          user_id: string
        }
        Insert: {
          consistency_pct?: number
          hydration_pct?: number
          protein_pct?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          consistency_pct?: number
          hydration_pct?: number
          protein_pct?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      outcome_checkins: {
        Row: {
          booking_id: string | null
          checkin_type: Database["public"]["Enums"]["checkin_kind"]
          consent_given: boolean
          created_at: string
          energy: number
          id: string
          joint_comfort: number
          overall_wellbeing: number
          person_id: string
          sleep_quality: number
          strength_capability: number
        }
        Insert: {
          booking_id?: string | null
          checkin_type: Database["public"]["Enums"]["checkin_kind"]
          consent_given?: boolean
          created_at?: string
          energy: number
          id?: string
          joint_comfort: number
          overall_wellbeing: number
          person_id: string
          sleep_quality: number
          strength_capability: number
        }
        Update: {
          booking_id?: string | null
          checkin_type?: Database["public"]["Enums"]["checkin_kind"]
          consent_given?: boolean
          created_at?: string
          energy?: number
          id?: string
          joint_comfort?: number
          overall_wellbeing?: number
          person_id?: string
          sleep_quality?: number
          strength_capability?: number
        }
        Relationships: [
          {
            foreignKeyName: "outcome_checkins_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      outcome_reports: {
        Row: {
          created_at: string
          doctor_pdf_url: string | null
          episode_id: string | null
          generated_at: string
          id: string
          member_id: string
          member_pdf_url: string | null
          snapshot: Json
        }
        Insert: {
          created_at?: string
          doctor_pdf_url?: string | null
          episode_id?: string | null
          generated_at?: string
          id?: string
          member_id: string
          member_pdf_url?: string | null
          snapshot?: Json
        }
        Update: {
          created_at?: string
          doctor_pdf_url?: string | null
          episode_id?: string | null
          generated_at?: string
          id?: string
          member_id?: string
          member_pdf_url?: string | null
          snapshot?: Json
        }
        Relationships: [
          {
            foreignKeyName: "outcome_reports_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "episodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "outcome_reports_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          age: number | null
          city: string | null
          created_at: string
          current_level: Database["public"]["Enums"]["rebel_level"]
          full_name: string | null
          goal_path: Database["public"]["Enums"]["path_choice"] | null
          id: string
          level_started_at: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          age?: number | null
          city?: string | null
          created_at?: string
          current_level?: Database["public"]["Enums"]["rebel_level"]
          full_name?: string | null
          goal_path?: Database["public"]["Enums"]["path_choice"] | null
          id: string
          level_started_at?: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          age?: number | null
          city?: string | null
          created_at?: string
          current_level?: Database["public"]["Enums"]["rebel_level"]
          full_name?: string | null
          goal_path?: Database["public"]["Enums"]["path_choice"] | null
          id?: string
          level_started_at?: string
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
      referrals: {
        Row: {
          created_at: string
          id: string
          member_id: string
          referring_doctor_id: string | null
          source_type: Database["public"]["Enums"]["referral_source_kind"]
        }
        Insert: {
          created_at?: string
          id?: string
          member_id: string
          referring_doctor_id?: string | null
          source_type: Database["public"]["Enums"]["referral_source_kind"]
        }
        Update: {
          created_at?: string
          id?: string
          member_id?: string
          referring_doctor_id?: string | null
          source_type?: Database["public"]["Enums"]["referral_source_kind"]
        }
        Relationships: [
          {
            foreignKeyName: "referrals_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referring_doctor_id_fkey"
            columns: ["referring_doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
        ]
      }
      session_logs: {
        Row: {
          attended: boolean
          coach_id: string | null
          created_at: string
          id: string
          key_work: string | null
          milestone_flag: boolean
          note: string | null
          person_id: string
          session_date: string
        }
        Insert: {
          attended?: boolean
          coach_id?: string | null
          created_at?: string
          id?: string
          key_work?: string | null
          milestone_flag?: boolean
          note?: string | null
          person_id: string
          session_date?: string
        }
        Update: {
          attended?: boolean
          coach_id?: string | null
          created_at?: string
          id?: string
          key_work?: string | null
          milestone_flag?: boolean
          note?: string | null
          person_id?: string
          session_date?: string
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
      symptom_checkins: {
        Row: {
          created_at: string
          id: string
          instrument: string
          member_id: string
          recorded_at: string
          subscores: Json
          total_score: number
        }
        Insert: {
          created_at?: string
          id?: string
          instrument?: string
          member_id: string
          recorded_at?: string
          subscores?: Json
          total_score: number
        }
        Update: {
          created_at?: string
          id?: string
          instrument?: string
          member_id?: string
          recorded_at?: string
          subscores?: Json
          total_score?: number
        }
        Relationships: [
          {
            foreignKeyName: "symptom_checkins_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
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
      compute_progress_score: {
        Args: { _user_id: string }
        Returns: {
          attendance_score: number
          coach_score: number
          completion_score: number
          milestone_score: number
          next_milestone: string | null
          next_step: string | null
          progress_to_next_level: number
          score: number
          sessions_lifetime: number
          updated_at: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "member_progress"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      consultation_taken_slots: {
        Args: { _date: string; _program: string }
        Returns: {
          consult_time: string
        }[]
      }
      get_family_progress: { Args: { _token: string }; Returns: Json }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_slot_count: { Args: { _slot_id: string }; Returns: undefined }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
      mark_booking_paid: {
        Args: { _booking_id: string; _razorpay_payment_id: string }
        Returns: undefined
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
      checkin_kind: "baseline" | "periodic"
      concern_kind:
        | "perimenopause"
        | "menopause_beyond"
        | "joints_knees"
        | "bone_balance"
        | "general"
        | "joints_bones"
      consultation_status: "pending" | "scheduled" | "completed" | "cancelled"
      episode_status_kind: "active" | "completed" | "paused"
      gender_kind: "female" | "male" | "other" | "prefer_not"
      measure_kind: "strength" | "balance" | "body_comp" | "dexa" | "functional"
      menopause_stage_kind: "cycling" | "peri" | "post" | "surgical" | "na"
      package_status_kind: "active" | "completed" | "renewed" | "lapsed"
      path_choice: "bohofit" | "bootcamp" | "longevity"
      rebel_level: "foundation" | "performance" | "longevity" | "fifty_plus"
      referral_source_kind: "doctor" | "group" | "self" | "web"
      session_mode_kind: "studio" | "online" | "home"
      session_status_kind: "scheduled" | "completed" | "missed" | "cancelled"
      slot_mode: "online" | "offline"
      slot_program: "bootcamp" | "longevity" | "group_classes"
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
      checkin_kind: ["baseline", "periodic"],
      concern_kind: [
        "perimenopause",
        "menopause_beyond",
        "joints_knees",
        "bone_balance",
        "general",
        "joints_bones",
      ],
      consultation_status: ["pending", "scheduled", "completed", "cancelled"],
      episode_status_kind: ["active", "completed", "paused"],
      gender_kind: ["female", "male", "other", "prefer_not"],
      measure_kind: ["strength", "balance", "body_comp", "dexa", "functional"],
      menopause_stage_kind: ["cycling", "peri", "post", "surgical", "na"],
      package_status_kind: ["active", "completed", "renewed", "lapsed"],
      path_choice: ["bohofit", "bootcamp", "longevity"],
      rebel_level: ["foundation", "performance", "longevity", "fifty_plus"],
      referral_source_kind: ["doctor", "group", "self", "web"],
      session_mode_kind: ["studio", "online", "home"],
      session_status_kind: ["scheduled", "completed", "missed", "cancelled"],
      slot_mode: ["online", "offline"],
      slot_program: ["bootcamp", "longevity", "group_classes"],
    },
  },
} as const
