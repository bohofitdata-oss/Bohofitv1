import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Plus } from "lucide-react";
import { toast } from "sonner";

type Invite = { id: string; invitee_name: string; relation: string; invitee_phone: string | null; status: string };

export function FamilyInvitesCard({ userId }: { userId: string }) {
  const [list, setList] = useState<Invite[]>([]);
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("family_invites").select("id, invitee_name, relation, invitee_phone, status").eq("inviter_user_id", userId).order("created_at", { ascending: false });
    if (data) setList(data);
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [userId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !relation) return toast.error("Name and relation required");
    setBusy(true);
    const { error } = await supabase.from("family_invites").insert({
      inviter_user_id: userId, invitee_name: name, relation, invitee_phone: phone || null,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    setName(""); setRelation(""); setPhone("");
    toast.success("Family member invited");
    load();
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center gap-2 text-primary"><Users className="w-4 h-4" /><span className="text-xs uppercase tracking-[0.18em]">Family</span></div>
      <h3 className="font-bold mt-1">Bring your people in</h3>
      <p className="text-xs text-muted-foreground mt-1">Invite a parent, partner or sibling. We'll guide them to the right Rebél path.</p>

      <form onSubmit={submit} className="mt-4 grid grid-cols-2 gap-2">
        <div className="col-span-1"><Label className="text-xs">Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1" maxLength={80} /></div>
        <div className="col-span-1"><Label className="text-xs">Relation</Label><Input value={relation} onChange={(e) => setRelation(e.target.value)} placeholder="Parent, partner…" className="mt-1" maxLength={40} /></div>
        <div className="col-span-2"><Label className="text-xs">Phone (optional)</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1" maxLength={20} /></div>
        <Button type="submit" disabled={busy} className="col-span-2 bg-gradient-gold text-primary-foreground border-0 hover:opacity-90"><Plus className="w-4 h-4 mr-1" />{busy ? "Inviting…" : "Add family member"}</Button>
      </form>

      {list.length > 0 && (
        <ul className="mt-4 space-y-1.5">
          {list.map((i) => (
            <li key={i.id} className="flex items-center justify-between text-sm border-b border-border/60 pb-1.5">
              <span className="font-medium">{i.invitee_name} <span className="text-muted-foreground">· {i.relation}</span></span>
              <span className="text-xs uppercase tracking-widest text-muted-foreground">{i.status}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
