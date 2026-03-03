
"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth-server";

/**
 * Generate a unique merch order number: MERCH-26-XXXXXXXX
 */
function generateMerchOrderNumber() {
  return `MERCH-26-${randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

/**
 * Validate a referral booking ID:
 * - Must exist in the User table
 * - Must not be the same user's own booking ID
 * - Must have < 10 referral uses across MerchOrder
 */
export async function validateReferralBookingId(
  referralBookingId: string,
  ownBookingId?: string,
) {
  try {
    if (!referralBookingId?.trim()) {
      return { valid: false, error: "Referral booking ID is required" };
    }

    const trimmed = referralBookingId.trim().toUpperCase();

    // Can't use own booking ID
    if (ownBookingId && trimmed === ownBookingId.toUpperCase()) {
      return { valid: false, error: "You cannot use your own booking ID" };
    }

    // Check if booking ID exists in User table
    const user = await prisma.user.findFirst({
      where: { bookingId: trimmed },
      select: { id: true, name: true, bookingId: true },
    });

    if (!user) {
      return { valid: false, error: "This booking ID does not exist" };
    }

    // Count how many times this booking ID has been used as a referral
    const referralCount = await prisma.merchOrder.count({
      where: { referralBookingId: trimmed },
    });

    if (referralCount >= 10) {
      return {
        valid: false,
        error: "This booking ID has reached the referral limit (10 uses)",
      };
    }

    return {
      valid: true,
      referrerName: user.name,
      usesRemaining: 10 - referralCount,
    };
  } catch (error: any) {
    console.error("validateReferralBookingId error:", error);
    return { valid: false, error: "Failed to validate referral" };
  }
}

/**
 * Calculate referral discount: 10% of total, capped at ₹25
 */
function calculateReferralDiscount(totalAmount: number): number {
  const discount = Math.floor(totalAmount * 0.1);
  return Math.min(discount, 25);
}

/**
 * Submit a merch order with UTR payment
 */
export async function submitMerchOrder(data: {
  merchItemId: number;
  merchItemName: string;
  size?: string;
  color?: string;
  customText?: string;
  quantity: number;
  unitPrice: number;
  name: string;
  email: string;
  phone: string;
  college?: string;
  utrId: string;
  sessionUserId?: string;
  userBookingId?: string;
  referralBookingId?: string;
}) {
  try {
    const {
      merchItemId,
      merchItemName,
      size,
      color,
      customText,
      quantity,
      unitPrice,
      name,
      email,
      phone,
      college,
      utrId,
      sessionUserId,
      userBookingId,
      referralBookingId,
    } = data;

    // Server-side auth guard
    const session = await getSession();
    if (!session?.user?.id) {
      return { success: false, error: "You must be logged in to order merch" };
    }

    if (!name?.trim() || !email?.trim() || !phone?.trim()) {
      return { success: false, error: "Name, email, and phone are required" };
    }
    if (!utrId?.trim() || utrId.trim().length < 4) {
      return {
        success: false,
        error: "Please enter a valid Transaction / UTR ID",
      };
    }
    if (!merchItemId || !merchItemName || !unitPrice || !quantity) {
      return { success: false, error: "Product details are required" };
    }

    let discountApplied = false;
    let discountAmount = 0;
    let validatedReferralId: string | null = null;

    // Validate referral if provided
    if (referralBookingId?.trim()) {
      const validation = await validateReferralBookingId(
        referralBookingId,
        userBookingId,
      );
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }
      validatedReferralId = referralBookingId.trim().toUpperCase();
      const subtotal = unitPrice * quantity;
      discountAmount = calculateReferralDiscount(subtotal);
      discountApplied = discountAmount > 0;
    }

    const subtotal = unitPrice * quantity;
    const totalAmount = subtotal - discountAmount;
    const orderNumber = generateMerchOrderNumber();

    const order = await prisma.merchOrder.create({
      data: {
        orderNumber,
        userId: sessionUserId || null,
        userBookingId: userBookingId || null,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        college: college?.trim() || null,
        merchItemId,
        merchItemName,
        size: size || null,
        color: color || null,
        customText: customText || null,
        quantity,
        unitPrice,
        totalAmount,
        paymentMethod: "utr",
        utrId: utrId.trim(),
        referralBookingId: validatedReferralId,
        discountApplied,
        discountAmount,
        status: "pending",
      },
    });

    revalidatePath("/admin/merch-orders");

    return {
      success: true,
      orderNumber: order.orderNumber,
      order,
    };
  } catch (error: any) {
    console.error("submitMerchOrder error:", error);
    return {
      success: false,
      error: error?.message || "Failed to create order",
    };
  }
}

/**
 * Get merch orders for a user
 */
export async function getUserMerchOrders(userId: string) {
  try {
    if (!userId) return [];
    const orders = await prisma.merchOrder.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return orders;
  } catch (error) {
    console.error("getUserMerchOrders error:", error);
    return [];
  }
}
