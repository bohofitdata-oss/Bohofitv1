import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { Testimonials } from "@/components/Testimonials";
import { LocationSection } from "@/components/LocationSection";
import { CafeTeaser } from "@/components/CafeTeaser";
import { FAQTeaser } from "@/components/FAQTeaser";
import { ReferralSection } from "@/components/ReferralSection";
import { RebelGallery } from "@/components/RebelGallery";
import { ProgramCarousel } from "@/components/ProgramCarousel";
import { UnpauseMethod } from "@/components/UnpauseMethod";
import { WhatYouGet } from "@/components/WhatYouGet";
import { RebelMethod } from "@/components/RebelMethod";
import { RebelJourney } from "@/components/RebelJourney";

import imgStudio from "@/assets/rebel-studio-red.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rebél — The Fitness System People Actually Stick To" },
      { name: "description", content: "75% of our members are still training after a year — because Rebél is built on structure, not machines. Group Classes and Rebél Unpause in HSR Layout, Bangalore." },
      { name: "keywords", content: "machine free fitness Bangalore, functional training HSR Layout, group fitness classes, Rebél Unpause, fitness 50+, gym alternative" },
      { property: "og:title", content: "Rebél — Fitness That Doesn't Quit on You" },
      { property: "og:description", content: "Built for the 90% who quit gyms in 90 days. Coach-led. Progression-based. Zero machines. One Rebél community." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <SiteShell>
      <HeroPanel />
      <div id="group-classes"><ProgramCarousel /></div>
      <WhatYouGet />
      <div id="unpause" className="rebel-glow"><UnpauseMethod /></div>
      <FiftyPlusFlagship />
      <div id="method"><RebelMethod /></div>
      <RebelJourney />




      <Testimonials />
      <CafeTeaser />
      <LocationSection />
      <RebelGallery />
      <ReferralSection />
      <FAQTeaser />

      <section className="border-t border-border/40 rebel-glow">
        <div className="container mx-auto px-5 py-32 md:py-40 text-center">
          <h2 className="font-black tracking-tight leading-[0.95] text-white" style={{ fontSize: "clamp(40px, 9vw, 96px)", letterSpacing: "-0.04em" }}>
            Train today.<br />Stay fit for life.
          </h2>
          <div className="mt-10">
            <Link
              to="/booking"
              className="inline-flex items-center justify-center rounded-full bg-white text-black hover:bg-white/90 px-8 h-14 font-bold text-base transition-colors"
            >
              Speak with us
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

/* ───────────────────────── HERO ───────────────────────── */

function HeroPanel() {
  return (
    <section className="relative flex flex-col overflow-hidden">
      <img
        src={imgStudio}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(20,0,0,0.55) 0%, rgba(10,0,0,0.4) 50%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      <div className="relative w-full flex flex-col items-center justify-center text-center px-5 pt-16 md:pt-20 pb-10 md:pb-12">
        <div
          className="max-w-md mx-auto rounded-3xl px-5 py-6 md:px-7 md:py-7 border border-white/15"
          style={{
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(22px) saturate(140%)",
            WebkitBackdropFilter: "blur(22px) saturate(140%)",
            boxShadow: "0 30px 80px -20px rgba(0,0,0,0.6)",
          }}
        >
          <p
            className="text-white/70 font-semibold uppercase tracking-[0.22em] mb-3"
            style={{ fontSize: "clamp(9px, 1vw, 11px)" }}
          >
            Machine-free · Coach-led · Bangalore
          </p>
          <h1
            className="font-black text-white"
            style={{
              fontSize: "clamp(34px, 7vw, 64px)",
              letterSpacing: "-0.04em",
              lineHeight: "0.95",
            }}
          >
            Fitness you
            <br />
            actually <span style={{ color: "#FF2233", fontStyle: "italic" }}>finish.</span>
          </h1>
          <p
            className="mt-4 max-w-sm mx-auto text-white/85 font-medium"
            style={{ fontSize: "clamp(13px, 1.5vw, 15px)" }}
          >
            75% of our members are still training a year later.
          </p>

          <div className="mt-5">
            <Link
              to="/booking"
              className="inline-flex items-center justify-center rounded-full bg-white text-black hover:bg-white/90 px-6 h-11 font-bold text-sm transition-colors"
            >
              Book a free trial →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── 50+ FLAGSHIP ───────────────────────── */

function FiftyPlusFlagship() {
  return (
    <section id="fifty-plus" className="relative rebel-glow border-t border-white/5">
      <div className="container mx-auto px-5 py-20 md:py-28">
        <div className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: "#89010A" }}>
            Rebél at 50+ · 1:1
          </p>
          <h2
            className="mt-4 font-black text-white"
            style={{ fontSize: "clamp(32px, 6vw, 64px)", letterSpacing: "-0.03em", lineHeight: "1" }}
          >
            Strong.
            <br />
            <span className="italic" style={{ color: "#FF2233" }}>Steady. Independent.</span>
          </h2>
          <p className="mt-5 text-[15px] md:text-lg" style={{ color: "#CCCCCC" }}>
            Our second flagship 1:1 programme — for people 50+ dealing with disc bulge,
            knee, hip, shoulder, elbow or back pain, and post-injury recovery.
            Doctor-cleared, machine-free, built around your body.
          </p>
        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-3 md:gap-4">
          {[
            { t: "Doctor-cleared", b: "Trained around your medical history and pain points." },
            { t: "1:1 supervision", b: "One coach, one client — every session, every rep." },
            { t: "No machines", b: "Joint-friendly strength you can carry into daily life." },
          ].map((p) => (
            <div key={p.t} className="rebel-card rounded-2xl p-5">
              <p className="text-[11px] uppercase tracking-[0.22em] font-semibold" style={{ color: "#FF2233" }}>{p.t}</p>
              <p className="mt-3 text-sm md:text-[15px]" style={{ color: "#CCCCCC" }}>{p.b}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            to="/fiftyplus"
            className="inline-flex items-center justify-center rounded-full px-7 h-12 font-bold text-sm text-white transition-colors hover:opacity-90"
            style={{ background: "#89010A" }}
          >
            Book my free consultation →
          </Link>
          <Link
            to="/fiftyplus"
            className="inline-flex items-center justify-center rounded-full border border-white/20 text-white hover:bg-white/[0.06] px-6 h-12 font-bold text-sm transition-colors"
          >
            Explore Rebél at 50+
          </Link>
        </div>
      </div>
    </section>
  );
}
