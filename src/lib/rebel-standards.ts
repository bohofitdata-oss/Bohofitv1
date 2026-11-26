export const REBEL_STANDARDS = {
  includedGuidance: true,
  paidPtUpselling: false,
  supplementPressure: false,
  inHouseDietitians: true,
  foundingMemberRetentionPercent: 50,
  foundingMemberYears: 4.5,
  skills: ["Handstands", "L-sits", "Front levers", "Back levers"],
} as const;

export type CompareRow = { metric: string; rebel: string; cult: string; calisthenics: string; traditional: string; bootcamp: string };
export const COMPARE_COLUMNS = [
  { key: "rebel", label: "REBÉL", highlight: true },
  { key: "cult", label: "Cult Group", highlight: false },
  { key: "calisthenics", label: "Other Calisthenics Gyms", highlight: false },
  { key: "traditional", label: "Traditional Gym", highlight: false },
  { key: "bootcamp", label: "Bootcamp Gyms", highlight: false },
] as const;
const comparison = (metric: string, rebel: string, question: string): CompareRow => ({ metric, rebel, cult: question, calisthenics: question, traditional: question, bootcamp: question });
export const COMPARE_ROWS = [
  comparison("Guidance included", "Member? You're guided. No paid-PT upsell. No extra coaching fee.", "Ask what coaching your membership includes."),
  comparison("No buying pressure", "No pressure to buy supplements or extras. Advice only if you want it.", "Ask about optional products and extras."),
  comparison("Assessment → progression", "Level 1 builds beginners up. Level 2 takes experienced members further. Coach-assessed progression.", "Ask how assessment shapes your next training level."),
  comparison("Time for real skills", "Dedicated coach time for handstands, L-sits, front levers and back levers.", "Ask which skills are taught and how much coached practice you get."),
  comparison("Professional diet support", "In-house dietitians. Diet guidance from qualified professionals, not fitness coaches.", "Ask who provides diet advice and what is included."),
  comparison("Complete training", "Strength, dedicated flexibility work and cardio. More than lifting heavier.", "Ask how strength, flexibility and cardio are programmed."),
  comparison("Machine-free strength", "Bodyweight, bars and free weights. Spin adds a separate cardio format.", "Ask which equipment and formats fit your goals."),
  comparison("Built for the long run", "50% of members who joined 4.5 years ago still train with us.*", "Ask how long-term member progress is supported."),
];