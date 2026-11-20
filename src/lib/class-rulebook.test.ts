import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { CLASS_RULEBOOK, ROUTINE_LEVELS } from "./class-rulebook";
describe("Supplied class rulebook", () => {
  test("an absent coach is substituted and the format may change", () => {
    const continuity = CLASS_RULEBOOK.find(rule => rule.id === "continuity");
    assert.equal(continuity?.substituteCoach, true);
    assert.equal(continuity?.formatMayChange, true);
  });
  test("significant changes use WhatsApp, group or app notices", () => {
    const adjustments = CLASS_RULEBOOK.find(rule => rule.id === "adjustments");
    assert.deepEqual(adjustments?.notificationChannels, ["WhatsApp", "group", "app"]);
  });
  test("Level 3 combines Level 1 and Level 2 routines", () => {
    assert.deepEqual(ROUTINE_LEVELS.unlimited, ["start", "strength"]);
    assert.deepEqual(ROUTINE_LEVELS.start, ["start"]);
    assert.deepEqual(ROUTINE_LEVELS.strength, ["strength"]);
  });
});
