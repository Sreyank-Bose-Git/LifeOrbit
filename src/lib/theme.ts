import { ThemeAccent, WorkspaceDensity, EyeComfortPreset } from "../types";

export interface AccentThemeClasses {
  id: ThemeAccent;
  name: string;
  description: string;
  primary: string; // e.g. "emerald-500"
  primaryHex: string;
  bgSubtle: string;
  borderSubtle: string;
  textAccent: string;
  badgeBg: string;
  buttonBg: string;
  buttonHover: string;
  buttonText: string;
  glowShadow: string;
  ringFocus: string;
}

export const THEME_ACCENTS: Record<ThemeAccent, AccentThemeClasses> = {
  emerald: {
    id: "emerald",
    name: "Emerald Aurora",
    description: "Classic vitality, momentum, and growth focus",
    primary: "emerald-500",
    primaryHex: "#10b981",
    bgSubtle: "bg-emerald-500/10",
    borderSubtle: "border-emerald-500/20",
    textAccent: "text-emerald-400",
    badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    buttonBg: "bg-emerald-500",
    buttonHover: "hover:bg-emerald-400",
    buttonText: "text-black font-bold",
    glowShadow: "shadow-[0_0_20px_rgba(16,185,129,0.25)]",
    ringFocus: "focus:ring-emerald-500/50",
  },
  violet: {
    id: "violet",
    name: "Electric Violet",
    description: "Deep flow state, intellect, and creativity",
    primary: "violet-500",
    primaryHex: "#8b5cf6",
    bgSubtle: "bg-violet-500/10",
    borderSubtle: "border-violet-500/20",
    textAccent: "text-violet-400",
    badgeBg: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    buttonBg: "bg-violet-500",
    buttonHover: "hover:bg-violet-400",
    buttonText: "text-white font-bold",
    glowShadow: "shadow-[0_0_20px_rgba(139,92,246,0.25)]",
    ringFocus: "focus:ring-violet-500/50",
  },
  amber: {
    id: "amber",
    name: "Cyber Amber",
    description: "High energy, ambition, and relentless drive",
    primary: "amber-400",
    primaryHex: "#f59e0b",
    bgSubtle: "bg-amber-500/10",
    borderSubtle: "border-amber-500/20",
    textAccent: "text-amber-400",
    badgeBg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    buttonBg: "bg-amber-400",
    buttonHover: "hover:bg-amber-300",
    buttonText: "text-black font-bold",
    glowShadow: "shadow-[0_0_20px_rgba(245,158,11,0.25)]",
    ringFocus: "focus:ring-amber-400/50",
  },
  cyan: {
    id: "cyan",
    name: "Oceanic Cyan",
    description: "Hyperion neon, high-tech clarity, and speed",
    primary: "cyan-400",
    primaryHex: "#06b6d4",
    bgSubtle: "bg-cyan-500/10",
    borderSubtle: "border-cyan-500/20",
    textAccent: "text-cyan-400",
    badgeBg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    buttonBg: "bg-cyan-400",
    buttonHover: "hover:bg-cyan-300",
    buttonText: "text-black font-bold",
    glowShadow: "shadow-[0_0_20px_rgba(6,182,212,0.25)]",
    ringFocus: "focus:ring-cyan-400/50",
  },
  rose: {
    id: "rose",
    name: "Crimson Flare",
    description: "Passionate execution, urgency, and athletic grit",
    primary: "rose-500",
    primaryHex: "#f43f5e",
    bgSubtle: "bg-rose-500/10",
    borderSubtle: "border-rose-500/20",
    textAccent: "text-rose-400",
    badgeBg: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    buttonBg: "bg-rose-500",
    buttonHover: "hover:bg-rose-400",
    buttonText: "text-white font-bold",
    glowShadow: "shadow-[0_0_20px_rgba(244,63,94,0.25)]",
    ringFocus: "focus:ring-rose-500/50",
  },
  slate: {
    id: "slate",
    name: "Titanium Slate",
    description: "Monochrome minimalism, stealth, and pure focus",
    primary: "slate-200",
    primaryHex: "#e2e8f0",
    bgSubtle: "bg-white/10",
    borderSubtle: "border-white/20",
    textAccent: "text-slate-200",
    badgeBg: "bg-white/10 text-slate-200 border-white/20",
    buttonBg: "bg-slate-200",
    buttonHover: "hover:bg-white",
    buttonText: "text-black font-bold",
    glowShadow: "shadow-[0_0_20px_rgba(255,255,255,0.15)]",
    ringFocus: "focus:ring-white/50",
  },
};

export const DENSITY_CONFIG: Record<WorkspaceDensity, { label: string; paddingClass: string; gapClass: string; textScale: string }> = {
  compact: {
    label: "Compact Velocity",
    paddingClass: "p-4 sm:p-5",
    gapClass: "gap-3.5",
    textScale: "text-xs",
  },
  balanced: {
    label: "Balanced Modern",
    paddingClass: "p-6 sm:p-8",
    gapClass: "gap-5",
    textScale: "text-sm",
  },
  spacious: {
    label: "Spacious Luxury",
    paddingClass: "p-8 sm:p-10",
    gapClass: "gap-7",
    textScale: "text-base",
  },
};

