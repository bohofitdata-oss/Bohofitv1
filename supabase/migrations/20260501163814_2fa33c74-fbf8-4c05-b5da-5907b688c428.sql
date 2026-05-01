-- Slot booking system + food logs + storage

-- Enum for slot program type
CREATE TYPE public.slot_program AS ENUM ('bootcamp', 'longevity');
CREATE TYPE public.slot_mode AS ENUM ('online', 'offline');
CREATE TYPE public.bootcamp_tier AS ENUM ('standard', 'intensive');
CREATE TYPE public.booking_status AS ENUM ('pending', 'consult_requested', 'paid', 'cancelled');

-- Slots table: timing buckets users can book
CREATE TABLE public.slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program public.slot_program NOT NULL,
  start_time time NOT NULL,
  batch_start_date date NOT NULL DEFAULT '2026-05-01',
  capacity integer NOT NULL,
  confirmed_count integer NOT NULL DEFAULT 0,
  is_locked boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (program, start_time, batch_start_date)
);

-- Bookings: who booked which slot, with T&C consent and tier
CREATE TABLE public.slot_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  phone text NOT NULL,
  email text,
  age integer,
  city text,
  program public.slot_program NOT NULL,
  mode public.slot_mode NOT NULL,
  tier public.bootcamp_tier,
  primary_slot_id uuid REFERENCES public.slots(id) ON DELETE SET NULL,
  secondary_slot_id uuid REFERENCES public.slots(id) ON DELETE SET NULL,
  conditions jsonb NOT NULL DEFAULT '{}'::jsonb,
  needs_rehab boolean NOT NULL DEFAULT false,
  tnc_accepted jsonb NOT NULL DEFAULT '{}'::jsonb,
  status public.booking_status NOT NULL DEFAULT 'pending',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slot_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone reads slots" ON public.slots FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins manage slots" ON public.slots FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "anyone can book" ON public.slot_bookings FOR INSERT TO anon, authenticated
  WITH CHECK (length(full_name) BETWEEN 1 AND 120 AND length(phone) BETWEEN 6 AND 20);
CREATE POLICY "users read own bookings" ON public.slot_bookings FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "staff read all bookings" ON public.slot_bookings FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'coach'::app_role));
CREATE POLICY "staff update bookings" ON public.slot_bookings FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'coach'::app_role));

-- Trigger: when a booking is created/confirmed, update slot count and lock at threshold
CREATE OR REPLACE FUNCTION public.update_slot_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count integer;
  v_capacity integer;
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
END;
$$;

CREATE TRIGGER trg_update_slot_count
AFTER INSERT OR UPDATE ON public.slot_bookings
FOR EACH ROW EXECUTE FUNCTION public.update_slot_count();

-- Food logs
CREATE TABLE public.food_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  image_path text NOT NULL,
  meal_type text,
  notes text,
  logged_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.food_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users insert own food logs" ON public.food_logs FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users read own food logs" ON public.food_logs FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "staff read food logs" ON public.food_logs FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'coach'::app_role));

-- Storage bucket for food photos (private)
INSERT INTO storage.buckets (id, name, public) VALUES ('food-photos', 'food-photos', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "users upload own food photos" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'food-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "users read own food photos" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'food-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "staff read all food photos" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'food-photos' AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'coach'::app_role)));

-- Seed slots: hourly 6:30 to 21:00 (16 slots) for bootcamp (cap 5) and longevity (cap 1)
INSERT INTO public.slots (program, start_time, capacity)
SELECT 'bootcamp'::slot_program, t::time, 5
FROM generate_series(timestamp '2000-01-01 06:30', timestamp '2000-01-01 21:00', interval '1 hour') AS t;

INSERT INTO public.slots (program, start_time, capacity)
SELECT 'longevity'::slot_program, t::time, 1
FROM generate_series(timestamp '2000-01-01 06:30', timestamp '2000-01-01 21:00', interval '1 hour') AS t;