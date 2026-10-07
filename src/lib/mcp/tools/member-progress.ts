import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "get_my_progress",
  title: "Get my progress",
  description: "Read your Rebél level, progress score, training streak, and earned milestones.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated() || !ctx.getUserId()) throw new ToolError("Sign in to view your progress.");
    const userId = ctx.getUserId();
    const supabase = supabaseForUser(ctx);
    const [profileResult, progressResult, streakResult, milestonesResult] = await Promise.all([
      supabase.from("profiles").select("full_name, current_level").eq("id", userId).maybeSingle(),
      supabase.from("member_progress").select("score, sessions_lifetime, next_step, next_milestone, progress_to_next_level").eq("user_id", userId).maybeSingle(),
      supabase.from("member_streaks").select("current_streak, longest_streak, weeks_consistent, last_attended_date").eq("user_id", userId).maybeSingle(),
      supabase.from("member_milestones").select("milestone_id, earned_at").eq("user_id", userId).order("earned_at", { ascending: false }),
    ]);
    const error = profileResult.error ?? progressResult.error ?? streakResult.error ?? milestonesResult.error;
    if (error) throw new ToolError("Could not load your progress right now.");
    const milestoneIds = (milestonesResult.data ?? []).map((item) => item.milestone_id);
    const milestoneResult = milestoneIds.length
      ? await supabase.from("milestone_definitions").select("id, title, description").in("id", milestoneIds)
      : { data: [], error: null };
    if (milestoneResult.error) throw new ToolError("Could not load your earned milestones.");
    const titlesById = new Map((milestoneResult.data ?? []).map((item) => [item.id, item]));
    const result = {
      profile: profileResult.data
        ? { name: profileResult.data.full_name, level: profileResult.data.current_level }
        : null,
      progress: progressResult.data
        ? {
            score: progressResult.data.score,
            sessionsLifetime: progressResult.data.sessions_lifetime,
            nextStep: progressResult.data.next_step,
            nextMilestone: progressResult.data.next_milestone,
            progressToNextLevel: progressResult.data.progress_to_next_level,
          }
        : null,
      streak: streakResult.data
        ? {
            current: streakResult.data.current_streak,
            longest: streakResult.data.longest_streak,
            consistentWeeks: streakResult.data.weeks_consistent,
            lastAttendedDate: streakResult.data.last_attended_date,
          }
        : null,
      milestones: (milestonesResult.data ?? []).flatMap((item) => {
        const definition = titlesById.get(item.milestone_id);
        return definition ? [{ title: definition.title, description: definition.description, earnedAt: item.earned_at }] : [];
      }),
    };
    return {
      content: [{ type: "text", text: JSON.stringify(result) }],
      structuredContent: result,
    };
  },
});