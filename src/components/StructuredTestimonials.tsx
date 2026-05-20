import { useLang } from "@/i18n/useLang";
import { ArrowRight } from "lucide-react";

const KEYS = ["t1", "t2", "t3"] as const;

export function StructuredTestimonials() {
  const { t } = useLang();
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {KEYS.map((k) => (
        <div key={k} className="rounded-2xl border border-border bg-card p-5">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            {t(`stories.${k}_metric`)}
          </p>
          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-3xl font-black text-muted-foreground/60 line-through">
              {t(`stories.${k}_from`)}
            </span>
            <ArrowRight className="w-5 h-5 text-primary" />
            <span className="text-3xl font-black text-gradient-gold">
              {t(`stories.${k}_to`)}
            </span>
          </div>
          <p className="mt-3 text-sm font-semibold">{t(`stories.${k}_name`)}</p>
          <p className="text-xs text-muted-foreground">{t(`stories.${k}_weeks`)}</p>
        </div>
      ))}
    </div>
  );
}
