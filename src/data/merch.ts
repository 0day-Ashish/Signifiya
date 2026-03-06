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
  /** Map of color name to its specific images */
  colorImages?: Record<string, string[]>;
  sizes?: string[];
  colors?: { name: string; hex: string }[];
  /** Whether this item is in stock */
  inStock: boolean;
  /** Badge text (e.g., "NEW", "BESTSELLER", "LIMITED") */
  badge?: string;
  /** Badge color class */
  badgeColor?: string;
};

export const MERCH_CATEGORIES = [{ value: "all", label: "ALL" }] as const;

export const ALL_MERCH: MerchItem[] = [
  {
    id: 1,
    name: "Signifiya Classic Tee",
    description:
      "A timeless t-shirt featuring the vibrant Signifiya logo, made from 100% soft cotton for all-day comfort. Perfect for showing off your Signifiya spirit in style.",
    price: 499,
    originalPrice: 699,
    category: "tshirt",
    categoryLabel: "T-Shirt",
    images: [
      "/merch/blue_tshirt_front.jpeg",
      "/merch/blue_tshirt_back.jpeg",
      "/merch/purple_tshirt_front.jpeg",
      "/merch/purple_tshirt_back.jpeg",
      "/merch/green_tshirt_front.jpeg",
      "/merch/green_tshirt_back.jpeg",
      "/merch/orange_tshirt_front.jpeg",
      "/merch/orange_tshirt_back.jpeg",
    ],
    colorImages: {
      Blue: ["/merch/blue_tshirt_front.jpeg", "/merch/blue_tshirt_back.jpeg"],
      Purple: [
        "/merch/purple_tshirt_front.jpeg",
        "/merch/purple_tshirt_back.jpeg",
      ],
      Orange: [
        "/merch/orange_tshirt_front.jpeg",
        "/merch/orange_tshirt_back.jpeg",
      ],
      Green: [
        "/merch/green_tshirt_front.jpeg",
        "/merch/green_tshirt_back.jpeg",
      ],
    },
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Blue", hex: "#0d47a1" },
      { name: "Purple", hex: "#6a0dad" },
      { name: "Orange", hex: "#ff5722" },
      { name: "Green", hex: "#388e3c" },
    ],
    inStock: true,
    badge: "BESTSELLER",
    badgeColor: "bg-yellow-300",
  },
  {
    id: 2,
    name: "Signifiya Polo Tee",
    description:
      "Elevate your style with the Signifiya Polo — a premium collared tee with embroidered logo detail, crafted from breathable cotton-poly blend. Smart enough for class, cool enough for the fest.",
    price: 599,
    originalPrice: 899,
    category: "tshirt",
    categoryLabel: "Polo T-Shirt",
    images: [
      "/merch/blue_polo_front.jpg",
      "/merch/blue_polo_back.jpg",
      "/merch/purple_polo_front.png",
      "/merch/purple_polo_back.png",
      "/merch/green_polo_front.jpg",
      "/merch/green_polo_back.jpg",
      "/merch/orange_polo_front.png",
      "/merch/orange_polo_back.jpg",
    ],
    colorImages: {
      Blue: ["/merch/blue_polo_front.jpg", "/merch/blue_polo_back.jpg"],
      Purple: ["/merch/purple_polo_front.png", "/merch/purple_polo_back.png"],
      Green: ["/merch/green_polo_front.jpg", "/merch/green_polo_back.jpg"],
      Orange: ["/merch/orange_polo_front.png", "/merch/orange_polo_back.jpg"],
    },
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Blue", hex: "#0d47a1" },
      { name: "Purple", hex: "#6a0dad" },
      { name: "Orange", hex: "#ff5722" },
      { name: "Green", hex: "#388e3c" },
    ],
    inStock: true,
    badge: "NEW",
    badgeColor: "bg-green-300",
  },
];
