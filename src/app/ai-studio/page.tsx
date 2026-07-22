"use client";

import React, { useState, useEffect } from "react";
import { useStore } from "@/context/StoreContext";
import { synthAudio } from "@/components/AudioEngine";
import { CustomCursor, BackgroundParticles } from "@/components/Effects";
import { Navbar } from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Cpu, Image as ImageIcon, Download, RefreshCw, Layers } from "lucide-react";

interface Avatar {
  id: string;
  name: string;
  description: string;
  color: string;
  bgHex: string;
  svgPath: string;
}

const AVATARS: Avatar[] = [
  {
    id: "hacker",
    name: "TOKYO SHADOW HACKER",
    description: "Sleek tactical techwear with electric visors, audio HUDs, and neon mesh overlays.",
    color: "var(--accent-blue)",
    bgHex: "#4f46e5",
    svgPath: "M50 15 L35 30 L38 52 L50 68 L62 52 L65 30 Z M38 34 H62 M45 42 H55",
  },
  {
    id: "raider",
    name: "SEOUL TECH RAIDER",
    description: "Cyberpunk urban cargo silhouette with modular harnesses, straps, and glowing lock hardware.",
    color: "var(--accent-blue)",
    bgHex: "#00ffcc",
    svgPath: "M50 12 L32 28 L35 68 L50 82 L65 68 L68 28 Z M40 32 L60 32 M45 45 L55 45 M40 60 H60",
  },
  {
    id: "punk",
    name: "CYBER HARAJUKU PUNK",
    description: "Decora-punk oversized statement fits styled with graffiti tags and glowing hair structures.",
    color: "var(--accent-purple)",
    bgHex: "#ff007f",
    svgPath: "M50 15 C35 15, 30 38, 35 55 C40 70, 60 70, 65 55 C70 38, 65 15, 50 15 Z M42 32 C45 32, 45 40, 42 40 M58 32 C55 32, 55 40, 58 40",
  },
  {
    id: "creator",
    name: "NEO-MINIMALIST CREATOR",
    description: "Monochromatic high-collar architectural silhouettes in clean, structural chrome silver fits.",
    color: "var(--silver)",
    bgHex: "#bfc3c9",
    svgPath: "M50 18 L38 28 L40 72 L50 78 L60 72 L62 28 Z M45 32 A 5 5 0 1 1 55 32",
  },
];

