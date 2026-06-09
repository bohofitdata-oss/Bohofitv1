
-- Enums
DO $$ BEGIN CREATE TYPE public.concern_kind AS ENUM ('perimenopause','menopause_beyond','joints_knees','bone_balance'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.checkin_kind AS ENUM ('baseline','periodic'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.package_status_kind AS ENUM ('active','completed','renewed','lapsed'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 1. concern_intake
CREATE TABLE IF NOT EXISTS public.concern_intake (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  booking_id uuid REFERENCES public.bookings(id) ON DELETE SET NULL,
  concern_selected public.concern_kind NOT NULL,
  symptom_chips_selected text[] NOT NULL DEFAULT '{}',
  consent_given boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.concern_intake TO authenticated;
GRANT INSERT ON public.concern_intake TO anon;
GRANT ALL ON public.concern_intake TO service_role;
ALTER TABLE public.concern_intake ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon insert anonymous intake" ON public.concern_intake FOR INSERT TO anon WITH CHECK (person_id IS NULL);
CREATE POLICY "user insert own intake" ON public.concern_intake FOR INSERT TO authenticated WITH CHECK (person_id IS NULL OR person_id = auth.uid());
CREATE POLICY "user select own intake" ON public.concern_intake FOR SELECT TO authenticated USING (person_id = auth.uid() OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'coach'));
CREATE POLICY "user delete own intake" ON public.concern_intake FOR DELETE TO authenticated USING (person_id = auth.uid() OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'coach'));

-- 2. outcome_checkins
CREATE TABLE IF NOT EXISTS public.outcome_checkins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  booking_id uuid REFERENCES public.bookings(id) ON DELETE SET NULL,
  checkin_type public.checkin_kind NOT NULL,
  strength_capability smallint NOT NULL CHECK (strength_capability BETWEEN 1 AND 5),
  energy smallint NOT NULL CHECK (energy BETWEEN 1 AND 5),
  sleep_quality smallint NOT NULL CHECK (sleep_quality BETWEEN 1 AND 5),
  joint_comfort smallint NOT NULL CHECK (joint_comfort BETWEEN 1 AND 5),
  overall_wellbeing smallint NOT NULL CHECK (overall_wellbeing BETWEEN 1 AND 5),
  consent_given boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.outcome_checkins TO authenticated;
GRANT ALL ON public.outcome_checkins TO service_role;
ALTER TABLE public.outcome_checkins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user insert own checkin" ON public.outcome_checkins FOR INSERT TO authenticated WITH CHECK (person_id = auth.uid() AND consent_given = true);
CREATE POLICY "user select own checkin" ON public.outcome_checkins FOR SELECT TO authenticated USING (person_id = auth.uid() OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'coach'));
CREATE POLICY "user delete own checkin" ON public.outcome_checkins FOR DELETE TO authenticated USING (person_id = auth.uid() OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'coach'));

-- 3. session_logs
CREATE TABLE IF NOT EXISTS public.session_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  coach_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  session_date date NOT NULL DEFAULT CURRENT_DATE,
  attended boolean NOT NULL DEFAULT true,
  key_work text,
  milestone_flag boolean NOT NULL DEFAULT false,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.session_logs TO authenticated;
GRANT ALL ON public.session_logs TO service_role;
ALTER TABLE public.session_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff insert session log" ON public.session_logs FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'coach'));
CREATE POLICY "staff update session log" ON public.session_logs FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'coach'));
CREATE POLICY "staff delete session log" ON public.session_logs FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'coach'));
CREATE POLICY "user select own session log" ON public.session_logs FOR SELECT TO authenticated USING (person_id = auth.uid() OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'coach'));

-- 4. Extend longevity_members
ALTER TABLE public.longevity_members
  ADD COLUMN IF NOT EXISTS package_size integer NOT NULL DEFAULT 36,
  ADD COLUMN IF NOT EXISTS package_status public.package_status_kind NOT NULL DEFAULT 'active';

-- 5. Trigger: when an attended session_log row is inserted for a longevity member, increment sessions_completed and flip package_status to completed when threshold met.
CREATE OR REPLACE FUNCTION public.bump_longevity_sessions()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  m public.longevity_members%ROWTYPE;
BEGIN
  IF NEW.attended IS NOT TRUE THEN RETURN NEW; END IF;
  SELECT * INTO m FROM public.longevity_members WHERE user_id = NEW.person_id LIMIT 1;
  IF NOT FOUND THEN RETURN NEW; END IF;
  UPDATE public.longevity_members
    SET sessions_completed = COALESCE(sessions_completed,0) + 1,
        package_status = CASE
          WHEN COALESCE(sessions_completed,0) + 1 >= COALESCE(package_size,36) AND package_status = 'active'
          THEN 'completed'::public.package_status_kind
          ELSE package_status
        END
    WHERE id = m.id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_session_logs_bump ON public.session_logs;
CREATE TRIGGER trg_session_logs_bump AFTER INSERT ON public.session_logs
  FOR EACH ROW EXECUTE FUNCTION public.bump_longevity_sessions();
