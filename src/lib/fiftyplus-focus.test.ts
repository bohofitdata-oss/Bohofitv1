import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { FIFTYPLUS_TIME_SLOTS, FIFTYPLUS_FOCUS_AREAS, toggleFocus } from "./fiftyplus-focus";
import { consultationNotes } from "./unpause-booking";

describe("50+ consultation rules", () => {
  test("morning hourly starts include 6:30 AM through 1:30 PM", () => {
    assert.deepEqual(FIFTYPLUS_TIME_SLOTS.slice(0, 8), ["06:30", "07:30", "08:30", "09:30", "10:30", "11:30", "12:30", "13:30"]);
  });
  test("evening hourly starts include 4:30 PM through 8:30 PM", () => {
    assert.deepEqual(FIFTYPLUS_TIME_SLOTS.slice(8), ["16:30", "17:30", "18:30", "19:30", "20:30"]);
  });
  test("supports all eight body areas and both additional concerns", () => {
    assert.deepEqual(FIFTYPLUS_FOCUS_AREAS, ["Neck", "Shoulder", "Elbow", "Upper back", "Lower back / disc", "Hip", "Knee", "Ankle & foot", "General stiffness", "Post-injury recovery"]);
  });
  test("multi-select keeps other concerns when one is cleared", () => {
    const selected = toggleFocus(toggleFocus([], "Knee"), "Lower back / disc");
    assert.deepEqual(selected, ["Knee", "Lower back / disc"]);
    assert.deepEqual(toggleFocus(selected, "Knee"), ["Lower back / disc"]);
  });
  test("selected body areas carry into notes alongside personal notes", () => {
    assert.equal(consultationNotes("Stairs are difficult.", ["Knee", "Lower back / disc"]), "Selected concerns: Knee; Lower back / disc\n\nStairs are difficult.");
  });
});