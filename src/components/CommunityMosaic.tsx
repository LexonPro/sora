'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';

interface UserCard {
  id: string;
  span: string;
}

const CARDS: UserCard[] = [
  {
    id: '@user_01',
    span: 'col-span-1 sm:col-span-2 md:col-span-2 md:row-span-2 min-h-[240px] md:min-h-[340px]',
  },
  {
    id: '@user_02',
    span: 'col-span-1 sm:col-span-1 md:col-span-1 md:row-span-1 min-h-[160px]',
  },
  {
    id: '@user_03',
    span: 'col-span-1 sm:col-span-1 md:col-span-1 md:row-span-2 min-h-[240px] md:min-h-[340px]',
  },
  {
    id: '@user_04',
    span: 'col-span-1 sm:col-span-1 md:col-span-1 md:row-span-1 min-h-[160px]',
  },
  {
    id: '@user_05',
    span: 'col-span-1 sm:col-span-1 md:col-span-1 md:row-span-1 min-h-[160px]',
  },
  {
    id: '@user_06',
    span: 'col-span-1 sm:col-span-2 md:col-span-2 md:row-span-1 min-h-[160px]',
  },
  {
    id: '@user_07',
    span: 'col-span-1 sm:col-span-1 md:col-span-1 md:row-span-1 min-h-[160px]',
  },
  {
    id: '@user_08',
    span: 'col-span-1 sm:col-span-2 md:col-span-4 md:row-span-1 min-h-[140px]',
  },
];

export default function CommunityMosaic() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const validCards = cardsRef.current.filter(Boolean);
      if (validCards.length === 0) return;

      gsap.fromTo(
        validCards,
        {
          opacity: 0,
          y: 40,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: gridRef.current || sectionRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="community"
      ref={sectionRef}
      className="relative w-full py-24 px-4 sm:px-6 lg:px-8 bg-void overflow-hidden"
    >
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="font-display text-sm tracking-[0.4em] uppercase text-bone">
            SORA FAMILY
          </h2>
          <p className="font-mono text-xs text-[#D4A853] tracking-widest uppercase mt-2">
            #SORAWORLD
          </p>
        </div>

        {/* Asymmetric Grid */}
        <div
          ref={gridRef}
          className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[160px]"
        >
          {CARDS.map((card, index) => (
            <div
              key={card.id}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              className={`group relative rounded-2xl bg-charcoal border border-bone/10 p-6 flex items-center justify-center transition-all duration-300 ease-out hover:scale-[1.02] hover:border-[#D4A853]/50 cursor-pointer overflow-hidden ${card.span}`}
            >
              {/* Subtle background glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4A853]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              {/* Card Label */}
              <span className="font-mono text-xs sm:text-sm tracking-wider text-bone opacity-30 group-hover:opacity-60 transition-opacity duration-300 select-none">
                {card.id}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
