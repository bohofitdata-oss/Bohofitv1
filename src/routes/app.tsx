import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "Member home — REBÉL" },
      { name: "description", content: "Your Rebél member home and training journey." },
      { property: "og:title", content: "Member home — REBÉL" },
      { property: "og:description", content: "Your Rebél member home and training journey." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <Outlet />,
});
