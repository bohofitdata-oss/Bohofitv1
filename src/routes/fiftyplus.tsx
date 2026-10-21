import { createFileRoute } from "@tanstack/react-router";
import { flushSync } from "react-dom";
import { useState } from "react";
import { useWebMCP } from "use-webmcp-tool";
import { MessageCircle, ScanLine, ClipboardList, Dumbbell, ChartNoAxesCombined } from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { Reveal } from "@/components/Reveal";
import { ConsultationBooking } from "@/components/ConsultationBooking";
import { FiftyPlusBodyMap } from "@/components/FiftyPlusBodyMap";
import { TM } from "@/components/TM";
import { Button } from "@/components/ui/button";
import { FIFTYPLUS_FOCUS_AREAS, FIFTYPLUS_TIME_SLOTS, toggleFocus } from "@/lib/fiftyplus-focus";
import { runWebMCPTool } from "@/lib/webmcp-telemetry";
import movementImage from "@/assets/fiftyplus-movement.jpg";
import mobilityImage from "@/assets/fiftyplus-mobility.jpg";
import strengthImage from "@/assets/fiftyplus-strength.jpg";
import balanceImage from "@/assets/fiftyplus-balance.jpg";

export const Route = createFileRoute("/fiftyplus")({
  head: () => ({ meta: [
    { title: "50+ by REBÉL — Strong. Steady. Independent." },
    { name: "description", content: "One-to-one, coach-led strength training for joints, mobility and balance. Machine-free training built around you. Book a free 50+ consultation." },
    { property: "og:title", content: "50+ by REBÉL — Strength for independent living" },
    { property: "og:description", content: "Your own coach. Your own plan. Personal strength training for everyday movement, mobility and balance. Start with a free consultation." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: FiftyPlusPage,
});

const STEPS = [
  { title: "Free consultation", line: "To understand your pain, history and daily life.", icon: MessageCircle },
  { title: "Movement check", line: "We see how you sit, stand, walk and balance.", icon: ScanLine },
  { title: "Your plan", line: "Built around your problem areas, by your coach.", icon: ClipboardList },
  { title: "Train 1:1", line: "Safe, slow and machine-free. Your coach is with you every rep.", icon: Dumbbell },
  { title: "Check progress", line: "We re-test, so you can see what improved.", icon: ChartNoAxesCombined },
];
const BENEFITS = [
  { line: "Less pain in daily movement", image: movementImage, alt: "Older man practising a controlled squat with a coach" },
  { line: "More range of motion", image: mobilityImage, alt: "Older woman practising shoulder movement with her coach" },
  { line: "Stronger muscles that protect your joints", image: strengthImage, alt: "Older man lifting a kettlebell under coach supervision" },
  { line: "Better balance, fewer falls", image: balanceImage, alt: "Older woman practising a low step-up with her coach" },
];

function FiftyPlusPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const toggle = (area: string) => setSelected(current => toggleFocus(current, area));
  useWebMCP({
    name: "get_50plus_focus",
    description: "Read the currently selected 50+ by Rebél training focus areas.",
    annotations: { readOnlyHint: true },
    execute: (_args: Record<string, never>, { signal }) => runWebMCPTool("get_50plus_focus", () => {
      if (signal.aborted) throw new Error("Request cancelled.");
      return selected.length ? `Selected focus areas: ${selected.join(", ")}.` : "No focus areas selected.";
    }),
  });
  useWebMCP({
    name: "toggle_50plus_focus",
    description: "Select or clear one of the visible 50+ by Rebél focus areas.",
    inputSchema: { type: "object", properties: { problem: { type: "string", enum: FIFTYPLUS_FOCUS_AREAS, description: "Focus area to toggle." } }, required: ["problem"] },
    execute: ({ problem }: { problem: string }, { signal }) => runWebMCPTool("toggle_50plus_focus", () => {
      if (signal.aborted) throw new Error("Request cancelled.");
      if (typeof problem !== "string" || !FIFTYPLUS_FOCUS_AREAS.includes(problem)) throw new Error("Choose one of the focus areas shown on this page.");
      const wasSelected = selected.includes(problem);
      flushSync(() => toggle(problem));
      return `${wasSelected ? "Cleared" : "Selected"} ${problem}.`;
    }),
  });
  return <SiteShell><div className="unpause-page fiftyplus-page">
    <section className="unpause-hero relative overflow-hidden flex items-center">
      <img src={movementImage} alt="One-to-one strength training with an older adult and coach" width={768} height={1024} className="absolute inset-0 w-full h-full object-cover object-[center_32%] md:object-[center_40%]" />
      <div className="absolute inset-0 unpause-hero-shade" aria-hidden />
      <div className="relative container mx-auto px-5 md:px-8 py-20 md:py-28"><Reveal>
        <p className="font-mono text-xs text-warm-gold leading-relaxed">50+ BY REBÉL<TM /> | 1:1</p>
        <h1 className="unpause-heading text-foreground font-medium mt-8">Strong. Steady.<br />Independent.</h1>
        <p className="text-foreground/85 text-[15px] md:text-lg leading-relaxed max-w-[38ch] mt-7">One-to-one strength training for joints, mobility and balance. With your own coach.</p>
        <Button asChild size="lg" className="unpause-cta rounded-full h-12 mt-9 px-7"><a href="#book">Book a free consultation →</a></Button>
        <p className="text-xs text-muted-foreground mt-5">Free 30-minute consultation · No payment needed</p>
      </Reveal></div>
    </section>

    <section id="problem" className="editorial-section scroll-mt-20"><div className="container mx-auto px-5 md:px-8 grid lg:grid-cols-[1fr_1.4fr] gap-10 lg:gap-20">
      <Reveal><p className="rebel-label text-warm-gold mb-6">Your starting point</p><h2 className="unpause-section-heading font-medium">Where does<br />it hurt?</h2><p className="text-sm text-muted-foreground mt-6 max-w-xs">Select what you're dealing with — we build your program around it.</p></Reveal>
      <Reveal delay={100}><FiftyPlusBodyMap selected={selected} onToggle={toggle} /></Reveal>
    </div></section>

    <section className="editorial-section"><div className="container mx-auto px-5 md:px-8 grid md:grid-cols-2 gap-10 md:gap-20 items-center">
      <Reveal><p className="rebel-label text-warm-gold mb-6">On your own terms</p><h2 className="unpause-section-heading font-medium">Strength for<br />independence.</h2><p className="text-muted-foreground text-sm md:text-base mt-6 max-w-xs">Get up, walk, climb and travel on your own terms.</p></Reveal>
      <Reveal delay={120}><svg viewBox="0 0 540 420" role="img" aria-labelledby="independence-diagram-title" className="w-full max-w-xl mx-auto text-warm-gold"><title id="independence-diagram-title">Strength, mobility and balance, centred on independence</title><g fill="none" stroke="currentColor" strokeWidth="1"><circle cx="210" cy="155" r="128" /><circle cx="330" cy="155" r="128" /><circle cx="270" cy="265" r="128" /></g><g fill="currentColor" className="unpause-venn-label"><text x="150" y="130" textAnchor="middle">Strength</text><text x="390" y="130" textAnchor="middle">Mobility</text><text x="270" y="330" textAnchor="middle">Balance</text></g><text x="270" y="208" textAnchor="middle" className="fiftyplus-venn-centre" fill="currentColor">INDEPENDENCE</text></svg></Reveal>
    </div></section>

    <section className="editorial-section"><div className="container mx-auto px-5 md:px-8 grid lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20">
      <Reveal><p className="rebel-label text-warm-gold mb-6">How it works</p><h2 className="unpause-section-heading font-medium">Your pace.<br />A clear plan.</h2></Reveal>
      <ol className="unpause-timeline">{STEPS.map((step, index) => { const Icon = step.icon; return <Reveal key={step.title} delay={index * 70}><li className="relative pl-14 md:pl-16 pb-12"><span className="unpause-step-dot absolute left-0 top-0 size-8 rounded-full border border-warm-gold text-warm-gold bg-background flex items-center justify-center font-mono text-xs">{index + 1}</span><div className="flex gap-3 items-center"><Icon className="size-5 shrink-0 text-warm-gold" strokeWidth={1.2} /><h3 className="font-sans font-medium text-lg text-foreground">{step.title}</h3></div><p className="text-sm text-muted-foreground mt-3 max-w-[34ch]">{step.line}</p></li></Reveal>; })}</ol>
    </div></section>

    <section className="editorial-section"><div className="container mx-auto px-5 md:px-8"><Reveal><p className="rebel-label text-warm-gold mb-6">What you get</p><h2 className="unpause-section-heading font-medium">More life in<br />every movement.</h2></Reveal><div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">{BENEFITS.map((benefit, index) => <Reveal key={benefit.line} delay={index * 80}><article className="relative overflow-hidden rounded-lg aspect-[3/4] bg-card"><img src={benefit.image} alt={benefit.alt} loading="lazy" width={768} height={1024} className="absolute inset-0 w-full h-full object-cover" /><div className="absolute inset-0 unpause-photo-shade" aria-hidden /><div className="absolute inset-x-0 bottom-0 p-6"><h3 className="font-sans text-xl font-medium text-foreground leading-snug">{benefit.line}</h3></div></article></Reveal>)}</div></div></section>

    <section id="book" className="editorial-section scroll-mt-20"><div className="container mx-auto max-w-3xl px-5 md:px-8"><Reveal><div className="unpause-booking"><ConsultationBooking program="fifty_plus" problemAreas={selected} selectedConcerns={selected} timeSlots={FIFTYPLUS_TIME_SLOTS} eyebrow="Your first step" headline="Pick a day and time." subtext="One person per slot, 60 minutes." slotDescription="6:30 AM–1:30 PM, then 4:30–8:30 PM. Last sessions end at 2:30 PM and 9:30 PM." /></div></Reveal><p className="text-xs text-muted-foreground mt-8 leading-relaxed">50+ by REBÉL<TM /> is a coach-led fitness programme, not a medical treatment.<br />Recent surgery or injury? Please check with your doctor before starting.</p></div></section>
  </div></SiteShell>;
}
