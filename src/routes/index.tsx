import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Star, Sparkles, Dumbbell, Flame, HeartPulse, Check } from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { Reveal } from "@/components/Reveal";
import { Testimonials } from "@/components/Testimonials";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LocationBanner } from "@/components/LocationBanner";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { RebelCafe } from "@/components/RebelCafe";
import { FAQSection } from "@/components/FAQSection";
import { ReferralSection } from "@/components/ReferralSection";

import imgStart from "@/assets/program-start.jpg";
import imgStrength from "@/assets/program-strength.jpg";
import imgBootcamp from "@/assets/program-bootcamp.jpg";
import imgFifty from "@/assets/program-fiftyplus.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rebel — Machine-free fitness that fits your life" },
      { name: "description", content: "Group Classes, 8-Week Transformation, or Rebel 50+. India's first machine-free fitness system." },
      { property: "og:title", content: "Rebel — Machine-free fitness that fits your life" },
      { property: "og:description", content: "Pick a path: Group Classes, 8-Week Transformation, or Rebel 50+." },
    ],
  }),
  component: Home,
});

type TabKey = "group" | "bootcamp" | "fifty";

type Card = {
  tag: string;
  title: string;
  sub: string;
  image: string;
  to: "/bohofit" | "/bootcamp" | "/longevity";
};

const TABS: Record<TabKey, { label: string; cards: Card[] }> = {
  group: {
    label: "Group Classes",
    cards: [
      { tag: "For Beginners", title: "Rebel Start", sub: "Yoga · Zumba · Mat Pilates · Beginner Strength", image: imgStart, to: "/bohofit" },
      { tag: "Intermediate & Advanced", title: "Rebel Strength", sub: "Calisthenics · S&C · Weightlifting", image: imgStrength, to: "/bohofit" },
    ],
  },
  bootcamp: {
    label: "8-Week Transformation",
    cards: [
      { tag: "8 weeks · Fast results", title: "Lose fat. Build strength.", sub: "Coach-led · small group · diet plan", image: imgBootcamp, to: "/bootcamp" },
      { tag: "Track everything", title: "Weekly check-ins", sub: "Measurements · photos · accountability", image: imgStrength, to: "/bootcamp" },
    ],
  },
  fifty: {
    label: "Rebel 50+",
    cards: [
      { tag: "Designed for 50+", title: "Move easy. Live long.", sub: "Joint-safe · 1:1 personal coach", image: imgFifty, to: "/longevity" },
      { tag: "Family gift", title: "Gift it to a parent", sub: "We handle everything", image: imgFifty, to: "/longevity" },
    ],
  },
};

