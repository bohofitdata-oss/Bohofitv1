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
import { supabase } from "@/integrations/supabase/client.bohofit";
import { toast } from "sonner";
import { ProgramSwitcher } from "@/components/ProgramSwitcher";
import { Check, ShieldCheck, Sparkles, Flame, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { saveBooking, PROGRAM_LABEL } from "@/lib/bookings";
import { waLink, BOHOFIT_WHATSAPP, bookingConfirmationMessage } from "@/lib/whatsapp";
import { PaymentScreen } from "@/components/PaymentScreen";

export const Route = createFileRoute("/bootcamp")({
  head: () => ({
    meta: [
      { title: "Rebel 8-Week Bootcamp — Visible transformation, guaranteed" },
      { name: "description", content: "8-week guaranteed transformation. Online or offline. Mon–Sat, 1 hour/day. 5 spots per slot. Pick your time, accept the rules, start 1st May." },
      { property: "og:title", content: "Rebel 8-Week Bootcamp — Visible transformation, guaranteed" },
    ],
  }),
  component: BootcampPage,
});

const TNC: { key: string; text: string }[] = [
  { key: "duration", text: "I understand this is an 8-week program. I will show up for all 8 weeks." },
  { key: "attendance", text: "I will come to every session — online or at the Rebel centre. Coming is not optional." },
  { key: "frequency", text: "I will train Monday to Saturday. That is 6 days every week, 1 hour each day." },
  { key: "slot_lock", text: "Once 3 people pick the same time, that time is locked. New people must pick a different time." },
  { key: "absence", text: "If I miss a session for a real reason like a long illness or accident, I will give the coach proper doctor papers. Without papers, my access will not be extended." },
  { key: "food_photos", text: "I will upload a photo of every meal I eat through my member dashboard. Every day." },
  { key: "guarantee", text: "Rebel promises results only if I follow every single rule. If I skip the rules, I lose the guarantee." },
  { key: "honesty", text: "I will tell my coach the truth about my food, sleep, and how I feel. No hiding things." },
  { key: "tier", text: "I am picking the right plan for myself. If I need rehab help, I have chosen the Intensive plan." },
  { key: "no_refund", text: "I understand the program fee is for the full 8 weeks. There are no refunds once the program starts." },
];

const schema = z.object({
  full_name: z.string().trim().min(1, "Name is required").max(120),
  phone: z.string().trim().min(6, "Phone is required").max(20),
  email: z.string().trim().email("Email is required").max(255),
  age: z.coerce.number({ invalid_type_error: "Age is required" }).int().min(10).max(100),
  city: z.string().trim().min(1, "City is required").max(80),
  goal: z.string().trim().min(3, "Tell us your goal").max(500),
});

const conditionsList = [
  { key: "thyroid", label: "Thyroid" },
  { key: "pcos", label: "PCOD / PCOS" },
  { key: "fatty_liver", label: "Fatty liver" },
  { key: "diabetes", label: "Diabetes" },
  { key: "back_pain", label: "Back / knee pain" },
  { key: "post_injury", label: "Post-injury rehab" },
];

function BootcampPage() {
  const navigate = useNavigate();
  const [tier, setTier] = useState<"standard" | "intensive">("standard");
  const mode: "offline" = "offline";
  const [primarySlot, setPrimarySlot] = useState<string | null>(null);
  const [secondarySlot, setSecondarySlot] = useState<string | null>(null);
  const [conditions, setConditions] = useState<Record<string, boolean>>({});
  const [needsRehab, setNeedsRehab] = useState(false);
  const [tncChecked, setTncChecked] = useState<Record<string, boolean>>({});
  const [phase, setPhase] = useState<"form" | "payment" | "terms" | "confirmed">("form");
  const [pending, setPending] = useState<null | {
    bookingId: string;
    name: string;
    email: string;
    phone: string;
    slot: string | null;
    amount: number;
  }>(null);
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

  const submit = async (intent: "pay" | "consult", e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!primarySlot) {
      toast.error("Pick a primary time slot");
      return;
    }
    // Terms moved to after payment — no pre-payment gate.

    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse(Object.fromEntries(fd));
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Check the form");
      return;
    }
    setLoading(true);
    const { full_name, phone, email, age, city, goal } = parsed.data;
    const conditionsArr = Object.entries(conditions).filter(([, v]) => v).map(([k]) => k);

    const result = await saveBooking({
      name: full_name,
      phone,
      email,
      age,
      city,
      goal,
      program: "bootcamp",
      plan: tier,
      mode,
      health_conditions: conditionsArr,
      primary_slot_id: primarySlot,
      secondary_slot_id: secondarySlot,
      rules_accepted: true,
      is_trial: intent === "consult",
    });
    setLoading(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    const amount = tier === "intensive" ? 18999 : 14999;
    setPending({ bookingId: result.bookingId, name: full_name, email, phone, slot: result.primarySlotLabel, amount });
    setPhase(intent === "pay" ? "payment" : "confirmed");
  };

  if (phase === "payment" && pending) {
    return (
      <SiteShell>
        <PaymentScreen
          bookingId={pending.bookingId}
          amountInr={pending.amount}
          programLabel={PROGRAM_LABEL.bootcamp}
          planLabel={tier === "intensive" ? "Intensive" : "Standard"}
          slotLabel={pending.slot}
          customer={{ name: pending.name, email: pending.email, phone: pending.phone }}
          onPaid={() => setPhase("confirmed")}
        />
      </SiteShell>
    );
  }

  if (phase === "confirmed" && pending) {
    return (
      <SiteShell>
        <section className="container mx-auto max-w-xl px-5 py-24 text-center">
          <Reveal>
            <div className="mx-auto w-14 h-14 rounded-full bg-gradient-gold flex items-center justify-center">
              <Check className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="mt-6 text-3xl md:text-4xl font-black">You're in, {pending.name.split(" ")[0]}.</h1>
            <p className="mt-3 text-muted-foreground">{PROGRAM_LABEL.bootcamp} · {tier === "intensive" ? "Intensive" : "Standard"} · {mode === "offline" ? "At Rebel centre" : "Online"}{pending.slot ? ` · ${pending.slot}` : ""}</p>
            <p className="mt-2 text-sm font-semibold">Team Rebel will contact you within 2 hours.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild className="bg-[#25D366] text-white border-0 hover:opacity-90">
                <a href={waLink(BOHOFIT_WHATSAPP, bookingConfirmationMessage({ name: pending.name, program: PROGRAM_LABEL.bootcamp, mode: mode === "offline" ? "Offline" : "Online", plan: tier === "intensive" ? "Intensive" : "Standard", slot: pending.slot }))} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-4 h-4 mr-2" /> Send confirmation on WhatsApp
                </a>
              </Button>
              <Button onClick={() => navigate({ to: "/auth" })} className="bg-gradient-gold text-primary-foreground border-0 hover:opacity-90">Create account</Button>
              <Button onClick={() => navigate({ to: "/" })} variant="outline">Back to home</Button>
            </div>
          </Reveal>
        </section>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      {/* HERO */}
      <section className="container mx-auto px-5 pt-20 pb-10 text-center">
        <Reveal>
          <div className="flex justify-center mb-4"><ProgramSwitcher current="bootcamp" /></div>
          <p className="text-xs uppercase tracking-[0.18em] text-primary">Rebel Bootcamp — 8 weeks</p>
          <h1 className="mt-3 text-4xl md:text-6xl font-black tracking-tight">
            Guaranteed transformation in <span className="text-gradient-gold">8 weeks.</span>
          </h1>
          <p className="mt-5 text-muted-foreground max-w-xl mx-auto">
            Studio, online, or at home with a coach. Mon–Sat, 1 hour/day. 5 spots per time slot.
          </p>
        </Reveal>
      </section>

      <form onSubmit={(e) => e.preventDefault()} className="container mx-auto max-w-3xl px-5 pb-20">
        {/* TIER */}
        <Reveal>
          <div className="mt-6">
            <p className="text-xs uppercase tracking-[0.18em] text-primary">Step 1 · Pick your plan</p>
            <h2 className="mt-1 text-2xl md:text-3xl font-black">Standard or Intensive?</h2>
            <p className="text-sm text-muted-foreground mt-1">Pick honestly. The Intensive plan includes rehab support.</p>
          </div>
        </Reveal>
        <div className="mt-5 grid sm:grid-cols-2 gap-4">
          <button type="button" onClick={() => setTier("standard")} className={cn("text-left rounded-2xl border bg-card p-5 transition", tier === "standard" ? "border-primary shadow-elegant" : "border-border hover:border-primary/60")}>
            <Sparkles className="w-5 h-5 text-primary" />
            <div className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">Standard</div>
            <div className="text-3xl font-black">₹14,999</div>
            <p className="mt-2 text-sm text-muted-foreground">For general transformation. No active injuries or chronic conditions.</p>
          </button>
          <button type="button" onClick={() => { setTier("intensive"); setNeedsRehab(true); }} className={cn("text-left rounded-2xl border bg-card p-5 transition", tier === "intensive" ? "border-primary shadow-elegant" : "border-border hover:border-primary/60")}>
            <Flame className="w-5 h-5 text-primary" />
            <div className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">Intensive · with rehab</div>
            <div className="text-3xl font-black">₹18,999</div>
            <p className="mt-2 text-sm text-muted-foreground">For thyroid, PCOS, fatty liver, post-injury. Includes rehab protocol.</p>
          </button>
        </div>

        {/* Bootcamp is offline-only at the Rebel centre. */}


        {/* CONDITIONS */}
        <Reveal>
          <div className="mt-10">
            <p className="text-xs uppercase tracking-[0.18em] text-primary">Step 3 · Tell us your body</p>
            <h2 className="mt-1 text-2xl md:text-3xl font-black">Any of these apply to you?</h2>
            <p className="text-sm text-muted-foreground mt-1">So your coach can build the right plan.</p>
          </div>
        </Reveal>
        <div className="mt-5 grid sm:grid-cols-3 gap-2">
          {conditionsList.map((c) => (
            <label key={c.key} className={cn("rounded-xl border bg-card p-3 text-sm cursor-pointer flex items-center gap-2", conditions[c.key] ? "border-primary bg-primary/10" : "border-border")}>
              <Checkbox checked={!!conditions[c.key]} onCheckedChange={(v) => setConditions({ ...conditions, [c.key]: !!v })} />
              {c.label}
            </label>
          ))}
        </div>

        {/* SLOT */}
        <Reveal>
          <div className="mt-10">
            <p className="text-xs uppercase tracking-[0.18em] text-primary">Step 4 · Pick your time</p>
            <h2 className="mt-1 text-2xl md:text-3xl font-black">Choose your hour, Mon–Sat</h2>
            <p className="text-sm text-muted-foreground mt-1">5 spots per slot. A slot locks once 3 people confirm — others move to the next slot.</p>
          </div>
        </Reveal>
        <div className="mt-5 rounded-2xl border border-border bg-card p-5">
          <SlotPicker program="bootcamp" primaryId={primarySlot} secondaryId={secondarySlot} onPrimary={setPrimarySlot} onSecondary={setSecondarySlot} />
        </div>

        {/* DETAILS */}
        <Reveal>
          <div className="mt-10">
            <p className="text-xs uppercase tracking-[0.18em] text-primary">Step 5 · Your details</p>
          </div>
        </Reveal>
        <form onSubmit={(e) => submit("pay", e)} className="mt-5 rounded-2xl border border-border bg-card p-6 space-y-5" id="bootcamp-form">
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label htmlFor="full_name">Name</Label><Input id="full_name" name="full_name" required maxLength={120} className="mt-1" /></div>
            <div><Label htmlFor="phone">Phone</Label><Input id="phone" name="phone" required maxLength={20} className="mt-1" /></div>
            <div><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" required maxLength={255} className="mt-1" /></div>
            <div><Label htmlFor="age">Age</Label><Input id="age" name="age" type="number" required min={10} max={100} className="mt-1" /></div>
            <div className="sm:col-span-2"><Label htmlFor="city">City</Label><Input id="city" name="city" required maxLength={80} className="mt-1" /></div>
            <div className="sm:col-span-2"><Label htmlFor="goal">What do you want to achieve?</Label><Textarea id="goal" name="goal" required maxLength={500} rows={3} className="mt-1" /></div>
          </div>
        </form>

        {/* Terms appear AFTER payment, not before. */}


        {/* CTAS */}
        <div className="mt-8 grid sm:grid-cols-2 gap-3">
          <Button
            type="button"
            size="lg"
            disabled={loading}
            onClick={() => {
              const formEl = document.getElementById("bootcamp-form") as HTMLFormElement | null;
              if (formEl) submit("pay", { preventDefault: () => {}, currentTarget: formEl } as unknown as React.FormEvent<HTMLFormElement>);
            }}
            className="bg-gradient-gold text-primary-foreground border-0 hover:opacity-90"
          >
            <ShieldCheck className="w-4 h-4 mr-2" /> Pay &amp; book my slot
          </Button>
          <Button
            type="button"
            size="lg"
            variant="outline"
            disabled={loading}
            onClick={() => {
              const formEl = document.getElementById("bootcamp-form") as HTMLFormElement | null;
              if (formEl) submit("consult", { preventDefault: () => {}, currentTarget: formEl } as unknown as React.FormEvent<HTMLFormElement>);
            }}
          >
            Need a consultation first
          </Button>
        </div>
        <p className="mt-3 text-xs text-muted-foreground text-center">Secure payment via Razorpay. Prefer to talk first? Tap &ldquo;Need a consultation&rdquo; — we&rsquo;ll call within 24 hours.</p>

        <EmergencyCTA />

        <Reveal>
          <div className="mt-10 rounded-2xl bg-card border border-border p-6 text-sm text-muted-foreground">
            <p className="font-bold text-foreground">Already on the way?</p>
            <p className="mt-1">If you have a returning member account, <Link to="/auth" className="text-primary underline">sign in</Link> first so this booking links to your dashboard.</p>
          </div>
        </Reveal>
      </form>
    </SiteShell>
  );
}
