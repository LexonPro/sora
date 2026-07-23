"use client";

import React, { useState, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PRODUCTS, Product } from "@/lib/products";
import { sound } from "@/lib/audio";
import ProductModal3D from "./ProductModal3D";
import CartDrawerMobile, { CartItem } from "./CartDrawerMobile";

// ─── 3D CURVED CAROUSEL CARD COMPONENT FOR ACTIVE THEORY WORK PORTAL ───
interface Card3DProps {
  product: Product;
  index: number;
  total: number;
  rotationY: number;
  onSelect: (product: Product) => void;
}

function CurvedCard3D({ product, index, total, rotationY, onSelect }: Card3DProps) {
  const meshRef = useRef<THREE.Group>(null);

  // Position cards in a curved 3D circle/cylinder (Active Theory signature perspective!)
  const radius = 3.8;
  const anglePerCard = (Math.PI * 2) / total;
  const cardAngle = index * anglePerCard + rotationY;

  const x = Math.sin(cardAngle) * radius;
  const z = Math.cos(cardAngle) * radius - radius * 0.7;
  const rotY = cardAngle;

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    // Smooth lerp to target position
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, x, delta * 8);
    meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, z, delta * 8);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, rotY, delta * 8);
  });

  return (
    <group
      ref={meshRef}
      position={[x, 0, z]}
      rotation={[0, rotY, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(product);
      }}
    >
      {/* Card Base Mesh */}
      <mesh castShadow receiveShadow>
        <planeGeometry args={[1.8, 2.6]} />
        <meshStandardMaterial
          color="#0d0d0d"
          roughness={0.4}
          metalness={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Card Border Frame */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[1.82, 2.62]} />
        <meshBasicMaterial color="#8b5cf6" wireframe transparent opacity={0.3} />
      </mesh>

      {/* Canvas Texture for Product Details */}
      <mesh position={[0, 0, 0.02]}>
        <planeGeometry args={[1.7, 2.5]} />
        <meshBasicMaterial transparent>
          <canvasTexture
            attach="map"
            image={(() => {
              if (typeof window === "undefined") return document.createElement("canvas");
              const c = document.createElement("canvas");
              c.width = 512;
              c.height = 768;
              const ctx = c.getContext("2d")!;

              // Dark background gradient
              const grad = ctx.createLinearGradient(0, 0, 0, 768);
              grad.addColorStop(0, "#120a21");
              grad.addColorStop(0.5, "#0a0a0a");
              grad.addColorStop(1, "#050505");
              ctx.fillStyle = grad;
              ctx.fillRect(0, 0, 512, 768);

              // Grid lines
              ctx.strokeStyle = "rgba(139, 92, 246, 0.15)";
              ctx.lineWidth = 2;
              for (let i = 0; i < 512; i += 64) {
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i, 768);
                ctx.stroke();
              }

              // Tag
              ctx.fillStyle = "#8b5cf6";
              ctx.font = "bold 24px monospace";
              ctx.fillText(product.drop, 40, 80);

              // Category
              ctx.fillStyle = "rgba(255,255,255,0.5)";
              ctx.font = "20px monospace";
              ctx.fillText(product.category.toUpperCase(), 40, 115);

              // Title
              ctx.fillStyle = "#ffffff";
              ctx.font = "bold 38px sans-serif";
              const words = product.name.split(" ");
              let lineY = 220;
              words.forEach((w) => {
                ctx.fillText(w, 40, lineY);
                lineY += 45;
              });

              // Icon
              ctx.font = "120px sans-serif";
              ctx.fillText("👕", 190, 500);

              // Price
              ctx.fillStyle = "#ffffff";
              ctx.font = "bold 44px monospace";
              ctx.fillText(`₹${product.price}`, 40, 680);

              // CTA Button
              ctx.fillStyle = "#8b5cf6";
              ctx.fillRect(320, 635, 150, 60);
              ctx.fillStyle = "#ffffff";
              ctx.font = "bold 20px monospace";
              ctx.fillText("INSPECT", 345, 672);

              return c;
            })()}
          />
        </meshBasicMaterial>
      </mesh>
    </group>
  );
}

