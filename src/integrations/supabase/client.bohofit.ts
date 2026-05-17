// Manual override client pointing to the user's external Supabase project
// (bohofitdata-oss). This bypasses the auto-managed Lovable Cloud client.
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const SUPABASE_URL = "https://fuitymjndkmltlxstiqj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_m11_684HzvJZnKW_ANPeSQ_XwplmtpR";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: typeof window !== "undefined" ? localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
  },
});
