import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Salad } from "lucide-react";

export function NutritionCard({ userId }: { userId: string }) {
  const [n, setN] = useState<{ consistency_pct: number; protein_pct: number; hydration_pct: number } | null>(null);
  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("nutrition_scores").select("consistency_pct, protein_pct, hydration_pct").eq("user_id", userId).maybeSingle();
      if (data) setN(data);
    })();
  }, [userId]);

  const rows = [
    { label: "Consistency", value: n?.consistency_pct ?? 0 },
    { label: "Protein", value: n?.protein_pct ?? 0 },
    { label: "Hydration", value: n?.hydration_pct ?? 0 },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-primary"><Salad className="w-4 h-4" /><span className="text-xs uppercase tracking-[0.18em]">goBoho Nutrition</span></div>
        {!n && <span className="text-[11px] text-muted-foreground">Your coach will update this.</span>}
      </div>
      <h3 className="font-bold mt-1">Habits, not calories</h3>
      <div className="mt-4 space-y-3">
        {rows.map((r) => (
          <div key={r.label}>
            <div className="flex justify-between text-xs"><span className="text-muted-foreground">{r.label}</span><span className="tabular-nums font-semibold">{r.value}%</span></div>
            <div className="h-2 mt-1 rounded-full bg-muted overflow-hidden"><div className="h-full bg-primary" style={{ width: `${r.value}%` }} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}
