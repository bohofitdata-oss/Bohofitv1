import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_programs",
  title: "List training programs",
  description: "List Rebél training programs and their published descriptions and durations.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated()) throw new ToolError("Sign in to browse Rebél programs.");
    const { data, error } = await supabaseForUser(ctx)
      .from("programs")
      .select("slug, title, description, duration_weeks, path")
      .eq("active", true)
      .order("title");
    if (error) throw new ToolError("Could not load Rebél programs right now.");
    const programs = (data ?? []).map((program) => ({
      slug: program.slug,
      title: program.title,
      description: program.description,
      durationWeeks: program.duration_weeks,
      path: program.path,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify({ programs }) }],
      structuredContent: { programs },
    };
  },
});