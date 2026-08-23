import React, { useState, useEffect } from "react";
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  Award,
  Zap,
  Coffee,
  CloudRain,
  Radio,
  Orbit,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Endeavor } from "../types";
import { focusAudio } from "../lib/audio";
import confetti from "canvas-confetti";

interface FocusModeProps {
  endeavors: Endeavor[];
  focusTimer: {
    endeavor: Endeavor | null;
    isActive: boolean;
    isPaused: boolean;
    totalSeconds: number;
    secondsRemaining: number;
    mode: "pomodoro" | "deep" | "shortBreak";
    soundMode: "none" | "binaural" | "noise" | "rain";
    volume: number;
    sessionNotes: string;
  };
  setFocusTimer: React.Dispatch<React.SetStateAction<any>>;
  onFinishSession: (endeavorId: string, durationMinutes: number, notes: string) => void;
}

export const FocusMode: React.FC<FocusModeProps> = ({
  endeavors,
  focusTimer,
  setFocusTimer,
  onFinishSession,
}) => {
  const {
    endeavor: activeEndeavor,
    isActive,
    isPaused,
    totalSeconds,
    secondsRemaining: timeLeftSeconds,
    mode,
    soundMode,
    volume,
    sessionNotes,
  } = focusTimer;
  const selectedEndeavorId = activeEndeavor?.id || endeavors[0]?.id || "";
  const durationMinutes = Math.floor(totalSeconds / 60);

  const setSelectedEndeavorId = (id: string) => {
    const e = endeavors.find((x) => x.id === id) || null;
    setFocusTimer((prev: any) => ({ ...prev, endeavor: e }));
  };

  const setMode = (newMode: "pomodoro" | "deep" | "shortBreak") => {
    setFocusTimer((prev: any) => ({ ...prev, mode: newMode }));
  };

  const setDurationMinutes = (minutes: number) => {
    setFocusTimer((prev: any) => ({ ...prev, totalSeconds: minutes * 60 }));
  };

  const setTimeLeftSeconds = (seconds: number | ((prev: number) => number)) => {
    setFocusTimer((prev: any) => ({
      ...prev,
      secondsRemaining:
        typeof seconds === "function" ? seconds(prev.secondsRemaining) : seconds,
    }));
  };

  const setIsActive = (active: boolean) => {
    setFocusTimer((prev: any) => ({
      ...prev,
      isActive: active,
      isPaused: false,
    }));
  };

  const setSoundMode = (soundMode: "none" | "binaural" | "noise" | "rain") => {
    setFocusTimer((prev: any) => ({ ...prev, soundMode }));
  };

  const setVolume = (volume: number) => {
    setFocusTimer((prev: any) => ({ ...prev, volume }));
  };

  const setSessionNotes = (notes: string | ((prev: string) => string)) => {
    setFocusTimer((prev: any) => ({
      ...prev,
      sessionNotes: typeof notes === "function" ? notes(prev.sessionNotes) : notes,
    }));
  };

  // Set mode durations
  const handleSetMode = (newMode: "pomodoro" | "deep" | "shortBreak") => {
    setMode(newMode);
    setIsActive(false);
    focusAudio.stop();
    setSoundMode("none");

    const minutes = newMode === "pomodoro" ? 25 : newMode === "deep" ? 50 : 5;
    setDurationMinutes(minutes);
    setTimeLeftSeconds(minutes * 60);
  };

  // Timer Tick auto stop audio if complete
  useEffect(() => {
    if (timeLeftSeconds === 0 && soundMode !== "none") {
      focusAudio.stop();
      setSoundMode("none");
    }
  }, [timeLeftSeconds, soundMode]);

  // Handle Audio toggle
  const toggleSound = (type: "binaural" | "noise" | "rain") => {
    if (soundMode === type) {
      focusAudio.stop();
      setSoundMode("none");
    } else {
      if (type === "binaural") {
        focusAudio.playBinaural(210, 10, volume);
      } else if (type === "rain") {
        focusAudio.playRain(volume);
      } else {
        focusAudio.playNoise("pink", volume);
      }
      setSoundMode(type);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    focusAudio.setVolume(newVol);
  };

  const handleReset = () => {
    setIsActive(false);
    setTimeLeftSeconds(durationMinutes * 60);
    focusAudio.stop();
    setSoundMode("none");
  };

  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;
  const progressRatio =
    totalSeconds > 0 ? (totalSeconds - Math.max(0, timeLeftSeconds)) / totalSeconds : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner - Interstellar Cockpit */}
      <div className="relative bg-[#06070B]/90 backdrop-blur-3xl rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.12)] overflow-hidden">
        {/* Background Cosmic Glow */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:18px_18px] opacity-25 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left space-y-2">
            <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full text-emerald-400 text-xs font-mono font-bold">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>HYPERION FOCUS LAB // SEC-01</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white uppercase">
              Single-Task Orbit Immersion
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md font-normal leading-relaxed">
              Eliminate distractions and cultivate deep uninterrupted cognitive immersion with acoustic resonance.
            </p>
          </div>

          {/* Target Endeavor Selector */}
          <div className="w-full md:w-72 bg-white/[0.03] border border-white/10 p-3.5 rounded-2xl backdrop-blur-md">
            <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
              <Orbit className="w-3.5 h-3.5 text-emerald-400" />
              <span>TARGET TRAJECTORY:</span>
            </label>
            <select
              value={selectedEndeavorId}
              onChange={(e) => setSelectedEndeavorId(e.target.value)}
              className="w-full bg-[#06070B] border border-white/15 text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500/50 font-medium"
            >
              {endeavors.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Focus Control Console */}
      <div className="relative bg-[#06070B]/90 backdrop-blur-3xl rounded-[28px] sm:rounded-[32px] p-6 sm:p-10 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.12)] flex flex-col items-center overflow-hidden">
        {/* Stellar backlight */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.06)_0,transparent_70%)] pointer-events-none" />

        {/* Preset Mode Switcher */}
        <div className="relative z-10 flex items-center space-x-2 bg-white/[0.03] border border-white/10 p-1.5 rounded-2xl mb-8">
          <button
            onClick={() => handleSetMode("pomodoro")}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold cursor-pointer active:scale-95 transition-all ${
              mode === "pomodoro"
                ? "bg-emerald-400 text-black shadow-[0_0_15px_rgba(52,211,153,0.5)] font-bold"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            25m Sprint
          </button>
          <button
            onClick={() => handleSetMode("deep")}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold cursor-pointer active:scale-95 transition-all ${
              mode === "deep"
                ? "bg-emerald-400 text-black shadow-[0_0_15px_rgba(52,211,153,0.5)] font-bold"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            50m Deep Block
          </button>
          <button
            onClick={() => handleSetMode("shortBreak")}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold cursor-pointer active:scale-95 transition-all ${
              mode === "shortBreak"
                ? "bg-emerald-400 text-black shadow-[0_0_15px_rgba(52,211,153,0.5)] font-bold"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            5m Recovery
          </button>
        </div>

        {/* Circular Orbital Progress Display */}
        <div className="relative z-10 w-64 h-64 sm:w-76 sm:h-76 flex items-center justify-center mb-8">
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 drop-shadow-2xl">
            {/* Background ring */}
            <circle
              cx="50"
              cy="50"
              r="44"
              className="text-white/5 stroke-current"
              strokeWidth="6"
              fill="transparent"
            />
            {/* Active glowing ring */}
            <circle
              cx="50"
              cy="50"
              r="44"
              className="text-emerald-400 stroke-current transition-all duration-500 ease-linear drop-shadow-[0_0_15px_rgba(52,211,153,0.7)]"
              strokeWidth="6"
              strokeDasharray="276.46"
              strokeDashoffset={276.46 * (1 - progressRatio)}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Time digits in center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-5xl sm:text-6xl font-bold font-mono text-white tracking-tighter drop-shadow-lg">
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </span>
            <span className="text-[10px] font-mono font-bold text-slate-400 mt-2 uppercase tracking-widest flex items-center space-x-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  isActive && !isPaused ? "bg-emerald-400 animate-ping" : "bg-slate-600"
                }`}
              />
              <span>{isActive && !isPaused ? "ORBITAL FLOW ACTIVE" : "READY FOR LAUNCH"}</span>
            </span>
          </div>
        </div>

        {/* Play / Pause / Reset Buttons */}
        <div className="relative z-10 flex items-center space-x-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleReset}
            className="p-3 text-slate-400 hover:text-white hover:bg-white/10 rounded-2xl cursor-pointer transition border border-white/5"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setFocusTimer((prev: any) => ({
                ...prev,
                isPaused: !prev.isPaused,
                isActive: true,
              }));
            }}
            className={`w-16 h-16 rounded-2xl flex items-center justify-center text-black font-bold shadow-2xl cursor-pointer transition-all ${
              !isPaused && isActive
                ? "bg-amber-400 hover:bg-amber-300 shadow-[0_0_25px_rgba(251,191,36,0.5)]"
                : "bg-emerald-400 hover:bg-emerald-300 shadow-[0_0_25px_rgba(52,211,153,0.6)]"
            }`}
            title={!isPaused && isActive ? "Pause Focus Timer" : "Start Focus Timer"}
          >
            {!isPaused && isActive ? (
              <Pause className="w-7 h-7 stroke-[2.5]" />
            ) : (
              <Play className="w-7 h-7 ml-0.5 stroke-[2.5]" />
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              if (selectedEndeavorId) {
                onFinishSession(selectedEndeavorId, durationMinutes, sessionNotes);
                handleReset();
                confetti({ particleCount: 60, spread: 70 });
              }
            }}
            className="p-3 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/15 rounded-2xl cursor-pointer transition border border-emerald-500/20"
            title="Mark Session Completed"
          >
            <CheckCircle2 className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Focus Sound Synthesizer (10Hz Alpha Waves, Pink Noise, Rain) */}
        <div className="relative z-10 w-full max-w-md bg-white/[0.03] border border-white/10 rounded-2xl p-4 space-y-3 shadow-inner">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center space-x-1.5 font-mono">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>ACOUSTIC RESONANCE SYNTH</span>
            </span>
            <span className="text-[9px] font-mono text-slate-500">// WEB AUDIO API</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => toggleSound("binaural")}
              className={`py-2.5 px-2 rounded-xl text-[11px] font-mono font-semibold flex flex-col items-center justify-center space-y-1 cursor-pointer active:scale-95 transition-all ${
                soundMode === "binaural"
                  ? "bg-emerald-400 text-black font-bold shadow-[0_0_12px_rgba(52,211,153,0.5)]"
                  : "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 hover:border-white/15"
              }`}
            >
              <Radio className="w-4 h-4" />
              <span>10Hz Alpha</span>
            </button>

            <button
              onClick={() => toggleSound("noise")}
              className={`py-2.5 px-2 rounded-xl text-[11px] font-mono font-semibold flex flex-col items-center justify-center space-y-1 cursor-pointer active:scale-95 transition-all ${
                soundMode === "noise"
                  ? "bg-emerald-400 text-black font-bold shadow-[0_0_12px_rgba(52,211,153,0.5)]"
                  : "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 hover:border-white/15"
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>Pink Noise</span>
            </button>

            <button
              onClick={() => toggleSound("rain")}
              className={`py-2.5 px-2 rounded-xl text-[11px] font-mono font-semibold flex flex-col items-center justify-center space-y-1 cursor-pointer active:scale-95 transition-all ${
                soundMode === "rain"
                  ? "bg-emerald-400 text-black font-bold shadow-[0_0_12px_rgba(52,211,153,0.5)]"
                  : "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 hover:border-white/15"
              }`}
            >
              <CloudRain className="w-4 h-4" />
              <span>Deep Rain</span>
            </button>
          </div>

          {soundMode !== "none" && (
            <div className="flex items-center space-x-3 pt-2">
              <VolumeX className="w-3.5 h-3.5 text-slate-500" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="flex-1 accent-emerald-400 cursor-pointer h-1.5 bg-white/10 rounded-lg appearance-none"
              />
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          )}
        </div>

        {/* Scratchpad during focus session */}
        <div className="relative z-10 w-full max-w-md mt-4">
          <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            SESSION FLOW SCRATCHPAD // TACTICAL LOGS
          </label>
          <textarea
            value={sessionNotes}
            onChange={(e) => setSessionNotes(e.target.value)}
            placeholder="Capture epiphanies, breakthrough notes, or tactical insights..."
            rows={2}
            className="w-full px-3 py-2.5 bg-[#06070B] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 font-mono resize-none"
          />
        </div>
      </div>
    </div>
  );
};
