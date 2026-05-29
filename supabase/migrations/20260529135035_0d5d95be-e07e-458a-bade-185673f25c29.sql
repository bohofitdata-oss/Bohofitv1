
-- =========================================================
-- REBEL PROGRESSION ENGINE — Wave 1 schema
-- =========================================================

-- 1. LEVELS ------------------------------------------------
CREATE TYPE public.rebel_level AS ENUM ('foundation','performance','longevity','fifty_plus');

ALTER TABLE public.profiles
  ADD COLUMN current_level public.rebel_level NOT NULL DEFAULT 'foundation',
  ADD COLUMN level_started_at timestamptz NOT NULL DEFAULT now();

-- 2. PROGRESS SCORE (cached per user) ----------------------
CREATE TABLE public.member_progress (
  user_id uuid PRIMARY KEY,
  score integer NOT NULL DEFAULT 0 CHECK (score BETWEEN 0 AND 100),
  attendance_score integer NOT NULL DEFAULT 0,
  completion_score integer NOT NULL DEFAULT 0,
  milestone_score integer NOT NULL DEFAULT 0,
  coach_score integer NOT NULL DEFAULT 70 CHECK (coach_score BETWEEN 0 AND 100),
  sessions_lifetime integer NOT NULL DEFAULT 0,
  next_step text,
  next_milestone text,
  progress_to_next_level integer NOT NULL DEFAULT 0 CHECK (progress_to_next_level BETWEEN 0 AND 100),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.member_progress TO authenticated;
GRANT ALL ON public.member_progress TO service_role;
ALTER TABLE public.member_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users read own progress" ON public.member_progress
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "staff read all progress" ON public.member_progress
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'coach'));
CREATE POLICY "staff write progress" ON public.member_progress
  FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'coach'))
  WITH CHECK (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'coach'));

-- 3. STREAKS -----------------------------------------------
CREATE TABLE public.member_streaks (
  user_id uuid PRIMARY KEY,
  current_streak integer NOT NULL DEFAULT 0,
  longest_streak integer NOT NULL DEFAULT 0,
  weeks_consistent integer NOT NULL DEFAULT 0,
  last_attended_date date,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.member_streaks TO authenticated;
GRANT ALL ON public.member_streaks TO service_role;
ALTER TABLE public.member_streaks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users read own streaks" ON public.member_streaks
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "staff read all streaks" ON public.member_streaks
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'coach'));

-- 4. MILESTONES --------------------------------------------
CREATE TABLE public.milestone_definitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  level_required public.rebel_level,
  threshold_kind text NOT NULL,          -- 'sessions' | 'streak' | 'manual' | 'mobility' | 'strength'
  threshold_value integer NOT NULL DEFAULT 0,
  points integer NOT NULL DEFAULT 10,
  sort_order integer NOT NULL DEFAULT 0
);

GRANT SELECT ON public.milestone_definitions TO anon, authenticated;
GRANT ALL ON public.milestone_definitions TO service_role;
ALTER TABLE public.milestone_definitions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone reads milestones" ON public.milestone_definitions
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins manage milestones" ON public.milestone_definitions
  FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin'))
  WITH CHECK (has_role(auth.uid(),'admin'));

CREATE TABLE public.member_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  milestone_id uuid NOT NULL REFERENCES public.milestone_definitions(id) ON DELETE CASCADE,
  earned_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, milestone_id)
);

GRANT SELECT ON public.member_milestones TO authenticated;
GRANT ALL ON public.member_milestones TO service_role;
ALTER TABLE public.member_milestones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users read own milestones" ON public.member_milestones
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "staff read all member milestones" ON public.member_milestones
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'coach'));
CREATE POLICY "staff award milestones" ON public.member_milestones
  FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'coach'));

-- Seed milestone catalog
INSERT INTO public.milestone_definitions (code,title,description,level_required,threshold_kind,threshold_value,points,sort_order) VALUES
  ('foundation_graduate','Foundation Graduate','Completed the Foundation pathway.','foundation','sessions',30,30,1),
  ('sessions_30','30 Classes Completed','Reached 30 lifetime classes.',NULL,'sessions',30,10,2),
  ('sessions_60','60 Classes Completed','Reached 60 lifetime classes.',NULL,'sessions',60,15,3),
  ('sessions_100','100 Classes Completed','Reached 100 lifetime classes.',NULL,'sessions',100,25,4),
  ('performance_ready','Performance Ready','Cleared the Performance readiness assessment.','foundation','manual',0,20,5),
  ('strength_milestone','Strength Milestone','Hit a key strength benchmark.',NULL,'strength',0,15,6),
  ('mobility_milestone','Mobility Milestone','Hit a key mobility benchmark.',NULL,'mobility',0,15,7),
  ('streak_4_weeks','4-Week Consistency','Trained consistently for 4 weeks.',NULL,'streak',4,10,8);

