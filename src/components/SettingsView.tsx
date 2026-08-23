import React, { useState } from "react";
import {
  Settings,
  User,
  Palette,
  Sliders,
  Sparkles,
  Check,
  Flame,
  Layers,
  Volume2,
  Clock,
  Sun,
  Moon,
  Wand2,
  RotateCcw,
  CheckCircle2,
  Zap,
  Compass,
  Layout,
  Award,
  ShieldCheck,
  Users,
  Eye,
  Orbit,
} from "lucide-react";
import { motion } from "motion/react";
import confetti from "canvas-confetti";
import {
  UserProfile,
  UserStats,
  ThemeAccent,
  WorkspaceDensity,
  Category,
  BackgroundAnimationMode,
} from "../types";
import { THEME_ACCENTS, DENSITY_CONFIG } from "../lib/theme";
import { LifeSphereOrb } from "./LifeSphereOrb";
import { focusAudio } from "../lib/audio";

interface SettingsViewProps {
  profile: UserProfile;
  stats: UserStats;
  onUpdateProfile: (profile: UserProfile) => void;
  onOpenSetupWizard: () => void;
  onResetDefaults: () => void;
  onOpenProfileHub?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  profile,
  stats,
  onUpdateProfile,
  onOpenSetupWizard,
  onResetDefaults,
  onOpenProfileHub,
}) => {
  const [formData, setFormData] = useState<UserProfile>({ ...profile });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const currentTheme = THEME_ACCENTS[formData.themeConfig.accent] || THEME_ACCENTS.emerald;

  const handleSave = () => {
    onUpdateProfile(formData);
    setSavedSuccess(true);
    confetti({ particleCount: 35, spread: 50 });
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleToggleSphere = (sphere: Category) => {
    const exists = formData.selectedLifeSpheres.includes(sphere);
    const updated = exists
      ? formData.selectedLifeSpheres.filter((s) => s !== sphere)
      : [...formData.selectedLifeSpheres, sphere];
    setFormData({ ...formData, selectedLifeSpheres: updated });
  };

  const lifeSphereOptions: { id: Category; label: string; color: string }[] = [
    {
      id: "career",
      label: "Career & Tech",
      color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    },
    {
      id: "health",
      label: "Health & Vitality",
      color: "text-rose-400 bg-rose-500/10 border-rose-500/30",
    },
    {
      id: "learning",
      label: "Intellect & Learning",
      color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30",
    },
    {
      id: "finance",
      label: "Finance & Wealth",
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    },
    {
      id: "mindfulness",
      label: "Zen & Mindfulness",
      color: "text-teal-400 bg-teal-500/10 border-teal-500/30",
    },
    {
      id: "creative",
      label: "Creative & Arts",
      color: "text-purple-400 bg-purple-500/10 border-purple-500/30",
    },
    {
      id: "personal",
      label: "Personal & Social",
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner - Interstellar Config Deck */}
      <div className="relative bg-[#06070B]/90 md:bg-[#06070B]/75 backdrop-blur-3xl rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.12)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden">
        {/* Ambient Cosmic Mesh */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full blur-3xl opacity-20 bg-emerald-500/30" />
          <div className="absolute top-1/2 -right-20 w-56 h-56 rounded-full blur-3xl opacity-15 bg-cyan-500/25" />
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:18px_18px] opacity-25" />
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center space-x-2 text-emerald-400 mb-1 font-mono">
            <Sliders className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              SYSTEM TELEMETRY & CONFIG // SEC-09
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase">
            Personalize LifeOrbit OS
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl font-normal">
            Tailor your identity archetypes, visual accents, layout density, and daily focus parameters.
          </p>
        </div>

        <div className="relative z-10 flex items-center space-x-2.5 w-full md:w-auto font-mono">
          <button
            onClick={onOpenSetupWizard}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-slate-200 rounded-xl text-xs sm:text-sm font-bold border border-white/10 transition cursor-pointer active:scale-95"
          >
            <Wand2 className="w-4 h-4 text-emerald-400" />
            <span>Launch Wizard</span>
          </button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleSave}
            className={`flex-1 md:flex-initial flex items-center justify-center space-x-2 px-5 py-2.5 ${currentTheme.buttonBg} ${currentTheme.buttonHover} ${currentTheme.buttonText} rounded-xl text-xs sm:text-sm font-bold shadow-[0_0_20px_rgba(52,211,153,0.35)] transition cursor-pointer`}
          >
            {savedSuccess ? <Check className="w-4 h-4 stroke-[3]" /> : <CheckCircle2 className="w-4 h-4" />}
            <span>{savedSuccess ? "SYNCED!" : "SAVE CONFIG"}</span>
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Identity & Persona (2 cols wide on desktop) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Identity & Workspace Card */}
          <div className="bg-[#06070B]/90 backdrop-blur-3xl rounded-[28px] p-6 sm:p-7 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.7)] space-y-5">
            <div className="flex items-center space-x-2.5 pb-3 border-b border-white/10 font-mono">
              <User className={`w-4 h-4 ${currentTheme.textAccent}`} />
              <h3 className="font-bold text-white text-sm uppercase">User Identity & Flight North Star</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Display Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#06070B] border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500/50 font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Custom Workspace Brand Title
                </label>
                <input
                  type="text"
                  value={formData.themeConfig.customAppTitle}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      themeConfig: { ...formData.themeConfig, customAppTitle: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#06070B] border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500/50 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Current Role / Focus Archetype
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#06070B] border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500/50 font-medium"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Personal North Star Motto
              </label>
              <textarea
                rows={2}
                value={formData.northStarMotto}
                onChange={(e) => setFormData({ ...formData, northStarMotto: e.target.value })}
                className="w-full px-3.5 py-2 bg-[#06070B] border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500/50 font-normal"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Active Planetary Life Spheres ({formData.selectedLifeSpheres.length} active)
                </label>
                <span className="text-[10px] text-slate-500 font-mono">Click to toggle orbital tracking</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3 p-3.5 rounded-2xl bg-black/40 border border-white/5">
                {(
                  [
                    "health",
                    "career",
                    "learning",
                    "finance",
                    "mindfulness",
                    "creative",
                    "personal",
                  ] as Category[]
                ).map((sphereId) => {
                  const isSelected = formData.selectedLifeSpheres.includes(sphereId);
                  return (
                    <LifeSphereOrb
                      key={sphereId}
                      sphereId={sphereId}
                      isSelected={isSelected}
                      size="sm"
                      onClick={() => {
                        focusAudio.playClick();
                        handleToggleSphere(sphereId);
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Theme Accent Color Picker */}
          <div className="bg-[#06070B]/90 backdrop-blur-3xl rounded-[28px] p-6 sm:p-7 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.7)] space-y-5">
            <div className="flex items-center space-x-2.5 pb-3 border-b border-white/10 font-mono">
              <Palette className={`w-4 h-4 ${currentTheme.textAccent}`} />
              <h3 className="font-bold text-white text-sm uppercase">Interface Atmosphere & Accent</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.values(THEME_ACCENTS).map((acc) => {
                const isSelected = formData.themeConfig.accent === acc.id;
                return (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        themeConfig: { ...formData.themeConfig, accent: acc.id },
                      })
                    }
                    className={`p-3.5 rounded-2xl border transition text-left flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? `${acc.bgSubtle} ${acc.borderSubtle} ring-2 ring-${acc.primary} shadow-[0_0_15px_rgba(255,255,255,0.05)]`
                        : "bg-white/[0.03] border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5 font-mono">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-3.5 h-3.5 rounded-full shadow-xs"
                          style={{ backgroundColor: acc.primaryHex }}
                        />
                        <span className="text-xs font-bold text-white uppercase">{acc.name}</span>
                      </div>
                      {isSelected && <Check className={`w-3.5 h-3.5 ${acc.textAccent}`} />}
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight font-normal">{acc.description}</p>
                  </button>
                );
              })}
            </div>

            {/* Ambient Background Animation Mode */}
            <div className="pt-3 border-t border-white/10">
              <div className="flex items-center justify-between mb-2 font-mono">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Ambient Background Animation
                </label>
                <span className="text-[10px] font-bold text-emerald-400">GPU ACCELERATED</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 font-mono">
                {(
                  [
                    { id: "aurora", label: "Aurora Glow", desc: "Drifting smooth light" },
                    { id: "particles", label: "Starfield", desc: "Connected constellation" },
                    { id: "cyberpunk", label: "Cyber Matrix", desc: "Laser scanline grid" },
                    { id: "mesh", label: "Quantum Mesh", desc: "Geometric wave field" },
                    { id: "none", label: "OLED Dark", desc: "Pure minimal canvas" },
                  ] as { id: BackgroundAnimationMode; label: string; desc: string }[]
                ).map((b) => {
                  const isSelected = (formData.themeConfig.ambientBackground || "aurora") === b.id;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          themeConfig: { ...formData.themeConfig, ambientBackground: b.id },
                        })
                      }
                      className={`p-3 rounded-2xl border text-left transition cursor-pointer active:scale-95 ${
                        isSelected
                          ? `${currentTheme.bgSubtle} ${currentTheme.borderSubtle} text-white font-bold shadow-[0_0_12px_rgba(255,255,255,0.05)]`
                          : "bg-white/[0.03] border-white/10 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <span className="text-xs block font-bold text-white mb-0.5">{b.label}</span>
                      <span className="text-[9px] text-slate-500 font-normal leading-tight block">
                        {b.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Density Selector */}
            <div className="pt-3 border-t border-white/10">
              <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
                Card & Layout Density
              </label>
              <div className="grid grid-cols-3 gap-2.5 font-mono">
                {(Object.keys(DENSITY_CONFIG) as WorkspaceDensity[]).map((dKey) => {
                  const cfg = DENSITY_CONFIG[dKey];
                  const isSelected = formData.themeConfig.density === dKey;
                  return (
                    <button
                      key={dKey}
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          themeConfig: { ...formData.themeConfig, density: dKey },
                        })
                      }
                      className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                        isSelected
                          ? `${currentTheme.bgSubtle} ${currentTheme.borderSubtle} text-white font-bold`
                          : "bg-white/[0.03] border-white/10 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <span className="text-xs block capitalize font-bold">{dKey}</span>
                      <span className="text-[9px] text-slate-500 font-normal">{cfg.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Daily Anchors & Display Toggles */}
        <div className="space-y-6">
          {/* Daily Rhythm Anchors */}
          <div className="bg-[#06070B]/90 backdrop-blur-3xl rounded-[28px] p-6 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.7)] space-y-4">
            <div className="flex items-center space-x-2.5 pb-3 border-b border-white/10 font-mono">
              <Clock className={`w-4 h-4 ${currentTheme.textAccent}`} />
              <h3 className="font-bold text-white text-sm uppercase">Routine Anchors</h3>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5 font-mono">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Daily Deep Work Target
                </label>
                <span className={`text-xs font-bold ${currentTheme.textAccent}`}>
                  {formData.targetFocusHoursPerDay} Hours
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={formData.targetFocusHoursPerDay}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    targetFocusHoursPerDay: parseInt(e.target.value, 10),
                  })
                }
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 font-mono">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1 flex items-center space-x-1 uppercase">
                  <Sun className="w-3 h-3 text-amber-400" />
                  <span>Wake Time</span>
                </label>
                <input
                  type="time"
                  value={formData.wakeTime}
                  onChange={(e) => setFormData({ ...formData, wakeTime: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-[#06070B] border border-white/15 rounded-xl text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1 flex items-center space-x-1 uppercase">
                  <Moon className="w-3 h-3 text-indigo-400" />
                  <span>Sleep Time</span>
                </label>
                <input
                  type="time"
                  value={formData.sleepTime}
                  onChange={(e) => setFormData({ ...formData, sleepTime: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-[#06070B] border border-white/15 rounded-xl text-xs text-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Interactive Toggles */}
          <div className="bg-[#06070B]/90 backdrop-blur-3xl rounded-[28px] p-6 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.7)] space-y-3.5">
            <div className="flex items-center space-x-2.5 pb-3 border-b border-white/10 font-mono">
              <Layout className={`w-4 h-4 ${currentTheme.textAccent}`} />
              <h3 className="font-bold text-white text-sm uppercase">Telemetry & Audio</h3>
            </div>

            <div
              onClick={() =>
                setFormData({
                  ...formData,
                  themeConfig: {
                    ...formData.themeConfig,
                    showStreakBadges: !formData.themeConfig.showStreakBadges,
                  },
                })
              }
              className="p-3 bg-white/[0.03] rounded-2xl border border-white/10 flex items-center justify-between cursor-pointer hover:border-white/20 transition"
            >
              <div className="flex items-center space-x-2.5">
                <Flame className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-semibold text-white">Streak Flame Badges</span>
              </div>
              <div
                className={`w-8 h-4.5 rounded-full transition-colors relative flex items-center p-0.5 ${
                  formData.themeConfig.showStreakBadges ? currentTheme.buttonBg : "bg-white/10"
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                    formData.themeConfig.showStreakBadges ? "translate-x-3.5" : "translate-x-0"
                  }`}
                />
              </div>
            </div>

            <div
              onClick={() =>
                setFormData({
                  ...formData,
                  themeConfig: {
                    ...formData.themeConfig,
                    showMilestonesOnCards: !formData.themeConfig.showMilestonesOnCards,
                  },
                })
              }
              className="p-3 bg-white/[0.03] rounded-2xl border border-white/10 flex items-center justify-between cursor-pointer hover:border-white/20 transition"
            >
              <div className="flex items-center space-x-2.5">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-semibold text-white">Milestone Trajectory Tracks</span>
              </div>
              <div
                className={`w-8 h-4.5 rounded-full transition-colors relative flex items-center p-0.5 ${
                  formData.themeConfig.showMilestonesOnCards ? currentTheme.buttonBg : "bg-white/10"
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                    formData.themeConfig.showMilestonesOnCards ? "translate-x-3.5" : "translate-x-0"
                  }`}
                />
              </div>
            </div>

            <div
              onClick={() =>
                setFormData({
                  ...formData,
                  themeConfig: {
                    ...formData.themeConfig,
                    soundEffectsEnabled: !formData.themeConfig.soundEffectsEnabled,
                  },
                })
              }
              className="p-3 bg-white/[0.03] rounded-2xl border border-white/10 flex items-center justify-between cursor-pointer hover:border-white/20 transition"
            >
              <div className="flex items-center space-x-2.5">
                <Volume2 className="w-4 h-4 text-teal-400" />
                <span className="text-xs font-semibold text-white">Acoustic Audio Feedback</span>
              </div>
              <div
                className={`w-8 h-4.5 rounded-full transition-colors relative flex items-center p-0.5 ${
                  formData.themeConfig.soundEffectsEnabled ? currentTheme.buttonBg : "bg-white/10"
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                    formData.themeConfig.soundEffectsEnabled ? "translate-x-3.5" : "translate-x-0"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Danger / Reset Zone */}
          <div className="bg-[#06070B]/90 backdrop-blur-3xl rounded-[28px] p-5 border border-white/10 shadow-[0_0_25px_rgba(0,0,0,0.5)] flex items-center justify-between font-mono">
            <div>
              <h4 className="text-xs font-bold text-white uppercase">Reset Workspace</h4>
              <p className="text-[10px] text-slate-500 font-normal">Restore factory sample endeavors</p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (confirm("Reset all settings and load sample endeavors?")) {
                  onResetDefaults();
                }
              }}
              className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
