/**
 * Razorpay Configuration
 * Server-side Razorpay instance
 */

import Razorpay from "razorpay";

// Initialize Razorpay instance
export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

// Get public key for client-side
export const getRazorpayKeyId = () => {
  return process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";
};
