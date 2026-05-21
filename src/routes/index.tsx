import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Check, Dumbbell, HeartPulse, Sparkles, Flame, Star, ChevronDown } from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { Reveal } from "@/components/Reveal";
import { JourneyMap } from "@/components/JourneyMap";
import { ProgramFinder } from "@/components/ProgramFinder";
import { Testimonials } from "@/components/Testimonials";
import { FiftyPlusFeature } from "@/components/FiftyPlusFeature";
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

function Home() {
  const [groupOpen, setGroupOpen] = useState(false);

  return (
    <SiteShell>
      {/* HERO */}
      <section className="relative">
        <div className="container mx-auto px-5 pt-10 pb-6 md:pt-28 md:pb-20 text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 text-[10px] md:text-xs uppercase tracking-[0.18em] text-muted-foreground border border-border rounded-full px-3 py-1">
              <Star className="w-3 h-3 text-primary" /> India&rsquo;s first machine-free fitness system
            </div>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="mt-4 md:mt-6 text-3xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight max-w-5xl mx-auto">
              Fitness that fits your life — <span className="text-gradient-gold">not machines.</span>
            </h1>
          </Reveal>
          <Reveal delay={220}>
            <p className="mt-3 md:mt-5 text-sm md:text-lg text-muted-foreground max-w-xl mx-auto">
              Pick one of three. That&rsquo;s it.
            </p>
          </Reveal>
          <Reveal delay={320}>
            <div className="mt-5 md:mt-8 flex items-center justify-center gap-2 md:gap-3 flex-wrap">
              <Button asChild size="lg" className="bg-gradient-gold text-primary-foreground hover:opacity-90 border-0">
                <a href="#paths">Choose your path <ArrowRight className="ml-1 w-4 h-4" /></a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/booking">Speak with us</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 3 PATHS — stacked vertically */}
      <section id="paths" className="container mx-auto px-5 py-6 md:py-16">
        <Reveal>
          <div className="text-center mb-5 md:mb-12">
            <p className="text-xs uppercase tracking-[0.18em] text-primary">Step 1</p>
            <h2 className="text-2xl md:text-4xl font-black mt-2">Pick your path</h2>
          </div>
        </Reveal>

        <div className="max-w-3xl mx-auto space-y-4">
          {/* GROUP CLASSES — expandable */}
          <Reveal>
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <button
                type="button"
                onClick={() => setGroupOpen((v) => !v)}
                className="w-full flex items-center gap-4 p-5 md:p-6 text-left hover:bg-muted/40 transition"
                aria-expanded={groupOpen}
              >
                <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center">
                  <Dumbbell className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] md:text-xs uppercase tracking-[0.18em] text-muted-foreground">Group classes</p>
                  <h3 className="text-lg md:text-2xl font-black leading-tight mt-0.5">Stay fit long-term</h3>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1">Pick your level — Start or Strength.</p>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-primary shrink-0 transition-transform ${groupOpen ? "rotate-180" : ""}`}
                />
              </button>

              {groupOpen && (
                <div className="grid sm:grid-cols-2 gap-3 p-4 md:p-5 pt-0 md:pt-0 border-t border-border">
                  <Link
                    to="/bohofit"
                    className="group rounded-xl border border-border bg-background p-4 hover:border-primary transition"
                  >
                    <Sparkles className="w-5 h-5 text-primary" />
                    <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Beginner</p>
                    <h4 className="font-black mt-0.5">Bohofit Start</h4>
                    <p className="text-xs text-muted-foreground mt-1">Yoga · Spin · Pilates · Zumba · Beginner Strength</p>
                    <span className="mt-3 inline-flex items-center text-xs font-semibold text-primary">
                      View plans <ArrowRight className="ml-1 w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                  <Link
                    to="/bohofit"
                    className="group rounded-xl border border-border bg-background p-4 hover:border-primary transition"
                  >
                    <Dumbbell className="w-5 h-5 text-primary" />
                    <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Advanced</p>
                    <h4 className="font-black mt-0.5">Boho Strength</h4>
                    <p className="text-xs text-muted-foreground mt-1">Calisthenics · S&C · Boxing · Weightlifting</p>
                    <span className="mt-3 inline-flex items-center text-xs font-semibold text-primary">
                      View plans <ArrowRight className="ml-1 w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </div>
              )}
            </div>
          </Reveal>

          {/* BOOTCAMP */}
          <Reveal delay={80}>
            <Link
              to="/bootcamp"
              className="relative flex items-center gap-4 rounded-2xl border hairline bg-card p-5 md:p-6 hover:-translate-y-0.5 hover:shadow-elegant transition"
            >
              <span className="absolute -top-2 right-4 text-[9px] uppercase tracking-widest bg-gradient-gold text-primary-foreground px-2 py-0.5 rounded-full font-semibold">
                Popular
              </span>
              <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center">
                <Flame className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] md:text-xs uppercase tracking-[0.18em] text-muted-foreground">8-week transformation</p>
                <h3 className="text-lg md:text-2xl font-black leading-tight mt-0.5">Fast, visible results</h3>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">Lose 4–8 kg in 8 weeks. Guaranteed.</p>
              </div>
              <ArrowRight className="w-5 h-5 text-primary shrink-0" />
            </Link>
          </Reveal>

          {/* 50+ */}
          <Reveal delay={160}>
            <Link
              to="/longevity"
              className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 md:p-6 hover:-translate-y-0.5 hover:shadow-elegant transition"
            >
              <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center">
                <HeartPulse className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] md:text-xs uppercase tracking-[0.18em] text-muted-foreground">Bohofit at 50+</p>
                <h3 className="text-lg md:text-2xl font-black leading-tight mt-0.5">Pain-free at 50+</h3>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">1:1 coach, twice a week. Built for you.</p>
              </div>
              <ArrowRight className="w-5 h-5 text-primary shrink-0" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* PROGRAM FINDER QUIZ */}
      <ProgramFinder />

      <section className="container mx-auto px-5 py-16 md:py-24">
        <Reveal>
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.18em] text-primary">How it works</p>
            <h2 className="text-3xl md:text-4xl font-black mt-2">Four simple steps</h2>
          </div>
        </Reveal>
        <div className="grid md:grid-cols-4 gap-5">
          {[
            { n: "01", t: "Pick your path", d: "One of the three above." },
            { n: "02", t: "Quick form", d: "60 seconds. Plain English." },
            { n: "03", t: "Get your plan", d: "Schedule and price, sent to you." },
            { n: "04", t: "Start or chat", d: "Begin training, or talk to us." },
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

      {/* JOURNEY LIFECYCLE CHART */}
      <JourneyMap />

      {/* FLAGSHIP 50+ PROGRAM */}
      <FiftyPlusFeature />

      {/* SOCIAL PROOF */}
      <Testimonials />

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
