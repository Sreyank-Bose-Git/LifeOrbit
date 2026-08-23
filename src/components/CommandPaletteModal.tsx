import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Search,
  Plus,
  Play,
  CheckCircle2,
  Sparkles,
  Calendar,
  BarChart3,
  Settings,
  X,
  Compass,
  Users,
  Orbit,
  Zap,
  Flame,
  Volume2,
  VolumeX,
  Sliders,
  HardDrive,
  Smartphone,
  Trophy,
  ArrowRight,
  Clock,
  Command,
  History,
  Trash2,
  Layers,
  Bot,
  BrainCircuit,
  CornerDownLeft,
  Eye,
  Sun,
  Moon,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Endeavor, ViewTab, Category, UIThemeConfig, EyeComfortPreset } from "../types";
import { getEndeavorIcon, getCategoryBadge, getArchetypeInfo, StylizedIconOrb } from "../lib/icons";
import { focusAudio, AmbientSoundType } from "../lib/audio";
import { SPHERE_DEFINITIONS } from "./LifeSphereOrb";
import { EYE_COMFORT_PRESETS } from "../lib/theme";
import { triggerEyeBreakModal } from "./EyeComfortManager";
import confetti from "canvas-confetti";

export type SearchScope =
  | "all"
  | "endeavors"
  | "habits"
  | "milestones"
  | "commands"
  | "views"
  | "audio"
  | "ai";

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  endeavors: Endeavor[];
  onNavigateTab: (tab: ViewTab) => void;
  onOpenCreate: () => void;
  onStartFocus: (endeavor: Endeavor) => void;
  onQuickCheckIn: (endeavorId: string) => void;
  onOpenProfileHub?: () => void;
  onOpenDetail?: (endeavor: Endeavor) => void;
  onOpenSetupWizard?: () => void;
  onOpenBackup?: () => void;
  onOpenDeviceSync?: () => void;
  onToggleOrbitQueue?: () => void;
  themeConfig?: UIThemeConfig;
  onUpdateThemeConfig?: (cfg: Partial<UIThemeConfig>) => void;
  onTriggerEyeBreakDemo?: () => void;
}

