import { useLang } from "@/i18n/useLang";
import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";
import { waLink, BOHOFIT_WHATSAPP } from "@/lib/whatsapp";

export function GiftForParentCTA() {
  const { t } = useLang();
  return (
    <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent p-6">
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-primary/20 p-2.5">
          <Gift className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-xs uppercase tracking-widest text-primary">{t("family.eyebrow")}</p>
          <h3 className="mt-1 text-xl md:text-2xl font-black">{t("family.gift_t")}</h3>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t("family.gift_d")}</p>
          <Button
            asChild
            className="mt-4 bg-gradient-gold text-primary-foreground border-0 hover:opacity-90"
          >
            <a
              href={waLink(
                BOHOFIT_WHATSAPP,
                "Hi Rebel, I want to gift the 12-week Rebel at 50+ program to my parent. Please share next steps.",
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Gift className="w-4 h-4 mr-2" /> {t("family.gift_cta")}
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
