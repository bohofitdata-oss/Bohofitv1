import { useLang } from "@/i18n/useLang";
import { cn } from "@/lib/utils";

export const CONDITION_KEYS = [
  "knee", "back", "diabetes", "bp", "chol", "osteo",
  "sarco", "balance", "post_surgery", "shoulder", "thyroid", "heart", "none",
] as const;
export type ConditionKey = typeof CONDITION_KEYS[number];

// Condition -> recommended tier
const TIER_MAP: Record<ConditionKey, "preventive" | "corrective" | "critical"> = {
  knee: "corrective",
  back: "corrective",
  diabetes: "corrective",
  bp: "corrective",
  chol: "corrective",
  osteo: "corrective",
  sarco: "corrective",
  balance: "corrective",
  post_surgery: "critical",
  shoulder: "corrective",
  thyroid: "preventive",
  heart: "critical",
  none: "preventive",
};

export function recommendTier(selected: ConditionKey[]): "preventive" | "corrective" | "critical" {
  if (selected.length === 0) return "preventive";
  if (selected.some((c) => TIER_MAP[c] === "critical")) return "critical";
  if (selected.some((c) => TIER_MAP[c] === "corrective")) return "corrective";
  return "preventive";
}

interface Props {
  selected: ConditionKey[];
  onChange: (next: ConditionKey[]) => void;
}

export function ConditionChips({ selected, onChange }: Props) {
  const { t } = useLang();
  const toggle = (k: ConditionKey) => {
    if (k === "none") return onChange(selected.includes("none") ? [] : ["none"]);
    const next = selected.includes(k)
      ? selected.filter((x) => x !== k)
      : [...selected.filter((x) => x !== "none"), k];
    onChange(next);
  };
  return (
    <div className="flex flex-wrap gap-2">
      {CONDITION_KEYS.map((k) => {
        const on = selected.includes(k);
        return (
          <button
            key={k}
            type="button"
            onClick={() => toggle(k)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
              on
                ? "border-primary bg-primary/15 text-primary"
                : "border-border bg-card hover:border-primary/60",
            )}
            aria-pressed={on}
          >
            {t(`conditions.${k}`)}
          </button>
        );
      })}
    </div>
  );
}
