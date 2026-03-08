/**
 * @deprecated Storage has been migrated to Cloudflare R2.
 * Use `@/lib/r2` (r2Client, getR2PublicUrl, R2_BUCKET) instead.
 *
 * This file is kept as a compatibility shim.
 */
export { r2Client as s3Client, R2_BUCKET } from "@/lib/r2";
