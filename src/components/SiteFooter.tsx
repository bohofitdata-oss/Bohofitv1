import { Link } from "@tanstack/react-router";
import { Phone, Mail, MessageCircle } from "lucide-react";
import { BOHOFIT_PHONE, BOHOFIT_PHONE_DISPLAY, REBEL_EMAIL, REBEL_SECONDARY_EMAIL } from "@/components/EmergencyCTA";
import { STUDIO_ADDRESS, STUDIO_HOURS, APPOINTMENT_NOTE, PEOPLE_TRAINED } from "@/lib/site-facts";
import { TM } from "@/components/TM";
import rebelLogo from "@/assets/rebel-logo.png";
export function SiteFooter() {
  return <footer className="border-t border-border">
    <div className="container mx-auto px-5 md:px-8 py-20 grid md:grid-cols-[1.3fr_1fr_1fr] gap-12">
      <div><div className="flex items-start mb-6"><img src={rebelLogo} alt="REBÉL" className="h-8 w-auto" /><TM /></div><p className="text-sm text-muted-foreground">Machine-free. Coach-led. For life.</p><p className="text-xs text-muted-foreground mt-5">{PEOPLE_TRAINED}.</p></div>
      <div><h4 className="rebel-label mb-6">Programs</h4><ul className="space-y-4 text-sm"><li><Link to="/bohofit" className="hover:text-storefront">REBÉL<TM /> Group Classes</Link></li><li><Link to="/longevity" className="hover:text-storefront">UnPause<TM /></Link></li><li><Link to="/fiftyplus" className="hover:text-storefront">50+ by REBÉL<TM /></Link></li></ul><div className="mt-8 flex flex-wrap gap-5 text-xs text-muted-foreground"><Link to="/booking">Speak with us</Link><Link to="/auth">Member login</Link></div></div>
      <div><h4 className="rebel-label mb-6">Get in touch</h4><ul className="space-y-4 text-sm text-muted-foreground"><li><a href={`tel:${BOHOFIT_PHONE}`} className="inline-flex items-center gap-3 hover:text-foreground"><Phone className="size-4" />{BOHOFIT_PHONE_DISPLAY}</a></li><li><a href={`https://wa.me/${BOHOFIT_PHONE.replace("+", "")}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 hover:text-foreground"><MessageCircle className="size-4" />WhatsApp us</a></li><li><a href={`mailto:${REBEL_EMAIL}`} className="inline-flex items-center gap-3 hover:text-foreground break-all"><Mail className="size-4 shrink-0" />{REBEL_EMAIL}</a></li><li className="pl-7 text-xs"><a href={`mailto:${REBEL_SECONDARY_EMAIL}`} className="hover:text-foreground break-all">{REBEL_SECONDARY_EMAIL}</a></li></ul></div>
    </div>
    <div className="container mx-auto px-5 md:px-8 pb-12 grid md:grid-cols-2 gap-8 text-xs text-muted-foreground border-t border-border pt-8"><address className="not-italic leading-relaxed max-w-sm">{STUDIO_ADDRESS}.</address><div className="space-y-2">{STUDIO_HOURS.map(row => <p key={row.day}>{row.day} {row.hours}</p>)}<p className="pt-2">{APPOINTMENT_NOTE}</p></div></div>
    <div className="border-t border-border py-6 container mx-auto px-5 md:px-8 text-xs text-muted-foreground">© {new Date().getFullYear()} REBÉL<TM /> · Vinedeb Vibe Ventures Pvt Ltd. Machine-free fitness for life.</div>
  </footer>;
}
