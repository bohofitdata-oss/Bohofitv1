import { createFileRoute, Link } from "@tanstack/react-router";
import { useWebMCP } from "use-webmcp-tool";
import { SiteShell } from "@/components/SiteShell";
import { Reveal } from "@/components/Reveal";
import { ProgramSwitcher } from "@/components/ProgramSwitcher";
import { ConsultationBooking } from "@/components/ConsultationBooking";
import { TM } from "@/components/TM";
import { Button } from "@/components/ui/button";
import { HeartPulse, Check } from "lucide-react";
import heroLoop from "../../public/longevity-hero-loop.mp4.asset.json";
import { runWebMCPTool } from "@/lib/webmcp-telemetry";

export const Route = createFileRoute("/longevity")({
  head: () => ({
    meta: [
      { title: "UnPause — 1:1 training for perimenopause & menopause" },
      { name: "description", content: "Doctor-guided 1:1 strength training built for perimenopause and menopause. Free 30-min consultation — no payment required." },
      { property: "og:title", content: "UnPause — 1:1 for the hormonal transition" },
      { property: "og:description", content: "Doctor-guided strength training for the perimenopause & menopause transition. Free consultation." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: UnpausePage,
});

const INCLUSIONS = [
  "1:1 with a REBÉL Defined Coach",
  "Clinical dietitian · Doctor-guided",
  "3 sessions / week · 1 hour each",
  "Strength and balance, measured over time",
  "REBÉL Defined Coach — trained to the REBÉL Standard",
];

function UnpausePage() {
  useWebMCP({
    name: "open_unpause_consultation",
    description: "Move to the Rebél Unpause free consultation booking section.",
    annotations: { readOnlyHint: false },
    execute: (_args: Record<string, never>, { signal }) => runWebMCPTool("open_unpause_consultation", () => {
      if (signal.aborted) throw new Error("Request cancelled.");
      const bookingSection = document.getElementById("book");
      if (!bookingSection) throw new Error("The consultation section is unavailable.");
      bookingSection.scrollIntoView({ behavior: "smooth", block: "start" });
      return "Moved to the Rebél Unpause consultation booking section.";
    }),
  });
  return (
    <SiteShell>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <video
          src={heroLoop.url}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden
        />
        <div
          className="absolute inset-0"
          style={{
            background: "var(--hero-overlay)",
          }}
          aria-hidden
        />
        <div className="relative container mx-auto px-5 pt-20 pb-16 md:pt-28 md:pb-24 text-center">
          <Reveal>
            <div className="flex justify-center mb-4">
              <ProgramSwitcher current="unpause" />
            </div>
            <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "var(--storefront)" }}>
              UnPause<TM /> | 1:1
            </p>
            <h1
              className="mt-3 font-black tracking-tight leading-[1.02] text-foreground"
              style={{ fontSize: "var(--page-heading-size)", letterSpacing: "0", textShadow: "0 2px 30px rgba(0,0,0,0.7)" }}
            >
              For the change.
              <br />
              <span className="italic" style={{ color: "var(--storefront)" }}>Not around it.</span>
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-foreground/85 text-[15px] md:text-lg">
              1:1 strength for perimenopause and menopause.
              A REBÉL Defined Coach, clinical dietitian and doctor-guided support.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm text-foreground"
                 style={{ borderColor: "rgba(255,255,255,0.25)", background: "rgba(0,0,0,0.4)" }}>
              <HeartPulse className="w-4 h-4" style={{ color: "var(--storefront)" }} /> Free 30-min consultation | No card required
            </div>
            <div className="mt-8">
              <Button asChild><a
                href="#book"
                className="inline-flex items-center justify-center rounded-full px-7 h-12 font-bold text-sm text-foreground transition-colors hover:opacity-90"
                
              >
                Book my free consultation →
              </a></Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* WHAT'S INSIDE */}
      <section className="container mx-auto max-w-4xl px-5 py-16 md:py-24">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--primary)" }}>
            What's inside UnPause
          </p>
          <h2
            className="mt-3 font-black text-foreground"
            style={{ fontSize: "var(--editorial-heading-size)", letterSpacing: "0", lineHeight: "1.05" }}
          >
            Built for the female body at <span className="italic" style={{ color: "var(--storefront)" }}>40, 50 and beyond.</span>
          </h2>
        </Reveal>
        <ul className="mt-8 grid sm:grid-cols-2 gap-3">
          {INCLUSIONS.map((b) => (
            <li key={b} className="rebel-card rounded-xl p-4 flex items-start gap-3">
              <Check className="w-5 h-5 mt-0.5 shrink-0" style={{ color: "var(--primary)" }} />
              <span className="text-[15px]" style={{ color: "var(--muted-foreground)" }}>{b}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* BOOKING */}
      <section id="book" className="container mx-auto max-w-3xl px-5 pb-24">
        <Reveal>
          <ConsultationBooking
            program="unpause"
            eyebrow="Book my free consultation"
            headline="Pick a day and time that works."
            subtext="Free 30-minute 1:1 consultation with the Rebél team. We listen first, then recommend."
          />
        </Reveal>

        <div className="mt-10 rounded-2xl bg-foreground/[0.03] border border-foreground/10 p-6 text-sm" style={{ color: "var(--muted-foreground)" }}>
          Already enrolled? <Link to="/longevity/me" className="text-foreground underline">Open your member home</Link> ·{" "}
          <Link to="/auth" className="text-foreground underline">Sign in</Link>
        </div>
      </section>
    </SiteShell>
  );
}
