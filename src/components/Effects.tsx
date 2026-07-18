"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export const CustomCursor: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 30, stiffness: 250, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable = 
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest(".interactive") ||
        target.getAttribute("role") === "button";
      
      setIsHovered(!!isClickable);
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [cursorX, cursorY, isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer Ring */}
      <motion.div
        className="custom-cursor"
        style={{
          left: cursorXSpring,
          top: cursorYSpring,
          borderColor: isHovered ? "var(--accent-blue)" : "rgba(255, 255, 255, 0.4)",
          backgroundColor: isHovered ? "rgba(79, 70, 229, 0.1)" : "rgba(255, 255, 255, 0)",
          borderWidth: isHovered ? "1px" : "2px",
          width: isHovered ? 45 : isClicked ? 15 : 20,
          height: isHovered ? 45 : isClicked ? 15 : 20,
        }}
      />
      {/* Inner Dot */}
      <motion.div
        className="custom-cursor-dot"
        style={{
          left: cursorX,
          top: cursorY,
          scale: isHovered ? 1.5 : isClicked ? 0.7 : 1,
          backgroundColor: isHovered ? "var(--accent-purple)" : "#ffffff",
        }}
      />
    </>
  );
};

export const BackgroundParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      alpha: number;
      color: string;
    }> = [];

    const colors = ["#bfc3c9", "#4f46e5", "#a855f7", "#ffffff"];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Initialize particles
    const particleCount = 120;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.8 + 0.4,
        speedX: Math.random() * 0.4 - 0.2,
        speedY: -(Math.random() * 0.5 + 0.1),
        alpha: Math.random() * 0.5 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        // Move particle
        p.x += p.speedX;
        p.y += p.speedY;

        // Reset if goes off top
        if (p.y < 0) {
          p.y = canvas.height;
          p.x = Math.random() * canvas.width;
        }

        // Reset if goes off sides
        if (p.x < 0 || p.x > canvas.width) {
          p.x = Math.random() * canvas.width;
        }

        // Mouse repelling physics
        const dx = p.x - mouseRef.current.x;
        const dy = p.y - mouseRef.current.y;
        const distance = Math.hypot(dx, dy);
        const maxDist = 120;

        if (distance < maxDist) {
          const force = (maxDist - distance) / maxDist;
          p.x += (dx / distance) * force * 2;
          p.y += (dy / distance) * force * 2;
        }

        // Draw particle
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        
        // Add subtle neon glow to colored particles
        if (p.color === "#4f46e5" || p.color === "#a855f7") {
          ctx.shadowBlur = 4;
          ctx.shadowColor = p.color;
        }
        
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-40 bg-[#0D0D0D]"
    />
  );
};
