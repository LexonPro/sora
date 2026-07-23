"use client";

import React, { useState } from "react";
import { Product, PRODUCTS } from "@/lib/products";
import { sound } from "@/lib/audio";

interface ActiveTheoryShowcaseProps {
  onSelectProduct: (product: Product) => void;
}

export default function ActiveTheoryShowcase({
  onSelectProduct,
}: ActiveTheoryShowcaseProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "ALL DROPS" },
    { id: "hoodies", label: "HOODIES" },
    { id: "tees", label: "TEES" },
    { id: "jackets", label: "JACKETS" },
    { id: "accessories", label: "ACCESSORIES" },
  ];

  const filteredProducts =
    activeCategory === "all"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeCategory);

  return (
    <section id="products-section" className="py-20 px-6 md:px-16 relative z-10 bg-black">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-white/10 pb-6 gap-6">
        <div>
          <div className="font-mono text-[10px] tracking-[0.3em] text-purple-400 uppercase mb-2">
            🔥 SECTION 2 // NEW DROP SHOWCASE
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-sans uppercase">
            DROP 001 "SHADOW REALM"
          </h2>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                sound.playGlitch();
                setActiveCategory(cat.id);
              }}
              className={`px-4 py-2 rounded-xl font-mono text-xs tracking-wider uppercase transition-all cursor-pointer border ${
                activeCategory === cat.id
                  ? "bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-900/40"
                  : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            onClick={() => {
              sound.playTap();
              onSelectProduct(product);
            }}
            className="group relative bg-neutral-950 border border-white/10 hover:border-purple-500 rounded-3xl p-5 transition-all duration-300 hover:-translate-y-2 cursor-pointer shadow-xl overflow-hidden"
          >
            {/* Animated Neon Glow Border on Hover */}
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/20 via-transparent to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            {/* Tag Badge */}
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[10px] font-bold tracking-widest text-purple-400 bg-purple-950/60 border border-purple-800/40 px-2.5 py-1 rounded-full uppercase">
                {product.tag}
              </span>
              <span className="font-mono text-[10px] text-white/40 uppercase">
                {product.gsm}
              </span>
            </div>

            {/* Product 3D Card Graphic Representation */}
            <div className="w-full h-56 rounded-2xl bg-gradient-to-b from-purple-950/30 to-black border border-white/5 flex items-center justify-center relative overflow-hidden my-3 group-hover:scale-105 transition-transform duration-500">
              <div className="w-32 h-40 rounded-2xl bg-gradient-to-tr from-neutral-900 to-neutral-800 border border-white/10 shadow-2xl flex flex-col items-center justify-center p-4 text-center group-hover:rotate-3 transition-transform">
                <span className="text-3xl mb-2">👕</span>
                <span className="font-mono text-[10px] text-purple-300 font-bold tracking-wider uppercase">
                  3D INSPECT
                </span>
                <span className="font-mono text-[9px] text-white/40 uppercase">
                  360° TAP
                </span>
              </div>
            </div>

            {/* Product Meta */}
            <div className="mt-4">
              <div className="font-mono text-[10px] tracking-widest text-white/40 uppercase mb-1">
                {product.drop} • {product.category}
              </div>
              <h3 className="font-sans text-base font-bold text-white uppercase group-hover:text-purple-300 transition-colors">
                {product.name}
              </h3>

              {/* Price & Action */}
              <div className="flex items-center justify-between mt-4 border-t border-white/10 pt-3">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-base font-bold text-white">
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>
                  <span className="font-mono text-xs text-white/40 line-through">
                    ₹{product.originalPrice.toLocaleString("en-IN")}
                  </span>
                </div>

                <span className="font-mono text-[10px] text-purple-400 font-bold tracking-widest uppercase bg-purple-950/60 px-3 py-1.5 rounded-xl border border-purple-800/40 group-hover:bg-purple-600 group-hover:text-white transition-all">
                  3D VIEW →
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
