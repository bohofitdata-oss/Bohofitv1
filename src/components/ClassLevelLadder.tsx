import type { ClassLevel } from "@/lib/group-plans";
import { cn } from "@/lib/utils";

export function ClassLevelLadder({ active }: { active: ClassLevel }) {
  return <svg viewBox="0 0 700 230" className="w-full max-w-2xl mx-auto" role="img" aria-labelledby="level-ladder-title"><title id="level-ladder-title">START rises to STRENGTH. REBEL UNLIMITED spans both levels.</title>
    <path d="M115 150 H300 V112 H575" fill="none" className="text-muted-foreground" stroke="currentColor" strokeWidth="1" />
    <g className={cn("ladder-step",active === "start" ? "is-active text-primary" : "text-muted-foreground")}><path d="M115 150 V125 H285" fill="none" stroke="currentColor" strokeWidth="3" /><text x="195" y="180" textAnchor="middle" fill="currentColor">START<tspan fontSize="9" baselineShift="super">™</tspan></text></g>
    <g className={cn("ladder-step",active === "strength" ? "is-active text-primary" : "text-muted-foreground")}><path d="M340 112 V87 H575" fill="none" stroke="currentColor" strokeWidth="3" /><text x="455" y="142" textAnchor="middle" fill="currentColor">STRENGTH<tspan fontSize="9" baselineShift="super">™</tspan></text></g>
    <g className={cn("ladder-step text-primary",active === "unlimited" && "is-active")}><path d="M105 75 V49 H595 V75" fill="none" stroke="currentColor" strokeWidth="1.5" /><text x="350" y="32" textAnchor="middle" fill="currentColor">REBEL UNLIMITED<tspan fontSize="9" baselineShift="super">™</tspan></text></g>
  </svg>;
}