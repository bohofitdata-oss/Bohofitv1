import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

type State =
  | { kind: "loading" }
  | { kind: "active-with-sessions"; days: number }
  | { kind: "active-no-sessions" }
  | { kind: "paused"; until: string }
  | { kind: "none" };

export function DashboardBanner({ userId }: { userId: string }) {
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    if (!userId) return;
    (async () => {
      const { data: m } = await supabase
        .from("memberships")
        .select("id, status, end_date")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!m || m.status === "cancelled" || m.status === "expired") {
        return setState({ kind: "none" });
      }

      if (m.status === "paused") {
        // try to read pause table
        const { data: p } = await supabase
          .from("membership_pauses")
          .select("pause_end")
          .eq("membership_id", m.id)
          .order("pause_end", { ascending: false })
          .limit(1)
          .maybeSingle();
        return setState({ kind: "paused", until: p?.pause_end ?? m.end_date });
      }

      // active — count sessions this month
      const start = new Date();
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      const { data: logs } = await supabase
        .from("progress_logs")
        .select("id, attended, log_date")
        .eq("user_id", userId)
        .gte("log_date", start.toISOString().slice(0, 10));
      const days = (logs ?? []).filter((l) => l.attended).length;
      if (days > 0) setState({ kind: "active-with-sessions", days });
      else setState({ kind: "active-no-sessions" });
    })();
  }, [userId]);

  if (state.kind === "loading") return null;

  const base = "rounded-2xl px-4 py-3 md:px-5 md:py-4 text-sm md:text-base font-semibold";

  if (state.kind === "active-with-sessions") {
    return (
      <div
        className={base}
        style={{
          background: "rgba(137,1,10,0.15)",
          border: "1px solid rgba(137,1,10,0.4)",
          color: "#FFFFFF",
        }}
      >
        🔥 You worked out <span style={{ color: "#FF2233" }}>{state.days} day{state.days === 1 ? "" : "s"}</span> this month. Keep showing up.
      </div>
    );
  }
  if (state.kind === "active-no-sessions") {
    return (
      <div
        className={base}
        style={{
          background: "rgba(137,1,10,0.15)",
          border: "1px solid rgba(137,1,10,0.4)",
          color: "#FFFFFF",
        }}
      >
        Your programme is active. Show up today — your slot is waiting.
      </div>
    );
  }
  if (state.kind === "paused") {
    return (
      <div
        className={base}
        style={{
          background: "rgba(255,165,0,0.08)",
          border: "1px solid rgba(255,165,0,0.3)",
          color: "#FFFFFF",
        }}
      >
        ⏸ Your membership is paused until <span style={{ color: "#FFA500" }}>{state.until}</span>.
      </div>
    );
  }
  return (
    <div
      className={base}
      style={{
        background: "rgba(137,1,10,0.10)",
        border: "1px solid rgba(137,1,10,0.30)",
        color: "#FFFFFF",
      }}
    >
      Be a Rebél. Your first session is waiting.{" "}
      <Link to="/" className="ml-2 font-bold" style={{ color: "#FF2233" }}>
        Choose a programme →
      </Link>
    </div>
  );
}
