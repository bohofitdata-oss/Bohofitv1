import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteShell } from "@/components/SiteShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Activity, CalendarCheck, Salad, Settings, ShieldCheck, Camera, Upload } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Your dashboard — Bohofit" }] }),
  component: DashboardPage,
});

type Profile = { full_name: string | null; phone: string | null; age: number | null; city: string | null };
type ProgressLog = { id: string; log_date: string; weight_kg: number | null; attended: boolean | null; notes: string | null };
type FoodLog = { id: string; image_path: string; meal_type: string | null; logged_at: string; signedUrl?: string };

function DashboardPage() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [profile, setProfile] = useState<Profile>({ full_name: "", phone: "", age: null, city: "" });
  const [logs, setLogs] = useState<ProgressLog[]>([]);
  const [weight, setWeight] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([]);
  const [uploadingFood, setUploadingFood] = useState(false);
  const [mealType, setMealType] = useState("");

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) navigate({ to: "/auth" });
    });
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate({ to: "/auth" });
        return;
      }
      const uid = data.session.user.id;
      setUserId(uid);
      setEmail(data.session.user.email ?? "");

      const [{ data: p }, { data: l }, { data: r }, { data: f }] = await Promise.all([
        supabase.from("profiles").select("full_name, phone, age, city").eq("id", uid).maybeSingle(),
        supabase.from("progress_logs").select("id, log_date, weight_kg, attended, notes").eq("user_id", uid).order("log_date", { ascending: false }).limit(10),
        supabase.from("user_roles").select("role").eq("user_id", uid),
        supabase.from("food_logs").select("id, image_path, meal_type, logged_at").eq("user_id", uid).order("logged_at", { ascending: false }).limit(12),
      ]);
      if (p) setProfile({ full_name: p.full_name ?? "", phone: p.phone ?? "", age: p.age, city: p.city ?? "" });
      if (l) setLogs(l);
      if (r) setIsAdmin(r.some((x) => x.role === "admin"));
      if (f && f.length) {
        const signed = await Promise.all(
          f.map(async (row) => {
            const { data: s } = await supabase.storage.from("food-photos").createSignedUrl(row.image_path, 3600);
            return { ...row, signedUrl: s?.signedUrl } as FoodLog;
          }),
        );
        setFoodLogs(signed);
      }
    })();
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setSavingProfile(true);
    const { error } = await supabase.from("profiles").upsert({
      id: userId,
      full_name: profile.full_name || null,
      phone: profile.phone || null,
      age: profile.age,
      city: profile.city || null,
    });
    setSavingProfile(false);
    if (error) return toast.error(error.message);
    toast.success("Profile saved");
  };

  const logWeight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !weight) return;
    const w = parseFloat(weight);
    if (Number.isNaN(w)) return toast.error("Enter a valid weight");
    const { data, error } = await supabase
      .from("progress_logs")
      .insert({ user_id: userId, weight_kg: w, attended: true, log_date: new Date().toISOString().slice(0, 10) })
      .select()
      .single();
    if (error) return toast.error(error.message);
    setLogs((l) => [data as ProgressLog, ...l]);
    setWeight("");
    toast.success("Logged");
  };

  const uploadFoodPhoto = async (file: File) => {
    if (!userId) return;
    if (!file.type.startsWith("image/")) return toast.error("Please pick an image");
    if (file.size > 5 * 1024 * 1024) return toast.error("Image must be under 5 MB");
    setUploadingFood(true);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${userId}/${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("food-photos").upload(path, file, { upsert: false });
    if (upErr) {
      setUploadingFood(false);
      return toast.error(upErr.message);
    }
    const { data, error } = await supabase
      .from("food_logs")
      .insert({ user_id: userId, image_path: path, meal_type: mealType || null })
      .select("id, image_path, meal_type, logged_at")
      .single();
    if (error) {
      setUploadingFood(false);
      return toast.error(error.message);
    }
    const { data: signed } = await supabase.storage.from("food-photos").createSignedUrl(path, 3600);
    setFoodLogs((prev) => [{ ...(data as FoodLog), signedUrl: signed?.signedUrl }, ...prev]);
    setMealType("");
    setUploadingFood(false);
    toast.success("Food photo logged");
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  return (
    <SiteShell>
      <section className="container mx-auto px-5 py-12 max-w-5xl">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-primary">Your dashboard</p>
            <h1 className="text-3xl md:text-4xl font-black mt-1">Hi {profile.full_name || email.split("@")[0]}</h1>
          </div>
          <div className="flex gap-2">
            {isAdmin && (
              <Button asChild variant="outline" size="sm">
                <Link to="/admin"><ShieldCheck className="w-4 h-4 mr-1" /> Admin</Link>
              </Button>
            )}
            <Button onClick={signOut} variant="ghost" size="sm">Sign out</Button>
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-5">
          <div className="rounded-2xl border border-border bg-card p-5 text-center">
            <Activity className="w-5 h-5 mx-auto text-primary" />
            <div className="text-3xl font-black mt-2">{logs.length}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Logs (last 10)</div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 text-center">
            <CalendarCheck className="w-5 h-5 mx-auto text-primary" />
            <div className="text-3xl font-black mt-2">{logs.filter((l) => l.attended).length}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Sessions attended</div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 text-center">
            <Salad className="w-5 h-5 mx-auto text-primary" />
            <div className="text-3xl font-black mt-2">—</div>
            <div className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Diet plan</div>
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-5">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-2"><Settings className="w-4 h-4 text-primary" /><h3 className="font-bold">Your profile</h3></div>
            <form onSubmit={saveProfile} className="mt-4 space-y-3">
              <div>
                <Label htmlFor="full_name">Name</Label>
                <Input id="full_name" value={profile.full_name ?? ""} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} maxLength={120} className="mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value={profile.phone ?? ""} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} maxLength={20} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" type="number" value={profile.age ?? ""} onChange={(e) => setProfile({ ...profile, age: e.target.value ? parseInt(e.target.value) : null })} className="mt-1" />
                </div>
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" value={profile.city ?? ""} onChange={(e) => setProfile({ ...profile, city: e.target.value })} maxLength={80} className="mt-1" />
              </div>
              <Button type="submit" disabled={savingProfile} className="bg-gradient-gold text-primary-foreground border-0 hover:opacity-90">
                {savingProfile ? "Saving…" : "Save"}
              </Button>
            </form>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-bold">Log today</h3>
            <form onSubmit={logWeight} className="mt-4 flex gap-2">
              <Input placeholder="Weight (kg)" value={weight} onChange={(e) => setWeight(e.target.value)} type="number" step="0.1" className="flex-1" />
              <Button type="submit" className="bg-gradient-gold text-primary-foreground border-0 hover:opacity-90">Log</Button>
            </form>
            <div className="mt-5 space-y-2 max-h-72 overflow-auto">
              {logs.length === 0 ? (
                <p className="text-sm text-muted-foreground">No logs yet. Add your first weight entry above.</p>
              ) : (
                logs.map((l) => (
                  <div key={l.id} className="flex items-center justify-between text-sm border-b border-border/60 pb-2">
                    <span className="text-muted-foreground">{l.log_date}</span>
                    <span className="font-semibold">{l.weight_kg ?? "—"} kg</span>
                    <span className={l.attended ? "text-primary" : "text-muted-foreground"}>{l.attended ? "Attended" : "—"}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* DAILY FOOD LOG */}
        <div className="mt-8 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-primary" />
              <h3 className="font-bold">Daily food log</h3>
            </div>
            <p className="text-xs text-muted-foreground">Bootcamp members: upload a photo of every meal you eat.</p>
          </div>
          <div className="mt-4 grid sm:grid-cols-[1fr_auto] gap-2 items-end">
            <div>
              <Label htmlFor="meal_type" className="text-xs">Meal (optional)</Label>
              <Input id="meal_type" placeholder="Breakfast, lunch, snack…" value={mealType} onChange={(e) => setMealType(e.target.value)} maxLength={40} className="mt-1" />
            </div>
            <label className={`inline-flex items-center justify-center gap-2 rounded-md bg-gradient-gold text-primary-foreground px-4 h-10 font-semibold cursor-pointer ${uploadingFood ? "opacity-60" : "hover:opacity-90"}`}>
              <Upload className="w-4 h-4" />
              {uploadingFood ? "Uploading…" : "Upload photo"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploadingFood}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadFoodPhoto(f);
                  e.target.value = "";
                }}
              />
            </label>
          </div>
          {foodLogs.length === 0 ? (
            <p className="mt-5 text-sm text-muted-foreground">No food photos yet. Upload your first meal above.</p>
          ) : (
            <div className="mt-5 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {foodLogs.map((f) => (
                <div key={f.id} className="aspect-square rounded-lg overflow-hidden bg-muted relative">
                  {f.signedUrl && <img src={f.signedUrl} alt={f.meal_type ?? "Meal"} className="w-full h-full object-cover" loading="lazy" />}
                  {f.meal_type && <span className="absolute bottom-1 left-1 right-1 text-[10px] bg-background/80 rounded px-1 py-0.5 truncate">{f.meal_type}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
