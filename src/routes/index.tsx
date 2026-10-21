import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useWebMCP } from "use-webmcp-tool";
import { SiteShell } from "@/components/SiteShell";
import { Testimonials } from "@/components/Testimonials";
import { LocationSection } from "@/components/LocationSection";
import { FAQTeaser } from "@/components/FAQTeaser";
import { ReferralSection } from "@/components/ReferralSection";
import { RebelGallery } from "@/components/RebelGallery";
import { ProgramCarousel } from "@/components/ProgramCarousel";
import { UnpauseMethod } from "@/components/UnpauseMethod";
import { WhatYouGet } from "@/components/WhatYouGet";
import { RebelMethod } from "@/components/RebelMethod";
import { RebelJourney } from "@/components/RebelJourney";

import { Button } from "@/components/ui/button";
import { TM } from "@/components/TM";
import imgStudio from "@/assets/rebel-studio-red.jpg";
import { runWebMCPTool } from "@/lib/webmcp-telemetry";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rebél — The Fitness System People Actually Stick To" },
      { name: "description", content: "75% of our members are still training after a year — because Rebél is built on structure, not machines. Group Classes, UnPause and 50+ by REBÉL in HSR Layout, Bengaluru." },
      { name: "keywords", content: "machine free fitness Bangalore, functional training HSR Layout, group fitness classes, Rebél Unpause, fitness 50+, gym alternative" },
      { property: "og:title", content: "Rebél — Fitness That Doesn't Quit on You" },
      { property: "og:description", content: "Group Classes, UnPause and 50+ by REBÉL. Coach-led, machine-free strength in HSR Layout, Bengaluru." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const navigate = useNavigate();
  useWebMCP({
    name: "open_rebel_offering",
    description: "Open one of the Rebél offerings shown on this page.",
    inputSchema: {
      type: "object",
      properties: {
        offering: { type: "string", enum: ["group_classes", "unpause", "fifty_plus"], description: "The offering to open." },
      },
      required: ["offering"],
    },
    execute: ({ offering }: { offering: string }, { signal }) =>
      runWebMCPTool("open_rebel_offering", async () => {
        if (signal.aborted) throw new Error("Request cancelled.");
        if (!["group_classes", "unpause", "fifty_plus"].includes(offering)) {
          throw new Error("Choose one of the Rebél offerings shown on this page.");
        }
        const route: Record<string, string> = {
          group_classes: "/bohofit",
          unpause: "/longevity",
          fifty_plus: "/fiftyplus",
        };
        await navigate({ href: route[offering] });
        return `Opened ${offering.replaceAll("_", " ")}.`;
      }),
  });
  return (
    <SiteShell>
      <HeroPanel />
      <div id="group-classes" className="scroll-mt-20"><ProgramCarousel /></div>
      <WhatYouGet />
      <div id="unpause" className="scroll-mt-20"><UnpauseMethod /></div>
      <FiftyPlusFlagship />
      <div id="method"><RebelMethod /></div>
      <RebelJourney />




      <Testimonials />
      <LocationSection />
      <RebelGallery />
      <ReferralSection />
      <FAQTeaser />

      <section className="editorial-section"><div className="container mx-auto px-5 md:px-8 text-center"><p className="rebel-label mb-6">For the long run</p><h2 className="editorial-title">Train today.<br />Stay fit for life.</h2><Button asChild className="rounded-full mt-9 px-7 h-11"><Link to="/booking">Speak with us</Link></Button></div></section>
    </SiteShell>
  );
}

/* ───────────────────────── HERO ───────────────────────── */

function HeroPanel() {
  return <section className="member-hero relative flex items-center overflow-hidden">
    <img src={imgStudio} alt="REBÉL training studio" className="absolute inset-0 w-full h-full object-cover" />
    <div aria-hidden className="absolute inset-0 hero-shade" />
    <div className="relative container mx-auto px-5 md:px-8 py-16 md:py-20">
      <p className="font-mono text-[11px] text-foreground/80 mb-6">REBÉL<TM /> | MACHINE-FREE | BENGALURU</p>
      <h1 className="font-medium text-foreground">Fitness you<br />actually finish.</h1>
      <p className="mt-6 text-sm text-foreground/85 max-w-[32ch]">75% of our members are still training a year later.</p>
      <Button asChild variant="secondary" className="rounded-full mt-8 h-11 px-6 bg-foreground text-background hover:bg-foreground/90"><Link to="/booking">Book a free trial →</Link></Button>
    </div>
  </section>;
}

function FiftyPlusFlagship() {
  return <section id="fifty-plus" className="editorial-section scroll-mt-20"><div className="container mx-auto px-5 md:px-8 grid md:grid-cols-2 gap-12 md:gap-20">
    <div><p className="rebel-label text-warm-gold mb-6">1:1 | FREE CONSULTATION</p><h2 className="editorial-title">50+ by REBÉL<TM /></h2><p className="editorial-copy mt-6">Strong. Steady. Independent.</p><Button asChild className="rounded-full mt-8"><Link to="/fiftyplus">Book my free consultation →</Link></Button></div>
    <div className="border-l border-warm-gold/40 pl-7 space-y-6"><p className="text-foreground text-lg">1:1 with a REBÉL Defined Coach · Joint-friendly · Machine-free</p><p className="text-sm text-muted-foreground max-w-[34ch]">Strength for your joints, mobility and balance. Built around your body.</p><p className="text-xs text-muted-foreground">REBÉL Defined Coach — trained to the REBÉL Standard</p></div>
  </div></section>;
}
