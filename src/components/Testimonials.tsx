import { ArrowUpRight, Quote, Star } from "lucide-react";
import { PEOPLE_TRAINED } from "@/lib/site-facts";
import { GOOGLE_REVIEW_SNAPSHOT } from "@/lib/google-review-snapshot";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";

export function Testimonials() {
  const source = GOOGLE_REVIEW_SNAPSHOT;
  return <section id="results" className="creative-section"><div className="container mx-auto px-5 md:px-8">
    <Reveal><div className="section-heading-row"><div><p className="rebel-label mb-4">Since Bohofit</p><h2 className="editorial-title">A legacy<br />of strength.</h2></div><div><p className="font-display text-4xl text-foreground">2,700+</p><p className="text-sm mt-3">{PEOPLE_TRAINED}.</p><a href={source.listingUrl} target="_blank" rel="noopener noreferrer" className="inline-flex flex-wrap items-center gap-3 mt-5 text-sm"><span className="font-bold text-foreground">{source.rating.toFixed(1)}</span><span className="flex gap-1 text-storefront" aria-label="5 out of 5 stars">{Array.from({length:5},(_,i)=><Star key={i} className="size-3 fill-current" />)}</span><span className="text-muted-foreground">{source.totalReviews} Google reviews</span><ArrowUpRight className="size-4" /></a></div></div></Reveal>
    <div className="legacy-reviews">{source.reviews.map(review=><article key={review.name} className="legacy-review"><div className="flex justify-between items-center gap-4"><Quote className="size-7 text-storefront" strokeWidth={1}/><span className="flex gap-1 text-storefront" aria-label={`${review.stars} out of 5 stars`}>{Array.from({length:review.stars},(_,i)=><Star key={i} className="size-3 fill-current" />)}</span></div><blockquote className="text-base md:text-lg text-foreground mt-6 leading-relaxed">“{review.quote}”</blockquote><p className="font-mono text-xs text-foreground mt-7">{review.name}</p><p className="text-xs text-muted-foreground mt-2"><time dateTime={review.date}>{new Date(`${review.date}T12:00:00Z`).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric",timeZone:"UTC"})}</time> | Google review excerpt</p><a href={source.listingUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs text-muted-foreground mt-3 underline underline-offset-4">Read reviews on Google<ArrowUpRight className="size-3"/></a></article>)}</div>
    <p className="text-xs text-muted-foreground mt-6">Selected Google review excerpts. Rating and count checked 20 Nov 2026.</p><Button asChild variant="outline" className="rounded-full mt-5"><a href={source.listingUrl} target="_blank" rel="noopener noreferrer">See all Google reviews<ArrowUpRight className="size-4"/></a></Button>
  </div></section>;
}
