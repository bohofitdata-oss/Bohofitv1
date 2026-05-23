import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export function StickyMobileCTA() {
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 px-3 pb-3 pt-2 bg-gradient-to-t from-background via-background/95 to-transparent">
      <Link
        to="/booking"
        className="rebel-btn flex items-center justify-center gap-2 w-full rounded-full text-sm font-black uppercase tracking-wider py-3.5 text-primary-foreground"
      >
        Book your spot <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
