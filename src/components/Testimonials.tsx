import { Quote, Star } from "lucide-react";
import { Reveal } from "@/components/Reveal";

type Story = {
  name: string;
  age: number;
  program: string;
  result: string;
  quote: string;
  duration: string;
};

const STORIES: Story[] = [
  {
    name: "Priya M.",
    age: 34,
    program: "Boho Bootcamp",
    duration: "8 weeks",
    result: "Lost 7.2 kg · PCOS markers improved",
    quote:
      "I had given up on losing weight after two pregnancies. The bootcamp was the first time a coach actually adjusted things for my PCOS. I lost 7 kg without crash dieting.",
  },
  {
    name: "Anand R.",
    age: 41,
    program: "Boho Strength",
    duration: "6 months",
    result: "First-ever pull-up · BP back to normal",
    quote:
      "I joined wanting to fix my back. Six months in, I'm doing pull-ups and my BP medication has been halved. Small batches and zero machines made it click.",
  },
  {
    name: "Lakshmi V.",
    age: 62,
    program: "Bohofit at 50+",
    duration: "12 weeks",
    result: "Climbing stairs pain-free · sleeping through the night",
    quote:
      "Knee pain stopped me from walking my dog. After 12 weeks of 1:1 with my coach, I climb two flights of stairs without holding the railing. My family can see the change.",
  },
];

const STATS = [
  { n: "500+", l: "Members trained" },
  { n: "92%", l: "Renew or upgrade" },
  { n: "4.9★", l: "Average rating" },
  { n: "0", l: "Machines used" },
];

export function Testimonials() {
  return (
    <section id="results" className="container mx-auto px-5 py-16 md:py-24">
      <Reveal>
        <div className="text-center mb-10 md:mb-14">
          <p className="text-xs uppercase tracking-[0.18em] text-primary">Real members · Real results</p>
          <h2 className="text-3xl md:text-4xl font-black mt-2">Does this actually work?</h2>
          <p className="text-muted-foreground mt-2 text-sm md:text-base max-w-xl mx-auto">
            Three short stories from current Bohofit members. We&rsquo;ll connect you with any of them on request.
          </p>
        </div>
      </Reveal>

      <div className="grid md:grid-cols-3 gap-4 md:gap-5">
        {STORIES.map((s, i) => (
          <Reveal key={s.name} delay={i * 100}>
            <article className="rounded-2xl border border-border bg-card p-6 h-full flex flex-col">
              <div className="flex items-center gap-1 text-primary">
                {Array.from({ length: 5 }).map((_, k) => (
                  <Star key={k} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <Quote className="w-5 h-5 text-primary mt-4" />
              <p className="mt-2 text-sm md:text-base leading-relaxed text-foreground/90">
                &ldquo;{s.quote}&rdquo;
              </p>
              <div className="mt-5 pt-4 border-t border-border/60">
                <div className="font-bold">{s.name} · {s.age}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{s.program} · {s.duration}</div>
                <div className="mt-2 inline-block text-[11px] uppercase tracking-widest text-primary font-semibold">
                  {s.result}
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {STATS.map((s) => (
            <div key={s.l} className="rounded-xl border border-border bg-card p-4 text-center">
              <div className="text-2xl md:text-3xl font-black text-gradient-gold">{s.n}</div>
              <div className="text-[10px] md:text-xs uppercase tracking-widest text-muted-foreground mt-1">
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
