import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";

type Slot = {
  id: string;
  start_time: string;
  capacity: number;
  confirmed_count: number;
  is_locked: boolean;
};

interface Props {
  program: "bootcamp" | "longevity";
  primaryId: string | null;
  secondaryId: string | null;
  onPrimary: (id: string) => void;
  onSecondary: (id: string | null) => void;
}

function fmtTime(t: string) {
  // t is "HH:MM:SS"
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hr = h % 12 === 0 ? 12 : h % 12;
  return `${hr}:${m.toString().padStart(2, "0")} ${period}`;
}

export function SlotPicker({ program, primaryId, secondaryId, onPrimary, onSecondary }: Props) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("slots")
        .select("id, start_time, capacity, confirmed_count, is_locked")
        .eq("program", program)
        .order("start_time");
      setSlots((data as Slot[]) ?? []);
      setLoading(false);
    })();
  }, [program]);

  if (loading) return <p className="text-sm text-muted-foreground">Loading slots…</p>;

  const renderGrid = (
    selectedId: string | null,
    onPick: (id: string) => void,
    isSecondary = false,
  ) => (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
      {slots.map((s) => {
        const sameAsOther = isSecondary ? s.id === primaryId : s.id === secondaryId;
        const disabled = s.is_locked || sameAsOther;
        const selected = selectedId === s.id;
        return (
          <button
            key={s.id}
            type="button"
            disabled={disabled}
            onClick={() => onPick(s.id)}
            className={cn(
              "rounded-xl border p-2.5 text-left transition-colors",
              selected
                ? "border-primary bg-primary/10"
                : disabled
                  ? "border-border/50 bg-muted/20 text-muted-foreground/60 cursor-not-allowed"
                  : "border-border bg-card hover:border-primary/60",
            )}
          >
            <div className="flex items-center justify-between text-sm font-bold">
              {fmtTime(s.start_time)}
              {s.is_locked && <Lock className="w-3 h-3" />}
            </div>
            <div className="text-[10px] uppercase tracking-widest mt-1 text-muted-foreground">
              {s.is_locked ? "Locked" : "Available"}
            </div>
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-baseline justify-between">
          <p className="text-sm font-semibold">Primary time *</p>
          <p className="text-xs text-muted-foreground">1 hour, Mon–Sat</p>
        </div>
        <div className="mt-2">{renderGrid(primaryId, onPrimary)}</div>
      </div>
      <div>
        <div className="flex items-baseline justify-between">
          <p className="text-sm font-semibold">Secondary time (optional)</p>
          <p className="text-xs text-muted-foreground">Backup if your primary fills</p>
        </div>
        <div className="mt-2">
          {renderGrid(secondaryId, (id) => onSecondary(id === secondaryId ? null : id), true)}
        </div>
      </div>
    </div>
  );
}
