"use client";

import React, { useState } from "react";
import { Product } from "@/lib/products";
import { sound } from "@/lib/audio";

export interface CartItem {
  product: Product;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
}

interface CartDrawerMobileProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (index: number, delta: number) => void;
  onClearCart: () => void;
}

export default function CartDrawerMobile({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onClearCart,
}: CartDrawerMobileProps) {
  const [checkingOut, setCheckingOut] = useState(false);
  const [completed, setCompleted] = useState(false);

  if (!isOpen) return null;

  const total = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    sound.playTap();
    setCheckingOut(true);
    setTimeout(() => {
      setCheckingOut(false);
      setCompleted(true);
      onClearCart();
      setTimeout(() => {
        setCompleted(false);
        onClose();
      }, 3000);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-xl transition-all p-0">
      <div className="w-full max-w-lg bg-neutral-950 border-t border-white/15 rounded-t-3xl p-6 shadow-2xl max-h-[85vh] flex flex-col justify-between overflow-hidden">
        {/* Top Handle */}
        <div>
          <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-4" />

          {/* Title */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">🛍️</span>
              <h3 className="font-sans text-lg font-black text-white uppercase">
                YOUR SORA BAG ({cart.reduce((a, c) => a + c.quantity, 0)})
              </h3>
            </div>
            <button
              onClick={() => {
                sound.playTap();
                onClose();
              }}
              className="text-white/60 hover:text-white font-mono text-sm"
            >
              ✕
            </button>
          </div>

          {/* Shipping Banner */}
          <div className="bg-purple-950/40 border border-purple-800/40 px-3 py-2 rounded-xl mb-4 text-center font-mono text-[10px] text-purple-300 uppercase">
            ⚡ FREE EXPRESS SHIPPING ACROSS INDIA // RAZORPAY 3D SECURED
          </div>

          {/* Cart Items List */}
          {completed ? (
            <div className="py-12 text-center">
              <span className="text-5xl block mb-4">🎉</span>
              <h4 className="font-sans text-xl font-bold text-white uppercase mb-2">
                ORDER CONFIRMED!
              </h4>
              <p className="font-mono text-xs text-neutral-400">
                Tracking code sent via SMS. Thank you for wearing SORA World!
              </p>
            </div>
          ) : cart.length === 0 ? (
            <div className="py-12 text-center text-white/40 font-mono text-xs uppercase">
              YOUR BAG IS EMPTY. TAP ANY PRODUCT TO ADD!
            </div>
          ) : (
            <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-1">
              {cart.map((item, idx) => (
                <div
                  key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}
                  className="flex items-center justify-between bg-white/5 border border-white/10 p-3 rounded-2xl"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl border border-white/20 flex items-center justify-center text-xl"
                      style={{ backgroundColor: item.selectedColor }}
                    >
                      👕
                    </div>
                    <div>
                      <h4 className="font-sans text-xs font-bold text-white uppercase">
                        {item.product.name}
                      </h4>
                      <div className="font-mono text-[10px] text-white/40 uppercase">
                        SIZE: {item.selectedSize} • ₹{item.product.price.toLocaleString("en-IN")}
                      </div>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 bg-black/60 border border-white/10 px-2 py-1 rounded-xl">
                    <button
                      onClick={() => onUpdateQuantity(idx, -1)}
                      className="text-white/60 hover:text-white font-mono text-xs px-1"
                    >
                      -
                    </button>
                    <span className="font-mono text-xs font-bold text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(idx, 1)}
                      className="text-white/60 hover:text-white font-mono text-xs px-1"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Checkout Summary */}
        {!completed && cart.length > 0 && (
          <div className="border-t border-white/10 pt-4 mt-4">
            <div className="flex items-center justify-between font-mono text-xs mb-4">
              <span className="text-white/60 uppercase">TOTAL AMOUNT</span>
              <span className="text-xl font-bold text-white">
                ₹{total.toLocaleString("en-IN")}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={checkingOut}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-mono text-xs font-bold tracking-[0.3em] uppercase transition-all cursor-pointer shadow-xl shadow-purple-600/30"
            >
              {checkingOut ? "⚡ PROCESSING SECURE CHECKOUT..." : "🔒 PAY VIA RAZORPAY 3D SECURE"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
