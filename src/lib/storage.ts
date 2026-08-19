import { Endeavor, ProgressLog, TimeBlock, UserStats, Badge, UserProfile, UIThemeConfig } from "../types";

const STORAGE_KEYS = {
  ENDEAVORS: "lifeorbit_endeavors_v2",
  LOGS: "lifeorbit_logs_v2",
  TIMEBLOCKS: "lifeorbit_timeblocks_v2",
  STATS: "lifeorbit_stats_v2",
  PROFILE: "lifeorbit_profile_v2",
};

export const DEFAULT_PROFILE: UserProfile = {
  name: "Alex Rivera",
  role: "SaaS Founder & High Performer",
  northStarMotto: "Compound daily momentum with uncompromising consistency.",
  targetFocusHoursPerDay: 4,
  wakeTime: "06:30",
  sleepTime: "22:30",
  selectedLifeSpheres: ["career", "health", "learning", "finance", "mindfulness"],
  isSetupCompleted: false,
  themeConfig: {
    accent: "emerald",
    density: "balanced",
    showStreakBadges: true,
    showMilestonesOnCards: true,
    soundEffectsEnabled: true,
    ambientSoundPreset: "binaural",
    customAppTitle: "LIFEORBIT OS",
    avatarIcon: "Sparkles",
    avatarColor: "#10b981",
    quickLogDefaultStep: 1,
  },
  customNotes: "Focus on high-leverage software milestones and zone 2 aerobic conditioning.",
};

const INITIAL_BADGES: Badge[] = [
  {
    id: "first_step",
    name: "First Leap",
    description: "Logged your first progress on any endeavor",
    icon: "Rocket",
    unlockedAt: new Date().toISOString(),
    category: "milestone",
  },
  {
    id: "streak_7",
    name: "7-Day Ignition",
    description: "Maintained a 7-day streak on any daily endeavor",
    icon: "Flame",
    category: "habit",
  },
  {
    id: "centurion",
    name: "Centurion",
    description: "Completed 100 total progress check-ins",
    icon: "ShieldCheck",
    category: "consistency",
  },
  {
    id: "deep_diver",
    name: "Deep Flow State",
    description: "Completed 5 focused Pomodoro time-blocks",
    icon: "Timer",
    category: "focus",
  },
  {
    id: "goal_slayer",
    name: "Target Master",
    description: "Reached 100% completion on a quantifiable target",
    icon: "Trophy",
    category: "achievement",
  },
];

