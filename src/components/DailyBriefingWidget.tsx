import React, { useState } from "react";
import {
  Sparkles,
  Flame,
  CheckCircle2,
  Play,
  ChevronDown,
  ChevronUp,
  Award,
  Sun,
  Moon,
  Clock,
  Zap,
  Orbit,
  Radio,
  Compass,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Endeavor, UserProfile, UserStats } from "../types";
import { THEME_ACCENTS } from "../lib/theme";
import confetti from "canvas-confetti";

interface DailyBriefingWidgetProps {
  profile: UserProfile;
  stats: UserStats;
  endeavors: Endeavor[];
  onCheckInHabit: (endeavorId: string) => void;
  onStartFocus: (endeavor: Endeavor) => void;
  onOpenCreate: () => void;
}

export const DailyBriefingWidget: React.FC<DailyBriefingWidgetProps> = ({
  profile,
  stats,
  endeavors,
  onCheckInHabit,
  onStartFocus,
  onOpenCreate,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const currentTheme = THEME_ACCENTS[profile.themeConfig?.accent] || THEME_ACCENTS.emerald;

  // Time of day logic
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";
  const TimeIcon = hour < 18 ? Sun : Moon;

  const todayStr = new Date().toISOString().split("T")[0];

  // Daily Habits
  const dailyHabits = endeavors.filter((e) => e.archetype === "habit");
  const habitsDoneToday = dailyHabits.filter((h) => Boolean(h.history?.[todayStr])).length;
  const habitCompletionRate =
    dailyHabits.length > 0 ? Math.round((habitsDoneToday / dailyHabits.length) * 100) : 100;

  // High priority endeavors
  const priorityEndeavors = endeavors.filter((e) => e.priority === "high" || e.streakCount > 0);

  // Check in all pending habits with 1 click
  const handleCheckInAllPending = () => {
    const pendingHabits = dailyHabits.filter((h) => !h.history?.[todayStr]);
    if (pendingHabits.length === 0) return;

    pendingHabits.forEach((h) => {
      onCheckInHabit(h.id);
    });

    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div
      id="daily-briefing-flight-deck"
      className="relative bg-[#06070B]/90 md:bg-[#06070B]/75 backdrop-blur-3xl rounded-[28px] sm:rounded-[32px] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.12)] overflow-hidden transition-all duration-300 group"
    >
      {/* Cosmic Nebula Glow & Starlight Micro-Grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <div
          className="absolute -top-14 -left-14 w-60 h-60 rounded-full blur-3xl opacity-20 transition-all duration-700"
          style={{ backgroundColor: currentTheme.primaryHex }}
        />
        <div className="absolute top-1/2 -right-20 w-52 h-52 rounded-full blur-3xl opacity-15 bg-cyan-500/20" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:18px_18px] opacity-25" />
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      {/* Widget Header Banner */}
      <div className="relative z-10 p-5 sm:p-7 flex items-center justify-between">
        <div className="flex items-center space-x-3.5 sm:space-x-4 min-w-0">
          <div className="relative flex items-center justify-center shrink-0">
            <div
              className={`w-11 h-11 rounded-2xl ${currentTheme.badgeBg} flex items-center justify-center ${currentTheme.textAccent} shadow-lg relative z-10`}
            >
              <TimeIcon className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span
              className="absolute inset-0 rounded-2xl blur-xs opacity-60 pointer-events-none"
              style={{ backgroundColor: currentTheme.primaryHex }}
            />
          </div>

          <div className="min-w-0">
            <div className="flex items-center space-x-2 flex-wrap">
              <h2 className="text-base sm:text-xl font-display font-extrabold text-white tracking-tight truncate">
                {greeting}, {profile.name || "Commander"}
              </h2>
              <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/10 text-slate-300 border border-white/10 hidden sm:inline-block">
                ORBIT LV.{stats.level || 1}
              </span>
              <span className="text-[9px] font-mono text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center space-x-1 shadow-[0_0_8px_rgba(52,211,153,0.2)]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>FLIGHT DECK ONLINE</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 truncate font-sans">
              {profile.northStarMotto || "Consistency compounds into extraordinary outcomes."}
            </p>
          </div>
        </div>

        {/* Right Quick Controls */}
        <div className="flex items-center space-x-2 shrink-0">
          {dailyHabits.length > 0 && habitsDoneToday < dailyHabits.length && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCheckInAllPending}
              className={`hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 ${currentTheme.buttonBg} ${currentTheme.buttonHover} ${currentTheme.buttonText} text-xs font-bold rounded-xl cursor-pointer shadow-md transition-all`}
              title="Check in all remaining daily habits"
            >
              <Zap className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Log All Daily</span>
            </motion.button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl cursor-pointer active:scale-90 transition border border-white/5"
            title={isExpanded ? "Collapse Flight Briefing" : "Expand Flight Briefing"}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expandable Flight Body */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 px-5 pb-5 sm:px-7 sm:pb-7 pt-0 border-t border-white/5 space-y-4 overflow-hidden"
          >
            {/* Quick Telemetry Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
              {/* Daily Habit Synced */}
              <div className="bg-white/[0.03] hover:bg-white/[0.06] p-3.5 rounded-2xl border border-white/5 flex items-center space-x-3 transition-colors">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-xs shadow-inner"
                  style={{
                    backgroundColor: `${currentTheme.primaryHex}20`,
                    color: currentTheme.primaryHex,
                    borderColor: `${currentTheme.primaryHex}40`,
                  }}
                >
                  {habitCompletionRate}%
                </div>
                <div>
                  <span className="text-[9px] font-mono text-slate-500 font-semibold uppercase tracking-wider">
                    Rituals Synced
                  </span>
                  <div className="text-xs font-bold text-white font-mono">
                    {habitsDoneToday}/{dailyHabits.length} Done
                  </div>
                </div>
              </div>

              {/* Total Orbit XP */}
              <div className="bg-white/[0.03] hover:bg-white/[0.06] p-3.5 rounded-2xl border border-white/5 flex items-center space-x-3 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[9px] font-mono text-slate-500 font-semibold uppercase tracking-wider">
                    Orbit Starlight
                  </span>
                  <div className="text-xs font-bold text-white font-mono">{stats.xp} Total XP</div>
                </div>
              </div>

              {/* Longest Active Streak */}
              <div className="bg-white/[0.03] hover:bg-white/[0.06] p-3.5 rounded-2xl border border-white/5 flex items-center space-x-3 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Flame className="w-5 h-5 fill-amber-400/20" />
                </div>
                <div>
                  <span className="text-[9px] font-mono text-slate-500 font-semibold uppercase tracking-wider">
                    Active Momentum
                  </span>
                  <div className="text-xs font-bold text-amber-400 font-mono">
                    {endeavors.reduce((acc, curr) => acc + (curr.streakCount > 0 ? 1 : 0), 0)} Streaks
                  </div>
                </div>
              </div>

              {/* Target Focus Hours */}
              <div className="bg-white/[0.03] hover:bg-white/[0.06] p-3.5 rounded-2xl border border-white/5 flex items-center space-x-3 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[9px] font-mono text-slate-500 font-semibold uppercase tracking-wider">
                    Hyperion Goal
                  </span>
                  <div className="text-xs font-bold text-slate-200 font-mono">
                    {profile.targetFocusHoursPerDay || 4}h Orbit
                  </div>
                </div>
              </div>
            </div>

            {/* High Priority Orbit Launchpad */}
            {priorityEndeavors.length > 0 && (
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs text-slate-400 font-semibold font-mono">
                  <span className="flex items-center space-x-1.5 text-slate-300">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>PRIORITY ORBIT LAUNCHPAD</span>
                  </span>
                  <span className="text-[10px] text-slate-500">{priorityEndeavors.length} active</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {priorityEndeavors.slice(0, 3).map((item) => {
                    const isDoneToday = Boolean(item.history?.[todayStr]);
                    return (
                      <motion.div
                        key={item.id}
                        whileHover={{ scale: 1.01 }}
                        className="bg-white/[0.03] border border-white/5 hover:border-white/15 p-3 rounded-2xl flex items-center justify-between space-x-2 transition shadow-xs"
                      >
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                            style={{
                              backgroundColor: item.color || "#10b981",
                              boxShadow: `0 0 8px ${item.color || "#10b981"}80`,
                            }}
                          />
                          <div className="truncate">
                            <h4 className="text-xs font-semibold text-white truncate">{item.title}</h4>
                            <span className="text-[9px] font-mono text-slate-400 capitalize">
                              {item.streakCount > 0 ? `${item.streakCount}d streak` : item.category}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1 shrink-0">
                          {item.archetype === "habit" ? (
                            <button
                              onClick={() => onCheckInHabit(item.id)}
                              className={`p-1.5 rounded-lg cursor-pointer active:scale-90 transition ${
                                isDoneToday
                                  ? "bg-emerald-400 text-black font-bold shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                                  : "bg-white/5 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-400"
                              }`}
                              title={isDoneToday ? "Completed today" : "Check in"}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => onStartFocus(item)}
                              className="p-1.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-lg cursor-pointer active:scale-90 transition"
                              title="Start Focus Sprint"
                            >
                              <Play className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
