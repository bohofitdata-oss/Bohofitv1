import { Phone, MessageCircle } from "lucide-react";

export function EmergencyCTA() {
  return (
    <div className="mt-6 rounded-2xl border border-border bg-card p-5">
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Need help right now?</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <a
          href="tel:+919999999999"
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold hover:border-primary"
        >
          <Phone className="w-4 h-4 text-primary" /> Call us
        </a>
        <a
          href="https://wa.me/919999999999"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold hover:border-primary"
        >
          <MessageCircle className="w-4 h-4 text-primary" /> WhatsApp
        </a>
      </div>
    </div>
  );
}
