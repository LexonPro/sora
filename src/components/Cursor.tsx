'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function Cursor() {
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const dotInnerRef = useRef<HTMLDivElement>(null);
  const ringInnerRef = useRef<HTMLDivElement>(null);

  // Animation & position tracking refs (avoids React re-renders)
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const scaleRef = useRef(1);
  const targetScaleRef = useRef(1);
  const hoverStateRef = useRef<'default' | 'pointer' | 'text'>('default');
  const customTextRef = useRef<string>('View');
  const isMouseDownRef = useRef(false);
  const isVisibleRef = useRef(false);
  const hasMovedRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    // 1. Hide on touch devices
    if (
      typeof window !== 'undefined' &&
      ('ontouchstart' in window || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0))
    ) {
      setIsTouchDevice(true);
      return;
    }

    // 2. Mouse tracking & interactive state evaluation
    const updateCursorTarget = (targetElement: HTMLElement | null) => {
      const target = targetElement?.closest?.('[data-cursor]') as HTMLElement | null;
      if (target) {
        const cursorType = target.getAttribute('data-cursor');
        const customText = target.getAttribute('data-cursor-text') || 'View';
        customTextRef.current = customText;

        if (cursorType === 'pointer') {
          hoverStateRef.current = 'pointer';
        } else if (cursorType === 'text') {
          hoverStateRef.current = 'text';
        } else {
          hoverStateRef.current = 'default';
        }
      } else {
        hoverStateRef.current = 'default';
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      if (!hasMovedRef.current) {
        hasMovedRef.current = true;
        // Snap ring initial position to cursor on first movement
        ringPos.current = { x: e.clientX, y: e.clientY };
      }
      isVisibleRef.current = true;

      updateCursorTarget(e.target as HTMLElement);
    };

    const handleMouseOver = (e: MouseEvent) => {
      updateCursorTarget(e.target as HTMLElement);
    };

    const handleMouseDown = () => {
      isMouseDownRef.current = true;
    };

    const handleMouseUp = () => {
      isMouseDownRef.current = false;
    };

    const handleMouseLeave = () => {
      isVisibleRef.current = false;
    };

    const handleMouseEnter = () => {
      if (hasMovedRef.current) {
        isVisibleRef.current = true;
      }
    };

    // Global event listeners
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // 3. RAF animation loop with spring lerp (0.15)
    const animate = () => {
      // Lerp ring position
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.15;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.15;

      // Determine target scale based on state & click state
      let baseScale = 1.0;
      if (hoverStateRef.current === 'pointer') {
        baseScale = 1.5;
      } else if (hoverStateRef.current === 'text') {
        baseScale = 2.5;
      }

      if (isMouseDownRef.current) {
        baseScale *= 0.8;
      }

      targetScaleRef.current = baseScale;
      scaleRef.current += (targetScaleRef.current - scaleRef.current) * 0.15;

      const isVisible = isVisibleRef.current;
      const opacityVal = isVisible ? '1' : '0';

      // Update inner dot DOM directly
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0) translate(-50%, -50%)`;
        dotRef.current.style.opacity = opacityVal;
      }

      if (dotInnerRef.current) {
        const isHovered = hoverStateRef.current === 'pointer' || hoverStateRef.current === 'text';
        dotInnerRef.current.style.transform = isHovered ? 'scale(0)' : 'scale(1)';
        dotInnerRef.current.style.opacity = isHovered ? '0' : '1';
      }

      // Update outer ring DOM directly
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%) scale(${scaleRef.current})`;
        ringRef.current.style.opacity = opacityVal;
      }

      if (ringInnerRef.current) {
        const isHovered = hoverStateRef.current === 'pointer' || hoverStateRef.current === 'text';
        ringInnerRef.current.style.borderColor = isHovered ? '#D4A853' : 'rgba(240, 237, 232, 0.3)';
      }

      if (textRef.current) {
        const isText = hoverStateRef.current === 'text';
        textRef.current.style.opacity = isText ? '1' : '0';
        if (isText && textRef.current.textContent !== customTextRef.current) {
          textRef.current.textContent = customTextRef.current;
        }
      }

      rafIdRef.current = requestAnimationFrame(animate);
    };

    rafIdRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  if (isTouchDevice) {
    return null;
  }

  return (
    <>
      {/* Inner Dot */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '6px',
          height: '6px',
          pointerEvents: 'none',
          zIndex: 9999,
          opacity: 0,
          willChange: 'transform, opacity',
        }}
      >
        <div
          ref={dotInnerRef}
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#F0EDE8',
            borderRadius: '50%',
            transition: 'transform 0.15s ease-out, opacity 0.15s ease-out',
          }}
        />
      </div>

      {/* Outer Ring */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '36px',
          height: '36px',
          pointerEvents: 'none',
          zIndex: 9999,
          opacity: 0,
          willChange: 'transform, opacity',
        }}
      >
        <div
          ref={ringInnerRef}
          style={{
            width: '100%',
            height: '100%',
            border: '1px solid rgba(240, 237, 232, 0.3)',
            borderRadius: '50%',
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'border-color 0.2s ease, background-color 0.2s ease',
          }}
        >
          <span
            ref={textRef}
            style={{
              color: '#F0EDE8',
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              opacity: 0,
              transition: 'opacity 0.2s ease',
              userSelect: 'none',
              lineHeight: 1,
            }}
          >
            View
          </span>
        </div>
      </div>
    </>
  );
}
