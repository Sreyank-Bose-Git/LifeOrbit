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
  const allDoneToday = filteredHabits.length > 0 && filteredHabits.every((h) => (h.history[todayStr] || 0) > 0);

  const handleBatchCompleteToday = () => {
    filteredHabits.forEach((h) => {
      if ((h.history[todayStr] || 0) === 0) {
        onQuickLog(h, 1, "Batch daily check-in");
      }
    });
    confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0D0D0D] rounded-3xl p-6 sm:p-8 border border-white/5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 mb-1">
            <Zap className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Consistency Matrix</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Habit Execution Matrix
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Track daily rituals, lock in continuous streaks, and batch-log progress across your active life spheres.
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <button
            onClick={handleBatchCompleteToday}
            disabled={allDoneToday || filteredHabits.length === 0}
            className={`flex-1 md:flex-initial flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md transition cursor-pointer active:scale-95 ${
              allDoneToday
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : `${currentTheme.buttonBg} ${currentTheme.buttonHover} ${currentTheme.buttonText}`
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{allDoneToday ? "All Habits Done Today! 🎉" : "Complete All Habits Today"}</span>
          </button>

          <button
            onClick={onOpenCreate}
            className="flex items-center space-x-1.5 px-3.5 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs sm:text-sm font-semibold border border-white/5 cursor-pointer active:scale-95 transition"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Add Habit</span>
          </button>
        </div>
      </div>

      {/* Week Navigator & Category Filter Chips */}
      <div className="bg-[#0D0D0D] rounded-2xl p-4 border border-white/5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
          {["all", "health", "career", "learning", "finance", "mindfulness", "creative", "personal"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-semibold cursor-pointer active:scale-95 transition-all shrink-0 capitalize ${
                selectedCategory === cat
                  ? "bg-white/15 text-white shadow-xs"
                  : "bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10"
              }`}
            >
              {cat === "all" ? "All Spheres" : cat}
            </button>
          ))}
        </div>

        {/* Week Navigator Buttons */}
        <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
          <button
            onClick={() => setWeekOffset((prev) => prev - 1)}
            className="p-1.5 bg-[#141414] hover:bg-white/10 text-slate-300 rounded-lg border border-white/5 cursor-pointer active:scale-90 transition"
            title="Previous 7 Days"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-bold text-slate-300 px-2 font-mono">
            {weekOffset === 0 ? "Current 7 Days" : `${Math.abs(weekOffset)} week${Math.abs(weekOffset) > 1 ? "s" : ""} ${weekOffset < 0 ? "ago" : "ahead"}`}
          </span>

          <button
            onClick={() => setWeekOffset((prev) => prev + 1)}
            disabled={weekOffset >= 0}
            className={`p-1.5 rounded-lg border border-white/5 transition ${
              weekOffset >= 0
                ? "bg-transparent text-slate-600 cursor-not-allowed"
                : "bg-[#141414] hover:bg-white/10 text-slate-300 cursor-pointer active:scale-90"
            }`}
            title="Next 7 Days"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Habit Execution Matrix Table */}
      <div className="bg-[#0D0D0D] rounded-3xl border border-white/5 overflow-hidden shadow-xl">
        {filteredHabits.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Activity className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No Habits Found</h3>
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
                <tr className="border-b border-white/10 bg-[#121212]/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="p-4 sm:p-5 pl-6 w-1/3">Habit & Life Sphere</th>
                  <th className="p-4 text-center">Streak</th>
                  {days.map((day) => (
                    <th
                      key={day.dateStr}
                      className={`p-3 text-center transition-colors ${
                        day.isToday ? "text-emerald-400 bg-emerald-500/5 font-extrabold" : ""
                      }`}
                    >
                      <div className="text-[10px] uppercase text-slate-500">{day.dayName}</div>
                      <div className={`text-xs mt-0.5 ${day.isToday ? "text-emerald-400" : "text-slate-300"}`}>
                        {day.dayNumber}
                      </div>
                    </th>
                  ))}
                  <th className="p-4 text-center pr-6">Completion</th>
                </tr>
              </thead>

              {/* Habit Rows */}
              <tbody className="divide-y divide-white/5 text-sm">
                {filteredHabits.map((habit) => {
                  const habitColor = habit.color || "#10b981";

                  // Calculate 7-day completion count
                  const completedInWindow = days.filter(
                    (d) => (habit.history[d.dateStr] || 0) > 0
                  ).length;
                  const windowPct = Math.round((completedInWindow / 7) * 100);

                  return (
                    <tr key={habit.id} className="hover:bg-white/[0.02] transition-colors group">
                      {/* Title & Category */}
                      <td className="p-4 sm:p-5 pl-6">
                        <div className="flex items-center space-x-3">
                          <span
                            className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                            style={{ backgroundColor: habitColor }}
                          />
                          <div className="min-w-0">
                            <div className="font-bold text-white text-xs sm:text-sm group-hover:text-emerald-400 transition truncate">
                              {habit.title}
                            </div>
                            <div className="text-[10px] text-slate-400 capitalize flex items-center space-x-1.5 mt-0.5">
                              <span>{habit.category}</span>
                              <span>•</span>
                              <span>{habit.frequency || "daily"}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Current Streak */}
                      <td className="p-4 text-center">
                        <div className="inline-flex items-center space-x-1 px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg text-xs font-bold">
                          <Flame className="w-3.5 h-3.5 fill-current" />
                          <span>{habit.streakCount}d</span>
                        </div>
                      </td>

                      {/* 7 Days Interactive Checkboxes */}
                      {days.map((day) => {
                        const isLogged = (habit.history[day.dateStr] || 0) > 0;

                        return (
                          <td
                            key={day.dateStr}
                            className={`p-3 text-center ${day.isToday ? "bg-emerald-500/[0.02]" : ""}`}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                onToggleDateLog(habit, day.dateStr);
                                if (!isLogged) {
                                  confetti({ particleCount: 20, spread: 40 });
                                }
                              }}
                              className={`w-8 h-8 mx-auto rounded-xl flex items-center justify-center transition-all duration-150 cursor-pointer active:scale-90 ${
                                isLogged
                                  ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/20 font-bold"
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
                          <div className="w-16 h-1.5 bg-white/10 rounded-full mt-1 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${windowPct}%`,
                                backgroundColor: habitColor,
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-[#0D0D0D] p-5 rounded-3xl border border-white/5 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-400">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{stats.activeStreaks}</div>
            <div className="text-xs font-medium text-slate-400">Active Daily Streaks</div>
          </div>
        </div>

        <div className="bg-[#0D0D0D] p-5 rounded-3xl border border-white/5 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{stats.totalCheckIns}</div>
            <div className="text-xs font-medium text-slate-400">Total Habit Check-Ins</div>
          </div>
        </div>

        <div className="bg-[#0D0D0D] p-5 rounded-3xl border border-white/5 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center text-indigo-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">Level {stats.level}</div>
            <div className="text-xs font-medium text-slate-400">{stats.xp} XP Accumulated</div>
          </div>
        </div>
      </div>
    </div>
  );
};
