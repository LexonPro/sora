"use client";

import React, { useState, useEffect } from "react";
import { synthAudio } from "./AudioEngine";

interface GlitchOverlayProps {
  trigger: any;
}

export const GlitchOverlay: React.FC<GlitchOverlayProps> = ({ trigger }) => {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    // Skip initial mount trigger
    if (trigger === undefined) return;

    setIsGlitching(true);
    synthAudio.playGlitch();

    const timer = setTimeout(() => {
      setIsGlitching(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [trigger]);

  if (!isGlitching) return null;

  return (
    <div className="fixed inset-0 z-[110] pointer-events-none overflow-hidden select-none">
      {/* 1. Full-screen Static Noise Layer */}
      <div 
        className="absolute inset-0 bg-black/40 opacity-70 animate-[pulse_0.05s_infinite]" 
        style={{
          backgroundImage: `repeating-radial-gradient(circle, rgba(255,255,255,0.08) 0px, rgba(0,0,0,0.5) 4px)`,
          backgroundSize: '10px 10px'
        }}
      />

      {/* 2. Displaced Color Bands (Chromatic Aberration style) */}
      <div className="absolute top-1/4 left-0 w-full h-8 bg-accent-blue/20 blur-[2px] -skew-y-3 translate-x-4 animate-[ping_0.1s_infinite]" />
      <div className="absolute top-2/3 left-0 w-full h-12 bg-accent-purple/20 blur-[1px] skew-y-6 -translate-x-6 animate-[pulse_0.08s_infinite]" />
      <div className="absolute top-1/2 left-0 w-full h-4 bg-white/20 blur-[3px] -translate-y-10 translate-x-2 animate-[ping_0.12s_infinite]" />

      {/* 3. Horizontal scanline screen-tear overlays */}
      <div className="absolute inset-0 flex flex-col justify-between">
        <div className="w-full h-[30vh] bg-[#0d0d0d]/80 border-b border-accent-blue/30 translate-x-3" />
        <div className="w-full h-[40vh] bg-[#0d0d0d]/70 border-y border-accent-purple/30 -translate-x-4" />
        <div className="w-full h-[30vh] bg-[#0d0d0d]/80 border-t border-white/20 translate-x-1" />
      </div>

      {/* 4. Telemetry loading coordinates text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-[10px] text-white tracking-[0.5em] glow-text animate-pulse">
        [ SYS.TRANSITION.SYNC_TEAR ]
      </div>
    </div>
  );
};
