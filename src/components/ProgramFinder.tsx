import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { ArrowRight, Compass, RefreshCw, Sparkles, Flame, Dumbbell, HeartPulse } from "lucide-react";
import { cn } from "@/lib/utils";

type Answers = {
  age?: "u30" | "30_50" | "50p";
  experience?: "never" | "gap" | "active" | "athlete";
  goal?: "lose_fast" | "fit_fast" | "habit" | "strength" | "all_round";
  injury?: "none" | "mild" | "serious";
};

type Recommendation = {
  key: "longevity" | "bootcamp" | "start" | "strength" | "boho_one";
  title: string;
  why: string;
  to: "/longevity" | "/bootcamp" | "/bohofit";
  icon: React.ComponentType<{ className?: string }>;
};

const RECS: Record<Recommendation["key"], Recommendation> = {
  longevity: { key: "longevity", title: "Bohofit at 50+", to: "/longevity", icon: HeartPulse, why: "Trainer-led, 1:1, machine-free — built specifically for the 50+ body." },
  bootcamp: { key: "bootcamp", title: "Boho Bootcamp · 8 weeks", to: "/bootcamp", icon: Flame, why: "You want fast, visible results. Guaranteed program, full accountability." },
  start: { key: "start", title: "Bohofit Start", to: "/bohofit", icon: Sparkles, why: "Safest re-entry to fitness. Yoga, Spin, Pilates, Zumba & beginner strength." },
  strength: { key: "strength", title: "Boho Strength", to: "/bohofit", icon: Dumbbell, why: "Calisthenics, S&C, Boxing & Weightlifting — built for serious strength." },
  boho_one: { key: "boho_one", title: "Boho One", to: "/bohofit", icon: Sparkles, why: "All 9 formats in one membership — strength, skills, cardio & flexibility." },
};

function recommend(a: Answers): Recommendation["key"] {
  if (a.injury === "serious") return "longevity";
  if (a.age === "50p") return "longevity";
  if (a.goal === "lose_fast" || a.goal === "fit_fast") return "bootcamp";
  if (a.experience === "never" || a.experience === "gap" || a.injury === "mild") return "start";
  if (a.goal === "strength") return "strength";
  if (a.goal === "all_round") return "boho_one";
  return "start";
}

const STEPS: { key: keyof Answers; q: string; opts: { v: string; label: string; hint?: string }[] }[] = [
  { key: "age", q: "What's your age bracket?", opts: [
    { v: "u30", label: "Under 30" },
    { v: "30_50", label: "30 – 50" },
    { v: "50p", label: "50 and above" },
  ]},
  { key: "experience", q: "How active have you been?", opts: [
    { v: "never", label: "Never really worked out" },
    { v: "gap", label: "Used to — long gap (2+ yrs)" },
    { v: "active", label: "Train on and off" },
    { v: "athlete", label: "Train consistently / athlete" },
  ]},
  { key: "injury", q: "Any injuries or pain right now?", opts: [
    { v: "none", label: "Nothing major" },
    { v: "mild", label: "Mild — knees, back, shoulder" },
    { v: "serious", label: "Serious / under doctor's care" },
  ]},
  { key: "goal", q: "What do you want most?", opts: [
    { v: "lose_fast", label: "Lose weight fast" },
    { v: "fit_fast", label: "Get visibly fit fast" },
    { v: "habit", label: "Build a long-term habit" },
    { v: "strength", label: "Pure strength / calisthenics" },
    { v: "all_round", label: "Strength + skills + cardio + flexibility" },
  ]},
];

export function ProgramFinder() {
  const [step, setStep] = useState(0);
  const [a, setA] = useState<Answers>({});
  const done = step >= STEPS.length;
  const rec = useMemo(() => (done ? RECS[recommend(a)] : null), [done, a]);

  function pick(k: keyof Answers, v: string) {
    setA((prev) => ({ ...prev, [k]: v as Answers[keyof Answers] }));
    setStep((s) => s + 1);
  }

  function reset() {
    setA({});
    setStep(0);
  }

  return (
    <section id="finder" className="container mx-auto px-5 py-12 md:py-20">
      <Reveal>
        <div className="text-center mb-6 md:mb-10">
          <p className="text-xs uppercase tracking-[0.18em] text-primary inline-flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5" /> Don&rsquo;t know where to start?
          </p>
          <h2 className="text-2xl md:text-4xl font-black mt-2">Answer 4 quick questions</h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
            We&rsquo;ll point you to the program built for where you are today.
          </p>
        </div>
      </Reveal>

      <Reveal delay={120}>
        <div className="max-w-2xl mx-auto rounded-2xl border border-border bg-card p-5 md:p-8">
          {!done ? (
            <>
              <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
                <span>Question {step + 1} / {STEPS.length}</span>
                <button onClick={reset} className="inline-flex items-center gap-1 hover:text-primary">
                  <RefreshCw className="w-3 h-3" /> Restart
                </button>
              </div>
              <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-gradient-gold transition-all" style={{ width: `${(step / STEPS.length) * 100}%` }} />
              </div>
              <h3 className="mt-5 text-lg md:text-xl font-black">{STEPS[step].q}</h3>
              <div className="mt-4 grid gap-2">
                {STEPS[step].opts.map((o) => (
                  <button
                    key={o.v}
                    onClick={() => pick(STEPS[step].key, o.v)}
                    className={cn(
                      "text-left rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold",
                      "hover:border-primary hover:-translate-y-0.5 transition",
                    )}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
              {step > 0 && (
                <button
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  className="mt-4 text-xs text-muted-foreground hover:text-primary"
                >
                  ← Back
                </button>
              )}
            </>
          ) : rec ? (
            <Result rec={rec} answers={a} onReset={reset} />
          ) : null}
        </div>
      </Reveal>
    </section>
  );
}

function Result({ rec, answers, onReset }: { rec: Recommendation; answers: Answers; onReset: () => void }) {
  const Icon = rec.icon;
  const is50 = answers.age === "50p" && rec.key === "longevity";
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-primary">Our recommendation</p>
      <div className="mt-3 flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center shrink-0">
          <Icon className="w-6 h-6 text-primary-foreground" />
        </div>
        <div className="min-w-0">
          <h3 className="text-xl md:text-2xl font-black leading-tight">{rec.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{rec.why}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Button asChild className="bg-gradient-gold text-primary-foreground border-0 hover:opacity-90">
          <Link to={rec.to}>Open {rec.title} <ArrowRight className="w-4 h-4 ml-1" /></Link>
        </Button>
        <Button variant="outline" onClick={onReset}>Re-take quiz</Button>
      </div>

      {is50 && (
        <div className="mt-6 rounded-xl border border-dashed border-border p-4">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Want to choose differently?</p>
          <p className="text-sm mt-1">Most people 50+ start here — but it&rsquo;s your call. Override:</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button asChild size="sm" variant="outline"><Link to="/bootcamp">Take Bootcamp instead</Link></Button>
            <Button asChild size="sm" variant="outline"><Link to="/bohofit">Group classes instead</Link></Button>
          </div>
        </div>
      )}

      <p className="mt-5 text-[11px] text-muted-foreground">
        Not sure? <Link to="/booking" className="text-primary font-semibold">Speak with us</Link> — we&rsquo;ll help you decide in 5 minutes.
      </p>
    </div>
  );
}
