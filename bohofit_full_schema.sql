-- ============================================================================
-- BOHOFIT — COMPLETE DATABASE SCHEMA
-- Run this in the SQL editor of the external project
-- (https://fuitymjndkmltlxstiqj.supabase.co)
-- Then run: bohofit_slots_seed.sql, then bohofit_longevity_overhaul.sql
-- Safe to re-run: uses IF NOT EXISTS / DROP POLICY IF EXISTS guards.
-- ============================================================================

BEGIN;

-- ----------------------------------------------------------------------------
-- 1. EXTENSIONS
-- ----------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ----------------------------------------------------------------------------
-- 2. ENUMS
-- ----------------------------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin','coach','member');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.goal_path AS ENUM ('bootcamp','longevity','group_classes','diet','rehab');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.slot_program AS ENUM ('bootcamp','longevity','group_classes');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.booking_status AS ENUM ('pending','paid','cancelled','refunded');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.booking_mode AS ENUM ('studio','online','hybrid');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.booking_tier AS ENUM ('starter','standard','premium');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ----------------------------------------------------------------------------
-- 3. UTILITY FUNCTIONS
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public' AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- ----------------------------------------------------------------------------
-- 4. USER ROLES (created before has_role)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

DROP POLICY IF EXISTS "users read own roles" ON public.user_roles;
CREATE POLICY "users read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "admins read all roles" ON public.user_roles;
CREATE POLICY "admins read all roles" ON public.user_roles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS "admins manage roles" ON public.user_roles;
CREATE POLICY "admins manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ----------------------------------------------------------------------------
-- 5. PROFILES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY,
  full_name text,
  phone text,
  city text,
  age integer,
  goal_path public.goal_path,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users read own profile" ON public.profiles;
CREATE POLICY "users read own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "users insert own profile" ON public.profiles;
CREATE POLICY "users insert own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "users update own profile" ON public.profiles;
CREATE POLICY "users update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "admins read all profiles" ON public.profiles;
CREATE POLICY "admins read all profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'coach'));

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ----------------------------------------------------------------------------
-- 6. NEW-USER HOOK
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name',''));
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'member');
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ----------------------------------------------------------------------------
-- 7. PROGRAMS & BATCHES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path public.goal_path NOT NULL,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  duration_weeks integer,
  price_inr integer,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anyone reads active programs" ON public.programs;
CREATE POLICY "anyone reads active programs" ON public.programs
  FOR SELECT TO anon, authenticated
  USING (active = true OR public.has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS "admins manage programs" ON public.programs;
CREATE POLICY "admins manage programs" ON public.programs
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE IF NOT EXISTS public.batches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid NOT NULL,
  start_date date NOT NULL,
  capacity integer NOT NULL DEFAULT 20,
  spots_left integer NOT NULL DEFAULT 20,
  schedule text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.batches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anyone reads batches" ON public.batches;
CREATE POLICY "anyone reads batches" ON public.batches
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admins manage batches" ON public.batches;
CREATE POLICY "admins manage batches" ON public.batches
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ----------------------------------------------------------------------------
-- 8. SLOTS + AVAILABILITY FUNCTIONS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program public.slot_program NOT NULL,
  start_time time NOT NULL,
  capacity integer NOT NULL,
  confirmed_count integer NOT NULL DEFAULT 0,
  is_locked boolean NOT NULL DEFAULT false,
  batch_start_date date NOT NULL DEFAULT '2026-05-01',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.slots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anyone reads slots" ON public.slots;
CREATE POLICY "anyone reads slots" ON public.slots
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admins manage slots" ON public.slots;
CREATE POLICY "admins manage slots" ON public.slots
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ----------------------------------------------------------------------------
-- 9. SLOT BOOKINGS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.slot_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  program public.slot_program NOT NULL,
  mode public.booking_mode NOT NULL,
  tier public.booking_tier,
  primary_slot_id uuid REFERENCES public.slots(id) ON DELETE SET NULL,
  secondary_slot_id uuid REFERENCES public.slots(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  phone text NOT NULL,
  email text,
  age integer,
  city text,
  conditions jsonb NOT NULL DEFAULT '{}'::jsonb,
  needs_rehab boolean NOT NULL DEFAULT false,
  tnc_accepted jsonb NOT NULL DEFAULT '{}'::jsonb,
  status public.booking_status NOT NULL DEFAULT 'pending',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.slot_bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anyone can book" ON public.slot_bookings;
CREATE POLICY "anyone can book" ON public.slot_bookings
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(full_name) BETWEEN 1 AND 120
    AND length(phone) BETWEEN 6 AND 20
  );

DROP POLICY IF EXISTS "users read own bookings" ON public.slot_bookings;
CREATE POLICY "users read own bookings" ON public.slot_bookings
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "staff read all bookings" ON public.slot_bookings;
CREATE POLICY "staff read all bookings" ON public.slot_bookings
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'coach'));

