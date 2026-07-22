'use client';

import React, { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

const products = [
  { id: 'shadow-realm', name: 'Shadow Realm', category: 'Oversized Hoodie', price: '₹4,499', color: '#1A1A1A', shape: 'circle' },
  { id: 'neon-prophet', name: 'Neon Prophet', category: 'Graphic Tee', price: '₹2,499', color: '#1f1a2e', shape: 'diamond' },
  { id: 'void-walker', name: 'Void Walker', category: 'Cargo Pants', price: '₹3,999', color: '#1a1e1a', shape: 'hexagon' },
  { id: 'astral-drift', name: 'Astral Drift', category: 'Bomber Jacket', price: '₹6,999', color: '#1e1a1a', shape: 'cut-rect' },
];

export default function ProductShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const productsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // We store the timeline in a variable to ensure clean up
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=300%',
          pin: true,
          scrub: 1,
        }
      });

      products.forEach((product, index) => {
        if (index === 0) {
          // Product 1 fades out
          tl.to(productsRef.current[index], { opacity: 0, y: -50, duration: 1, ease: 'power2.inOut' }, 1);
        } else {
          // Change background color gradually before the next product appears
          tl.to(section, { backgroundColor: product.color, duration: 1, ease: 'none' }, index * 2 - 1);
          
          // Fade in current product
          tl.fromTo(productsRef.current[index], 
            { opacity: 0, y: 50 }, 
            { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }, 
            index * 2
          );
          
          // Fade out current product (unless it's the last one)
          if (index < products.length - 1) {
            tl.to(productsRef.current[index], 
              { opacity: 0, y: -50, duration: 1, ease: 'power2.in' }, 
              index * 2 + 1
            );
          }
        }
      });
    }, sectionRef);

    return () => {
      ctx.revert(); // clean up GSAP context
    };
  }, []);

  const renderShape = (shape: string) => {
    switch (shape) {
      case 'circle':
        return <div className="w-56 h-56 md:w-96 md:h-96 rounded-full bg-gradient-to-tr from-neutral-800 to-neutral-600 border border-neutral-700 shadow-2xl" />;
      case 'diamond':
        return <div className="w-56 h-56 md:w-96 md:h-96 bg-gradient-to-tr from-indigo-900 to-purple-800 border border-indigo-700 shadow-2xl rotate-45" />;
      case 'hexagon':
        return <div className="w-56 h-56 md:w-96 md:h-96 bg-gradient-to-tr from-emerald-900 to-teal-800 border border-emerald-700 shadow-2xl" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }} />;
      case 'cut-rect':
        return <div className="w-56 h-56 md:w-96 md:h-96 bg-gradient-to-tr from-rose-900 to-orange-800 border border-rose-700 shadow-2xl" style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 80%, 80% 100%, 0 100%, 0 20%)' }} />;
      default:
        return null;
    }
  };

  return (
    <section 
      id="products" 
      ref={sectionRef} 
      className="relative h-screen w-full overflow-hidden bg-[#1A1A1A] text-white flex items-center justify-center"
    >
      {products.map((product, index) => (
        <div 
          key={product.id}
          ref={(el) => {
            productsRef.current[index] = el;
          }}
          className="absolute inset-0 w-full h-full flex flex-col-reverse md:flex-row items-center justify-center p-6 md:p-16 max-w-7xl mx-auto"
          style={{ opacity: index === 0 ? 1 : 0, transform: index === 0 ? 'translateY(0)' : 'translateY(50px)' }}
        >
          {/* Left Side (60%) */}
          <div className="w-full md:w-[60%] flex flex-col justify-center z-10 md:pr-12 text-center md:text-left">
            <span className="font-mono text-xs md:text-sm text-zinc-400 uppercase tracking-[0.2em] mb-4 block">
              {product.category}
            </span>
            <h2 className="font-display text-[14vw] md:text-[8vw] leading-[0.9] uppercase font-black mb-6 tracking-tighter">
              {product.name}
            </h2>
            <span className="font-mono text-lg md:text-2xl text-white">
              {product.price}
            </span>
          </div>

          {/* Right Side (40%) */}
          <div className="w-full md:w-[40%] h-[40vh] md:h-auto flex items-center justify-center relative mb-8 md:mb-0">
            {renderShape(product.shape)}
          </div>
          
          {/* Ghosted Index */}
          <div className="absolute top-4 right-4 md:top-8 md:right-8 font-display text-[25vw] md:text-[20vw] leading-none text-white opacity-5 font-black pointer-events-none select-none">
            0{index + 1}
          </div>
        </div>
      ))}
    </section>
  );
}
