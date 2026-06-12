import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/Reveal";

export function CafeTeaser() {
  return (
    <section className="container mx-auto px-5 py-12 md:py-16">
      <Reveal>
        <div className="max-w-2xl">
          <h2 className="rebel-hero-title text-3xl md:text-5xl font-black leading-[1.05]">
            Training right.
            <br />
            <span style={{ color: "#FF2233", fontStyle: "italic" }}>But are you eating right?</span>
          </h2>
          <p className="mt-4 text-base" style={{ color: "#CCCCCC" }}>
            Food that fuels your workouts.
          </p>
          <Link to="/cafe" className="rebel-btn-outline mt-6 inline-flex text-sm">
            Explore Rebél Café →
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