const RECENT_SEARCHES_KEY = "lifeorbit_search_wizard_history";

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  endeavors,
  onNavigateTab,
  onOpenCreate,
  onStartFocus,
  onQuickCheckIn,
  onOpenProfileHub,
  onOpenDetail,
  onOpenSetupWizard,
  onOpenBackup,
  onOpenDeviceSync,
  onToggleOrbitQueue,
  themeConfig,
  onUpdateThemeConfig,
  onTriggerEyeBreakDemo,
}) => {
  const [rawQuery, setRawQuery] = useState("");
  const [activeScope, setActiveScope] = useState<SearchScope>("all");
  const [selectedSphere, setSelectedSphere] = useState<string>("all");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);

  // Parse query prefix shorthands: / or > (commands), # (category), @ (focus/sprints), ? (AI prompts)
  const { parsedQuery, effectiveScope, effectiveSphere } = useMemo(() => {
    let q = rawQuery.trim();
    let scope = activeScope;
    let sphere = selectedSphere;

    if (q.startsWith(">") || q.startsWith("/")) {
      scope = "commands";
      q = q.substring(1).trim();
    } else if (q.startsWith("#")) {
      const tagMatch = q.match(/^#(\w+)/);
      if (tagMatch) {
        sphere = tagMatch[1].toLowerCase();
        q = q.substring(tagMatch[0].length).trim();
      }
    } else if (q.startsWith("@")) {
      scope = "habits";
      q = q.substring(1).trim();
    } else if (q.startsWith("?")) {
      scope = "ai";
      q = q.substring(1).trim();
    }

    return { parsedQuery: q.toLowerCase(), effectiveScope: scope, effectiveSphere: sphere };
  }, [rawQuery, activeScope, selectedSphere]);

  // Save query to recent searches
  const saveRecentSearch = (term: string) => {
    if (!term.trim()) return;
    try {
      const updated = [term.trim(), ...recentSearches.filter((s) => s.toLowerCase() !== term.trim().toLowerCase())].slice(0, 6);
      setRecentSearches(updated);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch {
      // ignore
    }
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      setSelectedIndex(0);
    } else {
      setRawQuery("");
      setActiveScope("all");
      setSelectedSphere("all");
    }
  }, [isOpen]);

  // Build System Action Items
  const systemActions = useMemo(() => {
    return [
      {
        id: "act-create",
        title: "Create New Goal, Metric or Habit",
        category: "System Action",
        badge: "CREATE",
        icon: Plus,
        color: "#10b981",
        handler: () => {
          onClose();
          onOpenCreate();
        },
      },
      {
        id: "act-wizard",
        title: "Launch Personalized Setup Wizard",
        category: "Wizard Engine",
        badge: "WIZARD",
        icon: Sparkles,
        color: "#38bdf8",
        handler: () => {
          onClose();
          if (onOpenSetupWizard) onOpenSetupWizard();
        },
      },
      {
        id: "act-profile",
        title: "Switch Profiles & Workspace Hub",
        category: "Identity & Roles",
        badge: "WORKSPACE",
        icon: Users,
        color: "#818cf8",
        handler: () => {
          onClose();
          if (onOpenProfileHub) onOpenProfileHub();
        },
      },
      {
        id: "act-backup",
        title: "Backup & Export Telemetry JSON Data",
        category: "Data Storage",
        badge: "BACKUP",
        icon: HardDrive,
        color: "#fbbf24",
        handler: () => {
          onClose();
          if (onOpenBackup) onOpenBackup();
        },
      },
      {
        id: "act-device",
        title: "Device Integrations & Apple Watch Sync",
        category: "Hardware",
        badge: "SYNC",
        icon: Smartphone,
        color: "#f43f5e",
        handler: () => {
          onClose();
          if (onOpenDeviceSync) onOpenDeviceSync();
        },
      },
      {
        id: "act-queue",
        title: "Toggle Context Shelf & Daily Queue (Cmd+J)",
        category: "Context Deck",
        badge: "SHELF",
        icon: Layers,
        color: "#ec4899",
        handler: () => {
          onClose();
          if (onToggleOrbitQueue) onToggleOrbitQueue();
        },
      },
      {
        id: "act-eye-warm",
        title: "Eye Comfort: Amber Warmth Mode (3400K)",
        category: "Eye Comfort & Optics",
        badge: "WARMTH",
        icon: Eye,
        color: "#f59e0b",
        handler: () => {
          onClose();
          if (onUpdateThemeConfig) {
            onUpdateThemeConfig({ eyeComfortPreset: "warm" });
            focusAudio.playClick();
          }
        },
      },
      {
        id: "act-eye-candle",
        title: "Eye Comfort: Candlelight Night Shield (2400K)",
        category: "Eye Comfort & Optics",
        badge: "NIGHT",
        icon: Moon,
        color: "#ea580c",
        handler: () => {
          onClose();
          if (onUpdateThemeConfig) {
            onUpdateThemeConfig({ eyeComfortPreset: "candlelight" });
            focusAudio.playClick();
          }
        },
      },
      {
        id: "act-eye-paper",
        title: "Eye Comfort: E-Ink / Slate Monochromatic Low-Strain",
        category: "Eye Comfort & Optics",
        badge: "E-INK",
        icon: Eye,
        color: "#d97706",
        handler: () => {
          onClose();
          if (onUpdateThemeConfig) {
            onUpdateThemeConfig({ eyeComfortPreset: "paper" });
            focusAudio.playClick();
          }
        },
      },
      {
        id: "act-eye-dim",
        title: "Eye Comfort: Ultra-Low Lumens Midnight Dimmer",
        category: "Eye Comfort & Optics",
        badge: "DIMMER",
        icon: Moon,
        color: "#94a3b8",
        handler: () => {
          onClose();
          if (onUpdateThemeConfig) {
            onUpdateThemeConfig({ eyeComfortPreset: "dim" });
            focusAudio.playClick();
          }
        },
      },
      {
        id: "act-eye-off",
        title: "Eye Comfort: Crisp Precision 6500K (Disable Filter)",
        category: "Eye Comfort & Optics",
        badge: "STANDARD",
        icon: Sun,
        color: "#38bdf8",
        handler: () => {
          onClose();
          if (onUpdateThemeConfig) {
            onUpdateThemeConfig({ eyeComfortPreset: "off" });
            focusAudio.playClick();
          }
        },
      },
      {
        id: "act-eye-break",
        title: "Eye Comfort: Start 20-20-20 Optic Relaxation Rest",
        category: "Eye Comfort & Optics",
        badge: "20-20-20",
        icon: Eye,
        color: "#10b981",
        handler: () => {
          onClose();
          triggerEyeBreakModal();
        },
      },
    ];
  }, [
    onClose,
    onOpenCreate,
    onOpenSetupWizard,
    onOpenProfileHub,
    onOpenBackup,
    onOpenDeviceSync,
    onToggleOrbitQueue,
    onUpdateThemeConfig,
  ]);

  // Build Navigation Items
  const navViews = useMemo(() => {
    return [
      { id: "tracker", title: "Orbit Dashboard & Spotlight Rail", icon: Orbit, color: "#10b981", desc: "Curated rails & focus billboard" },
      { id: "sandbox", title: "3D Cosmic Gravity Sandbox", icon: Orbit, color: "#38bdf8", desc: "Interactive gravitational physics canvas" },
      { id: "matrix", title: "Consistency Matrix & Heatmaps", icon: Sparkles, color: "#fbbf24", desc: "GitHub-style habit streaks" },
      { id: "roadmap", title: "Milestone Trajectory Roadmap", icon: Compass, color: "#a855f7", desc: "Staged horizon phases" },
      { id: "timeline", title: "Schedule & Daily Time Blocks", icon: Calendar, color: "#f43f5e", desc: "Calendar view & deep focus blocks" },
      { id: "insights", title: "Orbital Analytics & Telemetry", icon: BarChart3, color: "#2dd4bf", desc: "Comprehensive charts & completion metrics" },
      { id: "copilot", title: "AI Galactic Flight Copilot", icon: Bot, color: "#818cf8", desc: "Autonomous strategy & coaching assistant" },
      { id: "trophies", title: "Trophy Hall & Cosmic Badges", icon: Trophy, color: "#f59e0b", desc: "Milestones, XP level & unlocked feats" },
      { id: "settings", title: "Mission Control & App Settings", icon: Settings, color: "#94a3b8", desc: "Themes, preferences & configurations" },
    ];
  }, []);

  // Build Audio Soundscape Items
  const soundscapeOptions = useMemo(() => {
    return [
      { id: "cyberpunk", title: "Cyberpunk Ambient City Synth", type: "cyberpunk" as AmbientSoundType, icon: Volume2, color: "#f43f5e" },
      { id: "space", title: "Deep Space Cosmic Drone (432Hz)", type: "space" as AmbientSoundType, icon: Volume2, color: "#818cf8" },
      { id: "rain", title: "Cyber Rain & Thunderstorm Loop", type: "rain" as AmbientSoundType, icon: Volume2, color: "#38bdf8" },
      { id: "zen", title: "Zen Garden Temple Singing Bowl", type: "zen" as AmbientSoundType, icon: Volume2, color: "#10b981" },
      { id: "binaural-alpha", title: "Binaural Alpha Waves (10Hz Focus)", type: "binaural-alpha" as AmbientSoundType, icon: Volume2, color: "#fbbf24" },
      { id: "stop", title: "Silence Ambient Soundscapes (Stop Audio)", type: "none" as AmbientSoundType, icon: VolumeX, color: "#64748b" },
    ];
  }, []);

  // Build AI Strategic Prompts
  const aiPrompts = useMemo(() => {
    return [
      {
        id: "ai-1",
        title: "Analyze my weekly momentum & burnout velocity",
        prompt: "Analyze my weekly completion velocity, identify any potential burnout risk, and give me 3 calibrated orbital recommendations.",
        color: "#818cf8",
      },
      {
        id: "ai-2",
        title: "Generate sub-tasks for my top active milestone",
        prompt: "Review my top active milestone endeavors and generate 3 strategic tactical sub-tasks with unit targets.",
        color: "#38bdf8",
      },
      {
        id: "ai-3",
        title: "Design a deep work focus schedule for today",
        prompt: "Design an optimized 4-hour deep work block schedule allocating my highest priority habits and quantifiable meters.",
        color: "#10b981",
      },
      {
        id: "ai-4",
        title: "Audit stagnant endeavors & suggest momentum boosts",
        prompt: "Audit any endeavors with zero recent check-ins and propose 2 frictionless micro-habits to reignite momentum.",
        color: "#fbbf24",
      },
    ];
  }, []);

  // Filtered Endeavors
  const filteredEndeavors = useMemo(() => {
    return endeavors.filter((e) => {
      // Scope filter
      if (effectiveScope === "habits" && e.archetype !== "habit") return false;
      if (effectiveScope === "milestones" && e.archetype !== "milestone") return false;
      if (effectiveScope === "endeavors" && e.archetype === "habit") return false;
      if (effectiveScope === "commands" || effectiveScope === "views" || effectiveScope === "audio" || effectiveScope === "ai") return false;

      // Category / Sphere filter
      if (effectiveSphere !== "all" && e.category.toLowerCase() !== effectiveSphere) return false;

      // Text query match
      if (!parsedQuery) return true;

      const titleMatch = e.title.toLowerCase().includes(parsedQuery);
      const descMatch = (e.description || "").toLowerCase().includes(parsedQuery);
      const catMatch = e.category.toLowerCase().includes(parsedQuery);
      const archMatch = e.archetype.toLowerCase().includes(parsedQuery);

      return titleMatch || descMatch || catMatch || archMatch;
    });
  }, [endeavors, effectiveScope, effectiveSphere, parsedQuery]);

  // Filtered Actions
  const filteredActions = useMemo(() => {
    if (effectiveScope !== "all" && effectiveScope !== "commands") return [];
    if (!parsedQuery) return systemActions;
    return systemActions.filter(
      (a) =>
        a.title.toLowerCase().includes(parsedQuery) ||
        a.category.toLowerCase().includes(parsedQuery) ||
        a.badge.toLowerCase().includes(parsedQuery)
    );
  }, [systemActions, effectiveScope, parsedQuery]);

  // Filtered Views
  const filteredViews = useMemo(() => {
    if (effectiveScope !== "all" && effectiveScope !== "views") return [];
    if (!parsedQuery) return navViews;
    return navViews.filter(
      (v) =>
        v.title.toLowerCase().includes(parsedQuery) ||
        v.desc.toLowerCase().includes(parsedQuery)
    );
  }, [navViews, effectiveScope, parsedQuery]);

  // Filtered Soundscapes
  const filteredAudio = useMemo(() => {
    if (effectiveScope !== "all" && effectiveScope !== "audio") return [];
    if (!parsedQuery) return soundscapeOptions;
    return soundscapeOptions.filter((s) => s.title.toLowerCase().includes(parsedQuery));
  }, [soundscapeOptions, effectiveScope, parsedQuery]);

  // Filtered AI Prompts
  const filteredAI = useMemo(() => {
    if (effectiveScope !== "all" && effectiveScope !== "ai") return [];
    if (!parsedQuery) return aiPrompts;
    return aiPrompts.filter((a) => a.title.toLowerCase().includes(parsedQuery) || a.prompt.toLowerCase().includes(parsedQuery));
  }, [aiPrompts, effectiveScope, parsedQuery]);

  // Flattened active results list for unified arrow navigation
  const allActiveResults = useMemo(() => {
    const list: Array<{ type: string; item: any }> = [];

    filteredEndeavors.forEach((e) => list.push({ type: "endeavor", item: e }));
    filteredActions.forEach((a) => list.push({ type: "action", item: a }));
    filteredViews.forEach((v) => list.push({ type: "view", item: v }));
    filteredAudio.forEach((s) => list.push({ type: "audio", item: s }));
    filteredAI.forEach((a) => list.push({ type: "ai", item: a }));

    return list;
  }, [filteredEndeavors, filteredActions, filteredViews, filteredAudio, filteredAI]);

  // Arrow Key Navigation Handler
  const handleKeyDownList = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (allActiveResults.length === 0) return;
      focusAudio.playClick();
      setSelectedIndex((prev) => (prev + 1) % allActiveResults.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (allActiveResults.length === 0) return;
      focusAudio.playClick();
      setSelectedIndex((prev) => (prev - 1 + allActiveResults.length) % allActiveResults.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (allActiveResults.length > 0 && selectedIndex < allActiveResults.length) {
        const current = allActiveResults[selectedIndex];
        saveRecentSearch(rawQuery);
        executeItem(current);
      }
    }
  };

  const executeItem = (record: { type: string; item: any }) => {
    focusAudio.playClick();
    if (record.type === "endeavor") {
      const e = record.item as Endeavor;
      if (onOpenDetail) {
        onClose();
        onOpenDetail(e);
      } else {
        onClose();
        onNavigateTab("tracker");
      }
    } else if (record.type === "action") {
      record.item.handler();
    } else if (record.type === "view") {
      onClose();
      onNavigateTab(record.item.id as ViewTab);
    } else if (record.type === "audio") {
      if (record.item.type === "none") {
        focusAudio.stopAmbient();
      } else {
        focusAudio.playSoundscape(record.item.type);
      }
      onClose();
    } else if (record.type === "ai") {
      onClose();
      onNavigateTab("copilot");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-start justify-center pt-12 sm:pt-16 px-3 sm:px-4 bg-black/85 backdrop-blur-2xl animate-in fade-in duration-150"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0, y: -16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0, y: -16 }}
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
        className="w-full max-w-2xl bg-[#06070B]/98 backdrop-blur-3xl border border-white/15 rounded-[28px] shadow-[0_0_90px_rgba(0,0,0,0.95)] overflow-hidden relative flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDownList}
      >
        {/* Subtle Ambient Cosmic Grid Background */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:18px_18px] opacity-25" />

        {/* Wizard Header Bar with Gradient Glow */}
        <div className="relative z-10 px-5 pt-4 pb-3 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-emerald-950/30 via-transparent to-indigo-950/30">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shadow-[0_0_15px_rgba(52,211,153,0.3)]">
              <Command className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-display font-extrabold text-sm text-white tracking-tight">
                  COSMIC SEARCH WIZARD
                </span>
                <span className="text-[9px] font-mono font-bold bg-emerald-400/10 text-emerald-300 border border-emerald-400/20 px-1.5 py-0.2 rounded-full uppercase">
                  OMNI RUNNER
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-sans">
                Search goals, trigger instant actions, switch soundscapes, or query AI
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 font-mono text-[10px]">
            <span className="bg-white/10 text-slate-300 px-2 py-0.5 rounded-lg border border-white/10 hidden sm:inline-block">
              {allActiveResults.length} matches
            </span>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition"
              title="Close Wizard (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Search Input Field */}
        <div className="relative z-10 px-5 py-3.5 border-b border-white/10 flex items-center space-x-3 bg-black/40">
          <Search className="w-5 h-5 text-emerald-400 shrink-0 stroke-[2.5]" />
          <input
            ref={inputRef}
            type="text"
            value={rawQuery}
            onChange={(e) => {
              setRawQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type command, endeavor title, /action, #category, @habit, ?prompt..."
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none font-sans font-medium"
          />
          {rawQuery && (
            <button
              onClick={() => {
                setRawQuery("");
                inputRef.current?.focus();
              }}
              className="p-1 text-slate-400 hover:text-white rounded-md transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Scopes & Life Sphere Filter Ribbon */}
        <div className="relative z-10 px-4 py-2 border-b border-white/5 bg-white/[0.02] flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
          {/* Scope Pills */}
          <div className="flex items-center space-x-1 shrink-0">
            {(
              [
                { id: "all", label: "All Index" },
                { id: "endeavors", label: "🎯 Goals" },
                { id: "habits", label: "🔥 Rituals" },
                { id: "milestones", label: "⚡ Milestones" },
                { id: "commands", label: "⚙️ Actions" },
                { id: "views", label: "🚀 Views" },
                { id: "audio", label: "🎵 Audio" },
                { id: "ai", label: "✨ AI Copilot" },
              ] as { id: SearchScope; label: string }[]
            ).map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setActiveScope(s.id);
                  focusAudio.playClick();
                  setSelectedIndex(0);
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition cursor-pointer shrink-0 ${
                  activeScope === s.id
                    ? "bg-emerald-400 text-black shadow-[0_0_12px_rgba(52,211,153,0.4)]"
                    : "bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10 border border-white/5"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Quick Life Sphere Filter */}
          <div className="flex items-center space-x-1 shrink-0 pl-2 border-l border-white/10">
            <button
              onClick={() => {
                setSelectedSphere("all");
                focusAudio.playClick();
              }}
              className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold transition cursor-pointer ${
                selectedSphere === "all"
                  ? "bg-white/20 text-white"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              ANY SPHERE
            </button>
            {(["health", "career", "learning", "finance", "mindfulness", "creative"] as Category[]).map((cat) => {
              const def = SPHERE_DEFINITIONS[cat];
              const isSelected = selectedSphere === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedSphere(isSelected ? "all" : cat);
                    focusAudio.playClick();
                  }}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold transition cursor-pointer border ${
                    isSelected
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-xs"
                      : "bg-white/[0.03] text-slate-400 border-white/5 hover:border-white/15"
                  }`}
                >
                  {def.emoji} {def.label.split(" ")[0]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Container */}
        <div ref={listContainerRef} className="relative z-10 flex-1 overflow-y-auto p-3 space-y-4 font-sans">
          {/* Recent Searches Header (When query is empty) */}
          {!rawQuery && recentSearches.length > 0 && (
            <div className="p-2 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
              <div className="flex items-center justify-between px-2 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                <span className="flex items-center space-x-1.5">
                  <History className="w-3 h-3 text-slate-400" />
                  <span>Recent Cosmic Searches</span>
                </span>
                <button
                  onClick={clearRecentSearches}
                  className="hover:text-rose-400 transition flex items-center space-x-1 cursor-pointer"
                >
                  <Trash2 className="w-2.5 h-2.5" />
                  <span>Clear</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 px-2">
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setRawQuery(term);
                      focusAudio.playClick();
                    }}
                    className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-medium transition cursor-pointer flex items-center space-x-1.5"
                  >
                    <span>{term}</span>
                    <ArrowRight className="w-3 h-3 text-slate-500" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 1: Matched Endeavors */}
          {filteredEndeavors.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between px-3 py-1 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                <span className="flex items-center space-x-1.5">
                  <Orbit className="w-3 h-3 text-emerald-400" />
                  <span>Endeavors & Quantifiable Missions ({filteredEndeavors.length})</span>
                </span>
                <span>ENTER TO OPEN</span>
              </div>

              <div className="space-y-1">
                {filteredEndeavors.map((endeavor) => {
                  const globalIdx = allActiveResults.findIndex((r) => r.type === "endeavor" && r.item.id === endeavor.id);
                  const isHighlighted = globalIdx === selectedIndex;
                  const catBadge = getCategoryBadge(endeavor.category);
                  const percentage =
                    endeavor.targetValue > 0
                      ? Math.min(100, Math.round((endeavor.currentValue / endeavor.targetValue) * 100))
                      : 0;

                  return (
                    <div
                      key={endeavor.id}
                      onClick={() => executeItem({ type: "endeavor", item: endeavor })}
                      className={`p-3 rounded-2xl border transition-all duration-150 cursor-pointer flex items-center justify-between gap-3 group relative ${
                        isHighlighted
                          ? "bg-white/[0.08] border-emerald-400/50 shadow-[0_0_25px_rgba(52,211,153,0.15)] ring-1 ring-emerald-400/30"
                          : "bg-white/[0.03] hover:bg-white/[0.06] border-white/5 hover:border-white/15"
                      }`}
                    >
                      {/* Left: Icon Orb, Title & Category */}
                      <div className="flex items-center space-x-3 min-w-0">
                        <StylizedIconOrb
                          iconName={endeavor.icon}
                          color={endeavor.color || "#10b981"}
                          size="sm"
                          variant="pod"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center space-x-1.5 flex-wrap">
                            <span className="font-display font-bold text-white text-xs sm:text-sm truncate">
                              {endeavor.title}
                            </span>
                            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${catBadge.color}`}>
                              {catBadge.shortLabel}
                            </span>
                            {endeavor.streakCount > 0 && (
                              <span className="flex items-center space-x-0.5 text-[9px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.2 rounded">
                                <Flame className="w-2.5 h-2.5 fill-current text-amber-400" />
                                <span>{endeavor.streakCount}d</span>
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 mt-1 text-[10px] text-slate-400 font-mono">
                            <span>{percentage}%</span>
                            <div className="w-16 h-1 rounded-full bg-white/10 overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{ width: `${percentage}%`, backgroundColor: endeavor.color || "#10b981" }}
                              />
                            </div>
                            <span>
                              {endeavor.currentValue} / {endeavor.targetValue} {endeavor.unit}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Quick Action Dock */}
                      <div className="flex items-center space-x-1 shrink-0 opacity-90 group-hover:opacity-100">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onQuickCheckIn(endeavor.id);
                            confetti({ particleCount: 25, spread: 45, origin: { y: 0.8 } });
                          }}
                          className="px-2.5 py-1 bg-emerald-400 hover:bg-emerald-300 text-black rounded-lg text-[10px] font-bold uppercase shadow-xs active:scale-95 transition flex items-center space-x-1 cursor-pointer"
                          title="Quick Log Progress +1"
                        >
                          <Plus className="w-3 h-3 stroke-[2.5]" />
                          <span className="hidden sm:inline">Log +1</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                            onStartFocus(endeavor);
                          }}
                          className="p-1.5 bg-white/10 hover:bg-white/20 text-amber-300 rounded-lg border border-white/10 text-[10px] font-bold active:scale-95 transition flex items-center space-x-1 cursor-pointer"
                          title="Launch Deep Focus Sprint (25m)"
                        >
                          <Play className="w-3 h-3 fill-amber-300" />
                          <span className="hidden md:inline">Sprint</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onOpenDetail) {
                              onClose();
                              onOpenDetail(endeavor);
                            }
                          }}
                          className="p-1.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-lg border border-white/10 text-[10px] transition cursor-pointer"
                          title="Open Mission Control Detail"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION 2: System Quick Actions & Wizards */}
          {filteredActions.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between px-3 py-1 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                <span className="flex items-center space-x-1.5">
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span>System Actions & Wizards ({filteredActions.length})</span>
                </span>
                <span>/COMMANDS</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {filteredActions.map((action) => {
                  const globalIdx = allActiveResults.findIndex((r) => r.type === "action" && r.item.id === action.id);
                  const isHighlighted = globalIdx === selectedIndex;
                  const Icon = action.icon;

                  return (
                    <button
                      key={action.id}
                      onClick={() => executeItem({ type: "action", item: action })}
                      className={`p-2.5 rounded-2xl border transition-all duration-150 text-left flex items-center justify-between gap-2 cursor-pointer ${
                        isHighlighted
                          ? "bg-white/[0.08] border-amber-400/50 shadow-[0_0_20px_rgba(251,191,36,0.15)] ring-1 ring-amber-400/30"
                          : "bg-white/[0.03] hover:bg-white/[0.06] border-white/5 hover:border-white/15"
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <div
                          className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border border-white/15 shadow-xs"
                          style={{ backgroundColor: `${action.color}25`, color: action.color }}
                        >
                          <Icon className="w-3.5 h-3.5 stroke-[2.2]" />
                        </div>
                        <div className="min-w-0">
                          <span className="block font-bold text-white text-xs truncate">
                            {action.title}
                          </span>
                          <span className="text-[9px] font-mono text-slate-400 uppercase">
                            {action.category}
                          </span>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-white/10 text-slate-300 border border-white/10 shrink-0">
                        {action.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION 3: Interstellar Views Navigation */}
          {filteredViews.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between px-3 py-1 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                <span className="flex items-center space-x-1.5">
                  <Compass className="w-3 h-3 text-cyan-400" />
                  <span>Interstellar Views & Telemetry ({filteredViews.length})</span>
                </span>
                <span>JUMP TO VIEW</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                {filteredViews.map((v) => {
                  const globalIdx = allActiveResults.findIndex((r) => r.type === "view" && r.item.id === v.id);
                  const isHighlighted = globalIdx === selectedIndex;
                  const Icon = v.icon;

                  return (
                    <button
                      key={v.id}
                      onClick={() => executeItem({ type: "view", item: v })}
                      className={`p-2.5 rounded-xl border transition-all duration-150 text-left flex items-center space-x-2.5 cursor-pointer ${
                        isHighlighted
                          ? "bg-white/[0.08] border-cyan-400/50 shadow-[0_0_20px_rgba(34,211,238,0.15)] ring-1 ring-cyan-400/30"
                          : "bg-white/[0.03] hover:bg-white/[0.06] border-white/5 hover:border-white/15"
                      }`}
                    >
                      <div
                        className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border border-white/10"
                        style={{ backgroundColor: `${v.color}20`, color: v.color }}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="block font-bold text-white text-xs truncate">
                          {v.title}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION 4: Audio Soundscapes */}
          {filteredAudio.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between px-3 py-1 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                <span className="flex items-center space-x-1.5">
                  <Volume2 className="w-3 h-3 text-rose-400" />
                  <span>Ambient Audio Soundscapes ({filteredAudio.length})</span>
                </span>
                <span>PROCEDURAL SYNTH</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {filteredAudio.map((s) => {
                  const globalIdx = allActiveResults.findIndex((r) => r.type === "audio" && r.item.id === s.id);
                  const isHighlighted = globalIdx === selectedIndex;
                  const Icon = s.icon;

                  return (
                    <button
                      key={s.id}
                      onClick={() => executeItem({ type: "audio", item: s })}
                      className={`p-2 rounded-xl border transition-all duration-150 text-left flex items-center justify-between cursor-pointer ${
                        isHighlighted
                          ? "bg-white/[0.08] border-rose-400/50 ring-1 ring-rose-400/30"
                          : "bg-white/[0.03] hover:bg-white/[0.06] border-white/5 hover:border-white/15"
                      }`}
                    >
                      <div className="flex items-center space-x-2 min-w-0">
                        <Icon className="w-3.5 h-3.5 text-slate-400" style={{ color: s.color }} />
                        <span className="text-xs font-semibold text-white truncate">{s.title}</span>
                      </div>
                      <span className="text-[9px] font-mono text-slate-400 uppercase px-1.5 py-0.5 rounded bg-white/5">
                        PLAY
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION 5: AI Prompts */}
          {filteredAI.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between px-3 py-1 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                <span className="flex items-center space-x-1.5">
                  <BrainCircuit className="w-3 h-3 text-indigo-400" />
                  <span>AI Cosmic Flight Guidance Prompts ({filteredAI.length})</span>
                </span>
                <span>?PROMPTS</span>
              </div>

              <div className="space-y-1">
                {filteredAI.map((ai) => {
                  const globalIdx = allActiveResults.findIndex((r) => r.type === "ai" && r.item.id === ai.id);
                  const isHighlighted = globalIdx === selectedIndex;

                  return (
                    <button
                      key={ai.id}
                      onClick={() => executeItem({ type: "ai", item: ai })}
                      className={`w-full p-2.5 rounded-xl border transition-all duration-150 text-left flex items-center justify-between gap-3 cursor-pointer ${
                        isHighlighted
                          ? "bg-white/[0.08] border-indigo-400/50 ring-1 ring-indigo-400/30"
                          : "bg-white/[0.03] hover:bg-white/[0.06] border-white/5 hover:border-white/15"
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                        <div className="min-w-0">
                          <span className="block font-bold text-white text-xs truncate">
                            {ai.title}
                          </span>
                          <span className="text-[10px] text-slate-400 truncate block font-mono">
                            "{ai.prompt}"
                          </span>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shrink-0">
                        ASK AI
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Empty State */}
          {allActiveResults.length === 0 && (
            <div className="text-center py-10 px-4 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-slate-500">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="font-display font-bold text-white text-sm">
                No orbital telemetry matches found
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto font-sans">
                Try searching for a different goal title, life sphere, or switch scope pills above.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onOpenCreate();
                }}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-xs uppercase shadow-lg transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Create New Goal for "{rawQuery}"</span>
              </button>
            </div>
          )}
        </div>

        {/* Search Wizard Footer & Keyboard Shortcuts Bar */}
        <div className="relative z-10 px-4 py-2.5 border-t border-white/10 bg-black/60 flex items-center justify-between text-[10px] font-mono text-slate-400 flex-wrap gap-2">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1">
              <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-slate-300 border border-white/10">↑↓</kbd>
              <span>Navigate</span>
            </span>
            <span className="flex items-center space-x-1">
              <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-slate-300 border border-white/10">↵</kbd>
              <span>Execute</span>
            </span>
            <span className="flex items-center space-x-1 hidden sm:flex">
              <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-slate-300 border border-white/10">/ or &gt;</kbd>
              <span>Commands</span>
            </span>
            <span className="flex items-center space-x-1 hidden md:flex">
              <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-slate-300 border border-white/10">#</kbd>
              <span>Spheres</span>
            </span>
          </div>

          <div className="flex items-center space-x-2 text-[9px] text-slate-500">
            <span>LIFEORBIT WIZARD V3</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
