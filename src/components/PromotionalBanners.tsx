"use client";

import React, { useState, useEffect } from "react";
import { Zap, AlertTriangle, ShieldCheck } from "lucide-react";
import { synthAudio } from "./AudioEngine";
import { useStore } from "@/context/StoreContext";

export const NewDropCountdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 24,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Set a static countdown (e.g. counting down from 24 hours)
    const targetTime = new Date();
    targetTime.setHours(targetTime.getHours() + 23);
    targetTime.setMinutes(targetTime.getMinutes() + 59);
    targetTime.setSeconds(targetTime.getSeconds() + 59);

    const timer = setInterval(() => {
      const difference = targetTime.getTime() - new Date().getTime();
      
      if (difference <= 0) {
        clearInterval(timer);
        return;
      }

      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full py-16 px-6 relative overflow-hidden bg-gradient-to-b from-[#0d0d0d] to-black">
      <div className="absolute inset-0 pointer-events-none hud-grid opacity-[0.02]" />

      <div className="max-w-5xl mx-auto glass border border-white/5 rounded-2xl p-8 flex flex-col md:flex-row justify-between items-center gap-8 relative z-10 bg-black/60 shadow-lg">
        {/* Banner Text */}
        <div className="text-center md:text-left">
          <span className="font-mono text-[9px] text-accent-purple tracking-[0.3em] font-semibold flex items-center justify-center md:justify-start gap-2 mb-2">
            <Zap className="w-3.5 h-3.5 text-accent-purple animate-pulse" />
            TELEMETRY SYSTEM // ACTIVE TELECAST
          </span>
          <h3 className="text-2xl md:text-3xl font-extrabold tracking-wide text-white font-sans">
            NEXT DROP COUNTDOWN
          </h3>
          <p className="font-mono text-xs text-silver mt-2">
            Limited cyber streetwear editions drop in limited slots.
          </p>
        </div>

        {/* Countdown digits */}
        <div className="flex gap-4 font-mono text-center select-none">
          {[
            { label: "HRS", val: timeLeft.hours },
            { label: "MIN", val: timeLeft.minutes },
            { label: "SEC", val: timeLeft.seconds },
          ].map((item, idx) => (
            <div key={idx} className="flex gap-4 items-center">
              <div className="flex flex-col">
                <div className="bg-white/3 border border-white/10 rounded-xl w-16 h-16 md:w-20 md:h-20 flex items-center justify-center text-2xl md:text-3xl font-bold text-white shadow-xl glow-blue">
                  {item.val.toString().padStart(2, "0")}
                </div>
                <span className="text-[9px] text-silver/60 tracking-widest mt-2">{item.label}</span>
              </div>
              {idx < 2 && (
                <span className="text-2xl font-bold text-accent-purple animate-pulse mb-6">:</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const LimitedEditionBanner: React.FC = () => {
  const { products } = useStore();
  
  // Find low stock item
  const lowStockItem = products.find((p) => p.stock <= 5) || products[0];

  if (!lowStockItem) return null;

  return (
    <div className="w-full py-6 bg-gradient-to-r from-accent-blue/10 via-[#0d0d0d] to-accent-purple/10 border-y border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs">
        
        {/* Warning label */}
        <div className="flex items-center gap-3 text-white">
          <AlertTriangle className="w-5 h-5 text-accent-purple animate-bounce" />
          <div>
            <span className="text-accent-purple font-bold">LIMITED TELEMETRY WARNING: </span>
            <span className="text-silver">The product <span className="text-white font-semibold">{lowStockItem.name}</span> is depleting fast!</span>
          </div>
        </div>

        {/* Live inventory counter */}
        <div className="flex items-center gap-4">
          <div className="bg-white/5 border border-white/10 rounded px-3 py-1.5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="text-[10px] text-red-500 font-bold tracking-widest">
              ONLY {lowStockItem.stock} UNITS LEFT IN STOCK
            </span>
          </div>
          <span className="text-silver/40">|</span>
          <div className="flex items-center gap-1.5 text-silver/80">
            <ShieldCheck className="w-4 h-4 text-accent-blue" />
            <span className="text-[10px]">VERIFIED INVENTORY</span>
          </div>
        </div>

      </div>
    </div>
  );
};
