
CREATE TABLE public.consultations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  program TEXT NOT NULL CHECK (program IN ('unpause','fifty_plus')),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  age INTEGER,
  consult_date DATE NOT NULL,
  consult_time TEXT NOT NULL,
  problem_areas TEXT[] NOT NULL DEFAULT '{}',
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  notified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (program, consult_date, consult_time)
);

GRANT INSERT ON public.consultations TO anon, authenticated;
GRANT SELECT, UPDATE ON public.consultations TO authenticated;
GRANT ALL ON public.consultations TO service_role;

ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can request a consultation"
  ON public.consultations FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(full_name) BETWEEN 1 AND 120
    AND length(phone) BETWEEN 6 AND 20
    AND length(email) BETWEEN 3 AND 255
  );

CREATE POLICY "Staff can read consultations"
  ON public.consultations FOR SELECT
  TO authenticated
  USING (public.is_staff(auth.uid()));

CREATE POLICY "Staff can update consultations"
  ON public.consultations FOR UPDATE
  TO authenticated
  USING (public.is_staff(auth.uid()));

CREATE TRIGGER set_consultations_updated_at
  BEFORE UPDATE ON public.consultations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Public helper: which time slots are already taken for a given program+date
CREATE OR REPLACE FUNCTION public.consultation_taken_slots(_program TEXT, _date DATE)
RETURNS TABLE(consult_time TEXT)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT c.consult_time FROM public.consultations c
  WHERE c.program = _program AND c.consult_date = _date AND c.status <> 'cancelled';
$$;

GRANT EXECUTE ON FUNCTION public.consultation_taken_slots(TEXT, DATE) TO anon, authenticated;
