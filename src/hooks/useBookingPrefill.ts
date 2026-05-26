import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type BookingPrefill = {
  full_name: string;
  phone: string;
  email: string;
  age: string;
  city: string;
};

const EMPTY_PREFILL: BookingPrefill = {
  full_name: "",
  phone: "",
  email: "",
  age: "",
  city: "",
};

export function useBookingPrefill() {
  const [prefill, setPrefill] = useState<BookingPrefill>(EMPTY_PREFILL);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;
      if (!user || cancelled) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, phone, age, city")
        .eq("id", user.id)
        .maybeSingle();

      if (cancelled) return;

      setPrefill({
        full_name:
          profile?.full_name ??
          (typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name : "") ??
          (typeof user.user_metadata?.name === "string" ? user.user_metadata.name : "") ??
          "",
        phone: profile?.phone ?? user.phone ?? "",
        email: user.email ?? "",
        age: profile?.age ? String(profile.age) : "",
        city: profile?.city ?? "",
      });
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  return prefill;
}