import React from "react";
import {
  BookOpen,
  Sparkles,
  Cpu,
  DollarSign,
  Activity,
  Flame,
  CheckCircle2,
  Plus,
  Search,
  Calendar,
  Clock,
  Target,
  TrendingUp,
  BarChart3,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Bot,
  ArrowUpRight,
  Check,
  Layers,
  Settings,
  Download,
  Upload,
  Trash2,
  Edit3,
  Filter,
  CheckSquare,
  Zap,
  Award,
  Compass,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  X,
  Briefcase,
  GraduationCap,
  Heart,
  Smile,
  Circle,
  HelpCircle,
  MoreVertical,
  CalendarDays,
  Smartphone,
  Laptop,
  Share2,
  Orbit,
  Dumbbell,
  Code2,
  Music,
  Palette,
  Feather,
  Sun,
  Moon,
  Star,
  Globe,
  Radio,
  LucideIcon,
} from "lucide-react";

export function getEndeavorIcon(iconName: string, className = "w-5 h-5") {
  const baseClass = `${className} drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] stroke-[2.2]`;
  switch (iconName) {
    case "BookOpen":
      return <BookOpen className={baseClass} />;
    case "Sparkles":
      return <Sparkles className={baseClass} />;
    case "Cpu":
      return <Cpu className={baseClass} />;
    case "Code2":
      return <Code2 className={baseClass} />;
    case "DollarSign":
      return <DollarSign className={baseClass} />;
    case "Activity":
      return <Activity className={baseClass} />;
    case "Flame":
      return <Flame className={baseClass} />;
    case "Briefcase":
      return <Briefcase className={baseClass} />;
    case "GraduationCap":
      return <GraduationCap className={baseClass} />;
    case "Heart":
      return <Heart className={baseClass} />;
    case "Dumbbell":
      return <Dumbbell className={baseClass} />;
    case "Music":
      return <Music className={baseClass} />;
    case "Palette":
      return <Palette className={baseClass} />;
    case "Feather":
      return <Feather className={baseClass} />;
    case "Orbit":
      return <Orbit className={baseClass} />;
    case "Smile":
      return <Smile className={baseClass} />;
    case "Target":
      return <Target className={baseClass} />;
    case "Zap":
      return <Zap className={baseClass} />;
    case "Award":
      return <Award className={baseClass} />;
    default:
      return <Target className={baseClass} />;
  }
}

/**
 * Stylized Icon Orb Container Component
 */
interface StylizedIconOrbProps {
  icon?: LucideIcon | React.ReactNode;
  iconName?: string;
  color?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "pod" | "neon" | "glass" | "solid";
  glow?: boolean;
  className?: string;
}

