
-- 1. memberships: remove user INSERT/UPDATE, restrict to staff
DROP POLICY IF EXISTS "Users insert own memberships" ON public.memberships;
DROP POLICY IF EXISTS "Users update own memberships" ON public.memberships;

CREATE POLICY "Staff insert memberships"
  ON public.memberships FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'coach'));

CREATE POLICY "Staff update memberships"
  ON public.memberships FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'coach'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'coach'));

-- 2. membership_pauses: remove direct INSERT (must go through request_membership_pause RPC), add admin DELETE
DROP POLICY IF EXISTS "Users insert own pauses" ON public.membership_pauses;

CREATE POLICY "Admins delete pauses"
  ON public.membership_pauses FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'admin'));

-- 3. food_logs: allow users to delete their own
CREATE POLICY "users delete own food logs"
  ON public.food_logs FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- 4. medical-files storage: allow users to update their own
CREATE POLICY "Users update own medical files"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'medical-files' AND auth.uid()::text = (storage.foldername(name))[1])
  WITH CHECK (bucket_id = 'medical-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 5. Lock down SECURITY DEFINER function execution
-- Revoke broad execute then re-grant only where appropriate.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_slot_count() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_family_progress(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.request_membership_pause(uuid, date, integer, text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.slot_availability(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.program_slot_availability(slot_program) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.increment_slot_count(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.mark_booking_paid(uuid, text) FROM PUBLIC, anon, authenticated;

-- Re-grant only what app surfaces actually call from the client
GRANT EXECUTE ON FUNCTION public.request_membership_pause(uuid, date, integer, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.slot_availability(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.program_slot_availability(slot_program) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_family_progress(uuid) TO anon, authenticated;
-- increment_slot_count and mark_booking_paid are only used server-side (service role) — keep revoked from anon/authenticated
-- has_role / set_updated_at / update_slot_count / handle_new_user are internal helpers — keep revoked
