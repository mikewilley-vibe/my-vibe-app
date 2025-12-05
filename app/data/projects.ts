export type Project = {
  slug: string;
  title: string;
  emoji: string;
  message: string;
  longDescription: string;
};

export const projects: Project[] = [
  {
    slug: "dmv-pods-temp-tags",
    title: "DMV PODS – Dealer Temp Tags",
    emoji: "🚗",
    message:
      "Project manager for the DMV Print-On-Demand temporary tags solution.",
    longDescription:
      "Served as project manager for the DMV Print-On-Demand temporary tags (PODS) solution. Coordinated developers, DMV business owners, and support teams to improve dealer workflows, reduce manual processing, and ensure compliance with state regulations.",
  },
  {
    slug: "vdacs-agriculture-consumer",
    title: "VDACS – Agriculture & Consumer Services Sites",
    emoji: "🌾",
    message:
      "Led web projects for VDACS programs like VA Grown / VA Finest.",
    longDescription:
      "Led multiple VDACS web initiatives, including VA Grown / VA Finest and licensing/registration portals. Managed requirements, content structure, accessibility needs, and rollout planning while coordinating with internal stakeholders and external partners.",
  },
  {
    slug: "cardinal-drupal-accessibility",
    title: "Cardinal – Drupal Enhancements & Accessibility",
    emoji: "📊",
    message:
      "Managed Drupal enhancements and accessibility remediation for Cardinal.",
    longDescription:
      "Managed Drupal-based enhancements and accessibility remediation for the statewide Cardinal financial system. Balanced VITA standards, timelines, dependency management, and cross-team communication to deliver stable, compliant releases.",
  },
  {
    slug: "local-government-portals-payments",
    title: "Local Government Portals & Payments",
    emoji: "🏛️",
    message:
      "Oversaw website + payment integrations for localities and tax portals.",
    longDescription:
      "Oversaw website and payment integrations for local governments, including tax portals, citizen services, and forms. Coordinated with treasurers, finance teams, and technical staff to ensure secure, reliable payment flows and clear user experiences.",
  },
  {
    slug: "accessibility-compliance-program",
    title: "Accessibility Compliance Program",
    emoji: "✅",
    message:
      "Designed a structured accessibility monitoring and remediation program.",
    longDescription:
      "Designed a structured accessibility compliance program leveraging scans, dashboards, and remediation workflows. Helped agencies prioritize high-impact fixes, track progress, and align with WCAG and VITA requirements.",
  },
  {
    slug: "controller-accounting-background",
    title: "Controller & Accounting Background",
    emoji: "💼",
    message:
      "Former controller bringing financial discipline into digital projects.",
    longDescription:
      "Former controller with hands-on experience in GL, AP/AR, payroll, budgeting, and audits. Brings financial discipline, forecasting skills, and risk awareness into technical and government digital projects.",
  },
];

export function getProjectBySlug(slug: string) {
  return projects.find((p) => p.slug === slug);
}