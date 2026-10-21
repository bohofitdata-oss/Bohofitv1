import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { consultationNotes, UNPAUSE_TIME_SLOTS } from "./unpause-booking";

describe("UnPause consultation configuration", () => {
  test("offers hourly morning starts from 6:30 AM to 1:30 PM", () => {
    assert.deepEqual(UNPAUSE_TIME_SLOTS.slice(0, 8), ["06:30", "07:30", "08:30", "09:30", "10:30", "11:30", "12:30", "13:30"]);
  });
  test("offers hourly evening starts from 4:30 PM to 8:30 PM", () => {
    assert.deepEqual(UNPAUSE_TIME_SLOTS.slice(8), ["16:30", "17:30", "18:30", "19:30", "20:30"]);
  });
  test("carries every selected concern into notes without losing personal notes", () => {
    assert.equal(consultationNotes("I work shifts.", ["Low energy", "Poor sleep"]), "Selected concerns: Low energy; Poor sleep\n\nI work shifts.");
  });
  test("preserves existing booking notes for other pages", () => {
    assert.equal(consultationNotes("Knee pain", []), "Knee pain");
    assert.equal(consultationNotes(null, []), null);
  });
});