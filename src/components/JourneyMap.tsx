import { Reveal } from "@/components/Reveal";
import { Sparkles, Flame, Dumbbell, HeartPulse, ArrowRight, Repeat } from "lucide-react";
import { Link } from "@tanstack/react-router";

/**
 * Single, clear lifecycle chart — not multiple "paths".
 * Shows the natural flow:
 *   Bohofit Start  ──►  Boho Strength  ◄──  Boho Bootcamp (8wk)
 *                            ▲
 *                            │
 *                       Bohofit at 50+
 *
 * Bohofit at 50+ enters from below — once they're comfortable, they
 * graduate into the same Start → Strength loop. It's a lifecycle.
 */

export function JourneyMap() {
  return (
    <section className="container mx-auto px-5 py-12 md:py-20">
      <Reveal>
        <div className="text-center mb-8 md:mb-12">
          <p className="text-xs uppercase tracking-[0.18em] text-primary">How to choose</p>
          <h2 className="text-2xl md:text-4xl font-black mt-2">Your fitness lifecycle</h2>
          <p className="text-sm text-muted-foreground mt-3 max-w-xl mx-auto">
            One ecosystem. You enter wherever you are today and grow from there. It&rsquo;s not a finite plan — it&rsquo;s a way of living fit.
          </p>
        </div>
      </Reveal>

      {/* CHART */}
      <Reveal delay={120}>
        <div className="relative max-w-4xl mx-auto rounded-2xl border border-border bg-card p-6 md:p-10">
          {/* TOP ROW: Start -> Strength <- Bootcamp */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] gap-4 md:gap-2 items-center">
            <Node
              to="/bohofit"
              icon={Sparkles}
              eyebrow="Entry · gentle"
              title="Bohofit Start"
              desc="Yoga · Spin · Pilates · Zumba · Beginner Strength"
            />
            <Arrow direction="right" label="Build the habit" />
            <Node
              to="/bohofit"
              icon={Dumbbell}
              center
              eyebrow="Lifelong home"
              title="Boho Strength"
              desc="Calisthenics · S&C · Boxing · Weightlifting"
            />
            <Arrow direction="left" label="Continue strong" />
            <Node
              to="/bootcamp"
              icon={Flame}
              eyebrow="Entry · fast"
              title="Boho Bootcamp"
              desc="8-week guaranteed transformation"
            />
          </div>

          {/* CONNECTOR DOWN */}
          <div className="flex flex-col items-center mt-6 md:mt-8">
            <div className="hidden md:block h-8 w-px bg-border" />
            <div className="hidden md:flex items-center gap-1 text-[10px] uppercase tracking-widest text-muted-foreground">
              <ArrowRight className="w-3 h-3 -rotate-90" /> graduates into
            </div>
            <div className="hidden md:block h-4 w-px bg-border" />
          </div>

          {/* BOTTOM ROW: 50+ */}
          <div className="mt-6 md:mt-4 max-w-md mx-auto">
            <Node
              to="/longevity"
              icon={HeartPulse}
              eyebrow="Entry · 50 and above"
              title="Bohofit at 50+"
              desc="1:1 with a trainer. Once you feel strong, you can join Start. It&rsquo;s your gateway, not your ceiling."
              accent
            />
          </div>
        </div>
      </Reveal>

      <Reveal delay={200}>
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground text-center px-4">
          <Repeat className="w-3.5 h-3.5 text-primary shrink-0" />
          One Bohofit Unlimited membership covers both Start &amp; Strength — no separate payment.
        </div>
      </Reveal>
    </section>
  );
}

function Node({
  icon: Icon,
  eyebrow,
  title,
  desc,
  to,
  center,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  eyebrow: string;
  title: string;
  desc: string;
  to: "/bohofit" | "/bootcamp" | "/longevity";
  center?: boolean;
  accent?: boolean;
}) {
  return (
    <Link
      to={to}
      className={`group block rounded-xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-elegant ${
        center
          ? "border-primary bg-gradient-to-br from-primary/10 to-transparent"
          : accent
            ? "border-primary/40 bg-card"
            : "border-border bg-background"
      }`}
    >
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-lg bg-gradient-gold flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 text-primary-foreground" />
        </div>
        <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{eyebrow}</p>
      </div>
      <h3 className="mt-2 font-black text-base leading-tight">{title}</h3>
      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{desc}</p>
      <span className="mt-2 inline-flex items-center text-[11px] font-semibold text-primary">
        Open <ArrowRight className="w-3 h-3 ml-0.5 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

function Arrow({ direction, label }: { direction: "left" | "right"; label: string }) {
  return (
    <div className="flex md:flex-col items-center justify-center gap-1 py-1">
      <ArrowRight
        className={`w-5 h-5 text-primary ${direction === "left" ? "rotate-180" : ""}`}
      />
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground hidden md:block">
        {label}
      </span>
    </div>
  );
}
