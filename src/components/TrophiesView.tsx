import React, { useState } from "react";
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
  Key,
  Gift,
  Shield,
  Clock,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { UserStats, UserProfile, Endeavor } from "../types";
import { THEME_ACCENTS } from "../lib/theme";
import { focusAudio } from "../lib/audio";
import confetti from "canvas-confetti";

interface TrophiesViewProps {
  stats: UserStats;
  profile: UserProfile;
  endeavors: Endeavor[];
  onUpdateStats: (newStats: UserStats) => void;
  onOpenLootModal: () => void;
}

export const TrophiesView: React.FC<TrophiesViewProps> = ({
  stats,
  profile,
  endeavors,
  onUpdateStats,
  onOpenLootModal,
}) => {
  const currentTheme = THEME_ACCENTS[profile.themeConfig?.accent] || THEME_ACCENTS.emerald;

  // Level & XP calculation
  const currentLevel = stats.level || 1;
  const currentXp = stats.xp || 0;
  const xpIntoCurrentLevel = currentXp % 500;
  const xpRequiredForNextLevel = 500;
  const levelProgressPct = Math.min(
    100,
    Math.round((xpIntoCurrentLevel / xpRequiredForNextLevel) * 100)
  );

  const crateKeys = stats.crateKeys ?? 0;
  const streakShields = stats.streakShields ?? 0;
  const auraShards = stats.auraShards ?? 0;
  const equippedTitle = stats.equippedTitle || "🚀 Orbit Initiate";
  const unlockedTitles = stats.unlockedTitles || ["🚀 Orbit Initiate"];

  // Best streak
  const bestStreakEver = endeavors.reduce(
    (max, e) => Math.max(max, e.bestStreak || e.streakCount || 0),
    0
  );

  const handleEquipTitle = (title: string) => {
    if (!unlockedTitles.includes(title)) return;
    const updated = { ...stats, equippedTitle: title };
    onUpdateStats(updated);
    focusAudio.playSuccess();
    confetti({ particleCount: 30, spread: 45, origin: { y: 0.6 } });
  };

  const handleActivateShield = (endeavorId?: string) => {
    if (streakShields <= 0) return;
    focusAudio.playShieldActivateSound();
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    const updated = { ...stats, streakShields: streakShields - 1 };
    onUpdateStats(updated);
  };

  // 12 Comprehensive Gamified Achievements Catalog
  const achievements = [
    {
      id: "b-first-step",
      name: "First Orbital Step",
      desc: "Complete your first check-in or focus sprint",
      icon: "🚀",
      tier: "Bronze",
      unlocked: stats.totalCheckIns >= 1,
      requirement: "1 Check-in",
      reward: "+50 XP • Cadet Title",
    },
    {
      id: "b-streak-3",
      name: "Spark of Momentum",
      desc: "Ignite a 3-day continuous streak on any endeavor",
      icon: "⚡",
      tier: "Bronze",
      unlocked: bestStreakEver >= 3,
      requirement: "3-Day Streak",
      reward: "+75 XP • 15 Shards",
    },
    {
      id: "b-streak-7",
      name: "7-Day Ignition",
      desc: "Maintain a continuous 7-day streak on any endeavor",
      icon: "🔥",
      tier: "Silver",
      unlocked: bestStreakEver >= 7,
      requirement: "7-Day Streak",
      reward: "+150 XP • 1 Shield",
    },
    {
      id: "b-streak-21",
      name: "Habit Fortress (21 Days)",
      desc: "Lock in neuroplastic transformation with a 21-day streak",
      icon: "🏰",
      tier: "Gold",
      unlocked: bestStreakEver >= 21,
      requirement: "21-Day Streak",
      reward: "+300 XP • 1 Crate Key",
    },
    {
      id: "b-century",
      name: "Century Club",
      desc: "Accumulate 100 lifetime activity logs",
      icon: "💯",
      tier: "Silver",
      unlocked: stats.totalCheckIns >= 100,
      requirement: "100 Logs",
      reward: "+200 XP • Century Badge",
    },
    {
      id: "b-spartan",
      name: "Focus Spartan",
      desc: "Reach Level 5 through disciplined daily work",
      icon: "⚔️",
      tier: "Silver",
      unlocked: currentLevel >= 5,
      requirement: "Level 5",
      reward: "+250 XP • Spartan Title",
    },
    {
      id: "b-milestone-10",
      name: "Milestone Crusher",
      desc: "Complete 10 project deliverables or phase milestones",
      icon: "🎯",
      tier: "Gold",
      unlocked: (stats.totalMilestonesCompleted || 0) >= 10,
      requirement: "10 Milestones",
      reward: "+350 XP • 1 Key",
    },
    {
      id: "b-zen",
      name: "Deep Flow Architect",
      desc: "Unlock Level 10 and master time-blocking",
      icon: "👑",
      tier: "Gold",
      unlocked: currentLevel >= 10,
      requirement: "Level 10",
      reward: "+500 XP • 2 Keys",
    },
    {
      id: "b-grandmaster",
      name: "Cosmic Grandmaster",
      desc: "Ascend to Level 25 and attain supreme productivity enlightenment",
      icon: "🌌",
      tier: "Diamond",
      unlocked: currentLevel >= 25,
      requirement: "Level 25",
      reward: "+1000 XP • Grandmaster Aura",
    },
    {
      id: "b-pod-collector",
      name: "Vault Explorer",
      desc: "Unlock and claim rewards from at least 3 Cosmic Mystery Pods",
      icon: "🪐",
      tier: "Silver",
      unlocked: (unlockedTitles.length >= 3),
      requirement: "3 Pod Claims",
      reward: "+200 XP • 50 Shards",
    },
    {
      id: "b-unstoppable-30",
      name: "Unstoppable Force (30 Days)",
      desc: "Sustain a flawless 30-day streak on any high priority endeavour",
      icon: "🌋",
      tier: "Diamond",
      unlocked: bestStreakEver >= 30,
      requirement: "30-Day Streak",
      reward: "+750 XP • 2 Keys & Shields",
    },
    {
      id: "b-singularity",
      name: "Singularity Ascendance",
      desc: "Complete 1000+ XP in a single week and forge ultimate momentum",
      icon: "✨",
      tier: "Cosmic",
      unlocked: currentXp >= 1500,
      requirement: "1500+ Lifetime XP",
      reward: "+1500 XP • Cosmic Crown",
    },
  ];

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="space-y-6 font-mono">
      {/* Rank & Level Banner - Interstellar Hall of Fame */}
      <div className="relative bg-[#06070B]/90 backdrop-blur-3xl rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.12)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden">
        {/* Ambient Cosmic Mesh */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full blur-3xl opacity-25 bg-amber-500/30" />
          <div className="absolute top-1/2 -right-20 w-56 h-56 rounded-full blur-3xl opacity-20 bg-purple-500/20" />
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:18px_18px] opacity-25" />
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
        </div>

        <div className="relative z-10 flex items-center space-x-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-linear-to-tr from-amber-500/20 via-yellow-500/15 to-purple-500/10 border-2 border-amber-400/50 flex items-center justify-center text-3xl sm:text-4xl shadow-[0_0_30px_rgba(251,191,36,0.35)] shrink-0 animate-pulse">
            👑
          </div>
          <div>
            <div className="flex items-center space-x-2 text-amber-300 mb-1">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
              <span className="text-xs font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-400/40">
                {equippedTitle}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
              Level {currentLevel} • {profile.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-sans font-normal">
              {currentXp} Lifetime XP • {unlockedCount} of {achievements.length} Achievements Claimed
            </p>
          </div>
        </div>

        {/* Level Progression Card */}
        <div className="relative z-10 w-full md:w-80 bg-[#06070B] p-4.5 rounded-2xl border border-white/15 space-y-2.5 shadow-[0_0_25px_rgba(0,0,0,0.6)]">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold text-slate-200">LEVEL {currentLevel} PROGRESS</span>
            <span className="text-amber-300 font-black">
              {xpIntoCurrentLevel} / {xpRequiredForNextLevel} XP
            </span>
          </div>
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/10">
            <div
              className="h-full bg-linear-to-r from-amber-500 via-yellow-400 to-amber-300 transition-all duration-500 rounded-full shadow-[0_0_12px_rgba(251,191,36,0.9)]"
              style={{ width: `${levelProgressPct}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>{levelProgressPct}% Complete</span>
            <span>{xpRequiredForNextLevel - xpIntoCurrentLevel} XP to Level {currentLevel + 1}</span>
          </div>
        </div>
      </div>

      {/* Gamified Inventory Vault & Title Armory */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Inventory Vault */}
        <div className="lg:col-span-2 bg-[#06070B]/85 backdrop-blur-2xl p-5 sm:p-6 rounded-[28px] border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center space-x-2.5">
              <Gift className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                Cosmic Inventory Vault
              </h3>
            </div>
            <button
              onClick={onOpenLootModal}
              className="py-1.5 px-3.5 rounded-xl bg-linear-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black text-xs font-black uppercase tracking-wider shadow-[0_0_15px_rgba(251,191,36,0.3)] transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <Key className="w-3.5 h-3.5" />
              <span>OPEN PODS ({crateKeys})</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {/* Crate Keys */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center text-center space-y-1">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center text-xl shadow-[0_0_12px_rgba(251,191,36,0.2)]">
                🔑
              </div>
              <div className="text-xl font-black text-white">{crateKeys}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Pod Keys</div>
              <div className="text-[9px] text-amber-300/80">Earn via Bounties</div>
            </div>

            {/* Streak Shields */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center text-center space-y-1">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-xl shadow-[0_0_12px_rgba(34,211,238,0.2)]">
                🛡️
              </div>
              <div className="text-xl font-black text-white">{streakShields}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Streak Shields</div>
              <div className="text-[9px] text-cyan-300/80">Prevents Streak Loss</div>
            </div>

            {/* Aura Shards */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center text-center space-y-1">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-300 flex items-center justify-center text-xl shadow-[0_0_12px_rgba(192,132,252,0.2)]">
                💎
              </div>
              <div className="text-xl font-black text-white">{auraShards}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Aura Shards</div>
              <div className="text-[9px] text-purple-300/80">Forge Keys & Auras</div>
            </div>
          </div>
        </div>

        {/* Title Armory (Equip titles) */}
        <div className="bg-[#06070B]/85 backdrop-blur-2xl p-5 sm:p-6 rounded-[28px] border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center space-x-2.5 pb-3 border-b border-white/10">
              <Crown className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                Title Armory
              </h3>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {unlockedTitles.map((title) => {
                const isEquipped = title === equippedTitle;
                return (
                  <button
                    key={title}
                    onClick={() => handleEquipTitle(title)}
                    className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between text-xs font-bold transition-all cursor-pointer ${
                      isEquipped
                        ? "bg-amber-500/20 border-amber-400/60 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.2)]"
                        : "bg-white/5 border-white/10 text-slate-300 hover:border-white/20"
                    }`}
                  >
                    <span className="truncate">{title}</span>
                    {isEquipped ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-400 text-black font-black uppercase">
                        ACTIVE
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 uppercase">EQUIP</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <p className="text-[10px] text-slate-400 font-sans">
            Unbox rare titles from Cosmic Pods to showcase your status.
          </p>
        </div>
      </div>

      {/* High Score Records Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
              Achievements Claimed
            </div>
          </div>
        </div>
      </div>

      {/* Trophy Showcase Grid */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center space-x-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>ORBITAL TROPHIES & ACHIEVEMENTS CATALOG</span>
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
                <p className="text-xs text-slate-400 font-sans font-normal">{achievement.desc}</p>
                <div className="pt-2 flex items-center justify-between text-[9px] font-bold uppercase tracking-wider">
                  <span className="text-slate-500">REQ: {achievement.requirement}</span>
                  <span className="text-amber-300">{achievement.reward}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