DROP POLICY IF EXISTS "staff update bookings" ON public.slot_bookings;
CREATE POLICY "staff update bookings" ON public.slot_bookings
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'coach'));

-- Slot count trigger
CREATE OR REPLACE FUNCTION public.update_slot_count()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE v_count integer; v_capacity integer;
BEGIN
  IF NEW.primary_slot_id IS NOT NULL THEN
    SELECT COUNT(*) INTO v_count FROM public.slot_bookings
      WHERE primary_slot_id = NEW.primary_slot_id AND status IN ('pending','paid');
    SELECT capacity INTO v_capacity FROM public.slots WHERE id = NEW.primary_slot_id;
    UPDATE public.slots
      SET confirmed_count = v_count,
          is_locked = (v_count >= LEAST(v_capacity, 3))
      WHERE id = NEW.primary_slot_id;
  END IF;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS trg_update_slot_count ON public.slot_bookings;
CREATE TRIGGER trg_update_slot_count
  AFTER INSERT OR UPDATE ON public.slot_bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_slot_count();

-- Availability RPCs
CREATE OR REPLACE FUNCTION public.slot_availability(_slot_id uuid)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE s public.slots%ROWTYPE; active_count integer;
BEGIN
  SELECT * INTO s FROM public.slots WHERE id = _slot_id;
  IF NOT FOUND THEN RETURN NULL; END IF;
  SELECT COUNT(*) INTO active_count FROM public.slot_bookings
    WHERE primary_slot_id = _slot_id AND status IN ('pending','paid');
  RETURN jsonb_build_object(
    'slot_id', s.id, 'program', s.program, 'start_time', s.start_time,
    'capacity', s.capacity, 'booked', active_count,
    'remaining', GREATEST(s.capacity - active_count, 0),
    'is_locked', s.is_locked OR active_count >= s.capacity
  );
END; $$;

CREATE OR REPLACE FUNCTION public.program_slot_availability(_program public.slot_program)
RETURNS TABLE(slot_id uuid, start_time time, capacity integer, booked integer, remaining integer, is_locked boolean)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT s.id, s.start_time, s.capacity,
    COALESCE(b.cnt,0)::int,
    GREATEST(s.capacity - COALESCE(b.cnt,0),0)::int,
    s.is_locked OR COALESCE(b.cnt,0) >= s.capacity
  FROM public.slots s
  LEFT JOIN (
    SELECT primary_slot_id, COUNT(*)::int AS cnt
    FROM public.slot_bookings
    WHERE status IN ('pending','paid')
    GROUP BY primary_slot_id
  ) b ON b.primary_slot_id = s.id
  WHERE s.program = _program
  ORDER BY s.start_time;
$$;

CREATE OR REPLACE FUNCTION public.increment_slot_count(_slot_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE v_capacity integer;
BEGIN
  SELECT capacity INTO v_capacity FROM public.slots WHERE id = _slot_id FOR UPDATE;
  IF NOT FOUND THEN RETURN; END IF;
  UPDATE public.slots
    SET confirmed_count = confirmed_count + 1,
        is_locked = (confirmed_count + 1) >= v_capacity
    WHERE id = _slot_id;
END; $$;

-- ----------------------------------------------------------------------------
-- 10. BOOKINGS (legacy lead-style form)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  age integer,
  city text,
  goal text,
  program text NOT NULL,
  plan text,
  mode text,
  health_conditions text[] NOT NULL DEFAULT '{}',
  primary_slot text,
  secondary_slot text,
  rules_accepted boolean NOT NULL DEFAULT false,
  is_trial boolean NOT NULL DEFAULT false,
  reschedule_count integer NOT NULL DEFAULT 0,
  payment_status text NOT NULL DEFAULT 'pending',
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anyone can create booking" ON public.bookings;
CREATE POLICY "anyone can create booking" ON public.bookings
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(name) BETWEEN 1 AND 120
    AND length(phone) BETWEEN 6 AND 20
    AND rules_accepted = true
  );

DROP POLICY IF EXISTS "staff read bookings" ON public.bookings;
CREATE POLICY "staff read bookings" ON public.bookings
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'coach'));

DROP POLICY IF EXISTS "staff update bookings" ON public.bookings;
CREATE POLICY "staff update bookings" ON public.bookings
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'coach'));

