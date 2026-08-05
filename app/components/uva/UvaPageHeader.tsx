import Image from "next/image";
import { UVA_BLUE, UVA_ORANGE } from "./uvaTheme";

type Props = {
  eyebrow: string;
  title: string;
  description?: string;
  badge?: string;
};

export default function UvaPageHeader({ eyebrow, title, description, badge = "UVA" }: Props) {
  return (
    <div className="mb-8 overflow-hidden rounded-2xl ring-1 ring-black/5 bg-white/70 backdrop-blur-sm">
      <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col justify-center p-6 sm:p-8">
          <p
            className="text-xs font-semibold uppercase tracking-[0.2em] mb-2"
            style={{ color: UVA_ORANGE }}
          >
            {eyebrow}
          </p>
          <h1
            className="font-display text-3xl sm:text-4xl font-semibold tracking-tight"
            style={{ color: UVA_BLUE }}
          >
            {title}
          </h1>
          {description ? (
            <p className="mt-2 text-sm text-slate-600 max-w-lg">{description}</p>
          ) : null}
        </div>

        <div className="relative min-h-[140px] md:min-h-full">
          <Image
            src="/images/scott.png"
            alt="UVA athletics"
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 40vw"
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(90deg, rgba(255,255,255,0.92) 0%, rgba(35,45,75,0.15) 45%, rgba(35,45,75,0.45) 100%)`,
            }}
          />
          <div
            className="absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-lg text-sm font-bold shadow-sm"
            style={{
              backgroundColor: UVA_BLUE,
              color: UVA_ORANGE,
              border: `3px solid ${UVA_ORANGE}`,
            }}
            aria-hidden="true"
          >
            {badge}
          </div>
        </div>
      </div>
    </div>
  );
}
