import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getGroupPlan, groupBookingMarker, JOINING_RULES } from "./group-plans";

export const prepareGroupCheckout = createServerFn({ method: "POST" })
  .inputValidator((input) => z.object({
    planId: z.string(),
    name: z.string().trim().min(1).max(120),
    phone: z.string().trim().min(6).max(20),
    email: z.string().trim().email().max(255),
    age: z.number().int().min(10).max(100),
    city: z.string().trim().min(1).max(80),
    terms: z.array(z.string()),
    joiningRulesAccepted: z.literal(true),
  }).parse(input))
  .handler(async ({ data }) => {
    const plan = getGroupPlan(data.planId);
    const { GENERAL_FITNESS_TERMS } = await import("@/components/GeneralFitnessTerms");
    if (!GENERAL_FITNESS_TERMS.every(term => data.terms.includes(term.key))) throw new Error("Please accept every membership term.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // Retain the existing booking schema and mark_booking_paid flow. The marker binds
    // the server catalogue plan to this booking without changing legacy plan enums.
    const { data: booking, error } = await supabaseAdmin.from("bookings").insert({
      name: data.name, phone: data.phone, email: data.email, age: data.age, city: data.city,
      program: "group_classes", plan: null, mode: "offline", is_trial: false,
      rules_accepted: true, payment_status: "pending", status: "new",
      goal: `${groupBookingMarker(plan.id)}\nMembership: ${plan.months} months.\nAccepted terms: ${data.terms.join(", ")}\nJoining rules: ${JOINING_RULES.join("\n")}`,
    }).select("id").single();
    if (error || !booking) throw new Error("We couldn't save your membership request. Please try again.");
    return { bookingId: booking.id, planId: plan.id, amountInr: plan.price };
  });