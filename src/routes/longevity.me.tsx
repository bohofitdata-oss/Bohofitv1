import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { SiteShell } from "@/components/SiteShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client.bohofit";
import { toast } from "sonner";
import {
  Heart,
  Users,
  Sparkles,
  Calendar,
  Copy,
  RefreshCw,
  CheckCircle2,
  Smile,
  Moon,
  Activity,
  Download,
} from "lucide-react";
import jsPDF from "jspdf";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/longevity/me")({
  head: () => ({ meta: [{ title: "My Bohofit at 50+ — Member" }] }),
  component: MyLongevityPage,
});

type Member = {
  id: string;
  user_id: string;
  first_name: string;
  program_name: string;
  sessions_total: number;
  sessions_completed: number;
  family_name: string | null;
  family_phone: string | null;
  family_share_token: string | null;
  next_session_at: string | null;
};
type SessionRow = {
  id: string;
  session_number: number;
  session_date: string;
  workout: string | null;
  observation: string | null;
  modification: string | null;
  share_with_family: boolean;
};
type Milestones = {
  stairs: boolean;
  sit_stand: boolean;
  stronger: boolean;
  sleep_better: boolean;
  more_energy: boolean;
};
type CheckIn = {
  id: string;
  energy: number;
  pain_level: number;
  pain_part: string | null;
  sleep: number;
  note: string | null;
  created_at: string;
};

const MILESTONE_LIST: { key: keyof Milestones; label: string }[] = [
  { key: "stairs", label: "I can climb stairs without discomfort" },
  { key: "sit_stand", label: "I can sit and stand without support" },
  { key: "stronger", label: "I feel stronger than when I started" },
  { key: "sleep_better", label: "My sleep has improved" },
  { key: "more_energy", label: "I feel more energetic during the day" },
];

const ENERGY_FACES = ["😞", "😐", "🙂", "😊", "🤩"];

const checkinSchema = z.object({
  energy: z.number().min(1).max(5),
  pain_level: z.number().min(1).max(5),
  pain_part: z.string().max(40).optional().nullable(),
  sleep: z.number().min(1).max(5),
  note: z.string().max(500).optional().nullable(),
});

function MyLongevityPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [member, setMember] = useState<Member | null>(null);
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [milestones, setMilestones] = useState<Milestones>({
    stairs: false,
    sit_stand: false,
    stronger: false,
    sleep_better: false,
    more_energy: false,
  });
  const [checkins, setCheckins] = useState<CheckIn[]>([]);

  // family form state
  const [familyName, setFamilyName] = useState("");
  const [familyPhone, setFamilyPhone] = useState("");

  // weekly check-in state
  const [energy, setEnergy] = useState(3);
  const [pain, setPain] = useState(1);
  const [painPart, setPainPart] = useState<string>("");
  const [sleep, setSleep] = useState(3);
  const [note, setNote] = useState("");
  const [submittingCheckin, setSubmittingCheckin] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        navigate({ to: "/auth" });
        return;
      }
      const uid = sess.session.user.id;
      const { data: m } = await supabase
        .from("longevity_members")
        .select("*")
        .eq("user_id", uid)
        .maybeSingle();

      if (!m) {
        setLoading(false);
        return;
      }
      setMember(m as Member);
      setFamilyName(m.family_name ?? "");
      setFamilyPhone(m.family_phone ?? "");

      const [{ data: s }, { data: ms }, { data: c }] = await Promise.all([
        supabase
          .from("longevity_sessions")
          .select("*")
          .eq("member_id", m.id)
          .order("session_date", { ascending: false }),
        supabase.from("longevity_milestones").select("*").eq("member_id", m.id).maybeSingle(),
        supabase
          .from("longevity_checkins")
          .select("*")
          .eq("member_id", m.id)
          .order("created_at", { ascending: false })
          .limit(12),
      ]);
      if (s) setSessions(s as SessionRow[]);
      if (ms) {
        setMilestones({
          stairs: ms.stairs,
          sit_stand: ms.sit_stand,
          stronger: ms.stronger,
          sleep_better: ms.sleep_better,
          more_energy: ms.more_energy,
        });
      }
      if (c) setCheckins(c as CheckIn[]);
      setLoading(false);
    })();
  }, [navigate]);

  // ----- Family Connect -----
  const saveFamily = async (regenerate = false) => {
    if (!member) return;
    if (!familyName.trim() || !familyPhone.trim()) {
      return toast.error("Add your family member's name and number");
    }
    const newToken = regenerate || !member.family_share_token ? crypto.randomUUID() : member.family_share_token;
    const { error } = await supabase
      .from("longevity_members")
      .update({
        family_name: familyName.trim(),
        family_phone: familyPhone.trim(),
        family_share_token: newToken,
      })
      .eq("id", member.id);
    if (error) return toast.error(error.message);
    setMember({ ...member, family_name: familyName, family_phone: familyPhone, family_share_token: newToken });
    toast.success(regenerate ? "New link generated. Old link no longer works." : "Family Connect saved");
  };

  const familyUrl = member?.family_share_token
    ? `${window.location.origin}/family/${member.family_share_token}`
    : "";

  const copyFamily = async () => {
    if (!familyUrl) return;
    await navigator.clipboard.writeText(familyUrl);
    toast.success("Link copied");
  };

  // ----- Milestones -----
  const toggleMilestone = async (key: keyof Milestones) => {
    if (!member) return;
    const next = { ...milestones, [key]: !milestones[key] };
    setMilestones(next);
    const { error } = await supabase
      .from("longevity_milestones")
      .upsert({ member_id: member.id, ...next }, { onConflict: "member_id" });
    if (error) toast.error(error.message);
  };

  // ----- Weekly check-in -----
  const lastCheckin = checkins[0];
  const daysSinceCheckin = lastCheckin
    ? Math.floor((Date.now() - new Date(lastCheckin.created_at).getTime()) / 86400000)
    : 999;
  const showCheckinCard = daysSinceCheckin >= 7;

  const submitCheckin = async () => {
    if (!member) return;
    const parsed = checkinSchema.safeParse({
      energy,
      pain_level: pain,
      pain_part: painPart || null,
      sleep,
      note: note || null,
    });
    if (!parsed.success) return toast.error("Check the form");
    setSubmittingCheckin(true);
    const { data, error } = await supabase
      .from("longevity_checkins")
      .insert({ member_id: member.id, ...parsed.data })
      .select()
      .single();
    setSubmittingCheckin(false);
    if (error) return toast.error(error.message);
    setCheckins([data as CheckIn, ...checkins]);
    setNote("");
    setPainPart("");
    toast.success("Thanks — your trainer will see this");
  };

  if (loading) {
    return (
      <SiteShell>
        <div className="container mx-auto px-5 py-20 text-center text-muted-foreground">Loading…</div>
      </SiteShell>
    );
  }

  if (!member) {
    return (
      <SiteShell>
        <section className="container mx-auto max-w-lg px-5 py-20 text-center">
          <Heart className="w-10 h-10 text-primary mx-auto" />
          <h1 className="mt-4 text-2xl md:text-3xl font-black">You&rsquo;re not enrolled in Bohofit at 50+ yet</h1>
          <p className="mt-3 text-muted-foreground">
            Members are enrolled by the trainer after an in-person assessment at our HSR Layout studio.
            Once enrolled, this page becomes your personal program home.
          </p>
        </section>
      </SiteShell>
    );
  }

  // Build timeline (sessions + milestones-as-event)
  const completed = MILESTONE_LIST.filter((m) => milestones[m.key]).length;

  // ----- PDF download: progress timeline -----
  const downloadProgressPdf = () => {
    if (!member) return;
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 48;
    let y = margin;

    const ensureSpace = (need: number) => {
      if (y + need > pageH - margin) {
        doc.addPage();
        y = margin;
      }
    };
    const wrap = (text: string, size: number, maxW: number) => {
      doc.setFontSize(size);
      return doc.splitTextToSize(text, maxW) as string[];
    };

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Bohofit at 50+ — Progress Timeline", margin, y);
    y += 24;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(120);
    doc.text(`${member.first_name}  ·  ${member.program_name}`, margin, y);
    y += 14;
    doc.text(`Generated ${new Date().toLocaleDateString()}`, margin, y);
    y += 22;
    doc.setTextColor(0);

    // Snapshot
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("Snapshot", margin, y);
    y += 16;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const snap = [
      `Sessions completed: ${member.sessions_completed} / ${member.sessions_total}`,
      `Milestones reached: ${completed} / 5`,
      `Weekly check-ins logged: ${checkins.length}`,
    ];
    snap.forEach((line) => { doc.text(line, margin, y); y += 14; });
    y += 6;

    // Initial check-in (oldest) vs latest check-in
    if (checkins.length) {
      const oldest = checkins[checkins.length - 1];
      const latest = checkins[0];
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text("How you started vs. now", margin, y); y += 16;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      const colW = (pageW - margin * 2) / 2 - 8;
      const startLines = [
        `Started: ${new Date(oldest.created_at).toLocaleDateString()}`,
        `Energy: ${oldest.energy}/5`,
        `Sleep: ${oldest.sleep}/5`,
        `Pain: ${oldest.pain_level}/5${oldest.pain_part ? ` (${oldest.pain_part})` : ""}`,
      ];
      const nowLines = [
        `Latest: ${new Date(latest.created_at).toLocaleDateString()}`,
        `Energy: ${latest.energy}/5`,
        `Sleep: ${latest.sleep}/5`,
        `Pain: ${latest.pain_level}/5${latest.pain_part ? ` (${latest.pain_part})` : ""}`,
      ];
      const rows = Math.max(startLines.length, nowLines.length);
      for (let i = 0; i < rows; i++) {
        ensureSpace(14);
        if (startLines[i]) doc.text(startLines[i], margin, y);
        if (nowLines[i]) doc.text(nowLines[i], margin + colW + 16, y);
        y += 14;
      }
      y += 8;
    }

    // Notable achievements (milestones)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    ensureSpace(20);
    doc.text("Notable achievements", margin, y); y += 16;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const achieved = MILESTONE_LIST.filter((m) => milestones[m.key]);
    if (achieved.length === 0) {
      doc.setTextColor(120);
      doc.text("No milestones marked yet.", margin, y); y += 14;
      doc.setTextColor(0);
    } else {
      achieved.forEach((m) => {
        ensureSpace(14);
        doc.text(`• ${m.label}`, margin, y); y += 14;
      });
    }
    y += 10;

    // Trainer sessions
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    ensureSpace(20);
    doc.text("Trainer sessions", margin, y); y += 16;
    if (sessions.length === 0) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(120);
      doc.text("No sessions logged yet.", margin, y); y += 14;
      doc.setTextColor(0);
    } else {
      const ordered = [...sessions].sort((a, b) => a.session_date.localeCompare(b.session_date));
      ordered.forEach((s) => {
        ensureSpace(48);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text(
          `Session ${s.session_number} — ${new Date(s.session_date).toLocaleDateString()}`,
          margin,
          y,
        );
        y += 14;
        doc.setFont("helvetica", "normal");
        if (s.workout) {
          const lines = wrap(`Workout: ${s.workout}`, 10, pageW - margin * 2);
          lines.forEach((l) => { ensureSpace(12); doc.text(l, margin, y); y += 12; });
        }
        if (s.observation) {
          const lines = wrap(`Coach note: ${s.observation}`, 10, pageW - margin * 2);
          lines.forEach((l) => { ensureSpace(12); doc.text(l, margin, y); y += 12; });
        }
        if (s.modification) {
          const lines = wrap(`Adjustment: ${s.modification}`, 10, pageW - margin * 2);
          lines.forEach((l) => { ensureSpace(12); doc.text(l, margin, y); y += 12; });
        }
        y += 6;
      });
    }

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor(150);
      doc.text(`Bohofit  ·  Page ${i} of ${pageCount}`, margin, pageH - 20);
    }

    doc.save(`Bohofit-50plus-progress-${member.first_name}-${new Date().toISOString().slice(0, 10)}.pdf`);
  };


  return (
    <SiteShell>
      <section className="container mx-auto px-5 py-8 md:py-12 max-w-3xl">
        {/* Hero */}
        <div className="rounded-2xl border border-border bg-card p-5 md:p-7">
          <p className="text-xs uppercase tracking-[0.18em] text-primary">Bohofit at 50+</p>
          <h1 className="mt-1 text-2xl md:text-3xl font-black">Welcome back, {member.first_name}.</h1>
          <div className="mt-5 grid grid-cols-3 gap-3">
            <div className="text-center rounded-xl border border-border/60 p-3">
              <div className="text-2xl font-black text-gradient-gold">
                {member.sessions_completed}/{member.sessions_total}
              </div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">Sessions</div>
            </div>
            <div className="text-center rounded-xl border border-border/60 p-3">
              <div className="text-2xl font-black text-gradient-gold">{completed}/5</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">Milestones</div>
            </div>
            <div className="text-center rounded-xl border border-border/60 p-3">
              <div className="text-2xl font-black text-gradient-gold">{checkins.length}</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">Check-ins</div>
            </div>
          </div>
          {member.next_session_at && (
            <div className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 text-primary" /> Next session:{" "}
              <span className="text-foreground font-semibold">
                {new Date(member.next_session_at).toLocaleString()}
              </span>
            </div>
          )}
          <div className="mt-5 flex flex-wrap gap-2">
            <Button
              onClick={downloadProgressPdf}
              size="sm"
              className="bg-gradient-gold text-primary-foreground border-0 hover:opacity-90"
            >
              <Download className="w-4 h-4 mr-1.5" /> Download progress PDF
            </Button>
          </div>
        </div>

        {/* WEEKLY CHECK-IN NUDGE */}
        {showCheckinCard && (
          <div className="mt-6 rounded-2xl border border-primary/40 bg-gradient-to-br from-primary/10 to-transparent p-5 md:p-6">
            <div className="flex items-center gap-2">
              <Smile className="w-5 h-5 text-primary" />
              <h2 className="text-lg md:text-xl font-black">How are you feeling this week?</h2>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Takes under a minute. Just a friendly nudge — no medical jargon.
            </p>

            <div className="mt-5 space-y-5">
              {/* Energy */}
              <div>
                <Label className="text-sm">Energy this week</Label>
                <div className="mt-2 flex justify-between gap-1">
                  {ENERGY_FACES.map((face, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setEnergy(i + 1)}
                      className={cn(
                        "flex-1 aspect-square rounded-xl border text-2xl transition",
                        energy === i + 1
                          ? "border-primary bg-primary/10 scale-105"
                          : "border-border bg-card hover:border-primary/40",
                      )}
                      aria-label={`Energy ${i + 1}`}
                    >
                      {face}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pain */}
              <div>
                <Label className="text-sm">Body pain (1 = none, 5 = a lot)</Label>
                <div className="mt-2 grid grid-cols-5 gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setPain(n)}
                      className={cn(
                        "rounded-xl border py-2 font-bold transition",
                        pain === n
                          ? "border-primary bg-primary/10"
                          : "border-border bg-card hover:border-primary/40",
                      )}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                {pain > 1 && (
                  <div className="mt-3">
                    <Label className="text-xs text-muted-foreground">Where? (optional)</Label>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {["knee", "back", "shoulder", "hip", "other"].map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPainPart(painPart === p ? "" : p)}
                          className={cn(
                            "rounded-full border px-3 py-1 text-xs capitalize",
                            painPart === p
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/40",
                          )}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sleep */}
              <div>
                <Label className="text-sm flex items-center gap-1.5"><Moon className="w-3.5 h-3.5" /> Sleep quality</Label>
                <div className="mt-2 grid grid-cols-5 gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setSleep(n)}
                      className={cn(
                        "rounded-xl border py-2 font-bold transition",
                        sleep === n
                          ? "border-primary bg-primary/10"
                          : "border-border bg-card hover:border-primary/40",
                      )}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="note" className="text-sm">Anything you want your trainer to know?</Label>
                <Textarea
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  maxLength={500}
                  className="mt-1.5"
                  placeholder="Optional — a sentence or two is plenty."
                />
              </div>

              <Button
                onClick={submitCheckin}
                disabled={submittingCheckin}
                className="w-full bg-gradient-gold text-primary-foreground border-0 hover:opacity-90"
              >
                {submittingCheckin ? "Sending…" : "Send to trainer"}
              </Button>
            </div>
          </div>
        )}

        {/* FAMILY CONNECT */}
        <div className="mt-6 rounded-2xl border border-border bg-card p-5 md:p-6">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <h2 className="text-lg md:text-xl font-black">Family Connect</h2>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Share a private progress page with one family member. They don&rsquo;t need an account.
          </p>
          <div className="mt-4 grid sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="fam_name" className="text-sm">Family member name</Label>
              <Input
                id="fam_name"
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                maxLength={80}
                className="mt-1"
                placeholder="e.g. Priya (daughter)"
              />
            </div>
            <div>
              <Label htmlFor="fam_phone" className="text-sm">WhatsApp number</Label>
              <Input
                id="fam_phone"
                value={familyPhone}
                onChange={(e) => setFamilyPhone(e.target.value)}
                maxLength={20}
                className="mt-1"
                placeholder="e.g. +91 98xxxxxxxx"
              />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              onClick={() => saveFamily(false)}
              className="bg-gradient-gold text-primary-foreground border-0 hover:opacity-90"
            >
              {member.family_share_token ? "Save changes" : "Generate share link"}
            </Button>
            {member.family_share_token && (
              <Button onClick={() => saveFamily(true)} variant="outline">
                <RefreshCw className="w-4 h-4 mr-1" /> New link (revoke old)
              </Button>
            )}
          </div>
          {familyUrl && (
            <div className="mt-4 rounded-xl bg-muted/30 border border-border p-3 flex items-center gap-2">
              <code className="text-xs flex-1 truncate">{familyUrl}</code>
              <Button onClick={copyFamily} size="sm" variant="ghost">
                <Copy className="w-4 h-4" />
              </Button>
              {member.family_phone && (
                <a
                  href={`https://wa.me/${member.family_phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi! Here's my Bohofit progress: ${familyUrl}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-primary"
                >
                  Send via WhatsApp
                </a>
              )}
            </div>
          )}
        </div>

        {/* MILESTONES */}
        <div className="mt-6 rounded-2xl border border-border bg-card p-5 md:p-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="text-lg md:text-xl font-black">My milestones</h2>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Tick what feels true today. Update anytime.</p>
          <div className="mt-4 space-y-2">
            {MILESTONE_LIST.map((m) => (
              <label
                key={m.key}
                className={cn(
                  "flex items-center gap-3 rounded-xl border p-3.5 cursor-pointer transition",
                  milestones[m.key]
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40",
                )}
              >
                <Checkbox
                  checked={milestones[m.key]}
                  onCheckedChange={() => toggleMilestone(m.key)}
                />
                <span className="text-sm">{m.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* TIMELINE */}
        <div className="mt-6 rounded-2xl border border-border bg-card p-5 md:p-6">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            <h2 className="text-lg md:text-xl font-black">My progress timeline</h2>
          </div>
          {sessions.length === 0 && checkins.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              Your trainer will log sessions here after each visit.
            </p>
          ) : (
            <div className="mt-5 relative pl-5 border-l border-border space-y-5">
              {sessions.map((s) => (
                <div key={s.id} className="relative">
                  <span className="absolute -left-[1.4rem] top-1.5 w-3 h-3 rounded-full bg-gradient-gold" />
                  <div className="text-xs text-muted-foreground">
                    Session {s.session_number} · {new Date(s.session_date).toLocaleDateString()}
                  </div>
                  {s.workout && <div className="text-sm font-semibold mt-1">{s.workout}</div>}
                  {s.observation && (
                    <p className="text-sm text-muted-foreground mt-1">&ldquo;{s.observation}&rdquo;</p>
                  )}
                  {s.modification && (
                    <p className="text-xs text-primary mt-1">Modification: {s.modification}</p>
                  )}
                </div>
              ))}
              {checkins.slice(0, 6).map((c) => (
                <div key={c.id} className="relative">
                  <span className="absolute -left-[1.4rem] top-1.5 w-3 h-3 rounded-full bg-muted-foreground/40" />
                  <div className="text-xs text-muted-foreground">
                    Check-in · {new Date(c.created_at).toLocaleDateString()}
                  </div>
                  <div className="text-sm mt-1">
                    Energy {ENERGY_FACES[c.energy - 1]} · Pain {c.pain_level}/5
                    {c.pain_part ? ` (${c.pain_part})` : ""} · Sleep {c.sleep}/5
                  </div>
                  {c.note && <p className="text-sm text-muted-foreground mt-1">&ldquo;{c.note}&rdquo;</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        {!showCheckinCard && lastCheckin && (
          <p className="mt-6 text-center text-xs text-muted-foreground inline-flex items-center gap-1.5 w-full justify-center">
            <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
            Next check-in available in {7 - daysSinceCheckin} day{7 - daysSinceCheckin === 1 ? "" : "s"}
          </p>
        )}
      </section>
    </SiteShell>
  );
}
