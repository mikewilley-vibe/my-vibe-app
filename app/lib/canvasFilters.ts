export async function transformImageClient(
  dataUrl: string,
  style: string,
  maxDim = 1280
): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = dataUrl;

    img.onload = () => {
      try {
        const w = img.width;
        const h = img.height;
        const scale = Math.min(1, maxDim / Math.max(w, h));
        const cw = Math.max(1, Math.round(w * scale));
        const ch = Math.max(1, Math.round(h * scale));

        const canvas = document.createElement("canvas");
        canvas.width = cw;
        canvas.height = ch;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas not supported"));

        ctx.drawImage(img, 0, 0, cw, ch);

        const imageData = ctx.getImageData(0, 0, cw, ch);
        const data = imageData.data;

        const clamp = (v: number) => Math.max(0, Math.min(255, v));

        const posterize = (levels = 8) => {
          const step = Math.floor(255 / (levels - 1)) || 1;
          for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.round(data[i] / step) * step;
            data[i + 1] = Math.round(data[i + 1] / step) * step;
            data[i + 2] = Math.round(data[i + 2] / step) * step;
          }
        };

        const grayscale = () => {
          for (let i = 0; i < data.length; i += 4) {
            const v = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
            data[i] = data[i + 1] = data[i + 2] = v;
          }
        };

        const sobelEdges = () => {
          // Simple Sobel edge detector producing an alpha mask of edges
          const gray = new Uint8ClampedArray(cw * ch);
          for (let y = 0; y < ch; y++) {
            for (let x = 0; x < cw; x++) {
              const i = (y * cw + x) * 4;
              gray[y * cw + x] = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
            }
          }

          const out = new Uint8ClampedArray(cw * ch);
          const gx = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
          const gy = [-1, -2, -1, 0, 0, 0, 1, 2, 1];

          for (let y = 1; y < ch - 1; y++) {
            for (let x = 1; x < cw - 1; x++) {
              let sx = 0;
              let sy = 0;
              let k = 0;
              for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                  const val = gray[(y + ky) * cw + (x + kx)];
                  sx += gx[k] * val;
                  sy += gy[k] * val;
                  k++;
                }
              }
              const mag = Math.sqrt(sx * sx + sy * sy);
              out[y * cw + x] = clamp(Math.round(mag));
            }
          }
          return out;
        };

        const fastBlur = (radius = 1) => {
          // Single-pass box blur (faster than separable, lower quality)
          const kernel = new Uint8ClampedArray(cw * ch * 4);

          for (let y = 0; y < ch; y++) {
            for (let x = 0; x < cw; x++) {
              let r = 0, g = 0, b = 0, a = 0, count = 0;
              for (let dy = -radius; dy <= radius; dy++) {
                const yy = Math.min(ch - 1, Math.max(0, y + dy));
                const ibase = yy * cw * 4;
                for (let dx = -radius; dx <= radius; dx++) {
                  const xx = Math.min(cw - 1, Math.max(0, x + dx));
                  const i = ibase + xx * 4;
                  r += data[i];
                  g += data[i + 1];
                  b += data[i + 2];
                  a += data[i + 3];
                  count++;
                }
              }
              const iout = (y * cw + x) * 4;
              kernel[iout] = r / count;
              kernel[iout + 1] = g / count;
              kernel[iout + 2] = b / count;
              kernel[iout + 3] = a / count;
            }
          }

          // Copy back
          for (let i = 0; i < data.length; i++) {
            data[i] = kernel[i];
          }
        };

        const sobelThreshold = (threshold = 40) => {
          // Return a binary edge map (black/white)
          const edges = sobelEdges();
          const out = new Uint8ClampedArray(cw * ch * 4);
          for (let i = 0; i < edges.length; i++) {
            const v = edges[i] > threshold ? 0 : 255;
            const j = i * 4;
            out[j] = v;
            out[j + 1] = v;
            out[j + 2] = v;
            out[j + 3] = 255;
          }
          return out;
        };

        if (style === "cartoon") {
          posterize(8);
          // Compute thresholded edges for strong outlines
          const edgeData = sobelThreshold(45);
          ctx.putImageData(imageData, 0, 0);
          // Overlay edges using darken blend to strengthen black edges
          const edgeImg = ctx.createImageData(cw, ch);
          edgeImg.data.set(edgeData);
          ctx.globalCompositeOperation = "darken";
          ctx.putImageData(edgeImg, 0, 0);
          ctx.globalCompositeOperation = "source-over";
        } else if (style === "sketch") {
          grayscale();
          // Invert (white background)
          for (let i = 0; i < data.length; i += 4) {
            data[i] = 255 - data[i];
            data[i + 1] = 255 - data[i + 1];
            data[i + 2] = 255 - data[i + 2];
          }
          // Light blur for sketch smoothness
          fastBlur(1);
          // Dodge blending to recover dark lines
          for (let i = 0; i < data.length; i += 4) {
            const gray = data[i];
            const denom = Math.max(1, 255 - gray);
            const v = clamp(Math.round((gray * 255) / denom));
            data[i] = data[i + 1] = data[i + 2] = v;
          }
          ctx.putImageData(imageData, 0, 0);
        } else {
          // fallback (anime/oil-painting/watercolor): posterize with moderate levels
          posterize(style === "anime" ? 12 : 7);
          ctx.putImageData(imageData, 0, 0);
        }

        const out = canvas.toDataURL("image/png");
        resolve(out);
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = (e) => reject(new Error("Failed to load image"));
  });
}

export default transformImageClient;
