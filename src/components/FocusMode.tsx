import React, { useState, useEffect, useRef } from "react";
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
  Maximize2,
  CloudRain,
  Radio,
} from "lucide-react";
import { Endeavor } from "../types";
import { focusAudio } from "../lib/audio";
import confetti from "canvas-confetti";

interface FocusModeProps {
  endeavors: Endeavor[];
  initialEndeavor?: Endeavor | null;
  onFinishSession: (endeavorId: string, durationMinutes: number, notes: string) => void;
}

export const FocusMode: React.FC<FocusModeProps> = ({
  endeavors,
  initialEndeavor,
  onFinishSession,
}) => {
  const [selectedEndeavorId, setSelectedEndeavorId] = useState(
    initialEndeavor?.id || endeavors[0]?.id || ""
  );
  const [mode, setMode] = useState<"pomodoro" | "deep" | "shortBreak">("pomodoro");
  const [durationMinutes, setDurationMinutes] = useState<number>(25);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [soundMode, setSoundMode] = useState<"none" | "binaural" | "noise" | "rain">("none");
  const [volume, setVolume] = useState(0.2);
  const [sessionNotes, setSessionNotes] = useState("");

  const activeEndeavor = endeavors.find((e) => e.id === selectedEndeavorId);

  // Sync initialEndeavor if changed
  useEffect(() => {
    if (initialEndeavor) {
      setSelectedEndeavorId(initialEndeavor.id);
    }
  }, [initialEndeavor]);

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

  // Timer Tick
  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeftSeconds > 0) {
      interval = setInterval(() => {
        setTimeLeftSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timeLeftSeconds === 0 && isActive) {
      setIsActive(false);
      focusAudio.stop();
      setSoundMode("none");

      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.6 },
      });

      if (selectedEndeavorId) {
        onFinishSession(selectedEndeavorId, durationMinutes, sessionNotes);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeftSeconds, selectedEndeavorId, durationMinutes, sessionNotes, onFinishSession]);

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
  const totalSeconds = durationMinutes * 60;
  const progressRatio = totalSeconds > 0 ? (totalSeconds - timeLeftSeconds) / totalSeconds : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-[#0D0D0D] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-white/5 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left space-y-2">
            <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-emerald-400 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Flow State Laboratory</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Single-Task Deep Focus
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md">
              Eliminate distractions and cultivate deep uninterrupted cognitive immersion.
            </p>
          </div>

          {/* Target Endeavor Selector */}
          <div className="w-full md:w-72 bg-[#141414] border border-white/10 p-3.5 rounded-2xl">
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Focusing on Endeavor:
            </label>
            <select
              value={selectedEndeavorId}
              onChange={(e) => setSelectedEndeavorId(e.target.value)}
              className="w-full bg-black/50 border border-white/10 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500/50"
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

      {/* Main Focus Control Container */}
      <div className="bg-[#0D0D0D] rounded-3xl p-6 sm:p-10 border border-white/5 shadow-xs flex flex-col items-center">
        {/* Preset Mode Switcher */}
        <div className="flex items-center space-x-2 bg-white/5 border border-white/5 p-1.5 rounded-2xl mb-8">
          <button
            onClick={() => handleSetMode("pomodoro")}
            className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer active:scale-95 transition-all duration-150 ${
              mode === "pomodoro"
                ? "bg-emerald-500 text-black shadow-md font-bold"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            25m Sprint
          </button>
          <button
            onClick={() => handleSetMode("deep")}
            className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer active:scale-95 transition-all duration-150 ${
              mode === "deep"
                ? "bg-emerald-500 text-black shadow-md font-bold"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            50m Deep Block
          </button>
          <button
            onClick={() => handleSetMode("shortBreak")}
            className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer active:scale-95 transition-all duration-150 ${
              mode === "shortBreak"
                ? "bg-emerald-500 text-black shadow-md font-bold"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            5m Recovery
          </button>
        </div>

        {/* Circular Progress Display */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center mb-8">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="44%"
              className="text-white/5 stroke-current"
              strokeWidth="10"
              fill="transparent"
            />
            <circle
              cx="50%"
              cy="50%"
              r="44%"
              className="text-emerald-500 stroke-current transition-all duration-500 ease-linear"
              strokeWidth="10"
              strokeDasharray="276"
              strokeDashoffset={276 * (1 - progressRatio)}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Time digits in center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-5xl sm:text-6xl font-bold font-mono text-white tracking-tighter">
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </span>
            <span className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-widest">
              {isActive ? "Flow in Progress" : "Ready to Start"}
            </span>
          </div>
        </div>

        {/* Play / Pause / Reset Buttons */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={handleReset}
            className="p-3 text-slate-400 hover:text-white hover:bg-white/10 active:scale-90 rounded-2xl cursor-pointer transition-all duration-150"
            title="Reset Timer"
          >
            <RotateCcw className="w-6 h-6" />
          </button>

          <button
            onClick={() => setIsActive(!isActive)}
            className={`w-16 h-16 rounded-2xl flex items-center justify-center text-black font-bold shadow-xl hover:scale-105 active:scale-95 cursor-pointer transition-all duration-150 ${
              isActive
                ? "bg-amber-400 hover:bg-amber-300 shadow-amber-900/30"
                : "bg-emerald-500 hover:bg-emerald-400 shadow-emerald-950/40"
            }`}
            title={isActive ? "Pause Focus Timer" : "Start Focus Timer"}
          >
            {isActive ? <Pause className="w-7 h-7 stroke-[2.5]" /> : <Play className="w-7 h-7 ml-0.5 stroke-[2.5]" />}
          </button>

          <button
            onClick={() => {
              if (selectedEndeavorId) {
                onFinishSession(selectedEndeavorId, durationMinutes, sessionNotes);
                handleReset();
                confetti({ particleCount: 50, spread: 60 });
              }
            }}
            className="p-3 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 active:scale-90 rounded-2xl cursor-pointer transition-all duration-150"
            title="Mark Session Completed"
          >
            <CheckCircle2 className="w-6 h-6" />
          </button>
        </div>

        {/* Focus Sound Generator (Binaural 10Hz Beats & Pink Noise & Gentle Rain) */}
        <div className="w-full max-w-md bg-[#141414] border border-white/5 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Acoustic Focus Synthesizer</span>
            </span>
            <span className="text-[10px] text-slate-500">Real-time Web Audio</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => toggleSound("binaural")}
              className={`py-2 px-2.5 rounded-xl text-[11px] font-semibold flex flex-col items-center justify-center space-y-1 cursor-pointer active:scale-95 transition-all duration-150 ${
                soundMode === "binaural"
                  ? "bg-emerald-500 text-black font-bold shadow-xs"
                  : "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 hover:border-white/15"
              }`}
            >
              <Radio className="w-4 h-4" />
              <span>10Hz Alpha</span>
            </button>

            <button
              onClick={() => toggleSound("noise")}
              className={`py-2 px-2.5 rounded-xl text-[11px] font-semibold flex flex-col items-center justify-center space-y-1 cursor-pointer active:scale-95 transition-all duration-150 ${
                soundMode === "noise"
                  ? "bg-emerald-500 text-black font-bold shadow-xs"
                  : "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 hover:border-white/15"
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>Pink Noise</span>
            </button>

            <button
              onClick={() => toggleSound("rain")}
              className={`py-2 px-2.5 rounded-xl text-[11px] font-semibold flex flex-col items-center justify-center space-y-1 cursor-pointer active:scale-95 transition-all duration-150 ${
                soundMode === "rain"
                  ? "bg-emerald-500 text-black font-bold shadow-xs"
                  : "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 hover:border-white/15"
              }`}
            >
              <CloudRain className="w-4 h-4" />
              <span>Gentle Rain</span>
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
                className="flex-1 accent-emerald-500 cursor-pointer h-1.5 bg-white/10 rounded-lg appearance-none"
              />
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          )}
        </div>

        {/* Scratchpad during focus session */}
        <div className="w-full max-w-md mt-4">
          <label className="block text-xs font-semibold text-slate-400 mb-1">
            Session Flow Scratchpad (thoughts & deliverables)
          </label>
          <textarea
            value={sessionNotes}
            onChange={(e) => setSessionNotes(e.target.value)}
            placeholder="Capture random thoughts here so you don't derail your flow..."
            rows={2}
            className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>
      </div>
    </div>
  );
};
