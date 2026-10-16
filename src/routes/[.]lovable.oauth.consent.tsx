import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/.lovable/oauth/consent")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>) => ({
    authorization_id: typeof search.authorization_id === "string" ? search.authorization_id : "",
  }),
  beforeLoad: async ({ search, location }) => {
    if (!search.authorization_id) throw new Error("This connection request is missing its authorization details.");
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      const next = `${location.pathname}${location.searchStr}`;
      throw redirect({ to: "/auth", search: { next } });
    }
  },
  loader: async ({ location }) => {
    const authorizationId = new URLSearchParams(location.search).get("authorization_id");
    if (!authorizationId) throw new Error("This connection request is missing its authorization details.");
    const { data, error } = await supabase.auth.oauth.getAuthorizationDetails(authorizationId);
    if (error) throw error;
    if (!("authorization_id" in data)) throw redirect({ href: data.redirect_url });
    return data;
  },
  component: ConsentPage,
  errorComponent: ({ error }) => (
    <main className="min-h-screen bg-background px-5 py-16 text-foreground">
      <section className="mx-auto max-w-lg rounded-xl border border-border bg-card p-7">
        <h1 className="text-2xl font-bold">Could not load this connection request</h1>
        <p className="mt-3 text-sm text-muted-foreground" role="alert">
          {error instanceof Error ? error.message : "This request may have expired. Start the connection again from the app."}
        </p>
      </section>
    </main>
  ),
  head: () => ({
    meta: [
      { title: "Connect an app — Rebél" },
      { name: "description", content: "Review and approve an app's access to your Rebél account." },
      { property: "og:title", content: "Connect an app — Rebél" },
      { property: "og:description", content: "Review and approve an app's access to your Rebél account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function ConsentPage() {
  const details = Route.useLoaderData();
  const { authorization_id: authorizationId } = Route.useSearch();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const clientName = details.client.name || "this app";

  const decide = async (approve: boolean) => {
    setBusy(true);
    setError(null);
    try {
      const result = approve
        ? await supabase.auth.oauth.approveAuthorization(authorizationId, { skipBrowserRedirect: true })
        : await supabase.auth.oauth.denyAuthorization(authorizationId, { skipBrowserRedirect: true });
      if (result.error) {
        setError(result.error.message);
        return;
      }
      if (!result.data.redirect_url) {
        setError("The authorization server did not return a destination. Start the connection again.");
        return;
      }
      window.location.assign(result.data.redirect_url);
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Could not update this connection request.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-background px-5 py-16 text-foreground">
      <section className="mx-auto max-w-lg rounded-xl border border-border bg-card p-7 shadow-card">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">REBÉL account connection</p>
        <h1 className="mt-4 text-2xl font-bold">Connect {clientName}?</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {clientName} is requesting access to your Rebél account as {details.user.email}. Approve only if you trust this app.
        </p>
        {details.scope && <p className="mt-4 text-sm text-muted-foreground">Requested access: {details.scope}</p>}
        {error && <p className="mt-4 text-sm text-destructive" role="alert">{error}</p>}
        <div className="mt-7 flex flex-wrap gap-3">
          <Button type="button" disabled={busy} onClick={() => void decide(true)}>
            {busy ? "Please wait…" : "Approve access"}
          </Button>
          <Button type="button" variant="outline" disabled={busy} onClick={() => void decide(false)}>
            Deny
          </Button>
        </div>
        <button
          type="button"
          className="mt-5 text-sm text-muted-foreground underline underline-offset-4"
          onClick={() => void navigate({ to: "/privacy" })}
        >
          Read the privacy policy
        </button>
      </section>
    </main>
  );
}