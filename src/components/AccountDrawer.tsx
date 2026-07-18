"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Gift, Share2, Clipboard, ClipboardCheck, Clock, MapPin, Truck } from "lucide-react";
import { useStore, Order } from "@/context/StoreContext";
import { synthAudio } from "./AudioEngine";

interface AccountDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountDrawer: React.FC<AccountDrawerProps> = ({ isOpen, onClose }) => {
  const { orders, rewardPoints, referralCode } = useStore();
  const [copied, setCopied] = useState(false);

  const handleCopyReferral = () => {
    synthAudio.playClick();
    navigator.clipboard.writeText(`Use my SORA code: ${referralCode} for 15% off first drop!`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Timeline statuses helper
  const getTimelineStep = (status: Order["status"]): number => {
    switch (status) {
      case "ordered": return 0;
      case "packed": return 1;
      case "shipped": return 2;
      case "out-for-delivery": return 3;
      case "delivered": return 4;
      default: return 0;
    }
  };

  const steps = ["ORDERED", "PACKED", "SHIPPED", "OUT FOR DELIVERY", "DELIVERED"];

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
            className="fixed right-0 top-0 bottom-0 h-full w-full max-w-lg z-100 glass-premium border-l border-white/10 flex flex-col p-6 shadow-2xl overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 260 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-accent-blue" />
                <span className="font-mono text-xs tracking-widest text-white">
                  CITIZEN SYSTEM PORTAL // SORA-78X2
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

            {/* Profile Grid Cards */}
            <div className="space-y-6">
              
              {/* Account Stats */}
              <div className="grid grid-cols-2 gap-4">
                {/* Reward Points */}
                <div className="glass border border-white/5 rounded-xl p-4 flex flex-col justify-between">
                  <div className="flex justify-between items-start text-silver/60">
                    <span className="font-mono text-[9px] tracking-wider">REWARDS POINTS</span>
                    <Gift className="w-4 h-4 text-accent-purple" />
                  </div>
                  <div className="mt-4">
                    <span className="text-2xl font-bold text-white tracking-wide">{rewardPoints}</span>
                    <span className="font-mono text-[9px] text-accent-purple block mt-1">PTS BALANCE</span>
                  </div>
                </div>

                {/* Referral Program */}
                <div className="glass border border-white/5 rounded-xl p-4 flex flex-col justify-between">
                  <div className="flex justify-between items-start text-silver/60">
                    <span className="font-mono text-[9px] tracking-wider">REFERRAL LINK</span>
                    <Share2 className="w-4 h-4 text-accent-blue" />
                  </div>
                  <div className="mt-2 flex gap-2">
                    <div className="bg-white/5 px-2.5 py-1.5 rounded font-mono text-[9px] text-white flex-grow flex items-center select-all">
                      {referralCode}
                    </div>
                    <button
                      onClick={handleCopyReferral}
                      className="p-1.5 bg-white text-black hover:bg-accent-blue hover:text-white rounded transition-colors cursor-pointer"
                      title="Copy code"
                    >
                      {copied ? <ClipboardCheck className="w-3.5 h-3.5" /> : <Clipboard className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Order History and Tracker */}
              <div>
                <h4 className="font-mono text-xs text-silver/60 tracking-wider mb-4 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-accent-blue" />
                  ORDER LOG TRACKING //
                </h4>
                
                {orders.length > 0 ? (
                  <div className="space-y-6 max-h-[380px] overflow-y-auto pr-1">
                    {orders.map((order) => {
                      const activeStep = getTimelineStep(order.status);
                      return (
                        <div
                          key={order.id}
                          className="glass border border-white/5 rounded-xl p-5 space-y-4 hover:border-white/10 transition-colors"
                        >
                          {/* Order metadata */}
                          <div className="flex justify-between items-start font-mono text-[10px]">
                            <div>
                              <span className="text-white font-semibold">{order.id}</span>
                              <span className="text-silver/40 block mt-0.5">PLACED ON {order.date}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-accent-blue font-semibold">${order.total} USD</span>
                              <span className="text-silver/40 block mt-0.5 uppercase">{order.paymentMethod}</span>
                            </div>
                          </div>

                          {/* Beautiful Horizontal Timeline */}
                          <div className="py-4">
                            {/* Line connecting nodes */}
                            <div className="relative w-full h-[2px] bg-white/5">
                              {/* Filled line */}
                              <div
                                className="absolute left-0 top-0 h-full bg-gradient-to-r from-accent-blue to-accent-purple transition-all duration-500"
                                style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
                              />

                              {/* Nodes */}
                              <div className="absolute w-full top-1/2 -translate-y-1/2 flex justify-between">
                                {steps.map((label, index) => {
                                  const isCompleted = index <= activeStep;
                                  const isCurrent = index === activeStep;
                                  return (
                                    <div key={label} className="flex flex-col items-center relative">
                                      {/* Node circle */}
                                      <div
                                        className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border transition-all duration-300 ${
                                          isCurrent
                                            ? "bg-accent-purple border-accent-purple glow-purple scale-110"
                                            : isCompleted
                                            ? "bg-accent-blue border-accent-blue"
                                            : "bg-[#0D0D0D] border-white/10"
                                        }`}
                                      >
                                        {isCompleted && (
                                          <div className="w-1 h-1 rounded-full bg-white" />
                                        )}
                                      </div>
                                      {/* Node text */}
                                      <span
                                        className={`absolute top-5 font-mono text-[7px] tracking-wider whitespace-nowrap ${
                                          isCurrent
                                            ? "text-accent-purple font-semibold"
                                            : isCompleted
                                            ? "text-white"
                                            : "text-silver/30"
                                        }`}
                                      >
                                        {label.split(" ")[0]}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>

                          {/* Tracking Number and Address summary */}
                          <div className="pt-4 border-t border-white/5 flex flex-col md:flex-row justify-between gap-2 font-mono text-[9px] text-silver/60">
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3 h-3 text-accent-blue" />
                              <span>TRACKING: <span className="text-white select-all">{order.trackingNumber}</span></span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3 h-3 text-accent-purple" />
                              <span className="truncate max-w-[200px]">SHIPPING: {order.address.street}, {order.address.city}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center glass border border-white/5 rounded-xl">
                    <Clock className="w-8 h-8 text-white/10 mb-4 animate-pulse" />
                    <span className="font-mono text-xs text-silver/40 tracking-widest uppercase">
                      No order telemetry recorded.
                      <br />
                      Complete a checkout to tracking logs.
                    </span>
                  </div>
                )}
              </div>

              {/* Saved Address Book */}
              <div className="glass border border-white/5 rounded-xl p-4 font-mono text-xs">
                <div className="text-silver/60 text-[9px] tracking-wider mb-2">DEFAULT COURIER DESTINATION //</div>
                <div className="text-white">
                  <div className="font-bold flex items-center gap-1">
                    SORA CITIZEN
                    <span className="text-[8px] bg-accent-blue/20 text-accent-blue px-1.5 py-0.5 rounded font-mono">DEFAULT</span>
                  </div>
                  <div className="text-silver/80 mt-1 leading-relaxed text-[11px]">
                    METRO SECTOR 7, SUITE 89<br />
                    MUMBAI, MH - 400001<br />
                    TEL: +91 9876543210
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
