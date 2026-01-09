import fs from "fs";
import path from "path";
import GalleryClient from "./GalleryClient";

export type Tag = "people" | "travel" | "sports" | "other";

export type Photo = {
  id: number;
  src: string;          // public URL like /gallery/file.jpg
  title: string;
  location?: string;
  date?: string;
  tags: Tag[];
  aspect: "portrait" | "landscape" | "square";
};

export const dynamic = "force-static"; // or "auto", whatever you prefer

// crude filename -> title
function filenameToTitle(filename: string): string {
  const base = filename.replace(/\.[^/.]+$/, ""); // remove extension
  return base
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (c) => c.toUpperCase());
}

// very simple guess: portrait if taller-looking name, else landscape
function guessAspectFromName(filename: string): "portrait" | "landscape" | "square" {
  if (filename.toLowerCase().includes("square")) return "square";
  if (filename.toLowerCase().includes("vert")) return "portrait";
  if (filename.toLowerCase().includes("wide")) return "landscape";
  return "portrait"; // default
}

export default function GalleryPage() {
  const galleryDir = path.join(process.cwd(), "public", "gallery");

  let photos: Photo[] = [];

  try {
    const files = fs.readdirSync(galleryDir);

    const imageFiles = files.filter((file) =>
      file.match(/\.(jpe?g|png|webp|gif)$/i)
    );

    photos = imageFiles.map((file, index) => {
      const title = filenameToTitle(file);

      return {
        id: index + 1,
        src: `/gallery/${file}`,
        title,
        // You can later set these manually or infer from file names
        location: "",
        date: "",
        tags: ["other"] as Tag[],
        aspect: guessAspectFromName(file),
      };
    });
  } catch (err) {
    console.error("Error reading gallery directory:", err);
  }

  return <GalleryClient initialPhotos={photos} />;
}