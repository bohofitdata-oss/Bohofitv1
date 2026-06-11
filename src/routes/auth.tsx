import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteShell } from "@/components/SiteShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";
import { Mail } from "lucide-react";

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>) => ({ next: typeof s.next === "string" ? s.next : undefined }),
  head: () => ({
    meta: [
      { title: "Sign in — Rebel" },
      { name: "description", content: "Sign in to your Rebel account with Google, email or your mobile number." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { next } = Route.useSearch();
  const dest = next && next.startsWith("/") ? next : "/dashboard";
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);

  // email
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) navigate({ to: dest });
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: dest });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate, dest]);

  const onGoogle = async () => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/dashboard",
    });
    if (result.error) {
      setLoading(false);
      toast.error(result.error.message ?? "Could not sign in with Google");
    }
    // if redirected, browser navigates away
  };

  const onEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: { full_name: name },
        },
      });
      setLoading(false);
      if (error) return toast.error(error.message);
      toast.success("Account created. Check your email to confirm.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) return toast.error(error.message);
    }
  };

  return (
    <SiteShell>
      <section className="container mx-auto max-w-md px-5 py-16">
        <div className="rounded-2xl border border-border bg-card p-7 shadow-card">
          <h1 className="text-2xl font-black">{mode === "signup" ? "Create your account" : "Welcome back"}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === "signup" ? "Start your Rebel journey." : "Sign in to your dashboard."}
          </p>

          {/* Google */}
          <Button
            type="button"
            onClick={onGoogle}
            disabled={loading}
            variant="outline"
            className="w-full mt-6 h-11"
          >
            <GoogleIcon className="w-4 h-4 mr-2" /> Continue with Google
          </Button>

          <div className="my-5 flex items-center gap-3 text-[11px] uppercase tracking-widest text-muted-foreground">
            <span className="flex-1 h-px bg-border" /> or <span className="flex-1 h-px bg-border" />
          </div>

          <div className="mt-5 rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground inline-flex items-center gap-2">
            <Mail className="w-4 h-4 text-primary" /> Email sign-in is enabled.
          </div>

          <form onSubmit={onEmailSubmit} className="mt-5 space-y-4">
              {mode === "signup" && (
                <div>
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} maxLength={120} className="mt-1" />
                </div>
              )}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1" />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-gradient-gold text-primary-foreground border-0 hover:opacity-90">
                {loading ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
              </Button>

              <button
                type="button"
                onClick={() => setMode((m) => (m === "signin" ? "signup" : "signin"))}
                className="text-sm text-muted-foreground hover:text-foreground w-full text-center"
              >
                {mode === "signin" ? "New here? Create an account" : "Already have an account? Sign in"}
              </button>
            </form>
        </div>
      </section>
    </SiteShell>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.24 1.4-1.65 4.1-5.5 4.1-3.31 0-6-2.74-6-6.1s2.69-6.1 6-6.1c1.88 0 3.14.8 3.86 1.49l2.63-2.53C16.83 3.36 14.66 2.4 12 2.4 6.81 2.4 2.6 6.6 2.6 11.8s4.21 9.4 9.4 9.4c5.43 0 9.02-3.81 9.02-9.18 0-.62-.07-1.09-.16-1.56H12z"
      />
    </svg>
  );
}
