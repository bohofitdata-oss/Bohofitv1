export type ClassLevel = "start" | "strength" | "unlimited";
export type GroupPlan = { id: string; months: number; price: number; pause: number; gstIncluded: boolean; dietMonthlyPrice?: number; dietConsultIncluded?: boolean; line: string; detail: string; badge?: string };
const durations = [2, 3, 4, 12];
const prices = [5999, 8499, 10999, 18999];
const pauses = [7, 15, 21, 45];
const details = [
  "Unlimited classes • Pause 7 days • Diet consult at +₹1,000",
  "Unlimited classes • Pause 15 days • Diet consult at +₹1,000",
  "Unlimited classes in your selected level • Pause 21 days • Optional diet support +₹1,000/month",
  "Unlimited • Pause 45 days • Transfer • Full diet consult included",
];
const lines = {
  start: ["Learn to move safely and build the daily habit.", "Build real consistency and your first strength wins.", "Turn routine into visible, lasting progress.", "A full year to get genuinely fit — and stay there."],
  strength: ["Master technique under load, safely.", "Measurable strength gains, properly programmed.", "Progressive overload meets real conditioning.", "Peak performance, built to last a lifetime."],
};
function levelPlans(level: "start" | "strength"): GroupPlan[] {
  return durations.map((months, index) => ({ id: `${level}_${months}`, months, price: prices[index] ?? 0, pause: pauses[index] ?? 0, gstIncluded: true, ...(months === 4 ? { dietMonthlyPrice: 1000, dietConsultIncluded: false } : {}), line: lines[level][index] ?? "", detail: details[index] ?? "" }));
}
export const GROUP_PLANS: Record<ClassLevel, GroupPlan[]> = {
  start: levelPlans("start"), strength: levelPlans("strength"),
  unlimited: [
    { id: "unlimited_1", months: 1, price: 3999, pause: 0, gstIncluded: true, dietConsultIncluded: false, line: "Every format, ground + fifth floor — find what you love.", detail: "All Level 1 & 2 formats • No pauses • Diet consultation not included" },
    { id: "unlimited_6", months: 6, price: 17999, pause: 30, gstIncluded: true, line: "Six months to train like a complete athlete.", detail: "All Level 1 & 2 formats • Pause 30d • Transfer • Full diet included", badge: "BEST VALUE" },
    { id: "unlimited_12", months: 12, price: 22999, pause: 60, gstIncluded: true, line: "The full REBÉL ecosystem, all year long.", detail: "All Level 1 & 2 formats • Pause 60d • Transfer • Full diet included" },
  ],
};
export function getGroupPlan(id: string) {
  const plan = Object.values(GROUP_PLANS).flat().find(item => item.id === id);
  if (!plan) throw new Error("Choose an available membership plan.");
  return plan;
}
export function groupAmountPaise(id: string) { return getGroupPlan(id).price * 100; }
export function groupBookingMarker(id: string) { getGroupPlan(id); return `[group-plan:${id}]`; }
export function requiresLevelWarning(level: ClassLevel) { return level === "strength"; }
export const JOINING_RULES = [
  "No refunds once you pay. The only exception — if we can't run your classes, you're refunded in full. Missing sessions on your own is not a refund.",
  "Pauses need a WhatsApp message and a 2-day minimum. No backdated pauses — the day you message is day one.",
  "Train at your real level. Beginners belong in Level 1. Level 2 is strictly for intermediate & advanced practitioners.",
];