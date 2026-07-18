"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, CreditCard, ShieldCheck, Tag, ShoppingBag, ArrowRight } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { synthAudio } from "./AudioEngine";
import confetti from "canvas-confetti";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderPlaced: (orderId: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, onOrderPlaced }) => {
  const { cart, activeCoupon, activeDiscount, applyCoupon, removeCoupon, placeOrder } = useStore();

  const [step, setStep] = useState<"address" | "payment" | "razorpay" | "success">("address");
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");

  const [address, setAddress] = useState({
    fullName: "",
    street: "",
    city: "",
    zipCode: "",
    phone: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [placedOrder, setPlacedOrder] = useState<any>(null);

  // Totals
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discount = Math.round((subtotal * activeDiscount) / 100);
  const shipping = subtotal > 150 ? 0 : 15;
  const total = subtotal - discount + shipping;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;
    const success = applyCoupon(couponCode);
    if (success) {
      synthAudio.playChime();
      setCouponCode("");
      setCouponError("");
    } else {
      synthAudio.playClick();
      setCouponError("INVALID OR EXPIRED COUPON CODE");
    }
  };

  const handleNextStep = () => {
    synthAudio.playClick();
    if (step === "address") {
      if (!address.fullName || !address.street || !address.city || !address.zipCode || !address.phone) {
        alert("Please fill in all address coordinates.");
        return;
      }
      setStep("payment");
    } else if (step === "payment") {
      setStep("razorpay");
      
      // Simulate Razorpay transaction progress
      setTimeout(() => {
        // Place order in local context
        const order = placeOrder(address, paymentMethod);
        setPlacedOrder(order);
        
        // Advance to success
        setStep("success");
        synthAudio.playChime();
        
        // Fire celebration confetti!
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#4f46e5", "#a855f7", "#ffffff", "#00d2ff"]
        });

        // Trigger parent callback
        onOrderPlaced(order.id);
      }, 3500);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            if (step !== "razorpay" && step !== "success") {
              synthAudio.playClick();
              onClose();
            }
          }}
        />

        {/* Modal Window Container */}
        <motion.div
          className="glass-premium border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto z-10 flex flex-col md:flex-row relative shadow-2xl"
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
        >
          {/* Close button */}
          {step !== "razorpay" && step !== "success" && (
            <button
              onClick={() => {
                synthAudio.playClick();
                onClose();
              }}
              className="absolute top-4 right-4 p-2 text-silver hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors z-20 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Left panel: Form states */}
          <div className="flex-grow p-6 md:p-10 border-r border-white/5 flex flex-col justify-between">
            {step === "address" && (
              <div>
                <h3 className="text-xl font-bold tracking-widest text-white mb-6 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-accent-blue" />
                  01 // DELIVERY COORDINATES
                </h3>
                <div className="space-y-4 font-mono text-xs">
                  <div>
                    <label className="block text-silver/60 mb-2">FULL NAME</label>
                    <input
                      type="text"
                      value={address.fullName}
                      onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                      className="w-full bg-white/3 border border-white/5 rounded p-3 text-white focus:border-accent-blue outline-none"
                      placeholder="SORA CITIZEN"
                    />
                  </div>
                  <div>
                    <label className="block text-silver/60 mb-2">STREET ADDRESS</label>
                    <input
                      type="text"
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      className="w-full bg-white/3 border border-white/5 rounded p-3 text-white focus:border-accent-blue outline-none"
                      placeholder="METRO SECTOR 7, SUITE 89"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-silver/60 mb-2">CITY / STATE</label>
                      <input
                        type="text"
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        className="w-full bg-white/3 border border-white/5 rounded p-3 text-white focus:border-accent-blue outline-none"
                        placeholder="MUMBAI, MH"
                      />
                    </div>
                    <div>
                      <label className="block text-silver/60 mb-2">PINCODE</label>
                      <input
                        type="text"
                        value={address.zipCode}
                        onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                        className="w-full bg-white/3 border border-white/5 rounded p-3 text-white focus:border-accent-blue outline-none"
                        placeholder="400001"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-silver/60 mb-2">PHONE CONTACT</label>
                    <input
                      type="text"
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      className="w-full bg-white/3 border border-white/5 rounded p-3 text-white focus:border-accent-blue outline-none"
                      placeholder="+91 9876543210"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === "payment" && (
              <div>
                <h3 className="text-xl font-bold tracking-widest text-white mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-accent-purple" />
                  02 // PAYMENT GATEWAY
                </h3>
                <div className="grid grid-cols-1 gap-3 font-mono text-xs mb-8">
                  {["UPI (GPay / PhonePe)", "Credit / Debit Card", "Net Banking", "Cash On Delivery (COD)"].map((method) => {
                    const cleanName = method.split(" ")[0];
                    const isSelected = paymentMethod === cleanName;
                    return (
                      <button
                        key={method}
                        onClick={() => {
                          synthAudio.playClick();
                          setPaymentMethod(cleanName);
                        }}
                        className={`p-4 border text-left rounded flex justify-between items-center transition-all cursor-pointer ${
                          isSelected
                            ? "border-accent-blue bg-accent-blue/10 text-white"
                            : "border-white/5 bg-white/2 text-silver hover:text-white hover:border-white/10"
                        }`}
                      >
                        <span>{method}</span>
                        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-accent-purple glow-purple animate-pulse" />}
                      </button>
                    );
                  })}
                </div>
                <div className="bg-accent-blue/5 border border-accent-blue/20 rounded p-4 flex gap-3 text-silver font-mono text-[10px] leading-relaxed">
                  <ShieldCheck className="w-5 h-5 text-accent-blue flex-shrink-0" />
                  <span>
                    SECURE TRANSACTIONS PROCESSED VIA ENCRYPTED RAZORPAY GATEWAY. COD ORDERS SUBJECT TO VERIFICATION CALL.
                  </span>
                </div>
              </div>
            )}

            {step === "razorpay" && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 bg-[#3395FF]/10 rounded-full flex items-center justify-center mb-6">
                  <span className="text-[#3395FF] font-extrabold text-xl animate-pulse">R</span>
                </div>
                <h4 className="text-[#3395FF] font-sans font-bold tracking-wider text-lg">
                  RAZORPAY SECURE GATEWAY
                </h4>
                <p className="text-xs font-mono text-silver/60 mt-2">
                  AUTHORIZING CYBER SECURE SUITE...
                </p>
                <div className="w-48 h-[2px] bg-white/5 rounded overflow-hidden mt-6 relative">
                  <div className="absolute left-0 top-0 h-full bg-[#3395FF] w-1/3 animate-[shimmer_1.5s_infinite]" />
                </div>
                <span className="font-mono text-[9px] text-silver/40 mt-10">
                  PLEASE DO NOT REFRESH OR CLOSE THIS PORTAL FRAME.
                </span>
              </div>
            )}

            {step === "success" && placedOrder && (
              <div className="flex flex-col items-center justify-center text-center py-10">
                <div className="w-14 h-14 bg-green-500/10 rounded-full flex items-center justify-center mb-6 border border-green-500/20">
                  <ShieldCheck className="w-7 h-7 text-green-500" />
                </div>
                <h4 className="text-2xl font-bold tracking-widest text-white font-sans glow-text">
                  TRANSCENDENCE COMPLETE
                </h4>
                <p className="text-xs font-mono text-silver/80 mt-2 max-w-sm">
                  Your order has been recorded into the blockchain grid.
                </p>

                <div className="mt-8 p-4 glass border border-white/5 rounded-xl w-full max-w-sm text-left font-mono text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-silver/60">ORDER ID</span>
                    <span className="text-white font-semibold">{placedOrder.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-silver/60">TRACKING</span>
                    <span className="text-accent-blue">{placedOrder.trackingNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-silver/60">EST. ARRIVAL</span>
                    <span className="text-accent-purple">3-5 BUSINESS DAYS</span>
                  </div>
                </div>

                <p className="font-mono text-[9px] text-silver/40 mt-8">
                  A receipt coordinates summary has been dispatched.
                </p>
              </div>
            )}

            {/* Stepped Actions footer */}
            {step !== "razorpay" && step !== "success" && (
              <div className="flex gap-4 mt-10">
                {step === "payment" && (
                  <button
                    onClick={() => setStep("address")}
                    className="flex-grow py-3 border border-white/10 text-white rounded font-mono text-xs hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    BACK
                  </button>
                )}
                <button
                  onClick={handleNextStep}
                  className="flex-grow py-3 bg-white text-black font-semibold font-mono text-xs rounded hover:bg-accent-blue hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-accent-blue/20"
                >
                  {step === "address" ? "PROCEED TO PAYMENT" : "CONFIRM & SECURE PAY"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {step === "success" && (
              <button
                onClick={() => {
                  synthAudio.playClick();
                  onClose();
                  setStep("address"); // reset
                }}
                className="mt-10 py-3 w-full border border-white/15 text-white rounded font-mono text-xs hover:bg-white/5 transition-colors cursor-pointer"
              >
                RETURN TO GRID
              </button>
            )}
          </div>

          {/* Right panel: Summary (not displayed in success state to focus layout) */}
          {step !== "success" && (
            <div className="w-full md:w-[340px] bg-white/2 p-6 md:p-8 flex flex-col justify-between border-t md:border-t-0 md:border-l border-white/5">
              <div>
                <h4 className="font-mono text-xs tracking-wider text-silver/60 mb-6 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-accent-blue" />
                  BAG SUMMARY //
                </h4>
                <div className="space-y-4 max-h-[220px] overflow-y-auto pr-2 mb-6">
                  {cart.map((item) => (
                    <div key={`${item.product.id}-${item.size}`} className="flex justify-between items-center text-xs font-mono">
                      <div className="flex flex-col">
                        <span className="text-white truncate max-w-[150px] font-semibold">{item.product.name}</span>
                        <span className="text-silver/40 text-[9px]">SIZE: {item.size} // QTY: {item.quantity}</span>
                      </div>
                      <span className="text-silver font-semibold">${item.product.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Promo application */}
                {step !== "razorpay" && (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2 mb-6">
                    <div className="relative flex-grow">
                      <Tag className="w-3.5 h-3.5 text-silver absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="ENTER CODE"
                        className="w-full bg-white/3 border border-white/5 rounded p-2 pl-9 font-mono text-xs text-white uppercase outline-none focus:border-accent-blue"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded font-mono text-[10px] text-white cursor-pointer"
                    >
                      APPLY
                    </button>
                  </form>
                )}

                {couponError && <p className="text-red-500 font-mono text-[9px] mb-4">{couponError}</p>}
                
                {activeCoupon && (
                  <div className="mb-6 flex justify-between items-center bg-accent-purple/10 border border-accent-purple/20 p-2 rounded text-[10px] font-mono">
                    <span className="text-accent-purple font-semibold">COUPON APPLIED: {activeCoupon}</span>
                    <button
                      onClick={() => {
                        synthAudio.playClick();
                        removeCoupon();
                      }}
                      className="text-silver/60 hover:text-white"
                    >
                      REMOVE
                    </button>
                  </div>
                )}
              </div>

              {/* Total calculations */}
              <div className="border-t border-white/5 pt-6 space-y-2 font-mono text-xs">
                <div className="flex justify-between text-silver/60">
                  <span>SUBTOTAL</span>
                  <span>${subtotal}</span>
                </div>
                {activeDiscount > 0 && (
                  <div className="flex justify-between text-accent-purple">
                    <span>DISCOUNT ({activeDiscount}%)</span>
                    <span>-${discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-silver/60">
                  <span>SHIPPING</span>
                  <span>{shipping === 0 ? "FREE" : `$${shipping}`}</span>
                </div>
                <div className="flex justify-between text-sm text-white pt-4 border-t border-white/5 font-semibold">
                  <span>NET TOTAL</span>
                  <span className="text-accent-blue">${total} USD</span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
