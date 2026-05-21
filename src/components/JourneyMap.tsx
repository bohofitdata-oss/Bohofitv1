import { Reveal } from "@/components/Reveal";
import { Sparkles, Flame, Dumbbell, HeartPulse } from "lucide-react";
import { Link } from "@tanstack/react-router";

/**
 * Circular lifecycle:
 *   Bohofit Start  ──►  Boho Strength  ──►  back to Start (loop)
 *         ▲                                       │
 *         └────────── Boho Bootcamp ──────────────┘
 *
 * Bohofit at 50+ sits separately — its own track.
 */
export function JourneyMap() {
  return (
    <section className="container mx-auto px-5 py-12 md:py-20">
      <Reveal>
        <div className="text-center mb-8 md:mb-12">
          <p className="text-xs uppercase tracking-[0.18em] text-primary">How it flows</p>
          <h2 className="text-2xl md:text-4xl font-black mt-2">Your fitness lifecycle</h2>
          <p className="text-sm text-muted-foreground mt-3 max-w-xl mx-auto">
            One ongoing loop. Start, grow into Strength, and stay there for life. Bootcamp is a fast on-ramp into the same loop. 50+ is its own personal track.
          </p>
        </div>
      </Reveal>

      <Reveal delay={120}>
        <div className="grid md:grid-cols-[1.4fr_1fr] gap-6 max-w-5xl mx-auto">
          {/* CIRCULAR LIFECYCLE */}
          <div className="relative rounded-2xl border border-border bg-card p-6 md:p-8 overflow-hidden">
            <p className="text-[10px] uppercase tracking-[0.18em] text-primary mb-1">The loop</p>
            <h3 className="font-black text-lg mb-5">Group lifecycle</h3>

            <div className="relative aspect-square max-w-[420px] mx-auto">
              {/* Circle ring */}
              <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full">
                <defs>
                  <linearGradient id="ring" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.15" />
                  </linearGradient>
                </defs>
                <circle
                  cx="100"
                  cy="100"
                  r="78"
                  fill="none"
                  stroke="url(#ring)"
                  strokeWidth="1.2"
                  strokeDasharray="3 4"
                />
                {/* Arrow heads on the ring */}
                <polygon points="100,18 96,26 104,26" fill="hsl(var(--primary))" />
                <polygon points="178,100 170,96 170,104" fill="hsl(var(--primary))" />
                <polygon points="100,178 96,170 104,170" fill="hsl(var(--primary))" />
                <polygon points="22,100 30,96 30,104" fill="hsl(var(--primary))" />
              </svg>

              {/* Nodes positioned on circle */}
              <NodeDot
                to="/bohofit"
                icon={Sparkles}
                label="Start"
                sub="Beginner"
                className="top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
              />
              <NodeDot
                to="/bohofit"
                icon={Dumbbell}
                label="Strength"
                sub="Advanced"
                primary
                className="top-1/2 right-0 translate-x-1/2 -translate-y-1/2"
              />
              <NodeDot
                to="/bohofit"
                icon={Sparkles}
                label="Repeat"
                sub="Stay fit"
                className="bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"
              />
              <NodeDot
                to="/bootcamp"
                icon={Flame}
                label="Bootcamp"
                sub="Fast on-ramp"
                className="top-1/2 left-0 -translate-x-1/2 -translate-y-1/2"
              />

              {/* Center label */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Lifecycle</p>
                  <p className="font-black text-sm mt-0.5">Train for life</p>
                </div>
              </div>
            </div>
          </div>

          {/* 50+ separate track */}
          <Link
            to="/longevity"
            className="group relative rounded-2xl border border-primary/40 bg-gradient-to-br from-primary/10 to-transparent p-6 md:p-8 flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-elegant transition"
          >
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-primary mb-1">Separate track</p>
              <div className="flex items-center gap-3 mt-2">
                <div className="w-11 h-11 rounded-xl bg-gradient-gold flex items-center justify-center">
                  <HeartPulse className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="font-black text-lg">Bohofit at 50+</h3>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Personal 1:1 training, built for 50 and above. Its own pace, its own coach — not part of the group loop.
              </p>
            </div>
            <span className="mt-6 inline-flex items-center text-sm font-semibold text-primary">
              Learn more →
            </span>
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

function NodeDot({
  icon: Icon,
  label,
  sub,
  to,
  className,
  primary,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  sub: string;
  to: "/bohofit" | "/bootcamp";
  className?: string;
  primary?: boolean;
}) {
  return (
    <Link
      to={to}
      className={`absolute ${className} group`}
    >
      <div
        className={`w-20 h-20 md:w-24 md:h-24 rounded-full flex flex-col items-center justify-center text-center border-2 transition hover:scale-105 ${
          primary
            ? "bg-gradient-gold border-primary text-primary-foreground"
            : "bg-card border-primary/50 text-foreground"
        }`}
      >
        <Icon className={`w-4 h-4 ${primary ? "" : "text-primary"}`} />
        <p className="text-[11px] font-black mt-1 leading-none">{label}</p>
        <p className={`text-[9px] mt-0.5 leading-none ${primary ? "opacity-80" : "text-muted-foreground"}`}>{sub}</p>
      </div>
    </Link>
  );
}
