export const UNPAUSE_TIME_SLOTS = [
  "06:30", "07:30", "08:30", "09:30", "10:30", "11:30", "12:30", "13:30",
  "16:30", "17:30", "18:30", "19:30", "20:30",
];

export function consultationNotes(notes: string | null, concerns: string[]) {
  if (!concerns.length) return notes;
  return [`Selected concerns: ${concerns.join("; ")}`, notes?.trim()].filter(Boolean).join("\n\n");
}