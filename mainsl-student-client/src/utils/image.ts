import api from "../api/api";

/**
 * Keep uploads small — they are stored as rows in the database, and the
 * avatars are only ever rendered at 58px (card) / 90px (modal), so 224px
 * still leaves headroom for high-DPI screens.
 */
const MAX_DIMENSION = 224;
const MAX_BYTES = 25_000; // ~25 KB
const QUALITY_STEPS = [0.72, 0.62, 0.52, 0.42, 0.35];

export interface CompressResult {
  file: File;
  /** Object URL for previewing — revoke it when you're done. */
  previewUrl: string;
  originalBytes: number;
  compressedBytes: number;
}

const loadImage = (file: File): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("That file could not be read as an image."));
    };

    img.src = url;
  });

const toBlob = (canvas: HTMLCanvasElement, quality: number): Promise<Blob> =>
  new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error("Image encoding failed.")),
      "image/jpeg",
      quality,
    );
  });

const draw = (img: HTMLImageElement, maxDimension: number) => {
  const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));

  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(img.width * scale));
  canvas.height = Math.max(1, Math.round(img.height * scale));

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Image encoding failed.");

  // JPEG has no alpha, so flatten transparency onto white instead of black.
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  return canvas;
};

/**
 * Downscale to at most MAX_DIMENSION on the long edge and re-encode as JPEG,
 * stepping quality (then dimension) down until the result fits MAX_BYTES.
 */
export async function compressImage(file: File): Promise<CompressResult> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file.");
  }

  const img = await loadImage(file);

  let best: Blob | null = null;

  for (const maxDimension of [MAX_DIMENSION, 160, 128]) {
    const canvas = draw(img, maxDimension);

    for (const quality of QUALITY_STEPS) {
      const blob = await toBlob(canvas, quality);

      // Keep the smallest we've seen, in case nothing gets under the target.
      if (!best || blob.size < best.size) best = blob;

      if (blob.size <= MAX_BYTES) {
        return finish(file, blob);
      }
    }
  }

  return finish(file, best!);
}

const finish = (original: File, blob: Blob): CompressResult => {
  const name = original.name.replace(/\.[^.]+$/, "") || "photo";

  const compressed = new File([blob], `${name}.jpg`, { type: "image/jpeg" });

  return {
    file: compressed,
    previewUrl: URL.createObjectURL(compressed),
    originalBytes: original.size,
    compressedBytes: compressed.size,
  };
};

export const formatBytes = (bytes: number) =>
  bytes >= 1_000_000
    ? `${(bytes / 1_000_000).toFixed(1)} MB`
    : `${Math.round(bytes / 1000)} KB`;

/**
 * The API returns absolute URLs for bucket-hosted images, but fall back to
 * resolving relative paths against the API host.
 */
export const resolveImageUrl = (imageUrl?: string | null) => {
  if (!imageUrl) return null;
  if (/^(https?:)?\/\//i.test(imageUrl) || imageUrl.startsWith("data:")) {
    return imageUrl;
  }

  const base = (api.defaults.baseURL ?? "").replace(/\/api\/?$/, "");

  return `${base}/${imageUrl.replace(/^\//, "")}`;
};
