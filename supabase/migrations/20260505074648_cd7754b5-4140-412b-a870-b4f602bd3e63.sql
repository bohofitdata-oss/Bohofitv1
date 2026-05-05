
-- Memberships, pauses, medical history

CREATE TABLE IF NOT EXISTS public.memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  program TEXT NOT NULL CHECK (program IN ('start','strength','unlimited','bootcamp','longevity')),
  tier TEXT NOT NULL,
  delivery TEXT NOT NULL DEFAULT 'studio' CHECK (delivery IN ('studio','home','online')),
  price_inr INTEGER NOT NULL DEFAULT 0,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE NOT NULL,
  pause_balance_days INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','paused','expired','cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_memberships_user ON public.memberships(user_id);

ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own memberships" ON public.memberships
  FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Users insert own memberships" ON public.memberships
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own memberships" ON public.memberships
  FOR UPDATE USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete memberships" ON public.memberships
  FOR DELETE USING (public.has_role(auth.uid(),'admin'));

CREATE TRIGGER trg_memberships_updated BEFORE UPDATE ON public.memberships
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.membership_pauses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  membership_id UUID NOT NULL REFERENCES public.memberships(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  pause_start DATE NOT NULL,
  pause_end DATE NOT NULL,
  days INTEGER NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pauses_user ON public.membership_pauses(user_id);

ALTER TABLE public.membership_pauses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own pauses" ON public.membership_pauses
  FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Users insert own pauses" ON public.membership_pauses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Pause logic: min 2 days unless remaining balance <= 2
CREATE OR REPLACE FUNCTION public.request_membership_pause(
  _membership_id UUID,
  _start DATE,
  _days INTEGER,
  _reason TEXT DEFAULT NULL
) RETURNS public.membership_pauses
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  m public.memberships%ROWTYPE;
  p public.membership_pauses%ROWTYPE;
  min_days INTEGER;
BEGIN
  SELECT * INTO m FROM public.memberships WHERE id = _membership_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Membership not found'; END IF;
  IF m.user_id <> auth.uid() THEN RAISE EXCEPTION 'Not your membership'; END IF;
  IF m.status <> 'active' THEN RAISE EXCEPTION 'Membership is not active'; END IF;
  IF _days <= 0 THEN RAISE EXCEPTION 'Days must be positive'; END IF;
  IF _days > m.pause_balance_days THEN RAISE EXCEPTION 'Not enough pause balance (% left)', m.pause_balance_days; END IF;
  IF _start < CURRENT_DATE THEN RAISE EXCEPTION 'Start date must be today or later'; END IF;

  -- Minimum 2 days unless balance is <= 2 (then single days allowed)
  IF m.pause_balance_days > 2 THEN
    min_days := 2;
  ELSE
    min_days := 1;
  END IF;
  IF _days < min_days THEN
    RAISE EXCEPTION 'Minimum pause is % day(s)', min_days;
  END IF;

  INSERT INTO public.membership_pauses(membership_id, user_id, pause_start, pause_end, days, reason)
  VALUES (_membership_id, auth.uid(), _start, _start + (_days - 1), _days, _reason)
  RETURNING * INTO p;

  UPDATE public.memberships
    SET pause_balance_days = pause_balance_days - _days,
        end_date = end_date + _days,
        updated_at = now()
    WHERE id = _membership_id;

  RETURN p;
END;
$$;

-- Medical history
CREATE TABLE IF NOT EXISTS public.medical_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  conditions JSONB NOT NULL DEFAULT '{}'::jsonb,
  notes TEXT,
  attachments JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.medical_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own medical" ON public.medical_history
  FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Users insert own medical" ON public.medical_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own medical" ON public.medical_history
  FOR UPDATE USING (auth.uid() = user_id);

CREATE TRIGGER trg_medical_updated BEFORE UPDATE ON public.medical_history
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Private storage bucket for medical attachments
INSERT INTO storage.buckets (id, name, public) VALUES ('medical-files','medical-files', false)
  ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users read own medical files" ON storage.objects
  FOR SELECT USING (bucket_id = 'medical-files' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users upload own medical files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'medical-files' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users delete own medical files" ON storage.objects
  FOR DELETE USING (bucket_id = 'medical-files' AND auth.uid()::text = (storage.foldername(name))[1]);
