import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteShell } from "@/components/SiteShell";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/cafe")({
  head: () => ({
    meta: [
      { title: "Rebél Café — Food that fuels your workouts" },
      { name: "description", content: "Macro-tagged breakfast, lunch & dinner bowls plus monthly meal subscriptions at Rebél Café." },
    ],
  }),
  component: CafePage,
});

type Item = { name: string; desc: string; kcal?: number; p?: number; c?: number; f?: number; price: string };

const BREAKFAST: Item[] = [
  { name: "Protein Oat Bowl", desc: "Rolled oats, nuts, banana", kcal: 380, p: 18, c: 52, f: 9, price: "₹220" },
  { name: "Egg White Wrap", desc: "3 egg whites, veggies, whole wheat", kcal: 290, p: 24, c: 28, f: 6, price: "₹180" },
  { name: "Smoothie Bowl", desc: "Banana, berries, granola", kcal: 340, p: 12, c: 58, f: 7, price: "₹250" },
];

const LUNCH: Item[] = [
  { name: "Grilled Chicken Bowl", desc: "Brown rice, greens, house sauce", kcal: 520, p: 42, c: 48, f: 10, price: "₹380" },
  { name: "Paneer Power Bowl", desc: "Cottage cheese, quinoa, roasted veg", kcal: 480, p: 28, c: 44, f: 14, price: "₹340" },
  { name: "Burrito Bowl", desc: "Beans, rice, salsa, greens", kcal: 460, p: 18, c: 68, f: 9, price: "₹320" },
];

const SUBS: Item[] = [
  { name: "Breakfast Plan", desc: "22 meals/month", price: "₹3,500" },
  { name: "Lunch Plan", desc: "22 meals/month", price: "₹5,500" },
  { name: "Dinner Plan", desc: "22 meals/month", price: "₹5,500" },
  { name: "Full Day Plan", desc: "Breakfast + Lunch + Dinner", price: "₹12,000/month" },
];

type Tab = "breakfast" | "lunch" | "subs";

const WHATSAPP =
  "https://wa.me/919999999999?text=" +
  encodeURIComponent("Hi Rebél, I'd like a free dietitian consultation.");

function CafePage() {
  const [tab, setTab] = useState<Tab>("breakfast");
  const list = tab === "breakfast" ? BREAKFAST : tab === "lunch" ? LUNCH : SUBS;

  return (
    <SiteShell>
      <section className="container mx-auto px-5 pt-12 md:pt-20 pb-6">
        <Reveal>
          <p className="rebel-label">Rebél Café</p>
          <h1 className="rebel-hero-title text-4xl md:text-6xl font-black mt-3 leading-[0.95]">
            Food that <span style={{ fontStyle: "italic", color: "#FF2233" }}>fuels</span> the work.
          </h1>
          <p className="mt-4 text-base max-w-md" style={{ color: "#CCCCCC" }}>
            Macro-tagged meals and monthly plans — served at HSR Layout.
          </p>
        </Reveal>
      </section>

      <section className="container mx-auto px-5">
        <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {(
            [
              { k: "breakfast", l: "Breakfast" },
              { k: "lunch", l: "Lunch & Dinner" },
              { k: "subs", l: "Subscriptions" },
            ] as { k: Tab; l: string }[]
          ).map((t) => (
            <button
              key={t.k}
              onClick={() => setTab(t.k)}
              className={cn(
                "rebel-pill shrink-0 text-xs md:text-sm px-4 py-2 rounded-full uppercase tracking-wider font-bold",
                tab === t.k && "rebel-pill-active",
              )}
            >
              {t.l}
            </button>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-5 mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {list.map((i) => (
          <div key={i.name} className="rebel-card rounded-2xl p-5">
            <div className="flex items-start justify-between gap-3">
              <p className="font-black text-white text-base md:text-lg">{i.name}</p>
              <span className="font-black shrink-0" style={{ color: "#FF2233" }}>
                {i.price}
              </span>
            </div>
            <p className="mt-1 text-sm" style={{ color: "#CCCCCC" }}>
              {i.desc}
            </p>
            {i.kcal != null && (
              <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[12px] font-mono" style={{ color: "#CCCCCC" }}>
                <span>{i.kcal} kcal</span>
                <span>P: {i.p}g</span>
                <span>C: {i.c}g</span>
                <span>F: {i.f}g</span>
              </div>
            )}
          </div>
        ))}
      </section>

      <section className="container mx-auto px-5 py-16 md:py-24">
        <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="rebel-btn w-full text-center text-sm md:text-base">
          Speak with our dietitian — free first consultation
        </a>
      </section>
    </SiteShell>
  );
}
