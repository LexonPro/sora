"use client";

import React, { useState, useEffect, useRef } from "react";
import { useStore, Product } from "@/context/StoreContext";
import { synthAudio } from "@/components/AudioEngine";
import { LogoLoader } from "@/components/LogoLoader";
import { CustomCursor, BackgroundParticles } from "@/components/Effects";
import { Navbar } from "@/components/Navbar";
import ThreeCanvas from "@/components/ThreeCanvas";
import { Collections3D } from "@/components/Collections3D";
import { NewDropCountdown, LimitedEditionBanner } from "@/components/PromotionalBanners";
import { Heart, ShoppingBag, Eye, Send, Award, HeartHandshake, EyeOff } from "lucide-react";
import Link from "next/link";

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

// Custom Product Card
const ProductCard: React.FC<{
  product: Product;
  onAddToCart: (p: Product, s: string) => void;
  onToggleWishlist: (id: string) => void;
  isWishlisted: boolean;
}> = ({ product, onAddToCart, onToggleWishlist, isWishlisted }) => {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "M");
  const [hovered, setHovered] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, selectedSize);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWishlist(product.id);
  };

  return (
    <div
      className="glass border border-white/5 rounded-2xl overflow-hidden flex flex-col justify-between group transition-all duration-300 hover:border-accent-blue/30 hover:-translate-y-1 bg-black/30 hover:shadow-2xl hover:shadow-accent-blue/5"
      onMouseEnter={() => {
        setHovered(true);
        synthAudio.playHover();
      }}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative aspect-[4/5] w-full bg-white/2 flex items-center justify-center p-6 overflow-hidden">
        {/* Holographic glowing radial gradient matched to product color */}
        <div
          className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle, ${product.color} 0%, transparent 70%)`,
          }}
        />

        {/* Procedural Vector Clothing representation (Streetwear blueprint look) */}
        <svg
          viewBox="0 0 100 100"
          className="w-32 h-32 text-white/40 group-hover:scale-105 transition-transform duration-500 drop-shadow-[0_0_15px_rgba(255,255,255,0.05)]"
        >
          {/* Outer glow aura */}
          <circle cx="50" cy="50" r="35" fill="none" stroke={`${product.color}20`} strokeWidth="1" strokeDasharray="3 3" />
          
          {product.category.includes("Cargo") ? (
            // Cargo Pants SVG
            <path
              d="M38 25 L62 25 L68 75 L56 75 L50 40 L44 75 L32 75 Z"
              fill="none"
              stroke={product.color}
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
          ) : product.category.includes("Chain") || product.id.includes("beanie") ? (
            // Accessory Loop
            <path
              d="M50 20 C65 20, 68 55, 50 75 C32 55, 35 20, 50 20 Z"
              fill="none"
              stroke={product.color}
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
          ) : (
            // Hoodie / Tee SVG
            <path
              d="M30 30 L40 25 L50 28 L60 25 L70 30 L66 65 L60 65 L50 68 L40 65 L34 65 Z M30 30 L22 45 L30 48 L34 38 M70 30 L78 45 L70 48 L66 38"
              fill="none"
              stroke={product.color}
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
          )}
          {/* Inside details */}
          <circle cx="50" cy="40" r="3" fill="none" stroke="white" strokeWidth="1" />
          <path d="M45 48 H55" stroke="white" strokeWidth="1" />
        </svg>

        {/* Badges / limited edition indicator */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5 font-mono text-[8px] tracking-wider">
          <span className="bg-accent-blue/20 text-accent-blue px-2.5 py-1 rounded border border-accent-blue/10">
            {product.tag.toUpperCase()}
          </span>
          {product.stock <= 5 && (
            <span className="bg-red-500/20 text-red-500 px-2 py-0.5 rounded border border-red-500/10 animate-pulse">
              ONLY {product.stock} LEFT
            </span>
          )}
        </div>

        {/* Wishlist Heart */}
        <button
          onClick={handleWishlist}
          className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/80 rounded-full border border-white/10 text-silver hover:text-white transition-all cursor-pointer z-10"
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? "text-accent-purple fill-accent-purple" : ""}`} />
        </button>

        {/* Hover quick settings overlays */}
        <div className="absolute bottom-4 left-4 right-4 flex gap-2 translate-y-12 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
          <div className="flex bg-black/60 rounded border border-white/10 flex-grow font-mono text-[9px] text-white">
            {product.sizes.map((sz) => (
              <button
                key={sz}
                onClick={(e) => {
                  e.stopPropagation();
                  synthAudio.playClick();
                  setSelectedSize(sz);
                }}
                className={`flex-grow py-1.5 transition-colors cursor-pointer ${
                  selectedSize === sz ? "bg-white text-black font-semibold" : "hover:bg-white/10"
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
          <button
            onClick={handleQuickAdd}
            className="p-2 bg-white text-black hover:bg-accent-blue hover:text-white rounded-lg border border-white/10 transition-colors cursor-pointer"
            title="Quick Add"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Info labels */}
      <div className="p-5 space-y-2 border-t border-white/5">
        <div className="flex justify-between items-start">
          <Link
            href={`/product/${product.id}`}
            onClick={() => synthAudio.playClick()}
            className="font-sans font-semibold text-sm tracking-wide text-white hover:text-accent-blue transition-colors cursor-pointer truncate max-w-[200px]"
          >
            {product.name}
          </Link>
          <span className="font-mono text-xs text-white">${product.price}</span>
        </div>
        <div className="flex justify-between items-center text-[10px] font-mono text-silver/60">
          <span className="uppercase">{product.category}</span>
          <span className="text-accent-purple">{product.rating} ★</span>
        </div>
      </div>
    </div>
  );
};

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const { products, cart, wishlist, toggleWishlist, addToCart } = useStore();
  const [filterCategory, setFilterCategory] = useState("");
  const productsSectionRef = useRef<HTMLDivElement | null>(null);

  // Filter products based on active menu selection
  const filteredProducts = filterCategory
    ? products.filter((p) => p.category === filterCategory)
    : products;

  const handleSelectCategory = (cat: string) => {
    // Scroll down to products grid
    if (productsSectionRef.current) {
      productsSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
    
    if (cat === "NEW DROPS" || cat === "") {
      setFilterCategory("");
    } else {
      setFilterCategory(cat);
    }
  };

  const handleAddToCart = (product: Product, size: string) => {
    synthAudio.playChime();
    addToCart(product, size, 1);
  };

  return (
    <>
      <LogoLoader onComplete={() => setLoading(false)} />
      
      {!loading && (
        <div className="min-h-screen relative bg-[#0D0D0D]">
          {/* Premium effects */}
          <CustomCursor />
          <BackgroundParticles />

          {/* Navigation Bar */}
          <Navbar onSelectCategory={handleSelectCategory} />

          {/* 1. HERO SECTION */}
          <section className="w-full min-h-screen flex flex-col md:flex-row relative z-10 pt-20">
            {/* Left copy column */}
            <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 relative z-10">
              {/* Micro telemetry label */}
              <div className="font-mono text-[9px] tracking-[0.4em] text-accent-blue mb-4 uppercase">
                SORA WORLD // SYSTEM PROTOCOL v4.1
              </div>

              {/* Taglines */}
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight leading-none text-white font-sans uppercase">
                Wear Your
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue via-accent-purple to-white glow-text">
                  Universe
                </span>
              </h1>
              
              <p className="font-mono text-xs sm:text-sm text-silver mt-6 max-w-md leading-relaxed tracking-wider">
                Luxury blank canvases merged with high-concept technical aesthetics. Designed beyond physical boundaries.
              </p>

              {/* CTA button with micro-animation */}
              <div className="flex gap-4 mt-10">
                <button
                  onClick={() => {
                    synthAudio.playClick();
                    if (productsSectionRef.current) {
                      productsSectionRef.current.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="px-8 py-3 bg-white text-black font-semibold font-mono text-xs rounded hover:bg-accent-blue hover:text-white transition-all cursor-pointer shadow-lg hover:shadow-accent-blue/20"
                >
                  SHOP NEW DROP
                </button>
                <button
                  onClick={() => {
                    synthAudio.playClick();
                    window.scrollTo({
                      top: window.innerHeight * 1.8,
                      behavior: "smooth"
                    });
                  }}
                  className="px-8 py-3 border border-white/15 text-white font-mono text-xs rounded hover:bg-white/5 transition-colors cursor-pointer"
                >
                  EXPLORE BLUEPRINT
                </button>
              </div>

              {/* Extra specifications tags */}
              <div className="mt-16 grid grid-cols-3 gap-4 border-t border-white/5 pt-8 font-mono text-[10px] text-silver/60">
                <div>
                  <span className="text-white block font-bold">450 GSM</span>
                  FRENCH COTTON
                </div>
                <div>
                  <span className="text-white block font-bold">316L STEEL</span>
                  UTILITY GEAR
                </div>
                <div>
                  <span className="text-white block font-bold">RAZORPAY</span>
                  3D SECURED PAY
                </div>
              </div>
            </div>

            {/* Right WebGL canvas column */}
            <div className="w-full md:w-1/2 h-[50vh] md:h-auto min-h-[400px] relative">
              <ThreeCanvas />
            </div>
          </section>

          {/* Limited stock levels warnings */}
          <LimitedEditionBanner />

          {/* 2. CURVED 3D CAROUSEL SECTION */}
          <section className="py-20 px-6 relative z-10">
            <Collections3D onSelectCategory={(cat) => {
              // Direct selection logic from carousel changes the main category filter grid below
              if (cat) setFilterCategory(cat);
            }} />
          </section>

          {/* 3. PRODUCT CATALOG GRID SECTION */}
          <section ref={productsSectionRef} className="py-20 px-6 max-w-7xl mx-auto relative z-10 scroll-mt-20">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-white/5 pb-6">
              <div>
                <span className="font-mono text-[9px] text-accent-blue tracking-[0.3em] font-semibold block mb-2 uppercase">
                  ACTIVE REGISTRY // SORA CATALOGUE
                </span>
                <h2 className="text-3xl font-extrabold tracking-wide text-white uppercase">
                  {filterCategory || "ALL CREATIVE GEAR"}
                </h2>
              </div>
              <div className="flex gap-2 mt-4 md:mt-0 font-mono text-[10px]">
                <button
                  onClick={() => { synthAudio.playClick(); setFilterCategory(""); }}
                  className={`px-3 py-1.5 border rounded cursor-pointer ${
                    !filterCategory ? "border-white text-white bg-white/5" : "border-white/5 text-silver hover:text-white"
                  }`}
                >
                  ALL
                </button>
                {Array.from(new Set(products.map((p) => p.category))).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { synthAudio.playClick(); setFilterCategory(cat); }}
                    className={`px-3 py-1.5 border rounded cursor-pointer ${
                      filterCategory === cat ? "border-white text-white bg-white/5" : "border-white/5 text-silver hover:text-white"
                    }`}
                  >
                    {cat.split(" ")[0].toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={toggleWishlist}
                  isWishlisted={wishlist.includes(product.id)}
                />
              ))}
            </div>
          </section>

          {/* Countdown promotion details */}
          <NewDropCountdown />

          {/* 4. BRAND STORY SECTION ("Why SORA?") */}
          <section className="py-24 px-6 max-w-5xl mx-auto text-center relative z-10">
            <span className="font-mono text-[10px] text-accent-purple tracking-[0.3em] font-semibold block mb-4">
              03 // SORA BRAND MANIFESTO
            </span>
            <h3 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight uppercase leading-tight mb-8">
              Streetwear Beyond
              <br />
              Physical Limits.
            </h3>
            <p className="font-mono text-sm text-silver leading-relaxed max-w-2xl mx-auto">
              SORA stands at the intersection of minimalist design blueprints and luxury heavyweights. We reject fast fashion metrics. Each garment is engineered as a physical-digital asset utilizing high-GSM organic weaves, technical strap layouts, and glowing cyber accents.
            </p>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="p-6 border border-white/5 bg-white/2 rounded-xl flex flex-col items-center">
                <Award className="w-8 h-8 text-accent-blue mb-4" />
                <h5 className="font-sans font-bold text-sm tracking-wide text-white uppercase">Premium Quality</h5>
                <p className="font-mono text-[10px] text-silver mt-2">Organic cotton weights exceeding 450 GSM for premium structure.</p>
              </div>
              <div className="p-6 border border-white/5 bg-white/2 rounded-xl flex flex-col items-center">
                <Send className="w-8 h-8 text-accent-purple mb-4" />
                <h5 className="font-sans font-bold text-sm tracking-wide text-white uppercase">Fast Shipping</h5>
                <p className="font-mono text-[10px] text-silver mt-2">Dispatched in 24 hours under priority courier networks.</p>
              </div>
              <div className="p-6 border border-white/5 bg-white/2 rounded-xl flex flex-col items-center">
                <HeartHandshake className="w-8 h-8 text-white mb-4" />
                <h5 className="font-sans font-bold text-sm tracking-wide text-white uppercase">Returns Policy</h5>
                <p className="font-mono text-[10px] text-silver mt-2">14-day hassle-free returns grid logged onto your profile.</p>
              </div>
            </div>
          </section>

          {/* 5. INSTAGRAM GALLERY GRID */}
          <section className="py-16 px-6 max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-12">
              <span className="font-mono text-[10px] text-accent-blue tracking-[0.3em] font-semibold block mb-2 uppercase">
                COMMUNITY PORTAL // GRID SHOTS
              </span>
              <h3 className="text-2xl md:text-3xl font-extrabold tracking-wide text-white uppercase">
                #SORA.WORLD IN WILD
              </h3>
            </div>

            {/* Pinterest Grid */}
            <div className="columns-2 md:columns-4 gap-4 space-y-4">
              {[
                { label: "@sid_raw", color: "#ff007f", height: "h-64" },
                { label: "@cyber_wear", color: "#4f46e5", height: "h-80" },
                { label: "@korean_vibe", color: "#a855f7", height: "h-60" },
                { label: "@blank_blank", color: "#00d2ff", height: "h-72" },
                { label: "@street_style", color: "#bfc3c9", height: "h-72" },
                { label: "@tokyo_drift", color: "#4f46e5", height: "h-60" },
                { label: "@anime_fit", color: "#ff007f", height: "h-80" },
                { label: "@mannequin_x", color: "#a855f7", height: "h-64" },
              ].map((img, idx) => (
                <div
                  key={idx}
                  className={`break-inside-avoid glass border border-white/5 rounded-2xl ${img.height} relative overflow-hidden group flex items-center justify-center`}
                >
                  <div
                    className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity"
                    style={{ background: `linear-gradient(135deg, ${img.color}50 0%, ${img.color} 100%)` }}
                  />
                  <InstagramIcon className="w-8 h-8 text-white/20 group-hover:scale-110 group-hover:text-white/40 transition-all duration-300" />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 font-mono text-[10px]">
                    <span className="text-white font-semibold flex items-center gap-1.5">
                      <InstagramIcon className="w-3.5 h-3.5 text-accent-purple" />
                      {img.label}
                    </span>
                    <span className="text-silver/60 mt-1">CLICK TO EXPLORE OUTIFT</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 6. NEWSLETTER & FOOTER */}
          <footer className="border-t border-white/5 bg-black/40 py-16 px-6 relative z-10">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-white/5 pb-16">
              
              {/* Col 1: Newsletter */}
              <div className="md:col-span-2 space-y-4">
                <span className="font-mono text-[9px] text-accent-blue tracking-[0.3em] font-semibold block uppercase">
                  SUBSCRIBE TELEMETRY // JOIN GRID
                </span>
                <h4 className="text-xl font-bold text-white font-sans uppercase">
                  STAY UPDATED ON FUTURE DROPS
                </h4>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    synthAudio.playChime();
                    alert("Your address coordinates are successfully subscribed to the SORA grid.");
                  }}
                  className="flex gap-2 max-w-sm mt-4"
                >
                  <input
                    type="email"
                    required
                    placeholder="ENTER EMAIL COORDINATES"
                    className="w-full bg-white/3 border border-white/5 rounded px-3 py-2 font-mono text-xs text-white focus:border-accent-blue outline-none uppercase placeholder:text-white/20"
                  />
                  <button
                    type="submit"
                    className="px-6 bg-white text-black font-mono text-xs font-semibold rounded hover:bg-accent-blue hover:text-white transition-all cursor-pointer"
                  >
                    JOIN
                  </button>
                </form>
              </div>

              {/* Col 2: Info links */}
              <div>
                <h5 className="font-mono text-[10px] text-silver/60 tracking-wider mb-4 uppercase">GRID DIRECTORY //</h5>
                <ul className="font-mono text-xs text-silver space-y-2.5">
                  <li><Link href="/" className="hover:text-white">STORE HOME</Link></li>
                  <li><Link href="/about" className="hover:text-white">Manifesto Story</Link></li>
                  <li><Link href="/admin" className="hover:text-white">Admin portal</Link></li>
                  <li><span className="text-silver/20 cursor-not-allowed">Style quizzes (Soon)</span></li>
                </ul>
              </div>

              {/* Col 3: Policy links */}
              <div>
                <h5 className="font-mono text-[10px] text-silver/60 tracking-wider mb-4 uppercase">POLICIES GRID //</h5>
                <ul className="font-mono text-xs text-silver space-y-2.5">
                  <li><span className="hover:text-white cursor-pointer">Shipping & Logistics</span></li>
                  <li><span className="hover:text-white cursor-pointer">Return telemetry</span></li>
                  <li><span className="hover:text-white cursor-pointer">Privacy blockchain</span></li>
                  <li><span className="hover:text-white cursor-pointer">FAQs Database</span></li>
                </ul>
              </div>

            </div>

            {/* Bottom Credits */}
            <div className="max-w-7xl mx-auto pt-8 flex flex-col md:flex-row justify-between items-center gap-4 font-mono text-[9px] text-silver/40">
              <span>© {new Date().getFullYear()} SORA WORLD. ALL CODES SECURED.</span>
              <span>DESIGNED BY LEXONPRO SPECIFICATION.</span>
            </div>
          </footer>

        </div>
      )}
    </>
  );
}
