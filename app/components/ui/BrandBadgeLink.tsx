import Image from "next/image";

type BrandBadgeLinkProps = {
  href: string;
  logoSrc: string;
  alt: string;
  width?: number;
  height?: number;
};

export default function BrandBadgeLink({
  href,
  logoSrc,
  alt,
  width = 200,
  height = 48,
}: BrandBadgeLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center mt-3 transition-all duration-300
                 grayscale hover:grayscale-0 hover:opacity-100 opacity-80
                 hover:scale-[1.02]"
    >
      <Image
        src={logoSrc}
        alt={alt}
        width={width}
        height={height}
        className="h-10 w-auto"
      />
    </a>
  );
}