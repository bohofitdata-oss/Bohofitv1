-- Add joints_bones concern enum value
ALTER TYPE public.concern_kind ADD VALUE IF NOT EXISTS 'joints_bones';

-- Relax bookings INSERT policy: app-side validation already enforces name/phone length.
-- The strict length check was tripping legitimate bookings.
DROP POLICY IF EXISTS "anyone can create booking" ON public.bookings;
CREATE POLICY "anyone can create booking"
  ON public.bookings
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(coalesce(name,'')) >= 1
    AND length(coalesce(phone,'')) >= 6
    AND rules_accepted = true
  );