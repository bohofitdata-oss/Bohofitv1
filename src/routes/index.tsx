import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Dumbbell, HeartPulse, Sparkles, Flame, Star, X } from "lucide-react";
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
      { name: "description", content: "Pick a path: Group Classes, 8-Week Transformation, or 50+. India's first machine-free fitness system." },
      { property: "og:title", content: "Bohofit — Machine-free fitness that fits your life" },
      { property: "og:description", content: "Pick a path: Group Classes, 8-Week Transformation, or 50+." },
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
              <Star className="w-3 h-3 text-primary" /> Machine-free fitness
            </div>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="mt-4 md:mt-6 text-3xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight max-w-5xl mx-auto">
              Fitness that fits — <span className="text-gradient-gold">not machines.</span>
            </h1>
          </Reveal>
          <Reveal delay={320}>
            <div className="mt-5 md:mt-8 flex items-center justify-center gap-2 md:gap-3 flex-wrap">
              <Button asChild size="lg" className="bg-gradient-gold text-primary-foreground hover:opacity-90 border-0">
                <a href="#paths">Pick a path <ArrowRight className="ml-1 w-4 h-4" /></a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/booking">Speak with us</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 3 SQUARE PATH TILES */}
      <section id="paths" className="container mx-auto px-5 py-6 md:py-16">
        <Reveal>
          <div className="text-center mb-6 md:mb-10">
            <p className="text-xs uppercase tracking-[0.18em] text-primary">Step 1</p>
            <h2 className="text-2xl md:text-4xl font-black mt-2">Pick your path</h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-3 gap-3 md:gap-5 max-w-3xl mx-auto">
          {/* GROUP CLASSES */}
          <button
            type="button"
            onClick={() => setGroupOpen(true)}
            className="group aspect-square rounded-2xl border border-border bg-card p-3 md:p-5 flex flex-col items-center justify-center text-center hover:border-primary hover:-translate-y-0.5 transition"
          >
            <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl bg-gradient-gold flex items-center justify-center mb-2">
              <Dumbbell className="w-5 h-5 md:w-7 md:h-7 text-primary-foreground" />
            </div>
            <h3 className="font-black text-sm md:text-lg leading-tight">Group<br/>Classes</h3>
          </button>

          {/* BOOTCAMP — highlight */}
          <Link
            to="/bootcamp"
            className="group relative aspect-square rounded-2xl border-2 border-primary bg-gradient-to-br from-primary/15 to-card p-3 md:p-5 flex flex-col items-center justify-center text-center hover:-translate-y-0.5 hover:shadow-elegant transition"
          >
            <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[8px] md:text-[10px] uppercase tracking-widest bg-gradient-gold text-primary-foreground px-2 py-0.5 rounded-full font-bold whitespace-nowrap">
              Popular
            </span>
            <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl bg-gradient-gold flex items-center justify-center mb-2">
              <Flame className="w-5 h-5 md:w-7 md:h-7 text-primary-foreground" />
            </div>
            <h3 className="font-black text-sm md:text-lg leading-tight">8-Week<br/>Transformation</h3>
          </Link>

          {/* 50+ */}
          <Link
            to="/longevity"
            className="group aspect-square rounded-2xl border border-border bg-card p-3 md:p-5 flex flex-col items-center justify-center text-center hover:border-primary hover:-translate-y-0.5 transition"
          >
            <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl bg-gradient-gold flex items-center justify-center mb-2">
              <HeartPulse className="w-5 h-5 md:w-7 md:h-7 text-primary-foreground" />
            </div>
            <h3 className="font-black text-sm md:text-lg leading-tight">Bohofit<br/>50+</h3>
          </Link>
        </div>

        {/* Group Classes expansion modal-ish reveal */}
        {groupOpen && (
          <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setGroupOpen(false)}>
            <div
              className="relative w-full max-w-md rounded-2xl border border-border bg-card p-5"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setGroupOpen(false)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
              <p className="text-[10px] uppercase tracking-[0.18em] text-primary">Group Classes</p>
              <h3 className="font-black text-xl mt-1 mb-4">Pick your level</h3>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/bohofit"
                  className="aspect-square rounded-xl border border-border bg-background p-3 flex flex-col items-center justify-center text-center hover:border-primary transition"
                >
                  <Sparkles className="w-6 h-6 text-primary mb-2" />
                  <h4 className="font-black text-sm">Start</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Beginner</p>
                </Link>
                <Link
                  to="/bohofit"
                  className="aspect-square rounded-xl border border-border bg-background p-3 flex flex-col items-center justify-center text-center hover:border-primary transition"
                >
                  <Dumbbell className="w-6 h-6 text-primary mb-2" />
                  <h4 className="font-black text-sm">Strength</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Advanced</p>
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* PROGRAM FINDER QUIZ */}
      <ProgramFinder />

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
