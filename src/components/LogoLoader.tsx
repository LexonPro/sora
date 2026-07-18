"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { synthAudio } from "./AudioEngine";

export const LogoLoader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<"loading" | "complete" | "fade">("loading");

  useEffect(() => {
    // Increment percentage dynamically
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setStage("complete");
          
          // Sound trigger for intro complete
          setTimeout(() => {
            synthAudio.playChime();
            setStage("fade");
          }, 400);

          setTimeout(() => {
            onComplete();
          }, 1200);
          return 100;
        }
        
        // Random ticks for tech authenticity
        const increment = Math.floor(Math.random() * 8) + 2;
        if (Math.random() > 0.3) {
          synthAudio.playClick();
        }
        return Math.min(100, prev + increment);
      });
    }, 80);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {stage !== "fade" && (
        <motion.div
          className="fixed inset-0 bg-[#0D0D0D] z-[9999] flex flex-col items-center justify-center select-none"
          exit={{ y: "-100%" }}
          transition={{ ease: [0.76, 0, 0.24, 1], duration: 0.8 }}
        >
          {/* HUD Tech background grids */}
          <div className="absolute inset-0 pointer-events-none hud-grid opacity-[0.03]" />

          {/* SORA geometric logo container */}
          <div className="flex flex-col items-center relative">
            
            {/* Holographic Glowing Rings */}
            <motion.div 
              className="w-24 h-24 rounded-full border border-accent-blue/20 absolute -top-4 glow-blue"
              animate={{ rotate: 360, scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
            />
            <motion.div 
              className="w-24 h-24 rounded-full border border-accent-purple/20 absolute -top-4 glow-purple"
              animate={{ rotate: -360, scale: [1.05, 1, 1.05] }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            />

            {/* SORA Logo text */}
            <motion.div
              className="text-6xl font-bold tracking-[0.3em] font-sans text-white text-center ml-[0.3em]"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              SORA
            </motion.div>
            
            <div className="text-[10px] font-mono tracking-[0.5em] text-silver/40 mt-3 ml-[0.5em] uppercase">
              Streetwear Beyond Limits
            </div>
          </div>

          {/* Loading progress bars & digital ticker */}
          <div className="mt-16 w-64 flex flex-col items-center gap-3">
            {/* Status Info */}
            <div className="w-full flex justify-between font-mono text-[9px] text-silver/60">
              <span>SYSTEM BOOTSTRAP</span>
              <span>{progress.toString().padStart(3, "0")}%</span>
            </div>

            {/* Micro progress line */}
            <div className="w-full h-[1px] bg-white/5 relative overflow-hidden">
              <motion.div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-accent-blue to-accent-purple"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Small status messages */}
            <div className="font-mono text-[8px] text-accent-blue/80 tracking-widest uppercase h-3">
              {progress < 30 && "Syncing core modules..."}
              {progress >= 30 && progress < 60 && "Loading WebGL environment..."}
              {progress >= 60 && progress < 90 && "Initializing 3D showrooms..."}
              {progress >= 90 && progress < 100 && "Opening portal..."}
              {progress === 100 && "READY TO TRANSCEND"}
            </div>
          </div>

          {/* Decorative Corner lines */}
          <div className="absolute top-8 left-8 w-6 h-6 border-l border-t border-white/10" />
          <div className="absolute top-8 right-8 w-6 h-6 border-r border-t border-white/10" />
          <div className="absolute bottom-8 left-8 w-6 h-6 border-l border-b border-white/10" />
          <div className="absolute bottom-8 right-8 w-6 h-6 border-r border-b border-white/10" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
