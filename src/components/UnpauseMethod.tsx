import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/Reveal";

/* ============================================================
   REBÉL — Method / Unpause marketing sections
   Six stacked sections, all in Rebél's existing dark editorial
   crimson-on-black system. No copied colours from references.
   ============================================================ */

const LABEL_CLS =
  "inline-block text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60";

const CARD_CLS =
  "rebel-card rounded-3xl p-6 md:p-7 h-full flex flex-col";

/* --------- 1. Positioning hero band --------- */
function PositioningBand() {
  return (
    <section className="relative border-t border-white/5">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(70% 60% at 50% 0%, rgba(196,21,32,0.18) 0%, transparent 65%)",
        }}
      />
      <div className="relative container mx-auto px-5 py-24 md:py-36 text-center">
        <Reveal>
          <p className={LABEL_CLS}>The Rebél method</p>
          <h2
            className="mt-4 font-black text-white mx-auto max-w-5xl"
            style={{
              fontSize: "clamp(38px, 8vw, 92px)",
              letterSpacing: "-0.04em",
              lineHeight: "0.95",
            }}
          >
            THIS ISN'T A WORKOUT.
            <br />
            IT'S A <span style={{ color: "#FF2233", fontStyle: "italic" }}>METHOD.</span>
          </h2>
          <p className="mt-6 max-w-2xl mx-auto text-[15px] md:text-lg text-white/75 leading-relaxed">
            Supervised, measured strength training built for the female body at
            40, 50 and beyond. Gynaecologist-informed. Outcome-tracked. In person.
          </p>
          <div className="mt-8">
            <Link
              to="/longevity"
              className="inline-flex items-center justify-center rounded-full bg-white text-black hover:bg-white/90 px-7 h-12 font-bold text-sm transition-colors"
            >
              Book a free strength assessment →
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* --------- 2. What We Offer — three peer cards --------- */
function WhatWeOffer() {
  const pillars = [
    {
      label: "01 · Group Classes",
      title: "GROUP CLASSES",
      line: "Where strength becomes a habit.",
      body: "Small-group, machine-free, coach-led. Rebél Start → Rebél Strength.",
      to: "/bohofit" as const,
      cta: "See group classes",
    },
    {
      label: "02 · Unpause",
      title: "UNPAUSE",
      line: "Our flagship. 1:1 strength for the perimenopause & menopause transition.",
      body: "Two tracks. Gynae-informed, measured, in person. 36 sessions · 3×/week.",
      to: "/longevity" as const,
      cta: "Explore Unpause",
    },
    {
      label: "03 · Rebél at 50+",
      title: "UNREAL STRENGTH AT 50+",
      line: "Strength for your joints, bones and balance — stay mobile, steady and independent.",
      body: "1:1 or small group. Doctor-cleared where needed. Measured at the start, re-measured at the end.",
      to: "/fiftyplus" as const,
      cta: "Explore Rebél at 50+",
    },
  ];

  return (
    <section className="container mx-auto px-5 py-20 md:py-28">
      <Reveal>
        <p className={LABEL_CLS}>What we offer</p>
        <h2
          className="mt-3 font-black text-white max-w-3xl"
          style={{ fontSize: "clamp(30px, 5.5vw, 56px)", letterSpacing: "-0.03em", lineHeight: "1" }}
        >
          Three ways to train.
          <br />
          <span style={{ fontStyle: "italic" }}>
            One <span style={{ color: "#FF2233" }}>standard.</span>
          </span>
        </h2>
      </Reveal>

      <div className="mt-10 grid md:grid-cols-3 gap-4 md:gap-5">
        {pillars.map((p, i) => (
          <Reveal key={p.title} delay={i * 100}>
            <article className={CARD_CLS}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50">
                {p.label}
              </p>
              <h3
                className="mt-4 font-black text-white"
                style={{ fontSize: "clamp(24px, 3.2vw, 34px)", letterSpacing: "-0.03em", lineHeight: "1" }}
              >
                {p.title}
              </h3>
              <p
                className="mt-3 text-base md:text-lg"
                style={{ color: "#FF2233", fontStyle: "italic" }}
              >
                {p.line}
              </p>
              <p className="mt-4 text-sm md:text-[15px] leading-relaxed" style={{ color: "#CCCCCC" }}>
                {p.body}
              </p>
              <div className="mt-6 pt-6 border-t border-white/10 mt-auto">
                <Link
                  to={p.to}
                  className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-white/70 transition-colors"
                >
                  {p.cta} →
                </Link>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* --------- 3. UNPAUSE detail --------- */
function UnpauseTracks() {
  const tracks = [
    {
      n: "Track 01",
      title: "Perimenopause",
      line: "Train through the change — strength, sleep, steadiness.",
    },
    {
      n: "Track 02",
      title: "Menopause & beyond",
      line: "Rebuild the muscle, bone and metabolism the hormone used to protect.",
    },
  ];

  return (
    <section
      className="relative border-y border-white/5"
      style={{ background: "linear-gradient(180deg, #050505 0%, #0a0405 100%)" }}
    >
      <div className="container mx-auto px-5 py-20 md:py-28">
        <Reveal>
          <div className="max-w-3xl">
            <p className={LABEL_CLS}>Unpause</p>
            <h2
              className="mt-3 font-black text-white"
              style={{ fontSize: "clamp(32px, 6vw, 64px)", letterSpacing: "-0.03em", lineHeight: "1" }}
            >
              One umbrella.
              <br />
              <span style={{ fontStyle: "italic", color: "#FF2233" }}>Three tracks.</span>
            </h2>
            <p className="mt-6 text-[15px] md:text-lg leading-relaxed" style={{ color: "#CCCCCC" }}>
              One programme, built around where your body actually is. 1:1 or small
              group · 3×/week · 36 sessions · gynae-informed · measured at the
              start and re-measured at the end.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid md:grid-cols-2 gap-4 md:gap-5">
          {tracks.map((t, i) => (
            <Reveal key={t.title} delay={i * 90}>
              <article className={CARD_CLS}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50">
                  {t.n}
                </p>
                <h3
                  className="mt-4 font-black text-white"
                  style={{ fontSize: "clamp(22px, 3vw, 30px)", letterSpacing: "-0.02em", lineHeight: "1.05" }}
                >
                  {t.title}
                </h3>
                <p className="mt-4 text-sm md:text-[15px] leading-relaxed" style={{ color: "#CCCCCC" }}>
                  {t.line}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            to="/longevity"
            className="inline-flex items-center justify-center rounded-full bg-white text-black hover:bg-white/90 px-6 h-11 font-bold text-sm transition-colors"
          >
            See the full Unpause programme →
          </Link>
        </div>
      </div>
    </section>
  );
}

/* --------- 4. Phased programme timeline --------- */
function PhasedTimeline() {
  const phases = [
    {
      n: "Phase 1",
      label: "Foundation",
      bullets: [
        "Baseline assessment — strength, balance, body composition, symptom score.",
        "DXA result reviewed if she has one.",
        "Movement quality mapped. Safe starting load set.",
      ],
      pull: "Know exactly where you stand.",
    },
    {
      n: "Phase 2",
      label: "Build",
      bullets: [
        "Progressive strength, coach-supervised every session.",
        "Weekly load and technique adjustments.",
        "Re-measure at week 12.",
      ],
      pull: "Get measurably stronger — with the numbers to prove it.",
    },
    {
      n: "Phase 3",
      label: "Strength",
      bullets: [
        "Peak load work + balance and stability integration.",
        "Final re-measure across all baseline markers.",
        "Outcome report generated for you and your doctor.",
      ],
      pull: "Strength that holds — and a progress report your doctor can read.",
    },
  ];

  return (
    <section className="container mx-auto px-5 py-20 md:py-28">
      <Reveal>
        <div className="max-w-3xl">
          <p className={LABEL_CLS}>How Unpause works</p>
          <h2
            className="mt-3 font-black text-white"
            style={{ fontSize: "clamp(30px, 5.5vw, 56px)", letterSpacing: "-0.03em", lineHeight: "1" }}
          >
            A <span style={{ color: "#FF2233", fontStyle: "italic" }}>measured</span> 12 weeks.
          </h2>
          <p className="mt-4 text-white/70 text-sm md:text-base">
            Three phases. Everything baselined at the start. Everything re-measured at the end.
          </p>
        </div>
      </Reveal>

      <ol className="mt-12 relative">
        {/* vertical spine */}
        <div
          aria-hidden
          className="absolute left-4 md:left-6 top-2 bottom-2 w-px"
          style={{ background: "linear-gradient(180deg, rgba(255,34,51,0.5), rgba(255,34,51,0.1))" }}
        />
        {phases.map((p, i) => (
          <Reveal key={p.n} delay={i * 100}>
            <li className="relative pl-14 md:pl-20 pb-10 md:pb-12 last:pb-0">
              <span
                className="absolute left-0 top-1 w-9 h-9 md:w-12 md:h-12 rounded-full flex items-center justify-center font-black text-white text-sm md:text-base"
                style={{
                  background: "#89010A",
                  boxShadow: "0 0 0 4px rgba(255,34,51,0.15)",
                }}
              >
                {i + 1}
              </span>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50">
                {p.n}
              </p>
              <h3
                className="mt-1 font-black text-white uppercase"
                style={{ fontSize: "clamp(24px, 4vw, 38px)", letterSpacing: "-0.02em", lineHeight: "1" }}
              >
                {p.label}
              </h3>
              <ul className="mt-4 space-y-2">
                {p.bullets.map((b) => (
                  <li key={b} className="flex gap-3 text-sm md:text-[15px] leading-relaxed" style={{ color: "#CCCCCC" }}>
                    <span aria-hidden className="mt-2 shrink-0 w-1.5 h-1.5 rounded-full" style={{ background: "#FF2233" }} />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <p
                className="mt-4 text-base md:text-lg"
                style={{ color: "#FF2233", fontStyle: "italic" }}
              >
                “{p.pull}”
              </p>
            </li>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}

/* --------- 5. Proof cards --------- */
function ProofCards() {
  const proofs = [
    { headline: "Deadlifts 40 kg at 54.", caption: "Strength, measured." },
    { headline: "Climbs stairs without the railing.", caption: "Joints, rebuilt." },
    { headline: "Stands on one leg, eyes closed.", caption: "Balance, restored." },
    { headline: "Bone strength tracked over 12 weeks.", caption: "Working with her doctor." },
  ];

  return (
    <section
      className="border-y border-white/5"
      style={{ background: "linear-gradient(180deg, #070707 0%, #050505 100%)" }}
    >
      <div className="container mx-auto px-5 py-20 md:py-28">
        <Reveal>
          <div className="max-w-3xl">
            <p className={LABEL_CLS}>Proof</p>
            <h2
              className="mt-3 font-black text-white"
              style={{ fontSize: "clamp(30px, 5.5vw, 56px)", letterSpacing: "-0.03em", lineHeight: "1" }}
            >
              Real strength.
              <br />
              <span style={{ color: "#FF2233", fontStyle: "italic" }}>Measured.</span>
            </h2>
          </div>
        </Reveal>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {proofs.map((p, i) => (
            <Reveal key={p.headline} delay={i * 80}>
              <article className={CARD_CLS}>
                <p
                  className="font-black tracking-tight text-white"
                  style={{ fontSize: "clamp(22px, 2.6vw, 28px)", letterSpacing: "-0.02em", lineHeight: "1.1" }}
                >
                  “{p.headline}”
                </p>
                <div className="mt-auto pt-6">
                  <p
                    className="text-xs uppercase tracking-[0.22em]"
                    style={{ color: "#FF2233" }}
                  >
                    {p.caption}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <p className="mt-6 text-xs text-white/40">
          Member outcomes shown where available; capability statements are illustrative of the programme's focus, not medical claims.
        </p>
      </div>
    </section>
  );
}

/* --------- 6. Difference band --------- */
function DifferenceBand() {
  return (
    <section className="relative">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(60% 80% at 50% 50%, rgba(196,21,32,0.14) 0%, transparent 70%)",
        }}
      />
      <div className="relative container mx-auto px-5 py-24 md:py-36 text-center">
        <Reveal>
          <p className={LABEL_CLS}>The difference</p>
          <h2
            className="mt-4 font-black text-white mx-auto max-w-5xl"
            style={{
              fontSize: "clamp(28px, 5.5vw, 62px)",
              letterSpacing: "-0.03em",
              lineHeight: "1.05",
            }}
          >
            Other programmes send you a video.
            <br />
            We put a <span style={{ color: "#FF2233", fontStyle: "italic" }}>coach in the room</span>,
            measure what changes, and send a report to your doctor.
          </h2>
          <p className="mt-6 max-w-2xl mx-auto text-[15px] md:text-lg text-white/70 leading-relaxed">
            Supervised, in person, gynaecologist-partnered, outcome-measured.
            That's what makes Unpause different.
          </p>
          <div className="mt-8">
            <Link
              to="/longevity"
              className="inline-flex items-center justify-center rounded-full bg-white text-black hover:bg-white/90 px-7 h-12 font-bold text-sm transition-colors"
            >
              Book a free strength assessment →
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function UnpauseMethod() {
  return (
    <>
      <PositioningBand />
      <WhatWeOffer />
      <UnpauseTracks />
      <PhasedTimeline />
      <ProofCards />
      <DifferenceBand />
    </>
  );
}
