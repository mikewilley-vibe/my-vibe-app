"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

type FilterKey = "none" | "bw" | "sepia" | "cool" | "vintage";
type BorderKey = "none" | "thin" | "thick" | "shadow" | "neon";
type TextEffectKey = "none" | "shadow" | "glow" | "stroke" | "glow-stroke";
type ExportSizeKey = "poster" | "square" | "story";
type TemplateKey = "clean" | "neonNight" | "filmNoir" | "sunsetTravel";
type FontKey = "system" | "cinematic" | "serif" | "handwritten";

const FILTER_LABELS: Record<FilterKey, string> = {
  none: "None",
  bw: "Black & White",
  sepia: "Sepia",
  cool: "Cool Tone",
  vintage: "Vintage Fade",
};

const BORDER_LABELS: Record<BorderKey, string> = {
  none: "None",
  thin: "Thin",
  thick: "Thick",
  shadow: "Shadow",
  neon: "Neon",
};

const TEXT_EFFECT_LABELS: Record<TextEffectKey, string> = {
  none: "None",
  shadow: "Shadow",
  glow: "Glow",
  stroke: "Stroke",
  "glow-stroke": "Glow + Stroke",
};

const EXPORT_SIZES: Record<
  ExportSizeKey,
  { label: string; width: number; height: number }
> = {
  poster: { label: "Poster (3:4)", width: 450, height: 600 },
  square: { label: "Square (1:1)", width: 500, height: 500 },
  story: { label: "Story (9:16)", width: 405, height: 720 },
};

const FONTS: Record<
  FontKey,
  {
    label: string;
    titleCanvas: string;
    subtitleCanvas: string;
    titleFamily: string;
    subtitleFamily: string;
  }
> = {
  system: {
    label: "System",
    titleCanvas:
      "bold 32px system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    subtitleCanvas:
      "18px system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    titleFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    subtitleFamily:
      "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  },
  cinematic: {
    label: "Cinematic",
    titleCanvas:
      "bold 34px Impact, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    subtitleCanvas:
      "17px 'Helvetica Neue', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    titleFamily:
      "Impact, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    subtitleFamily:
      "'Helvetica Neue', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  },
  serif: {
    label: "Serif",
    titleCanvas: "bold 32px Georgia, 'Times New Roman', serif",
    subtitleCanvas: "18px Georgia, 'Times New Roman', serif",
    titleFamily: "Georgia, 'Times New Roman', serif",
    subtitleFamily: "Georgia, 'Times New Roman', serif",
  },
  handwritten: {
    label: "Handwritten",
    titleCanvas:
      "bold 30px 'Comic Sans MS', 'Marker Felt', system-ui, sans-serif",
    subtitleCanvas:
      "18px 'Comic Sans MS', 'Marker Felt', system-ui, sans-serif",
    titleFamily:
      "'Comic Sans MS', 'Marker Felt', system-ui, sans-serif",
    subtitleFamily:
      "'Comic Sans MS', 'Marker Felt', system-ui, sans-serif",
  },
};

const filterMapPreview: Record<FilterKey, string> = {
  none: "none",
  bw: "grayscale(100%)",
  sepia: "sepia(100%)",
  cool: "brightness(0.9) hue-rotate(180deg) saturate(1.5)",
  vintage: "contrast(0.8) sepia(30%) saturate(0.8)",
};

const filterMapCanvas: Record<FilterKey, string> = {
  none: "none",
  bw: "grayscale(1)",
  sepia: "sepia(1)",
  cool: "brightness(0.9) hue-rotate(180deg) saturate(1.5)",
  vintage: "contrast(0.8) sepia(0.3) saturate(0.8)",
};

const borderMapPreview: Record<BorderKey, string> = {
  none: "none",
  thin: "4px solid white",
  thick: "12px solid white",
  shadow: "0 0 25px rgba(255,255,255,0.5)",
  neon: "0 0 15px #00eaff, 0 0 30px #00eaff",
};

const TEMPLATES: Record<
  TemplateKey,
  {
    label: string;
    filter: FilterKey;
    border: BorderKey;
    textEffect: TextEffectKey;
    titleColor: string;
    subtitleColor: string;
  }
> = {
  clean: {
    label: "Clean Minimal",
    filter: "none",
    border: "thin",
    textEffect: "none",
    titleColor: "#ffffff",
    subtitleColor: "#e5e7eb",
  },
  neonNight: {
    label: "Neon Night",
    filter: "cool",
    border: "neon",
    textEffect: "glow-stroke",
    titleColor: "#22d3ee",
    subtitleColor: "#a855f7",
  },
  filmNoir: {
    label: "Film Noir",
    filter: "bw",
    border: "thick",
    textEffect: "shadow",
    titleColor: "#f9fafb",
    subtitleColor: "#9ca3af",
  },
  sunsetTravel: {
    label: "Sunset Travel",
    filter: "vintage",
    border: "shadow",
    textEffect: "glow",
    titleColor: "#fed7aa",
    subtitleColor: "#bfdbfe",
  },
};

// ---------- Palette helpers ----------
const rgbToHex = (r: number, g: number, b: number) => {
  const toHex = (v: number) => v.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toLowerCase();
};

async function extractPalette(
  imageSrc: string,
  maxColors = 5
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve([]);
        return;
      }

      const size = 64;
      canvas.width = size;
      canvas.height = size;
      ctx.drawImage(img, 0, 0, size, size);

      const imageData = ctx.getImageData(0, 0, size, size);
      const data = imageData.data;
      const colorCount: Record<string, number> = {};

      for (let i = 0; i < data.length; i += 4 * 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];
        if (a < 128) continue;

        const rq = Math.round(r / 32) * 32;
        const gq = Math.round(g / 32) * 32;
        const bq = Math.round(b / 32) * 32;
        const key = `${rq},${gq},${bq}`;
        colorCount[key] = (colorCount[key] || 0) + 1;
      }

      const sorted = Object.entries(colorCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, maxColors)
        .map(([key]) => {
          const [r, g, b] = key.split(",").map((v) => parseInt(v, 10));
          return rgbToHex(r, g, b);
        });

      resolve(sorted);
    };

    img.onerror = () => reject(new Error("Failed to load image for palette"));
  });
}

