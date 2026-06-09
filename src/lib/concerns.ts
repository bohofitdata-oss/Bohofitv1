// Concern → symptom chip dictionary. Add/edit chips here; nothing else hardcodes them.
export type ConcernKey = "perimenopause" | "menopause_beyond" | "joints_knees" | "bone_balance";

export const CONCERN_LABEL: Record<ConcernKey, string> = {
  perimenopause: "Perimenopause",
  menopause_beyond: "Menopause & beyond",
  joints_knees: "Joints & knees",
  bone_balance: "Bone strength & balance",
};

export const SYMPTOM_CHIPS: Record<ConcernKey, string[]> = {
  perimenopause: ["Hot flushes", "Sleep trouble", "Mood swings", "Weight gain", "Irregular cycle", "Brain fog"],
  menopause_beyond: ["Low energy", "Strength loss", "Belly fat", "Hot flushes", "Sleep trouble", "Low mood"],
  joints_knees: ["Knee pain", "Hip pain", "Back pain", "Stiff mornings", "Stairs are hard", "Old injury"],
  bone_balance: ["Fear of falling", "Balance issues", "Low bone density", "Posture", "Weak grip", "Knee buckling"],
};
