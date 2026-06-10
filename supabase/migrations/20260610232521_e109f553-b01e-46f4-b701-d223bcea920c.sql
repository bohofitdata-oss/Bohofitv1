
DO $$ BEGIN
  CREATE TYPE public.consultation_status AS ENUM ('pending','scheduled','completed','cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.gynec_consultations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status public.consultation_status NOT NULL DEFAULT 'pending',
  preferred_date date,
  preferred_time text,
  notes text,
  report_path text,
  report_filename text,
  report_uploaded_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.gynec_consultations TO authenticated;
GRANT ALL ON public.gynec_consultations TO service_role;

ALTER TABLE public.gynec_consultations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user reads own consultations"
  ON public.gynec_consultations FOR SELECT TO authenticated
  USING (user_id = auth.uid()
    OR public.has_role(auth.uid(),'admin')
    OR public.has_role(auth.uid(),'coach'));

CREATE POLICY "user creates own consultation"
  ON public.gynec_consultations FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "staff updates consultations"
  ON public.gynec_consultations FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'coach'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'coach'));

CREATE POLICY "staff deletes consultations"
  ON public.gynec_consultations FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'coach'));

CREATE TRIGGER trg_gynec_consultations_updated_at
  BEFORE UPDATE ON public.gynec_consultations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Storage policies on consultation-reports bucket
CREATE POLICY "members read own consultation files"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'consultation-reports'
    AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR public.has_role(auth.uid(),'admin')
      OR public.has_role(auth.uid(),'coach')
    )
  );

CREATE POLICY "staff upload consultation files"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'consultation-reports'
    AND (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'coach'))
  );

CREATE POLICY "staff update consultation files"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'consultation-reports'
    AND (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'coach'))
  );

CREATE POLICY "staff delete consultation files"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'consultation-reports'
    AND (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'coach'))
  );
