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
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import { Endeavor, TimeBlock, UserProfile, UserStats } from "../types";

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

  const todayStr = new Date().toISOString().split("T")[0];

  // Calculate daily completion
  const dailyHabits = endeavors.filter((e) => e.archetype === "habit");
  const habitsDoneToday = dailyHabits.filter((h) => (h.history[todayStr] || 0) > 0);
  const habitCompletionPct = dailyHabits.length > 0
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

  if (!isOpen) return null;

  return (
    <>
      {/* Background Dimmer on Mobile */}
      <div
        onClick={onClose}
        className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity"
        aria-hidden="true"
      />

      {/* Slide-out Drawer (Like YouTube Playlist / Up Next panel) */}
      <aside
        id="orbit-queue-drawer"
        className="fixed top-0 right-0 z-45 h-screen w-80 sm:w-96 bg-[#0E0E0E] border-l border-white/10 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#0E0E0E]/95 backdrop-blur-md z-10">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Today's Orbit Queue</h3>
              <p className="text-[10px] text-slate-400">Up Next, Rituals & Focus Shelf</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl cursor-pointer active:scale-90 transition"
            title="Close shelf"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-5 space-y-6 flex-1">
          {/* Daily Momentum Progress Pill */}
          <div className="bg-[#141414] rounded-2xl p-4 border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>Daily Momentum</span>
              </span>
              <span className="text-xs font-extrabold text-emerald-400">
                {habitCompletionPct}% Done
              </span>
            </div>

            {/* Progress Track */}
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-emerald-500 to-teal-400 transition-all duration-300 rounded-full"
                style={{ width: `${habitCompletionPct}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>{habitsDoneToday.length} of {dailyHabits.length} rituals completed</span>
              <span className="text-amber-400 font-bold flex items-center space-x-1">
                <Flame className="w-3 h-3" />
                <span>{stats.activeStreaks} Streaks</span>
              </span>
            </div>
          </div>

          {/* Up Next: Today's Pending Daily Habits */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Daily Rituals Shelf
              </h4>
              <button
                onClick={() => {
                  onNavigateTab("matrix");
                  onClose();
                }}
                className="text-[10px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center space-x-0.5 cursor-pointer"
              >
                <span>View Matrix</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2">
              {dailyHabits.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-2">No daily habits configured.</p>
              ) : (
                dailyHabits.slice(0, 5).map((habit) => {
                  const isDone = (habit.history[todayStr] || 0) > 0;
                  return (
                    <div
                      key={habit.id}
                      className={`p-2.5 rounded-xl border transition flex items-center justify-between ${
                        isDone
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                          : "bg-[#141414] border-white/5 hover:border-white/15 text-slate-200"
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <button
                          type="button"
                          onClick={() => {
                            onQuickLogHabit(habit);
                            if (!isDone) {
                              confetti({ particleCount: 25, spread: 45 });
                            }
                          }}
                          className={`w-6 h-6 rounded-lg flex items-center justify-center transition cursor-pointer active:scale-90 shrink-0 ${
                            isDone
                              ? "bg-emerald-500 text-black font-bold"
                              : "border border-white/20 hover:border-emerald-400 text-transparent"
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <div className="min-w-0">
                          <div className={`text-xs font-semibold truncate ${isDone ? "line-through opacity-80" : ""}`}>
                            {habit.title}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {habit.streakCount} day streak
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
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Up Next: Today's Timeline Schedule */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Up Next In Schedule
              </h4>
              <button
                onClick={() => {
                  onNavigateTab("timeline");
                  onClose();
                }}
                className="text-[10px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center space-x-0.5 cursor-pointer"
              >
                <span>Full Schedule</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2">
              {todayBlocks.length === 0 ? (
                <div className="p-3 bg-[#141414] rounded-xl border border-white/5 text-center">
                  <p className="text-xs text-slate-400">No scheduled blocks today.</p>
                  <button
                    onClick={() => {
                      onNavigateTab("timeline");
                      onClose();
                    }}
                    className="mt-2 text-[11px] font-bold text-emerald-400 hover:underline cursor-pointer"
                  >
                    + Add Time Block
                  </button>
                </div>
              ) : (
                todayBlocks.slice(0, 4).map((block) => (
                  <div
                    key={block.id}
                    className={`p-2.5 rounded-xl border transition flex items-center justify-between ${
                      block.completed
                        ? "bg-white/5 border-transparent opacity-60 line-through"
                        : "bg-[#141414] border-white/5 hover:border-white/15"
                    }`}
                  >
                    <div className="flex items-center space-x-2 min-w-0">
                      <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-white truncate">
                          {block.title}
                        </div>
                        <div className="text-[10px] text-slate-400">
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
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Fast Brain Scratchpad */}
          <div className="space-y-2 pt-2 border-t border-white/5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                <span>Quick Scratchpad</span>
              </label>
              <button
                type="button"
                onClick={handleSaveNotes}
                className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 cursor-pointer"
              >
                <Save className="w-3 h-3" />
                <span>{isSavedNote ? "Saved!" : "Save"}</span>
              </button>
            </div>
            <textarea
              rows={3}
              value={quickNote}
              onChange={(e) => setQuickNote(e.target.value)}
              placeholder="Jot down quick thoughts, session goals, or ideas..."
              className="w-full bg-[#141414] border border-white/10 rounded-xl p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 resize-none"
            />
          </div>
        </div>

        {/* Footer Quick Action */}
        <div className="p-4 border-t border-white/10 bg-[#0E0E0E]">
          <button
            onClick={() => {
              onNavigateTab("copilot");
              onClose();
            }}
            className="w-full py-2.5 bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition cursor-pointer active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask AI Strategy Coach</span>
          </button>
        </div>
      </aside>
    </>
  );
};
