"use client";

import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";

class SynthSoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    if (typeof window !== "undefined") {
      const storedMute = localStorage.getItem("sora_muted");
      this.isMuted = storedMute === "true";
    }
  }

  private init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    // Resume context if suspended
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
    if (typeof window !== "undefined") {
      localStorage.setItem("sora_muted", String(muted));
    }
  }

  getMuted() {
    return this.isMuted;
  }

  playClick() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.type = "sine";
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.05);

    gainNode.gain.setValueAtTime(0.04, this.ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  playHover() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.type = "triangle";
    osc.frequency.setValueAtTime(580, this.ctx.currentTime);
    osc.frequency.setValueAtTime(620, this.ctx.currentTime + 0.02);

    gainNode.gain.setValueAtTime(0.015, this.ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.06);
  }

  playChime() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const playNote = (freq: number, delay: number, duration: number) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();

      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + delay);

      gainNode.gain.setValueAtTime(0.0, now + delay);
      gainNode.gain.linearRampToValueAtTime(0.03, now + delay + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + delay + duration);

      osc.start(now + delay);
      osc.stop(now + delay + duration);
    };

    // Arpeggio
    playNote(523.25, 0, 0.25); // C5
    playNote(659.25, 0.05, 0.25); // E5
    playNote(783.99, 0.1, 0.25); // G5
    playNote(1046.50, 0.15, 0.35); // C6
  }

  playWhoosh() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.type = "sine";
    osc.frequency.setValueAtTime(90, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(320, this.ctx.currentTime + 0.18);

    gainNode.gain.setValueAtTime(0.03, this.ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.18);
  }
}

// Global instance
export const synthAudio = new SynthSoundEngine();

export const MuteToggle: React.FC = () => {
  const [muted, setMuted] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setMuted(synthAudio.getMuted());
  }, []);

  const handleToggle = () => {
    const nextState = !muted;
    synthAudio.setMuted(nextState);
    setMuted(nextState);
    if (!nextState) {
      synthAudio.playClick();
    }
  };

  if (!isClient) return null;

  return (
    <button
      onClick={handleToggle}
      className="flex items-center gap-2 p-2 rounded-full border border-white/10 hover:border-accent-blue/40 bg-white/5 transition-all group relative overflow-hidden focus:outline-none cursor-pointer"
      title={muted ? "Unmute sounds" : "Mute sounds"}
      onMouseEnter={() => synthAudio.playHover()}
    >
      <div className="absolute inset-0 bg-accent-blue/10 scale-0 group-hover:scale-100 rounded-full transition-transform duration-300" />
      {muted ? (
        <VolumeX className="w-4 h-4 text-silver group-hover:text-white transition-colors" />
      ) : (
        <Volume2 className="w-4 h-4 text-accent-blue group-hover:text-white transition-colors" />
      )}
      
      {/* Animated Sound Waves Level Indicator */}
      {!muted && (
        <div className="flex items-end gap-[2px] h-3 w-4">
          <div className="w-[2px] bg-accent-blue animate-pulse h-1/2" style={{ animationDelay: '0.1s' }} />
          <div className="w-[2px] bg-accent-blue animate-pulse h-full" style={{ animationDelay: '0.3s' }} />
          <div className="w-[2px] bg-accent-blue animate-pulse h-1/3" style={{ animationDelay: '0.5s' }} />
          <div className="w-[2px] bg-accent-blue animate-pulse h-2/3" style={{ animationDelay: '0.2s' }} />
        </div>
      )}
    </button>
  );
};
