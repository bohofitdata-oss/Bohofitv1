import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

type Item = {
  id: string;
  member_user_id: string;
  reason: string;
  status: string;
  notes: string | null;
  created_at: string;
  member?: { full_name: string | null; phone: string | null };
};

export function CoachQueueCard() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("coach_interventions").select("id, member_user_id, reason, status, notes, created_at").eq("status", "open").order("created_at", { ascending: false }).limit(50);
    if (data) {
      const ids = data.map((d) => d.member_user_id);
      const { data: profs } = await supabase.from("profiles").select("id, full_name, phone").in("id", ids);
      const map = new Map((profs ?? []).map((p) => [p.id, p]));
      setItems(data.map((d) => ({ ...d, member: map.get(d.member_user_id) ?? undefined })));
    }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const resolve = async (id: string) => {
    const { error } = await supabase.from("coach_interventions").update({ status: "resolved", resolved_at: new Date().toISOString() }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Resolved");
    load();
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-primary"><AlertTriangle className="w-4 h-4" /><span className="text-xs uppercase tracking-[0.18em]">Coach queue</span></div>
        <span className="text-xs text-muted-foreground">{items.length} open</span>
      </div>
      {loading ? <p className="mt-4 text-sm text-muted-foreground">Loading…</p> : items.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">No open interventions. Good work.</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {items.map((i) => (
            <li key={i.id} className="rounded-xl border border-border p-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="font-semibold text-sm truncate">{i.member?.full_name ?? "Member"}</div>
                <div className="text-xs text-muted-foreground">{i.reason}{i.member?.phone ? ` · ${i.member.phone}` : ""}</div>
                {i.notes && <div className="text-xs mt-1 line-clamp-2">{i.notes}</div>}
              </div>
              <Button size="sm" variant="outline" onClick={() => resolve(i.id)}><CheckCircle2 className="w-4 h-4 mr-1" />Resolve</Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
