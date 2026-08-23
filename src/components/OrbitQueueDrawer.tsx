import React, { useState } from "react";
import {
  X,
  Zap,
  CheckCircle2,
  Clock,
  Flame,
  Plus,
  Play,
  Calendar,
  Sparkles,
  ChevronRight,
  TrendingUp,
  FileText,
  Save,
  Radio,
  Orbit,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import { Endeavor, TimeBlock, UserProfile, UserStats } from "../types";
import { THEME_ACCENTS } from "../lib/theme";

interface OrbitQueueDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  endeavors: Endeavor[];
  timeBlocks: TimeBlock[];
  profile: UserProfile;
  stats: UserStats;
  onQuickLogHabit: (endeavor: Endeavor) => void;
  onStartFocus: (endeavor: Endeavor) => void;
  onToggleTimeBlock: (blockId: string) => void;
  onNavigateTab: (tab: any) => void;
  onSaveQuickNote: (note: string) => void;
}

export const OrbitQueueDrawer: React.FC<OrbitQueueDrawerProps> = ({
  isOpen,
  onClose,
  endeavors,
  timeBlocks,
  profile,
  stats,
  onQuickLogHabit,
  onStartFocus,
  onToggleTimeBlock,
  onNavigateTab,
  onSaveQuickNote,
}) => {
  const [quickNote, setQuickNote] = useState(profile.customNotes || "");
  const [isSavedNote, setIsSavedNote] = useState(false);
  const currentTheme = THEME_ACCENTS[profile.themeConfig?.accent] || THEME_ACCENTS.emerald;

  const todayStr = new Date().toISOString().split("T")[0];

  // Calculate daily completion
  const dailyHabits = endeavors.filter((e) => e.archetype === "habit");
  const habitsDoneToday = dailyHabits.filter((h) => (h.history?.[todayStr] || 0) > 0);
  const habitCompletionPct =
    dailyHabits.length > 0
      ? Math.round((habitsDoneToday.length / dailyHabits.length) * 100)
      : 100;

  // Today's scheduled timeblocks
  const todayBlocks = timeBlocks
    .filter((b) => !b.date || b.date === todayStr)
    .sort((a, b) => (a.startTime > b.startTime ? 1 : -1));

  const handleSaveNotes = () => {
    onSaveQuickNote(quickNote);
    setIsSavedNote(true);
    setTimeout(() => setIsSavedNote(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Background Dimmer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-45 bg-black/70 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Interstellar Slide-out Shelf Panel */}
          <motion.aside
            id="orbit-queue-drawer"
            initial={{ x: "100%", opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0.5 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed top-2 bottom-2 right-2 z-50 h-[calc(100vh-16px)] w-80 sm:w-96 bg-[#06070B]/95 md:bg-[#06070B]/90 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.15)] flex flex-col justify-between overflow-hidden"
          >
            {/* Ambient Cosmic Mesh */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
              <div
                className="absolute -top-16 -right-16 w-56 h-56 rounded-full blur-3xl opacity-20"
                style={{ backgroundColor: currentTheme.primaryHex }}
              />
              <div className="absolute bottom-1/4 -left-20 w-48 h-48 rounded-full blur-3xl opacity-15 bg-indigo-600/25" />
              <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:18px_18px] opacity-25" />
              <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-transparent via-white/15 to-transparent" />
            </div>

            {/* Header */}
            <div className="relative z-10 p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.01]">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div
                    className={`w-9 h-9 rounded-xl ${currentTheme.buttonBg} ${currentTheme.buttonText} flex items-center justify-center font-bold shadow-lg`}
                  >
                    <Orbit className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <span
                    className="absolute inset-0 rounded-xl blur-xs opacity-50 pointer-events-none"
                    style={{ backgroundColor: currentTheme.primaryHex }}
                  />
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <h3 className="text-sm font-bold text-white tracking-tight uppercase">
                      Orbit Queue
                    </h3>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <p className="text-[10px] font-mono text-slate-400">
                    // SHELF • FLIGHT DECK
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl cursor-pointer active:scale-90 transition border border-white/5"
                title="Close shelf"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body Content */}
            <div className="relative z-10 p-4 sm:p-5 space-y-5 flex-1 overflow-y-auto scrollbar-none">
              {/* Daily Momentum Progress Capsule */}
              <div className="bg-white/[0.03] hover:bg-white/[0.05] transition-colors rounded-2xl p-4 border border-white/5 shadow-inner space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 flex items-center space-x-1.5 font-mono">
                    <TrendingUp className={`w-3.5 h-3.5 ${currentTheme.textAccent}`} />
                    <span>DAILY VELOCITY</span>
                  </span>
                  <span className={`text-xs font-mono font-extrabold ${currentTheme.textAccent}`}>
                    {habitCompletionPct}% SYNCED
                  </span>
                </div>

                {/* Cosmic Progress Track */}
                <div className="relative w-full h-2 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${habitCompletionPct}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="h-full rounded-full relative"
                    style={{
                      backgroundColor: currentTheme.primaryHex,
                      boxShadow: `0 0 10px ${currentTheme.primaryHex}`,
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                  </motion.div>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>{habitsDoneToday.length} of {dailyHabits.length} rituals done</span>
                  <span className="text-amber-400 font-bold flex items-center space-x-1">
                    <Flame className="w-3 h-3 fill-amber-400" />
                    <span>{stats.activeStreaks || 0}d streak</span>
                  </span>
                </div>
              </div>

              {/* Up Next: Today's Pending Daily Habits */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between px-1">
                  <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center space-x-1.5">
                    <Sparkles className={`w-3 h-3 ${currentTheme.textAccent}`} />
                    <span>DAILY RITUALS</span>
                  </h4>
                  <button
                    onClick={() => {
                      onNavigateTab("matrix");
                      onClose();
                    }}
                    className={`text-[10px] font-mono font-semibold ${currentTheme.textAccent} hover:underline flex items-center space-x-0.5 cursor-pointer`}
                  >
                    <span>MATRIX</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-1.5">
                  {dailyHabits.length === 0 ? (
                    <p className="text-xs text-slate-500 italic py-2 font-mono">
                      No daily habits configured in orbit.
                    </p>
                  ) : (
                    dailyHabits.slice(0, 5).map((habit) => {
                      const isDone = (habit.history?.[todayStr] || 0) > 0;
                      return (
                        <motion.div
                          key={habit.id}
                          whileHover={{ scale: 1.01 }}
                          className={`p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                            isDone
                              ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                              : "bg-white/[0.03] border-white/5 hover:border-white/15 text-slate-200"
                          }`}
                        >
                          <div className="flex items-center space-x-2.5 min-w-0">
                            <button
                              type="button"
                              onClick={() => {
                                onQuickLogHabit(habit);
                                if (!isDone) {
                                  confetti({ particleCount: 30, spread: 50 });
                                }
                              }}
                              className={`w-6 h-6 rounded-lg flex items-center justify-center transition cursor-pointer active:scale-85 shrink-0 ${
                                isDone
                                  ? "bg-emerald-400 text-black font-bold shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                                  : "border border-white/20 hover:border-emerald-400 text-transparent"
                              }`}
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <div className="min-w-0">
                              <div
                                className={`text-xs font-semibold truncate ${
                                  isDone ? "line-through opacity-70" : ""
                                }`}
                              >
                                {habit.title}
                              </div>
                              <div className="text-[9px] font-mono text-slate-400">
                                {habit.streakCount}d streak • {habit.category}
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              onStartFocus(habit);
                              onClose();
                            }}
                            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer transition active:scale-90 shrink-0"
                            title="Start Focus Timer"
                          >
                            <Play className="w-3.5 h-3.5" />
                          </button>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Up Next: Today's Timeline Schedule */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between px-1">
                  <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center space-x-1.5">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    <span>ORBIT BLOCKS</span>
                  </h4>
                  <button
                    onClick={() => {
                      onNavigateTab("timeline");
                      onClose();
                    }}
                    className={`text-[10px] font-mono font-semibold ${currentTheme.textAccent} hover:underline flex items-center space-x-0.5 cursor-pointer`}
                  >
                    <span>TIMELINE</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-1.5">
                  {todayBlocks.length === 0 ? (
                    <div className="p-3 bg-white/[0.02] rounded-xl border border-white/5 text-center">
                      <p className="text-xs text-slate-400 font-mono">No blocks logged today.</p>
                      <button
                        onClick={() => {
                          onNavigateTab("timeline");
                          onClose();
                        }}
                        className={`mt-1 text-[11px] font-mono font-bold ${currentTheme.textAccent} hover:underline cursor-pointer`}
                      >
                        + Add Time Block
                      </button>
                    </div>
                  ) : (
                    todayBlocks.slice(0, 4).map((block) => (
                      <motion.div
                        key={block.id}
                        whileHover={{ scale: 1.01 }}
                        className={`p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                          block.completed
                            ? "bg-white/[0.02] border-white/5 opacity-50 line-through"
                            : "bg-white/[0.03] border-white/5 hover:border-white/15"
                        }`}
                      >
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shrink-0" />
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-white truncate">
                              {block.title}
                            </div>
                            <div className="text-[9px] font-mono text-slate-400">
                              {block.startTime} - {block.endTime}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => onToggleTimeBlock(block.id)}
                          className={`p-1.5 rounded-lg cursor-pointer transition active:scale-90 ${
                            block.completed
                              ? "text-emerald-400 bg-emerald-500/10"
                              : "text-slate-400 hover:text-white hover:bg-white/10"
                          }`}
                          title={block.completed ? "Mark incomplete" : "Mark completed"}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>

              {/* Fast Brain Scratchpad */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <div className="flex items-center justify-between px-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center space-x-1.5">
                    <FileText className="w-3 h-3 text-indigo-400" />
                    <span>TELEMETRY LOG PAD</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleSaveNotes}
                    className={`text-[10px] font-mono font-bold ${currentTheme.textAccent} hover:underline flex items-center space-x-1 cursor-pointer`}
                  >
                    <Save className="w-3 h-3" />
                    <span>{isSavedNote ? "SAVED!" : "SAVE"}</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={quickNote}
                  onChange={(e) => setQuickNote(e.target.value)}
                  placeholder="Record tactical thoughts, flight coordinates, or session ideas..."
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 resize-none font-mono"
                />
              </div>
            </div>

            {/* Footer Quick Action */}
            <div className="relative z-10 p-3.5 border-t border-white/10 bg-white/[0.01]">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  onNavigateTab("copilot");
                  onClose();
                }}
                className="w-full py-2.5 bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition cursor-pointer shadow-[0_0_20px_rgba(168,85,247,0.15)]"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ask AI Cosmic Coach</span>
              </motion.button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
