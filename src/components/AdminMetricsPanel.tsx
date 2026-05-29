import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users, Trophy, Flame, AlertTriangle } from "lucide-react";

type Metric = { label: string; value: number | string; icon: typeof Users };

export function AdminMetricsPanel() {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [topProgress, setTopProgress] = useState<{ name: string; score: number; level: string }[]>([]);

  useEffect(() => {
    (async () => {
      const [{ count: members }, { count: open }, { count: earned }, { data: progress }] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("coach_interventions").select("id", { count: "exact", head: true }).eq("status", "open"),
        supabase.from("member_milestones").select("id", { count: "exact", head: true }),
        supabase.from("member_progress").select("user_id, score").order("score", { ascending: false }).limit(8),
      ]);
      const avg = progress && progress.length ? Math.round(progress.reduce((s, p) => s + p.score, 0) / progress.length) : 0;
      setMetrics([
        { label: "Members", value: members ?? 0, icon: Users },
        { label: "Avg readiness", value: avg, icon: Flame },
        { label: "Milestones earned", value: earned ?? 0, icon: Trophy },
        { label: "Open interventions", value: open ?? 0, icon: AlertTriangle },
      ]);
      if (progress && progress.length) {
        const ids = progress.map((p) => p.user_id);
        const { data: profs } = await supabase.from("profiles").select("id, full_name, current_level").in("id", ids);
        const map = new Map((profs ?? []).map((p) => [p.id, p]));
        setTopProgress(progress.map((p) => ({ name: map.get(p.user_id)?.full_name ?? "Member", score: p.score, level: map.get(p.user_id)?.current_level ?? "—" })));
      }
    })();
  }, []);

  return (
    <div className="mt-10 space-y-5">
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-2xl border border-border bg-card p-5">
            <m.icon className="w-4 h-4 text-primary" />
            <div className="text-xs uppercase tracking-widest text-muted-foreground mt-2">{m.label}</div>
            <div className="text-3xl font-black mt-1 text-gradient-gold">{m.value}</div>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="font-bold text-sm uppercase tracking-widest text-primary">Top progression</h3>
        {topProgress.length === 0 ? (
          <p className="text-sm text-muted-foreground mt-3">No member scores yet.</p>
        ) : (
          <ul className="mt-3 divide-y divide-border/60">
            {topProgress.map((r, i) => (
              <li key={i} className="flex items-center justify-between py-2 text-sm">
                <span className="font-medium">{r.name} <span className="text-muted-foreground text-xs">· {r.level}</span></span>
                <span className="tabular-nums font-bold">{r.score}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
