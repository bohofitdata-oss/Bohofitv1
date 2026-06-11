
-- Extend existing concern_kind
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum e JOIN pg_type t ON t.oid=e.enumtypid WHERE t.typname='concern_kind' AND e.enumlabel='general') THEN
    ALTER TYPE public.concern_kind ADD VALUE 'general';
  END IF;
END $$;

-- Other enums
DO $$ BEGIN CREATE TYPE public.menopause_stage_kind AS ENUM ('cycling','peri','post','surgical','na'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.gender_kind AS ENUM ('female','male','other','prefer_not'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.measure_kind AS ENUM ('strength','balance','body_comp','dexa','functional'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.episode_status_kind AS ENUM ('active','completed','paused'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.session_status_kind AS ENUM ('scheduled','completed','missed','cancelled'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.session_mode_kind AS ENUM ('studio','online','home'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.referral_source_kind AS ENUM ('doctor','group','self','web'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('admin','coach'));
$$;

CREATE TABLE public.members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL, dob date, age int,
  gender public.gender_kind,
  menopause_stage public.menopause_stage_kind,
  primary_concern public.concern_kind,
  city text, language text, phone text, email text, source text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.members TO authenticated;
GRANT ALL ON public.members TO service_role;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
CREATE POLICY members_self_select ON public.members FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY members_self_insert ON public.members FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY members_self_update ON public.members FOR UPDATE TO authenticated USING (user_id = auth.uid() OR public.is_staff(auth.uid())) WITH CHECK (user_id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY members_staff_delete ON public.members FOR DELETE TO authenticated USING (public.is_staff(auth.uid()));
CREATE TRIGGER trg_members_updated BEFORE UPDATE ON public.members FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.consents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  health_data_opt_in boolean NOT NULL DEFAULT false,
  marketing_opt_in boolean NOT NULL DEFAULT false,
  waiver_accepted boolean NOT NULL DEFAULT false,
  version text NOT NULL DEFAULT 'v1',
  consented_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.consents TO authenticated;
GRANT ALL ON public.consents TO service_role;
ALTER TABLE public.consents ENABLE ROW LEVEL SECURITY;
CREATE POLICY consents_self ON public.consents FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.members m WHERE m.id = member_id AND (m.user_id = auth.uid() OR public.is_staff(auth.uid()))))
  WITH CHECK (EXISTS (SELECT 1 FROM public.members m WHERE m.id = member_id AND m.user_id = auth.uid()));

CREATE TABLE public.intake_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  concern public.concern_kind NOT NULL,
  responses jsonb NOT NULL DEFAULT '{}'::jsonb,
  par_q jsonb NOT NULL DEFAULT '{}'::jsonb,
  clearance_required boolean NOT NULL DEFAULT false,
  goal_text text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.intake_responses TO authenticated;
GRANT ALL ON public.intake_responses TO service_role;
ALTER TABLE public.intake_responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY intake_self ON public.intake_responses FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.members m WHERE m.id = member_id AND (m.user_id = auth.uid() OR public.is_staff(auth.uid()))))
  WITH CHECK (EXISTS (SELECT 1 FROM public.members m WHERE m.id = member_id AND m.user_id = auth.uid()));

CREATE TABLE public.symptom_checkins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  instrument text NOT NULL DEFAULT 'MRS',
  total_score int NOT NULL,
  subscores jsonb NOT NULL DEFAULT '{}'::jsonb,
  recorded_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.symptom_checkins TO authenticated;
GRANT ALL ON public.symptom_checkins TO service_role;
ALTER TABLE public.symptom_checkins ENABLE ROW LEVEL SECURITY;
CREATE POLICY symptom_self ON public.symptom_checkins FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.members m WHERE m.id = member_id AND (m.user_id = auth.uid() OR public.is_staff(auth.uid()))))
  WITH CHECK (EXISTS (SELECT 1 FROM public.members m WHERE m.id = member_id AND (m.user_id = auth.uid() OR public.is_staff(auth.uid()))));

CREATE TABLE public.episodes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  block_number int NOT NULL DEFAULT 1,
  program_track public.concern_kind NOT NULL,
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  end_date date,
  status public.episode_status_kind NOT NULL DEFAULT 'active',
  sessions_total int NOT NULL DEFAULT 36,
  sessions_completed int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.episodes TO authenticated;
GRANT ALL ON public.episodes TO service_role;
ALTER TABLE public.episodes ENABLE ROW LEVEL SECURITY;
CREATE POLICY episodes_self_select ON public.episodes FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.members m WHERE m.id = member_id AND (m.user_id = auth.uid() OR public.is_staff(auth.uid()))));
CREATE POLICY episodes_staff_write ON public.episodes FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER trg_episodes_updated BEFORE UPDATE ON public.episodes FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.measures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  episode_id uuid REFERENCES public.episodes(id) ON DELETE SET NULL,
  measure_type public.measure_kind NOT NULL,
  metric_name text NOT NULL,
  value numeric NOT NULL,
  unit text,
  recorded_at timestamptz NOT NULL DEFAULT now(),
  recorded_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.measures TO authenticated;
