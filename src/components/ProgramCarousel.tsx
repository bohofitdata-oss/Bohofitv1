import { Link } from "@tanstack/react-router";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";

import imgStart from "@/assets/program-start.jpg";
import imgFifty from "@/assets/program-fiftyplus.jpg";

type Slide = {
  id: string;
  title: string;
  tagline: string;
  image: string;
  to: "/bohofit" | "/longevity";
  cta: string;
};

const SLIDES: Slide[] = [
  {
    id: "group-classes",
    title: "Rebel Group Classes",
    tagline: "Two paths, one studio — Start soft, then go Strong.",
    image: imgStart,
    to: "/bohofit",
    cta: "See Start, Strength & One",
  },
  {
    id: "fifty-plus",
    title: "Rebel at 50+",
    tagline: "Move pain-free. Stay independent. No mirrors. No judgment.",
    image: imgFifty,
    to: "/longevity",
    cta: "Learn More",
  },
];

export function ProgramCarousel() {
  const [emblaRef, embla] = useEmblaCarousel({ align: "center", loop: false, containScroll: "trimSnaps" });
  const [selected, setSelected] = useState(0);
  const [progress, setProgress] = useState(0);

  const onSelect = useCallback(() => {
    if (!embla) return;
    setSelected(embla.selectedScrollSnap());
    setProgress(embla.scrollProgress());
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    onSelect();
    embla.on("select", onSelect);
    embla.on("scroll", onSelect);
    embla.on("reInit", onSelect);
  }, [embla, onSelect]);

  const scrollTo = (i: number) => embla?.scrollTo(i);
  const next = () => embla?.scrollNext();
  const prev = () => embla?.scrollPrev();

  const active = SLIDES[selected];

  return (
    <section id="programs" className="relative pt-10 pb-12 md:pt-14 md:pb-16 overflow-hidden" style={{ background: "linear-gradient(180deg, #000 0%, #0a0405 40%, #000 100%)" }}>
      {/* Cohesive divider: soft red glow + hairline */}
      <div aria-hidden className="absolute top-0 left-0 right-0 h-32 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(255,34,51,0.18) 0%, transparent 60%)" }} />
      <div aria-hidden className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-full max-w-3xl" style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,34,51,0.6) 50%, transparent 100%)" }} />
      <div className="container mx-auto px-5 relative">
        <h2
          className="font-black text-white text-center mb-2"
          style={{ fontSize: "clamp(32px, 6vw, 56px)", letterSpacing: "-0.03em", lineHeight: "1" }}
        >
          Choose your <span style={{ color: "#FF2233", fontStyle: "italic" }}>Rebel</span>.
        </h2>
        <p className="text-center text-white/60 text-sm md:text-base mb-8">
          Swipe through our three programs.
        </p>
      </div>

      {/* Embla viewport — full bleed so neighbor cards peek */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-3 sm:gap-4 md:gap-5 pl-5 pr-5 md:pl-12 md:pr-12 touch-pan-y">
          {SLIDES.map((s, i) => {
            const isActive = i === selected;
            return (
              <div
                key={s.id}
                className="relative shrink-0 grow-0 basis-[82%] sm:basis-[60%] md:basis-[44%] lg:basis-[32%] transition-[transform,opacity] duration-500"
                style={{
                  transform: isActive ? "scale(1)" : "scale(0.94)",
                  opacity: isActive ? 1 : 0.6,
                }}
              >
                <Link
                  to={s.to}
                  className="block relative rounded-3xl overflow-hidden aspect-[3/4] group ring-1 ring-white/10 hover:ring-white/30 transition-all duration-500"
                >
                  <img
                    src={s.image}
                    alt={s.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.08]"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-90"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.2) 45%, rgba(0,0,0,0.85) 100%)",
                    }}
                  />
                  {/* Centered title */}
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center px-5">
                    <h3
                      className="text-white font-black text-center"
                      style={{
                        fontSize: "clamp(22px, 4vw, 34px)",
                        letterSpacing: "-0.02em",
                        lineHeight: "1.05",
                        textShadow: "0 2px 24px rgba(0,0,0,0.6)",
                      }}
                    >
                      {s.title}
                    </h3>
                  </div>
                  {/* More details pill — consistent position */}
                  <div className="absolute bottom-6 inset-x-0 flex justify-center">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 text-white text-[12px] font-semibold tracking-wide transition-all duration-300 group-hover:bg-white group-hover:text-black group-hover:border-white">
                      <span
                        className="inline-block w-1.5 h-1.5 rounded-full transition-colors"
                        style={{ background: "#FF2233" }}
                        aria-hidden
                      />
                      More details
                    </span>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>


      {/* Tagline + CTA for active slide */}
      <div className="container mx-auto px-5 mt-8">
        <p
          key={active.id + "-tag"}
          className="text-center text-white/80 max-w-md mx-auto text-[15px] md:text-base mb-5 animate-in fade-in duration-300"
        >
          {active.tagline}
        </p>
        <div className="flex justify-center">
          <Link
            to={active.to}
            className="inline-flex items-center justify-center rounded-full bg-white text-black hover:bg-white/90 px-7 h-12 font-bold text-sm transition-colors"
          >
            {active.cta} →
          </Link>
        </div>
      </div>

      {/* Progress bar + arrows */}
      <div className="container mx-auto px-5 mt-8 flex items-center gap-4">
        <div className="flex-1 h-[2px] bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-white transition-[width] duration-300"
            style={{
              width: `${Math.max(20, ((selected + 1) / SLIDES.length) * 100)}%`,
            }}
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={prev}
            aria-label="Previous"
            className="w-10 h-10 rounded-full border border-white/15 text-white/80 hover:text-white hover:border-white/30 transition-colors flex items-center justify-center"
          >
            ←
          </button>
          <button
            onClick={next}
            aria-label="Next"
            className="w-10 h-10 rounded-full border border-white/15 text-white/80 hover:text-white hover:border-white/30 transition-colors flex items-center justify-center"
          >
            →
          </button>
        </div>
      </div>

      {/* Dots (mobile only, hidden on desktop where arrows lead) */}
      <div className="flex justify-center gap-2 mt-5 md:hidden">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => scrollTo(i)}
            aria-label={`Go to ${s.title}`}
            className="h-1.5 rounded-full transition-all"
            style={{
              width: i === selected ? 24 : 8,
              background: i === selected ? "#FF2233" : "rgba(255,255,255,0.25)",
            }}
          />
        ))}
      </div>
    </section>
  );
}
