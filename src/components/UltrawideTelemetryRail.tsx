import React from "react";
import { motion } from "motion/react";
import {
  Zap,
  Flame,
  Key,
  ShieldCheck,
  Trophy,
  Sparkles,
  Timer,
  ChevronRight,
  TrendingUp,
  Cpu,
} from "lucide-react";
import { UserStats, UserProfile, Endeavor, DeviceInfo } from "../types";
import { THEME_ACCENTS } from "../lib/theme";
import { focusAudio } from "../lib/audio";

interface UltrawideTelemetryRailProps {
  stats: UserStats;
  profile: UserProfile;
  endeavors: Endeavor[];
  device: DeviceInfo;
  onOpenLootModal: () => void;
  onOpenDeviceInspector: () => void;
}

export const UltrawideTelemetryRail: React.FC<UltrawideTelemetryRailProps> = ({
  stats,
  profile,
  endeavors,
  device,
  onOpenLootModal,
  onOpenDeviceInspector,
}) => {
  const currentTheme = THEME_ACCENTS[profile.themeConfig?.accent] || THEME_ACCENTS.emerald;
  const crateKeys = stats.crateKeys || 0;
  const streakShields = stats.streakShields || 0;
  const shards = stats.auraShards || 0;
  const level = stats.level || 1;
  const xp = stats.xp || 0;

  const activeEndeavors = endeavors.filter((e) => e.status === "active");
  const totalStreaks = activeEndeavors.reduce((acc, e) => acc + (e.streakCount || 0), 0);

  return (
    <aside
      aria-label="Ultrawide Telemetry Cockpit"
      className="hidden 2xl:flex flex-col w-80 shrink-0 sticky top-4 h-[calc(100vh-2rem)] bg-[#06070B]/90 backdrop-blur-3xl border border-white/10 rounded-[32px] p-5 shadow-[0_0_50px_rgba(0,0,0,0.85)] font-mono space-y-4 overflow-y-auto"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.3)]">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider">
              Telemetry Cockpit
            </h4>
            <span className="text-[10px] text-cyan-300">Ultrawide Layout</span>
          </div>
        </div>

        <button
          onClick={onOpenDeviceInspector}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          title="Hardware Specs & Device Settings"
        >
          <span className="text-xs">{device.deviceEmoji}</span>
        </button>
      </div>

      {/* Level & Starlight Radar */}
      <div className="p-4 rounded-2xl bg-linear-to-b from-amber-500/10 to-transparent border border-amber-400/30 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-amber-300 font-black">LEVEL {level}</span>
          <span className="text-slate-400 text-[10px]">{xp % 500} / 500 XP</span>
        </div>
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-amber-500 to-yellow-300 rounded-full transition-all"
            style={{ width: `${Math.min(100, Math.round(((xp % 500) / 500) * 100))}%` }}
          />
        </div>
        <div className="text-[10px] text-slate-400 truncate">
          Title: <span className="text-white font-bold">{stats.equippedTitle || "🚀 Orbit Initiate"}</span>
        </div>
      </div>

      {/* Mystery Pod Quick Opener */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg">🪐</span>
            <span className="text-xs font-bold text-white uppercase">Vault Pods</span>
          </div>
          <span className="text-xs font-bold text-amber-300 font-mono">
            {crateKeys} Keys
          </span>
        </div>

        <button
          onClick={onOpenLootModal}
          className="w-full py-2.5 px-3 rounded-xl bg-linear-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(251,191,36,0.3)] cursor-pointer flex items-center justify-center space-x-1.5"
        >
          <Key className="w-3.5 h-3.5" />
          <span>OPEN POD</span>
        </button>
      </div>

      {/* Live Orbit Vital Stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center space-x-1.5 text-cyan-400 text-[10px] font-bold">
            <ShieldCheck className="w-3 h-3" />
            <span>SHIELDS</span>
          </div>
          <div className="text-base font-black text-white mt-1">{streakShields}</div>
        </div>

        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center space-x-1.5 text-purple-400 text-[10px] font-bold">
            <span>💎</span>
            <span>SHARDS</span>
          </div>
          <div className="text-base font-black text-white mt-1">{shards}</div>
        </div>

        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center space-x-1.5 text-orange-400 text-[10px] font-bold">
            <Flame className="w-3 h-3" />
            <span>STREAKS</span>
          </div>
          <div className="text-base font-black text-white mt-1">{totalStreaks}d</div>
        </div>

        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center space-x-1.5 text-emerald-400 text-[10px] font-bold">
            <Zap className="w-3 h-3" />
            <span>ACTIVE</span>
          </div>
          <div className="text-base font-black text-white mt-1">{activeEndeavors.length}</div>
        </div>
      </div>

      {/* Active Daily Bounties Mini Feed */}
      <div className="space-y-2 pt-2 border-t border-white/10">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>Active Bounties</span>
          <span className="text-amber-300">
            {stats.dailyBounties?.filter((b) => b.completed || b.claimed).length || 0}/3
          </span>
        </div>

        <div className="space-y-1.5">
          {stats.dailyBounties?.map((bounty) => (
            <div
              key={bounty.id}
              className={`p-2 rounded-xl border text-[10px] flex items-center justify-between ${
                bounty.claimed
                  ? "bg-emerald-500/10 border-emerald-500/30 text-slate-400"
                  : bounty.progress >= bounty.target
                  ? "bg-amber-500/15 border-amber-400/50 text-amber-200"
                  : "bg-white/5 border-white/5 text-slate-300"
              }`}
            >
              <span className="truncate max-w-[170px]">{bounty.title}</span>
              <span className="font-bold shrink-0">
                {bounty.progress}/{bounty.target}
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};
