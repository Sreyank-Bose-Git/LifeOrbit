import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Zap, Orbit, Compass, Radio } from "lucide-react";
import { focusAudio } from "../lib/audio";
import { ThemeAccent } from "../types";

interface CinematicIntroLogoProps {
  isOpen: boolean;
  onComplete: () => void;
  spaceName?: string;
  avatarIcon?: string;
  accent?: ThemeAccent;
}

export const CinematicIntroLogo: React.FC<CinematicIntroLogoProps> = ({
  isOpen,
  onComplete,
  spaceName = "Personal Space",
  avatarIcon = "🚀",
  accent = "emerald",
}) => {
  // Accent mapping
  const accentGlow = {
    emerald: "from-emerald-400 via-teal-300 to-emerald-600 shadow-emerald-500/50 text-emerald-400",
    violet: "from-purple-400 via-indigo-300 to-purple-600 shadow-purple-500/50 text-purple-400",
    amber: "from-amber-400 via-orange-300 to-amber-600 shadow-amber-500/50 text-amber-400",
    cyan: "from-cyan-400 via-blue-300 to-cyan-600 shadow-cyan-500/50 text-cyan-400",
    rose: "from-rose-400 via-pink-300 to-rose-600 shadow-rose-500/50 text-rose-400",
    slate: "from-slate-300 via-white to-slate-500 shadow-slate-500/50 text-slate-300",
  }[accent] || "from-emerald-400 via-teal-300 to-emerald-600 shadow-emerald-500/50 text-emerald-400";

  // Auto-dismiss & sound trigger
  useEffect(() => {
    if (isOpen) {
      focusAudio.playIntroLogoSound();
      const timer = setTimeout(() => {
        onComplete();
      }, 2400);

      const handleKey = (e: KeyboardEvent) => {
        if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
          onComplete();
        }
      };
      window.addEventListener("keydown", handleKey);

      return () => {
        clearTimeout(timer);
        window.removeEventListener("keydown", handleKey);
      };
    }
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.05, filter: "blur(12px)" }}
        transition={{ duration: 0.5 }}
        onClick={onComplete}
        className="fixed inset-0 z-50 bg-[#050505] flex flex-col items-center justify-center cursor-pointer select-none overflow-hidden"
      >
        {/* Background Radial Light Swell */}
        <motion.div
          initial={{ scale: 0.2, opacity: 0 }}
          animate={{ scale: [0.2, 1.8, 2.4], opacity: [0, 0.4, 0.25] }}
          transition={{ duration: 2.2, ease: "easeOut" }}
          className="absolute w-[600px] h-[600px] rounded-full bg-radial from-emerald-500/20 via-cyan-500/10 to-transparent blur-3xl pointer-events-none"
        />

        {/* Outer Orbiting Rings */}
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
          {/* Ring 1 - Fast Clockwise */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border border-dashed border-white/15"
          />

          {/* Ring 2 - Counter-Clockwise Glowing Ring */}
          <motion.div
            initial={{ scale: 0.4, rotate: 0 }}
            animate={{ scale: [0.4, 1.1, 1], rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute inset-4 rounded-full border-2 border-t-emerald-400 border-r-transparent border-b-cyan-400 border-l-transparent shadow-lg shadow-emerald-500/20"
          />

          {/* Ring 3 - 3D Perspective Tilt Ring */}
          <motion.div
            initial={{ scale: 0, rotateX: 65, rotateZ: 0 }}
            animate={{ scale: 1, rotateX: 65, rotateZ: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            className="absolute inset-2 rounded-full border border-emerald-400/40"
          />

          {/* Core Nucleus Glowing Orb */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.2, 1], opacity: 1 }}
            transition={{ duration: 0.8, ease: "backOut" }}
            className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-[#0D0D0D] border border-white/20 shadow-2xl flex items-center justify-center backdrop-blur-xl overflow-hidden group"
          >
            {/* Shimmer light pass */}
            <motion.div
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
            />

            <span className="text-4xl sm:text-5xl drop-shadow-lg transform group-hover:scale-110 transition-transform">
              {avatarIcon}
            </span>
          </motion.div>

          {/* Orbiting Sparkles */}
          {[0, 90, 180, 270].map((deg, i) => (
            <motion.div
              key={deg}
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 1, 0.4, 1],
                scale: [0.5, 1.2, 0.8, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.25,
                ease: "easeInOut",
              }}
              style={{
                position: "absolute",
                transform: `rotate(${deg}deg) translate(140px) rotate(-${deg}deg)`,
              }}
              className="w-3 h-3 rounded-full bg-emerald-400 shadow-md shadow-emerald-400/80"
            />
          ))}
        </div>

        {/* Title & Space Name Reveal */}
        <div className="mt-8 text-center space-y-2 z-10 px-4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center justify-center space-x-2.5"
          >
            <Orbit className="w-5 h-5 text-emerald-400 animate-spin" style={{ animationDuration: "6s" }} />
            <h1 className="text-3xl sm:text-4xl font-black tracking-wider text-white uppercase font-mono">
              LIFE<span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">ORBIT</span> OS
            </h1>
          </motion.div>

          <motion.div
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex items-center justify-center space-x-2 text-xs font-mono text-slate-400"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-slate-300 font-semibold">{spaceName}</span>
            <span className="text-slate-600">//</span>
            <span className="text-emerald-400 font-medium">Local-First Engine Armed</span>
          </motion.div>
        </div>

        {/* Skip hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.7, 0.4] }}
          transition={{ duration: 1.5, delay: 0.9 }}
          className="absolute bottom-8 text-[11px] font-mono text-slate-500 uppercase tracking-widest"
        >
          Click or press Space to enter
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
