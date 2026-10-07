import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listProgramsTool from "./tools/list-programs";
import memberProgressTool from "./tools/member-progress";
import myMembershipsTool from "./tools/my-memberships";

const projectRef = import.meta.env["VITE_SUPABASE_PROJECT_ID"] ?? "project-ref-unset";

export default defineMcp({
  name: "rebél-wellness-club",
  title: "REBÉL Wellness Club",
  version: "0.1.0",
  instructions:
    "Tools for a signed-in Rebél member to check their personal progress and memberships, and browse training programs. Member data is read using the caller's own account permissions.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [memberProgressTool, myMembershipsTool, listProgramsTool],
});