-- 5. FAMILY ECOSYSTEM --------------------------------------
CREATE TABLE public.family_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inviter_user_id uuid NOT NULL,
  invitee_name text NOT NULL,
  invitee_phone text,
  invitee_email text,
  relation text NOT NULL,                -- 'spouse' | 'parent' | 'sibling' | 'child' | 'other'
  status text NOT NULL DEFAULT 'pending',-- 'pending' | 'joined' | 'declined'
  joined_user_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.family_invites TO authenticated;
GRANT ALL ON public.family_invites TO service_role;
ALTER TABLE public.family_invites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users read own invites" ON public.family_invites
  FOR SELECT TO authenticated USING (auth.uid() = inviter_user_id);
CREATE POLICY "users create own invites" ON public.family_invites
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = inviter_user_id);
CREATE POLICY "users update own invites" ON public.family_invites
  FOR UPDATE TO authenticated USING (auth.uid() = inviter_user_id);
CREATE POLICY "staff read all invites" ON public.family_invites
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'coach'));

-- 6. NUTRITION SCORE (goBoho) ------------------------------
CREATE TABLE public.nutrition_scores (
  user_id uuid PRIMARY KEY,
  consistency_pct integer NOT NULL DEFAULT 0 CHECK (consistency_pct BETWEEN 0 AND 100),
  protein_pct integer NOT NULL DEFAULT 0 CHECK (protein_pct BETWEEN 0 AND 100),
  hydration_pct integer NOT NULL DEFAULT 0 CHECK (hydration_pct BETWEEN 0 AND 100),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.nutrition_scores TO authenticated;
GRANT ALL ON public.nutrition_scores TO service_role;
ALTER TABLE public.nutrition_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users read own nutrition" ON public.nutrition_scores
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "staff manage nutrition" ON public.nutrition_scores
  FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'coach'))
  WITH CHECK (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'coach'));

-- 7. COACH INTERVENTIONS (dropout-risk queue) --------------
CREATE TABLE public.coach_interventions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_user_id uuid NOT NULL,
  coach_user_id uuid,
  reason text NOT NULL,                  -- 'dropout_risk' | 'progression_ready' | 'inactive' | 'manual'
  status text NOT NULL DEFAULT 'open',   -- 'open' | 'resolved' | 'snoozed'
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz
);

GRANT SELECT, INSERT, UPDATE ON public.coach_interventions TO authenticated;
GRANT ALL ON public.coach_interventions TO service_role;
ALTER TABLE public.coach_interventions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff manage interventions" ON public.coach_interventions
  FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'coach'))
  WITH CHECK (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'coach'));

-- 8. SCORE FORMULA -----------------------------------------
-- Weights: 40% attendance, 25% completion, 20% milestones, 15% coach
CREATE OR REPLACE FUNCTION public.compute_progress_score(_user_id uuid)
RETURNS public.member_progress
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_attended_30 integer;
  v_planned_30 integer := 12; -- target: 3 sessions/week × 4 weeks
  v_attendance integer;
  v_completion integer := 0;
  v_milestone_pts integer := 0;
  v_milestone_total integer := 0;
  v_milestone integer;
  v_coach integer := 70;
  v_lifetime integer;
  v_level rebel_level;
  v_score integer;
  v_next_step text;
  v_next_milestone text;
  v_progress integer := 0;
  m_done public.longevity_members%ROWTYPE;
  v_row public.member_progress;
