import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { SiteShell } from "@/components/SiteShell";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client.bohofit";
import { toast } from "sonner";
import { Check, MessageCircle } from "lucide-react";
import { saveBooking, PROGRAM_LABEL } from "@/lib/bookings";
import { waLink, BOHOFIT_WHATSAPP, bookingConfirmationMessage } from "@/lib/whatsapp";

type PathChoice = "bohofit" | "bootcamp" | "longevity";
const PATHS: PathChoice[] = ["bohofit", "bootcamp", "longevity"];

export const Route = createFileRoute("/booking")({
  validateSearch: (s: Record<string, unknown>): { path?: PathChoice } => ({
    path: PATHS.includes(s.path as PathChoice) ? (s.path as PathChoice) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Book a call — Bohofit" },
      { name: "description", content: "Tell us your goal. We'll send a plan, pricing, and the next batch dates." },
    ],
  }),
  component: BookingPage,
});

const labels: Record<PathChoice, { tag: string; title: string; sub: string }> = {
  bohofit: { tag: "Bohofit Classes", title: "Start your group fitness journey", sub: "We'll share class schedules and the right plan for you." },
  bootcamp: { tag: "8-Week Bootcamp", title: "Join the next bootcamp batch", sub: "Tell us about your goals — we'll confirm your spot." },
  longevity: { tag: "Longevity 1:1", title: "Book a free 30-minute consult", sub: "We listen, assess, then recommend. No sales pressure." },
};

const schema = z.object({
  full_name: z.string().trim().min(1, "Name is required").max(120),
  phone: z.string().trim().min(6, "Phone is required").max(20),
  email: z.string().trim().email("Email is required").max(255),
  age: z.coerce.number({ invalid_type_error: "Age is required" }).int().min(10).max(100),
  city: z.string().trim().min(1, "City is required").max(80),
  goal: z.string().trim().min(3, "Tell us your goal").max(500),
});

function BookingPage() {
  const search = Route.useSearch() as { path?: PathChoice };
  const path: PathChoice = search.path ?? "bohofit";
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState<null | { name: string }>(null);
  const [loading, setLoading] = useState(false);
  const meta = labels[path];

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse(Object.fromEntries(fd));
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    setLoading(true);
    const { full_name, phone, email, age, city, goal } = parsed.data;

    if (path === "bohofit") {
      const result = await saveBooking({
        name: full_name,
        phone,
        email,
        age,
        city,
        goal,
        program: "group_classes",
        rules_accepted: true,
        is_trial: true,
      });
      setLoading(false);
      if (!result.ok) return toast.error(result.error);
      setSubmitted({ name: full_name });
      return;
    }

    const { error } = await supabase.from("leads").insert({
      path,
      full_name,
      phone,
      email,
      age,
      city,
      goal,
    });
    setLoading(false);
    if (error) {
      toast.error("Something went wrong. Please try again.");
      return;
    }
    setSubmitted({ name: full_name });
  };

  if (submitted) {
    return (
      <SiteShell>
        <section className="container mx-auto max-w-xl px-5 py-24 text-center">
          <Reveal>
            <div className="mx-auto w-14 h-14 rounded-full bg-gradient-gold flex items-center justify-center">
              <Check className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="mt-6 text-3xl md:text-4xl font-black">Thanks, {submitted.name.split(" ")[0]}!</h1>
            <p className="mt-3 text-muted-foreground">{path === "bohofit" ? PROGRAM_LABEL.group_classes : meta.tag} · We&rsquo;ll call you within 24 hours.</p>
            <p className="mt-2 text-sm text-muted-foreground">Want to skip the wait? Create your account so your coach can build your plan inside the app.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild className="bg-[#25D366] text-white border-0 hover:opacity-90">
                <a href={waLink(BOHOFIT_WHATSAPP, bookingConfirmationMessage({ name: submitted.name, program: path === "bohofit" ? PROGRAM_LABEL.group_classes : meta.tag }))} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-4 h-4 mr-2" /> Send confirmation on WhatsApp
                </a>
              </Button>
              <Button onClick={() => navigate({ to: "/auth" })} className="bg-gradient-gold text-primary-foreground border-0 hover:opacity-90">Create account</Button>
              <Button onClick={() => navigate({ to: "/" })} variant="outline">Back to home</Button>
            </div>
          </Reveal>
        </section>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <section className="container mx-auto max-w-2xl px-5 pt-16 pb-20">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.18em] text-primary">{meta.tag}</p>
          <h1 className="mt-2 text-3xl md:text-5xl font-black tracking-tight">{meta.title}</h1>
          <p className="mt-3 text-muted-foreground">{meta.sub}</p>
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-6 flex gap-2 flex-wrap">
            {PATHS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => navigate({ to: "/booking", search: { path: p } })}
                className={`text-xs uppercase tracking-widest px-3 py-2 rounded-full border transition-colors ${
                  p === path ? "bg-gradient-gold text-primary-foreground border-transparent" : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {labels[p].tag}
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal delay={200}>
          <form onSubmit={onSubmit} className="mt-8 rounded-2xl border border-border bg-card p-6 md:p-8 space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="full_name">Your name</Label>
                <Input id="full_name" name="full_name" required maxLength={120} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" required maxLength={20} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required maxLength={255} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                <Input id="age" name="age" type="number" required min={10} max={100} className="mt-1" />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" required maxLength={80} className="mt-1" />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="goal">What do you want to achieve?</Label>
                <Textarea id="goal" name="goal" required maxLength={500} rows={3} className="mt-1" placeholder="e.g. Lose 6 kg, fix lower back pain, etc." />
              </div>
            </div>
            <Button type="submit" disabled={loading} size="lg" className="w-full bg-gradient-gold text-primary-foreground border-0 hover:opacity-90">
              {loading ? "Sending…" : "Send my details"}
            </Button>
            <p className="text-xs text-muted-foreground text-center">No spam. We call once, share the plan, you decide.</p>
          </form>
        </Reveal>
      </section>
    </SiteShell>
  );
}
