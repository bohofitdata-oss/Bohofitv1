import { Link } from "@tanstack/react-router";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TM } from "@/components/TM";
import groupPhoto from "@/assets/rebel-group-members.jpg.asset.json";

import fiftyPhoto from "@/assets/rebel-fiftyplus-member.webp.asset.json";
const SLIDES = [
  { id: "group-classes", title: "Group Classes", label: "LEVELS 1–3", tagline: "Start. Strength. REBEL UNLIMITED.", image: groupPhoto.url, to: "/bohofit" as const },
  { id: "fifty-plus", title: "50+ by REBÉL", label: "1:1 | JOINTS, MOBILITY, BALANCE", tagline: "Strong. Mobile. Independent.", image: fiftyPhoto.url, to: "/fiftyplus" as const },
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
  return <section id="programs" className="creative-section overflow-hidden offering-section"><div className="container mx-auto px-5 md:px-8">
    <div className="editorial-header grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4"><div><p className="rebel-label">Two ways in</p><h2 className="editorial-title">Choose your Rebél.</h2><p className="editorial-copy">Two ways to train. One standard.</p></div><div className="flex gap-2 shrink-0"><Button variant="outline" size="icon" className="rounded-full" aria-label="Previous program" title="Previous program" disabled={!canPrev} onClick={() => embla?.scrollPrev()}><ArrowLeft /></Button><Button variant="outline" size="icon" className="rounded-full" aria-label="Next program" title="Next program" disabled={!canNext} onClick={() => embla?.scrollNext()}><ArrowRight /></Button></div></div>
    <div ref={emblaRef} className="overflow-visible"><div className="flex gap-5 md:gap-7 touch-pan-y">{SLIDES.map((s, i) => <article key={s.id} className="offering-slide min-w-0 shrink-0"><Link to={s.to} className={`group offering-swipe-card offering-card-${i}`}><img src={s.image} alt={s.title} loading="lazy" className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" /><div className="absolute inset-0 offering-photo-shade" /><div className="relative flex justify-between items-center"><span className="offering-sticker font-mono text-xs">{i===0 ? "FIND YOUR PEOPLE" : "YOUR NEXT CHAPTER"}</span><span className="font-mono text-xs text-foreground/80">0{i+1}</span></div><div className="offering-card-copy relative"><p className={`font-mono text-[10px] mb-3 ${i === 0 ? "text-foreground/80" : "text-warm-gold"}`}>{s.label}</p><h3 className="offering-title font-medium text-foreground">{s.title}{i > 0 && <TM />}</h3><p className="text-sm text-foreground/80 mt-3">{s.tagline}</p><div className="mt-6 flex items-center justify-between border-t border-foreground/25 pt-4"><span className="text-sm font-medium">{i===0 ? "Find my level" : "Meet your coach"}</span><span className="offering-arrow"><ArrowUpRight className="size-5"/></span></div></div></Link></article>)}</div></div>
    <div className="flex items-center gap-3 mt-7"><span className="font-mono text-xs text-muted-foreground">0{selected+1} / 02</span><div className="flex gap-2 flex-1" aria-hidden="true">{SLIDES.map((s, i) => <span key={s.id} className={`h-px flex-1 ${i === selected ? "bg-storefront" : "bg-border"}`} />)}</div></div>
  </div></section>;
}
