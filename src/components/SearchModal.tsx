"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, TrendingUp } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { synthAudio } from "./AudioEngine";
import Link from "next/link";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenProduct: (productId: string) => void;
}

const trendingSearches = ["Tokyo", "Cargo", "Beanie", "Chain", "Gravity"];

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onOpenProduct }) => {
  const { products } = useStore();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      synthAudio.playWhoosh();
    } else {
      setQuery("");
    }
  }, [isOpen]);

  const filtered = query
    ? products.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSuggestionClick = (keyword: string) => {
    synthAudio.playClick();
    setQuery(keyword);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] bg-[#0d0d0d]/95 backdrop-blur-xl flex flex-col p-8 md:p-20 overflow-y-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Tech lines */}
          <div className="absolute inset-0 pointer-events-none hud-grid opacity-[0.03]" />

          {/* Header Close button */}
          <div className="flex justify-between items-center mb-16">
            <span className="font-mono text-[10px] tracking-[0.2em] text-accent-blue">
              SYSTEM SEARCH PORTAL // SORA.OS
            </span>
            <button
              onClick={() => {
                synthAudio.playClick();
                onClose();
              }}
              className="p-2 border border-white/10 rounded-full hover:border-white/30 text-silver hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="max-w-4xl mx-auto w-full flex-grow flex flex-col">
            {/* Input field */}
            <div className="relative border-b border-white/10 focus-within:border-accent-blue transition-colors pb-4 flex items-center">
              <Search className="w-8 h-8 text-silver mr-4" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (e.target.value.length > 0) synthAudio.playClick();
                }}
                placeholder="SEARCH SORA UNIVERSE..."
                className="w-full bg-transparent text-2xl md:text-4xl font-bold font-sans tracking-wide text-white border-none outline-none placeholder:text-white/20 uppercase"
              />
            </div>

            {/* Trending Suggestions */}
            {query.length === 0 && (
              <div className="mt-12">
                <h4 className="font-mono text-xs text-silver/60 tracking-wider mb-6 flex items-center gap-2">
                  <TrendingUp className="w-3.5 h-3.5 text-accent-purple" />
                  TRENDING CODES //
                </h4>
                <div className="flex flex-wrap gap-3">
                  {trendingSearches.map((word) => (
                    <button
                      key={word}
                      onClick={() => handleSuggestionClick(word)}
                      className="px-4 py-2 border border-white/5 rounded-full hover:border-accent-blue/30 text-sm font-mono text-silver hover:text-white hover:bg-accent-blue/5 transition-all cursor-pointer"
                    >
                      #{word.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Results Grid */}
            {query.length > 0 && (
              <div className="mt-12 flex-grow">
                <div className="font-mono text-xs text-silver/60 tracking-wider mb-6">
                  SEARCH RESULTS // {filtered.length} FOUND
                </div>
                {filtered.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filtered.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => {
                          synthAudio.playClick();
                          onOpenProduct(product.id);
                          onClose();
                        }}
                        className="glass border border-white/5 rounded-xl p-4 flex gap-4 hover:border-accent-blue/30 transition-all cursor-pointer hover:bg-white/2 group"
                      >
                        {/* Dummy/Procedural color block to act as preview */}
                        <div
                          className="w-16 h-16 rounded-lg flex items-center justify-center font-bold font-mono text-[9px] text-black shadow-inner"
                          style={{
                            background: `linear-gradient(135deg, ${product.color}50 0%, ${product.color} 100%)`,
                          }}
                        >
                          SORA
                        </div>
                        <div className="flex flex-col justify-center">
                          <span className="font-mono text-[10px] text-accent-purple tracking-widest uppercase">
                            {product.category}
                          </span>
                          <span className="font-sans font-semibold text-white tracking-wide group-hover:text-accent-blue transition-colors">
                            {product.name}
                          </span>
                          <span className="font-mono text-xs text-silver mt-1">
                            ${product.price} USD
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center font-mono text-silver/40 text-sm tracking-widest">
                    NO CYBER GEAR MATCHED YOUR SEARCH QUERY
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
