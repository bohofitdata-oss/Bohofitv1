// Click-to-send WhatsApp helpers (no API key required).
// Rebél support number used as the recipient for confirmations.
export const BOHOFIT_WHATSAPP = "919999999999"; // TODO: replace with real number (country code, no +)

export function waLink(phone: string, message: string) {
  const clean = phone.replace(/[^\d]/g, "");
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}

export function bookingConfirmationMessage(p: {
  name: string;
  program: string;
  mode?: string | null;
  plan?: string | null;
  slot?: string | null;
}) {
  const lines = [
    `Hi ${p.name.split(" ")[0]}, your Rebél booking is received ✅`,
    `Program: ${p.program}`,
    p.plan ? `Plan: ${p.plan}` : null,
    p.mode ? `Mode: ${p.mode}` : null,
    p.slot ? `Time: ${p.slot}` : null,
    ``,
    `Our coach will call you within 24 hours to confirm.`,
  ].filter(Boolean);
  return lines.join("\n");
}
