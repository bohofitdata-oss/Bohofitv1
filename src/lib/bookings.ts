import { supabase } from "@/integrations/supabase/client.bohofit";

export type BookingProgram = "bootcamp" | "group_classes" | "fifty_plus";

export type SaveBookingInput = {
  name: string;
  phone: string;
  email: string;
  age: number;
  city: string;
  goal: string;
  program: BookingProgram;
  plan?: "standard" | "intensive" | null;
  mode?: "online" | "offline" | null;
  health_conditions?: string[];
  primary_slot_id?: string | null;
  secondary_slot_id?: string | null;
  rules_accepted: boolean;
  is_trial?: boolean;
};

export type SaveBookingResult =
  | { ok: true; primarySlotLabel: string | null; secondarySlotLabel: string | null; bookingId: string }
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
  if (input.primary_slot_id && input.secondary_slot_id && input.primary_slot_id === input.secondary_slot_id) {
    return { ok: false, error: "Secondary slot must be different from your primary slot.", reason: "validation" };
  }

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

  let primaryLabel: string | null = null;
  let secondaryLabel: string | null = null;
  if (input.primary_slot_id) {
    const { data } = await supabase.from("slots").select("start_time").eq("id", input.primary_slot_id).maybeSingle();
    primaryLabel = fmtTime(data?.start_time);
  }
  if (input.secondary_slot_id) {
    const { data } = await supabase.from("slots").select("start_time").eq("id", input.secondary_slot_id).maybeSingle();
    secondaryLabel = fmtTime(data?.start_time);
  }

  const { data, error } = await supabase
    .from("bookings")
    .insert({
      name: input.name,
      phone: input.phone,
      email: input.email,
      age: input.age,
      city: input.city,
      goal: input.goal,
      program: input.program,
      plan: input.plan ?? null,
      mode: input.mode ?? null,
      health_conditions: input.health_conditions ?? [],
      primary_slot: primaryLabel,
      secondary_slot: secondaryLabel,
      rules_accepted: true,
      payment_status: "pending",
      status: "new",
      is_trial: input.is_trial ?? false,
    })
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message, reason: "db" };

  // Increment confirmed_count + auto-lock if full. Best-effort: don't fail the booking.
  if (input.primary_slot_id) {
    await supabase.rpc("increment_slot_count", { _slot_id: input.primary_slot_id });
  }

  return { ok: true, primarySlotLabel: primaryLabel, secondarySlotLabel: secondaryLabel, bookingId: data.id };
}

export const PROGRAM_LABEL: Record<BookingProgram, string> = {
  bootcamp: "Boho Bootcamp · 8 weeks",
  group_classes: "Bohofit Group Classes",
  fifty_plus: "Bohofit at 50+ · 1:1",
};

// Reschedule fee logic (front-end only):
// - Bootcamp / 1:1 (fifty_plus): 1 free reschedule, then ₹499 each.
// - Group classes: trial day is free; 2nd trial day onwards ₹499 (max 2 trial days, then membership required).
export function rescheduleFeeInfo(program: BookingProgram, prevCount: number) {
  if (program === "group_classes") {
    if (prevCount === 0) return { fee: 0, message: "Day 1 trial — free reschedule." };
    if (prevCount === 1) return { fee: 499, message: "2nd trial day — ₹499 applies." };
    return { fee: -1, message: "Trial limit reached. Please buy a membership to continue." };
  }
  if (prevCount === 0) return { fee: 0, message: "First reschedule is free." };
  return { fee: 499, message: "₹499 per reschedule after the first free one." };
}
