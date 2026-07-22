"use client";

import React, { useState, useEffect, useRef } from "react";

export const HUDOverlay: React.FC = () => {
  const [fps, setFps] = useState(60);
  const [resolution, setResolution] = useState("1920x1080");
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  // FPS calculations
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Set initial resolution
    setResolution(`${window.innerWidth}x${window.innerHeight}`);

    const handleResize = () => {
      setResolution(`${window.innerWidth}x${window.innerHeight}`);
    };

    const handleMouseMove = (e: MouseEvent) => {
      setCoords({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    // Loop for FPS
    let animId: number;
    const tick = (time: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = time;
      }
      
      frameCountRef.current++;
      
      if (time - lastTimeRef.current >= 1000) {
        const calculatedFps = Math.round((frameCountRef.current * 1000) / (time - lastTimeRef.current));
        setFps(Math.min(calculatedFps, 60)); // Cap at 60 for consistency on high-refresh monitors
        frameCountRef.current = 0;
        lastTimeRef.current = time;
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-40 font-mono text-[8px] text-silver/30 select-none">
      {/* Top Left: System info */}
      <div className="absolute top-6 left-28 hidden md:block">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-blue animate-ping" />
          <span>SYS.TELEMETRY: ACTIVE</span>
        </div>
      </div>

      {/* Top Right: Viewport details */}
      <div className="absolute top-6 right-28 hidden md:block text-right">
        <span>RES: {resolution} // GRID: POSIX</span>
      </div>

      {/* Bottom Left: Live cursor coordinates and FPS */}
      <div className="absolute bottom-6 left-6 space-y-1">
        <div>FPS: <span className="text-white/60 font-bold">{fps}</span></div>
        <div className="hidden sm:block">
          CRSR_X: <span className="text-white/40">{coords.x.toString().padStart(4, "0")}</span> // 
          CRSR_Y: <span className="text-white/40"> {coords.y.toString().padStart(4, "0")}</span>
        </div>
      </div>

      {/* Bottom Right: Core Status logs */}
      <div className="absolute bottom-6 right-6 text-right space-y-1 hidden sm:block">
        <div>GRID_RENDERER: R3F_WebGL</div>
        <div>PAYMENTS: RAZORPAY_3DSECURE</div>
        <div className="text-accent-purple/50">SECURE REGISTRY: CONNECTED</div>
      </div>

      {/* Decorative frame corners */}
      <div className="absolute top-20 left-6 w-3 h-[1px] bg-white/10" />
      <div className="absolute top-20 left-6 w-[1px] h-3 bg-white/10" />

      <div className="absolute top-20 right-6 w-3 h-[1px] bg-white/10" />
      <div className="absolute top-20 right-6 w-[1px] h-3 bg-white/10" />

      <div className="absolute bottom-20 left-6 w-3 h-[1px] bg-white/10" />
      <div className="absolute bottom-20 left-6 w-[1px] h-3 bg-white/10" />

      <div className="absolute bottom-20 right-6 w-3 h-[1px] bg-white/10" />
      <div className="absolute bottom-20 right-6 w-[1px] h-3 bg-white/10" />
    </div>
  );
};
