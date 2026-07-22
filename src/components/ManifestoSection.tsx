'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';

const MANIFESTO_TEXT = "We don't follow trends. We design worlds.";
const KEYWORDS = ['trends', 'design', 'worlds'];
const SUBTEXT =
  'SORA is a universe of self-expression. Every thread, every stitch, every detail — designed for those who refuse to blend in.';

export default function ManifestoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const validWords = wordsRef.current.filter(Boolean);
      if (validWords.length === 0) return;

      gsap.fromTo(
        validWords,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          stagger: 0.05,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'top 30%',
            scrub: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const words = MANIFESTO_TEXT.split(' ');

  return (
    <section
      id="manifesto"
      ref={sectionRef}
      className="relative min-h-screen w-full flex flex-col items-center justify-center px-6 py-24 text-center bg-void overflow-hidden"
    >
      <div className="max-w-5xl mx-auto flex flex-col items-center justify-center">
        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-relaxed select-none">
          {words.map((word, index) => {
            const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
            const isAmber = KEYWORDS.includes(cleanWord);
            return (
              <span
                key={index}
                ref={(el) => {
                  wordsRef.current[index] = el;
                }}
                className={`inline-block mr-[0.3em] last:mr-0 will-change-transform ${
                  isAmber ? 'text-[#D4A853]' : 'text-bone'
                }`}
              >
                {word}
              </span>
            );
          })}
        </h2>

        <p className="mt-12 sm:mt-16 font-sans text-sm text-bone/30 max-w-md mx-auto leading-relaxed">
          {SUBTEXT}
        </p>
      </div>
    </section>
  );
}
