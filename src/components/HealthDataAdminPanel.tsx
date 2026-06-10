import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { CONCERN_LABEL, type ConcernKey } from "@/lib/concerns";
import { Trash2, Download, Upload, MessageCircle, FileText } from "lucide-react";
import { waLink, BOHOFIT_WHATSAPP } from "@/lib/whatsapp";

type Person = { id: string; full_name: string | null; phone: string | null };
type Intake = {
  id: string; person_id: string | null; booking_id: string | null;
  concern_selected: ConcernKey; symptom_chips_selected: string[];
  consent_given: boolean; created_at: string;
};
type Checkin = {
  id: string; person_id: string; checkin_type: "baseline" | "periodic";
  strength_capability: number; energy: number; sleep_quality: number; joint_comfort: number; overall_wellbeing: number;
  created_at: string;
};
type SessionLog = {
  id: string; person_id: string; coach_id: string | null; session_date: string;
  attended: boolean; key_work: string | null; milestone_flag: boolean; note: string | null; created_at: string;
};
type LongevityMember = {
  id: string; user_id: string | null; first_name: string | null;
  sessions_completed: number; sessions_total: number;
  package_size: number; package_status: "active" | "completed" | "renewed" | "lapsed";
};

function toCSV(rows: Record<string, unknown>[]): string {
  if (!rows.length) return "";
  const keys = Object.keys(rows[0]);
  const esc = (v: unknown) => {
    if (v === null || v === undefined) return "";
    const s = Array.isArray(v) ? v.join("|") : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [keys.join(","), ...rows.map((r) => keys.map((k) => esc(r[k])).join(","))].join("\n");
}

function download(name: string, content: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = name; a.click();
  URL.revokeObjectURL(url);
}

export function HealthDataAdminPanel() {
  const [people, setPeople] = useState<Person[]>([]);
  const [intakes, setIntakes] = useState<Intake[]>([]);
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [logs, setLogs] = useState<SessionLog[]>([]);
  const [members, setMembers] = useState<LongevityMember[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  // session log form
  const [logDate, setLogDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [logAttended, setLogAttended] = useState(true);
  const [logKeyWork, setLogKeyWork] = useState("");
  const [logMilestone, setLogMilestone] = useState(false);
  const [logNote, setLogNote] = useState("");

  const load = async () => {
    const [{ data: pr }, { data: ci }, { data: oc }, { data: sl }, { data: lm }] = await Promise.all([
      supabase.from("profiles").select("id, full_name, phone").order("full_name"),
      supabase.from("concern_intake").select("*").order("created_at", { ascending: false }),
      supabase.from("outcome_checkins").select("*").order("created_at", { ascending: false }),
      supabase.from("session_logs").select("*").order("session_date", { ascending: false }),
      supabase.from("longevity_members").select("id, user_id, first_name, sessions_completed, sessions_total, package_size, package_status"),
    ]);
    if (pr) setPeople(pr as Person[]);
    if (ci) setIntakes(ci as Intake[]);
    if (oc) setCheckins(oc as Checkin[]);
    if (sl) setLogs(sl as SessionLog[]);
    if (lm) setMembers(lm as LongevityMember[]);
  };
  useEffect(() => { void load(); }, []);

  // Aggregates
  const byConcern = intakes.reduce<Record<string, number>>((acc, i) => {
    acc[i.concern_selected] = (acc[i.concern_selected] ?? 0) + 1; return acc;
  }, {});
  const byChip = intakes.reduce<Record<string, number>>((acc, i) => {
    if (!i.consent_given) return acc;
    for (const c of i.symptom_chips_selected) acc[c] = (acc[c] ?? 0) + 1;
    return acc;
  }, {});

  const personIntakes = selected ? intakes.filter((i) => i.person_id === selected) : [];
  const personCheckins = selected ? checkins.filter((c) => c.person_id === selected) : [];
  const personLogs = selected ? logs.filter((l) => l.person_id === selected) : [];
  const personMember = selected ? members.find((m) => m.user_id === selected) : null;
  const baseline = personCheckins.find((c) => c.checkin_type === "baseline");
  const latest = personCheckins[0];

  const submitLog = async () => {
    if (!selected) return toast.error("Pick a client first");
    const { data: sess } = await supabase.auth.getSession();
    const { error } = await supabase.from("session_logs").insert({
      person_id: selected,
      coach_id: sess.session?.user.id ?? null,
      session_date: logDate,
      attended: logAttended,
      key_work: logKeyWork || null,
      milestone_flag: logMilestone,
      note: logNote || null,
    });
    if (error) return toast.error(error.message);
    toast.success("Session logged");
    setLogKeyWork(""); setLogMilestone(false); setLogNote("");
    void load();
  };

  const deleteHealthData = async (uid: string) => {
    if (!confirm("Delete ALL health data (concern intake + outcome check-ins) for this person? Session logs are kept.")) return;
    await supabase.from("concern_intake").delete().eq("person_id", uid);
    await supabase.from("outcome_checkins").delete().eq("person_id", uid);
    toast.success("Health data deleted");
    void load();
  };

  const exportAll = () => {
    download("concern_intake.csv", toCSV(intakes as unknown as Record<string, unknown>[]));
    download("outcome_checkins.csv", toCSV(checkins as unknown as Record<string, unknown>[]));
    download("session_logs.csv", toCSV(logs as unknown as Record<string, unknown>[]));
    download("longevity_packages.csv", toCSV(members as unknown as Record<string, unknown>[]));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-2xl font-black">Rebél Unpause — health data</h2>
        <Button onClick={exportAll} variant="outline" size="sm"><Download className="w-4 h-4 mr-2" />Export CSV</Button>
      </div>

      {/* Aggregates */}
      <div className="grid md:grid-cols-2 gap-5">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="font-bold">Leads per concern</h3>
          <ul className="mt-3 space-y-1 text-sm">
            {(Object.keys(CONCERN_LABEL) as ConcernKey[]).map((k) => (
              <li key={k} className="flex justify-between"><span className="text-muted-foreground">{CONCERN_LABEL[k]}</span><span className="font-bold">{byConcern[k] ?? 0}</span></li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="font-bold">Symptom chip selections (consented)</h3>
          <ul className="mt-3 space-y-1 text-sm max-h-48 overflow-auto">
            {Object.entries(byChip).sort((a, b) => b[1] - a[1]).map(([c, n]) => (
              <li key={c} className="flex justify-between"><span className="text-muted-foreground">{c}</span><span className="font-bold">{n}</span></li>
            ))}
            {Object.keys(byChip).length === 0 && <li className="text-muted-foreground text-xs">No consented chip data yet.</li>}
          </ul>
        </div>
      </div>

      {/* Per-client */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-center gap-3">
          <Label className="text-sm">Client:</Label>
          <select value={selected ?? ""} onChange={(e) => setSelected(e.target.value || null)} className="bg-background border border-border rounded-md px-3 py-2 text-sm min-w-[240px]">
            <option value="">— pick —</option>
            {people.map((p) => <option key={p.id} value={p.id}>{p.full_name ?? p.id.slice(0, 8)} {p.phone ? `· ${p.phone}` : ""}</option>)}
          </select>
          {selected && (
            <Button onClick={() => deleteHealthData(selected)} variant="outline" size="sm" className="ml-auto">
              <Trash2 className="w-4 h-4 mr-2" />Delete health data
            </Button>
          )}
        </div>

        {selected && (
          <div className="mt-6 grid md:grid-cols-2 gap-5">
            <div className="rounded-xl border border-border p-4">
              <h4 className="font-bold text-sm">Concern & chips</h4>
              {personIntakes.length === 0 ? <p className="text-xs text-muted-foreground mt-2">No intake.</p> : personIntakes.map((i) => (
                <div key={i.id} className="mt-2 text-sm">
                  <div className="text-primary text-xs uppercase">{CONCERN_LABEL[i.concern_selected]} {i.consent_given ? "" : "· (no consent)"}</div>
                  <div className="text-muted-foreground text-xs">{i.symptom_chips_selected.join(", ") || "—"}</div>
                  <div className="text-[10px] text-muted-foreground">{new Date(i.created_at).toLocaleString()}</div>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-border p-4">
              <h4 className="font-bold text-sm">Check-ins (baseline vs latest)</h4>
              {!baseline && !latest ? <p className="text-xs text-muted-foreground mt-2">No check-ins.</p> : (
                <table className="mt-2 w-full text-xs">
                  <thead><tr><th className="text-left text-muted-foreground">Metric</th><th>Baseline</th><th>Latest</th></tr></thead>
                  <tbody>
                    {(["strength_capability", "energy", "sleep_quality", "joint_comfort", "overall_wellbeing"] as const).map((k) => (
                      <tr key={k}><td className="text-muted-foreground">{k}</td><td className="text-center">{baseline?.[k] ?? "—"}</td><td className="text-center font-bold">{latest?.[k] ?? "—"}</td></tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="rounded-xl border border-border p-4 md:col-span-2">
              <h4 className="font-bold text-sm">Package</h4>
              {personMember ? (
                <p className="mt-2 text-sm text-muted-foreground">
                  {personMember.sessions_completed}/{personMember.package_size} sessions ·
                  <span className="ml-2 font-bold text-primary uppercase">{personMember.package_status}</span>
                </p>
              ) : <p className="text-xs text-muted-foreground mt-2">Not enrolled in a Unpause package.</p>}
            </div>

            <div className="rounded-xl border border-border p-4 md:col-span-2">
              <h4 className="font-bold text-sm">Log a session</h4>
              <div className="grid sm:grid-cols-2 gap-3 mt-3">
                <div><Label>Date</Label><Input type="date" value={logDate} onChange={(e) => setLogDate(e.target.value)} /></div>
                <label className="flex items-end gap-2 pb-2"><Checkbox checked={logAttended} onCheckedChange={(v) => setLogAttended(!!v)} /> <span className="text-sm">Attended</span></label>
                <div className="sm:col-span-2"><Label>Key work (lifts / exercises + load)</Label><Input value={logKeyWork} onChange={(e) => setLogKeyWork(e.target.value)} placeholder="e.g. Goblet squat 3x8 @ 8kg" /></div>
                <label className="flex items-end gap-2 pb-2"><Checkbox checked={logMilestone} onCheckedChange={(v) => setLogMilestone(!!v)} /> <span className="text-sm">Milestone</span></label>
                <div className="sm:col-span-2"><Label>Note</Label><Textarea rows={2} value={logNote} onChange={(e) => setLogNote(e.target.value)} /></div>
              </div>
              <Button onClick={submitLog} className="mt-3 bg-gradient-gold text-primary-foreground border-0 hover:opacity-90">Save session log</Button>
            </div>

            <div className="rounded-xl border border-border p-4 md:col-span-2">
              <h4 className="font-bold text-sm">Session history ({personLogs.length})</h4>
              <div className="mt-2 max-h-64 overflow-auto">
                <table className="w-full text-xs">
                  <thead className="text-muted-foreground"><tr><th className="text-left">Date</th><th>Att.</th><th className="text-left">Key work</th><th>M</th><th className="text-left">Note</th></tr></thead>
                  <tbody>
                    {personLogs.map((l) => (
                      <tr key={l.id} className="border-t border-border/60">
                        <td>{l.session_date}</td>
                        <td className="text-center">{l.attended ? "✓" : "—"}</td>
                        <td>{l.key_work ?? "—"}</td>
                        <td className="text-center">{l.milestone_flag ? "★" : ""}</td>
                        <td className="text-muted-foreground">{l.note ?? ""}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
