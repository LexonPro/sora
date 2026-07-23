"use client";

import React, { useState } from "react";
import { Product } from "@/lib/products";
import ActiveTheory3DCanvas from "./ActiveTheory3DCanvas";
import { sound } from "@/lib/audio";

interface ProductModal3DProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, selectedColor: string, selectedSize: string) => void;
}

export default function ProductModal3D({
  product,
  onClose,
  onAddToCart,
}: ProductModal3DProps) {
  const [selectedColor, setSelectedColor] = useState(
    product?.colors[0]?.hex || "#0d0d0d"
  );
  const [selectedSize, setSelectedSize] = useState("L");
  const [isZoomed, setIsZoomed] = useState(false);
  const [showBackView, setShowBackView] = useState(false);
  const [showFabricCloseUp, setShowFabricCloseUp] = useState(false);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const sizes = ["S", "M", "L", "XL", "XXL"];

  const handleAdd = () => {
    sound.playTap();
    setAdded(true);
    onAddToCart(product, selectedColor, selectedSize);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/90 backdrop-blur-xl transition-all duration-300 p-0 sm:p-6 overflow-y-auto">
      {/* Modal Container */}
      <div className="w-full max-w-5xl bg-neutral-950/90 border border-white/10 rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col md:flex-row relative shadow-2xl max-h-[92vh] md:max-h-[85vh]">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playTap();
            onClose();
          }}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-mono text-sm border border-white/20 transition-all cursor-pointer"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Left Column: 3D Product Canvas & Controls */}
        <div className="w-full md:w-3/5 h-[420px] md:h-auto min-h-[380px] relative bg-gradient-to-b from-purple-950/20 via-black to-black flex flex-col justify-between p-4 border-b md:border-b-0 md:border-r border-white/10">
          {/* Top Micro Telemetry */}
          <div className="flex items-center justify-between z-10 font-mono text-[10px] tracking-widest text-purple-400 uppercase">
            <span>3D SHOWROOM // ACTIVE</span>
            <span>{showFabricCloseUp ? "TEXTURE ZOOM 2.4X" : isZoomed ? "ZOOM 1.6X" : "360° VIEW"}</span>
          </div>

          {/* R3F WebGL 3D Canvas */}
          <div className="absolute inset-0 z-0">
            <ActiveTheory3DCanvas
              color={selectedColor}
              isZoomed={isZoomed}
              showBackView={showBackView}
              showFabricCloseUp={showFabricCloseUp}
            />
          </div>

          {/* Interactive Control Buttons */}
          <div className="z-10 flex flex-wrap gap-2 justify-center bg-black/60 backdrop-blur-md p-2 rounded-2xl border border-white/10">
            <button
              onClick={() => {
                sound.playWhoosh();
                setShowBackView(!showBackView);
              }}
              className={`px-3 py-1.5 rounded-xl font-mono text-[10px] tracking-wider uppercase border transition-all cursor-pointer ${
                showBackView
                  ? "bg-purple-600 text-white border-purple-400"
                  : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10"
              }`}
            >
              🔄 {showBackView ? "Front View" : "Back View"}
            </button>

            <button
              onClick={() => {
                sound.playWhoosh();
                setIsZoomed(!isZoomed);
                setShowFabricCloseUp(false);
              }}
              className={`px-3 py-1.5 rounded-xl font-mono text-[10px] tracking-wider uppercase border transition-all cursor-pointer ${
                isZoomed && !showFabricCloseUp
                  ? "bg-cyan-600 text-white border-cyan-400"
                  : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10"
              }`}
            >
              🔍 {isZoomed ? "Reset Zoom" : "Zoom Model"}
            </button>

            <button
              onClick={() => {
                sound.playGlitch();
                setShowFabricCloseUp(!showFabricCloseUp);
                setIsZoomed(false);
              }}
              className={`px-3 py-1.5 rounded-xl font-mono text-[10px] tracking-wider uppercase border transition-all cursor-pointer ${
                showFabricCloseUp
                  ? "bg-amber-500 text-black border-amber-300 font-bold"
                  : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10"
              }`}
            >
              ✨ Fabric Texture
            </button>
          </div>
        </div>

        {/* Right Column: Details, Customizer & Checkout */}
        <div className="w-full md:w-2/5 p-6 flex flex-col justify-between overflow-y-auto bg-neutral-950">
          <div>
            {/* Category Tag */}
            <div className="flex items-center gap-2 mb-2 font-mono text-[10px] tracking-[0.3em] text-purple-400 uppercase">
              <span>{product.drop}</span>
              <span>•</span>
              <span>{product.category}</span>
            </div>

            {/* Product Title */}
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans uppercase mb-2">
              {product.name}
            </h2>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-2xl font-bold font-mono text-white">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              <span className="text-sm font-mono text-white/40 line-through">
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </span>
              <span className="text-[10px] font-mono text-green-400 bg-green-950/60 border border-green-800/40 px-2 py-0.5 rounded">
                SAVE ₹{(product.originalPrice - product.price).toLocaleString("en-IN")}
              </span>
            </div>

            {/* Description */}
            <p className="text-xs text-neutral-300 leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Fabric Specs */}
            <div className="grid grid-cols-2 gap-2 mb-6 p-3 bg-white/5 rounded-xl border border-white/10 font-mono text-[10px]">
              <div>
                <span className="text-white/40 block">FABRIC</span>
                <span className="text-white font-semibold">{product.fabric}</span>
              </div>
              <div>
                <span className="text-white/40 block">WEIGHT</span>
                <span className="text-white font-semibold">{product.gsm}</span>
              </div>
            </div>

            {/* Customize Your Vibe - Color Picker */}
            <div className="mb-6">
              <label className="block font-mono text-[10px] tracking-[0.2em] text-purple-400 uppercase mb-3">
                ✨ Customize Your Vibe (Color Palette)
              </label>
              <div className="flex gap-3">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => {
                      sound.playTap();
                      setSelectedColor(c.hex);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border font-mono text-xs transition-all cursor-pointer ${
                      selectedColor === c.hex
                        ? "border-purple-500 bg-purple-950/40 text-white"
                        : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-white/20 block"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="mb-8">
              <label className="block font-mono text-[10px] tracking-[0.2em] text-white/50 uppercase mb-3">
                Select Fit Size
              </label>
              <div className="flex gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      sound.playTap();
                      setSelectedSize(size);
                    }}
                    className={`w-11 h-11 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                      selectedSize === size
                        ? "bg-white text-black shadow-lg shadow-white/10"
                        : "bg-white/5 text-white/60 hover:bg-white/10 border border-white/10"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleAdd}
            className={`w-full py-4 rounded-2xl font-mono text-xs tracking-[0.3em] font-bold uppercase transition-all cursor-pointer shadow-xl ${
              added
                ? "bg-green-500 text-black shadow-green-500/20"
                : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-600/30"
            }`}
          >
            {added ? "✓ ADDED TO BAG" : "🔥 ADD TO BAG"}
          </button>
        </div>
      </div>
    </div>
  );
}
