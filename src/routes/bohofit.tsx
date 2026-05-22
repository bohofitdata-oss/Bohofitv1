import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteShell } from "@/components/SiteShell";
import { Reveal } from "@/components/Reveal";
import { ProgramSwitcher } from "@/components/ProgramSwitcher";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Flame, Infinity as InfinityIcon, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { GeneralFitnessTerms, allGeneralTermsAccepted, scrollToFirstUncheckedTerm } from "@/components/GeneralFitnessTerms";
import { toast } from "sonner";

export const Route = createFileRoute("/bohofit")({
  head: () => ({
    meta: [
      { title: "Rebel Group Classes — Start, Strength & Unlimited" },
      { name: "description", content: "Three offline programs at HSR Bangalore. Rebel Start (beginners), Rebel Strength (advanced), and Rebel Unlimited (everything)." },
      { property: "og:title", content: "Rebel Group Classes — Start, Strength & Unlimited" },
    ],
  }),
  component: BohofitPage,
});

type Tab = "start" | "strength" | "unlimited";

const startFormats = ["Yoga", "Zumba", "Beginner Strength", "Mat Pilates"];
const strengthFormats = ["Calisthenics", "S&C", "Weightlifting"];
const unlimitedFormats = [...startFormats, ...strengthFormats];

type Plan = { months: string; phase?: string; price: string; pause: string; perks: string[]; best?: boolean };

// Per official pricing posters
const startPlans: Plan[] = [
  { months: "2 Months", phase: "Phase 1 · Learn Movement", price: "₹5,744", pause: "7 days", perks: ["Unlimited classes (all 4 Start formats)", "Diet consultation +₹1,000", "Transfer not available"] },
  { months: "3 Months", phase: "Phase 2 · Build Consistency", price: "₹8,499", pause: "15 days", perks: ["Unlimited classes (all 4 Start formats)", "Diet consultation +₹1,000", "Transfer not available"] },
  { months: "6 Months", phase: "Phase 3 · Graduate", price: "₹11,999", pause: "30 days", perks: ["Unlimited classes (all 4 Start formats)", "Full diet consultation included", "Transfer available (₹599 ERP fee)", "Smart switch available"], best: true },
];

const strengthPlans: Plan[] = [
  { months: "2 Months", phase: "Phase 1 · Controlled Intensity", price: "₹5,999", pause: "7 days", perks: ["Unlimited classes (all 3 Strength formats)", "Diet consultation +₹1,000", "Transfer not available"] },
  { months: "3 Months", phase: "Phase 2 · Progress Tracking", price: "₹8,999", pause: "15 days", perks: ["Unlimited classes (all 3 Strength formats)", "Diet consultation +₹1,000", "Transfer not available"] },
  { months: "6 Months", phase: "Phase 3 · Performance", price: "₹12,999", pause: "30 days", perks: ["Unlimited classes (all 3 Strength formats)", "Full diet consultation included", "Transfer available (₹599 ERP fee)", "Smart switch available"] },
  { months: "12 Months", phase: "Phase 4 · Ultimate", price: "₹16,999", pause: "45 days", perks: ["Unlimited classes (all 3 Strength formats)", "Full diet consultation included", "Transfer available (₹599 ERP fee)", "Smart switch available"], best: true },
];

const unlimitedPlans: Plan[] = [
  { months: "3 Months", phase: "Option 1", price: "₹10,499", pause: "15 days", perks: ["Unlimited classes — all 7 formats", "Diet consultation +₹1,000", "Transfer not available"] },
  { months: "6 Months", phase: "Option 2", price: "₹14,999", pause: "30 days", perks: ["Unlimited classes — all 7 formats", "Full diet consultation included", "Transfer available (₹599 ERP fee)", "Smart switch available"] },
  { months: "12 Months", phase: "Option 3", price: "₹18,499", pause: "60 days", perks: ["Unlimited classes — all 7 formats", "Full diet consultation included", "Transfer available (₹599 ERP fee)", "Smart switch available"], best: true },
];

const TAB_META: Record<Tab, { name: string; tagline: string; icon: React.ComponentType<{ className?: string }>; sub: string; formats: string[]; plans: Plan[] }> = {
  start: { name: "Rebel Start", tagline: "India's safest start to fitness — beginners & comeback journeys.", icon: Sparkles, sub: "Unlimited classes across 4 beginner-friendly formats.", formats: startFormats, plans: startPlans },
  strength: { name: "Rebel Strength", tagline: "Strength without limits.", icon: Flame, sub: "Unlimited classes across 3 strength formats.", formats: strengthFormats, plans: strengthPlans },
  unlimited: { name: "Rebel One", tagline: "Train everything. One membership.", icon: InfinityIcon, sub: "All 7 formats — Start + Strength, no class limits.", formats: unlimitedFormats, plans: unlimitedPlans },
};

