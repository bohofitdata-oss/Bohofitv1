import { Link } from "@tanstack/react-router";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TM } from "@/components/TM";
import imgStart from "@/assets/program-start.jpg";
import imgFifty from "@/assets/program-fiftyplus.jpg";
import imgFiftyNeutral from "@/assets/program-fiftyplus-neutral.jpg";
const SLIDES = [
  { id: "group-classes", title: "Group Classes", label: "LEVELS 1–3", tagline: "Start. Strength. REBEL UNLIMITED.", image: imgStart, to: "/bohofit" as const },
  { id: "unpause", title: "UnPause", label: "1:1 | PERIMENOPAUSE & MENOPAUSE", tagline: "Strength through the change.", image: imgFifty, to: "/longevity" as const },
  { id: "fifty-plus", title: "50+ by REBÉL", label: "1:1 | JOINTS, MOBILITY, BALANCE", tagline: "Strong. Mobile. Independent.", image: imgFiftyNeutral, to: "/fiftyplus" as const },
];
export function ProgramCarousel() {
  const [emblaRef, embla] = useEmblaCarousel({ align: "start", loop: false, containScroll: "trimSnaps" });
  const [selected, setSelected] = useState(0);
  const [canNext, setCanNext] = useState(false);
  const [canPrev, setCanPrev] = useState(false);
  const onSelect = useCallback(() => {
    if (!embla) return;
    setSelected(embla.selectedScrollSnap()); setCanNext(embla.canScrollNext()); setCanPrev(embla.canScrollPrev());
  }, [embla]);
  useEffect(() => {
    if (!embla) return;
    onSelect(); embla.on("select", onSelect); embla.on("reInit", onSelect);
    return () => { embla.off("select", onSelect); embla.off("reInit", onSelect); };
  }, [embla, onSelect]);
  return <section id="programs" className="editorial-section overflow-hidden"><div className="container mx-auto px-5 md:px-8">
    <div className="editorial-header flex items-end justify-between gap-4"><div><p className="rebel-label">Three ways in</p><h2 className="editorial-title">Choose your Rebél.</h2><p className="editorial-copy">Three ways to train. One standard.</p></div><div className="flex gap-2 shrink-0 lg:hidden"><Button variant="outline" size="icon" className="rounded-full" aria-label="Previous program" title="Previous program" disabled={!canPrev} onClick={() => embla?.scrollPrev()}><ArrowLeft /></Button><Button variant="outline" size="icon" className="rounded-full" aria-label="Next program" title="Next program" disabled={!canNext} onClick={() => embla?.scrollNext()}><ArrowRight /></Button></div></div>
    <div ref={emblaRef} className="overflow-visible"><div className="flex gap-5 md:gap-7 touch-pan-y">{SLIDES.map((s, i) => <article key={s.id} className="shrink-0 basis-[86%] sm:basis-[64%] lg:basis-[calc((100%-3.5rem)/3)] min-w-0"><Link to={s.to} className="group block"><div className="offering-image relative overflow-hidden rounded-lg bg-card"><img src={s.image} alt={s.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" /><div className="absolute inset-0 image-shade" /><span className="absolute top-5 left-5 font-mono text-xs text-foreground/80">0{i + 1}</span><ArrowUpRight className="absolute bottom-5 right-5 size-6 text-foreground transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></div><div className="pt-6"><p className={`font-mono text-[10px] mb-3 min-h-8 ${i === 0 ? "text-muted-foreground" : "text-warm-gold"}`}>{s.label}</p><h3 className="offering-title font-medium text-foreground">{s.title}{i > 0 && <TM />}</h3><p className="text-sm text-muted-foreground mt-3">{s.tagline}</p></div></Link></article>)}</div></div>
    <div className="flex gap-2 mt-8 lg:hidden" aria-hidden="true">{SLIDES.map((s, i) => <span key={s.id} className={`h-px flex-1 ${i === selected ? "bg-storefront" : "bg-border"}`} />)}</div>
  </div></section>;
}
