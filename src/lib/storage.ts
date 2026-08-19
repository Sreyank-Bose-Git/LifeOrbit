import {
  Endeavor,
  ProgressLog,
  TimeBlock,
  UserStats,
  Badge,
  UserProfile,
  UserProfileAccount,
  UIThemeConfig,
} from "../types";

const STORAGE_KEYS = {
  PROFILES_LIST: "lifeorbit_profiles_v3",
  ACTIVE_PROFILE_ID: "lifeorbit_active_profile_id_v3",
  // Scoped prefix: lifeorbit_{profileId}_...
};

export const DEFAULT_THEME_CONFIG: UIThemeConfig = {
  accent: "emerald",
  density: "balanced",
  showStreakBadges: true,
  showMilestonesOnCards: true,
  soundEffectsEnabled: true,
  ambientSoundPreset: "binaural",
  ambientBackground: "aurora",
  customAppTitle: "LIFEORBIT OS",
  avatarIcon: "🚀",
  avatarColor: "#10b981",
  quickLogDefaultStep: 1,
};

export const INITIAL_PROFILES: UserProfileAccount[] = [
  {
    id: "prof_work",
    name: "Alex Rivera",
    role: "SaaS Founder & High Performer",
    avatarIcon: "🚀",
    avatarColor: "#10b981",
    northStarMotto: "Compound daily momentum with uncompromising consistency.",
    targetFocusHoursPerDay: 4,
    wakeTime: "06:30",
    sleepTime: "22:30",
    selectedLifeSpheres: ["career", "finance", "learning", "health", "mindfulness"],
    isSetupCompleted: true,
    themeConfig: {
      ...DEFAULT_THEME_CONFIG,
      accent: "emerald",
      ambientBackground: "aurora",
      avatarIcon: "🚀",
      avatarColor: "#10b981",
      customAppTitle: "ALEX • FOUNDER OS",
    },
    customNotes: "Focus on high-leverage software milestones and zone 2 aerobic conditioning.",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "prof_fitness",
    name: "Maya Chen",
    role: "Marathon Runner & Biohacker",
    avatarIcon: "🧘",
    avatarColor: "#8b5cf6",
    northStarMotto: "Master the breath, fortify the body, sharpen the spirit.",
    targetFocusHoursPerDay: 3,
    wakeTime: "05:45",
    sleepTime: "21:30",
    selectedLifeSpheres: ["health", "mindfulness", "learning", "personal"],
    isSetupCompleted: true,
    themeConfig: {
      ...DEFAULT_THEME_CONFIG,
      accent: "violet",
      ambientBackground: "particles",
      avatarIcon: "🧘",
      avatarColor: "#8b5cf6",
      customAppTitle: "MAYA • ATHLETICS & ZEN",
    },
    customNotes: "Marathon prep block 2: 55km weekly volume + 20 min morning pranayama.",
    createdAt: "2026-02-15T00:00:00.000Z",
  },
  {
    id: "prof_creative",
    name: "Neo Studio",
    role: "Design Director & Synthesist",
    avatarIcon: "🎨",
    avatarColor: "#f59e0b",
    northStarMotto: "Design with mathematical precision and boundless imagination.",
    targetFocusHoursPerDay: 5,
    wakeTime: "08:00",
    sleepTime: "00:30",
    selectedLifeSpheres: ["creative", "learning", "career", "mindfulness"],
    isSetupCompleted: true,
    themeConfig: {
      ...DEFAULT_THEME_CONFIG,
      accent: "amber",
      ambientBackground: "mesh",
      avatarIcon: "🎨",
      avatarColor: "#f59e0b",
      customAppTitle: "NEO • CREATIVE LAB",
    },
    customNotes: "Finish interactive 3D spatial design library and electronic music EP.",
    createdAt: "2026-03-01T00:00:00.000Z",
  },
];

export const DEFAULT_PROFILE: UserProfile = INITIAL_PROFILES[0];

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

