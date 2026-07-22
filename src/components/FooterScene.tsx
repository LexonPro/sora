"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function AmbientParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 3000;
  const radius = 8;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const r = radius * Math.cbrt(u);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [count, radius]);

  useFrame(() => {
    if (!pointsRef.current) return;
    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const yIdx = i * 3 + 1;
      array[yIdx] += 0.001;
      if (array[yIdx] > radius) {
        array[yIdx] = -radius;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#F0EDE8"
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function FooterScene() {
  const links = ["About", "Shipping", "Returns", "Contact", "Terms"];

  return (
    <footer className="relative w-full h-screen flex flex-col justify-between overflow-hidden bg-void text-bone select-none">
      {/* Background WebGL Particle Field */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 60 }}
          gl={{ antialias: true, alpha: true }}
        >
          <fog attach="fog" args={["#050505", 4, 12]} />
          <AmbientParticles />
        </Canvas>
      </div>

      {/* Top CTA Area */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4">
        <h2 className="font-display text-4xl sm:text-5xl font-light tracking-wider text-bone mb-8">
          Enter the Collection
        </h2>
        <a
          href="#shop"
          data-cursor="pointer"
          className="inline-flex items-center justify-center rounded-full border border-bone/20 px-8 py-3 font-mono text-xs tracking-[0.3em] text-bone hover:bg-bone hover:text-void transition duration-300"
        >
          SHOP NOW
        </a>
      </div>

      {/* Bottom Footer Info Bar */}
      <div className="relative z-10 py-8 px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="font-mono text-[10px] text-bone/20">
          SORA © 2025
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-6 font-mono text-[10px] text-bone/20 tracking-wider">
          {links.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              data-cursor="pointer"
              className="hover:text-bone transition-colors duration-200"
            >
              {link}
            </a>
          ))}
        </nav>

        <div className="font-mono text-[10px] text-bone/20">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="pointer"
            className="hover:text-bone transition-colors duration-200"
          >
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
}
