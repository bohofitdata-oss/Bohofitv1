import { useState } from "react";
import { Users, TrendingUp, Layers, Home, HeartPulse, Award, ChevronDown } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { PEOPLE_TRAINED } from "@/lib/site-facts";
const CARDS = [
  { icon: Users, title: "Coach-led. Never machine-led.", subtitle: "Real movement. Real attention.", body: "REBÉL Defined Coach — trained to the REBÉL Standard" },
  { icon: TrendingUp, title: "Programming that progresses", subtitle: "No plateaus. No guesswork.", body: "Clear phases. Personal guidance. Strength that keeps building." },
  { icon: Layers, title: "The right company", subtitle: "Group classes. Personal 1:1 training.", body: "UnPause and 50+ are 1:1. Families or buddies can train together in twos or threes." },
  { icon: Home, title: "Studio, online or at home", subtitle: "Your setting. Our standard.", body: "Train in HSR Layout, online or at home. The same personal attention, wherever you are." },
  { icon: HeartPulse, title: "Built for real bodies", subtitle: "Your history shapes your training.", body: "PCOD, PCOS, thyroid, perimenopause, menopause. Joint concerns and post-injury training are considered." },
  { icon: Award, title: "Years of proof", subtitle: PEOPLE_TRAINED, body: "Since Bohofit. A legacy of coaching, refined into the REBÉL Standard." },
];
export function WhatYouGet() {
  const [open, setOpen] = useState<number | null>(null);
  return <section className="editorial-section"><div className="container mx-auto px-5 md:px-8 grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20">
    <Reveal><div className="editorial-header"><p className="rebel-label">The system</p><h2 className="editorial-title">What you get<br />at Rebél.</h2><p className="editorial-copy">Not a gym membership.<br />A system built around your life.</p></div><div className="grid grid-cols-2 gap-y-8 gap-x-6"><div><p className="font-display text-3xl text-foreground">2,500+</p><p className="text-xs mt-2 text-muted-foreground">People trained since 2022</p></div><div><p className="font-display text-3xl text-foreground">8</p><p className="text-xs mt-2 text-muted-foreground">Training formats</p></div><div><p className="font-display text-3xl text-foreground">3</p><p className="text-xs mt-2 text-muted-foreground">Programs</p></div><div><p className="font-display text-3xl text-foreground">0</p><p className="text-xs mt-2 text-muted-foreground">Machines</p></div></div></Reveal>
    <div>{CARDS.map((card, i) => { const Icon = card.icon; const active = open === i; return <Reveal key={card.title} delay={i * 60}><div className="member-row"><Button variant="ghost" onClick={() => setOpen(active ? null : i)} aria-expanded={active} aria-controls={`benefit-${i}`} className="w-full h-auto py-6 px-0 justify-start gap-4 text-left whitespace-normal hover:bg-transparent"><Icon className="text-muted-foreground shrink-0" /><span className="flex-1 min-w-0"><span className="block font-semibold text-[15px]">{card.title}</span><span className="block text-xs text-muted-foreground font-normal mt-2">{card.subtitle}</span></span><ChevronDown className={`text-muted-foreground transition-transform ${active ? "rotate-180" : ""}`} /></Button><div id={`benefit-${i}`} hidden={!active}><p className="text-sm text-muted-foreground pb-6 pl-8 max-w-[34ch]">{card.body}</p></div></div></Reveal>; })}</div>
  </div></section>;
}