const INITIAL_ENDEAVORS_WORK: Endeavor[] = [
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
    targetValue: 30,
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
    targetValue: 100,
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
];

const INITIAL_ENDEAVORS_FITNESS: Endeavor[] = [
  {
    id: "end-fit-1",
    title: "Run 500km Marathon Prep Volume",
    description: "Building base aerobic capacity for the autumn marathon qualifier.",
    category: "health",
    archetype: "meter",
    targetValue: 500,
    startValue: 0,
    currentValue: 240,
    unit: "km",
    frequency: "weekly",
    status: "active",
    priority: "high",
    streakCount: 14,
    bestStreak: 28,
    color: "#8b5cf6",
    icon: "Activity",
    difficulty: "hard",
    scheduledTime: "06:00",
    reminderEnabled: true,
    tags: ["running", "endurance", "marathon"],
    history: {
      "2026-08-14": 12,
      "2026-08-16": 15,
      "2026-08-18": 18,
      "2026-08-19": 10,
    },
    milestones: [
      { id: "mf1", title: "100km First Base Month", completed: true, completedAt: "2026-06-30" },
      { id: "mf2", title: "250km Halfway Milestone", completed: false },
      { id: "mf3", title: "500km Race Ready Peak", completed: false },
    ],
    createdAt: "2026-06-01T00:00:00.000Z",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "end-fit-2",
    title: "Cold Plunge & Breathwork Protocol",
    description: "3 minutes cold water immersion at 48°F followed by box breathing.",
    category: "health",
    archetype: "habit",
    targetValue: 21,
    startValue: 0,
    currentValue: 16,
    unit: "days",
    frequency: "daily",
    status: "active",
    priority: "medium",
    streakCount: 16,
    bestStreak: 21,
    color: "#06b6d4",
    icon: "Sparkles",
    difficulty: "hard",
    scheduledTime: "07:30",
    reminderEnabled: true,
    tags: ["biohacking", "cold", "recovery"],
    history: {
      "2026-08-15": 1,
      "2026-08-16": 1,
      "2026-08-17": 1,
      "2026-08-18": 1,
      "2026-08-19": 1,
    },
    milestones: [
      { id: "mb1", title: "7-Day Cold Discipline", completed: true, completedAt: "2026-08-10" },
      { id: "mb2", title: "21-Day Neural Adaptation", completed: false },
    ],
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: new Date().toISOString(),
  },
];

const INITIAL_ENDEAVORS_CREATIVE: Endeavor[] = [
  {
    id: "end-cr-1",
    title: "Produce 6-Track Ambient Electronic EP",
    description: "Modular synthesizer soundscapes mixed and mastered for vinyl release.",
    category: "creative",
    archetype: "milestone",
    targetValue: 100,
    startValue: 0,
    currentValue: 50,
    unit: "%",
    frequency: "custom",
    status: "active",
    priority: "high",
    streakCount: 5,
    bestStreak: 12,
    color: "#f59e0b",
    icon: "Music",
    difficulty: "medium",
    scheduledTime: "20:00",
    reminderEnabled: false,
    tags: ["audio", "music", "synth"],
    history: {
      "2026-08-16": 20,
      "2026-08-17": 10,
      "2026-08-18": 10,
      "2026-08-19": 10,
    },
    milestones: [
      { id: "mc1", title: "Tracks 1 & 2 Rough Demo Arrangements", completed: true, weight: 30, completedAt: "2026-08-05" },
      { id: "mc2", title: "Tracks 3 & 4 Sound Design & Stems", completed: true, weight: 30, completedAt: "2026-08-18" },
      { id: "mc3", title: "Final Stereo Mastering & Cover Art", completed: false, weight: 40 },
    ],
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "end-cr-2",
    title: "Write 30 Design Essays & Case Studies",
    description: "Deep-dives into cognitive ergonomics and tactile software aesthetics.",
    category: "learning",
    archetype: "meter",
    targetValue: 30,
    startValue: 0,
    currentValue: 11,
    unit: "essays",
    frequency: "weekly",
    status: "active",
    priority: "medium",
    streakCount: 7,
    bestStreak: 14,
    color: "#ec4899",
    icon: "PenTool",
    difficulty: "medium",
    scheduledTime: "10:30",
    reminderEnabled: true,
    tags: ["writing", "design", "craft"],
    history: {
      "2026-08-10": 1,
      "2026-08-14": 1,
      "2026-08-18": 1,
    },
    milestones: [
      { id: "me1", title: "Publish 10 Essays", completed: true, completedAt: "2026-08-12" },
      { id: "me2", title: "Publish 20 Essays", completed: false },
      { id: "me3", title: "Publish 30 Essays (Complete Book Volume)", completed: false },
    ],
    createdAt: "2026-07-01T00:00:00.000Z",
    updatedAt: new Date().toISOString(),
  },
];