// ---------- Component ----------
export default function PosterGeneratorPage() {
  const [image, setImage] = useState<string | null>(null);
  const [title, setTitle] = useState("MY POSTER");
  const [subtitle, setSubtitle] = useState("Subtitle goes here");
  const [location, setLocation] = useState("");

  const [filter, setFilter] = useState<FilterKey>("none");
  const [border, setBorder] = useState<BorderKey>("none");
  const [textEffect, setTextEffect] = useState<TextEffectKey>("shadow");
  const [exportSize, setExportSize] = useState<ExportSizeKey>("poster");
  const [template, setTemplate] = useState<TemplateKey>("clean");
  const [fontKey, setFontKey] = useState<FontKey>("system");

  const [titleColor, setTitleColor] = useState<string>("#ffffff");
  const [subtitleColor, setSubtitleColor] = useState<string>("#e5e7eb");
  const [palette, setPalette] = useState<string[]>([]);
  const [paletteLoading, setPaletteLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { width: previewWidth, height: previewHeight } =
    EXPORT_SIZES[exportSize];

  // palette on image change
  useEffect(() => {
    const run = async () => {
      if (!image) {
        setPalette([]);
        return;
      }
      try {
        setPaletteLoading(true);
        const colors = await extractPalette(image);
        setPalette(colors);
      } catch {
        setPalette([]);
      } finally {
        setPaletteLoading(false);
      }
    };
    run();
  }, [image]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => setImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const applyTemplate = (key: TemplateKey) => {
    setTemplate(key);
    const t = TEMPLATES[key];
    setFilter(t.filter);
    setBorder(t.border);
    setTextEffect(t.textEffect);
    setTitleColor(t.titleColor);
    setSubtitleColor(t.subtitleColor);
  };

  const downloadPoster = async () => {
    if (!image) return;

    const { width: baseWidth, height: baseHeight } = EXPORT_SIZES[exportSize];
    const scale = 2;
    const canvas = document.createElement("canvas");
    canvas.width = baseWidth * scale;
    canvas.height = baseHeight * scale;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.scale(scale, scale);

    // background
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, baseWidth, baseHeight);

    // image
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = image;

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject();
    });

    ctx.filter = filterMapCanvas[filter] ?? "none";

    const imgRatio = img.width / img.height;
    const posterRatio = baseWidth / baseHeight;
    let drawWidth: number;
    let drawHeight: number;

    if (imgRatio > posterRatio) {
      drawWidth = baseWidth;
      drawHeight = baseWidth / imgRatio;
    } else {
      drawHeight = baseHeight;
      drawWidth = baseHeight * imgRatio;
    }

    const dx = (baseWidth - drawWidth) / 2;
    const dy = (baseHeight - drawHeight) / 2;

    ctx.drawImage(img, dx, dy, drawWidth, drawHeight);

    ctx.filter = "none";

    // border
    if (border !== "none") {
      ctx.save();
      if (border === "thin" || border === "thick") {
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = border === "thin" ? 4 : 12;
        ctx.strokeRect(8, 8, baseWidth - 16, baseHeight - 16);
      } else if (border === "shadow") {
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 6;
        ctx.shadowColor = "rgba(0,0,0,0.8)";
        ctx.shadowBlur = 20;
        ctx.strokeRect(10, 10, baseWidth - 20, baseHeight - 20);
      } else if (border === "neon") {
        ctx.strokeStyle = "#22d3ee";
        ctx.lineWidth = 6;
        ctx.shadowColor = "#22d3ee";
        ctx.shadowBlur = 25;
        ctx.strokeRect(10, 10, baseWidth - 20, baseHeight - 20);
      }
      ctx.restore();
    }

    const fontDef = FONTS[fontKey];

    // text layout
    const titleY = baseHeight - 70;
    const subtitleY = baseHeight - 40;
    const locationY = baseHeight - 18;

    ctx.textAlign = "center";

    const drawTextWithEffect = (
      text: string,
      y: number,
      font: string,
      color: string,
      size: "title" | "subtitle" | "location"
    ) => {
      ctx.save();
      ctx.font = font;

      const strokeColor = "#000000";

      if (textEffect === "stroke" || textEffect === "glow-stroke") {
        ctx.lineWidth = size === "title" ? 4 : 3;
        ctx.strokeStyle = strokeColor;
        ctx.strokeText(text, baseWidth / 2, y);
      }

      if (textEffect === "shadow" || textEffect === "glow") {
        ctx.shadowColor =
          textEffect === "glow" ? color : "rgba(0,0,0,0.8)";
        ctx.shadowBlur = textEffect === "glow" ? 18 : 8;
      }

      if (textEffect === "glow-stroke") {
        ctx.shadowColor = color;
        ctx.shadowBlur = 18;
      }

      ctx.fillStyle = color;
      ctx.fillText(text, baseWidth / 2, y);
      ctx.restore();
    };

    drawTextWithEffect(
      title,
      titleY,
      fontDef.titleCanvas,
      titleColor,
      "title"
    );
    drawTextWithEffect(
      subtitle,
      subtitleY,
      fontDef.subtitleCanvas,
      subtitleColor,
      "subtitle"
    );

    if (location.trim()) {
      const locFont = fontDef.subtitleCanvas.replace(
        /(\d+)px/,
        "14px"
      );
      const locColor = "#9ca3af"; // slate-400-ish
      drawTextWithEffect(
        location,
        locationY,
        locFont,
        locColor,
        "location"
      );
    }

    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "poster.png";
    link.click();
  };

  const fontDef = FONTS[fontKey];

  const previewTitleShadow =
    textEffect === "shadow"
      ? "0 0 8px rgba(0,0,0,0.8)"
      : textEffect === "glow" || textEffect === "glow-stroke"
      ? `0 0 18px ${titleColor}`
      : "none";

  const previewSubtitleShadow =
    textEffect === "shadow"
      ? "0 0 6px rgba(0,0,0,0.9)"
      : textEffect === "glow" || textEffect === "glow-stroke"
      ? `0 0 14px ${subtitleColor}`
      : "none";

  const previewTitleStroke =
    textEffect === "stroke" || textEffect === "glow-stroke"
      ? "1px #000000"
      : "none";

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="mx-auto max-w-6xl grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Controls */}
        <div className="space-y-6 rounded-xl bg-slate-900 p-5">
          <h1 className="text-xl font-semibold">Poster Generator 🎨</h1>

          {/* Template */}
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400">
              Template
            </label>
            <select
              value={template}
              onChange={(e) => applyTemplate(e.target.value as TemplateKey)}
              className="w-full rounded bg-slate-800 px-3 py-2 text-sm"
            >
              {Object.entries(TEMPLATES).map(([key, t]) => (
                <option key={key} value={key}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Export Size */}
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400">
              Export Size
            </label>
            <select
              value={exportSize}
              onChange={(e) =>
                setExportSize(e.target.value as ExportSizeKey)
              }
              className="w-full rounded bg-slate-800 px-3 py-2 text-sm"
            >
              {Object.entries(EXPORT_SIZES).map(([key, s]) => (
                <option key={key} value={key}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Upload (card is fully clickable) */}
          <div
            className="group cursor-pointer rounded-lg border border-slate-700 bg-slate-900/70 p-3 transition-transform duration-150 hover:-translate-y-1"
            onClick={() => fileInputRef.current?.click()}
          >
            <label className="mb-1 block text-sm text-slate-300 transition-transform duration-150 group-hover:-translate-y-0.5">
              Upload Image
            </label>
            <div className="rounded bg-slate-800/60 px-3 py-2 text-xs text-slate-300 group-hover:bg-slate-800">
              {image ? "Change image…" : "Click anywhere in this box to choose a file"}
            </div>
            <p className="mt-1 text-[10px] text-slate-500 group-hover:text-slate-300">
              Opens your file picker.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Title */}
          <div>
            <label className="mb-1 block text-sm text-slate-300">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded bg-slate-800 px-3 py-2 text-sm"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="mb-1 block text-sm text-slate-300">
              Subtitle
            </label>
            <input
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full rounded bg-slate-800 px-3 py-2 text-sm"
            />
          </div>

          {/* Location */}
          <div>
            <label className="mb-1 block text-sm text-slate-300">
              Location
            </label>
            <input
              placeholder="e.g. Richmond, VA • 2026"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded bg-slate-800 px-3 py-2 text-sm"
            />
          </div>

          {/* Font selector */}
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400">
              Font Style
            </label>
            <select
              value={fontKey}
              onChange={(e) => setFontKey(e.target.value as FontKey)}
              className="w-full rounded bg-slate-800 px-3 py-2 text-sm"
            >
              {Object.entries(FONTS).map(([key, f]) => (
                <option key={key} value={key}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          {/* Text Effect */}
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400">
              Text Effect
            </label>
            <select
              value={textEffect}
              onChange={(e) =>
                setTextEffect(e.target.value as TextEffectKey)
              }
              className="w-full rounded bg-slate-800 px-3 py-2 text-sm"
            >
              {Object.entries(TEXT_EFFECT_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Filter */}
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400">
              Filter
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterKey)}
              className="w-full rounded bg-slate-800 px-3 py-2 text-sm"
            >
              {Object.entries(FILTER_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Border */}
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400">
              Border
            </label>
            <select
              value={border}
              onChange={(e) => setBorder(e.target.value as BorderKey)}
              className="w-full rounded bg-slate-800 px-3 py-2 text-sm"
            >
              {Object.entries(BORDER_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Palette */}
          {image && (
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400">
                Palette from Image
              </label>
              {paletteLoading && (
                <p className="text-xs text-slate-500">Analyzing colors…</p>
              )}
              {!paletteLoading && palette.length === 0 && (
                <p className="text-xs text-slate-500">
                  No dominant colors found yet.
                </p>
              )}
              {!paletteLoading && palette.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {palette.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => {
                        setTitleColor(color);
                        setSubtitleColor(color);
                      }}
                      className="h-7 w-7 rounded-full border border-slate-700"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Download */}
          <button
            onClick={downloadPoster}
            disabled={!image}
            className="w-full rounded-lg bg-emerald-500 py-2 text-sm font-semibold text-emerald-950 hover:bg-emerald-400 disabled:opacity-60"
          >
            Download Poster ⬇️
          </button>
        </div>

        {/* Poster Preview */}
        <div className="flex items-center justify-center md:col-span-2">
          <div
            className="relative rounded-xl p-4"
            style={{
              width: previewWidth,
              height: previewHeight,
              backgroundColor: "#000000",
              border:
                border === "thin" || border === "thick"
                  ? borderMapPreview[border]
                  : "none",
              boxShadow:
                border === "shadow" || border === "neon"
                  ? borderMapPreview[border]
                  : "none",
              overflow: "hidden",
            }}
          >
            {!image ? (
              <p className="p-4 text-center text-sm italic text-slate-500 transition-transform duration-150 hover:-translate-y-1">
                Upload an image to preview your poster.
              </p>
            ) : (
              <>
                <img
                  src={image}
                  alt="Poster"
                  className="h-full w-full object-contain"
                  style={{ filter: filterMapPreview[filter] }}
                />
                <div
                  className="absolute bottom-6 left-0 right-0 px-3 text-center"
                  style={{ pointerEvents: "none" }}
                >
                  <h2
                    className="text-2xl font-bold"
                    style={
                      {
                        color: titleColor,
                        textShadow: previewTitleShadow,
                        WebkitTextStroke: previewTitleStroke,
                        fontFamily: fontDef.titleFamily,
                      } as CSSProperties
                    }
                  >
                    {title}
                  </h2>
                  <p
                    className="text-sm"
                    style={
                      {
                        color: subtitleColor,
                        textShadow: previewSubtitleShadow,
                        fontFamily: fontDef.subtitleFamily,
                      } as CSSProperties
                    }
                  >
                    {subtitle}
                  </p>
                  {location.trim() && (
                    <p
                      className="mt-1 text-xs"
                      style={
                        {
                          color: "#9ca3af",
                          textShadow: "0 0 4px rgba(0,0,0,0.9)",
                          fontFamily: fontDef.subtitleFamily,
                        } as CSSProperties
                      }
                    >
                      {location}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}