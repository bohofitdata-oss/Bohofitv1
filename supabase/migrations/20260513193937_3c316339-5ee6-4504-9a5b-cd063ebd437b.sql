ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS is_trial boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS reschedule_count integer NOT NULL DEFAULT 0;