const INITIAL_ENDEAVORS: Endeavor[] = [
  {
    id: "end-1",
    title: "Read 24 Non-Fiction Books",
    description: "Expanding knowledge across mental models, tech history, and neuroscience.",
    category: "learning",
    archetype: "meter",
    targetValue: 24,
    startValue: 0,
    currentValue: 14,
    unit: "books",
    frequency: "custom",
    status: "active",
    priority: "high",
    streakCount: 6,
    bestStreak: 18,
    color: "#6366f1",
    icon: "BookOpen",
    difficulty: "medium",
    scheduledTime: "21:30",
    reminderEnabled: true,
    tags: ["reading", "intellect", "self-growth"],
    history: {
      "2026-08-14": 1,
      "2026-08-15": 1,
      "2026-08-16": 1,
      "2026-08-17": 1,
      "2026-08-18": 1,
      "2026-08-19": 1,
    },
    milestones: [
      { id: "m1", title: "Read 6 Books (Q1 Target)", completed: true, completedAt: "2026-03-30" },
      { id: "m2", title: "Read 12 Books (Mid-Year Checkpoint)", completed: true, completedAt: "2026-06-25" },
      { id: "m3", title: "Read 18 Books (Autumn Sprint)", completed: false },
      { id: "m4", title: "Read 24 Books (Grand Total Finish)", completed: false },
    ],
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "end-2",
    title: "Morning Mindfulness Meditation",
    description: "15 minutes of guided Vipassana breathing for calm focus before work.",
    category: "mindfulness",
    archetype: "habit",
    targetValue: 30, // 30-day streak goal
    startValue: 0,
    currentValue: 12,
    unit: "days",
    frequency: "daily",
    status: "active",
    priority: "high",
    streakCount: 12,
    bestStreak: 21,
    color: "#10b981",
    icon: "Sparkles",
    difficulty: "easy",
    scheduledTime: "07:00",
    reminderEnabled: true,
    tags: ["zen", "breathing", "mental-health"],
    history: {
      "2026-08-08": 1,
      "2026-08-09": 1,
      "2026-08-10": 1,
      "2026-08-11": 1,
      "2026-08-12": 1,
      "2026-08-13": 1,
      "2026-08-14": 1,
      "2026-08-15": 1,
      "2026-08-16": 1,
      "2026-08-17": 1,
      "2026-08-18": 1,
      "2026-08-19": 1,
    },
    milestones: [
      { id: "m1", title: "7-Day Foundation", completed: true, completedAt: "2026-08-14" },
      { id: "m2", title: "14-Day Consistency Anchor", completed: false },
      { id: "m3", title: "30-Day Master Habit Streak", completed: false },
    ],
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "end-3",
    title: "Launch Autonomous AI SaaS MVP",
    description: "Ship a full-stack production application with auth, billing, and automated workflows.",
    category: "career",
    archetype: "milestone",
    targetValue: 100, // 100%
    startValue: 0,
    currentValue: 65,
    unit: "%",
    frequency: "custom",
    status: "active",
    priority: "high",
    streakCount: 4,
    bestStreak: 9,
    color: "#f59e0b",
    icon: "Cpu",
    difficulty: "hard",
    scheduledTime: "09:00",
    reminderEnabled: true,
    tags: ["code", "startup", "product"],
    history: {
      "2026-08-16": 15,
      "2026-08-17": 20,
      "2026-08-18": 15,
      "2026-08-19": 15,
    },
    milestones: [
      { id: "m1", title: "Architecture Design & Schema Spec", completed: true, weight: 20, completedAt: "2026-08-10" },
      { id: "m2", title: "Core Engine & Background AI Agent", completed: true, weight: 25, completedAt: "2026-08-15" },
      { id: "m3", title: "Responsive Dashboard UI & Dark Mode", completed: true, weight: 20, completedAt: "2026-08-18" },
      { id: "m4", title: "Stripe Billing & Tier Management", completed: false, weight: 20 },
      { id: "m5", title: "Beta Onboarding & Product Hunt Launch", completed: false, weight: 15 },
    ],
    createdAt: "2026-08-05T00:00:00.000Z",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "end-4",
    title: "Emergency Liquid Fund $15,000",
    description: "Building 6 months of living expenses in a high-yield treasury savings account.",
    category: "finance",
    archetype: "meter",
    targetValue: 15000,
    startValue: 3000,
    currentValue: 10850,
    unit: "USD",
    frequency: "weekly",
    status: "active",
    priority: "medium",
    streakCount: 8,
    bestStreak: 12,
    color: "#059669",
    icon: "DollarSign",
    difficulty: "medium",
    scheduledTime: "18:00",
    reminderEnabled: false,
    tags: ["savings", "wealth", "security"],
    history: {
      "2026-08-01": 500,
      "2026-08-08": 750,
      "2026-08-15": 600,
    },
    milestones: [
      { id: "m1", title: "$5,000 Milestone (2 Months Safety)", completed: true, completedAt: "2026-04-10" },
      { id: "m2", title: "$10,000 Milestone (4 Months Safety)", completed: true, completedAt: "2026-07-20" },
      { id: "m3", title: "$15,000 Final Goal (Full 6 Months)", completed: false },
    ],
    createdAt: "2026-01-15T00:00:00.000Z",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "end-5",
    title: "5K Running & Aerobic Conditioning",
    description: "Zone 2 aerobic base building: run 5 kilometers 3 times every week under 25 minutes.",
    category: "health",
    archetype: "habit",
    targetValue: 20, // 20 sessions target
    startValue: 0,
    currentValue: 8,
    unit: "runs",
    frequency: "weekly",
    status: "active",
    priority: "medium",
    streakCount: 3,
    bestStreak: 6,
    color: "#ef4444",
    icon: "Activity",
    difficulty: "medium",
    scheduledTime: "06:30",
    reminderEnabled: true,
    tags: ["fitness", "cardio", "endurance"],
    history: {
      "2026-08-12": 1,
      "2026-08-14": 1,
      "2026-08-17": 1,
      "2026-08-19": 1,
    },
    milestones: [
      { id: "m1", title: "Complete 5th run under 28m", completed: true, completedAt: "2026-08-14" },
      { id: "m2", title: "Sub-25 min 5K milestone", completed: false },
      { id: "m3", title: "10K distance breakthrough", completed: false },
    ],
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: new Date().toISOString(),
  },
];

