"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [visible, setVisible] = useState(true);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const leftHalfRef = useRef<HTMLDivElement>(null);
  const rightHalfRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setVisible(false);
          onComplete();
        },
      });

      const counterObj = { value: 1 };

      // Animate counter and progress bar
      tl.to(
        counterObj,
        {
          value: 100,
          duration: 2,
          ease: "power2.inOut",
          onUpdate: () => {
            if (counterRef.current) {
              counterRef.current.innerText = Math.floor(counterObj.value)
                .toString()
                .padStart(3, "0");
            }
          },
        },
        0
      );

      tl.to(
        progressBarRef.current,
        {
          width: "100%",
          duration: 2,
          ease: "power2.inOut",
        },
        0
      );

      // Fade out content
      tl.to(
        [textRef.current, counterRef.current, progressContainerRef.current],
        {
          opacity: 0,
          y: (i, target) => (target === textRef.current ? -20 : 0),
          duration: 0.5,
          ease: "power2.inOut",
        },
        "+=0.3"
      );

      // Split background
      tl.to(
        leftHalfRef.current,
        {
          xPercent: -100,
          duration: 1,
          ease: "power3.inOut",
        },
        "-=0.2"
      );

      tl.to(
        rightHalfRef.current,
        {
          xPercent: 100,
          duration: 1,
          ease: "power3.inOut",
        },
        "<"
      );
    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex pointer-events-auto"
      aria-hidden="true"
    >
      {/* Left and Right Halves */}
      <div ref={leftHalfRef} className="w-1/2 h-full bg-[#050505]" />
      <div ref={rightHalfRef} className="w-1/2 h-full bg-[#050505]" />

      {/* Overlay Content */}
      <div
        ref={contentRef}
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
      >
        <h1
          ref={textRef}
          className="text-[#F0EDE8] uppercase font-light tracking-[0.5em] text-[4vw]"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          SORA
        </h1>

        <div className="absolute bottom-8 left-8">
          <span
            ref={counterRef}
            className="text-[12px] font-mono text-[#F0EDE8]/30"
          >
            001
          </span>
        </div>

        <div
          ref={progressContainerRef}
          className="absolute bottom-8 right-8 w-64 sm:w-80 h-[1px] bg-[#F0EDE8]/10 overflow-hidden"
        >
          <div ref={progressBarRef} className="h-full bg-[#D4A853] w-0" />
        </div>
      </div>
    </div>
  );
}