const INITIAL_TIMEBLOCKS_WORK: TimeBlock[] = [
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
];

export const storage = {
  // --- MULTI-PROFILE ACCOUNTS ---
  getProfiles(): UserProfileAccount[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILES_LIST);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.PROFILES_LIST, JSON.stringify(INITIAL_PROFILES));
        return INITIAL_PROFILES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_PROFILES;
    }
  },

  saveProfiles(profiles: UserProfileAccount[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILES_LIST, JSON.stringify(profiles));
    } catch (e) {
      console.error("Failed to save profiles list", e);
    }
  },

  getActiveProfileId(): string {
    try {
      const activeId = localStorage.getItem(STORAGE_KEYS.ACTIVE_PROFILE_ID);
      if (activeId) return activeId;
      const profiles = this.getProfiles();
      const fallbackId = profiles[0]?.id || "prof_work";
      localStorage.setItem(STORAGE_KEYS.ACTIVE_PROFILE_ID, fallbackId);
      return fallbackId;
    } catch {
      return "prof_work";
    }
  },

  setActiveProfileId(id: string): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_PROFILE_ID, id);
    } catch (e) {
      console.error("Failed to set active profile id", e);
    }
  },

  getActiveProfile(): UserProfileAccount {
    const activeId = this.getActiveProfileId();
    const profiles = this.getProfiles();
    const found = profiles.find((p) => p.id === activeId);
    if (found) return found;
    return profiles[0] || DEFAULT_PROFILE;
  },

  createProfile(profileData: Partial<UserProfileAccount>): UserProfileAccount {
    const profiles = this.getProfiles();
    const newId = "prof_" + Date.now();
    const newProfile: UserProfileAccount = {
      id: newId,
      name: profileData.name || "New Space",
      role: profileData.role || "Explorer",
      avatarIcon: profileData.avatarIcon || "⚡",
      avatarColor: profileData.avatarColor || "#10b981",
      northStarMotto: profileData.northStarMotto || "Design your days, shape your future.",
      targetFocusHoursPerDay: profileData.targetFocusHoursPerDay || 4,
      wakeTime: profileData.wakeTime || "07:00",
      sleepTime: profileData.sleepTime || "23:00",
      selectedLifeSpheres: profileData.selectedLifeSpheres || ["career", "health", "learning"],
      isSetupCompleted: true,
      themeConfig: {
        ...DEFAULT_THEME_CONFIG,
        accent: (profileData.themeConfig?.accent as any) || "emerald",
        ambientBackground: profileData.themeConfig?.ambientBackground || "aurora",
        avatarIcon: profileData.avatarIcon || "⚡",
        avatarColor: profileData.avatarColor || "#10b981",
        customAppTitle: (profileData.name || "MY SPACE").toUpperCase() + " OS",
      },
      createdAt: new Date().toISOString(),
    };

    const updated = [...profiles, newProfile];
    this.saveProfiles(updated);
    this.setActiveProfileId(newId);

    // Initialize clean starter endeavors for new profile
    this.saveEndeavors(
      [
        {
          id: `end-init-${newId}-1`,
          title: `Build 14-Day Consistency in ${newProfile.name}`,
          description: "Establish momentum by checking in daily on your primary aspiration.",
          category: "personal",
          archetype: "habit",
          targetValue: 14,
          startValue: 0,
          currentValue: 1,
          unit: "days",
          frequency: "daily",
          status: "active",
          priority: "high",
          streakCount: 1,
          bestStreak: 1,
          color: newProfile.avatarColor,
          icon: "Sparkles",
          tags: ["momentum", "growth"],
          history: { [new Date().toISOString().split("T")[0]]: 1 },
          milestones: [
            { id: "m1", title: "Day 1 Launch", completed: true, completedAt: new Date().toISOString() },
            { id: "m2", title: "Day 7 Foundation", completed: false },
            { id: "m3", title: "Day 14 Mastery", completed: false },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      newId
    );

    return newProfile;
  },

  updateProfile(updatedProfile: UserProfileAccount): void {
    const profiles = this.getProfiles();
    const nextProfiles = profiles.map((p) => (p.id === updatedProfile.id ? updatedProfile : p));
    this.saveProfiles(nextProfiles);
  },

  deleteProfile(profileId: string): boolean {
    const profiles = this.getProfiles();
    if (profiles.length <= 1) return false; // Prevent deleting last remaining profile

    const filtered = profiles.filter((p) => p.id !== profileId);
    this.saveProfiles(filtered);

    // If active profile was deleted, switch to the first available
    if (this.getActiveProfileId() === profileId) {
      this.setActiveProfileId(filtered[0].id);
    }
    return true;
  },

  // --- SCOPED GETTERS & SETTERS (Scoped per profileId) ---
  getEndeavors(profileId?: string): Endeavor[] {
    const pId = profileId || this.getActiveProfileId();
    const key = `lifeorbit_${pId}_endeavors_v3`;
    try {
      const data = localStorage.getItem(key);
      if (!data) {
        let initial = INITIAL_ENDEAVORS_WORK;
        if (pId === "prof_fitness") initial = INITIAL_ENDEAVORS_FITNESS;
        if (pId === "prof_creative") initial = INITIAL_ENDEAVORS_CREATIVE;
        localStorage.setItem(key, JSON.stringify(initial));
        return initial;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_ENDEAVORS_WORK;
    }
  },

  saveEndeavors(endeavors: Endeavor[], profileId?: string): void {
    const pId = profileId || this.getActiveProfileId();
    const key = `lifeorbit_${pId}_endeavors_v3`;
    try {
      localStorage.setItem(key, JSON.stringify(endeavors));
    } catch (e) {
      console.error("Failed to save endeavors", e);
    }
  },

  getLogs(profileId?: string): ProgressLog[] {
    const pId = profileId || this.getActiveProfileId();
    const key = `lifeorbit_${pId}_logs_v3`;
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveLogs(logs: ProgressLog[], profileId?: string): void {
    const pId = profileId || this.getActiveProfileId();
    const key = `lifeorbit_${pId}_logs_v3`;
    try {
      localStorage.setItem(key, JSON.stringify(logs));
    } catch (e) {
      console.error("Failed to save logs", e);
    }
  },

  getTimeBlocks(profileId?: string): TimeBlock[] {
    const pId = profileId || this.getActiveProfileId();
    const key = `lifeorbit_${pId}_timeblocks_v3`;
    try {
      const data = localStorage.getItem(key);
      if (!data) {
        const initial = pId === "prof_work" ? INITIAL_TIMEBLOCKS_WORK : [];
        localStorage.setItem(key, JSON.stringify(initial));
        return initial;
      }
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveTimeBlocks(blocks: TimeBlock[], profileId?: string): void {
    const pId = profileId || this.getActiveProfileId();
    const key = `lifeorbit_${pId}_timeblocks_v3`;
    try {
      localStorage.setItem(key, JSON.stringify(blocks));
    } catch (e) {
      console.error("Failed to save time blocks", e);
    }
  },

  getStats(profileId?: string): UserStats {
    const pId = profileId || this.getActiveProfileId();
    const key = `lifeorbit_${pId}_stats_v3`;
    try {
      const data = localStorage.getItem(key);
      if (!data) {
        const initial: UserStats = {
          level: pId === "prof_fitness" ? 5 : pId === "prof_creative" ? 3 : 4,
          xp: pId === "prof_fitness" ? 1120 : pId === "prof_creative" ? 640 : 840,
          points: 1250,
          totalCheckIns: 48,
          totalMilestonesCompleted: 7,
          activeStreaks: 5,
          completedEndeavors: 1,
          badges: INITIAL_BADGES,
        };
        localStorage.setItem(key, JSON.stringify(initial));
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

  saveStats(stats: UserStats, profileId?: string): void {
    const pId = profileId || this.getActiveProfileId();
    const key = `lifeorbit_${pId}_stats_v3`;
    try {
      localStorage.setItem(key, JSON.stringify(stats));
    } catch (e) {
      console.error("Failed to save stats", e);
    }
  },

  getProfile(profileId?: string): UserProfile {
    const profiles = this.getProfiles();
    const pId = profileId || this.getActiveProfileId();
    const found = profiles.find((p) => p.id === pId) || profiles[0] || DEFAULT_PROFILE;
    return found;
  },

  saveProfile(profile: UserProfile): void {
    this.updateProfile(profile);
  },

  exportDatabaseJSON(): string {
    const profiles = this.getProfiles();
    const activeId = this.getActiveProfileId();
    const allData: Record<string, any> = {
      version: "2026.2",
      exportedAt: new Date().toISOString(),
      profiles,
      activeProfileId: activeId,
      profileData: {},
    };

    profiles.forEach((p) => {
      allData.profileData[p.id] = {
        endeavors: this.getEndeavors(p.id),
        logs: this.getLogs(p.id),
        timeBlocks: this.getTimeBlocks(p.id),
        stats: this.getStats(p.id),
      };
    });

    return JSON.stringify(allData, null, 2);
  },

  importDatabaseJSON(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed.profiles)) {
        this.saveProfiles(parsed.profiles);
      }
      if (parsed.activeProfileId) {
        this.setActiveProfileId(parsed.activeProfileId);
      }
      if (parsed.profileData) {
        Object.entries(parsed.profileData).forEach(([pId, data]: [string, any]) => {
          if (data.endeavors) this.saveEndeavors(data.endeavors, pId);
          if (data.logs) this.saveLogs(data.logs, pId);
          if (data.timeBlocks) this.saveTimeBlocks(data.timeBlocks, pId);
          if (data.stats) this.saveStats(data.stats, pId);
        });
      }
      return true;
    } catch (e) {
      console.error("Failed to import database", e);
      return false;
    }
  },

  resetDefaults(): void {
    localStorage.setItem(STORAGE_KEYS.PROFILES_LIST, JSON.stringify(INITIAL_PROFILES));
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PROFILE_ID, "prof_work");
    INITIAL_PROFILES.forEach((p) => {
      const pId = p.id;
      let initial = INITIAL_ENDEAVORS_WORK;
      if (pId === "prof_fitness") initial = INITIAL_ENDEAVORS_FITNESS;
      if (pId === "prof_creative") initial = INITIAL_ENDEAVORS_CREATIVE;
      this.saveEndeavors(initial, pId);
      this.saveTimeBlocks(pId === "prof_work" ? INITIAL_TIMEBLOCKS_WORK : [], pId);
    });
  },
};
