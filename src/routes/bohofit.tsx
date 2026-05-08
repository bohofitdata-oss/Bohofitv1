import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteShell } from "@/components/SiteShell";
import { Reveal } from "@/components/Reveal";
import { ProgramSwitcher } from "@/components/ProgramSwitcher";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Flame, Infinity as InfinityIcon, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { GeneralFitnessTerms, allGeneralTermsAccepted } from "@/components/GeneralFitnessTerms";
import { toast } from "sonner";

export const Route = createFileRoute("/bohofit")({
  head: () => ({
    meta: [
      { title: "Bohofit Group Classes — Start, Strength & Unlimited" },
      { name: "description", content: "Three offline programs at HSR Bangalore. Bohofit Start (beginners), Boho Strength (advanced), and Bohofit Unlimited (everything)." },
      { property: "og:title", content: "Bohofit Group Classes — Start, Strength & Unlimited" },
    ],
  }),
  component: BohofitPage,
});

type Tab = "start" | "strength" | "unlimited";

const startFormats = ["Yoga", "Spin", "Zumba", "Mat Pilates", "Beginner Strength"];
const strengthFormats = ["Calisthenics", "S&C", "Boxing / Kickboxing", "Weightlifting"];
const unlimitedFormats = [...startFormats, ...strengthFormats];

type Plan = { months: string; price: string; pause: string; perks: string[]; best?: boolean };

const startPlans: Plan[] = [
  { months: "12 Months", price: "₹14,174", pause: "45 days", perks: ["Unlimited classes & formats", "Full diet consultation", "6 free goBoho meals", "Transfer available (₹599 ERP fee)", "Smart switch available"], best: true },
  { months: "6 Months", price: "₹10,499", pause: "30 days", perks: ["Unlimited classes & formats", "Full diet consultation", "3 free goBoho meals", "Transfer available (₹599 ERP fee)", "Smart switch available"] },
  { months: "3 Months", price: "₹7,348", pause: "15 days", perks: ["Unlimited classes & formats", "Full diet consultation", "Transfer not possible"] },
  { months: "2 Months", price: "₹5,774", pause: "7 days", perks: ["Unlimited classes & formats", "Full diet consultation", "Transfer not possible"] },
];

const strengthPlans: Plan[] = startPlans;

const unlimitedPlans: Plan[] = [
  { months: "12 Months", price: "₹15,999", pause: "60 days", perks: ["All 7 formats — Start + Strength", "Full diet consultation", "6 free goBoho meals", "Transfer available (₹599 ERP fee)", "Smart switch available"], best: true },
  { months: "6 Months", price: "₹11,999", pause: "30 days", perks: ["All 7 formats — Start + Strength", "Full diet consultation", "3 free goBoho meals", "Transfer available (₹599 ERP fee)", "Smart switch available"] },
  { months: "3 Months", price: "₹8,200", pause: "15 days", perks: ["All 7 formats — Start + Strength", "Full diet consultation", "Transfer not possible"] },
  { months: "2 Months", price: "₹6,499", pause: "7 days", perks: ["All 7 formats — Start + Strength", "Full diet consultation", "Transfer not possible"] },
];

const TAB_META: Record<Tab, { name: string; tagline: string; icon: React.ComponentType<{ className?: string }>; sub: string; formats: string[]; plans: Plan[] }> = {
  start: { name: "Bohofit Start", tagline: "India's safest start to fitness — beginners & comeback journeys.", icon: Sparkles, sub: "Unlimited classes across 5 beginner-friendly formats.", formats: startFormats, plans: startPlans },
  strength: { name: "Boho Strength", tagline: "Strength without limits. Flexibility without compromise.", icon: Flame, sub: "Unlimited classes across 4 strength formats.", formats: strengthFormats, plans: strengthPlans },
  unlimited: { name: "Bohofit Unlimited", tagline: "Train everything. One membership.", icon: InfinityIcon, sub: "All 7 formats — Start + Strength, no class limits.", formats: unlimitedFormats, plans: unlimitedPlans },
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
          <p className="text-xs uppercase tracking-[0.18em] text-primary">Bohofit Group Classes · HSR Layout, Bangalore</p>
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
                <span key={f} className="text-xs font-semibold rounded-full border border-border px-3 py-1.5">{f}</span>
              ))}
            </div>
            <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
              <Home className="w-3.5 h-3.5 text-primary" /> Prefer to train at home? Speak with us — we tailor delivery to your setting.
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
              <div className="text-sm text-muted-foreground mt-1">{p.months}</div>
              <div className="mt-1 text-3xl font-black">{p.price}</div>
              <div className="text-xs text-muted-foreground">Pause balance · {p.pause}</div>
              <ul className="mt-4 space-y-2 flex-1">
                {p.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2 text-xs">
                    <Check className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" /> {perk}
                  </li>
                ))}
              </ul>
              <Button
                asChild={accepted}
                disabled={!accepted}
                onClick={() => { if (!accepted) toast.error("Please accept all terms below to continue"); }}
                className="mt-5 bg-gradient-gold text-primary-foreground border-0 hover:opacity-90 disabled:opacity-50"
              >
                {accepted ? (
                  <Link to="/booking" search={{ path: "bohofit" }}>Start {p.months}</Link>
                ) : (
                  <span>Accept terms to continue</span>
                )}
              </Button>
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
          <h2 className="text-2xl md:text-3xl font-black mb-6 text-center">Why Bohofit works</h2>
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