GRANT ALL ON public.measures TO service_role;
ALTER TABLE public.measures ENABLE ROW LEVEL SECURITY;
CREATE POLICY measures_self_select ON public.measures FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.members m WHERE m.id = member_id AND (m.user_id = auth.uid() OR public.is_staff(auth.uid()))));
CREATE POLICY measures_staff_write ON public.measures FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE TABLE public.coaches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name text NOT NULL, bio text, photo_url text, band text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.coaches TO authenticated;
GRANT ALL ON public.coaches TO service_role;
ALTER TABLE public.coaches ENABLE ROW LEVEL SECURITY;
CREATE POLICY coaches_read ON public.coaches FOR SELECT TO authenticated USING (true);
CREATE POLICY coaches_staff_write ON public.coaches FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE TABLE public.doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL, clinic text, specialty text, photo_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.doctors TO authenticated;
GRANT ALL ON public.doctors TO service_role;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
CREATE POLICY doctors_read ON public.doctors FOR SELECT TO authenticated USING (true);
CREATE POLICY doctors_staff_write ON public.doctors FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE TABLE public.member_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  episode_id uuid NOT NULL REFERENCES public.episodes(id) ON DELETE CASCADE,
  member_id uuid NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  coach_id uuid REFERENCES public.coaches(id) ON DELETE SET NULL,
  scheduled_at timestamptz, completed_at timestamptz,
  status public.session_status_kind NOT NULL DEFAULT 'scheduled',
  mode public.session_mode_kind,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.member_sessions TO authenticated;
GRANT ALL ON public.member_sessions TO service_role;
ALTER TABLE public.member_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY msessions_self_select ON public.member_sessions FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.members m WHERE m.id = member_id AND (m.user_id = auth.uid() OR public.is_staff(auth.uid()))));
CREATE POLICY msessions_staff_write ON public.member_sessions FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE TABLE public.member_session_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.member_sessions(id) ON DELETE CASCADE,
  exercises jsonb NOT NULL DEFAULT '[]'::jsonb,
  flags jsonb NOT NULL DEFAULT '{}'::jsonb,
  notes text,
  logged_by uuid REFERENCES auth.users(id),
  logged_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.member_session_logs TO authenticated;
GRANT ALL ON public.member_session_logs TO service_role;
ALTER TABLE public.member_session_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY mslogs_self_select ON public.member_session_logs FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.member_sessions s JOIN public.members m ON m.id = s.member_id WHERE s.id = session_id AND (m.user_id = auth.uid() OR public.is_staff(auth.uid()))));
CREATE POLICY mslogs_staff_write ON public.member_session_logs FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE TABLE public.gynae_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  episode_id uuid REFERENCES public.episodes(id) ON DELETE SET NULL,
  doctor_id uuid REFERENCES public.doctors(id) ON DELETE SET NULL,
  summary text, file_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gynae_reports TO authenticated;
GRANT ALL ON public.gynae_reports TO service_role;
ALTER TABLE public.gynae_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY gynae_self_select ON public.gynae_reports FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.members m WHERE m.id = member_id AND (m.user_id = auth.uid() OR public.is_staff(auth.uid()))));
CREATE POLICY gynae_staff_write ON public.gynae_reports FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE TABLE public.outcome_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  episode_id uuid REFERENCES public.episodes(id) ON DELETE SET NULL,
  generated_at timestamptz NOT NULL DEFAULT now(),
  member_pdf_url text, doctor_pdf_url text,
  snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.outcome_reports TO authenticated;
GRANT ALL ON public.outcome_reports TO service_role;
ALTER TABLE public.outcome_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY outcome_self_select ON public.outcome_reports FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.members m WHERE m.id = member_id AND (m.user_id = auth.uid() OR public.is_staff(auth.uid()))));
CREATE POLICY outcome_staff_write ON public.outcome_reports FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE TABLE public.referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  source_type public.referral_source_kind NOT NULL,
  referring_doctor_id uuid REFERENCES public.doctors(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.referrals TO authenticated;
GRANT ALL ON public.referrals TO service_role;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY referrals_self ON public.referrals FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.members m WHERE m.id = member_id AND (m.user_id = auth.uid() OR public.is_staff(auth.uid()))))
  WITH CHECK (EXISTS (SELECT 1 FROM public.members m WHERE m.id = member_id AND m.user_id = auth.uid()));
