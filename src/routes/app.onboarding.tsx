import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteShell } from "@/components/SiteShell";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check, ShieldCheck, Stethoscope } from "lucide-react";
import {
  ConcernKey,
  CONCERN_LABEL,
  CONCERN_BLURB,
  MRS_ITEMS,
  MRS_OPTIONS,
  PARQ_ITEMS,
  SYMPTOM_CHIPS,
  IntakeDraft,
  EMPTY_DRAFT,
  loadDraft,
  saveDraft,
  clearDraft,
  mrsTotal,
  parqClearanceRequired,
  persistIntake,
} from "@/lib/intake";

export const Route = createFileRoute("/app/onboarding")({
  validateSearch: (s: Record<string, unknown>) => ({ resume: s.resume === "1" || s.resume === "true" }),
  head: () => ({ meta: [{ title: "Start — REBÉL" }] }),
  component: Onboarding,
});

const TOTAL_STEPS = 9;

function Onboarding() {
  const navigate = useNavigate();
  const { resume } = Route.useSearch();
  const [draft, setDraft] = useState<IntakeDraft>(EMPTY_DRAFT);
  const [step, setStep] = useState(1);
  const [persisting, setPersisting] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    const d = loadDraft();
    setDraft(d);
    if (resume) setStep(8); // jump to "Start properly" after auth round-trip
  }, [resume]);

  // Auto-save
  useEffect(() => { saveDraft(draft); }, [draft]);

  // If returning to step 8+ already signed in with draft → persist
  useEffect(() => {
    if (!resume) return;
    (async () => {
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) return;
      try {
        setPersisting(true);
        await persistIntake(loadDraft());
        toast.success("Your record is saved.");
        setPersisting(false);
      } catch (e) {
        setPersisting(false);
        toast.error(e instanceof Error ? e.message : "Could not save your intake.");
      }
    })();
  }, [resume]);

  const primary = draft.concerns[0];
  const isWomen = draft.about.gender === "female" || draft.about.gender === "";
  const showMrs = primary === "peri" || primary === "meno";
  void isWomen;


  const set = (patch: Partial<IntakeDraft>) => setDraft((d) => ({ ...d, ...patch }));
  const setAbout = (patch: Partial<IntakeDraft["about"]>) => setDraft((d) => ({ ...d, about: { ...d.about, ...patch } }));
  const setConsent = (patch: Partial<IntakeDraft["consents"]>) => setDraft((d) => ({ ...d, consents: { ...d.consents, ...patch } }));

  // Step validation
  const canContinue = useMemo(() => {
    switch (step) {
      case 1: return draft.concerns.length > 0;
      case 2: return draft.about.name.trim().length > 1 && !!draft.about.gender && (!!draft.about.phone || !!draft.about.email);
      case 3: return true;
      case 4: return !showMrs || MRS_ITEMS.every((it) => draft.mrs[it.key] !== undefined);
      case 5: return PARQ_ITEMS.every((it) => draft.parq[it.key] !== undefined);
      case 6: return true;
      case 7: return draft.consents.health_data && draft.consents.waiver;
      case 8: return true;
      default: return true;
    }
  }, [step, draft, showMrs]);

  // Skip MRS step for non peri/meno
  const next = () => {
    let target = step + 1;
    if (target === 4 && !showMrs) target = 5;
    if (target > TOTAL_STEPS) target = TOTAL_STEPS;
    setStep(target);
  };
  const prev = () => {
    let target = step - 1;
    if (target === 4 && !showMrs) target = 3;
    if (target < 1) target = 1;
    setStep(target);
  };

  // Consent step submit: persist or sign-in then persist
  const submitConsent = async () => {
    setPersisting(true);
    saveDraft(draft);
    const { data: sess } = await supabase.auth.getSession();
    if (!sess.session) {
      // Send to /auth, return to /app/onboarding?resume=1
      navigate({ to: "/auth", search: { next: "/app/onboarding?resume=1" } });
      return;
    }
    try {
      await persistIntake(draft);
      toast.success("Your record is saved.");
      setStep(8);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save.");
    } finally {
      setPersisting(false);
    }
  };

  const finish = () => {
    clearDraft();
    navigate({ to: "/app" });
  };

  return (
    <SiteShell>
      <section className="container mx-auto max-w-2xl px-5 py-10 md:py-14">
        {/* Progress */}
        <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          <span>Step {step} of {TOTAL_STEPS}</span>
          <span>{Math.round((step / TOTAL_STEPS) * 100)}%</span>
        </div>
        <div className="h-1 mt-2 bg-secondary/40 rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all" style={{ width: `${(step / TOTAL_STEPS) * 100}%` }} />
        </div>

        <div className="mt-8">
          {step === 1 && <Step1 draft={draft} setConcerns={(c) => set({ concerns: c })} />}
          {step === 2 && <Step2 draft={draft} setAbout={setAbout} />}
          {step === 3 && <Step3 draft={draft} set={set} />}
          {step === 4 && showMrs && <Step4 draft={draft} set={set} />}
          {step === 5 && <Step5 draft={draft} set={set} />}
          {step === 6 && <Step6 draft={draft} set={set} />}
          {step === 7 && <Step7 draft={draft} setConsent={setConsent} onSubmit={submitConsent} persisting={persisting} />}
          {step === 8 && <Step8 />}
          {step === 9 && <Step9 onDone={finish} />}
        </div>

        {/* Nav */}
        {step !== 7 && step !== 9 && (
          <div className="mt-10 flex items-center justify-between">
            <Button variant="ghost" onClick={prev} disabled={step === 1} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            {step < TOTAL_STEPS ? (
              <Button onClick={next} disabled={!canContinue} className="bg-gradient-gold text-primary-foreground border-0 hover:opacity-90">
                Continue <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={finish} className="bg-gradient-gold text-primary-foreground border-0 hover:opacity-90">
                Go to Today <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        )}
      </section>
    </SiteShell>
  );
}

/* ----- Steps ----- */

function Kicker({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] uppercase tracking-[0.18em] text-primary">{children}</p>;
}
function H({ children }: { children: React.ReactNode }) {
  return <h1 className="text-2xl md:text-3xl font-black mt-1">{children}</h1>;
}
function Sub({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-muted-foreground mt-2">{children}</p>;
}

function Step1({ draft, setConcerns }: { draft: IntakeDraft; setConcerns: (c: ConcernKey[]) => void }) {
  const toggle = (k: ConcernKey) => {
    const exists = draft.concerns.includes(k);
    const next = exists ? draft.concerns.filter((x) => x !== k) : [k, ...draft.concerns.filter((x) => x !== k)];
    setConcerns(next);
  };
  const keys: ConcernKey[] = ["peri", "meno", "joints", "bone"];
  return (
    <div>
      <Kicker>Welcome</Kicker>
      <H>What brings you here?</H>
      <Sub>Pick the one that fits best. You can choose more than one — the first you pick becomes your focus.</Sub>
      <div className="mt-6 grid sm:grid-cols-2 gap-3">
        {keys.map((k) => {
          const selected = draft.concerns.includes(k);
          const isPrimary = draft.concerns[0] === k;
          return (
            <button key={k} type="button" onClick={() => toggle(k)}
              className={`text-left rounded-2xl border p-5 transition-all ${selected ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/40"}`}>
              <div className="flex items-center justify-between">
                <p className="font-bold text-lg">{CONCERN_LABEL[k]}</p>
                {selected && <span className="text-[10px] uppercase tracking-widest text-primary">{isPrimary ? "Focus" : "Added"}</span>}
              </div>
              <p className="text-sm text-muted-foreground mt-2">{CONCERN_BLURB[k]}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Step2({ draft, setAbout }: { draft: IntakeDraft; setAbout: (p: Partial<IntakeDraft["about"]>) => void }) {
  const isFemale = draft.about.gender === "female" || draft.about.gender === "";
  return (
    <div>
      <Kicker>About you</Kicker>
      <H>Tell us who you are.</H>
      <Sub>This lives only in your record. We never share it.</Sub>
      <div className="mt-6 grid sm:grid-cols-2 gap-4">
        <Field label="Full name *">
          <Input value={draft.about.name} onChange={(e) => setAbout({ name: e.target.value })} maxLength={120} />
        </Field>
        <Field label="Age">
          <Input type="number" min={18} max={100} value={draft.about.age} onChange={(e) => setAbout({ age: e.target.value })} />
        </Field>
        <Field label="Gender *">
          <Select value={draft.about.gender} onChange={(v) => setAbout({ gender: v as IntakeDraft["about"]["gender"] })}
            options={[["female","Woman"],["male","Man"],["other","Other"],["prefer_not","Prefer not to say"]]} />
        </Field>
        {isFemale && (
          <Field label="Menopause stage">
            <Select value={draft.about.menopause_stage} onChange={(v) => setAbout({ menopause_stage: v as IntakeDraft["about"]["menopause_stage"] })}
              options={[["cycling","Still cycling"],["peri","Perimenopause"],["post","Post-menopause"],["surgical","Surgical menopause"],["na","Prefer not to say"]]} />
          </Field>
        )}
        <Field label="City"><Input value={draft.about.city} onChange={(e) => setAbout({ city: e.target.value })} /></Field>
        <Field label="Language"><Input value={draft.about.language} onChange={(e) => setAbout({ language: e.target.value })} /></Field>
        <Field label="Phone *"><Input type="tel" value={draft.about.phone} onChange={(e) => setAbout({ phone: e.target.value })} /></Field>
        <Field label="Email"><Input type="email" value={draft.about.email} onChange={(e) => setAbout({ email: e.target.value })} /></Field>
        <Field label="How did you hear about us?">
          <Input value={draft.about.source} onChange={(e) => setAbout({ source: e.target.value })} placeholder="Doctor, friend, Instagram…" />
        </Field>
      </div>
    </div>
  );
}

function Step3({ draft, set }: { draft: IntakeDraft; set: (p: Partial<IntakeDraft>) => void }) {
  const primary = draft.concerns[0];
  if (!primary) return null;
  const chips = SYMPTOM_CHIPS[primary] ?? [];
  const toggleChip = (c: string) => {
    const exists = draft.symptom_chips.includes(c);
    set({ symptom_chips: exists ? draft.symptom_chips.filter((x) => x !== c) : [...draft.symptom_chips, c] });
  };
  const setBranch = (k: string, v: unknown) => set({ branch: { ...draft.branch, [k]: v } });

  return (
    <div>
      <Kicker>Your focus · {CONCERN_LABEL[primary]}</Kicker>
      <H>A few specifics, so we measure what matters to you.</H>
      <Sub>Tap anything that sounds like you. None of this is a diagnosis.</Sub>

      <div className="mt-6 flex flex-wrap gap-2">
        {chips.map((c) => {
          const on = draft.symptom_chips.includes(c);
          return (
            <button key={c} type="button" onClick={() => toggleChip(c)}
              className={`text-sm rounded-full px-3 py-1.5 border transition ${on ? "border-primary bg-primary/10 text-foreground" : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"}`}>
              {c}{on ? " ✓" : ""}
            </button>
          );
        })}
      </div>

      <div className="mt-8 space-y-4">
        {(primary === "peri" || primary === "meno") && (
          <>
            <YesNo label="Currently on HRT?" value={draft.branch.on_hrt as boolean | undefined} onChange={(v) => setBranch("on_hrt", v)} />
            <YesNo label="Under a gynaecologist's care?" value={draft.branch.under_gynae as boolean | undefined} onChange={(v) => setBranch("under_gynae", v)} />
          </>
        )}
        {primary === "joints" && (
          <>
            <Field label="Which joints?"><Input value={(draft.branch.joints as string) ?? ""} onChange={(e) => setBranch("joints", e.target.value)} placeholder="e.g. left knee, lower back" /></Field>
            <Field label="Pain right now (1 mild – 5 severe)">
              <input type="range" min={1} max={5} value={(draft.branch.pain as number) ?? 3}
                onChange={(e) => setBranch("pain", Number(e.target.value))} className="w-full accent-primary" />
              <span className="text-sm text-muted-foreground">{(draft.branch.pain as number) ?? 3} / 5</span>
            </Field>
            <YesNo label="Doctor-cleared for resistance training?" value={draft.branch.cleared as boolean | undefined} onChange={(v) => setBranch("cleared", v)} />
          </>
        )}
        {primary === "bone" && (
          <>
            <YesNo label="Had a DEXA scan or diagnosis?" value={draft.branch.dexa as boolean | undefined} onChange={(v) => setBranch("dexa", v)} />
            <YesNo label="Any falls in the last 12 months?" value={draft.branch.falls as boolean | undefined} onChange={(v) => setBranch("falls", v)} />
            <YesNo label="On bone-density medication?" value={draft.branch.bone_meds as boolean | undefined} onChange={(v) => setBranch("bone_meds", v)} />
            <YesNo label="Doctor-cleared for resistance / impact?" value={draft.branch.cleared as boolean | undefined} onChange={(v) => setBranch("cleared", v)} />
          </>
        )}
      </div>
    </div>
  );
}

function Step4({ draft, set }: { draft: IntakeDraft; set: (p: Partial<IntakeDraft>) => void }) {
  const setOne = (k: string, v: number) => set({ mrs: { ...draft.mrs, [k]: v } });
  const total = mrsTotal(draft.mrs);
  return (
    <div>
      <Kicker>Symptom baseline · MRS</Kicker>
      <H>How are you feeling, right now?</H>
      <Sub>This is the validated Menopause Rating Scale. It gives us a number we can move — and prove improving.</Sub>
      <div className="mt-6 space-y-4">
        {MRS_ITEMS.map((it) => (
          <div key={it.key} className="rounded-xl border border-border bg-card p-4">
            <p className="font-medium text-sm">{it.label}</p>
            <div className="mt-3 grid grid-cols-5 gap-1.5">
              {MRS_OPTIONS.map((o) => {
                const sel = draft.mrs[it.key] === o.v;
                return (
                  <button key={o.v} type="button" onClick={() => setOne(it.key, o.v)}
                    className={`text-xs py-2 rounded-md border transition ${sel ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary/40"}`}>
                    {o.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm">
        Baseline score: <span className="font-bold text-primary">{total}</span> / 44 · lower is better. We'll re-score this every block to chart your trend.
      </div>
    </div>
  );
}

function Step5({ draft, set }: { draft: IntakeDraft; set: (p: Partial<IntakeDraft>) => void }) {
  const setOne = (k: string, v: boolean) => set({ parq: { ...draft.parq, [k]: v } });
  const flagged = parqClearanceRequired(draft.parq);
  return (
    <div>
      <Kicker>Safety screen · PAR-Q+</Kicker>
      <H>A short safety check before we train you.</H>
      <Sub>Any "yes" sends you through a gynaecologist first — that's the protocol.</Sub>
      <div className="mt-6 space-y-3">
        {PARQ_ITEMS.map((it) => (
          <div key={it.key} className="rounded-xl border border-border bg-card p-4">
            <p className="text-sm">{it.label}</p>
            <div className="mt-3 flex gap-2">
              <button type="button" onClick={() => setOne(it.key, true)}
                className={`text-xs px-4 py-1.5 rounded-md border ${draft.parq[it.key] === true ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"}`}>Yes</button>
              <button type="button" onClick={() => setOne(it.key, false)}
                className={`text-xs px-4 py-1.5 rounded-md border ${draft.parq[it.key] === false ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"}`}>No</button>
            </div>
          </div>
        ))}
      </div>
      {flagged && (
        <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm">
          <ShieldCheck className="inline w-4 h-4 mr-1 text-amber-500" />
          Based on your answers, we'll route you through a gynaecologist before starting. This is educational, not a diagnosis.
        </div>
      )}
    </div>
  );
}

function Step6({ draft, set }: { draft: IntakeDraft; set: (p: Partial<IntakeDraft>) => void }) {
  return (
    <div>
      <Kicker>Your goal</Kicker>
      <H>In your words — what would change everything?</H>
      <Sub>One sentence is plenty. "Carry my grandchild." "Stop fearing stairs." "Sleep through the night."</Sub>
      <Textarea className="mt-6 min-h-32" value={draft.goal_text} onChange={(e) => set({ goal_text: e.target.value })} maxLength={500} placeholder="Type your goal here…" />
    </div>
  );
}

function Step7({ draft, setConsent, onSubmit, persisting }: { draft: IntakeDraft; setConsent: (p: Partial<IntakeDraft["consents"]>) => void; onSubmit: () => void; persisting: boolean }) {
  return (
    <div>
      <Kicker>Consent</Kicker>
      <H>Before we save your record.</H>
      <Sub>Health-data storage is opt-in. Education works without it. This is not a diagnosis.</Sub>

      <div className="mt-6 space-y-4">
        <ConsentRow required checked={draft.consents.health_data} onChange={(v) => setConsent({ health_data: v })}
          title="Store my health responses (required to save)"
          body="So your coach and gynae partner can personalise your plan and chart your progress. You can export or delete anytime." />
        <ConsentRow required checked={draft.consents.waiver} onChange={(v) => setConsent({ waiver: v })}
          title="I've answered the safety screen honestly (waiver)"
          body="REBÉL is not a medical service. We will route any flagged answer to a clinician before training begins." />
        <ConsentRow checked={draft.consents.marketing} onChange={(v) => setConsent({ marketing: v })}
          title="Send me relevant updates (optional)"
          body="Programs, events, education. Unsubscribe anytime." />
      </div>

      <Button onClick={onSubmit} disabled={!draft.consents.health_data || !draft.consents.waiver || persisting}
        className="mt-8 w-full bg-gradient-gold text-primary-foreground border-0 hover:opacity-90 h-12">
        {persisting ? "Saving…" : "Save my record & continue"}
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
      <p className="text-xs text-muted-foreground mt-3 text-center">If you're not signed in yet, we'll create your account next, then save everything.</p>
    </div>
  );
}

function Step8() {
  return (
    <div>
      <Kicker>Start properly</Kicker>
      <H>Begin with a gynaecologist consult.</H>
      <Sub>Included in your plan · ₹349 for first-time users.</Sub>
      <div className="mt-6 rounded-2xl border border-primary/30 bg-primary/5 p-6">
        <div className="flex items-start gap-3">
          <Stethoscope className="w-6 h-6 text-primary mt-0.5" />
          <div>
            <p className="font-bold">A certified gynaecologist reviews your symptoms</p>
            <p className="text-sm text-muted-foreground mt-1">She uploads a report to your profile. Your coach builds your plan around it.</p>
          </div>
        </div>
        <Button className="mt-5 bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => toast.success("We'll book this from your Today screen.")}>
          <Check className="w-4 h-4 mr-1" /> Book my consult
        </Button>
      </div>
      <div className="mt-6 flex justify-end">
        <NextToTodayButton />
      </div>
    </div>
  );
}
function NextToTodayButton() {
  const navigate = useNavigate();
  return (
    <Button onClick={() => { clearDraft(); navigate({ to: "/app" }); }} className="bg-gradient-gold text-primary-foreground border-0 hover:opacity-90">
      Go to Today <ArrowRight className="w-4 h-4 ml-1" />
    </Button>
  );
}
function Step9({ onDone }: { onDone: () => void }) {
  return (
    <div className="text-center py-12">
      <Kicker>You're in</Kicker>
      <H>Your record is open.</H>
      <Sub>From here, we measure. Then we move it.</Sub>
      <Button onClick={onDone} className="mt-6 bg-gradient-gold text-primary-foreground border-0 hover:opacity-90">Go to Today</Button>
    </div>
  );
}

/* ----- small primitives ----- */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><Label className="text-xs uppercase tracking-widest text-muted-foreground">{label}</Label><div className="mt-1">{children}</div></div>;
}
function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: [string, string][] }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className="w-full h-10 bg-background border border-border rounded-md px-3 text-sm">
      <option value="">Select…</option>
      {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
    </select>
  );
}
function YesNo({ label, value, onChange }: { label: string; value: boolean | undefined; onChange: (v: boolean) => void }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-sm">{label}</p>
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={() => onChange(true)}
          className={`text-xs px-4 py-1.5 rounded-md border ${value === true ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"}`}>Yes</button>
        <button type="button" onClick={() => onChange(false)}
          className={`text-xs px-4 py-1.5 rounded-md border ${value === false ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"}`}>No</button>
      </div>
    </div>
  );
}
function ConsentRow({ required, checked, onChange, title, body }: { required?: boolean; checked: boolean; onChange: (v: boolean) => void; title: string; body: string }) {
  return (
    <label className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 cursor-pointer">
      <Checkbox checked={checked} onCheckedChange={(v) => onChange(!!v)} className="mt-0.5" />
      <div>
        <p className="text-sm font-medium">{title}{required && <span className="text-primary ml-1">*</span>}</p>
        <p className="text-xs text-muted-foreground mt-1">{body}</p>
      </div>
    </label>
  );
}
