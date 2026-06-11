// Intake state, MRS scoring, localStorage draft + persistence.
import { supabase } from "@/integrations/supabase/client";

export type ConcernKey = "peri" | "meno" | "joints" | "bone" | "general";

// Map UI key → DB enum value (existing concern_kind in DB).
export const CONCERN_DB: Record<ConcernKey, "perimenopause" | "menopause_beyond" | "joints_knees" | "bone_balance" | "general"> = {
  peri: "perimenopause",
  meno: "menopause_beyond",
  joints: "joints_knees",
  bone: "bone_balance",
  general: "general",
};

export const CONCERN_LABEL: Record<ConcernKey, string> = {
  peri: "Perimenopause",
  meno: "Menopause & beyond",
  joints: "Joints & knees",
  bone: "Bone strength & balance",
  general: "General strength",
};

export const CONCERN_BLURB: Record<ConcernKey, string> = {
  peri: "Cycles changing, symptoms creeping in. We measure them and move them.",
  meno: "Hormone protection is gone — we train the body it used to protect.",
  joints: "Knees, hips, back. Pain mapped, strength rebuilt, function tracked.",
  bone: "Bone density, balance, falls. The protocol that proves you're safer.",
  general: "Strength as a health asset — measured monthly, never aesthetic.",
};

// Menopause Rating Scale (MRS) — 11 items, 0–4 each. Lower = better.
export const MRS_ITEMS: { key: string; label: string }[] = [
  { key: "hot_flushes", label: "Hot flushes, sweating" },
  { key: "heart_discomfort", label: "Heart discomfort (racing, skipping)" },
  { key: "sleep", label: "Sleep problems" },
  { key: "depressive", label: "Depressive mood" },
  { key: "irritability", label: "Irritability" },
  { key: "anxiety", label: "Anxiety" },
  { key: "exhaustion", label: "Physical & mental exhaustion" },
  { key: "sexual", label: "Sexual problems" },
  { key: "bladder", label: "Bladder problems" },
  { key: "dryness", label: "Dryness of vagina" },
  { key: "joint_muscle", label: "Joint & muscular discomfort" },
];

export const MRS_OPTIONS = [
  { v: 0, label: "None" },
  { v: 1, label: "Mild" },
  { v: 2, label: "Moderate" },
  { v: 3, label: "Severe" },
  { v: 4, label: "Very severe" },
];

// PAR-Q+ short screen
export const PARQ_ITEMS: { key: string; label: string }[] = [
  { key: "heart", label: "Has a doctor ever said you have a heart condition or high blood pressure?" },
  { key: "chest_pain", label: "Do you feel chest pain at rest, during daily activities, or with exercise?" },
  { key: "dizziness", label: "Do you lose balance from dizziness or have you lost consciousness in the last 12 months?" },
  { key: "chronic", label: "Do you have a chronic medical condition (other than the above)?" },
  { key: "medications", label: "Are you currently taking prescribed medications for a chronic condition?" },
  { key: "joint_problem", label: "Do you have a bone, joint or soft-tissue problem made worse by activity?" },
  { key: "supervised", label: "Has a doctor said you should only do supervised physical activity?" },
  { key: "pregnant", label: "Are you currently pregnant or recently post-partum?" },
];

export const SYMPTOM_CHIPS: Record<ConcernKey, string[]> = {
  peri: ["Hot flushes", "Sleep trouble", "Mood swings", "Weight gain", "Irregular cycle", "Brain fog"],
  meno: ["Low energy", "Strength loss", "Belly fat", "Hot flushes", "Sleep trouble", "Low mood"],
  joints: ["Knee pain", "Hip pain", "Back pain", "Stiff mornings", "Stairs are hard", "Old injury"],
  bone: ["Fear of falling", "Balance issues", "Low bone density", "Posture", "Weak grip", "Knee buckling"],
  general: ["Low energy", "Stiffness", "Weight gain", "Weak grip", "Poor posture", "Stress"],
};

