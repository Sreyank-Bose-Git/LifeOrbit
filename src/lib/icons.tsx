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
} from "lucide-react";

export function getEndeavorIcon(iconName: string, className = "w-5 h-5") {
  switch (iconName) {
    case "BookOpen":
      return <BookOpen className={className} />;
    case "Sparkles":
      return <Sparkles className={className} />;
    case "Cpu":
      return <Cpu className={className} />;
    case "DollarSign":
      return <DollarSign className={className} />;
    case "Activity":
      return <Activity className={className} />;
    case "Flame":
      return <Flame className={className} />;
    case "Briefcase":
      return <Briefcase className={className} />;
    case "GraduationCap":
      return <GraduationCap className={className} />;
    case "Heart":
      return <Heart className={className} />;
    case "Smile":
      return <Smile className={className} />;
    case "Target":
      return <Target className={className} />;
    case "Zap":
      return <Zap className={className} />;
    case "Award":
      return <Award className={className} />;
    default:
      return <Target className={className} />;
  }
}

export function getCategoryBadge(category: string) {
  switch (category) {
    case "health":
      return { label: "Health & Vitality", color: "bg-red-50 text-red-600 border-red-200" };
    case "career":
      return { label: "Career & Tech", color: "bg-amber-50 text-amber-600 border-amber-200" };
    case "learning":
      return { label: "Learning & Mastery", color: "bg-indigo-50 text-indigo-600 border-indigo-200" };
    case "finance":
      return { label: "Wealth & Finance", color: "bg-emerald-50 text-emerald-600 border-emerald-200" };
    case "creative":
      return { label: "Creative & Arts", color: "bg-pink-50 text-pink-600 border-pink-200" };
    case "mindfulness":
      return { label: "Mindfulness & Zen", color: "bg-teal-50 text-teal-600 border-teal-200" };
    default:
      return { label: "Personal Growth", color: "bg-blue-50 text-blue-600 border-blue-200" };
  }
}

export function getArchetypeInfo(archetype: string) {
  switch (archetype) {
    case "meter":
      return {
        label: "Quantifiable Target",
        desc: "Numerical meter tracking specific units (e.g., $10k, 50 books, 100km)",
        badgeBg: "bg-indigo-100 text-indigo-800",
      };
    case "habit":
      return {
        label: "Daily / Weekly Habit",
        desc: "Binary consistency check-ins and streak momentum",
        badgeBg: "bg-emerald-100 text-emerald-800",
      };
    case "milestone":
      return {
        label: "Project Milestones",
        desc: "Multi-stage hierarchical endeavors with phases and sub-tasks",
        badgeBg: "bg-amber-100 text-amber-800",
      };
    default:
      return {
        label: "Endeavor",
        desc: "Activity tracking",
        badgeBg: "bg-gray-100 text-gray-800",
      };
  }
}
