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
} from "lucide-react";
import { Endeavor, UserProfile, UserStats } from "../types";
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
    <div className="bg-[#0D0D0D] rounded-3xl border border-white/5 shadow-xs overflow-hidden transition-all duration-200">
      {/* Widget Header Banner */}
      <div className="p-5 sm:p-6 flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <TimeIcon className="w-5 h-5 stroke-[2.2]" />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {greeting}, {profile.name || "Commander"}
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hidden sm:inline-block">
                Level {stats.level}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {profile.northStarMotto || "Consistency compounds into extraordinary outcomes."}
            </p>
          </div>
        </div>

        {/* Right Quick Controls */}
        <div className="flex items-center space-x-2">
          {dailyHabits.length > 0 && habitsDoneToday < dailyHabits.length && (
            <button
              onClick={handleCheckInAllPending}
              className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold rounded-xl cursor-pointer active:scale-95 transition"
              title="Check in all remaining daily habits"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Log All Daily</span>
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl cursor-pointer active:scale-90 transition"
            title={isExpanded ? "Collapse Briefing" : "Expand Briefing"}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expandable Body */}
      {isExpanded && (
        <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0 border-t border-white/5 space-y-4 animate-in fade-in duration-200">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
            {/* Daily Habit Ring */}
            <div className="bg-[#141414] p-3.5 rounded-2xl border border-white/5 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center font-bold text-xs text-emerald-400">
                {habitCompletionRate}%
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Habits Today</span>
                <div className="text-xs font-bold text-white">
                  {habitsDoneToday} of {dailyHabits.length} Done
                </div>
              </div>
            </div>

            {/* Total XP Score */}
            <div className="bg-[#141414] p-3.5 rounded-2xl border border-white/5 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Orbit Momentum</span>
                <div className="text-xs font-bold text-white">{stats.xp} Total XP</div>
              </div>
            </div>

            {/* Longest Active Streak */}
            <div className="bg-[#141414] p-3.5 rounded-2xl border border-white/5 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Active Streaks</span>
                <div className="text-xs font-bold text-amber-400">
                  {endeavors.reduce((acc, curr) => acc + (curr.streakCount > 0 ? 1 : 0), 0)} Streaks
                </div>
              </div>
            </div>

            {/* Daily Target Focus Hours */}
            <div className="bg-[#141414] p-3.5 rounded-2xl border border-white/5 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Daily Focus Goal</span>
                <div className="text-xs font-bold text-slate-200">
                  {profile.targetFocusHoursPerDay || 4}h Block
                </div>
              </div>
            </div>
          </div>

          {/* High Priority Orbit Queue */}
          {priorityEndeavors.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                <span className="flex items-center space-x-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>High Priority Focus Queue</span>
                </span>
                <span className="text-[10px] text-slate-500">{priorityEndeavors.length} active</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {priorityEndeavors.slice(0, 3).map((item) => {
                  const isDoneToday = Boolean(item.history?.[todayStr]);
                  return (
                    <div
                      key={item.id}
                      className="bg-[#141414] border border-white/5 hover:border-white/15 p-3 rounded-2xl flex items-center justify-between space-x-2 transition"
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: item.color || "#10b981" }}
                        />
                        <div className="truncate">
                          <h4 className="text-xs font-semibold text-white truncate">{item.title}</h4>
                          <span className="text-[10px] text-slate-400 capitalize">
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
                                ? "bg-emerald-500 text-black font-bold"
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
                            title="Start Sprint"
                          >
                            <Play className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