export const ROLE_PRESETS = [
  {
    role: "SaaS Founder & Builder",
    icon: "Rocket",
    spheres: ["career", "learning", "finance", "mindfulness"],
    motto: "Ship high-leverage software daily and stay physically anti-fragile.",
    focusHours: 5,
  },
  {
    role: "Lifelong Polymath & Researcher",
    icon: "BookOpen",
    spheres: ["learning", "mindfulness", "creative", "personal"],
    motto: "Expand comprehension, synthesize mental models, and write deep thoughts.",
    focusHours: 4,
  },
  {
    role: "High-Performance Athlete",
    icon: "Activity",
    spheres: ["health", "mindfulness", "personal"],
    motto: "Consistency in aerobic volume, recovery metrics, and clean nutrition.",
    focusHours: 3,
  },
  {
    role: "Creative Polymath & Designer",
    icon: "Palette",
    spheres: ["creative", "learning", "career", "mindfulness"],
    motto: "Master the craft, build distinctive taste, and publish prolific work.",
    focusHours: 4,
  },
  {
    role: "Executive Strategist & Leader",
    icon: "Target",
    spheres: ["career", "finance", "health", "personal"],
    motto: "Protect cognitive energy, eliminate noise, and make high-stakes decisions.",
    focusHours: 4,
  },
  {
    role: "Habit & Wellness Optimizer",
    icon: "Sparkles",
    spheres: ["health", "mindfulness", "finance", "learning"],
    motto: "Small daily atomic habits compound into extraordinary life transformations.",
    focusHours: 3,
  },
];

export interface EyeComfortPresetInfo {
  id: EyeComfortPreset;
  label: string;
  sublabel: string;
  icon: string;
  kelvin: string;
  description: string;
  filterStyle: (warmth: number, brightness: number) => string;
  tintOverlayColor?: string;
  tintOverlayOpacity?: (warmth: number) => number;
}

export const EYE_COMFORT_PRESETS: Record<EyeComfortPreset, EyeComfortPresetInfo> = {
  off: {
    id: "off",
    label: "Crisp Precision",
    sublabel: "Standard 6500K",
    icon: "☀️",
    kelvin: "6500K",
    description: "Standard high-contrast color calibration without spectral attenuation.",
    filterStyle: () => "none",
  },
  warm: {
    id: "warm",
    label: "Amber Warmth",
    sublabel: "Sunset 3400K",
    icon: "🌅",
    kelvin: "3400K",
    description: "Filters harsh blue wavelengths with cozy amber warmth to reduce evening eye fatigue.",
    filterStyle: (warmth, brightness) => {
      const sepiaVal = (warmth / 100) * 0.38;
      const brightVal = brightness / 100;
      const hueShift = -Math.round((warmth / 100) * 14);
      return `sepia(${sepiaVal.toFixed(2)}) hue-rotate(${hueShift}deg) brightness(${brightVal.toFixed(2)}) contrast(0.97)`;
    },
    tintOverlayColor: "#f59e0b",
    tintOverlayOpacity: (warmth) => (warmth / 100) * 0.09,
  },
  candlelight: {
    id: "candlelight",
    label: "Candlelight Glow",
    sublabel: "Deep Night 2400K",
    icon: "🕯️",
    kelvin: "2400K",
    description: "Deep soothing amber-golden spectrum engineered for late-night focus and melatonin protection.",
    filterStyle: (warmth, brightness) => {
      const sepiaVal = 0.35 + (warmth / 100) * 0.35;
      const brightVal = (brightness / 100) * 0.96;
      const hueShift = -Math.round(15 + (warmth / 100) * 15);
      return `sepia(${sepiaVal.toFixed(2)}) hue-rotate(${hueShift}deg) brightness(${brightVal.toFixed(2)}) contrast(0.95)`;
    },
    tintOverlayColor: "#ea580c",
    tintOverlayOpacity: (warmth) => 0.06 + (warmth / 100) * 0.12,
  },
  paper: {
    id: "paper",
    label: "E-Ink / Slate Paper",
    sublabel: "Zero Chromatic Strain",
    icon: "📜",
    kelvin: "Neutral Paper",
    description: "Monochromatic, low-strain matte tone that relaxes optic nerves and mimics physical print.",
    filterStyle: (warmth, brightness) => {
      const grayVal = 0.75 + (warmth / 100) * 0.2;
      const sepiaVal = (warmth / 100) * 0.25;
      const brightVal = (brightness / 100) * 0.95;
      return `grayscale(${grayVal.toFixed(2)}) sepia(${sepiaVal.toFixed(2)}) brightness(${brightVal.toFixed(2)}) contrast(0.92)`;
    },
    tintOverlayColor: "#d97706",
    tintOverlayOpacity: (warmth) => (warmth / 100) * 0.04,
  },
  dim: {
    id: "dim",
    label: "Midnight Dimmer",
    sublabel: "Ultra-Low Lumens",
    icon: "🌙",
    kelvin: "Subdued Lumens",
    description: "Softens stark white contrast and decreases overall display luminous glare for dark rooms.",
    filterStyle: (warmth, brightness) => {
      const brightVal = (brightness / 100) * 0.88;
      const sepiaVal = (warmth / 100) * 0.15;
      return `brightness(${brightVal.toFixed(2)}) contrast(0.90) sepia(${sepiaVal.toFixed(2)})`;
    },
  },
};

