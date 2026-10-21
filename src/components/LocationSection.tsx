import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { STUDIO_ADDRESS, STUDIO_HOURS, APPOINTMENT_NOTE } from "@/lib/site-facts";
export function LocationSection() {
  return <section className="editorial-section"><div className="container mx-auto px-5 md:px-8 grid md:grid-cols-2 gap-12 md:gap-20">
    <Reveal><p className="rebel-label mb-5">Find us | Bengaluru</p><h2 className="editorial-title">Your studio.<br />Your people.</h2><address className="not-italic text-muted-foreground text-sm leading-relaxed mt-7 max-w-xs">{STUDIO_ADDRESS}.</address><Button variant="outline" asChild className="rounded-full mt-7"><a href={`https://maps.google.com/?q=${encodeURIComponent(STUDIO_ADDRESS)}`} target="_blank" rel="noopener noreferrer">Get directions <ArrowUpRight className="size-4" /></a></Button></Reveal>
    <Reveal delay={100}><p className="rebel-label mb-5">Group class routine</p><dl className="space-y-5">{STUDIO_HOURS.map(row => <div key={row.day} className="member-row pb-5"><dt className="text-foreground text-sm mb-2">{row.day}</dt><dd className="text-muted-foreground text-sm">{row.hours}</dd></div>)}</dl><p className="text-muted-foreground text-xs mt-6">{APPOINTMENT_NOTE}</p></Reveal>
  </div></section>;
}
