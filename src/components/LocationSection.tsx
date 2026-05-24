import { MapPin, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";

export function LocationSection() {
  return (
    <section className="container mx-auto px-5 py-20 md:py-32">
      <Reveal>
        <p className="rebel-label">Find us</p>
        <h2 className="rebel-hero-title text-3xl md:text-5xl font-black mt-3 leading-[1.05]">
          Train with us in person.
        </h2>
        <p className="mt-4 text-base" style={{ color: "#CCCCCC" }}>
          HSR Layout, Bangalore — our flagship studio.
        </p>
      </Reveal>

      <Reveal delay={120}>
        <div
          className="rebel-card rebel-card-featured mt-8 rounded-3xl p-6 md:p-8 max-w-xl"
        >
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 mt-1" style={{ color: "#FF2233" }} />
            <div className="flex-1">
              <p className="font-black text-white text-lg md:text-xl tracking-tight">
                REBEL FITNESS — HSR LAYOUT
              </p>
              <p className="mt-2 text-sm" style={{ color: "#CCCCCC" }}>
                Hours: Mon–Sat, 6:30 AM – 9:00 PM
              </p>
              <a
                href="https://maps.google.com/?q=Rebel+Fitness+HSR+Layout+Bangalore"
                target="_blank"
                rel="noopener noreferrer"
                className="rebel-btn-outline mt-5 inline-flex text-sm"
              >
                Get Directions <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
