import React from "react";
import { motion } from "motion/react";
import {
  Flame,
  Zap,
  CheckCircle2,
  Sparkles,
  Shield,
  Award,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { Endeavor, UserStats } from "../types";
import { focusAudio } from "../lib/audio";
import { getEndeavorIcon } from "../lib/icons";

interface RapidHabitBlitzBarProps {
  endeavors: Endeavor[];
  stats: UserStats;
  comboCount: number;
  comboTimeRemaining: number; // in seconds
  onQuickLog: (endeavor: Endeavor, value: number, note?: string, clickPos?: { x: number; y: number }) => void;
  onOpenCreateModal: () => void;
}

export const RapidHabitBlitzBar: React.FC<RapidHabitBlitzBarProps> = ({
  endeavors,
  stats,
  comboCount,
  comboTimeRemaining,
  onQuickLog,
  onOpenCreateModal,
}) => {
  const todayStr = new Date().toISOString().split("T")[0];

  // Filter for active daily habits or quick check-ins
  const habits = endeavors.filter(
    (e) => e.status === "active" && (e.archetype === "habit" || e.frequency === "daily")
  );

  const completedTodayCount = habits.filter((h) => (h.history?.[todayStr] || 0) > 0).length;

  const handleHabitClick = (e: React.MouseEvent, habit: Endeavor) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickPos = {
      x: rect.left + rect.width / 2,
      y: rect.top,
    };

    onQuickLog(habit, 1, "Rapid Blitz Check-in", clickPos);
  };

  const getMultiplierLabel = (combo: number) => {
    if (combo >= 4) return "2.0x XP FRENZY";
    if (combo >= 3) return "1.5x XP SURGE";
    if (combo >= 2) return "1.2x XP BOOST";
    return "1.0x XP";
  };

  if (habits.length === 0) return null;

  return (
    <div className="relative bg-[#06070B]/90 backdrop-blur-2xl rounded-[28px] border border-white/10 p-4 sm:p-5 shadow-[0_0_35px_rgba(0,0,0,0.6)] overflow-hidden font-mono">
      {/* Dynamic Background Flare when Combo is active */}
      {comboCount > 1 && (
        <div className="absolute inset-0 bg-linear-to-r from-orange-500/10 via-amber-500/5 to-purple-500/10 animate-pulse pointer-events-none" />
      )}

      {/* Top Strip Header: Habits Progress & Combo Meter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.3)]">
            <Zap className="w-4 h-4 fill-amber-300" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-xs sm:text-sm font-extrabold text-white uppercase tracking-wider">
                RAPID HABIT BLITZ
              </h4>
              <span className="text-[10px] font-bold text-slate-400">
                ({completedTodayCount}/{habits.length} Complete)
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans font-normal">
              1-Tap instant streak logging with escalating audio combo multipliers
            </p>
          </div>
        </div>

        {/* Combo Multiplier Badge */}
        <div className="flex items-center space-x-2 shrink-0">
          {comboCount > 1 ? (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-linear-to-r from-orange-500/30 to-amber-500/20 border border-orange-400/80 text-orange-300 shadow-[0_0_20px_rgba(249,115,22,0.4)]"
            >
              <Flame className="w-4 h-4 text-orange-400 fill-orange-400 animate-bounce" />
              <span className="text-xs font-black tracking-wider">
                {comboCount}x COMBO!
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-black/40 text-amber-200">
                {getMultiplierLabel(comboCount)} ({comboTimeRemaining}s)
              </span>
            </motion.div>
          ) : (
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400 text-[10px]">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>CHAIN CHECK-INS FOR COMBOS</span>
            </div>
          )}
        </div>
      </div>

      {/* Horizontal Habit Blitz Cards / Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 pt-3">
        {habits.map((habit) => {
          const isDoneToday = (habit.history?.[todayStr] || 0) > 0;
          const streak = habit.streakCount || 0;
          const HabitIcon = getEndeavorIcon(habit.icon) || Sparkles;

          return (
            <motion.button
              key={habit.id}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => handleHabitClick(e, habit)}
              className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden group cursor-pointer flex flex-col justify-between h-28 ${
                isDoneToday
                  ? "bg-emerald-500/10 border-emerald-500/40 shadow-[0_0_20px_rgba(52,211,153,0.15)]"
                  : "bg-white/5 border-white/10 hover:border-amber-400/50 hover:bg-white/10 shadow-xs"
              }`}
            >
              {/* Top Row: Icon & Status Ring */}
              <div className="flex items-center justify-between w-full">
                <div
                  className="w-7 h-7 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: `${habit.color}25`,
                    color: habit.color,
                  }}
                >
                  <HabitIcon className="w-3.5 h-3.5" />
                </div>

                {isDoneToday ? (
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400/80 flex items-center justify-center text-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.4)]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-white/5 border border-white/20 group-hover:border-amber-400/80 group-hover:bg-amber-400/20 flex items-center justify-center transition-colors">
                    <span className="text-[10px] text-slate-400 group-hover:text-amber-300 font-bold">
                      +1
                    </span>
                  </div>
                )}
              </div>

              {/* Middle Title */}
              <div className="my-1">
                <div className="text-xs font-bold text-white truncate group-hover:text-amber-200 transition-colors">
                  {habit.title}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {habit.category}
                </div>
              </div>

              {/* Bottom Streak Badge */}
              <div className="flex items-center justify-between text-[10px] pt-1 border-t border-white/5">
                <div className="flex items-center space-x-1 text-orange-400 font-bold">
                  <Flame className="w-3 h-3 fill-orange-400/20" />
                  <span>{streak}d</span>
                </div>
                <span className="text-[9px] text-slate-400">
                  {isDoneToday ? "LOGGED" : "TAP TO LOG"}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