// ─── 3D SCENE CONTAINER FOR CURVED CAROUSEL ───
interface CarouselSceneProps {
  products: Product[];
  rotationY: number;
  onSelectProduct: (p: Product) => void;
}

function CarouselScene({ products, rotationY, onSelectProduct }: CarouselSceneProps) {
  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} color="#ffffff" />
      <pointLight position={[0, 0, 2]} intensity={1.5} color="#8b5cf6" />

      <group position={[0, 0, 0]}>
        {products.map((p, i) => (
          <CurvedCard3D
            key={p.id}
            product={p}
            index={i}
            total={products.length}
            rotationY={rotationY}
            onSelect={onSelectProduct}
          />
        ))}
      </group>
    </>
  );
}

// ─── MAIN ACTIVE THEORY WORK PORTAL PAGE ───
export default function ActiveTheoryWorkPortal() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [rotationY, setRotationY] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isGlitching, setIsGlitching] = useState(false);
  const [isMuted, setIsMuted] = useState(sound.isMuted());
  const [fps, setFps] = useState(60);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const touchStartRef = useRef<number | null>(null);

  // FPS Counter
  useEffect(() => {
    let frames = 0;
    let prevTime = performance.now();
    const interval = setInterval(() => {
      const time = performance.now();
      setFps(Math.round((frames * 1000) / (time - prevTime)));
      frames = 0;
      prevTime = time;
    }, 1000);

    const updateFrame = () => {
      frames++;
      requestAnimationFrame(updateFrame);
    };
    const req = requestAnimationFrame(updateFrame);

    return () => {
      clearInterval(interval);
      cancelAnimationFrame(req);
    };
  }, []);

  // Mouse / Touch coordinate tracker
  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      setCoords({ x: Math.round(clientX), y: Math.round(clientY) });
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("touchmove", handleMove);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("touchmove", handleMove);
    };
  }, []);

  // Filter products
  const filteredProducts =
    activeCategory === "all"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeCategory);

  // Category switch with Active Theory chromatic glitch effect
  const handleCategorySwitch = (cat: string) => {
    sound.playGlitch();
    setIsGlitching(true);
    setActiveCategory(cat);
    setRotationY(0);
    setTimeout(() => setIsGlitching(false), 200);
  };

  // Touch drag for 3D carousel on mobile/Android
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    touchStartRef.current = clientX;
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (touchStartRef.current === null) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - touchStartRef.current;
    setRotationY((prev) => prev + deltaX * 0.008);
    touchStartRef.current = clientX;
  };

  const handleTouchEnd = () => {
    touchStartRef.current = null;
  };

  const handleAddToCart = (product: Product, color: string, size: string) => {
    setCart((prev) => [
      ...prev,
      { product, selectedColor: color, selectedSize: size, quantity: 1 },
    ]);
  };

  const categories = [
    { id: "all", label: "ALL" },
    { id: "hoodies", label: "HOODIES" },
    { id: "tees", label: "TEES" },
    { id: "jackets", label: "JACKETS" },
    { id: "accessories", label: "ACCESSORIES" },
  ];

  return (
    <main className="w-full h-screen relative bg-black text-white overflow-hidden select-none font-mono">
      {/* Chromatic Glitch Overlay */}
      {isGlitching && (
        <div className="fixed inset-0 z-50 pointer-events-none mix-blend-difference bg-purple-600/30 animate-pulse" />
      )}

      {/* Noise Grain Texture Overlay */}
      <div
        className="fixed inset-0 z-[1] pointer-events-none opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 z-30 px-6 py-5 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center font-bold text-white shadow-lg shadow-purple-600/40">
            S
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-[0.3em] uppercase">SORA WORLD</h1>
            <div className="text-[9px] text-purple-400 tracking-widest uppercase">
              WORK PORTAL // ACTIVE THEORY SPEC
            </div>
          </div>
        </div>

        {/* Bag Trigger */}
        <button
          onClick={() => {
            sound.playTap();
            setIsCartOpen(true);
          }}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold tracking-widest uppercase transition-all cursor-pointer shadow-lg shadow-purple-900/40"
        >
          BAG ({cart.reduce((a, c) => a + c.quantity, 0)})
        </button>
      </header>

      {/* Active Theory Left Sidebar Vertical Category Selector */}
      <nav className="fixed left-6 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col gap-6 items-start">
        <span className="text-[10px] text-purple-400 tracking-[0.4em] uppercase mb-2">
          // INDEX
        </span>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategorySwitch(cat.id)}
            className={`text-xs tracking-[0.3em] uppercase transition-all cursor-pointer flex items-center gap-3 ${
              activeCategory === cat.id
                ? "text-white font-bold translate-x-2"
                : "text-white/40 hover:text-white/80"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                activeCategory === cat.id ? "bg-purple-500" : "bg-transparent"
              }`}
            />
            {cat.label}
          </button>
        ))}
      </nav>

      {/* Mobile Top Horizontal Category Filter Bar */}
      <div className="fixed top-20 left-0 right-0 z-30 flex md:hidden overflow-x-auto px-4 gap-2 no-scrollbar py-2 bg-black/60 backdrop-blur-md border-b border-white/10">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategorySwitch(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-[10px] tracking-wider uppercase border transition-all whitespace-nowrap ${
              activeCategory === cat.id
                ? "bg-purple-600 text-white border-purple-400"
                : "bg-white/5 text-white/60 border-white/10"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Active Theory 3D WebGL Curved Perspective Carousel */}
      <div
        className="w-full h-full absolute inset-0 z-10 cursor-grab active:cursor-grabbing touch-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
      >
        <Canvas camera={{ position: [0, 0, 4.2], fov: 50 }}>
          <CarouselScene
            products={filteredProducts}
            rotationY={rotationY}
            onSelectProduct={(p) => {
              sound.playTap();
              setSelectedProduct(p);
            }}
          />
        </Canvas>
      </div>

      {/* Center Guidance Overlay */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 pointer-events-none text-center z-20">
        <span className="text-[10px] tracking-[0.4em] text-white/40 uppercase bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
          👈 SWIPE / DRAG 3D CAROUSEL • TAP CARD TO INSPECT 👉
        </span>
      </div>

      {/* Bottom Telemetry HUD Bar */}
      <footer className="fixed bottom-0 left-0 right-0 z-30 px-6 py-4 flex items-center justify-between border-t border-white/10 bg-black/80 backdrop-blur-xl text-[10px] text-white/50">
        {/* Left Telemetry */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              const muted = sound.toggleMute();
              setIsMuted(muted);
            }}
            className="text-purple-400 hover:text-white transition-colors cursor-pointer"
          >
            {isMuted ? "🔇 [AUDIO OFF]" : "🔊 [AUDIO ACTIVE]"}
          </button>
          <span className="hidden sm:inline">// LOCATION: INDIA</span>
        </div>

        {/* Center Title */}
        <div className="text-white/40 tracking-widest hidden md:block">
          SORA WORLD © 2026 • WEAR YOUR UNIVERSE
        </div>

        {/* Right FPS & Coords */}
        <div className="flex items-center gap-4 font-mono">
          <span className="text-green-400 font-bold">{fps} FPS</span>
          <span>
            CRSR X:{coords.x} Y:{coords.y}
          </span>
        </div>
      </footer>

      {/* 3D Product Inspector Modal */}
      <ProductModal3D
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Slide-up Mobile Cart Drawer */}
      <CartDrawerMobile
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={(idx, delta) => {
          setCart((prev) => {
            const updated = [...prev];
            updated[idx].quantity += delta;
            return updated.filter((item) => item.quantity > 0);
          });
        }}
        onClearCart={() => setCart([])}
      />
    </main>
  );
}
