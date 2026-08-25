import React from "react";
import {
  Orbit,
  Zap,
  Flame,
  Search,
  Sliders,
  Cpu,
  Menu,
  Sparkles,
} from "lucide-react";
import { ViewTab, UserStats, UserProfile, DeviceInfo } from "../types";
import { THEME_ACCENTS } from "../lib/theme";
import { focusAudio } from "../lib/audio";
import { triggerHaptic } from "../lib/device";

interface MobileTopHeaderProps {
  activeTab: ViewTab;
  stats: UserStats;
  profile: UserProfile;
  device: DeviceInfo;
  onOpenCommandPalette: () => void;
  onOpenProfileHub: () => void;
  onOpenDeviceInspector: () => void;
  onOpenLootModal: () => void;
  onToggleSidebar?: () => void;
}

export const MobileTopHeader: React.FC<MobileTopHeaderProps> = ({
  activeTab,
  stats,
  profile,
  device,
  onOpenCommandPalette,
  onOpenProfileHub,
  onOpenDeviceInspector,
  onOpenLootModal,
  onToggleSidebar,
}) => {
  const currentTheme = THEME_ACCENTS[profile.themeConfig?.accent] || THEME_ACCENTS.emerald;

  return (
    <header className="sm:hidden sticky top-0 z-30 bg-[#06070B]/90 backdrop-blur-2xl border-b border-white/10 px-3.5 py-2.5 flex items-center justify-between font-mono pt-[max(0.6rem,env(safe-area-inset-top))] select-none">
      {/* Brand / Profile Avatar */}
      <div className="flex items-center space-x-2.5 min-w-0">
        <button
          onClick={() => {
            triggerHaptic("light");
            onOpenProfileHub();
          }}
          className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-base hover:scale-105 active:scale-95 transition-transform cursor-pointer shrink-0"
          title="Switch Workspace Profile"
        >
          <span>{profile.avatarIcon || "🚀"}</span>
        </button>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center space-x-1.5">
            <span className="text-xs font-black text-white truncate max-w-[110px]">
              {profile.themeConfig?.customAppTitle || "LifeOrbit"}
            </span>
            <button
              onClick={() => {
                triggerHaptic("light");
                onOpenDeviceInspector();
              }}
              className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-400/30 flex items-center space-x-0.5 cursor-pointer"
              title="Detected Device"
            >
              <span>{device.deviceEmoji}</span>
              <span className="truncate max-w-[50px]">{device.effectiveFormFactor}</span>
            </button>
          </div>
          <span className="text-[10px] text-slate-400 font-medium truncate">
            {profile.name || "Captain"}
          </span>
        </div>
      </div>

      {/* Right-Side Telemetry & Action Buttons */}
      <div className="flex items-center space-x-2 shrink-0">
        {/* XP / Streak Pill */}
        <button
          onClick={() => {
            triggerHaptic("light");
            onOpenLootModal();
          }}
          className="flex items-center space-x-1 px-2 py-1 rounded-xl bg-amber-500/15 border border-amber-400/40 text-amber-300 text-[10px] font-black cursor-pointer active:scale-95 transition"
        >
          <Zap className="w-3 h-3 text-amber-400" />
          <span>Lv.{stats.level || 1}</span>
          <span className="text-white/40">•</span>
          <span>🪐{stats.crateKeys || 0}</span>
        </button>

        {/* Quick Search trigger */}
        <button
          onClick={() => {
            triggerHaptic("light");
            onOpenCommandPalette();
          }}
          className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 active:scale-95 transition-transform cursor-pointer"
          title="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Sidebar Drawer Hamburger */}
        {onToggleSidebar && (
          <button
            onClick={() => {
              triggerHaptic("light");
              onToggleSidebar();
            }}
            className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 active:scale-95 transition-transform cursor-pointer"
            title="Menu"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
};
