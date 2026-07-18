"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Plus, Minus, Trash2, Tag, ShieldCheck } from "lucide-react";
import { useStore, Product } from "@/context/StoreContext";
import { synthAudio } from "./AudioEngine";
import { CheckoutModal } from "./CheckoutModal";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenProduct: (productId: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onOpenProduct }) => {
  const { cart, products, updateCartQuantity, removeFromCart, addToCart } = useStore();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Determine complete the look suggestions
  // Flatten recommended items from all cart items, filter out items already in the cart, and deduplicate
  const cartProductIds = cart.map((i) => i.product.id);
  const upsellIds = cart.flatMap((i) => i.product.completeTheLook).filter((id) => !cartProductIds.includes(id));
  const uniqueUpsellIds = Array.from(new Set(upsellIds));

  // Get matching product objects
  const upsellProducts = products.filter((p) => uniqueUpsellIds.includes(p.id)).slice(0, 2);

  // Fallback default suggestions if cart is empty
  const defaultUpsellProducts = products
    .filter((p) => p.id === "seoul-tech-cargo" || p.id === "silver-chain")
    .slice(0, 2);

  const finalSuggestions = cart.length > 0 ? upsellProducts : defaultUpsellProducts;

  const handleQtyChange = (productId: string, size: string, newQty: number) => {
    synthAudio.playClick();
    if (newQty <= 0) {
      removeFromCart(productId, size);
    } else {
      updateCartQuantity(productId, size, newQty);
    }
  };

  const handleRemove = (productId: string, size: string) => {
    synthAudio.playClick();
    removeFromCart(productId, size);
  };

  const handleAddUpsell = (product: Product) => {
    synthAudio.playChime();
    const defaultSize = product.sizes[0] || "OS";
    addToCart(product, defaultSize, 1);
  };

  const handleOpenCheckout = () => {
    synthAudio.playClick();
    setIsCheckoutOpen(true);
  };

  return (
    <>
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
                  <ShoppingBag className="w-4 h-4 text-accent-blue" />
                  <span className="font-mono text-xs tracking-widest text-white">
                    BAG INVENTORY [{cart.reduce((s, i) => s + i.quantity, 0)}]
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

              {/* Items List */}
              <div className="flex-grow overflow-y-auto space-y-4 pr-1 mb-6">
                {cart.length > 0 ? (
                  cart.map((item) => (
                    <div
                      key={`${item.product.id}-${item.size}`}
                      className="glass border border-white/5 rounded-xl p-4 flex gap-4 relative group"
                    >
                      {/* Color block */}
                      <div
                        onClick={() => {
                          synthAudio.playClick();
                          onOpenProduct(item.product.id);
                          onClose();
                        }}
                        className="w-16 h-20 rounded-lg flex items-center justify-center font-bold font-mono text-[9px] text-black shadow-inner cursor-pointer"
                        style={{
                          background: `linear-gradient(135deg, ${item.product.color}50 0%, ${item.product.color} 100%)`,
                        }}
                      >
                        SORA
                      </div>

                      {/* Item Details */}
                      <div className="flex flex-col justify-between flex-grow">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4
                              onClick={() => {
                                synthAudio.playClick();
                                onOpenProduct(item.product.id);
                                onClose();
                              }}
                              className="font-sans font-semibold text-sm text-white hover:text-accent-blue transition-colors cursor-pointer truncate max-w-[160px]"
                            >
                              {item.product.name}
                            </h4>
                            <button
                              onClick={() => handleRemove(item.product.id, item.size)}
                              className="text-silver/40 hover:text-white p-1"
                              title="Delete item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <span className="font-mono text-[8px] text-accent-purple tracking-widest uppercase">
                            SIZE: {item.size}
                          </span>
                        </div>

                        <div className="flex justify-between items-end mt-2">
                          {/* Quantity selectors */}
                          <div className="flex items-center border border-white/5 rounded bg-white/2">
                            <button
                              onClick={() => handleQtyChange(item.product.id, item.size, item.quantity - 1)}
                              className="p-1 px-2 hover:bg-white/5 text-silver hover:text-white transition-colors cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 font-mono text-xs text-white">{item.quantity}</span>
                            <button
                              onClick={() => handleQtyChange(item.product.id, item.size, item.quantity + 1)}
                              className="p-1 px-2 hover:bg-white/5 text-silver hover:text-white transition-colors cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="font-mono text-xs text-white font-semibold">
                            ${item.product.price * item.quantity} USD
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <ShoppingBag className="w-8 h-8 text-white/10 mb-4 animate-pulse" />
                    <span className="font-mono text-xs text-silver/40 tracking-widest uppercase">
                      Your cyber bag is void.
                    </span>
                  </div>
                )}

                {/* Upsell complete the look recommendations */}
                {finalSuggestions.length > 0 && (
                  <div className="mt-8 border-t border-white/5 pt-6">
                    <h5 className="font-mono text-[10px] text-silver/60 tracking-wider mb-4 uppercase">
                      {cart.length > 0 ? "COMPLETE THE LOOK //" : "RECOMMENDED GEAR //"}
                    </h5>
                    <div className="space-y-3">
                      {finalSuggestions.map((item) => (
                        <div
                          key={item.id}
                          className="border border-white/5 rounded-xl p-3 flex justify-between items-center bg-white/2"
                        >
                          <div
                            onClick={() => {
                              synthAudio.playClick();
                              onOpenProduct(item.id);
                              onClose();
                            }}
                            className="flex items-center gap-3 cursor-pointer group"
                          >
                            <div
                              className="w-10 h-10 rounded-lg flex items-center justify-center font-bold font-mono text-[6px] text-black shadow-inner"
                              style={{
                                background: `linear-gradient(135deg, ${item.color}50 0%, ${item.color} 100%)`,
                              }}
                            >
                              SORA
                            </div>
                            <div className="flex flex-col">
                              <span className="font-sans font-semibold text-xs text-white group-hover:text-accent-blue transition-colors">
                                {item.name}
                              </span>
                              <span className="font-mono text-[9px] text-silver">${item.price} USD</span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleAddUpsell(item)}
                            className="p-2 border border-white/10 rounded-lg text-xs font-mono font-semibold hover:bg-white hover:text-black transition-all cursor-pointer"
                          >
                            + ADD
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Checkout Calculation Footer */}
              {cart.length > 0 && (
                <div className="border-t border-white/5 pt-4 space-y-4 font-mono text-xs">
                  <div className="flex justify-between text-silver/60">
                    <span>SUBTOTAL BAG</span>
                    <span>${subtotal} USD</span>
                  </div>
                  <div className="flex justify-between text-white font-bold text-sm">
                    <span>ESTIMATED SUBTOTAL</span>
                    <span className="text-accent-blue">${subtotal} USD</span>
                  </div>
                  <button
                    onClick={handleOpenCheckout}
                    className="w-full py-3 bg-white text-black font-semibold font-mono text-xs rounded hover:bg-accent-blue hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-accent-blue/20"
                  >
                    PROCEED TO SECURE CHECKOUT
                  </button>
                  <div className="flex justify-center items-center gap-1.5 text-[8px] text-silver/40">
                    <ShieldCheck className="w-3 h-3 text-accent-blue" />
                    <span>3D SECURE ENCRYPTED VERIFIED TRANSACTIONS</span>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Checkout step-by-step Modal nested inside */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderPlaced={(orderId) => {
          setIsCheckoutOpen(false);
          onClose(); // close cart too
          // Optionally route to orders or display notification
        }}
      />
    </>
  );
};
