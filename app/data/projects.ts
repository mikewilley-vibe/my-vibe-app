export type Project = {
  slug: string;
  title: string;
  emoji: string;
  message: string;
  longDescription: string;
  image?: string;
  video?: string;
};

export const projects: Project[] = [
  {
    slug: "buick-enclave",
    title: "Selling Buick Enclave",
    emoji: "🚗",
    message:
      "2016 Buick Enclabve for sale.",
    longDescription:
      "If you are interested in stealing it, then by all means, the keys on in it.",
  },
  {
    slug: "vandy-accounting",
    title: "Vandy Accounting Website Rehaul",
    emoji: "💼",
    message:
      "Created a new website for Vandy Accounting.",
    longDescription:
      "My aunt Julie has an Accounting Solutions company in Indianapolis and I remade her website. ",
      image: "/images/logo.pneg"
  },
   {
    slug: "3d-rotunda",
    title: "3D Rotunda Chrsitmas Project",
    emoji: "🏛️",
    message:
      "My daughter Bea is at the head of her class and she designed and created a 3D model of the Rotunda.",
    longDescription:
      "This was such a cool project and was a perfect Christmas peresent to give to my Dad",
    video: "/video/rotunda-3d-print.mp4"
        
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
    slug: "accessibility-compliance-program",
    title: "Accessibility Compliance Program",
    emoji: "✅",
    message:
      "Designed a structured accessibility monitoring and remediation program fior for Tyler Virginia.",
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