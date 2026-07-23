"use client";

import React from "react";
import ActiveTheory3DCanvas from "./ActiveTheory3DCanvas";
import { sound } from "@/lib/audio";

interface ActiveTheoryHeroProps {
  onShopClick: () => void;
  onExploreClick: () => void;
}

export default function ActiveTheoryHero({
  onShopClick,
  onExploreClick,
}: ActiveTheoryHeroProps) {
  return (
    <section className="w-full min-h-[92vh] md:min-h-screen relative flex flex-col md:flex-row items-center justify-between z-10 pt-20 px-6 md:px-16 overflow-hidden bg-gradient-to-b from-black via-purple-950/20 to-black">
      {/* Background Cyber Grid Lines */}
      <div
        className="absolute inset-0 z-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Left Column: Typography & CTAs */}
      <div className="w-full md:w-1/2 relative z-10 py-10 flex flex-col justify-center">
        {/* Micro System Telemetry Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-800/40 w-fit mb-6">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
          <span className="font-mono text-[10px] tracking-[0.3em] text-purple-300 uppercase">
            DROP 001 LIVE // SORA OS v4.2
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none text-white font-sans uppercase">
          SORA WORLD
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400">
            WEAR YOUR UNIVERSE
          </span>
        </h1>

        {/* Subtext */}
        <div className="mt-6 space-y-2">
          <div className="font-mono text-sm sm:text-base text-purple-400 font-bold tracking-[0.3em] uppercase">
            Anime. Street. Identity.
          </div>
          <p className="font-sans text-xs sm:text-sm text-neutral-400 max-w-lg leading-relaxed">
            Premium Anime & Streetwear For The Next Generation. Engineered with 450 GSM French Cotton and technical 316L hardware.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mt-8">
          <button
            onClick={() => {
              sound.playTap();
              onShopClick();
            }}
            className="px-8 py-4 rounded-2xl bg-white text-black font-mono text-xs font-bold tracking-[0.2em] uppercase hover:bg-purple-400 hover:text-white transition-all cursor-pointer shadow-xl shadow-purple-900/20 active:scale-95"
          >
            🔥 SHOP COLLECTION
          </button>

          <button
            onClick={() => {
              sound.playWhoosh();
              onExploreClick();
            }}
            className="px-8 py-4 rounded-2xl bg-white/5 border border-white/15 text-white font-mono text-xs tracking-[0.2em] uppercase hover:bg-white/10 transition-all cursor-pointer active:scale-95"
          >
            ✨ EXPLORE SORA
          </button>
        </div>

        {/* Extra Specification Tags */}
        <div className="mt-12 grid grid-cols-3 gap-4 border-t border-white/10 pt-6 font-mono text-[10px] text-white/50 uppercase">
          <div>
            <span className="text-white block font-bold">450 GSM</span>
            FRENCH COTTON
          </div>
          <div>
            <span className="text-white block font-bold">316L STEEL</span>
            UTILITY HARDWARE
          </div>
          <div>
            <span className="text-white block font-bold">RAZORPAY</span>
            3D SECURED PAY
          </div>
        </div>
      </div>

      {/* Right Column: 3D WebGL Canvas Interactive Mannequin */}
      <div className="w-full md:w-1/2 h-[450px] md:h-[600px] relative z-10">
        <ActiveTheory3DCanvas color="#0d0d0d" />
      </div>
    </section>
  );
}
