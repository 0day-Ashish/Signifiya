/**
 * CDN base URL for Cloudflare R2 public bucket.
 * All static assets (images, icons, logos) are served from here.
 */
export const CDN_BASE =
  process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL ||
  "https://pub-7bb925c121d140598e02eb321a90257a.r2.dev";

/**
 * Returns a fully-qualified CDN URL for the given public asset path.
 * @example cdn("https://pub-7bb925c121d140598e02eb321a90257a.r2.dev/gallery/gallery-01.jpeg")
 *   → "https://pub-7bb925c121d140598e02eb321a90257a.r2.dev/gallery/gallery-01.jpeg"
 */
export const cdn = (path: string): string =>
  `${CDN_BASE}${path.startsWith("/") ? path : `/${path}`}`;
