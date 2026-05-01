-- 50+ member program record (1 per member)
CREATE TABLE public.longevity_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  first_name text NOT NULL,
  program_name text NOT NULL DEFAULT 'Bohofit at 50+',
  sessions_total integer NOT NULL DEFAULT 24,
  sessions_completed integer NOT NULL DEFAULT 0,
  family_name text,
  family_phone text,
  family_share_token uuid,
  next_session_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.longevity_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "members read own 50+ row" ON public.longevity_members
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "members update own 50+ row" ON public.longevity_members
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "members insert own 50+ row" ON public.longevity_members
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "staff manage 50+ rows" ON public.longevity_members
  FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'coach'))
  WITH CHECK (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'coach'));

CREATE TRIGGER trg_longevity_members_updated
  BEFORE UPDATE ON public.longevity_members
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Trainer-logged sessions
CREATE TABLE public.longevity_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid NOT NULL REFERENCES public.longevity_members(id) ON DELETE CASCADE,
  session_number integer NOT NULL,
  session_date date NOT NULL DEFAULT CURRENT_DATE,
  workout text,
  observation text,
  modification text,
  share_with_family boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.longevity_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "members read own sessions" ON public.longevity_sessions
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.longevity_members m WHERE m.id = member_id AND m.user_id = auth.uid()));
CREATE POLICY "staff manage sessions" ON public.longevity_sessions
  FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'coach'))
  WITH CHECK (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'coach'));

-- Member milestones (1 row per member)
CREATE TABLE public.longevity_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid NOT NULL UNIQUE REFERENCES public.longevity_members(id) ON DELETE CASCADE,
  stairs boolean NOT NULL DEFAULT false,
  sit_stand boolean NOT NULL DEFAULT false,
  stronger boolean NOT NULL DEFAULT false,
  sleep_better boolean NOT NULL DEFAULT false,
  more_energy boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.longevity_milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "members read own milestones" ON public.longevity_milestones
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.longevity_members m WHERE m.id = member_id AND m.user_id = auth.uid()));
CREATE POLICY "members upsert own milestones" ON public.longevity_milestones
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.longevity_members m WHERE m.id = member_id AND m.user_id = auth.uid()));
CREATE POLICY "members update own milestones" ON public.longevity_milestones
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.longevity_members m WHERE m.id = member_id AND m.user_id = auth.uid()));
CREATE POLICY "staff manage milestones" ON public.longevity_milestones
  FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'coach'))
  WITH CHECK (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'coach'));

CREATE TRIGGER trg_longevity_milestones_updated
  BEFORE UPDATE ON public.longevity_milestones
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Weekly check-ins
CREATE TABLE public.longevity_checkins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid NOT NULL REFERENCES public.longevity_members(id) ON DELETE CASCADE,
  energy smallint NOT NULL CHECK (energy BETWEEN 1 AND 5),
  pain_level smallint NOT NULL CHECK (pain_level BETWEEN 1 AND 5),
  pain_part text,
  sleep smallint NOT NULL CHECK (sleep BETWEEN 1 AND 5),
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.longevity_checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "members read own checkins" ON public.longevity_checkins
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.longevity_members m WHERE m.id = member_id AND m.user_id = auth.uid()));
CREATE POLICY "members insert own checkins" ON public.longevity_checkins
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.longevity_members m WHERE m.id = member_id AND m.user_id = auth.uid()));
CREATE POLICY "staff read checkins" ON public.longevity_checkins
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'coach'));

-- Public family progress fetch via token (no auth needed)
CREATE OR REPLACE FUNCTION public.get_family_progress(_token uuid)
RETURNS jsonb
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  m public.longevity_members%ROWTYPE;
  last_session public.longevity_sessions%ROWTYPE;
BEGIN
  SELECT * INTO m FROM public.longevity_members WHERE family_share_token = _token;
  IF NOT FOUND THEN
    RETURN NULL;
  END IF;
  SELECT * INTO last_session FROM public.longevity_sessions
    WHERE member_id = m.id AND share_with_family = true
    ORDER BY session_date DESC, created_at DESC LIMIT 1;
  RETURN jsonb_build_object(
    'first_name', m.first_name,
    'program_name', m.program_name,
    'sessions_completed', m.sessions_completed,
    'sessions_total', m.sessions_total,
    'next_session_at', m.next_session_at,
    'last_session_date', last_session.session_date,
    'trainer_note', last_session.observation
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_family_progress(uuid) TO anon, authenticated;