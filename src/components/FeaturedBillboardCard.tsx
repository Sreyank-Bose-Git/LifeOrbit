import React, { useState } from "react";
import {
  Flame,
  Play,
  Plus,
  Sparkles,
  Timer,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  Calendar,
  Layers,
  Award,
  Zap,
  Target,
  ArrowUpRight,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Endeavor } from "../types";
import { getEndeavorIcon, getCategoryBadge, getArchetypeInfo, StylizedIconOrb } from "../lib/icons";
import confetti from "canvas-confetti";

interface FeaturedBillboardCardProps {
  endeavors: Endeavor[];
  onQuickLog: (endeavor: Endeavor, value: number, note?: string) => void;
  onStartFocus: (endeavor: Endeavor) => void;
  onOpenDetail: (endeavor: Endeavor) => void;
}

export const FeaturedBillboardCard: React.FC<FeaturedBillboardCardProps> = ({
  endeavors,
  onQuickLog,
  onStartFocus,
  onOpenDetail,
}) => {
  // Select top priority or highest streak endeavors for spotlight
  const spotlightCandidates = endeavors.filter(
    (e) => e.status === "active" && (e.priority === "high" || e.streakCount > 0 || e.currentValue > 0)
  );

  const featuredList = spotlightCandidates.length > 0 ? spotlightCandidates : endeavors.slice(0, 3);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (featuredList.length === 0) return null;

  const current = featuredList[currentIndex % featuredList.length];
  if (!current) return null;

  const categoryInfo = getCategoryBadge(current.category);
  const archetypeInfo = getArchetypeInfo(current.archetype);

  // Progress percentage calculation
  let percentage = 0;
  if (current.archetype === "milestone" && current.milestones.length > 0) {
    const completedCount = current.milestones.filter((m) => m.completed).length;
    percentage = Math.round((completedCount / current.milestones.length) * 100);
  } else if (current.targetValue > 0) {
    const rawVal = current.currentValue - current.startValue;
    const totalTarget = current.targetValue - current.startValue;
    percentage = Math.min(100, Math.max(0, Math.round((rawVal / (totalTarget || 1)) * 100)));
  }

  const todayStr = new Date().toISOString().split("T")[0];
  const loggedToday = Boolean(current.history?.[todayStr] && current.history?.[todayStr] > 0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredList.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredList.length) % featuredList.length);
  };

  const handleQuickAdd = () => {
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    if (current.archetype === "habit") {
      onQuickLog(current, 1, "Completed spotlight ritual check-in");
    } else {
      onQuickLog(current, 1, `Spotlight +1 ${current.unit}`);
    }
  };

  return (
    <div
      id="netflix-billboard-spotlight"
      className="relative rounded-[28px] sm:rounded-[36px] bg-[#06070B]/90 md:bg-[#06070B]/80 backdrop-blur-3xl border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.15)] overflow-hidden transition-all duration-500 group"
    >
      {/* Ambient Cinematic Aura & Starlight Grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        {/* Dynamic Color Spotlight corresponding to current endeavor */}
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-25 transition-all duration-700 pointer-events-none"
          style={{ backgroundColor: current.color || "#10b981" }}
        />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full blur-3xl opacity-15 bg-cyan-500/20" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:18px_18px] opacity-25" />
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        {/* Shimmer light sweep */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent" />
      </div>

      <div className="relative z-10 p-6 sm:p-8 md:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        {/* Left Hero Details */}
        <div className="max-w-2xl space-y-4">
          {/* Billboard Eyebrow & Badges */}
          <div className="flex items-center space-x-2.5 flex-wrap gap-y-1 font-mono">
            <span className="text-[10px] font-bold tracking-widest text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-lg flex items-center space-x-1.5 uppercase shadow-[0_0_12px_rgba(52,211,153,0.2)]">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>SPOTLIGHT HORIZON</span>
            </span>

            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border ${categoryInfo.color}`}>
              {categoryInfo.shortLabel || categoryInfo.label}
            </span>

            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border ${archetypeInfo.badgeBg}`}>
              {archetypeInfo.codename || (current.archetype === "habit" ? "DAILY RITUAL" : current.archetype === "meter" ? "METRIC TELEMETRY" : "STAGED TRAJECTORY")}
            </span>

            {current.streakCount > 0 && (
              <span className="text-[10px] font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2.5 py-1 rounded-lg flex items-center space-x-1 shadow-[0_0_12px_rgba(245,158,11,0.2)]">
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-current animate-pulse" />
                <span>{current.streakCount} Day Streak</span>
              </span>
            )}
          </div>

          {/* Large Title with Stylized Icon Orb */}
          <div className="flex items-start space-x-4">
            <div className="shrink-0 mt-1 cursor-pointer group-hover:scale-105 transition-transform" onClick={() => onOpenDetail(current)}>
              <StylizedIconOrb
                iconName={current.icon}
                color={current.color || "#10b981"}
                size="lg"
                variant="pod"
              />
            </div>
            <div>
              <h2
                onClick={() => onOpenDetail(current)}
                className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-white tracking-tight hover:text-emerald-400 transition-colors cursor-pointer"
              >
                {current.title}
              </h2>
              {current.description && (
                <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 mt-2 leading-relaxed font-sans max-w-xl">
                  {current.description}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons (Netflix Play & Detail style) */}
          <div className="flex items-center space-x-3 pt-2 flex-wrap gap-y-2 font-mono">
            {/* Quick Log / Check In */}
            <button
              onClick={handleQuickAdd}
              className="flex items-center space-x-2 px-5 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-xs uppercase rounded-xl shadow-[0_0_20px_rgba(52,211,153,0.35)] active:scale-95 transition-all cursor-pointer group/btn"
            >
              {current.archetype === "habit" ? (
                <>
                  <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                  <span>{loggedToday ? "Completed Today" : "Check In Ritual (+25 XP)"}</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Log +1 {current.unit}</span>
                </>
              )}
            </button>

            {/* Launch Focus Sprint */}
            <button
              onClick={() => onStartFocus(current)}
              className="flex items-center space-x-2 px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase rounded-xl border border-white/15 active:scale-95 transition cursor-pointer"
              title="Launch deep focus sprint for this endeavor"
            >
              <Timer className="w-4 h-4 text-amber-400" />
              <span>Focus Sprint</span>
            </button>

            {/* Strategy & Milestone Details */}
            <button
              onClick={() => onOpenDetail(current)}
              className="flex items-center space-x-1.5 px-3.5 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold rounded-xl border border-white/10 active:scale-95 transition cursor-pointer"
            >
              <span>Mission Details</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Right Circular Telemetry Ring & Next/Prev Controls */}
        <div className="flex flex-col items-center lg:items-end space-y-4 shrink-0 w-full lg:w-auto">
          <div className="flex items-center space-x-6">
            {/* Circular Progress Display */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-white/10"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  style={{ stroke: current.color || "#10b981" }}
                  strokeWidth="8"
                  strokeDasharray={264}
                  strokeDashoffset={264 - (264 * percentage) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center font-mono">
                <span className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  {percentage}%
                </span>
                <span className="text-[9px] uppercase tracking-wider text-slate-400">
                  {current.archetype === "habit"
                    ? `${current.streakCount}d streak`
                    : `${current.currentValue}/${current.targetValue}`}
                </span>
              </div>
            </div>

            {/* Quick Stats Panel */}
            <div className="font-mono text-xs space-y-2 text-right hidden sm:block">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">ORBIT TARGET</span>
                <span className="font-bold text-white text-sm">
                  {current.currentValue} / {current.targetValue} {current.unit}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">PRIORITY TIER</span>
                <span className="font-bold text-emerald-400 uppercase text-xs">
                  {current.priority} TIER
                </span>
              </div>
            </div>
          </div>

          {/* Multi-title Carousel Navigation (Netflix style) */}
          {featuredList.length > 1 && (
            <div className="flex items-center space-x-2 self-center lg:self-end">
              <button
                onClick={handlePrev}
                className="p-1.5 bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white rounded-lg border border-white/10 active:scale-90 transition cursor-pointer"
                title="Previous spotlight goal"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center space-x-1 px-1">
                {featuredList.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === currentIndex % featuredList.length
                        ? "w-6 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"
                        : "w-2 bg-white/20 hover:bg-white/40"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="p-1.5 bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white rounded-lg border border-white/10 active:scale-90 transition cursor-pointer"
                title="Next spotlight goal"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
