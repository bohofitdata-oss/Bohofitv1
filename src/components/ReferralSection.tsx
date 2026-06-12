import { useState } from "react";
import { Gift, Copy, Check } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ReferralSection() {
  const [copied, setCopied] = useState(false);
  const code = "REBEL10";
  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Referral code copied");
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <section className="container mx-auto px-5 py-12 md:py-20">
      <Reveal>
        <div className="rebel-card rounded-3xl p-6 md:p-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-primary" />
              <p className="rebel-label">Make a Rebél</p>
            </div>
            <h2 className="rebel-hero-title text-3xl md:text-5xl font-black mt-2 leading-[1.05] max-w-2xl">
              Bring a friend. <span className="text-gradient-gold italic">Both win.</span>
            </h2>
            <p className="text-sm md:text-base text-muted-foreground mt-4 max-w-xl">
              Share your code or phone. Your friend gets <span className="text-foreground font-bold">10% off</span> any program. You get <span className="text-foreground font-bold">10% off</span> your next renewal — auto-applied.
            </p>

            <div className="mt-6 grid md:grid-cols-3 gap-3">
              <Tier label="Refer 1" perk="10% off renewal · 10% off for them" />
              <Tier label="Refer 2" perk="1 free Rebél Café meal + 10% off renewal" featured />
              <Tier label="Join together" perk="Both get 10% off — no code needed" />
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <div className="flex-1 rebel-card rounded-full px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Your code</p>
                  <p className="font-black text-lg tracking-wider">{code}</p>
                </div>
                <button onClick={copy} className="text-primary hover:text-primary-bright" aria-label="Copy code">
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
              <Button onClick={copy} className="rebel-btn rounded-full text-primary-foreground border-0 h-12 px-6">
                Share with a friend
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground mt-3">
              Friends can enter your code OR your phone/email at checkout. Discounts auto-apply.
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function Tier({ label, perk, featured }: { label: string; perk: string; featured?: boolean }) {
  return (
    <div className={`rebel-card rounded-2xl p-4 ${featured ? "border-primary/50" : ""}`}>
      <p className="rebel-label">{label}</p>
      <p className="mt-2 font-bold text-sm leading-snug">{perk}</p>
    </div>
  );
}
