import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createHmac } from "crypto";
import { bohofitAdmin } from "@/integrations/supabase/client.bohofit.server";

// Returns { orderId, keyId, amount } for Razorpay Checkout.
export const createRazorpayOrder = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z
      .object({
        bookingId: z.string().uuid(),
        amountPaise: z.number().int().min(100).max(10_000_000),
        currency: z.string().default("INR"),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
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
        amount: data.amountPaise,
        currency: data.currency,
        receipt: `bk_${data.bookingId.slice(0, 24)}`,
        notes: { booking_id: data.bookingId },
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

    const { error } = await bohofitAdmin.rpc("mark_booking_paid", {
      _booking_id: data.bookingId,
      _razorpay_payment_id: data.razorpay_payment_id,
    });
    if (error) throw new Error(error.message);

    return { ok: true as const };
  });