CREATE OR REPLACE FUNCTION public.mark_booking_paid(_booking_id uuid, _razorpay_payment_id text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  UPDATE public.bookings
    SET payment_status = 'paid', status = 'confirmed'
    WHERE id = _booking_id;
END; $$;

-- ----------------------------------------------------------------------------
-- 11. LEADS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  phone text NOT NULL,
  email text,
  age integer,
  city text,
  goal text,
  path public.goal_path NOT NULL,
  status text NOT NULL DEFAULT 'new',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anyone can submit a lead" ON public.leads;
CREATE POLICY "anyone can submit a lead" ON public.leads
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(full_name) BETWEEN 1 AND 120
    AND length(phone) BETWEEN 6 AND 20
  );

DROP POLICY IF EXISTS "admins read leads" ON public.leads;
CREATE POLICY "admins read leads" ON public.leads
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'coach'));

DROP POLICY IF EXISTS "admins update leads" ON public.leads;
CREATE POLICY "admins update leads" ON public.leads
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'coach'));

-- ----------------------------------------------------------------------------
-- 12. MEMBERSHIPS + PAUSES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  program text NOT NULL,
  tier text NOT NULL,
  delivery text NOT NULL DEFAULT 'studio',
  price_inr integer NOT NULL DEFAULT 0,
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  end_date date NOT NULL,
  status text NOT NULL DEFAULT 'active',
  pause_balance_days integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own memberships" ON public.memberships;
CREATE POLICY "Users view own memberships" ON public.memberships
  FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS "Users insert own memberships" ON public.memberships;
CREATE POLICY "Users insert own memberships" ON public.memberships
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own memberships" ON public.memberships;
CREATE POLICY "Users update own memberships" ON public.memberships
  FOR UPDATE USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS "Admins delete memberships" ON public.memberships;
CREATE POLICY "Admins delete memberships" ON public.memberships
  FOR DELETE USING (public.has_role(auth.uid(),'admin'));

DROP TRIGGER IF EXISTS trg_memberships_updated_at ON public.memberships;
CREATE TRIGGER trg_memberships_updated_at BEFORE UPDATE ON public.memberships
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.membership_pauses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  membership_id uuid NOT NULL REFERENCES public.memberships(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  pause_start date NOT NULL,
  pause_end date NOT NULL,
  days integer NOT NULL,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.membership_pauses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own pauses" ON public.membership_pauses;
CREATE POLICY "Users view own pauses" ON public.membership_pauses
  FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS "Users insert own pauses" ON public.membership_pauses;
CREATE POLICY "Users insert own pauses" ON public.membership_pauses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.request_membership_pause(_membership_id uuid, _start date, _days integer, _reason text DEFAULT NULL)
RETURNS public.membership_pauses LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE m public.memberships%ROWTYPE; p public.membership_pauses%ROWTYPE; min_days integer;
BEGIN
  SELECT * INTO m FROM public.memberships WHERE id = _membership_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Membership not found'; END IF;
  IF m.user_id <> auth.uid() THEN RAISE EXCEPTION 'Not your membership'; END IF;
  IF m.status <> 'active' THEN RAISE EXCEPTION 'Membership is not active'; END IF;
  IF _days <= 0 THEN RAISE EXCEPTION 'Days must be positive'; END IF;
  IF _days > m.pause_balance_days THEN RAISE EXCEPTION 'Not enough pause balance (% left)', m.pause_balance_days; END IF;
  IF _start < CURRENT_DATE THEN RAISE EXCEPTION 'Start date must be today or later'; END IF;
  IF m.pause_balance_days > 2 THEN min_days := 2; ELSE min_days := 1; END IF;
  IF _days < min_days THEN RAISE EXCEPTION 'Minimum pause is % day(s)', min_days; END IF;

  INSERT INTO public.membership_pauses(membership_id, user_id, pause_start, pause_end, days, reason)
  VALUES (_membership_id, auth.uid(), _start, _start + (_days - 1), _days, _reason)
  RETURNING * INTO p;

  UPDATE public.memberships
    SET pause_balance_days = pause_balance_days - _days,
        end_date = end_date + _days,
        updated_at = now()
    WHERE id = _membership_id;

  RETURN p;
END; $$;

-- ----------------------------------------------------------------------------
-- 13. SUBSCRIPTIONS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  program_id uuid REFERENCES public.programs(id) ON DELETE SET NULL,
  batch_id uuid REFERENCES public.batches(id) ON DELETE SET NULL,
  start_date date,
  end_date date,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users read own subs" ON public.subscriptions;
CREATE POLICY "users read own subs" ON public.subscriptions
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "staff read subs" ON public.subscriptions;
CREATE POLICY "staff read subs" ON public.subscriptions
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'coach'));

