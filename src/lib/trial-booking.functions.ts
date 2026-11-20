import { createServerFn } from "@tanstack/react-start";
import { trialRequestSchema } from "./join-request";

// Public intake accepts contact details, never user IDs or payment state.
export const submitTrialBooking = createServerFn({ method: "POST" })
  .inputValidator(input => trialRequestSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: booking, error } = await supabaseAdmin.from("bookings").insert({
      ...data, program: "group_classes", rules_accepted: true, is_trial: true,
      payment_status: "pending", status: "new",
    }).select("id").single();
    if (error || !booking) throw new Error("We couldn't save your request. Please send your details on WhatsApp.");
    return { bookingId: booking.id };
  });