import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  size?: "sm" | "md" | "lg";
};

export default function AvatarHero({
  src,
  alt,
  size = "md",
}: Props) {
  const sizeClasses = {
    sm: "h-28 w-28",
    md: "h-40 w-40",
    lg: "h-100 w-100",
  };

  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br
      from-blue-500 via-indigo-500 to-sky-400 shadow-lg shadow-blue-500/40
      ${sizeClasses[size]}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover object-top"
        priority
      />
    </div>
  );
}