export const StylizedIconOrb: React.FC<StylizedIconOrbProps> = ({
  icon,
  iconName,
  color = "#10b981",
  size = "md",
  variant = "pod",
  glow = true,
  className = "",
}) => {
  const sizeMap = {
    xs: "w-6 h-6 rounded-lg text-xs",
    sm: "w-8 h-8 rounded-xl text-sm",
    md: "w-10 h-10 rounded-2xl text-base",
    lg: "w-12 h-12 rounded-2xl text-lg",
    xl: "w-16 h-16 rounded-3xl text-2xl",
  }[size];

  const iconSizeMap = {
    xs: "w-3.5 h-3.5",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8",
  }[size];

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${sizeMap} ${className}`}>
      {/* Ambient Glow Aura */}
      {glow && (
        <div
          className="absolute inset-0 rounded-inherit blur-md opacity-50 transition-opacity pointer-events-none"
          style={{ backgroundColor: color }}
        />
      )}

      {/* Styled Capsule Body */}
      <div
        className={`relative w-full h-full rounded-inherit flex items-center justify-center border transition-transform shadow-lg ${
          variant === "pod"
            ? "border-white/20 bg-gradient-to-br from-white/15 via-white/5 to-black/60"
            : variant === "neon"
            ? "border-white/30 bg-black/80"
            : "border-white/10 bg-white/5"
        }`}
        style={{
          boxShadow: `inset 0 1px 1px rgba(255, 255, 255, 0.4), 0 4px 14px rgba(0, 0, 0, 0.6)`,
        }}
      >
        {/* Top light reflection */}
        <div
          className="absolute top-0.5 inset-x-1.5 h-1/3 rounded-t-full pointer-events-none opacity-40"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.7) 0%, transparent 100%)",
          }}
        />

        {/* Inner Icon */}
        <div className="relative z-10 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] flex items-center justify-center">
          {iconName
            ? getEndeavorIcon(iconName, iconSizeMap)
            : typeof icon === "function"
            ? React.createElement(icon as any, { className: `${iconSizeMap} stroke-[2.2]` })
            : icon}
        </div>
      </div>
    </div>
  );
};

export function getCategoryBadge(category: string) {
  switch (category) {
    case "health":
      return {
        label: "Health & Vitality",
        shortLabel: "HEALTH",
        color: "bg-rose-500/10 text-rose-300 border-rose-500/30 shadow-[0_0_12px_rgba(244,63,94,0.15)]",
        accent: "#f43f5e",
        emoji: "⚡",
      };
    case "career":
      return {
        label: "Career & Ambition",
        shortLabel: "CAREER",
        color: "bg-amber-500/10 text-amber-300 border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.15)]",
        accent: "#f59e0b",
        emoji: "💻",
      };
    case "learning":
      return {
        label: "Learning & Mastery",
        shortLabel: "LEARNING",
        color: "bg-indigo-500/10 text-indigo-300 border-indigo-500/30 shadow-[0_0_12px_rgba(99,102,241,0.15)]",
        accent: "#8b5cf6",
        emoji: "🧠",
      };
    case "finance":
      return {
        label: "Wealth & Finance",
        shortLabel: "FINANCE",
        color: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]",
        accent: "#10b981",
        emoji: "💎",
      };
    case "creative":
      return {
        label: "Creative & Arts",
        shortLabel: "CREATIVE",
        color: "bg-pink-500/10 text-pink-300 border-pink-500/30 shadow-[0_0_12px_rgba(236,72,153,0.15)]",
        accent: "#ec4899",
        emoji: "🎨",
      };
    case "mindfulness":
      return {
        label: "Zen & Mindfulness",
        shortLabel: "ZEN",
        color: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)]",
        accent: "#06b6d4",
        emoji: "🧘",
      };
    default:
      return {
        label: "Personal Growth",
        shortLabel: "PERSONAL",
        color: "bg-sky-500/10 text-sky-300 border-sky-500/30 shadow-[0_0_12px_rgba(56,189,248,0.15)]",
        accent: "#38bdf8",
        emoji: "🌟",
      };
  }
}

export function getArchetypeInfo(archetype: string) {
  switch (archetype) {
    case "meter":
      return {
        label: "Quantifiable Target",
        codename: "METRIC TELEMETRY",
        desc: "Numerical meter tracking specific units (e.g., $10k, 50 books, 100km)",
        badgeBg: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30 shadow-[0_0_10px_rgba(99,102,241,0.2)]",
      };
    case "habit":
      return {
        label: "Daily Ritual",
        codename: "CONSISTENCY CADENCE",
        desc: "Binary consistency check-ins and streak momentum",
        badgeBg: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]",
      };
    case "milestone":
      return {
        label: "Project Milestones",
        codename: "STAGED TRAJECTORY",
        desc: "Multi-stage hierarchical endeavors with phases and sub-tasks",
        badgeBg: "bg-amber-500/15 text-amber-300 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.2)]",
      };
    default:
      return {
        label: "Endeavor",
        codename: "ORBITAL VECTOR",
        desc: "Activity tracking",
        badgeBg: "bg-white/10 text-slate-300 border-white/20",
      };
  }
}
