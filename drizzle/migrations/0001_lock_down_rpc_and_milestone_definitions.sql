REVOKE EXECUTE ON FUNCTION public.compute_progress_score(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.compute_progress_score(uuid) TO service_role;

REVOKE EXECUTE ON FUNCTION public.consultation_taken_slots(text, date) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consultation_taken_slots(text, date) TO service_role;

REVOKE SELECT ON public.milestone_definitions FROM anon;

DROP POLICY IF EXISTS "signed-in users read milestones" ON public.milestone_definitions;
CREATE POLICY "enrolled members and staff read milestones"
  ON public.milestone_definitions
  FOR SELECT
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'coach')
    OR EXISTS (
      SELECT 1 FROM public.member_milestones mm
      WHERE mm.milestone_id = milestone_definitions.id
        AND mm.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.memberships m
      WHERE m.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.subscriptions s
      WHERE s.user_id = auth.uid()
    )
  );