import VibeCard from "../components/vibecard";

const projects = [
  {
    title: "DMV PODS – Dealer Temp Tags",
    emoji: "🚗",
    message:
      "Project manager for the DMV Print-On-Demand temporary tags solution. Coordinated developers, DMV business owners, and support teams to improve dealer workflows and reduce manual processing.",
  },
  {
    title: "VDACS – Agriculture & Consumer Services Sites",
    emoji: "🌾",
    message:
      "Led web projects for VDACS programs like VA Grown / VA Finest and licensing/registration portals. Managed requirements, vendor coordination, accessibility needs, and rollout planning.",
  },
  {
    title: "Cardinal – Drupal Enhancements & Accessibility",
    emoji: "📊",
    message:
      "Managed Drupal-based enhancements and accessibility remediation for the statewide Cardinal financial system, balancing VITA standards, timelines, and agency expectations.",
  },
  {
    title: "Local Government Portals & Payments",
    emoji: "🏛️",
    message:
      "Oversaw website + payment integrations for localities (tax portals, forms, and citizen services), including coordination with finance teams, treasurers, and technology staff.",
  },
  {
    title: "Accessibility Compliance Program",
    emoji: "✅",
    message:
      "Designed a structured accessibility monitoring/remediation process: dashboards, partner communications, and prioritization for WCAG/VITA compliance across multiple agency sites.",
  },
  {
    title: "Controller & Accounting Background",
    emoji: "💼",
    message:
      "Former controller with hands-on experience in GL, AP/AR, payroll, budgeting, and audits. Brings financial discipline into technical and government digital projects.",
  },
];

export default function ProjectsPage() {
  return (
    <main className="flex-1 flex flex-col items-center px-4 py-12">
      <section className="max-w-3xl w-full text-center mb-10">
        <h1 className="text-4xl font-bold mb-3">Projects & Experience 🚀</h1>
        <p className="text-gray-600">
          A snapshot of the real work behind Mike&apos;s Vibe Coder HQ – blending
          public-sector digital projects, accessibility, and financial chops.
        </p>
      </section>

      <section className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((p) => (
          <VibeCard
            key={p.title}
            title={p.title}
            emoji={p.emoji}
            message={p.message}
          />
        ))}
      </section>
    </main>
  );
}