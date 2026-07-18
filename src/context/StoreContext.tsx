"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Review {
  name: string;
  rating: number;
  text: string;
  date: string;
  verified: boolean;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  category: string;
  tag: string;
  description: string;
  details: string[];
  washInstructions: string;
  fabric: string;
  sizes: string[];
  stock: number;
  rating: number;
  reviews: Review[];
  modelDetails: string;
  estimatedDelivery: string;
  completeTheLook: string[]; // Product IDs
  color: string;
}

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  address: {
    fullName: string;
    street: string;
    city: string;
    zipCode: string;
    phone: string;
  };
  status: "ordered" | "packed" | "shipped" | "out-for-delivery" | "delivered";
  paymentMethod: string;
  trackingNumber: string;
}

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  rewardPoints: number;
  referralCode: string;
  coupons: { [code: string]: number };
  activeCoupon: string | null;
  activeDiscount: number; // Percentage
  addToCart: (product: Product, size: string, quantity?: number) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateCartQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  placeOrder: (address: Order["address"], paymentMethod: string) => Order;
  // Admin Methods
  updateStock: (productId: string, newStock: number) => void;
  updateProductPrice: (productId: string, newPrice: number) => void;
  updateOrderStatus: (orderId: string, newStatus: Order["status"]) => void;
  addCoupon: (code: string, discount: number) => void;
  addProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const initialProducts: Product[] = [
  {
    id: "neo-tokyo",
    name: "NEO-TOKYO HOODIE",
    price: 120,
    originalPrice: 150,
    category: "Anime Collection",
    tag: "Limited Edition",
    color: "#ff007f", // Neon Magenta
    description: "Premium heavy-weight fleece hoodie featuring high-density cybernetic embroidery and glow-in-the-dark graphic elements. Inspired by the neon corridors of cyber-punk Tokyo.",
    details: [
      "450 GSM French Terry Cotton",
      "Glow-in-the-dark premium vinyl decals",
      "Double-lined hood with custom silver metal eyelets",
      "Oversized drop-shoulder boxy fit"
    ],
    washInstructions: "Machine wash cold inside out, gentle cycle. Hang dry only. Do not iron print.",
    fabric: "100% Organic French Terry Cotton",
    sizes: ["S", "M", "L", "XL"],
    stock: 8,
    rating: 4.9,
    modelDetails: "Model is 6'1\" (185 cm) and wearing size L",
    estimatedDelivery: "Ships in 2-4 business days",
    completeTheLook: ["seoul-tech-cargo", "cyberpunk-beanie"],
    reviews: [
      { name: "Siddharth R.", rating: 5, text: "The fleece quality is insane. Weighs like a blanket and the glow embroidery is super crisp.", date: "July 12, 2026", verified: true },
      { name: "Yuki K.", rating: 5, text: "Excellent oversized cut. Fits exactly like Represent hoodies.", date: "July 08, 2026", verified: true }
    ]
  },
  {
    id: "seoul-tech-cargo",
    name: "SEOUL TECH CARGOS",
    price: 95,
    originalPrice: 120,
    category: "Korean Street",
    tag: "Trending",
    color: "#4f46e5", // Electric Blue
    description: "Multi-pocket technical cargo pants designed for utility and aesthetic draping. Equipped with modular straps and quick-adjust magnetic buckles.",
    details: [
      "Water-repellent technical nylon blend",
      "6-pocket layout with dual zippered compartments",
      "Adjustable ankle cuffs with metal toggle locks",
      "Ergonomic knee darts for movement flexibility"
    ],
    washInstructions: "Cold wash separately. Do not bleach. Tumble dry low.",
    fabric: "70% Cotton, 30% Cordura Nylon",
    sizes: ["M", "L", "XL"],
    stock: 12,
    rating: 4.7,
    modelDetails: "Model is 5'11\" (180 cm) and wearing size M",
    estimatedDelivery: "Ships in 2-4 business days",
    completeTheLook: ["neo-tokyo", "gravity-puffer"],
    reviews: [
      { name: "Jayesh M.", rating: 4, text: "Super functional straps. A bit long but the ankle toggles fix it perfectly.", date: "June 25, 2026", verified: true }
    ]
  },
  {
    id: "kaiju-oversized",
    name: "KAIJU OVERSIZED TEE",
    price: 60,
    originalPrice: 75,
    category: "Oversized",
    tag: "Best Seller",
    color: "#a855f7", // Purple Accent
    description: "Heavy wash vintage tee showcasing original hand-drawn anime Kaiju graphics. Pre-shrunk and custom washed for a soft, worn-in luxury handfeel.",
    details: [
      "280 GSM luxury combed cotton",
      "Distressed enzyme stone washed finish",
      "High-definition screen print on chest and back",
      "Thick ribbed collar (1.2 inches)"
    ],
    washInstructions: "Cold wash inside out. Tumble dry extra low or line dry.",
    fabric: "100% Combed Ring-Spun Cotton",
    sizes: ["S", "M", "L", "XL"],
    stock: 5,
    rating: 4.8,
    modelDetails: "Model is 6'2\" (188 cm) and wearing size XL",
    estimatedDelivery: "Ships in 1-3 business days",
    completeTheLook: ["silver-chain", "cyberpunk-beanie"],
    reviews: [
      { name: "Rohit P.", rating: 5, text: "Thick collar, heavy drop, exactly what you want in a luxury blank tee.", date: "July 01, 2026", verified: true }
    ]
  },
  {
    id: "silver-chain",
    name: "SORA UTILITY CHAIN",
    price: 45,
    originalPrice: 55,
    category: "Accessories",
    tag: "New Drop",
    color: "#bfc3c9", // Silver
    description: "Modern modular lock chain featuring double-link layout and an engraved SORA emblem clasp. Designed to be worn as a necklace or pants accessory.",
    details: [
      "Solid surgical-grade 316L stainless steel",
      "Scratch-resistant polished silver finish",
      "Engraved security lock clasp design",
      "Total length: 50 cm / 20 inches"
    ],
    washInstructions: "Wipe clean with microfiber cloth. Avoid direct chemicals or perfumes.",
    fabric: "100% Stainless Steel (Hypoallergenic)",
    sizes: ["OS"],
    stock: 25,
    rating: 4.6,
    modelDetails: "One size fits all",
    estimatedDelivery: "Ships in 1-3 business days",
    completeTheLook: ["kaiju-oversized", "seoul-tech-cargo"],
    reviews: [
      { name: "Karan S.", rating: 4, text: "Good weight, locking mechanism feels solid. Doesn't tarnish at all.", date: "July 14, 2026", verified: true }
    ]
  },
  {
    id: "gravity-puffer",
    name: "GRAVITY PUFFER JACKET",
    price: 180,
    originalPrice: 220,
    category: "Oversized",
    tag: "Only 10 Left",
    color: "#00d2ff", // Cyan Blue
    description: "Futuristic crop-length puffer jacket insulated with high-grade eco-down. Designed with semi-translucent material layers that reflect light dynamically.",
    details: [
      "Waterproof ripstop nylon shell",
      "700-fill simulated sustainable eco-down insulation",
      "Concealed heavy YKK zippers and magnetic storm flap",
      "Adjustable bungee cord hem for customizable shape"
    ],
    washInstructions: "Professional dry clean only.",
    fabric: "Insulated Translucent Ripstop Shell",
    sizes: ["S", "M", "L"],
    stock: 3,
    rating: 5.0,
    modelDetails: "Model is 5'10\" (178 cm) and wearing size S",
    estimatedDelivery: "Ships in 3-5 business days",
    completeTheLook: ["seoul-tech-cargo", "silver-chain"],
    reviews: [
      { name: "Aditya V.", rating: 5, text: "Absolute showstopper. The material looks like liquid glass under flash.", date: "July 15, 2026", verified: true }
    ]
  },
  {
    id: "cyberpunk-beanie",
    name: "REFLECTIVE BEANIE",
    price: 35,
    originalPrice: 45,
    category: "Accessories",
    tag: "Trending",
    color: "#00ffcc", // Neon Green-blue
    description: "Double-layer ribbed knit beanie stitched with high-visibility reflective thread throughout the fabric.",
    details: [
      "Stitched reflective threading inside wool blend",
      "Double cuff adjustable fold",
      "Woven tech label patch on front",
      "Snug high-crown shape"
    ],
    washInstructions: "Hand wash cold. Flat dry only.",
    fabric: "60% Acrylic, 40% Wool with reflective fibers",
    sizes: ["OS"],
    stock: 18,
    rating: 4.5,
    modelDetails: "One size fits all",
    estimatedDelivery: "Ships in 1-3 days",
    completeTheLook: ["neo-tokyo"],
    reviews: [
      { name: "Nikita S.", rating: 5, text: "Comfy and fits well. Reflects beautifully in photos.", date: "July 10, 2026", verified: true }
    ]
  }
];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [rewardPoints, setRewardPoints] = useState<number>(250);
  const [referralCode] = useState<string>("SORA-WORLD-89X");
  const [coupons, setCoupons] = useState<{ [code: string]: number }>({
    SORA20: 20,
    LIMITLESS: 15,
    STREET30: 30,
  });
  const [activeCoupon, setActiveCoupon] = useState<string | null>(null);
  const [activeDiscount, setActiveDiscount] = useState<number>(0);

  // Load from local storage
  useEffect(() => {
    const storedProducts = localStorage.getItem("sora_products");
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      setProducts(initialProducts);
      localStorage.setItem("sora_products", JSON.stringify(initialProducts));
    }

    const storedCart = localStorage.getItem("sora_cart");
    if (storedCart) setCart(JSON.parse(storedCart));

    const storedWishlist = localStorage.getItem("sora_wishlist");
    if (storedWishlist) setWishlist(JSON.parse(storedWishlist));

    const storedOrders = localStorage.getItem("sora_orders");
    if (storedOrders) setOrders(JSON.parse(storedOrders));

    const storedPoints = localStorage.getItem("sora_points");
    if (storedPoints) setRewardPoints(parseInt(storedPoints));
  }, []);

  // Sync to local storage
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("sora_cart", JSON.stringify(newCart));
  };

  const saveWishlist = (newWishlist: string[]) => {
    setWishlist(newWishlist);
    localStorage.setItem("sora_wishlist", JSON.stringify(newWishlist));
  };

  const saveOrders = (newOrders: Order[]) => {
    setOrders(newOrders);
    localStorage.setItem("sora_orders", JSON.stringify(newOrders));
  };

  const addToCart = (product: Product, size: string, quantity: number = 1) => {
    const existingIndex = cart.findIndex(
      (item) => item.product.id === product.id && item.size === size
    );

    let updatedCart = [...cart];
    if (existingIndex > -1) {
      updatedCart[existingIndex].quantity += quantity;
    } else {
      updatedCart.push({ product, size, quantity });
    }
    saveCart(updatedCart);

    // Dynamic stock depletion simulation locally
    const updatedProducts = products.map((p) => {
      if (p.id === product.id) {
        return { ...p, stock: Math.max(0, p.stock - quantity) };
      }
      return p;
    });
    setProducts(updatedProducts);
    localStorage.setItem("sora_products", JSON.stringify(updatedProducts));
  };

  const removeFromCart = (productId: string, size: string) => {
    const item = cart.find((i) => i.product.id === productId && i.size === size);
    if (!item) return;

    const updatedCart = cart.filter(
      (i) => !(i.product.id === productId && i.size === size)
    );
    saveCart(updatedCart);

    // Replenish stock
    const updatedProducts = products.map((p) => {
      if (p.id === productId) {
        return { ...p, stock: p.stock + item.quantity };
      }
      return p;
    });
    setProducts(updatedProducts);
    localStorage.setItem("sora_products", JSON.stringify(updatedProducts));
  };

  const updateCartQuantity = (productId: string, size: string, quantity: number) => {
    const itemIndex = cart.findIndex((i) => i.product.id === productId && i.size === size);
    if (itemIndex === -1) return;

    const diff = quantity - cart[itemIndex].quantity;
    let updatedCart = [...cart];
    updatedCart[itemIndex].quantity = quantity;
    saveCart(updatedCart);

    // Adjust stock
    const updatedProducts = products.map((p) => {
      if (p.id === productId) {
        return { ...p, stock: Math.max(0, p.stock - diff) };
      }
      return p;
    });
    setProducts(updatedProducts);
    localStorage.setItem("sora_products", JSON.stringify(updatedProducts));
  };

  const clearCart = () => {
    saveCart([]);
  };

  const toggleWishlist = (productId: string) => {
    let updatedWishlist = [...wishlist];
    if (wishlist.includes(productId)) {
      updatedWishlist = updatedWishlist.filter((id) => id !== productId);
    } else {
      updatedWishlist.push(productId);
    }
    saveWishlist(updatedWishlist);
  };

  const applyCoupon = (code: string): boolean => {
    const normalizedCode = code.toUpperCase();
    if (coupons[normalizedCode]) {
      setActiveCoupon(normalizedCode);
      setActiveDiscount(coupons[normalizedCode]);
      return true;
    }
    return false;
  };

  const removeCoupon = () => {
    setActiveCoupon(null);
    setActiveDiscount(0);
  };

  const placeOrder = (address: Order["address"], paymentMethod: string): Order => {
    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const discount = Math.round((subtotal * activeDiscount) / 100);
    const total = subtotal - discount;

    const newOrder: Order = {
      id: "SORA-" + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      }),
      items: [...cart],
      subtotal,
      discount,
      total,
      address,
      status: "ordered",
      paymentMethod,
      trackingNumber: "SR-" + Math.floor(100000000 + Math.random() * 900000000) + "-IN"
    };

    const updatedOrders = [newOrder, ...orders];
    saveOrders(updatedOrders);
    
    // Earn reward points (10% of total spent)
    const pointsEarned = Math.floor(total * 0.1);
    const newPoints = rewardPoints + pointsEarned;
    setRewardPoints(newPoints);
    localStorage.setItem("sora_points", newPoints.toString());

    // Clear cart after purchase
    saveCart([]);
    removeCoupon();

    return newOrder;
  };

  // ADMIN DASHBOARD SIMULATION METHODS
  const updateStock = (productId: string, newStock: number) => {
    const updatedProducts = products.map((p) => {
      if (p.id === productId) {
        return { ...p, stock: newStock };
      }
      return p;
    });
    setProducts(updatedProducts);
    localStorage.setItem("sora_products", JSON.stringify(updatedProducts));
  };

  const updateProductPrice = (productId: string, newPrice: number) => {
    const updatedProducts = products.map((p) => {
      if (p.id === productId) {
        return { ...p, price: newPrice };
      }
      return p;
    });
    setProducts(updatedProducts);
    localStorage.setItem("sora_products", JSON.stringify(updatedProducts));
  };

  const updateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    const updatedOrders = orders.map((o) => {
      if (o.id === orderId) {
        return { ...o, status: newStatus };
      }
      return o;
    });
    saveOrders(updatedOrders);
  };

  const addCoupon = (code: string, discount: number) => {
    const updatedCoupons = { ...coupons, [code.toUpperCase()]: discount };
    setCoupons(updatedCoupons);
  };

  const addProduct = (product: Product) => {
    const updatedProducts = [product, ...products];
    setProducts(updatedProducts);
    localStorage.setItem("sora_products", JSON.stringify(updatedProducts));
  };

  const deleteProduct = (productId: string) => {
    const updatedProducts = products.filter((p) => p.id !== productId);
    setProducts(updatedProducts);
    localStorage.setItem("sora_products", JSON.stringify(updatedProducts));
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        cart,
        wishlist,
        orders,
        rewardPoints,
        referralCode,
        coupons,
        activeCoupon,
        activeDiscount,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        applyCoupon,
        removeCoupon,
        placeOrder,
        updateStock,
        updateProductPrice,
        updateOrderStatus,
        addCoupon,
        addProduct,
        deleteProduct
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
