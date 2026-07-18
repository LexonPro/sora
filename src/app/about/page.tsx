"use client";

import React from "react";
import { CustomCursor, BackgroundParticles } from "@/components/Effects";
import { Navbar } from "@/components/Navbar";
import { synthAudio } from "@/components/AudioEngine";
import { ArrowRight, Compass, ShieldCheck, HeartHandshake, Eye } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] relative pb-20">
      <CustomCursor />
      <BackgroundParticles />
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 pt-32 relative z-10 text-center font-mono">
        
        {/* Sub title */}
        <span className="text-[10px] text-accent-purple tracking-[0.4em] font-semibold block mb-4 uppercase">
          MANIFESTO PORTAL // BLUEPRINT SORA
        </span>

        {/* Cinematic Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-none uppercase mb-10 font-sans">
          Wear Your
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue via-accent-purple to-white glow-text">
            Universe.
          </span>
        </h1>

        {/* Intro */}
        <p className="text-sm text-silver leading-relaxed max-w-2xl mx-auto mb-16 tracking-wide">
          SORA represents the space between physical garment grids and digital coordinate spaces. We build minimalist luxury technical streetwear, treating apparel not as fast consumption units, but as structural artifacts.
        </p>

        {/* Split grid details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left text-xs mb-20">
          
          {/* Card 1 */}
          <div className="glass border border-white/5 p-6 rounded-2xl space-y-4">
            <h3 className="text-white font-bold text-sm flex items-center gap-2 uppercase">
              <Compass className="w-4 h-4 text-accent-blue" />
              01 // The Inspiration
            </h3>
            <p className="text-silver/80 leading-relaxed">
              Derived from the Japanese word for &ldquo;sky&rdquo; and the endless black voids of space-dust nebulae. SORA fuses Korean techwear modular utility grids with vintage distressed anime screen prints, creating streetwear engineered for structural draping.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass border border-white/5 p-6 rounded-2xl space-y-4">
            <h3 className="text-white font-bold text-sm flex items-center gap-2 uppercase">
              <ShieldCheck className="w-4 h-4 text-accent-purple" />
              02 // Quality Creed
            </h3>
            <p className="text-silver/80 leading-relaxed">
              We reject lightweight synthetic substitutes. All SORA fleece hoodies utilize 450 GSM French Terry organic cotton, double-lined hoods, and custom metal hardware. Our tees are knitted with 280 GSM ring-spun cotton for an unyielding box fit.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass border border-white/5 p-6 rounded-2xl space-y-4">
            <h3 className="text-white font-bold text-sm flex items-center gap-2 uppercase">
              <HeartHandshake className="w-4 h-4 text-white" />
              03 // Circular Promise
            </h3>
            <p className="text-silver/80 leading-relaxed">
              Every production batch is strictly limited to prevent inventory surplus. SORA operates under priority delivery schedules with COD verification models and secure payments, securing client purchase transactions comprehensively.
            </p>
          </div>

          {/* Card 4 */}
          <div className="glass border border-white/5 p-6 rounded-2xl space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-white font-bold text-sm flex items-center gap-2 uppercase">
                <Eye className="w-4 h-4 text-accent-blue" />
                04 // Future Telemetry
              </h3>
              <p className="text-silver/80 leading-relaxed">
                We are developing augmented reality (AR) virtual try-ons and loyalty token programs. Keep your referral code dispatch active on your citizen profile.
              </p>
            </div>
            <Link
              href="/"
              onClick={() => synthAudio.playClick()}
              className="mt-6 flex items-center gap-2 text-accent-blue hover:text-white transition-colors"
            >
              EXPLORE ACTIVE REGISTRY <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

        {/* Manifesto Signoff */}
        <div className="border-t border-white/5 pt-12 text-center text-silver/40 text-[9px] tracking-widest leading-relaxed">
          SORA SPECIFICATION CODE: WORLD.GRID.00 // COMMITTED TO EXCELLENCE<br />
          ESTABLISHED 2026. SECURED UNDER THE STARS.
        </div>

      </main>
    </div>
  );
}
