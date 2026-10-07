import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_my_memberships",
  title: "List my memberships",
  description: "View your own Rebél memberships, training format, and membership dates.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    const userId = ctx.getUserId();
    if (!ctx.isAuthenticated() || !userId) throw new ToolError("Sign in to view your memberships.");
    const { data, error } = await supabaseForUser(ctx)
      .from("memberships")
      .select("program, tier, delivery, start_date, end_date, status, pause_balance_days")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw new ToolError("Could not load your memberships right now.");
    const memberships = (data ?? []).map((membership) => ({
      program: membership.program,
      tier: membership.tier,
      delivery: membership.delivery,
      startDate: membership.start_date,
      endDate: membership.end_date,
      status: membership.status,
      pauseBalanceDays: membership.pause_balance_days,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify({ memberships }) }],
      structuredContent: { memberships },
    };
  },
});