import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy — REBÉL" },
      { name: "description", content: "How REBÉL handles your personal and health data." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <SiteShell>
      <section className="container mx-auto max-w-2xl px-5 py-16 prose prose-invert">
        <h1 className="text-3xl md:text-4xl font-black">Privacy</h1>
        <p className="text-muted-foreground mt-4">
          REBÉL collects only what's needed to coach you. Symptom selections and outcome
          check-ins are stored <strong>only after you opt in</strong> and used to personalise
          your coaching. We don't infer diagnoses. You can ask us to delete your stored
          health data at any time — email <a className="underline" href="mailto:hello@rebel.fit">hello@rebel.fit</a>.
        </p>
        <p className="text-muted-foreground mt-4">
          Full policy coming soon. <Link to="/" className="underline">Back to home</Link>.
        </p>
      </section>
    </SiteShell>
  );
}
