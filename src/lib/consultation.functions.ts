import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const takenSlotsSchema = z.object({
  program: z.enum(["unpause", "fifty_plus"]),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),
});

// Returns only booked time strings for an upcoming booking window; no personal fields.
export const getTakenConsultationSlots = createServerFn({ method: "POST" })
  .inputValidator((input) => takenSlotsSchema.parse(input))
  .handler(async ({ data }): Promise<string[]> => {
    const parsed = new Date(`${data.date}T00:00:00Z`);
    if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== data.date) {
      return [];
    }
    const nowMs = Date.now();
    const minMs = nowMs - 2 * 24 * 60 * 60 * 1000;
    const maxMs = nowMs + 31 * 24 * 60 * 60 * 1000;
    if (parsed.getTime() < minMs || parsed.getTime() > maxMs) {
      return [];
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin.rpc("consultation_taken_slots", {
      _program: data.program,
      _date: data.date,
    });
    if (error || !rows) return [];
    return rows.map((row) => row.consult_time);
  });