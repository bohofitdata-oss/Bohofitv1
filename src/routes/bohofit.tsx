import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { flushSync } from "react-dom";
import { useState } from "react";
import { useWebMCP } from "use-webmcp-tool";
import { Play, ArrowUpRight, ArrowRight } from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { Reveal } from "@/components/Reveal";
import { TM } from "@/components/TM";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { GroupPlanCheckout } from "@/components/GroupPlanCheckout";
import { GROUP_PLANS, JOINING_RULES, requiresLevelWarning, type ClassLevel, type GroupPlan } from "@/lib/group-plans";
import { LEVEL_FORMATS, type TrainingFormat } from "@/lib/group-formats";
import { STUDIO_HOURS } from "@/lib/site-facts";
import { cn } from "@/lib/utils";
import { runWebMCPTool } from "@/lib/webmcp-telemetry";
import startPhoto from "@/assets/rebel-start-members.jpg.asset.json";
import strengthPhoto from "@/assets/rebel-strength-members.jpg.asset.json";
import unlimitedPhoto from "@/assets/rebel-unlimited-members.jpg.asset.json";
import startRoutine from "@/assets/rebel-level1-start-routine.png.asset.json";
import strengthRoutine from "@/assets/rebel-level2-strength-routine.png.asset.json";
import rulebook from "@/assets/rebel-class-rulebook.jpg.asset.json";
import { AssetDownloadButton } from "@/components/AssetDownloadButton";
import { CLASS_RULEBOOK, ROUTINE_LEVELS } from "@/lib/class-rulebook";
const ROUTINES = { start: { asset: startRoutine, filename: "REBEL-Level-1-START-Routine.png" }, strength: { asset: strengthRoutine, filename: "REBEL-Level-2-STRENGTH-Routine.png" } };

