import { Link } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { ArrowLeftRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
type ProgramKey = "unpause" | "fifty_plus" | "group_classes";
const PROGRAMS = [
  { key: "unpause", to: "/longevity" as const, name: "UnPause", tag: "1:1 | Perimenopause & menopause" },
  { key: "fifty_plus", to: "/fiftyplus" as const, name: "50+ by REBÉL", tag: "1:1 | Joints, mobility, balance" },
  { key: "group_classes", to: "/bohofit" as const, name: "Group Classes", tag: "Levels 1–3" },
];
export function ProgramSwitcher({ current }: { current?: ProgramKey }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { const close = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); }; const escape = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); }; document.addEventListener("mousedown", close); document.addEventListener("keydown", escape); return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", escape); }; }, []);
  return <div className="relative inline-block" ref={ref}><Button variant="outline" size="icon" className="rounded-full" onClick={() => setOpen(v => !v)} aria-label="Choose program" title="Choose program" aria-expanded={open}><ArrowLeftRight /></Button>{open && <div className="absolute left-1/2 -translate-x-1/2 z-[100] mt-3 w-72 max-w-[calc(100vw-2rem)] rounded-lg border border-border bg-popover p-2">{PROGRAMS.map(p => <Link key={p.key} to={p.to} onClick={() => setOpen(false)} className="flex gap-3 rounded-md px-3 py-4 hover:bg-secondary"><span className="flex-1"><span className="block text-sm font-medium text-foreground">{p.name}</span><span className="block text-xs text-muted-foreground mt-2">{p.tag}</span></span>{p.key === current && <Check className="size-4 text-storefront" />}</Link>)}</div>}</div>;
}
