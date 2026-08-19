import React from "react";
import {
  BarChart3,
  TrendingUp,
  Flame,
  Award,
  Calendar,
  CheckCircle2,
  Target,
  Zap,
  ShieldCheck,
  Rocket,
  Timer,
  Trophy,
} from "lucide-react";
import { Endeavor, UserStats, ProgressLog } from "../types";

interface InsightsViewProps {
  endeavors: Endeavor[];
  stats: UserStats;
  logs: ProgressLog[];
}

export const InsightsView: React.FC<InsightsViewProps> = ({
  endeavors,
  stats,
  logs,
}) => {
  // Generate past 28 days for the habit heatmap matrix
  const past28Days = Array.from({ length: 28 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (27 - i));
    const dStr = d.toISOString().split("T")[0];
    const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
    const dayNumber = d.getDate();

    // Total activity count across all endeavors on this date
    let totalCount = 0;
    endeavors.forEach((e) => {
      if (e.history[dStr]) totalCount += 1;
    });

    return {
      date: dStr,
      dayName,
      dayNumber,
      count: totalCount,
    };
  });

  const totalEndeavors = endeavors.length;
  const meters = endeavors.filter((e) => e.archetype === "meter");
  const habits = endeavors.filter((e) => e.archetype === "habit");
  const milestones = endeavors.filter((e) => e.archetype === "milestone");

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#0D0D0D] rounded-3xl p-6 border border-white/5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 mb-1">
            <BarChart3 className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Progress Intelligence</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Life Velocity & Consistency</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Holistic cross-activity performance tracking and completion forecasts
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-white/5 p-2.5 rounded-2xl border border-white/5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-black flex items-center justify-center font-bold text-sm">
            Lvl {stats.level}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-white">{stats.xp} Total XP</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded font-semibold">
                Master Tier
              </span>
            </div>
            <p className="text-[11px] text-slate-400">{1000 - (stats.xp % 1000)} XP to Level {stats.level + 1}</p>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0D0D0D] p-5 rounded-2xl border border-white/5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold text-slate-400">Total Check-Ins</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-bold text-white">{stats.totalCheckIns}</span>
          <p className="text-[11px] text-slate-500 mt-1">Recorded across all endeavors</p>
        </div>

        <div className="bg-[#0D0D0D] p-5 rounded-2xl border border-white/5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold text-slate-400">Active Streaks</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-bold text-amber-400">
            {endeavors.reduce((acc, curr) => acc + (curr.streakCount > 0 ? 1 : 0), 0)}
          </span>
          <p className="text-[11px] text-slate-500 mt-1">Daily/weekly habits ongoing</p>
        </div>

        <div className="bg-[#0D0D0D] p-5 rounded-2xl border border-white/5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold text-slate-400">Milestones Solved</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-bold text-emerald-400">
            {stats.totalMilestonesCompleted}
          </span>
          <p className="text-[11px] text-slate-500 mt-1">Phases successfully reached</p>
        </div>

        <div className="bg-[#0D0D0D] p-5 rounded-2xl border border-white/5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold text-slate-400">Active Endeavors</span>
            <Target className="w-4 h-4 text-blue-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-bold text-white">{totalEndeavors}</span>
          <p className="text-[11px] text-slate-500 mt-1">Meters, habits & roadmaps</p>
        </div>
      </div>

      {/* 28-Day Consistency Heatmap Grid */}
      <div className="bg-[#0D0D0D] rounded-3xl p-6 border border-white/5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-base">4-Week Activity Heatmap</h3>
            <p className="text-xs text-slate-400">Aggregate daily execution intensity across all your goals</p>
          </div>
          <div className="flex items-center space-x-1.5 text-[10px] text-slate-400">
            <span>Less</span>
            <div className="w-3 h-3 rounded bg-white/5 border border-white/5" />
            <div className="w-3 h-3 rounded bg-emerald-950 border border-emerald-800" />
            <div className="w-3 h-3 rounded bg-emerald-700" />
            <div className="w-3 h-3 rounded bg-emerald-400" />
            <span>More</span>
          </div>
        </div>

        {/* The Grid */}
        <div className="grid grid-cols-7 gap-2 pt-2">
          {past28Days.map((day, idx) => {
            let bg = "bg-white/5 text-slate-400 border border-white/5 hover:border-white/20";
            if (day.count >= 4) bg = "bg-emerald-500 text-black font-bold border border-emerald-400 hover:bg-emerald-400";
            else if (day.count >= 2) bg = "bg-emerald-700 text-white font-semibold border border-emerald-600 hover:bg-emerald-600";
            else if (day.count === 1) bg = "bg-emerald-950 text-emerald-300 border border-emerald-800/60 hover:bg-emerald-900";

            return (
              <div
                key={idx}
                className={`h-14 rounded-xl p-1.5 flex flex-col justify-between transition-all duration-150 hover:scale-105 active:scale-95 cursor-pointer select-none ${bg}`}
                title={`${day.date}: ${day.count} activities completed`}
              >
                <span className="text-[10px] uppercase opacity-75">{day.dayName}</span>
                <span className="text-xs font-bold">{day.dayNumber}</span>
                <span className="text-[9px] opacity-90">{day.count > 0 ? `${day.count} logs` : "—"}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Archetype Balance & Completion Forecast */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Archetype Breakdown */}
        <div className="bg-[#0D0D0D] rounded-3xl p-6 border border-white/5 shadow-xs space-y-4">
          <h3 className="font-bold text-white text-base">Archetype Balance</h3>
          <p className="text-xs text-slate-400">How your endeavors are structured for optimal life balance</p>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">Quantifiable Meters ({meters.length})</span>
                <span className="text-emerald-400 font-bold">
                  {totalEndeavors > 0 ? Math.round((meters.length / totalEndeavors) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: `${totalEndeavors > 0 ? (meters.length / totalEndeavors) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">Habits & Streaks ({habits.length})</span>
                <span className="text-amber-400 font-bold">
                  {totalEndeavors > 0 ? Math.round((habits.length / totalEndeavors) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-400 h-full rounded-full"
                  style={{ width: `${totalEndeavors > 0 ? (habits.length / totalEndeavors) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">Project Milestones ({milestones.length})</span>
                <span className="text-blue-400 font-bold">
                  {totalEndeavors > 0 ? Math.round((milestones.length / totalEndeavors) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-400 h-full rounded-full"
                  style={{ width: `${totalEndeavors > 0 ? (milestones.length / totalEndeavors) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Unlocked Badges & Trophies */}
        <div className="bg-[#0D0D0D] rounded-3xl p-6 border border-white/5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base">Gamified Badges</h3>
            <span className="text-xs font-semibold text-amber-300 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full">
              {stats.badges.filter((b) => b.unlockedAt).length} / {stats.badges.length} Unlocked
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {stats.badges.map((badge) => {
              const isUnlocked = Boolean(badge.unlockedAt);
              return (
                <div
                  key={badge.id}
                  className={`p-3 rounded-2xl border flex items-center space-x-3 transition ${
                    isUnlocked
                      ? "bg-[#141414] border-amber-500/30 text-white"
                      : "bg-[#141414]/40 border-white/5 opacity-40 text-slate-400"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm ${
                      isUnlocked ? "bg-amber-400 text-black font-bold shadow-xs" : "bg-white/5 text-slate-600"
                    }`}
                  >
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{badge.name}</h4>
                    <p className="text-[10px] text-slate-400 line-clamp-1">{badge.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
