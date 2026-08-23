export type EndeavorArchetype = "habit" | "meter" | "milestone";

export type Category =
  | "health"
  | "career"
  | "learning"
  | "finance"
  | "creative"
  | "mindfulness"
  | "personal";

export interface MilestoneItem {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
  weight?: number; // e.g. percentage weight or points
  completedAt?: string;
}

export interface ProgressLog {
  id: string;
  endeavorId: string;
  value: number; // numerical increment or 1 for habit check
  timestamp: string; // ISO date string
  note?: string;
  mood?: "great" | "good" | "neutral" | "tired";
  photoUrl?: string;
}

export interface Endeavor {
  id: string;
  title: string;
  description: string;
  category: Category;
  archetype: EndeavorArchetype;
  targetValue: number; // For meters: target value (e.g. 5000, 24). For habits: streak goal (e.g. 30). For milestones: 100 (%)
  startValue: number; // Baseline (e.g. 0 or 150 lbs)
  currentValue: number; // Current accumulated progress
  unit: string; // e.g. "USD", "pages", "books", "km", "lbs", "days", "phases", "%"
  frequency: "daily" | "weekly" | "custom";
  status: "active" | "completed" | "paused" | "archived";
  priority: "high" | "medium" | "low";
  streakCount: number; // Current streak in days
  bestStreak: number; // Highest streak recorded
  history: Record<string, number>; // YYYY-MM-DD -> value logged on that day
  milestones: MilestoneItem[];
  color: string; // Hex or tailwind color name
  icon: string; // Lucide icon identifier
  scheduledTime?: string; // e.g. "07:30"
  reminderEnabled?: boolean;
  difficulty?: "easy" | "medium" | "hard";
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TimeBlock {
  id: string;
  endeavorId?: string;
  title: string;
  startTime: string; // "HH:MM"
  endTime: string; // "HH:MM"
  date: string; // "YYYY-MM-DD"
  completed: boolean;
  energyLevel: "deep" | "medium" | "light";
  notes?: string;
}

export interface UserStats {
  level: number;
  xp: number;
  points: number;
  totalCheckIns: number;
  totalMilestonesCompleted: number;
  activeStreaks: number;
  completedEndeavors: number;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  category: string;
}

export type ViewTab =
  | "tracker"
  | "sandbox"
  | "matrix"
  | "roadmap"
  | "timeline"
  | "focus"
  | "insights"
  | "trophies"
  | "copilot"
  | "settings";

export type CardLayoutMode = "curated" | "grid" | "board" | "list" | "sandbox";

export interface SandboxStickyNote {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string; // Hex or tailwind color
  tag?: string;
  width?: number;
  height?: number;
  pinned?: boolean;
}

export interface SandboxConnection {
  id: string;
  fromId: string;
  toId: string;
  label?: string;
  color?: string;
  style?: "solid" | "dashed" | "glow";
}

export interface SandboxNodePosition {
  id: string;
  x: number;
  y: number;
  vx?: number;
  vy?: number;
  fixed?: boolean;
}

export interface SandboxSettings {
  gravityEnabled: boolean;
  gravityStrength: number;
  repulsionStrength: number;
  orbitCenterPull: boolean;
  starfieldIntensity: number;
  showConstellations: boolean;
  showGrid: boolean;
  snapToGrid: boolean;
}

export type ThemeAccent = "emerald" | "violet" | "amber" | "cyan" | "rose" | "slate";
export type WorkspaceDensity = "compact" | "balanced" | "spacious";
export type BackgroundAnimationMode = "aurora" | "particles" | "mesh" | "cyberpunk" | "none";

export interface UIThemeConfig {
  accent: ThemeAccent;
  density: WorkspaceDensity;
  showStreakBadges: boolean;
  showMilestonesOnCards: boolean;
  soundEffectsEnabled: boolean;
  ambientSoundPreset: "none" | "binaural" | "pink" | "brown";
  ambientBackground: BackgroundAnimationMode;
  customAppTitle: string;
  avatarIcon: string;
  avatarColor: string;
  quickLogDefaultStep: number;
}

export interface UserProfileAccount {
  id: string;
  name: string;
  role: string;
  avatarIcon: string; // Emoji e.g. "🚀", "⚡", "🧘", "🎨", "💻", "🧠" or Lucide icon
  avatarColor: string; // Hex color
  northStarMotto: string;
  targetFocusHoursPerDay: number;
  wakeTime?: string;
  sleepTime?: string;
  selectedLifeSpheres: Category[];
  isSetupCompleted: boolean;
  themeConfig: UIThemeConfig;
  customNotes?: string;
  pinCode?: string;
  createdAt: string;
}

export interface UserProfile extends UserProfileAccount {
  // Aliases for active profile
}

export interface AICoachFeedback {
  headline: string;
  insights: string[];
  actionRecommendation: string;
  motivationalQuote: string;
}

export interface IntegrationConnector {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  connected: boolean;
  lastSynced?: string;
  autoLogArchetype: EndeavorArchetype;
}
