'use client';

import React, { useRef, useEffect } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

const collections = [
  { 
    name: 'ANIME', 
    subtitle: 'Inspired by worlds beyond', 
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' 
  },
  { 
    name: 'STREET', 
    subtitle: 'Born on concrete', 
    gradient: 'linear-gradient(135deg, #1a1e1a 0%, #2d3436 100%)' 
  },
  { 
    name: 'OVERSIZED', 
    subtitle: 'Volume speaks', 
    gradient: 'linear-gradient(135deg, #2d1f3d 0%, #1a1a2e 100%)' 
  },
  { 
    name: 'KOREAN', 
    subtitle: 'Minimal edge', 
    gradient: 'linear-gradient(135deg, #1e1a1a 0%, #2c2c2c 100%)' 
  },
];

export default function CollectionReel() {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !wrapperRef.current) return;

    const section = sectionRef.current;
    const wrapper = wrapperRef.current;
    
    // We use matchMedia to only apply horizontal scroll on desktop
    const mm = gsap.matchMedia();

    mm.add('(min-width: 768px)', () => {
      const cards = gsap.utils.toArray('.collection-card') as HTMLElement[];
      const totalWidth = wrapper.scrollWidth;
      const viewportWidth = window.innerWidth;

      // The horizontal scroll tween
      const scrollTween = gsap.to(wrapper, {
        x: () => -(totalWidth - viewportWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: '+=250%',
          invalidateOnRefresh: true,
        }
      });

      // Inner parallax for text
      cards.forEach((card) => {
        const textWrapper = card.querySelector('.collection-text-wrapper');
        if (textWrapper) {
          gsap.fromTo(
            textWrapper,
            { x: -80 },
            {
              x: 80,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                containerAnimation: scrollTween,
                start: 'left right',
                end: 'right left',
                scrub: 1,
              },
            }
          );
        }
      });

      return () => {
        scrollTween.kill();
      };
    });

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section 
      id="collections" 
      ref={sectionRef} 
      className="relative w-full bg-black text-[#E8E8E3] overflow-hidden md:h-screen"
    >
      {/* Section Header */}
      <div className="absolute top-8 left-8 md:top-12 md:left-12 z-20">
        <h2 className="font-mono text-xs md:text-sm tracking-[0.2em] opacity-60">
          CATEGORIES
        </h2>
      </div>

      {/* Reel Wrapper */}
      <div className="w-full flex flex-col md:flex-row items-center pt-32 pb-16 md:pt-0 md:pb-0 md:h-screen">
        <div 
          ref={wrapperRef} 
          className="flex flex-col md:flex-row w-full md:w-[max-content] md:h-[70vh] gap-8 md:gap-16 px-6 md:px-[25vw] items-center"
        >
          {collections.map((col) => (
            <div 
              key={col.name} 
              className="collection-card relative flex-shrink-0 w-[80vw] md:w-[50vw] h-[60vh] md:h-[70vh] rounded-lg border border-[#E8E8E3]/5 hover:border-[#E8E8E3]/20 transition-all duration-500 ease-out hover:scale-[1.02] overflow-hidden flex flex-col items-center justify-center cursor-pointer will-change-transform"
              style={{ background: col.gradient }}
            >
              <div className="collection-text-wrapper flex flex-col items-center text-center px-4 w-full">
                <h3 className="font-display text-[15vw] md:text-[10vw] font-light tracking-[0.1em] leading-none mb-2 md:mb-4">
                  {col.name}
                </h3>
                <p className="font-sans text-sm md:text-base opacity-40 tracking-widest uppercase">
                  {col.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
