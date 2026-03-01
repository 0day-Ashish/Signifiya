"use client";

import { useState } from "react";
import Image from "next/image";
import localFont from "next/font/local";
import { motion, AnimatePresence } from "motion/react";
import FadeIn from "./FadeIn";
import { ALL_MERCH, type MerchItem } from "@/data/merch";

const gilton = localFont({ src: "../../public/fonts/GiltonRegular.otf" });
const softura = localFont({ src: "../../public/fonts/Softura-Demo.otf" });

// Featured merch items for tab selector
const MERCH_TABS = ALL_MERCH.slice(0, 2);

// ─── Image Gallery for a single product ─────────────────────
function ProductImageGallery({ item }: { item: MerchItem }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      {/* Main Image */}
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden border-3 border-black bg-gray-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0"
          >
            <Image
              src={item.images[activeIndex]}
              alt={`${item.name} - view ${activeIndex + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 500px"
            />
          </motion.div>
        </AnimatePresence>

        {/* Badge */}
        {item.badge && (
          <div
            className={`absolute top-3 left-3 ${item.badgeColor || "bg-yellow-300"} text-black text-[10px] font-black uppercase px-2.5 py-1 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] z-10`}
          >
            {item.badge}
          </div>
        )}

        {/* Out of stock overlay */}
        {!item.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <span
              className={`text-white text-lg font-bold uppercase tracking-wider ${gilton.className}`}
            >
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {item.images.length > 1 && (
        <div className="flex gap-2 justify-center">
          {item.images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all duration-150 shrink-0 ${
                activeIndex === i
                  ? "border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] scale-105"
                  : "border-gray-300 opacity-60 hover:opacity-90"
              }`}
            >
              <Image
                src={img}
                alt={`${item.name} thumbnail ${i + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main MerchSection (Tabbed Featured Products) ────────────
export default function MerchSection() {
  const [activeTab, setActiveTab] = useState(0);
  const item = MERCH_TABS[activeTab] ?? MERCH_TABS[0];

  const [selectedSize, setSelectedSize] = useState<string | null>(
    item.sizes ? item.sizes[1] || item.sizes[0] : null,
  );
  const [selectedColor, setSelectedColor] = useState<string | null>(
    item.colors ? item.colors[0].name : null,
  );

  // Reset size/color when switching tabs
  const handleTabChange = (idx: number) => {
    setActiveTab(idx);
    const next = MERCH_TABS[idx];
    setSelectedSize(next.sizes ? next.sizes[1] || next.sizes[0] : null);
    setSelectedColor(next.colors ? next.colors[0].name : null);
  };

  const discount = item.originalPrice
    ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
    : 0;

  return (
    <section id="merch" className="w-full bg-black pb-3">
      <div className="bg-[#fff3e0] rounded-[2.5rem] p-6 sm:p-12 relative overflow-hidden flex flex-col gap-10 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        {/* Header */}
        <FadeIn>
          <div className="flex flex-col gap-4 text-center">
            <h2
              className={`text-5xl sm:text-7xl text-black uppercase leading-[0.9] ${gilton.className}`}
            >
              Official <span className="italic">Merchandise</span>
            </h2>
            <p
              className={`text-lg sm:text-xl text-gray-600 font-medium max-w-2xl mx-auto ${softura.className}`}
            >
              Grab exclusive Signifiya&apos;26 merch before it&apos;s gone!
            </p>
          </div>
        </FadeIn>

        {/* Product Tabs */}
        {MERCH_TABS.length > 1 && (
          <FadeIn delay={100}>
            <div className="flex justify-center">
              <div className="inline-flex bg-white border-2 border-black rounded-xl overflow-hidden shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                {MERCH_TABS.map((tab, idx) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(idx)}
                    className={`px-5 sm:px-8 py-2.5 text-sm sm:text-base font-bold uppercase tracking-wider transition-all duration-150 ${softura.className} ${
                      activeTab === idx
                        ? "bg-black text-white"
                        : "bg-white text-black hover:bg-gray-100"
                    } ${idx > 0 ? "border-l-2 border-black" : ""}`}
                  >
                    {tab.id === 1 ? "Classic Tee" : tab.id === 2 ? "Polo Tee" : tab.name}
                  </button>
                ))}
              </div>
            </div>
          </FadeIn>
        )}

        {/* Product — Side-by-side layout */}
        <FadeIn delay={150}>
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start max-w-5xl mx-auto w-full">
            {/* Left: Image Gallery */}
            <div className="w-full md:w-1/2">
              <ProductImageGallery item={item} />
            </div>

            {/* Right: Product Details */}
            <div className="w-full md:w-1/2 flex flex-col gap-5">
              {/* Category Tag */}
              <span
                className={`text-xs font-bold uppercase tracking-widest text-gray-500 ${softura.className}`}
              >
                {item.categoryLabel}
              </span>

              {/* Name */}
              <h3
                className={`text-3xl sm:text-4xl font-bold text-black leading-tight ${gilton.className}`}
              >
                {item.name}
              </h3>

              {/* Description */}
              <p
                className={`text-base sm:text-lg text-gray-600 leading-relaxed ${softura.className}`}
              >
                {item.description}
              </p>

              {/* Price */}
              <div className="flex items-center gap-3 flex-wrap">
                <span
                  className={`text-3xl sm:text-4xl font-black text-black ${gilton.className}`}
                >
                  ₹{item.price}
                </span>
                {item.originalPrice && (
                  <>
                    <span className="text-lg text-gray-400 line-through">
                      ₹{item.originalPrice}
                    </span>
                    <span className="text-sm font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full border border-green-300">
                      {discount}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Size Selector */}
              {item.sizes && item.sizes.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span
                    className={`text-sm font-bold text-gray-500 uppercase tracking-wider ${softura.className}`}
                  >
                    Size
                  </span>
                  <div className="flex gap-2 flex-wrap">
                    {item.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-11 h-11 text-sm font-bold rounded-xl border-2 transition-all duration-150 ${
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

              {/* Color Selector */}
              {item.colors && item.colors.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span
                    className={`text-sm font-bold text-gray-500 uppercase tracking-wider ${softura.className}`}
                  >
                    Color — {selectedColor}
                  </span>
                  <div className="flex gap-3">
                    {item.colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        title={color.name}
                        className={`w-9 h-9 rounded-full border-2 transition-all duration-150 ${
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

              {/* Book Now Button */}
              <div className="flex flex-col sm:flex-row gap-3 mt-2">
                <a
                  href="/merch"
                  className={`inline-flex items-center justify-center text-center bg-black text-white px-8 py-4 rounded-2xl border-2 border-black font-bold text-base sm:text-lg uppercase tracking-wider shadow-[4px_4px_0px_0px_#f97316] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#f97316] hover:bg-zinc-900 transition-all active:shadow-none ${gilton.className}`}
                >
                  Order Now
                </a>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
