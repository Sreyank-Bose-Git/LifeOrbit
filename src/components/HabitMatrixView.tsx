import React, { useState } from "react";
import {
  CheckCircle2,
  Flame,
  Plus,
  Zap,
  Calendar,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Activity,
  Award,
  Filter,
  Orbit,
} from "lucide-react";
import { motion } from "motion/react";
import confetti from "canvas-confetti";
import { Endeavor, UserProfile, UserStats, Category } from "../types";
import { THEME_ACCENTS } from "../lib/theme";

interface HabitMatrixViewProps {
  endeavors: Endeavor[];
  profile: UserProfile;
  stats: UserStats;
  onQuickLog: (endeavor: Endeavor, value: number, note?: string) => void;
  onToggleDateLog: (endeavor: Endeavor, dateStr: string) => void;
  onOpenCreate: () => void;
  onStartFocus: (endeavor: Endeavor) => void;
}

export const HabitMatrixView: React.FC<HabitMatrixViewProps> = ({
  endeavors,
  profile,
  stats,
  onQuickLog,
  onToggleDateLog,
  onOpenCreate,
  onStartFocus,
}) => {
  const currentTheme = THEME_ACCENTS[profile.themeConfig?.accent] || THEME_ACCENTS.emerald;
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [weekOffset, setWeekOffset] = useState(0);

  const habits = endeavors.filter((e) => e.archetype === "habit");

  // Calculate past 7 days based on week offset
  const today = new Date();
  const days: { dateStr: string; dayName: string; dayNumber: number; isToday: boolean }[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i + weekOffset * 7);
    const dateStr = d.toISOString().split("T")[0];
    const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
    const dayNumber = d.getDate();
    const isToday = dateStr === today.toISOString().split("T")[0];
    days.push({ dateStr, dayName, dayNumber, isToday });
  }

  const filteredHabits = habits.filter(
    (h) => selectedCategory === "all" || h.category === selectedCategory
  );

  const todayStr = today.toISOString().split("T")[0];
  const allDoneToday =
    filteredHabits.length > 0 && filteredHabits.every((h) => (h.history?.[todayStr] || 0) > 0);

  const handleBatchCompleteToday = () => {
    filteredHabits.forEach((h) => {
      if ((h.history?.[todayStr] || 0) === 0) {
        onQuickLog(h, 1, "Batch daily check-in");
      }
    });
    confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner - Interstellar Consistency Flight Deck */}
      <div className="relative bg-[#06070B]/90 md:bg-[#06070B]/75 backdrop-blur-3xl rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.12)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden">
        {/* Ambient Cosmic Mesh */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full blur-3xl opacity-20 bg-emerald-500/30" />
          <div className="absolute top-1/2 -right-20 w-56 h-56 rounded-full blur-3xl opacity-15 bg-amber-500/20" />
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:18px_18px] opacity-25" />
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center space-x-2 text-emerald-400 mb-1 font-mono">
            <Zap className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              HABIT MATRIX // SEC-02
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase">
            Consistency Orbit Matrix
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl font-normal">
            Track daily rituals, lock in continuous streaks, and batch-log progress across your active life spheres.
          </p>
        </div>

        <div className="relative z-10 flex items-center space-x-3 w-full md:w-auto font-mono">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleBatchCompleteToday}
            disabled={allDoneToday || filteredHabits.length === 0}
            className={`flex-1 md:flex-initial flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-[0_0_20px_rgba(52,211,153,0.3)] transition cursor-pointer ${
              allDoneToday
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : `${currentTheme.buttonBg} ${currentTheme.buttonHover} ${currentTheme.buttonText}`
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{allDoneToday ? "All Synced Today! 🚀" : "Batch Sync All Today"}</span>
          </motion.button>

          <button
            onClick={onOpenCreate}
            className="flex items-center space-x-1.5 px-3.5 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs sm:text-sm font-semibold border border-white/10 cursor-pointer active:scale-95 transition"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Add Habit</span>
          </button>
        </div>
      </div>

      {/* Week Navigator & Category Filter Chips */}
      <div className="bg-[#06070B]/85 backdrop-blur-2xl rounded-2xl p-3 sm:p-4 border border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 font-mono">
        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
          {["all", "health", "career", "learning", "finance", "mindfulness", "creative", "personal"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer active:scale-95 transition shrink-0 uppercase tracking-wider text-[10px] ${
                selectedCategory === cat
                  ? "bg-white/15 text-white border border-white/20 shadow-xs"
                  : "bg-white/[0.02] text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent"
              }`}
            >
              {cat === "all" ? "ALL SPHERES" : cat}
            </button>
          ))}
        </div>

        {/* Week Navigator Buttons */}
        <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
          <button
            onClick={() => setWeekOffset((prev) => prev - 1)}
            className="p-1.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg border border-white/10 cursor-pointer active:scale-90 transition"
            title="Previous 7 Days"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-bold text-slate-300 px-2 font-mono">
            {weekOffset === 0
              ? "CURRENT 7 DAYS"
              : `${Math.abs(weekOffset)} WEEK${Math.abs(weekOffset) > 1 ? "S" : ""} ${
                  weekOffset < 0 ? "AGO" : "AHEAD"
                }`}
          </span>

          <button
            onClick={() => setWeekOffset((prev) => prev + 1)}
            disabled={weekOffset >= 0}
            className={`p-1.5 rounded-lg border border-white/10 transition ${
              weekOffset >= 0
                ? "bg-transparent text-slate-600 cursor-not-allowed"
                : "bg-white/5 hover:bg-white/10 text-slate-300 cursor-pointer active:scale-90"
            }`}
            title="Next 7 Days"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Habit Execution Matrix Table */}
      <div className="bg-[#06070B]/90 backdrop-blur-3xl rounded-[28px] border border-white/10 overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.7)]">
        {filteredHabits.length === 0 ? (
          <div className="p-12 text-center space-y-3 font-mono">
            <Activity className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white uppercase">No Habits Configured</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Start building your daily momentum by creating your first recurring habit or ritual.
            </p>
            <button
              onClick={onOpenCreate}
              className={`px-4 py-2 ${currentTheme.buttonBg} ${currentTheme.buttonText} font-bold rounded-xl text-xs shadow-md transition cursor-pointer`}
            >
              + Create New Habit
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[650px]">
              {/* Header Row */}
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                  <th className="p-4 sm:p-5 pl-6 w-1/3">HABIT & LIFE SPHERE</th>
                  <th className="p-4 text-center">STREAK</th>
                  {days.map((day) => (
                    <th
                      key={day.dateStr}
                      className={`p-3 text-center transition-colors ${
                        day.isToday ? "text-emerald-400 bg-emerald-500/10 font-bold" : ""
                      }`}
                    >
                      <div className="text-[9px] uppercase text-slate-500">{day.dayName}</div>
                      <div
                        className={`text-xs mt-0.5 font-mono ${
                          day.isToday ? "text-emerald-400 font-bold" : "text-slate-300"
                        }`}
                      >
                        {day.dayNumber}
                      </div>
                    </th>
                  ))}
                  <th className="p-4 text-center pr-6">SYNC RATE</th>
                </tr>
              </thead>

              {/* Habit Rows */}
              <tbody className="divide-y divide-white/5 text-sm font-mono">
                {filteredHabits.map((habit) => {
                  const habitColor = habit.color || "#10b981";

                  // Calculate 7-day completion count
                  const completedInWindow = days.filter(
                    (d) => (habit.history?.[d.dateStr] || 0) > 0
                  ).length;
                  const windowPct = Math.round((completedInWindow / 7) * 100);

                  return (
                    <tr key={habit.id} className="hover:bg-white/[0.03] transition-colors group">
                      {/* Title & Category */}
                      <td className="p-4 sm:p-5 pl-6">
                        <div className="flex items-center space-x-3">
                          <span
                            className="w-3 h-3 rounded-full shrink-0 shadow-md"
                            style={{
                              backgroundColor: habitColor,
                              boxShadow: `0 0 8px ${habitColor}80`,
                            }}
                          />
                          <div className="min-w-0">
                            <div className="font-bold text-white text-xs sm:text-sm group-hover:text-emerald-400 transition truncate font-sans">
                              {habit.title}
                            </div>
                            <div className="text-[9px] text-slate-400 capitalize flex items-center space-x-1.5 mt-0.5">
                              <span>{habit.category}</span>
                              <span>•</span>
                              <span>{habit.frequency || "daily"}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Current Streak */}
                      <td className="p-4 text-center">
                        <div className="inline-flex items-center space-x-1 px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg text-xs font-bold shadow-[0_0_8px_rgba(251,191,36,0.15)]">
                          <Flame className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{habit.streakCount}d</span>
                        </div>
                      </td>

                      {/* 7 Days Interactive Checkboxes */}
                      {days.map((day) => {
                        const isLogged = (habit.history?.[day.dateStr] || 0) > 0;

                        return (
                          <td
                            key={day.dateStr}
                            className={`p-3 text-center ${
                              day.isToday ? "bg-emerald-500/[0.04]" : ""
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                onToggleDateLog(habit, day.dateStr);
                                if (!isLogged) {
                                  confetti({ particleCount: 25, spread: 45 });
                                }
                              }}
                              className={`w-8 h-8 mx-auto rounded-xl flex items-center justify-center transition-all duration-150 cursor-pointer active:scale-90 ${
                                isLogged
                                  ? "bg-emerald-400 text-black shadow-[0_0_12px_rgba(52,211,153,0.7)] font-bold"
                                  : "border border-white/10 hover:border-white/30 bg-white/[0.02] text-transparent hover:text-white/20"
                              }`}
                              title={`${isLogged ? "Completed" : "Mark done"} on ${day.dateStr}`}
                            >
                              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                            </button>
                          </td>
                        );
                      })}

                      {/* 7-Day Completion Rate */}
                      <td className="p-4 text-center pr-6">
                        <div className="flex flex-col items-center">
                          <span className="text-xs font-bold text-slate-200">{windowPct}%</span>
                          <div className="w-16 h-1.5 bg-white/10 rounded-full mt-1 overflow-hidden p-0.5 border border-white/5">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${windowPct}%`,
                                backgroundColor: habitColor,
                                boxShadow: `0 0 6px ${habitColor}`,
                              }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Consistency Statistics & Habit Velocity Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 font-mono">
        <div className="bg-[#06070B]/85 backdrop-blur-2xl p-5 rounded-[24px] border border-white/10 shadow-[0_0_25px_rgba(0,0,0,0.5)] flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Flame className="w-6 h-6 fill-amber-400/20" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{stats.activeStreaks}</div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Active Daily Streaks
            </div>
          </div>
        </div>

        <div className="bg-[#06070B]/85 backdrop-blur-2xl p-5 rounded-[24px] border border-white/10 shadow-[0_0_25px_rgba(0,0,0,0.5)] flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{stats.totalCheckIns}</div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Total Habit Check-Ins
            </div>
          </div>
        </div>

        <div className="bg-[#06070B]/85 backdrop-blur-2xl p-5 rounded-[24px] border border-white/10 shadow-[0_0_25px_rgba(0,0,0,0.5)] flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">Level {stats.level}</div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {stats.xp} XP Accumulated
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
