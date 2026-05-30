import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { Testimonials } from "@/components/Testimonials";
import { LocationSection } from "@/components/LocationSection";
import { StickyProgramTabs } from "@/components/StickyProgramTabs";
import { CafeTeaser } from "@/components/CafeTeaser";
import { FAQTeaser } from "@/components/FAQTeaser";
import { ReferralSection } from "@/components/ReferralSection";
import { RebelGallery } from "@/components/RebelGallery";

import imgStart from "@/assets/program-start.jpg";
import imgStudio from "@/assets/rebel-studio-red.jpg";
import imgBootcamp from "@/assets/program-bootcamp.jpg";
import imgFifty from "@/assets/program-fiftyplus.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rebel — The Fitness System People Actually Stick To" },
      { name: "description", content: "75% of our members are still training after a year — because Rebel is built on structure, not machines. Group Classes, 8-Week Challenge, and Rebel at 50+ in HSR Layout, Bangalore." },
      { name: "keywords", content: "machine free fitness Bangalore, functional training HSR Layout, group fitness classes, 8 week transformation Bangalore, fitness for 50+, gym alternative" },
      { property: "og:title", content: "Rebel — Fitness That Doesn't Quit on You" },
      { property: "og:description", content: "Built for the 90% who quit gyms in 90 days. Coach-led. Progression-based. Zero machines. One Rebel community." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <SiteShell>
      {/* HERO — full-bleed, minimal */}
      <HeroPanel />

      {/* PROGRAM PANELS — one per screen, Superhealth style */}
      <ProgramPanel
        id="group-classes"
        kind="group"
        eyebrow=""
        title="Rebel Group Classes"
        titleSmall={null}
        subtitle="Two paths, one studio. Rebel Start (Yoga · Zumba · Beginner Strength · Mat Pilates) for beginners. Rebel Strength (Calisthenics · S&C · Weightlifting) when you're ready to push. Or train all 7 with Rebel One."
        image={imgStart}
        to="/bohofit"
        cta="See Start, Strength & One"
        tone="light"
      />

      <ProgramPanel
        id="eight-weeks"
        kind="bootcamp"
        eyebrow=""
        title="Rebel 8 Weeks Challenge"
        titleSmall={null}
        subtitle="Three slots. Eight weeks. One version of you that finally finishes what you started."
        image={imgBootcamp}
        to="/bootcamp"
        cta="Claim a Slot"
        tone="dark"
      />

      <ProgramPanel
        id="fifty-plus"
        kind="fifty"
        eyebrow=""
        title="Rebel at 50+"
        titleSmall="Be a"
        subtitle="Move pain-free. Stay independent. A dedicated 50+ batch — no mirrors, no machines, no judgment."
        image={imgFifty}
        to="/longevity"
        cta="Learn More"
        tone="light"
      />

      {/* SUPPORTING SECTIONS */}
      <Testimonials />
      <CafeTeaser />
      <LocationSection />
      <RebelGallery />
      <ReferralSection />
      <FAQTeaser />

      {/* CLOSING */}
      <section className="border-t border-border/40">
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

      <StickyProgramTabs />
    </SiteShell>
  );
}

/* ───────────────────────── HERO ───────────────────────── */

function HeroPanel() {
  return (
    <section className="relative min-h-[92vh] flex flex-col overflow-hidden">
      {/* background image */}
      <img
        src={imgStudio}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* warm red wash + vignette for legibility */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(20,0,0,0.55) 0%, rgba(10,0,0,0.35) 40%, rgba(0,0,0,0.75) 100%)",
        }}
      />

      {/* content */}
      <div className="relative flex-1 w-full flex flex-col items-center justify-start text-center px-5 pt-20 md:pt-24 pb-10">
        {/* glass card */}
        <div
          className="max-w-md mx-auto rounded-3xl px-5 py-7 md:px-7 md:py-8 border border-white/15"
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

          <div className="mt-6">
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

/* ───────────────────────── PROGRAM PANEL ───────────────────────── */

type PanelProps = {
  id: string;
  kind: "group" | "bootcamp" | "fifty";
  eyebrow: string;
  title: string;
  titleSmall: string | null;
  subtitle: string;
  image: string;
  to: "/bohofit" | "/bootcamp" | "/longevity";
  cta: string;
  tone: "light" | "dark";
};

function ProgramTab({ targetId, children }: { targetId: string; children: React.ReactNode }) {
  const onClick = () => {
    const el = document.getElementById(targetId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full inline-flex items-center justify-center gap-1.5 rounded-full border border-white/15 text-white/90 hover:text-white px-3 h-10 text-[11px] font-semibold tracking-[0.08em] uppercase transition-all"
      style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(14px) saturate(140%)",
        WebkitBackdropFilter: "blur(14px) saturate(140%)",
        boxShadow: "0 1px 0 rgba(255,255,255,0.08) inset, 0 8px 24px -12px rgba(0,0,0,0.6)",
      }}
    >
      {children}
      <span className="text-white/50 group-hover:text-white/90 transition-colors" aria-hidden>↓</span>
    </button>
  );
}

function ProgramPanel({ id, title, titleSmall, subtitle, image, to, cta, tone }: PanelProps) {
  const isLight = tone === "light";
  return (
    <section
      id={id}
      className="relative min-h-[92vh] flex flex-col overflow-hidden border-t border-border/40 scroll-mt-20"
      style={{ background: isLight ? "#0a0a0a" : "#000000" }}
    >
      <div className="relative px-5 pt-20 md:pt-28 pb-8 text-center">
        {titleSmall && (
          <p
            className="text-white/70 font-medium mb-1"
            style={{ fontSize: "clamp(20px, 3vw, 28px)", letterSpacing: "-0.01em" }}
          >
            {titleSmall}
          </p>
        )}
        <h2
          className="font-black text-white"
          style={{
            fontSize: "clamp(44px, 9vw, 96px)",
            letterSpacing: "-0.04em",
            lineHeight: "0.95",
          }}
        >
          {title}
        </h2>
        <p
          className="mt-5 max-w-xl mx-auto text-white/75"
          style={{ fontSize: "clamp(15px, 1.7vw, 18px)" }}
        >
          {subtitle}
        </p>
      </div>

      <div className="relative flex-1 mx-5 md:mx-12 rounded-3xl overflow-hidden min-h-[380px]">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* subtle bottom gradient for legibility */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-1/3"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent)" }}
        />
      </div>

      <div className="relative w-full px-5 py-8 md:py-12">
        <Link
          to={to}
          className="block w-full max-w-md mx-auto rounded-2xl bg-white text-black text-center font-bold py-5 text-base hover:bg-white/90 transition-colors"
        >
          {cta}
        </Link>
      </div>
    </section>
  );
}
