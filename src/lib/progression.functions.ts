import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type ProgressScoreDTO = {
  score: number;
  attendance_score: number;
  completion_score: number;
  milestone_score: number;
  coach_score: number;
  sessions_lifetime: number;
  next_step: string | null;
  next_milestone: string | null;
  progress_to_next_level: number;
};

// Computes and returns progress strictly for the authenticated caller.
export const getMyProgressScore = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<ProgressScoreDTO | null> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin.rpc("compute_progress_score", {
      _user_id: context.userId,
    });
    if (error || !data) {
      return null;
    }
    return {
      score: data.score,
      attendance_score: data.attendance_score,
      completion_score: data.completion_score,
      milestone_score: data.milestone_score,
      coach_score: data.coach_score,
      sessions_lifetime: data.sessions_lifetime,
      next_step: data.next_step,
      next_milestone: data.next_milestone,
      progress_to_next_level: data.progress_to_next_level,
    };
  });