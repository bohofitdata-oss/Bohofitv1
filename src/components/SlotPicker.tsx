import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";

type Slot = {
  slot_id: string;
  start_time: string;
  capacity: number;
  booked: number;
  remaining: number;
  is_locked: boolean;
};

interface Props {
  program: "bootcamp" | "longevity" | "group_classes";
  primaryId: string | null;
  secondaryId: string | null;
  onPrimary: (id: string) => void;
  onSecondary: (id: string | null) => void;
}

function fmtTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hr = h % 12 === 0 ? 12 : h % 12;
  return `${hr}:${m.toString().padStart(2, "0")} ${period}`;
}

export function SlotPicker({ program, primaryId, secondaryId, onPrimary, onSecondary }: Props) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data, error } = await supabase.rpc("program_slot_availability", { _program: program });
    if (!error && data) setSlots(data as Slot[]);
    setLoading(false);
  }, [program]);

  useEffect(() => {
    setLoading(true);
    load();
    const id = setInterval(load, 30_000);
    return () => clearInterval(id);
  }, [load]);

  if (loading) return <p className="text-sm text-muted-foreground">Loading slots…</p>;
  if (!slots.length) return <p className="text-sm text-muted-foreground">No slots available right now.</p>;

  const renderGrid = (
    selectedId: string | null,
    onPick: (id: string) => void,
    isSecondary = false,
  ) => (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
      {slots.map((s) => {
        const sameAsOther = isSecondary ? s.slot_id === primaryId : s.slot_id === secondaryId;
        const locked = s.is_locked || s.remaining <= 0;
        const disabled = locked || sameAsOther;
        const selected = selectedId === s.slot_id;
        return (
          <button
            key={s.slot_id}
            type="button"
            disabled={disabled}
            onClick={() => onPick(s.slot_id)}
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
              {locked && <Lock className="w-3 h-3" />}
            </div>
            <div className="text-[10px] uppercase tracking-widest mt-1 text-muted-foreground">
              {locked ? "Locked" : `Available · ${s.remaining} left`}
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
          <p className="text-xs text-muted-foreground">Updates every 30s</p>
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
