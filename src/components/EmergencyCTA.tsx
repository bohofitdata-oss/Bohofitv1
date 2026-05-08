import { Phone, MessageCircle, Mail } from "lucide-react";

export const BOHOFIT_PHONE = "+918100265630";
export const BOHOFIT_PHONE_DISPLAY = "+91 81002 65630";
export const BOHOFIT_EMAIL = "bohofitdata@gmail.com";

export function EmergencyCTA() {
  return (
    <div className="mt-6 rounded-2xl border border-border bg-card p-5">
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Need help right now?</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <a
          href={`tel:${BOHOFIT_PHONE}`}
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold hover:border-primary"
        >
          <Phone className="w-4 h-4 text-primary" /> Call {BOHOFIT_PHONE_DISPLAY}
        </a>
        <a
          href={`https://wa.me/${BOHOFIT_PHONE.replace("+", "")}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold hover:border-primary"
        >
          <MessageCircle className="w-4 h-4 text-primary" /> WhatsApp
        </a>
        <a
          href={`mailto:${BOHOFIT_EMAIL}`}
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold hover:border-primary"
        >
          <Mail className="w-4 h-4 text-primary" /> {BOHOFIT_EMAIL}
        </a>
      </div>
    </div>
  );
}
