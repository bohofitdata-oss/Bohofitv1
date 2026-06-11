import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteShell } from "@/components/SiteShell";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/app/")({
  head: () => ({ meta: [{ title: "Today — REBÉL" }] }),
  component: AppHome,
});

function AppHome() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hasMember, setHasMember] = useState(false);
  const [memberName, setMemberName] = useState<string>("");

  useEffect(() => {
    (async () => {
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        // Allow anonymous to start onboarding
        navigate({ to: "/app/onboarding" });
        return;
      }
      const { data: m } = await supabase.from("members").select("id, name").eq("user_id", sess.session.user.id).maybeSingle();
      if (!m) {
        navigate({ to: "/app/onboarding" });
        return;
      }
      setHasMember(true);
      setMemberName(m.name ?? "");
      setLoading(false);
    })();
  }, [navigate]);

  if (loading) return <SiteShell><div className="container mx-auto px-5 py-20 text-sm text-muted-foreground">Loading…</div></SiteShell>;
  if (!hasMember) return null;

  return (
    <SiteShell>
      <section className="container mx-auto max-w-3xl px-5 py-12">
        <p className="text-xs uppercase tracking-[0.18em] text-primary">Today</p>
        <h1 className="text-3xl md:text-4xl font-black mt-2">Welcome back, {memberName.split(" ")[0]}.</h1>
        <p className="text-muted-foreground mt-2 max-w-xl">Your record is being built. Plan, Progress, Records, Care Team and Classes tabs are next — coming in the following build phases.</p>
        <div className="mt-8 flex gap-3">
          <Button asChild className="bg-gradient-gold text-primary-foreground border-0 hover:opacity-90"><Link to="/dashboard">Open dashboard</Link></Button>
          <Button asChild variant="outline"><Link to="/app/onboarding">Update my intake</Link></Button>
        </div>
      </section>
    </SiteShell>
  );
}
