import { Link } from "@tanstack/react-router";
import { HeartPulse, ArrowRight, Check, Users } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";

export function FiftyPlusFeature() {
  return (
    <section className="container mx-auto px-5 py-16 md:py-20">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border hairline bg-card p-6 md:p-12">
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-gradient-gold opacity-10 blur-3xl pointer-events-none" />
          <div className="grid md:grid-cols-5 gap-8 items-center relative">
            <div className="md:col-span-3">
              <div className="inline-flex items-center gap-2 text-[10px] md:text-xs uppercase tracking-[0.18em] text-primary border border-primary/40 rounded-full px-3 py-1">
                <HeartPulse className="w-3 h-3" /> Our flagship 1:1 program
              </div>
              <h2 className="mt-4 text-3xl md:text-5xl font-black tracking-tight leading-[1.05]">
                Rebel at <span className="text-gradient-gold">50+</span>
              </h2>
              <p className="mt-3 text-muted-foreground md:text-lg max-w-xl">
                Twelve weeks of fully personal training, designed for adults 50 and above.
                Trainer-prescribed, machine-free, joint-friendly. Enroll only after an in-person assessment.
              </p>
              <ul className="mt-6 grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                {[
                  "True 1:1 — one coach, one client",
                  "Mon–Sat, hour you choose",
                  "Built around your medical history",
                  "Family Connect — share progress with loved ones",
                ].map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" /> {b}
                  </li>
                ))}
              </ul>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Button asChild size="lg" className="bg-gradient-gold text-primary-foreground border-0 hover:opacity-90">
                  <Link to="/longevity">
                    Book a free 30-min consult <ArrowRight className="ml-1 w-4 h-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/booking">Speak with us first</Link>
                </Button>
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="rounded-2xl border border-border bg-background/40 p-6">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">12-week program</p>
                <div className="mt-2 text-5xl font-black text-gradient-gold">₹29,999</div>
                <p className="text-xs text-muted-foreground mt-1">All inclusive · GST included</p>
                <div className="mt-5 space-y-3 text-sm">
                  <div className="flex items-center justify-between border-t border-border/60 pt-3">
                    <span className="text-muted-foreground">Sessions</span>
                    <span className="font-semibold">24 × 1:1</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-border/60 pt-3">
                    <span className="text-muted-foreground">Coach ratio</span>
                    <span className="font-semibold">1 : 1</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-border/60 pt-3">
                    <span className="text-muted-foreground">Setting</span>
                    <span className="font-semibold">Studio · Online · Home</span>
                  </div>
                </div>
                <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
                  <Users className="w-3.5 h-3.5 text-primary" /> Limited 1:1 slots per coach.
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
