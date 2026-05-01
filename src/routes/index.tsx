import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Dumbbell, HeartPulse, Sparkles, Star } from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bohofit — Machine-free fitness that fits your life" },
      { name: "description", content: "Choose your path: long-term fitness, 8-week transformation, or pain-free movement after 50. India's first machine-free fitness system." },
      { property: "og:title", content: "Bohofit — Machine-free fitness that fits your life" },
      { property: "og:description", content: "Choose your path: long-term fitness, 8-week transformation, or pain-free movement after 50." },
    ],
  }),
  component: Home,
});

const paths = [
  {
    to: "/bohofit" as const,
    tag: "Bohofit Group Classes — Offline",
    icon: Dumbbell,
    headline: "I want to stay fit long-term",
    desc: "Offline group classes that build a habit you actually keep.",
    bullets: ["Two formats: beginner & advanced", "Small batches, real coaches, in-studio", "Monthly to annual plans"],
    cta: "Explore group classes",
  },
  {
    to: "/bootcamp" as const,
    tag: "Boho Bootcamp — 8-Week Transformation",
    icon: Sparkles,
    headline: "I want fast, visible results",
    desc: "8-week transformation program with guaranteed results.",
    bullets: ["Lose 4–8 kg in 8 weeks", "PCOS, thyroid, fatty liver friendly", "Guaranteed results"],
    cta: "Join the next batch",
    featured: true,
  },
  {
    to: "/longevity" as const,
    tag: "Boho at 50+",
    icon: HeartPulse,
    headline: "I want to move pain-free at 50+",
    desc: "Extremely personal training for people 50 and above.",
    bullets: ["Built exclusively for 50+", "1:1 coach, twice a week", "Gentle, progressive, pain-free"],
    cta: "Book a consult",
  },
];

function Home() {
  return (
    <SiteShell>
      {/* HERO */}
      <section className="relative">
        <div className="container mx-auto px-5 pt-20 pb-12 md:pt-28 md:pb-20 text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground border border-border rounded-full px-3 py-1">
              <Star className="w-3 h-3 text-primary" /> India&rsquo;s first machine-free fitness system
            </div>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="mt-6 text-4xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight max-w-5xl mx-auto">
              Fitness that fits your life — <span className="text-gradient-gold">not machines.</span>
            </h1>
          </Reveal>
          <Reveal delay={220}>
            <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
              Choose your path based on your goal. One of these three is built for you.
            </p>
          </Reveal>
          <Reveal delay={320}>
            <div className="mt-8 flex items-center justify-center gap-3">
              <Button asChild size="lg" className="bg-gradient-gold text-primary-foreground hover:opacity-90 border-0">
                <a href="#paths">Choose your path <ArrowRight className="ml-1 w-4 h-4" /></a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/booking">Talk to a coach</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 3 PATHS */}
      <section id="paths" className="container mx-auto px-5 py-12 md:py-16">
        <Reveal>
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.18em] text-primary">Step 1</p>
            <h2 className="text-3xl md:text-4xl font-black mt-2">Pick the path that fits you</h2>
          </div>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-5">
          {paths.map((p, i) => (
            <Reveal key={p.to} delay={i * 120}>
              <Link
                to={p.to}
                className={`group relative block rounded-2xl bg-card p-7 h-full shadow-card transition-all hover:-translate-y-1 hover:shadow-elegant border ${
                  p.featured ? "hairline" : "border-border"
                }`}
              >
                {p.featured && (
                  <span className="absolute -top-3 left-7 text-[10px] uppercase tracking-widest bg-gradient-gold text-primary-foreground px-2 py-1 rounded-full font-semibold">
                    Most popular
                  </span>
                )}
                <p.icon className="w-6 h-6 text-primary" />
                <p className="mt-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">{p.tag}</p>
                <h3 className="mt-2 text-2xl font-black leading-tight">{p.headline}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
                <p className="mt-6 text-xs uppercase tracking-[0.18em] text-muted-foreground">Pick this if&hellip;</p>
                <ul className="mt-3 space-y-2">
                  {p.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" /> {b}
                    </li>
                  ))}
                </ul>
                <div className="mt-7 inline-flex items-center text-sm font-semibold text-primary">
                  {p.cta} <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="container mx-auto px-5 py-16 md:py-24">
        <Reveal>
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.18em] text-primary">How it works</p>
            <h2 className="text-3xl md:text-4xl font-black mt-2">Four simple steps</h2>
          </div>
        </Reveal>
        <div className="grid md:grid-cols-4 gap-5">
          {[
            { n: "01", t: "Choose your path", d: "Pick the program built for your goal." },
            { n: "02", t: "Tell us a bit", d: "A 60-second form. No medical jargon." },
            { n: "03", t: "Get your plan", d: "We share the plan, schedule, and price." },
            { n: "04", t: "Book or consult", d: "Start training. Or talk to a coach first." },
          ].map((s, i) => (
            <Reveal key={s.n} delay={i * 100}>
              <div className="rounded-2xl border border-border bg-card p-6 h-full">
                <div className="text-gradient-gold font-black text-3xl">{s.n}</div>
                <h3 className="mt-3 font-bold">{s.t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CLOSING TAGLINE */}
      <section className="container mx-auto px-5 py-20 text-center">
        <Reveal>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight max-w-3xl mx-auto">
            Train consistently. <span className="text-gradient-gold">Stay fit for life.</span>
          </h2>
          <Button asChild size="lg" className="mt-8 bg-gradient-gold text-primary-foreground hover:opacity-90 border-0">
            <Link to="/booking">Start today</Link>
          </Button>
        </Reveal>
      </section>
    </SiteShell>
  );
}
