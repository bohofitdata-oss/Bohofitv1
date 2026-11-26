import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useWebMCP } from "use-webmcp-tool";
import { SiteShell } from "@/components/SiteShell";
import { Testimonials } from "@/components/Testimonials";
import { LocationSection } from "@/components/LocationSection";
import { FAQTeaser } from "@/components/FAQTeaser";
import { ReferralSection } from "@/components/ReferralSection";
import { RebelGallery } from "@/components/RebelGallery";
import { ProgramCarousel } from "@/components/ProgramCarousel";

import { WhatYouGet } from "@/components/WhatYouGet";
import { CompareTable } from "@/components/CompareTable";
import { RebelMethod } from "@/components/RebelMethod";
import { RebelJourney } from "@/components/RebelJourney";

import { Button } from "@/components/ui/button";
import { TM } from "@/components/TM";
import heroPhoto from "@/assets/rebel-unlimited-members.jpg.asset.json";
import fiftyPhoto from "@/assets/rebel-fiftyplus-member.webp.asset.json";
import { GOOGLE_REVIEW_SNAPSHOT } from "@/lib/google-review-snapshot";
import { BOHOFIT_PHONE, REBEL_EMAIL } from "@/components/EmergencyCTA";
import { runWebMCPTool } from "@/lib/webmcp-telemetry";

const STUDIO_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ExerciseGym",
  name: "Rebél Fitness Club - Calisthenics Gym",
  alternateName: "REBÉL",
  url: "https://bearebel.in",
  description:
    "Machine-free calisthenics gym and coach-led strength training studio in HSR Layout, Bangalore. Group classes for calisthenics, weightlifting, yoga, spin and Pilates plus 1:1 50+ training.",
  telephone: BOHOFIT_PHONE,
  email: REBEL_EMAIL,
  address: {
    "@type": "PostalAddress",
    streetAddress: "1189, MR Tower, Ground & 5th Floor, 24th Main, Sector 2, HSR Layout",
    addressLocality: "Bengaluru",
    addressRegion: "KA",
    postalCode: "560102",
    addressCountry: "IN",
  },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "07:15", closes: "10:30" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "17:00", closes: "21:30" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "08:30", closes: "11:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "17:00", closes: "19:30" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Sunday", opens: "08:30", closes: "09:30" },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: GOOGLE_REVIEW_SNAPSHOT.rating,
    reviewCount: GOOGLE_REVIEW_SNAPSHOT.totalReviews,
  },
  sameAs: [GOOGLE_REVIEW_SNAPSHOT.listingUrl],
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rebél — Calisthenics & Machine-Free Gym in HSR Layout, Bangalore" },
      { name: "description", content: "Rebél is HSR Layout, Bangalore's coach-led, machine-free calisthenics and strength gym. Group classes (calisthenics, weightlifting, yoga, spin, Pilates) and 1:1 50+ training. Assessment-led levels, dedicated skill coaching and in-house dietitians." },
      { name: "keywords", content: "calisthenics gym Bangalore, calisthenics Bangalore, gym in HSR Layout, machine-free gym Bangalore, group fitness classes HSR Layout, weightlifting classes Bangalore, yoga spin pilates HSR Layout, functional strength training Bangalore, 50+ fitness Bangalore, Cult alternative HSR Layout" },
      { property: "og:title", content: "Rebél — Calisthenics & Machine-Free Gym in Bangalore" },
      { property: "og:description", content: "Coach-led calisthenics, weightlifting, yoga, spin, Pilates and 1:1 50+ strength training in HSR Layout, Bengaluru." },
      { property: "og:url", content: "https://bearebel.in/" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://bearebel.in/" }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(STUDIO_JSON_LD) }],
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
        offering: { type: "string", enum: ["group_classes", "fifty_plus"], description: "The offering to open." },
      },
      required: ["offering"],
    },
    execute: ({ offering }: { offering: string }, { signal }) =>
      runWebMCPTool("open_rebel_offering", async () => {
        if (signal.aborted) throw new Error("Request cancelled.");
        if (!["group_classes", "fifty_plus"].includes(offering)) {
          throw new Error("Choose one of the Rebél offerings shown on this page.");
        }
        const route: Record<string, string> = {
          group_classes: "/bohofit",
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
      <CompareTable />
      <FiftyPlusFlagship />
      <div id="method"><RebelMethod /></div>
      <RebelJourney />




      <Testimonials />
      <RebelGallery />
      <LocationSection />
      <ReferralSection />
      <FAQTeaser />

      <section className="editorial-section"><div className="container mx-auto px-5 md:px-8 text-center"><p className="rebel-label mb-6">For the long run</p><h2 className="editorial-title">Train today.<br />Stay fit for life.</h2><Button asChild className="rounded-full mt-9 px-7 h-11"><Link to="/booking">Speak with us</Link></Button></div></section>
    </SiteShell>
  );
}

/* ───────────────────────── HERO ───────────────────────── */

function HeroPanel() {
  return <section className="member-hero relative flex items-center overflow-hidden">
    <img src={heroPhoto.url} alt="REBÉL members training together in the studio" className="absolute inset-0 w-full h-full object-cover" />
    <div aria-hidden className="absolute inset-0 hero-shade" />
    <div className="relative container mx-auto px-5 md:px-8 py-16 md:py-20">
      <p className="hero-brand-line font-mono text-xs text-foreground mb-6">REBÉL<TM /> | MACHINE-FREE | BANGALORE</p>
      <h1 className="font-medium text-foreground">Fitness you<br />actually finish.</h1>
      <p className="mt-6 text-sm text-foreground/85 max-w-[32ch]">Coach-led group classes. A clear path from your first rep to your next level.</p>
      <Button asChild variant="secondary" className="rounded-full mt-8 h-11 px-6 bg-foreground text-background hover:bg-foreground/90"><Link to="/booking">Book a free trial →</Link></Button>
    </div>
  </section>;
}

function FiftyPlusFlagship() {
  return <section id="fifty-plus" className="editorial-section scroll-mt-20"><div className="container mx-auto px-5 md:px-8 grid md:grid-cols-2 gap-12 md:gap-20">
    <div><p className="rebel-label text-warm-gold mb-6">1:1 | FREE CONSULTATION</p><h2 className="editorial-title">50+ by REBÉL<TM /></h2><p className="editorial-copy mt-6">Strong. Steady. Independent.</p><Button asChild className="rounded-full mt-8"><Link to="/fiftyplus">Book my free consultation →</Link></Button></div>
    <div className="space-y-6"><img src={fiftyPhoto.url} alt="REBÉL member in a green T-shirt practising balance" loading="lazy" className="w-full max-h-[520px] object-contain rounded-lg bg-card" /><p className="text-foreground text-lg">1:1 with a REBÉL Defined Coach · Joint-friendly · Machine-free</p><p className="text-sm text-muted-foreground max-w-[34ch]">Strength for your joints, mobility and balance. Built around your body.</p><p className="text-xs text-muted-foreground">REBÉL Defined Coach — trained to the REBÉL Standard</p></div>
  </div></section>;
}
