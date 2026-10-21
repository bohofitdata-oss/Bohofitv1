import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TM } from "@/components/TM";
import rebelLogo from "@/assets/rebel-logo.png";

const NAV_LINKS = [{ label: "Group Classes", href: "#group-classes" }, { label: "UnPause", href: "#unpause" }, { label: "50+", href: "#fifty-plus" }];
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    const close = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    document.addEventListener("keydown", close);
    return () => { document.body.style.overflow = ""; document.removeEventListener("keydown", close); };
  }, [menuOpen]);
  const handleAnchor = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const el = document.querySelector(href);
    setMenuOpen(false);
    if (el) { e.preventDefault(); el.scrollIntoView({ behavior: "smooth", block: "start" }); history.replaceState(null, "", href); }
  };
  const logo = <span className="flex items-start text-foreground"><img src={rebelLogo} alt="REBÉL" className="h-7 md:h-8 w-auto" /><TM /></span>;
  return <>
    <header className={`brand-nav sticky top-0 z-40 transition-all duration-300 ${scrolled ? "is-scrolled" : ""}`}>
      <div className="container mx-auto flex items-center justify-between h-20 px-5 md:px-8">
        <Link to="/" aria-label="REBÉL home">{logo}</Link>
        <nav aria-label="Main navigation" className="hidden md:flex gap-10">
          {NAV_LINKS.map(l => <a key={l.href} href={`/${l.href}`} onClick={e => handleAnchor(e, l.href)} className="nav-underline text-foreground/90 hover:text-storefront text-[15px] font-medium transition-colors">{l.label}</a>)}
        </nav>
        <div className="flex gap-3 items-center">
          <Button asChild className="hidden sm:inline-flex rounded-full px-5 h-9 text-xs"><Link to="/booking">Speak with us</Link></Button>
          <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}><Menu /></Button>
        </div>
      </div>
    </header>
    {menuOpen && <div role="dialog" aria-modal="true" aria-label="Navigation menu" className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl md:hidden flex flex-col">
      <div className="flex items-center justify-between h-20 px-5"><Link to="/" onClick={() => setMenuOpen(false)} aria-label="REBÉL home">{logo}</Link><Button variant="ghost" size="icon" autoFocus onClick={() => setMenuOpen(false)} aria-label="Close menu"><X /></Button></div>
      <nav className="flex-1 flex flex-col items-center justify-center gap-10">
        {NAV_LINKS.map(l => <a key={l.href} href={`/${l.href}`} onClick={e => handleAnchor(e, l.href)} className="font-display text-2xl text-foreground">{l.label}</a>)}
        <Button asChild className="rounded-full mt-6 px-8"><Link to="/booking" onClick={() => setMenuOpen(false)}>Speak with us</Link></Button>
      </nav>
    </div>}
  </>;
}
