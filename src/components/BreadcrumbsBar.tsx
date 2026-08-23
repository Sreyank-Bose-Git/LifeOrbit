import React from "react";
import {
  ChevronRight,
  Orbit,
  Layers,
  Grid3X3,
  Flag,
  Calendar,
  Timer,
  BarChart3,
  Trophy,
  Bot,
  Sliders,
  Search,
  PanelRight,
  Command,
  Flame,
  Zap,
  Sparkles,
} from "lucide-react";
import { ViewTab, UserProfile, UserStats } from "../types";
import { THEME_ACCENTS } from "../lib/theme";

interface BreadcrumbsBarProps {
  activeTab: ViewTab;
  selectedCategory: string;
  profile: UserProfile;
  stats: UserStats;
  isOrbitQueueOpen: boolean;
  onToggleOrbitQueue: () => void;
  onOpenCommandPalette: () => void;
  onOpenProfileHub: () => void;
  onNavigateTab: (tab: ViewTab) => void;
}

const TAB_META: Record<ViewTab, { label: string; icon: React.FC<{ className?: string }> }> = {
  tracker: { label: "Orbit Dashboard", icon: Layers },
  sandbox: { label: "Cosmic Sandbox", icon: Orbit },
  matrix: { label: "Habit Matrix", icon: Grid3X3 },
  roadmap: { label: "Project Roadmap", icon: Flag },
  timeline: { label: "Schedule & Blocks", icon: Calendar },
  focus: { label: "Deep Focus Sprint", icon: Timer },
  insights: { label: "Telemetry & Stats", icon: BarChart3 },
  trophies: { label: "Trophies & XP", icon: Trophy },
  copilot: { label: "AI Cosmic Coach", icon: Bot },
  settings: { label: "System Config", icon: Sliders },
};

const CATEGORY_NAMES: Record<string, string> = {
  all: "All Spheres",
  health: "Health & Fitness",
  career: "Career & Tech",
  learning: "Learning & Intellect",
  finance: "Wealth & Finance",
  mindfulness: "Mindfulness & Zen",
  creative: "Creative & Arts",
  personal: "Personal Growth",
};

export const BreadcrumbsBar: React.FC<BreadcrumbsBarProps> = ({
  activeTab,
  selectedCategory,
  profile,
  stats,
  isOrbitQueueOpen,
  onToggleOrbitQueue,
  onOpenCommandPalette,
  onOpenProfileHub,
  onNavigateTab,
}) => {
  const currentTheme = THEME_ACCENTS[profile.themeConfig?.accent] || THEME_ACCENTS.emerald;
  const currentTabMeta = TAB_META[activeTab] || TAB_META.tracker;
  const TabIcon = currentTabMeta.icon;

  return (
    <div
      id="notion-breadcrumbs-bar"
      className="hidden sm:flex items-center justify-between px-4 py-2 bg-[#06070B]/80 backdrop-blur-2xl border-b border-white/5 text-xs text-slate-400 font-mono select-none"
    >
      {/* Left: Notion / Obsidian Breadcrumb Hierarchy */}
      <div className="flex items-center space-x-2 min-w-0">
        <button
          onClick={() => onNavigateTab("tracker")}
          className="flex items-center space-x-1.5 text-slate-400 hover:text-white transition cursor-pointer group"
          title="Go to main Dashboard"
        >
          <Orbit className="w-3.5 h-3.5 text-emerald-400 group-hover:rotate-90 transition-transform duration-300" />
          <span className="font-bold tracking-tight text-white">
            {profile.themeConfig?.customAppTitle || "LifeOrbit OS"}
          </span>
        </button>

        <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />

        {/* Workspace Space Pill (Netflix / Notion style) */}
        <button
          onClick={onOpenProfileHub}
          className="flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 transition cursor-pointer"
          title="Switch space / workspace profile"
        >
          <span>{profile.avatarIcon || "🚀"}</span>
          <span className="font-semibold text-[11px] truncate max-w-[120px]">
            {profile.name || "Main Space"}
          </span>
        </button>

        <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />

        {/* Current View Tab */}
        <div className="flex items-center space-x-1 text-slate-200 font-semibold text-[11px] truncate">
          <TabIcon className={`w-3.5 h-3.5 ${currentTheme.textAccent}`} />
          <span>{currentTabMeta.label}</span>
        </div>

        {/* Category modifier if in tracker view and filtered */}
        {activeTab === "tracker" && selectedCategory !== "all" && (
          <>
            <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
            <span className="text-emerald-400 font-bold text-[10px] bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
              {CATEGORY_NAMES[selectedCategory] || selectedCategory}
            </span>
          </>
        )}
      </div>

      {/* Right: Quick shortcuts & telemetry badges */}
      <div className="flex items-center space-x-3 shrink-0">
        {/* XP Level & Streaks pill */}
        <div className="flex items-center space-x-2 text-[10px] text-slate-400">
          <span className="flex items-center space-x-1 bg-amber-500/10 border border-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md font-bold">
            <Flame className="w-3 h-3 text-amber-400 fill-current" />
            <span>{stats?.currentStreak || 0}d</span>
          </span>
          <span className="flex items-center space-x-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md font-bold">
            <Zap className="w-3 h-3 text-emerald-400" />
            <span>Lv.{stats?.level || 1} • {stats?.xp || 0} XP</span>
          </span>
        </div>

        {/* Obsidian-Style Search Shortcut */}
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center space-x-1.5 px-2 py-1 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-lg border border-white/5 text-[10px] cursor-pointer active:scale-95 transition"
          title="Command Palette (Cmd+K)"
        >
          <Search className="w-3 h-3 text-slate-400" />
          <span className="text-slate-400">Search</span>
          <kbd className="bg-black/60 px-1 py-0.2 rounded border border-white/10 text-[9px] text-slate-400">
            ⌘K
          </kbd>
        </button>

        {/* YouTube / Notion Shelf Toggle */}
        <button
          onClick={onToggleOrbitQueue}
          className={`flex items-center space-x-1 px-2 py-1 rounded-lg border text-[10px] cursor-pointer active:scale-95 transition ${
            isOrbitQueueOpen
              ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
              : "bg-white/5 hover:bg-white/10 text-slate-300 border-white/5"
          }`}
          title="Toggle Daily Queue & Shelf (Cmd+J)"
        >
          <PanelRight className="w-3 h-3 text-emerald-400" />
          <span>Shelf</span>
          <kbd className="bg-black/60 px-1 py-0.2 rounded border border-white/10 text-[9px] text-slate-400">
            ⌘J
          </kbd>
        </button>
      </div>
    </div>
  );
};
