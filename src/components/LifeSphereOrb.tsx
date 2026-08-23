import React from "react";
import { Category } from "../types";
import { Sparkles, Flame, Orbit } from "lucide-react";

export interface SphereDefinition {
  id: Category | "all";
  label: string;
  codename: string;
  emoji: string;
  accentColor: string;
  glowColor: string;
  ringColor: string;
  surfaceGradient: string;
  atmosphereGlow: string;
  description: string;
  element: string;
}

export const SPHERE_DEFINITIONS: Record<Category | "all", SphereDefinition> = {
  all: {
    id: "all",
    label: "All Spheres",
    codename: "Cosmic Multiverse",
    emoji: "🪐",
    accentColor: "#10b981",
    glowColor: "rgba(16, 185, 129, 0.45)",
    ringColor: "rgba(52, 211, 153, 0.6)",
    surfaceGradient: "radial-gradient(circle at 32% 30%, #34d399 0%, #059669 45%, #064e3b 80%, #022c22 100%)",
    atmosphereGlow: "rgba(52, 211, 153, 0.35)",
    description: "Holistic life harmony across all active planetary domains",
    element: "Cosmic Aether",
  },
  health: {
    id: "health",
    label: "Health",
    codename: "Solar Vitality",
    emoji: "⚡",
    accentColor: "#f43f5e",
    glowColor: "rgba(244, 63, 94, 0.5)",
    ringColor: "rgba(251, 113, 133, 0.65)",
    surfaceGradient: "radial-gradient(circle at 30% 28%, #fb7185 0%, #f43f5e 40%, #be123c 75%, #4c0519 100%)",
    atmosphereGlow: "rgba(244, 63, 94, 0.4)",
    description: "Physical vitality, workout consistency & biological recharge",
    element: "Solar Plasma",
  },
  career: {
    id: "career",
    label: "Career",
    codename: "Titan Ambition",
    emoji: "💻",
    accentColor: "#f59e0b",
    glowColor: "rgba(245, 158, 11, 0.5)",
    ringColor: "rgba(251, 191, 36, 0.65)",
    surfaceGradient: "radial-gradient(circle at 30% 28%, #fde68a 0%, #f59e0b 45%, #b45309 80%, #451a03 100%)",
    atmosphereGlow: "rgba(245, 158, 11, 0.4)",
    description: "Professional momentum, leadership endeavors & high-leverage impact",
    element: "Golden Amber",
  },
  learning: {
    id: "learning",
    label: "Learning",
    codename: "Pulsar Wisdom",
    emoji: "🧠",
    accentColor: "#8b5cf6",
    glowColor: "rgba(139, 92, 246, 0.5)",
    ringColor: "rgba(167, 139, 250, 0.65)",
    surfaceGradient: "radial-gradient(circle at 30% 28%, #c4b5fd 0%, #8b5cf6 45%, #6d28d9 80%, #2e1065 100%)",
    atmosphereGlow: "rgba(139, 92, 246, 0.4)",
    description: "Deep intellectual expansion, reading mastery & skill acquisition",
    element: "Violet Nebula",
  },
  finance: {
    id: "finance",
    label: "Finance",
    codename: "Jade Abundance",
    emoji: "💎",
    accentColor: "#10b981",
    glowColor: "rgba(16, 185, 129, 0.5)",
    ringColor: "rgba(52, 211, 153, 0.65)",
    surfaceGradient: "radial-gradient(circle at 30% 28%, #a7f3d0 0%, #10b981 45%, #047857 80%, #064e3b 100%)",
    atmosphereGlow: "rgba(16, 185, 129, 0.4)",
    description: "Capital compounding, investment velocity & financial sovereignty",
    element: "Emerald Quartz",
  },
  mindfulness: {
    id: "mindfulness",
    label: "Zen",
    codename: "Oceanic Tranquility",
    emoji: "🧘",
    accentColor: "#06b6d4",
    glowColor: "rgba(6, 182, 212, 0.5)",
    ringColor: "rgba(34, 211, 238, 0.65)",
    surfaceGradient: "radial-gradient(circle at 30% 28%, #a5f3fc 0%, #06b6d4 45%, #0e7490 80%, #164e63 100%)",
    atmosphereGlow: "rgba(6, 182, 212, 0.4)",
    description: "Mental stillness, diaphragmatic presence & cognitive clarity",
    element: "Cyan Tides",
  },
  creative: {
    id: "creative",
    label: "Creative",
    codename: "Aurora Expression",
    emoji: "🎨",
    accentColor: "#ec4899",
    glowColor: "rgba(236, 72, 153, 0.5)",
    ringColor: "rgba(244, 114, 182, 0.65)",
    surfaceGradient: "radial-gradient(circle at 30% 28%, #fbcfe8 0%, #ec4899 45%, #be185d 80%, #500724 100%)",
    atmosphereGlow: "rgba(236, 72, 153, 0.4)",
    description: "Artistic output, music composition, writing & visionary design",
    element: "Magenta Aurora",
  },
  personal: {
    id: "personal",
    label: "Personal",
    codename: "Stellar Harmony",
    emoji: "🌟",
    accentColor: "#38bdf8",
    glowColor: "rgba(56, 189, 248, 0.5)",
    ringColor: "rgba(125, 211, 252, 0.65)",
    surfaceGradient: "radial-gradient(circle at 30% 28%, #bae6fd 0%, #38bdf8 45%, #0369a1 80%, #082f49 100%)",
    atmosphereGlow: "rgba(56, 189, 248, 0.4)",
    description: "Relationships, home sanctuary, adventures & personal milestones",
    element: "Starlight Aura",
  },
};

