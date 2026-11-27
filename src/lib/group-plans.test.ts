import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { GROUP_PLANS, groupAmountPaise, requiresLevelWarning, getGroupPlan } from "./group-plans";
import { LEVEL_FORMATS } from "./group-formats";
import { REBEL_STANDARDS } from "./rebel-standards";
describe("Group membership rules", () => {
  for (const level of ["start", "strength"] as const) {
    for (const [months, price] of [[2,5999],[3,8499],[4,10999],[12,18999]]) {
      test(`${level} ${months} months charges exactly ₹${price}`, () => assert.equal(groupAmountPaise(`${level}_${months}`), price * 100));
    }
    test(`${level} pauses are 7, 15, 21, 45 days`, () => assert.deepEqual(GROUP_PLANS[level].map(plan => plan.pause), [7,15,21,45]));
    test(`${level} prices include GST`, () => assert.ok(GROUP_PLANS[level].every(plan => plan.gstIncluded)));
    test(`${level} offers only 2, 3, 4 and 12 months`, () => assert.deepEqual(GROUP_PLANS[level].map(plan => plan.months), [2,3,4,12]));
    test(`${level} four-month optional diet support costs ₹1,000 per month`, () => assert.equal(getGroupPlan(`${level}_4`).dietMonthlyPrice, 1000));
  }
  for (const [months, price] of [[1,3999],[6,17999],[12,22999]]) {
    test(`unlimited ${months} months charges exactly ₹${price}`, () => assert.equal(groupAmountPaise(`unlimited_${months}`), price * 100));
  }
  test("one-month Unlimited has zero pause days", () => assert.equal(getGroupPlan("unlimited_1").pause, 0));
  test("one-month Unlimited does not include diet consultation", () => assert.equal(getGroupPlan("unlimited_1").dietConsultIncluded, false));
  test("unlimited pauses are 0, 30, 60 days", () => assert.deepEqual(GROUP_PLANS.unlimited.map(plan => plan.pause), [0,30,60]));
  test("Unlimited offers only 1, 6 and 12 months", () => assert.deepEqual(GROUP_PLANS.unlimited.map(plan => plan.months), [1,6,12]));
  test("Level 2 requires the entry warning", () => assert.equal(requiresLevelWarning("strength"), true));
  test("Level 1 and all-access do not require the Level 2 warning", () => { assert.equal(requiresLevelWarning("start"), false); assert.equal(requiresLevelWarning("unlimited"), false); });
  test("Level 1 offers lifting, calisthenics and combined Yoga / Spin / Pilates", () => assert.deepEqual(LEVEL_FORMATS.start.flatMap(group => group.formats.map(format => format.name)), ["Weightlifting Level 1", "Calisthenics Level 1", "Yoga • Spin • Pilates"]));
  test("Level 2 offers lifting, calisthenics and hybrid conditioning only", () => assert.deepEqual(LEVEL_FORMATS.strength.flatMap(group => group.formats.map(format => format.name)), ["Weightlifting Level 2", "Calisthenics Level 2", "Hybrid Conditioning Level 2"]));
  test("Level 1 and Level 2 footage do not overlap", () => {
    const l1 = LEVEL_FORMATS.start.flatMap(group => group.formats.flatMap(format => format.videos ?? []));
    const l2 = LEVEL_FORMATS.strength.flatMap(group => group.formats.flatMap(format => format.videos ?? []));
    assert.equal(l1.filter(url => l2.includes(url)).length, 0);
  });
  test("Level 3 includes all Level 1 and Level 2 clips", () => {
    const clips = (level: "start" | "strength" | "unlimited") => LEVEL_FORMATS[level].flatMap(group => group.formats.flatMap(format => format.videos ?? []));
    assert.deepEqual(new Set(clips("unlimited")), new Set([...clips("start"), ...clips("strength")]));
    assert.equal(new Set(clips("unlimited")).size, 21);
  });
  test("every format carries real class clips", () => { for (const groups of Object.values(LEVEL_FORMATS)) for (const group of groups) for (const format of group.formats) assert.ok(format.videos && format.videos.length > 0, `${format.name} has no clips`); });
  test("removed weightlifting clip 05 is excluded and six weightlifting clips remain", () => {
    const liftClips = [...(LEVEL_FORMATS.start[0]?.formats[0]?.videos ?? []), ...(LEVEL_FORMATS.strength[0]?.formats[0]?.videos ?? [])];
    assert.equal(liftClips.length, 6);
    assert.equal(liftClips.some((url) => url.includes("weightlifting-05")), false);
  });
  test("unknown plans cannot supply a checkout amount", () => assert.throws(() => getGroupPlan("start_1")));
  test("removed membership durations cannot be purchased", () => { for (const id of ["start_6", "strength_6", "unlimited_3"]) assert.throws(() => getGroupPlan(id)); });
});

describe("Owner-confirmed REBÉL standards", () => {
  test("member guidance is included", () => assert.equal(REBEL_STANDARDS.includedGuidance, true));
  test("no paid-PT upselling", () => assert.equal(REBEL_STANDARDS.paidPtUpselling, false));
  test("no supplement pressure", () => assert.equal(REBEL_STANDARDS.supplementPressure, false));
  test("professional in-house dietitians", () => assert.equal(REBEL_STANDARDS.inHouseDietitians, true));
  test("founding-member retention is 50% over 4.5 years", () => { assert.equal(REBEL_STANDARDS.foundingMemberRetentionPercent, 50); assert.equal(REBEL_STANDARDS.foundingMemberYears, 4.5); });
});