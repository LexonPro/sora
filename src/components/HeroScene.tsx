"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ─── Particle Cloud that forms "SORA" ─── */
function ParticleField() {
  const meshRef = useRef<THREE.Points>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();

  // Generate target positions that spell "SORA" using simple grid sampling
  const { positions, targets, colors, count } = useMemo(() => {
    const canvas = document.createElement("canvas");
    const size = 512;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;

    // Draw "SORA" on offscreen canvas
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 160px 'Space Grotesk', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("SORA", size / 2, size / 2);

    const imageData = ctx.getImageData(0, 0, size, size).data;

    // Sample white pixels as target positions
    const targetList: number[] = [];
    const step = 3; // Sample every 3rd pixel for density
    for (let y = 0; y < size; y += step) {
      for (let x = 0; x < size; x += step) {
        const idx = (y * size + x) * 4;
        if (imageData[idx] > 128) {
          // Map pixel coords to 3D space
          const px = ((x / size) - 0.5) * 12;
          const py = -((y / size) - 0.5) * 4;
          const pz = (Math.random() - 0.5) * 0.5;
          targetList.push(px, py, pz);
        }
      }
    }

    const n = Math.min(targetList.length / 3, 12000);
    const pos = new Float32Array(n * 3);
    const tgt = new Float32Array(n * 3);
    const col = new Float32Array(n * 3);

    const boneColor = new THREE.Color("#F0EDE8");
    const amberColor = new THREE.Color("#D4A853");

    for (let i = 0; i < n; i++) {
      // Start scattered
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;

      // Target from text sampling
      const si = (i % (targetList.length / 3)) * 3;
      tgt[i * 3] = targetList[si];
      tgt[i * 3 + 1] = targetList[si + 1];
      tgt[i * 3 + 2] = targetList[si + 2];

      // Color: mix bone and amber
      const mix = Math.random();
      const c = mix < 0.85 ? boneColor : amberColor;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }

    return { positions: pos, targets: tgt, colors: col, count: n };
  }, []);

  // Track convergence progress
  const progressRef = useRef(0);
  const scrollRef = useRef(0);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };

    const handleScroll = () => {
      scrollRef.current = window.scrollY / window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouse);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const geo = meshRef.current.geometry;
    const posAttr = geo.attributes.position as THREE.BufferAttribute;
    const posArr = posAttr.array as Float32Array;

    // Converge progress: ramp up over first 2 seconds, then hold
    progressRef.current = Math.min(progressRef.current + delta * 0.4, 1.0);
    const convergence = progressRef.current;

    // Scroll dispersion: particles scatter as user scrolls past hero
    const scrollDisperse = Math.min(scrollRef.current * 1.5, 1.0);
    const effectiveConvergence = convergence * (1 - scrollDisperse);

    const mx = mouseRef.current.x * viewport.width * 0.5;
    const my = mouseRef.current.y * viewport.height * 0.5;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Lerp toward target
      const tx = targets[i3];
      const ty = targets[i3 + 1];
      const tz = targets[i3 + 2];

      // Current position
      let cx = posArr[i3];
      let cy = posArr[i3 + 1];
      let cz = posArr[i3 + 2];

      // Target (or scattered based on scroll)
      const finalX = tx + scrollDisperse * (Math.sin(i * 0.1 + state.clock.elapsedTime) * 10);
      const finalY = ty + scrollDisperse * (Math.cos(i * 0.13 + state.clock.elapsedTime) * 8);
      const finalZ = tz + scrollDisperse * (Math.sin(i * 0.07) * 6);

      // Lerp
      const lerpSpeed = 0.02 + effectiveConvergence * 0.03;
      cx += (finalX - cx) * lerpSpeed;
      cy += (finalY - cy) * lerpSpeed;
      cz += (finalZ - cz) * lerpSpeed;

      // Mouse repulsion (only when converged)
      if (effectiveConvergence > 0.3) {
        const dx = cx - mx;
        const dy = cy - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const repulseRadius = 2.0;
        if (dist < repulseRadius && dist > 0.01) {
          const force = (1 - dist / repulseRadius) * 0.15;
          cx += (dx / dist) * force;
          cy += (dy / dist) * force;
        }
      }

      posArr[i3] = cx;
      posArr[i3 + 1] = cy;
      posArr[i3 + 2] = cz;
    }

    posAttr.needsUpdate = true;

    // Subtle rotation
    meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.1) * 0.01;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ─── Camera breathing ─── */
function CameraRig() {
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    state.camera.position.z = 6 + Math.sin(t * 0.3) * 0.15;
    state.camera.position.y = Math.sin(t * 0.2) * 0.05;
  });
  return null;
}

/* ─── Exported Hero Scene ─── */
export default function HeroScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <fog attach="fog" args={["#050505", 5, 14]} />
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 3, 5]} intensity={0.4} color="#D4A853" />
        <ParticleField />
        <CameraRig />
      </Canvas>
    </div>
  );
}
