import React, { useState } from "react";
import {
  Flame,
  CheckCircle2,
  Circle,
  Plus,
  ArrowUpRight,
  TrendingUp,
  MoreVertical,
  Check,
  ChevronDown,
  ChevronUp,
  Timer,
  Edit3,
  Trash2,
  Clock,
  Sparkles,
  Calendar,
} from "lucide-react";
import { Endeavor, MilestoneItem } from "../types";
import { getEndeavorIcon, getCategoryBadge, getArchetypeInfo } from "../lib/icons";
import confetti from "canvas-confetti";

interface EndeavorCardProps {
  endeavor: Endeavor;
  onQuickLog: (endeavor: Endeavor, value: number, note?: string) => void;
  onOpenLogModal: (endeavor: Endeavor) => void;
  onToggleMilestone: (endeavorId: string, milestoneId: string) => void;
  onStartFocus: (endeavor: Endeavor) => void;
  onEdit: (endeavor: Endeavor) => void;
  onDelete: (endeavorId: string) => void;
  onOpenDetail?: (endeavor: Endeavor) => void;
}

export const EndeavorCard: React.FC<EndeavorCardProps> = ({
  endeavor,
  onQuickLog,
  onOpenLogModal,
  onToggleMilestone,
  onStartFocus,
  onEdit,
  onDelete,
  onOpenDetail,
}) => {
  const [showMilestones, setShowMilestones] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const categoryInfo = getCategoryBadge(endeavor.category);
  const archetypeInfo = getArchetypeInfo(endeavor.archetype);

  // Today's date string YYYY-MM-DD
  const todayStr = new Date().toISOString().split("T")[0];
  const loggedToday = Boolean(endeavor.history[todayStr] && endeavor.history[todayStr] > 0);

  // Calculate percentage
  let percentage = 0;
  if (endeavor.archetype === "milestone" && endeavor.milestones.length > 0) {
    const completedCount = endeavor.milestones.filter((m) => m.completed).length;
    percentage = Math.round((completedCount / endeavor.milestones.length) * 100);
  } else if (endeavor.targetValue > 0) {
    const rawVal = endeavor.currentValue - endeavor.startValue;
    const totalTarget = endeavor.targetValue - endeavor.startValue;
    percentage = Math.min(100, Math.max(0, Math.round((rawVal / (totalTarget || 1)) * 100)));
  }

  // Mini 7-day history array
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dStr = d.toISOString().split("T")[0];
    const dayLabel = d.toLocaleDateString("en-US", { weekday: "narrow" });
    const isLogged = Boolean(endeavor.history[dStr] && endeavor.history[dStr] > 0);
    return { date: dStr, label: dayLabel, isLogged, isToday: dStr === todayStr };
  });

  const handleHabitCheck = () => {
    if (!loggedToday) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
      });
      onQuickLog(endeavor, 1, "Completed daily habit check-in");
    } else {
      // Toggle off for today
      onQuickLog(endeavor, -1, "Removed daily check-in");
    }
  };

  const handleQuickAdd = (inc: number) => {
    if (percentage + (inc / endeavor.targetValue) * 100 >= 100) {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.7 },
      });
    }
    onQuickLog(endeavor, inc, `Added ${inc} ${endeavor.unit}`);
  };

  return (
    <div className="bg-[#141414] rounded-2xl border border-white/5 hover:border-white/20 hover:shadow-xl transition-all duration-200 p-5 flex flex-col justify-between relative group">
      {/* Top Header info */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center space-x-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform duration-200 cursor-pointer"
              style={{ backgroundColor: endeavor.color || "#10b981" }}
              onClick={() => onOpenLogModal(endeavor)}
              title="Open log modal"
            >
              {getEndeavorIcon(endeavor.icon, "w-5 h-5")}
            </div>
            <div>
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/5 select-none">
                  {categoryInfo.label}
                </span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded select-none ${
                    endeavor.archetype === "milestone"
                      ? "text-blue-400 bg-blue-400/10"
                      : endeavor.archetype === "habit"
                      ? "text-amber-400 bg-amber-400/10"
                      : "text-emerald-400 bg-emerald-400/10"
                  }`}
                >
                  {endeavor.archetype === "habit"
                    ? "Habit"
                    : endeavor.archetype === "meter"
                    ? "Quantifiable"
                    : "Milestone"}
                </span>
              </div>
              <h3
                onClick={() => (onOpenDetail ? onOpenDetail(endeavor) : onEdit(endeavor))}
                className="font-semibold text-white text-base sm:text-lg mt-1 tracking-tight leading-snug cursor-pointer hover:text-emerald-400 transition-colors"
                title="Click to view strategy & milestones"
              >
                {endeavor.title}
              </h3>
            </div>
          </div>

          {/* Menu Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 text-slate-500 hover:text-slate-200 hover:bg-white/10 active:scale-90 rounded-lg cursor-pointer transition-all"
              aria-label="More options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-1 w-48 bg-[#1a1a1a] rounded-xl shadow-2xl border border-white/10 py-1.5 z-20 animate-in fade-in zoom-in-95 duration-150">
                {onOpenDetail && (
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onOpenDetail(endeavor);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:bg-white/10 hover:text-white cursor-pointer flex items-center space-x-2 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>Strategy & Milestones</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onOpenLogModal(endeavor);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:bg-white/10 hover:text-white cursor-pointer flex items-center space-x-2 transition-colors"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Log with Notes</span>
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onStartFocus(endeavor);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:bg-white/10 hover:text-white cursor-pointer flex items-center space-x-2 transition-colors"
                >
                  <Timer className="w-3.5 h-3.5 text-amber-400" />
                  <span>Start Focus Sprint</span>
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onEdit(endeavor);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:bg-white/10 hover:text-white cursor-pointer flex items-center space-x-2 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Edit Endeavor</span>
                </button>
                <div className="my-1 border-t border-white/5" />
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onDelete(endeavor.id);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 cursor-pointer flex items-center space-x-2 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {endeavor.description && (
          <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">{endeavor.description}</p>
        )}

        {/* PROGRESS SECTION BASED ON ARCHETYPE */}

        {/* 1. METER (Quantifiable target) */}
        {endeavor.archetype === "meter" && (
          <div className="space-y-3 mb-4">
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline space-x-1.5">
                <span className="text-2xl font-bold text-white tracking-tight">
                  {endeavor.unit === "USD" ? `$${endeavor.currentValue.toLocaleString()}` : endeavor.currentValue.toLocaleString()}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  / {endeavor.unit === "USD" ? `$${endeavor.targetValue.toLocaleString()}` : `${endeavor.targetValue.toLocaleString()} ${endeavor.unit}`}
                </span>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded select-none">
                {percentage}%
              </span>
            </div>

            {/* Visual Progress Bar */}
            <div
              className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden cursor-pointer group/bar"
              onClick={() => onOpenLogModal(endeavor)}
              title="Click to log custom amount"
            >
              <div
                className="h-full rounded-full transition-all duration-500 group-hover/bar:brightness-125"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: endeavor.color || "#10b981",
                }}
              />
            </div>

            {/* Quick Action Increments */}
            <div className="flex items-center space-x-1.5 pt-1">
              <span className="text-[11px] text-slate-500 font-medium mr-1 select-none">Quick Log:</span>
              <button
                onClick={() => handleQuickAdd(1)}
                className="px-2.5 py-1 text-xs font-semibold bg-white/5 hover:bg-white/15 hover:text-white text-slate-300 rounded-lg cursor-pointer active:scale-90 transition-all duration-150"
              >
                +1
              </button>
              <button
                onClick={() => handleQuickAdd(5)}
                className="px-2.5 py-1 text-xs font-semibold bg-white/5 hover:bg-white/15 hover:text-white text-slate-300 rounded-lg cursor-pointer active:scale-90 transition-all duration-150"
              >
                +5
              </button>
              {endeavor.targetValue >= 500 && (
                <button
                  onClick={() => handleQuickAdd(50)}
                  className="px-2.5 py-1 text-xs font-semibold bg-white/5 hover:bg-white/15 hover:text-white text-slate-300 rounded-lg cursor-pointer active:scale-90 transition-all duration-150"
                >
                  +50
                </button>
              )}
              <button
                onClick={() => onOpenLogModal(endeavor)}
                className="px-2.5 py-1 text-xs font-medium text-emerald-400 hover:bg-emerald-400/10 hover:text-emerald-300 rounded-lg cursor-pointer active:scale-95 transition-all duration-150 ml-auto flex items-center space-x-1"
              >
                <span>Custom</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* 2. HABIT (Daily/weekly streak) */}
        {endeavor.archetype === "habit" && (
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-md border border-amber-400/20 select-none">
                  <Flame className="w-4 h-4 fill-amber-400 text-amber-400 animate-pulse" />
                  <span className="text-xs font-bold">{endeavor.streakCount} Day Streak</span>
                </div>
                <span className="text-[11px] text-slate-500 select-none">Best: {endeavor.bestStreak}d</span>
              </div>

              {/* Habit Check Button */}
              <button
                onClick={handleHabitCheck}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer active:scale-95 hover:brightness-110 transition-all duration-150 shadow-xs ${
                  loggedToday
                    ? "bg-emerald-500 text-black font-bold"
                    : "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 hover:border-white/20"
                }`}
              >
                {loggedToday ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-black stroke-[2.5]" />
                    <span>Done Today</span>
                  </>
                ) : (
                  <>
                    <Circle className="w-4 h-4 text-slate-500" />
                    <span>Check In</span>
                  </>
                )}
              </button>
            </div>

            {/* 7-Day Consistency Dot Matrix */}
            <div className="bg-[#0D0D0D] rounded-xl p-2.5 border border-white/5 flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider select-none">Past 7 Days:</span>
              <div className="flex items-center space-x-2">
                {last7Days.map((day, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (day.isToday) {
                        handleHabitCheck();
                      }
                    }}
                    className={`flex flex-col items-center space-y-1 group/dot transition-transform ${
                      day.isToday ? "cursor-pointer hover:scale-110 active:scale-95" : "cursor-default"
                    }`}
                    title={`${day.date}: ${day.isLogged ? "Completed" : "Missed"}${day.isToday ? " (Click to toggle today)" : ""}`}
                  >
                    <span className="text-[9px] font-medium text-slate-500 group-hover/dot:text-slate-300 transition-colors">
                      {day.label}
                    </span>
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                        day.isLogged
                          ? "bg-emerald-500 text-black shadow-xs"
                          : day.isToday
                          ? "border-2 border-emerald-400 bg-transparent group-hover/dot:bg-emerald-400/20"
                          : "bg-white/5"
                      }`}
                    >
                      {day.isLogged && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. MILESTONE (Project phases) */}
        {endeavor.archetype === "milestone" && (
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-baseline space-x-1.5">
                <span className="text-xl font-bold text-white">
                  {endeavor.milestones.filter((m) => m.completed).length} / {endeavor.milestones.length}
                </span>
                <span className="text-xs text-slate-500 font-medium">Phases Done</span>
              </div>
              <span className="text-xs font-bold text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded select-none">
                {percentage}% Completed
              </span>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: endeavor.color || "#3b82f6",
                }}
              />
            </div>

            {/* Milestones toggler */}
            <button
              onClick={() => setShowMilestones(!showMilestones)}
              className="w-full flex items-center justify-between py-1.5 px-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-lg text-xs font-medium cursor-pointer active:scale-[0.99] transition-all duration-150"
            >
              <span>View Milestone Roadmap ({endeavor.milestones.length})</span>
              {showMilestones ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {/* Expandable Milestones checklist */}
            {showMilestones && (
              <div className="space-y-2 pt-1 border-t border-white/5">
                {endeavor.milestones.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => onToggleMilestone(endeavor.id, m.id)}
                    className={`flex items-start space-x-2.5 p-2 rounded-xl text-xs cursor-pointer active:scale-[0.98] transition-all duration-150 ${
                      m.completed
                        ? "bg-emerald-500/10 text-slate-400 line-through"
                        : "bg-white/5 hover:bg-white/10 hover:border-white/15 text-slate-200 border border-white/5"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center transition-all ${
                        m.completed ? "bg-emerald-500 text-black scale-105" : "border border-white/20 bg-transparent hover:border-white/40"
                      }`}
                    >
                      {m.completed && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="flex-1 font-medium select-none">{m.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Card Footer Actions */}
      <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center space-x-2">
          {endeavor.scheduledTime && (
            <span className="flex items-center space-x-1 text-slate-400 bg-white/5 px-2 py-0.5 rounded-md select-none">
              <Clock className="w-3 h-3 text-slate-500" />
              <span>{endeavor.scheduledTime}</span>
            </span>
          )}
          {endeavor.priority === "high" && (
            <span className="text-[10px] font-bold text-rose-400 bg-rose-400/10 px-1.5 py-0.5 rounded uppercase tracking-wider select-none">
              High Priority
            </span>
          )}
        </div>

        <button
          onClick={() => onStartFocus(endeavor)}
          className="flex items-center space-x-1 font-medium text-slate-300 hover:text-emerald-400 hover:bg-emerald-400/10 px-2.5 py-1 rounded-lg cursor-pointer active:scale-95 transition-all duration-150"
        >
          <Timer className="w-3.5 h-3.5 text-emerald-400" />
          <span>Focus Sprint</span>
        </button>
      </div>
    </div>
  );
};
