import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useWebMCP } from "use-webmcp-tool";
import { Check, MessageCircle, ScanLine, ClipboardList, Dumbbell, ChartNoAxesCombined } from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { Reveal } from "@/components/Reveal";
import { ConsultationBooking } from "@/components/ConsultationBooking";
import { TM } from "@/components/TM";
import { Button } from "@/components/ui/button";
import { UNPAUSE_TIME_SLOTS } from "@/lib/unpause-booking";
import { runWebMCPTool } from "@/lib/webmcp-telemetry";
import heroLoop from "../../public/longevity-hero-loop.mp4.asset.json";
import strengthImage from "@/assets/unpause-strength.jpg";
import balanceImage from "@/assets/unpause-balance.jpg";
import energyImage from "@/assets/unpause-energy.jpg";
import nutritionImage from "@/assets/unpause-nutrition.jpg";

export const Route = createFileRoute("/longevity")({
  head: () => ({ meta: [
    { title: "UnPause — Strength for perimenopause & menopause | REBÉL" },
    { name: "description", content: "One coach. One dietitian. Doctor-guided. Twelve weeks of personal strength training. Book your free UnPause consultation." },
    { property: "og:title", content: "UnPause — For the change. Not around it." },
    { property: "og:description", content: "1:1 strength for perimenopause and menopause. One coach, one dietitian, doctor-guided. A free consultation starts your plan." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: UnpausePage,
});

const CONCERNS = ["Low energy", "Weight gain around the middle", "Joint aches", "Poor sleep", "Losing strength", "Worried about bone health", "I just want to feel strong again"];
const STEPS = [
  { title: "Free consultation", line: "To understand you, your routine and your goals.", icon: MessageCircle },
  { title: "Body check", line: "We measure your strength, balance and how you feel.", icon: ScanLine },
  { title: "Your plan", line: "Your coach and dietitian build it, doctor-guided.", icon: ClipboardList },
  { title: "Train 1:1, 3× a week", line: "36 sessions over 12 weeks. Every session supervised.", icon: Dumbbell },
  { title: "Measure again", line: "See what changed, in numbers. Take home your report.", icon: ChartNoAxesCombined },
];
const CHANGES = [
  { title: "Strength", line: "Lift, carry and climb with confidence.", image: strengthImage },
  { title: "Bones & Balance", line: "Train the body the hormone used to protect.", image: balanceImage },
  { title: "Energy", line: "Feel steadier through the day.", image: energyImage },
  { title: "Nutrition", line: "Eat for the body you have now.", image: nutritionImage },
];

function UnpausePage() {
  const [concerns, setConcerns] = useState<string[]>([]);
  const toggleConcern = (value: string) => setConcerns(current => current.includes(value) ? current.filter(item => item !== value) : [...current, value]);
  useWebMCP({
    name: "open_unpause_consultation",
    description: "Move to the UnPause free consultation booking section.",
    annotations: { readOnlyHint: false },
    execute: (_args: Record<string, never>, { signal }) => runWebMCPTool("open_unpause_consultation", () => {
      if (signal.aborted) throw new Error("Request cancelled.");
      const bookingSection = document.getElementById("book");
      if (!bookingSection) throw new Error("The consultation section is unavailable.");
      bookingSection.scrollIntoView({ behavior: "smooth", block: "start" });
      return "Moved to the UnPause consultation booking section.";
    }),
  });
  return <SiteShell><div className="unpause-page">
    <section className="unpause-hero relative overflow-hidden flex items-center">
      <video src={heroLoop.url} autoPlay muted loop playsInline poster={strengthImage} className="absolute inset-0 w-full h-full object-cover" aria-hidden />
      <div className="absolute inset-0 unpause-hero-shade" aria-hidden />
      <div className="relative container mx-auto px-5 md:px-8 py-20 md:py-28">
        <Reveal><p className="font-mono text-[10px] md:text-xs text-warm-gold max-w-lg leading-relaxed">UNPAUSE<TM /> | 1:1 STRENGTH FOR PERIMENOPAUSE &amp; MENOPAUSE</p>
          <h1 className="unpause-heading text-foreground font-medium mt-8">For the change.<br />Not around it.</h1>
          <p className="text-foreground/85 text-[15px] md:text-lg leading-relaxed max-w-[34ch] mt-7">One coach. One dietitian. Doctor-guided. Built for your body now.</p>
          <Button asChild size="lg" className="unpause-cta rounded-full h-12 mt-9 px-7"><a href="#book">Book a free consultation →</a></Button>
          <p className="text-xs text-muted-foreground mt-5">Free 30-minute consultation · No payment needed</p>
        </Reveal>
      </div>
    </section>

    <section className="editorial-section"><div className="container mx-auto px-5 md:px-8 grid lg:grid-cols-[1fr_1.4fr] gap-10 lg:gap-20">
      <Reveal><p className="rebel-label text-warm-gold mb-5">Sound familiar?</p><h2 className="unpause-section-heading font-medium">Your body.<br />A different chapter.</h2></Reveal>
      <Reveal delay={100}><div className="flex flex-wrap gap-3">{CONCERNS.map(concern => { const selected = concerns.includes(concern); return <Button key={concern} variant="outline" onClick={() => toggleConcern(concern)} aria-pressed={selected} className={`rounded-full h-auto min-h-11 py-3 px-5 text-sm whitespace-normal text-left justify-start font-normal ${selected ? "border-warm-gold bg-warm-gold/10 text-warm-gold" : "border-border bg-transparent text-muted-foreground hover:border-warm-gold/60 hover:bg-transparent hover:text-foreground"}`}>{selected && <Check className="size-3.5 shrink-0" />}{concern}</Button>; })}</div><p className="text-sm text-muted-foreground mt-7 max-w-sm">You're not alone. This is exactly what we build for.</p></Reveal>
    </div></section>

    <section className="editorial-section"><div className="container mx-auto px-5 md:px-8 grid md:grid-cols-2 gap-10 md:gap-20 items-center">
      <Reveal><p className="rebel-label text-warm-gold mb-6">Your support circle</p><h2 className="unpause-section-heading font-medium">Three experts.<br />One plan.</h2><p className="text-muted-foreground text-sm md:text-base mt-6 max-w-xs">Three experts. One plan. Built around you.</p></Reveal>
      <Reveal delay={120}><svg viewBox="0 0 540 420" role="img" aria-labelledby="expert-diagram-title" className="w-full max-w-xl mx-auto text-warm-gold"><title id="expert-diagram-title">Your coach, clinical dietitian and doctor-guided support, centred on you</title><g fill="none" stroke="currentColor" strokeWidth="1"><circle cx="210" cy="155" r="128" /><circle cx="330" cy="155" r="128" /><circle cx="270" cy="265" r="128" /></g><g fill="currentColor" className="unpause-venn-label"><text x="150" y="130" textAnchor="middle"><tspan x="150">Your</tspan><tspan x="150" dy="25">Coach</tspan></text><text x="390" y="130" textAnchor="middle"><tspan x="390">Clinical</tspan><tspan x="390" dy="25">Dietitian</tspan></text><text x="270" y="330" textAnchor="middle">Doctor-Guided</text></g><text x="270" y="208" textAnchor="middle" className="unpause-venn-centre" fill="currentColor">YOU</text></svg></Reveal>
    </div></section>

    <section className="editorial-section"><div className="container mx-auto px-5 md:px-8 grid lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20">
      <Reveal><p className="rebel-label text-warm-gold mb-6">Your 12 weeks</p><h2 className="unpause-section-heading font-medium">A clear path.<br />A stronger you.</h2></Reveal>
      <ol className="unpause-timeline">{STEPS.map((step, index) => { const Icon = step.icon; return <Reveal key={step.title} delay={index * 70}><li className="relative pl-14 md:pl-16 pb-12"><span className="unpause-step-dot absolute left-0 top-0 size-8 rounded-full border border-warm-gold text-warm-gold bg-background flex items-center justify-center font-mono text-xs">{index + 1}</span><div className="flex gap-3 items-center"><Icon className="size-5 shrink-0 text-warm-gold" strokeWidth={1.2} /><h3 className="font-sans font-medium text-lg text-foreground">{step.title}</h3></div><p className="text-sm text-muted-foreground mt-3 max-w-[34ch]">{step.line}</p></li></Reveal>; })}</ol>
    </div></section>

    <section className="editorial-section"><div className="container mx-auto px-5 md:px-8"><Reveal><p className="rebel-label text-warm-gold mb-6">What changes</p><h2 className="unpause-section-heading font-medium">For everyday life.</h2></Reveal><div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">{CHANGES.map((change, index) => <Reveal key={change.title} delay={index * 80}><article className="relative overflow-hidden rounded-lg aspect-[3/4] bg-card"><img src={change.image} alt={change.title === "Nutrition" ? "Balanced Indian meal" : `${change.title} through movement`} loading="lazy" width={768} height={1024} className="absolute inset-0 w-full h-full object-cover" /><div className="absolute inset-0 unpause-photo-shade" aria-hidden /><div className="absolute inset-x-0 bottom-0 p-6"><h3 className="font-sans text-xl font-medium text-foreground">{change.title}</h3><p className="text-sm text-foreground/80 mt-3 max-w-[24ch]">{change.line}</p></div></article></Reveal>)}</div></div></section>

    <section id="book" className="editorial-section scroll-mt-20"><div className="container mx-auto max-w-3xl px-5 md:px-8"><Reveal><div className="unpause-booking"><ConsultationBooking program="unpause" selectedConcerns={concerns} timeSlots={UNPAUSE_TIME_SLOTS} eyebrow="Your first step" headline="Pick a day and time." subtext="One person per slot, 60 minutes." slotDescription="6:30 AM–1:30 PM, then 4:30–8:30 PM. Last sessions end at 2:30 PM and 9:30 PM." /></div></Reveal><p className="text-xs text-muted-foreground mt-8 leading-relaxed">UnPause<TM /> is a supervised fitness programme, not a medical treatment.</p><div className="flex flex-wrap gap-6 text-xs text-muted-foreground mt-8"><Link to="/longevity/me" className="hover:text-warm-gold">Member home</Link><Link to="/auth" className="hover:text-warm-gold">Sign in</Link></div></div></section>
  </div></SiteShell>;
}
