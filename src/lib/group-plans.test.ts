import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { GROUP_PLANS, groupAmountPaise, requiresLevelWarning, getGroupPlan } from "./group-plans";
import { LEVEL_FORMATS } from "./group-formats";
import { COMPARE_COLUMNS, COMPARE_ROWS } from "../components/CompareTable";
describe("Group membership rules", () => {
  for (const level of ["start", "strength"] as const) {
    for (const [months, price] of [[2,5999],[3,8999],[6,12999],[12,16999]]) {
      test(`${level} ${months} months charges exactly ₹${price}`, () => assert.equal(groupAmountPaise(`${level}_${months}`), price * 100));
    }
    test(`${level} pauses are 7, 15, 30, 45 days`, () => assert.deepEqual(GROUP_PLANS[level].map(plan => plan.pause), [7,15,30,45]));
  }
  for (const [months, price] of [[3,10999],[6,14999],[12,18999]]) {
    test(`unlimited ${months} months charges exactly ₹${price}`, () => assert.equal(groupAmountPaise(`unlimited_${months}`), price * 100));
  }
  test("unlimited pauses are 15, 30, 60 days", () => assert.deepEqual(GROUP_PLANS.unlimited.map(plan => plan.pause), [15,30,60]));
  test("Level 2 requires the entry warning", () => assert.equal(requiresLevelWarning("strength"), true));
  test("Level 1 and all-access do not require the Level 2 warning", () => { assert.equal(requiresLevelWarning("start"), false); assert.equal(requiresLevelWarning("unlimited"), false); });
  test("format counts are three, three and five", () => assert.deepEqual(Object.values(LEVEL_FORMATS).map(groups => groups.flatMap(group => group.formats).length), [3,3,5]));
  test("every format carries real class clips", () => { for (const groups of Object.values(LEVEL_FORMATS)) for (const group of groups) for (const format of group.formats) assert.ok(format.videos && format.videos.length > 0, `${format.name} has no clips`); });
  test("removed weightlifting clip 05 is excluded and six weightlifting clips remain", () => {
    const liftClips = LEVEL_FORMATS.start[0]?.formats[0]?.videos ?? [];
    assert.equal(liftClips.length, 6);
    assert.equal(liftClips.some((url) => url.includes("weightlifting-05")), false);
  });
  test("unknown plans cannot supply a checkout amount", () => assert.throws(() => getGroupPlan("start_1")));
});

describe("Comparison table guardrails", () => {
  test("includes REBÉL, Cult Group, Other Calisthenics Gyms, Traditional Gym, and Bootcamp Gyms", () => {
    assert.deepEqual(
      COMPARE_COLUMNS.map((c) => c.label),
      ["REBÉL", "Cult Group", "Other Calisthenics Gyms", "Traditional Gym", "Bootcamp Gyms"],
    );
  });
  test("uses Traditional Gym and never mentions local gym", () => {
    const allText = [...COMPARE_COLUMNS.map((c) => c.label), ...COMPARE_ROWS.flatMap((r) => Object.values(r))].join(" ").toLowerCase();
    assert.equal(allText.includes("local gym"), false);
    assert.equal(allText.includes("traditional gym"), true);
  });
});