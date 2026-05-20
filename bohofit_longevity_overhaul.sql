-- Longevity (50+) overhaul migration for bohofitdata-oss.
-- Run AFTER bohofit_full_schema.sql in the external project's SQL editor.
-- Safe to re-run: uses IF NOT EXISTS / DROP POLICY IF EXISTS guards.

BEGIN;

-- 1. New enum
DO $$ BEGIN
  CREATE TYPE public.wellness_tier AS ENUM ('preventive','corrective','critical');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2. Extend longevity_members
ALTER TABLE public.longevity_members
  ADD COLUMN IF NOT EXISTS tier public.wellness_tier;

-- 3. health_assessments
CREATE TABLE IF NOT EXISTS public.health_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  age integer,
  city text,
  language text NOT NULL DEFAULT 'en',
  conditions text[] NOT NULL DEFAULT '{}',
  pain_points text[] NOT NULL DEFAULT '{}',
  current_meds text,
  mobility_level smallint,
  goal text,
  recommended_tier public.wellness_tier,
  family_name text,
  family_phone text,
  family_relation text,
  family_updates_opt_in boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'new',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.health_assessments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anyone can submit assessment" ON public.health_assessments;
CREATE POLICY "anyone can submit assessment"
  ON public.health_assessments FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(name) BETWEEN 1 AND 120
    AND length(phone) BETWEEN 6 AND 20
  );

DROP POLICY IF EXISTS "staff read assessments" ON public.health_assessments;
CREATE POLICY "staff read assessments"
  ON public.health_assessments FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'coach'));

DROP POLICY IF EXISTS "staff update assessments" ON public.health_assessments;
CREATE POLICY "staff update assessments"
  ON public.health_assessments FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'coach'));

-- 4. slot_requests
CREATE TABLE IF NOT EXISTS public.slot_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  preferred_day text,
  preferred_time text,
  note text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.slot_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anyone can request slot" ON public.slot_requests;
CREATE POLICY "anyone can request slot"
  ON public.slot_requests FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(name) BETWEEN 1 AND 120
    AND length(phone) BETWEEN 6 AND 20
  );

DROP POLICY IF EXISTS "staff read slot requests" ON public.slot_requests;
CREATE POLICY "staff read slot requests"
  ON public.slot_requests FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'coach'));

DROP POLICY IF EXISTS "staff update slot requests" ON public.slot_requests;
CREATE POLICY "staff update slot requests"
  ON public.slot_requests FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'coach'));

-- 5. family_updates
CREATE TABLE IF NOT EXISTS public.family_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid REFERENCES public.longevity_members(id) ON DELETE CASCADE,
  sent_to_phone text NOT NULL,
  message text NOT NULL,
  sent_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.family_updates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "staff manage family updates" ON public.family_updates;
CREATE POLICY "staff manage family updates"
  ON public.family_updates FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'coach'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'coach'));

COMMIT;
