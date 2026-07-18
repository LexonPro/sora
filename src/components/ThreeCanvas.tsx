"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, MeshReflectorMaterial, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

// Dynamic Particles rising from the pedestal
const PedestalParticles = ({ count = 250 }) => {
  const pointsRef = useRef<THREE.Points | null>(null);
  const [positions, setPositions] = useState<Float32Array | null>(null);
  const [speeds, setSpeeds] = useState<number[]>([]);

  useEffect(() => {
    const pos = new Float32Array(count * 3);
    const spd = [];
    for (let i = 0; i < count; i++) {
      // Spawn in a circle around the pedestal base
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 1.2;
      pos[i * 3] = Math.cos(angle) * radius; // x
      pos[i * 3 + 1] = Math.random() * 4 - 1; // y (between -1 and 3)
      pos[i * 3 + 2] = Math.sin(angle) * radius; // z
      spd.push(Math.random() * 0.015 + 0.005); // upward speed
    }
    setPositions(pos);
    setSpeeds(spd);
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current || !positions) return;

    const geo = pointsRef.current.geometry;
    const posAttr = geo.getAttribute("position") as THREE.BufferAttribute;

    for (let i = 0; i < count; i++) {
      let y = posAttr.getY(i);
      y += speeds[i];
      
      // Reset if too high
      if (y > 3) {
        y = -1;
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 1.2;
        posAttr.setX(i, Math.cos(angle) * radius);
        posAttr.setZ(i, Math.sin(angle) * radius);
      }
      
      posAttr.setY(i, y);
      
      // Soft drift X/Z
      const time = state.clock.getElapsedTime();
      posAttr.setX(i, posAttr.getX(i) + Math.sin(time + i) * 0.002);
    }

    posAttr.needsUpdate = true;
  });

  if (!positions) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#a855f7"
        size={0.035}
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

