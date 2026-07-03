import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { METHOD_CHAPTERS } from "@/lib/methodChapters";

const CRIMSON = "#89010A";
const GREY = "#CCCCCC";

export function RebelMethod() {
  return (
    <section className="bg-black border-t border-white/5">
      <div className="container mx-auto px-5 py-20 md:py-28">
        <Reveal>
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">
              Read the method
            </p>
            <h2
              className="mt-3 font-black text-white"
              style={{ fontSize: "clamp(32px, 6vw, 60px)", letterSpacing: "-0.03em", lineHeight: "1" }}
            >
              The Rebél{" "}
              <span style={{ color: "#FF2233", fontStyle: "italic" }}>Method.</span>
            </h2>
            <p className="mt-4 text-[15px] md:text-lg" style={{ color: GREY }}>
              Everything we have learned about building strength that lasts — in one place. Tap any chapter to read.
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
                  className="group flex items-center gap-4 md:gap-5 rounded-xl px-5 py-5 md:px-6 md:py-6 transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <span
                    className="shrink-0 w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center font-black text-white text-sm md:text-base transition-colors duration-300 group-hover:bg-[rgba(137,1,10,0.15)]"
                    style={{
                      border: `2px solid ${CRIMSON}`,
                      background: "transparent",
                    }}
                  >
                    {c.number.toString().padStart(2, "0")}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block font-bold text-white text-[15px] md:text-base leading-tight">
                      {c.title}
                    </span>
                    <span className="block text-[13px] md:text-sm mt-1" style={{ color: GREY }}>
                      {c.subtitle}
                    </span>
                  </span>
                  <ChevronRight
                    size={20}
                    color="#ffffff"
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
