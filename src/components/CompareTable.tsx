import { Link } from "@tanstack/react-router";
import { Check, Minus } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { TM } from "@/components/TM";
import { Button } from "@/components/ui/button";

export type CompareRow = {
  metric: string;
  rebel: string;
  cult: string;
  calisthenics: string;
  traditional: string;
  bootcamp: string;
};

export const COMPARE_COLUMNS = [
  { key: "rebel", label: "REBÉL", highlight: true },
  { key: "cult", label: "Cult Group", highlight: false },
  { key: "calisthenics", label: "Other Calisthenics Gyms", highlight: false },
  { key: "traditional", label: "Traditional Gym", highlight: false },
  { key: "bootcamp", label: "Bootcamp Gyms", highlight: false },
] as const;

export const COMPARE_ROWS: CompareRow[] = [
  {
    metric: "Equipment",
    rebel: "0 machines — bodyweight & free weights",
    cult: "Machines + group floor",
    calisthenics: "Bars & rings, limited free weights",
    traditional: "Mostly machines",
    bootcamp: "Circuit gear & timers",
  },
  {
    metric: "Coaching",
    rebel: "Coach-led every session",
    cult: "One instructor for large batches",
    calisthenics: "Skill demos, mostly self-paced",
    traditional: "Self-guided unless paid PT",
    bootcamp: "Fast cues, less form correction",
  },
  {
    metric: "Progression",
    rebel: "3 levels: START, STRENGTH, UNLIMITED",
    cult: "Drop-in classes, same difficulty",
    calisthenics: "Skill tracks, less strength ladder",
    traditional: "Figure it out yourself",
    bootcamp: "Random daily workouts",
  },
  {
    metric: "Formats",
    rebel: "Calisthenics, weightlifting, yoga, spin & Pilates",
    cult: "Split across different centres",
    calisthenics: "Bodyweight skills only",
    traditional: "Weights & cardio machines",
    bootcamp: "High-intensity circuits only",
  },
  {
    metric: "Beginners & 50+",
    rebel: "Level 1 START & 1:1 50+ coaching",
    cult: "One pace for the whole room",
    calisthenics: "Steep entry for beginners",
    traditional: "Minimal beginner onboarding",
    bootcamp: "High-impact, hard on joints",
  },
  {
    metric: "Routine & entry",
    rebel: "Walk in to your routine — no slot booking",
    cult: "App slot booking & waitlists",
    calisthenics: "Fixed batch bookings",
    traditional: "Open floor, no set routine",
    bootcamp: "Fixed batch slots",
  },
  {
    metric: "Consistency",
    rebel: "75% still training after a year",
    cult: "High drop-off",
    calisthenics: "Niche crowd",
    traditional: "Most quit within 90 days",
    bootcamp: "Short-term burnout",
  },
];

export function CompareTable() {
  return (
    <section id="compare" className="creative-section compare-section scroll-mt-20">
      <div className="container mx-auto px-5 md:px-8">
        <Reveal>
          <div className="section-heading-row">
            <div>
              <p className="rebel-label mb-4">Others vs us</p>
              <h2 className="editorial-title">
                How REBÉL<TM /> stacks up.
              </h2>
            </div>
            <p className="editorial-copy">
              Calisthenics, weightlifting, yoga, spin and Pilates in HSR Layout, Bangalore — compared with Cult Group, other calisthenics gyms, traditional gyms and bootcamp gyms.
            </p>
          </div>
        </Reveal>

        <Reveal delay={60}>
          <p className="compare-swipe-hint font-mono text-[11px] text-muted-foreground mt-8 md:hidden">
            SWIPE ACROSS TO COMPARE →
          </p>
          <div className="compare-scroll mt-3 md:mt-10" role="region" aria-label="REBÉL compared with other gyms" tabIndex={0}>
            <table className="compare-table">
              <thead>
                <tr>
                  <th scope="col" className="compare-sticky font-mono text-[11px] text-muted-foreground">
                    STANDARD
                  </th>
                  {COMPARE_COLUMNS.map((col) => (
                    <th
                      key={col.key}
                      scope="col"
                      className={col.highlight ? "compare-rebel-head" : "compare-other-head"}
                    >
                      {col.highlight ? (
                        <>
                          <span className="font-mono text-[10px] text-storefront block mb-1">OUR STANDARD</span>
                          <span className="font-display text-sm text-foreground">
                            {col.label}
                            <TM />
                          </span>
                        </>
                      ) : (
                        <span className="font-sans text-xs font-semibold text-muted-foreground">{col.label}</span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row) => (
                  <tr key={row.metric}>
                    <th scope="row" className="compare-sticky compare-metric font-sans text-xs md:text-sm font-semibold text-foreground">
                      {row.metric}
                    </th>
                    <td className="compare-rebel-cell">
                      <span className="compare-cell-inner">
                        <Check className="size-4 text-storefront shrink-0 mt-0.5" aria-hidden />
                        <span>{row.rebel}</span>
                      </span>
                    </td>
                    {(["cult", "calisthenics", "traditional", "bootcamp"] as const).map((key) => (
                      <td key={key} className="compare-other-cell">
                        <span className="compare-cell-inner">
                          <Minus className="size-3.5 text-muted-foreground/60 shrink-0 mt-1" aria-hidden />
                          <span>{row[key]}</span>
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              Feel the difference on the floor before you commit.
            </p>
            <Button asChild className="rounded-full h-11 px-6">
              <Link to="/booking">Book a free trial →</Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}