import fs from "fs";
import path from "path";
import GalleryClient from "./GalleryClient";

export type Tag = "people" | "travel" | "sports" | "other";

export type Photo = {
  id: number;
  src: string;
  title: string;
  location?: string;
  date?: string;
  tags: Tag[];
  aspect: "portrait" | "landscape" | "square";
};

export const dynamic = "force-static";

function filenameToTitle(filename: string): string {
  const base = filename.replace(/\.[^/.]+$/, "");
  return base
    .replace(/[-_]+/g, " ")
    .replace(/\b(people|travel|sports|other|portrait|landscape|square|vert|wide)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (c) => c.toUpperCase()) || "Untitled photo";
}

function guessAspectFromName(filename: string): "portrait" | "landscape" | "square" {
  const lower = filename.toLowerCase();
  if (lower.includes("square")) return "square";
  if (lower.includes("vert") || lower.includes("portrait")) return "portrait";
  if (lower.includes("wide") || lower.includes("landscape")) return "landscape";
  return "portrait";
}

function guessTagsFromName(filename: string): Tag[] {
  const lower = filename.toLowerCase();
  const tags: Tag[] = [];
  if (/(people|family|portrait|friends?)/.test(lower)) tags.push("people");
  if (/(travel|trip|beach|city|mountain|vacation)/.test(lower)) tags.push("travel");
  if (/(sport|basketball|football|soccer|game|ball)/.test(lower)) tags.push("sports");
  return tags.length ? tags : ["other"];
}

export default function GalleryPage() {
  const galleryDir = path.join(process.cwd(), "public", "gallery");
  let photos: Photo[] = [];

  try {
    const files = fs.readdirSync(galleryDir);
    const imageFiles = files.filter((file) =>
      file.match(/\.(jpe?g|png|webp|gif)$/i)
    );

    photos = imageFiles.map((file, index) => ({
      id: index + 1,
      src: `/gallery/${file}`,
      title: filenameToTitle(file),
      tags: guessTagsFromName(file),
      aspect: guessAspectFromName(file),
    }));
  } catch (err) {
    console.error("Error reading gallery directory:", err);
  }

  return <GalleryClient initialPhotos={photos} />;
}
