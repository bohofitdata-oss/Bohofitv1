import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { GROUP_PLANS, groupAmountPaise, requiresLevelWarning, getGroupPlan } from "./group-plans";
import { LEVEL_FORMATS } from "./group-formats";
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
  test("format counts are six, four and ten", () => assert.deepEqual(Object.values(LEVEL_FORMATS).map(groups => groups.flatMap(group => group.formats).length), [6,4,10]));
  test("unknown plans cannot supply a checkout amount", () => assert.throws(() => getGroupPlan("start_1")));
});