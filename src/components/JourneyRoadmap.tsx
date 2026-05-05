import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/Reveal";
import { Sparkles, Flame, Dumbbell, ArrowRight, Repeat } from "lucide-react";

export function JourneyRoadmap() {
  return (
    <section className="container mx-auto px-5 py-12 md:py-20">
      <Reveal>
        <div className="text-center mb-8 md:mb-12">
          <p className="text-xs uppercase tracking-[0.18em] text-primary">Your journey</p>
          <h2 className="text-2xl md:text-4xl font-black mt-2">Two ways to get there</h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-xl mx-auto">
            Quick visible results — or a gradual, gentler entry. Both lead to the same place: a body you keep for life.
          </p>
        </div>
      </Reveal>

      <div className="grid md:grid-cols-2 gap-5">
        {/* PATH A — quick */}
        <Reveal>
          <div className="relative rounded-2xl border border-border bg-card p-5 md:p-6 h-full">
            <span className="absolute -top-2.5 left-5 text-[10px] uppercase tracking-widest bg-gradient-gold text-primary-foreground px-2 py-0.5 rounded-full font-semibold">
              Path A · Fast
            </span>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mt-2">Get visible results, then stay regular</p>

            <div className="mt-5 grid grid-cols-[auto_1fr] gap-x-4 gap-y-4">
              <Step n={1} icon={Flame} />
              <StepBody
                title="Boho Bootcamp · 8 weeks"
                desc="Guaranteed transformation. Daily training, food log, coach-led."
                to="/bootcamp"
                cta="Start the bootcamp"
              />
              <Connector />
              <span />
              <Step n={2} icon={Dumbbell} />
              <StepBody
                title="Boho Strength · ongoing"
                desc="Stay strong for life. Calisthenics, S&C, boxing, lifting."
                to="/bohofit"
                cta="Continue with Strength"
              />
            </div>
          </div>
        </Reveal>

        {/* PATH B — gradual */}
        <Reveal delay={120}>
          <div className="relative rounded-2xl border border-border bg-card p-5 md:p-6 h-full">
            <span className="absolute -top-2.5 left-5 text-[10px] uppercase tracking-widest border border-border bg-card px-2 py-0.5 rounded-full font-semibold text-foreground">
              Path B · Gradual
            </span>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mt-2">Get used to training, then go full strength</p>

            <div className="mt-5 grid grid-cols-[auto_1fr] gap-x-4 gap-y-4">
              <Step n={1} icon={Sparkles} />
              <StepBody
                title="Boho Start"
                desc="Yoga, Spin, Mat Pilates, Zumba, Beginner Strength. Easy entry."
                to="/bohofit"
                cta="Begin with Start"
              />
              <Connector />
              <span />
              <Step n={2} icon={Dumbbell} />
              <StepBody
                title="Boho Strength · ongoing"
                desc="Move up when you're ready. Same studio, same coaches."
                to="/bohofit"
                cta="Step up to Strength"
              />
            </div>
          </div>
        </Reveal>
      </div>

      <Reveal delay={200}>
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Repeat className="w-3.5 h-3.5 text-primary" />
          One membership in the Bohofit Unlimited tier covers both Start & Strength.
        </div>
      </Reveal>
    </section>
  );
}

function Step({ n, icon: Icon }: { n: number; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="relative">
      <div className="w-10 h-10 rounded-lg bg-gradient-gold flex items-center justify-center">
        <Icon className="w-5 h-5 text-primary-foreground" />
      </div>
      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-background border border-border text-[10px] font-bold flex items-center justify-center">
        {n}
      </span>
    </div>
  );
}

function StepBody({ title, desc, to, cta }: { title: string; desc: string; to: "/bohofit" | "/bootcamp" | "/longevity"; cta: string }) {
  return (
    <div>
      <h3 className="font-black text-base md:text-lg leading-tight">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1">{desc}</p>
      <Link to={to} className="mt-2 inline-flex items-center text-xs font-semibold text-primary">
        {cta} <ArrowRight className="w-3.5 h-3.5 ml-1" />
      </Link>
    </div>
  );
}

function Connector() {
  return <div className="mx-auto w-px h-6 bg-border" />;
}