DROP POLICY IF EXISTS "staff manage subs" ON public.subscriptions;
CREATE POLICY "staff manage subs" ON public.subscriptions
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'coach'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'coach'));

-- ----------------------------------------------------------------------------
-- 14. MEDICAL HISTORY
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.medical_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  conditions jsonb NOT NULL DEFAULT '{}'::jsonb,
  attachments jsonb NOT NULL DEFAULT '[]'::jsonb,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.medical_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own medical" ON public.medical_history;
CREATE POLICY "Users view own medical" ON public.medical_history
  FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS "Users insert own medical" ON public.medical_history;
CREATE POLICY "Users insert own medical" ON public.medical_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own medical" ON public.medical_history;
CREATE POLICY "Users update own medical" ON public.medical_history
  FOR UPDATE USING (auth.uid() = user_id);

DROP TRIGGER IF EXISTS trg_medical_history_updated_at ON public.medical_history;
CREATE TRIGGER trg_medical_history_updated_at BEFORE UPDATE ON public.medical_history
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ----------------------------------------------------------------------------
-- 15. PROGRESS LOGS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.progress_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  log_date date NOT NULL DEFAULT CURRENT_DATE,
  weight_kg numeric,
  attended boolean DEFAULT false,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.progress_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users read own logs" ON public.progress_logs;
CREATE POLICY "users read own logs" ON public.progress_logs
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users insert own logs" ON public.progress_logs;
CREATE POLICY "users insert own logs" ON public.progress_logs
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "users update own logs" ON public.progress_logs;
CREATE POLICY "users update own logs" ON public.progress_logs
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "staff read logs" ON public.progress_logs;
CREATE POLICY "staff read logs" ON public.progress_logs
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'coach'));

-- ----------------------------------------------------------------------------
-- 16. DIET PLANS + FOOD LOGS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.diet_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  goal text,
  meals jsonb NOT NULL DEFAULT '[]'::jsonb,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.diet_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users read own diet" ON public.diet_plans;
CREATE POLICY "users read own diet" ON public.diet_plans
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users upsert own diet" ON public.diet_plans;
CREATE POLICY "users upsert own diet" ON public.diet_plans
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "users update own diet" ON public.diet_plans;
CREATE POLICY "users update own diet" ON public.diet_plans
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "staff read diets" ON public.diet_plans;
CREATE POLICY "staff read diets" ON public.diet_plans
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'coach'));

DROP POLICY IF EXISTS "staff manage diets" ON public.diet_plans;
CREATE POLICY "staff manage diets" ON public.diet_plans
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'coach'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'coach'));

DROP TRIGGER IF EXISTS trg_diet_plans_updated_at ON public.diet_plans;
CREATE TRIGGER trg_diet_plans_updated_at BEFORE UPDATE ON public.diet_plans
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.food_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  image_path text NOT NULL,
  meal_type text,
  notes text,
  logged_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.food_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users read own food logs" ON public.food_logs;
CREATE POLICY "users read own food logs" ON public.food_logs
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users insert own food logs" ON public.food_logs;
CREATE POLICY "users insert own food logs" ON public.food_logs
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "staff read food logs" ON public.food_logs;
CREATE POLICY "staff read food logs" ON public.food_logs
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'coach'));

-- ----------------------------------------------------------------------------
-- 17. LONGEVITY (50+) MEMBERS, SESSIONS, CHECK-INS, MILESTONES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.longevity_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  first_name text NOT NULL,
  program_name text NOT NULL DEFAULT 'Bohofit at 50+',
  sessions_completed integer NOT NULL DEFAULT 0,
  sessions_total integer NOT NULL DEFAULT 24,
  next_session_at timestamptz,
  family_name text,
  family_phone text,
  family_share_token uuid DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.longevity_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "members read own 50+ row" ON public.longevity_members;
CREATE POLICY "members read own 50+ row" ON public.longevity_members
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "members insert own 50+ row" ON public.longevity_members;
CREATE POLICY "members insert own 50+ row" ON public.longevity_members
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "members update own 50+ row" ON public.longevity_members;
CREATE POLICY "members update own 50+ row" ON public.longevity_members
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "staff manage 50+ rows" ON public.longevity_members;
CREATE POLICY "staff manage 50+ rows" ON public.longevity_members
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'coach'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'coach'));

