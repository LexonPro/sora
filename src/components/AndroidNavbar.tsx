"use client";

import React, { useState } from "react";
import { sound } from "@/lib/audio";

interface AndroidNavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onOpenAccount: () => void;
}

export default function AndroidNavbar({
  cartCount,
  onOpenCart,
  onOpenSearch,
  onOpenAccount,
}: AndroidNavbarProps) {
  const [isMuted, setIsMuted] = useState(sound.isMuted());

  const handleMuteToggle = () => {
    const nextMuted = sound.toggleMute();
    setIsMuted(nextMuted);
  };

  return (
    <>
      {/* Top Mobile & Desktop Bar */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center text-white font-black text-xs font-mono shadow-lg shadow-purple-600/30">
            S
          </div>
          <span className="font-sans text-base font-black tracking-tight text-white uppercase">
            SORA <span className="text-purple-400 font-mono text-xs font-normal">WORLD</span>
          </span>
        </div>

        {/* Top Controls */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={handleMuteToggle}
            className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white/70 font-mono text-[10px] tracking-wider uppercase hover:bg-white/10 transition-all cursor-pointer"
            title={isMuted ? "Unmute Audio" : "Mute Audio"}
          >
            {isMuted ? "🔇 SOUND OFF" : "🔊 SOUND ON"}
          </button>

          {/* Search Trigger */}
          <button
            onClick={() => {
              sound.playTap();
              onOpenSearch();
            }}
            className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 text-white flex items-center justify-center text-xs hover:bg-white/10 transition-all cursor-pointer"
            aria-label="Search"
          >
            🔍
          </button>

          {/* Cart Counter Trigger */}
          <button
            onClick={() => {
              sound.playTap();
              onOpenCart();
            }}
            className="relative px-3.5 py-1.5 rounded-xl bg-purple-600 text-white font-mono text-xs font-bold tracking-wider uppercase hover:bg-purple-500 transition-all cursor-pointer shadow-lg shadow-purple-900/40"
          >
            🛒 <span className="ml-1">{cartCount}</span>
          </button>
        </div>
      </header>

      {/* Bottom Floating Bar (Android Thumb Zone Optimized!) */}
      <nav className="fixed bottom-3 left-4 right-4 z-40 max-w-md mx-auto bg-neutral-950/90 backdrop-blur-2xl border border-white/15 rounded-2xl py-2 px-4 shadow-2xl flex items-center justify-around">
        <button
          onClick={() => {
            sound.playTap();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex flex-col items-center gap-0.5 text-white/70 hover:text-purple-400 transition-colors cursor-pointer"
        >
          <span className="text-base">🏠</span>
          <span className="font-mono text-[9px] tracking-widest uppercase">HOME</span>
        </button>

        <button
          onClick={() => {
            sound.playTap();
            const el = document.getElementById("products-section");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
          className="flex flex-col items-center gap-0.5 text-white/70 hover:text-purple-400 transition-colors cursor-pointer"
        >
          <span className="text-base">👕</span>
          <span className="font-mono text-[9px] tracking-widest uppercase">DROPS</span>
        </button>

        <button
          onClick={() => {
            sound.playGlitch();
            const el = document.getElementById("products-section");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
          className="flex flex-col items-center gap-0.5 text-purple-400 font-bold transition-colors cursor-pointer"
        >
          <span className="text-base">✨</span>
          <span className="font-mono text-[9px] tracking-widest uppercase">3D VIBE</span>
        </button>

        <button
          onClick={() => {
            sound.playTap();
            onOpenCart();
          }}
          className="flex flex-col items-center gap-0.5 text-white/70 hover:text-purple-400 transition-colors cursor-pointer relative"
        >
          <span className="text-base">🛍️</span>
          {cartCount > 0 && (
            <span className="absolute -top-1 right-2 w-4 h-4 rounded-full bg-purple-500 text-white font-mono text-[9px] font-bold flex items-center justify-center">
              {cartCount}
            </span>
          )}
          <span className="font-mono text-[9px] tracking-widest uppercase">BAG</span>
        </button>

        <button
          onClick={() => {
            sound.playTap();
            onOpenAccount();
          }}
          className="flex flex-col items-center gap-0.5 text-white/70 hover:text-purple-400 transition-colors cursor-pointer"
        >
          <span className="text-base">👤</span>
          <span className="font-mono text-[9px] tracking-widest uppercase">ACCOUNT</span>
        </button>
      </nav>
    </>
  );
}
