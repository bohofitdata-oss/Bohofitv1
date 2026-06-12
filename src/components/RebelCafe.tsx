import { useState } from "react";
import { Coffee } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/Reveal";

type Item = { name: string; price: string; macros?: string };
type Cat = { key: string; label: string; items: Item[] };

const MENU: Cat[] = [
  {
    key: "elixirs",
    label: "Elixirs & Tonics",
    items: [
      { name: "Turmeric Tonic", price: "₹180" },
      { name: "Ginger Honey Shot", price: "₹140" },
      { name: "Beetroot Power", price: "₹220" },
      { name: "Green Detox", price: "₹240" },
    ],
  },
  {
    key: "coffee",
    label: "Cold Brew & Coffee",
    items: [
      { name: "Cold Brew", price: "₹220" },
      { name: "Vanilla Cold Brew", price: "₹240" },
      { name: "Cappuccino", price: "₹180" },
      { name: "Flat White", price: "₹200" },
      { name: "Mocha", price: "₹240" },
    ],
  },
  {
    key: "matcha",
    label: "Matcha",
    items: [
      { name: "Iced Matcha Latte", price: "₹260" },
      { name: "Strawberry Matcha", price: "₹280" },
      { name: "Hot Matcha", price: "₹240" },
    ],
  },
  {
    key: "smoothies",
    label: "Smoothies & Bowls",
    items: [
      { name: "Berry Protein Smoothie", price: "₹320", macros: "P 28g · C 38g · F 6g" },
      { name: "Peanut Banana Smoothie", price: "₹300", macros: "P 24g · C 42g · F 12g" },
      { name: "Acai Bowl", price: "₹380", macros: "P 14g · C 56g · F 10g" },
      { name: "Chia Pudding", price: "₹260", macros: "P 12g · C 32g · F 14g" },
    ],
  },
  {
    key: "breakfast",
    label: "All-Day Breakfast",
    items: [
      { name: "Egg White Scramble", price: "₹280", macros: "P 32g · C 12g · F 8g" },
      { name: "Avocado Toast", price: "₹320", macros: "P 16g · C 38g · F 18g" },
      { name: "Protein Pancakes", price: "₹340", macros: "P 28g · C 44g · F 10g" },
    ],
  },
  {
    key: "bowls",
    label: "Salads & Rice Bowls",
    items: [
      { name: "Grilled Chicken Bowl", price: "₹420", macros: "P 42g · C 48g · F 12g" },
      { name: "Paneer Buddha Bowl", price: "₹380", macros: "P 28g · C 52g · F 16g" },
      { name: "Burrito Bowl", price: "₹400", macros: "P 32g · C 58g · F 14g" },
      { name: "Mediterranean Salad", price: "₹360", macros: "P 22g · C 28g · F 18g" },
    ],
  },
];

export function RebelCafe() {
  const [cat, setCat] = useState(MENU[0].key);
  const active = MENU.find((m) => m.key === cat)!;
  return (
    <section className="container mx-auto px-5 py-12 md:py-20">
      <Reveal>
        <div className="flex items-center gap-2">
          <Coffee className="w-4 h-4 text-primary" />
          <p className="rebel-label">Rebél Café</p>
        </div>
        <h2 className="rebel-hero-title text-3xl md:text-5xl font-black mt-2 leading-[1.05] max-w-2xl">
          Fuel that <span className="text-gradient-gold italic">matches the work.</span>
        </h2>
        <p className="text-sm text-muted-foreground mt-3 max-w-md">
          Macro-tagged meals, cold brew, and recovery shots — served at HSR Layout.
        </p>
      </Reveal>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {MENU.map((m) => (
          <button
            key={m.key}
            onClick={() => setCat(m.key)}
            className={cn(
              "rebel-pill shrink-0 text-xs md:text-sm px-4 py-2 rounded-full uppercase tracking-wider font-bold",
              cat === m.key && "rebel-pill-active",
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {active.items.map((i) => (
          <div key={i.name} className="rebel-card rounded-2xl p-4 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-black text-sm md:text-base">{i.name}</p>
              {i.macros && <p className="text-[11px] text-muted-foreground mt-1 font-mono">{i.macros}</p>}
            </div>
            <span className="font-black text-primary shrink-0">{i.price}</span>
          </div>
        ))}
      </div>

      <p className="text-[11px] text-muted-foreground mt-4">
        Add-ons: Oat milk +₹30 · Soy milk +₹30 · Monk fruit (free) · Extra protein scoop +₹80
      </p>
    </section>
  );
}
