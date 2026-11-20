import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { TrendingUp, ChevronRight, RefreshCw } from "lucide-react";
import { getMyProgressScore, type ProgressScoreDTO } from "@/lib/progression.functions";

const LEVEL_LABEL: Record<string, string> = {
  foundation: "Foundation",
  performance: "Performance",
  longevity: "Longevity",
  fifty_plus: "Rebél Unpause",
};

export function ProgressionCard({ userId }: { userId: string }) {
  const fetchMyProgress = useServerFn(getMyProgressScore);
  const [level, setLevel] = useState<string>("foundation");
  const [p, setP] = useState<ProgressScoreDTO | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data: prof } = await supabase.from("profiles").select("current_level").eq("id", userId).maybeSingle();
      if (prof?.current_level) setLevel(prof.current_level);
      const data = await fetchMyProgress();
      if (data) setP(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [userId]);

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-primary flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5" /> Your progression</p>
          <h3 className="text-2xl font-black mt-1">{LEVEL_LABEL[level] ?? level}</h3>
        </div>
        <Button onClick={load} variant="ghost" size="sm" disabled={loading}><RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /></Button>
      </div>

      <div className="mt-5 flex items-baseline gap-2">
        <div className="text-5xl font-black tabular-nums">{p?.score ?? "—"}</div>
        <div className="text-sm text-muted-foreground">Readiness score</div>
      </div>

      {p && (
        <div className="mt-4 space-y-2 text-xs">
          <Bar label="Consistency (40%)" value={p.attendance_score} />
          <Bar label="Capability (25%)" value={p.completion_score} />
          <Bar label="Milestones (20%)" value={p.milestone_score} />
          <Bar label="Coach assessment (15%)" value={p.coach_score} />
        </div>
      )}

      <div className="mt-5 rounded-xl border border-border/70 bg-background p-4">
        <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Next step</p>
        <p className="mt-1 text-sm font-medium flex items-start gap-1.5">
          <ChevronRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
          <span>{p?.next_step ?? "Log a session to start your progression."}</span>
        </p>
        {p?.next_milestone && (
          <p className="mt-2 text-xs text-muted-foreground">Next milestone: <span className="text-foreground font-medium">{p.next_milestone}</span></p>
        )}
        {p && (
          <div className="mt-3">
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-primary transition-all" style={{ width: `${p.progress_to_next_level}%` }} />
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">{p.progress_to_next_level}% to next level</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Bar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-muted-foreground"><span>{label}</span><span className="tabular-nums text-foreground">{value}</span></div>
      <div className="h-1 rounded-full bg-muted overflow-hidden mt-1">
        <div className="h-full bg-primary" style={{ width: `${Math.min(100, value)}%` }} />
      </div>
    </div>
  );
}