DROP TRIGGER IF EXISTS trg_longevity_members_updated_at ON public.longevity_members;
CREATE TRIGGER trg_longevity_members_updated_at BEFORE UPDATE ON public.longevity_members
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.longevity_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid NOT NULL REFERENCES public.longevity_members(id) ON DELETE CASCADE,
  session_number integer NOT NULL,
  session_date date NOT NULL DEFAULT CURRENT_DATE,
  workout text,
  modification text,
  observation text,
  share_with_family boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.longevity_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "members read own sessions" ON public.longevity_sessions;
CREATE POLICY "members read own sessions" ON public.longevity_sessions
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.longevity_members m WHERE m.id = member_id AND m.user_id = auth.uid()));

DROP POLICY IF EXISTS "staff manage sessions" ON public.longevity_sessions;
CREATE POLICY "staff manage sessions" ON public.longevity_sessions
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'coach'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'coach'));

CREATE TABLE IF NOT EXISTS public.longevity_checkins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid NOT NULL REFERENCES public.longevity_members(id) ON DELETE CASCADE,
  pain_level smallint NOT NULL,
  pain_part text,
  energy smallint NOT NULL,
  sleep smallint NOT NULL,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.longevity_checkins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "members read own checkins" ON public.longevity_checkins;
CREATE POLICY "members read own checkins" ON public.longevity_checkins
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.longevity_members m WHERE m.id = member_id AND m.user_id = auth.uid()));

DROP POLICY IF EXISTS "members insert own checkins" ON public.longevity_checkins;
CREATE POLICY "members insert own checkins" ON public.longevity_checkins
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.longevity_members m WHERE m.id = member_id AND m.user_id = auth.uid()));

DROP POLICY IF EXISTS "staff read checkins" ON public.longevity_checkins;
CREATE POLICY "staff read checkins" ON public.longevity_checkins
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'coach'));

CREATE TABLE IF NOT EXISTS public.longevity_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid NOT NULL REFERENCES public.longevity_members(id) ON DELETE CASCADE,
  stairs boolean NOT NULL DEFAULT false,
  sit_stand boolean NOT NULL DEFAULT false,
  stronger boolean NOT NULL DEFAULT false,
  sleep_better boolean NOT NULL DEFAULT false,
  more_energy boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.longevity_milestones ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "members read own milestones" ON public.longevity_milestones;
CREATE POLICY "members read own milestones" ON public.longevity_milestones
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.longevity_members m WHERE m.id = member_id AND m.user_id = auth.uid()));

DROP POLICY IF EXISTS "members upsert own milestones" ON public.longevity_milestones;
CREATE POLICY "members upsert own milestones" ON public.longevity_milestones
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.longevity_members m WHERE m.id = member_id AND m.user_id = auth.uid()));

DROP POLICY IF EXISTS "members update own milestones" ON public.longevity_milestones;
CREATE POLICY "members update own milestones" ON public.longevity_milestones
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.longevity_members m WHERE m.id = member_id AND m.user_id = auth.uid()));

DROP POLICY IF EXISTS "staff manage milestones" ON public.longevity_milestones;
CREATE POLICY "staff manage milestones" ON public.longevity_milestones
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'coach'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'coach'));

DROP TRIGGER IF EXISTS trg_longevity_milestones_updated_at ON public.longevity_milestones;
CREATE TRIGGER trg_longevity_milestones_updated_at BEFORE UPDATE ON public.longevity_milestones
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Family share RPC
CREATE OR REPLACE FUNCTION public.get_family_progress(_token uuid)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE m public.longevity_members%ROWTYPE; last_session public.longevity_sessions%ROWTYPE;
BEGIN
  SELECT * INTO m FROM public.longevity_members WHERE family_share_token = _token;
  IF NOT FOUND THEN RETURN NULL; END IF;
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
END; $$;

-- ----------------------------------------------------------------------------
-- 18. STORAGE BUCKETS + POLICIES
-- ----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('food-photos','food-photos', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('medical-files','medical-files', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "users read own food photos" ON storage.objects;
CREATE POLICY "users read own food photos" ON storage.objects FOR SELECT
  USING (bucket_id = 'food-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "users upload own food photos" ON storage.objects;
CREATE POLICY "users upload own food photos" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'food-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "users read own medical files" ON storage.objects;
CREATE POLICY "users read own medical files" ON storage.objects FOR SELECT
  USING (bucket_id = 'medical-files' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "users upload own medical files" ON storage.objects;
CREATE POLICY "users upload own medical files" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'medical-files' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "staff read all medical files" ON storage.objects;
CREATE POLICY "staff read all medical files" ON storage.objects FOR SELECT
  USING (bucket_id = 'medical-files' AND (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'coach')));

COMMIT;

-- ============================================================================
-- DONE. Next: run bohofit_slots_seed.sql, then bohofit_longevity_overhaul.sql
-- ============================================================================
