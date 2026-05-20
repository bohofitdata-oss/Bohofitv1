import { LANGS } from "@/i18n/longevity";
import { useLang } from "@/i18n/useLang";
import { cn } from "@/lib/utils";
import { Languages } from "lucide-react";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { lang, setLang, t } = useLang();
  return (
    <div className={cn("inline-flex items-center gap-2 flex-wrap", className)}>
      <span className="inline-flex items-center gap-1 text-xs uppercase tracking-widest text-muted-foreground">
        <Languages className="w-3.5 h-3.5" /> {t("lang.label")}
      </span>
      <div className="inline-flex flex-wrap gap-1.5">
        {LANGS.map((l) => (
          <button
            key={l.code}
            type="button"
            onClick={() => setLang(l.code)}
            className={cn(
              "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
              lang === l.code
                ? "border-primary bg-primary/15 text-primary"
                : "border-border bg-card hover:border-primary/60",
            )}
            aria-pressed={lang === l.code}
          >
            {l.native}
          </button>
        ))}
      </div>
    </div>
  );
}
