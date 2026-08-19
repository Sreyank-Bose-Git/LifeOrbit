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
import { storage } from "./lib/storage";
import { THEME_ACCENTS } from "./lib/theme";
import {
  Endeavor,
  ProgressLog,
  TimeBlock,
  UserStats,
  UserProfile,
  ViewTab,
} from "./types";
import {
  Sparkles,
  Plus,
  Search,
  Zap,
  Menu,
  SlidersHorizontal,
  Layers,
} from "lucide-react";
import confetti from "canvas-confetti";

export default function App() {
  const [activeTab, setActiveTab] = useState<ViewTab>("tracker");
  const [endeavors, setEndeavors] = useState<Endeavor[]>([]);
  const [logs, setLogs] = useState<ProgressLog[]>([]);
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([]);
  const [stats, setStats] = useState<UserStats>(storage.getStats());
  const [profile, setProfile] = useState<UserProfile>(storage.getProfile());

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

  // Filter and Search states
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedArchetype, setSelectedArchetype] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal States
  const [isSetupWizardOpen, setIsSetupWizardOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [selectedEndeavorForLog, setSelectedEndeavorForLog] = useState<Endeavor | null>(null);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isIntegrationsModalOpen, setIsIntegrationsModalOpen] = useState(false);
  const [focusTargetEndeavor, setFocusTargetEndeavor] = useState<Endeavor | null>(null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Load from local-first storage on mount
  const loadData = () => {
    const loadedEndeavors = storage.getEndeavors();
    const loadedLogs = storage.getLogs();
    const loadedTimeBlocks = storage.getTimeBlocks();
    const loadedStats = storage.getStats();
    const loadedProfile = storage.getProfile();

    setEndeavors(loadedEndeavors);
    setLogs(loadedLogs);
    setTimeBlocks(loadedTimeBlocks);
    setStats(loadedStats);
    setProfile(loadedProfile);

    // Auto-prompt setup wizard if brand new setup
    if (!loadedProfile.isSetupCompleted) {
      setIsSetupWizardOpen(true);
    }
  };

  useEffect(() => {
    loadData();
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
      const currentDayVal = e.history[todayStr] || 0;
      const newDayVal = Math.max(0, currentDayVal + value);

      // Streak calculation
      let newStreak = e.streakCount;
      if (value > 0 && currentDayVal === 0) {
        newStreak += 1;
      } else if (value < 0 && newDayVal === 0) {
        newStreak = Math.max(0, newStreak - 1);
      }

      const bestStreak = Math.max(e.bestStreak, newStreak);

      return {
        ...e,
        currentValue: newCurrent,
        streakCount: newStreak,
        bestStreak,
        history: {
          ...e.history,
          [todayStr]: newDayVal,
        },
        updatedAt: new Date().toISOString(),
      };
    });

    setEndeavors(updatedEndeavors);
    storage.saveEndeavors(updatedEndeavors);

    // Save Log
    const newLog: ProgressLog = {
      id: `log-${Date.now()}`,
      endeavorId: endeavor.id,
      value,
      timestamp: new Date().toISOString(),
      note: note || `Logged ${value} ${endeavor.unit}`,
    };
    const updatedLogs = [newLog, ...logs];
    setLogs(updatedLogs);
    storage.saveLogs(updatedLogs);

    if (value > 0) {
      awardXP(25, `${endeavor.title} progress updated`);
    }
  };

  // Toggle Milestone in project
  const handleToggleMilestone = (endeavorId: string, milestoneId: string) => {
    const updatedEndeavors = endeavors.map((e) => {
      if (e.id !== endeavorId) return e;

      const updatedMilestones = e.milestones.map((m) => {
        if (m.id !== milestoneId) return m;
        const newCompleted = !m.completed;
        return {
          ...m,
          completed: newCompleted,
          completedAt: newCompleted ? new Date().toISOString() : undefined,
        };
      });

      const completedCount = updatedMilestones.filter((m) => m.completed).length;
      const newPercentage = Math.round((completedCount / (updatedMilestones.length || 1)) * 100);

      return {
        ...e,
        milestones: updatedMilestones,
        currentValue: newPercentage,
        updatedAt: new Date().toISOString(),
      };
    });

    setEndeavors(updatedEndeavors);
    storage.saveEndeavors(updatedEndeavors);
    awardXP(50, "Project Milestone Phase Cleared!");

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.7 },
    });
  };

  // Save new endeavor
  const handleSaveEndeavor = (
    newEndeavorData: Omit<Endeavor, "id" | "createdAt" | "updatedAt" | "history" | "streakCount" | "bestStreak">
  ) => {
    const newEndeavor: Endeavor = {
      ...newEndeavorData,
      id: `end-${Date.now()}`,
      streakCount: 0,
      bestStreak: 0,
      history: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newEndeavor, ...endeavors];
    setEndeavors(updated);
    storage.saveEndeavors(updated);
    awardXP(50, `Created endeavor: ${newEndeavor.title}`);

    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.7 },
    });
  };

  // Delete endeavor
  const handleDeleteEndeavor = (endeavorId: string) => {
    if (confirm("Are you sure you want to delete this endeavor?")) {
      const updated = endeavors.filter((e) => e.id !== endeavorId);
      setEndeavors(updated);
      storage.saveEndeavors(updated);
      showToast("Endeavor removed.");
    }
  };

  // Time-block toggles
  const handleToggleTimeBlock = (id: string) => {
    const updated = timeBlocks.map((b) => {
      if (b.id !== id) return b;
      const nextVal = !b.completed;
      if (nextVal) {
        awardXP(30, `Completed schedule block: ${b.title}`);
      }
      return { ...b, completed: nextVal };
    });
    setTimeBlocks(updated);
    storage.saveTimeBlocks(updated);
  };

  const handleAddTimeBlock = (block: Omit<TimeBlock, "id">) => {
    const newBlock: TimeBlock = { ...block, id: `tb-${Date.now()}` };
    const updated = [...timeBlocks, newBlock];
    setTimeBlocks(updated);
    storage.saveTimeBlocks(updated);
    showToast("Schedule block added.");
  };

  const handleDeleteTimeBlock = (id: string) => {
    const updated = timeBlocks.filter((b) => b.id !== id);
    setTimeBlocks(updated);
    storage.saveTimeBlocks(updated);
  };

  // Start Focus session from an Endeavor card
  const handleStartFocus = (endeavor: Endeavor) => {
    setFocusTargetEndeavor(endeavor);
    setActiveTab("focus");
  };

  // Complete focus session
  const handleFinishFocusSession = (endeavorId: string, durationMinutes: number, notes: string) => {
    const matched = endeavors.find((e) => e.id === endeavorId);
    if (matched) {
      handleQuickLog(matched, 1, `Completed ${durationMinutes}m deep focus sprint. Notes: ${notes}`);
    }
    awardXP(durationMinutes * 2, `Deep Focus Session (${durationMinutes} mins)`);
  };

  // Passive sync simulation
  const handleSimulatePassiveSync = (type: string) => {
    if (type === "github") {
      const saas = endeavors.find((e) => e.category === "career" || e.archetype === "milestone");
      if (saas) {
        handleQuickLog(saas, 10, "Auto-synced: GitHub PR merged");
      }
    } else if (type === "health") {
      const run = endeavors.find((e) => e.category === "health" || e.archetype === "habit");
      if (run) {
        handleQuickLog(run, 1, "Auto-synced: 5km activity recorded");
      }
    } else if (type === "plaid") {
      const finance = endeavors.find((e) => e.category === "finance");
      if (finance) {
        handleQuickLog(finance, 500, "Auto-synced: monthly savings recorded");
      }
    }
    showToast(`Passive connector synced signal for ${type.toUpperCase()}`);
  };

  // Filtered Endeavors
  const filteredEndeavors = endeavors.filter((e) => {
    if (selectedCategory !== "all" && e.category !== selectedCategory) return false;
    if (selectedArchetype !== "all" && e.archetype !== selectedArchetype) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-slate-200 flex font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Left Collapsible Sidebar */}
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
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-y-auto">
        {/* Minimal Mobile Header with Sidebar Toggle */}
        <header className="md:hidden sticky top-0 z-30 bg-[#0D0D0D]/95 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              id="mobile-sidebar-toggle-btn"
              onClick={handleToggleSidebar}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl border border-white/5 transition"
              aria-label="Open sidebar menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-bold text-white text-sm uppercase tracking-tight">
              {profile.themeConfig?.customAppTitle || "LifeOrbit OS"}
            </span>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className={`p-2 rounded-xl ${currentTheme.buttonBg} ${currentTheme.buttonText} font-bold shadow-xs active:scale-95`}
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </button>
        </header>

        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="fixed top-6 right-6 z-50 bg-[#141414]/95 backdrop-blur-md text-slate-200 px-4 py-2.5 rounded-2xl shadow-2xl border border-white/10 text-xs font-semibold flex items-center space-x-2 animate-in slide-in-from-top-2">
            <Zap className={`w-4 h-4 ${currentTheme.textAccent} fill-current`} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Content Container */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-6">
          {/* VIEW 1: UNIVERSAL TRACKER (Macro Overview) */}
          {activeTab === "tracker" && (
            <div className="space-y-6">
              {/* Clean Workspace Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/5">
                <div>
                  <div className="flex items-center space-x-2">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      {profile.name ? `${profile.name}'s Endeavors` : "Active Endeavors"}
                    </h1>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/5">
                      {endeavors.length}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    {profile.northStarMotto || "Local-first activity tracker for habits, meters, and project milestones."}
                  </p>
                </div>

                {/* Clean Actions */}
                <div className="flex items-center space-x-2.5 shrink-0">
                  <button
                    onClick={() => setActiveTab("copilot")}
                    className="flex items-center space-x-2 px-3.5 py-2 bg-[#141414] hover:bg-white/10 text-slate-200 hover:text-white rounded-xl text-xs font-semibold border border-white/5 hover:border-white/15 cursor-pointer active:scale-95 transition-all duration-150"
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

              {/* Filter & Search Bar */}
              <div className="bg-[#0D0D0D] rounded-2xl p-3 sm:p-4 border border-white/5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                {/* Category Filter Chips */}
                <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`px-3 py-1.5 rounded-xl font-semibold cursor-pointer active:scale-95 transition-all duration-150 shrink-0 ${
                      selectedCategory === "all"
                        ? "bg-white/15 text-white shadow-xs"
                        : "bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10"
                    }`}
                  >
                    All Spheres
                  </button>
                  <button
                    onClick={() => setSelectedCategory("career")}
                    className={`px-3 py-1.5 rounded-xl font-semibold cursor-pointer active:scale-95 transition-all duration-150 shrink-0 ${
                      selectedCategory === "career"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : "bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10"
                    }`}
                  >
                    Career & Tech
                  </button>
                  <button
                    onClick={() => setSelectedCategory("health")}
                    className={`px-3 py-1.5 rounded-xl font-semibold cursor-pointer active:scale-95 transition-all duration-150 shrink-0 ${
                      selectedCategory === "health"
                        ? "bg-red-500/20 text-red-300 border border-red-500/30"
                        : "bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10"
                    }`}
                  >
                    Health
                  </button>
                  <button
                    onClick={() => setSelectedCategory("learning")}
                    className={`px-3 py-1.5 rounded-xl font-semibold cursor-pointer active:scale-95 transition-all duration-150 shrink-0 ${
                      selectedCategory === "learning"
                        ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                        : "bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10"
                    }`}
                  >
                    Learning
                  </button>
                  <button
                    onClick={() => setSelectedCategory("finance")}
                    className={`px-3 py-1.5 rounded-xl font-semibold cursor-pointer active:scale-95 transition-all duration-150 shrink-0 ${
                      selectedCategory === "finance"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10"
                    }`}
                  >
                    Finance
                  </button>
                  <button
                    onClick={() => setSelectedCategory("mindfulness")}
                    className={`px-3 py-1.5 rounded-xl font-semibold cursor-pointer active:scale-95 transition-all duration-150 shrink-0 ${
                      selectedCategory === "mindfulness"
                        ? "bg-teal-500/20 text-teal-300 border border-teal-500/30"
                        : "bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10"
                    }`}
                  >
                    Mindfulness
                  </button>
                </div>

                {/* Archetype & Search Controls */}
                <div className="flex items-center space-x-2">
                  <select
                    value={selectedArchetype}
                    onChange={(e) => setSelectedArchetype(e.target.value)}
                    className="px-3 py-1.5 bg-[#141414] hover:bg-[#1a1a1a] border border-white/10 rounded-xl text-xs font-medium text-slate-300 cursor-pointer focus:outline-none focus:border-emerald-500/50 transition-colors"
                  >
                    <option value="all">All Types</option>
                    <option value="habit">Habits (Streaks)</option>
                    <option value="meter">Meters (Numbers)</option>
                    <option value="milestone">Projects (Milestones)</option>
                  </select>

                  <div className="relative flex-1 sm:w-48">
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search..."
                      className="w-full pl-8 pr-3 py-1.5 bg-[#141414] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Endeavors Grid */}
              {filteredEndeavors.length === 0 ? (
                <div className="bg-[#0D0D0D] rounded-3xl p-12 text-center border border-white/5">
                  <Layers className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                  <h3 className="text-sm font-bold text-slate-300">No endeavors match your current filter</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                    Create a new habit, measurable target, or project milestone to begin tracking.
                  </p>
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className={`inline-flex items-center space-x-2 px-4 py-2 ${currentTheme.buttonBg} ${currentTheme.buttonHover} ${currentTheme.buttonText} font-bold rounded-xl text-xs`}
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>Create Endeavor</span>
                  </button>
                </div>
              ) : (
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
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* VIEW 2: TIMELINE (Daily Schedule & Time Blocking) */}
          {activeTab === "timeline" && (
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
          )}

          {/* VIEW 3: DEEP FOCUS MODE */}
          {activeTab === "focus" && (
            <FocusMode
              endeavors={endeavors}
              initialEndeavor={focusTargetEndeavor}
              onFinishSession={handleFinishFocusSession}
            />
          )}

          {/* VIEW 4: INSIGHTS & ANALYTICS */}
          {activeTab === "insights" && (
            <InsightsView endeavors={endeavors} stats={stats} logs={logs} />
          )}

          {/* VIEW 5: AI COPILOT & COACH */}
          {activeTab === "copilot" && (
            <AICopilotView
              endeavors={endeavors}
              onStartFocus={handleStartFocus}
              onNavigateToSchedule={() => setActiveTab("timeline")}
            />
          )}

          {/* VIEW 6: SETTINGS & CUSTOMIZATION */}
          {activeTab === "settings" && (
            <SettingsView
              profile={profile}
              stats={stats}
              onUpdateProfile={handleSaveProfile}
              onOpenSetupWizard={() => setIsSetupWizardOpen(true)}
              onResetDefaults={handleResetDefaults}
            />
          )}
        </main>
      </div>

      {/* MODALS */}
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
