import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setAuthed(!!session));
    supabase.auth.getSession().then(({ data }) => setAuthed(!!data.session));
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/70 border-b border-border/60">
      <div className="container mx-auto flex items-center justify-between h-16 px-5">
        <Link to="/" className="flex items-center gap-2">
          <span className="inline-block w-7 h-7 rounded-md bg-gradient-gold shadow-elegant" />
          <span className="font-black tracking-tight text-lg">Bohofit</span>
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
          <Link to="/bohofit" className="hover:text-foreground transition-colors" activeProps={{ className: "text-foreground" }}>Bohofit</Link>
          <Link to="/bootcamp" className="hover:text-foreground transition-colors" activeProps={{ className: "text-foreground" }}>Bootcamp</Link>
          <Link to="/longevity" className="hover:text-foreground transition-colors" activeProps={{ className: "text-foreground" }}>Longevity</Link>
          <Link to="/diet" className="hover:text-foreground transition-colors" activeProps={{ className: "text-foreground" }}>Diet</Link>
        </nav>
        <div className="flex items-center gap-2">
          {authed ? (
            <Button asChild variant="secondary" size="sm"><Link to="/dashboard">Dashboard</Link></Button>
          ) : (
            <Button asChild variant="ghost" size="sm"><Link to="/auth">Sign in</Link></Button>
          )}
          <Button asChild size="sm" className="bg-gradient-gold text-primary-foreground hover:opacity-90 border-0">
            <Link to="/booking">Book a call</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
