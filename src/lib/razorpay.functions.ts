import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createHmac } from "crypto";
import { getGroupPlan, groupAmountPaise, groupBookingMarker } from "./group-plans";

// Returns { orderId, keyId, amount } for Razorpay Checkout.
// Amount is always derived server-side from the booking's validated plan.
export const createRazorpayOrder = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z
      .object({
        bookingId: z.string().uuid(),
        amountPaise: z.number().int().optional(),
        currency: z.literal("INR").default("INR"),
        groupPlanId: z.string().min(1).max(60),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    getGroupPlan(data.groupPlanId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: booking } = await supabaseAdmin.from("bookings").select("program,goal,is_trial,rules_accepted,payment_status").eq("id", data.bookingId).maybeSingle();
    if (!booking || booking.program !== "group_classes" || booking.is_trial || !booking.rules_accepted || booking.payment_status === "paid" || !booking.goal?.startsWith(groupBookingMarker(data.groupPlanId))) throw new Error("This membership request is not available for payment.");
    const amount = groupAmountPaise(data.groupPlanId);
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) throw new Error("Razorpay keys not configured");

    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        currency: data.currency,
        receipt: `bk_${data.bookingId.slice(0, 24)}`,
        notes: { booking_id: data.bookingId, ...(data.groupPlanId ? { group_plan_id: data.groupPlanId } : {}) },
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Razorpay order failed: ${text}`);
    }
    const order = (await res.json()) as { id: string; amount: number; currency: string };
    return { orderId: order.id, keyId, amount: order.amount, currency: order.currency };
  });

// Verifies HMAC signature and marks the booking as paid + confirmed.
export const verifyRazorpayPayment = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z
      .object({
        bookingId: z.string().uuid(),
        razorpay_order_id: z.string().min(1).max(120),
        razorpay_payment_id: z.string().min(1).max(120),
        razorpay_signature: z.string().min(1).max(256),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) throw new Error("Razorpay key secret not configured");

    const expected = createHmac("sha256", keySecret)
      .update(`${data.razorpay_order_id}|${data.razorpay_payment_id}`)
      .digest("hex");

    if (expected !== data.razorpay_signature) {
      throw new Error("Invalid payment signature");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: booking } = await supabaseAdmin.from("bookings").select("goal,payment_status").eq("id", data.bookingId).maybeSingle();
    const planId = booking?.goal?.match(/^\[group-plan:([^\]]+)\]/)?.[1];
    if (!booking || !planId || booking.payment_status === "paid") throw new Error("This booking is not available for payment.");
    const keyId = process.env.RAZORPAY_KEY_ID;
    if (!keyId) throw new Error("Razorpay keys not configured");
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    const response = await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(data.razorpay_payment_id)}`, { headers: { Authorization: `Basic ${auth}` } });
    if (!response.ok) throw new Error("We couldn't verify this payment. Please contact the team.");
    const payment = await response.json() as { amount: number; currency: string; order_id: string; status: string };
    const orderResponse = await fetch(`https://api.razorpay.com/v1/orders/${encodeURIComponent(data.razorpay_order_id)}`, { headers: { Authorization: `Basic ${auth}` } });
    if (!orderResponse.ok) throw new Error("We couldn't verify this order.");
    const order = await orderResponse.json() as { amount: number; notes?: { booking_id?: string; group_plan_id?: string } };
    const expectedAmount = groupAmountPaise(planId);
    if (payment.amount !== expectedAmount || order.amount !== expectedAmount || payment.currency !== "INR" || payment.order_id !== data.razorpay_order_id || !["captured", "authorized"].includes(payment.status) || order.notes?.booking_id !== data.bookingId || order.notes?.group_plan_id !== planId) throw new Error("Payment does not match this booking.");

    const { error } = await supabaseAdmin.rpc("mark_booking_paid", {
      _booking_id: data.bookingId,
      _razorpay_payment_id: data.razorpay_payment_id,
    });
    if (error) throw new Error(error.message);

    return { ok: true as const };
  });
