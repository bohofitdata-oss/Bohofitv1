import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Check, MessageCircle } from "lucide-react";
import { waLink, BOHOFIT_WHATSAPP } from "@/lib/whatsapp";

type Program = "unpause" | "fifty_plus";

const PROGRAM_LABEL: Record<Program, string> = {
  unpause: "Rebél Unpause",
  fifty_plus: "Rebél at 50+",
};

// Slots: hourly, 07:00 → 19:00
const TIME_SLOTS = [
  "07:00","08:00","09:00","10:00","11:00","12:00",
  "16:00","17:00","18:00","19:00",
];

function fmtTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hr = h % 12 === 0 ? 12 : h % 12;
  return `${hr}:${m.toString().padStart(2, "0")} ${period}`;
}

function nextDays(n: number) {
  const out: { iso: string; label: string; weekday: string }[] = [];
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  let added = 0;
  let cursor = 0;
  while (added < n && cursor < n * 2) {
    const day = new Date(d);
    day.setDate(d.getDate() + cursor);
    cursor++;
    // Skip Sundays (studio closed)
    if (day.getDay() === 0) continue;
    const iso = day.toISOString().slice(0, 10);
    const weekday = day.toLocaleDateString(undefined, { weekday: "short" });
    const label = day.toLocaleDateString(undefined, { day: "numeric", month: "short" });
    out.push({ iso, label, weekday });
    added++;
  }
  return out;
}

const schema = z.object({
  full_name: z.string().trim().min(1, "Name is required").max(120),
  phone: z.string().trim().min(6, "Phone is required").max(20),
  email: z.string().trim().email("Valid email required").max(255),
  age: z.coerce.number({ invalid_type_error: "Age required" }).int().min(15).max(100),
});

interface Props {
  program: Program;
  /** Optional problem-area selections carried into notes (used by 50+) */
  problemAreas?: string[];
  /** Optional label above the section */
  eyebrow?: string;
  headline?: string;
  subtext?: string;
}

