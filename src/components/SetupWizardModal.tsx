import React, { useState } from "react";
import {
  X,
  Sparkles,
  Check,
  Compass,
  Zap,
  Target,
  Palette,
  Sliders,
  Clock,
  Volume2,
  CheckCircle2,
  Flame,
  Layers,
  ArrowRight,
  ArrowLeft,
  Wand2,
  User,
  ShieldCheck,
  Sun,
  Moon,
  VolumeX,
} from "lucide-react";
import confetti from "canvas-confetti";
import { UserProfile, Category, ThemeAccent, WorkspaceDensity, Endeavor } from "../types";
import { THEME_ACCENTS, DENSITY_CONFIG, ROLE_PRESETS } from "../lib/theme";

interface SetupWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProfile: UserProfile;
  onSaveProfile: (updatedProfile: UserProfile, generatedEndeavors?: Endeavor[]) => void;
  isFirstTime?: boolean;
}

export const SetupWizardModal: React.FC<SetupWizardModalProps> = ({
  isOpen,
  onClose,
  initialProfile,
  onSaveProfile,
  isFirstTime = false,
}) => {
  const [step, setStep] = useState<number>(1);
  const [profile, setProfile] = useState<UserProfile>({ ...initialProfile });
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);
  const [aiGeneratedEndeavors, setAiGeneratedEndeavors] = useState<Endeavor[] | null>(null);
  const [aiWelcomeNote, setAiWelcomeNote] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentTheme = THEME_ACCENTS[profile.themeConfig.accent] || THEME_ACCENTS.emerald;

  // Toggle category in life spheres
  const handleToggleSphere = (sphere: Category) => {
    const exists = profile.selectedLifeSpheres.includes(sphere);
    const updated = exists
      ? profile.selectedLifeSpheres.filter((s) => s !== sphere)
      : [...profile.selectedLifeSpheres, sphere];
    setProfile({ ...profile, selectedLifeSpheres: updated });
  };

  // Select Role preset
  const handleSelectRolePreset = (preset: (typeof ROLE_PRESETS)[0]) => {
    setProfile({
      ...profile,
      role: preset.role,
      northStarMotto: preset.motto,
      targetFocusHoursPerDay: preset.focusHours,
      selectedLifeSpheres: preset.spheres as Category[],
      themeConfig: {
        ...profile.themeConfig,
        customAppTitle: `${profile.name.split(" ")[0] || "My"}'s ${preset.role.split(" ")[0]} OS`,
      },
    });
  };

  // Generate personalized starter endeavors with AI
  const handleGenerateAiBlueprint = async () => {
    setIsGeneratingAI(true);
    try {
      const res = await fetch("/api/ai/onboarding-setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          role: profile.role,
          northStarMotto: profile.northStarMotto,
          selectedLifeSpheres: profile.selectedLifeSpheres,
          targetFocusHoursPerDay: profile.targetFocusHoursPerDay,
        }),
      });

      const data = await res.json();

      if (data.tailoredEndeavors && Array.isArray(data.tailoredEndeavors) && data.tailoredEndeavors.length > 0) {
        const mappedEndeavors: Endeavor[] = data.tailoredEndeavors.map((item: any, idx: number) => ({
          status: "active",
          priority: item.priority || "high",
          color: item.color || "#10b981",
          icon: item.icon || "Zap",
          category: (item.category || "career") as Category,
          ...item,
          id: `end-onboarding-${Date.now()}-${idx}`,
          streakCount: 0,
          bestStreak: 0,
          history: {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));
        setAiGeneratedEndeavors(mappedEndeavors);
      }

      if (data.welcomeMessage) {
        setAiWelcomeNote(data.welcomeMessage);
      }
      if (data.suggestedMotto && (!profile.northStarMotto || profile.northStarMotto.length < 5)) {
        setProfile((prev) => ({ ...prev, northStarMotto: data.suggestedMotto }));
      }
    } catch (e) {
      console.warn("Client fallback blueprint generated due to notice:", e);
      // Deterministic local blueprint generator
      const hours = profile.targetFocusHoursPerDay || 4;
      const roleTitle = profile.role || "High Performer";
      const primaryCategory: Category = profile.selectedLifeSpheres.includes("career")
        ? "career"
        : profile.selectedLifeSpheres[0] || "career";
      const secondCategory: Category = profile.selectedLifeSpheres.find((s) => s !== "health") || "career";

      const fallbackGoals: Endeavor[] = [
        {
          id: `end-onboarding-${Date.now()}-0`,
          title: `Daily Deep Work (${hours}h)`,
          description: `Dedicate uninterrupted focus blocks towards ${roleTitle} priorities.`,
          archetype: "habit",
          category: primaryCategory,
          targetValue: 30,
          startValue: 0,
          currentValue: 0,
          unit: "days",
          frequency: "daily",
          status: "active",
          priority: "high",
          color: "#10b981",
          icon: "Zap",
          streakCount: 0,
          bestStreak: 0,
          history: {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          milestones: [
            { id: "m1", title: "7-Day Consistent Streak", completed: false },
            { id: "m2", title: "21-Day Habit Mastery", completed: false },
          ],
        },
        {
          id: `end-onboarding-${Date.now()}-1`,
          title: `${roleTitle.split(" ")[0]} Strategic Project`,
          description: `Deliver core milestones for: ${profile.northStarMotto || "Long-term compounding gains"}.`,
          archetype: "milestone",
          category: secondCategory,
          targetValue: 100,
          startValue: 0,
          currentValue: 0,
          unit: "%",
          frequency: "custom",
          status: "active",
          priority: "high",
          color: "#6366f1",
          icon: "Target",
          streakCount: 0,
          bestStreak: 0,
          history: {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          milestones: [
            { id: "m1", title: "Phase 1: Architecture & Requirements", completed: false, weight: 25 },
            { id: "m2", title: "Phase 2: Core Execution Sprint", completed: false, weight: 50 },
            { id: "m3", title: "Phase 3: Validation, Polish & Review", completed: false, weight: 25 },
          ],
        },
        {
          id: `end-onboarding-${Date.now()}-2`,
          title: "Physical Conditioning & Vitality",
          description: "Maintain energy, cardio health, and optimal circadian rhythm.",
          archetype: "habit",
          category: "health",
          targetValue: 20,
          startValue: 0,
          currentValue: 0,
          unit: "sessions",
          frequency: "weekly",
          status: "active",
          priority: "medium",
          color: "#ef4444",
          icon: "Activity",
          streakCount: 0,
          bestStreak: 0,
          history: {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          milestones: [
            { id: "m1", title: "Complete 10 conditioning sessions", completed: false },
            { id: "m2", title: "Anchor consistent wake/sleep cycle", completed: false },
          ],
        },
      ];
      setAiGeneratedEndeavors(fallbackGoals);
      setAiWelcomeNote(`Welcome ${profile.name || "Commander"}. Your ${roleTitle} blueprint has been tailored.`);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Final Complete
  const handleComplete = () => {
    const finalProfile: UserProfile = {
      ...profile,
      isSetupCompleted: true,
    };
    onSaveProfile(finalProfile, aiGeneratedEndeavors || undefined);
    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.6 },
    });
    onClose();
  };

  const lifeSphereOptions: { id: Category; label: string; icon: string; color: string }[] = [
    { id: "career", label: "Career & Tech", icon: "Cpu", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
    { id: "health", label: "Health & Vitality", icon: "Activity", color: "text-rose-400 bg-rose-500/10 border-rose-500/20" },
    { id: "learning", label: "Intellect & Learning", icon: "BookOpen", color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" },
    { id: "finance", label: "Finance & Wealth", icon: "DollarSign", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
    { id: "mindfulness", label: "Zen & Mindfulness", icon: "Sparkles", color: "text-teal-400 bg-teal-500/10 border-teal-500/20" },
    { id: "creative", label: "Creative & Arts", icon: "Palette", color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
    { id: "personal", label: "Personal & Relationships", icon: "Heart", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
  ];

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="bg-[#0D0D0D] rounded-3xl max-w-3xl w-full border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header with Progress Steps */}
        <div className="px-6 py-5 border-b border-white/5 bg-[#141414]/70 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-9 h-9 rounded-xl ${currentTheme.buttonBg} ${currentTheme.buttonText} flex items-center justify-center shadow-xs`}>
              <Wand2 className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-white text-base">Personal Experience Setup</h3>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${currentTheme.badgeBg}`}>
                  Step {step} of 4
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {step === 1 && "Tailor identity, vision, and core role archetypes"}
                {step === 2 && "Configure life spheres & generate AI starter goals"}
                {step === 3 && "Customize aesthetic accent, density & sensory feedback"}
                {step === 4 && "Anchor daily routine, focus hours & finish setup"}
              </p>
            </div>
          </div>

          {!isFirstTime && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Step Indicator Bar */}
        <div className="w-full bg-white/5 h-1">
          <div
            className={`h-full ${currentTheme.buttonBg} transition-all duration-300`}
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1: IDENTITY & ROLE */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center space-x-3">
                <Compass className={`w-6 h-6 ${currentTheme.textAccent} shrink-0`} />
                <p className="text-xs text-slate-300 leading-relaxed">
                  LifeOrbit adapts its co-pilot intelligence, reminders, and metrics directly to who you are and where you are headed.
                </p>
              </div>

              {/* Name & Workspace Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Your Name / Handle
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      placeholder="e.g. Alex Rivera"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#141414] border border-white/10 rounded-xl text-sm font-medium text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Workspace Title / OS Name
                  </label>
                  <input
                    type="text"
                    value={profile.themeConfig.customAppTitle}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        themeConfig: { ...profile.themeConfig, customAppTitle: e.target.value },
                      })
                    }
                    placeholder="e.g. Hyperion Command OS"
                    className="w-full px-4 py-2.5 bg-[#141414] border border-white/10 rounded-xl text-sm font-medium text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
              </div>

              {/* Role Archetype Preset Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Select Primary Focus Archetype
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {ROLE_PRESETS.map((preset) => {
                    const isSelected = profile.role === preset.role;
                    return (
                      <button
                        key={preset.role}
                        type="button"
                        onClick={() => handleSelectRolePreset(preset)}
                        className={`text-left p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                          isSelected
                            ? `${currentTheme.bgSubtle} ${currentTheme.borderSubtle} ring-1 ring-${currentTheme.primary}`
                            : "bg-[#141414] border-white/5 hover:border-white/15"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-bold text-white">{preset.role}</span>
                          {isSelected && <Check className={`w-3.5 h-3.5 ${currentTheme.textAccent}`} />}
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{preset.motto}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Role & North Star Motto */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Custom Role / Title
                  </label>
                  <input
                    type="text"
                    value={profile.role}
                    onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                    placeholder="e.g. Full-Stack Architect & Marathon Runner"
                    className="w-full px-4 py-2.5 bg-[#141414] border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    North Star Motto / Mission Statement
                  </label>
                  <textarea
                    rows={2}
                    value={profile.northStarMotto}
                    onChange={(e) => setProfile({ ...profile, northStarMotto: e.target.value })}
                    placeholder="e.g. Compound daily momentum with uncompromising consistency."
                    className="w-full px-4 py-2 bg-[#141414] border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: LIFE SPHERES & AI BLUEPRINT */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Active Life Spheres
                </label>
                <p className="text-xs text-slate-400 mb-3">
                  Select the domains you want prioritized in your dashboard and AI coaching.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {lifeSphereOptions.map((opt) => {
                    const isSelected = profile.selectedLifeSpheres.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleToggleSphere(opt.id)}
                        className={`p-3 rounded-2xl border transition text-left flex items-center justify-between ${
                          isSelected
                            ? `${opt.color} ring-1 ring-white/10`
                            : "bg-[#141414] border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/10"
                        }`}
                      >
                        <span className="text-xs font-bold">{opt.label}</span>
                        {isSelected ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-4 h-4 rounded-full border border-white/20" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* AI Starter Blueprint Generator */}
              <div className="bg-[#141414] rounded-2xl p-5 border border-white/10 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Sparkles className={`w-4 h-4 ${currentTheme.textAccent}`} />
                      <h4 className="text-sm font-bold text-white">AI Personal Blueprint Generator</h4>
                    </div>
                    <p className="text-xs text-slate-400 max-w-lg">
                      Generate a bespoke suite of starter endeavors (habits, meters, and project milestones) tuned for{" "}
                      <strong className="text-white">{profile.role || "your role"}</strong>.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleGenerateAiBlueprint}
                    disabled={isGeneratingAI}
                    className={`px-4 py-2 ${currentTheme.buttonBg} ${currentTheme.buttonHover} ${currentTheme.buttonText} rounded-xl text-xs font-bold shadow-xs transition flex items-center space-x-2 shrink-0 disabled:opacity-50`}
                  >
                    <Wand2 className={`w-3.5 h-3.5 ${isGeneratingAI ? "animate-spin" : ""}`} />
                    <span>{isGeneratingAI ? "Architecting..." : "Generate Goals"}</span>
                  </button>
                </div>

                {aiWelcomeNote && (
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-xs text-slate-300">
                    <p className="font-semibold text-emerald-400 mb-0.5">Architect Note:</p>
                    <p>{aiWelcomeNote}</p>
                  </div>
                )}

                {aiGeneratedEndeavors && aiGeneratedEndeavors.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Generated Starter Goals ({aiGeneratedEndeavors.length}):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {aiGeneratedEndeavors.map((gen, idx) => (
                        <div
                          key={idx}
                          className="bg-black/40 p-2.5 rounded-xl border border-white/5 flex items-start space-x-2.5"
                        >
                          <div
                            className="w-2.5 h-2.5 rounded-full mt-1 shrink-0"
                            style={{ backgroundColor: gen.color || "#10b981" }}
                          />
                          <div>
                            <p className="text-xs font-bold text-white">{gen.title}</p>
                            <p className="text-[10px] text-slate-400 line-clamp-1">{gen.description}</p>
                            <span className="text-[9px] uppercase font-semibold text-slate-500 mt-1 inline-block">
                              {gen.archetype} • {gen.targetValue} {gen.unit}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: INTERFACE CUSTOMIZATION & AESTHETICS */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Theme Accent Color Swatches */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Theme Accent Palette
                </label>
                <p className="text-xs text-slate-400 mb-3">
                  Customize the visual energy across badges, meters, buttons, and progress highlights.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.values(THEME_ACCENTS).map((acc) => {
                    const isSelected = profile.themeConfig.accent === acc.id;
                    return (
                      <button
                        key={acc.id}
                        type="button"
                        onClick={() =>
                          setProfile({
                            ...profile,
                            themeConfig: { ...profile.themeConfig, accent: acc.id },
                          })
                        }
                        className={`p-3.5 rounded-2xl border transition text-left flex flex-col justify-between ${
                          isSelected
                            ? `${acc.bgSubtle} ${acc.borderSubtle} ring-2 ring-${acc.primary}`
                            : "bg-[#141414] border-white/5 hover:border-white/15"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div
                              className="w-4 h-4 rounded-full shadow-xs"
                              style={{ backgroundColor: acc.primaryHex }}
                            />
                            <span className="text-xs font-bold text-white">{acc.name}</span>
                          </div>
                          {isSelected && <Check className={`w-3.5 h-3.5 ${acc.textAccent}`} />}
                        </div>
                        <p className="text-[10px] text-slate-400 leading-snug">{acc.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Workspace Layout Density */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Workspace Information Density
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {(Object.keys(DENSITY_CONFIG) as WorkspaceDensity[]).map((dKey) => {
                    const cfg = DENSITY_CONFIG[dKey];
                    const isSelected = profile.themeConfig.density === dKey;
                    return (
                      <button
                        key={dKey}
                        type="button"
                        onClick={() =>
                          setProfile({
                            ...profile,
                            themeConfig: { ...profile.themeConfig, density: dKey },
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

              {/* Toggles & Sensory Feedback */}
              <div className="space-y-3 pt-2 border-t border-white/5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Interface Display Preferences
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Streak Badges Toggle */}
                  <div
                    onClick={() =>
                      setProfile({
                        ...profile,
                        themeConfig: {
                          ...profile.themeConfig,
                          showStreakBadges: !profile.themeConfig.showStreakBadges,
                        },
                      })
                    }
                    className="p-3 bg-[#141414] rounded-2xl border border-white/5 flex items-center justify-between cursor-pointer hover:border-white/10"
                  >
                    <div className="flex items-center space-x-2.5">
                      <Flame className="w-4 h-4 text-amber-400" />
                      <div>
                        <span className="text-xs font-semibold text-white block">Streak Flame Badges</span>
                        <span className="text-[10px] text-slate-400">Show consecutive check-in badges</span>
                      </div>
                    </div>
                    <div
                      className={`w-9 h-5 rounded-full transition-colors relative flex items-center p-0.5 ${
                        profile.themeConfig.showStreakBadges ? currentTheme.buttonBg : "bg-white/10"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          profile.themeConfig.showStreakBadges ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Milestones on Cards Toggle */}
                  <div
                    onClick={() =>
                      setProfile({
                        ...profile,
                        themeConfig: {
                          ...profile.themeConfig,
                          showMilestonesOnCards: !profile.themeConfig.showMilestonesOnCards,
                        },
                      })
                    }
                    className="p-3 bg-[#141414] rounded-2xl border border-white/5 flex items-center justify-between cursor-pointer hover:border-white/10"
                  >
                    <div className="flex items-center space-x-2.5">
                      <Layers className="w-4 h-4 text-indigo-400" />
                      <div>
                        <span className="text-xs font-semibold text-white block">Project Checklists</span>
                        <span className="text-[10px] text-slate-400">Display milestone phases on cards</span>
                      </div>
                    </div>
                    <div
                      className={`w-9 h-5 rounded-full transition-colors relative flex items-center p-0.5 ${
                        profile.themeConfig.showMilestonesOnCards ? currentTheme.buttonBg : "bg-white/10"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          profile.themeConfig.showMilestonesOnCards ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Audio Synthesizer Toggle */}
                  <div
                    onClick={() =>
                      setProfile({
                        ...profile,
                        themeConfig: {
                          ...profile.themeConfig,
                          soundEffectsEnabled: !profile.themeConfig.soundEffectsEnabled,
                        },
                      })
                    }
                    className="p-3 bg-[#141414] rounded-2xl border border-white/5 flex items-center justify-between cursor-pointer hover:border-white/10"
                  >
                    <div className="flex items-center space-x-2.5">
                      <Volume2 className="w-4 h-4 text-teal-400" />
                      <div>
                        <span className="text-xs font-semibold text-white block">Acoustic Audio Cues</span>
                        <span className="text-[10px] text-slate-400">Audio tones for XP & timers</span>
                      </div>
                    </div>
                    <div
                      className={`w-9 h-5 rounded-full transition-colors relative flex items-center p-0.5 ${
                        profile.themeConfig.soundEffectsEnabled ? currentTheme.buttonBg : "bg-white/10"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          profile.themeConfig.soundEffectsEnabled ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Ambient Preset */}
                  <div className="p-3 bg-[#141414] rounded-2xl border border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-white block">Ambient Flow Noise</span>
                      <span className="text-[10px] text-slate-400">Synthesizer preset for focus mode</span>
                    </div>
                    <select
                      value={profile.themeConfig.ambientSoundPreset}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          themeConfig: {
                            ...profile.themeConfig,
                            ambientSoundPreset: e.target.value as any,
                          },
                        })
                      }
                      className="px-2.5 py-1 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none"
                    >
                      <option value="binaural">10Hz Alpha Binaural</option>
                      <option value="pink">Pink Noise</option>
                      <option value="brown">Brown Noise</option>
                      <option value="none">Off by Default</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: ROUTINE ANCHORS & REVIEW */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center space-x-3">
                <Clock className={`w-6 h-6 ${currentTheme.textAccent} shrink-0`} />
                <p className="text-xs text-slate-300 leading-relaxed">
                  Your daily targets and AI schedule optimizer will block your highest-energy hours around your wake and sleep schedule.
                </p>
              </div>

              {/* Target Focus Hours */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Target Daily Deep Work Focus
                  </label>
                  <span className={`text-sm font-bold ${currentTheme.textAccent}`}>
                    {profile.targetFocusHoursPerDay} Hours / Day
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={profile.targetFocusHoursPerDay}
                  onChange={(e) =>
                    setProfile({ ...profile, targetFocusHoursPerDay: parseInt(e.target.value, 10) })
                  }
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>1h (Casual)</span>
                  <span>4h (Balanced High Flow)</span>
                  <span>8h+ (Monk Mode)</span>
                </div>
              </div>

              {/* Wake & Sleep Rhythm */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>Wake-Up Anchor</span>
                  </label>
                  <input
                    type="time"
                    value={profile.wakeTime}
                    onChange={(e) => setProfile({ ...profile, wakeTime: e.target.value })}
                    className="w-full px-3 py-2 bg-[#141414] border border-white/10 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
                    <Moon className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Sleep / Wind Down</span>
                  </label>
                  <input
                    type="time"
                    value={profile.sleepTime}
                    onChange={(e) => setProfile({ ...profile, sleepTime: e.target.value })}
                    className="w-full px-3 py-2 bg-[#141414] border border-white/10 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
              </div>

              {/* Summary Review Card */}
              <div className="p-4 bg-[#141414] rounded-2xl border border-white/10 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Ready to Launch Customized Command Center:
                </span>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Workspace:</span>
                  <span className="text-white font-bold">{profile.themeConfig.customAppTitle}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Identity / Role:</span>
                  <span className="text-white font-semibold">{profile.role}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Accent Atmosphere:</span>
                  <span className={`font-semibold capitalize ${currentTheme.textAccent}`}>
                    {currentTheme.name}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Active Life Spheres:</span>
                  <span className="text-slate-300 capitalize">
                    {profile.selectedLifeSpheres.join(", ") || "General"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Navigation */}
        <div className="px-6 py-4 border-t border-white/5 bg-[#141414]/70 flex items-center justify-between">
          <div>
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold rounded-xl flex items-center space-x-1.5 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className={`px-5 py-2.5 ${currentTheme.buttonBg} ${currentTheme.buttonHover} ${currentTheme.buttonText} text-xs font-bold rounded-xl shadow-xs flex items-center space-x-2 transition`}
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleComplete}
                className={`px-6 py-2.5 ${currentTheme.buttonBg} ${currentTheme.buttonHover} ${currentTheme.buttonText} text-xs sm:text-sm font-bold rounded-xl shadow-lg flex items-center space-x-2 transition`}
              >
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                <span>Launch My Custom OS</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
