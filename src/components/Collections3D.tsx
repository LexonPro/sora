"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { synthAudio } from "./AudioEngine";
import Link from "next/link";

interface CollectionItem {
  id: string;
  name: string;
  tagline: string;
  imageBg: string; // Gradient description
  category: string;
  link: string;
}

const collections: CollectionItem[] = [
  {
    id: "anime",
    name: "🌌 ANIME COLLECTION",
    tagline: "WEAR THE LEGEND",
    imageBg: "linear-gradient(135deg, rgba(255, 0, 127, 0.2) 0%, rgba(13, 13, 13, 0.9) 100%)",
    category: "Anime Collection",
    link: "/?filter=Anime Collection",
  },
  {
    id: "streetwear",
    name: "⚡ STREETWEAR",
    tagline: "URBAN UTILITY SPEC",
    imageBg: "linear-gradient(135deg, rgba(79, 70, 229, 0.2) 0%, rgba(13, 13, 13, 0.9) 100%)",
    category: "Korean Street",
    link: "/?filter=Korean Street",
  },
  {
    id: "oversized",
    name: "🌙 OVERSIZED SERIES",
    tagline: "ESSENTIAL HEAVYWEIGHTS",
    imageBg: "linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(13, 13, 13, 0.9) 100%)",
    category: "Oversized",
    link: "/?filter=Oversized",
  },
  {
    id: "korean",
    name: "🚀 KOREAN FASHION",
    tagline: "MODULAR ACCENTUATIONS",
    imageBg: "linear-gradient(135deg, rgba(0, 210, 255, 0.2) 0%, rgba(13, 13, 13, 0.9) 100%)",
    category: "Accessories",
    link: "/?filter=Accessories",
  },
];