export function ConsultationBooking({ program, problemAreas = [], eyebrow, headline, subtext }: Props) {
  const days = useMemo(() => nextDays(10), []);
  const [date, setDate] = useState<string>(days[0]?.iso ?? "");
  const [time, setTime] = useState<string | null>(null);
  const [taken, setTaken] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState<{ name: string; date: string; time: string } | null>(null);

  useEffect(() => {
    if (!date) return;
    let ignore = false;
    supabase
      .rpc("consultation_taken_slots", { _program: program, _date: date })
      .then(({ data }) => {
        if (ignore) return;
        setTaken(((data ?? []) as { consult_time: string }[]).map((r) => r.consult_time));
        setTime((t) => (t && ((data ?? []) as { consult_time: string }[]).some((r) => r.consult_time === t) ? null : t));
      });
    return () => { ignore = true; };
  }, [date, program, submitted]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!date) return toast.error("Pick a day");
    if (!time) return toast.error("Pick a time slot");
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse(Object.fromEntries(fd));
    if (!parsed.success) return toast.error(parsed.error.issues[0]?.message ?? "Check the form");
    const notes = (fd.get("notes") as string) || null;
    setLoading(true);
    const { data, error } = await supabase
      .from("consultations")
      .insert({
        program,
        full_name: parsed.data.full_name,
        phone: parsed.data.phone,
        email: parsed.data.email,
        age: parsed.data.age,
        consult_date: date,
        consult_time: time,
        problem_areas: problemAreas,
        notes,
      })
      .select("id")
      .single();

    if (error || !data) {
      setLoading(false);
      if (error?.code === "23505") {
        toast.error("That slot was just taken. Please pick another time.");
        setTaken((t) => [...t, time]);
        setTime(null);
      } else {
        toast.error(error?.message ?? "Something went wrong");
      }
      return;
    }

    // Trigger team notification (WhatsApp + email). Silently ignore if not deployed yet.
    // TODO: configure notify-consultation edge function with WhatsApp & email credentials.
    try {
      await supabase.functions.invoke("notify-consultation", {
        body: {
          consultation_id: data.id,
          program: PROGRAM_LABEL[program],
          full_name: parsed.data.full_name,
          phone: parsed.data.phone,
          email: parsed.data.email,
          consult_date: date,
          consult_time: time,
          problem_areas: problemAreas,
          notes,
        },
      });
    } catch { /* non-blocking */ }

    setLoading(false);
    setSubmitted({ name: parsed.data.full_name, date, time });
  };

  if (submitted) {
    const dayLabel = days.find((d) => d.iso === submitted.date);
    const summary = `${dayLabel?.weekday ?? ""} ${dayLabel?.label ?? submitted.date} · ${fmtTime(submitted.time)}`;
    const waMsg = `Hi ${submitted.name.split(" ")[0]}, your Rebél consultation for ${PROGRAM_LABEL[program]} is booked ✅\nWhen: ${summary}\nWe'll call you shortly to confirm.`;
    return (
      <div className="rebel-card rounded-2xl p-6 md:p-8 text-center">
        <div
          className="mx-auto w-14 h-14 rounded-full flex items-center justify-center"
          style={{ background: "#89010A" }}
        >
          <Check className="w-7 h-7 text-white" />
        </div>
        <h3 className="mt-5 text-2xl md:text-3xl font-black text-white">
          You're on, {submitted.name.split(" ")[0]}.
        </h3>
        <p className="mt-3 text-[15px]" style={{ color: "#CCCCCC" }}>
          {PROGRAM_LABEL[program]} — free consultation
        </p>
        <p className="mt-1 font-semibold text-white">{summary}</p>
        <p className="mt-4 text-sm" style={{ color: "#CCCCCC" }}>
          You'll receive a WhatsApp / email confirmation. Team Rebél will call you within 2 hours.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild className="bg-[#25D366] text-white border-0 hover:opacity-90">
            <a href={waLink(BOHOFIT_WHATSAPP, waMsg)} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-4 h-4 mr-2" /> Confirm on WhatsApp
            </a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rebel-card rounded-2xl p-6 md:p-8 space-y-6">
      {eyebrow && (
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: "#89010A" }}>
          {eyebrow}
        </p>
      )}
      {headline && (
        <h3
          className="font-black text-white"
          style={{ fontSize: "clamp(24px, 4vw, 36px)", letterSpacing: "-0.02em", lineHeight: "1.05" }}
        >
          {headline}
        </h3>
      )}
      {subtext && <p style={{ color: "#CCCCCC" }} className="text-sm md:text-[15px]">{subtext}</p>}

      {/* DAY */}
      <div>
        <p className="text-sm font-semibold text-white">Pick a day</p>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {days.map((d) => {
            const active = d.iso === date;
            return (
              <button
                key={d.iso}
                type="button"
                onClick={() => setDate(d.iso)}
                className={cn(
                  "shrink-0 rounded-xl border px-4 py-3 text-center transition-colors min-w-[72px]",
                  active
                    ? "text-white"
                    : "text-white/70 border-white/10 hover:border-white/30",
                )}
                style={active ? { borderColor: "#89010A", background: "rgba(137,1,10,0.18)" } : undefined}
              >
                <div className="text-[10px] uppercase tracking-widest opacity-70">{d.weekday}</div>
                <div className="text-sm font-bold mt-0.5">{d.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* TIME */}
      <div>
        <p className="text-sm font-semibold text-white">Pick a time slot</p>
        <p className="text-xs mt-1" style={{ color: "#CCCCCC" }}>
          1:1 slots — one person per slot. Greyed slots are taken.
        </p>
        <div className="mt-3 grid grid-cols-3 sm:grid-cols-5 gap-2">
          {TIME_SLOTS.map((t) => {
            const isTaken = taken.includes(t);
            const active = t === time;
            return (
              <button
                key={t}
                type="button"
                disabled={isTaken}
                onClick={() => setTime(t)}
                className={cn(
                  "rounded-xl border px-2 py-2.5 text-sm font-semibold transition-colors",
                  isTaken
                    ? "border-white/5 bg-white/[0.02] text-white/25 cursor-not-allowed line-through"
                    : active
                      ? "text-white"
                      : "border-white/10 text-white/80 hover:border-white/30",
                )}
                style={active && !isTaken ? { borderColor: "#89010A", background: "rgba(137,1,10,0.18)" } : undefined}
              >
                {fmtTime(t)}
              </button>
            );
          })}
        </div>
      </div>

      {/* DETAILS */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="c_name" className="text-white">Full name</Label>
          <Input id="c_name" name="full_name" required maxLength={120} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="c_phone" className="text-white">Phone</Label>
          <Input id="c_phone" name="phone" required maxLength={20} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="c_email" className="text-white">Email</Label>
          <Input id="c_email" name="email" type="email" required maxLength={255} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="c_age" className="text-white">Age</Label>
          <Input id="c_age" name="age" type="number" required min={15} max={100} className="mt-1" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="c_notes" className="text-white">Anything we should know? (optional)</Label>
          <Textarea id="c_notes" name="notes" rows={3} maxLength={500} className="mt-1" placeholder="Your goal, medical history, questions…" />
        </div>
      </div>

      {problemAreas.length > 0 && (
        <div className="rounded-xl border border-white/10 p-3 text-xs" style={{ color: "#CCCCCC" }}>
          Selected concerns carried into your booking:{" "}
          <span className="text-white font-semibold">{problemAreas.join(", ")}</span>
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={loading}
        className="w-full text-white border-0 hover:opacity-90"
        style={{ background: "#89010A" }}
      >
        {loading ? "Reserving…" : "Reserve my spot"}
      </Button>
      <p className="text-[11px] text-center" style={{ color: "#CCCCCC" }}>
        Free 30-minute consultation. No payment required at this step.
      </p>
    </form>
  );
}
