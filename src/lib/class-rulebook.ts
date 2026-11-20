export const CLASS_RULEBOOK = [
  { id: "continuity", title: "We don't cancel classes. Period.", detail: "If a coach is away, another coach steps in. The format may change; the class continues.", substituteCoach: true, formatMayChange: true },
  { id: "feedback", title: "See something off? Tell management.", detail: "Class quality, progression or behaviour below the standard? Tell us. Your feedback shapes our floor." },
  { id: "format-first", title: "The programme is the star.", detail: "We're format-first, not coach-first. Coach availability may vary. The REBÉL Standard stays the same." },
  { id: "adjustments", title: "Routines can change. For good reasons.", detail: "Safety, progression and operations may mean changes. Significant updates come through WhatsApp, the group or app notifications.", changeReasons: ["safety", "progression", "coach assessment", "operations"], notificationChannels: ["WhatsApp", "group", "app"] },
] as const;
export const ROUTINE_LEVELS = { start: ["start"], strength: ["strength"], unlimited: ["start", "strength"] } as const;
