import { Reveal } from "@/components/Reveal";

const IMGS = [
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&q=80",
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&q=80",
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&q=80",
  "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=900&q=80",
  "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=900&q=80",
  "https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=900&q=80",
];

export function RebelGallery() {
  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-5">
        <Reveal>
          <p className="rebel-label">Rebel in action</p>
        </Reveal>
      </div>
      <div className="mt-5 md:mt-7">
        {/* Mobile: horizontal scroll */}
        <div className="md:hidden flex gap-3 overflow-x-auto px-5 pb-3 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {IMGS.map((src, i) => (
            <div
              key={i}
              className="snap-center shrink-0 w-[68vw] aspect-[4/5] rounded-xl overflow-hidden relative group"
            >
              <img src={src} alt="" loading="lazy" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
        {/* Desktop: 3 column grid */}
        <div className="hidden md:grid container mx-auto px-5 grid-cols-3 gap-4">
          {IMGS.map((src, i) => (
            <div
              key={i}
              className="aspect-[4/5] rounded-xl overflow-hidden relative group border border-transparent hover:border-primary/60 transition-all duration-300"
            >
              <img
                src={src}
                alt=""
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
