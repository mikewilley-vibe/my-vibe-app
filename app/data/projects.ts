export type Project = {
  slug: string;
  title: string;
  emoji: string;
  message: string;
  longDescription: string;
  image?: string;
};

export const projects: Project[] = [
  {
    slug: "buick-enclave",
    title: "Selling Buick Enclave",
    emoji: "🚗",
    message:
      "Have a 2016 Buick Enclave for Sale",
    longDescription:
      "If you are interested in stealing it, then by all means, the keys on in it.",
  },
  {
    slug: "uva-football",
    title: "GATOR BOWL BOUND!",
    emoji: "🏉",
    message:
      "Cavaliers are headed to the TaxSlayer Gator Bowl!",
    longDescription:
      "No. 19 Virginia Cavaliers vs. Missouri Tigers",
      image: "/images/cam-fb.jpeg"
  },
  {
    slug: "fairfax-community-revitalization-migration",
    title: "Fairfax Community Revitalization Migration",
    emoji: "📊",
    message:
      "Migrating the Current https://www.fcrevite.org/ site to be included in Fairfax County's Planning and Development",
    longDescription:
      "Still seeking Fairfax County email address to allow us to have access",
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