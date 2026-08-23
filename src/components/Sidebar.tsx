import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Layers,
  Calendar,
  Timer,
  BarChart3,
  Bot,
  Sliders,
  Plus,
  Zap,
  Download,
  Wand2,
  ChevronLeft,
  ChevronRight,
  Flame,
  Search,
  Users,
  Flag,
  Trophy,
  Grid3X3,
  Orbit,
  Sparkles,
} from "lucide-react";
import { ViewTab, UserStats, UserProfile } from "../types";
import { THEME_ACCENTS } from "../lib/theme";
import { focusAudio } from "../lib/audio";
import { FirebaseUser } from "../lib/firebase";

interface SidebarProps {
  activeTab: ViewTab;
  setActiveTab: (tab: ViewTab) => void;
  stats: UserStats;
  profile: UserProfile;
  isOpen: boolean;
  onToggleOpen: () => void;
  onOpenCreate: () => void;
  onOpenBackup: () => void;
  onOpenIntegrations: () => void;
  onOpenSetupWizard: () => void;
  onOpenCommandPalette?: () => void;
  onOpenProfileHub?: () => void;
  onReplayIntroLogo?: () => void;
  currentUser?: FirebaseUser | null;
  onSignOut?: () => void;
  onSignIn?: () => void;
}

interface NavSection {
  title: string;
  items: {
    id: ViewTab;
    label: string;
    shortLabel: string;
    icon: React.FC<{ className?: string }>;
    badge?: string;
  }[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  stats,
  profile,
  isOpen,
  onToggleOpen,
  onOpenCreate,
  onOpenBackup,
  onOpenIntegrations,
  onOpenSetupWizard,
  onOpenCommandPalette,
  onOpenProfileHub,
  onReplayIntroLogo,
  currentUser,
  onSignOut,
  onSignIn,
}) => {
  const currentTheme = THEME_ACCENTS[profile.themeConfig?.accent] || THEME_ACCENTS.emerald;
  const [hoveredTab, setHoveredTab] = useState<ViewTab | null>(null);

  const navSections: NavSection[] = [
    {
      title: "Core Flight Deck",
      items: [
        { id: "tracker", label: "Endeavors & Goals", shortLabel: "Goals", icon: Layers },
        { id: "sandbox", label: "Cosmic Sandbox", shortLabel: "Sandbox", icon: Orbit, badge: "CANVAS" },
        { id: "matrix", label: "Habit Matrix", shortLabel: "Habits", icon: Grid3X3 },
        { id: "roadmap", label: "Milestone Roadmap", shortLabel: "Roadmap", icon: Flag },
        { id: "timeline", label: "Schedule & Blocks", shortLabel: "Schedule", icon: Calendar },
      ],
    },
    {
      title: "Hyperion Lab",
      items: [
        { id: "focus", label: "Deep Focus Sprint", shortLabel: "Focus", icon: Timer },
        { id: "insights", label: "Telemetry & Stats", shortLabel: "Analytics", icon: BarChart3 },
        { id: "trophies", label: "Trophies & Starlight", shortLabel: "Trophies", icon: Trophy, badge: stats?.level ? `Lv.${stats.level}` : undefined },
      ],
    },
    {
      title: "Neural Deck",
      items: [
        { id: "copilot", label: "AI Cosmic Coach", shortLabel: "Coach", icon: Bot, badge: "AI" },
        { id: "settings", label: "System Config", shortLabel: "Config", icon: Sliders },
      ],
    },
  ];

  const handleNavClick = (tabId: ViewTab) => {
    focusAudio.playClick();
    setActiveTab(tabId);
    if (window.innerWidth < 768 && isOpen) {
      onToggleOpen();
    }
  };

  const handleBrandClick = () => {
    if (onReplayIntroLogo) {
      onReplayIntroLogo();
    } else {
      setActiveTab("tracker");
    }
  };

  // Calculate XP Level progress
  const currentXP = stats?.xp || 0;
  const levelFloor = ((stats?.level || 1) - 1) * 250;
  const nextLevelXP = (stats?.level || 1) * 250;
  const progressRatio = Math.min(
    100,
    Math.max(8, Math.round(((currentXP - levelFloor) / (nextLevelXP - levelFloor || 250)) * 100))
  );

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          onClick={onToggleOpen}
          className="md:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-xs transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Main Left Sidebar with Interstellar Styling */}
      <motion.aside
        id="app-left-sidebar"
        layout
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed md:relative top-2 md:top-0 left-2 md:left-0 z-40 h-[calc(100vh-16px)] md:h-full bg-[#06070B]/95 md:bg-[#06070B]/75 backdrop-blur-3xl rounded-2xl md:rounded-[32px] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.12)] flex flex-col justify-between shrink-0 overflow-hidden ${
          isOpen
            ? "w-[268px] translate-x-0"
            : "w-[268px] -translate-x-full md:translate-x-0 md:w-[76px]"
        }`}
      >
        {/* Interstellar Cosmic Backdrop Mesh & Ambient Stars */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          {/* Stellar nebula glow nodes */}
          <div
            className="absolute -top-12 -left-12 w-48 h-48 rounded-full blur-3xl opacity-20 transition-all duration-700"
            style={{ backgroundColor: currentTheme.primaryHex }}
          />
          <div className="absolute top-1/3 -right-20 w-44 h-44 rounded-full blur-3xl opacity-15 bg-cyan-500/20" />
          <div className="absolute -bottom-16 -left-10 w-52 h-52 rounded-full blur-3xl opacity-15 bg-indigo-600/20" />
          
          {/* Subtle cosmic starlight micro-grid */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:18px_18px] opacity-30" />
          
          {/* Orbital starlight shimmer line on right edge */}
          <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-white/10 to-transparent" />
        </div>

        {/* Top Header & Cosmic Orbital Station Branding */}
        <div className="relative z-10 p-3.5 border-b border-white/5 bg-white/[0.01]">
          <div className="flex items-center justify-between">
            <div
              onClick={handleBrandClick}
              className={`flex items-center cursor-pointer group ${
                isOpen ? "space-x-3" : "justify-center w-full"
              }`}
              title="LifeOrbit OS • Click to replay cinematic entry"
            >
              {/* Gyroscopic Orbital Icon */}
              <div className="relative flex items-center justify-center shrink-0">
                <div
                  className={`w-9 h-9 rounded-xl ${currentTheme.buttonBg} ${currentTheme.buttonText} flex items-center justify-center shadow-lg relative z-10 group-hover:scale-105 group-hover:rotate-180 transition-all duration-700 ease-out`}
                >
                  <Orbit className="w-5 h-5 stroke-[2.2]" />
                </div>
                {/* Glowing orbital pulse ring */}
                <span
                  className="absolute inset-0 rounded-xl blur-sm opacity-50 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ backgroundColor: currentTheme.primaryHex }}
                />
              </div>

              {isOpen && (
                <div className="min-w-0 transition-opacity duration-200">
                  <div className="flex items-center space-x-1.5">
                    <h1 className="font-bold text-white text-sm tracking-tight truncate uppercase">
                      {profile.themeConfig?.customAppTitle || "LifeOrbit OS"}
                    </h1>
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <div className="flex items-center space-x-1 mt-0.5">
                    <span className={`text-[8px] uppercase tracking-wider font-mono font-bold px-1.5 py-0.2 rounded ${currentTheme.badgeBg}`}>
                      {profile.role ? profile.role.split(" ")[0] : "Command"}
                    </span>
                    <span className="text-[9px] font-mono text-slate-500">
                      // SEC-09
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Toggle Collapse Button (Desktop & Mobile) */}
            {isOpen ? (
              <button
                id="toggle-sidebar-button"
                onClick={() => {
                  focusAudio.playClick();
                  onToggleOpen();
                }}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 active:scale-90 rounded-xl border border-white/5 cursor-pointer transition-all duration-150 relative z-0 hover:z-10 group"
                title="Collapse sidebar"
                aria-label="Collapse sidebar"
              >
                <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              </button>
            ) : (
              <button
                id="toggle-sidebar-expand-btn"
                onClick={() => {
                  focusAudio.playClick();
                  onToggleOpen();
                }}
                className="hidden md:flex p-1.5 text-slate-400 hover:text-white hover:bg-white/10 active:scale-90 rounded-lg cursor-pointer transition-all duration-150 mt-1 mx-auto relative z-0 hover:z-10 group"
                title="Expand sidebar"
                aria-label="Expand sidebar"
              >
                <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
            )}
          </div>
        </div>

        {/* Primary Action Button (Launch Goal) & Cosmic Search */}
        <div className="relative z-10 p-2.5 space-y-1.5">
          <motion.button
            id="sidebar-new-goal-button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              focusAudio.playClick();
              onOpenCreate();
            }}
            className={`w-full flex items-center justify-center rounded-xl font-bold text-xs ${currentTheme.buttonBg} ${currentTheme.buttonHover} ${currentTheme.buttonText} shadow-md hover:shadow-lg cursor-pointer transition-all duration-200 relative group overflow-hidden ${
              isOpen ? "py-2.5 px-3 space-x-2" : "py-2.5 px-0"
            }`}
            title="Create New Goal or Endeavor"
          >
            {/* Shimmer light pass */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
            <Plus className="w-4 h-4 stroke-[2.5] shrink-0" />
            {isOpen && <span>New Goal</span>}
          </motion.button>

          {onOpenCommandPalette && (
            <motion.button
              id="sidebar-cmd-palette-btn"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                focusAudio.playClick();
                onOpenCommandPalette();
              }}
              className={`w-full flex items-center rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-white/15 cursor-pointer transition-all duration-150 ${
                isOpen ? "py-1.5 px-3 justify-between" : "py-1.5 px-0 justify-center"
              }`}
              title="Open Command Palette (Cmd+K)"
            >
              <div className="flex items-center space-x-2">
                <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                {isOpen && <span className="text-[11px]">Command Hub</span>}
              </div>
              {isOpen && (
                <span className="font-mono text-[9px] bg-black/50 text-slate-400 px-1.5 py-0.5 rounded border border-white/10 font-bold">
                  ⌘K
                </span>
              )}
            </motion.button>
          )}
        </div>

        {/* Categorized Interstellar Navigation Links */}
        <nav className="relative z-10 flex-1 px-2.5 py-1 space-y-3 overflow-y-auto scrollbar-none">
          {navSections.map((section, idx) => (
            <div key={section.title} className="space-y-1">
              {/* Section Header */}
              {isOpen && (
                <div className="px-2 py-0.5 flex items-center justify-between text-[9px] font-mono tracking-widest text-slate-500 uppercase">
                  <span>{section.title}</span>
                  <span className="text-white/20">0{idx + 1}</span>
                </div>
              )}

              {/* Items */}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isSelected = activeTab === item.id;
                  const isHovered = hoveredTab === item.id;

                  return (
                    <button
                      key={item.id}
                      id={`nav-item-${item.id}`}
                      onClick={() => handleNavClick(item.id)}
                      onMouseEnter={() => setHoveredTab(item.id)}
                      onMouseLeave={() => setHoveredTab(null)}
                      className={`relative w-full flex items-center rounded-xl text-xs font-semibold cursor-pointer transition-colors duration-150 select-none ${
                        isOpen ? "space-x-3 px-3 py-2 text-left" : "justify-center px-0 py-2.5"
                      } ${
                        isSelected
                          ? "text-white font-bold"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                      title={item.label}
                    >
                      {/* Active Interstellar Glowing Glass Pill with motion */}
                      {isSelected && (
                        <motion.div
                          layoutId="sidebar-active-tab-pill"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                          className="absolute inset-0 rounded-xl bg-white/[0.09] border border-white/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_0_15px_rgba(255,255,255,0.03)]"
                        >
                          {/* Starlight active accent line */}
                          <div
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/5 rounded-r-full shadow-lg"
                            style={{
                              backgroundColor: currentTheme.primaryHex,
                              boxShadow: `0 0 10px ${currentTheme.primaryHex}`,
                            }}
                          />
                        </motion.div>
                      )}

                      {/* Hover subtle cosmic backlight */}
                      {!isSelected && isHovered && (
                        <div className="absolute inset-0 rounded-xl bg-white/[0.04] transition-colors" />
                      )}

                      {/* Icon */}
                      <div className="relative z-10 shrink-0">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 ${
                            isSelected
                              ? "bg-white/10 border border-white/20 shadow-[0_0_12px_rgba(255,255,255,0.15)]"
                              : isHovered
                              ? "bg-white/5 border border-white/10"
                              : "bg-transparent border border-transparent"
                          }`}
                        >
                          <Icon
                            className={`w-3.5 h-3.5 transition-transform duration-300 stroke-[2.2] ${
                              isSelected
                                ? `${currentTheme.textAccent} drop-shadow-[0_0_8px_currentColor]`
                                : "text-slate-400 group-hover:text-slate-200"
                            } ${isHovered ? "scale-110" : ""}`}
                          />
                        </div>
                      </div>

                      {/* Label & Badges */}
                      {isOpen && (
                        <div className="relative z-10 flex-1 flex items-center justify-between min-w-0">
                          <span className="truncate">{item.label}</span>
                          {item.badge && (
                            <span
                              className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full border ${
                                item.badge === "AI"
                                  ? "bg-purple-500/20 text-purple-300 border-purple-500/30 shadow-[0_0_8px_rgba(168,85,247,0.3)]"
                                  : "bg-white/10 text-slate-300 border-white/10"
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Orbit Starlight Telemetry Mini-Card (XP & Streaks) */}
        {isOpen && stats && (
          <div className="relative z-10 mx-2.5 my-1 p-2.5 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1.5">
              <span className="flex items-center space-x-1 font-bold text-white">
                <Sparkles className={`w-3 h-3 ${currentTheme.textAccent}`} />
                <span>ORBIT LV.{stats.level || 1}</span>
              </span>
              <span className="flex items-center space-x-1 text-amber-400 font-semibold">
                <Flame className="w-3 h-3 fill-amber-400" />
                <span>{stats.activeStreaks || 0}d streak</span>
              </span>
            </div>

            {/* XP Progress Bar with Cosmic Starlight Shimmer */}
            <div className="relative w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 relative"
                style={{
                  width: `${progressRatio}%`,
                  backgroundColor: currentTheme.primaryHex,
                  boxShadow: `0 0 8px ${currentTheme.primaryHex}`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
              </div>
            </div>

            <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 mt-1">
              <span>{stats.xp || 0} XP Total</span>
              <span className="text-slate-400">{progressRatio}% to Lv.{(stats.level || 1) + 1}</span>
            </div>
          </div>
        )}

        {/* Bottom Utility Tools & Cosmic Space Pod Switcher */}
        <div className="relative z-10 p-2.5 border-t border-white/5 bg-white/[0.01] space-y-2">
          {/* Quick Cosmic Utility Actions */}
          <div className={`flex ${isOpen ? "items-center justify-between px-1" : "flex-col items-center space-y-1"}`}>
            <button
              id="sidebar-setup-wizard-btn"
              onClick={() => {
                focusAudio.playClick();
                onOpenSetupWizard();
              }}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 active:scale-90 rounded-xl border border-transparent hover:border-white/10 cursor-pointer transition-all duration-150 relative z-0 hover:z-10"
              title="Personalized Experience Setup Wizard"
            >
              <Wand2 className={`w-4 h-4 ${currentTheme.textAccent}`} />
            </button>

            <button
              id="sidebar-auto-sync-btn"
              onClick={() => {
                focusAudio.playClick();
                onOpenIntegrations();
              }}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 active:scale-90 rounded-xl border border-transparent hover:border-white/10 cursor-pointer transition-all duration-150 relative z-0 hover:z-10"
              title="Automated Passive Trackers & Connectors"
            >
              <Zap className="w-4 h-4 text-amber-400" />
            </button>

            <button
              id="sidebar-backup-export-btn"
              onClick={() => {
                focusAudio.playClick();
                onOpenBackup();
              }}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 active:scale-90 rounded-xl border border-transparent hover:border-white/10 cursor-pointer transition-all duration-150 relative z-0 hover:z-10"
              title="Database Backup & Export"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>

          {/* Active Space Pod & Profile Switcher Card */}
          <motion.div
            id="sidebar-profile-switcher-btn"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              focusAudio.playClick();
              if (onOpenProfileHub) onOpenProfileHub();
            }}
            className={`bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 hover:border-white/15 rounded-2xl p-2 flex items-center cursor-pointer transition-all duration-150 group relative overflow-hidden ${
              isOpen ? "justify-between" : "justify-center"
            }`}
            title="Switch or Manage Accounts / Spaces (Cmd+P)"
          >
            {/* Subtle nebula corner glow */}
            <div
              className="absolute -bottom-6 -right-6 w-16 h-16 rounded-full blur-xl opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity"
              style={{ backgroundColor: profile.avatarColor || "#10b981" }}
            />

            <div className={`flex items-center ${isOpen ? "space-x-2.5 min-w-0" : "justify-center"}`}>
              {/* Profile Avatar with holographic cosmic border */}
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-base shadow-sm border border-white/10 shrink-0 relative group-hover:scale-105 transition-transform"
                style={{
                  backgroundColor: `${profile.avatarColor || "#10b981"}25`,
                  borderColor: `${profile.avatarColor || "#10b981"}50`,
                }}
              >
                <span>{profile.avatarIcon || "🚀"}</span>
                {/* Online orbital beacon */}
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-black" />
              </div>

              {isOpen && (
                <div className="min-w-0 text-left">
                  <div className="text-xs font-bold text-white truncate group-hover:text-emerald-400 transition">
                    {profile.name}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate flex items-center space-x-1 font-mono">
                    <span>{profile.role ? profile.role.split(" ")[0] : "Commander"}</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-semibold">Switch</span>
                  </div>
                </div>
              )}
            </div>

            {isOpen && (
              <Users className="w-3.5 h-3.5 text-slate-500 group-hover:text-white shrink-0 transition mr-1" />
            )}
          </motion.div>

          {/* Auth Button */}
          {isOpen && (
            <div className="mt-2 text-center">
              {currentUser ? (
                <button
                  onClick={() => onSignOut && onSignOut()}
                  className="text-[10px] text-slate-500 hover:text-rose-400 font-mono transition-colors"
                >
                  Disconnect from {currentUser.email}
                </button>
              ) : (
                <button
                  onClick={() => onSignIn && onSignIn()}
                  className="text-[10px] text-emerald-500 hover:text-emerald-400 font-mono transition-colors"
                >
                  Connect to Cloud Orbit
                </button>
              )}
            </div>
          )}
        </div>
      </motion.aside>
    </>
  );
};