BEGIN
  SELECT current_level INTO v_level FROM profiles WHERE id = _user_id;
  IF v_level IS NULL THEN v_level := 'foundation'; END IF;

  -- Attendance (last 30 days)
  SELECT COUNT(*) INTO v_attended_30
    FROM progress_logs
    WHERE user_id = _user_id AND attended = true
      AND log_date >= CURRENT_DATE - INTERVAL '30 days';
  v_attendance := LEAST(100, ROUND(100.0 * v_attended_30 / v_planned_30));

  -- Lifetime sessions
  SELECT COUNT(*) INTO v_lifetime FROM progress_logs
    WHERE user_id = _user_id AND attended = true;

  -- Completion: longevity members track sessions_completed/sessions_total
  SELECT * INTO m_done FROM longevity_members WHERE user_id = _user_id LIMIT 1;
  IF FOUND AND m_done.sessions_total > 0 THEN
    v_completion := LEAST(100, ROUND(100.0 * m_done.sessions_completed / m_done.sessions_total));
  ELSE
    -- Fallback: progression toward next milestone threshold (30 sessions for foundation)
    v_completion := LEAST(100, ROUND(100.0 * v_lifetime / 30));
  END IF;

  -- Milestone points earned vs available at current level (or globally)
  SELECT COALESCE(SUM(d.points),0) INTO v_milestone_pts
    FROM member_milestones mm
    JOIN milestone_definitions d ON d.id = mm.milestone_id
    WHERE mm.user_id = _user_id;
  SELECT COALESCE(SUM(points),0) INTO v_milestone_total FROM milestone_definitions;
  IF v_milestone_total > 0 THEN
    v_milestone := LEAST(100, ROUND(100.0 * v_milestone_pts / v_milestone_total));
  ELSE
    v_milestone := 0;
  END IF;

  -- Coach score: previously saved (default 70)
  SELECT coach_score INTO v_coach FROM member_progress WHERE user_id = _user_id;
  IF v_coach IS NULL THEN v_coach := 70; END IF;

  v_score := ROUND(v_attendance*0.40 + v_completion*0.25 + v_milestone*0.20 + v_coach*0.15);

  -- Next milestone (smallest sessions threshold not yet earned)
  SELECT title INTO v_next_milestone
    FROM milestone_definitions d
    WHERE d.threshold_kind = 'sessions' AND d.threshold_value > v_lifetime
      AND NOT EXISTS (SELECT 1 FROM member_milestones mm WHERE mm.user_id = _user_id AND mm.milestone_id = d.id)
    ORDER BY d.threshold_value ASC LIMIT 1;

  -- Level thresholds
  IF v_level = 'foundation' THEN
    v_progress := LEAST(100, ROUND(GREATEST(v_score::numeric/70, v_lifetime::numeric/30) * 100 / 2 + LEAST(v_score::numeric/70,1)*50));
    IF v_score < 70 THEN
      v_next_step := 'Reach 70% progress score to unlock Performance.';
    ELSIF v_lifetime < 30 THEN
      v_next_step := 'Attend ' || (30 - v_lifetime) || ' more Foundation classes.';
    ELSE
      v_next_step := 'You qualify for Performance — book your readiness assessment.';
    END IF;
  ELSIF v_level = 'performance' THEN
    v_progress := LEAST(100, ROUND(LEAST(v_score::numeric/75, v_lifetime::numeric/60)*100));
    v_next_step := CASE
      WHEN v_score < 75 THEN 'Hold 75% progress score for two weeks.'
      WHEN v_lifetime < 60 THEN 'Attend ' || (60 - v_lifetime) || ' more classes.'
      ELSE 'Book your Longevity transition with a coach.'
    END;
  ELSIF v_level = 'longevity' THEN
    v_progress := 100;
    v_next_step := 'Maintain your Longevity protocol — log this week''s mobility check.';
  ELSE -- fifty_plus
    v_progress := LEAST(100, COALESCE(v_completion,0));
    v_next_step := CASE
      WHEN COALESCE(m_done.sessions_completed,0) = 0 THEN 'Schedule your first 50+ session.'
      ELSE 'Attend your next 50+ session this week.'
    END;
  END IF;

  INSERT INTO member_progress(user_id, score, attendance_score, completion_score, milestone_score, coach_score,
    sessions_lifetime, next_step, next_milestone, progress_to_next_level, updated_at)
  VALUES (_user_id, v_score, v_attendance, v_completion, v_milestone, v_coach,
    v_lifetime, v_next_step, v_next_milestone, v_progress, now())
  ON CONFLICT (user_id) DO UPDATE SET
    score = EXCLUDED.score,
    attendance_score = EXCLUDED.attendance_score,
    completion_score = EXCLUDED.completion_score,
    milestone_score = EXCLUDED.milestone_score,
    sessions_lifetime = EXCLUDED.sessions_lifetime,
    next_step = EXCLUDED.next_step,
    next_milestone = EXCLUDED.next_milestone,
    progress_to_next_level = EXCLUDED.progress_to_next_level,
    updated_at = now()
  RETURNING * INTO v_row;

  RETURN v_row;
END;
$$;

GRANT EXECUTE ON FUNCTION public.compute_progress_score(uuid) TO authenticated, service_role;

-- 9. AUTO-ASSIGN 50+ LEVEL ON AGE --------------------------
CREATE OR REPLACE FUNCTION public.sync_fifty_plus_level()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.age IS NOT NULL AND NEW.age >= 50 AND NEW.current_level <> 'fifty_plus' THEN
    NEW.current_level := 'fifty_plus';
    NEW.level_started_at := now();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_profiles_fifty_plus
  BEFORE INSERT OR UPDATE OF age ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.sync_fifty_plus_level();
