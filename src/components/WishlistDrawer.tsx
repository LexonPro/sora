"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { synthAudio } from "./AudioEngine";

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenProduct: (productId: string) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({ isOpen, onClose, onOpenProduct }) => {
  const { wishlist, products, toggleWishlist, addToCart } = useStore();

  // Get wishlisted items
  const wishlistedItems = products.filter((p) => wishlist.includes(p.id));

  const handleAddToCart = (product: any) => {
    synthAudio.playChime();
    // Default to first available size
    const defaultSize = product.sizes[0] || "OS";
    addToCart(product, defaultSize, 1);
  };

  const handleRemove = (productId: string) => {
    synthAudio.playClick();
    toggleWishlist(productId);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur */}
          <motion.div
            className="fixed inset-0 z-100 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              synthAudio.playClick();
              onClose();
            }}
          />

          {/* Drawer Body */}
          <motion.div
            className="fixed right-0 top-0 bottom-0 h-full w-full max-w-md z-100 glass-premium border-l border-white/10 flex flex-col p-6 shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 260 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-accent-purple fill-accent-purple" />
                <span className="font-mono text-xs tracking-widest text-white">
                  WISHLIST CODES [{wishlistedItems.length}]
                </span>
              </div>
              <button
                onClick={() => {
                  synthAudio.playClick();
                  onClose();
                }}
                className="p-2 hover:bg-white/5 rounded-full text-silver hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List */}
            <div className="flex-grow overflow-y-auto space-y-4 pr-2">
              {wishlistedItems.length > 0 ? (
                wishlistedItems.map((item) => (
                  <div
                    key={item.id}
                    className="glass border border-white/5 rounded-xl p-4 flex gap-4 relative group"
                  >
                    {/* Color box */}
                    <div
                      onClick={() => {
                        synthAudio.playClick();
                        onOpenProduct(item.id);
                        onClose();
                      }}
                      className="w-16 h-20 rounded-lg flex items-center justify-center font-bold font-mono text-[9px] text-black shadow-inner cursor-pointer"
                      style={{
                        background: `linear-gradient(135deg, ${item.color}50 0%, ${item.color} 100%)`,
                      }}
                    >
                      SORA
                    </div>

                    <div className="flex flex-col justify-between flex-grow">
                      <div>
                        <span className="font-mono text-[9px] text-accent-purple tracking-widest block uppercase">
                          {item.category}
                        </span>
                        <h4
                          onClick={() => {
                            synthAudio.playClick();
                            onOpenProduct(item.id);
                            onClose();
                          }}
                          className="font-sans font-semibold text-sm text-white hover:text-accent-blue transition-colors cursor-pointer"
                        >
                          {item.name}
                        </h4>
                        <span className="font-mono text-xs text-silver mt-1 block">
                          ${item.price} USD
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-black font-mono text-[10px] font-semibold rounded hover:bg-accent-blue hover:text-white transition-all cursor-pointer"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          ADD TO CART
                        </button>
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="p-1.5 border border-white/5 rounded text-silver/60 hover:text-white hover:border-white/10 hover:bg-white/5 transition-all cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-32 text-center">
                  <Heart className="w-8 h-8 text-white/10 mb-4 animate-pulse" />
                  <span className="font-mono text-xs text-silver/40 tracking-widest uppercase">
                    Your wishlist is currently void.
                    <br />
                    Heart items to bookmark them here.
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
