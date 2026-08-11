ALTER TABLE public.consultations
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS consultations_user_id_idx ON public.consultations(user_id);

DROP POLICY IF EXISTS "Anyone can request a consultation" ON public.consultations;
CREATE POLICY "Anyone can request a consultation"
ON public.consultations
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(full_name) >= 1 AND length(full_name) <= 120
  AND length(phone) >= 6 AND length(phone) <= 20
  AND length(email) >= 3 AND length(email) <= 255
  AND (user_id IS NULL OR user_id = auth.uid())
);

DROP POLICY IF EXISTS "Users can read own consultations" ON public.consultations;
CREATE POLICY "Users can read own consultations"
ON public.consultations
FOR SELECT
TO authenticated
USING (user_id IS NOT NULL AND user_id = auth.uid());

DROP POLICY IF EXISTS "anyone can book" ON public.slot_bookings;
CREATE POLICY "anyone can book"
ON public.slot_bookings
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(full_name) >= 1 AND length(full_name) <= 120
  AND length(phone) >= 6 AND length(phone) <= 20
  AND (user_id IS NULL OR user_id = auth.uid())
);