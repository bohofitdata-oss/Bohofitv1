import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { Testimonials } from "@/components/Testimonials";
import { LocationSection } from "@/components/LocationSection";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { CafeTeaser } from "@/components/CafeTeaser";
import { FAQTeaser } from "@/components/FAQTeaser";
import { ReferralSection } from "@/components/ReferralSection";
import { RebelGallery } from "@/components/RebelGallery";

import imgStart from "@/assets/program-start.jpg";
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
        kind="group"
        eyebrow=""
        title="Rebel Group Classes"
        titleSmall={null}
        subtitle="Yoga. Pilates. Strength. Zumba. Train with people who show up."
        image={imgStart}
        to="/bohofit"
        cta="Join a Class"
        tone="light"
      />

      <ProgramPanel
        kind="bootcamp"
        eyebrow=""
        title="Rebel 8 Weeks Challenge"
        titleSmall={null}
        subtitle="Lose fat. Build strength. Eight weeks. Real results."
        image={imgBootcamp}
        to="/bootcamp"
        cta="Start the Challenge"
        tone="dark"
      />

      <ProgramPanel
        kind="fifty"
        eyebrow=""
        title="Rebel at 50+"
        titleSmall="Be a"
        subtitle="Fitness that fits. Not machines. One coach. One you."
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

      <StickyMobileCTA />
    </SiteShell>
  );
}

/* ───────────────────────── HERO ───────────────────────── */

function HeroPanel() {
  return (
    <section className="relative min-h-[92vh] flex flex-col items-center justify-between overflow-hidden bg-black">
      {/* subtle radial heat */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: "radial-gradient(60% 50% at 50% 30%, rgba(137,1,10,0.18), transparent 70%)" }}
      />

      <div className="relative flex-1 w-full flex flex-col items-center justify-center text-center px-5 pt-24 pb-12">
        <h1
          className="font-black text-white"
          style={{
            fontSize: "clamp(72px, 18vw, 220px)",
            letterSpacing: "-0.05em",
            lineHeight: "0.9",
          }}
        >
          Rebel.
        </h1>
        <p
          className="mt-6 text-white/85 font-medium"
          style={{ fontSize: "clamp(18px, 2.4vw, 24px)", letterSpacing: "-0.01em" }}
        >
          Machine-free fitness. For life.
        </p>
      </div>

      <div className="relative w-full px-5 pb-8 md:pb-12">
        <Link
          to="/booking"
          className="block w-full max-w-md mx-auto rounded-2xl bg-white text-black text-center font-bold py-5 text-base hover:bg-white/90 transition-colors"
        >
          Speak with us
        </Link>
      </div>
    </section>
  );
}

/* ───────────────────────── PROGRAM PANEL ───────────────────────── */

type PanelProps = {
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

function ProgramPanel({ title, titleSmall, subtitle, image, to, cta, tone }: PanelProps) {
  const isLight = tone === "light";
  return (
    <section
      className="relative min-h-[92vh] flex flex-col overflow-hidden border-t border-border/40"
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
