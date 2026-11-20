import { ClipboardCheck, Sprout, TrendingUp, Flame, Repeat, Trophy } from "lucide-react";
import { Reveal } from "@/components/Reveal";
const PHASES = [
  {name:"Assess", desc:"Your body. Your history. Your goal.",icon:ClipboardCheck},
  {name:"Foundation", desc:"Build technique. Find your rhythm.",icon:Sprout},
  {name:"Build", desc:"Add strength, one session at a time.",icon:TrendingUp},
  {name:"Push", desc:"Raise the bar. See your progress.",icon:Flame},
  {name:"Sustain", desc:"Make showing up your way of life.",icon:Repeat},
  {name:"Lead", desc:"Keep growing. Bring someone along.",icon:Trophy},
];
export function RebelJourney() {
  return <section className="creative-section journey-section"><div className="container mx-auto px-5 md:px-8"><Reveal><div className="section-heading-row"><div><p className="rebel-label mb-4">Roots before results</p><h2 className="editorial-title">Your Rebél <span className="journey-word">Journey.</span></h2></div><p className="editorial-copy">Every member moves through phases.<br />Skip nothing.</p></div></Reveal><ol className="journey-tree">{PHASES.map(({name,desc,icon:Icon},i)=><li className={`journey-branch branch-${i}`} key={name}><Reveal delay={i*80}><div className="journey-node"><span className="journey-node-icon"><Icon className="size-5" strokeWidth={1.5}/></span><div className="min-w-0"><p className="font-mono text-[10px] text-storefront">0{i+1}</p><h3 className="font-sans text-xl font-bold">{name}</h3><p className="text-sm mt-1">{desc}</p></div></div></Reveal></li>)}</ol><p className="journey-root font-mono text-xs">ONE STRONG FOUNDATION.</p></div></section>;
}
