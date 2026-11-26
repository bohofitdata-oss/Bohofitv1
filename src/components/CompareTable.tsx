import { Link } from "@tanstack/react-router";
import { Check, HelpCircle } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { TM } from "@/components/TM";
import { Button } from "@/components/ui/button";

import { COMPARE_COLUMNS, COMPARE_ROWS } from "@/lib/rebel-standards";
export { COMPARE_COLUMNS, COMPARE_ROWS } from "@/lib/rebel-standards";

export function CompareTable() {
  return (
    <section id="compare" className="creative-section compare-section scroll-mt-20">
      <div className="container mx-auto px-5 md:px-8">
        <Reveal>
          <div className="section-heading-row">
            <div>
              <p className="rebel-label mb-4">Different ways to train</p>
              <h2 className="editorial-title">
                The REBÉL<TM /> standard.
              </h2>
            </div>
            <p className="editorial-copy">
              Guidance without upselling. Progress with a plan. Compare what matters to you.
            </p>
          </div>
        </Reveal>

        <Reveal delay={60}>
          <p className="compare-swipe-hint font-mono text-[11px] text-muted-foreground mt-8 md:hidden">
            OUR STANDARD / QUESTIONS TO ASK
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
                          <HelpCircle className="size-3.5 text-muted-foreground/60 shrink-0 mt-1" aria-hidden />
                          <span>{row[key]}</span>
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-5 text-xs text-muted-foreground leading-relaxed">*Owner-reported: 50% of members who joined 4.5 years ago still train here. Members who moved away from HSR Layout or Bangalore are the exception.</p>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              Other centres have their own approach. Their columns are questions to ask, not claims about their services.
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