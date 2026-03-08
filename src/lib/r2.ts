/**
 * Cloudflare R2 S3-compatible client.
 *
 * Required environment variables:
 *   CLOUDFLARE_R2_ACCOUNT_ID      – Your Cloudflare account ID
 *   CLOUDFLARE_R2_ACCESS_KEY_ID   – R2 API token access key
 *   CLOUDFLARE_R2_SECRET_ACCESS_KEY – R2 API token secret key
 *   CLOUDFLARE_R2_BUCKET_NAME     – R2 bucket name
 *   CLOUDFLARE_R2_PUBLIC_URL      – Public base URL (e.g. https://pub-xxxx.r2.dev)
 */

import { S3Client } from "@aws-sdk/client-s3";

function getR2Endpoint(): string {
  const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
  if (!accountId) {
    throw new Error("Missing CLOUDFLARE_R2_ACCOUNT_ID environment variable");
  }
  return `https://${accountId}.r2.cloudflarestorage.com`;
}

export const r2Client = new S3Client({
  region: "auto",
  endpoint: getR2Endpoint(),
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
});

/**
 * Build a full public CDN URL for a stored R2 object key.
 * Strips any double slashes.
 */
export function getR2PublicUrl(key: string): string {
  const base = (process.env.CLOUDFLARE_R2_PUBLIC_URL || "").replace(/\/$/, "");
  if (!base) {
    throw new Error("Missing CLOUDFLARE_R2_PUBLIC_URL environment variable");
  }
  return `${base}/${key.replace(/^\//, "")}`;
}

export const R2_BUCKET =
  process.env.CLOUDFLARE_R2_BUCKET_NAME || "signifiya-assets";
