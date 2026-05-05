import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Pause, Calendar } from "lucide-react";

type Membership = {
  id: string;
  program: string;
  tier: string;
  delivery: string;
  start_date: string;
  end_date: string;
  pause_balance_days: number;
  status: string;
};

const PROGRAM_LABEL: Record<string, string> = {
  start: "Bohofit Start",
  strength: "Boho Strength",
  unlimited: "Bohofit Unlimited",
  bootcamp: "Boho Bootcamp",
  longevity: "Bohofit at 50+",
};

export function MembershipCard({ userId }: { userId: string }) {
  const [m, setM] = useState<Membership | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState("2");
  const [start, setStart] = useState(new Date().toISOString().slice(0, 10));
  const [reason, setReason] = useState("");
  const [pausing, setPausing] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("memberships")
      .select("id, program, tier, delivery, start_date, end_date, pause_balance_days, status")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    setM((data as Membership) ?? null);
    setLoading(false);
  };
  useEffect(() => {
    if (userId) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  if (loading) return <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">Loading membership…</div>;

  if (!m) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="font-bold">No active membership yet</h3>
        <p className="text-sm text-muted-foreground mt-1">Once a coach activates your plan, your membership and pause balance will show up here.</p>
      </div>
    );
  }

  const minDays = m.pause_balance_days > 2 ? 2 : 1;

  const requestPause = async () => {
    const d = parseInt(days);
    if (Number.isNaN(d) || d <= 0) return toast.error("Enter a valid number of days");
    if (d < minDays) return toast.error(`Minimum pause is ${minDays} day(s)`);
    if (d > m.pause_balance_days) return toast.error("Not enough pause balance");
    setPausing(true);
    const { error } = await supabase.rpc("request_membership_pause", {
      _membership_id: m.id,
      _start: start,
      _days: d,
      _reason: reason || undefined,
    });
    setPausing(false);
    if (error) return toast.error(error.message);
    toast.success(`Paused for ${d} day(s). End date extended.`);
    setReason("");
    load();
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-start justify-between flex-wrap gap-2">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-primary">Your membership</p>
          <h3 className="font-black text-xl mt-1">{PROGRAM_LABEL[m.program] ?? m.program} · {m.tier}</h3>
          <p className="text-xs text-muted-foreground mt-1 capitalize">Delivery: {m.delivery}</p>
        </div>
        <span className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded-full font-semibold ${m.status === "active" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
          {m.status}
        </span>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3">
        <Stat icon={<Calendar className="w-4 h-4 text-primary" />} label="Ends" value={m.end_date} />
        <Stat icon={<Pause className="w-4 h-4 text-primary" />} label="Pause balance" value={`${m.pause_balance_days} days`} />
        <Stat label="Min pause" value={`${minDays} day${minDays > 1 ? "s" : ""}`} />
      </div>

      <div className="mt-5 rounded-xl border border-border p-4">
        <h4 className="font-bold text-sm">Pause your membership</h4>
        <p className="text-xs text-muted-foreground mt-1">
          {m.pause_balance_days > 2
            ? "Minimum 2 days. Your end date moves forward by the same number of days."
            : "Your balance is low — single-day pauses allowed now."}
        </p>
        <div className="mt-3 grid sm:grid-cols-3 gap-2">
          <div>
            <Label htmlFor="pstart" className="text-xs">Start date</Label>
            <Input id="pstart" type="date" value={start} onChange={(e) => setStart(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="pdays" className="text-xs">Days</Label>
            <Input id="pdays" type="number" min={minDays} max={m.pause_balance_days} value={days} onChange={(e) => setDays(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="preason" className="text-xs">Reason (optional)</Label>
            <Input id="preason" value={reason} onChange={(e) => setReason(e.target.value)} maxLength={120} className="mt-1" />
          </div>
        </div>
        <Button onClick={requestPause} disabled={pausing || m.pause_balance_days <= 0} className="mt-3 bg-gradient-gold text-primary-foreground border-0 hover:opacity-90">
          {pausing ? "Pausing…" : "Pause membership"}
        </Button>
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border p-3">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">{icon}{label}</div>
      <div className="mt-1 text-sm font-bold">{value}</div>
    </div>
  );
}
