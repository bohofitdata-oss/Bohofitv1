import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Lock } from "lucide-react";

type Def = { id: string; title: string; description: string | null; points: number; sort_order: number };
type Earned = { milestone_id: string; earned_at: string };

export function MilestonesCard({ userId }: { userId: string }) {
  const [defs, setDefs] = useState<Def[]>([]);
  const [earned, setEarned] = useState<Earned[]>([]);

  useEffect(() => {
    (async () => {
      const [{ data: d }, { data: e }] = await Promise.all([
        supabase.from("milestone_definitions").select("id, title, description, points, sort_order").order("sort_order"),
        supabase.from("member_milestones").select("milestone_id, earned_at").eq("user_id", userId),
      ]);
      if (d) setDefs(d);
      if (e) setEarned(e);
    })();
  }, [userId]);

  const earnedIds = new Set(earned.map((x) => x.milestone_id));

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center gap-2 text-primary"><Trophy className="w-4 h-4" /><span className="text-xs uppercase tracking-[0.18em]">Milestones</span></div>
      <h3 className="font-bold mt-1">{earned.length} of {defs.length} earned</h3>
      <ul className="mt-4 grid sm:grid-cols-2 gap-2">
        {defs.map((m) => {
          const got = earnedIds.has(m.id);
          return (
            <li key={m.id} className={`rounded-xl border p-3 flex items-start gap-2 ${got ? "border-primary/50 bg-primary/5" : "border-border bg-background"}`}>
              {got ? <Trophy className="w-4 h-4 text-primary mt-0.5 shrink-0" /> : <Lock className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />}
              <div className="min-w-0">
                <div className="text-sm font-semibold truncate">{m.title}</div>
                {m.description && <div className="text-[11px] text-muted-foreground line-clamp-2">{m.description}</div>}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
