import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Flame } from "lucide-react";

export function StreakCard({ userId }: { userId: string }) {
  const [current, setCurrent] = useState(0);
  const [longest, setLongest] = useState(0);
  const [weeks, setWeeks] = useState(0);

  useEffect(() => {
    (async () => {
      // Prefer cached row; fallback to computing from progress_logs
      const { data: s } = await supabase.from("member_streaks").select("current_streak, longest_streak, weeks_consistent").eq("user_id", userId).maybeSingle();
      if (s) { setCurrent(s.current_streak); setLongest(s.longest_streak); setWeeks(s.weeks_consistent); return; }
      const { data: logs } = await supabase.from("progress_logs").select("log_date, attended").eq("user_id", userId).eq("attended", true).order("log_date", { ascending: false }).limit(120);
      if (!logs) return;
      const dates = Array.from(new Set(logs.map((l) => l.log_date))).sort().reverse();
      let cur = 0;
      const today = new Date(); today.setHours(0,0,0,0);
      for (let i = 0; i < dates.length; i++) {
        const d = new Date(dates[i]); d.setHours(0,0,0,0);
        const diff = Math.round((today.getTime() - d.getTime()) / 86400000);
        if (diff <= i + 1) cur++; else break;
      }
      setCurrent(cur);
      setLongest(cur);
      // weeks: distinct ISO weeks with at least one attended session in last 8 weeks
      const wkSet = new Set<string>();
      dates.forEach((ds) => { const d = new Date(ds); const wk = `${d.getFullYear()}-${Math.floor((d.getTime() - new Date(d.getFullYear(),0,1).getTime())/(7*86400000))}`; wkSet.add(wk); });
      setWeeks(wkSet.size);
    })();
  }, [userId]);

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 text-primary"><Flame className="w-4 h-4" /><span className="text-xs uppercase tracking-[0.18em]">Consistency</span></div>
      <div className="mt-3 flex items-baseline gap-2"><span className="text-4xl font-black tabular-nums">{current}</span><span className="text-xs text-muted-foreground">day streak</span></div>
      <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
        <div><div className="text-muted-foreground">Longest</div><div className="text-base font-bold tabular-nums">{longest}</div></div>
        <div><div className="text-muted-foreground">Weeks active</div><div className="text-base font-bold tabular-nums">{weeks}</div></div>
      </div>
    </div>
  );
}
