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
    program: "Rebél Bootcamp · 8 weeks",
    result: "LOST 7.2 KG",
    quote:
      "I had given up after two pregnancies. The bootcamp adjusted things for my PCOS. I lost 7 kg without crash dieting.",
  },
  {
    name: "Anand R.",
    age: 41,
    program: "Rebél Strength · 6 months",
    result: "FIRST PULL-UP EVER",
    quote:
      "I joined to fix my back. Six months in I'm doing pull-ups and my BP medication is halved. Small batches, zero machines.",
  },
  {
    name: "Lakshmi V.",
    age: 62,
    program: "Rebél 50+ · 12 weeks",
    result: "STAIRS — PAIN-FREE",
    quote:
      "Knee pain stopped me from walking my dog. After 12 weeks of 1:1, I climb two flights without holding the railing.",
  },
];

export function Testimonials() {
  return (
    <section id="results" className="container mx-auto px-5 py-20 md:py-32">
      <Reveal>
        <div className="max-w-3xl">
          <p className="rebel-label">Social proof</p>
          <h2 className="rebel-hero-title text-3xl md:text-5xl lg:text-6xl font-black mt-3 leading-[1.05]">
            Inherited the legacy of Bohofit.
            <br />
            <span className="not-italic" style={{ fontStyle: "italic" }}>
              4 years and{" "}
              <span style={{ color: "#89010A" }}>2,000 people</span> later.
            </span>
          </h2>
        </div>
      </Reveal>

      <div className="mt-10 md:mt-14 grid md:grid-cols-3 gap-4 md:gap-5">
        {STORIES.map((s, i) => (
          <Reveal key={s.name} delay={i * 100}>
            <article className="rebel-card rounded-3xl p-6 h-full flex flex-col">
              <p
                className="font-black tracking-tight leading-none"
                style={{ color: "#FF2233", fontSize: "clamp(28px,5vw,40px)" }}
              >
                {s.result}
              </p>
              <div className="mt-4">
                <p className="font-black text-white text-base">
                  {s.name} · {s.age}
                </p>
                <p className="text-xs uppercase tracking-widest text-muted-strong mt-0.5">
                  {s.program}
                </p>
              </div>
              <p className="mt-4 text-sm leading-relaxed" style={{ color: "#CCCCCC" }}>
                &ldquo;{s.quote}&rdquo;
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
