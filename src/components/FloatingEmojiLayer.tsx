import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

export interface EmojiBurstEvent {
  id: string;
  emoji: string;
  x: number;
  y: number;
  count: number;
}

interface FloatingEmoji {
  id: string;
  emoji: string;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  rotation: number;
}

interface FloatingEmojiLayerProps {
  enabled?: boolean;
  density?: "minimal" | "ambient" | "vibrant";
}

const DEFAULT_EMOJIS = ["🚀", "⚡", "🔥", "💎", "🌟", "✨", "🎯", "🏆", "🧠", "🪐", "🌿", "🧘"];

export const FloatingEmojiLayer: React.FC<FloatingEmojiLayerProps> = ({
  enabled = true,
  density = "ambient",
}) => {
  const [ambientEmojis, setAmbientEmojis] = useState<FloatingEmoji[]>([]);
  const [bursts, setBursts] = useState<
    Array<{
      id: string;
      emoji: string;
      x: number;
      y: number;
      vx: number;
      vy: number;
      scale: number;
      rot: number;
    }>
  >([]);

  // Generate ambient floating particles
  useEffect(() => {
    if (!enabled) {
      setAmbientEmojis([]);
      return;
    }

    const count = density === "minimal" ? 6 : density === "ambient" ? 14 : 24;
    const generated: FloatingEmoji[] = [];

    for (let i = 0; i < count; i++) {
      generated.push({
        id: `emoji-${i}-${Date.now()}`,
        emoji: DEFAULT_EMOJIS[Math.floor(Math.random() * DEFAULT_EMOJIS.length)],
        x: Math.random() * 92 + 4, // % across viewport
        y: Math.random() * 90 + 5, // % across viewport
        size: Math.random() * 14 + 18, // px
        duration: Math.random() * 16 + 14, // seconds
        delay: Math.random() * 5,
        rotation: (Math.random() - 0.5) * 45,
      });
    }

    setAmbientEmojis(generated);
  }, [enabled, density]);

  // Listen for global custom event 'orbit:emoji-burst'
  useEffect(() => {
    const handleBurst = (e: CustomEvent<{ emoji?: string; x?: number; y?: number; count?: number }>) => {
      const { emoji = "🔥", x = window.innerWidth / 2, y = window.innerHeight / 2, count = 12 } = e.detail || {};

      const newBursts = Array.from({ length: count }).map((_, i) => ({
        id: `burst-${Date.now()}-${i}-${Math.random()}`,
        emoji: emoji === "random" ? DEFAULT_EMOJIS[Math.floor(Math.random() * DEFAULT_EMOJIS.length)] : emoji,
        x,
        y,
        vx: (Math.random() - 0.5) * 260,
        vy: -Math.random() * 220 - 80,
        scale: Math.random() * 0.6 + 0.8,
        rot: (Math.random() - 0.5) * 90,
      }));

      setBursts((prev) => [...prev, ...newBursts]);

      // Clear after animation finishes
      setTimeout(() => {
        setBursts((prev) => prev.filter((b) => !newBursts.some((nb) => nb.id === b.id)));
      }, 1600);
    };

    window.addEventListener("orbit:emoji-burst" as any, handleBurst);
    return () => window.removeEventListener("orbit:emoji-burst" as any, handleBurst);
  }, []);

  // Helper trigger function that can be exported or attached to window
  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden select-none" aria-hidden="true">
      {/* Ambient Floating Emojis */}
      {enabled &&
        ambientEmojis.map((item) => (
          <motion.div
            key={item.id}
            initial={{
              x: `${item.x}vw`,
              y: `${item.y}vh`,
              opacity: 0,
              rotate: item.rotation,
            }}
            animate={{
              y: [`${item.y}vh`, `${(item.y + 12) % 90}vh`, `${item.y}vh`],
              x: [`${item.x}vw`, `${(item.x + 6) % 95}vw`, `${item.x}vw`],
              rotate: [item.rotation, item.rotation + 20, item.rotation],
              opacity: [0.15, 0.45, 0.2],
              scale: [0.9, 1.1, 0.95],
            }}
            transition={{
              duration: item.duration,
              repeat: Infinity,
              delay: item.delay,
              ease: "easeInOut",
            }}
            className="absolute cursor-pointer transition-transform hover:scale-150 pointer-events-auto filter drop-shadow-md"
            style={{ fontSize: `${item.size}px` }}
            onClick={(e) => {
              // Click to trigger ripple burst
              triggerGlobalEmojiBurst(item.emoji, e.clientX, e.clientY, 6);
            }}
          >
            {item.emoji}
          </motion.div>
        ))}

      {/* Dynamic Celebration Emoji Bursts */}
      <AnimatePresence>
        {bursts.map((b) => (
          <motion.div
            key={b.id}
            initial={{
              left: b.x,
              top: b.y,
              scale: 0.2,
              opacity: 1,
              rotate: 0,
            }}
            animate={{
              left: b.x + b.vx,
              top: b.y + b.vy,
              scale: b.scale * 1.3,
              opacity: 0,
              rotate: b.rot * 2,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            className="absolute text-3xl filter drop-shadow-lg"
          >
            {b.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// Global helper function to fire emoji explosions anywhere in the app
export const triggerGlobalEmojiBurst = (emoji = "🔥", x?: number, y?: number, count = 12) => {
  const defaultX = typeof window !== "undefined" ? window.innerWidth / 2 : 300;
  const defaultY = typeof window !== "undefined" ? window.innerHeight / 2 : 300;

  const evt = new CustomEvent("orbit:emoji-burst", {
    detail: {
      emoji,
      x: x !== undefined ? x : defaultX,
      y: y !== undefined ? y : defaultY,
      count,
    },
  });
  window.dispatchEvent(evt);
};
