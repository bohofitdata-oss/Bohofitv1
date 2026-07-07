import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import rebelLogo from "@/assets/rebel-logo.png";

const NAV_LINKS = [
  { label: "Group Classes", href: "#group-classes" },
  { label: "Unpause", href: "#unpause" },
  { label: "50+", href: "#fifty-plus" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleAnchor = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("#")) return;
    const el = document.querySelector(href);
    if (el) {
      e.preventDefault();
      setMenuOpen(false);
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", href);
    }
  };

  return (
    <>
      <header
        className="sticky top-0 z-40 transition-all duration-300"
        style={
          scrolled
            ? {
                background: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }
            : {
                background: "transparent",
                borderBottom: "1px solid transparent",
              }
        }
      >
        <div className="container mx-auto flex items-center justify-between h-16 px-5">
          <Link to="/" className="flex items-center shrink-0" aria-label="Rebél home">
            <img src={rebelLogo} alt="Rebél" className="h-7 md:h-8 w-auto" />
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => handleAnchor(e, l.href)}
                className="nav-underline text-white/90 hover:text-[#FF2233] transition-colors"
                style={{ fontSize: "15px", fontWeight: 500, letterSpacing: "0.02em" }}
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/booking"
              className="hidden sm:inline-flex items-center justify-center rounded-full text-white text-sm font-semibold px-5 h-9 transition-all hover:opacity-90"
              style={{ background: "#89010A", letterSpacing: "0.01em" }}
            >
              Speak with us
            </Link>
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center h-10 w-10 text-white"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        <style>{`
          .nav-underline { position: relative; }
          .nav-underline::after {
            content: "";
            position: absolute;
            left: 0; bottom: -6px;
            height: 1px; width: 0;
            background: #FF2233;
            transition: width 250ms ease;
          }
          .nav-underline:hover::after { width: 100%; }
        `}</style>
      </header>

      {menuOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden flex flex-col"
          style={{ background: "rgba(0,0,0,0.95)" }}
        >
          <div className="flex items-center justify-between h-16 px-5">
            <Link to="/" onClick={() => setMenuOpen(false)} aria-label="Rebél home">
              <img src={rebelLogo} alt="Rebél" className="h-7 w-auto" />
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="inline-flex items-center justify-center h-10 w-10 text-white"
              aria-label="Close menu"
            >
              <X className="h-7 w-7" />
            </button>
          </div>
          <nav className="flex-1 flex flex-col items-center justify-center gap-10">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => handleAnchor(e, l.href)}
                className="text-white font-black tracking-tight"
                style={{ fontSize: "clamp(32px, 8vw, 48px)", letterSpacing: "-0.02em" }}
              >
                {l.label}
              </a>
            ))}
            <Link
              to="/booking"
              onClick={() => setMenuOpen(false)}
              className="mt-6 inline-flex items-center justify-center rounded-full text-white text-base font-semibold px-8 h-12"
              style={{ background: "#89010A" }}
            >
              Speak with us
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
