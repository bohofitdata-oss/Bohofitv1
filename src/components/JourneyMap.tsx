import { Reveal } from "@/components/Reveal";
import { Flame, Sparkles, Dumbbell, HeartPulse, ArrowRight, ArrowDown, RotateCw } from "lucide-react";
import { Link } from "@tanstack/react-router";

/**
 * Decision flow:
 *
 *   [8-Week Transformation] ──┐
 *                              ├──►  [Start]  ──►  [Strength]  ──╮
 *           [Start Group] ────┘             ▲                     │
 *                                            ╰─── repeat ◄────────╯
 *
 *   [Bohofit 50+]  — separate 1:1 track
 */
export function JourneyMap() {
  return (
    <section className="container mx-auto px-5 py-12 md:py-20">
      <Reveal>
        <div className="text-center mb-8 md:mb-12">
          <p className="text-xs uppercase tracking-[0.18em] text-primary">How it flows</p>
          <h2 className="text-2xl md:text-4xl font-black mt-2">Your path, simply</h2>
        </div>
      </Reveal>

      <Reveal delay={120}>
        <div className="max-w-3xl mx-auto rounded-2xl border border-border bg-card p-5 md:p-8">
          {/* TOP: two entries merge */}
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <FlowTile to="/bootcamp" icon={Flame} label="8-Week Transformation" tone="primary" />
            <FlowTile to="/bohofit" icon={Sparkles} label="Start Group" />
          </div>

          {/* arrows down merging */}
          <div className="flex justify-center my-2 md:my-3">
            <div className="flex gap-12 md:gap-24">
              <ArrowDown className="w-5 h-5 text-primary" />
              <ArrowDown className="w-5 h-5 text-primary" />
            </div>
          </div>

          {/* Strength node */}
          <div className="flex justify-center">
            <div className="w-full max-w-xs">
              <FlowTile to="/bohofit" icon={Dumbbell} label="Boho Strength" tone="primary" big />
            </div>
          </div>

          {/* repeat loop */}
          <div className="mt-3 flex items-center justify-center gap-2 text-xs md:text-sm text-primary font-semibold">
            <RotateCw className="w-4 h-4" />
            Repeat. Train for life.
          </div>

          {/* divider */}
          <div className="my-6 md:my-8 border-t border-border" />

          {/* Separate 50+ track */}
          <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground text-center mb-3">
            Separate track
          </p>
          <Link
            to="/longevity"
            className="flex items-center gap-3 rounded-xl border border-primary/40 bg-gradient-to-br from-primary/10 to-transparent p-4 hover:-translate-y-0.5 hover:shadow-elegant transition"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-gold flex items-center justify-center shrink-0">
              <HeartPulse className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <p className="font-black text-sm md:text-base">Bohofit 50+</p>
              <p className="text-xs text-muted-foreground">1:1 personal track</p>
            </div>
            <ArrowRight className="w-4 h-4 text-primary" />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

function FlowTile({
  icon: Icon,
  label,
  to,
  tone,
  big,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  to: "/bohofit" | "/bootcamp";
  tone?: "primary";
  big?: boolean;
}) {
  return (
    <Link
      to={to}
      className={`rounded-xl border-2 p-3 md:p-4 flex flex-col items-center justify-center text-center transition hover:-translate-y-0.5 ${
        tone === "primary"
          ? "border-primary bg-gradient-to-br from-primary/15 to-card"
          : "border-border bg-background hover:border-primary"
      } ${big ? "py-4 md:py-5" : ""}`}
    >
      <Icon className={`${big ? "w-6 h-6 md:w-7 md:h-7" : "w-5 h-5 md:w-6 md:h-6"} text-primary mb-1.5`} />
      <p className={`font-black leading-tight ${big ? "text-sm md:text-base" : "text-xs md:text-sm"}`}>
        {label}
      </p>
    </Link>
  );
}
