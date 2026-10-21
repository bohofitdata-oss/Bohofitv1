import type { ClassLevel } from "./group-plans";
export type TrainingFormat = { name: string; line: string; videoUrl?: string };
const formats: Record<string, TrainingFormat> = {
  lift1: { name: "Weightlifting+", line: "Learn the main lifts with controlled loads and coach-led technique." },
  lift2: { name: "Weightlifting++", line: "Build strength under heavier loads, with focused technique and coaching." },
  skills1: { name: "Calisthenics Level 1", line: "Build bodyweight strength and learn your first movement skills." },
  skills2: { name: "Calisthenics Level 2", line: "Develop advanced bodyweight strength, control and movement skills." },
  spin: { name: "Spin", line: "Ride to the rhythm and build cardiovascular stamina." },
  zumba: { name: "Zumba", line: "Dance, move and build stamina in an energetic group class." },
  hybrid: { name: "Hybrid Conditioning", line: "Combine strength and cardio in challenging, coach-led sessions." },
  yoga: { name: "Yoga", line: "Build mobility, balance and body awareness through guided movement." },
  pilates: { name: "Mat Pilates", line: "Develop core strength and control through precise mat-based movements." },
  mobility: { name: "Advanced Mobility", line: "Develop stronger control through greater ranges of movement." },
};
export const LEVEL_FORMATS: Record<ClassLevel, { category: string; formats: TrainingFormat[] }[]> = {
  start: [
    { category: "STRENGTH & LIFT", formats: [formats.lift1] },
    { category: "CALISTHENICS • SKILLS", formats: [formats.skills1] },
    { category: "CARDIO", formats: [formats.spin, formats.zumba] },
    { category: "MOBILITY", formats: [formats.yoga, formats.pilates] },
  ],
  strength: [
    { category: "STRENGTH & LIFT", formats: [formats.lift2] },
    { category: "CALISTHENICS • SKILLS", formats: [formats.skills2] },
    { category: "CARDIO", formats: [formats.hybrid] },
    { category: "MOBILITY", formats: [formats.mobility] },
  ],
  unlimited: [
    { category: "STRENGTH & LIFT", formats: [formats.lift1, formats.lift2] },
    { category: "CALISTHENICS • SKILLS", formats: [{ ...formats.skills1, name: "Calisthenics L1" }, { ...formats.skills2, name: "Calisthenics L2" }] },
    { category: "CARDIO", formats: [formats.spin, formats.zumba, formats.hybrid] },
    { category: "MOBILITY", formats: [formats.yoga, formats.pilates, formats.mobility] },
  ],
};