import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { HeartPulse } from "lucide-react";

export const Route = createFileRoute("/longevity")({
  head: () => ({
    meta: [
      { title: "Boho Longevity — Move pain-free. Age strong." },
      { name: "description", content: "1:1 rehab-style coaching for 50+. Built for back pain, knee pain, neck pain, and mobility. Train without machines, train without pain." },
      { property: "og:title", content: "Boho Longevity — Move pain-free. Age strong." },
    ],
  }),
  component: LongevityPage,
});

const conditions = [
  { name: "Back pain", desc: "Strengthen the spine. Move without fear." },
  { name: "Knee pain", desc: "Build the muscles around the joint. Climb stairs again." },
  { name: "Neck pain", desc: "Release tension. Restore posture. Sleep better." },
  { name: "Mobility issues", desc: "Bend, reach, squat — without thinking about it." },
];

function LongevityPage() {
  return (
    <SiteShell>
      <section className="container mx-auto px-5 pt-20 pb-12 text-center">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.18em] text-primary">Path 3 · Boho Longevity</p>
          <h1 className="mt-3 text-4xl md:text-6xl font-black tracking-tight">
            Move pain-free. <span className="text-gradient-gold">Age strong.</span>
          </h1>
          <p className="mt-5 text-muted-foreground max-w-xl mx-auto">
            1:1 rehab-style coaching designed for adults 50+. No machines. No injuries. No guesswork.
          </p>
          <Button asChild size="lg" className="mt-8 bg-gradient-gold text-primary-foreground border-0 hover:opacity-90">
            <Link to="/booking" search={{ path: "longevity" }}>Book a free consult</Link>
          </Button>
        </Reveal>
      </section>

      <section className="container mx-auto px-5 py-12">
        <Reveal>
          <h2 className="text-2xl md:text-3xl font-black mb-8">Built for these problems</h2>
        </Reveal>
        <div className="grid sm:grid-cols-2 gap-4">
          {conditions.map((c, i) => (
            <Reveal key={c.name} delay={i * 80}>
              <div className="rounded-xl border border-border bg-card p-6 flex items-start gap-4">
                <HeartPulse className="w-6 h-6 text-primary mt-1 shrink-0" />
                <div>
                  <div className="font-bold text-lg">{c.name}</div>
                  <p className="text-sm text-muted-foreground mt-1">{c.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-5 py-16">
        <Reveal>
          <div className="rounded-2xl bg-card border border-border p-8 md:p-12 hairline">
            <h3 className="text-2xl md:text-3xl font-black">How it works</h3>
            <ol className="mt-6 grid md:grid-cols-3 gap-5">
              {[
                ["1", "Free consult", "30 minutes. We listen. We assess. No sales pitch."],
                ["2", "Custom plan", "Built around your body, your conditions, your schedule."],
                ["3", "Twice-weekly 1:1", "With your dedicated coach. In-studio or on Google Meet."],
              ].map(([n, t, d]) => (
                <li key={n}>
                  <div className="text-gradient-gold font-black text-3xl">{n}</div>
                  <div className="font-bold mt-2">{t}</div>
                  <p className="text-sm text-muted-foreground mt-1">{d}</p>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      </section>

      <section className="container mx-auto px-5 py-12">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-primary">Investment</p>
            <h3 className="text-3xl font-black mt-2">From ₹34,999 / 12 weeks</h3>
            <p className="text-muted-foreground mt-2">Premium 1:1 coaching. Consultation-first — we won&rsquo;t take you on if it&rsquo;s not the right fit.</p>
            <Button asChild size="lg" className="mt-6 bg-gradient-gold text-primary-foreground border-0 hover:opacity-90">
              <Link to="/booking" search={{ path: "longevity" }}>Book my consult</Link>
            </Button>
          </div>
          <div className="rounded-2xl border border-border bg-card p-8 text-sm text-muted-foreground">
            <span className="text-foreground font-bold text-lg block mb-2">No machines. Ever.</span>
            Machines pin your joints into one path. Your body wasn&rsquo;t built that way. We train you the way you actually live — standing, bending, lifting, walking.
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
