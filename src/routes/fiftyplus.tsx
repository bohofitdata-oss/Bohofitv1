import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteShell } from "@/components/SiteShell";
import { Reveal } from "@/components/Reveal";
import { ProgramSwitcher } from "@/components/ProgramSwitcher";
import { ConsultationBooking } from "@/components/ConsultationBooking";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/fiftyplus")({
  head: () => ({
    meta: [
      { title: "Rebél at 50+ — 1:1 training for joints, mobility & recovery" },
      { name: "description", content: "1:1 machine-free strength training for people 50+ dealing with back, knee, hip, shoulder pain or post-injury recovery. Free consultation." },
      { property: "og:title", content: "Rebél at 50+ — Built around your body" },
      { property: "og:description", content: "1:1 training for joint pain, mobility limits and post-injury recovery. Doctor-cleared. Free consultation." },
    ],
  }),
  component: FiftyPlusPage,
});

const PROBLEMS = [
  "Disc bulge / lower back",
  "Knee pain",
  "Hip pain",
  "Shoulder pain",
  "Elbow pain",
  "Neck pain",
  "Post-injury recovery",
  "General stiffness / mobility",
];

const INCLUSIONS = [
  "True 1:1 — one coach, one client",
  "Machine-free, joint-friendly programming",
  "Trainer-prescribed, doctor-cleared where needed",
  "Built around your specific problem areas",
  "Mon–Sat, one hour at your chosen time",
];

function FiftyPlusPage() {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (p: string) =>
    setSelected((s) => (s.includes(p) ? s.filter((x) => x !== p) : [...s, p]));

  return (
    <SiteShell>
      {/* HERO */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "radial-gradient(70% 60% at 50% 0%, rgba(137,1,10,0.28) 0%, transparent 65%), #000",
        }}
      >
        <div className="container mx-auto px-5 pt-20 pb-16 md:pt-28 md:pb-24 text-center">
          <Reveal>
            <div className="flex justify-center mb-4">
              <ProgramSwitcher current="fifty_plus" />
            </div>
            <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "#FF2233" }}>
              REBÉL AT 50+ · 1:1
            </p>
            <h1
              className="mt-3 font-black tracking-tight leading-[1.02] text-white"
              style={{ fontSize: "clamp(38px, 7vw, 78px)", letterSpacing: "-0.04em" }}
            >
              Strong.
              <br />
              <span className="italic" style={{ color: "#FF2233" }}>Steady. Independent.</span>
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-white/85 text-[15px] md:text-lg">
              1:1 machine-free training for people 50+ dealing with joint pain,
              mobility limits or post-injury recovery. Built around your body — not the other way around.
            </p>
            <div className="mt-8">
              <a
                href="#problem"
                className="inline-flex items-center justify-center rounded-full px-7 h-12 font-bold text-sm text-white transition-colors hover:opacity-90"
                style={{ background: "#89010A" }}
              >
                Book my free consultation →
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* PROBLEM SELECTOR */}
      <section id="problem" className="container mx-auto max-w-4xl px-5 py-16 md:py-20">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: "#89010A" }}>
            Step 1 · Where it hurts
          </p>
          <h2
            className="mt-3 font-black text-white"
            style={{ fontSize: "clamp(28px, 5vw, 48px)", letterSpacing: "-0.03em", lineHeight: "1.05" }}
          >
            Where does it <span className="italic" style={{ color: "#FF2233" }}>hurt?</span>
          </h2>
          <p className="mt-3 text-[15px]" style={{ color: "#CCCCCC" }}>
            Select what you're dealing with — we build your program around it.
          </p>
        </Reveal>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
          {PROBLEMS.map((p) => {
            const on = selected.includes(p);
            return (
              <button
                key={p}
                type="button"
                onClick={() => toggle(p)}
                className={cn(
                  "text-left rounded-xl border p-4 transition-colors min-h-[76px]",
                  on
                    ? "text-white"
                    : "border-white/10 bg-white/[0.03] text-white/85 hover:border-white/30",
                )}
                style={on ? { borderColor: "#89010A", background: "rgba(137,1,10,0.18)" } : undefined}
              >
                <div className="flex items-start gap-2">
                  {on && <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "#FF2233" }} />}
                  <span className="text-sm font-semibold">{p}</span>
                </div>
              </button>
            );
          })}
        </div>
        <p className="mt-4 text-xs" style={{ color: "#CCCCCC" }}>
          Multi-select. Your selection carries into your consultation booking so your coach is ready.
        </p>
      </section>

      {/* WHAT'S INSIDE */}
      <section className="container mx-auto max-w-4xl px-5 pb-4">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: "#89010A" }}>
            What's inside Rebél at 50+
          </p>
        </Reveal>
        <ul className="mt-6 grid sm:grid-cols-2 gap-3">
          {INCLUSIONS.map((b) => (
            <li key={b} className="rebel-card rounded-xl p-4 flex items-start gap-3">
              <Check className="w-5 h-5 mt-0.5 shrink-0" style={{ color: "#89010A" }} />
              <span className="text-[15px]" style={{ color: "#CCCCCC" }}>{b}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* BOOKING */}
      <section className="container mx-auto max-w-3xl px-5 py-16 md:py-20">
        <Reveal>
          <ConsultationBooking
            program="fifty_plus"
            problemAreas={selected}
            eyebrow="Step 2 · Book my free consultation"
            headline="Pick a day and time."
            subtext="Free 30-minute consultation with a Rebél coach. Your selected concerns are shared with the team before the call."
          />
        </Reveal>
      </section>
    </SiteShell>
  );
}
