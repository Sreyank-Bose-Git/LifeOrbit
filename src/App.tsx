import { focusAudio } from "./lib/audio";
import React, { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { EndeavorCard } from "./components/EndeavorCard";
import { CreateEndeavorModal } from "./components/CreateEndeavorModal";
import { QuickLogModal } from "./components/QuickLogModal";
import { TimelineView } from "./components/TimelineView";
import { FocusMode } from "./components/FocusMode";
import { InsightsView } from "./components/InsightsView";
import { AICopilotView } from "./components/AICopilotView";
import { SettingsView } from "./components/SettingsView";
import { SetupWizardModal } from "./components/SetupWizardModal";
import { BackupModal } from "./components/BackupModal";
import { DeviceIntegrationsModal } from "./components/DeviceIntegrationsModal";
import { CommandPaletteModal } from "./components/CommandPaletteModal";
import { EndeavorDetailModal } from "./components/EndeavorDetailModal";
import { DailyBriefingWidget } from "./components/DailyBriefingWidget";
import { ProfileHubModal } from "./components/ProfileHubModal";
import { AmbientBackground } from "./components/AmbientBackground";
import { HabitMatrixView } from "./components/HabitMatrixView";
import { RoadmapView } from "./components/RoadmapView";
import { TrophiesView } from "./components/TrophiesView";
import { MiniFocusPlayer } from "./components/MiniFocusPlayer";
import { OrbitQueueDrawer } from "./components/OrbitQueueDrawer";
import { BreadcrumbsBar } from "./components/BreadcrumbsBar";
import { FeaturedBillboardCard } from "./components/FeaturedBillboardCard";
import { EndeavorRowCarousel } from "./components/EndeavorRowCarousel";
import { SandboxView } from "./components/SandboxView";
import { LifeSphereOrb } from "./components/LifeSphereOrb";
import { EyeComfortManager } from "./components/EyeComfortManager";
import { storage } from "./lib/storage";
import { THEME_ACCENTS } from "./lib/theme";
import {
  Endeavor,
  ProgressLog,
  TimeBlock,
  UserStats,
  UserProfile,
  UserProfileAccount,
  ViewTab,
  CardLayoutMode,
  UIThemeConfig,
} from "./types";
import {
  Sparkles,
  Plus,
  Search,
  Zap,
  Menu,
  Layers,
  Command,
  Users,
  Sliders,
  LayoutGrid,
  Kanban,
  List,
  Tv,
  Orbit,
  Flame,
  CheckCircle2,
  Clock,
  Flag,
  PanelRight,
  TrendingUp,
  Activity,
  Award,
  Calendar,
  Target,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";

const TAB_PAGE_VARIANTS = {
  initial: { opacity: 0, y: 14, filter: "blur(4px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.32,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    filter: "blur(2px)",
    transition: {
      duration: 0.18,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function App() {
  const [activeTab, setActiveTab] = useState<ViewTab>("tracker");
  const [endeavors, setEndeavors] = useState<Endeavor[]>([]);
  const [logs, setLogs] = useState<ProgressLog[]>([]);
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([]);
  const [stats, setStats] = useState<UserStats>(storage.getStats());
  const [profile, setProfile] = useState<UserProfile>(storage.getProfile());
  const [profiles, setProfiles] = useState<UserProfileAccount[]>(storage.getProfiles());
  const [activeProfileId, setActiveProfileId] = useState<string>(storage.getActiveProfileId());

  // Sidebar Open / Collapsed State
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
    const saved = localStorage.getItem("lifeorbit_sidebar_open");
    return saved !== null ? saved === "true" : true;
  });

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => {
      const next = !prev;
      localStorage.setItem("lifeorbit_sidebar_open", String(next));
      return next;
    });
  };

  // YouTube-Style Right Context Panel (Orbit Queue Drawer)
  const [isOrbitQueueOpen, setIsOrbitQueueOpen] = useState(false);

  // Card Layout Mode: Curated (Netflix/Prime Rails), Grid (YouTube), Board (Kanban), List (Obsidian)
  const [cardLayoutMode, setCardLayoutMode] = useState<CardLayoutMode>("curated");

  // YouTube-Style Horizontal Filter Chips & Presets
  const [filterPreset, setFilterPreset] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedArchetype, setSelectedArchetype] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Persistent Mini Focus Player State
  const [focusTimer, setFocusTimer] = useState<{
    endeavor: Endeavor | null;
    isActive: boolean;
    isPaused: boolean;
    totalSeconds: number;
    secondsRemaining: number;
    mode: "pomodoro" | "deep" | "shortBreak";
    soundMode: "none" | "binaural" | "noise" | "rain";
    volume: number;
    sessionNotes: string;
  }>({
    endeavor: null,
    isActive: false,
    isPaused: false,
    totalSeconds: 25 * 60,
    secondsRemaining: 25 * 60,
    mode: "pomodoro",
    soundMode: "none",
    volume: 0.2,
    sessionNotes: "",
  });

  // Modal States
  const [isSetupWizardOpen, setIsSetupWizardOpen] = useState(false);
  const [isProfileHubOpen, setIsProfileHubOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [selectedEndeavorForLog, setSelectedEndeavorForLog] = useState<Endeavor | null>(null);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isIntegrationsModalOpen, setIsIntegrationsModalOpen] = useState(false);
  const [focusTargetEndeavor, setFocusTargetEndeavor] = useState<Endeavor | null>(null);

  // New Detail & Command Palette Modals
  const [selectedEndeavorForDetail, setSelectedEndeavorForDetail] = useState<Endeavor | null>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Load from local-first storage on mount
  const loadData = () => {
    const currentActiveId = storage.getActiveProfileId();
    const loadedEndeavors = storage.getEndeavors(currentActiveId).map(e => ({
      ...e,
      id: e.id || `end-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      history: e.history || {},
      streakCount: e.streakCount || 0,
      bestStreak: e.bestStreak || 0,
      milestones: e.milestones || [],
    }));
    const loadedLogs = storage.getLogs(currentActiveId);
    const loadedTimeBlocks = storage.getTimeBlocks(currentActiveId);
    const loadedStats = storage.getStats(currentActiveId);
    const loadedProfile = storage.getProfile(currentActiveId);
    const loadedProfiles = storage.getProfiles();

    setEndeavors(loadedEndeavors);
    setLogs(loadedLogs);
    setTimeBlocks(loadedTimeBlocks);
    setStats(loadedStats);
    setProfile(loadedProfile);
    setProfiles(loadedProfiles);
    setActiveProfileId(currentActiveId);

    // Auto-prompt setup wizard if brand new setup
    if (!loadedProfile.isSetupCompleted) {
      setIsSetupWizardOpen(true);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Persistent Focus Timer Countdown Engine
  useEffect(() => {
    let interval: any = null;
    if (focusTimer.isActive && !focusTimer.isPaused && focusTimer.secondsRemaining > 0) {
      interval = setInterval(() => {
        setFocusTimer((prev) => ({ ...prev, secondsRemaining: prev.secondsRemaining - 1 }));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [focusTimer.isActive, focusTimer.isPaused, focusTimer.secondsRemaining]);

  // Handle Focus Timer Completion
  useEffect(() => {
    if (focusTimer.isActive && focusTimer.secondsRemaining === 0) {
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
      if (focusTimer.endeavor) {
        const durationMinutes = Math.floor(focusTimer.totalSeconds / 60);
        handleFinishFocusSession(focusTimer.endeavor.id, durationMinutes, focusTimer.sessionNotes || "Completed deep focus sprint!");
      }
      setFocusTimer(prev => ({
        ...prev,
        isActive: false,
        isPaused: false,
        secondsRemaining: prev.totalSeconds
      }));
    }
  }, [focusTimer.secondsRemaining, focusTimer.isActive]);

  // Multi-Profile Switcher Handler (Netflix-style)
  const handleSelectProfile = (profileId: string) => {
    storage.setActiveProfileId(profileId);
    loadData();
    const matched = storage.getProfiles().find((p) => p.id === profileId);
    const pName = matched ? matched.name : "New Space";
    showToast(`Switched space to: ${pName}`);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
  };

  const handleCreateProfile = (profileData: Partial<UserProfileAccount>) => {
    const newProfile = storage.createProfile(profileData);
    loadData();
    showToast(`Created space: ${newProfile.name}`);
  };

  const handleUpdateProfile = (updatedProfile: UserProfileAccount) => {
    storage.updateProfile(updatedProfile);
    loadData();
    showToast(`Updated space: ${updatedProfile.name}`);
  };

  const handleDeleteProfile = (profileId: string) => {
    const remaining = storage.deleteProfile(profileId);
    loadData();
    showToast("Profile deleted");
  };

  // Global Keyboard Shortcuts (Cmd+K for Command Palette, Cmd+P for Profile Hub, Cmd+J for Orbit Queue)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "p") {
        e.preventDefault();
        setIsProfileHubOpen((prev) => !prev);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "j") {
        e.preventDefault();
        setIsOrbitQueueOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const currentTheme = THEME_ACCENTS[profile.themeConfig?.accent] || THEME_ACCENTS.emerald;

  // Save profile changes
  const handleSaveProfile = (updatedProfile: UserProfile, generatedEndeavors?: Endeavor[]) => {
    setProfile(updatedProfile);
    storage.saveProfile(updatedProfile);

    if (generatedEndeavors && generatedEndeavors.length > 0) {
      const mergedEndeavors = [...generatedEndeavors, ...endeavors];
      setEndeavors(mergedEndeavors);
      storage.saveEndeavors(mergedEndeavors);
      showToast(`Added ${generatedEndeavors.length} AI-tailored starter goals!`);
    }

    awardXP(100, "Workspace Customization & Profile Configured");
    showToast("Profile updated!");
  };

  const handleUpdateThemeConfig = (newConfig: Partial<UIThemeConfig>) => {
    const updatedProfile: UserProfile = {
      ...profile,
      themeConfig: {
        ...profile.themeConfig,
        ...newConfig,
      },
    };
    setProfile(updatedProfile);
    storage.saveProfile(updatedProfile);
  };

  // Award XP and update stats
  const awardXP = (amount: number, reason: string) => {
    setStats((prev) => {
      const newXp = prev.xp + amount;
      const newPoints = prev.points + amount;
      const newLevel = Math.floor(newXp / 500) + 1;
      const updated: UserStats = {
        ...prev,
        xp: newXp,
        points: newPoints,
        level: newLevel,
        totalCheckIns: prev.totalCheckIns + 1,
      };
      storage.saveStats(updated);
      showToast(`+${amount} XP: ${reason}`);
      return updated;
    });
  };

  // Reset defaults handler
  const handleResetDefaults = () => {
    storage.resetDefaults();
    loadData();
    showToast("Defaults restored.");
  };

  // Quick Log Handler
  const handleQuickLog = (endeavor: Endeavor, value: number, note?: string) => {
    const todayStr = new Date().toISOString().split("T")[0];
    const updatedEndeavors = endeavors.map((e) => {
      if (e.id !== endeavor.id) return e;

      let newCurrent = Math.max(0, e.currentValue + value);
      const currentDayVal = e.history?.[todayStr] || 0;
      const newDayVal = Math.max(0, currentDayVal + value);

      // Streak calculation
      let newStreak = e.streakCount;
      if (value > 0 && currentDayVal === 0) {
        newStreak += 1;
      }

      const updatedItem: Endeavor = {
        ...e,
        currentValue: newCurrent,
        streakCount: newStreak,
        bestStreak: Math.max(e.bestStreak || 0, newStreak),
        history: {
          ...e.history,
          [todayStr]: newDayVal,
        },
        updatedAt: new Date().toISOString(),
      };

      if (e.archetype === "meter" && newCurrent >= e.targetValue && e.currentValue < e.targetValue) {
        confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
        awardXP(150, `Target reached: ${e.title}!`);
      }

      return updatedItem;
    });

    setEndeavors(updatedEndeavors);
    storage.saveEndeavors(updatedEndeavors);

    // Also record a log entry
    const newLog: ProgressLog = {
      id: "log-" + Date.now(),
      endeavorId: endeavor.id,
      value,
      timestamp: new Date().toISOString(),
      note: note || undefined,
    };
    const updatedLogs = [newLog, ...logs];
    setLogs(updatedLogs);
    storage.saveLogs(updatedLogs);

    // Keep detail modal updated if open
    if (selectedEndeavorForDetail && selectedEndeavorForDetail.id === endeavor.id) {
      const refreshed = updatedEndeavors.find((e) => e.id === endeavor.id);
      if (refreshed) setSelectedEndeavorForDetail(refreshed);
    }

    awardXP(25, `Progress logged on ${endeavor.title}`);
  };

  // Check in habit from daily briefing
  const handleCheckInHabit = (endeavorId: string) => {
    const target = endeavors.find((e) => e.id === endeavorId);
    if (target) {
      handleQuickLog(target, 1, "Completed daily habit routine");
    }
  };

  // Toggle milestone completion
  const handleToggleMilestone = (endeavorId: string, milestoneId: string) => {
    const updatedEndeavors = endeavors.map((e) => {
      if (e.id !== endeavorId) return e;

      const updatedMilestones = e.milestones.map((m) => {
        if (m.id === milestoneId) {
          const nextState = !m.completed;
          if (nextState) {
            confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
            awardXP(50, `Milestone completed: ${m.title}`);
          }
          return {
            ...m,
            completed: nextState,
            completedAt: nextState ? new Date().toISOString() : undefined,
          };
        }
        return m;
      });

      let nextVal = e.currentValue;
      if (e.archetype === "milestone" && updatedMilestones.length > 0) {
        const completedCount = updatedMilestones.filter((m) => m.completed).length;
        nextVal = Math.round((completedCount / updatedMilestones.length) * 100);
      }

      return {
        ...e,
        milestones: updatedMilestones,
        currentValue: nextVal,
        updatedAt: new Date().toISOString(),
      };
    });

    setEndeavors(updatedEndeavors);
    storage.saveEndeavors(updatedEndeavors);

    if (selectedEndeavorForDetail && selectedEndeavorForDetail.id === endeavorId) {
      const refreshed = updatedEndeavors.find((e) => e.id === endeavorId);
      if (refreshed) setSelectedEndeavorForDetail(refreshed);
    }
  };

    // Save new or edited endeavor
  const handleSaveEndeavor = (incoming: any) => {
    const isNew = !incoming.id;
    const finalEndeavor: Endeavor = isNew
      ? {
          ...incoming,
          id: `end-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          history: {},
          streakCount: 0,
          bestStreak: 0,
        }
      : incoming;

    const exists = endeavors.some((e) => e.id === finalEndeavor.id);
    let updated: Endeavor[];
    if (exists) {
      updated = endeavors.map((e) => (e.id === finalEndeavor.id ? finalEndeavor : e));
      showToast(`Updated "${finalEndeavor.title}"`);
    } else {
      updated = [finalEndeavor, ...endeavors];
      awardXP(50, `Created endeavor "${finalEndeavor.title}"`);
      showToast(`Created "${finalEndeavor.title}"`);
    }
    setEndeavors(updated);
    storage.saveEndeavors(updated);
    if (selectedEndeavorForDetail && selectedEndeavorForDetail.id === finalEndeavor.id) {
      setSelectedEndeavorForDetail(finalEndeavor);
    }
  };

  // Delete endeavor
  const handleDeleteEndeavor = (endeavorId: string) => {
    const updated = endeavors.filter((e) => e.id !== endeavorId);
    setEndeavors(updated);
    storage.saveEndeavors(updated);
    showToast("Endeavor deleted");
  };

  // Toggle Date Log in Habit Matrix
  const handleToggleDateLog = (endeavor: Endeavor, dateStr: string) => {
    const isLogged = (endeavor.history?.[dateStr] || 0) > 0;
    const nextVal = isLogged ? 0 : 1;
    const updatedHistory = { ...endeavor.history, [dateStr]: nextVal };

    // Calculate streak
    let streak = 0;
    const checkDate = new Date();
    while (true) {
      const dStr = checkDate.toISOString().split("T")[0];
      if ((updatedHistory[dStr] || 0) > 0) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    const updated: Endeavor = {
      ...endeavor,
      currentValue: nextVal > 0 ? endeavor.currentValue + 1 : Math.max(0, endeavor.currentValue - 1),
      streakCount: streak,
      bestStreak: Math.max(endeavor.bestStreak || 0, streak),
      history: updatedHistory,
      updatedAt: new Date().toISOString(),
    };

    handleSaveEndeavor(updated);
    if (!isLogged) {
      awardXP(20, `Logged ritual for ${dateStr}`);
    }
  };

  // Quick Scratchpad save
  const handleSaveQuickNote = (note: string) => {
    const updated: UserProfile = { ...profile, customNotes: note };
    handleSaveProfile(updated);
    showToast("Scratchpad notes saved");
  };

  // Start deep focus session on an endeavor
  const handleStartFocus = (endeavor: Endeavor) => {
    setFocusTargetEndeavor(endeavor);
    setFocusTimer((prev) => ({
      ...prev,
      endeavor,
      isActive: true,
      isPaused: false,
      totalSeconds: 25 * 60,
      secondsRemaining: 25 * 60,
      mode: "pomodoro",
    }));
    setActiveTab("focus");
    showToast(`Focus sprint armed for ${endeavor.title}`);
  };

  // Finish focus session
  const handleFinishFocusSession = (endeavorId: string, durationMinutes: number, notes: string) => {
    focusAudio.stop();
    const matched = endeavors.find((e) => e.id === endeavorId);
    if (matched) {
      handleQuickLog(matched, 1, `Focus session (${durationMinutes}m): ${notes}`);
    }
    awardXP(durationMinutes * 5, `Completed ${durationMinutes}m focus sprint!`);
    showToast(`Focus session recorded! +${durationMinutes * 5} XP`);
  };

  // Add TimeBlock
  const handleAddTimeBlock = (newBlock: TimeBlock) => {
    const updated = [...timeBlocks, newBlock];
    setTimeBlocks(updated);
    storage.saveTimeBlocks(updated);
    awardXP(15, "Scheduled time block");
  };

  // Toggle TimeBlock completion
  const handleToggleTimeBlock = (id: string) => {
    const updated = timeBlocks.map((b) => {
      if (b.id === id) {
        const next = !b.completed;
        if (next) {
          confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
          awardXP(20, `Completed block: ${b.title}`);
        }
        return { ...b, completed: next };
      }
      return b;
    });
    setTimeBlocks(updated);
    storage.saveTimeBlocks(updated);
  };

  // Delete TimeBlock
  const handleDeleteTimeBlock = (id: string) => {
    const updated = timeBlocks.filter((b) => b.id !== id);
    setTimeBlocks(updated);
    storage.saveTimeBlocks(updated);
    showToast("Block removed");
  };

  // Passive sync simulator
  const handleSimulatePassiveSync = (connectorId: string, count: number) => {
    const matched = endeavors.find((e) => e.archetype === "meter" || e.archetype === "habit");
    if (matched) {
      handleQuickLog(matched, count, `Passive auto-sync from connector`);
      showToast(`Passive synced ${count} ${matched.unit} to ${matched.title}`);
    }
  };

  // Filtered Endeavors with YouTube-style filter presets
  const filteredEndeavors = endeavors.filter((e) => {
    // Preset matching
    if (filterPreset === "streaks" && e.streakCount === 0) return false;
    if (filterPreset === "habits" && e.archetype !== "habit") return false;
    if (filterPreset === "meters" && e.archetype !== "meter") return false;
    if (filterPreset === "milestones" && e.archetype !== "milestone") return false;
    if (filterPreset === "nearComplete") {
      const pct = e.archetype === "milestone"
        ? e.currentValue
        : ((e.currentValue - e.startValue) / (e.targetValue - e.startValue || 1)) * 100;
      if (pct < 75) return false;
    }
    if (
      ["health", "career", "learning", "finance", "mindfulness", "creative", "personal"].includes(filterPreset) &&
      e.category !== filterPreset
    ) {
      return false;
    }

    const matchesCategory = selectedCategory === "all" || e.category === selectedCategory;
    const matchesArchetype = selectedArchetype === "all" || e.archetype === selectedArchetype;
    const matchesSearch =
      searchQuery === "" ||
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesArchetype && matchesSearch;
  });

  return (
    <div className="h-screen w-screen overflow-hidden bg-black text-slate-100 flex p-2 sm:p-3 gap-2 sm:gap-3 antialiased selection:bg-emerald-500 selection:text-black relative">
      {/* Eye Comfort Filter & 20-20-20 Optic Health Manager */}
      <EyeComfortManager
        themeConfig={profile.themeConfig}
        onUpdateThemeConfig={handleUpdateThemeConfig}
      />

      {/* Dynamic Ambient Background Canvas & Glow */}
      <AmbientBackground
        mode={profile.themeConfig?.ambientBackground || "aurora"}
        accent={profile.themeConfig?.accent || "emerald"}
        reducedMotion={profile.themeConfig?.reducedMotion}
        softGlow={profile.themeConfig?.softGlow}
        isWarmMode={profile.themeConfig?.eyeComfortPreset !== "off"}
      />

      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={stats}
        profile={profile}
        isOpen={isSidebarOpen}
        onToggleOpen={handleToggleSidebar}
        onOpenCreate={() => setIsCreateModalOpen(true)}
        onOpenBackup={() => setIsBackupModalOpen(true)}
        onOpenIntegrations={() => setIsIntegrationsModalOpen(true)}
        onOpenSetupWizard={() => setIsSetupWizardOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenProfileHub={() => setIsProfileHubOpen(true)}
      />

      {/* Main Content Area (Floating Island) */}
      <div className="flex-1 bg-[#0A0A0A]/90 backdrop-blur-3xl sm:rounded-[32px] rounded-2xl border border-white/5 h-full overflow-y-auto flex flex-col min-w-0 relative z-10 focus:outline-none shadow-[0_0_80px_rgba(0,0,0,0.8)] ring-1 ring-white/5">
        {/* Mobile Header Bar */}
        <header className="md:hidden sticky top-0 z-30 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleToggleSidebar}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl cursor-pointer active:scale-95 transition"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-bold text-white text-sm uppercase tracking-wider">
              {profile.themeConfig?.customAppTitle || "LifeOrbit OS"}
            </span>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setIsOrbitQueueOpen((prev) => !prev)}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl cursor-pointer active:scale-95 transition"
              title="Toggle Today's Queue & Shelf (Cmd+J)"
            >
              <PanelRight className="w-4 h-4 text-emerald-400" />
            </button>

            <button
              onClick={() => setIsProfileHubOpen(true)}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-sm border border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer transition active:scale-95"
              title="Switch Space / Profile"
            >
              <span>{profile.avatarIcon || "🚀"}</span>
            </button>

            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl cursor-pointer active:scale-95 transition"
              title="Command Palette"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className={`p-2 rounded-xl ${currentTheme.buttonBg} ${currentTheme.buttonText} font-bold shadow-xs active:scale-95`}
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </header>

        {/* Floating Toast Notification */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              key="toast-message-global"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="fixed top-6 right-6 z-50 bg-white/[0.04]/95 backdrop-blur-md text-slate-200 px-4 py-2.5 rounded-2xl shadow-2xl border border-white/10 text-xs font-semibold flex items-center space-x-2"
            >
              <Zap className={`w-4 h-4 ${currentTheme.textAccent} fill-current`} />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Notion/Obsidian Breadcrumbs Navigation & System Telemetry Bar */}
        <BreadcrumbsBar
          activeTab={activeTab}
          selectedCategory={selectedCategory}
          profile={profile}
          stats={stats}
          isOrbitQueueOpen={isOrbitQueueOpen}
          onToggleOrbitQueue={() => setIsOrbitQueueOpen((prev) => !prev)}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onOpenProfileHub={() => setIsProfileHubOpen(true)}
          onUpdateThemeConfig={handleUpdateThemeConfig}
          onNavigateTab={(tab) => {
            focusAudio.playClick();
            setActiveTab(tab);
          }}
        />

        {/* Content Container */}
        <main className="flex-1 w-full max-w-[1400px] mx-auto px-5 sm:px-10 py-8 sm:py-12 space-y-8">
          <AnimatePresence mode="wait">
            {/* VIEW 1: UNIVERSAL TRACKER (Macro Overview & YouTube-Style Feed) */}
            {activeTab === "tracker" && (
              <motion.div
                key="tab-tracker"
                variants={TAB_PAGE_VARIANTS}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-6"
              >
                {/* Stylized Celestial Life Spheres Orbit Bar */}
                <div className="flex items-center space-x-4 sm:space-x-5 overflow-x-auto pb-3 pt-1 scrollbar-none">
                  <LifeSphereOrb
                    sphereId="all"
                    isSelected={selectedCategory === "all"}
                    count={endeavors.length}
                    size="md"
                    onClick={() => {
                      focusAudio.playClick();
                      setSelectedCategory("all");
                    }}
                  />

                  {(
                    [
                      "health",
                      "career",
                      "learning",
                      "finance",
                      "mindfulness",
                      "creative",
                      "personal",
                    ] as const
                  ).map((sphereId) => {
                    const isSelected = selectedCategory === sphereId;
                    const count = endeavors.filter((e) => e.category === sphereId).length;
                    return (
                      <LifeSphereOrb
                        key={sphereId}
                        sphereId={sphereId}
                        isSelected={isSelected}
                        count={count}
                        size="md"
                        onClick={() => {
                          focusAudio.playClick();
                          setSelectedCategory(isSelected ? "all" : sphereId);
                        }}
                      />
                    );
                  })}
                </div>

                {/* Daily Routine & Momentum Briefing Hero */}
                <DailyBriefingWidget
                  profile={profile}
                  stats={stats}
                  endeavors={endeavors}
                  onCheckInHabit={handleCheckInHabit}
                  onStartFocus={handleStartFocus}
                  onOpenCreate={() => setIsCreateModalOpen(true)}
                />

                {/* Workspace Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/5">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                        {profile.name ? `${profile.name}'s Endeavors` : "Active Endeavors"}
                      </h1>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/5">
                        {filteredEndeavors.length}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      {profile.northStarMotto || "Local-first activity tracker for habits, meters, and project milestones."}
                    </p>
                  </div>

                  {/* Clean Actions */}
                  <div className="flex items-center space-x-2.5 shrink-0">
                    <button
                      onClick={() => setIsOrbitQueueOpen((prev) => !prev)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold border cursor-pointer active:scale-95 transition-all duration-150 ${
                        isOrbitQueueOpen
                          ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300"
                          : "bg-white/[0.04] hover:bg-white/10 text-slate-300 hover:text-white border-white/5 hover:border-white/15"
                      }`}
                      title="Toggle Today's Orbit Queue (Cmd+J)"
                    >
                      <PanelRight className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="hidden sm:inline">Orbit Shelf</span>
                    </button>

                    <button
                      onClick={() => setIsProfileHubOpen(true)}
                      className="flex items-center space-x-2 px-3 py-2 bg-white/[0.04] hover:bg-white/10 text-slate-200 hover:text-white rounded-xl text-xs font-semibold border border-white/5 hover:border-white/15 cursor-pointer active:scale-95 transition-all duration-150 group"
                      title="Switch workspace / account profile (Netflix style)"
                    >
                      <span className="text-base group-hover:scale-110 transition-transform">{profile.avatarIcon || "🚀"}</span>
                      <span className="hidden md:inline font-bold">{profile.name}</span>
                      <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded">Space</span>
                    </button>

                    <button
                      onClick={() => setIsCommandPaletteOpen(true)}
                      className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-white/[0.04] hover:bg-white/10 text-slate-300 hover:text-white rounded-xl text-xs font-semibold border border-white/5 hover:border-white/15 cursor-pointer active:scale-95 transition-all duration-150"
                    >
                      <Command className="w-3.5 h-3.5 text-slate-400" />
                      <span>Cmd+K</span>
                    </button>

                    <button
                      onClick={() => setActiveTab("copilot")}
                      className="flex items-center space-x-2 px-3.5 py-2 bg-white/[0.04] hover:bg-white/10 text-slate-200 hover:text-white rounded-xl text-xs font-semibold border border-white/5 hover:border-white/15 cursor-pointer active:scale-95 transition-all duration-150"
                    >
                      <Sparkles className={`w-3.5 h-3.5 ${currentTheme.textAccent}`} />
                      <span>AI Coach</span>
                    </button>

                    <button
                      onClick={() => setIsCreateModalOpen(true)}
                      className={`flex items-center space-x-2 px-4 py-2 ${currentTheme.buttonBg} ${currentTheme.buttonHover} active:scale-95 ${currentTheme.buttonText} rounded-xl text-xs font-bold shadow-md hover:shadow-lg cursor-pointer transition-all duration-150`}
                    >
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                      <span>New Goal</span>
                    </button>
                  </div>
                </div>

                {/* YouTube-Style Filter Ribbon & View Controls */}
                <div className="bg-white/[0.02] rounded-2xl p-3 sm:p-4 border border-white/5 space-y-3">
                  {/* Row 1: YouTube-Style Horizontal Filter Chips */}
                  <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none text-xs">
                    {[
                      { id: "all", label: "All Spheres" },
                      { id: "streaks", label: "🔥 Active Streaks" },
                      { id: "habits", label: "⚡ Daily Rituals" },
                      { id: "meters", label: "📊 In-Flight Meters" },
                      { id: "milestones", label: "🎯 Projects & Horizons" },
                      { id: "nearComplete", label: "🏆 Near 100%" },
                      { id: "career", label: "💼 Career" },
                      { id: "health", label: "❤️ Health" },
                      { id: "learning", label: "🧠 Learning" },
                      { id: "finance", label: "💎 Finance" },
                      { id: "mindfulness", label: "🧘 Mindfulness" },
                      { id: "creative", label: "🎨 Creative" },
                    ].map((chip) => (
                      <button
                        key={chip.id}
                        onClick={() => setFilterPreset(chip.id)}
                        className={`px-3.5 py-1.5 rounded-xl font-semibold cursor-pointer active:scale-95 transition-all duration-150 shrink-0 relative z-0 hover:z-10 ${
                          filterPreset === chip.id
                            ? "bg-white/20 text-white shadow-xs border border-white/20"
                            : "bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10"
                        }`}
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>

                  {/* Row 2: Search, Type, and View Switcher (Grid / Board / List) */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1 border-t border-white/5">
                    {/* Search Field with Quick Wizard Launcher */}
                    <div className="relative flex-1 max-w-md flex items-center">
                      <Search className="w-3.5 h-3.5 text-emerald-400 absolute left-3 top-2.5 pointer-events-none" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Quick filter inline or press ⌘K for Search Wizard..."
                        className="w-full pl-8 pr-16 py-1.5 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors font-sans"
                      />
                      <div className="absolute right-2 flex items-center space-x-1">
                        {searchQuery && (
                          <button
                            onClick={() => setSearchQuery("")}
                            className="text-slate-400 hover:text-white p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                        <button
                          onClick={() => setIsCommandPaletteOpen(true)}
                          className="px-1.5 py-0.5 bg-white/10 hover:bg-white/20 text-slate-300 text-[10px] font-mono rounded border border-white/10 transition cursor-pointer"
                          title="Open Cosmic Search Wizard (Cmd+K)"
                        >
                          ⌘K
                        </button>
                      </div>
                    </div>

                    {/* View Mode Switcher (Curated Netflix Rails vs YouTube Grid vs Kanban Board vs Dense List vs Sandbox) */}
                    <div className="flex items-center space-x-1.5 self-end sm:self-center bg-white/[0.04] p-1 rounded-xl border border-white/5">
                      <button
                        onClick={() => setCardLayoutMode("curated")}
                        className={`p-1.5 rounded-lg text-xs font-semibold cursor-pointer transition flex items-center space-x-1.5 ${
                          cardLayoutMode === "curated"
                            ? "bg-white/15 text-white shadow-xs"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                        title="Netflix/Prime Curated Horizons View"
                      >
                        <Tv className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[11px] hidden sm:inline">Curated</span>
                      </button>

                      <button
                        onClick={() => setCardLayoutMode("sandbox")}
                        className={`p-1.5 rounded-lg text-xs font-semibold cursor-pointer transition flex items-center space-x-1.5 ${
                          cardLayoutMode === "sandbox"
                            ? "bg-white/15 text-white shadow-xs"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                        title="Cosmic Sandbox Physics Canvas"
                      >
                        <Orbit className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-[11px] hidden sm:inline">Sandbox</span>
                      </button>

                      <button
                        onClick={() => setCardLayoutMode("grid")}
                        className={`p-1.5 rounded-lg text-xs font-semibold cursor-pointer transition flex items-center space-x-1.5 ${
                          cardLayoutMode === "grid"
                            ? "bg-white/15 text-white shadow-xs"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                        title="Grid Feed View"
                      >
                        <LayoutGrid className="w-3.5 h-3.5" />
                        <span className="text-[11px] hidden sm:inline">Grid</span>
                      </button>

                      <button
                        onClick={() => setCardLayoutMode("board")}
                        className={`p-1.5 rounded-lg text-xs font-semibold cursor-pointer transition flex items-center space-x-1.5 ${
                          cardLayoutMode === "board"
                            ? "bg-white/15 text-white shadow-xs"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                        title="Kanban Board View"
                      >
                        <Kanban className="w-3.5 h-3.5" />
                        <span className="text-[11px] hidden sm:inline">Board</span>
                      </button>

                      <button
                        onClick={() => setCardLayoutMode("list")}
                        className={`p-1.5 rounded-lg text-xs font-semibold cursor-pointer transition flex items-center space-x-1.5 ${
                          cardLayoutMode === "list"
                            ? "bg-white/15 text-white shadow-xs"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                        title="Compact List View"
                      >
                        <List className="w-3.5 h-3.5" />
                        <span className="text-[11px] hidden sm:inline">List</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Endeavors Content Display */}
                {filteredEndeavors.length === 0 ? (
                  <div className="bg-white/[0.02] rounded-3xl p-12 text-center border border-white/5">
                    <Layers className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                    <h3 className="text-sm font-bold text-slate-300">No endeavors match your current filter</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                      Create a new habit, measurable target, or project milestone to begin tracking.
                    </p>
                    <button
                      onClick={() => setIsCreateModalOpen(true)}
                      className={`inline-flex items-center space-x-2 px-4 py-2 ${currentTheme.buttonBg} ${currentTheme.buttonHover} ${currentTheme.buttonText} font-bold rounded-xl text-xs cursor-pointer active:scale-95 transition`}
                    >
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                      <span>Create Endeavor</span>
                    </button>
                  </div>
                ) : cardLayoutMode === "sandbox" ? (
                  /* COSMIC SANDBOX CANVAS VIEW */
                  <SandboxView
                    endeavors={filteredEndeavors}
                    profile={profile}
                    stats={stats}
                    onQuickLog={handleQuickLog}
                    onOpenLogModal={(e) => {
                      setSelectedEndeavorForLog(e);
                      setIsLogModalOpen(true);
                    }}
                    onStartFocus={handleStartFocus}
                    onOpenDetail={(e) => setSelectedEndeavorForDetail(e)}
                    onOpenCreate={() => setIsCreateModalOpen(true)}
                  />
                ) : cardLayoutMode === "curated" ? (
                  /* NETFLIX / PRIME VIDEO CURATED RAILS VIEW */
                  <div className="space-y-10">
                    {/* Featured Billboard Spotlight */}
                    <FeaturedBillboardCard
                      endeavors={filteredEndeavors}
                      onQuickLog={handleQuickLog}
                      onStartFocus={handleStartFocus}
                      onOpenDetail={(e) => setSelectedEndeavorForDetail(e)}
                    />

                    {/* Curated Rails */}
                    {searchQuery.trim() === "" && filterPreset === "all" && selectedCategory === "all" ? (
                      <div className="space-y-8">
                        {/* 1. In Active Flight */}
                        <EndeavorRowCarousel
                          title="In Active Flight"
                          subtitle="Endeavors actively in motion across your key horizons"
                          icon={Layers}
                          badge="ACTIVE ORBIT"
                          endeavors={endeavors.filter((e) => e.status === "active" && e.currentValue > 0 && e.currentValue < e.targetValue)}
                          onQuickLog={handleQuickLog}
                          onOpenLogModal={(e) => {
                            setSelectedEndeavorForLog(e);
                            setIsLogModalOpen(true);
                          }}
                          onToggleMilestone={handleToggleMilestone}
                          onStartFocus={handleStartFocus}
                          onEdit={(e) => {
                            setSelectedEndeavorForLog(e);
                            setIsLogModalOpen(true);
                          }}
                          onDelete={handleDeleteEndeavor}
                          onOpenDetail={(e) => setSelectedEndeavorForDetail(e)}
                        />

                        {/* 2. Streak Leaders */}
                        <EndeavorRowCarousel
                          title="Streak Leaders & High Momentum"
                          subtitle="Daily consistency compounding into exponential growth"
                          icon={Flame}
                          badge="HOT STREAKS"
                          badgeColor="text-amber-300 bg-amber-500/10 border-amber-500/20"
                          endeavors={endeavors.filter((e) => e.streakCount > 0)}
                          onQuickLog={handleQuickLog}
                          onOpenLogModal={(e) => {
                            setSelectedEndeavorForLog(e);
                            setIsLogModalOpen(true);
                          }}
                          onToggleMilestone={handleToggleMilestone}
                          onStartFocus={handleStartFocus}
                          onEdit={(e) => {
                            setSelectedEndeavorForLog(e);
                            setIsLogModalOpen(true);
                          }}
                          onDelete={handleDeleteEndeavor}
                          onOpenDetail={(e) => setSelectedEndeavorForDetail(e)}
                        />

                        {/* 3. Daily Rituals */}
                        <EndeavorRowCarousel
                          title="Daily Rituals & Check-ins"
                          subtitle="High-frequency habits designed for daily execution"
                          icon={CheckCircle2}
                          badge="DAILY RITUALS"
                          badgeColor="text-cyan-300 bg-cyan-500/10 border-cyan-500/20"
                          endeavors={endeavors.filter((e) => e.archetype === "habit")}
                          onQuickLog={handleQuickLog}
                          onOpenLogModal={(e) => {
                            setSelectedEndeavorForLog(e);
                            setIsLogModalOpen(true);
                          }}
                          onToggleMilestone={handleToggleMilestone}
                          onStartFocus={handleStartFocus}
                          onEdit={(e) => {
                            setSelectedEndeavorForLog(e);
                            setIsLogModalOpen(true);
                          }}
                          onDelete={handleDeleteEndeavor}
                          onOpenDetail={(e) => setSelectedEndeavorForDetail(e)}
                        />

                        {/* 4. Milestone Projects */}
                        <EndeavorRowCarousel
                          title="Milestone Horizons & Projects"
                          subtitle="Multi-phase goals with strategic roadmap checkpoints"
                          icon={Flag}
                          badge="PROJECT ROADMAP"
                          badgeColor="text-purple-300 bg-purple-500/10 border-purple-500/20"
                          endeavors={endeavors.filter((e) => e.archetype === "milestone")}
                          onQuickLog={handleQuickLog}
                          onOpenLogModal={(e) => {
                            setSelectedEndeavorForLog(e);
                            setIsLogModalOpen(true);
                          }}
                          onToggleMilestone={handleToggleMilestone}
                          onStartFocus={handleStartFocus}
                          onEdit={(e) => {
                            setSelectedEndeavorForLog(e);
                            setIsLogModalOpen(true);
                          }}
                          onDelete={handleDeleteEndeavor}
                          onOpenDetail={(e) => setSelectedEndeavorForDetail(e)}
                        />

                        {/* 5. Target Progress Meters */}
                        <EndeavorRowCarousel
                          title="Target Progress Meters"
                          subtitle="Quantitative targets with precision numerical tracking"
                          icon={Target}
                          badge="METRICS"
                          badgeColor="text-emerald-300 bg-emerald-500/10 border-emerald-500/20"
                          endeavors={endeavors.filter((e) => e.archetype === "meter")}
                          onQuickLog={handleQuickLog}
                          onOpenLogModal={(e) => {
                            setSelectedEndeavorForLog(e);
                            setIsLogModalOpen(true);
                          }}
                          onToggleMilestone={handleToggleMilestone}
                          onStartFocus={handleStartFocus}
                          onEdit={(e) => {
                            setSelectedEndeavorForLog(e);
                            setIsLogModalOpen(true);
                          }}
                          onDelete={handleDeleteEndeavor}
                          onOpenDetail={(e) => setSelectedEndeavorForDetail(e)}
                        />

                        {/* 6. Mastered Horizons */}
                        <EndeavorRowCarousel
                          title="Mastered Horizons & Trophies"
                          subtitle="Completed missions and conquered milestones"
                          icon={Award}
                          badge="ACCOMPLISHED"
                          badgeColor="text-yellow-300 bg-yellow-500/10 border-yellow-500/20"
                          endeavors={endeavors.filter((e) => e.status === "completed" || e.currentValue >= e.targetValue)}
                          onQuickLog={handleQuickLog}
                          onOpenLogModal={(e) => {
                            setSelectedEndeavorForLog(e);
                            setIsLogModalOpen(true);
                          }}
                          onToggleMilestone={handleToggleMilestone}
                          onStartFocus={handleStartFocus}
                          onEdit={(e) => {
                            setSelectedEndeavorForLog(e);
                            setIsLogModalOpen(true);
                          }}
                          onDelete={handleDeleteEndeavor}
                          onOpenDetail={(e) => setSelectedEndeavorForDetail(e)}
                        />
                      </div>
                    ) : (
                      /* Filtered Curated Grid */
                      <div className="space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-white/5 font-mono">
                          <span className="text-xs text-slate-400">
                            SHOWING {filteredEndeavors.length} MATCHING HORIZONS
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                          {filteredEndeavors.map((endeavor) => (
                            <EndeavorCard
                              key={endeavor.id}
                              endeavor={endeavor}
                              onQuickLog={handleQuickLog}
                              onOpenLogModal={(e) => {
                                setSelectedEndeavorForLog(e);
                                setIsLogModalOpen(true);
                              }}
                              onToggleMilestone={handleToggleMilestone}
                              onStartFocus={handleStartFocus}
                              onEdit={(e) => {
                                setSelectedEndeavorForLog(e);
                                setIsLogModalOpen(true);
                              }}
                              onDelete={handleDeleteEndeavor}
                              onOpenDetail={(e) => setSelectedEndeavorForDetail(e)}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : cardLayoutMode === "board" ? (
                  /* KANBAN BOARD VIEW */
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    {/* Column 1: Backlog & Planned */}
                    <div className="bg-white/[0.02] rounded-3xl p-4 sm:p-5 border border-white/5 space-y-3 flex flex-col">
                      <div className="flex items-center justify-between pb-2 border-b border-white/5">
                        <div className="flex items-center space-x-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                            Queue & Planned
                          </h3>
                        </div>
                        <span className="text-xs font-bold text-slate-500">
                          {filteredEndeavors.filter((e) => e.status === "paused" || e.status === "archived" || e.currentValue === 0).length}
                        </span>
                      </div>

                      <div className="space-y-3 flex-1 overflow-y-auto max-h-[700px] pr-1">
                        {filteredEndeavors
                          .filter((e) => e.status === "paused" || e.status === "archived" || e.currentValue === 0)
                          .map((e) => (
                            <EndeavorCard
                              key={e.id}
                              endeavor={e}
                              onQuickLog={handleQuickLog}
                              onOpenLogModal={(it) => {
                                setSelectedEndeavorForLog(it);
                                setIsLogModalOpen(true);
                              }}
                              onToggleMilestone={handleToggleMilestone}
                              onStartFocus={handleStartFocus}
                              onEdit={(it) => {
                                setSelectedEndeavorForLog(it);
                                setIsLogModalOpen(true);
                              }}
                              onDelete={handleDeleteEndeavor}
                              onOpenDetail={(it) => setSelectedEndeavorForDetail(it)}
                            />
                          ))}
                      </div>
                    </div>

                    {/* Column 2: In Active Progress */}
                    <div className="bg-white/[0.02] rounded-3xl p-4 sm:p-5 border border-white/5 space-y-3 flex flex-col">
                      <div className="flex items-center justify-between pb-2 border-b border-white/5">
                        <div className="flex items-center space-x-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                            In Active Orbit
                          </h3>
                        </div>
                        <span className="text-xs font-bold text-emerald-400">
                          {filteredEndeavors.filter((e) => e.status === "active" && e.currentValue > 0 && e.currentValue < e.targetValue).length}
                        </span>
                      </div>

                      <div className="space-y-3 flex-1 overflow-y-auto max-h-[700px] pr-1">
                        {filteredEndeavors
                          .filter((e) => e.status === "active" && e.currentValue > 0 && e.currentValue < e.targetValue)
                          .map((e) => (
                            <EndeavorCard
                              key={e.id}
                              endeavor={e}
                              onQuickLog={handleQuickLog}
                              onOpenLogModal={(it) => {
                                setSelectedEndeavorForLog(it);
                                setIsLogModalOpen(true);
                              }}
                              onToggleMilestone={handleToggleMilestone}
                              onStartFocus={handleStartFocus}
                              onEdit={(it) => {
                                setSelectedEndeavorForLog(it);
                                setIsLogModalOpen(true);
                              }}
                              onDelete={handleDeleteEndeavor}
                              onOpenDetail={(it) => setSelectedEndeavorForDetail(it)}
                            />
                          ))}
                      </div>
                    </div>

                    {/* Column 3: Completed & Mastered */}
                    <div className="bg-white/[0.02] rounded-3xl p-4 sm:p-5 border border-white/5 space-y-3 flex flex-col">
                      <div className="flex items-center justify-between pb-2 border-b border-white/5">
                        <div className="flex items-center space-x-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                            Mastered & Done
                          </h3>
                        </div>
                        <span className="text-xs font-bold text-amber-400">
                          {filteredEndeavors.filter((e) => e.status === "completed" || e.currentValue >= e.targetValue).length}
                        </span>
                      </div>

                      <div className="space-y-3 flex-1 overflow-y-auto max-h-[700px] pr-1">
                        {filteredEndeavors
                          .filter((e) => e.status === "completed" || e.currentValue >= e.targetValue)
                          .map((e) => (
                            <EndeavorCard
                              key={e.id}
                              endeavor={e}
                              onQuickLog={handleQuickLog}
                              onOpenLogModal={(it) => {
                                setSelectedEndeavorForLog(it);
                                setIsLogModalOpen(true);
                              }}
                              onToggleMilestone={handleToggleMilestone}
                              onStartFocus={handleStartFocus}
                              onEdit={(it) => {
                                setSelectedEndeavorForLog(it);
                                setIsLogModalOpen(true);
                              }}
                              onDelete={handleDeleteEndeavor}
                              onOpenDetail={(it) => setSelectedEndeavorForDetail(it)}
                            />
                          ))}
                      </div>
                    </div>
                  </div>
                ) : cardLayoutMode === "list" ? (
                  /* DENSE LIST VIEW */
                  <div className="bg-white/[0.02] rounded-3xl border border-white/5 overflow-hidden shadow-xl divide-y divide-white/5">
                    {filteredEndeavors.map((endeavor) => {
                      const color = endeavor.color || "#10b981";
                      const pct = endeavor.archetype === "milestone"
                        ? endeavor.currentValue
                        : Math.min(100, Math.round(((endeavor.currentValue - endeavor.startValue) / (endeavor.targetValue - endeavor.startValue || 1)) * 100));

                      return (
                        <div
                          key={endeavor.id}
                          className="p-4 sm:p-5 hover:bg-white/[0.02] transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                        >
                          <div
                            onClick={() => setSelectedEndeavorForDetail(endeavor)}
                            className="flex items-center space-x-3.5 min-w-0 cursor-pointer flex-1"
                          >
                            <span
                              className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                              style={{ backgroundColor: color }}
                            />
                            <div className="min-w-0">
                              <div className="flex items-center space-x-2">
                                <h4 className="text-sm font-bold text-white hover:text-emerald-400 transition truncate">
                                  {endeavor.title}
                                </h4>
                                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white/5 text-slate-400">
                                  {endeavor.archetype}
                                </span>
                              </div>
                              <p className="text-xs text-slate-400 truncate max-w-md mt-0.5">
                                {endeavor.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4 shrink-0 self-end sm:self-center">
                            {/* Streak or Current Value */}
                            <div className="text-right">
                              <div className="text-xs font-bold text-slate-200 font-mono">
                                {endeavor.archetype === "habit"
                                  ? `${endeavor.streakCount}d streak`
                                  : `${endeavor.currentValue} / ${endeavor.targetValue} ${endeavor.unit}`}
                              </div>
                              <div className="text-[10px] text-slate-500 font-medium">{pct}% done</div>
                            </div>

                            {/* Quick +1 or Log Button */}
                            <button
                              type="button"
                              onClick={() => handleQuickLog(endeavor, endeavor.archetype === "meter" ? (profile.themeConfig?.quickLogDefaultStep || 1) : 1)}
                              className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 rounded-xl text-xs font-bold border border-emerald-500/20 cursor-pointer active:scale-95 transition"
                            >
                              + Quick Log
                            </button>

                            {/* Focus Button */}
                            <button
                              type="button"
                              onClick={() => handleStartFocus(endeavor)}
                              className="p-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl border border-white/5 cursor-pointer active:scale-95 transition"
                              title="Start Focus"
                            >
                              <Clock className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* STANDARD YOUTUBE CARD GRID VIEW */
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                    {filteredEndeavors.map((endeavor) => (
                      <EndeavorCard
                        key={endeavor.id}
                        endeavor={endeavor}
                        onQuickLog={handleQuickLog}
                        onOpenLogModal={(e) => {
                          setSelectedEndeavorForLog(e);
                          setIsLogModalOpen(true);
                        }}
                        onToggleMilestone={handleToggleMilestone}
                        onStartFocus={handleStartFocus}
                        onEdit={(e) => {
                          setSelectedEndeavorForLog(e);
                          setIsLogModalOpen(true);
                        }}
                        onDelete={handleDeleteEndeavor}
                        onOpenDetail={(e) => setSelectedEndeavorForDetail(e)}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* VIEW 1.5: COSMIC SANDBOX VIEW (Spatial Physics Canvas & Constellation Playground) */}
            {activeTab === "sandbox" && (
              <motion.div
                key="tab-sandbox"
                variants={TAB_PAGE_VARIANTS}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/5">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-2.5">
                      <Orbit className="w-7 h-7 text-emerald-400" />
                      <span>Cosmic Sandbox & Physics Playground</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      Freeform spatial canvas with real-time orbital gravity, celestial constellations, and cosmic sticky thoughts.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-xs uppercase shadow-[0_0_20px_rgba(52,211,153,0.3)] active:scale-95 transition cursor-pointer self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>Create Orbit Node</span>
                  </button>
                </div>

                <SandboxView
                  endeavors={endeavors}
                  profile={profile}
                  stats={stats}
                  onQuickLog={handleQuickLog}
                  onOpenLogModal={(e) => {
                    setSelectedEndeavorForLog(e);
                    setIsLogModalOpen(true);
                  }}
                  onStartFocus={handleStartFocus}
                  onOpenDetail={(e) => setSelectedEndeavorForDetail(e)}
                  onOpenCreate={() => setIsCreateModalOpen(true)}
                />
              </motion.div>
            )}

            {/* VIEW 2: HABIT MATRIX VIEW (YouTube/GitHub Consistency Matrix) */}
            {activeTab === "matrix" && (
              <motion.div
                key="tab-matrix"
                variants={TAB_PAGE_VARIANTS}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <HabitMatrixView
                  endeavors={endeavors}
                  profile={profile}
                  stats={stats}
                  onQuickLog={handleQuickLog}
                  onToggleDateLog={handleToggleDateLog}
                  onOpenCreate={() => setIsCreateModalOpen(true)}
                  onStartFocus={handleStartFocus}
                />
              </motion.div>
            )}

            {/* VIEW 3: PROJECT ROADMAP & MILESTONES */}
            {activeTab === "roadmap" && (
              <motion.div
                key="tab-roadmap"
                variants={TAB_PAGE_VARIANTS}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <RoadmapView
                  endeavors={endeavors}
                  profile={profile}
                  onUpdateEndeavor={handleSaveEndeavor}
                  onOpenCreate={() => setIsCreateModalOpen(true)}
                  onSelectEndeavorDetail={(e) => setSelectedEndeavorForDetail(e)}
                />
              </motion.div>
            )}

            {/* VIEW 4: TIMELINE (Daily Schedule & Time Blocking) */}
            {activeTab === "timeline" && (
              <motion.div
                key="tab-timeline"
                variants={TAB_PAGE_VARIANTS}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <TimelineView
                  timeBlocks={timeBlocks}
                  endeavors={endeavors}
                  onToggleTimeBlock={handleToggleTimeBlock}
                  onAddTimeBlock={handleAddTimeBlock}
                  onDeleteTimeBlock={handleDeleteTimeBlock}
                  onSetTimeBlocks={(blocks) => {
                    setTimeBlocks(blocks);
                    storage.saveTimeBlocks(blocks);
                  }}
                  onStartFocus={handleStartFocus}
                />
              </motion.div>
            )}

            {/* VIEW 5: DEEP FOCUS MODE */}
            {activeTab === "focus" && (
              <motion.div
                key="tab-focus"
                variants={TAB_PAGE_VARIANTS}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <FocusMode
                  endeavors={endeavors}
                  focusTimer={focusTimer}
                  setFocusTimer={setFocusTimer}
                  onFinishSession={handleFinishFocusSession}
                />
              </motion.div>
            )}

            {/* VIEW 6: INSIGHTS & ANALYTICS */}
            {activeTab === "insights" && (
              <motion.div
                key="tab-insights"
                variants={TAB_PAGE_VARIANTS}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <InsightsView endeavors={endeavors} stats={stats} logs={logs} />
              </motion.div>
            )}

            {/* VIEW 7: TROPHY HALL & XP PROGRESSION */}
            {activeTab === "trophies" && (
              <motion.div
                key="tab-trophies"
                variants={TAB_PAGE_VARIANTS}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <TrophiesView
                  stats={stats}
                  profile={profile}
                  endeavors={endeavors}
                />
              </motion.div>
            )}

            {/* VIEW 8: AI COPILOT & COACH */}
            {activeTab === "copilot" && (
              <motion.div
                key="tab-copilot"
                variants={TAB_PAGE_VARIANTS}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <AICopilotView
                  endeavors={endeavors}
                  onStartFocus={handleStartFocus}
                  onNavigateToSchedule={() => setActiveTab("timeline")}
                />
              </motion.div>
            )}

            {/* VIEW 9: SETTINGS & CUSTOMIZATION */}
            {activeTab === "settings" && (
              <motion.div
                key="tab-settings"
                variants={TAB_PAGE_VARIANTS}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <SettingsView
                  profile={profile}
                  stats={stats}
                  onUpdateProfile={handleSaveProfile}
                  onOpenSetupWizard={() => setIsSetupWizardOpen(true)}
                  onResetDefaults={handleResetDefaults}
                  onOpenProfileHub={() => setIsProfileHubOpen(true)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* YouTube-Style Persistent Floating Mini-Focus Player */}
      {activeTab !== "focus" && (
        <MiniFocusPlayer
          isActive={focusTimer.isActive}
          isPaused={focusTimer.isPaused}
          secondsRemaining={focusTimer.secondsRemaining}
          totalSeconds={focusTimer.totalSeconds}
          currentEndeavor={focusTimer.endeavor}
          onTogglePause={() =>
            setFocusTimer((prev) => ({ ...prev, isPaused: !prev.isPaused }))
          }
          onAddFiveMinutes={() =>
            setFocusTimer((prev) => ({
              ...prev,
              secondsRemaining: prev.secondsRemaining + 300,
              totalSeconds: prev.totalSeconds + 300,
            }))
          }
          onMaximize={() => setActiveTab("focus")}
                    onComplete={() => {
            confetti({ particleCount: 80, spread: 70 });
            if (focusTimer.endeavor) {
              handleQuickLog(focusTimer.endeavor, 1, "Completed sprint via mini-player");
            }
            awardXP(100, "Mini-player focus sprint completed!");
            setFocusTimer((prev) => ({
              ...prev,
              isActive: false,
              isPaused: false,
              secondsRemaining: prev.totalSeconds,
              soundMode: "none"
            }));
            focusAudio.stop();
          }}
          onClose={() => {
            setFocusTimer((prev) => ({
              ...prev,
              isActive: false,
              isPaused: false,
              soundMode: "none"
            }));
            focusAudio.stop();
          }}
        />
      )}

      {/* YouTube-Style Right Context Panel: Orbit Queue & Momentum Shelf */}
      <OrbitQueueDrawer
        isOpen={isOrbitQueueOpen}
        onClose={() => setIsOrbitQueueOpen(false)}
        endeavors={endeavors}
        timeBlocks={timeBlocks}
        profile={profile}
        stats={stats}
        onQuickLogHabit={(h) => handleQuickLog(h, 1, "Completed daily habit via Orbit Shelf")}
        onStartFocus={handleStartFocus}
        onToggleTimeBlock={handleToggleTimeBlock}
        onNavigateTab={(tab) => setActiveTab(tab)}
        onSaveQuickNote={handleSaveQuickNote}
      />

      {/* MODALS */}
      <ProfileHubModal
        isOpen={isProfileHubOpen}
        onClose={() => setIsProfileHubOpen(false)}
        profiles={profiles}
        activeProfileId={activeProfileId}
        onSelectProfile={handleSelectProfile}
        onCreateProfile={handleCreateProfile}
        onUpdateProfile={handleUpdateProfile}
        onDeleteProfile={handleDeleteProfile}
      />

      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        endeavors={endeavors}
        onNavigateTab={(tab) => setActiveTab(tab)}
        onOpenCreate={() => setIsCreateModalOpen(true)}
        onStartFocus={handleStartFocus}
        onQuickCheckIn={(endeavorId) => {
          const target = endeavors.find((e) => e.id === endeavorId);
          if (target) handleQuickLog(target, 1);
        }}
        onOpenProfileHub={() => setIsProfileHubOpen(true)}
        onOpenDetail={(endeavor) => setSelectedEndeavorForDetail(endeavor)}
        onOpenSetupWizard={() => setIsSetupWizardOpen(true)}
        onOpenBackup={() => setIsBackupModalOpen(true)}
        onOpenDeviceSync={() => setIsIntegrationsModalOpen(true)}
        onToggleOrbitQueue={() => setIsOrbitQueueOpen((prev) => !prev)}
        themeConfig={profile.themeConfig}
        onUpdateThemeConfig={handleUpdateThemeConfig}
      />

      <EndeavorDetailModal
        isOpen={Boolean(selectedEndeavorForDetail)}
        onClose={() => setSelectedEndeavorForDetail(null)}
        endeavor={selectedEndeavorForDetail}
        onUpdateEndeavor={handleSaveEndeavor}
        onDeleteEndeavor={handleDeleteEndeavor}
        onStartFocus={handleStartFocus}
        onQuickLog={(id, val, note) => {
          const target = endeavors.find((e) => e.id === id);
          if (target) handleQuickLog(target, val, note);
        }}
      />

      <SetupWizardModal
        isOpen={isSetupWizardOpen}
        onClose={() => setIsSetupWizardOpen(false)}
        initialProfile={profile}
        onSaveProfile={handleSaveProfile}
        isFirstTime={!profile.isSetupCompleted}
      />

      <CreateEndeavorModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleSaveEndeavor}
      />

      <QuickLogModal
        isOpen={isLogModalOpen}
        endeavor={selectedEndeavorForLog}
        onClose={() => {
          setIsLogModalOpen(false);
          setSelectedEndeavorForLog(null);
        }}
        onSaveLog={(endeavorId, val, note) => {
          const matched = endeavors.find((e) => e.id === endeavorId);
          if (matched) {
            handleQuickLog(matched, val, note);
          }
        }}
      />

      <BackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        onRefreshData={loadData}
      />

      <DeviceIntegrationsModal
        isOpen={isIntegrationsModalOpen}
        onClose={() => setIsIntegrationsModalOpen(false)}
        onSimulatePassiveSync={handleSimulatePassiveSync}
      />
    </div>
  );
}
