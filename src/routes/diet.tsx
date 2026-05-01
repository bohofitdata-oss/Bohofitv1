import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { Salad } from "lucide-react";

export const Route = createFileRoute("/diet")({
  head: () => ({
    meta: [
      { title: "Go Boho Diet — Personalized nutrition that actually fits Indian life" },
      { name: "description", content: "Goal-based diet plans, clean meals, smoothies and mocktails from Go Boho. Pair with any Bohofit path." },
      { property: "og:title", content: "Go Boho Diet — Personalized nutrition" },
    ],
  }),
  component: DietPage,
});

function DietPage() {
  return (
    <SiteShell>
      <section className="container mx-auto px-5 pt-20 pb-12 text-center">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.18em] text-primary">Diet · Go Boho</p>
          <h1 className="mt-3 text-4xl md:text-6xl font-black tracking-tight">
            Eat clean. <span className="text-gradient-gold">Without the chaos.</span>
          </h1>
          <p className="mt-5 text-muted-foreground max-w-xl mx-auto">
            Personalized plans. Real Indian meals. Daily targets you actually hit.
          </p>
        </Reveal>
      </section>

      <section className="container mx-auto px-5 py-12 grid md:grid-cols-3 gap-5">
        {[
          { t: "Goal-based plans", d: "Fat loss, strength, recovery — your plan, your goal." },
          { t: "Daily meal plan", d: "Breakfast, lunch, snack, dinner. With swaps." },
          { t: "Go Boho add-ons", d: "Cold-pressed juices, smoothies, mocktails, clean meals." },
        ].map((b, i) => (
          <Reveal key={b.t} delay={i * 100}>
            <div className="rounded-2xl border border-border bg-card p-6 h-full">
              <Salad className="w-6 h-6 text-primary" />
              <div className="font-bold mt-3">{b.t}</div>
              <p className="text-sm text-muted-foreground mt-1">{b.d}</p>
            </div>
          </Reveal>
        ))}
      </section>

      <section className="container mx-auto px-5 py-12">
        <Reveal>
          <h2 className="text-2xl md:text-3xl font-black mb-8">Subscribe how you want</h2>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="rounded-2xl border border-border bg-card p-7">
            <div className="text-sm text-muted-foreground">Fitness only</div>
            <div className="text-3xl font-black mt-1">From ₹4,999</div>
            <p className="text-sm text-muted-foreground mt-2">Any Bohofit path. No diet add-on.</p>
            <Button asChild variant="outline" className="mt-5"><Link to="/bohofit">See plans</Link></Button>
          </div>
          <div className="rounded-2xl border bg-card p-7 hairline shadow-elegant">
            <div className="text-sm text-primary uppercase tracking-widest text-xs">Most picked</div>
            <div className="text-sm text-muted-foreground mt-1">Fitness + Diet</div>
            <div className="text-3xl font-black mt-1">From ₹7,999</div>
            <p className="text-sm text-muted-foreground mt-2">Bohofit path + personalized Go Boho diet plan.</p>
            <Button asChild className="mt-5 bg-gradient-gold text-primary-foreground border-0 hover:opacity-90">
              <Link to="/booking">Get started</Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
