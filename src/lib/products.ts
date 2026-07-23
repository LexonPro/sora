export interface Product {
  id: string;
  name: string;
  drop: string;
  category: "hoodies" | "tees" | "jackets" | "accessories";
  price: number;
  originalPrice: number;
  description: string;
  fabric: string;
  gsm: string;
  fit: string;
  colors: { name: string; hex: string }[];
  tag: string;
  image: string;
  modelType: "hoodie" | "tshirt" | "jacket" | "pant";
}

export const PRODUCTS: Product[] = [
  {
    id: "drop-001-hoodie",
    name: "SHADOW REALM HOODIE",
    drop: "DROP 001",
    category: "hoodies",
    price: 4499,
    originalPrice: 5999,
    description: "Heavyweight technical hoodie featuring cyber-anime embroidery, extended thumbhole cuffs, and double-lined hood.",
    fabric: "100% French Terry Cotton",
    gsm: "450 GSM",
    fit: "Oversized Cyber Fit",
    colors: [
      { name: "Matte Black", hex: "#0d0d0d" },
      { name: "Electric Purple", hex: "#8b5cf6" },
      { name: "Chrome Silver", hex: "#e2e8f0" }
    ],
    tag: "🔥 BESTSELLER",
    image: "/products/hoodie-black.jpg",
    modelType: "hoodie"
  },
  {
    id: "drop-001-tee",
    name: "CYBERPUNK NEON TEE",
    drop: "DROP 001",
    category: "tees",
    price: 2499,
    originalPrice: 3299,
    description: "High-density puff printed graphic tee inspired by futuristic Tokyo neon aesthetics.",
    fabric: "Comb-Spun Premium Cotton",
    gsm: "280 GSM",
    fit: "Boxy Street Fit",
    colors: [
      { name: "Void Black", hex: "#050505" },
      { name: "Neon Cyan", hex: "#06b6d4" }
    ],
    tag: "LIMITED EDITION",
    image: "/products/tee-neon.jpg",
    modelType: "tshirt"
  },
  {
    id: "drop-002-jacket",
    name: "ASTRAL BOMBER JACKET",
    drop: "DROP 002",
    category: "jackets",
    price: 6999,
    originalPrice: 8999,
    description: "Water-resistant utility bomber with magnetic tactical buckles and holographic sleeve patch.",
    fabric: "316L Technical Nylon Shell",
    gsm: "380 GSM",
    fit: "Tactical Flight Fit",
    colors: [
      { name: "Deep Charcoal", hex: "#1a1a1a" },
      { name: "Military Olive", hex: "#3f4a3c" }
    ],
    tag: "PREMIUM UTILITY",
    image: "/products/jacket-astral.jpg",
    modelType: "jacket"
  },
  {
    id: "drop-002-cargo",
    name: "VOID WALKER CARGO",
    drop: "DROP 002",
    category: "accessories",
    price: 3999,
    originalPrice: 4999,
    description: "Multi-pocket technical cargo pants with adjustable ankle straps and key D-ring.",
    fabric: "Ripstop Cotton Stretch",
    gsm: "320 GSM",
    fit: "Tapered Cargo",
    colors: [
      { name: "Stealth Black", hex: "#111111" }
    ],
    tag: "DROP LIVE",
    image: "/products/cargo-void.jpg",
    modelType: "pant"
  }
];
