import React, { useState } from "react";
import { X, TrendingUp, Sparkles, Award, Smile, Meh, Frown, CheckCircle } from "lucide-react";
import { Endeavor, ProgressLog } from "../types";
import confetti from "canvas-confetti";

interface QuickLogModalProps {
  endeavor: Endeavor | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveLog: (endeavorId: string, value: number, note?: string, mood?: "great" | "good" | "neutral" | "tired") => void;
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
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#141414] rounded-3xl max-w-md w-full border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-slate-200">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-[#0D0D0D]">
          <div className="flex items-center space-x-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-black font-bold text-xs"
              style={{ backgroundColor: endeavor.color || "#10b981" }}
            >
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">{endeavor.title}</h3>
              <p className="text-[11px] text-slate-400">Record activity progress & reflection</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-slate-200 hover:bg-white/5 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Increment Value */}
          {endeavor.archetype === "meter" ? (
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Progress to add ({endeavor.unit})
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  step="any"
                  required
                  value={value}
                  onChange={(e) => setValue(Number(e.target.value))}
                  className="flex-1 px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-lg font-bold text-white focus:outline-none focus:border-emerald-500/50"
                />
                <span className="text-sm font-semibold text-slate-400 px-3 py-2 bg-white/5 border border-white/5 rounded-xl">
                  {endeavor.unit}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Current: {endeavor.currentValue} / Target: {endeavor.targetValue} {endeavor.unit}
              </p>
            </div>
          ) : (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-3.5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-400">Daily Habit Check-in</span>
                <p className="text-[11px] text-slate-400">Adds 1 day to your active streak and earns +25 XP</p>
              </div>
              <CheckCircle className="w-6 h-6 text-emerald-400" />
            </div>
          )}

          {/* Session Note */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Reflection / Notes (Optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Read chapters 4-5 on cognitive bias, felt super energized..."
              rows={3}
              className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          {/* Energy / Mood Rating */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              How did this session feel?
            </label>
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setMood("great")}
                className={`py-2 px-1 rounded-xl border text-center flex flex-col items-center space-y-1 transition ${
                  mood === "great"
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-semibold"
                    : "border-white/5 bg-black/30 text-slate-400 hover:bg-white/5 hover:text-slate-200"
                }`}
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px]">Energized</span>
              </button>
              <button
                type="button"
                onClick={() => setMood("good")}
                className={`py-2 px-1 rounded-xl border text-center flex flex-col items-center space-y-1 transition ${
                  mood === "good"
                    ? "border-blue-500/40 bg-blue-500/10 text-blue-400 font-semibold"
                    : "border-white/5 bg-black/30 text-slate-400 hover:bg-white/5 hover:text-slate-200"
                }`}
              >
                <Smile className="w-4 h-4 text-blue-400" />
                <span className="text-[10px]">Good</span>
              </button>
              <button
                type="button"
                onClick={() => setMood("neutral")}
                className={`py-2 px-1 rounded-xl border text-center flex flex-col items-center space-y-1 transition ${
                  mood === "neutral"
                    ? "border-amber-500/40 bg-amber-500/10 text-amber-400 font-semibold"
                    : "border-white/5 bg-black/30 text-slate-400 hover:bg-white/5 hover:text-slate-200"
                }`}
              >
                <Meh className="w-4 h-4 text-amber-400" />
                <span className="text-[10px]">Neutral</span>
              </button>
              <button
                type="button"
                onClick={() => setMood("tired")}
                className={`py-2 px-1 rounded-xl border text-center flex flex-col items-center space-y-1 transition ${
                  mood === "tired"
                    ? "border-purple-500/40 bg-purple-500/10 text-purple-400 font-semibold"
                    : "border-white/5 bg-black/30 text-slate-400 hover:bg-white/5 hover:text-slate-200"
                }`}
              >
                <Frown className="w-4 h-4 text-purple-400" />
                <span className="text-[10px]">Tired</span>
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 active:scale-98 text-black font-bold text-sm rounded-xl shadow-xs transition"
            >
              Confirm & Save Progress (+35 XP)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
