-- Seed slots for bohofitdata-oss
-- Run this in the Supabase SQL editor of the EXTERNAL project
-- (https://fuitymjndkmltlxstiqj.supabase.co) AFTER bohofit_full_schema.sql.
--
-- Times:
--   Morning: 06:30, 07:30, 08:30, 09:30
--   Evening: 16:30, 17:30, 18:30, 19:30, 20:30
--
-- Capacities:
--   bootcamp       -> 15 per slot (group format)
--   longevity      ->  1 per slot (strictly 1:1 for 50+)
--   group_classes  -> 20 per slot (open studio)
--
-- Safe to re-run: clears existing rows for these programs first.

BEGIN;

DELETE FROM public.slots
WHERE program IN ('bootcamp','longevity','group_classes');

WITH times(t) AS (
  VALUES
    (TIME '06:30'),
    (TIME '07:30'),
    (TIME '08:30'),
    (TIME '09:30'),
    (TIME '16:30'),
    (TIME '17:30'),
    (TIME '18:30'),
    (TIME '19:30'),
    (TIME '20:30')
)
INSERT INTO public.slots (program, start_time, capacity, confirmed_count, is_locked, batch_start_date)
SELECT p.program::slot_program, t.t, p.cap, 0, false, DATE '2026-06-01'
FROM times t
CROSS JOIN (
  VALUES
    ('bootcamp', 15),
    ('longevity', 1),
    ('group_classes', 20)
) AS p(program, cap);

COMMIT;

-- Verify
SELECT program, start_time, capacity
FROM public.slots
ORDER BY program, start_time;
