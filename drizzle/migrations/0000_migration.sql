-- Staff role lookups only for the caller themselves (or by admins)
CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT (_user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'))
     AND EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('admin','coach'));
$$;
REVOKE EXECUTE ON FUNCTION public.is_staff(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_staff(uuid) TO authenticated, service_role;

-- Coaches cannot write their own progress or award themselves milestones
DROP POLICY IF EXISTS "staff write progress" ON public.member_progress;
CREATE POLICY "staff write progress" ON public.member_progress
  FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin') OR (has_role(auth.uid(),'coach') AND user_id <> auth.uid()))
  WITH CHECK (has_role(auth.uid(),'admin') OR (has_role(auth.uid(),'coach') AND user_id <> auth.uid()));

DROP POLICY IF EXISTS "staff award milestones" ON public.member_milestones;
CREATE POLICY "staff award milestones" ON public.member_milestones
  FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(),'admin') OR (has_role(auth.uid(),'coach') AND user_id <> auth.uid()));

-- Ownership guard for progress recomputation
CREATE OR REPLACE FUNCTION public.guard_compute_progress()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NOT NULL
     AND NEW.user_id <> auth.uid()
     AND NOT (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'coach')) THEN
    RAISE EXCEPTION 'Not allowed to update progress for another member';
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS guard_member_progress_owner ON public.member_progress;
CREATE TRIGGER guard_member_progress_owner BEFORE INSERT OR UPDATE ON public.member_progress
  FOR EACH ROW EXECUTE FUNCTION public.guard_compute_progress();
REVOKE EXECUTE ON FUNCTION public.compute_progress_score(uuid) FROM PUBLIC, anon;

-- Tighten catalogue/directory reads
DROP POLICY IF EXISTS "anyone reads slots" ON public.slots;
CREATE POLICY "anyone reads open slots" ON public.slots FOR SELECT TO anon, authenticated
  USING (is_locked = false OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'coach'));

DROP POLICY IF EXISTS "anyone reads batches" ON public.batches;
CREATE POLICY "anyone reads current batches" ON public.batches FOR SELECT TO anon, authenticated
  USING (start_date >= CURRENT_DATE - 90 OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'coach'));

DROP POLICY IF EXISTS "anyone reads milestones" ON public.milestone_definitions;
CREATE POLICY "signed-in users read milestones" ON public.milestone_definitions FOR SELECT TO authenticated
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS coaches_read ON public.coaches;
CREATE POLICY coaches_read ON public.coaches FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'coach'));

DROP POLICY IF EXISTS doctors_read ON public.doctors;
CREATE POLICY doctors_read ON public.doctors FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'coach'));