// Procedural Holographic Hoodie wireframe model
const HolographicHoodie = () => {
  const groupRef = useRef<THREE.Group | null>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Auto-rotation
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.35;
      
      // Floating animation
      groupRef.current.position.y = 0.5 + Math.sin(state.clock.getElapsedTime() * 1.5) * 0.08;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.5, 0]}>
      {/* 1. Torso/Body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.55, 0.45, 1.2, 16, 8]} />
        <meshBasicMaterial color="#4f46e5" wireframe transparent opacity={0.65} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.55, 0.45, 1.2, 16, 8]} />
        <meshPhysicalMaterial 
          color="#0d0d0d" 
          roughness={0.1} 
          metalness={0.9} 
          transmission={0.6} 
          thickness={0.5} 
          transparent 
          opacity={0.3} 
        />
      </mesh>

      {/* 2. Left Sleeve */}
      <group position={[-0.7, 0.25, 0]} rotation={[0, 0, Math.PI / 4]}>
        <mesh>
          <cylinderGeometry args={[0.18, 0.14, 0.9, 8, 4]} />
          <meshBasicMaterial color="#4f46e5" wireframe transparent opacity={0.5} />
        </mesh>
        <mesh>
          <cylinderGeometry args={[0.18, 0.14, 0.9, 8, 4]} />
          <meshPhysicalMaterial color="#0d0d0d" transmission={0.5} transparent opacity={0.2} />
        </mesh>
      </group>

      {/* 3. Right Sleeve */}
      <group position={[0.7, 0.25, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <mesh>
          <cylinderGeometry args={[0.18, 0.14, 0.9, 8, 4]} />
          <meshBasicMaterial color="#4f46e5" wireframe transparent opacity={0.5} />
        </mesh>
        <mesh>
          <cylinderGeometry args={[0.18, 0.14, 0.9, 8, 4]} />
          <meshPhysicalMaterial color="#0d0d0d" transmission={0.5} transparent opacity={0.2} />
        </mesh>
      </group>

      {/* 4. Hood */}
      <mesh position={[0, 0.75, 0.05]} rotation={[0.2, 0, 0]}>
        <sphereGeometry args={[0.42, 12, 12, 0, Math.PI * 2, 0, Math.PI * 0.75]} />
        <meshBasicMaterial color="#a855f7" wireframe transparent opacity={0.7} />
      </mesh>

      {/* 5. Bottom Hem / Ribbing */}
      <mesh position={[0, -0.62, 0]}>
        <torusGeometry args={[0.45, 0.08, 8, 24]} />
        <meshBasicMaterial color="#a855f7" wireframe transparent opacity={0.8} />
      </mesh>

      {/* 6. Left Wrist Cuff */}
      <mesh position={[-0.98, -0.06, 0]} rotation={[0, 0, Math.PI / 4]}>
        <torusGeometry args={[0.14, 0.04, 6, 12]} />
        <meshBasicMaterial color="#4f46e5" transparent opacity={0.8} />
      </mesh>

      {/* 7. Right Wrist Cuff */}
      <mesh position={[0.98, -0.06, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <torusGeometry args={[0.14, 0.04, 6, 12]} />
        <meshBasicMaterial color="#4f46e5" transparent opacity={0.8} />
      </mesh>

      {/* 8. Glowing brand ring around chest */}
      <mesh position={[0, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.56, 0.015, 4, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
      </mesh>
    </group>
  );
};

// Pedestal Stage
const PedestalStage = () => {
  return (
    <group position={[0, -0.5, 0]}>
      {/* Primary Pedestal Base */}
      <mesh receiveShadow position={[0, 0.05, 0]}>
        <cylinderGeometry args={[1.3, 1.4, 0.1, 32]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.6} metalness={0.8} />
      </mesh>

      {/* Glowing Neon Rings inside Pedestal */}
      <mesh position={[0, 0.11, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.2, 0.02, 8, 48]} />
        <meshBasicMaterial color="#4f46e5" />
      </mesh>
      <mesh position={[0, 0.11, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.9, 0.015, 8, 48]} />
        <meshBasicMaterial color="#a855f7" />
      </mesh>

      {/* Dark Outer Collar */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1.45, 1.5, 0.1, 32]} />
        <meshStandardMaterial color="#080808" roughness={0.8} />
      </mesh>
    </group>
  );
};

// Interaction controller for Mouse Parallax
const MouseTracker = () => {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse between -1 and 1
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame(() => {
    // Smooth camera lag looking at center
    camera.position.x += (mouse.current.x * 0.8 - camera.position.x) * 0.05;
    camera.position.y += (mouse.current.y * 0.5 + 1.2 - camera.position.y) * 0.05;
    camera.lookAt(0, 0.4, 0);
  });

  return null;
};

// Main Export Component
export default function ThreeCanvas() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#0d0d0d]">
        <div className="flex flex-col items-center gap-4">
          {/* Neon spinner */}
          <div className="w-12 h-12 border-2 border-accent-blue border-t-accent-purple rounded-full animate-spin glow-blue" />
          <div className="text-silver font-mono text-xs tracking-[0.2em] animate-pulse">INIT SORA 3D WORLD...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative" style={{ background: "radial-gradient(circle at center, #111122 0%, #0d0d0d 75%)" }}>
      {/* Grid background overlay for HUD style */}
      <div className="absolute inset-0 pointer-events-none z-10 hud-grid opacity-10" />

      {/* Live Canvas */}
      <Canvas shadows gl={{ antialias: true, alpha: false }}>
        <color attach="background" args={["#0d0d0d"]} />
        <fog attach="fog" args={["#0d0d0d", 4, 10]} />
        
        <PerspectiveCamera makeDefault position={[0, 1.2, 3.8]} fov={45} />
        
        {/* Lights */}
        <ambientLight intensity={0.15} />
        <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
        <pointLight position={[-4, 3, -2]} intensity={0.5} color="#4f46e5" />
        <pointLight position={[4, 2, 2]} intensity={0.8} color="#a855f7" />
        
        {/* Scene Objects */}
        <HolographicHoodie />
        <PedestalStage />
        <PedestalParticles count={150} />
        
        {/* Reflective Ground Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.45, 0]}>
          <planeGeometry args={[12, 12]} />
          <MeshReflectorMaterial
            mirror={0.7}
            blur={[300, 100]}
            resolution={512}
            mixBlur={1}
            mixStrength={10}
            roughness={1}
            depthScale={0.8}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.2}
            color="#090909"
            metalness={0.9}
          />
        </mesh>

        <MouseTracker />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          maxPolarAngle={Math.PI / 2 - 0.05} // don't go below ground
          minPolarAngle={Math.PI / 6} 
        />
      </Canvas>
    </div>
  );
}
