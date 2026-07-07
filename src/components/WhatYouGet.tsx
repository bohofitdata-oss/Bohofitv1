import { useEffect, useRef, useState } from "react";
import {
  Users,
  TrendingUp,
  Layers,
  Home,
  HeartPulse,
  Award,
  ChevronDown,
  Calendar,
  UsersRound,
  Dumbbell,
  Ban,
} from "lucide-react";
import { Reveal } from "@/components/Reveal";

const CRIMSON = "#89010A";
const GREY = "#CCCCCC";

type Card = {
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  title: string;
  subtitle: string;
  body: string;
};

const CARDS: Card[] = [
  {
    icon: Users,
    title: "Coach-Led, Never Machine-Led",
    subtitle: "Real movement, real correction",
    body: "Every session is led by a coach who watches your form and adjusts in real time. No treadmills, no fixed machines — just functional strength built on your body.",
  },
  {
    icon: TrendingUp,
    title: "Programming That Progresses",
    subtitle: "No plateaus, no guesswork",
    body: "Your training moves through structured phases so you keep getting stronger. We track where you are and push you to the next level.",
  },
  {
    icon: Layers,
    title: "Small Batches",
    subtitle: "Group classes as the default. 1:1 for Unpause and 50+",
    body: "Unpause and 50+ are 1:1 with a coach. If a family trains together — a parent and child, or partners bringing a buddy — we run those as small 2 or 3 person sessions. Everything else is group classes, capped so every rep gets seen.",
  },
  {
    icon: Home,
    title: "Studio, Online, or At-Home",
    subtitle: "Train wherever you are",
    body: "Come to HSR Layout, join live on Google Meet, or have a coach guide you from home. Same system, your setting.",
  },
  {
    icon: HeartPulse,
    title: "Built for Real Bodies",
    subtitle: "PCOD, PCOS, thyroid, perimenopause, menopause, back and knee, post-injury",
    body: "We screen your body before we build your plan. Your programme accounts for what you are actually working with — hormonal shifts, joint history, recovery capacity — not a generic template.",
  },
  {
    icon: Award,
    title: "Four Years of Proof",
    subtitle: "3,000+ people trained, since Bohofit",
    body: "This is not a new experiment. We have refined this system across four and a half years and thousands of members.",
  },

];

function AccordionCard({ card, isOpen, onToggle }: { card: Card; isOpen: boolean; onToggle: () => void }) {
  const Icon = card.icon;
  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderLeft: isOpen ? `3px solid ${CRIMSON}` : "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center gap-4 px-5 py-5 text-left"
      >
        <span
          className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(137,1,10,0.12)" }}
        >
          <Icon size={20} color={CRIMSON} strokeWidth={2} />
        </span>
        <span className="flex-1 min-w-0">
          <span className="block font-bold text-white text-[15px] md:text-base leading-tight">
            {card.title}
          </span>
          <span className="block text-[13px] md:text-sm mt-1" style={{ color: GREY }}>
            {card.subtitle}
          </span>
        </span>
        <ChevronDown
          size={20}
          color="#ffffff"
          className="shrink-0 transition-transform duration-300"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", opacity: 0.7 }}
        />
      </button>
      <div
        className="grid transition-all duration-300 ease-out"
        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p
            className="px-5 pb-5 pl-[76px] text-sm md:text-[15px] leading-relaxed"
            style={{ color: GREY }}
          >
            {card.body}
          </p>
        </div>
      </div>
    </div>
  );
}

function CountUp({ target, duration = 1400 }: { target: number; duration?: number }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            setValue(target * eased);
            if (t < 1) requestAnimationFrame(tick);
            else setValue(target);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{value.toFixed(0) === target.toFixed(0) ? target : value.toFixed(target % 1 === 0 ? 0 : 1)}</span>;
}

type Stat = {
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  number: number;
  display: (v: number) => string;
  label: string;
};

const STATS: Stat[] = [
  { icon: Calendar, number: 4.5, display: (v) => v.toFixed(1), label: "Years of coaching" },
  { icon: UsersRound, number: 2000, display: (v) => `${Math.round(v).toLocaleString()}+`, label: "People trained" },
  { icon: Dumbbell, number: 6, display: (v) => Math.round(v).toString(), label: "Training programmes" },
  { icon: Ban, number: 0, display: () => "0", label: "Machines" },
];

function StatTile({ stat, delay }: { stat: Stat; delay: number }) {
  const Icon = stat.icon;
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const duration = 1500;
          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            setValue(stat.number * eased);
            if (t < 1) requestAnimationFrame(tick);
            else setValue(stat.number);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [stat.number]);

  return (
    <div
      ref={ref}
      className="rounded-2xl p-6 md:p-7 text-center flex flex-col items-center justify-center"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        minHeight: 160,
        animationDelay: `${delay}ms`,
      }}
    >
      <Icon size={22} color={CRIMSON} strokeWidth={2} />
      <div
        className="mt-3 font-black text-white leading-none"
        style={{ fontSize: "clamp(36px, 6vw, 48px)", letterSpacing: "-0.03em" }}
      >
        {stat.display(value)}
      </div>
      <div className="mt-2 text-xs md:text-sm" style={{ color: GREY }}>
        {stat.label}
      </div>
    </div>
  );
}

export function WhatYouGet() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="bg-black border-t border-white/5">
      <div className="container mx-auto px-5 py-20 md:py-28">
        <Reveal>
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">
              The system
            </p>
            <h2
              className="mt-3 font-black text-white"
              style={{ fontSize: "clamp(32px, 6vw, 60px)", letterSpacing: "-0.03em", lineHeight: "1" }}
            >
              What you get at{" "}
              <span style={{ color: "#FF2233", fontStyle: "italic" }}>Rebél.</span>
            </h2>
            <p className="mt-4 text-[15px] md:text-lg" style={{ color: GREY }}>
              Not a gym membership. A system built around how you actually live.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 max-w-3xl space-y-3">
          {CARDS.map((c, i) => (
            <Reveal key={c.title} delay={i * 60}>
              <AccordionCard
                card={c}
                isOpen={openIdx === i}
                onToggle={() => setOpenIdx(openIdx === i ? null : i)}
              />
            </Reveal>
          ))}
        </div>

        {/* Stat grid */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {STATS.map((s, i) => (
            <StatTile key={s.label} stat={s} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  );
}
