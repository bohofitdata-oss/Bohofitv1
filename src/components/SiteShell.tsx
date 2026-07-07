import { useEffect, type ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

export function SiteShell({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const targets = document.querySelectorAll<HTMLElement>(
      "main > section, main > div > section",
    );
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal", "in");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
    );
    targets.forEach((el) => {
      const rect = el.getBoundingClientRect();
      // Skip elements already in the initial viewport to avoid a hidden flash.
      if (rect.top < window.innerHeight * 0.9) {
        el.classList.add("reveal", "in");
        return;
      }
      el.classList.add("reveal");
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <SiteFooter />
    </div>
  );
}
