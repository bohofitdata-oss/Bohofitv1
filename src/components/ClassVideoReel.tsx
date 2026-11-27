import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TrainingFormat } from "@/lib/group-formats";

export function ClassVideoReel({ format }: { format: TrainingFormat }) {
  const [active, setActive] = useState(0);
  const videos = format.videos ?? [];
  const [viewport, api] = useEmblaCarousel({ align: "start", containScroll: "trimSnaps" });
  useEffect(() => {
    if (!api) return;
    const update = () => {
      setActive(api.selectedScrollSnap());
      api.slideNodes().forEach((slide, index) => {
        if (index !== api.selectedScrollSnap()) slide.querySelector("video")?.pause();
      });
    };
    api.on("select", update);
    api.on("reInit", update);
    update();
    return () => { api.off("select", update); api.off("reInit", update); };
  }, [api]);
  if (!videos.length) return <p className="text-sm text-muted-foreground">Class film coming soon.</p>;
  return <div>
    <div className="flex items-center justify-between gap-4 mb-4">
      <span className="text-xs font-mono text-muted-foreground" aria-live="polite">{active + 1} / {videos.length}</span>
      <div className="flex gap-2">
        <Button variant="outline" size="icon" className="rounded-full size-11" aria-label="Previous video" title="Previous video" disabled={active === 0} onClick={() => api?.scrollPrev()}><ChevronLeft className="size-5" /></Button>
        <Button variant="outline" size="icon" className="rounded-full size-11" aria-label="Next video" title="Next video" disabled={active >= videos.length - 1} onClick={() => api?.scrollNext()}><ChevronRight className="size-5" /></Button>
      </div>
    </div>
    <div ref={viewport} className="overflow-hidden" aria-label={`${format.name} class clips`}>
      <div className="flex gap-3 touch-pan-y">
        {videos.map((src, index) => <div key={src} className="min-w-0 shrink-0 basis-[88%] sm:basis-[70%]">
          <video src={src} controls muted playsInline preload="metadata" onLoadedMetadata={event => { event.currentTarget.muted = true; }} onVolumeChange={event => { if (!event.currentTarget.muted) event.currentTarget.muted = true; }} className="w-full h-[48dvh] max-h-[520px] object-contain rounded-lg border border-border bg-card" aria-label={`${format.name} clip ${index + 1} of ${videos.length}`} />
        </div>)}
      </div>
    </div>
  </div>;
}