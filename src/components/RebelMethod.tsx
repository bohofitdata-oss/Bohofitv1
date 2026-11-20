import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Plus, Minus, Zap } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { METHOD_CHAPTERS } from "@/lib/methodChapters";
export function RebelMethod() {
  const [all, setAll] = useState(false);
  const chapters = all ? METHOD_CHAPTERS : [METHOD_CHAPTERS[0], METHOD_CHAPTERS[2], METHOD_CHAPTERS[8]].filter(chapter => chapter !== undefined);
  return <section className="creative-section method-remix"><div className="container mx-auto px-5 md:px-8">
    <Reveal><div className="section-heading-row"><div><p className="rebel-label mb-4">Less noise. More know-how.</p><h2 className="editorial-title">The Rebél <span className="text-storefront">Method.</span></h2></div><p className="editorial-copy">Strength that lasts.<br />Ten chapters, one method.</p></div></Reveal>
    <div className={`method-deck ${all ? "is-expanded" : ""}`}>{chapters.map((chapter,i) => <Link key={chapter.slug} to="/method/$slug" params={{slug:chapter.slug}} className={`method-ticket method-ticket-${i%3}`}><div className="flex justify-between items-center"><span className="font-mono text-xs">CHAPTER {String(chapter.number).padStart(2,"0")}</span><ArrowUpRight className="size-5"/></div><Zap className="method-ticket-symbol" strokeWidth={1}/><h3 className="font-sans text-xl font-bold">{chapter.title}</h3><p className="text-sm">{chapter.subtitle}</p></Link>)}</div>
    <Button variant="ghost" className="mt-8 rounded-full border border-border px-6 h-12" onClick={()=>setAll(!all)} aria-expanded={all}>{all ? <Minus className="size-4"/> : <Plus className="size-4"/>}{all ? "Show less" : "All 10 chapters"}</Button>
  </div></section>;
}
