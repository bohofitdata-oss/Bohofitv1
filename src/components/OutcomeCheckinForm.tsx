import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type Props = {
  personId: string;
  bookingId?: string | null;
  checkinType: "baseline" | "periodic";
  onDone?: () => void;
};

const FIELDS: Array<{ key: "strength_capability" | "energy" | "sleep_quality" | "joint_comfort" | "overall_wellbeing"; label: string }> = [
  { key: "strength_capability", label: "Strength & capability" },
  { key: "energy", label: "Energy through the day" },
  { key: "sleep_quality", label: "Sleep quality" },
  { key: "joint_comfort", label: "Joint comfort" },
  { key: "overall_wellbeing", label: "Overall wellbeing" },
];

export function OutcomeCheckinForm({ personId, bookingId, checkinType, onDone }: Props) {
  const [vals, setVals] = useState<Record<string, number>>({
    strength_capability: 3, energy: 3, sleep_quality: 3, joint_comfort: 3, overall_wellbeing: 3,
  });
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">
        Thanks — your {checkinType} check-in is saved.
      </div>
    );
  }

  const submit = async () => {
    if (!consent) return toast.error("Please tick the consent box to save your check-in.");
    setLoading(true);
    const { error } = await supabase.from("outcome_checkins").insert({
      person_id: personId,
      booking_id: bookingId ?? null,
      checkin_type: checkinType,
      consent_given: true,
      ...vals,
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    setSubmitted(true);
    onDone?.();
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-primary">{checkinType === "baseline" ? "Baseline check-in" : "Periodic check-in"}</p>
        <h3 className="text-xl font-black mt-1">60-second self-rating</h3>
        <p className="text-xs text-muted-foreground mt-1">1 = poor · 5 = great. Skippable — but it helps your coach.</p>
      </div>
      <div className="space-y-3">
        {FIELDS.map((f) => (
          <div key={f.key}>
            <div className="flex justify-between text-sm">
              <Label>{f.label}</Label>
              <span className="font-bold text-primary">{vals[f.key]}</span>
            </div>
            <input
              type="range" min={1} max={5} step={1}
              value={vals[f.key]}
              onChange={(e) => setVals({ ...vals, [f.key]: Number(e.target.value) })}
              className="w-full mt-1 accent-primary"
            />
          </div>
        ))}
      </div>
      <label className="flex items-start gap-2 text-xs text-muted-foreground cursor-pointer">
        <Checkbox checked={consent} onCheckedChange={(v) => setConsent(!!v)} className="mt-0.5" />
        <span>I agree to REBÉL storing my responses to personalise my coaching. See <Link to="/privacy" className="underline">Privacy Policy</Link>.</span>
      </label>
      <div className="flex gap-2">
        <Button onClick={submit} disabled={loading} className="bg-gradient-gold text-primary-foreground border-0 hover:opacity-90">
          {loading ? "Saving…" : "Save check-in"}
        </Button>
        <Button onClick={() => setSubmitted(true)} variant="outline">Skip</Button>
      </div>
    </div>
  );
}
