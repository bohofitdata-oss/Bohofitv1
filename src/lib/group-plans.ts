export type ClassLevel = "start" | "strength" | "unlimited";
export type GroupPlan = { id: string; months: number; price: number; pause: number; line: string; detail: string; badge?: string };
const durations = [2, 3, 6, 12];
const prices = [5999, 8999, 12999, 16999];
const pauses = [7, 15, 30, 45];
const details = [
  "Unlimited classes • Pause 7 days • Diet consult at +₹1,000",
  "Unlimited classes • Pause 15 days • Diet consult at +₹1,000",
  "Unlimited • Pause 30 days • Transfer • Full diet consult included",
  "Unlimited • Pause 45 days • Transfer • Full diet consult included",
];
const lines = {
  start: ["Learn to move safely and build the daily habit.", "Build real consistency and your first strength wins.", "Turn routine into visible, lasting progress.", "A full year to get genuinely fit — and stay there."],
  strength: ["Master technique under load, safely.", "Measurable strength gains, properly programmed.", "Progressive overload meets real conditioning.", "Peak performance, built to last a lifetime."],
};
function levelPlans(level: "start" | "strength"): GroupPlan[] {
  return durations.map((months, index) => ({ id: `${level}_${months}`, months, price: prices[index] ?? 0, pause: pauses[index] ?? 0, line: lines[level][index] ?? "", detail: details[index] ?? "", badge: months === 6 ? "MOST POPULAR" : undefined }));
}
export const GROUP_PLANS: Record<ClassLevel, GroupPlan[]> = {
  start: levelPlans("start"), strength: levelPlans("strength"),
  unlimited: [
    { id: "unlimited_3", months: 3, price: 10999, pause: 15, line: "Every format, ground + fifth floor — find what you love.", detail: "All 10 formats • Pause 15 days • Diet at +₹1,000" },
    { id: "unlimited_6", months: 6, price: 14999, pause: 30, line: "Six months to train like a complete athlete.", detail: "All 10 • Pause 30d • Transfer • Full diet included", badge: "BEST VALUE" },
    { id: "unlimited_12", months: 12, price: 18999, pause: 60, line: "The full REBÉL ecosystem, all year long.", detail: "All 10 • Pause 60d • Transfer • Full diet included" },
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