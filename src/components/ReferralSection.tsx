import { Reveal } from "@/components/Reveal";
export function ReferralSection() {
  return <section className="editorial-section"><div className="container mx-auto px-5 md:px-8"><Reveal><p className="rebel-label mb-6">Members' privileges</p><div className="grid md:grid-cols-2 gap-10 md:gap-20"><h2 className="font-display text-xl md:text-2xl leading-relaxed max-w-lg">Every successful referral = an extra 10% off your next membership cycle.</h2><p className="text-sm text-muted-foreground leading-relaxed max-w-sm">Renew on or before your last day = 10% off. Can be combined with referral discounts only. No other offers apply.</p></div></Reveal></div></section>;
}
