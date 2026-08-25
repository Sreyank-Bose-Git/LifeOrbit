import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Sparkles,
  Key,
  ShieldCheck,
  Zap,
  Flame,
  Award,
  Crown,
  CheckCircle2,
  RefreshCw,
  Gift,
  Lock,
} from "lucide-react";
import { UserStats, LootCratePrize } from "../types";
import { LOOT_CRATE_POOL } from "../lib/storage";
import { focusAudio } from "../lib/audio";
import confetti from "canvas-confetti";

interface LootCrateModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: UserStats;
  onUpdateStats: (newStats: UserStats) => void;
  onAwardXP: (amount: number, reason: string) => void;
}

export const LootCrateModal: React.FC<LootCrateModalProps> = ({
  isOpen,
  onClose,
  stats,
  onUpdateStats,
  onAwardXP,
}) => {
  const [openingState, setOpeningState] = useState<"idle" | "charging" | "revealed">("idle");
  const [revealedPrize, setRevealedPrize] = useState<LootCratePrize | null>(null);

  if (!isOpen) return null;

  const crateKeys = stats.crateKeys ?? 0;
  const shards = stats.auraShards ?? 0;

  const handleOpenPod = () => {
    if (crateKeys <= 0) return;
    if (openingState !== "idle") return;

    // Deduct 1 key
    const nextStats = { ...stats, crateKeys: crateKeys - 1 };
    onUpdateStats(nextStats);

    setOpeningState("charging");
    focusAudio.playLootOpenSound();

    // Pick a prize with weighted probabilities
    setTimeout(() => {
      const roll = Math.random();
      let pool = LOOT_CRATE_POOL;
      let selected: LootCratePrize;

      if (roll < 0.15) {
        // Legendary
        const legendaries = pool.filter((p) => p.rarity === "legendary");
        selected = legendaries[Math.floor(Math.random() * legendaries.length)] || pool[0];
      } else if (roll < 0.45) {
        // Epic
        const epics = pool.filter((p) => p.rarity === "epic");
        selected = epics[Math.floor(Math.random() * epics.length)] || pool[1];
      } else if (roll < 0.75) {
        // Rare
        const rares = pool.filter((p) => p.rarity === "rare");
        selected = rares[Math.floor(Math.random() * rares.length)] || pool[3];
      } else {
        // Common
        const commons = pool.filter((p) => p.rarity === "common");
        selected = commons[Math.floor(Math.random() * commons.length)] || pool[pool.length - 1];
      }

      setRevealedPrize(selected);
      setOpeningState("revealed");

      // Grand celebration
      confetti({
        particleCount: selected.rarity === "legendary" ? 120 : selected.rarity === "epic" ? 80 : 50,
        spread: 80,
        origin: { y: 0.5 },
      });

      // Apply prize to stats
      applyPrize(selected, nextStats);
    }, 1400);
  };

  const applyPrize = (prize: LootCratePrize, currentStats: UserStats) => {
    let updated = { ...currentStats };
    if (prize.type === "title") {
      const titles = updated.unlockedTitles || [];
      if (!titles.includes(prize.value)) {
        updated.unlockedTitles = [...titles, prize.value];
        updated.equippedTitle = prize.value;
      }
    } else if (prize.type === "shield") {
      updated.streakShields = (updated.streakShields || 0) + (prize.value || 1);
    } else if (prize.type === "xpBoost") {
      updated.activeXpBoostMultiplier = prize.value || 2.0;
      const expireTime = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
      updated.xpBoostExpiresAt = expireTime;
    } else if (prize.type === "xpBonus") {
      if (prize.id.includes("shards")) {
        updated.auraShards = (updated.auraShards || 0) + (prize.value || 250);
      } else {
        onAwardXP(prize.value || 300, `Unlocked ${prize.name}!`);
      }
    }
    onUpdateStats(updated);
  };

  const handleCraftKeyWithShards = () => {
    if (shards < 100) return;
    const updated = {
      ...stats,
      auraShards: shards - 100,
      crateKeys: crateKeys + 1,
    };
    onUpdateStats(updated);
    focusAudio.playQuestRewardSound();
  };

  const handleResetModal = () => {
    setOpeningState("idle");
    setRevealedPrize(null);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return {
          border: "border-amber-400/80 shadow-[0_0_40px_rgba(251,191,36,0.6)]",
          badge: "bg-amber-500/20 text-amber-300 border-amber-400/60",
          glow: "from-amber-500/30 to-yellow-500/10",
        };
      case "epic":
        return {
          border: "border-purple-400/80 shadow-[0_0_40px_rgba(192,132,252,0.6)]",
          badge: "bg-purple-500/20 text-purple-300 border-purple-400/60",
          glow: "from-purple-500/30 to-pink-500/10",
        };
      case "rare":
        return {
          border: "border-cyan-400/80 shadow-[0_0_40px_rgba(34,211,238,0.6)]",
          badge: "bg-cyan-500/20 text-cyan-300 border-cyan-400/60",
          glow: "from-cyan-500/30 to-blue-500/10",
        };
      default:
        return {
          border: "border-emerald-400/80 shadow-[0_0_40px_rgba(52,211,153,0.6)]",
          badge: "bg-emerald-500/20 text-emerald-300 border-emerald-400/60",
          glow: "from-emerald-500/30 to-teal-500/10",
        };
    }
  };

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-lg bg-[#06070B] border border-white/15 rounded-[32px] p-6 sm:p-8 shadow-[0_0_60px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.15)] overflow-hidden"
      >
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 -left-20 w-80 h-80 rounded-full blur-3xl opacity-25 bg-amber-500/30 pointer-events-none" />
        <div className="absolute top-1/2 -right-20 w-60 h-60 rounded-full blur-3xl opacity-20 bg-purple-500/30 pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.3)]">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
                <span>Cosmic Mystery Pod</span>
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Unlock Legendary Titles, Streak Shields & XP Frenzies
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Currency status banner */}
        <div className="relative z-10 grid grid-cols-2 gap-3 my-5 font-mono">
          <div className="flex items-center space-x-3 p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">{crateKeys} Keys</div>
              <div className="text-[10px] text-slate-400 uppercase">Available Pods</div>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold">
              💎
            </div>
            <div>
              <div className="text-sm font-bold text-white">{shards} Shards</div>
              <div className="text-[10px] text-slate-400 uppercase">Aura Balance</div>
            </div>
          </div>
        </div>

        {/* Main interactive pod chamber */}
        <div className="relative z-10 my-6 py-6 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {openingState === "idle" && (
              <motion.div
                key="idle"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="flex flex-col items-center text-center space-y-4"
              >
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleOpenPod}
                  className={`w-36 h-36 rounded-3xl bg-linear-to-b from-amber-500/20 via-purple-500/20 to-black/60 border-2 border-amber-400/60 shadow-[0_0_40px_rgba(251,191,36,0.35)] flex flex-col items-center justify-center cursor-pointer transition-all hover:border-amber-400 relative overflow-hidden group ${
                    crateKeys <= 0 ? "opacity-60 grayscale cursor-not-allowed" : ""
                  }`}
                >
                  <div className="absolute inset-0 bg-radial from-amber-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="text-5xl drop-shadow-[0_0_20px_rgba(251,191,36,0.8)]">🪐</span>
                  <span className="text-[10px] font-mono font-bold text-amber-300 uppercase mt-2 tracking-widest">
                    TAP TO UNBOX
                  </span>
                </motion.div>

                {crateKeys > 0 ? (
                  <button
                    onClick={handleOpenPod}
                    className="w-full py-3.5 px-6 rounded-2xl bg-linear-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-extrabold font-mono text-sm tracking-wider shadow-[0_0_25px_rgba(251,191,36,0.4)] transition-all cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <Key className="w-4 h-4" />
                    <span>OPEN POD (1 KEY)</span>
                  </button>
                ) : (
                  <div className="w-full space-y-2">
                    <button
                      onClick={handleCraftKeyWithShards}
                      disabled={shards < 100}
                      className={`w-full py-3 px-4 rounded-2xl border font-mono text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
                        shards >= 100
                          ? "bg-cyan-500/20 border-cyan-400/60 text-cyan-300 hover:bg-cyan-500/30 cursor-pointer shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                          : "bg-white/5 border-white/10 text-slate-500 cursor-not-allowed"
                      }`}
                    >
                      <span>⚡ Forge 1 Key with 100 Shards</span>
                    </button>
                    <p className="text-[11px] text-slate-400 font-mono text-center">
                      Complete daily bounties & level up to earn free keys!
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {openingState === "charging" && (
              <motion.div
                key="charging"
                initial={{ scale: 0.9 }}
                animate={{
                  scale: [1, 1.15, 1, 1.2],
                  rotate: [-3, 3, -4, 4, 0],
                }}
                transition={{ duration: 1.4, ease: "easeInOut" }}
                className="w-36 h-36 rounded-3xl bg-linear-to-b from-amber-400/40 via-purple-500/40 to-yellow-400/30 border-2 border-amber-300 shadow-[0_0_60px_rgba(251,191,36,0.9)] flex flex-col items-center justify-center relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 animate-ping rounded-3xl" />
                <span className="text-5xl animate-bounce">⚡</span>
                <span className="text-[10px] font-mono font-bold text-white uppercase tracking-widest mt-2 animate-pulse">
                  RESONATING...
                </span>
              </motion.div>
            )}

            {openingState === "revealed" && revealedPrize && (
              <motion.div
                key="revealed"
                initial={{ scale: 0.7, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="w-full flex flex-col items-center text-center space-y-4"
              >
                {/* Prize Showcase Card */}
                <div
                  className={`w-full p-6 rounded-3xl bg-linear-to-b ${
                    getRarityColor(revealedPrize.rarity).glow
                  } border-2 ${
                    getRarityColor(revealedPrize.rarity).border
                  } flex flex-col items-center space-y-3 relative overflow-hidden`}
                >
                  <div className="text-6xl drop-shadow-[0_0_25px_rgba(255,255,255,0.8)] animate-bounce">
                    {revealedPrize.icon}
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-mono font-extrabold uppercase tracking-widest border ${
                      getRarityColor(revealedPrize.rarity).badge
                    }`}
                  >
                    {revealedPrize.rarity} REWARD
                  </span>

                  <h3 className="text-xl font-black text-white tracking-tight">
                    {revealedPrize.name}
                  </h3>

                  <p className="text-xs text-slate-300 font-medium max-w-xs">
                    {revealedPrize.description}
                  </p>

                  <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-mono font-bold pt-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>EQUIPPED & ADDED TO INVENTORY</span>
                  </div>
                </div>

                <div className="w-full flex items-center space-x-3 pt-2">
                  {crateKeys > 0 ? (
                    <button
                      onClick={handleResetModal}
                      className="flex-1 py-3.5 rounded-2xl bg-linear-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-extrabold font-mono text-xs tracking-wider shadow-[0_0_20px_rgba(251,191,36,0.3)] transition-all cursor-pointer flex items-center justify-center space-x-2"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>OPEN ANOTHER ({crateKeys} LEFT)</span>
                    </button>
                  ) : (
                    <button
                      onClick={onClose}
                      className="flex-1 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-extrabold font-mono text-xs tracking-wider transition-all cursor-pointer"
                    >
                      CLOSE & CONTINUE
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Available Loot Table teaser */}
        {openingState === "idle" && (
          <div className="relative z-10 pt-4 border-t border-white/10">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-2">
              Potential Pod Discoveries:
            </h4>
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-400/30 text-amber-300 text-[10px] font-mono font-bold">
                👑 Legendary Titles
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-400/30 text-purple-300 text-[10px] font-mono font-bold">
                ⚡ 2.0x XP Boosters
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-[10px] font-mono font-bold">
                🛡️ Streak Shields
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-[10px] font-mono font-bold">
                💎 Aura Shards
              </span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
