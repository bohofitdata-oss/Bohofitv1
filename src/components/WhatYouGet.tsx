import { Users, TrendingUp, Layers, Home, HeartPulse, Award, Sparkles, MoveUpRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { PEOPLE_TRAINED } from "@/lib/site-facts";
const BENEFITS = [
  { icon: Users, title: "A coach. Not a machine.", line: "Real movement. Real attention." },
  { icon: TrendingUp, title: "Stronger every chapter.", line: "No plateaus. No guesswork." },
  { icon: Layers, title: "Your kind of company.", line: "Group energy. Personal 1:1 attention." },
  { icon: Home, title: "Your place. Your pace.", line: "Studio, online or at home." },
  { icon: HeartPulse, title: "Real bodies welcome.", line: "Your history shapes your training." },
  { icon: Award, title: "Not our first rep.", line: PEOPLE_TRAINED },
];
export function WhatYouGet() {
  return <section className="creative-section benefits-section"><div className="container mx-auto px-5 md:px-8">
    <Reveal><div className="section-heading-row"><div><p className="rebel-label mb-4">The good stuff</p><h2 className="editorial-title">What you get<br />at Rebél.</h2></div><p className="editorial-copy">Not a gym membership.<br />A system built around your life.</p></div></Reveal>
    <div className="benefit-grid">{BENEFITS.map(({icon: Icon, title, line},i) => <Reveal key={title} delay={i*45}><article tabIndex={0} className={`benefit-bubble benefit-${i}`}><Icon className="size-7 text-storefront" strokeWidth={1.5}/><span className="benefit-index font-mono text-xs text-muted-foreground">0{i+1}</span><h3 className="font-sans font-bold text-lg">{title}</h3><p className="text-sm">{line}</p><MoveUpRight className="benefit-arrow size-4" aria-hidden /></article></Reveal>)}</div>
    <Reveal><div className="rebel-number-remix" aria-label="Rebél in numbers"><div className="number-headline"><Sparkles className="size-6 text-storefront"/><span className="font-mono text-xs">THE REBÉL EFFECT</span></div><div className="number-people"><strong>2,700<span>+</span></strong><p>People trained since 2022</p></div><div className="number-formats"><strong>8+</strong><p>Training formats</p></div><div className="number-programs"><strong>3</strong><p>Programs <span className="block text-xs">2 open now</span></p></div><div className="number-zero"><strong>0</strong><p>Machines.<br /><span className="text-foreground">All you.</span></p></div></div></Reveal>
  </div></section>;
}
