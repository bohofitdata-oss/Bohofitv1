import { PEOPLE_TRAINED } from "@/lib/site-facts";
import { Reveal } from "@/components/Reveal";

type Story = {
  name: string;
  age: number;
  program: string;
  result: string;
  quote: string;
};

const STORIES: Story[] = [
  {
    name: "Priya M.",
    age: 34,
    program: "UnPause | 1:1",
    result: "LOST 7.2 KG",
    quote:
      "UnPause adjusted things for my PCOS. I lost 7 kg without crash dieting.",
  },
  {
    name: "Anand R.",
    age: 41,
    program: "Level 2 STRENGTH | 6 months",
    result: "FIRST PULL-UP EVER",
    quote:
      "Six months in, I’m doing pull-ups. Small batches, zero machines.",
  },
  {
    name: "Lakshmi V.",
    age: 62,
    program: "50+ by REBÉL | 12 weeks",
    result: "STAIRS — PAIN-FREE",
    quote:
      "Knee pain stopped my walks. Now I climb two flights without holding the railing.",
  },
];

export function Testimonials() {
  return (
    <section id="results" className="container mx-auto px-5 md:px-8 editorial-section">
      <Reveal>
        <div className="max-w-3xl">
          <p className="rebel-label">Social proof</p>
          <h2 className="editorial-title mt-5">A legacy of strength.</h2>
          <p className="text-muted-foreground text-sm mt-6">{PEOPLE_TRAINED}.</p>
          <p className="rebel-label mt-3">Since Bohofit</p>
        </div>
      </Reveal>

      <div className="mt-10 md:mt-14 grid md:grid-cols-3 gap-4 md:gap-5">
        {STORIES.map((s, i) => (
          <Reveal key={s.name} delay={i * 100}>
            <article className="rebel-card rounded-lg p-6 h-full flex flex-col">
              <p
                className="font-display text-xl text-foreground leading-snug"
                
              >
                {s.result}
              </p>
              <div className="mt-4">
                <p className="font-black text-foreground text-base">
                  {s.name} · {s.age}
                </p>
                <p className="text-xs uppercase tracking-widest text-muted-strong mt-0.5">
                  {s.program}
                </p>
              </div>
              <p className="mt-4 text-sm leading-relaxed" >
                &ldquo;{s.quote}&rdquo;
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
