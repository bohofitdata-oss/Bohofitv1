import { useLang } from "@/i18n/useLang";
import { cn } from "@/lib/utils";
import { Shield, Activity, Stethoscope, Check } from "lucide-react";

export type TierKey = "preventive" | "corrective" | "critical";

export const TIER_PRICE_INR: Record<TierKey, number> = {
  preventive: 14999,
  corrective: 22999,
  critical: 39999,
};

const TIERS: { key: TierKey; icon: React.ComponentType<{ className?: string }>; recommended?: boolean }[] = [
  { key: "preventive", icon: Shield },
  { key: "corrective", icon: Activity, recommended: true },
  { key: "critical", icon: Stethoscope },
];

interface Props {
  selected: TierKey | null;
  onSelect: (t: TierKey) => void;
  recommended?: TierKey;
}

export function TierPicker({ selected, onSelect, recommended }: Props) {
  const { t } = useLang();
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {TIERS.map(({ key, icon: Icon }) => {
        const isSelected = selected === key;
        const isRecommended = recommended === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onSelect(key)}
            className={cn(
              "text-left rounded-2xl border bg-card p-5 transition-all",
              isSelected
                ? "border-primary bg-primary/5 ring-2 ring-primary"
                : "border-border hover:border-primary/60",
            )}
          >
            <div className="flex items-start justify-between">
              <Icon className="w-6 h-6 text-primary" />
              {isRecommended && (
                <span className="rounded-full bg-gradient-gold px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                  {t("tiers.most_popular")}
                </span>
              )}
            </div>
            <h3 className="mt-3 text-lg font-black">{t(`tiers.${key}.name`)}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{t(`tiers.${key}.for`)}</p>
            <p className="mt-3 text-sm leading-relaxed">{t(`tiers.${key}.includes`)}</p>
            <p className="mt-4 text-base font-bold text-primary">{t(`tiers.${key}.price`)}</p>
            {isSelected && (
              <p className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                <Check className="w-3.5 h-3.5" /> Selected
              </p>
            )}
          </button>
        );
      })}
    </div>
  );
}
