// Server-side admin client for the external bohofitdata-oss Supabase project.
// Bypasses RLS — never import from client code. The *.server.ts extension
// enforces that at build time.
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

function createBohofitAdminClient() {
  const url = process.env.BOHOFIT_SUPABASE_URL;
  const serviceKey = process.env.BOHOFIT_SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "Missing BOHOFIT_SUPABASE_URL or BOHOFIT_SUPABASE_SERVICE_ROLE_KEY",
    );
  }
  return createClient<Database>(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

let _client: ReturnType<typeof createBohofitAdminClient> | undefined;

export const bohofitAdmin = new Proxy(
  {} as ReturnType<typeof createBohofitAdminClient>,
  {
    get(_, prop, receiver) {
      if (!_client) _client = createBohofitAdminClient();
      return Reflect.get(_client, prop, receiver);
    },
  },
);
