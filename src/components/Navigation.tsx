"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export default function Navigation() {
  const navRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.8);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { label: "Collection", href: "#products" },
    { label: "Categories", href: "#collections" },
    { label: "Manifesto", href: "#manifesto" },
    { label: "Community", href: "#community" },
  ];

  return (
    <>
      {/* Fixed navigation bar */}
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-700"
        style={{
          transform: visible ? "translateY(0)" : "translateY(-100%)",
          opacity: visible ? 1 : 0,
        }}
      >
        <div className="mx-auto px-8 py-5 flex items-center justify-between backdrop-blur-md bg-void/70 border-b border-bone/5">
          {/* Logo */}
          <Link
            href="/"
            className="font-display text-sm tracking-[0.4em] text-bone uppercase"
            data-cursor="pointer"
          >
            SORA
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-10">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="font-sans text-[11px] tracking-[0.2em] text-bone/40 uppercase hover:text-bone transition-colors duration-500"
                data-cursor="pointer"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-[5px] p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            data-cursor="pointer"
            aria-label="Toggle menu"
          >
            <span
              className={`block w-5 h-[1px] bg-bone transition-transform duration-500 ${
                menuOpen ? "rotate-45 translate-y-[6px]" : ""
              }`}
            />
            <span
              className={`block w-5 h-[1px] bg-bone transition-opacity duration-500 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-5 h-[1px] bg-bone transition-transform duration-500 ${
                menuOpen ? "-rotate-45 -translate-y-[6px]" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile fullscreen overlay */}
      <div
        className={`fixed inset-0 z-40 bg-void flex flex-col items-center justify-center gap-8 transition-all duration-700 md:hidden ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {links.map((link, i) => (
          <a
            key={link.label}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            className="font-display text-3xl tracking-[0.3em] text-bone/60 uppercase hover:text-amber transition-colors duration-500"
            style={{ transitionDelay: menuOpen ? `${i * 80}ms` : "0ms" }}
            data-cursor="pointer"
          >
            {link.label}
          </a>
        ))}
      </div>
    </>
  );
}