// Nebula Particle Canvas backing the carousel
const NebulaBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let particles: Array<{
      x: number;
      y: number;
      radius: number;
      color: string;
      angle: number;
      speed: number;
      distance: number;
    }> = [];

    const colors = [
      "rgba(255, 0, 127, 0.4)", // Pink
      "rgba(79, 70, 229, 0.4)", // Indigo
      "rgba(168, 85, 247, 0.4)", // Purple
      "rgba(0, 210, 255, 0.3)", // Cyan
    ];

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 800;
      canvas.height = canvas.parentElement?.clientHeight || 450;
    };
    resize();
    window.addEventListener("resize", resize);

    // Create cloud particles swirling around the center
    const count = 60;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: centerX,
        y: centerY,
        radius: Math.random() * 80 + 30, // Large soft spots
        color: colors[Math.floor(Math.random() * colors.length)],
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.005 + 0.002,
        distance: Math.random() * (canvas.width * 0.35) + 50,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "screen";

      const cX = canvas.width / 2;
      const cY = canvas.height / 2;

      particles.forEach((p) => {
        p.angle += p.speed;
        p.x = cX + Math.cos(p.angle) * p.distance;
        p.y = cY + Math.sin(p.angle) * p.distance * 0.6; // squash vertically for depth

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        grad.addColorStop(0, p.color);
        grad.addColorStop(1, "rgba(0,0,0,0)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0 rounded-2xl" />;
};

export const Collections3D: React.FC<{ onSelectCategory: (category: string) => void }> = ({ onSelectCategory }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);
  
  // Card Mouse Tilt Parallax States
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handleNext = () => {
    synthAudio.playClick();
    setActiveIndex((prev) => (prev + 1) % collections.length);
  };

  const handlePrev = () => {
    synthAudio.playClick();
    setActiveIndex((prev) => (prev - 1 + collections.length) % collections.length);
  };

  const selectIndex = (index: number) => {
    synthAudio.playClick();
    setActiveIndex(index);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5
    setTilt({ x: x * 15, y: -y * 15 }); // Max 15 degree tilt
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setHoveredCardIndex(null);
  };

  useEffect(() => {
    // Notify main page of filter selection change
    onSelectCategory(collections[activeIndex].category);
  }, [activeIndex, onSelectCategory]);

  return (
    <div className="w-full max-w-7xl mx-auto py-16 px-6 relative overflow-hidden glass rounded-2xl border border-white/5 bg-black/40">
      {/* Background colorful nebula */}
      <NebulaBackground />

      <div className="absolute top-6 left-8 font-mono text-[10px] tracking-[0.3em] text-accent-blue flex items-center gap-2">
        <Zap className="w-3 h-3 text-accent-purple animate-pulse" />
        02 // COLLECTIONS PORTAL
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-center relative z-10 min-h-[500px]">
        {/* Left Side: Sidebar Filter HUD (Active Theory Style) */}
        <div className="flex flex-col gap-4">
          <div className="text-xs font-mono text-silver tracking-widest mb-2">FILTER DATABASE //</div>
          {collections.map((item, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={item.id}
                onClick={() => selectIndex(idx)}
                onMouseEnter={() => synthAudio.playHover()}
                className={`text-left font-mono tracking-widest py-3 px-4 rounded border transition-all duration-300 relative overflow-hidden cursor-pointer ${
                  isActive
                    ? "border-accent-blue/40 text-white bg-accent-blue/5 glow-blue"
                    : "border-white/5 text-silver hover:text-white hover:border-white/10 bg-white/2"
                }`}
              >
                {/* Active scanbar */}
                {isActive && (
                  <motion.div
                    layoutId="active-bar"
                    className="absolute left-0 top-0 w-[3px] h-full bg-gradient-to-b from-accent-blue to-accent-purple"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <div className="flex justify-between items-center text-xs">
                  <span>0{idx + 1} // {item.name}</span>
                  {isActive && <ShieldCheck className="w-3.5 h-3.5 text-accent-purple" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Center/Right: 3D Stack Carousel */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center relative">
          
          {/* Card Showcase Arena with Perspective */}
          <div className="relative w-full max-w-[420px] h-[340px] flex items-center justify-center" style={{ perspective: 1200 }}>
            {collections.map((item, idx) => {
              // Calculate offset relative to active card
              let offset = idx - activeIndex;
              // Handle wrap-around
              if (offset < -1) offset += collections.length;
              if (offset > 1) offset -= collections.length;

              const isActive = idx === activeIndex;
              const isVisible = Math.abs(offset) <= 1;

              if (!isVisible) return null;

              // Rotate card based on index position (creates curved stack)
              const rotY = offset * 32;
              const transX = offset * 280;
              const transZ = isActive ? 50 : -140;
              const opac = isActive ? 1 : 0.35;
              const scale = isActive ? 1.05 : 0.85;

              return (
                <motion.div
                  key={item.id}
                  ref={isActive ? cardRef : null}
                  onMouseMove={isActive ? handleMouseMove : undefined}
                  onMouseLeave={isActive ? handleMouseLeave : undefined}
                  onMouseEnter={() => {
                    setHoveredCardIndex(idx);
                    synthAudio.playHover();
                  }}
                  onClick={() => !isActive && selectIndex(idx)}
                  className={`absolute w-full h-full rounded-2xl glass-premium border overflow-hidden p-8 flex flex-col justify-between cursor-pointer transition-shadow select-none ${
                    isActive 
                      ? "border-white/15 shadow-2xl shadow-black/80 ring-1 ring-white/5" 
                      : "border-white/5 pointer-events-auto"
                  }`}
                  style={{
                    background: item.imageBg,
                    zIndex: isActive ? 10 : 5,
                  }}
                  animate={{
                    rotateY: isActive ? tilt.x + rotY : rotY,
                    rotateX: isActive ? tilt.y : 0,
                    x: transX,
                    z: transZ,
                    scale: scale,
                    opacity: opac,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 180,
                    damping: 24,
                  }}
                >
                  {/* Glass reflective gloss sheen sweep */}
                  {isActive && hoveredCardIndex === idx && (
                    <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_1.8s_infinite] pointer-events-none" 
                      style={{ transform: 'skewX(-25deg)' }}
                    />
                  )}

                  {/* Top line detail */}
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-[9px] tracking-widest text-silver/60">
                      SORA LABS SPEC // 0{idx + 1}
                    </span>
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-blue animate-pulse" />
                  </div>

                  {/* Mid branding text */}
                  <div>
                    <h3 className="text-3xl font-bold tracking-tight text-white font-sans glow-text">
                      {item.name.split(" ")[0]}
                      <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-silver/40">
                        {item.name.split(" ").slice(1).join(" ")}
                      </span>
                    </h3>
                    <p className="font-mono text-xs text-accent-purple tracking-widest mt-1">
                      {item.tagline}
                    </p>
                  </div>

                  {/* Bottom line CTA button */}
                  <div className="flex justify-between items-end border-t border-white/5 pt-4">
                    <div className="flex flex-col">
                      <span className="font-mono text-[9px] text-silver/40">STATUS</span>
                      <span className="font-mono text-[10px] text-accent-blue tracking-widest font-semibold">
                        ACTIVE DROP
                      </span>
                    </div>
                    {isActive ? (
                      <Link
                        href={`/?category=${encodeURIComponent(item.category)}`}
                        onClick={(e) => {
                          synthAudio.playClick();
                        }}
                        className="px-4 py-2 bg-white text-black text-xs font-mono font-semibold rounded hover:bg-accent-blue hover:text-white transition-colors duration-300 pointer-events-auto"
                      >
                        EXPLORE DROP →
                      </Link>
                    ) : (
                      <span className="font-mono text-xs text-silver/40">SELECT</span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-6 mt-10">
            <button
              onClick={handlePrev}
              onMouseEnter={() => synthAudio.playHover()}
              className="p-3 rounded-full border border-white/5 bg-white/5 text-silver hover:text-white hover:border-white/20 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-xs tracking-[0.2em] text-silver">
              0{activeIndex + 1} / 0{collections.length}
            </span>
            <button
              onClick={handleNext}
              onMouseEnter={() => synthAudio.playHover()}
              className="p-3 rounded-full border border-white/5 bg-white/5 text-silver hover:text-white hover:border-white/20 transition-all cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
