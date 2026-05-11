import { supabase } from "@/integrations/supabase/client";

export type BookingProgram = "bootcamp" | "group_classes" | "fifty_plus";

export type SaveBookingInput = {
  name: string;
  phone: string;
  email?: string | null;
  age?: number | null;
  city?: string | null;
  goal?: string | null;
  program: BookingProgram;
  plan?: "standard" | "intensive" | null;
  mode?: "online" | "offline" | null;
  health_conditions?: string[];
  primary_slot_id?: string | null;
  secondary_slot_id?: string | null;
  rules_accepted: boolean;
};

export type SaveBookingResult =
  | { ok: true; primarySlotLabel: string | null; bookingId: string }
  | { ok: false; error: string; reason?: "slot_full" | "validation" | "db" };

function fmtTime(t: string | null | undefined) {
  if (!t) return null;
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hr = h % 12 === 0 ? 12 : h % 12;
  return `${hr}:${m.toString().padStart(2, "0")} ${period}`;
}

export async function saveBooking(input: SaveBookingInput): Promise<SaveBookingResult> {
  if (!input.rules_accepted) {
    return { ok: false, error: "Please accept all terms first.", reason: "validation" };
  }

  // Validate primary slot capacity using helper
  if (input.primary_slot_id) {
    const { data: avail, error: availErr } = await supabase.rpc("slot_availability", {
      _slot_id: input.primary_slot_id,
    });
    if (availErr) return { ok: false, error: availErr.message, reason: "db" };
    const a = avail as { is_locked?: boolean; remaining?: number } | null;
    if (!a) return { ok: false, error: "Selected slot no longer exists.", reason: "slot_full" };
    if (a.is_locked || (a.remaining ?? 0) <= 0) {
      return {
        ok: false,
        error: "That time slot just filled up. Please pick another time.",
        reason: "slot_full",
      };
    }
  }

  // Resolve slot times to display labels stored in bookings.primary_slot (text)
  let primaryLabel: string | null = null;
  let secondaryLabel: string | null = null;
  if (input.primary_slot_id) {
    const { data } = await supabase
      .from("slots")
      .select("start_time")
      .eq("id", input.primary_slot_id)
      .maybeSingle();
    primaryLabel = fmtTime(data?.start_time);
  }
  if (input.secondary_slot_id) {
    const { data } = await supabase
      .from("slots")
      .select("start_time")
      .eq("id", input.secondary_slot_id)
      .maybeSingle();
    secondaryLabel = fmtTime(data?.start_time);
  }

  const { data, error } = await supabase
    .from("bookings")
    .insert({
      name: input.name,
      phone: input.phone,
      email: input.email || null,
      age: input.age ?? null,
      city: input.city || null,
      goal: input.goal || null,
      program: input.program,
      plan: input.plan ?? null,
      mode: input.mode ?? null,
      health_conditions: input.health_conditions ?? [],
      primary_slot: primaryLabel,
      secondary_slot: secondaryLabel,
      rules_accepted: true,
      payment_status: "pending",
      status: "new",
    })
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message, reason: "db" };
  return { ok: true, primarySlotLabel: primaryLabel, bookingId: data.id };
}

export const PROGRAM_LABEL: Record<BookingProgram, string> = {
  bootcamp: "Boho Bootcamp · 8 weeks",
  group_classes: "Bohofit Group Classes",
  fifty_plus: "Bohofit at 50+ · 1:1",
};
