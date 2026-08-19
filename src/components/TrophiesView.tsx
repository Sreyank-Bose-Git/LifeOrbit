import React from "react";
import {
  Trophy,
  Award,
  Flame,
  Zap,
  Star,
  ShieldCheck,
  Crown,
  Sparkles,
  Lock,
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { UserStats, UserProfile, Endeavor } from "../types";
import { THEME_ACCENTS } from "../lib/theme";

interface TrophiesViewProps {
  stats: UserStats;
  profile: UserProfile;
  endeavors: Endeavor[];
}

export const TrophiesView: React.FC<TrophiesViewProps> = ({
  stats,
  profile,
  endeavors,
}) => {
  const currentTheme = THEME_ACCENTS[profile.themeConfig?.accent] || THEME_ACCENTS.emerald;

  // XP & Level calculations
  const currentLevel = stats.level || 1;
  const currentXp = stats.xp || 0;
  const xpIntoCurrentLevel = currentXp % 500;
  const xpRequiredForNextLevel = 500;
  const levelProgressPct = Math.min(100, Math.round((xpIntoCurrentLevel / xpRequiredForNextLevel) * 100));

  // Determine user rank title
  const getRankTitle = (lvl: number) => {
    if (lvl >= 25) return "Cosmic Grandmaster";
    if (lvl >= 15) return "Quantum Voyager";
    if (lvl >= 10) return "Master Navigator";
    if (lvl >= 5) return "Flow Architect";
    if (lvl >= 2) return "Momentum Pioneer";
    return "Orbit Initiate";
  };

  // Best streak
  const bestStreakEver = endeavors.reduce((max, e) => Math.max(max, e.bestStreak || e.streakCount || 0), 0);

  // All unlockable badges catalog
  const achievements = [
    {
      id: "b-first-step",
      name: "First Orbital Step",
      desc: "Complete your first check-in or focus session",
      icon: "🚀",
      unlocked: stats.totalCheckIns >= 1,
      requirement: "1 Check-in",
    },
    {
      id: "b-streak-7",
      name: "7-Day Ignition",
      desc: "Maintain a continuous 7-day streak on any endeavor",
      icon: "🔥",
      unlocked: bestStreakEver >= 7,
      requirement: "7-Day Streak",
    },
    {
      id: "b-century",
      name: "Century Club",
      desc: "Accumulate 100 lifetime activity logs",
      icon: "💯",
      unlocked: stats.totalCheckIns >= 100,
      requirement: "100 Logs",
    },
    {
      id: "b-spartan",
      name: "Focus Spartan",
      desc: "Reach Level 5 through disciplined daily work",
      icon: "⚡",
      unlocked: currentLevel >= 5,
      requirement: "Level 5",
    },
    {
      id: "b-milestone",
      name: "Milestone Crusher",
      desc: "Complete 10 project deliverables or phase milestones",
      icon: "🎯",
      unlocked: (stats.totalMilestonesCompleted || 0) >= 10,
      requirement: "10 Milestones",
    },
    {
      id: "b-zen",
      name: "Deep Flow Master",
      desc: "Unlock Level 10 and master time-blocking",
      icon: "👑",
      unlocked: currentLevel >= 10,
      requirement: "Level 10",
    },
  ];

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="space-y-6">
      {/* Rank & Level Banner */}
      <div className="bg-[#0D0D0D] rounded-3xl p-6 sm:p-8 border border-white/5 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-linear-to-tr from-amber-500/20 to-yellow-500/10 border border-amber-500/30 flex items-center justify-center text-3xl sm:text-4xl shadow-xl shrink-0">
            👑
          </div>
          <div>
            <div className="flex items-center space-x-2 text-amber-400 mb-1">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">{getRankTitle(currentLevel)}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Level {currentLevel} • {profile.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {currentXp} Total XP Earned • {unlockedCount} of {achievements.length} Trophies Unlocked
            </p>
          </div>
        </div>

        {/* Level Progression Card */}
        <div className="w-full md:w-72 bg-[#141414] p-4 rounded-2xl border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300">Level {currentLevel}</span>
            <span className="text-amber-400 font-extrabold font-mono">
              {xpIntoCurrentLevel} / {xpRequiredForNextLevel} XP
            </span>
          </div>
          <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-amber-500 to-yellow-400 transition-all duration-500 rounded-full"
              style={{ width: `${levelProgressPct}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-400 text-right">
            {xpRequiredForNextLevel - xpIntoCurrentLevel} XP until Level {currentLevel + 1}
          </div>
        </div>
      </div>

      {/* High Score Records Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0D0D0D] p-5 rounded-2xl border border-white/5 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-400">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{bestStreakEver} Days</div>
            <div className="text-xs text-slate-400">Personal Best Streak</div>
          </div>
        </div>

        <div className="bg-[#0D0D0D] p-5 rounded-2xl border border-white/5 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{stats.totalCheckIns}</div>
            <div className="text-xs text-slate-400">Lifetime Logs & Check-Ins</div>
          </div>
        </div>

        <div className="bg-[#0D0D0D] p-5 rounded-2xl border border-white/5 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-purple-400">
            <Star className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{unlockedCount} / {achievements.length}</div>
            <div className="text-xs text-slate-400">Trophies Claimed</div>
          </div>
        </div>
      </div>

      {/* Trophy Showcase Grid (YouTube / Gaming Hall of Fame) */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Orbital Trophies & Achievements</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-5 rounded-3xl border transition-all duration-200 flex items-start space-x-4 ${
                achievement.unlocked
                  ? "bg-[#0D0D0D] border-amber-500/30 shadow-lg hover:border-amber-500/50"
                  : "bg-[#0D0D0D]/50 border-white/5 opacity-60"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                  achievement.unlocked
                    ? "bg-amber-500/20 border border-amber-500/40"
                    : "bg-white/5 border border-white/10 grayscale"
                }`}
              >
                {achievement.icon}
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white truncate">
                    {achievement.name}
                  </h4>
                  {achievement.unlocked ? (
                    <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  )}
                </div>
                <p className="text-xs text-slate-400">{achievement.desc}</p>
                <div className="pt-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Requirement: {achievement.requirement}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
