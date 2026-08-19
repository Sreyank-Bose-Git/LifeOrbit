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
  Sparkle,
} from "lucide-react";
import confetti from "canvas-confetti";
import { UserProfile, UserStats, ThemeAccent, WorkspaceDensity, Category, BackgroundAnimationMode } from "../types";
import { THEME_ACCENTS, DENSITY_CONFIG, ROLE_PRESETS } from "../lib/theme";

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
    { id: "career", label: "Career & Tech", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
    { id: "health", label: "Health & Vitality", color: "text-rose-400 bg-rose-500/10 border-rose-500/20" },
    { id: "learning", label: "Intellect & Learning", color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" },
    { id: "finance", label: "Finance & Wealth", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
    { id: "mindfulness", label: "Zen & Mindfulness", color: "text-teal-400 bg-teal-500/10 border-teal-500/20" },
    { id: "creative", label: "Creative & Arts", color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
    { id: "personal", label: "Personal & Relationships", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-[#0D0D0D] rounded-3xl p-6 sm:p-8 border border-white/5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 mb-1">
            <Sliders className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Customization & Profile Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Personalize Your OS
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Tailor your identity archetypes, visual accents, layout density, and daily focus parameters.
          </p>
        </div>

        <div className="flex items-center space-x-2.5 w-full md:w-auto">
          <button
            onClick={onOpenSetupWizard}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-slate-200 rounded-xl text-xs sm:text-sm font-semibold border border-white/5 transition"
          >
            <Wand2 className="w-4 h-4 text-emerald-400" />
            <span>Launch Setup Wizard</span>
          </button>

          <button
            onClick={handleSave}
            className={`flex-1 md:flex-initial flex items-center justify-center space-x-2 px-5 py-2.5 ${currentTheme.buttonBg} ${currentTheme.buttonHover} ${currentTheme.buttonText} rounded-xl text-xs sm:text-sm font-bold shadow-xs transition`}
          >
            {savedSuccess ? <Check className="w-4 h-4 stroke-[3]" /> : <SaveIcon className="w-4 h-4" />}
            <span>{savedSuccess ? "Saved!" : "Save Changes"}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Identity & Persona (2 cols wide on desktop) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Identity & Workspace Card */}
          <div className="bg-[#0D0D0D] rounded-3xl p-6 border border-white/5 space-y-5">
            <div className="flex items-center space-x-2.5 pb-3 border-b border-white/5">
              <User className={`w-5 h-5 ${currentTheme.textAccent}`} />
              <h3 className="font-bold text-white text-base">User Identity & North Star</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Display Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#141414] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
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
                  className="w-full px-3.5 py-2.5 bg-[#141414] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Current Role / Focus Archetype
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#141414] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Personal North Star Motto
              </label>
              <textarea
                rows={2}
                value={formData.northStarMotto}
                onChange={(e) => setFormData({ ...formData, northStarMotto: e.target.value })}
                className="w-full px-3.5 py-2 bg-[#141414] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Active Life Spheres
              </label>
              <div className="flex flex-wrap gap-2">
                {lifeSphereOptions.map((opt) => {
                  const isSelected = formData.selectedLifeSpheres.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleToggleSphere(opt.id)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
                        isSelected
                          ? `${opt.color} ring-1 ring-white/10`
                          : "bg-[#141414] border-white/5 text-slate-400 hover:text-white"
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Theme Accent Color Picker */}
          <div className="bg-[#0D0D0D] rounded-3xl p-6 border border-white/5 space-y-5">
            <div className="flex items-center space-x-2.5 pb-3 border-b border-white/5">
              <Palette className={`w-5 h-5 ${currentTheme.textAccent}`} />
              <h3 className="font-bold text-white text-base">Interface Atmosphere & Accent</h3>
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
                    className={`p-3.5 rounded-2xl border transition text-left flex flex-col justify-between ${
                      isSelected
                        ? `${acc.bgSubtle} ${acc.borderSubtle} ring-2 ring-${acc.primary}`
                        : "bg-[#141414] border-white/5 hover:border-white/15"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-3.5 h-3.5 rounded-full"
                          style={{ backgroundColor: acc.primaryHex }}
                        />
                        <span className="text-xs font-bold text-white">{acc.name}</span>
                      </div>
                      {isSelected && <Check className={`w-3.5 h-3.5 ${acc.textAccent}`} />}
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight">{acc.description}</p>
                  </button>
                );
              })}
            </div>

            {/* Ambient Background Animation Mode */}
            <div className="pt-3 border-t border-white/5">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Ambient Background Animation
                </label>
                <span className="text-[11px] font-semibold text-emerald-400">GPU Accelerated</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
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
                          ? `${currentTheme.bgSubtle} ${currentTheme.borderSubtle} text-white font-bold`
                          : "bg-[#141414] border-white/5 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <span className="text-xs block font-bold text-white mb-0.5">{b.label}</span>
                      <span className="text-[10px] text-slate-500 font-normal leading-tight block">{b.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Density Selector */}
            <div className="pt-3 border-t border-white/5">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Card & Layout Density
              </label>
              <div className="grid grid-cols-3 gap-2.5">
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
                      className={`p-3 rounded-2xl border text-center transition ${
                        isSelected
                          ? `${currentTheme.bgSubtle} ${currentTheme.borderSubtle} text-white font-bold`
                          : "bg-[#141414] border-white/5 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <span className="text-xs block capitalize">{dKey}</span>
                      <span className="text-[10px] text-slate-500 font-normal">{cfg.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Multi-Profile & Account Hub Banner Card */}
          {onOpenProfileHub && (
            <div className="bg-[#0D0D0D] rounded-3xl p-6 border border-white/5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div className="flex items-center space-x-2.5">
                  <Users className={`w-5 h-5 ${currentTheme.textAccent}`} />
                  <div>
                    <h3 className="font-bold text-white text-base">Multi-Space Accounts & Profiles</h3>
                    <p className="text-xs text-slate-400">Manage multiple distinct workspaces like Netflix</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onOpenProfileHub}
                  className="px-4 py-2 bg-white text-black font-bold text-xs rounded-xl shadow-md hover:bg-slate-200 transition cursor-pointer active:scale-95"
                >
                  Manage Profiles
                </button>
              </div>

              <div className="p-4 bg-[#141414] rounded-2xl border border-white/5 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-xs"
                    style={{ backgroundColor: `${formData.avatarColor || "#10b981"}25` }}
                  >
                    <span>{formData.avatarIcon || "🚀"}</span>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{formData.name}</div>
                    <div className="text-xs text-slate-400">{formData.role || "Active Account"}</div>
                  </div>
                </div>

                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  Current Active Space
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Daily Anchors & Display Toggles */}
        <div className="space-y-6">
          {/* Daily Rhythm Anchors */}
          <div className="bg-[#0D0D0D] rounded-3xl p-6 border border-white/5 space-y-4">
            <div className="flex items-center space-x-2.5 pb-3 border-b border-white/5">
              <Clock className={`w-5 h-5 ${currentTheme.textAccent}`} />
              <h3 className="font-bold text-white text-base">Routine Anchors</h3>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-400">Daily Deep Work Target</label>
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
                  setFormData({ ...formData, targetFocusHoursPerDay: parseInt(e.target.value, 10) })
                }
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center space-x-1">
                  <Sun className="w-3 h-3 text-amber-400" />
                  <span>Wake Time</span>
                </label>
                <input
                  type="time"
                  value={formData.wakeTime}
                  onChange={(e) => setFormData({ ...formData, wakeTime: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-[#141414] border border-white/10 rounded-xl text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center space-x-1">
                  <Moon className="w-3 h-3 text-indigo-400" />
                  <span>Sleep Time</span>
                </label>
                <input
                  type="time"
                  value={formData.sleepTime}
                  onChange={(e) => setFormData({ ...formData, sleepTime: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-[#141414] border border-white/10 rounded-xl text-xs text-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Interactive Toggles */}
          <div className="bg-[#0D0D0D] rounded-3xl p-6 border border-white/5 space-y-3.5">
            <div className="flex items-center space-x-2.5 pb-3 border-b border-white/5">
              <Layout className={`w-5 h-5 ${currentTheme.textAccent}`} />
              <h3 className="font-bold text-white text-base">Display & Audio</h3>
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
              className="p-3 bg-[#141414] rounded-2xl border border-white/5 flex items-center justify-between cursor-pointer hover:border-white/10"
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
              className="p-3 bg-[#141414] rounded-2xl border border-white/5 flex items-center justify-between cursor-pointer hover:border-white/10"
            >
              <div className="flex items-center space-x-2.5">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-semibold text-white">Milestone Checklists</span>
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
              className="p-3 bg-[#141414] rounded-2xl border border-white/5 flex items-center justify-between cursor-pointer hover:border-white/10"
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
          <div className="bg-[#0D0D0D] rounded-3xl p-5 border border-white/5 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-white">Reset Sample Data</h4>
              <p className="text-[10px] text-slate-500">Restore factory sample endeavors</p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (confirm("Reset all settings and load sample endeavors?")) {
                  onResetDefaults();
                }
              }}
              className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-xs font-semibold transition"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function SaveIcon(props: any) {
  return <CheckCircle2 {...props} />;
}
