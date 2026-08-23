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
  Orbit,
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
  const levelProgressPct = Math.min(
    100,
    Math.round((xpIntoCurrentLevel / xpRequiredForNextLevel) * 100)
  );

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
  const bestStreakEver = endeavors.reduce(
    (max, e) => Math.max(max, e.bestStreak || e.streakCount || 0),
    0
  );

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
      {/* Rank & Level Banner - Interstellar Hall of Fame */}
      <div className="relative bg-[#06070B]/90 md:bg-[#06070B]/75 backdrop-blur-3xl rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.12)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden">
        {/* Ambient Cosmic Mesh */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full blur-3xl opacity-20 bg-amber-500/30" />
          <div className="absolute top-1/2 -right-20 w-56 h-56 rounded-full blur-3xl opacity-15 bg-yellow-500/20" />
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:18px_18px] opacity-25" />
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />
        </div>

        <div className="relative z-10 flex items-center space-x-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-linear-to-tr from-amber-500/20 to-yellow-500/10 border border-amber-500/40 flex items-center justify-center text-3xl sm:text-4xl shadow-[0_0_25px_rgba(251,191,36,0.3)] shrink-0">
            👑
          </div>
          <div>
            <div className="flex items-center space-x-2 text-amber-400 mb-1 font-mono">
              <Sparkles className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                {getRankTitle(currentLevel)} // SEC-07
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase">
              Level {currentLevel} • {profile.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-normal">
              {currentXp} Total XP Earned • {unlockedCount} of {achievements.length} Trophies Unlocked
            </p>
          </div>
        </div>

        {/* Level Progression Card */}
        <div className="relative z-10 w-full md:w-72 bg-[#06070B] p-4 rounded-2xl border border-white/15 space-y-2 font-mono shadow-[0_0_20px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300">LEVEL {currentLevel}</span>
            <span className="text-amber-400 font-extrabold">
              {xpIntoCurrentLevel} / {xpRequiredForNextLevel} XP
            </span>
          </div>
          <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/5">
            <div
              className="h-full bg-linear-to-r from-amber-500 to-yellow-400 transition-all duration-500 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.8)]"
              style={{ width: `${levelProgressPct}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-400 text-right">
            {xpRequiredForNextLevel - xpIntoCurrentLevel} XP until Level {currentLevel + 1}
          </div>
        </div>
      </div>

      {/* High Score Records Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
        <div className="bg-[#06070B]/85 backdrop-blur-2xl p-5 rounded-[24px] border border-white/10 shadow-[0_0_25px_rgba(0,0,0,0.5)] flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.2)]">
            <Flame className="w-6 h-6 fill-amber-400/20" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{bestStreakEver} Days</div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Personal Best Streak
            </div>
          </div>
        </div>

        <div className="bg-[#06070B]/85 backdrop-blur-2xl p-5 rounded-[24px] border border-white/10 shadow-[0_0_25px_rgba(0,0,0,0.5)] flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.2)]">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{stats.totalCheckIns}</div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Lifetime Check-Ins
            </div>
          </div>
        </div>

        <div className="bg-[#06070B]/85 backdrop-blur-2xl p-5 rounded-[24px] border border-white/10 shadow-[0_0_25px_rgba(0,0,0,0.5)] flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-[0_0_15px_rgba(192,132,252,0.2)]">
            <Star className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">
              {unlockedCount} / {achievements.length}
            </div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Trophies Claimed
            </div>
          </div>
        </div>
      </div>

      {/* Trophy Showcase Grid (YouTube / Gaming Hall of Fame) */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center space-x-2 font-mono">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>ORBITAL TROPHIES & ACHIEVEMENTS</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <motion.div
              key={achievement.id}
              whileHover={{ y: -2 }}
              className={`p-5 rounded-[28px] border transition-all flex items-start space-x-4 ${
                achievement.unlocked
                  ? "bg-[#06070B]/90 backdrop-blur-3xl border-amber-500/30 shadow-[0_0_30px_rgba(251,191,36,0.15)] hover:border-amber-500/50"
                  : "bg-[#06070B]/70 border-white/5 opacity-50"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                  achievement.unlocked
                    ? "bg-amber-500/20 border border-amber-500/40 shadow-[0_0_15px_rgba(251,191,36,0.3)]"
                    : "bg-white/5 border border-white/10 grayscale"
                }`}
              >
                {achievement.icon}
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white truncate">{achievement.name}</h4>
                  {achievement.unlocked ? (
                    <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  )}
                </div>
                <p className="text-xs text-slate-400 font-normal">{achievement.desc}</p>
                <div className="pt-2 text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                  REQ: {achievement.requirement}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
