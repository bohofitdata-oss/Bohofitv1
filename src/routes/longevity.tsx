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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { SlotPicker } from "@/components/SlotPicker";
import { EmergencyCTA } from "@/components/EmergencyCTA";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProgramSwitcher } from "@/components/ProgramSwitcher";
import { Check, HeartPulse, MessageCircle, Stethoscope, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { saveBooking, PROGRAM_LABEL } from "@/lib/bookings";
import { waLink, BOHOFIT_WHATSAPP, bookingConfirmationMessage } from "@/lib/whatsapp";
import { PaymentScreen } from "@/components/PaymentScreen";
import heroLoop from "../../public/longevity-hero-loop.mp4.asset.json";
import { useBookingPrefill } from "@/hooks/useBookingPrefill";
import { SYMPTOM_CHIPS } from "@/lib/concerns";
import { OutcomeCheckinForm } from "@/components/OutcomeCheckinForm";

export const Route = createFileRoute("/longevity")({
  head: () => ({
    meta: [
      { title: "Rebél Unpause — 1:1 personal training, online or offline" },
      { name: "description", content: "Extremely personal 1:1 training, built around you. Online or at a Rebél centre. 3 sessions a week, 1 hour each. Free 30-min consult before you commit." },
      { property: "og:title", content: "Rebél Unpause — 1:1 personal training" },
    ],
  }),
  component: LongevityPage,
});

const FOCUS_OPTIONS = [
  { key: "perimenopause", title: "Perimenopause", sub: "40s — sleep, weight, mood" },
  { key: "menopause", title: "Menopause & beyond", sub: "strength, bone density, energy" },
  { key: "joints", title: "Joints & knees", sub: "train strong, train safe" },
  { key: "bone_balance", title: "Bone strength & balance", sub: "stay steady, stay independent" },
] as const;
type FocusKey = typeof FOCUS_OPTIONS[number]["key"];

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
  const [focus, setFocus] = useState<FocusKey | null>(null);
  const [chips, setChips] = useState<string[]>([]);
  const [intakeConsent, setIntakeConsent] = useState(false);
  const [mode, setMode] = useState<"offline" | "online">("offline");
  const [primarySlot, setPrimarySlot] = useState<string | null>(null);
  const [secondarySlot, setSecondarySlot] = useState<string | null>(null);
  const [tncChecked, setTncChecked] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState<null | { name: string; slot: string | null }>(null);
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState<"form" | "payment" | "confirmed">("form");
  const [pending, setPending] = useState<null | { bookingId: string; name: string; email: string; phone: string; slot: string | null }>(null);
  const [personId, setPersonId] = useState<string | null>(null);
  const prefill = useBookingPrefill();
  // Gynec consultation booking
  const [consultOpen, setConsultOpen] = useState(false);
  const [consultDate, setConsultDate] = useState<string>("");
  const [consultTime, setConsultTime] = useState<string>("");
  const [consultNotes, setConsultNotes] = useState<string>("");
  const [consultSubmitting, setConsultSubmitting] = useState(false);

  const submitConsultation = async () => {
    const { data: sess } = await supabase.auth.getSession();
    if (!sess.session) {
      toast.error("Please sign in to book a consultation");
      navigate({ to: "/auth" });
      return;
    }
    if (!consultDate) return toast.error("Pick a preferred date");
    setConsultSubmitting(true);
    const { error } = await supabase.from("gynec_consultations").insert({
      user_id: sess.session.user.id,
      preferred_date: consultDate,
      preferred_time: consultTime || null,
      notes: consultNotes || null,
      status: "pending",
    });
    setConsultSubmitting(false);
    if (error) return toast.error(error.message);
    toast.success("Consultation requested — our gynec partner will confirm shortly.");
    setConsultOpen(false);
    // Open WhatsApp confirmation
    const name = (sess.session.user.user_metadata?.full_name as string) || prefill.full_name || "there";
    const msg = `Hi ${name.split(" ")[0]}, your Rebél gynec consultation request is received ✅\nPreferred: ${consultDate}${consultTime ? ` at ${consultTime}` : ""}\nOur partner will confirm within 24 hours.`;
    window.open(waLink(BOHOFIT_WHATSAPP, msg), "_blank", "noopener,noreferrer");
  };

  const formKey = `${prefill.full_name}|${prefill.phone}|${prefill.email}|${prefill.age}|${prefill.city}`;
  const toggleChip = (c: string) => setChips((cs) => (cs.includes(c) ? cs.filter((x) => x !== c) : [...cs, c]));

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
    if (!focus) return toast.error("Pick what's your focus right now");
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
    const focusLabel = FOCUS_OPTIONS.find((f) => f.key === focus)?.title ?? focus;
    const goalWithFocus = `Focus: ${focusLabel}. ${goal}`;

    const result = await saveBooking({
      name: full_name,
      phone,
      email,
      age,
      city,
      goal: goalWithFocus,
      program: "fifty_plus",
      mode,
      primary_slot_id: primarySlot,
      secondary_slot_id: secondarySlot,
      rules_accepted: true,
      is_trial: intent === "consult",
    });
    setLoading(false);
    if (!result.ok) return toast.error(result.error);

    // Capture concern_intake (consent-gated for chips). concern_selected is always saved.
    try {
      const { data: sess } = await supabase.auth.getSession();
      const uid = sess.session?.user.id ?? null;
      setPersonId(uid);
      const concernMap: Record<FocusKey, "perimenopause" | "menopause_beyond" | "joints_knees" | "bone_balance"> = {
        perimenopause: "perimenopause",
        menopause: "menopause_beyond",
        joints: "joints_knees",
        bone_balance: "bone_balance",
      };
      await supabase.from("concern_intake").insert([{
        person_id: uid,
        booking_id: result.bookingId,
        concern_selected: concernMap[focus as FocusKey],
        symptom_chips_selected: intakeConsent ? chips : [],
        consent_given: intakeConsent,
      }]);
    } catch { /* non-blocking */ }

    setSubmitted({ name: full_name, slot: result.primarySlotLabel });
    setPending({ bookingId: result.bookingId, name: full_name, email, phone, slot: result.primarySlotLabel });
    if (intent === "book") setPhase("payment"); else setPhase("confirmed");
  };

  if (phase === "payment" && pending) {
    return (
      <SiteShell>
        <PaymentScreen
          bookingId={pending.bookingId}
          amountInr={30000}
          programLabel={PROGRAM_LABEL.fifty_plus}
          slotLabel={pending.slot}
          customer={{ name: pending.name, email: pending.email, phone: pending.phone }}
          onPaid={() => setPhase("confirmed")}
        />
      </SiteShell>
    );
  }

  if (submitted || phase === "confirmed") {
    const display = pending ?? submitted!;
    const slotLabel = pending?.slot ?? submitted?.slot ?? null;
    return (
      <SiteShell>
        <section className="container mx-auto max-w-xl px-5 py-24 text-center">
          <Reveal>
            <div className="mx-auto w-14 h-14 rounded-full bg-gradient-gold flex items-center justify-center">
              <Check className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="mt-6 text-3xl md:text-4xl font-black">Got it, {display.name.split(" ")[0]}.</h1>
            <p className="mt-3 text-muted-foreground">{PROGRAM_LABEL.fifty_plus} · {mode === "offline" ? "At Rebél centre" : "Online"}{slotLabel ? ` · ${slotLabel}` : ""}</p>
            <p className="mt-2 text-sm font-semibold">Team Rebél will contact you within 2 hours.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild className="bg-[#25D366] text-white border-0 hover:opacity-90">
                <a href={waLink(BOHOFIT_WHATSAPP, bookingConfirmationMessage({ name: display.name, program: PROGRAM_LABEL.fifty_plus, mode: mode === "offline" ? "Offline" : "Online", slot: slotLabel }))} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-4 h-4 mr-2" /> Send confirmation on WhatsApp
                </a>
              </Button>
              <Button onClick={() => navigate({ to: "/" })} variant="outline">Back to home</Button>
            </div>
            {personId && (
              <div className="mt-10 text-left">
                <OutcomeCheckinForm personId={personId} bookingId={pending?.bookingId ?? null} checkinType="baseline" />
              </div>
            )}
          </Reveal>
        </section>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <section className="relative overflow-hidden">
        {/* Background loop video */}
        <video
          src={heroLoop.url}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden
        />
        {/* Dark gradient overlay for legibility */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.55) 40%, rgba(0,0,0,0.85) 100%)",
          }}
          aria-hidden
        />
        <div className="relative container mx-auto px-5 pt-20 pb-16 md:pt-28 md:pb-24 text-center">
          <Reveal>
            <div className="flex justify-center mb-4"><ProgramSwitcher current="longevity" /></div>
            <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "#FF2233" }}>REBÉL UNPAUSE · 1:1</p>
            <h1
              className="mt-3 text-4xl md:text-7xl font-black tracking-tight leading-[1.02] text-white"
              style={{ textShadow: "0 2px 30px rgba(0,0,0,0.7)" }}
            >
              Fitness that fits.<br />
              <span className="italic" style={{ color: "#FF2233" }}>Not machines.</span>
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-white/85" style={{ textShadow: "0 1px 12px rgba(0,0,0,0.7)" }}>
              One coach. One client. Studio, online, or at home. 3 sessions a week, 1 hour each.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm text-white" style={{ borderColor: "rgba(255,255,255,0.25)", background: "rgba(0,0,0,0.4)" }}>
              <HeartPulse className="w-4 h-4" style={{ color: "#FF2233" }} /> ₹30,000 / 36 sessions · 1:1
            </div>
            <p className="mt-3 text-xs text-white/70">Includes gynaecologist support (capped).</p>
          </Reveal>
        </div>
      </section>


      <div className="container mx-auto max-w-3xl px-5 pb-20">
        {/* GYNEC CONSULTATION CARD */}
        <Reveal>
          <div
            className="mt-8 rounded-2xl border bg-white p-6 shadow-lg"
            style={{ borderColor: "rgba(224, 122, 95, 0.25)" }}
          >
            <div className="flex items-start gap-4">
              <div
                className="shrink-0 rounded-full p-3"
                style={{ background: "rgba(224, 122, 95, 0.10)" }}
              >
                <Stethoscope className="w-6 h-6" style={{ color: "#E07A5F" }} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-900">Start with a Gynec Consultation</h3>
                <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                  Get a personalised assessment before your program begins. A certified gynaecologist will review your symptoms and upload a report directly to your profile.
                </p>
                <div
                  className="mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
                  style={{ background: "rgba(224, 122, 95, 0.10)", color: "#B85C4A" }}
                >
                  Included in your plan · ₹349 for first-time users
                </div>
                <div className="mt-4">
                  <Button
                    type="button"
                    size="sm"
                    className="font-semibold"
                    style={{ background: "#E07A5F", color: "#FFFFFF", border: "none" }}
                    onClick={() => setConsultOpen(true)}
                  >
                    Book My Consultation
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <Dialog open={consultOpen} onOpenChange={setConsultOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Book your gynec consultation</DialogTitle>
              <DialogDescription>
                Pick a preferred time. Our gynec partner will confirm and call you. The report will appear in your member dashboard.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3">
              <div>
                <Label htmlFor="consult-date">Preferred date</Label>
                <Input id="consult-date" type="date" min={new Date().toISOString().slice(0,10)} value={consultDate} onChange={(e) => setConsultDate(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="consult-time">Preferred time (optional)</Label>
                <Input id="consult-time" type="time" value={consultTime} onChange={(e) => setConsultTime(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="consult-notes">Anything we should know? (optional)</Label>
                <Textarea id="consult-notes" rows={3} value={consultNotes} onChange={(e) => setConsultNotes(e.target.value)} placeholder="Current medication, recent reports, concerns…" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConsultOpen(false)}>Cancel</Button>
              <Button onClick={submitConsultation} disabled={consultSubmitting} style={{ background: "#E07A5F", color: "#FFFFFF", border: "none" }}>
                {consultSubmitting ? "Sending…" : "Request consultation"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>


        {/* MODE */}
        <Reveal>
          <div className="mt-8">
            <p className="text-xs uppercase tracking-[0.18em] text-primary">Step 1 · Your focus</p>
            <h2 className="mt-1 text-2xl md:text-3xl font-black">What's your focus right now?</h2>
          </div>
        </Reveal>
        <div className="mt-5 grid sm:grid-cols-2 gap-3">
          {FOCUS_OPTIONS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFocus(f.key)}
              className={cn(
                "text-left rounded-xl border bg-card p-4 transition",
                focus === f.key ? "border-primary bg-primary/10" : "border-border hover:border-primary/60",
              )}
            >
              <div className="font-semibold">{f.title}</div>
              <div className="text-xs text-muted-foreground mt-1">{f.sub}</div>
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Already managing an injury or condition? We train around it, with your doctor&rsquo;s clearance.
        </p>

        {/* Symptom chips — appear once a focus is chosen. Visual highlight always works; saving requires consent. */}
        {focus && (() => {
          const focusToConcern: Record<FocusKey, "perimenopause" | "menopause_beyond" | "joints_knees" | "bone_balance"> = {
            perimenopause: "perimenopause", menopause: "menopause_beyond", joints: "joints_knees", bone_balance: "bone_balance",
          };
          const chipList = SYMPTOM_CHIPS[focusToConcern[focus]];
          return (
            <div className="mt-5 rounded-2xl border border-border bg-card p-5">
              <p className="text-sm font-semibold">Tap what you&rsquo;re feeling. Optional — helps your coach.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {chipList.map((c) => {
                  const on = chips.includes(c);
                  return (
                    <button key={c} type="button" onClick={() => toggleChip(c)}
                      className={cn("rounded-full border px-3 py-1.5 text-xs font-medium transition",
                        on ? "border-primary bg-primary/15 text-primary" : "border-border hover:border-primary/60")}>
                      {c}
                    </button>
                  );
                })}
              </div>
              <label className="mt-4 flex items-start gap-2 text-xs text-muted-foreground cursor-pointer">
                <Checkbox checked={intakeConsent} onCheckedChange={(v) => setIntakeConsent(!!v)} className="mt-0.5" />
                <span>I agree to REBÉL storing my responses to personalise my coaching. See <Link to="/privacy" className="underline">Privacy Policy</Link>.</span>
              </label>
              {!intakeConsent && chips.length > 0 && (
                <p className="mt-2 text-[11px] text-muted-foreground">Without consent, your selections won&rsquo;t be saved.</p>
              )}
            </div>
          );
        })()}

        {focus && (
          <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            Your selections are reviewed by our gynec partner before your program is confirmed.
          </p>
        )}

        {/* MODE */}
        <Reveal>
          <div className="mt-10">
            <p className="text-xs uppercase tracking-[0.18em] text-primary">Step 2 · Online or offline</p>
            <h2 className="mt-1 text-2xl md:text-3xl font-black">Where will you train?</h2>
          </div>
        </Reveal>
        <div className="mt-5 grid grid-cols-2 gap-3">
          {(["offline", "online"] as const).map((m) => (
            <button key={m} type="button" onClick={() => setMode(m)} className={cn("rounded-xl border bg-card p-4 font-semibold transition", mode === m ? "border-primary bg-primary/10" : "border-border hover:border-primary/60")}>
              {m === "offline" ? "Offline (Rebél centre)" : "Online (Google Meet)"}
            </button>
          ))}
        </div>

        {/* SLOT */}
        <Reveal>
          <div className="mt-10">
            <p className="text-xs uppercase tracking-[0.18em] text-primary">Step 3 · Pick your hour</p>
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
            <p className="text-xs uppercase tracking-[0.18em] text-primary">Step 4 · Your details</p>
          </div>
        </Reveal>
        <form key={formKey} id="lon-form" onSubmit={(e) => e.preventDefault()} className="mt-5 rounded-2xl border border-border bg-card p-6 space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label htmlFor="full_name">Name</Label><Input id="full_name" name="full_name" required maxLength={120} className="mt-1" defaultValue={prefill.full_name} /></div>
            <div><Label htmlFor="phone">Phone</Label><Input id="phone" name="phone" required maxLength={20} className="mt-1" defaultValue={prefill.phone} /></div>
            <div><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" required maxLength={255} className="mt-1" defaultValue={prefill.email} /></div>
            <div><Label htmlFor="age">Age</Label><Input id="age" name="age" type="number" required min={40} max={100} className="mt-1" defaultValue={prefill.age} /></div>
            <div className="sm:col-span-2"><Label htmlFor="city">City</Label><Input id="city" name="city" required maxLength={80} className="mt-1" defaultValue={prefill.city} /></div>
            <div className="sm:col-span-2"><Label htmlFor="goal">What do you want to achieve?</Label><Textarea id="goal" name="goal" required maxLength={500} rows={3} className="mt-1" placeholder="e.g. Knee pain, want to walk pain-free." /></div>
          </div>
        </form>

        {/* T&C */}
        <Reveal>
          <div className="mt-10">
            <p className="text-xs uppercase tracking-[0.18em] text-primary">Step 5 · The rules</p>
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
