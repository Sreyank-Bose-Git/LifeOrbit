import React from "react";
import {
  Compass,
  Layers,
  Calendar,
  Timer,
  BarChart3,
  Bot,
  Sliders,
  Plus,
  Zap,
  Award,
  Download,
  Wand2,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Flame,
  CheckCircle2,
  Search,
  Users,
  ChevronDown,
  Flag,
  Trophy,
  Grid3X3,
  Orbit,
} from "lucide-react";
import { ViewTab, UserStats, UserProfile } from "../types";
import { THEME_ACCENTS } from "../lib/theme";
import { focusAudio } from "../lib/audio";

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
}) => {
  const currentTheme = THEME_ACCENTS[profile.themeConfig?.accent] || THEME_ACCENTS.emerald;

  const navItems: { id: ViewTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: "tracker", label: "Endeavors", icon: Layers },
    { id: "matrix", label: "Habit Matrix", icon: Grid3X3 },
    { id: "roadmap", label: "Roadmap", icon: Flag },
    { id: "timeline", label: "Schedule", icon: Calendar },
    { id: "focus", label: "Deep Focus", icon: Timer },
    { id: "insights", label: "Analytics", icon: BarChart3 },
    { id: "trophies", label: "Trophies & XP", icon: Trophy },
    { id: "copilot", label: "AI Coach", icon: Bot },
    { id: "settings", label: "Customize", icon: Sliders },
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

      {/* Main Left Sidebar */}
      <aside
        id="app-left-sidebar"
        className={`fixed md:sticky top-0 left-0 z-40 h-screen bg-[#0D0D0D] border-r border-white/5 flex flex-col justify-between shrink-0 transition-all duration-300 ease-in-out ${
          isOpen
            ? "w-64 translate-x-0"
            : "w-64 -translate-x-full md:translate-x-0 md:w-20"
        }`}
      >
        {/* Top Header & Branding */}
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center justify-between">
            <div
              onClick={handleBrandClick}
              className={`flex items-center cursor-pointer overflow-hidden group ${
                isOpen ? "space-x-3" : "justify-center w-full"
              }`}
              title="Click to replay LifeOrbit OS cinematic entry logo"
            >
              <div
                className={`w-9 h-9 rounded-xl ${currentTheme.buttonBg} ${currentTheme.buttonText} flex items-center justify-center shrink-0 shadow-xs group-hover:scale-110 group-hover:rotate-12 transition-all`}
              >
                <Orbit className="w-5 h-5 stroke-[2.2]" />
              </div>

              {isOpen && (
                <div className="min-w-0 transition-opacity duration-200">
                  <h1 className="font-bold text-white text-sm tracking-tight truncate uppercase flex items-center space-x-1">
                    <span>{profile.themeConfig?.customAppTitle || "LifeOrbit OS"}</span>
                  </h1>
                  <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${currentTheme.badgeBg} inline-block`}>
                    {profile.role ? profile.role.split(" ")[0] : "Command"}
                  </span>
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
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 active:scale-90 rounded-xl border border-white/5 cursor-pointer transition-all duration-150"
                title="Collapse sidebar"
                aria-label="Collapse sidebar"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            ) : (
              <button
                id="toggle-sidebar-expand-btn"
                onClick={() => {
                  focusAudio.playClick();
                  onToggleOpen();
                }}
                className="hidden md:flex p-1.5 text-slate-400 hover:text-white hover:bg-white/10 active:scale-90 rounded-lg cursor-pointer transition-all duration-150 mt-2 mx-auto"
                title="Expand sidebar"
                aria-label="Expand sidebar"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Primary Action Button (New Goal) & Command Palette */}
        <div className="p-3 space-y-1.5">
          <button
            id="sidebar-new-goal-button"
            onClick={() => {
              focusAudio.playClick();
              onOpenCreate();
            }}
            className={`w-full flex items-center justify-center rounded-xl font-bold text-xs ${currentTheme.buttonBg} ${currentTheme.buttonHover} ${currentTheme.buttonText} shadow-md hover:shadow-lg active:scale-95 cursor-pointer transition-all duration-150 ${
              isOpen ? "py-2.5 px-3 space-x-2" : "py-2.5 px-0"
            }`}
            title="Create New Goal or Endeavor"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            {isOpen && <span>New Goal</span>}
          </button>

          {onOpenCommandPalette && (
            <button
              id="sidebar-cmd-palette-btn"
              onClick={() => {
                focusAudio.playClick();
                onOpenCommandPalette();
              }}
              className={`w-full flex items-center rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 active:scale-95 border border-white/5 hover:border-white/10 cursor-pointer transition-all duration-150 ${
                isOpen ? "py-2 px-3 justify-between" : "py-2 px-0 justify-center"
              }`}
              title="Open Command Palette (Cmd+K)"
            >
              <div className="flex items-center space-x-2">
                <Search className="w-3.5 h-3.5" />
                {isOpen && <span>Quick Search</span>}
              </div>
              {isOpen && (
                <span className="font-mono text-[9px] bg-black/40 text-slate-500 px-1 py-0.5 rounded border border-white/5">
                  ⌘K
                </span>
              )}
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isSelected = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center rounded-xl text-xs font-semibold cursor-pointer active:scale-[0.98] transition-all duration-150 group ${
                  isOpen ? "space-x-3 px-3 py-2.5 text-left" : "justify-center px-0 py-2.5"
                } ${
                  isSelected
                    ? `bg-white/10 ${currentTheme.textAccent} shadow-xs font-bold`
                    : "text-slate-400 hover:text-slate-100 hover:bg-white/5"
                }`}
                title={item.label}
              >
                <Icon className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${isSelected ? currentTheme.textAccent : "text-slate-400"}`} />
                {isOpen && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Bottom Utility Tools & User Profile Card */}
        <div className="p-3 border-t border-white/5 space-y-2">
          {/* Quick Utility Actions */}
          <div className={`flex ${isOpen ? "items-center justify-between" : "flex-col items-center space-y-1.5"}`}>
            <button
              id="sidebar-setup-wizard-btn"
              onClick={() => {
                focusAudio.playClick();
                onOpenSetupWizard();
              }}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 active:scale-90 rounded-xl border border-transparent hover:border-white/10 cursor-pointer transition-all duration-150"
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
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 active:scale-90 rounded-xl border border-transparent hover:border-white/10 cursor-pointer transition-all duration-150"
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
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 active:scale-90 rounded-xl border border-transparent hover:border-white/10 cursor-pointer transition-all duration-150"
              title="Database Backup & Export"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>

          {/* Active Profile & Account Switcher Card (Netflix Style) */}
          <div
            id="sidebar-profile-switcher-btn"
            onClick={() => {
              focusAudio.playClick();
              if (onOpenProfileHub) onOpenProfileHub();
            }}
            className={`bg-[#141414] hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-2xl p-2.5 flex items-center cursor-pointer transition-all duration-150 active:scale-95 group ${
              isOpen ? "justify-between" : "justify-center"
            }`}
            title="Switch or Manage Accounts / Spaces"
          >
            <div className={`flex items-center ${isOpen ? "space-x-2.5 min-w-0" : "justify-center"}`}>
              {/* Profile Avatar Emoji / Icon */}
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-base shadow-sm border border-white/10 shrink-0 group-hover:scale-105 transition-transform"
                style={{
                  backgroundColor: `${profile.avatarColor || "#10b981"}25`,
                  borderColor: `${profile.avatarColor || "#10b981"}50`,
                }}
              >
                <span>{profile.avatarIcon || "🚀"}</span>
              </div>

              {isOpen && (
                <div className="min-w-0 text-left">
                  <div className="text-xs font-bold text-white truncate group-hover:text-emerald-400 transition">
                    {profile.name}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate flex items-center space-x-1">
                    <span>{profile.role ? profile.role.split(" ")[0] : "Space"}</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-semibold">Switch</span>
                  </div>
                </div>
              )}
            </div>

            {isOpen && (
              <Users className="w-4 h-4 text-slate-500 group-hover:text-white shrink-0 transition" />
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
