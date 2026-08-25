import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Smartphone,
  Tablet,
  Laptop,
  Monitor,
  X,
  Zap,
  Sparkles,
  CheckCircle2,
  Sliders,
  Vibrate,
  Touchpad,
  Share2,
  Maximize2,
  RefreshCw,
  Cpu,
  Compass,
  Info,
} from "lucide-react";
import { DeviceInfo, DeviceViewOverride } from "../types";
import { triggerHaptic, HapticType } from "../lib/device";
import { focusAudio } from "../lib/audio";
import confetti from "canvas-confetti";

interface DeviceInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  device: DeviceInfo;
  onSetViewOverride: (override: DeviceViewOverride) => void;
}

export const DeviceInspectorModal: React.FC<DeviceInspectorModalProps> = ({
  isOpen,
  onClose,
  device,
  onSetViewOverride,
}) => {
  const [activeTestHaptic, setActiveTestHaptic] = useState<HapticType | null>(null);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof navigator !== "undefined" && "getBattery" in navigator) {
      (navigator as any).getBattery?.().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
        setIsCharging(battery.charging);

        battery.addEventListener("levelchange", () => {
          setBatteryLevel(Math.round(battery.level * 100));
        });
        battery.addEventListener("chargingchange", () => {
          setIsCharging(battery.charging);
        });
      }).catch(() => {});
    }
  }, []);

  if (!isOpen) return null;

  const handleTestHaptic = (type: HapticType) => {
    setActiveTestHaptic(type);
    triggerHaptic(type);
    focusAudio.playCheckInPop();
    setTimeout(() => setActiveTestHaptic(null), 400);
  };

  const handleOverrideSelect = (override: DeviceViewOverride) => {
    onSetViewOverride(override);
    triggerHaptic("medium");
    focusAudio.playSuccess();
    if (override === "ultrawide") {
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
    }
  };

  const overrideModes: {
    id: DeviceViewOverride;
    label: string;
    icon: React.FC<{ className?: string }>;
    desc: string;
    badge: string;
  }[] = [
    {
      id: "auto",
      label: "Automatic Hardware Detect",
      icon: Cpu,
      desc: "Dynamically adapts to your physical device dimensions & pointer",
      badge: "RECOMMENDED",
    },
    {
      id: "mobile",
      label: "Mobile Smartphone View",
      icon: Smartphone,
      desc: "Bottom navigation bar, 48px touch targets, compact drawer sheets",
      badge: "< 640px UI",
    },
    {
      id: "tablet",
      label: "Tablet / iPad Ergonomics",
      icon: Tablet,
      desc: "Compact split-rail navigation, 2-column bento grids, stylus spacing",
      badge: "640px-1024px",
    },
    {
      id: "desktop",
      label: "Desktop Workstation Cockpit",
      icon: Laptop,
      desc: "Expandable sidebar, keyboard hotkeys (⌘K), hover telemetry",
      badge: "1024px-1800px",
    },
    {
      id: "ultrawide",
      label: "Ultrawide Command Center",
      icon: Monitor,
      desc: "Pinned right-hand live telemetry HUD & 4-column analytics bento",
      badge: "> 1800px UI",
    },
  ];

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl overflow-y-auto font-mono">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-2xl bg-[#06070B] border border-white/15 rounded-[32px] p-6 sm:p-8 shadow-[0_0_60px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.15)] overflow-hidden space-y-6"
      >
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 -left-20 w-80 h-80 rounded-full blur-3xl opacity-20 bg-cyan-500/30 pointer-events-none" />
        <div className="absolute top-1/2 -right-20 w-60 h-60 rounded-full blur-3xl opacity-15 bg-amber-500/30 pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
                <span>Device Intelligence & Adaptive Engine</span>
                <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
              </h2>
              <p className="text-xs text-slate-400 font-normal">
                Auto-sensing hardware, pointer modality, screen specs & tailored layout
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Detected Hardware Specs Grid */}
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-300 font-bold uppercase tracking-wider">
            <span className="flex items-center space-x-1.5">
              <span>{device.deviceEmoji}</span>
              <span>Detected Hardware Matrix: {device.deviceLabel}</span>
            </span>
            <span className="text-cyan-400 font-bold">
              {device.screenWidth} × {device.screenHeight} px ({device.dpr}x DPR)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-[10px] text-slate-400 uppercase">Form Factor</div>
              <div className="text-xs font-bold text-white uppercase mt-0.5">
                {device.formFactor}
              </div>
              <div className="text-[9px] text-cyan-300 mt-1">
                {device.isMobile ? "Phone Ergonomics" : device.isTablet ? "Tablet Split-Rail" : device.isUltrawide ? "Ultrawide Bento" : "Desktop Cockpit"}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-[10px] text-slate-400 uppercase">Operating System</div>
              <div className="text-xs font-bold text-white mt-0.5 truncate">
                {device.osName}
              </div>
              <div className="text-[9px] text-slate-400 mt-1 truncate">
                {device.browserName}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-[10px] text-slate-400 uppercase">Input & Pointer</div>
              <div className="text-xs font-bold text-white uppercase mt-0.5">
                {device.pointer} ({device.isTouch ? "Touch" : "Mouse"})
              </div>
              <div className="text-[9px] text-slate-400 mt-1">
                {device.isHoverSupported ? "Hover Enabled" : "Touch Tap"}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-[10px] text-slate-400 uppercase">Orientation & PWA</div>
              <div className="text-xs font-bold text-white uppercase mt-0.5">
                {device.orientation}
              </div>
              <div className="text-[9px] text-emerald-400 mt-1">
                {device.isStandalone ? "Installed PWA" : "Browser Frame"}
              </div>
            </div>
          </div>
        </div>

        {/* Live Device Layout Simulator / Overrides */}
        <div className="relative z-10 space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs text-slate-300 font-bold uppercase tracking-wider">
            <span className="flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>Tailored UI Profile & Simulator Mode:</span>
            </span>
            <span className="text-amber-300 text-[10px] px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-400/40">
              ACTIVE: {device.effectiveFormFactor.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {overrideModes.map((mode) => {
              const Icon = mode.icon;
              const isSelected = device.viewOverride === mode.id;

              return (
                <button
                  key={mode.id}
                  onClick={() => handleOverrideSelect(mode.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-1.5 ${
                    isSelected
                      ? "bg-cyan-500/20 border-cyan-400/80 shadow-[0_0_20px_rgba(34,211,238,0.25)] text-white"
                      : "bg-white/5 border-white/10 text-slate-300 hover:border-white/20 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-2">
                      <div className={`p-1.5 rounded-xl ${isSelected ? "bg-cyan-400 text-black font-bold" : "bg-white/10 text-slate-300"}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold">{mode.label}</span>
                    </div>
                    {isSelected ? (
                      <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    ) : (
                      <span className="text-[9px] font-bold text-slate-400 px-1.5 py-0.5 rounded bg-black/40">
                        {mode.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                    {mode.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Haptic Vibration Engine & Battery Diagnostics */}
        <div className="relative z-10 pt-2 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <Vibrate className="w-4 h-4 text-purple-400" />
            <span>Haptics: {device.supportsHaptics ? "Hardware Motor Ready" : "Web Audio Emulated"}</span>
            {batteryLevel !== null && (
              <span className="text-emerald-400 ml-2">
                🔋 {batteryLevel}% {isCharging ? "(Charging)" : ""}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="text-[10px] text-slate-400 uppercase mr-1">Test Haptic:</span>
            {(["light", "medium", "success", "combo"] as HapticType[]).map((type) => (
              <button
                key={type}
                onClick={() => handleTestHaptic(type)}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                  activeTestHaptic === type
                    ? "bg-purple-500 text-white scale-110"
                    : "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