export const Route = createFileRoute("/bohofit")({
  head: () => ({ meta: [
    { title: "REBÉL Group Classes — START, STRENGTH & REBEL UNLIMITED" },
    { name: "description", content: "Choose your level at REBÉL Bangalore: START for beginners, STRENGTH for intermediate and advanced training, or all-access REBEL UNLIMITED. Plans from ₹5,999." },
    { property: "og:title", content: "REBÉL Group Classes — Start where you are" },
    { property: "og:description", content: "Six START formats. Four STRENGTH formats. All ten with REBEL UNLIMITED. Machine-free coaching, unlimited classes and all-inclusive membership plans." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: GroupClassesPage,
});

const LEVELS: Record<ClassLevel, { name: string; level: string; tagline: string; sub: string; count: number; footer: string; image: string }> = {
  start: { name: "START", level: "LEVEL 1", tagline: "India's safest start to fitness.", sub: "For beginners & comeback journeys.", count: 6, footer: "From beginner → consistent & confident", image: startPhoto.url },
  strength: { name: "STRENGTH", level: "LEVEL 2", tagline: "Strength without limits.", sub: "For serious training & performance.", count: 4, footer: "From trained → strong & performance-driven", image: strengthPhoto.url },
  unlimited: { name: "REBEL UNLIMITED", level: "LEVEL 3 • ALL-ACCESS", tagline: "Train everything. One membership.", sub: "Every format, ground floor + fifth floor, together.", count: 10, footer: "Transfer on 6 & 12-month (outsider only, ₹599 ERP) • Smart Switch across formats", image: unlimitedPhoto.url },
};
const HOW = ["Book a free trial class", "Pick your plan", "Walk in to your level's routine — no booking needed", "Move up when your coach says you're ready"];

function GroupClassesPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<ClassLevel>("start");
  const [format, setFormat] = useState<TrainingFormat | null>(null);
  const [pending, setPending] = useState<{ type: "trial" } | { type: "plan"; plan: GroupPlan } | null>(null);
  const [checkout, setCheckout] = useState<GroupPlan | null>(null);
  const meta = LEVELS[tab];
  const selectTab = (next: ClassLevel) => { setTab(next); setPending(null); };
  const perform = (action: { type: "trial" } | { type: "plan"; plan: GroupPlan }) => {
    if (action.type === "trial") void navigate({ to: "/booking" });
    else setCheckout(action.plan);
  };
  const enter = (action: { type: "trial" } | { type: "plan"; plan: GroupPlan }) => {
    if (requiresLevelWarning(tab)) setPending(action); else perform(action);
  };
  useWebMCP({
    name: "get_class_level_details", description: "Read the class level, formats, and package prices currently shown.", annotations: { readOnlyHint: true },
    execute: (_args: Record<string, never>, { signal }) => runWebMCPTool("get_class_level_details", () => {
      if (signal.aborted) throw new Error("Request cancelled.");
      return `${meta.level} ${meta.name}: ${meta.tagline} Formats: ${LEVEL_FORMATS[tab].flatMap(group => group.formats.map(item => item.name)).join(", ")}. Packages: ${GROUP_PLANS[tab].map(plan => `${plan.months} months ₹${plan.price}`).join(", ")}.`;
    }),
  });
  useWebMCP({
    name: "select_class_level", description: "Show the selected REBÉL group class level and its formats and prices.",
    inputSchema: { type: "object", properties: { level: { type: "string", enum: Object.keys(LEVELS) } }, required: ["level"] },
    execute: ({ level }: { level: string }, { signal }) => runWebMCPTool("select_class_level", () => {
      if (signal.aborted) throw new Error("Request cancelled.");
      if (level !== "start" && level !== "strength" && level !== "unlimited") throw new Error("Choose start, strength, or unlimited.");
      flushSync(() => selectTab(level));
      return `Showing ${LEVELS[level].level} ${LEVELS[level].name}.`;
    }),
  });
  return <SiteShell><div className="group-page">
    <section className="container mx-auto px-5 md:px-8 pt-10 md:pt-14 pb-8">
      <p className="font-mono text-xs text-storefront mb-5">REBÉL<TM /> GROUP CLASSES | BANGALORE</p>
      <h1 className="editorial-title">Find your level.<br />Find your people.</h1>
      <p className="text-sm text-muted-foreground mt-4">Start where you are. Move up when you're ready.</p>
    </section>
    <div className="container mx-auto px-5 md:px-8"><div className="group-tabs level-selector" role="tablist" aria-label="Class levels">{(Object.keys(LEVELS) as ClassLevel[]).map((level,index) => <Button key={level} id={`tab-${level}`} role="tab" aria-selected={tab === level} aria-pressed={tab === level} aria-controls="class-level-panel" variant="ghost" onClick={() => selectTab(level)} className={cn("level-option",tab===level && "is-selected")}><span className="level-option-number">0{index+1}</span><span className="level-option-text"><span className="font-mono text-xs">LEVEL {index+1}</span><span className="font-sans font-bold level-option-name">{LEVELS[level].name}<TM /></span><span className="level-option-audience">{index===0 ? "Beginners & comebacks" : index===1 ? "Intermediate & advanced" : "All-access membership"}</span></span><ArrowUpRight className="size-4 shrink-0 level-option-arrow"/></Button>)}</div></div>
    <div id="class-level-panel" role="tabpanel" aria-labelledby={`tab-${tab}`}>
      <section className="container mx-auto px-5 md:px-8 mt-6"><div className="level-feature"><div className="level-feature-photo"><img src={meta.image} alt={`${meta.name} members training together`} className="size-full object-cover"/><span className="level-photo-sticker font-mono text-xs">{meta.count} TRAINING FORMATS</span></div><div className="level-feature-copy"><p className="font-mono text-xs text-storefront">{meta.level}</p><h2 className="font-sans font-bold text-2xl md:text-4xl mt-3">{meta.tagline}</h2><p className="text-sm mt-4">{meta.sub}</p>{tab === "strength" && <p className="font-mono text-[10px] text-storefront mt-4">INTERMEDIATE &amp; ADVANCED ONLY</p>}<Button onClick={() => enter({type:"trial"})} className="rounded-full h-12 px-6 mt-7 bg-foreground text-background hover:bg-foreground/90">Book a free trial <ArrowUpRight className="size-4"/></Button><div className="routine-actions mt-4">{ROUTINE_LEVELS[tab].map(level => <AssetDownloadButton key={level} url={ROUTINES[level].asset.url} filename={ROUTINES[level].filename} label={tab === "unlimited" ? `Download Level ${level === "start" ? "1" : "2"} routine` : "Download routine"}/>)}</div>{tab === "unlimited" && <p className="text-xs mt-3">Level 3 brings both routines together.</p>}</div></div></section>
      <section className="creative-section"><div className="container mx-auto px-5 md:px-8"><Reveal><h2 className="font-sans text-2xl font-bold mb-7">Your training menu.</h2><div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-9">{LEVEL_FORMATS[tab].map(group => <div key={group.category}><p className="font-mono text-[10px] text-storefront mb-5">{group.category}</p><div className="flex flex-wrap gap-3">{group.formats.map(item => <Button key={item.name} variant="outline" onClick={() => setFormat(item)} className="rounded-full bg-foreground text-background border-foreground hover:bg-foreground/85 hover:text-background h-auto min-h-11 px-4 py-3 text-sm whitespace-normal"><Play className="size-3 shrink-0" />{item.name}</Button>)}</div></div>)}</div></Reveal></div></section>
      <section className="creative-section"><div className="container mx-auto px-5 md:px-8"><Reveal><p className="rebel-label mb-4">Your next move</p><h2 className="editorial-title mb-10">How it works.</h2><ol className="process-bubbles">{HOW.map((line,index)=><li key={line}><div className="process-bubble"><span className="process-number font-mono">0{index+1}</span><p className="text-foreground font-medium text-base">{line}</p></div>{index<HOW.length-1 && <ArrowRight className="process-arrow size-5 text-storefront" aria-hidden/>}</li>)}</ol></Reveal></div></section>
      <section className="editorial-section"><div className="container mx-auto px-5 md:px-8"><Reveal><div className="mb-12"><p className="font-mono text-xs text-storefront mb-5">YOUR MEMBERSHIP</p><h2 className="editorial-title">Pick your plan.</h2></div></Reveal><div className={cn("grid sm:grid-cols-2 gap-5",tab === "unlimited" ? "lg:grid-cols-3" : "lg:grid-cols-4")}>{GROUP_PLANS[tab].map(plan => <article key={plan.id} className={cn("group-plan border rounded-lg bg-background p-6 flex flex-col",plan.badge ? "border-primary" : "border-border")}><div className="min-h-7">{plan.badge && <span className="font-mono text-[10px] text-storefront">{plan.badge}</span>}</div><h3 className="font-sans text-sm font-medium">{plan.months} months</h3><p className="group-plan-price text-foreground font-bold mt-5">₹{plan.price.toLocaleString("en-IN")}<span className="text-lg">/-</span></p><p className="text-xs text-muted-foreground mt-2">All inclusive</p><p className="text-sm text-foreground/85 leading-relaxed mt-7 min-h-16">{plan.line}</p><p className="font-mono text-[10px] text-muted-foreground leading-loose mt-5 flex-1">{plan.detail}</p><Button onClick={() => enter({ type: "plan", plan })} className="rounded-full mt-8 h-11">Join this plan<ArrowUpRight className="size-4" /></Button></article>)}</div><p className="font-mono text-[11px] text-muted-foreground mt-8">{meta.footer}</p></div></section>
      <section className="creative-section class-rulebook-section"><div className="container mx-auto px-5 md:px-8"><Reveal><p className="rebel-label mb-4">Straight talk</p><h2 className="editorial-title">Things to know<br/>before joining.</h2><p className="editorial-copy mt-5">How we run classes, coaches and the floor.</p></Reveal><div className="class-rulebook-grid mt-9">{CLASS_RULEBOOK.map((rule,i)=><article key={rule.id} className="class-rule-item"><span className="rule-number font-display">0{i+1}</span><div><h3 className="font-sans text-lg font-bold">{rule.title}</h3><p className="text-sm mt-3 leading-relaxed">{rule.detail}</p></div></article>)}</div><div className="mt-7"><AssetDownloadButton url={rulebook.url} filename="REBEL-Class-Rulebook.jpg" label="Download class rulebook"/></div></div></section>
      <section className="editorial-section"><div className="container mx-auto max-w-4xl px-5 md:px-8"><Reveal><div className="border border-border rounded-lg p-6 md:p-10"><h2 className="font-mono text-xs text-storefront">MEMBERSHIP TERMS — PLEASE READ</h2><ol className="mt-8 space-y-7">{JOINING_RULES.map((rule,index) => <li key={rule} className="flex items-start gap-5"><span className="text-storefront font-mono text-xs pt-1">0{index+1}</span><p className="text-sm text-muted-foreground leading-relaxed">{rule}</p></li>)}</ol></div><p className="text-xs text-muted-foreground leading-relaxed mt-7">Renew on or before your last day = 10% off. Every successful referral = an extra 10% off. No other offers apply.</p><div className="mt-10 border-y border-border py-6"><p className="font-mono text-[10px] text-storefront mb-3">CLASS HOURS</p><p className="text-xs text-muted-foreground leading-loose">{STUDIO_HOURS.map(day => `${day.day === "Saturday" ? "Sat" : day.day === "Sunday" ? "Sun" : day.day} ${day.hours}`).join(" · ")}</p></div><div className="mt-8"><Button onClick={() => enter({ type: "trial" })} variant="outline" className="rounded-full h-12 px-6">Book a free trial →</Button></div></Reveal></div></section>
    </div>
    <Sheet open={!!format} onOpenChange={open => { if (!open) setFormat(null); }}><SheetContent side="bottom" className="rounded-t-lg max-w-2xl mx-auto max-h-[85dvh] overflow-y-auto"><SheetTitle className="text-xl">{format?.name}</SheetTitle><SheetDescription className="mt-3">{format?.line}</SheetDescription><div className="mt-6 aspect-video bg-card rounded-lg overflow-hidden border border-border">{format?.videoUrl ? <iframe src={format.videoUrl} title={`${format.name} class video`} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen className="size-full" /> : <div className="size-full flex flex-col justify-center items-center gap-3 text-muted-foreground"><Play className="size-8 text-storefront" strokeWidth={1} /><span className="font-mono text-xs">Class film coming soon</span></div>}</div></SheetContent></Sheet>
    <Dialog open={!!pending} onOpenChange={open => { if (!open) setPending(null); }}><DialogContent className="w-[calc(100%-32px)] rounded-lg"><DialogTitle className="text-xl leading-relaxed">Level 2 | STRENGTH<TM /></DialogTitle><DialogDescription className="text-base leading-relaxed">Level 2 is for intermediate and advanced members only. Please choose the level that matches where you are today.</DialogDescription><div className="flex flex-col gap-3 mt-4"><Button className="rounded-full" onClick={() => { if (!pending) return; const action = pending; setPending(null); perform(action); }}>I'm ready, continue</Button><Button variant="outline" className="rounded-full" onClick={() => selectTab("start")}>Switch to Level 1</Button></div></DialogContent></Dialog>
    {checkout && <GroupPlanCheckout key={checkout.id} plan={checkout} levelName={meta.name} onClose={() => setCheckout(null)} />}
  </div></SiteShell>;
}
