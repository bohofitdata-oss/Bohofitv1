import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { Check, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/bootcamp")({
  head: () => ({
    meta: [
      { title: "Boho 8-Week Bootcamp — Visible transformation, guaranteed" },
      { name: "description", content: "Lose 4–8 kg in 8 weeks. Structured training, daily diet, weekly check-ins. Designed for thyroid, PCOS, fatty liver, metabolic reset." },
      { property: "og:title", content: "Boho 8-Week Bootcamp — Visible transformation, guaranteed" },
    ],
  }),
  component: BootcampPage,
});

function BootcampPage() {
  return (
    <SiteShell>
      <section className="container mx-auto px-5 pt-20 pb-12 text-center">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.18em] text-primary">Path 2 · 8-Week Bootcamp</p>
          <h1 className="mt-3 text-4xl md:text-6xl font-black tracking-tight">
            Visible transformation in <span className="text-gradient-gold">8 weeks.</span>
          </h1>
          <p className="mt-5 text-muted-foreground max-w-xl mx-auto">
            Lose 4–8 kg. Drop a size or two. Feel like yourself again. Compliance gets you there — we make compliance easy.
          </p>
          <Button asChild size="lg" className="mt-8 bg-gradient-gold text-primary-foreground border-0 hover:opacity-90">
            <Link to="/booking" search={{ path: "bootcamp" }}>Join the next batch</Link>
          </Button>
        </Reveal>
      </section>

      <section className="container mx-auto px-5 py-12">
        <Reveal>
          <h2 className="text-2xl md:text-3xl font-black mb-8">What you get</h2>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            ["Structured 8-week training", "3–4 sessions per week, machine-free, scaled to you."],
            ["Daily personalized diet", "Indian meals, your goals, no boring chicken-broccoli."],
            ["Weekly check-ins", "Photos, weight, measurements, energy. We adjust as you go."],
            ["Lifestyle correction", "Sleep, water, walk steps, stress. The boring stuff that actually moves the needle."],
          ].map(([t, d]) => (
            <div key={t} className="rounded-xl border border-border bg-card p-5">
              <div className="font-bold">{t}</div>
              <p className="text-sm text-muted-foreground mt-1">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-5 py-12">
        <Reveal>
          <h2 className="text-2xl md:text-3xl font-black mb-6">Built for these conditions</h2>
        </Reveal>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
          {["Thyroid", "PCOD / PCOS", "Fatty liver", "Metabolic reset"].map((c) => (
            <div key={c} className="rounded-xl border border-border bg-card p-4 text-center font-semibold">
              {c}
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-5 py-16">
        <Reveal>
          <div className="rounded-2xl bg-card border border-border p-8 md:p-12 hairline shadow-elegant">
            <div className="flex items-start gap-4">
              <ShieldCheck className="w-8 h-8 text-primary shrink-0" />
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-primary">The Bohofit promise</p>
                <h3 className="mt-2 text-2xl md:text-3xl font-black">Visible transformation in 8 weeks &mdash; or your next month is on us.</h3>
                <p className="mt-3 text-muted-foreground">Conditions: 90% session attendance, daily diet logs, weekly check-ins. Show up. We&rsquo;ll deliver the result.</p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="container mx-auto px-5 py-12">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-primary">Pricing</p>
            <h3 className="text-3xl font-black mt-2">8 weeks · ₹18,999</h3>
            <p className="text-muted-foreground mt-2">Includes training, diet, check-ins, and Bohofit class access.</p>
            <ul className="mt-5 space-y-2">
              {["Small batch (max 20)", "Real coach, real attention", "Pay once. No surprise add-ons."].map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm"><Check className="w-4 h-4 text-primary mt-0.5" />{b}</li>
              ))}
            </ul>
            <Button asChild size="lg" className="mt-6 bg-gradient-gold text-primary-foreground border-0 hover:opacity-90">
              <Link to="/booking" search={{ path: "bootcamp" }}>Book my spot</Link>
            </Button>
          </div>
          <div className="rounded-2xl border border-border bg-card p-8">
            <div className="text-sm text-muted-foreground">Next batch starts</div>
            <div className="text-4xl font-black text-gradient-gold mt-1">In a week</div>
            <div className="text-sm text-muted-foreground mt-1">Mon / Wed / Fri · 6:30 AM &amp; 7:00 PM</div>
            <div className="mt-6 flex items-center gap-2">
              <div className="text-3xl font-black">12</div>
              <div className="text-sm text-muted-foreground">spots left of 20</div>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
