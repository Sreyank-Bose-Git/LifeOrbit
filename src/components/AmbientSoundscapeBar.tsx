import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Headphones,
  Sparkles,
  Zap,
  Radio,
  Sliders,
  ChevronDown,
  ChevronUp,
  Smile,
  Bell,
  BellOff,
  CloudRain,
  Moon,
  Flame,
  Coffee,
} from "lucide-react";
import { focusAudio, AmbientSoundType } from "../lib/audio";
import { ThemeAccent } from "../types";

interface AmbientSoundscapeBarProps {
  accent?: ThemeAccent;
  isEmojiLayerActive: boolean;
  onToggleEmojiLayer: () => void;
  onReplayIntroLogo?: () => void;
}

export const AmbientSoundscapeBar: React.FC<AmbientSoundscapeBarProps> = ({
  accent = "emerald",
  isEmojiLayerActive,
  onToggleEmojiLayer,
  onReplayIntroLogo,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSound, setActiveSound] = useState<AmbientSoundType>("none");
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.25);
  const [sfxEnabled, setSfxEnabled] = useState(true);

  // Sync state with audio engine
  const handleSelectSound = (type: AmbientSoundType) => {
    if (activeSound === type && isPlaying) {
      // Toggle off
      focusAudio.stopAmbient();
      setIsPlaying(false);
      setActiveSound("none");
    } else {
      // Start new soundscape
      focusAudio.playSoundscape(type, volume);
      setActiveSound(type);
      setIsPlaying(true);
      focusAudio.playClick();
    }
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      focusAudio.stopAmbient();
      setIsPlaying(false);
    } else {
      const soundToPlay = activeSound === "none" ? "cyberpunk" : activeSound;
      focusAudio.playSoundscape(soundToPlay, volume);
      setActiveSound(soundToPlay);
      setIsPlaying(true);
      focusAudio.playClick();
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    focusAudio.setVolume(newVol);
  };

  const handleToggleSfx = () => {
    const next = !sfxEnabled;
    setSfxEnabled(next);
    focusAudio.setSoundEffectsEnabled(next);
    if (next) focusAudio.playSuccess();
  };

  const SOUND_PRESETS: Array<{
    id: AmbientSoundType;
    label: string;
    icon: string;
    desc: string;
    badge?: string;
  }> = [
    {
      id: "cyberpunk",
      label: "Cyber Synth",
      icon: "⚡",
      desc: "Warm analog synthesizer drone & harmonic resonance",
      badge: "Popular",
    },
    {
      id: "space",
      label: "Deep Space",
      icon: "🪐",
      desc: "Sub-bass nebula swells & cosmic harmonic shimmer",
      badge: "Cosmic",
    },
    {
      id: "rain",
      label: "Rain & Thunder",
      icon: "🌧️",
      desc: "Gentle natural rain patter with distant soft thunder",
    },
    {
      id: "zen",
      label: "Zen Bowls",
      icon: "🧘",
      desc: "Harmonic Tibetan singing bowls with rich overtones",
    },
    {
      id: "lofi",
      label: "Lo-Fi Vinyl",
      icon: "☕",
      desc: "Warm vinyl crackle & relaxing electric piano chords",
      badge: "Cozy",
    },
    {
      id: "binaural-alpha",
      label: "Alpha 10Hz",
      icon: "🧠",
      desc: "Binaural frequency tuned for deep calm focus",
      badge: "Flow",
    },
    {
      id: "binaural-gamma",
      label: "Gamma 40Hz",
      icon: "💡",
      desc: "Binaural beats for high-cognition problem solving",
    },
  ];

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 max-w-lg w-[92%] sm:w-auto">
      {/* Expanded Audio Control Modal / Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-3 bg-[#0D0D0D]/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-5 shadow-2xl space-y-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Headphones className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">
                    Ambient Soundscapes & FX
                  </h3>
                  <p className="text-[10px] text-slate-400">Procedural Web Audio Engine (100% Offline)</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {/* Replay Cinematic Intro Button */}
                {onReplayIntroLogo && (
                  <button
                    onClick={() => {
                      onReplayIntroLogo();
                      setIsOpen(false);
                    }}
                    className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-lg text-[10px] font-bold border border-white/5 cursor-pointer active:scale-95 transition"
                    title="Replay cinematic entry logo animation"
                  >
                    Intro Logo 🎬
                  </button>
                )}

                {/* Close Drawer */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer transition"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Sound Presets Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SOUND_PRESETS.map((preset) => {
                const isSelected = activeSound === preset.id && isPlaying;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectSound(preset.id)}
                    className={`p-3 rounded-2xl text-left border cursor-pointer active:scale-95 transition-all flex flex-col justify-between space-y-1 relative group ${
                      isSelected
                        ? "bg-emerald-500/15 border-emerald-500/40 text-white shadow-lg shadow-emerald-500/10"
                        : "bg-[#141414] hover:bg-white/10 border-white/5 text-slate-300 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl group-hover:scale-110 transition-transform">{preset.icon}</span>
                      {preset.badge && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-emerald-300">
                          {preset.badge}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold truncate">{preset.label}</div>
                      <div className="text-[9px] text-slate-400 line-clamp-1 mt-0.5">{preset.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Volume & FX Controls */}
            <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Volume Slider */}
              <div className="flex items-center space-x-3 flex-1">
                <Volume2 className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-white/10 rounded-lg"
                />
                <span className="text-xs font-mono font-bold text-slate-300 w-8 text-right">
                  {Math.round(volume * 100)}%
                </span>
              </div>

              {/* Toggles (SFX & Moving Emojis) */}
              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={handleToggleSfx}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border cursor-pointer active:scale-95 transition ${
                    sfxEnabled
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                      : "bg-white/5 border-white/5 text-slate-400"
                  }`}
                  title="Toggle tactile UI sound effects (clicks, success chimes)"
                >
                  {sfxEnabled ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
                  <span>UI Sounds</span>
                </button>

                <button
                  onClick={onToggleEmojiLayer}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border cursor-pointer active:scale-95 transition ${
                    isEmojiLayerActive
                      ? "bg-purple-500/10 border-purple-500/30 text-purple-300"
                      : "bg-white/5 border-white/5 text-slate-400"
                  }`}
                  title="Toggle floating background emojis & celebrations"
                >
                  <Smile className="w-3.5 h-3.5" />
                  <span>Floating Emojis</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Pill Mini-Bar */}
      <motion.div
        layout
        className="bg-[#0D0D0D]/90 backdrop-blur-xl border border-white/10 rounded-full px-4 py-2.5 shadow-2xl flex items-center justify-between gap-3 text-xs"
      >
        {/* Play/Pause Button */}
        <button
          onClick={handleTogglePlay}
          className={`w-7 h-7 rounded-full flex items-center justify-center cursor-pointer active:scale-95 transition shadow-sm shrink-0 ${
            isPlaying
              ? "bg-emerald-500 text-black shadow-emerald-500/30"
              : "bg-white/10 hover:bg-white/20 text-white"
          }`}
          title={isPlaying ? "Pause Ambient Soundscape" : "Play Ambient Soundscape"}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
        </button>

        {/* Dynamic Waveform Visualizer & Sound Name */}
        <div
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex items-center space-x-2.5 cursor-pointer flex-1 min-w-0"
        >
          {/* Animated Audio Equalizer Bars */}
          <div className="flex items-center space-x-0.5 h-4 w-5 shrink-0">
            {[1, 2, 3, 4].map((bar) => (
              <motion.span
                key={bar}
                animate={
                  isPlaying
                    ? {
                        height: ["20%", "100%", "40%", "85%", "20%"],
                      }
                    : { height: "20%" }
                }
                transition={
                  isPlaying
                    ? {
                        duration: 0.8 + bar * 0.15,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: bar * 0.1,
                      }
                    : {}
                }
                className={`w-1 rounded-full ${
                  isPlaying ? "bg-emerald-400" : "bg-slate-600"
                }`}
              />
            ))}
          </div>

          <div className="min-w-0">
            <span className="font-bold text-white truncate block">
              {isPlaying && activeSound !== "none"
                ? SOUND_PRESETS.find((s) => s.id === activeSound)?.label || "Ambient Sound"
                : "Soundscapes & Ambience"}
            </span>
            <span className="text-[10px] text-slate-400 block truncate">
              {isPlaying ? "Procedural Audio Playing" : "Click to select background sound"}
            </span>
          </div>
        </div>

        {/* Emoji / FX Quick Toggles */}
        <div className="flex items-center space-x-1.5 shrink-0">
          <button
            onClick={onToggleEmojiLayer}
            className={`p-1.5 rounded-full cursor-pointer transition ${
              isEmojiLayerActive
                ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                : "text-slate-400 hover:text-white"
            }`}
            title="Toggle Moving Emojis Layer"
          >
            <Smile className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="p-1.5 text-slate-400 hover:text-white rounded-full cursor-pointer transition"
            title="Open Soundscape Presets"
          >
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
