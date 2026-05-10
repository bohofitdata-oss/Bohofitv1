import { Link } from "@tanstack/react-router";
import { Phone, Mail, MessageCircle } from "lucide-react";
import { BOHOFIT_PHONE, BOHOFIT_PHONE_DISPLAY, BOHOFIT_EMAIL } from "@/components/EmergencyCTA";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 mt-24">
      <div className="container mx-auto px-5 py-12 grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-block w-6 h-6 rounded-md bg-gradient-gold" />
            <span className="font-black tracking-tight">Bohofit</span>
          </div>
          <p className="text-sm text-muted-foreground">India&rsquo;s first machine-free fitness system.</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Programs</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/bohofit" className="hover:text-foreground">Bohofit Group Classes</Link></li>
            <li><Link to="/bootcamp" className="hover:text-foreground">Boho Bootcamp · 8 weeks</Link></li>
            <li><Link to="/longevity" className="hover:text-foreground">Bohofit at 50+</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            
            <li><Link to="/booking" className="hover:text-foreground">Speak with us</Link></li>
            <li><Link to="/auth" className="hover:text-foreground">Member login</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Get in touch</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <a href={`tel:${BOHOFIT_PHONE}`} className="inline-flex items-center gap-2 hover:text-foreground">
                <Phone className="w-3.5 h-3.5 text-primary" /> {BOHOFIT_PHONE_DISPLAY}
              </a>
            </li>
            <li>
              <a
                href={`https://wa.me/${BOHOFIT_PHONE.replace("+", "")}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 hover:text-foreground"
              >
                <MessageCircle className="w-3.5 h-3.5 text-primary" /> WhatsApp us
              </a>
            </li>
            <li>
              <a href={`mailto:${BOHOFIT_EMAIL}`} className="inline-flex items-center gap-2 hover:text-foreground">
                <Mail className="w-3.5 h-3.5 text-primary" /> {BOHOFIT_EMAIL}
              </a>
            </li>
            <li className="text-xs pt-1">HSR Layout, Bangalore</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-5 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} Bohofit. Machine-free fitness for life.
      </div>
    </footer>
  );
}
