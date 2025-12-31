export type Sponsor = {
  id: string;
  sponsor: string;
  headline: string;
  copy: string;
  cta: string;
  href: string;
  variant: "slate" | "indigo" | "emerald";
  logoSrc?: string;
  alt?: string;
};

export const sponsors: Sponsor[] = [
  {
    id: "nusbaum",
    sponsor: "Reduce Risk With Reliable Insurance",
    headline: "Nusbaum Insurance",
    copy: "The Solution To Your Insurance Needs",
    cta: "Get a quote",
    href: "https://nusbauminsurance.com/",
    variant: "slate",
    logoSrc: "/images/Nusbaum-Insurance-Agency-Logo-800.png",
    alt: "Nusbaum Insurance",
  },
  {
    id: "vandy-accounting",
    sponsor: "Clean books, clear dashboards, and proactive tax planning for small business.",
    headline: "Vandy Accounting Solutions",
    copy: "Your outsourced accounting solution.",
    cta: "Work with Us!",
    href: "https://vandy-accounting-migration.vercel.app/",
    variant: "emerald",
    logoSrc: "/images/logo.png",
    alt: "Vandy Accounting",
  },
   {
    id: "vandy-dance",
    sponsor: "At Vandy Dance Company, we believe that dance is for everyone, regardless of age or skill level.",
    headline: "Vandy Dance Company",
    copy: "Dance For All!",
    cta: "Visit Us!",
    href: "https://vandydancecompany.com/",
    variant: "indigo",
    logoSrc: "/images/dance.jpeg",
    alt: "Vandy Dance",
  },
];