interface LifeSphereOrbProps {
  sphereId: Category | "all";
  isSelected?: boolean;
  count?: number;
  size?: "sm" | "md" | "lg" | "xl";
  onClick?: () => void;
  showLabel?: boolean;
  showCodename?: boolean;
  interactive?: boolean;
  className?: string;
}

export const LifeSphereOrb: React.FC<LifeSphereOrbProps> = ({
  sphereId,
  isSelected = false,
  count,
  size = "md",
  onClick,
  showLabel = true,
  showCodename = false,
  interactive = true,
  className = "",
}) => {
  const sphere = SPHERE_DEFINITIONS[sphereId] || SPHERE_DEFINITIONS.all;

  // Sizing definitions
  const sizeConfig = {
    sm: {
      container: "w-11 h-11",
      sphere: "w-9 h-9",
      emoji: "text-xs",
      ringScale: "scale-90",
      badge: "text-[8px] px-1 py-0.2 -bottom-1 -right-1",
      label: "text-[10px]",
    },
    md: {
      container: "w-16 h-16",
      sphere: "w-13 h-13",
      emoji: "text-base",
      ringScale: "scale-100",
      badge: "text-[9px] px-1.5 py-0.5 -bottom-1 -right-1",
      label: "text-[11px]",
    },
    lg: {
      container: "w-20 h-20",
      sphere: "w-16 h-16",
      emoji: "text-xl",
      ringScale: "scale-110",
      badge: "text-[10px] px-2 py-0.5 -bottom-1.5 -right-1.5",
      label: "text-xs",
    },
    xl: {
      container: "w-28 h-28",
      sphere: "w-22 h-22",
      emoji: "text-3xl",
      ringScale: "scale-125",
      badge: "text-xs px-2.5 py-1 -bottom-2 -right-2",
      label: "text-sm",
    },
  }[size];

  return (
    <div
      onClick={interactive ? onClick : undefined}
      className={`group flex flex-col items-center shrink-0 select-none ${
        interactive ? "cursor-pointer" : ""
      } ${className}`}
    >
      {/* 3D Celestial Sphere Container */}
      <div className={`relative flex items-center justify-center ${sizeConfig.container}`}>
        {/* Outer Atmospheric Corona Glow */}
        <div
          className={`absolute inset-0 rounded-full blur-xl transition-all duration-300 pointer-events-none ${
            isSelected
              ? "opacity-90 scale-125"
              : "opacity-25 group-hover:opacity-60 group-hover:scale-115"
          }`}
          style={{
            backgroundColor: sphere.glowColor,
          }}
        />

        {/* Outer Pulsing Beacon Orbit (Visible when Selected) */}
        {isSelected && (
          <div
            className="absolute -inset-1.5 rounded-full border border-dashed animate-spin-slow pointer-events-none"
            style={{
              borderColor: sphere.ringColor,
              opacity: 0.8,
            }}
          />
        )}

        {/* Saturn-Style Planetary Ring (Angled Celestial Orbit Band) */}
        <div
          className={`absolute pointer-events-none transition-transform duration-500 ${sizeConfig.ringScale} ${
            isSelected ? "rotate-[-28deg] scale-110" : "rotate-[-24deg] group-hover:rotate-[-28deg] group-hover:scale-105"
          }`}
          style={{
            width: "135%",
            height: "44%",
          }}
        >
          <div
            className="w-full h-full rounded-[100%] border-[2px] shadow-[0_0_12px_rgba(255,255,255,0.2)] transition-opacity duration-300"
            style={{
              borderColor: sphere.ringColor,
              background: `linear-gradient(90deg, transparent 5%, ${sphere.ringColor} 50%, transparent 95%)`,
              opacity: isSelected ? 0.95 : 0.45,
            }}
          />
        </div>

        {/* 3D Realistic Sphere Body */}
        <div
          className={`relative rounded-full transition-all duration-300 transform flex items-center justify-center overflow-hidden shadow-2xl ${
            sizeConfig.sphere
          } ${
            isSelected
              ? "scale-105 ring-2 ring-white/80 shadow-[0_0_25px_rgba(255,255,255,0.4)]"
              : "group-hover:scale-105 group-hover:ring-1 group-hover:ring-white/40 ring-1 ring-white/10"
          }`}
          style={{
            background: sphere.surfaceGradient,
            boxShadow: `inset -6px -6px 14px rgba(0, 0, 0, 0.85), inset 3px 3px 8px rgba(255, 255, 255, 0.65), 0 10px 25px rgba(0, 0, 0, 0.7)`,
          }}
        >
          {/* Specular Light Reflection Crescent (Gloss / Depth Lighting) */}
          <div
            className="absolute top-1 left-1.5 w-1/2 h-1/3 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at center, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0.1) 60%, transparent 85%)",
              transform: "rotate(-25deg)",
            }}
          />

          {/* Deep Planetary Shadow Core (Bottom-Right Rim Shadow) */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle at 75% 78%, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.3) 40%, transparent 70%)",
            }}
          />

          {/* Core Emoji / Icon Symbol */}
          <span
            className={`relative z-10 select-none transform transition-transform duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] ${
              sizeConfig.emoji
            } ${isSelected ? "scale-110" : "group-hover:scale-110"}`}
          >
            {sphere.emoji}
          </span>
        </div>

        {/* Telemetry Count Pill Badge */}
        {typeof count === "number" && (
          <div
            className={`absolute z-20 font-mono font-black rounded-full border shadow-xl flex items-center space-x-0.5 ${
              sizeConfig.badge
            } ${
              isSelected
                ? "bg-white text-black border-white shadow-[0_0_10px_rgba(255,255,255,0.6)]"
                : "bg-[#06070B]/90 text-slate-200 border-white/20 group-hover:border-white/40"
            }`}
          >
            <span>{count}</span>
          </div>
        )}
      </div>

      {/* Sphere Label & Codename */}
      {showLabel && (
        <div className="text-center mt-1.5 space-y-0.5">
          <span
            className={`block font-bold tracking-tight transition-colors duration-200 ${
              sizeConfig.label
            } ${
              isSelected
                ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] font-extrabold"
                : "text-slate-400 group-hover:text-slate-200"
            }`}
          >
            {sphere.label}
          </span>
          {showCodename && (
            <span className="block text-[9px] font-mono text-slate-500 tracking-wider uppercase">
              {sphere.codename}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
