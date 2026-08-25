import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Layers,
  Orbit,
  Grid3X3,
  Timer,
  Bot,
  Plus,
  Trophy,
  Sliders,
  Flag,
  Calendar,
  BarChart3,
  Sparkles,
  Smartphone,
  X,
  Zap,
  Key,
  ShieldCheck,
  Flame,
} from "lucide-react";
import { ViewTab, UserStats, UserProfile, DeviceInfo } from "../types";
import { THEME_ACCENTS } from "../lib/theme";
import { focusAudio } from "../lib/audio";
import { triggerHaptic } from "../lib/device";

interface MobileBottomNavProps {
  activeTab: ViewTab;
  onNavigateTab: (tab: ViewTab) => void;
  stats: UserStats;
  profile: UserProfile;
  device: DeviceInfo;
  onOpenCreate: () => void;
  onOpenLootModal: () => void;
  onOpenDeviceInspector: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onNavigateTab,
  stats,
  profile,
  device,
  onOpenCreate,
  onOpenLootModal,
  onOpenDeviceInspector,
}) => {
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const currentTheme = THEME_ACCENTS[profile.themeConfig?.accent] || THEME_ACCENTS.emerald;

  const handleTabClick = (tab: ViewTab) => {
    triggerHaptic("light");
    focusAudio.playClick();
    onNavigateTab(tab);
    setIsMoreMenuOpen(false);
    setIsActionSheetOpen(false);
  };

  const handleFabClick = () => {
    triggerHaptic("medium");
    focusAudio.playClick();
    setIsActionSheetOpen((prev) => !prev);
  };

  const mainTabs: { id: ViewTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: "tracker", label: "Goals", icon: Layers },
    { id: "sandbox", label: "Orbit", icon: Orbit },
    { id: "matrix", label: "Blitz", icon: Grid3X3 },
    { id: "focus", label: "Focus", icon: Timer },
    { id: "copilot", label: "Coach", icon: Bot },
  ];

  const moreTabs: { id: ViewTab; label: string; icon: React.FC<{ className?: string }>; badge?: string }[] = [
    { id: "trophies", label: "Trophies & Vault", icon: Trophy, badge: stats.level ? `Lv.${stats.level}` : undefined },
    { id: "roadmap", label: "Milestones Roadmap", icon: Flag },
    { id: "timeline", label: "Schedule & Blocks", icon: Calendar },
    { id: "insights", label: "Telemetry & Stats", icon: BarChart3 },
    { id: "settings", label: "System Config", icon: Sliders },
  ];

  return (
    <>
      {/* Mobile Bottom Navigation Bar Container */}
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 bg-[#06070B]/95 backdrop-blur-2xl border-t border-white/10 shadow-[0_-10px_30px_rgba(0,0,0,0.8)] pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-all font-mono"
      >
        <div className="max-w-md mx-auto px-3 pt-2 flex items-center justify-between relative">
          {/* Main 4 Nav Tabs (2 on left, 2 on right of Center FAB) */}
          {mainTabs.slice(0, 2).map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex-1 flex flex-col items-center justify-center py-1 relative group cursor-pointer transition-all min-h-[48px] ${
                  isActive ? "text-white" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <div
                  className={`p-1.5 rounded-xl transition-all ${
                    isActive
                      ? "bg-white/15 shadow-[0_0_12px_rgba(255,255,255,0.2)]"
                      : "group-hover:bg-white/5"
                  }`}
                  style={isActive ? { color: currentTheme.hex } : undefined}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold mt-0.5 tracking-wider">
                  {tab.label}
                </span>

                {isActive && (
                  <motion.div
                    layoutId="mobileNavActiveDot"
                    className="w-1.5 h-1.5 rounded-full mt-0.5"
                    style={{ backgroundColor: currentTheme.hex }}
                  />
                )}
              </button>
            );
          })}

          {/* Center Ergonomic Floating Action Button (FAB) */}
          <div className="relative -top-3 px-1">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleFabClick}
              className="w-13 h-13 rounded-full flex items-center justify-center text-black shadow-[0_0_25px_rgba(255,255,255,0.4)] border-2 border-white/40 cursor-pointer transition-all"
              style={{
                background: `linear-gradient(135deg, ${currentTheme.hex}, #ffffff)`,
              }}
              aria-label="Quick Actions"
            >
              <Plus
                className={`w-6 h-6 transition-transform duration-300 ${
                  isActionSheetOpen ? "rotate-45" : ""
                }`}
              />
            </motion.button>
          </div>

          {/* Next 2 Tabs */}
          {mainTabs.slice(2, 4).map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex-1 flex flex-col items-center justify-center py-1 relative group cursor-pointer transition-all min-h-[48px] ${
                  isActive ? "text-white" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <div
                  className={`p-1.5 rounded-xl transition-all ${
                    isActive
                      ? "bg-white/15 shadow-[0_0_12px_rgba(255,255,255,0.2)]"
                      : "group-hover:bg-white/5"
                  }`}
                  style={isActive ? { color: currentTheme.hex } : undefined}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold mt-0.5 tracking-wider">
                  {tab.label}
                </span>

                {isActive && (
                  <motion.div
                    layoutId="mobileNavActiveDot"
                    className="w-1.5 h-1.5 rounded-full mt-0.5"
                    style={{ backgroundColor: currentTheme.hex }}
                  />
                )}
              </button>
            );
          })}

          {/* More Menu Trigger Tab */}
          <button
            onClick={() => {
              triggerHaptic("light");
              focusAudio.playClick();
              setIsMoreMenuOpen((prev) => !prev);
              setIsActionSheetOpen(false);
            }}
            className={`flex-1 flex flex-col items-center justify-center py-1 relative group cursor-pointer transition-all min-h-[48px] ${
              isMoreMenuOpen || ["trophies", "roadmap", "timeline", "insights", "settings", "copilot"].includes(activeTab)
                ? "text-white"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <div
              className={`p-1.5 rounded-xl transition-all ${
                isMoreMenuOpen || ["trophies", "roadmap", "timeline", "insights", "settings", "copilot"].includes(activeTab)
                  ? "bg-white/15 shadow-[0_0_12px_rgba(255,255,255,0.2)] text-amber-300"
                  : "group-hover:bg-white/5"
              }`}
            >
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold mt-0.5 tracking-wider">More</span>
          </button>
        </div>
      </nav>

      {/* Floating Center Action Sheet */}
      <AnimatePresence>
        {isActionSheetOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="w-full max-w-md bg-[#06070B] border border-white/15 rounded-[32px] p-5 shadow-[0_0_50px_rgba(0,0,0,0.9)] space-y-4 mb-20 font-mono"
            >
              {/* Drag Handle Indicator */}
              <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto" />

              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold">
                    ⚡
                  </div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">
                    Quick Operations Hub
                  </h3>
                </div>
                <button
                  onClick={() => setIsActionSheetOpen(false)}
                  className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Action Buttons Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => {
                    triggerHaptic("success");
                    onOpenCreate();
                    setIsActionSheetOpen(false);
                  }}
                  className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-400/50 flex flex-col items-start space-y-1.5 text-left cursor-pointer transition-all group"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Plus className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-white">Create Goal</span>
                  <span className="text-[10px] text-slate-400">Habit, Meter or Milestone</span>
                </button>

                <button
                  onClick={() => {
                    triggerHaptic("medium");
                    onOpenLootModal();
                    setIsActionSheetOpen(false);
                  }}
                  className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-400/40 hover:bg-amber-500/20 flex flex-col items-start space-y-1.5 text-left cursor-pointer transition-all group"
                >
                  <div className="w-8 h-8 rounded-xl bg-amber-500/30 text-amber-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                    🪐
                  </div>
                  <span className="text-xs font-bold text-amber-300">Open Pods</span>
                  <span className="text-[10px] text-amber-200/80">{stats.crateKeys || 0} Keys Available</span>
                </button>

                <button
                  onClick={() => {
                    triggerHaptic("light");
                    onNavigateTab("focus");
                    setIsActionSheetOpen(false);
                  }}
                  className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-400/50 flex flex-col items-start space-y-1.5 text-left cursor-pointer transition-all group"
                >
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Timer className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-white">Deep Sprint</span>
                  <span className="text-[10px] text-slate-400">25m Focus Block</span>
                </button>

                <button
                  onClick={() => {
                    triggerHaptic("light");
                    onNavigateTab("copilot");
                    setIsActionSheetOpen(false);
                  }}
                  className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-400/50 flex flex-col items-start space-y-1.5 text-left cursor-pointer transition-all group"
                >
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Bot className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-white">AI Coach</span>
                  <span className="text-[10px] text-slate-400">Ask Copilot</span>
                </button>
              </div>

              {/* Detected Device Footnote */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center space-x-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Catered for {device.deviceLabel}</span>
                </span>
                <button
                  onClick={() => {
                    onOpenDeviceInspector();
                    setIsActionSheetOpen(false);
                  }}
                  className="text-cyan-300 font-bold hover:underline cursor-pointer"
                >
                  Hardware Specs
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* More Navigation Flyout Sheet */}
      <AnimatePresence>
        {isMoreMenuOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="w-full max-w-md bg-[#06070B] border border-white/15 rounded-[32px] p-5 shadow-[0_0_50px_rgba(0,0,0,0.9)] space-y-3 mb-20 font-mono"
            >
              <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto" />

              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <h3 className="text-sm font-black text-white uppercase tracking-wider">
                  Extended Deck
                </h3>
                <button
                  onClick={() => setIsMoreMenuOpen(false)}
                  className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                {moreTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabClick(tab.id)}
                      className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer min-h-[48px] ${
                        isActive
                          ? "bg-white/15 border-white/30 text-white font-bold"
                          : "bg-white/5 border-white/5 text-slate-300 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center bg-white/5"
                          style={isActive ? { color: currentTheme.hex } : undefined}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs">{tab.label}</span>
                      </div>
                      {tab.badge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300">
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Device Inspector Trigger */}
              <button
                onClick={() => {
                  onOpenDeviceInspector();
                  setIsMoreMenuOpen(false);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/30 text-cyan-300 text-xs font-bold flex items-center justify-center space-x-2 cursor-pointer transition-colors"
              >
                <Smartphone className="w-4 h-4" />
                <span>Device Intelligence & Layout Simulator</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
