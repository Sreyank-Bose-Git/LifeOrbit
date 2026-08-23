import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Flame,
  Award,
  Calendar,
  CheckCircle2,
  Target,
  Zap,
  Trophy,
  Activity,
  Layers,
  Sparkles,
  Radio,
  Orbit,
} from "lucide-react";
import { motion } from "motion/react";
import { Endeavor, UserStats, ProgressLog } from "../types";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Cell,
} from "recharts";

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
  const [selectedRange, setSelectedRange] = useState<"14d" | "28d">("14d");

  // 14-day velocity data for Recharts Area Chart
  const velocityData = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    const dStr = d.toISOString().split("T")[0];
    const dayName = d.toLocaleDateString("en-US", { weekday: "short" });

    let totalVolume = 0;
    endeavors.forEach((e) => {
      if (e.history && e.history?.[dStr]) {
        totalVolume += e.history?.[dStr];
      }
    });

    return {
      date: dayName + " " + d.getDate(),
      rawDate: dStr,
      volume: totalVolume,
      count: endeavors.filter((e) => e.history?.[dStr]).length,
    };
  });

  // Category Distribution for Bar Chart
  const categoryCounts: Record<string, number> = {};
  endeavors.forEach((e) => {
    categoryCounts[e.category] = (categoryCounts[e.category] || 0) + 1;
  });

  const categoryChartData = Object.entries(categoryCounts).map(([cat, count]) => {
    let color = "#10b981"; // emerald
    if (cat === "career") color = "#f59e0b"; // amber
    if (cat === "health") color = "#ef4444"; // red
    if (cat === "learning") color = "#6366f1"; // indigo
    if (cat === "finance") color = "#10b981"; // emerald
    if (cat === "mindfulness") color = "#06b6d4"; // cyan

    return {
      category: cat.charAt(0).toUpperCase() + cat.slice(1),
      count,
      color,
    };
  });

  // 28-day consistency heatmap
  const past28Days = Array.from({ length: 28 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (27 - i));
    const dStr = d.toISOString().split("T")[0];
    const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
    const dayNumber = d.getDate();

    let totalCount = 0;
    endeavors.forEach((e) => {
      if (e.history?.[dStr]) totalCount += 1;
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
      {/* Top Banner - Interstellar Telemetry Deck */}
      <div className="relative bg-[#06070B]/90 md:bg-[#06070B]/75 backdrop-blur-3xl rounded-[28px] sm:rounded-[32px] p-6 sm:p-7 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.12)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 overflow-hidden">
        {/* Ambient Cosmic Mesh */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full blur-3xl opacity-20 bg-emerald-500/30" />
          <div className="absolute top-0 right-1/4 w-56 h-56 rounded-full blur-3xl opacity-15 bg-cyan-500/25" />
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:18px_18px] opacity-25" />
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center space-x-2 text-emerald-400 mb-1 font-mono">
            <BarChart3 className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              TELEMETRY & INTELLIGENCE // SEC-07
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white uppercase tracking-tight">
            Orbital Velocity & Trajectory
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 font-normal">
            Holistic cross-activity performance tracking and cosmic consistency forecasts
          </p>
        </div>

        <div className="relative z-10 flex items-center space-x-3 bg-white/[0.03] p-3 rounded-2xl border border-white/10 backdrop-blur-md">
          <div className="w-10 h-10 rounded-xl bg-emerald-400 text-black flex items-center justify-center font-bold text-sm font-mono shadow-[0_0_15px_rgba(52,211,153,0.5)]">
            LV.{stats.level}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold text-white">{stats.xp} Total XP</span>
              <span className="text-[9px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded font-semibold">
                COMMANDER TIER
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-400">
              {1000 - (stats.xp % 1000)} XP to Level {stats.level + 1}
            </p>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Interstellar Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-[#06070B]/85 backdrop-blur-2xl p-5 rounded-2xl border border-white/10 shadow-[0_0_25px_rgba(0,0,0,0.5)] relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
              TOTAL LOGS
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-bold font-mono text-white">
            {stats.totalCheckIns}
          </span>
          <p className="text-[10px] font-mono text-slate-500 mt-1">Telemetry data points</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="bg-[#06070B]/85 backdrop-blur-2xl p-5 rounded-2xl border border-white/10 shadow-[0_0_25px_rgba(0,0,0,0.5)] relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
              ACTIVE STREAKS
            </span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-bold font-mono text-amber-400">
            {endeavors.reduce((acc, curr) => acc + (curr.streakCount > 0 ? 1 : 0), 0)}
          </span>
          <p className="text-[10px] font-mono text-slate-500 mt-1">Rituals sustained</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="bg-[#06070B]/85 backdrop-blur-2xl p-5 rounded-2xl border border-white/10 shadow-[0_0_25px_rgba(0,0,0,0.5)] relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
              MILESTONES
            </span>
            <Award className="w-4 h-4 text-cyan-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-bold font-mono text-cyan-400">
            {stats.totalMilestonesCompleted}
          </span>
          <p className="text-[10px] font-mono text-slate-500 mt-1">Phases conquered</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="bg-[#06070B]/85 backdrop-blur-2xl p-5 rounded-2xl border border-white/10 shadow-[0_0_25px_rgba(0,0,0,0.5)] relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
              IN ORBIT
            </span>
            <Target className="w-4 h-4 text-purple-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-bold font-mono text-white">
            {totalEndeavors}
          </span>
          <p className="text-[10px] font-mono text-slate-500 mt-1">Active flight trajectories</p>
        </motion.div>
      </div>

      {/* Interactive Charts Section: 14-Day Velocity & Category Balance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: 14-Day Velocity Area Graph */}
        <div className="bg-[#06070B]/90 backdrop-blur-3xl rounded-[28px] p-6 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.7)] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-base flex items-center space-x-2 uppercase tracking-tight">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>14-Day Velocity Curve</span>
              </h3>
              <p className="text-xs text-slate-400 font-mono">Daily logged output and rituals</p>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              ORBIT FLOW
            </span>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={velocityData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVelocity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  stroke="#525252"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#525252"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#090B12",
                    borderColor: "rgba(255,255,255,0.15)",
                    borderRadius: "14px",
                    fontSize: "12px",
                    color: "#fff",
                    boxShadow: "0 0 20px rgba(0,0,0,0.8)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  name="Goals Logged"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorVelocity)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Life Spheres Distribution Bar Chart */}
        <div className="bg-[#06070B]/90 backdrop-blur-3xl rounded-[28px] p-6 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.7)] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-base flex items-center space-x-2 uppercase tracking-tight">
                <Layers className="w-4 h-4 text-purple-400" />
                <span>Life Spheres Distribution</span>
              </h3>
              <p className="text-xs text-slate-400 font-mono">Endeavors mapped across domains</p>
            </div>
            <span className="text-[10px] text-purple-400 font-mono bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
              {categoryChartData.length} SPHERES
            </span>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis
                  dataKey="category"
                  stroke="#525252"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#525252"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#090B12",
                    borderColor: "rgba(255,255,255,0.15)",
                    borderRadius: "14px",
                    fontSize: "12px",
                    color: "#fff",
                    boxShadow: "0 0 20px rgba(0,0,0,0.8)",
                  }}
                />
                <Bar dataKey="count" name="Endeavors" radius={[6, 6, 0, 0]}>
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 28-Day Consistency Heatmap Grid */}
      <div className="bg-[#06070B]/90 backdrop-blur-3xl rounded-[28px] p-6 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.7)] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-base uppercase tracking-tight">
              4-Week Cosmic Activity Matrix
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Daily execution density across all endeavors
            </p>
          </div>
          <div className="flex items-center space-x-1.5 text-[10px] font-mono text-slate-400 select-none">
            <span>LESS</span>
            <div className="w-3 h-3 rounded bg-white/5 border border-white/5" />
            <div className="w-3 h-3 rounded bg-emerald-950 border border-emerald-800" />
            <div className="w-3 h-3 rounded bg-emerald-700" />
            <div className="w-3 h-3 rounded bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.7)]" />
            <span>MORE</span>
          </div>
        </div>

        {/* The Grid */}
        <div className="grid grid-cols-7 gap-2 pt-2">
          {past28Days.map((day, idx) => {
            let bg = "bg-white/[0.03] text-slate-400 border border-white/5 hover:border-white/20";
            if (day.count >= 4)
              bg =
                "bg-emerald-400 text-black font-bold border border-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.5)]";
            else if (day.count >= 2)
              bg =
                "bg-emerald-600 text-white font-semibold border border-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]";
            else if (day.count === 1)
              bg =
                "bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 hover:bg-emerald-900";

            return (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                className={`h-14 rounded-xl p-1.5 flex flex-col justify-between transition-all cursor-pointer select-none font-mono ${bg}`}
                title={`${day.date}: ${day.count} activities completed`}
              >
                <span className="text-[9px] uppercase opacity-75">{day.dayName}</span>
                <span className="text-xs font-bold">{day.dayNumber}</span>
                <span className="text-[9px] opacity-90">
                  {day.count > 0 ? `${day.count} logs` : "—"}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Archetype Balance & Badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Archetype Breakdown */}
        <div className="bg-[#06070B]/90 backdrop-blur-3xl rounded-[28px] p-6 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.7)] space-y-4">
          <h3 className="font-bold text-white text-base uppercase tracking-tight">
            Trajectory Archetypes
          </h3>
          <p className="text-xs text-slate-400 font-mono">Structure and balance of your goals</p>

          <div className="space-y-3 pt-2 font-mono">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">Quantifiable Targets ({meters.length})</span>
                <span className="text-emerald-400 font-bold">
                  {totalEndeavors > 0 ? Math.round((meters.length / totalEndeavors) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden p-0.5 border border-white/5">
                <div
                  className="bg-emerald-400 h-full rounded-full"
                  style={{
                    width: `${
                      totalEndeavors > 0 ? (meters.length / totalEndeavors) * 100 : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">Habits & Rituals ({habits.length})</span>
                <span className="text-amber-400 font-bold">
                  {totalEndeavors > 0 ? Math.round((habits.length / totalEndeavors) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden p-0.5 border border-white/5">
                <div
                  className="bg-amber-400 h-full rounded-full"
                  style={{
                    width: `${
                      totalEndeavors > 0 ? (habits.length / totalEndeavors) * 100 : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">Project Milestones ({milestones.length})</span>
                <span className="text-cyan-400 font-bold">
                  {totalEndeavors > 0
                    ? Math.round((milestones.length / totalEndeavors) * 100)
                    : 0}%
                </span>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden p-0.5 border border-white/5">
                <div
                  className="bg-cyan-400 h-full rounded-full"
                  style={{
                    width: `${
                      totalEndeavors > 0 ? (milestones.length / totalEndeavors) * 100 : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Unlocked Badges & Trophies */}
        <div className="bg-[#06070B]/90 backdrop-blur-3xl rounded-[28px] p-6 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.7)] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base uppercase tracking-tight">
              Cosmic Honors
            </h3>
            <span className="text-xs font-mono font-semibold text-amber-300 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full">
              {stats.badges.filter((b) => b.unlockedAt).length} / {stats.badges.length} UNLOCKED
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
                      ? "bg-white/[0.04] border-amber-500/30 text-white shadow-[0_0_15px_rgba(251,191,36,0.1)]"
                      : "bg-white/[0.01] border-white/5 opacity-40 text-slate-500"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm ${
                      isUnlocked
                        ? "bg-amber-400 text-black font-bold shadow-[0_0_10px_rgba(251,191,36,0.6)]"
                        : "bg-white/5 text-slate-600"
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
