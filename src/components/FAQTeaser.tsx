import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const FAQS: { q: string; a: string }[] = [
  { q: "What does machine-free mean?", a: "We train using bodyweight, resistance bands, kettlebells, and functional movement. No treadmills. No machines. Just you, your coach, and real effort." },
  { q: "What if I have never exercised before?", a: "Start with Rebél Start — built for absolute beginners and comeback journeys." },
  { q: "What is the Bootcamp guarantee?", a: "Follow all 10 rules and you will see results. If you do not, we work with you for free until you do." },
  { q: "Can I train from home?", a: "Yes. Bootcamp and 50+ offer online and at-home options with a live coach." },
  { q: "How does the membership pause work?", a: "Minimum 2 days. Your end date extends automatically. Bootcamp cannot be paused." },
  { q: "Is there a free trial?", a: "One free class for Rebél Start and Rebél Group Training before you commit." },
  { q: "Do I have to upload meal photos?", a: "Bootcamp and 50+ members must upload every meal. Part of the guarantee." },
  { q: "How quickly will I see results?", a: "Most members feel different in 2 weeks. Visible changes by week 6–8." },
  { q: "Is Rebél only in Bangalore?", a: "Studio is in HSR Layout, Bangalore. Online programs available anywhere in India." },
  { q: "How do I speak to someone?", a: "Tap “Speak with us” anywhere. We respond within 2 hours." },
];

export function FAQTeaser() {
  return (
    <section className="container mx-auto px-5 py-20 md:py-32">
      <Reveal>
        <div className="max-w-2xl">
          <h2 className="rebel-hero-title text-3xl md:text-5xl font-black leading-[1.05]">
            Got questions?
          </h2>
          <p className="mt-4 text-base" style={{ color: "#CCCCCC" }}>
            Everything you need to know before you start.
          </p>
          <Sheet>
            <SheetTrigger asChild>
              <button className="rebel-btn-outline mt-6 text-sm">Read FAQ →</button>
            </SheetTrigger>
            <SheetContent side="bottom" className="bg-black border-t border-white/10 h-[85vh] overflow-y-auto p-0">
              <SheetHeader className="px-5 pt-6 pb-2 text-left">
                <p className="rebel-label">FAQ</p>
                <SheetTitle className="text-white text-2xl md:text-3xl font-black">The honest answers.</SheetTitle>
              </SheetHeader>
              <div className="px-5 pb-10 mt-2">
                {FAQS.map((f, i) => (
                  <FAQItem key={i} q={f.q} a={f.a} />
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </Reveal>
    </section>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 py-4 text-left"
      >
        <span
          className={cn("font-bold text-[15px] md:text-base transition-colors")}
          style={{ color: open ? "#FF2233" : "#FFFFFF" }}
        >
          {q}
        </span>
        <ChevronDown
          className="w-4 h-4 shrink-0 transition-transform duration-300"
          style={{
            color: "#89010A",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>
      {open && (
        <p className="pb-4 text-sm leading-relaxed" style={{ color: "#CCCCCC" }}>
          {a}
        </p>
      )}
    </div>
  );
}
