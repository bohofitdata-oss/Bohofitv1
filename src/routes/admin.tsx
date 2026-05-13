import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteShell } from "@/components/SiteShell";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { waLink, bookingConfirmationMessage } from "@/lib/whatsapp";
import { MessageCircle } from "lucide-react";

// Hardcoded admin emails — edit this list to grant dashboard access.
const ADMIN_EMAILS = ["admin@bohofit.com"];

type Lead = {
  id: string;
  path: string;
  full_name: string;
  phone: string;
  email: string | null;
  city: string | null;
  goal: string | null;
  status: string;
  created_at: string;
};

type Booking = {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  email: string | null;
  age: number | null;
  city: string | null;
  goal: string | null;
  program: string;
  plan: string | null;
  mode: string | null;
  primary_slot: string | null;
  secondary_slot: string | null;
  payment_status: string;
  status: string;
  is_trial: boolean;
  reschedule_count: number;
};

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Bohofit" }] }),
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [counts, setCounts] = useState({ leads: 0, users: 0, subs: 0, bookings: 0 });

  useEffect(() => {
    (async () => {
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        navigate({ to: "/auth" });
        return;
      }
      const userEmail = sess.session.user.email ?? "";
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", sess.session.user.id);
      const ok =
        ADMIN_EMAILS.includes(userEmail) ||
        (roles?.some((r) => r.role === "admin" || r.role === "coach") ?? false);
      setAllowed(ok);
      if (!ok) return;

      const [{ data: l }, { data: b }, { count: lc }, { count: pc }, { count: sc }, { count: bc }] = await Promise.all([
        supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(50),
        supabase.from("bookings").select("*").order("created_at", { ascending: false }).limit(100),
        supabase.from("leads").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("subscriptions").select("*", { count: "exact", head: true }),
        supabase.from("bookings").select("*", { count: "exact", head: true }),
      ]);
      if (l) setLeads(l as Lead[]);
      if (b) setBookings(b as Booking[]);
      setCounts({ leads: lc ?? 0, users: pc ?? 0, subs: sc ?? 0, bookings: bc ?? 0 });
    })();
  }, [navigate]);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("leads").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    setLeads((arr) => arr.map((l) => (l.id === id ? { ...l, status } : l)));
    toast.success("Updated");
  };

  const updateBookingStatus = async (id: string, patch: Partial<Pick<Booking, "status" | "payment_status">>) => {
    const { error } = await supabase.from("bookings").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    setBookings((arr) => arr.map((b) => (b.id === id ? { ...b, ...patch } : b)));
    toast.success("Updated");
  };

  if (allowed === null) {
    return <SiteShell><div className="container mx-auto px-5 py-20">Loading…</div></SiteShell>;
  }
  if (!allowed) {
    return (
      <SiteShell>
        <div className="container mx-auto max-w-lg px-5 py-20 text-center">
          <h1 className="text-2xl font-black">Admin access only</h1>
          <p className="text-muted-foreground mt-2">Your account doesn&rsquo;t have admin or coach permissions yet.</p>
          <Button asChild className="mt-6 bg-gradient-gold text-primary-foreground border-0 hover:opacity-90">
            <Link to="/dashboard">Back to dashboard</Link>
          </Button>
          <p className="text-xs text-muted-foreground mt-6">
            To grant admin: open the backend, find your user in <code>user_roles</code>, and add a row with role <code>admin</code>.
          </p>
        </div>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <section className="container mx-auto px-5 py-12 max-w-6xl">
        <h1 className="text-3xl md:text-4xl font-black">Admin</h1>
        <p className="text-muted-foreground mt-1">Bookings, leads, members.</p>

        <div className="mt-8 grid md:grid-cols-4 gap-5">
          {[
            { l: "Bookings", v: counts.bookings },
            { l: "Leads", v: counts.leads },
            { l: "Members", v: counts.users },
            { l: "Subscriptions", v: counts.subs },
          ].map((s) => (
            <div key={s.l} className="rounded-2xl border border-border bg-card p-5">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">{s.l}</div>
              <div className="text-4xl font-black mt-1 text-gradient-gold">{s.v}</div>
            </div>
          ))}
        </div>

        {/* BOOKINGS */}
        <div className="mt-10 rounded-2xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h2 className="font-bold">Recent bookings</h2>
            <span className="text-xs text-muted-foreground">{bookings.length} shown</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-widest text-muted-foreground bg-secondary/30">
                <tr>
                  <th className="px-4 py-3">When</th>
                  <th className="px-4 py-3">Program</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Slot</th>
                  <th className="px-4 py-3">Mode</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">WA</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-t border-border/60 align-top">
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{new Date(b.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3"><span className="text-xs uppercase tracking-widest text-primary">{b.program}</span>{b.plan ? <span className="text-[10px] text-muted-foreground ml-1">· {b.plan}</span> : null}{b.is_trial ? <span className="ml-1 text-[10px] uppercase text-amber-500">trial</span> : null}</td>
                    <td className="px-4 py-3 font-semibold">{b.name}<div className="text-[11px] text-muted-foreground">{b.email ?? "—"}</div></td>
                    <td className="px-4 py-3 whitespace-nowrap">{b.phone}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{b.primary_slot ?? "—"}{b.secondary_slot ? <div className="text-[11px] text-muted-foreground">2nd: {b.secondary_slot}</div> : null}</td>
                    <td className="px-4 py-3">{b.mode ?? "—"}</td>
                    <td className="px-4 py-3">
                      <select value={b.payment_status} onChange={(e) => updateBookingStatus(b.id, { payment_status: e.target.value })} className="bg-background border border-border rounded-md px-2 py-1 text-xs">
                        <option value="pending">pending</option>
                        <option value="paid">paid</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <select value={b.status} onChange={(e) => updateBookingStatus(b.id, { status: e.target.value })} className="bg-background border border-border rounded-md px-2 py-1 text-xs">
                        <option value="new">new</option>
                        <option value="confirmed">confirmed</option>
                        <option value="cancelled">cancelled</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <a href={waLink(b.phone, bookingConfirmationMessage({ name: b.name, program: b.program, mode: b.mode, plan: b.plan, slot: b.primary_slot }))} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-[#25D366] hover:opacity-80" title="Send WhatsApp confirmation">
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    </td>
                  </tr>
                ))}
                {bookings.length === 0 && (
                  <tr><td className="px-4 py-8 text-center text-muted-foreground" colSpan={9}>No bookings yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h2 className="font-bold">Recent leads</h2>
            <span className="text-xs text-muted-foreground">{leads.length} shown</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-widest text-muted-foreground bg-secondary/30">
                <tr>
                  <th className="px-4 py-3">When</th>
                  <th className="px-4 py-3">Path</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">City</th>
                  <th className="px-4 py-3">Goal</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l.id} className="border-t border-border/60 align-top">
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{new Date(l.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3"><span className="text-xs uppercase tracking-widest text-primary">{l.path}</span></td>
                    <td className="px-4 py-3 font-semibold">{l.full_name}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{l.phone}</td>
                    <td className="px-4 py-3">{l.city ?? "—"}</td>
                    <td className="px-4 py-3 max-w-xs truncate text-muted-foreground" title={l.goal ?? ""}>{l.goal ?? "—"}</td>
                    <td className="px-4 py-3">
                      <select
                        value={l.status}
                        onChange={(e) => updateStatus(l.id, e.target.value)}
                        className="bg-background border border-border rounded-md px-2 py-1 text-xs"
                      >
                        <option value="new">new</option>
                        <option value="contacted">contacted</option>
                        <option value="booked">booked</option>
                        <option value="closed">closed</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {leads.length === 0 && (
                  <tr><td className="px-4 py-8 text-center text-muted-foreground" colSpan={7}>No leads yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
