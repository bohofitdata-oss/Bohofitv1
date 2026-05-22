import { Link } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { ArrowLeftRight, Check } from "lucide-react";

type ProgramKey = "bohofit" | "bootcamp" | "longevity";

const PROGRAMS: { key: ProgramKey; to: "/bohofit" | "/bootcamp" | "/longevity"; name: string; tag: string }[] = [
  { key: "bohofit", to: "/bohofit", name: "Rebel Group Classes", tag: "Start · Strength · Unlimited" },
  { key: "bootcamp", to: "/bootcamp", name: "Rebel Bootcamp", tag: "8-week guaranteed" },
  { key: "longevity", to: "/longevity", name: "Rebel at 50+", tag: "Personal 1:1" },
];

export function ProgramSwitcher({ current }: { current?: ProgramKey }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold hover:border-primary transition-colors"
      >
        <ArrowLeftRight className="w-4 h-4 text-primary" /> Change Program
      </button>
      {open && (
        <div className="absolute z-30 mt-2 w-72 rounded-xl border border-border bg-card shadow-elegant p-1.5">
          {PROGRAMS.map((p) => {
            const active = p.key === current;
            return (
              <Link
                key={p.key}
                to={p.to}
                onClick={() => setOpen(false)}
                className={`flex items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                  active ? "bg-primary/10" : "hover:bg-muted"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold">{p.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{p.tag}</div>
                </div>
                {active && <Check className="w-4 h-4 text-primary mt-1" />}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
