import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { METHOD_CHAPTERS } from "@/lib/methodChapters";

const GREY = "var(--muted-foreground)";

export function RebelMethod() {
  return (
    <section className="bg-background border-t border-foreground/5">
      <div className="container mx-auto px-5 md:px-8 editorial-section">
        <Reveal>
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground/60">
              Read the method
            </p>
            <h2
              className="mt-3 font-medium text-foreground"
              style={{ fontSize: "var(--editorial-heading-size)", letterSpacing: "0", lineHeight: "1" }}
            >
              The Rebél{" "}
              <span style={{ color: "var(--storefront)", fontStyle: "italic" }}>Method.</span>
            </h2>
            <p className="mt-4 text-[15px] md:text-lg" style={{ color: GREY }}>
              Strength that lasts. Ten chapters, one method.
            </p>
          </div>
        </Reveal>

        <ol className="mt-10 max-w-3xl space-y-3">
          {METHOD_CHAPTERS.map((c, i) => (
            <Reveal key={c.slug} delay={i * 50}>
              <li>
                <Link
                  to="/method/$slug"
                  params={{ slug: c.slug }}
                  className="group flex items-center gap-4 md:gap-5 border-b border-border px-0 py-6 transition-all duration-300 hover:-translate-y-0.5"
                  
                >
                  <span
                    className="shrink-0 w-8 h-8 font-mono flex items-center justify-center font-medium text-foreground text-sm md:text-base transition-colors duration-300 group-hover:bg-primary/15"
                    
                  >
                    {c.number.toString().padStart(2, "0")}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block font-bold text-foreground text-[15px] md:text-base leading-tight">
                      {c.title}
                    </span>
                    <span className="block text-[13px] md:text-sm mt-1" style={{ color: GREY }}>
                      {c.subtitle}
                    </span>
                  </span>
                  <ChevronRight
                    size={20}
                    color="var(--foreground)"
                    className="shrink-0 opacity-60 transition-transform duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                  />
                </Link>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
