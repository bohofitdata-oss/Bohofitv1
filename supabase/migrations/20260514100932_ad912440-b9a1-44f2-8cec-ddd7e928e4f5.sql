
-- Increment slot confirmed_count and lock if full. SECURITY DEFINER so anon bookings can update.
CREATE OR REPLACE FUNCTION public.increment_slot_count(_slot_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_capacity integer;
  v_new integer;
BEGIN
  SELECT capacity INTO v_capacity FROM public.slots WHERE id = _slot_id FOR UPDATE;
  IF NOT FOUND THEN RETURN; END IF;
  UPDATE public.slots
    SET confirmed_count = confirmed_count + 1,
        is_locked = (confirmed_count + 1) >= v_capacity
    WHERE id = _slot_id
    RETURNING confirmed_count INTO v_new;
END;
$$;

-- Mark a booking as paid + confirmed. SECURITY DEFINER so a server fn (anon) can update bookings.
CREATE OR REPLACE FUNCTION public.mark_booking_paid(_booking_id uuid, _razorpay_payment_id text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.bookings
    SET payment_status = 'paid',
        status = 'confirmed'
    WHERE id = _booking_id;
END;
$$;
