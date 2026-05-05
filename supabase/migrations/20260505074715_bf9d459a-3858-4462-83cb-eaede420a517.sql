
REVOKE EXECUTE ON FUNCTION public.request_membership_pause(UUID, DATE, INTEGER, TEXT) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.request_membership_pause(UUID, DATE, INTEGER, TEXT) TO authenticated;
