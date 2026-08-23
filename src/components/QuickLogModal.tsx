import React, { useState } from "react";
import {
  X,
  TrendingUp,
  Sparkles,
  Award,
  Smile,
  Meh,
  Frown,
  CheckCircle,
  Orbit,
  Radio,
} from "lucide-react";
import { motion } from "motion/react";
import { Endeavor, ProgressLog } from "../types";
import confetti from "canvas-confetti";

interface QuickLogModalProps {
  endeavor: Endeavor | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveLog: (
    endeavorId: string,
    value: number,
    note?: string,
    mood?: "great" | "good" | "neutral" | "tired"
  ) => void;
}

export const QuickLogModal: React.FC<QuickLogModalProps> = ({
  endeavor,
  isOpen,
  onClose,
  onSaveLog,
}) => {
  if (!isOpen || !endeavor) return null;

  const [value, setValue] = useState<number>(endeavor.archetype === "habit" ? 1 : 1);
  const [note, setNote] = useState("");
  const [mood, setMood] = useState<"great" | "good" | "neutral" | "tired">("great");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value === 0 && endeavor.archetype !== "habit") return;

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.7 },
    });

    onSaveLog(endeavor.id, Number(value), note.trim(), mood);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-black/85 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-[#06070B]/95 backdrop-blur-3xl rounded-[32px] max-w-md w-full border border-white/15 shadow-[0_0_80px_rgba(0,0,0,0.95)] overflow-hidden text-slate-200 relative font-mono"
      >
        {/* Ambient Grid overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />

        <div className="relative z-10 px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center space-x-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-black font-bold text-xs shadow-md"
              style={{ backgroundColor: endeavor.color || "#10b981" }}
            >
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm tracking-tight truncate max-w-[200px]">
                {endeavor.title}
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">RECORD TELEMETRY PROGRESS</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-white/10 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10 p-6 space-y-4 font-mono">
          {/* Increment Value */}
          {endeavor.archetype === "meter" ? (
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Progress Telemetry ({endeavor.unit})
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  step="any"
                  required
                  value={value}
                  onChange={(e) => setValue(Number(e.target.value))}
                  className="flex-1 px-3 py-2 bg-[#06070B] border border-white/15 rounded-xl text-lg font-bold text-white focus:outline-none focus:border-emerald-500/50"
                />
                <span className="text-xs font-bold text-slate-300 px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl">
                  {endeavor.unit}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                ORBIT TARGET: {endeavor.currentValue} / {endeavor.targetValue} {endeavor.unit}
              </p>
            </div>
          ) : (
            <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-2xl p-3.5 flex items-center justify-between shadow-[0_0_15px_rgba(52,211,153,0.15)]">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase">
                  Daily Habit Check-in
                </span>
                <p className="text-[10px] text-slate-400 font-sans mt-0.5">
                  Extends your continuous orbital streak and awards +25 XP
                </p>
              </div>
              <CheckCircle className="w-6 h-6 text-emerald-400" />
            </div>
          )}

          {/* Session Note */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Flight Reflection / Log Note
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Read cognitive chapter, executed morning routine..."
              rows={3}
              className="w-full px-3 py-2 bg-[#06070B] border border-white/15 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 font-sans"
            />
          </div>

          {/* Energy / Mood Rating */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Atmospheric Energy State
            </label>
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setMood("great")}
                className={`py-2 px-1 rounded-xl border text-center flex flex-col items-center space-y-1 transition cursor-pointer ${
                  mood === "great"
                    ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-400 font-bold shadow-[0_0_10px_rgba(52,211,153,0.2)]"
                    : "border-white/10 bg-[#06070B] text-slate-400 hover:text-slate-200"
                }`}
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-[9px] uppercase">Peak</span>
              </button>
              <button
                type="button"
                onClick={() => setMood("good")}
                className={`py-2 px-1 rounded-xl border text-center flex flex-col items-center space-y-1 transition cursor-pointer ${
                  mood === "good"
                    ? "border-cyan-500/40 bg-cyan-500/15 text-cyan-400 font-bold shadow-[0_0_10px_rgba(34,211,238,0.2)]"
                    : "border-white/10 bg-[#06070B] text-slate-400 hover:text-slate-200"
                }`}
              >
                <Smile className="w-4 h-4 text-cyan-400" />
                <span className="text-[9px] uppercase">Good</span>
              </button>
              <button
                type="button"
                onClick={() => setMood("neutral")}
                className={`py-2 px-1 rounded-xl border text-center flex flex-col items-center space-y-1 transition cursor-pointer ${
                  mood === "neutral"
                    ? "border-amber-500/40 bg-amber-500/15 text-amber-400 font-bold shadow-[0_0_10px_rgba(251,191,36,0.2)]"
                    : "border-white/10 bg-[#06070B] text-slate-400 hover:text-slate-200"
                }`}
              >
                <Meh className="w-4 h-4 text-amber-400" />
                <span className="text-[9px] uppercase">Steady</span>
              </button>
              <button
                type="button"
                onClick={() => setMood("tired")}
                className={`py-2 px-1 rounded-xl border text-center flex flex-col items-center space-y-1 transition cursor-pointer ${
                  mood === "tired"
                    ? "border-purple-500/40 bg-purple-500/15 text-purple-400 font-bold shadow-[0_0_10px_rgba(168,85,247,0.2)]"
                    : "border-white/10 bg-[#06070B] text-slate-400 hover:text-slate-200"
                }`}
              >
                <Frown className="w-4 h-4 text-purple-400" />
                <span className="text-[9px] uppercase">Fatigued</span>
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-emerald-400 hover:bg-emerald-300 active:scale-98 text-black font-bold text-xs uppercase rounded-xl shadow-[0_0_20px_rgba(52,211,153,0.35)] transition cursor-pointer"
            >
              Commit Telemetry (+35 XP)
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
