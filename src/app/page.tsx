"use client";

import React, { useState, Suspense, lazy } from "react";
import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import Cursor from "@/components/Cursor";
import Navigation from "@/components/Navigation";
import ManifestoSection from "@/components/ManifestoSection";
import CommunityMosaic from "@/components/CommunityMosaic";
import ProductShowcase from "@/components/ProductShowcase";
import CollectionReel from "@/components/CollectionReel";

// Lazy load heavy WebGL scenes
const HeroScene = lazy(() => import("@/components/HeroScene"));
const FooterScene = lazy(() => import("@/components/FooterScene"));

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {/* Cinematic Preloader */}
      {!loaded && <Preloader onComplete={() => setLoaded(true)} />}

      {/* Custom Cursor (desktop only) */}
      <Cursor />

      {/* Smooth scroll wrapper */}
      <SmoothScroll>
        {/* Film grain overlay */}
        <div className="grain-overlay" />

        {/* Navigation — appears after scrolling past hero */}
        <Navigation />

        {/* ─── HERO ─── */}
        <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
          {/* WebGL Particle Wordmark */}
          <Suspense fallback={null}>
            <HeroScene />
          </Suspense>

          {/* Centered text overlay */}
          <div className="relative z-10 text-center select-none px-6">
            <h1
              className="font-display text-6xl sm:text-8xl md:text-9xl lg:text-[12rem] font-light tracking-tighter leading-[0.85] text-bone uppercase"
              style={{ letterSpacing: "-0.03em" }}
            >
              <span className="block">SORA</span>
            </h1>
            <p className="mt-6 font-sans text-xs sm:text-sm tracking-[0.4em] text-bone/30 uppercase">
              Wear Your Universe
            </p>
          </div>

          {/* Bottom scroll indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3">
            <div className="w-[1px] h-10 bg-gradient-to-b from-transparent to-bone/20 animate-pulse" />
            <span className="font-mono text-[8px] tracking-[0.4em] text-bone/20 uppercase">
              Scroll
            </span>
          </div>
        </section>

        {/* ─── PRODUCT SHOWCASE ─── */}
        <ProductShowcase />

        {/* ─── COLLECTION REEL ─── */}
        <CollectionReel />

        {/* ─── MANIFESTO ─── */}
        <ManifestoSection />

        {/* ─── COMMUNITY ─── */}
        <CommunityMosaic />

        {/* ─── FOOTER ─── */}
        <Suspense fallback={null}>
          <FooterScene />
        </Suspense>
      </SmoothScroll>
    </>
  );
}
