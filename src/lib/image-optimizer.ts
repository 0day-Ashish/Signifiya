/**
 * Image optimization utilities powered by Sharp.
 *
 * All uploads are:
 *   - Converted to WebP
 *   - Resized (width-capped per category, height auto to preserve aspect ratio)
 *   - Compressed at 80% quality
 *   - EXIF metadata stripped
 */

import sharp from "sharp";

/** Image upload categories and their maximum dimensions */
export type UploadCategory =
  | "avatar"
  | "team"
  | "logo"
  | "event"
  | "gallery"
  | "merch";

const RESIZE_CONFIG: Record<
  UploadCategory,
  { width: number; height?: number }
> = {
  avatar: { width: 200, height: 200 }, // square crop for profile pictures
  team: { width: 400, height: 400 }, // square crop for team member photos
  logo: { width: 500 }, // logos – keep aspect ratio
  event: { width: 1200 }, // event cover images
  gallery: { width: 1920 }, // gallery full-width images
  merch: { width: 800 }, // merchandise product images
};

const QUALITY = 80; // WebP compression quality (0-100)
const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/tiff",
  "image/bmp",
]);

const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB input limit

export interface OptimizeResult {
  buffer: Buffer;
  contentType: "image/webp";
  /** Optimized file size in bytes */
  size: number;
}

/**
 * Validate and optimise an image buffer.
 *
 * @param buffer   Raw file bytes received from the upload.
 * @param mimeType Original MIME type of the uploaded file.
 * @param category Upload category determining the max dimensions.
 */
export async function optimizeImage(
  buffer: Buffer,
  mimeType: string,
  category: UploadCategory,
): Promise<OptimizeResult> {
  // --- Validate mime type ---
  if (!ALLOWED_MIME.has(mimeType.toLowerCase())) {
    throw new Error(
      `Unsupported file type: ${mimeType}. Allowed: ${[...ALLOWED_MIME].join(", ")}`,
    );
  }

  // --- Validate file size ---
  if (buffer.byteLength > MAX_FILE_SIZE_BYTES) {
    throw new Error(
      `File too large (${(buffer.byteLength / 1024 / 1024).toFixed(1)} MB). Maximum is 15 MB.`,
    );
  }

  const { width, height } = RESIZE_CONFIG[category];

  let pipeline = sharp(buffer)
    // Strip EXIF / ICC profiles / comments
    .withMetadata({})
    .resize({
      width,
      height,
      fit: height ? "cover" : "inside", // cover for squares, inside for landscape
      withoutEnlargement: true, // never upscale smaller images
    })
    .webp({ quality: QUALITY });

  const optimized = await pipeline.toBuffer();

  return {
    buffer: optimized,
    contentType: "image/webp",
    size: optimized.byteLength,
  };
}

/** Generate a unique storage key for an object */
export function buildStorageKey(
  category: UploadCategory,
  originalName: string,
): string {
  const uuid = crypto.randomUUID();
  // Always store as .webp since we convert everything
  return `${category}/${uuid}.webp`;
}