const INITIAL_TIMEBLOCKS: TimeBlock[] = [
  {
    id: "tb-1",
    endeavorId: "end-2",
    title: "Morning Meditation & Intention Setting",
    startTime: "07:00",
    endTime: "07:30",
    date: new Date().toISOString().split("T")[0],
    completed: true,
    energyLevel: "light",
    notes: "Deep diaphragmatic breathing session.",
  },
  {
    id: "tb-2",
    endeavorId: "end-3",
    title: "AI SaaS MVP - Core Engine Architecture",
    startTime: "09:00",
    endTime: "11:30",
    date: new Date().toISOString().split("T")[0],
    completed: false,
    energyLevel: "deep",
    notes: "Implement streaming AI co-pilot responses and token counters.",
  },
  {
    id: "tb-3",
    endeavorId: "end-5",
    title: "Zone 2 5km Aerobic Run",
    startTime: "17:00",
    endTime: "17:45",
    date: new Date().toISOString().split("T")[0],
    completed: false,
    energyLevel: "medium",
    notes: "Maintain heart rate around 140 bpm.",
  },
  {
    id: "tb-4",
    endeavorId: "end-1",
    title: "Evening Book Chapter & Notes Reflection",
    startTime: "21:30",
    endTime: "22:15",
    date: new Date().toISOString().split("T")[0],
    completed: false,
    energyLevel: "light",
    notes: "Finish Chapter 8 on Atomic Systems.",
  },
];

export const storage = {
  getEndeavors(): Endeavor[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ENDEAVORS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.ENDEAVORS, JSON.stringify(INITIAL_ENDEAVORS));
        return INITIAL_ENDEAVORS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_ENDEAVORS;
    }
  },

  saveEndeavors(endeavors: Endeavor[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ENDEAVORS, JSON.stringify(endeavors));
    } catch (e) {
      console.error("Failed to save endeavors to storage", e);
    }
  },

  getLogs(): ProgressLog[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LOGS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveLogs(logs: ProgressLog[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
    } catch (e) {
      console.error("Failed to save logs", e);
    }
  },

  getTimeBlocks(): TimeBlock[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TIMEBLOCKS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.TIMEBLOCKS, JSON.stringify(INITIAL_TIMEBLOCKS));
        return INITIAL_TIMEBLOCKS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_TIMEBLOCKS;
    }
  },

  saveTimeBlocks(blocks: TimeBlock[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.TIMEBLOCKS, JSON.stringify(blocks));
    } catch (e) {
      console.error("Failed to save time blocks", e);
    }
  },

  getStats(): UserStats {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STATS);
      if (!data) {
        const initial: UserStats = {
          level: 4,
          xp: 840,
          points: 1250,
          totalCheckIns: 48,
          totalMilestonesCompleted: 7,
          activeStreaks: 5,
          completedEndeavors: 1,
          badges: INITIAL_BADGES,
        };
        localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(initial));
        return initial;
      }
      return JSON.parse(data);
    } catch {
      return {
        level: 1,
        xp: 100,
        points: 100,
        totalCheckIns: 5,
        totalMilestonesCompleted: 1,
        activeStreaks: 1,
        completedEndeavors: 0,
        badges: INITIAL_BADGES,
      };
    }
  },

  saveStats(stats: UserStats): void {
    try {
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    } catch (e) {
      console.error("Failed to save stats", e);
    }
  },

  getProfile(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(DEFAULT_PROFILE));
        return DEFAULT_PROFILE;
      }
      const parsed = JSON.parse(data);
      return {
        ...DEFAULT_PROFILE,
        ...parsed,
        themeConfig: {
          ...DEFAULT_PROFILE.themeConfig,
          ...(parsed.themeConfig || {}),
        },
      };
    } catch {
      return DEFAULT_PROFILE;
    }
  },

  saveProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error("Failed to save profile", e);
    }
  },

  exportDatabaseJSON(): string {
    const backup = {
      version: "2026.1",
      exportedAt: new Date().toISOString(),
      endeavors: this.getEndeavors(),
      logs: this.getLogs(),
      timeBlocks: this.getTimeBlocks(),
      stats: this.getStats(),
      profile: this.getProfile(),
    };
    return JSON.stringify(backup, null, 2);
  },

  importDatabaseJSON(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed.endeavors)) {
        this.saveEndeavors(parsed.endeavors);
      }
      if (Array.isArray(parsed.logs)) {
        this.saveLogs(parsed.logs);
      }
      if (Array.isArray(parsed.timeBlocks)) {
        this.saveTimeBlocks(parsed.timeBlocks);
      }
      if (parsed.stats) {
        this.saveStats(parsed.stats);
      }
      if (parsed.profile) {
        this.saveProfile(parsed.profile);
      }
      return true;
    } catch (e) {
      console.error("Failed to import database", e);
      return false;
    }
  },

  resetDefaults(): void {
    localStorage.setItem(STORAGE_KEYS.ENDEAVORS, JSON.stringify(INITIAL_ENDEAVORS));
    localStorage.setItem(STORAGE_KEYS.TIMEBLOCKS, JSON.stringify(INITIAL_TIMEBLOCKS));
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(DEFAULT_PROFILE));
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify({
      level: 4,
      xp: 840,
      points: 1250,
      totalCheckIns: 48,
      totalMilestonesCompleted: 7,
      activeStreaks: 5,
      completedEndeavors: 1,
      badges: INITIAL_BADGES,
    }));
  },
};