function Home() {
  const [tab, setTab] = useState<TabKey>("group");
  const cards = TABS[tab].cards;

  return (
    <SiteShell>
      {/* HERO */}
      <section className="relative">
        <div className="container mx-auto px-5 pt-10 pb-4 md:pt-24 md:pb-12 text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 text-[10px] md:text-xs uppercase tracking-[0.18em] text-muted-foreground border border-border rounded-full px-3 py-1">
              <Star className="w-3 h-3 text-primary" /> Machine-free fitness
            </div>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="mt-4 md:mt-6 text-3xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight max-w-4xl mx-auto">
              Fitness that fits — <span className="text-gradient-gold">not machines.</span>
            </h1>
          </Reveal>
          <Reveal delay={220}>
            <p className="mt-4 text-sm md:text-base text-muted-foreground max-w-md mx-auto">
              Pick your path. Start in days, not months.
            </p>
          </Reveal>
        </div>
      </section>

      {/* LOCATION TOGGLE */}
      <LocationBanner />


      {/* PILL TABS — all 3 visible together, mobile-optimized */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-3 gap-1.5 md:gap-2 max-w-2xl mx-auto">
          {(Object.keys(TABS) as TabKey[]).map((key) => {
            const active = key === tab;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={cn(
                  "rounded-md px-2 py-2.5 text-[10px] sm:text-xs md:text-sm font-black uppercase tracking-tight md:tracking-wider border transition-colors text-center leading-tight",
                  active
                    ? "bg-gradient-gold text-primary-foreground border-transparent shadow-elegant"
                    : "bg-card text-muted-foreground border-border hover:text-foreground hover:border-primary/50",
                )}
              >
                {TABS[key].label}
              </button>
            );
          })}
        </div>
      </section>

      {/* SWIPEABLE IMAGE CARDS */}
      <section className="pt-3 pb-12">
        <div
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-5 pb-3
                     [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {cards.map((c) => (
            <Link
              key={c.title}
              to={c.to}
              className="snap-center shrink-0 w-[78vw] sm:w-[60vw] md:w-[420px] aspect-[3/4] rounded-3xl overflow-hidden relative group"
            >
              <img
                src={c.image}
                alt={c.title}
                loading="lazy"
                width={768}
                height={1024}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Top tag pill */}
              <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-background/70 backdrop-blur px-3 py-1.5 text-[10px] md:text-xs font-bold uppercase tracking-wider text-foreground">
                {c.tag}
              </span>
              {/* Top right + button */}
              <span className="absolute top-4 right-4 w-9 h-9 rounded-full bg-background flex items-center justify-center text-foreground font-bold text-lg">
                +
              </span>
              {/* Gradient + text */}
              <div className="absolute inset-x-0 bottom-0 p-5 pt-16 bg-gradient-to-t from-black/85 via-black/40 to-transparent">
                <p className="text-white text-xl md:text-2xl font-black leading-tight">
                  <span className="text-primary">{c.title.split(" ")[0]}</span>{" "}
                  {c.title.split(" ").slice(1).join(" ")}
                </p>
                <p className="text-white/80 text-xs md:text-sm mt-1">{c.sub}</p>
              </div>
            </Link>
          ))}
          {/* swipe hint spacer */}
          <div className="shrink-0 w-2" />
        </div>
      </section>

      {/* BUILD YOUR PROGRAM (pathway) */}
      <section className="container mx-auto px-5 py-10 md:py-16">
        <Reveal>
          <div className="rounded-3xl bg-gradient-to-br from-primary/10 via-card to-background border border-border p-5 md:p-10">
            <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-primary font-bold">Build your program</p>
            <h2 className="text-2xl md:text-4xl font-black mt-2 max-w-2xl">
              Your path. Your pace. <span className="text-gradient-gold">Built for life.</span>
            </h2>

            <div className="mt-8 grid gap-3 md:gap-4">
              <PathStep n={1} icon={Sparkles} title="Start or Bootcamp" sub="Learn the basics. Build the habit." image={imgStart} />
              <ArrowDownBar />
              <PathStep n={2} icon={Dumbbell} title="Rebel Strength" sub="Get strong. Get capable." image={imgStrength} />
              <ArrowDownBar />
              <PathStep n={3} icon={Flame} title="Repeat. Train for life." sub="Stay consistent. Stay fit." image={imgBootcamp} />
            </div>
          </div>
        </Reveal>
      </section>

      {/* WHAT HAPPENS WHEN YOU KEEP GOING */}
      <JourneyTimeline />

      {/* SOCIAL PROOF */}
      <Testimonials />

      {/* CLOSING CTA */}
      <section className="container mx-auto px-5 py-16 md:py-20 text-center">
        <Reveal>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight max-w-3xl mx-auto">
            Train today. <span className="text-gradient-gold">Stay fit for life.</span>
          </h2>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="bg-gradient-gold text-primary-foreground hover:opacity-90 border-0">
              <Link to="/booking">Book your spot <ArrowRight className="ml-1 w-4 h-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/booking">Speak with us</Link>
            </Button>
          </div>
        </Reveal>
      </section>
    </SiteShell>
  );
}

