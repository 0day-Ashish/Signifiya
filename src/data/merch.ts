// ============================================================
// SINGLE SOURCE OF TRUTH FOR ALL MERCHANDISE DATA
// ============================================================
// Update merchandise HERE. The MerchSection component on the
// homepage will automatically stay in sync.
// ============================================================

export type MerchItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  /** Original price before discount (optional) */
  originalPrice?: number;
  category: "tshirt" | "hoodie" | "cap" | "combo" | "sticker" | "accessory";
  /** Category display label */
  categoryLabel: string;
  /** Array of image paths (first is main, rest are gallery) */
  images: string[];
  sizes?: string[];
  colors?: { name: string; hex: string }[];
  /** Whether this item is in stock */
  inStock: boolean;
  /** Badge text (e.g., "NEW", "BESTSELLER", "LIMITED") */
  badge?: string;
  /** Badge color class */
  badgeColor?: string;
};

export const MERCH_CATEGORIES = [
  { value: "all", label: "ALL" },

] as const;

export const ALL_MERCH: MerchItem[] = [
  {
    id: 1,
    name: "Signifiya Classic Tee",
    description:
      "Coming Soon! A timeless black t-shirt featuring the vibrant Signifiya logo, made from 100% soft cotton for all-day comfort. Perfect for showing off your Signifiya spirit in style.",
    price: 499,
    originalPrice: 699,
    category: "tshirt",
    categoryLabel: "T-Shirt",
    images: ["/merch/Merch-1.png", "/merch/Merch-2.png", "/merch/Merch-1.png"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "White", hex: "#ffffff" },
      { name: "Black", hex: "#1a1a1a" },
      { name: "Deep Green", hex: "#1b5e20" },
      { name: "Deep Blue", hex: "#0d47a1" },
    ],
    inStock: true,
    badge: "BESTSELLER",
    badgeColor: "bg-yellow-300",
  },
  {
    id: 2,
    name: "Signifiya Polo Tee",
    description:
      "Coming Soon! Elevate your style with the Signifiya Polo — a premium collared tee with embroidered logo detail, crafted from breathable cotton-poly blend. Smart enough for class, cool enough for the fest.",
    price: 599,
    originalPrice: 899,
    category: "tshirt",
    categoryLabel: "Polo T-Shirt",
    images: ["/merch/Merch-1.png", "/merch/Merch-2.png", "/merch/Merch-1.png"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "White", hex: "#ffffff" },
      { name: "Black", hex: "#1a1a1a" },
      { name: "Deep Green", hex: "#1b5e20" },
      { name: "Deep Blue", hex: "#0d47a1" },
    ],
    inStock: true,
    badge: "NEW",
    badgeColor: "bg-green-300",
  },
];
