import { useState } from "react";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const LOCATIONS = [
  { key: "hsr", label: "HSR Layout", status: "Open now", live: true },
  { key: "wf", label: "Whitefield", status: "Coming soon", live: false },
  { key: "ind", label: "Indiranagar", status: "Coming soon", live: false },
] as const;

export function LocationBanner() {
  const [active, setActive] = useState<string>("hsr");
  const current = LOCATIONS.find((l) => l.key === active)!;
  return (
    <div className="container mx-auto px-5 pt-4">
      <div className="rebel-card rounded-2xl p-3 md:p-4 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Your centre</span>
        </div>
        <div className="flex flex-wrap gap-1.5 flex-1">
          {LOCATIONS.map((l) => (
            <button
              key={l.key}
              onClick={() => setActive(l.key)}
              className={cn(
                "rebel-pill text-[11px] md:text-xs px-3 py-1.5 rounded-full",
                active === l.key && "rebel-pill-active",
                !l.live && "opacity-60",
              )}
            >
              {l.label}
              {!l.live && <span className="ml-1 text-[9px] uppercase">· soon</span>}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground sm:ml-auto">
          {current.live ? `${current.label} · ${current.status}` : `${current.label} — join waitlist`}
        </p>
      </div>
    </div>
  );
}