function PathStep({
  n,
  icon: Icon,
  title,
  sub,
  image,
}: {
  n: number;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  sub: string;
  image: string;
}) {
  return (
    <div className="flex items-center gap-3 md:gap-4 rounded-2xl border border-border bg-card p-3 md:p-4">
      <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden shrink-0">
        <img src={image} alt="" loading="lazy" width={768} height={1024} className="w-full h-full object-cover" />
        <span className="absolute top-1 left-1 text-[9px] font-bold bg-primary text-primary-foreground rounded-full w-4 h-4 flex items-center justify-center">
          {n}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-primary" />
          <p className="font-black text-sm md:text-base">{title}</p>
        </div>
        <p className="text-xs md:text-sm text-muted-foreground mt-0.5 truncate">{sub}</p>
      </div>
    </div>
  );
}

function ArrowDownBar() {
  return (
    <div className="flex justify-center">
      <div className="w-0.5 h-5 bg-gradient-to-b from-primary to-transparent" />
    </div>
  );
}

/* ------------- Journey timeline ------------- */

const JOURNEY: Record<"week" | "60" | "6mo", { label: string; heading: string; lines: string[] }> = {
  week: {
    label: "First Week",
    heading: "Feel less stiff and sore.",
    lines: ["Wake up easier.", "Move through the day without tightness.", "Sleep better."],
  },
  "60": {
    label: "60 Days",
    heading: "Stronger. Leaner. Confident.",
    lines: ["Visible body changes.", "Lifts and reps go up.", "Clothes fit better."],
  },
  "6mo": {
    label: "6 Months",
    heading: "A new normal.",
    lines: ["Energy you forgot you had.", "Pain-free joints.", "Fitness that sticks for life."],
  },
};

function JourneyTimeline() {
  const [stage, setStage] = useState<"week" | "60" | "6mo">("week");
  const data = JOURNEY[stage];

  return (
    <section className="container mx-auto px-5 py-12 md:py-20">
      <Reveal>
        <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-primary font-bold">The journey</p>
        <h2 className="text-3xl md:text-5xl font-black mt-2 leading-[1.05] max-w-2xl">
          What happens when you <span className="text-gradient-gold">keep showing up.</span>
        </h2>
        <p className="text-sm text-muted-foreground mt-3">Real results. No shortcuts.</p>
      </Reveal>

      {/* Stage tabs */}
      <div className="mt-6 flex gap-5 md:gap-8 border-b border-border">
        {(Object.keys(JOURNEY) as Array<"week" | "60" | "6mo">).map((k) => {
          const active = k === stage;
          return (
            <button
              key={k}
              type="button"
              onClick={() => setStage(k)}
              className={cn(
                "pb-3 text-sm md:text-base font-black transition-colors border-b-2 -mb-px",
                active ? "text-foreground border-primary" : "text-muted-foreground border-transparent hover:text-foreground",
              )}
            >
              {JOURNEY[k].label}
            </button>
          );
        })}
      </div>

      {/* Highlight panel — bright like pliability */}
      <Reveal key={stage}>
        <div className="mt-6 rounded-3xl bg-gradient-gold text-primary-foreground p-6 md:p-10 min-h-[280px] md:min-h-[360px] flex flex-col">
          <p className="text-[10px] md:text-xs uppercase tracking-[0.25em] font-bold opacity-80">{data.label}</p>
          <h3 className="mt-3 text-2xl md:text-4xl font-black leading-tight max-w-xl">
            <span className="bg-background text-foreground px-2 rounded">{data.heading}</span>
          </h3>
          <ul className="mt-6 space-y-2 md:space-y-3 flex-1">
            {data.lines.map((l) => (
              <li key={l} className="flex items-start gap-2 text-sm md:text-base font-semibold">
                <Check className="w-4 h-4 mt-1 shrink-0" /> {l}
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <Button asChild className="bg-background text-foreground hover:bg-background/90">
              <Link to="/booking">Start your journey <ArrowRight className="ml-1 w-4 h-4" /></Link>
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
