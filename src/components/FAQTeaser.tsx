import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { STUDIO_ADDRESS, STUDIO_HOURS, APPOINTMENT_NOTE } from "@/lib/site-facts";
const FAQS = [
  { q: "What does machine-free mean?", a: "Bodyweight, free weights, kettlebells and resistance bands. Real movement, with a coach beside you." },
  { q: "Where should a beginner start?", a: "Level 1 START™. Built for beginners and comeback journeys." },
  { q: "Can I train from home?", a: "Yes. UnPause and 50+ offer live 1:1 training online or at home." },
  { q: "Is there a free trial?", a: "One free class at Level 1 START™. UnPause and 50+ begin with a free consultation." },
  { q: "How does a membership pause work?", a: "Minimum two days. Your membership end date extends automatically." },
  { q: "Where are you located?", a: STUDIO_ADDRESS + "." },
];
export function FAQTeaser() {
  return <section className="editorial-section"><div className="container mx-auto px-5 md:px-8"><Reveal><p className="rebel-label mb-6">Before you begin</p><h2 className="editorial-title">Got questions?</h2><Sheet><SheetTrigger asChild><Button variant="outline" className="rounded-full mt-8">Read FAQ →</Button></SheetTrigger><SheetContent side="bottom" className="bg-background border-border h-[85vh] overflow-y-auto"><div className="max-w-3xl mx-auto"><SheetHeader className="text-left py-6"><p className="rebel-label">FAQ</p><SheetTitle className="text-foreground text-2xl font-medium">The honest answers.</SheetTitle></SheetHeader>{FAQS.map(f => <FAQItem key={f.q} {...f} />)}<div className="py-8"><p className="rebel-label mb-5">Group class routine</p>{STUDIO_HOURS.map(row => <p key={row.day} className="text-sm text-muted-foreground mb-3">{row.day} {row.hours}</p>)}<p className="text-xs text-muted-foreground mt-5">{APPOINTMENT_NOTE}</p></div></div></SheetContent></Sheet></Reveal></div></section>;
}
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return <div className="member-row"><Button variant="ghost" onClick={() => setOpen(v => !v)} aria-expanded={open} className="w-full h-auto py-5 px-0 justify-between text-left whitespace-normal hover:bg-transparent"><span className="text-sm font-medium">{q}</span><ChevronDown className={`shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} /></Button>{open && <p className="text-sm text-muted-foreground pb-5 max-w-sm">{a}</p>}</div>;
}