export default function AIFashionStudio() {
  const { products } = useStore();
  const apparelItems = products.slice(0, 4);

  const [selectedAvatar, setSelectedAvatar] = useState<Avatar>(AVATARS[0]);
  const [selectedApparel, setSelectedApparel] = useState(apparelItems[0] || null);
  const [generationStage, setGenerationStage] = useState<"idle" | "generating" | "completed">("idle");
  const [logs, setLogs] = useState<string[]>([]);
  const [logIndex, setLogIndex] = useState(0);

  const mockLogs = [
    "[SYSTEM] DETECTING SELECTION NODE PRE-REQUISITES...",
    `[SYSTEM] CONNECTING TO SORA NODE MODEL [${selectedAvatar.id.toUpperCase()}]`,
    `[SYSTEM] COMPILING APPAREL SHADER LAYER [${selectedApparel?.name.toUpperCase()}]`,
    "[MODEL] EXTRUDING 3D TEXTURE MATRICES (450GSM Terry Cotton)...",
    "[MODEL] CALCULATING RAY-TRACED AMBIENT CORNER REFLECTIONS...",
    "[STABLE_DIFFUSION] INJECTING CHROMATIC ABERRATIONS...",
    "[SYSTEM] GENERATION STABLE. COMPILING INSTAGRAM PACKS...",
  ];

  const handleGenerate = () => {
    synthAudio.playWhoosh();
    setGenerationStage("generating");
    setLogs([]);
    setLogIndex(0);
  };

  useEffect(() => {
    if (generationStage !== "generating") return;

    if (logIndex < mockLogs.length) {
      const timer = setTimeout(() => {
        setLogs((prev) => [...prev, mockLogs[logIndex]]);
        setLogIndex(logIndex + 1);
        synthAudio.playClick();
      }, 350);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        synthAudio.playChime();
        setGenerationStage("completed");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [generationStage, logIndex]);

  const handleExport = () => {
    synthAudio.playChime();
    
    // Simulate Image Download
    const element = document.createElement("a");
    const file = new Blob([
      `SORA FAMILY INSTAGRAM RENDER\n\nAvatar: ${selectedAvatar.name}\nApparel: ${selectedApparel?.name}\nStatus: Certified Authentic // SORA AI Studio\nDate: ${new Date().toLocaleDateString()}`
    ], { type: "text/plain" });
    
    element.href = URL.createObjectURL(file);
    element.download = `sora_studio_${selectedAvatar.id}_${selectedApparel?.id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white pb-20 relative overflow-hidden">
      <CustomCursor />
      <BackgroundParticles />
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-32 relative z-10">
        
        {/* Header HUD info */}
        <div className="border-b border-white/5 pb-8 mb-12 flex flex-col md:flex-row justify-between items-start md:items-end">
          <div>
            <span className="font-mono text-[9px] text-accent-blue tracking-[0.4em] font-semibold uppercase block mb-2">
              SORA EXPERIMENTAL LAB // v2.0
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight uppercase">
              AI Fashion Studio
            </h1>
            <p className="font-mono text-[10px] text-silver/60 mt-2">
              See yourself in SORA. Generate virtual streetwear lookbooks instantly.
            </p>
          </div>
          <div className="mt-4 md:mt-0 font-mono text-[9px] text-silver/40">
            STABLE_DIFFUSION_NODE // CORE.ONLINE
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT: AVATAR & APPAREL SELECTORS (8 columns) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* 1. SELECT AVATAR MODELLING CONFIG */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <Cpu className="w-4 h-4 text-accent-blue" />
                <span className="font-mono text-xs font-semibold tracking-wider">01 // SELECT VIRTUAL MODEL MODEL</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {AVATARS.map((av) => {
                  const isSelected = selectedAvatar.id === av.id;
                  return (
                    <button
                      key={av.id}
                      onClick={() => {
                        synthAudio.playClick();
                        setSelectedAvatar(av);
                        if (generationStage === "completed") setGenerationStage("idle");
                      }}
                      className={`glass p-5 rounded-2xl border text-left cursor-pointer transition-all relative overflow-hidden group ${
                        isSelected
                          ? "border-accent-blue bg-accent-blue/5"
                          : "border-white/5 hover:border-white/15 bg-white/2"
                      }`}
                    >
                      {/* Color accents glow */}
                      <div
                        className="absolute -right-10 -top-10 w-24 h-24 rounded-full opacity-5 group-hover:opacity-10 transition-opacity blur-2xl"
                        style={{ backgroundColor: av.bgHex }}
                      />
                      
                      <div className="font-mono text-xs font-bold text-white mb-1">
                        {av.name}
                      </div>
                      <p className="font-sans text-[10px] text-silver/70 leading-relaxed">
                        {av.description}
                      </p>
                      
                      {isSelected && (
                        <div className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-accent-blue glow-blue" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. SELECT APPAREL MOCK (SORA CLOTHES) */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <Layers className="w-4 h-4 text-accent-purple" />
                <span className="font-mono text-xs font-semibold tracking-wider">02 // CHOOSE STREETWEAR PIECE</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {apparelItems.map((item) => {
                  const isSelected = selectedApparel?.id === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        synthAudio.playClick();
                        setSelectedApparel(item);
                        if (generationStage === "completed") setGenerationStage("idle");
                      }}
                      className={`glass p-4 rounded-xl border text-center cursor-pointer transition-all ${
                        isSelected
                          ? "border-accent-purple bg-accent-purple/5"
                          : "border-white/5 hover:border-white/10 bg-white/2"
                      }`}
                    >
                      {/* Schematic Apparel Icon */}
                      <svg viewBox="0 0 100 100" className="w-12 h-12 mx-auto mb-2 text-silver/50">
                        <path
                          d="M30 30 L40 25 L50 28 L60 25 L70 30 L66 70 L60 70 L50 73 L40 70 Z"
                          fill="none"
                          stroke={isSelected ? "var(--accent-purple)" : "currentColor"}
                          strokeWidth="2.5"
                        />
                      </svg>
                      <div className="font-mono text-[9px] font-semibold text-white tracking-tight uppercase truncate">
                        {item.name.replace("SORA ", "")}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* GENERATE ACTION BUTTON */}
            <div className="pt-4">
              <button
                onClick={handleGenerate}
                disabled={generationStage === "generating" || !selectedApparel}
                className="w-full py-4 bg-gradient-to-r from-accent-blue to-accent-purple text-white font-mono text-xs font-bold tracking-widest rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-accent-blue/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles className="w-4 h-4 animate-pulse" />
                GENERATE AI MODEL PREVIEW
              </button>
            </div>

          </div>

          {/* RIGHT: LIVE SCANNER PREVIEW BOX (5 columns) */}
          <div className="lg:col-span-5">
            <div className="glass border border-white/5 rounded-3xl aspect-[3/4] relative flex flex-col items-center justify-center p-8 bg-black/50 overflow-hidden">
              
              {/* Grid scanner background lines */}
              <div className="absolute inset-0 grid-grid opacity-10" />

              <AnimatePresence mode="wait">
                
                {/* IDLE VIEW STATE */}
                {generationStage === "idle" && (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center space-y-4 p-6"
                  >
                    <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center mx-auto bg-white/2">
                      <ImageIcon className="w-6 h-6 text-silver/40" />
                    </div>
                    <div>
                      <h3 className="font-mono text-xs font-bold text-white tracking-widest uppercase">
                        Render Preview Awaiting
                      </h3>
                      <p className="font-sans text-[10px] text-silver/50 mt-2 leading-relaxed max-w-[240px] mx-auto">
                        Configure your avatar profile and apparel layout, then click generate to compile.
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* GENERATING / SCROLLING LOGS STATE */}
                {generationStage === "generating" && (
                  <motion.div
                    key="generating"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full flex flex-col justify-between"
                  >
                    {/* Matrix Laser Scanning line bar */}
                    <div className="absolute left-0 w-full h-[3px] bg-accent-blue/60 blur-[1px] animate-[scan_2s_infinite] shadow-lg shadow-accent-blue" />
                    
                    {/* Display current avatar schema outline */}
                    <div className="flex-grow flex items-center justify-center relative">
                      <svg viewBox="0 0 100 100" className="w-40 h-40 text-accent-blue/20 animate-pulse">
                        <path d={selectedAvatar.svgPath} fill="none" stroke="currentColor" strokeWidth="2" />
                      </svg>
                    </div>

                    {/* Live Scrolling Terminal compiler logs */}
                    <div className="bg-black/60 border border-white/5 rounded-xl p-4 font-mono text-[8px] text-accent-blue/80 h-32 overflow-y-auto space-y-1.5 selection:bg-accent-blue selection:text-black">
                      {logs.map((log, idx) => (
                        <div key={idx} className="animate-fade-in flex items-center gap-1.5">
                          <span className="text-white/30">&gt;</span>
                          <span>{log}</span>
                        </div>
                      ))}
                      <div className="w-2 h-3 bg-accent-blue animate-pulse inline-block" />
                    </div>
                  </motion.div>
                )}

                {/* GENERATED COMPLETED RESULTS */}
                {generationStage === "completed" && (
                  <motion.div
                    key="completed"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full flex flex-col justify-between"
                  >
                    {/* Styled AI Generation Card */}
                    <div 
                      className="flex-grow glass border border-white/10 rounded-2xl p-6 relative flex flex-col justify-between overflow-hidden shadow-2xl"
                      style={{
                        background: `linear-gradient(135deg, rgba(13, 13, 13, 0.9) 0%, ${selectedAvatar.bgHex}25 100%)`
                      }}
                    >
                      {/* Avatar glow halo */}
                      <div 
                        className="absolute -right-20 -bottom-20 w-48 h-48 rounded-full blur-[80px] opacity-40" 
                        style={{ backgroundColor: selectedAvatar.bgHex }}
                      />

                      {/* Header details */}
                      <div className="flex justify-between items-start font-mono text-[8px] text-silver/60">
                        <div>SORA_STUDIO // RENDER_AUT01</div>
                        <div>GEN_DATE: {new Date().toLocaleDateString()}</div>
                      </div>

                      {/* Mid Schematic Graphic layout */}
                      <div className="my-auto flex flex-col items-center justify-center relative py-4">
                        {/* Glow outline avatar badge */}
                        <div className="relative">
                          <div 
                            className="absolute inset-0 rounded-full blur-xl opacity-35"
                            style={{ backgroundColor: selectedAvatar.bgHex }}
                          />
                          <svg viewBox="0 0 100 100" className="w-36 h-36 relative z-10 transition-colors" style={{ color: selectedAvatar.bgHex }}>
                            <path d={selectedAvatar.svgPath} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                            {/* Overlayed item icon */}
                            <g transform="translate(35, 45) scale(0.3)">
                              <path d="M30 30 L40 25 L50 28 L60 25 L70 30 L66 70 L60 70 L50 73 L40 70 Z" fill="none" stroke="#ffffff" strokeWidth="4" />
                            </g>
                          </svg>
                        </div>
                        
                        <div className="font-mono text-[9px] text-white font-bold tracking-widest mt-4 uppercase">
                          {selectedAvatar.name}
                        </div>
                        <div className="font-mono text-[7px] text-silver/60 tracking-wider uppercase mt-1">
                          fitted in: {selectedApparel?.name}
                        </div>
                      </div>

                      {/* Bottom certification tags */}
                      <div className="flex justify-between items-end border-t border-white/5 pt-4">
                        <div className="font-mono text-[7px]">
                          <span className="text-accent-blue font-bold">CERTIFIED</span> // STREET_INTELLIGENCE
                        </div>
                        <div className="bg-white/10 px-2 py-0.5 rounded text-[6px] font-mono text-white font-bold uppercase">
                          STUDIO DROP
                        </div>
                      </div>
                    </div>

                    {/* Export / Re-generate buttons */}
                    <div className="flex gap-3 mt-5">
                      <button
                        onClick={handleExport}
                        className="flex-grow py-3 bg-white text-black font-mono text-[10px] font-bold tracking-wider rounded-xl flex items-center justify-center gap-1.5 hover:bg-silver transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        EXPORT INSTAGRAM-READY
                      </button>
                      <button
                        onClick={() => {
                          synthAudio.playClick();
                          setGenerationStage("idle");
                        }}
                        className="p-3 border border-white/15 rounded-xl hover:bg-white/5 transition-colors cursor-pointer text-silver hover:text-white"
                        title="Reset model options"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </motion.div>
                )}

              </AnimatePresence>

            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
