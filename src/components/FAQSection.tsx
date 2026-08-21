import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "What does machine-free really mean?",
    a: "We use your bodyweight, free weights, kettlebells, mats and resistance bands — no cardio machines, no pin-loaded selectorized equipment. Coach-led, joint-friendly, and built for real-world strength.",
  },
  {
    q: "I'm a complete beginner. Where do I start?",
    a: "Level 1 (Rebél Start). Yoga, Zumba, Mat Pilates and Beginner Strength — all unlimited. After 2–3 months you graduate into Level 2 (Rebél Strength).",
  },
  {
    q: "Can I pause my membership?",
    a: "Yes. Every plan includes free pause days (7–60 depending on duration). Minimum pause is 2 days. Your end date extends automatically.",
  },
  {
    q: "Do you offer trial classes?",
    a: "Yes — book a free intro session through the booking page. We'll match you to the right format on day one.",
  },
  {
    q: "What if I have an injury or medical condition?",
    a: "Tell us at booking. Coaches modify every movement. For 50+ or rehab-heavy cases, our 1:1 Rebél 50+ track is the right fit.",
  },
  {
    q: "Is the diet plan included?",
    a: "6-month and 12-month plans include the full diet consultation. Shorter plans can add it for ₹1,000.",
  },
  {
    q: "Can I switch between programs?",
    a: "Yes — 6+ month memberships include Smart Switch (₹599 ERP fee for plan transfers). Switch from Level 1 to Level 2, or into Level 3 (Rebél One), anytime.",
  },
  {
    q: "Where are you located?",
    a: "HSR Layout, Bangalore. Whitefield and Indiranagar centres open soon — join the waitlist on the booking page.",
  },
];

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="container mx-auto px-5 py-12 md:py-20">
      <Reveal>
        <p className="rebel-label">FAQ</p>
        <h2 className="rebel-hero-title text-3xl md:text-5xl font-black mt-2 leading-[1.05] max-w-2xl">
          The honest <span className="text-gradient-gold italic">answers.</span>
        </h2>
      </Reveal>
      <div className="mt-8 max-w-3xl mx-auto space-y-2">
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q} className={cn("rebel-card rounded-2xl overflow-hidden transition", isOpen && "border-primary/50")}>
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full flex items-center justify-between gap-4 p-4 md:p-5 text-left"
              >
                <span className="font-black text-sm md:text-base">{f.q}</span>
                {isOpen ? <Minus className="w-4 h-4 text-primary shrink-0" /> : <Plus className="w-4 h-4 text-primary shrink-0" />}
              </button>
              {isOpen && (
                <div className="px-4 md:px-5 pb-4 md:pb-5 text-sm text-muted-foreground leading-relaxed">{f.a}</div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
