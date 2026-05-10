CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  age integer,
  city text,
  goal text,
  program text NOT NULL CHECK (program IN ('bootcamp','group_classes','fifty_plus')),
  plan text CHECK (plan IN ('standard','intensive')),
  mode text CHECK (mode IN ('online','offline')),
  health_conditions text[] NOT NULL DEFAULT '{}',
  primary_slot text,
  secondary_slot text,
  rules_accepted boolean NOT NULL DEFAULT false,
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending','paid')),
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new','confirmed','cancelled'))
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can create booking"
ON public.bookings FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(name) BETWEEN 1 AND 120
  AND length(phone) BETWEEN 6 AND 20
  AND rules_accepted = true
);

CREATE POLICY "staff read bookings"
ON public.bookings FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'coach'::app_role));

CREATE POLICY "staff update bookings"
ON public.bookings FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'coach'::app_role));

CREATE INDEX idx_bookings_program ON public.bookings(program);
CREATE INDEX idx_bookings_status ON public.bookings(status);

CREATE OR REPLACE FUNCTION public.slot_availability(_slot_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  s public.slots%ROWTYPE;
  active_count integer;
BEGIN
  SELECT * INTO s FROM public.slots WHERE id = _slot_id;
  IF NOT FOUND THEN RETURN NULL; END IF;

  SELECT COUNT(*) INTO active_count
  FROM public.slot_bookings
  WHERE primary_slot_id = _slot_id AND status IN ('pending','paid');

  RETURN jsonb_build_object(
    'slot_id', s.id,
    'program', s.program,
    'start_time', s.start_time,
    'capacity', s.capacity,
    'booked', active_count,
    'remaining', GREATEST(s.capacity - active_count, 0),
    'is_locked', s.is_locked OR active_count >= s.capacity
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.program_slot_availability(_program slot_program)
RETURNS TABLE (
  slot_id uuid,
  start_time time,
  capacity integer,
  booked integer,
  remaining integer,
  is_locked boolean
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    s.id,
    s.start_time,
    s.capacity,
    COALESCE(b.cnt, 0)::int,
    GREATEST(s.capacity - COALESCE(b.cnt, 0), 0)::int,
    s.is_locked OR COALESCE(b.cnt, 0) >= s.capacity
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