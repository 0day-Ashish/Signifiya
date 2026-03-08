"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import SizeChartModal from "@/components/SizeChartModal";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { getUserProfile } from "@/app/actions";
import { submitMerchOrder, validateReferralBookingId } from "./actions";
import { ALL_MERCH, MERCH_CATEGORIES, type MerchItem } from "@/data/merch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import RegistrationComingSoon from "@/components/RegistrationComingSoon";

const MERCH_OPEN_DATE = new Date("2026-02-23T12:00:00");

// ─── Product Image Gallery ───────────────────────────────────
function ProductImageGallery({
  item,
  selectedColor,
}: {
  item: MerchItem;
  selectedColor: string | null;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Get color-specific images or fallback to all images
  const displayImages =
    selectedColor && item.colorImages?.[selectedColor]
      ? item.colorImages[selectedColor]
      : item.images;

  // Reset activeIndex when selectedColor changes
  const lastColorRef = useRef(selectedColor);
  if (lastColorRef.current !== selectedColor) {
    setActiveIndex(0);
    lastColorRef.current = selectedColor;
  }

  // Ensure activeIndex is valid for the current displayImages
  const currentActiveIndex =
    activeIndex >= displayImages.length ? 0 : activeIndex;

  return (
    <div className="flex flex-col gap-2">
      <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedColor}-${currentActiveIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0"
          >
            <Image
              src={displayImages[currentActiveIndex]}
              alt={`${item.name} - view ${currentActiveIndex + 1}`}
              fill
              className="object-contain"
              sizes="(max-width: 640px) 100vw, 500px"
            />
          </motion.div>
        </AnimatePresence>
        {/* Navigation Arrows */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={() =>
                setActiveIndex((prev) =>
                  prev > 0 ? prev - 1 : displayImages.length - 1,
                )
              }
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-black shadow-lg hover:bg-white/40 transition-all z-20 group"
              aria-label="Previous image"
            >
              <span className="text-sm group-hover:-translate-x-0.5 transition-transform">
                ←
              </span>
            </button>
            <button
              onClick={() =>
                setActiveIndex((prev) =>
                  prev < displayImages.length - 1 ? prev + 1 : 0,
                )
              }
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-black shadow-lg hover:bg-white/40 transition-all z-20 group"
              aria-label="Next image"
            >
              <span className="text-sm group-hover:translate-x-0.5 transition-transform">
                →
              </span>
            </button>
          </>
        )}

        {item.badge && (
          <div
            className={`absolute top-3 left-3 ${item.badgeColor || "bg-yellow-300"} text-black text-[10px] font-black uppercase px-2.5 py-1 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] z-10`}
          >
            {item.badge}
          </div>
        )}
        {!item.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <span className="text-white text-lg font-bold uppercase tracking-wider">
              Sold Out
            </span>
          </div>
        )}
      </div>
      {displayImages.length > 1 && (
        <div className="flex gap-2 justify-center">
          {displayImages.map((img, i) => (
            <button
              key={`${selectedColor}-${i}`}
              onClick={() => setActiveIndex(i)}
              className={`relative w-14 h-14 rounded-lg overflow-hidden border-2 transition-all duration-150 shrink-0 ${
                currentActiveIndex === i
                  ? "border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] scale-105"
                  : "border-gray-300 opacity-60 hover:opacity-90"
              }`}
            >
              <Image
                src={img}
                alt={`${item.name} thumb ${i + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Merch Booking Page ─────────────────────────────────
function MerchBookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending } = authClient.useSession();
  const [isOpen, setIsOpen] = useState(() => new Date() >= MERCH_OPEN_DATE);

  // Re-check the open date every second so the page auto-transitions
  useEffect(() => {
    if (isOpen) return;
    const interval = setInterval(() => {
      if (new Date() >= MERCH_OPEN_DATE) {
        setIsOpen(true);
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Step management
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState("");

  // Product selection — init from URL params if present
  const [selectedItem, setSelectedItem] = useState<MerchItem>(() => {
    const itemId = searchParams.get("item");
    return ALL_MERCH.find((m) => String(m.id) === itemId) ?? ALL_MERCH[0];
  });
  const [selectedSize, setSelectedSize] = useState(() => {
    const initItem =
      ALL_MERCH.find((m) => String(m.id) === searchParams.get("item")) ??
      ALL_MERCH[0];
    return initItem.sizes?.[1] || initItem.sizes?.[0] || "";
  });
  const [selectedColor, setSelectedColor] = useState(() => {
    const initItem =
      ALL_MERCH.find((m) => String(m.id) === searchParams.get("item")) ??
      ALL_MERCH[0];
    const paramColor = searchParams.get("color");
    const validColor = initItem.colors?.find((c) => c.name === paramColor);
    return validColor ? validColor.name : initItem.colors?.[0]?.name || "";
  });
  const [quantity, setQuantity] = useState(1);

  // User details
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [college, setCollege] = useState("");
  const [gender, setGender] = useState("");
  const [customText, setCustomText] = useState("");
  const [userBookingId, setUserBookingId] = useState("");

  // Payment
  const [utrId, setUtrId] = useState("");

  // Referral
  const [referralId, setReferralId] = useState("");
  const [referralValid, setReferralValid] = useState<boolean | null>(null);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [referralMsg, setReferralMsg] = useState("");
  const [referralChecking, setReferralChecking] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);

  // Computed
  const subtotal = selectedItem.price * quantity;
  const totalAmount = subtotal - discountAmount;
  const discount = selectedItem.originalPrice
    ? Math.round(
        ((selectedItem.originalPrice - selectedItem.price) /
          selectedItem.originalPrice) *
          100,
      )
    : 0;

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!isPending && !session) {
      router.push("/sign-in?callbackUrl=/merch");
    }
  }, [session, isPending, router]);

  // Prefill user data from DB
  useEffect(() => {
    const prefill = async () => {
      if (isPending || !session?.user?.id) return;
      try {
        const userProfile: any = await getUserProfile(session.user.id);
        setName(userProfile?.name || session.user.name || "");
        setEmail(session.user.email || "");
        if (userProfile?.mobileNo) {
          setPhone(
            String(userProfile.mobileNo).replace(/\D/g, "").slice(0, 10),
          );
        }
        if (userProfile?.collegeName) setCollege(userProfile.collegeName);
        if (userProfile?.gender) setGender(userProfile.gender);
        if (userProfile?.bookingId) setUserBookingId(userProfile.bookingId);
      } catch {}
    };
    prefill();
  }, [session, isPending]);

  // Handle item change
  const handleItemChange = (item: MerchItem) => {
    setSelectedItem(item);
    setSelectedSize(item.sizes?.[1] || item.sizes?.[0] || "");
    setSelectedColor(item.colors?.[0]?.name || "");
    setQuantity(1);
    setDiscountAmount(0);
    setReferralId("");
    setReferralValid(null);
    setReferralMsg("");
  };

  // Validate referral
  const handleCheckReferral = async () => {
    if (!referralId.trim()) {
      setReferralValid(null);
      setReferralMsg("");
      setDiscountAmount(0);
      return;
    }
    setReferralChecking(true);
    setReferralMsg("");
    try {
      const res = await validateReferralBookingId(
        referralId.trim(),
        userBookingId || undefined,
      );
      if (res.valid) {
        const disc = Math.min(
          Math.floor(selectedItem.price * quantity * 0.1),
          25,
        );
        setDiscountAmount(disc);
        setReferralValid(true);
        setReferralMsg(
          `Referral applied! ${res.usesRemaining} uses left. You save ₹${disc}`,
        );
      } else {
        setReferralValid(false);
        setDiscountAmount(0);
        setReferralMsg(res.error || "Invalid referral");
      }
    } catch {
      setReferralValid(false);
      setDiscountAmount(0);
      setReferralMsg("Failed to validate referral");
    }
    setReferralChecking(false);
  };

  // Step 1 → Step 2 validation
  const handleContinueToPayment = () => {
    if (!name.trim() || !email.trim() || !phone.trim() || !gender) {
      setError("Name, email, phone, and gender are required");
      return;
    }
    if (!/^[0-9]{10}$/.test(phone.trim())) {
      setError("Phone must be 10 digits");
      return;
    }
    if (!selectedItem.inStock) {
      setError("This item is currently sold out");
      return;
    }
    setError(null);
    setStep(2);
  };

  // Step 2 → Submit order
  const handleSubmitPayment = async () => {
    if (!utrId.trim() || utrId.trim().length < 4) {
      setError("Please enter a valid Transaction / UTR ID");
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const res = await submitMerchOrder({
        merchItemId: selectedItem.id,
        merchItemName: selectedItem.name,
        size: selectedSize || undefined,
        color: selectedColor || undefined,
        gender: gender || undefined,
        customText: customText.trim() || undefined,
        quantity,
        unitPrice: selectedItem.price,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        college: college.trim() || undefined,
        utrId: utrId.trim(),
        sessionUserId: session?.user?.id,
        userBookingId: userBookingId || undefined,
        referralBookingId:
          referralValid && referralId.trim() ? referralId.trim() : undefined,
      });

      if (!res?.success) {
        setError(res?.error || "Something went wrong");
        setIsLoading(false);
        return;
      }

      setOrderNumber(res.orderNumber || "");
      setStep(3);
    } catch (err: any) {
      setError(err?.message || "Failed to submit order. Please try again.");
    }
    setIsLoading(false);
  };

  // Styles (matching register page)
  const inputStyles =
    "rounded-lg border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all outline-none";
  const labelStyles =
    "text-black font-bold uppercase text-xs tracking-wider mb-1 block";

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (new Date() < MERCH_OPEN_DATE && !isOpen) {
    return <RegistrationComingSoon type="merch" openDate={MERCH_OPEN_DATE} />;
  }

  return (
    <div className="bg-zinc-950 min-h-screen flex items-center justify-center p-4 lg:p-8 font-sans overflow-x-hidden">
      {/* Main Card Container */}
      <div className="bg-white rounded-[2rem] w-full border-4 border-black shadow-[12px_12px_0px_0px_rgba(20,20,20,1)] flex flex-col lg:flex-row min-h-screen lg:min-h-[85vh]">
        {/* --- LEFT SIDE: FORM --- */}
        <div className="flex-1 flex flex-col p-6 lg:p-10 relative">
          {/* Header */}
          <div className="flex flex-col mb-8">
            <Link
              href="/"
              className="inline-block w-fit text-black font-mono text-xs font-bold border-2 border-black px-3 py-1 rounded bg-yellow-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-none transition-all mb-6"
            >
              ← RETURN HOME
            </Link>

            <h1 className="text-3xl lg:text-6xl font-black tracking-tighter text-black leading-none uppercase">
              Merch <br /> <span className="text-orange-500">Booking.</span>
            </h1>

            {/* Retro Progress Bar */}
            <div className="mt-8 w-full h-6 border-2 border-black rounded-full p-1 bg-zinc-100">
              <motion.div
                initial={{ width: "0%" }}
                animate={{
                  width: step === 1 ? "33%" : step === 2 ? "66%" : "100%",
                }}
                className="h-full bg-black rounded-full transition-all duration-500 ease-in-out relative"
              >
                <div
                  className="absolute inset-0 w-full h-full opacity-30"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,0.5) 5px, rgba(255,255,255,0.5) 10px)",
                  }}
                ></div>
              </motion.div>
            </div>
            <div className="flex justify-between mt-2 font-mono text-xs font-bold">
              <span>PRODUCT & DETAILS</span>
              <span>PAYMENT</span>
              <span>DONE</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {/* ═══ STEP 1: Product Selection + User Details ═══ */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col"
              >
                <div className="bg-orange-100 border-2 border-black p-4 rounded-xl mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <p className="font-bold text-sm">
                    🛍️ PICK YOUR MERCH AND FILL IN YOUR DETAILS!
                  </p>
                </div>

                <div className="space-y-5">
                  {/* Product selector (if multiple items) */}
                  {ALL_MERCH.length > 1 && (
                    <div>
                      <Label className={labelStyles}>Select Product</Label>
                      <div className="flex gap-2 flex-wrap">
                        {ALL_MERCH.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleItemChange(item)}
                            className={`px-4 py-2 rounded-lg border-2 border-black text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                              selectedItem.id === item.id
                                ? "bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]"
                                : "bg-white text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5"
                            }`}
                          >
                            {item.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Selected product summary */}
                  <div className="bg-zinc-50 border-2 border-black rounded-xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex gap-4 items-start">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-black shrink-0 bg-white">
                        <Image
                          src={
                            selectedItem.colorImages?.[selectedColor]?.[0] ??
                            selectedItem.images[0]
                          }
                          alt={selectedItem.name}
                          fill
                          className="object-contain"
                          sizes="80px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                          {selectedItem.categoryLabel}
                        </p>
                        <h3 className="text-lg font-black text-black leading-tight">
                          {selectedItem.name}
                        </h3>
                        <p className="text-xs text-gray-600 leading-relaxed mt-1">
                          {selectedItem.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xl font-black text-black">
                            ₹{selectedItem.price}
                          </span>
                          {selectedItem.originalPrice && (
                            <>
                              <span className="text-sm text-gray-400 line-through">
                                ₹{selectedItem.originalPrice}
                              </span>
                              <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full border border-green-300">
                                {discount}% OFF
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Size selector */}
                  {selectedItem.sizes && selectedItem.sizes.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <Label className={labelStyles + " mb-0"}>Size</Label>
                        <button
                          type="button"
                          onClick={() => setShowSizeChart(true)}
                          className="text-[10px] font-black uppercase text-orange-600 hover:text-orange-700 transition-colors flex items-center gap-1"
                        >
                          <span className="text-sm">📏</span> Size Chart
                        </button>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {selectedItem.sizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`w-10 h-10 text-sm font-bold rounded-lg border-2 transition-all duration-150 ${
                              selectedSize === size
                                ? "bg-black text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]"
                                : "bg-white text-black border-gray-300 hover:border-black"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Color selector */}
                  {selectedItem.colors && selectedItem.colors.length > 0 && (
                    <div>
                      <Label className={labelStyles}>
                        Color — {selectedColor}
                      </Label>
                      <div className="flex gap-2">
                        {selectedItem.colors.map((color) => (
                          <button
                            key={color.name}
                            onClick={() => setSelectedColor(color.name)}
                            title={color.name}
                            className={`w-8 h-8 rounded-full border-2 transition-all duration-150 ${
                              selectedColor === color.name
                                ? "border-black scale-110 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]"
                                : "border-gray-300 hover:border-black"
                            }`}
                            style={{ backgroundColor: color.hex }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quantity */}
                  <div>
                    <Label className={labelStyles}>Quantity</Label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 bg-white rounded-lg border-2 border-black font-bold text-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                      >
                        −
                      </button>
                      <span className="text-xl font-black w-8 text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(5, quantity + 1))}
                        className="w-10 h-10 bg-white rounded-lg border-2 border-black font-bold text-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Custom Text for Print */}
                  <div>
                    <Label className={labelStyles}>
                      Custom Text for Print (Optional)
                    </Label>
                    <Input
                      value={customText}
                      onChange={(e) =>
                        setCustomText(e.target.value.slice(0, 20))
                      }
                      className={inputStyles}
                      placeholder="e.g. YOUR NAME"
                      maxLength={20}
                    />
                    <p className="text-xs text-zinc-500 mt-1">
                      Up to 20 characters — printed on the back of your tee
                    </p>
                  </div>

                  {/* Referral */}
                  <div>
                    <Label className={labelStyles}>
                      Referral Booking ID (Optional)
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        value={referralId}
                        onChange={(e) => {
                          setReferralId(e.target.value.toUpperCase());
                          setReferralValid(null);
                          setReferralMsg("");
                          setDiscountAmount(0);
                        }}
                        className={`flex-1 ${inputStyles}`}
                        placeholder="SGF26-XXXXXXXX"
                      />
                      <button
                        onClick={handleCheckReferral}
                        disabled={referralChecking || !referralId.trim()}
                        className="px-4 py-2 bg-black text-white rounded-lg border-2 border-black font-bold text-xs uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all disabled:opacity-40"
                      >
                        {referralChecking ? "..." : "Apply"}
                      </button>
                    </div>
                    {referralMsg && (
                      <p
                        className={`text-xs font-bold mt-1 ${
                          referralValid
                            ? "text-green-700 bg-green-50 px-2 py-1 border border-green-300 rounded"
                            : "text-red-600 bg-red-50 px-2 py-1 border border-red-300 rounded"
                        }`}
                      >
                        {referralMsg}
                      </p>
                    )}
                  </div>

                  {/* Divider */}
                  <hr className="border-t-2 border-dashed border-zinc-300" />

                  {/* User details */}
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full">
                      <Label className={labelStyles}>Full Name</Label>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={inputStyles}
                        placeholder="JOHN DOE"
                      />
                    </div>
                    <div className="w-full">
                      <Label className={labelStyles}>Email</Label>
                      <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        className={inputStyles}
                        placeholder="JOHN@EXAMPLE.COM"
                      />
                    </div>
                  </div>

                  <div className="w-full">
                    <Label className={labelStyles}>Gender</Label>
                    <div className="flex gap-4">
                      {["Male", "Female"].map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setGender(g)}
                          className={`flex-1 py-3 rounded-lg border-2 border-black font-bold uppercase transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                            gender === g
                              ? "bg-black text-white"
                              : "bg-white text-black"
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full">
                      <Label className={labelStyles}>Phone (10 digits)</Label>
                      <Input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={inputStyles}
                        placeholder="9876543210"
                      />
                    </div>
                    <div className="w-full">
                      <Label className={labelStyles}>College (Optional)</Label>
                      <Input
                        value={college}
                        onChange={(e) => setCollege(e.target.value)}
                        className={inputStyles}
                        placeholder="INSTITUTE OF TECHNOLOGY"
                      />
                    </div>
                  </div>

                  {/* Order summary line */}
                  <div className="bg-zinc-100 border-2 border-black rounded-xl p-4">
                    <div className="flex justify-between items-center text-sm font-bold">
                      <span>
                        {selectedItem.name}{" "}
                        {selectedSize && `(${selectedSize})`}{" "}
                        {selectedColor && `/ ${selectedColor}`} × {quantity}
                      </span>
                      <span>₹{subtotal}</span>
                    </div>
                    {customText.trim() && (
                      <p className="text-xs text-zinc-500 mt-1">
                        Print: &quot;{customText.trim()}&quot;
                      </p>
                    )}
                    {discountAmount > 0 && (
                      <div className="flex justify-between items-center text-sm text-green-700 font-bold mt-1">
                        <span>Referral Discount</span>
                        <span>−₹{discountAmount}</span>
                      </div>
                    )}
                    <hr className="my-2 border-black" />
                    <div className="flex justify-between items-center text-lg font-black">
                      <span>TOTAL</span>
                      <span>₹{totalAmount}</span>
                    </div>
                  </div>

                  {error && (
                    <p className="text-red-600 font-bold text-sm bg-red-50 p-2 border-l-4 border-red-600">
                      {error}
                    </p>
                  )}

                  <Button
                    onClick={handleContinueToPayment}
                    disabled={!selectedItem.inStock}
                    className="w-full bg-black text-white font-black text-lg py-6 rounded-xl border-2 border-black shadow-[6px_6px_0px_0px_#f97316] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#f97316] hover:bg-zinc-900 transition-all active:shadow-none disabled:opacity-50"
                  >
                    {selectedItem.inStock
                      ? "CONTINUE TO PAYMENT →"
                      : "SOLD OUT"}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* ═══ STEP 2: Payment (QR + UTR) ═══ */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col"
              >
                <button
                  onClick={() => {
                    setStep(1);
                    setError(null);
                  }}
                  className="text-zinc-500 font-bold text-xs uppercase hover:text-black mb-4 flex items-center gap-1"
                >
                  ← Edit Details
                </button>

                <div className="bg-zinc-100 border-2 border-black p-4 rounded-xl mb-6">
                  <p className="font-bold text-sm text-zinc-700">
                    PAYING FOR: {selectedItem.name}{" "}
                    {selectedSize && `(${selectedSize})`}{" "}
                    {selectedColor && `/ ${selectedColor}`} × {quantity}
                  </p>
                  <p className="text-3xl font-black text-black mt-1">
                    ₹{totalAmount}
                  </p>
                  {discountAmount > 0 && (
                    <p className="text-xs font-bold text-green-700 mt-1">
                      Includes ₹{discountAmount} referral discount
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-center mb-6">
                  <div className="relative w-48 h-48 border-4 border-black rounded-xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-4">
                    <Image
                      src="https://pub-7bb925c121d140598e02eb321a90257a.r2.dev/qrcode.png"
                      alt="Payment QR Code"
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <p className="text-sm font-bold text-center text-zinc-600 max-w-xs">
                    Scan this QR code with any UPI app to pay ₹{totalAmount}.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className={labelStyles}>
                      Enter Transaction / UTR ID
                    </Label>
                    <Input
                      value={utrId}
                      onChange={(e) => setUtrId(e.target.value)}
                      className={inputStyles}
                      placeholder="Enter 12-digit UTR ID"
                    />
                    <p className="text-xs text-zinc-500 mt-1">
                      Usually starts with banking ref no. or &apos;UPI...&apos;
                    </p>
                  </div>

                  {error && (
                    <p className="text-red-600 font-bold text-sm bg-red-50 p-2 border-l-4 border-red-600">
                      {error}
                    </p>
                  )}

                  <Button
                    className="w-full bg-green-500 text-black font-black text-lg py-6 rounded-xl border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-green-400 transition-all active:shadow-none disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled={isLoading || !utrId}
                    onClick={handleSubmitPayment}
                  >
                    {isLoading ? "SUBMITTING..." : "SUBMIT PAYMENT DETAILS →"}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* ═══ STEP 3: Success ═══ */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="flex-1 flex flex-col items-center justify-center text-center h-full"
              >
                <div className="mb-6 relative">
                  <div className="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-50"></div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    className="relative w-28 h-28 bg-green-400 border-4 border-black rounded-full flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <span className="text-5xl">🛍️</span>
                  </motion.div>
                </div>

                <h2 className="text-4xl sm:text-5xl font-black text-black tracking-tighter mb-4 uppercase">
                  Order Placed!
                </h2>

                {orderNumber && (
                  <div className="bg-zinc-100 border-2 border-black rounded-xl px-6 py-3 mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <p className="text-xs text-zinc-500 font-bold uppercase">
                      Order Number
                    </p>
                    <p className="text-xl font-black text-black font-mono">
                      {orderNumber}
                    </p>
                  </div>
                )}

                <p className="text-zinc-800 font-bold text-lg mb-6 max-w-md mx-auto leading-relaxed">
                  We'll verify your payment and confirm your order shortly.
                  <span className="block mt-2 text-zinc-600 font-medium text-base">
                    Track your order in the{" "}
                    <Link
                      href="/profile"
                      className="underline font-bold text-black"
                    >
                      My Orders
                    </Link>{" "}
                    section of your profile.
                  </span>
                </p>

                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm mt-4">
                  <Link
                    href="/"
                    className="flex-1 bg-black text-white font-bold py-3 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-zinc-800 transition-all text-center"
                  >
                    RETURN HOME
                  </Link>
                  <Link
                    href="/profile"
                    className="flex-1 bg-white text-black font-bold py-3 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-zinc-50 transition-all text-center"
                  >
                    GO TO PROFILE
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* --- RIGHT SIDE: VISUAL --- */}
        <div className="hidden lg:flex flex-1 bg-orange-100 relative items-center justify-center border-l-4 border-black p-8">
          {/* Decorative Elements */}
          <div className="absolute top-10 right-10 w-16 h-16 bg-yellow-400 border-2 border-black rounded-full flex items-center justify-center font-black text-2xl animate-bounce shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-20">
            🛒
          </div>

          {/* Product Image Display */}
          <div className="relative w-[400px] bg-white p-6 border-4 border-black rounded-xl shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] rotate-1 hover:rotate-0 transition-transform duration-500">
            <ProductImageGallery
              item={selectedItem}
              selectedColor={selectedColor}
            />
            <div className="mt-4 flex items-center justify-between px-1">
              <span className="font-black text-xl tracking-tighter">
                {selectedItem.name}
              </span>
              <span className="font-mono text-xs bg-black text-white px-2 py-1 rounded">
                ₹{selectedItem.price}
              </span>
            </div>
            {/* Tape Effect */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-orange-400/80 rotate-1 border-l-2 border-r-2 border-transparent opacity-80 backdrop-blur-sm"></div>
          </div>

          {/* Background Grid Pattern */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          ></div>
        </div>
      </div>

      <SizeChartModal
        isOpen={showSizeChart}
        onClose={() => setShowSizeChart(false)}
      />
    </div>
  );
}

export default function MerchBooking() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-zinc-950">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <MerchBookingContent />
    </Suspense>
  );
}
