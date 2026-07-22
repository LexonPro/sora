"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useStore, Product } from "@/context/StoreContext";
import { synthAudio } from "@/components/AudioEngine";
import { CustomCursor, BackgroundParticles } from "@/components/Effects";
import { Navbar } from "@/components/Navbar";
import { 
  Heart, ShoppingBag, Truck, RotateCcw, ShieldCheck, 
  Sparkles, Star, MessageSquare, Compass, Info, Check, X 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { products, cart, wishlist, toggleWishlist, addToCart } = useStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState("M");
  const [activeAngle, setActiveAngle] = useState<"front" | "back" | "detail" | "texture" | "orbit">("front");
  const [pincode, setPincode] = useState("");
  const [deliveryMessage, setDeliveryMessage] = useState("");
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [customColor, setCustomColor] = useState("");

  // AI Outfit Builder check states
  const [checkedOutfitItems, setCheckedOutfitItems] = useState<string[]>([]);
  const [outfitSizes, setOutfitSizes] = useState<{ [id: string]: string }>({});

  // Review Form States
  const [newReview, setNewReview] = useState({ name: "", rating: 5, text: "" });
  const [localReviews, setLocalReviews] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      const found = products.find((p) => p.id === id);
      if (found) {
        setProduct(found);
        setSelectedSize(found.sizes[0] || "M");
        setLocalReviews(found.reviews);
        setCustomColor(found.color);
        
        // Initialize AI outfit builder checked items (excluding current product)
        setCheckedOutfitItems(found.completeTheLook);
        
        // Initialize sizes
        const sizeMap: typeof outfitSizes = {};
        found.completeTheLook.forEach(recId => {
          const recP = products.find(p => p.id === recId);
          sizeMap[recId] = recP?.sizes[0] || "M";
        });
        setOutfitSizes(sizeMap);
      }
    }
  }, [id, products]);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center font-mono text-silver text-xs tracking-widest gap-4">
        <div className="w-8 h-8 border-2 border-accent-blue border-t-accent-purple rounded-full animate-spin glow-blue" />
        DECRYPTING PRODUCT SPECIFICATIONS...
      </div>
    );
  }

  // Calculate Outfit total price
  const outfitProducts = products.filter((p) => checkedOutfitItems.includes(p.id));
  const outfitSubtotal = product.price + outfitProducts.reduce((sum, p) => sum + p.price, 0);

  const handleToggleOutfitItem = (itemId: string) => {
    synthAudio.playClick();
    if (checkedOutfitItems.includes(itemId)) {
      setCheckedOutfitItems(checkedOutfitItems.filter((id) => id !== itemId));
    } else {
      setCheckedOutfitItems([...checkedOutfitItems, itemId]);
    }
  };

  const handleOutfitSizeChange = (itemId: string, sz: string) => {
    synthAudio.playClick();
    setOutfitSizes({ ...outfitSizes, [itemId]: sz });
  };

  const handleAddOutfitToCart = () => {
    synthAudio.playChime();
    // Add main product
    addToCart(product, selectedSize, 1);
    // Add check outfit products
    outfitProducts.forEach((item) => {
      addToCart(item, outfitSizes[item.id] || "M", 1);
    });
    alert("Full SORA Outfit composite loaded into your cart!");
  };

  const handleAddToCart = () => {
    synthAudio.playChime();
    addToCart(product, selectedSize, 1);
  };

  const handleBuyNow = () => {
    synthAudio.playChime();
    addToCart(product, selectedSize, 1);
    // Directly scroll or open cart trigger by routing/modifying context
    // For convenience we let user know it's in their cart ready to go
    alert("Item added. Open your shopping bag at top right to complete secure checkout.");
  };

  const handleCheckDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length !== 6 || isNaN(Number(pincode))) {
      synthAudio.playClick();
      setDeliveryMessage("INVALID PINCODE FORMAT. USE 6 DIGITS.");
      return;
    }
    synthAudio.playChime();
    const days = Math.floor(Math.random() * 3) + 2;
    setDeliveryMessage(`DELIVERY ESTIMATE FOR ${pincode}: ${days} BUSINESS DAYS via Priority Air.`);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.text) {
      alert("Please fill in both name and comment.");
      return;
    }
    synthAudio.playChime();
    const reviewObj = {
      name: newReview.name,
      rating: newReview.rating,
      text: newReview.text,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      verified: true
    };
    setLocalReviews([reviewObj, ...localReviews]);
    setNewReview({ name: "", rating: 5, text: "" });
  };

  const similarItems = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#0D0D0D] relative pb-20">
      <CustomCursor />
      <BackgroundParticles />
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-32 grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
        
        {/* LEFT COLUMN: 360 Viewer, HD Angles, Size Guide */}
        <div className="space-y-6">
          
          {/* Main 360 angle viewframe */}
          <div className="glass border border-white/5 rounded-2xl aspect-[4/5] relative flex items-center justify-center p-8 bg-black/40 overflow-hidden group">
            <div
              className="absolute inset-0 opacity-10 transition-colors duration-500"
              style={{
                background: `radial-gradient(circle, ${customColor} 0%, transparent 70%)`,
              }}
            />

            {/* Dynamic Angle Graphic Render (SVG based style) */}
            <svg viewBox="0 0 100 100" className="w-64 h-64 text-white/50 transition-all duration-500">
              {/* HOODIE AND TEES VIEW SCHEMATICS */}
              {!product.category.includes("Cargo") && !product.id.includes("chain") && !product.id.includes("beanie") && (
                <>
                  {activeAngle === "front" && (
                    <g>
                      <path d="M30 30 L40 25 L50 28 L60 25 L70 30 L66 70 L60 70 L50 73 L40 70 L34 70 Z M30 30 L20 48 L28 50 L34 38 M70 30 L80 48 L72 50 L66 38" fill="none" stroke={customColor} strokeWidth="2.5" strokeLinejoin="round" />
                      <path d="M48 28 V40 M52 28 V40" fill="none" stroke="white" strokeWidth="1.2" /> {/* Strings */}
                      <circle cx="50" cy="50" r="3" fill="none" stroke="white" strokeWidth="1" /> {/* Emblem */}
                    </g>
                  )}
                  {activeAngle === "back" && (
                    <g>
                      {/* Back view drops the front neck details and shows the back hood drop */}
                      <path d="M30 30 L40 25 L50 22 L60 25 L70 30 L66 70 L60 70 L50 73 L40 70 L34 70 Z M30 30 L20 48 L28 50 L34 38 M70 30 L80 48 L72 50 L66 38" fill="none" stroke={customColor} strokeWidth="2.5" strokeLinejoin="round" />
                      <path d="M36 26 Q50 46 64 26" fill="none" stroke={customColor} strokeWidth="2.2" /> {/* Back of hood drop */}
                    </g>
                  )}
                  {activeAngle === "detail" && (
                    <g>
                      {/* Close up stitch detail */}
                      <path d="M20 20 H80 V80 H20 Z" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                      <circle cx="50" cy="50" r="16" fill="none" stroke={customColor} strokeWidth="3" /> {/* Stitch ring logo */}
                      <path d="M36 50 H64 M50 36 V64" fill="none" stroke="white" strokeWidth="1.5" strokeDasharray="3 3" />
                      <text x="50" y="76" textAnchor="middle" fill="white" className="font-mono text-[6px] tracking-widest font-bold">STITCH_SPEC</text>
                    </g>
                  )}
                  {activeAngle === "texture" && (
                    <g>
                      {/* Microscopic cotton loops for French Terry weave */}
                      <path d="M10 10 H90 V90 H10 Z" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                      {/* Dense looping matrix */}
                      {[...Array(6)].map((_, r) => (
                        <g key={r} transform={`translate(0, ${r * 12 + 16})`}>
                          {[...Array(8)].map((_, c) => (
                            <path
                              key={c}
                              d="M 5 0 Q 10 -8, 15 0"
                              fill="none"
                              stroke={c % 2 === 0 ? customColor : "#ffffff"}
                              strokeWidth="1.5"
                              transform={`translate(${c * 10 + 12}, 0)`}
                              opacity="0.75"
                            />
                          ))}
                        </g>
                      ))}
                      <text x="50" y="86" textAnchor="middle" fill="white" className="font-mono text-[5px] tracking-widest">450 GSM HEAVY COTTON WEAVE</text>
                    </g>
                  )}
                  {activeAngle === "orbit" && (
                    <g className="animate-spin" style={{ transformOrigin: '50% 50%', animationDuration: '8s' }}>
                      <path d="M30 30 L40 25 L50 28 L60 25 L70 30 L66 70 L60 70 L50 73 L40 70 L34 70 Z" fill="none" stroke={customColor} strokeWidth="2.5" />
                      <ellipse cx="50" cy="50" rx="35" ry="12" fill="none" stroke="white" strokeWidth="0.8" strokeDasharray="3 3" />
                    </g>
                  )}
                </>
              )}

              {/* CARGO PANTS VIEW SCHEMATICS */}
              {product.category.includes("Cargo") && (
                <>
                  {activeAngle === "front" && (
                    <path d="M38 22 L62 22 L68 76 L56 76 L50 38 L44 76 L32 76 Z" fill="none" stroke={customColor} strokeWidth="2.5" strokeLinejoin="round" />
                  )}
                  {activeAngle === "back" && (
                    <g>
                      <path d="M38 22 L62 22 L68 76 L56 76 L50 38 L44 76 L32 76 Z" fill="none" stroke={customColor} strokeWidth="2.5" strokeLinejoin="round" />
                      <rect x="36" y="32" width="6" height="8" fill="none" stroke="white" strokeWidth="1.2" /> {/* Pocket left */}
                      <rect x="58" y="32" width="6" height="8" fill="none" stroke="white" strokeWidth="1.2" /> {/* Pocket right */}
                    </g>
                  )}
                  {activeAngle === "detail" && (
                    <g>
                      <rect x="30" y="30" width="40" height="40" fill="none" stroke="rgba(255,255,255,0.05)" />
                      {/* Pocket Buckle stitch details */}
                      <path d="M35 38 H65 V55 H35 Z" fill="none" stroke={customColor} strokeWidth="2" />
                      <path d="M42 45 H58" stroke="white" strokeWidth="3" />
                      <rect x="47" y="40" width="6" height="18" fill="none" stroke="white" strokeWidth="1.5" />
                    </g>
                  )}
                  {activeAngle === "texture" && (
                    <g>
                      <path d="M10 10 H90 V90 H10 Z" fill="none" stroke="rgba(255,255,255,0.05)" />
                      {/* Heavy nylon twill diagonal ridges */}
                      {[...Array(12)].map((_, i) => (
                        <line
                          key={i}
                          x1={15}
                          y1={i * 6 + 15}
                          x2={i * 6 + 15}
                          y2={15}
                          stroke={i % 2 === 0 ? customColor : "#ffffff"}
                          strokeWidth="1.5"
                          opacity="0.4"
                        />
                      ))}
                      <text x="50" y="86" textAnchor="middle" fill="white" className="font-mono text-[5px] tracking-widest">WATER-REPELLENT CORDURA NYLON</text>
                    </g>
                  )}
                  {activeAngle === "orbit" && (
                    <g className="animate-spin" style={{ transformOrigin: '50% 50%', animationDuration: '8s' }}>
                      <path d="M38 22 L62 22 L68 76 L56 76 L50 38 L44 76 L32 76 Z" fill="none" stroke={customColor} strokeWidth="2.5" strokeLinejoin="round" />
                      <ellipse cx="50" cy="50" rx="35" ry="12" fill="none" stroke="white" strokeWidth="0.8" strokeDasharray="3 3" />
                    </g>
                  )}
                </>
              )}

              {/* ACCESSORIES (CHAIN / BEANIE) SCHEMATICS */}
              {(product.id.includes("chain") || product.id.includes("beanie")) && (
                <>
                  {activeAngle === "front" && (
                    <path d="M50 20 C65 20, 68 55, 50 75 C32 55, 35 20, 50 20 Z" fill="none" stroke={customColor} strokeWidth="2.5" />
                  )}
                  {activeAngle === "back" && (
                    <path d="M50 20 C65 20, 68 55, 50 75 C32 55, 35 20, 50 20 Z" fill="none" stroke={customColor} strokeWidth="2.5" opacity="0.6" />
                  )}
                  {activeAngle === "detail" && (
                    <g>
                      <circle cx="50" cy="50" r="22" fill="none" stroke={customColor} strokeWidth="3.5" />
                      <path d="M38 50 H62 M50 38 V62" fill="none" stroke="white" strokeWidth="2.2" />
                    </g>
                  )}
                  {activeAngle === "texture" && (
                    <g>
                      <path d="M10 10 H90 V90 H10 Z" fill="none" stroke="rgba(255,255,255,0.05)" />
                      {/* Brushed metal coordinates */}
                      <circle cx="50" cy="50" r="15" fill="none" stroke={customColor} strokeWidth="2.5" />
                      <circle cx="50" cy="50" r="25" fill="none" stroke="white" strokeWidth="1" strokeDasharray="4 4" />
                      <text x="50" y="86" textAnchor="middle" fill="white" className="font-mono text-[5px] tracking-widest">SURGICAL STAINLESS STEEL 316L</text>
                    </g>
                  )}
                  {activeAngle === "orbit" && (
                    <g className="animate-spin" style={{ transformOrigin: '50% 50%', animationDuration: '8s' }}>
                      <path d="M50 20 C65 20, 68 55, 50 75 C32 55, 35 20, 50 20 Z" fill="none" stroke={customColor} strokeWidth="2.5" />
                      <ellipse cx="50" cy="50" rx="35" ry="12" fill="none" stroke="white" strokeWidth="0.8" strokeDasharray="3 3" />
                    </g>
                  )}
                </>
              )}
            </svg>

            {/* Angle selectors HUD overlays */}
            <div className="absolute bottom-6 left-4 right-4 flex flex-wrap justify-center gap-1.5 font-mono text-[8px] tracking-wider z-20">
              {[
                { key: "front", label: "01 // FRONT" },
                { key: "back", label: "02 // BACK" },
                { key: "detail", label: "03 // ZOOM" },
                { key: "texture", label: "04 // TEXTURE" },
                { key: "orbit", label: "05 // 3D ROTATE" },
              ].map((ang) => (
                <button
                  key={ang.key}
                  onClick={() => {
                    synthAudio.playClick();
                    setActiveAngle(ang.key as any);
                  }}
                  className={`px-2.5 py-1.5 border rounded cursor-pointer transition-colors ${
                    activeAngle === ang.key
                      ? "border-accent-blue text-white bg-accent-blue/10 glow-blue font-bold"
                      : "border-white/5 text-silver hover:text-white"
                  }`}
                >
                  {ang.label}
                </button>
              ))}
            </div>

            <div className="absolute top-4 left-4 font-mono text-[8px] text-silver/40 tracking-widest">
              SORA SCHEMATIC RENDERING FRAME // 360-VIEW
            </div>
          </div>

          {/* Quick links & size guide buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => {
                synthAudio.playClick();
                setIsSizeGuideOpen(true);
              }}
              className="flex-grow py-3 border border-white/5 hover:border-white/10 bg-white/2 rounded-xl text-center font-mono text-xs text-silver hover:text-white transition-colors cursor-pointer"
            >
              SIZE GUIDE SPECIFICATION
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Copy Details, Sizes, Shipping, ActionCTAs */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Category / Badge */}
            <div className="flex justify-between items-center">
              <span className="font-mono text-xs text-accent-purple tracking-[0.25em] uppercase">
                {product.category}
              </span>
              <span className="bg-accent-blue/15 text-accent-blue font-mono text-[9px] tracking-widest px-2.5 py-1 rounded border border-accent-blue/10 uppercase">
                {product.tag}
              </span>
            </div>

            {/* Name */}
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-wide text-white uppercase font-sans">
              {product.name}
            </h1>

            {/* Pricing */}
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold text-white font-sans">${product.price} USD</span>
              <span className="text-sm font-mono text-silver/40 line-through">${product.originalPrice} USD</span>
            </div>

            {/* Description */}
            <p className="font-mono text-xs text-silver leading-relaxed tracking-wide pt-2">
              {product.description}
            </p>

            {/* Technical Bullet points list */}
            <ul className="font-mono text-[10px] text-silver/80 space-y-2 border-t border-b border-white/5 py-4 my-4">
              {product.details.map((detail, idx) => (
                <li key={idx} className="flex gap-2 items-start">
                  <span className="text-accent-blue font-bold">//</span>
                  <span>{detail.toUpperCase()}</span>
                </li>
              ))}
            </ul>

            {/* Size Selector */}
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between text-silver/60">
                <span>SELECT SIZE</span>
                <span className="text-accent-purple">{product.modelDetails.toUpperCase()}</span>
              </div>
              <div className="flex gap-2">
                {product.sizes.map((sz) => {
                  const isSelected = selectedSize === sz;
                  return (
                    <button
                      key={sz}
                      onClick={() => {
                        synthAudio.playClick();
                        setSelectedSize(sz);
                      }}
                      className={`w-12 h-12 border rounded flex items-center justify-center font-bold transition-all cursor-pointer ${
                        isSelected
                          ? "border-accent-blue text-white bg-accent-blue/10 glow-blue"
                          : "border-white/5 text-silver hover:text-white hover:border-white/15"
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Customize Your Vibe Swatches */}
            <div className="space-y-3 font-mono text-xs pt-6 border-t border-white/5">
              <div className="flex justify-between text-silver/60">
                <span>CUSTOMIZE YOUR VIBE</span>
                <span className="text-accent-blue font-bold">ACCENT TONER</span>
              </div>
              <div className="flex gap-2">
                {[
                  { color: "#ff007f", label: "Neon Magenta" },
                  { color: "#4f46e5", label: "Electric Indigo" },
                  { color: "#a855f7", label: "Electric Purple" },
                  { color: "#00ffcc", label: "Cyber Green" },
                  { color: "#bfc3c9", label: "Chrome Silver" },
                ].map((swatch) => {
                  const isSelected = customColor === swatch.color;
                  return (
                    <button
                      key={swatch.color}
                      onClick={() => {
                        synthAudio.playClick();
                        setCustomColor(swatch.color);
                      }}
                      className={`w-9 h-9 rounded-full border transition-all cursor-pointer flex items-center justify-center`}
                      style={{
                        backgroundColor: swatch.color,
                        borderColor: isSelected ? "white" : "transparent",
                        boxShadow: isSelected ? `0 0 10px ${swatch.color}` : "none",
                      }}
                      title={swatch.label}
                    >
                      {isSelected && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white mix-blend-difference" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Shipping Pincode estimator */}
            <div className="pt-4 space-y-3">
              <label className="block font-mono text-xs text-silver/60">CHECK REGIONAL SHIPPING DISPATCH</label>
              <form onSubmit={handleCheckDelivery} className="flex gap-2 max-w-sm">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="ENTER PINCODE (e.g. 400001)"
                  className="bg-white/3 border border-white/5 rounded px-3 py-2 font-mono text-[10px] text-white focus:border-accent-blue outline-none flex-grow"
                />
                <button
                  type="submit"
                  className="px-4 py-2 border border-white/10 rounded font-mono text-[10px] text-white hover:bg-white/5 cursor-pointer"
                >
                  CHECK
                </button>
              </form>
              {deliveryMessage && (
                <p className="font-mono text-[9px] text-accent-purple">{deliveryMessage}</p>
              )}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              onClick={handleAddToCart}
              className="flex-grow py-4 bg-white text-black font-semibold font-mono text-xs rounded hover:bg-accent-blue hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-accent-blue/20"
            >
              <ShoppingBag className="w-4 h-4" />
              ADD COMPOSITE TO CART
            </button>
            <button
              onClick={handleBuyNow}
              className="px-8 py-4 border border-white/15 text-white hover:bg-white/5 font-mono text-xs font-semibold rounded transition-colors cursor-pointer"
            >
              BUY NOW
            </button>
            <button
              onClick={() => toggleWishlist(product.id)}
              className="p-4 border border-white/15 hover:border-accent-purple/30 rounded text-silver hover:text-white transition-colors cursor-pointer"
              title="Add to Wishlist"
            >
              <Heart className={`w-4 h-4 ${wishlist.includes(product.id) ? "text-accent-purple fill-accent-purple" : ""}`} />
            </button>
          </div>

          {/* Guarantees elements */}
          <div className="grid grid-cols-3 gap-2 pt-6 border-t border-white/5 font-mono text-[8px] text-silver/40 text-center">
            <div className="p-2 border border-white/2 bg-white/1 rounded-lg">
              <ShieldCheck className="w-4.5 h-4.5 text-accent-blue mx-auto mb-1.5" />
              SECURE SEC-3 PAYMENT
            </div>
            <div className="p-2 border border-white/2 bg-white/1 rounded-lg">
              <RotateCcw className="w-4.5 h-4.5 text-accent-purple mx-auto mb-1.5" />
              14-DAY EASY RETURN
            </div>
            <div className="p-2 border border-white/2 bg-white/1 rounded-lg">
              <Truck className="w-4.5 h-4.5 text-white mx-auto mb-1.5" />
              FAST COURIER DISPATCH
            </div>
          </div>

        </div>
      </main>

      {/* AI OUTFIT RECOMMENDATION / "COMPLETE THE LOOK" */}
      {product.completeTheLook.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 mt-24 relative z-10">
          <div className="border-t border-white/5 pt-16 mb-10 text-center md:text-left">
            <span className="font-mono text-[9px] text-accent-purple tracking-[0.3em] font-semibold block mb-2">
              SORA AI STYLING COMPOSER // SPEC-RECON
            </span>
            <h3 className="text-2xl md:text-3xl font-extrabold tracking-wide text-white uppercase font-sans">
              COMPLETE THE LOOK OUTFIT
            </h3>
          </div>

          {/* Outfit builder grid */}
          <div className="glass border border-white/5 rounded-2xl p-6 md:p-10 flex flex-col lg:flex-row gap-8 items-center bg-black/40">
            {/* Left side: Outfit checklist selection */}
            <div className="flex-grow w-full space-y-4 font-mono text-xs">
              <div className="text-silver/60 text-[9px] tracking-wider mb-2">CHOOSE THE GEAR DETAILS //</div>
              
              {/* Main Product row */}
              <div className="flex justify-between items-center p-3 border border-accent-blue/20 bg-accent-blue/5 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-accent-blue rounded flex items-center justify-center text-white">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-white font-semibold">{product.name} (THIS ITEM)</span>
                </div>
                <div className="flex gap-4 items-center">
                  <span className="text-silver/40">SIZE: {selectedSize}</span>
                  <span className="text-white font-semibold">${product.price}</span>
                </div>
              </div>

              {/* Curated list */}
              {product.completeTheLook.map((recId) => {
                const recP = products.find((p) => p.id === recId);
                if (!recP) return null;
                const isChecked = checkedOutfitItems.includes(recId);
                return (
                  <div
                    key={recId}
                    className={`flex justify-between items-center p-3 border rounded-xl transition-all ${
                      isChecked ? "border-accent-purple/20 bg-accent-purple/5" : "border-white/5 bg-white/2 opacity-70"
                    }`}
                  >
                    <button
                      onClick={() => handleToggleOutfitItem(recId)}
                      className="flex items-center gap-3 text-left focus:outline-none cursor-pointer"
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        isChecked ? "bg-accent-purple border-accent-purple text-white" : "border-white/10"
                      }`}>
                        {isChecked && <Check className="w-3 h-3" />}
                      </div>
                      <span className="text-white font-semibold">{recP.name}</span>
                    </button>

                    <div className="flex gap-4 items-center">
                      {isChecked ? (
                        <div className="flex bg-black/40 border border-white/10 rounded">
                          {recP.sizes.map((sz) => (
                            <button
                              key={sz}
                              onClick={() => handleOutfitSizeChange(recId, sz)}
                              className={`px-2 py-0.5 text-[9px] transition-colors cursor-pointer ${
                                outfitSizes[recId] === sz ? "bg-white text-black" : "text-silver hover:text-white"
                              }`}
                            >
                              {sz}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <span className="text-silver/30 text-[9px]">DE-ACTIVATED</span>
                      )}
                      <span className="text-white font-semibold">${recP.price}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right side: Outfit calculations CTA */}
            <div className="w-full lg:w-[320px] bg-white/2 p-6 rounded-xl border border-white/5 font-mono text-xs flex flex-col justify-between h-full min-h-[180px]">
              <div>
                <span className="text-[9px] text-silver/60 tracking-wider">OUTFIT TOTAL //</span>
                <div className="text-3xl font-extrabold text-white tracking-wide font-sans mt-2">${outfitSubtotal} USD</div>
                <p className="text-[9px] text-accent-purple mt-2">
                  STYLING SUITE RECOM COMPILED SUCCESSFULLY.
                </p>
              </div>
              <button
                onClick={handleAddOutfitToCart}
                className="mt-6 py-3.5 bg-white text-black font-semibold rounded hover:bg-accent-blue hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-accent-blue/20"
              >
                <Sparkles className="w-4 h-4 text-accent-purple" />
                ADD COMPLETE OUTFIT
              </button>
            </div>
          </div>
        </section>
      )}

      {/* CUSTOMER REVIEWS */}
      <section className="max-w-4xl mx-auto px-6 mt-24 relative z-10">
        <div className="border-t border-white/5 pt-16 mb-10 flex items-center gap-2 font-sans">
          <MessageSquare className="w-5 h-5 text-accent-blue" />
          <h3 className="text-xl font-bold tracking-widest text-white uppercase font-mono">
            REVIEWS FEEDBACKS [{localReviews.length}]
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left: Score breakdown */}
          <div className="glass border border-white/5 rounded-xl p-5 flex flex-col justify-center items-center text-center font-mono">
            <span className="text-4xl font-extrabold text-white">{product.rating}</span>
            <div className="flex gap-0.5 text-accent-purple my-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-accent-purple text-accent-purple" />
              ))}
            </div>
            <span className="text-[10px] text-silver/60 uppercase">Average Customer Score</span>
          </div>

          {/* Right: Write review form */}
          <div className="md:col-span-2 glass border border-white/5 rounded-xl p-5 font-mono text-xs">
            <div className="text-silver/60 text-[9px] tracking-wider mb-4">SUBMIT FEEDBACK DISPATCH //</div>
            <form onSubmit={handleAddReview} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-silver/60 mb-1.5">NAME CODE</label>
                  <input
                    type="text"
                    required
                    value={newReview.name}
                    onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                    className="w-full bg-white/3 border border-white/5 rounded p-2 text-white outline-none focus:border-accent-blue"
                    placeholder="CITIZEN X"
                  />
                </div>
                <div>
                  <label className="block text-silver/60 mb-1.5">SCORE (1-5)</label>
                  <select
                    value={newReview.rating}
                    onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                    className="w-full bg-[#171717] border border-white/5 rounded p-2 text-white outline-none focus:border-accent-blue"
                  >
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>{r} STARS</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-silver/60 mb-1.5">COMMENT LOG</label>
                <textarea
                  required
                  rows={2}
                  value={newReview.text}
                  onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                  className="w-full bg-white/3 border border-white/5 rounded p-2 text-white outline-none focus:border-accent-blue"
                  placeholder="LOG YOUR GARMENT FEEDBACK..."
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-white text-black font-semibold rounded hover:bg-accent-blue hover:text-white transition-colors cursor-pointer"
              >
                SUBMIT TELEMETRY
              </button>
            </form>
          </div>
        </div>

        {/* Reviews List */}
        <div className="mt-10 space-y-4 font-mono text-xs">
          {localReviews.map((rev, index) => (
            <div key={index} className="border-b border-white/5 pb-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">{rev.name.toUpperCase()}</span>
                  {rev.verified && (
                    <span className="text-[8px] bg-accent-blue/15 text-accent-blue px-1.5 rounded uppercase">
                      VERIFIED BUYER
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-silver/40">{rev.date}</span>
              </div>
              <div className="flex gap-0.5 text-accent-purple my-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-3 h-3 ${i < rev.rating ? "fill-accent-purple" : "text-white/10"}`} />
                ))}
              </div>
              <p className="text-silver/80 text-[11px] leading-relaxed">
                {rev.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SIMILAR PRODUCTS */}
      {similarItems.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 mt-24 relative z-10">
          <div className="border-t border-white/5 pt-16 mb-10 flex items-center gap-2 font-sans">
            <Compass className="w-5 h-5 text-accent-purple animate-spin" style={{ animationDuration: '6s' }} />
            <h3 className="text-xl font-bold tracking-widest text-white uppercase font-mono">
              SIMILAR COMPLEMENTARY GEAR //
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {similarItems.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  synthAudio.playClick();
                  router.push(`/product/${item.id}`);
                }}
                className="glass border border-white/5 rounded-2xl p-5 flex gap-4 hover:border-accent-blue/30 transition-all cursor-pointer bg-black/20 group"
              >
                <div
                  className="w-16 h-20 rounded-lg flex items-center justify-center font-mono font-bold text-[8px] text-black shadow-inner"
                  style={{
                    background: `linear-gradient(135deg, ${item.color}50 0%, ${item.color} 100%)`,
                  }}
                >
                  SORA
                </div>
                <div className="flex flex-col justify-between py-1 flex-grow">
                  <div>
                    <span className="text-[8px] text-accent-purple tracking-wider uppercase block">{item.category}</span>
                    <h5 className="font-sans font-semibold text-sm text-white group-hover:text-accent-blue transition-colors mt-0.5 truncate max-w-[150px]">{item.name}</h5>
                    <span className="text-silver/40 text-[9px] block uppercase mt-0.5">{item.tag}</span>
                  </div>
                  <span className="font-bold text-white text-xs">${item.price} USD</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SIZE GUIDE DRAWER OVERLAY */}
      <AnimatePresence>
        {isSizeGuideOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[160] bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                synthAudio.playClick();
                setIsSizeGuideOpen(false);
              }}
            />
            <motion.div
              className="fixed right-0 top-0 bottom-0 h-full w-full max-w-md z-[160] glass-premium border-l border-white/10 flex flex-col p-6 shadow-2xl overflow-y-auto"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 260 }}
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-6">
                <span className="font-mono text-xs tracking-widest text-white flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-accent-blue" />
                  SIZE SPECIFICATIONS DATABASE
                </span>
                <button
                  onClick={() => {
                    synthAudio.playClick();
                    setIsSizeGuideOpen(false);
                  }}
                  className="p-2 hover:bg-white/5 rounded-full text-silver hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Table */}
              <div className="font-mono text-xs space-y-6">
                <p className="text-silver/60 leading-relaxed text-[11px]">
                  ALL MEASUREMENTS ARE TAKEN FLAT IN CENTIMETERS. INDIVIDUAL VARIATION IS APPROXIMATELY +/- 1.5CM.
                </p>
                <div className="border border-white/5 rounded-xl overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/3 border-b border-white/5 font-bold text-white text-[10px]">
                        <th className="p-3">SIZE</th>
                        <th className="p-3">CHEST</th>
                        <th className="p-3">LENGTH</th>
                        <th className="p-3">SLEEVE</th>
                      </tr>
                    </thead>
                    <tbody className="text-silver/80 text-[11px] divide-y divide-white/2">
                      <tr>
                        <td className="p-3 font-bold text-white">S</td>
                        <td className="p-3">60 cm</td>
                        <td className="p-3">68 cm</td>
                        <td className="p-3">59 cm</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-white">M</td>
                        <td className="p-3">63 cm</td>
                        <td className="p-3">70 cm</td>
                        <td className="p-3">61 cm</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-white">L</td>
                        <td className="p-3">66 cm</td>
                        <td className="p-3">72 cm</td>
                        <td className="p-3">63 cm</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-white">XL</td>
                        <td className="p-3">69 cm</td>
                        <td className="p-3">74 cm</td>
                        <td className="p-3">65 cm</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-accent-purple/5 border border-accent-purple/20 rounded-xl p-4 space-y-2">
                  <h6 className="font-bold text-white text-xs uppercase flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-accent-purple" />
                    How to Fit?
                  </h6>
                  <p className="text-silver/80 leading-relaxed text-[10px]">
                    SORA GARMENTS ARE CUT IN A CUSTOM BOX-OVERSIZED DRAPING PATTERN. WE RECOMMEND TAKING YOUR NORMAL SIZE FOR THE INTENDED BOX FIT, OR SIZING DOWN ONE FOR A REGULAR TRADITIONAL LOOK.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
