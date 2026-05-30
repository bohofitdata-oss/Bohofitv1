import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

type TabId = "group-classes" | "eight-weeks" | "fifty-plus";

const TABS: { id: TabId; label: string; cta: string; to: "/bohofit" | "/bootcamp" | "/longevity" }[] = [
  { id: "group-classes", label: "Group", cta: "View classes", to: "/bohofit" },
  { id: "eight-weeks", label: "8 Weeks", cta: "Claim a slot", to: "/bootcamp" },
  { id: "fifty-plus", label: "50+", cta: "Learn more", to: "/longevity" },
];

export function StickyProgramTabs() {
  const [active, setActive] = useState<TabId>("group-classes");
  const [visible, setVisible] = useState(false);

  // Show only once the user has scrolled past the hero (roughly one viewport).
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Track which program section is on screen.
  useEffect(() => {
    const els = TABS.map((t) => document.getElementById(t.id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((e) => e.isIntersecting);
        if (!visibleEntries.length) return;
        const top = visibleEntries.sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        setActive(top.target.id as TabId);
      },
      { rootMargin: "-30% 0px -40% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const scrollTo = (id: TabId) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const activeTab = TABS.find((t) => t.id === active)!;

  return (
    <div
      className={`md:hidden fixed inset-x-3 z-[999] transition-all duration-300 ${
        visible ? "bottom-3 opacity-100 translate-y-0" : "translate-y-6 opacity-0 pointer-events-none"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div
        className="rounded-2xl border border-white/12 overflow-hidden"
        style={{
          background: "rgba(12,12,14,0.78)",
          backdropFilter: "blur(20px) saturate(160%)",
          WebkitBackdropFilter: "blur(20px) saturate(160%)",
          boxShadow: "0 20px 50px -12px rgba(0,0,0,0.7), 0 1px 0 rgba(255,255,255,0.06) inset",
        }}
      >
        {/* Tab row */}
        <div className="grid grid-cols-3 p-1 gap-1">
          {TABS.map((t) => {
            const isActive = t.id === active;
            return (
              <button
                key={t.id}
                onClick={() => scrollTo(t.id)}
                className={`relative h-10 rounded-xl text-[12px] font-semibold tracking-wide transition-all ${
                  isActive ? "text-white" : "text-white/55 hover:text-white/80"
                }`}
                style={
                  isActive
                    ? {
                        background: "linear-gradient(180deg, #FF2233 0%, #89010A 100%)",
                        boxShadow: "0 6px 16px -6px rgba(255,34,51,0.55)",
                      }
                    : undefined
                }
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Per-tab CTA */}
        <div className="border-t border-white/10 px-2 py-2">
          <Link
            to={activeTab.to}
            className="flex items-center justify-between rounded-xl bg-white text-black h-11 px-4 font-bold text-[13px] active:scale-[0.98] transition-transform"
          >
            <span>{activeTab.cta}</span>
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
