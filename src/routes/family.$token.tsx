import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client.bohofit";
import { Heart, Calendar, MessageSquareQuote, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/family/$token")({
  head: () => ({
    meta: [
      { title: "Rebel — Family progress" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: FamilyView,
});

type FamilyData = {
  first_name: string;
  program_name: string;
  sessions_completed: number;
  sessions_total: number;
  next_session_at: string | null;
  last_session_date: string | null;
  trainer_note: string | null;
};

function FamilyView() {
  const { token } = Route.useParams();
  const [data, setData] = useState<FamilyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: res, error } = await supabase.rpc("get_family_progress", { _token: token });
      if (error || !res) {
        setNotFound(true);
      } else {
        setData(res as unknown as FamilyData);
      }
      setLoading(false);
    })();
  }, [token]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>;
  }

  if (notFound || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5 text-center">
        <div className="max-w-sm">
          <Heart className="w-10 h-10 text-primary mx-auto" />
          <h1 className="mt-4 text-xl font-black">This link is no longer active</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Ask your family member to send you a fresh link from their Rebel dashboard.
          </p>
        </div>
      </div>
    );
  }

  const pct = Math.min(100, Math.round((data.sessions_completed / Math.max(data.sessions_total, 1)) * 100));

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-transparent px-5 py-10">
      <div className="max-w-md mx-auto">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground border border-border rounded-full px-3 py-1 bg-background">
            <Heart className="w-3 h-3 text-primary" /> Rebel · Family update
          </div>
          <h1 className="mt-5 text-3xl font-black">
            {data.first_name} is showing up.
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{data.program_name}</p>
        </div>

        {/* Progress ring/bar */}
        <div className="mt-8 rounded-2xl border border-border bg-card p-6 text-center">
          <div className="text-5xl font-black text-gradient-gold">
            {data.sessions_completed}
            <span className="text-2xl text-muted-foreground"> / {data.sessions_total}</span>
          </div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">sessions complete</div>
          <div className="mt-4 h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-gradient-gold transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* Last session */}
        {data.last_session_date && (
          <div className="mt-4 rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Last session
            </div>
            <div className="mt-1.5 text-base font-semibold">
              {new Date(data.last_session_date).toLocaleDateString(undefined, {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </div>
          </div>
        )}

        {/* Trainer note */}
        {data.trainer_note && (
          <div className="mt-4 rounded-2xl border border-primary/30 bg-card p-5">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-primary">
              <MessageSquareQuote className="w-3.5 h-3.5" /> A note from the trainer
            </div>
            <p className="mt-2 text-sm leading-relaxed italic">&ldquo;{data.trainer_note}&rdquo;</p>
          </div>
        )}

        {/* Next session */}
        {data.next_session_at && (
          <div className="mt-4 rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
              <Calendar className="w-3.5 h-3.5 text-primary" /> Next session
            </div>
            <div className="mt-1.5 text-base font-semibold">
              {new Date(data.next_session_at).toLocaleString(undefined, {
                weekday: "short",
                day: "numeric",
                month: "short",
                hour: "numeric",
                minute: "2-digit",
              })}
            </div>
          </div>
        )}

        <p className="mt-8 text-center text-[11px] text-muted-foreground">
          This is a private read-only update from Rebel at HSR Layout, Bangalore.
        </p>
      </div>
    </div>
  );
}