export type IntakeDraft = {
  concerns: ConcernKey[];
  about: {
    name: string;
    age: string;
    gender: "female" | "male" | "other" | "prefer_not" | "";
    menopause_stage: "cycling" | "peri" | "post" | "surgical" | "na" | "";
    city: string;
    language: string;
    phone: string;
    email: string;
    source: string;
  };
  branch: Record<string, unknown>;       // free-form per concern
  symptom_chips: string[];
  mrs: Record<string, number>;            // key → 0..4
  parq: Record<string, boolean>;
  goal_text: string;
  consents: { health_data: boolean; marketing: boolean; waiver: boolean };
};

export const EMPTY_DRAFT: IntakeDraft = {
  concerns: [],
  about: { name: "", age: "", gender: "", menopause_stage: "", city: "", language: "English", phone: "", email: "", source: "" },
  branch: {},
  symptom_chips: [],
  mrs: {},
  parq: {},
  goal_text: "",
  consents: { health_data: false, marketing: false, waiver: false },
};

const KEY = "rebel.intake.v1";

export function loadDraft(): IntakeDraft {
  if (typeof window === "undefined") return EMPTY_DRAFT;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY_DRAFT;
    return { ...EMPTY_DRAFT, ...JSON.parse(raw) };
  } catch { return EMPTY_DRAFT; }
}
export function saveDraft(d: IntakeDraft) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(d));
}
export function clearDraft() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}

export function mrsTotal(mrs: Record<string, number>): number {
  return MRS_ITEMS.reduce((sum, it) => sum + (Number(mrs[it.key]) || 0), 0);
}

export function parqClearanceRequired(parq: Record<string, boolean>): boolean {
  return PARQ_ITEMS.some((it) => parq[it.key] === true);
}

/**
 * Persist the full intake draft to Supabase for the currently-signed-in user.
 * Creates: members → consents, intake_responses, symptom_checkins (if peri/meno + opt-in).
 * Idempotent on member (uses upsert on user_id).
 */
export async function persistIntake(draft: IntakeDraft): Promise<{ memberId: string }> {
  const { data: sess } = await supabase.auth.getSession();
  const user = sess.session?.user;
  if (!user) throw new Error("Not signed in");

  const primary = draft.concerns[0] ?? "general";
  const ageNum = draft.about.age ? parseInt(draft.about.age, 10) : null;

  // Upsert member
  const { data: mUp, error: mErr } = await supabase
    .from("members")
    .upsert(
      {
        user_id: user.id,
        name: draft.about.name || user.email?.split("@")[0] || "Member",
        age: ageNum,
        gender: (draft.about.gender || null) as never,
        menopause_stage: (draft.about.menopause_stage || null) as never,
        primary_concern: CONCERN_DB[primary] as never,
        city: draft.about.city || null,
        language: draft.about.language || null,
        phone: draft.about.phone || null,
        email: draft.about.email || user.email || null,
        source: draft.about.source || null,
      },
      { onConflict: "user_id" },
    )
    .select("id")
    .single();
  if (mErr || !mUp) throw mErr ?? new Error("Could not save member");
  const memberId = mUp.id as string;

  // Consents (always recorded — waiver + opt-ins)
  await supabase.from("consents").insert({
    member_id: memberId,
    health_data_opt_in: draft.consents.health_data,
    marketing_opt_in: draft.consents.marketing,
    waiver_accepted: draft.consents.waiver,
    version: "v1",
  });

  // Intake responses (only if health data opt-in — that's the rule)
  if (draft.consents.health_data) {
    await supabase.from("intake_responses").insert({
      member_id: memberId,
      concern: CONCERN_DB[primary] as never,
      responses: { branch: draft.branch, symptom_chips: draft.symptom_chips, concerns: draft.concerns } as never,
      par_q: draft.parq as never,
      clearance_required: parqClearanceRequired(draft.parq),
      goal_text: draft.goal_text || null,
    });

    // Baseline MRS for peri/meno concerns
    if ((primary === "peri" || primary === "meno") && Object.keys(draft.mrs).length > 0) {
      await supabase.from("symptom_checkins").insert({
        member_id: memberId,
        instrument: "MRS",
        total_score: mrsTotal(draft.mrs),
        subscores: draft.mrs as never,
      });
    }
  }

  return { memberId };
}
