import React from "react";
import { motion } from "motion/react";
import {
  Sparkles,
  Zap,
  Flame,
  ShieldCheck,
  CheckCircle2,
  Gift,
  Key,
  Clock,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { DailyBounty, UserStats } from "../types";
import { focusAudio } from "../lib/audio";
import confetti from "canvas-confetti";

interface CosmicBountiesWidgetProps {
  stats: UserStats;
  onUpdateStats: (newStats: UserStats) => void;
  onAwardXP: (amount: number, reason: string) => void;
  onOpenLootModal: () => void;
}

export const CosmicBountiesWidget: React.FC<CosmicBountiesWidgetProps> = ({
  stats,
  onUpdateStats,
  onAwardXP,
  onOpenLootModal,
}) => {
  const bounties: DailyBounty[] = stats.dailyBounties || [];
  const crateKeys = stats.crateKeys ?? 0;
  const shields = stats.streakShields ?? 0;

  // Calculate completion
  const completedCount = bounties.filter((b) => b.completed || b.progress >= b.target).length;
  const totalBounties = bounties.length || 3;
  const allCompleted = completedCount >= totalBounties && totalBounties > 0;
  const allClearClaimed = stats.dailyAllClearClaimed ?? false;

  const handleClaimBounty = (bounty: DailyBounty) => {
    if (bounty.claimed || bounty.progress < bounty.target) return;

    focusAudio.playQuestRewardSound();
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });

    onAwardXP(bounty.xpReward, `Claimed Daily Bounty: ${bounty.title}`);

    let updatedStats = { ...stats };
    if (bounty.extraReward === "crateKey") {
      updatedStats.crateKeys = (updatedStats.crateKeys || 0) + (bounty.extraRewardAmount || 1);
    } else if (bounty.extraReward === "shield") {
      updatedStats.streakShields = (updatedStats.streakShields || 0) + (bounty.extraRewardAmount || 1);
    } else if (bounty.extraReward === "shards") {
      updatedStats.auraShards = (updatedStats.auraShards || 0) + (bounty.extraRewardAmount || 20);
    }

    // Mark as claimed
    updatedStats.dailyBounties = bounties.map((b) =>
      b.id === bounty.id ? { ...b, claimed: true, completed: true } : b
    );

    onUpdateStats(updatedStats);
  };

  const handleClaimAllClearBonus = () => {
    if (allClearClaimed || !allCompleted) return;

    focusAudio.playLevelUp();
    confetti({ particleCount: 100, spread: 90, origin: { y: 0.5 } });

    onAwardXP(200, "Completed All 3 Daily Orbital Bounties!");

    const updated = {
      ...stats,
      crateKeys: (stats.crateKeys || 0) + 1,
      streakShields: (stats.streakShields || 0) + 1,
      dailyAllClearClaimed: true,
    };
    onUpdateStats(updated);
  };

  const getBountyIcon = (iconName: string) => {
    switch (iconName) {
      case "Flame":
        return <Flame className="w-4 h-4 text-orange-400" />;
      case "ShieldCheck":
        return <ShieldCheck className="w-4 h-4 text-cyan-400" />;
      default:
        return <Zap className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="relative bg-[#06070B]/85 backdrop-blur-2xl rounded-[28px] border border-white/10 p-5 sm:p-6 shadow-[0_0_35px_rgba(0,0,0,0.6)] overflow-hidden">
      {/* Background Accent Mesh */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-bl from-amber-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.2)]">
            <Zap className="w-5 h-5 fill-amber-400/20" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm sm:text-base font-extrabold text-white tracking-tight uppercase font-mono">
                Daily Orbital Bounties
              </h3>
              <span className="text-[10px] font-black font-mono px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300">
                {completedCount}/{totalBounties} DONE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-normal">
              Execute daily operations to forge Crate Keys & Streak Shields
            </p>
          </div>
        </div>

        {/* Quick Pod Vault launcher pill */}
        <button
          onClick={onOpenLootModal}
          className="flex items-center space-x-2.5 px-3.5 py-2 rounded-xl bg-linear-to-r from-amber-500/20 to-yellow-500/10 hover:from-amber-500/30 hover:to-yellow-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold font-mono transition-all shadow-[0_0_15px_rgba(251,191,36,0.15)] cursor-pointer group shrink-0"
        >
          <Key className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
          <span>VAULT: {crateKeys} KEYS</span>
          <span className="text-slate-500">•</span>
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>{shields} SHIELDS</span>
          <ChevronRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Bounties List */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
        {bounties.map((bounty) => {
          const isReadyToClaim = !bounty.claimed && bounty.progress >= bounty.target;
          const isDone = bounty.claimed;
          const pct = Math.min(100, Math.round((bounty.progress / bounty.target) * 100));

          return (
            <motion.div
              key={bounty.id}
              whileHover={{ y: -2 }}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 font-mono ${
                isDone
                  ? "bg-white/5 border-white/5 opacity-60"
                  : isReadyToClaim
                  ? "bg-amber-500/10 border-amber-400/50 shadow-[0_0_20px_rgba(251,191,36,0.2)]"
                  : "bg-white/5 border-white/10 hover:border-white/20"
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                      {getBountyIcon(bounty.icon)}
                    </div>
                    <span className="text-xs font-bold text-white truncate max-w-[130px]">
                      {bounty.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-amber-400">
                    +{bounty.xpReward} XP
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 font-sans line-clamp-2 leading-relaxed">
                  {bounty.description}
                </p>
              </div>

              {/* Progress and Action Button */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>PROGRESS</span>
                  <span className="text-white font-bold">
                    {bounty.progress} / {bounty.target}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${
                      isDone
                        ? "bg-emerald-400"
                        : isReadyToClaim
                        ? "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]"
                        : "bg-slate-400"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                {/* Claim or Status Pill */}
                {isReadyToClaim ? (
                  <button
                    onClick={() => handleClaimBounty(bounty)}
                    className="w-full py-2 rounded-xl bg-linear-to-r from-amber-500 to-yellow-400 text-black font-black text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(251,191,36,0.4)] hover:brightness-110 transition-all cursor-pointer flex items-center justify-center space-x-1.5 animate-pulse"
                  >
                    <Gift className="w-3.5 h-3.5" />
                    <span>CLAIM REWARD</span>
                  </button>
                ) : isDone ? (
                  <div className="w-full py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-[11px] flex items-center justify-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>CLAIMED</span>
                  </div>
                ) : (
                  <div className="text-[10px] text-slate-400 text-center flex items-center justify-center space-x-1">
                    <span>Reward:</span>
                    <span className="text-amber-300 font-bold">
                      {bounty.extraReward === "crateKey"
                        ? "🔑 +1 Crate Key"
                        : bounty.extraReward === "shield"
                        ? "🛡️ +1 Streak Shield"
                        : "💎 +20 Shards"}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* All-Clear Cosmic Grand Bounty Row */}
      {allCompleted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 p-4 rounded-2xl bg-linear-to-r from-amber-500/20 via-purple-500/15 to-yellow-500/20 border border-amber-400/50 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono shadow-[0_0_30px_rgba(251,191,36,0.25)]"
        >
          <div className="flex items-center space-x-3">
            <span className="text-3xl animate-bounce">👑</span>
            <div>
              <div className="text-xs font-black text-amber-300 uppercase tracking-widest flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>DAILY MASTER ALL-CLEAR BONUS!</span>
              </div>
              <p className="text-[11px] text-slate-300 font-sans">
                You conquered all 3 bounties! +200 XP • +1 Pod Key • +1 Streak Shield
              </p>
            </div>
          </div>

          {!allClearClaimed ? (
            <button
              onClick={handleClaimAllClearBonus}
              className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-linear-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-extrabold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(251,191,36,0.5)] transition-all cursor-pointer shrink-0 flex items-center justify-center space-x-2"
            >
              <Gift className="w-4 h-4" />
              <span>CLAIM ALL-CLEAR CHEST</span>
            </button>
          ) : (
            <div className="flex items-center space-x-1.5 text-emerald-400 text-xs font-bold px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30">
              <CheckCircle2 className="w-4 h-4" />
              <span>ALL-CLEAR CLAIMED TODAY</span>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};
