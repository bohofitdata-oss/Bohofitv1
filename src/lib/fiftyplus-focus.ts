import { UNPAUSE_TIME_SLOTS } from "./unpause-booking";

export const FIFTYPLUS_TIME_SLOTS = UNPAUSE_TIME_SLOTS;
export const BODY_AREAS = [
  { label: "Neck", position: "neck", quotes: ["Stiff after screen time.", "Turning my head is uncomfortable."], help: "We build neck support and comfortable movement, at your pace." },
  { label: "Shoulder", position: "shoulder", quotes: ["Can't reach the top shelf.", "Reaching behind me is hard."], help: "We build shoulder strength and reach, with controlled movements." },
  { label: "Elbow", position: "elbow", quotes: ["Hurts when I lift a bag.", "Carrying groceries feels difficult."], help: "We build arm and grip strength, with manageable loads." },
  { label: "Upper back", position: "upper-back", quotes: ["Tight and rounded.", "My back tires at my desk."], help: "We strengthen your upper back and practise comfortable posture." },
  { label: "Lower back / disc", position: "lower-back", quotes: ["Bending is hard.", "Sore after long sitting."], help: "We build strength around your back and hips, slowly and safely." },
  { label: "Hip", position: "hip", quotes: ["Hard to get up from the floor.", "Getting out of a chair is difficult."], help: "We build hip strength and movement for everyday tasks." },
  { label: "Knee", position: "knee", quotes: ["Stairs hurt.", "Stiff after sitting."], help: "We strengthen the muscles around your knee, slowly and safely." },
  { label: "Ankle & foot", position: "ankle", quotes: ["Unsteady on uneven ground.", "My ankles feel stiff."], help: "We build foot and ankle strength, with steady balance practice." },
];
export const EXTRA_AREAS = ["General stiffness", "Post-injury recovery"];
export const FIFTYPLUS_FOCUS_AREAS = [...BODY_AREAS.map(area => area.label), ...EXTRA_AREAS];

export function toggleFocus(current: string[], value: string) {
  if (!FIFTYPLUS_FOCUS_AREAS.includes(value)) return current;
  return current.includes(value) ? current.filter(item => item !== value) : [...current, value];
}