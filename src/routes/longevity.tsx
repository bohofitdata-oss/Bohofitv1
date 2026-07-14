import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { Reveal } from "@/components/Reveal";
import { ProgramSwitcher } from "@/components/ProgramSwitcher";
import { ConsultationBooking } from "@/components/ConsultationBooking";
import { HeartPulse, Check } from "lucide-react";
import heroLoop from "../../public/longevity-hero-loop.mp4.asset.json";

export const Route = createFileRoute("/longevity")({
  head: () => ({
    meta: [
      { title: "Rebél Unpause — 1:1 training for perimenopause & menopause" },
      { name: "description", content: "Doctor-cleared 1:1 strength training built for perimenopause and menopause. Free 30-min consultation — no payment required." },
      { property: "og:title", content: "Rebél Unpause — 1:1 for the hormonal transition" },
      { property: "og:description", content: "Doctor-cleared strength training for the perimenopause & menopause transition. Free consultation." },
    ],
  }),
  component: UnpausePage,
});

const INCLUSIONS = [
  "True 1:1 — one coach, one client",
  "Doctor-cleared, gynae-informed programming",
  "3 sessions / week · 1 hour each",
  "Baseline + re-measurement of strength, balance & symptom score",
  "Outcome report you can share with your doctor",
];

function UnpausePage() {
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
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.55) 40%, rgba(0,0,0,0.92) 100%)",
          }}
          aria-hidden
        />
        <div className="relative container mx-auto px-5 pt-20 pb-16 md:pt-28 md:pb-24 text-center">
          <Reveal>
            <div className="flex justify-center mb-4">
              <ProgramSwitcher current="unpause" />
            </div>
            <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "#FF2233" }}>
              REBÉL UNPAUSE · 1:1
            </p>
            <h1
              className="mt-3 font-black tracking-tight leading-[1.02] text-white"
              style={{ fontSize: "clamp(38px, 7vw, 78px)", letterSpacing: "-0.04em", textShadow: "0 2px 30px rgba(0,0,0,0.7)" }}
            >
              For the change.
              <br />
              <span className="italic" style={{ color: "#FF2233" }}>Not around it.</span>
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-white/85 text-[15px] md:text-lg">
              Doctor-cleared 1:1 strength training built for perimenopause and menopause.
              One coach, one client, machine-free.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm text-white"
                 style={{ borderColor: "rgba(255,255,255,0.25)", background: "rgba(0,0,0,0.4)" }}>
              <HeartPulse className="w-4 h-4" style={{ color: "#FF2233" }} /> Free 30-min consultation · No card required
            </div>
            <div className="mt-8">
              <a
                href="#book"
                className="inline-flex items-center justify-center rounded-full px-7 h-12 font-bold text-sm text-white transition-colors hover:opacity-90"
                style={{ background: "#89010A" }}
              >
                Book my free consultation →
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* WHAT'S INSIDE */}
      <section className="container mx-auto max-w-4xl px-5 py-16 md:py-24">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: "#89010A" }}>
            What's inside Unpause
          </p>
          <h2
            className="mt-3 font-black text-white"
            style={{ fontSize: "clamp(28px, 5vw, 48px)", letterSpacing: "-0.03em", lineHeight: "1.05" }}
          >
            Built for the female body at <span className="italic" style={{ color: "#FF2233" }}>40, 50 and beyond.</span>
          </h2>
        </Reveal>
        <ul className="mt-8 grid sm:grid-cols-2 gap-3">
          {INCLUSIONS.map((b) => (
            <li key={b} className="rebel-card rounded-xl p-4 flex items-start gap-3">
              <Check className="w-5 h-5 mt-0.5 shrink-0" style={{ color: "#89010A" }} />
              <span className="text-[15px]" style={{ color: "#CCCCCC" }}>{b}</span>
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

        <div className="mt-10 rounded-2xl bg-white/[0.03] border border-white/10 p-6 text-sm" style={{ color: "#CCCCCC" }}>
          Already enrolled? <Link to="/longevity/me" className="text-white underline">Open your member home</Link> ·{" "}
          <Link to="/auth" className="text-white underline">Sign in</Link>
        </div>
      </section>
    </SiteShell>
  );
}
