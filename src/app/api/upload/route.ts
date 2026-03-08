/**
 * POST /api/upload
 *
 * Unified image upload endpoint.
 * Parses multipart/form-data, optimises the image with Sharp,
 * and stores the result on Cloudflare R2.
 *
 * Form fields:
 *   file      – the image file (required)
 *   category  – "avatar" | "team" | "logo" | "event" | "gallery" | "merch"
 *               (defaults to "gallery")
 *
 * Response:
 *   { success: true,  url: string, key: string, size: number }
 *   { success: false, error: string }
 *
 * Auth:
 *   - "avatar" category: any authenticated user
 *   - all other categories: admin only
 */

import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2Client, getR2PublicUrl, R2_BUCKET } from "@/lib/r2";
import {
  optimizeImage,
  buildStorageKey,
  UploadCategory,
} from "@/lib/image-optimizer";
import { getSession } from "@/lib/auth-server";

// Force Node.js runtime so Sharp can run
export const runtime = "nodejs";

const VALID_CATEGORIES = new Set<UploadCategory>([
  "avatar",
  "team",
  "logo",
  "event",
  "gallery",
  "merch",
]);

export async function POST(request: NextRequest) {
  try {
    // ----- Auth check -----
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: you must be signed in" },
        { status: 401 },
      );
    }

    // ----- Parse form data -----
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid multipart/form-data request" },
        { status: 400 },
      );
    }

    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: "Missing or invalid 'file' field" },
        { status: 400 },
      );
    }

    const rawCategory = (formData.get("category") as string) || "gallery";
    const category: UploadCategory = VALID_CATEGORIES.has(
      rawCategory as UploadCategory,
    )
      ? (rawCategory as UploadCategory)
      : "gallery";

    // Only admins can upload non-avatar assets
    if (category !== "avatar") {
      const adminEmails = (process.env.ADMIN_EMAILS || "")
        .split(",")
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);
      const email = session.user.email?.toLowerCase() ?? "";
      const isAdmin =
        (session.user as { role?: string }).role === "admin" ||
        (adminEmails.length > 0 && adminEmails.includes(email));

      if (!isAdmin) {
        return NextResponse.json(
          {
            success: false,
            error: "Forbidden: only admins can upload this category",
          },
          { status: 403 },
        );
      }
    }

    // ----- Read file into buffer -----
    const rawBuffer = Buffer.from(await file.arrayBuffer());

    // ----- Optimise with Sharp -----
    let optimized;
    try {
      optimized = await optimizeImage(rawBuffer, file.type, category);
    } catch (err: any) {
      return NextResponse.json(
        { success: false, error: err.message },
        { status: 400 },
      );
    }

    // ----- Build storage key & upload to R2 -----
    const key = buildStorageKey(category, file.name);

    await r2Client.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
        Body: optimized.buffer,
        ContentType: optimized.contentType,
        // Cache aggressively on CDN – images are immutable (UUID keys)
        CacheControl: "public, max-age=31536000, immutable",
      }),
    );

    const url = getR2PublicUrl(key);

    return NextResponse.json({
      success: true,
      url,
      key,
      size: optimized.size,
      originalSize: rawBuffer.byteLength,
      savings: `${(((rawBuffer.byteLength - optimized.size) / rawBuffer.byteLength) * 100).toFixed(1)}%`,
    });
  } catch (err: any) {
    console.error("[/api/upload] Unexpected error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
