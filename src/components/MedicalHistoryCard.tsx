import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client.bohofit";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { HeartPulse, Upload, Trash2 } from "lucide-react";

const CONDITIONS = [
  { key: "thyroid", label: "Thyroid" },
  { key: "pcos", label: "PCOD / PCOS" },
  { key: "fatty_liver", label: "Fatty liver" },
  { key: "diabetes", label: "Diabetes" },
  { key: "bp", label: "Blood pressure" },
  { key: "back_pain", label: "Back / knee pain" },
  { key: "post_injury", label: "Post-injury" },
];

type Attachment = { path: string; name: string };

export function MedicalHistoryCard({ userId }: { userId: string }) {
  const [conditions, setConditions] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [signed, setSigned] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("medical_history")
        .select("conditions, notes, attachments")
        .eq("user_id", userId)
        .maybeSingle();
      if (data) {
        setConditions((data.conditions as Record<string, boolean>) ?? {});
        setNotes(data.notes ?? "");
        const att = (data.attachments as Attachment[]) ?? [];
        setAttachments(att);
        const map: Record<string, string> = {};
        await Promise.all(
          att.map(async (a) => {
            const { data: s } = await supabase.storage.from("medical-files").createSignedUrl(a.path, 3600);
            if (s?.signedUrl) map[a.path] = s.signedUrl;
          }),
        );
        setSigned(map);
      }
    })();
  }, [userId]);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("medical_history")
      .upsert({ user_id: userId, conditions, notes: notes || null, attachments }, { onConflict: "user_id" });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Medical info saved");
  };

  const upload = async (file: File) => {
    if (file.size > 8 * 1024 * 1024) return toast.error("File must be under 8 MB");
    setUploading(true);
    const ext = file.name.split(".").pop() || "bin";
    const path = `${userId}/${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("medical-files").upload(path, file);
    if (upErr) {
      setUploading(false);
      return toast.error(upErr.message);
    }
    const next = [...attachments, { path, name: file.name }];
    const { error } = await supabase
      .from("medical_history")
      .upsert({ user_id: userId, conditions, notes: notes || null, attachments: next }, { onConflict: "user_id" });
    setUploading(false);
    if (error) return toast.error(error.message);
    setAttachments(next);
    const { data: s } = await supabase.storage.from("medical-files").createSignedUrl(path, 3600);
    if (s?.signedUrl) setSigned((m) => ({ ...m, [path]: s.signedUrl }));
    toast.success("File uploaded");
  };

  const remove = async (path: string) => {
    const next = attachments.filter((a) => a.path !== path);
    await supabase.storage.from("medical-files").remove([path]);
    await supabase.from("medical_history").upsert({ user_id: userId, conditions, notes: notes || null, attachments: next }, { onConflict: "user_id" });
    setAttachments(next);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center gap-2">
        <HeartPulse className="w-5 h-5 text-primary" />
        <h3 className="font-bold">Medical history</h3>
      </div>
      <p className="text-xs text-muted-foreground mt-1">So your coach plans around what your body actually needs.</p>

      <div className="mt-4 grid sm:grid-cols-3 gap-2">
        {CONDITIONS.map((c) => (
          <label key={c.key} className={`rounded-xl border p-3 text-sm cursor-pointer flex items-center gap-2 ${conditions[c.key] ? "border-primary bg-primary/10" : "border-border"}`}>
            <Checkbox checked={!!conditions[c.key]} onCheckedChange={(v) => setConditions({ ...conditions, [c.key]: !!v })} />
            {c.label}
          </label>
        ))}
      </div>

      <div className="mt-4">
        <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={1000} rows={3} placeholder="Anything else your coach should know — surgeries, medications, allergies…" />
      </div>

      <div className="mt-4">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Reports & prescriptions</p>
        <label className={`inline-flex items-center gap-2 rounded-md border border-border px-3 h-9 text-sm font-semibold cursor-pointer ${uploading ? "opacity-60" : "hover:border-primary"}`}>
          <Upload className="w-4 h-4 text-primary" /> {uploading ? "Uploading…" : "Upload file"}
          <input type="file" className="hidden" disabled={uploading} accept="image/*,.pdf"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = ""; }} />
        </label>
        {attachments.length > 0 && (
          <ul className="mt-3 space-y-2">
            {attachments.map((a) => (
              <li key={a.path} className="flex items-center justify-between gap-2 text-sm border border-border rounded-lg px-3 py-2">
                {signed[a.path] ? (
                  <a href={signed[a.path]} target="_blank" rel="noreferrer" className="text-primary underline truncate">{a.name}</a>
                ) : (
                  <span className="truncate">{a.name}</span>
                )}
                <button onClick={() => remove(a.path)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Button onClick={save} disabled={saving} className="mt-5 bg-gradient-gold text-primary-foreground border-0 hover:opacity-90">
        {saving ? "Saving…" : "Save medical info"}
      </Button>
    </div>
  );
}
