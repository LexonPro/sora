"use client";

import React, { useState } from "react";
import AndroidNavbar from "@/components/AndroidNavbar";
import ActiveTheoryHero from "@/components/ActiveTheoryHero";
import ActiveTheoryShowcase from "@/components/ActiveTheoryShowcase";
import ProductModal3D from "@/components/ProductModal3D";
import CartDrawerMobile, { CartItem } from "@/components/CartDrawerMobile";
import { Product } from "@/lib/products";

export default function HomePage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);

  const handleAddToCart = (
    product: Product,
    selectedColor: string,
    selectedSize: string
  ) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += 1;
        return updated;
      }
      return [
        ...prev,
        { product, selectedColor, selectedSize, quantity: 1 },
      ];
    });
  };

  const handleUpdateQuantity = (index: number, delta: number) => {
    setCart((prev) => {
      const updated = [...prev];
      updated[index].quantity += delta;
      if (updated[index].quantity <= 0) {
        return updated.filter((_, i) => i !== index);
      }
      return updated;
    });
  };

  return (
    <main className="min-h-screen bg-black text-white selection:bg-purple-600 selection:text-white pb-24">
      {/* Top Header & Bottom Android Thumb Navigation Bar */}
      <AndroidNavbar
        cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => {
          const el = document.getElementById("products-section");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
        onOpenAccount={() => setIsCartOpen(true)}
      />

      {/* Section 1: Active Theory Work Inspired Hero Section */}
      <ActiveTheoryHero
        onShopClick={() => {
          const el = document.getElementById("products-section");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
        onExploreClick={() => {
          const el = document.getElementById("products-section");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
      />

      {/* Section 2: Active Theory 3D Card Showcase & Filters */}
      <ActiveTheoryShowcase
        onSelectProduct={(product) => setSelectedProduct(product)}
      />

      {/* Interactive 3D Product Inspector Modal (360° rotation, fabric texture, zoom, colors) */}
      <ProductModal3D
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Slide-Up Mobile Cart Drawer */}
      <CartDrawerMobile
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={() => setCart([])}
      />

      {/* Footer */}
      <footer className="py-12 px-6 text-center border-t border-white/10 font-mono text-[10px] text-white/40 uppercase">
        <p>SORA WORLD © 2026 • WEAR YOUR UNIVERSE</p>
        <p className="mt-1 text-purple-400">ENGINEERED FOR ANDROID & MOBILE</p>
      </footer>
    </main>
  );
}
