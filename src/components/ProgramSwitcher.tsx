import { Link } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { ArrowLeftRight, Check } from "lucide-react";

type ProgramKey = "unpause" | "fifty_plus" | "group_classes";

const PROGRAMS: { key: ProgramKey; to: "/longevity" | "/fiftyplus" | "/bohofit"; name: string; tag: string }[] = [
  { key: "unpause", to: "/longevity", name: "Rebél Unpause", tag: "1:1 · Perimenopause & menopause" },
  { key: "fifty_plus", to: "/fiftyplus", name: "Rebél at 50+", tag: "1:1 · Joints, mobility, recovery" },
  { key: "group_classes", to: "/bohofit", name: "Group Classes", tag: "Level 1 · Level 2 · Level 3" },
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
        className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white hover:border-white/30 transition-colors"
      >
        <ArrowLeftRight className="w-4 h-4" style={{ color: "#FF2233" }} /> Change Program
      </button>
      {open && (
        <div
          className="absolute left-1/2 -translate-x-1/2 z-[100] mt-2 w-80 rounded-xl border border-white/10 shadow-elegant p-1.5"
          style={{ background: "#0a0a0a" }}
        >
          {PROGRAMS.map((p) => {
            const active = p.key === current;
            return (
              <Link
                key={p.key}
                to={p.to}
                onClick={() => setOpen(false)}
                className={`flex items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                  active ? "bg-white/[0.06]" : "hover:bg-white/[0.04]"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-white">{p.name}</div>
                  <div className="text-xs" style={{ color: "#CCCCCC" }}>{p.tag}</div>
                </div>
                {active && <Check className="w-4 h-4 mt-1" style={{ color: "#FF2233" }} />}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