function BohofitPage() {
  const [tab, setTab] = useState<Tab>("start");
  const [terms, setTerms] = useState<Record<string, boolean>>({});
  const meta = TAB_META[tab];
  const accepted = allGeneralTermsAccepted(terms);

  return (
    <SiteShell>
      <section className="container mx-auto px-5 pt-12 md:pt-20 pb-6 text-center">
        <Reveal>
          <div className="flex justify-center mb-4"><ProgramSwitcher current="bohofit" /></div>
          <p className="text-xs uppercase tracking-[0.18em] text-primary">Rebel Group Classes · HSR Layout, Bangalore</p>
          <h1 className="mt-3 text-3xl md:text-6xl font-black tracking-tight">
            India's first <span className="text-gradient-gold">machine-free</span> fitness center.
          </h1>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Three programs. Pick where you are. Move when you're ready.
          </p>
        </Reveal>
      </section>

      {/* TAB SELECTOR */}
      <section className="container mx-auto px-5 pt-2">
        <div className="flex gap-2 overflow-x-auto pb-2 sm:justify-center">
          {(Object.keys(TAB_META) as Tab[]).map((t) => {
            const Icon = TAB_META[t].icon;
            const active = t === tab;
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "shrink-0 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold border transition-colors",
                  active ? "bg-gradient-gold text-primary-foreground border-transparent" : "border-border bg-card hover:border-primary",
                )}
              >
                <Icon className="w-4 h-4" /> {TAB_META[t].name}
              </button>
            );
          })}
        </div>
      </section>

      {/* PROGRAM DETAIL */}
      <section className="container mx-auto px-5 py-8">
        <Reveal>
          <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.18em] text-primary">{meta.name}</p>
            <h2 className="mt-2 text-2xl md:text-3xl font-black">{meta.tagline}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{meta.sub}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {meta.formats.map((f) => (
                <span key={f} className="text-sm md:text-base font-black uppercase tracking-wide rounded-full border border-primary/40 bg-background text-white px-4 py-2">{f}</span>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* PRICING */}
      <section className="container mx-auto px-5 pb-16">
        <Reveal>
          <div className="text-center mb-8">
            <p className="text-xs uppercase tracking-[0.18em] text-primary">Membership pricing</p>
            <h2 className="text-2xl md:text-3xl font-black mt-2">Pick your timeline</h2>
            <p className="text-xs text-muted-foreground mt-2">All prices GST inclusive · No refund unless we cannot deliver.</p>
          </div>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {meta.plans.map((p) => (
            <div key={p.months} className={cn("rounded-2xl border bg-card p-5 flex flex-col", p.best ? "hairline shadow-elegant" : "border-border")}>
              {p.best && <span className="text-[10px] uppercase tracking-widest text-primary font-semibold">Most popular</span>}
              {p.phase && <div className="text-[10px] uppercase tracking-widest text-primary/80 mt-1">{p.phase}</div>}
              <div className="text-sm text-muted-foreground mt-1">{p.months}</div>
              <div className="mt-1 text-3xl font-black">{p.price}</div>
              <div className="text-[11px] text-muted-foreground">All inclusive · Pause {p.pause}</div>
              <ul className="mt-4 space-y-2 flex-1">
                {p.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2 text-xs">
                    <Check className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" /> {perk}
                  </li>
                ))}
              </ul>
              {accepted ? (
                <Button asChild className="mt-5 bg-gradient-gold text-primary-foreground border-0 hover:opacity-90">
                  <Link to="/booking" search={{ path: "bohofit" }}>Start {p.months}</Link>
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={() => {
                    toast.error("Please tick all terms below to continue");
                    scrollToFirstUncheckedTerm(terms);
                  }}
                  className="mt-5 bg-muted text-foreground hover:bg-muted/80 border border-border"
                >
                  Accept terms to continue
                </Button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* TERMS & CONDITIONS */}
      <section className="container mx-auto px-5 pb-16">
        <Reveal>
          <div className="text-center mb-6">
            <p className="text-xs uppercase tracking-[0.18em] text-primary">Before you join</p>
            <h2 className="text-2xl md:text-3xl font-black mt-2">Terms &amp; conditions</h2>
            <p className="text-xs text-muted-foreground mt-2">Tick every box. Tap any rule to read the full version.</p>
          </div>
        </Reveal>
        <GeneralFitnessTerms checked={terms} onChange={setTerms} />
      </section>

      <section className="container mx-auto px-5 pb-20">
        <Reveal>
          <h2 className="text-2xl md:text-3xl font-black mb-6 text-center">Why Rebel works</h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-4">
          {["Machine-free, joint-friendly", "Real coaches, small batches", "Pause anytime · transfer where allowed"].map((p) => (
            <div key={p} className="rounded-xl border border-border bg-card p-5 flex items-start gap-3">
              <Check className="w-5 h-5 text-primary mt-0.5" />
              <span className="font-semibold">{p}</span>
            </div>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
