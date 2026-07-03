import {
  ClipboardCheck,
  Sprout,
  TrendingUp,
  Flame,
  Repeat,
  Trophy,
} from "lucide-react";
import { Reveal } from "@/components/Reveal";

const CRIMSON = "#89010A";
const GREY = "#CCCCCC";

type Phase = {
  n: number;
  name: string;
  desc: string;
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
};

const PHASES: Phase[] = [
  { n: 1, name: "Assess", desc: "We learn your body, history, and goal.", icon: ClipboardCheck },
  { n: 2, name: "Foundation", desc: "Movement basics, safe technique, consistency.", icon: Sprout },
  { n: 3, name: "Build", desc: "Progressive strength across your chosen format.", icon: TrendingUp },
  { n: 4, name: "Push", desc: "Higher intensity, tracked progression.", icon: Flame },
  { n: 5, name: "Sustain", desc: "Lock in the habit — training as a way of living.", icon: Repeat },
  { n: 6, name: "Lead", desc: "Graduate strong. Keep going for life.", icon: Trophy },
];

export function RebelJourney() {
  return (
    <section className="bg-black border-t border-white/5">
      <div className="container mx-auto px-5 py-20 md:py-28">
        <Reveal>
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">
              The path
            </p>
            <h2
              className="mt-3 font-black text-white"
              style={{ fontSize: "clamp(32px, 6vw, 60px)", letterSpacing: "-0.03em", lineHeight: "1" }}
            >
              Your Rebél{" "}
              <span style={{ color: "#FF2233", fontStyle: "italic" }}>journey.</span>
            </h2>
            <p className="mt-4 text-[15px] md:text-lg" style={{ color: GREY }}>
              Every member moves through phases. Skip nothing.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 max-w-3xl flex flex-col gap-4">
          {PHASES.map((p, i) => {
            const Icon = p.icon;
            return (
              <Reveal key={p.n} delay={i * 100}>
                <article
                  className="flex items-center gap-4 md:gap-5 rounded-2xl px-5 py-5 md:px-6 md:py-6"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <span
                    className="shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(137,1,10,0.15)" }}
                  >
                    <Icon size={24} color={CRIMSON} strokeWidth={2} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-[11px] font-semibold uppercase tracking-[0.22em]"
                      style={{ color: CRIMSON }}
                    >
                      Phase {p.n}
                    </p>
                    <h3 className="mt-1 font-bold text-white text-lg md:text-xl leading-tight">
                      {p.name}
                    </h3>
                    <p className="mt-1 text-[13px] md:text-sm" style={{ color: GREY }}>
                      {p.desc}
                    </p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
