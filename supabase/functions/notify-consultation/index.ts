// Rebél — Consultation notification stub.
// Called from ConsultationBooking.tsx when a free 1:1 consult is reserved.
//
// TODO (integrations):
//   - Set WHATSAPP_API_URL, WHATSAPP_API_TOKEN, WHATSAPP_TEAM_NUMBER as secrets
//     and POST the message payload to your WhatsApp Business provider
//     (Gupshup / Twilio / Meta Cloud API).
//   - Set RESEND_API_KEY (or SENDGRID_API_KEY) and TEAM_EMAIL_TO to send the
//     team a plain-text summary email. Optionally also email the user a
//     confirmation / calendar invite.
//
// For now this function just logs the payload and returns 200 so the client
// flow completes even before credentials are wired.

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface Payload {
  consultation_id: string;
  program: string;
  full_name: string;
  phone: string;
  email: string;
  consult_date: string;
  consult_time: string;
  problem_areas?: string[];
  notes?: string | null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return new Response(JSON.stringify({ error: "invalid_json" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const summary =
    `New Rebél consultation booked:\n` +
    `• Program: ${body.program}\n` +
    `• Name: ${body.full_name}\n` +
    `• Phone: ${body.phone}\n` +
    `• Email: ${body.email}\n` +
    `• When: ${body.consult_date} @ ${body.consult_time}\n` +
    (body.problem_areas?.length ? `• Concerns: ${body.problem_areas.join(", ")}\n` : "") +
    (body.notes ? `• Notes: ${body.notes}\n` : "");

  console.log("[notify-consultation] payload:\n" + summary);

  // TODO: WhatsApp send to team
  // await fetch(WHATSAPP_API_URL, { method: "POST", headers: { Authorization: `Bearer ${WHATSAPP_API_TOKEN}` }, body: JSON.stringify({ to: WHATSAPP_TEAM_NUMBER, message: summary }) });

  // TODO: Email send to team (Resend example)
  // await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ from: "Rebél <bookings@yourdomain>", to: TEAM_EMAIL_TO, subject: `New consultation — ${body.program}`, text: summary }) });

  // TODO: Confirmation to the user (WhatsApp + email + optional .ics calendar invite)

  return new Response(JSON.stringify({ ok: true }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
