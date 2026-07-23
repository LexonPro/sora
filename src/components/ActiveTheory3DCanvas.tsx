"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ModelProps {
  color: string;
  isZoomed: boolean;
  showBackView: boolean;
  showFabricCloseUp: boolean;
  userRotationY: number;
}

function FloatingHoodieModel({
  color,
  isZoomed,
  showBackView,
  showFabricCloseUp,
  userRotationY,
}: ModelProps) {
  const meshGroup = useRef<THREE.Group>(null);
  const bodyMat = useRef<THREE.MeshStandardMaterial>(null);

  // Smooth interpolation for color, rotation, and zoom
  useFrame((state, delta) => {
    if (!meshGroup.current) return;

    // Idle continuous rotation + touch drag offset
    const targetRotY = showBackView
      ? Math.PI + userRotationY
      : userRotationY + state.clock.elapsedTime * 0.15;

    meshGroup.current.rotation.y = THREE.MathUtils.lerp(
      meshGroup.current.rotation.y,
      targetRotY,
      delta * 4
    );

    // Vertical floating motion
    meshGroup.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.08;

    // Zoom level scale
    const targetScale = showFabricCloseUp ? 2.4 : isZoomed ? 1.6 : 1.0;
    meshGroup.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 5);

    // Color transition
    if (bodyMat.current) {
      const targetColor = new THREE.Color(color);
      bodyMat.current.color.lerp(targetColor, delta * 5);
    }
  });

  return (
    <group ref={meshGroup} position={[0, -0.2, 0]}>
      {/* Hoodie Body Mesh */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[0.7, 0.85, 1.4, 32]} />
        <meshStandardMaterial
          ref={bodyMat}
          color={color}
          roughness={showFabricCloseUp ? 0.95 : 0.6}
          metalness={0.1}
          wireframe={false}
        />
      </mesh>

      {/* Hood Top */}
      <mesh position={[0, 0.85, -0.1]}>
        <sphereGeometry args={[0.42, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.7]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>

      {/* Left Sleeve */}
      <mesh position={[-0.9, 0.2, 0]} rotation={[0, 0, 0.35]}>
        <cylinderGeometry args={[0.22, 0.26, 1.1, 24]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>

      {/* Right Sleeve */}
      <mesh position={[0.9, 0.2, 0]} rotation={[0, 0, -0.35]}>
        <cylinderGeometry args={[0.22, 0.26, 1.1, 24]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>

      {/* Chest SORA Logo / Graphic Print */}
      <mesh position={[0, 0.25, 0.71]} rotation={[0, 0, 0]}>
        <planeGeometry args={[0.55, 0.25]} />
        <meshBasicMaterial transparent opacity={0.9}>
          <canvasTexture
            attach="map"
            image={(() => {
              if (typeof window === "undefined") return document.createElement("canvas");
              const c = document.createElement("canvas");
              c.width = 256;
              c.height = 128;
              const ctx = c.getContext("2d")!;
              ctx.fillStyle = "rgba(0,0,0,0)";
              ctx.fillRect(0, 0, 256, 128);
              ctx.fillStyle = "#ffffff";
              ctx.font = "bold 44px sans-serif";
              ctx.textAlign = "center";
              ctx.fillText("SORA", 128, 64);
              ctx.fillStyle = "#8b5cf6";
              ctx.font = "14px monospace";
              ctx.fillText("WEAR YOUR UNIVERSE", 128, 92);
              return c;
            })()}
          />
        </meshBasicMaterial>
      </mesh>

      {/* Back Emblem Graphic Print */}
      <mesh position={[0, 0.25, -0.71]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[0.6, 0.6]} />
        <meshBasicMaterial transparent opacity={0.85}>
          <canvasTexture
            attach="map"
            image={(() => {
              if (typeof window === "undefined") return document.createElement("canvas");
              const c = document.createElement("canvas");
              c.width = 256;
              c.height = 256;
              const ctx = c.getContext("2d")!;
              ctx.fillStyle = "rgba(0,0,0,0)";
              ctx.fillRect(0, 0, 256, 256);
              ctx.strokeStyle = "#8b5cf6";
              ctx.lineWidth = 6;
              ctx.beginPath();
              ctx.arc(128, 128, 90, 0, Math.PI * 2);
              ctx.stroke();
              ctx.fillStyle = "#ffffff";
              ctx.font = "bold 28px sans-serif";
              ctx.textAlign = "center";
              ctx.fillText("DROP 001", 128, 136);
              return c;
            })()}
          />
        </meshBasicMaterial>
      </mesh>
    </group>
  );
}

// Background dynamic particles
function CyberParticleRing() {
  const points = useRef<THREE.Points>(null);
  const count = 600;

  const positions = React.useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 2.2 + (Math.random() - 0.5) * 0.8;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 3;
      pos[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return pos;
  }, []);

  useFrame((state, delta) => {
    if (points.current) {
      points.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#8b5cf6"
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

interface ActiveTheory3DCanvasProps {
  color?: string;
  isZoomed?: boolean;
  showBackView?: boolean;
  showFabricCloseUp?: boolean;
}

export default function ActiveTheory3DCanvas({
  color = "#0d0d0d",
  isZoomed = false,
  showBackView = false,
  showFabricCloseUp = false,
}: ActiveTheory3DCanvasProps) {
  const [touchRotation, setTouchRotation] = useState(0);
  const touchStartRef = useRef<number | null>(null);

  // Touch drag handlers for 360° product rotation on Android phone screens!
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    touchStartRef.current = clientX;
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (touchStartRef.current === null) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - touchStartRef.current;
    setTouchRotation((prev) => prev + deltaX * 0.01);
    touchStartRef.current = clientX;
  };

  const handleTouchEnd = () => {
    touchStartRef.current = null;
  };

  return (
    <div
      className="w-full h-full relative cursor-grab active:cursor-grabbing touch-none select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseMove={handleTouchMove}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
    >
      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 45 }}
        dpr={[1, Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2)]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 4, 3]} intensity={1.2} color="#ffffff" />
        <directionalLight position={[-3, -2, -2]} intensity={0.5} color="#8b5cf6" />
        <pointLight position={[0, 2, 2]} intensity={0.8} color="#06b6d4" />

        <FloatingHoodieModel
          color={color}
          isZoomed={isZoomed}
          showBackView={showBackView}
          showFabricCloseUp={showFabricCloseUp}
          userRotationY={touchRotation}
        />
        <CyberParticleRing />
      </Canvas>

      {/* Micro gesture guidance for Android users */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none text-center">
        <span className="font-mono text-[10px] tracking-[0.25em] text-white/40 uppercase bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
          👈 Swipe to rotate 360° 👉
        </span>
      </div>
    </div>
  );
}
