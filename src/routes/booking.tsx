import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { SiteShell } from "@/components/SiteShell";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Check, MessageCircle } from "lucide-react";
import { saveBooking, PROGRAM_LABEL } from "@/lib/bookings";
import { waLink, BOHOFIT_WHATSAPP, bookingConfirmationMessage } from "@/lib/whatsapp";
import { useBookingPrefill } from "@/hooks/useBookingPrefill";

export const Route = createFileRoute("/booking")({
  head: () => ({
    meta: [
      { title: "Join Rebél Group Classes" },
      { name: "description", content: "Book your spot in Rebél Group Classes — Level 1 (Start), Level 2 (Strength), Level 3 (Rebél One)." },
    ],
  }),
  component: BookingPage,
});

const schema = z.object({
  full_name: z.string().trim().min(1, "Name is required").max(120),
  phone: z.string().trim().min(6, "Phone is required").max(20),
  email: z.string().trim().email("Email is required").max(255),
  age: z.coerce.number({ invalid_type_error: "Age is required" }).int().min(10).max(100),
  city: z.string().trim().min(1, "City is required").max(80),
  goal: z.string().trim().min(3, "Tell us your goal").max(500),
});

function BookingPage() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState<null | { name: string }>(null);
  const [loading, setLoading] = useState(false);
  const prefill = useBookingPrefill();
  const formKey = `${prefill.full_name}|${prefill.phone}|${prefill.email}|${prefill.age}|${prefill.city}`;

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
    const result = await saveBooking({
      name: full_name, phone, email, age, city, goal,
      program: "group_classes",
      rules_accepted: true,
      is_trial: true,
    });
    setLoading(false);
    if (!result.ok) return toast.error(result.error);
    setSubmitted({ name: full_name });
  };

  if (submitted) {
    return (
      <SiteShell>
        <section className="container mx-auto max-w-xl px-5 py-24 text-center">
          <Reveal>
            <div className="mx-auto w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "#89010A" }}>
              <Check className="w-7 h-7 text-white" />
            </div>
            <h1 className="mt-6 text-3xl md:text-4xl font-black text-white">Thanks, {submitted.name.split(" ")[0]}!</h1>
            <p className="mt-3" style={{ color: "#CCCCCC" }}>{PROGRAM_LABEL.group_classes} · We'll call you within 24 hours.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild className="bg-[#25D366] text-white border-0 hover:opacity-90">
                <a
                  href={waLink(BOHOFIT_WHATSAPP, bookingConfirmationMessage({ name: submitted.name, program: PROGRAM_LABEL.group_classes }))}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="w-4 h-4 mr-2" /> Confirm on WhatsApp
                </a>
              </Button>
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
          <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "#89010A" }}>Rebél Group Classes</p>
          <h1 className="mt-2 text-3xl md:text-5xl font-black tracking-tight text-white">Join your first class.</h1>
          <p className="mt-3" style={{ color: "#CCCCCC" }}>
            Tell us about you — we'll share the schedule and the right plan. Payment happens after your first class.
          </p>
        </Reveal>

        <Reveal delay={200}>
          <form key={formKey} onSubmit={onSubmit} className="mt-8 rebel-card rounded-2xl p-6 md:p-8 space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="full_name" className="text-white">Your name</Label>
                <Input id="full_name" name="full_name" required maxLength={120} className="mt-1" defaultValue={prefill.full_name} />
              </div>
              <div>
                <Label htmlFor="phone" className="text-white">Phone</Label>
                <Input id="phone" name="phone" required maxLength={20} className="mt-1" defaultValue={prefill.phone} />
              </div>
              <div>
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input id="email" name="email" type="email" required maxLength={255} className="mt-1" defaultValue={prefill.email} />
              </div>
              <div>
                <Label htmlFor="age" className="text-white">Age</Label>
                <Input id="age" name="age" type="number" required min={10} max={100} className="mt-1" defaultValue={prefill.age} />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="city" className="text-white">City</Label>
                <Input id="city" name="city" required maxLength={80} className="mt-1" defaultValue={prefill.city} />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="goal" className="text-white">What do you want to achieve?</Label>
                <Textarea id="goal" name="goal" required maxLength={500} rows={3} className="mt-1" placeholder="e.g. Lose 6 kg, get stronger, feel better." />
              </div>
            </div>
            <Button
              type="submit"
              disabled={loading}
              size="lg"
              className="w-full text-white border-0 hover:opacity-90"
              style={{ background: "#89010A" }}
            >
              {loading ? "Sending…" : "Join now"}
            </Button>
            <p className="text-xs text-center" style={{ color: "#CCCCCC" }}>No spam. We call once, share the plan, you decide.</p>
          </form>
        </Reveal>
      </section>
    </SiteShell>
  );
}
