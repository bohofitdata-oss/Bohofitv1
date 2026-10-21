import { createFileRoute } from "@tanstack/react-router";
import { flushSync } from "react-dom";
import { useState } from "react";
import { useWebMCP } from "use-webmcp-tool";
import { SiteShell } from "@/components/SiteShell";
import { Reveal } from "@/components/Reveal";
import { ProgramSwitcher } from "@/components/ProgramSwitcher";
import { ConsultationBooking } from "@/components/ConsultationBooking";
import { TM } from "@/components/TM";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { runWebMCPTool } from "@/lib/webmcp-telemetry";

export const Route = createFileRoute("/fiftyplus")({
  head: () => ({
    meta: [
      { title: "50+ by REBÉL — 1:1 training for joints, mobility & recovery" },
      { name: "description", content: "1:1 machine-free strength training for people 50+ dealing with back, knee, hip, shoulder pain or post-injury recovery. Free consultation." },
      { property: "og:title", content: "50+ by REBÉL — Built around your body" },
      { property: "og:description", content: "1:1 training for joint pain, mobility limits and post-injury recovery. Coach-led. Free consultation." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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
  "1:1 with a REBÉL Defined Coach",
  "Machine-free, joint-friendly programming",
  "REBÉL Defined Coach — trained to the REBÉL Standard",
  "Built around your specific problem areas",
  "Mon–Sat, one hour at your chosen time",
];

function FiftyPlusPage() {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (p: string) =>
    setSelected((s) => (s.includes(p) ? s.filter((x) => x !== p) : [...s, p]));

  useWebMCP({
    name: "get_50plus_focus",
    description: "Read the currently selected Rebél at 50+ training focus areas.",
    annotations: { readOnlyHint: true },
    execute: (_args: Record<string, never>, { signal }) => runWebMCPTool("get_50plus_focus", () => {
      if (signal.aborted) throw new Error("Request cancelled.");
      return selected.length ? `Selected focus areas: ${selected.join(", ")}.` : "No focus areas selected.";
    }),
  });

  useWebMCP({
    name: "toggle_50plus_focus",
    description: "Select or clear one of the visible Rebél at 50+ focus areas.",
    inputSchema: {
      type: "object",
      properties: { problem: { type: "string", enum: PROBLEMS, description: "Focus area to toggle." } },
      required: ["problem"],
    },
    execute: ({ problem }: { problem: string }, { signal }) => runWebMCPTool("toggle_50plus_focus", () => {
      if (signal.aborted) throw new Error("Request cancelled.");
      if (typeof problem !== "string" || !PROBLEMS.includes(problem)) throw new Error("Choose one of the focus areas shown on this page.");
      const wasSelected = selected.includes(problem);
      flushSync(() => toggle(problem));
      return `${wasSelected ? "Cleared" : "Selected"} ${problem}.`;
    }),
  });

  return (
    <SiteShell>
      {/* HERO */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "var(--background)",
        }}
      >
        <div className="container mx-auto px-5 pt-20 pb-16 md:pt-28 md:pb-24 text-center">
          <Reveal>
            <div className="flex justify-center mb-4">
              <ProgramSwitcher current="fifty_plus" />
            </div>
            <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "var(--storefront)" }}>
              50+ by REBÉL<TM /> | 1:1
            </p>
            <h1
              className="mt-3 font-black tracking-tight leading-[1.02] text-foreground"
              style={{ fontSize: "var(--page-heading-size)", letterSpacing: "0" }}
            >
              Strong.
              <br />
              <span className="italic" style={{ color: "var(--storefront)" }}>Steady. Independent.</span>
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-foreground/85 text-[15px] md:text-lg">
              1:1 with a REBÉL Defined Coach · Joint-friendly · Machine-free
            </p>
            <div className="mt-8">
              <Button asChild><a
                href="#problem"
                className="inline-flex items-center justify-center rounded-full px-7 h-12 font-bold text-sm text-foreground transition-colors hover:opacity-90"
                style={{ background: "var(--primary)" }}
              >
                Book my free consultation →
              </a></Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* PROBLEM SELECTOR */}
      <section id="problem" className="container mx-auto max-w-4xl px-5 py-16 md:py-20">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--primary)" }}>
            Step 1 · Where it hurts
          </p>
          <h2
            className="mt-3 font-black text-foreground"
            style={{ fontSize: "var(--editorial-heading-size)", letterSpacing: "0", lineHeight: "1.05" }}
          >
            Where does it <span className="italic" style={{ color: "var(--storefront)" }}>hurt?</span>
          </h2>
          <p className="mt-3 text-[15px]" style={{ color: "var(--muted-foreground)" }}>
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
                aria-pressed={on}
                onClick={() => toggle(p)}
                className={cn(
                  "text-left rounded-xl border p-4 transition-colors min-h-[76px]",
                  on
                    ? "text-foreground"
                    : "border-foreground/10 bg-foreground/[0.03] text-foreground/85 hover:border-foreground/30",
                )}
                style={on ? { borderColor: "var(--primary)", background: "rgba(137,1,10,0.18)" } : undefined}
              >
                <div className="flex items-start gap-2">
                  {on && <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "var(--storefront)" }} />}
                  <span className="text-sm font-semibold">{p}</span>
                </div>
              </button>
            );
          })}
        </div>
        <p className="mt-4 text-xs" style={{ color: "var(--muted-foreground)" }}>
          Multi-select. Your selection carries into your consultation booking so your coach is ready.
        </p>
      </section>

      {/* WHAT'S INSIDE */}
      <section className="container mx-auto max-w-4xl px-5 pb-4">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--primary)" }}>
            What's inside 50+ by REBÉL
          </p>
        </Reveal>
        <ul className="mt-6 grid sm:grid-cols-2 gap-3">
          {INCLUSIONS.map((b) => (
            <li key={b} className="rebel-card rounded-xl p-4 flex items-start gap-3">
              <Check className="w-5 h-5 mt-0.5 shrink-0" style={{ color: "var(--primary)" }} />
              <span className="text-[15px]" style={{ color: "var(--muted-foreground)" }}>{b}</span>
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
