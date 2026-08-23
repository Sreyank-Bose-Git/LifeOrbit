import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Eye,
  EyeOff,
  Sun,
  Moon,
  Sparkles,
  Sliders,
  Check,
  X,
  Volume2,
  Play,
  RotateCcw,
  Zap,
  Activity,
  Heart,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { UIThemeConfig, EyeComfortPreset } from "../types";
import { EYE_COMFORT_PRESETS, EyeComfortPresetInfo } from "../lib/theme";
import { focusAudio } from "../lib/audio";

interface EyeComfortManagerProps {
  themeConfig: UIThemeConfig;
  onUpdateThemeConfig: (newConfig: Partial<UIThemeConfig>) => void;
}

export const EyeComfortManager: React.FC<EyeComfortManagerProps> = ({
  themeConfig,
  onUpdateThemeConfig,
}) => {
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);
  const [showEyeBreakModal, setShowEyeBreakModal] = useState(false);
  const [eyeBreakSecondsLeft, setEyeBreakSecondsLeft] = useState(20);
  const [isBreakActive, setIsBreakActive] = useState(false);
  const [continuousWorkMinutes, setContinuousWorkMinutes] = useState(0);
  const [isNightTimeAutoActive, setIsNightTimeAutoActive] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);

  // Close quick menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsQuickMenuOpen(false);
      }
    };
    if (isQuickMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isQuickMenuOpen]);

  // Check night time schedule (8:00 PM to 7:00 AM)
  useEffect(() => {
    const checkNight = () => {
      const currentHour = new Date().getHours();
      const isNight = currentHour >= 20 || currentHour < 7;
      setIsNightTimeAutoActive(isNight && !!themeConfig.autoNightComfort);
    };

    checkNight();
    const interval = setInterval(checkNight, 60000);
    return () => clearInterval(interval);
  }, [themeConfig.autoNightComfort]);

  // Determine active preset (if auto night is active and current is off, default to warm)
  const activePresetKey: EyeComfortPreset =
    themeConfig.eyeComfortPreset && themeConfig.eyeComfortPreset !== "off"
      ? themeConfig.eyeComfortPreset
      : isNightTimeAutoActive
      ? "warm"
      : "off";

  const warmth = themeConfig.eyeComfortWarmth ?? 45;
  const brightness = themeConfig.eyeComfortBrightness ?? 92;
  const activePreset = EYE_COMFORT_PRESETS[activePresetKey] || EYE_COMFORT_PRESETS.off;

  // Global 20-20-20 Rule Timer & Custom Event Trigger
  useEffect(() => {
    const handleCustomTrigger = () => {
      setShowEyeBreakModal(true);
      setIsBreakActive(true);
      setEyeBreakSecondsLeft(20);
      focusAudio.playZenChime();
    };

    window.addEventListener("lifeorbit-trigger-eye-break", handleCustomTrigger);
    return () => window.removeEventListener("lifeorbit-trigger-eye-break", handleCustomTrigger);
  }, []);

  useEffect(() => {
    if (!themeConfig.eyeBreakReminder202020) return;

    // Track active minutes
    const interval = setInterval(() => {
      setContinuousWorkMinutes((prev) => {
        const next = prev + 1;
        if (next >= 20) {
          setShowEyeBreakModal(true);
          focusAudio.playZenChime();
          return 0; // reset
        }
        return next;
      });
    }, 60000); // 1 minute per tick

    return () => clearInterval(interval);
  }, [themeConfig.eyeBreakReminder202020]);

  // 20-Second Eye Break Countdown loop
  useEffect(() => {
    if (!showEyeBreakModal || !isBreakActive) return;

    if (eyeBreakSecondsLeft <= 0) {
      setIsBreakActive(false);
      focusAudio.playSuccess();
      return;
    }

    const timer = setInterval(() => {
      setEyeBreakSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [showEyeBreakModal, isBreakActive, eyeBreakSecondsLeft]);

  // Start Eye Break
  const startEyeBreak = () => {
    setIsBreakActive(true);
    setEyeBreakSecondsLeft(20);
    focusAudio.playZenChime();
  };

  const dismissEyeBreak = () => {
    setShowEyeBreakModal(false);
    setIsBreakActive(false);
    setEyeBreakSecondsLeft(20);
    setContinuousWorkMinutes(0);
  };

  const snoozeEyeBreak = () => {
    setShowEyeBreakModal(false);
    setIsBreakActive(false);
    setEyeBreakSecondsLeft(20);
    // Snooze for 5 minutes
    setContinuousWorkMinutes(15);
  };

  // Keyboard shortcut: Alt + E to toggle eye comfort
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === "e" || e.key === "E")) {
        e.preventDefault();
        const nextPreset: EyeComfortPreset = activePresetKey === "off" ? "warm" : "off";
        onUpdateThemeConfig({ eyeComfortPreset: nextPreset });
        focusAudio.playClick();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePresetKey, onUpdateThemeConfig]);

  // Compute CSS filter style
  const filterStyle = activePreset.filterStyle(warmth, brightness);
  const tintColor = activePreset.tintOverlayColor;
  const tintOpacity = activePreset.tintOverlayOpacity ? activePreset.tintOverlayOpacity(warmth) : 0;

  return (
    <>
      {/* Dynamic Eye Comfort Screen Tint Layer (GPU accelerated) */}
      {tintColor && tintOpacity > 0 && (
        <div
          className="fixed inset-0 pointer-events-none z-[9999] transition-opacity duration-700"
          style={{
            backgroundColor: tintColor,
            opacity: tintOpacity,
            mixBlendMode: "multiply",
          }}
          aria-hidden="true"
        />
      )}

      {/* Global CSS Filter application through root style tag */}
      {filterStyle !== "none" && (
        <style>{`
          #root {
            filter: ${filterStyle} !important;
            transition: filter 0.4s ease-in-out;
          }
          ${
            themeConfig.softGlow
              ? `
            [class*="shadow-[0_0_"], [class*="text-glow-"] {
              box-shadow: 0 0 8px rgba(255, 255, 255, 0.08) !important;
              text-shadow: 0 0 6px rgba(255, 255, 255, 0.25) !important;
            }
          `
              : ""
          }
        `}</style>
      )}

      {/* 20-20-20 Optic Relaxation Modal / Toast */}
      <AnimatePresence>
        {showEyeBreakModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="fixed bottom-6 right-6 z-[10000] max-w-md w-[92vw] sm:w-[420px] bg-[#0A0C14]/95 backdrop-blur-2xl border border-amber-500/30 rounded-3xl p-5 shadow-[0_0_50px_rgba(245,158,11,0.25)] text-white font-mono space-y-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase text-amber-300 tracking-wider">
                    20-20-20 Optic Break
                  </h4>
                  <p className="text-[10px] text-slate-400 font-sans">
                    20 min focus reached • Relax optic muscles
                  </p>
                </div>
              </div>
              <button
                onClick={dismissEyeBreak}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Visual Guide / Breathing rhythm */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-center space-y-3 relative overflow-hidden">
              <div className="relative flex items-center justify-center my-2">
                {/* Breathing expanding orb */}
                <motion.div
                  animate={{
                    scale: isBreakActive ? [1, 1.45, 1] : 1,
                    opacity: isBreakActive ? [0.4, 0.9, 0.4] : 0.3,
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500/30 to-emerald-400/20 blur-md absolute"
                />

                <div className="w-16 h-16 rounded-full border border-amber-400/40 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center relative z-10 shadow-lg">
                  <span className="text-xl font-extrabold text-amber-300">
                    {isBreakActive ? eyeBreakSecondsLeft : "20s"}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-bold text-white font-sans">
                  {isBreakActive
                    ? "Look at an object 20+ feet away & blink softly"
                    : "Look 20 feet away for 20 seconds"}
                </p>
                <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                  Allows optic ciliary muscles to fully relax, preventing digital eye strain and dry eyes.
                </p>
              </div>

              {/* Progress bar */}
              {isBreakActive && (
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-amber-400 to-emerald-400"
                    style={{ width: `${((20 - eyeBreakSecondsLeft) / 20) * 100}%` }}
                    transition={{ duration: 1, ease: "linear" }}
                  />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 pt-1">
              {!isBreakActive ? (
                <button
                  onClick={startEyeBreak}
                  className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 px-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold rounded-xl text-xs shadow-[0_0_20px_rgba(245,158,11,0.3)] transition cursor-pointer active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start 20s Rest</span>
                </button>
              ) : (
                <button
                  onClick={dismissEyeBreak}
                  className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl text-xs shadow-md transition cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Completed Rest</span>
                </button>
              )}

              <button
                onClick={snoozeEyeBreak}
                className="py-2.5 px-3 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs border border-white/10 transition cursor-pointer active:scale-95"
                title="Remind in 5 minutes"
              >
                Snooze 5m
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// =========================================================================
// Eye Comfort Quick Trigger Pill & Popover (for Top Navigation / Status Bar)
// =========================================================================

interface EyeComfortQuickToggleProps {
  themeConfig: UIThemeConfig;
  onUpdateThemeConfig: (newConfig: Partial<UIThemeConfig>) => void;
  onTriggerEyeBreakDemo?: () => void;
}

export const EyeComfortQuickToggle: React.FC<EyeComfortQuickToggleProps> = ({
  themeConfig,
  onUpdateThemeConfig,
  onTriggerEyeBreakDemo,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  const activePresetKey: EyeComfortPreset = themeConfig.eyeComfortPreset || "off";
  const isEyeComfortActive = activePresetKey !== "off";
  const warmth = themeConfig.eyeComfortWarmth ?? 45;
  const brightness = themeConfig.eyeComfortBrightness ?? 92;
  const currentPresetInfo = EYE_COMFORT_PRESETS[activePresetKey] || EYE_COMFORT_PRESETS.off;

  // Toggle on/off quickly
  const handleQuickToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextPreset: EyeComfortPreset = isEyeComfortActive ? "off" : "warm";
    onUpdateThemeConfig({ eyeComfortPreset: nextPreset });
    focusAudio.playClick();
  };

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  return (
    <div className="relative" ref={popoverRef}>
      {/* Quick Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-mono transition cursor-pointer active:scale-95 ${
          isEyeComfortActive
            ? "bg-amber-500/15 border-amber-500/30 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.2)]"
            : "bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border-white/10"
        }`}
        title={`Eye Comfort: ${currentPresetInfo.label} (Alt+E)`}
      >
        <Eye className={`w-3.5 h-3.5 ${isEyeComfortActive ? "text-amber-400" : "text-slate-400"}`} />
        <span className="text-[11px] font-bold hidden md:inline">
          {isEyeComfortActive ? currentPresetInfo.label.split(" ")[0] : "Eye Comfort"}
        </span>
        {isEyeComfortActive && (
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        )}
      </button>

      {/* Popover Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 bg-[#06070B]/95 backdrop-blur-2xl border border-white/15 rounded-3xl p-5 shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-50 font-mono space-y-4 text-white"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Eye className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase text-white">Eye Comfort & Optics</h4>
                  <p className="text-[10px] text-slate-400 font-sans">Blue Light & Glare Shield</p>
                </div>
              </div>

              {/* Master On/Off switch */}
              <button
                onClick={handleQuickToggle}
                className={`w-11 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                  isEyeComfortActive ? "bg-amber-500" : "bg-white/15"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    isEyeComfortActive ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Presets Grid */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Spectra Presets
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.values(EYE_COMFORT_PRESETS) as EyeComfortPresetInfo[]).map((preset) => {
                  const isSelected = activePresetKey === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => {
                        onUpdateThemeConfig({ eyeComfortPreset: preset.id });
                        focusAudio.playClick();
                      }}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? "bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.15)]"
                          : "bg-white/[0.03] border-white/10 text-slate-400 hover:text-white hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">{preset.icon}</span>
                        {isSelected && <Check className="w-3 h-3 text-amber-400" />}
                      </div>
                      <div>
                        <span className="text-xs font-bold block text-white">{preset.label}</span>
                        <span className="text-[9px] text-slate-400 font-sans block truncate">
                          {preset.kelvin}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Warmth & Brightness Sliders */}
            {isEyeComfortActive && (
              <div className="space-y-3 pt-2 border-t border-white/10">
                {/* Warmth Slider */}
                <div>
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                    <span className="font-bold uppercase">Warmth Intensity</span>
                    <span className="text-amber-400 font-bold">{warmth}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={warmth}
                    onChange={(e) =>
                      onUpdateThemeConfig({ eyeComfortWarmth: parseInt(e.target.value) })
                    }
                    className="w-full accent-amber-400 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Brightness Dimmer */}
                <div>
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                    <span className="font-bold uppercase">Brightness Limiter</span>
                    <span className="text-amber-400 font-bold">{brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="70"
                    max="100"
                    value={brightness}
                    onChange={(e) =>
                      onUpdateThemeConfig({ eyeComfortBrightness: parseInt(e.target.value) })
                    }
                    className="w-full accent-amber-400 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Quick 20-20-20 Eye Break Test */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-sans">
                Shortcut: <kbd className="bg-black/60 px-1 py-0.5 rounded border border-white/10">Alt+E</kbd>
              </span>
              <button
                onClick={() => {
                  setIsOpen(false);
                  triggerEyeBreakModal();
                }}
                className="text-[10px] text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
              >
                Start 20s Break
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const triggerEyeBreakModal = () => {
  window.dispatchEvent(new CustomEvent("lifeorbit-trigger-eye-break"));
};
