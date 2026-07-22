"use client";

import React, { useState, useEffect } from "react";
import { Search, Heart, User, ShoppingBag, Terminal } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { synthAudio, MuteToggle } from "./AudioEngine";
import { SearchModal } from "./SearchModal";
import { WishlistDrawer } from "./WishlistDrawer";
import { AccountDrawer } from "./AccountDrawer";
import { CartDrawer } from "./CartDrawer";
import Link from "next/link";

interface NavbarProps {
  onSelectCategory?: (category: string) => void;
  onOpenProduct?: (productId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSelectCategory, onOpenProduct }) => {
  const { cart, wishlist } = useStore();
  const [isScrolled, setIsScrolled] = useState(false);

  // Modal/Drawer states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Cart total items count
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (category: string) => {
    synthAudio.playClick();
    if (onSelectCategory) {
      onSelectCategory(category);
    }
  };

  const handleLogoClick = () => {
    synthAudio.playClick();
    if (onSelectCategory) {
      onSelectCategory("");
    }
  };

  const handleProductRedirect = (productId: string) => {
    if (onOpenProduct) {
      onOpenProduct(productId);
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#0d0d0d]/80 backdrop-blur-md border-b border-white/5 py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          {/* Brand Logo */}
          <Link
            href="/"
            onClick={handleLogoClick}
            className="flex items-center gap-1.5 font-bold tracking-[0.25em] text-white hover:text-accent-blue transition-colors font-sans focus:outline-none"
            onMouseEnter={() => synthAudio.playHover()}
          >
            SORA
            <div className="w-1.5 h-1.5 rounded-full bg-accent-purple glow-purple animate-pulse" />
          </Link>

          {/* Central Category Navigation */}
          <nav className="hidden md:flex items-center gap-8 font-mono text-[10px] tracking-[0.2em] text-silver">
            <Link
              href="/"
              onClick={() => handleNavClick("NEW DROPS")}
              className="hover:text-white hover:glow-text transition-all"
              onMouseEnter={() => synthAudio.playHover()}
            >
              NEW DROPS
            </Link>
            <Link
              href="/"
              onClick={() => handleNavClick("Anime Collection")}
              className="hover:text-white hover:glow-text transition-all"
              onMouseEnter={() => synthAudio.playHover()}
            >
              ANIME
            </Link>
            <Link
              href="/"
              onClick={() => handleNavClick("Korean Street")}
              className="hover:text-white hover:glow-text transition-all"
              onMouseEnter={() => synthAudio.playHover()}
            >
              KOREAN
            </Link>
            <Link
              href="/"
              onClick={() => handleNavClick("Oversized")}
              className="hover:text-white hover:glow-text transition-all"
              onMouseEnter={() => synthAudio.playHover()}
            >
              OVERSIZED
            </Link>
            <Link
              href="/"
              onClick={() => handleNavClick("Accessories")}
              className="hover:text-white hover:glow-text transition-all"
              onMouseEnter={() => synthAudio.playHover()}
            >
              ACCESSORIES
            </Link>
            <Link
              href="/about"
              onClick={() => synthAudio.playClick()}
              className="hover:text-white hover:glow-text transition-all text-accent-purple"
              onMouseEnter={() => synthAudio.playHover()}
            >
              ABOUT SORA
            </Link>
            <Link
              href="/ai-studio"
              onClick={() => synthAudio.playClick()}
              className="hover:text-white hover:glow-text transition-all text-accent-blue"
              onMouseEnter={() => synthAudio.playHover()}
            >
              AI STUDIO
            </Link>
            <Link
              href="/admin"
              onClick={() => synthAudio.playClick()}
              className="hover:text-white hover:glow-text transition-all flex items-center gap-1 text-accent-blue"
              onMouseEnter={() => synthAudio.playHover()}
            >
              <Terminal className="w-3 h-3" />
              ADMIN
            </Link>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-4">
            
            {/* Web Audio Mute Visualizer */}
            <MuteToggle />

            {/* Search Icon */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-silver hover:text-white transition-all cursor-pointer relative"
              title="Search store"
              onMouseEnter={() => synthAudio.playHover()}
            >
              <Search className="w-4.5 h-4.5" />
            </button>

            {/* Wishlist Icon */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="p-2 text-silver hover:text-white transition-all cursor-pointer relative"
              title="View wishlist"
              onMouseEnter={() => synthAudio.playHover()}
            >
              <Heart className="w-4.5 h-4.5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent-purple text-[8px] font-mono text-white font-bold rounded-full flex items-center justify-center glow-purple">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Account Icon */}
            <button
              onClick={() => setIsAccountOpen(true)}
              className="p-2 text-silver hover:text-white transition-all cursor-pointer relative"
              title="Account Portal"
              onMouseEnter={() => synthAudio.playHover()}
            >
              <User className="w-4.5 h-4.5" />
            </button>

            {/* Cart Icon */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-silver hover:text-white transition-all cursor-pointer relative"
              title="View shopping bag"
              onMouseEnter={() => synthAudio.playHover()}
            >
              <ShoppingBag className="w-4.5 h-4.5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent-blue text-[8px] font-mono text-white font-bold rounded-full flex items-center justify-center glow-blue">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Slideout drawers & Fullscreen Search modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onOpenProduct={handleProductRedirect}
      />
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        onOpenProduct={handleProductRedirect}
      />
      <AccountDrawer
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
      />
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOpenProduct={handleProductRedirect}
      />
    </>
  );
};
