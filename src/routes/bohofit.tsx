import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export const Route = createFileRoute("/bohofit")({
  head: () => ({
    meta: [
      { title: "Bohofit Classes — Machine-free group training" },
      { name: "description", content: "Spin, Yoga, Pilates, Zumba, Strength, Boxing. Small batches, real coaches, no machines. Train consistently. Stay fit for life." },
      { property: "og:title", content: "Bohofit Classes — Machine-free group training" },
    ],
  }),
  component: BohofitPage,
});

const categories = [
  { name: "Boho Start", desc: "Easy entry. Build the basics." },
  { name: "Spin", desc: "Cardio that doesn't feel like punishment." },
  { name: "Yoga", desc: "Strength, flexibility, calm." },
  { name: "Mat Pilates", desc: "Core control. Posture. Stability." },
  { name: "Zumba", desc: "Dance off the calories." },
  { name: "Basic Strength", desc: "Bodyweight + bands fundamentals." },
  { name: "Boho Strength", desc: "Real strength, no barbells needed." },
  { name: "Strength & Conditioning", desc: "Athletic conditioning, full body." },
  { name: "Calisthenics", desc: "Move your bodyweight with skill." },
  { name: "Boxing / Kickboxing", desc: "Power, speed, stress relief." },
  { name: "Advanced Training", desc: "For people who already train hard." },
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
          <p className="text-xs uppercase tracking-[0.18em] text-primary">Path 1 · Bohofit Group Classes — Offline</p>
          <h1 className="mt-3 text-4xl md:text-6xl font-black tracking-tight">
            Train consistently. <span className="text-gradient-gold">Stay fit for life.</span>
          </h1>
          <p className="mt-5 text-muted-foreground max-w-xl mx-auto">
            Machine-free offline group classes designed for adults 28–55. Show up. We&rsquo;ll do the rest.
          </p>
        </Reveal>
      </section>

      <section className="container mx-auto px-5 py-12">
        <Reveal>
          <h2 className="text-2xl md:text-3xl font-black mb-8">11 ways to train. One membership.</h2>
        </Reveal>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((c, i) => (
            <Reveal key={c.name} delay={i * 50}>
              <div className="rounded-xl border border-border bg-card p-5 h-full">
                <div className="font-bold">{c.name}</div>
                <p className="text-sm text-muted-foreground mt-1">{c.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-5 py-16">
        <Reveal>
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-[0.18em] text-primary">Pricing</p>
            <h2 className="text-3xl md:text-4xl font-black mt-2">Pick your timeline</h2>
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
          {["Machine-free, joint-friendly", "Real coaches, small batches", "Built for sustainability"].map((p) => (
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
