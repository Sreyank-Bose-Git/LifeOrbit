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
} from "lucide-react";
import { ViewTab, UserStats, UserProfile } from "../types";
import { THEME_ACCENTS } from "../lib/theme";

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
}) => {
  const currentTheme = THEME_ACCENTS[profile.themeConfig?.accent] || THEME_ACCENTS.emerald;

  const navItems: { id: ViewTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: "tracker", label: "Endeavors", icon: Layers },
    { id: "timeline", label: "Schedule", icon: Calendar },
    { id: "focus", label: "Deep Focus", icon: Timer },
    { id: "insights", label: "Analytics", icon: BarChart3 },
    { id: "copilot", label: "AI Coach", icon: Bot },
    { id: "settings", label: "Customize", icon: Sliders },
  ];

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
              onClick={() => setActiveTab("tracker")}
              className={`flex items-center cursor-pointer overflow-hidden group ${
                isOpen ? "space-x-3" : "justify-center w-full"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl ${currentTheme.buttonBg} ${currentTheme.buttonText} flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform`}
              >
                <Compass className="w-5 h-5 stroke-[2.2]" />
              </div>

              {isOpen && (
                <div className="min-w-0 transition-opacity duration-200">
                  <h1 className="font-bold text-white text-sm tracking-tight truncate uppercase">
                    {profile.themeConfig?.customAppTitle || "LifeOrbit OS"}
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
                onClick={onToggleOpen}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 active:scale-90 rounded-xl border border-white/5 cursor-pointer transition-all duration-150"
                title="Collapse sidebar"
                aria-label="Collapse sidebar"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            ) : (
              <button
                id="toggle-sidebar-expand-btn"
                onClick={onToggleOpen}
                className="hidden md:flex p-1.5 text-slate-400 hover:text-white hover:bg-white/10 active:scale-90 rounded-lg cursor-pointer transition-all duration-150 mt-2 mx-auto"
                title="Expand sidebar"
                aria-label="Expand sidebar"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Primary Action Button (New Goal) */}
        <div className="p-3">
          <button
            id="sidebar-new-goal-button"
            onClick={onOpenCreate}
            className={`w-full flex items-center justify-center rounded-xl font-bold text-xs ${currentTheme.buttonBg} ${currentTheme.buttonHover} ${currentTheme.buttonText} shadow-md hover:shadow-lg active:scale-95 cursor-pointer transition-all duration-150 ${
              isOpen ? "py-2.5 px-3 space-x-2" : "py-2.5 px-0"
            }`}
            title="Create New Goal or Endeavor"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            {isOpen && <span>New Goal</span>}
          </button>
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
                onClick={() => {
                  setActiveTab(item.id);
                  // Auto close on mobile
                  if (window.innerWidth < 768 && isOpen) {
                    onToggleOpen();
                  }
                }}
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
              onClick={onOpenSetupWizard}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 active:scale-90 rounded-xl border border-transparent hover:border-white/10 cursor-pointer transition-all duration-150"
              title="Personalized Experience Setup Wizard"
            >
              <Wand2 className={`w-4 h-4 ${currentTheme.textAccent}`} />
            </button>

            <button
              id="sidebar-auto-sync-btn"
              onClick={onOpenIntegrations}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 active:scale-90 rounded-xl border border-transparent hover:border-white/10 cursor-pointer transition-all duration-150"
              title="Automated Passive Trackers & Connectors"
            >
              <Zap className="w-4 h-4 text-amber-400" />
            </button>

            <button
              id="sidebar-backup-export-btn"
              onClick={onOpenBackup}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 active:scale-90 rounded-xl border border-transparent hover:border-white/10 cursor-pointer transition-all duration-150"
              title="Database Backup & Export"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>

          {/* Gamified Rank Badge */}
          <div
            onClick={onOpenSetupWizard}
            className={`bg-[#141414] hover:bg-[#1a1a1a] border border-white/5 hover:border-white/15 rounded-xl p-2 flex items-center cursor-pointer transition-all duration-150 ${
              isOpen ? "justify-between" : "justify-center"
            }`}
            title="Click to view/edit profile & rank"
          >
            <div className={`flex items-center ${isOpen ? "space-x-2" : "justify-center"}`}>
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              {isOpen && (
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-slate-200">Level {stats.level}</div>
                  <div className="text-[10px] text-slate-500">{stats.xp} XP</div>
                </div>
              )}
            </div>

            {isOpen && (
              <span className="text-[9px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                Active
              </span>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
