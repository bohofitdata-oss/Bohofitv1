import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export type GeneralTerm = { key: string; title: string; full: string };

export const GENERAL_FITNESS_TERMS: GeneralTerm[] = [
  {
    key: "responsibility",
    title: "I am responsible for my own training & body.",
    full: "I understand that physical training carries risks. I take full responsibility for how I train, push myself, and recover. Rebel and its trainers are not liable for any injury that occurs because I ignored instructions, hid information, or trained beyond what was prescribed.",
  },
  {
    key: "medical_clearance",
    title: "I have shared all medical conditions honestly.",
    full: "I have disclosed any pre-existing medical condition (heart, BP, diabetes, thyroid, PCOS, surgeries, pregnancy, joint pain, injuries, mental health, medication). If my doctor has restricted certain movements, I have informed Rebel in writing. If anything changes during my membership, I will inform my coach immediately.",
  },
  {
    key: "injury_risk",
    title: "I understand fitness training carries risk of injury.",
    full: "Even with the best coaching, injuries can occur. By participating, I accept this risk. I agree not to hold Rebel, its trainers, or its centre liable for any injury that may occur during training, except in cases of proven gross negligence by Rebel staff.",
  },
  {
    key: "follow_instructions",
    title: "I will follow my coach's instructions.",
    full: "I will not use equipment, attempt advanced movements, or modify my workout without coach approval. Wandering around the floor, mocking, distracting other members, or using my phone during sessions is not allowed.",
  },
  {
    key: "attendance",
    title: "I will be on time and attend regularly.",
    full: "Sessions start on time. Late entry beyond 10 minutes may not be allowed for safety (no warm-up = injury). Repeated no-shows without information may pause my access. My membership timeline runs from start date — missed days are not auto-refunded.",
  },
  {
    key: "hygiene",
    title: "I will maintain hygiene & dress code.",
    full: "I will wear clean training clothes and proper shoes. I will carry a personal towel and water bottle. I will not train under the influence of alcohol or recreational drugs. I will respect shared mats and equipment.",
  },
  {
    key: "code_of_conduct",
    title: "I will respect coaches and other members.",
    full: "Rebel is a zero-tolerance space for harassment, body-shaming, casteist, religious, or sexist remarks. Any such behaviour will result in immediate termination of membership without refund.",
  },
  {
    key: "media",
    title: "Photo / video on the floor.",
    full: "Rebel may occasionally photograph / film classes for marketing. If I do not want to be featured, I will tell the coach in writing and we will exclude me. I will not film other members without consent.",
  },
  {
    key: "payment",
    title: "Payment, refund & transfer policy.",
    full: "All fees are GST inclusive. Refunds are not provided once the program starts, except where Rebel is unable to deliver. Transfers (where allowed) carry an ERP fee of ₹599. Pause balance is fixed per plan and cannot be carried over.",
  },
  {
    key: "data_privacy",
    title: "Data & privacy.",
    full: "My information (medical, photos, food log, progress) is stored securely and used only by my coaching team to deliver my program. It will never be sold or shared without my consent.",
  },
  {
    key: "contact_consent",
    title: "I agree to be contacted by Rebel.",
    full: "Rebel may reach me on call, WhatsApp or email regarding my program, schedule, payments and important updates. I can opt out of marketing messages at any time.",
  },
];

export function GeneralFitnessTerms({
  checked,
  onChange,
  title = "Terms & Conditions",
  subtitle = "Tick every box. Tap a rule to read the full version.",
}: {
  checked: Record<string, boolean>;
  onChange: (next: Record<string, boolean>) => void;
  title?: string;
  subtitle?: string;
}) {
  const [open, setOpen] = useState<Record<string, boolean>>({});

  return (
    <div className="rounded-2xl border border-border bg-card p-5 md:p-6">
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-black">{title}</h3>
      </div>
      <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>

      <div className="mt-4 space-y-2">
        {GENERAL_FITNESS_TERMS.map((t) => {
          const isChecked = !!checked[t.key];
          const isOpen = !!open[t.key];
          return (
            <div
              key={t.key}
              id={`term-${t.key}`}
              className={cn(
                "rounded-xl border transition scroll-mt-24",
                isChecked ? "border-primary bg-primary/5" : "border-border",
              )}
            >
              <div className="flex items-start gap-3 p-3.5">
                <Checkbox
                  className="mt-0.5"
                  checked={isChecked}
                  onCheckedChange={(v) => onChange({ ...checked, [t.key]: !!v })}
                />
                <button
                  type="button"
                  onClick={() => setOpen({ ...open, [t.key]: !isOpen })}
                  className="flex-1 text-left"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-semibold leading-snug">{t.title}</span>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 text-muted-foreground shrink-0 mt-0.5 transition-transform",
                        isOpen && "rotate-180",
                      )}
                    />
                  </div>
                  <span className="block mt-1 text-[11px] uppercase tracking-widest text-primary">
                    {isOpen ? "Hide" : "Read more"}
                  </span>
                  {isOpen && (
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t.full}</p>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function allGeneralTermsAccepted(checked: Record<string, boolean>) {
  return GENERAL_FITNESS_TERMS.every((t) => checked[t.key]);
}

export function firstUncheckedTermKey(checked: Record<string, boolean>) {
  return GENERAL_FITNESS_TERMS.find((t) => !checked[t.key])?.key ?? null;
}

export function scrollToFirstUncheckedTerm(checked: Record<string, boolean>) {
  const key = firstUncheckedTermKey(checked);
  if (!key) return;
  const el = document.getElementById(`term-${key}`);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.add("ring-2", "ring-primary");
    setTimeout(() => el.classList.remove("ring-2", "ring-primary"), 1600);
  }
}
