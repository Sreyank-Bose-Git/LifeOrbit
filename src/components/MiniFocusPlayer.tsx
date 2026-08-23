import React, { useState, useEffect } from "react";
import { Play, Pause, Maximize2, X, Plus, CheckCircle, Timer, ChevronLeft, ChevronRight, Minimize2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Endeavor } from "../types";

interface MiniFocusPlayerProps {
  isActive: boolean;
  isPaused: boolean;
  secondsRemaining: number;
  totalSeconds: number;
  currentEndeavor: Endeavor | null;
  onTogglePause: () => void;
  onAddFiveMinutes: () => void;
  onMaximize: () => void;
  onComplete: () => void;
  onClose: () => void;
}

export const MiniFocusPlayer: React.FC<MiniFocusPlayerProps> = ({
  isActive,
  isPaused,
  secondsRemaining,
  totalSeconds,
  currentEndeavor,
  onTogglePause,
  onAddFiveMinutes,
  onMaximize,
  onComplete,
  onClose,
}) => {
  const [isDocked, setIsDocked] = useState(false);

  // Auto-dock after 10 seconds of inactivity if active
  useEffect(() => {
    if (!isActive || isPaused) return;
    const timer = setTimeout(() => {
      setIsDocked(true);
    }, 10000);
    return () => clearTimeout(timer);
  }, [isActive, isPaused]);

  if (!isActive && secondsRemaining === totalSeconds) return null;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const progressPercent = Math.min(
    100,
    Math.max(0, ((totalSeconds - secondsRemaining) / (totalSeconds || 1)) * 100)
  );

  const endeavorColor = currentEndeavor?.color || "#10b981";

  if (isDocked) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        onMouseEnter={() => setIsDocked(false)}
        onClick={() => setIsDocked(false)}
        className="fixed bottom-6 right-6 z-50 bg-[#111111]/95 backdrop-blur-xl border border-white/20 rounded-full px-4 py-2 shadow-2xl flex items-center space-x-2.5 cursor-pointer hover:border-emerald-500/50 transition group"
        style={{ boxShadow: `0 8px 25px -5px ${endeavorColor}40` }}
        title="Hover or click to expand focus widget"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <Timer className="w-4 h-4 text-emerald-400 animate-pulse" />
        <span className="font-mono text-xs font-bold text-white tracking-tight">{timeFormatted}</span>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className="fixed bottom-6 right-6 z-50 flex items-center bg-[#111111]/95 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl p-3 pr-4 space-x-3.5 max-w-sm overflow-hidden group hover:border-white/30 transition-all duration-200"
        style={{
          boxShadow: `0 10px 30px -10px ${endeavorColor}30`,
        }}
      >
        {/* Glowing Progress Accent Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 overflow-hidden">
          <motion.div
            className="h-full"
            style={{
              width: `${progressPercent}%`,
              backgroundColor: endeavorColor,
            }}
          />
        </div>

        {/* Endeavor Icon or Timer badge */}
        <div
          onClick={onMaximize}
          className="w-11 h-11 rounded-xl flex flex-col items-center justify-center shrink-0 cursor-pointer relative overflow-hidden transition group-hover:scale-105 z-0 group-hover:z-10"
          style={{
            backgroundColor: `${endeavorColor}20`,
            borderColor: `${endeavorColor}40`,
          }}
        >
          <Timer
            className={`w-5 h-5 transition-transform duration-200 ${!isPaused ? "animate-pulse" : ""}`}
            style={{ color: endeavorColor }}
          />
        </div>

        {/* Title & Live Countdown */}
        <div onClick={onMaximize} className="min-w-0 flex-1 cursor-pointer">
          <div className="flex items-center space-x-1.5">
            <span
              className="w-1.5 h-1.5 rounded-full animate-ping shrink-0"
              style={{ backgroundColor: isPaused ? "#f59e0b" : "#10b981" }}
            />
            <h4 className="text-xs font-bold text-white truncate max-w-[140px]">
              {currentEndeavor?.title || "Deep Focus Sprint"}
            </h4>
          </div>
          <div className="flex items-center space-x-2 mt-0.5">
            <span className="font-mono text-sm font-extrabold text-slate-100 tracking-tight">
              {timeFormatted}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              {isPaused ? "Paused" : "In Progress"}
            </span>
          </div>
        </div>

        {/* Mini Player Controls */}
        <div className="flex items-center space-x-1 shrink-0">
          <button
            type="button"
            onClick={onTogglePause}
            className="p-2 text-slate-300 hover:text-white bg-white/5 hover:bg-white/15 rounded-xl cursor-pointer active:scale-90 transition"
            title={isPaused ? "Resume sprint" : "Pause sprint"}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5 fill-current" />}
          </button>

          <button
            type="button"
            onClick={onAddFiveMinutes}
            className="p-2 text-slate-300 hover:text-white bg-white/5 hover:bg-white/15 rounded-xl text-[10px] font-bold cursor-pointer active:scale-90 transition"
            title="Add +5 Minutes"
          >
            +5m
          </button>

          <button
            type="button"
            onClick={onComplete}
            className="p-2 text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-xl cursor-pointer active:scale-90 transition"
            title="Complete & Log XP"
          >
            <CheckCircle className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setIsDocked(true)}
            className="p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl cursor-pointer active:scale-90 transition"
            title="Auto-dock / Minimize widget"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onMaximize}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl cursor-pointer active:scale-90 transition"
            title="Expand Full Focus Room"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-slate-300 hover:bg-white/5 rounded-lg cursor-pointer active:scale-90 transition ml-0.5"
            title="Dismiss mini-player"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
