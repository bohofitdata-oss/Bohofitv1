import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { METHOD_CHAPTERS } from "@/lib/methodChapters";

export const Route = createFileRoute("/method/$slug")({
  head: ({ params }) => {
    const chapter = METHOD_CHAPTERS.find((c) => c.slug === params.slug);
    const title = chapter ? `${chapter.title} — The Rebél Method` : "The Rebél Method";
    const desc = chapter?.subtitle ?? "The Rebél training method.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
    };
  },
  loader: ({ params }): { chapter: (typeof METHOD_CHAPTERS)[number] } => {
    const chapter = METHOD_CHAPTERS.find((c) => c.slug === params.slug);
    if (!chapter) throw notFound();
    return { chapter };
  },
  notFoundComponent: () => (
    <SiteShell>
      <div className="container mx-auto px-5 py-24 text-center text-white">
        <h1 className="text-3xl font-black">Chapter not found</h1>
        <Link to="/" className="mt-6 inline-block underline">Back home</Link>
      </div>
    </SiteShell>
  ),
  component: ChapterPage,
});

function ChapterPage() {
  const { chapter } = Route.useLoaderData();
  const idx = METHOD_CHAPTERS.findIndex((c) => c.slug === chapter.slug);
  const prev = idx > 0 ? METHOD_CHAPTERS[idx - 1] : null;
  const next = idx < METHOD_CHAPTERS.length - 1 ? METHOD_CHAPTERS[idx + 1] : null;

  return (
    <SiteShell>
      <article className="bg-black text-white">
        <div className="container mx-auto px-5 py-16 md:py-24 max-w-3xl">
          <Link
            to="/"
            hash="method"
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} /> The Rebél Method
          </Link>

          <p
            className="mt-8 text-[11px] font-semibold uppercase tracking-[0.22em]"
            style={{ color: "#89010A" }}
          >
            Chapter {chapter.number.toString().padStart(2, "0")}
          </p>
          <h1
            className="mt-3 font-black text-white"
            style={{ fontSize: "clamp(34px, 6vw, 60px)", letterSpacing: "-0.03em", lineHeight: "1" }}
          >
            {chapter.title}
          </h1>
          <p className="mt-4 text-lg md:text-xl" style={{ color: "#CCCCCC" }}>
            {chapter.subtitle}
          </p>

          <div className="mt-10 space-y-5 text-[15px] md:text-base leading-relaxed" style={{ color: "#CCCCCC" }}>
            <p className="italic text-white/50">
              Placeholder chapter — real content to follow.
            </p>
            <p>
              This chapter of the Rebél Method covers <strong className="text-white">{chapter.title.toLowerCase()}</strong>. It sits inside our training philosophy: coach-led, machine-free, and built for real bodies moving through real weeks.
            </p>
            <p>
              We will walk through the principles we use in the studio, the way our coaches apply them across formats, and how we adapt them for beginners, intermediates, and members training at 50+.
            </p>
            <p>
              Full text coming soon.
            </p>
          </div>

          <div className="mt-16 pt-8 border-t border-white/10 flex items-center justify-between gap-4">
            {prev ? (
              <Link
                to="/method/$slug"
                params={{ slug: prev.slug }}
                className="group flex-1 min-w-0"
              >
                <span className="text-[11px] uppercase tracking-[0.22em] text-white/50">Previous</span>
                <span className="mt-1 flex items-center gap-2 font-bold text-white group-hover:text-white/70 transition-colors">
                  <ArrowLeft size={16} className="shrink-0" />
                  <span className="truncate">{prev.title}</span>
                </span>
              </Link>
            ) : <span className="flex-1" />}
            {next ? (
              <Link
                to="/method/$slug"
                params={{ slug: next.slug }}
                className="group flex-1 min-w-0 text-right"
              >
                <span className="text-[11px] uppercase tracking-[0.22em] text-white/50">Next</span>
                <span className="mt-1 flex items-center justify-end gap-2 font-bold text-white group-hover:text-white/70 transition-colors">
                  <span className="truncate">{next.title}</span>
                  <ArrowRight size={16} className="shrink-0" />
                </span>
              </Link>
            ) : <span className="flex-1" />}
          </div>
        </div>
      </article>
    </SiteShell>
  );
}
