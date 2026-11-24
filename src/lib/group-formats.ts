import type { ClassLevel } from "./group-plans";
import cali01 from "@/assets/videography/calisthenics-01.mp4.asset.json";
import cali02 from "@/assets/videography/calisthenics-02.mp4.asset.json";
import cali03 from "@/assets/videography/calisthenics-03.mp4.asset.json";
import cali04 from "@/assets/videography/calisthenics-04.mp4.asset.json";
import cali05 from "@/assets/videography/calisthenics-05.mp4.asset.json";
import cali06 from "@/assets/videography/calisthenics-06.mp4.asset.json";
import cali07 from "@/assets/videography/calisthenics-07.mp4.asset.json";
import cali08 from "@/assets/videography/calisthenics-08.mp4.asset.json";
import lift01 from "@/assets/videography/weightlifting-01.mp4.asset.json";
import lift02 from "@/assets/videography/weightlifting-02.mp4.asset.json";
import lift03 from "@/assets/videography/weightlifting-03.mp4.asset.json";
import lift04 from "@/assets/videography/weightlifting-04.mp4.asset.json";
import lift06 from "@/assets/videography/weightlifting-06.mp4.asset.json";
import lift07 from "@/assets/videography/weightlifting-07.mp4.asset.json";
import mind01 from "@/assets/videography/mind-mobility-01.mp4.asset.json";
import mind02 from "@/assets/videography/mind-mobility-02.mp4.asset.json";
import mind03 from "@/assets/videography/mind-mobility-03.mp4.asset.json";
import mind04 from "@/assets/videography/mind-mobility-04.mp4.asset.json";
import mind05 from "@/assets/videography/mind-mobility-05.mp4.asset.json";
import mind06 from "@/assets/videography/mind-mobility-06.mp4.asset.json";
import mind07 from "@/assets/videography/mind-mobility-07.mp4.asset.json";

export type TrainingFormat = { name: string; line: string; videos?: string[] };

const CALISTHENICS_L1_CLIPS = [cali01.url, cali02.url, cali03.url, cali04.url];
const CALISTHENICS_L2_CLIPS = [cali05.url, cali06.url, cali07.url, cali08.url];
const WEIGHTLIFTING_CLIPS = [lift01.url, lift02.url, lift03.url, lift04.url, lift06.url, lift07.url];
const MIND_MOBILITY_CLIPS = [mind01.url, mind02.url, mind03.url, mind04.url, mind05.url, mind06.url, mind07.url];

const formats: Record<string, TrainingFormat> = {
  lift1: {
    name: "Weightlifting+",
    line: "Learn the main lifts with controlled loads and coach-led technique.",
    videos: WEIGHTLIFTING_CLIPS,
  },
  lift2: {
    name: "Weightlifting++",
    line: "Build strength under heavier loads, with focused technique and coaching.",
    videos: WEIGHTLIFTING_CLIPS,
  },
  skills1: {
    name: "Calisthenics Level 1",
    line: "Build bodyweight strength and learn your first movement skills.",
    videos: CALISTHENICS_L1_CLIPS,
  },
  skills2: {
    name: "Calisthenics Level 2",
    line: "Develop advanced bodyweight strength, control and movement skills.",
    videos: CALISTHENICS_L2_CLIPS,
  },
  mind: {
    name: "Yoga • Spin • Pilates",
    line: "Mobility, rhythm and core control — one mat, one bike, one strong centre.",
    videos: MIND_MOBILITY_CLIPS,
  },
};

export const LEVEL_FORMATS: Record<ClassLevel, { category: string; formats: TrainingFormat[] }[]> = {
  start: [
    { category: "STRENGTH & LIFT", formats: [formats.lift1] },
    { category: "CALISTHENICS • SKILLS", formats: [formats.skills1] },
    { category: "MIND & MOBILITY", formats: [formats.mind] },
  ],
  strength: [
    { category: "STRENGTH & LIFT", formats: [formats.lift2] },
    { category: "CALISTHENICS • SKILLS", formats: [formats.skills2] },
    { category: "MIND & MOBILITY", formats: [formats.mind] },
  ],
  unlimited: [
    { category: "STRENGTH & LIFT", formats: [formats.lift1, formats.lift2] },
    { category: "CALISTHENICS • SKILLS", formats: [{ ...formats.skills1, name: "Calisthenics L1" }, { ...formats.skills2, name: "Calisthenics L2" }] },
    { category: "MIND & MOBILITY", formats: [formats.mind] },
  ],
};
