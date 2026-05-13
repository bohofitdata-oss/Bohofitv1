import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { SiteShell } from "@/components/SiteShell";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { SlotPicker } from "@/components/SlotPicker";
import { EmergencyCTA } from "@/components/EmergencyCTA";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProgramSwitcher } from "@/components/ProgramSwitcher";
import { Check, HeartPulse, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { saveBooking, PROGRAM_LABEL } from "@/lib/bookings";
import { waLink, BOHOFIT_WHATSAPP, bookingConfirmationMessage } from "@/lib/whatsapp";

export const Route = createFileRoute("/longevity")({
  head: () => ({
    meta: [
      { title: "Boho at 50+ — 1:1 personal training, online or offline" },
      { name: "description", content: "Extremely personal 1:1 training for 50+. Online or at a Bohofit centre. Pick your own hour, Mon–Sat. Free 30-min consult before you commit." },
      { property: "og:title", content: "Boho at 50+ — 1:1 personal training" },
    ],
  }),
  component: LongevityPage,
});

const TNC = [
  { key: "duration", text: "I understand this is a 12-week 1:1 program." },
  { key: "frequency", text: "I will train at my chosen time, Mon–Sat. 1 hour each day." },
  { key: "absence", text: "If I miss a session for a real reason like illness or accident, I will give the coach proper doctor papers. Without papers, my access will not be extended." },
  { key: "honesty", text: "I will tell my coach the truth about pain, sleep, food, and how I feel." },
  { key: "consult_first", text: "I understand I will have a free 30-minute consult before any payment." },
];

const schema = z.object({
  full_name: z.string().trim().min(1, "Name is required").max(120),
  phone: z.string().trim().min(6, "Phone is required").max(20),
  email: z.string().trim().email("Email is required").max(255),
  age: z.coerce.number({ invalid_type_error: "Age is required" }).int().min(40).max(100),
  city: z.string().trim().min(1, "City is required").max(80),
  goal: z.string().trim().min(3, "Tell us your goal").max(500),
});

function LongevityPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"offline" | "online">("offline");
  const [primarySlot, setPrimarySlot] = useState<string | null>(null);
  const [secondarySlot, setSecondarySlot] = useState<string | null>(null);
  const [tncChecked, setTncChecked] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState<null | { name: string; slot: string | null }>(null);
  const [loading, setLoading] = useState(false);

  const allTncAccepted = TNC.every((t) => tncChecked[t.key]);

  const scrollToFirstUncheckedTnc = () => {
    const missing = TNC.find((t) => !tncChecked[t.key]);
    if (!missing) return;
    const el = document.getElementById(`tnc-${missing.key}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("ring-2", "ring-primary");
      setTimeout(() => el.classList.remove("ring-2", "ring-primary"), 1600);
    }
  };

  const submit = async (intent: "consult" | "book", e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!primarySlot) return toast.error("Pick a primary time");
    if (!allTncAccepted) {
      toast.error("Please accept every term & condition");
      scrollToFirstUncheckedTnc();
      return;
    }
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse(Object.fromEntries(fd));
    if (!parsed.success) return toast.error(parsed.error.issues[0]?.message ?? "Check the form");
    setLoading(true);
    const { full_name, phone, email, age, city, goal } = parsed.data;

    const result = await saveBooking({
      name: full_name,
      phone,
      email,
      age,
      city,
      goal,
      program: "fifty_plus",
      mode,
      primary_slot_id: primarySlot,
      secondary_slot_id: secondarySlot,
      rules_accepted: true,
      is_trial: intent === "consult",
    });
    setLoading(false);
    if (!result.ok) return toast.error(result.error);
    setSubmitted({ name: full_name, slot: result.primarySlotLabel });
  };

  if (submitted) {
    return (
      <SiteShell>
        <section className="container mx-auto max-w-xl px-5 py-24 text-center">
          <Reveal>
            <div className="mx-auto w-14 h-14 rounded-full bg-gradient-gold flex items-center justify-center">
              <Check className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="mt-6 text-3xl md:text-4xl font-black">Got it, {submitted.name.split(" ")[0]}.</h1>
            <p className="mt-3 text-muted-foreground">{PROGRAM_LABEL.fifty_plus} · {mode === "offline" ? "At Bohofit centre" : "Online"}{submitted.slot ? ` · ${submitted.slot}` : ""}</p>
            <p className="mt-2 text-sm text-muted-foreground">Your coach will call within 24 hours. We always start with a free 30-minute consult — no sales pressure.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild className="bg-[#25D366] text-white border-0 hover:opacity-90">
                <a href={waLink(BOHOFIT_WHATSAPP, bookingConfirmationMessage({ name: submitted.name, program: PROGRAM_LABEL.fifty_plus, mode: mode === "offline" ? "Offline" : "Online", slot: submitted.slot }))} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-4 h-4 mr-2" /> Send confirmation on WhatsApp
                </a>
              </Button>
              <Button onClick={() => navigate({ to: "/" })} variant="outline">Back to home</Button>
            </div>
          </Reveal>
        </section>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <section className="container mx-auto px-5 pt-20 pb-10 text-center">
        <Reveal>
          <div className="flex justify-center mb-4"><ProgramSwitcher current="longevity" /></div>
          <p className="text-xs uppercase tracking-[0.18em] text-primary">Bohofit at 50+ · 1:1</p>
          <h1 className="mt-3 text-4xl md:text-6xl font-black tracking-tight">
            Move pain-free. <span className="text-gradient-gold">Age strong.</span>
          </h1>
          <p className="mt-5 text-muted-foreground max-w-xl mx-auto">
            One coach. One client. Studio, online, or at home. Mon–Sat, 1 hour/day.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm">
            <HeartPulse className="w-4 h-4 text-primary" /> ₹29,999 / 12 weeks · 1:1
          </div>
        </Reveal>
      </section>

      <div className="container mx-auto max-w-3xl px-5 pb-20">
        {/* MODE */}
        <Reveal>
          <div className="mt-8">
            <p className="text-xs uppercase tracking-[0.18em] text-primary">Step 1 · Online or offline</p>
            <h2 className="mt-1 text-2xl md:text-3xl font-black">Where will you train?</h2>
          </div>
        </Reveal>
        <div className="mt-5 grid grid-cols-2 gap-3">
          {(["offline", "online"] as const).map((m) => (
            <button key={m} type="button" onClick={() => setMode(m)} className={cn("rounded-xl border bg-card p-4 font-semibold transition", mode === m ? "border-primary bg-primary/10" : "border-border hover:border-primary/60")}>
              {m === "offline" ? "Offline (Bohofit centre)" : "Online (Google Meet)"}
            </button>
          ))}
        </div>

        {/* SLOT */}
        <Reveal>
          <div className="mt-10">
            <p className="text-xs uppercase tracking-[0.18em] text-primary">Step 2 · Pick your hour</p>
            <h2 className="mt-1 text-2xl md:text-3xl font-black">Your dedicated time, Mon–Sat</h2>
            <p className="text-sm text-muted-foreground mt-1">1 spot per slot — it&rsquo;s 1:1, just you and your coach.</p>
          </div>
        </Reveal>
        <div className="mt-5 rounded-2xl border border-border bg-card p-5">
          <SlotPicker program="longevity" primaryId={primarySlot} secondaryId={secondarySlot} onPrimary={setPrimarySlot} onSecondary={setSecondarySlot} />
        </div>

        {/* DETAILS */}
        <Reveal>
          <div className="mt-10">
            <p className="text-xs uppercase tracking-[0.18em] text-primary">Step 3 · Your details</p>
          </div>
        </Reveal>
        <form id="lon-form" onSubmit={(e) => e.preventDefault()} className="mt-5 rounded-2xl border border-border bg-card p-6 space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label htmlFor="full_name">Name</Label><Input id="full_name" name="full_name" required maxLength={120} className="mt-1" /></div>
            <div><Label htmlFor="phone">Phone</Label><Input id="phone" name="phone" required maxLength={20} className="mt-1" /></div>
            <div><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" maxLength={255} className="mt-1" /></div>
            <div><Label htmlFor="age">Age</Label><Input id="age" name="age" type="number" min={40} max={100} className="mt-1" /></div>
            <div className="sm:col-span-2"><Label htmlFor="city">City</Label><Input id="city" name="city" maxLength={80} className="mt-1" /></div>
            <div className="sm:col-span-2"><Label htmlFor="goal">What do you want to achieve?</Label><Textarea id="goal" name="goal" maxLength={500} rows={3} className="mt-1" placeholder="e.g. Knee pain, want to walk pain-free." /></div>
          </div>
        </form>

        {/* T&C */}
        <Reveal>
          <div className="mt-10">
            <p className="text-xs uppercase tracking-[0.18em] text-primary">Step 4 · The rules</p>
            <h2 className="mt-1 text-2xl md:text-3xl font-black">Tick every box.</h2>
          </div>
        </Reveal>
        <div className="mt-5 rounded-2xl border border-border bg-card p-5 space-y-3">
          {TNC.map((t, i) => (
            <label key={t.key} id={`tnc-${t.key}`} className={cn("scroll-mt-24 flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition", tncChecked[t.key] ? "border-primary bg-primary/5" : "border-border hover:border-primary/40")}>
              <Checkbox className="mt-0.5" checked={!!tncChecked[t.key]} onCheckedChange={(v) => setTncChecked({ ...tncChecked, [t.key]: !!v })} />
              <span className="text-sm leading-relaxed"><span className="font-bold text-primary">Rule {i + 1}.</span> {t.text}</span>
            </label>
          ))}
        </div>

        <div className="mt-8 grid sm:grid-cols-2 gap-3">
          <Button
            type="button"
            size="lg"
            disabled={loading}
            onClick={() => {
              const formEl = document.getElementById("lon-form") as HTMLFormElement | null;
              if (formEl) submit("consult", { preventDefault: () => {}, currentTarget: formEl } as unknown as React.FormEvent<HTMLFormElement>);
            }}
            className="bg-gradient-gold text-primary-foreground border-0 hover:opacity-90"
          >
            Book my free 30-min consult
          </Button>
          <Button
            type="button"
            size="lg"
            variant="outline"
            disabled={loading}
            onClick={() => {
              const formEl = document.getElementById("lon-form") as HTMLFormElement | null;
              if (formEl) submit("book", { preventDefault: () => {}, currentTarget: formEl } as unknown as React.FormEvent<HTMLFormElement>);
            }}
          >
            I&rsquo;m ready — reserve my slot
          </Button>
        </div>

        <EmergencyCTA />

        <Reveal>
          <div className="mt-10 rounded-2xl bg-card border border-border p-6 text-sm text-muted-foreground">
            Already enrolled? <Link to="/longevity/me" className="text-primary underline">Open your member home</Link> ·{" "}
            <Link to="/auth" className="text-primary underline">Sign in</Link>
          </div>
        </Reveal>
      </div>
    </SiteShell>
  );
}
