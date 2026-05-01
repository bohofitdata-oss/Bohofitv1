import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Flame } from "lucide-react";

export const Route = createFileRoute("/bohofit")({
  head: () => ({
    meta: [
      { title: "Bohofit Group Classes — Offline machine-free training" },
      { name: "description", content: "Two clear formats: Boho Start for beginners (Spin, Yoga, Pilates, Zumba, Beginner Strength) and Boho Strength for intermediate/advanced (S&C, Calisthenics, Boxing, Weightlifting). Offline only." },
      { property: "og:title", content: "Bohofit Group Classes — Offline machine-free training" },
    ],
  }),
  component: BohofitPage,
});

const bohoStart = [
  "Spin",
  "Yoga",
  "Mat Pilates",
  "Beginner Strength",
  "Zumba",
];

const bohoStrength = [
  "Strength & Conditioning",
  "Calisthenics",
  "Boxing / Kickboxing",
  "Weightlifting",
];

const plans = [
  { name: "Monthly", price: "₹4,999", per: "/month", note: "Try the system." },
  { name: "3-Month", price: "₹12,999", per: "", note: "Build the habit.", best: true },
  { name: "6-Month", price: "₹22,999", per: "", note: "Real consistency." },
  { name: "Annual", price: "₹39,999", per: "", note: "Best monthly rate." },
];

function BohofitPage() {
  return (
    <SiteShell>
      <section className="container mx-auto px-5 pt-20 pb-12 text-center">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.18em] text-primary">Path 1 · Bohofit Group Classes — Offline only</p>
          <h1 className="mt-3 text-4xl md:text-6xl font-black tracking-tight">
            Train consistently. <span className="text-gradient-gold">Stay fit for life.</span>
          </h1>
          <p className="mt-5 text-muted-foreground max-w-xl mx-auto">
            Two formats. Pick the one that matches where you are right now.
          </p>
        </Reveal>
      </section>

      {/* TWO FORMATS */}
      <section className="container mx-auto px-5 py-12">
        <div className="grid md:grid-cols-2 gap-6">
          <Reveal>
            <div className="rounded-2xl border border-border bg-card p-7 h-full">
              <Sparkles className="w-6 h-6 text-primary" />
              <p className="mt-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">Format 1</p>
              <h2 className="mt-1 text-2xl md:text-3xl font-black">Boho Start</h2>
              <p className="mt-2 text-muted-foreground">For people who&rsquo;ve never trained &mdash; or are coming back after a long gap. Easy entry. Build the basics.</p>
              <ul className="mt-5 space-y-2">
                {bohoStart.map((c) => (
                  <li key={c} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" /> {c}
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-6 bg-gradient-gold text-primary-foreground border-0 hover:opacity-90">
                <Link to="/booking" search={{ path: "bohofit" }}>Join Boho Start</Link>
              </Button>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="rounded-2xl border bg-card p-7 h-full hairline shadow-elegant">
              <Flame className="w-6 h-6 text-primary" />
              <p className="mt-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">Format 2</p>
              <h2 className="mt-1 text-2xl md:text-3xl font-black">Boho Strength</h2>
              <p className="mt-2 text-muted-foreground">For intermediate to advanced trainees. Real strength, real intensity, no machines needed.</p>
              <ul className="mt-5 space-y-2">
                {bohoStrength.map((c) => (
                  <li key={c} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" /> {c}
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-6 bg-gradient-gold text-primary-foreground border-0 hover:opacity-90">
                <Link to="/booking" search={{ path: "bohofit" }}>Join Boho Strength</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container mx-auto px-5 py-16">
        <Reveal>
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-[0.18em] text-primary">Pricing</p>
            <h2 className="text-3xl md:text-4xl font-black mt-2">Pick your timeline</h2>
            <p className="text-sm text-muted-foreground mt-2">Same price for Boho Start or Boho Strength. One membership, your choice of format.</p>
          </div>
        </Reveal>
        <div className="grid md:grid-cols-4 gap-4">
          {plans.map((p) => (
            <div key={p.name} className={`rounded-2xl border p-6 bg-card ${p.best ? "hairline shadow-elegant" : "border-border"}`}>
              {p.best && <span className="text-[10px] uppercase tracking-widest text-primary font-semibold">Most picked</span>}
              <div className="mt-1 text-sm text-muted-foreground">{p.name}</div>
              <div className="mt-2 text-3xl font-black">{p.price}<span className="text-sm font-medium text-muted-foreground">{p.per}</span></div>
              <p className="mt-2 text-sm text-muted-foreground">{p.note}</p>
              <Button asChild className="mt-5 w-full bg-gradient-gold text-primary-foreground border-0 hover:opacity-90">
                <Link to="/booking" search={{ path: "bohofit" }}>Start {p.name}</Link>
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-5 py-16">
        <Reveal>
          <h2 className="text-2xl md:text-3xl font-black mb-6">Why Bohofit works</h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-4">
          {["Machine-free, joint-friendly", "Real coaches, small batches", "Offline only — show up & be present"].map((p) => (
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
