import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Lock,
  Layers,
  CheckCircle2,
  Orbit,
  Flame,
  Globe,
  Compass,
  Cpu,
  Star,
  Users,
  Eye,
  Activity,
  ArrowUpRight,
  ChevronRight,
  LogIn,
  UserPlus,
  Play,
  Volume2,
  VolumeX,
  Radio,
  Sliders,
  Shield,
  Smartphone,
  Trophy,
  Gift,
  HelpCircle,
  ChevronDown,
  Check,
  X,
  BarChart3,
  FlameKindling,
  Crown
} from "lucide-react";
import { focusAudio, AmbientSoundType } from "../lib/audio";

// Generated visual assets
import RoyalLogoImg from "../assets/images/lifeorbit_royal_logo_1787677560645.jpg";
import HeroPreviewImg from "../assets/images/lifeorbit_hero_preview_1787677582719.jpg";
import FocusChamberImg from "../assets/images/focus_zen_synth_1787677601618.jpg";
import AICoachImg from "../assets/images/ai_cosmic_coach_1787677620404.jpg";

interface PublicLandingPageProps {
  onOpenAuth: (mode: "login" | "signup") => void;
  onEnterWorkspaceAsGuest: () => void;
}

export function PublicLandingPage({
  onOpenAuth,
  onEnterWorkspaceAsGuest,
}: PublicLandingPageProps) {
  const [activeFeatureTab, setActiveFeatureTab] = useState<number>(0);
  const [previewSound, setPreviewSound] = useState<AmbientSoundType>("none");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [interactiveSpheres, setInteractiveSpheres] = useState<Record<string, number>>({
    Career: 85,
    Mindfulness: 72,
    Vitality: 64,
    Creation: 90,
    Wealth: 58,
  });
  const [focusHoursSlider, setFocusHoursSlider] = useState<number>(18);
  const [simulatedAiPlan, setSimulatedAiPlan] = useState<string | null>(null);
  const [isGeneratingAiPlan, setIsGeneratingAiPlan] = useState(false);

  // Audio cleanup on unmount
  useEffect(() => {
    return () => {
      focusAudio.stopAmbient();
    };
  }, []);

  const handleToggleSound = (type: AmbientSoundType) => {
    if (previewSound === type && isPlayingAudio) {
      focusAudio.stopAmbient();
      setIsPlayingAudio(false);
      setPreviewSound("none");
    } else {
      focusAudio.playSoundscape(type, 0.35);
      setIsPlayingAudio(true);
      setPreviewSound(type);
    }
  };

  const handleSimulateAiSchedule = () => {
    focusAudio.playClick();
    setIsGeneratingAiPlan(true);
    setSimulatedAiPlan(null);
    setTimeout(() => {
      setSimulatedAiPlan(
        "⚡ Optimal Circadian Trajectory Generated:\n• 08:30 - 10:30: High-gravity Deep Work block (Binaural Alpha @ 10Hz)\n• 11:00 - 12:00: Creative Synthesis & System Architecture\n• 15:30 - 16:30: Kinetic Vitality sprint + 20-20-20 Optic Recovery\n• Expected Momentum Yield: +180 XP & 94% Focus Efficiency"
      );
      setIsGeneratingAiPlan(false);
      focusAudio.playSuccess();
    }, 900);
  };

  const features = [
    {
      id: "spheres",
      title: "Multi-Dimensional Life Spheres",
      subtitle: "Orbital Gravity & Balance Topology",
      desc: "Organize your ambitions across Career, Health, Finance, Mindfulness, Creation, and Legacy. Every endeavor visualizes real velocity, orbital distance, and balance telemetry.",
      badge: "Cosmic Radar",
      icon: Orbit,
      stats: "7 Core Dimensions",
      image: HeroPreviewImg,
      previewHighlight: "Realtime balance indexing & gyroscopic trajectory map",
      tags: ["Orbital Gravity", "Velocity Indices", "Multi-Axis Radar"],
    },
    {
      id: "focus",
      title: "Tactile Neuro-Focus Chamber",
      subtitle: "Web Audio Synthesizer & Flow Engine",
      desc: "Zero-latency procedural soundscapes (Binaural 10Hz Alpha, 40Hz Gamma, Pink Noise, Cyberpunk Rain) paired with 20-20-20 optic wellness and a floating mini-focus companion.",
      badge: "Web Audio Engine",
      icon: Zap,
      stats: "100% Offline Synth",
      image: FocusChamberImg,
      previewHighlight: "Harmonic frequency oscillation & gentle acoustic chimes",
      tags: ["Binaural Beats", "Optic Health 20-20-20", "Mini Floating Player"],
    },
    {
      id: "copilot",
      title: "Autonomous Gemini Copilot",
      subtitle: "Circadian AI Life Scheduling & Strategy",
      desc: "Context-aware intelligence that analyzes your active cognitive load, daily energy levels, and milestone roadmaps to generate optimal execution schedules in seconds.",
      badge: "Gemini Intelligence",
      icon: Cpu,
      stats: "Realtime Synthesis",
      image: AICoachImg,
      previewHighlight: "Circadian pacing & personalized momentum recovery",
      tags: ["Circadian Time-Blocking", "Cognitive Load Pacing", "AI Briefings"],
    },
    {
      id: "cloud",
      title: "Local-First Speed + Encrypted Sync",
      subtitle: "Obsidian Autonomy meets Cloud Accounts",
      desc: "Instant zero-latency local caching paired with end-to-end encrypted Firestore persistence. Seamlessly switch profiles and access your trajectories across every device.",
      badge: "Firestore Cloud",
      icon: ShieldCheck,
      stats: "0ms UI Latency",
      image: RoyalLogoImg,
      previewHighlight: "Multi-space Netflix-style profiles + JSON exportability",
      tags: ["Zero Data Lock-in", "Instant Local Cache", "Cross-Device Sync"],
    },
  ];

  const comparisons = [
    {
      feature: "Data Architecture",
      traditional: "Clunky cloud-only with lag & outages",
      lifeorbit: "Local-first instant load + encrypted cloud sync",
    },
    {
      feature: "Focus & Soundscapes",
      traditional: "External Spotify tabs or static MP3 loops",
      lifeorbit: "Built-in procedural Web Audio synth (Binaural, Pink Noise)",
    },
    {
      feature: "Life Modeling",
      traditional: "Flat endless lists with task fatigue",
      lifeorbit: "Multi-dimensional Life Spheres with orbital balance radar",
    },
    {
      feature: "AI Intelligence",
      traditional: "Generic chatbots with no schedule context",
      lifeorbit: "Deep context-aware Gemini Circadian Trajectory Coach",
    },
    {
      feature: "Device Experience",
      traditional: "One-size-fits-all stretched interfaces",
      lifeorbit: "Hardware-Adaptive Engine (Ultrawide dual-rail & mobile bottom nav)",
    },
    {
      feature: "Gamification & Rewards",
      traditional: "Boring checkbox animations",
      lifeorbit: "Leveling XP, daily mystery loot crates, & starlight bounties",
    },
  ];

  const faqs = [
    {
      q: "Can I use LifeOrbit completely offline without an account?",
      a: "Yes! LifeOrbit is built with a local-first philosophy. You can click 'Explore Live Demo Space' to launch a full-featured sandbox stored locally in your browser. When you create an account, your data seamlessly migrates to encrypted cloud Firestore.",
    },
    {
      q: "How does the procedural sound engine work?",
      a: "Unlike standard apps that stream heavy audio files, LifeOrbit synthesizes pristine audio live using the browser's native Web Audio API. This means zero latency, zero bandwidth usage, and pure binaural frequencies.",
    },
    {
      q: "What makes the Life Spheres system different from standard categories?",
      a: "Life Spheres are dynamic multidimensional gravitational nodes. As you complete endeavors in Career, Vitality, or Mindfulness, your life radar recalculates balance in real-time, preventing burnout and highlighting neglected life areas.",
    },
    {
      q: "How is my data protected?",
      a: "Every registered user workspace is isolated inside individual Firestore collections protected by strict security rules. You also maintain complete data sovereignty with one-click JSON and CSV backup exports.",
    },
    {
      q: "Is LifeOrbit optimized for phones, tablets, and ultrawide monitors?",
      a: "Absolutely. Our Device Intelligence Engine detects your hardware in real-time. On mobile, you get an ergonomic thumb-reachable bottom nav; on ultrawide displays (1800px+), you get a dedicated dual-rail telemetry cockpit.",
    },
  ];

  // Calculate calculated metrics for the interactive ROI slider
  const deepWorkHoursGained = Math.round(focusHoursSlider * 0.42 * 52);
  const velocityGain = Math.round(focusHoursSlider * 8.4);
  const xpPotential = Math.round(focusHoursSlider * 125 * 52);
  const sphereScoreList = Object.keys(interactiveSpheres).map((k) => interactiveSpheres[k]);
  const equilibriumIndex =
    sphereScoreList.length > 0
      ? Math.round(sphereScoreList.reduce((acc, curr) => acc + curr, 0) / sphereScoreList.length)
      : 74;

  return (
    <div className="min-h-screen bg-[#030407] text-white selection:bg-amber-400/30 selection:text-amber-200 relative overflow-hidden font-sans">
      {/* Background Starlight & Cosmic Luxury Aurora Nebulae */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[15%] w-[750px] h-[750px] rounded-full bg-gradient-to-br from-emerald-500/12 via-teal-500/8 to-transparent blur-[160px] animate-pulse" />
        <div className="absolute top-[35%] right-[-10%] w-[650px] h-[650px] rounded-full bg-gradient-to-bl from-amber-500/10 via-purple-600/10 to-transparent blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[800px] h-[800px] rounded-full bg-gradient-to-tr from-cyan-500/10 via-indigo-600/10 to-transparent blur-[170px]" />
        {/* Subtle royal geometric grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0d_1px,transparent_1px)] [background-size:32px_32px] opacity-60" />
      </div>

      {/* Royal Navigation Bar */}
      <header className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex items-center justify-between border-b border-white/8 backdrop-blur-2xl bg-[#040508]/70 sticky top-0">
        {/* Brand Crest */}
        <div className="flex items-center gap-3.5 group cursor-pointer" onClick={onEnterWorkspaceAsGuest}>
          <div className="relative w-11 h-11 rounded-2xl overflow-hidden p-0.5 bg-gradient-to-tr from-amber-400 via-emerald-400 to-cyan-400 shadow-[0_0_25px_rgba(245,158,11,0.35)] group-hover:shadow-[0_0_35px_rgba(52,211,153,0.5)] transition-all duration-500">
            <img
              src={RoyalLogoImg}
              alt="LifeOrbit Royal Emblem"
              className="w-full h-full object-cover rounded-[14px]"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-wider text-base sm:text-lg bg-gradient-to-r from-amber-200 via-emerald-300 to-cyan-200 bg-clip-text text-transparent">
                LIFEORBIT
              </span>
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/25 flex items-center gap-1">
                <Crown className="w-2.5 h-2.5 text-amber-400" />
                <span>ROYAL OS</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono tracking-tight">The Space-Grade Life OS</p>
          </div>
        </div>

        {/* Center Quick Navigation (Desktop) */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-mono text-slate-400">
          <a href="#features" className="hover:text-amber-300 transition-colors">
            Life Spheres
          </a>
          <a href="#audio-synth" className="hover:text-emerald-300 transition-colors">
            Sound Engine
          </a>
          <a href="#architecture" className="hover:text-cyan-300 transition-colors">
            Architecture
          </a>
          <a href="#calculator" className="hover:text-purple-300 transition-colors">
            ROI Calculator
          </a>
          <a href="#faq" className="hover:text-white transition-colors">
            FAQ
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => {
              focusAudio.playClick();
              onOpenAuth("login");
            }}
            className="px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <LogIn className="w-4 h-4 text-emerald-400" />
            <span>Sign In</span>
          </button>
          <button
            onClick={() => {
              focusAudio.playLevelUp();
              onOpenAuth("signup");
            }}
            className="px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-black bg-gradient-to-r from-amber-400 via-emerald-300 to-cyan-300 hover:from-amber-300 hover:to-cyan-200 rounded-xl shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:shadow-[0_0_40px_rgba(52,211,153,0.5)] transition-all flex items-center gap-2 transform active:scale-95 cursor-pointer"
          >
            <UserPlus className="w-4 h-4 stroke-[2.5]" />
            <span>Create Account</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-20">
        <div className="text-center max-w-4xl mx-auto space-y-6 sm:space-y-8">
          {/* Eyebrow Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-amber-400/20 text-amber-200 text-xs font-mono backdrop-blur-xl shadow-[0_0_20px_rgba(245,158,11,0.15)]"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Built for high-agency architects • 100% Local-First & Encrypted Sync</span>
          </motion.div>

          {/* Royal Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.08] text-white"
          >
            Master your time.
            <br />
            <span className="bg-gradient-to-r from-amber-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
              Architect your destiny.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-300 text-base sm:text-xl max-w-3xl mx-auto leading-relaxed"
          >
            A high-performance life operating system uniting multidimensional Life Spheres, procedural Web Audio neuro-focus, circadian Gemini scheduling, and encrypted multi-device sync.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
          >
            <button
              onClick={() => {
                focusAudio.playLevelUp();
                onOpenAuth("signup");
              }}
              className="w-full sm:w-auto px-8 py-4 text-base font-extrabold text-black bg-gradient-to-r from-amber-400 via-emerald-300 to-cyan-300 hover:from-amber-300 hover:to-cyan-200 rounded-2xl shadow-[0_0_40px_rgba(245,158,11,0.4)] hover:shadow-[0_0_55px_rgba(52,211,153,0.6)] transition-all flex items-center justify-center gap-2.5 group cursor-pointer active:scale-95"
            >
              <Crown className="w-5 h-5 fill-black" />
              <span>Launch Your Workspace</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </button>

            <button
              onClick={() => {
                focusAudio.playClick();
                onEnterWorkspaceAsGuest();
              }}
              className="w-full sm:w-auto px-7 py-4 text-base font-semibold text-slate-200 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 rounded-2xl transition-all flex items-center justify-center gap-2.5 backdrop-blur-md hover:border-emerald-400/40 cursor-pointer active:scale-95"
            >
              <Play className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
              <span>Explore Live Demo Sandbox</span>
            </button>
          </motion.div>

          {/* Trust Matrix Chips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-mono text-slate-400 pt-4"
          >
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              0ms Local Latency
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              Encrypted Cloud Firestore
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              Web Audio Synthesizer
            </span>
            <span className="flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-purple-400" />
              Hardware-Adaptive UI
            </span>
          </motion.div>
        </div>

        {/* Royal Floating Showcase Showcase with Live Telemetry */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-14 sm:mt-20 rounded-3xl border border-white/15 bg-[#07090F]/90 backdrop-blur-3xl shadow-[0_0_100px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.15)] p-4 sm:p-7 overflow-hidden relative group"
        >
          {/* Top Window Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 mb-6 gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/90 shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
                <div className="w-3 h-3 rounded-full bg-amber-500/90 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/90 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              </div>
              <span className="text-xs font-mono text-slate-400 truncate">
                lifeorbit.os // cockpit-terminal // trajectory-matrix-active
              </span>
            </div>

            <div className="flex items-center gap-2 text-[11px] font-mono">
              <span className="inline-flex items-center gap-1.5 text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/25">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                60 FPS NEURAL ENGINE
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/25">
                <Shield className="w-3 h-3 text-cyan-400" />
                ENCRYPTED CLOUD
              </span>
            </div>
          </div>

          {/* Interactive Feature Matrix Switcher */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              const isActive = activeFeatureTab === idx;
              return (
                <button
                  key={feat.id}
                  onClick={() => {
                    focusAudio.playClick();
                    setActiveFeatureTab(idx);
                  }}
                  className={`text-left p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-b from-emerald-500/15 to-amber-500/10 border-amber-400/40 text-white shadow-[0_0_25px_rgba(245,158,11,0.15)]"
                      : "bg-white/[0.02] border-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <Icon className={`w-4 h-4 ${isActive ? "text-amber-300" : "text-slate-500"}`} />
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${isActive ? "bg-amber-400/20 text-amber-300" : "bg-white/5 text-slate-400"}`}>
                      {feat.badge}
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-white truncate">{feat.title}</div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">{feat.stats}</div>
                </button>
              );
            })}
          </div>

          {/* Interactive Feature Stage with Image Asset & Dynamic Details */}
          <div className="rounded-2xl bg-[#030509] border border-white/10 overflow-hidden relative grid grid-cols-1 lg:grid-cols-12 min-h-[380px]">
            {/* Left Content Column */}
            <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6 relative z-10">
              <div className="space-y-3">
                <div className="text-xs font-mono uppercase tracking-widest text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{features[activeFeatureTab].subtitle}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {features[activeFeatureTab].title}
                </h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  {features[activeFeatureTab].desc}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {features[activeFeatureTab].tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-mono bg-white/[0.05] border border-white/10 px-3 py-1 rounded-lg text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Dynamic Feature Sub-Action */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  {features[activeFeatureTab].previewHighlight}
                </span>

                <button
                  onClick={() => {
                    focusAudio.playClick();
                    onOpenAuth("signup");
                  }}
                  className="px-4 py-2 text-xs font-bold text-black bg-gradient-to-r from-amber-400 to-emerald-300 hover:from-amber-300 hover:to-emerald-200 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <span>Experience This Feature</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Visual Column (Embedded 8K Art Preview) */}
            <div className="lg:col-span-6 relative min-h-[260px] lg:min-h-full overflow-hidden bg-black flex items-center justify-center">
              <img
                src={features[activeFeatureTab].image}
                alt={features[activeFeatureTab].title}
                className="w-full h-full object-cover object-center opacity-90 group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#030509] via-transparent to-transparent opacity-90 pointer-events-none" />
              
              {/* Floating Live Badge */}
              <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15 text-[11px] font-mono text-slate-300 flex items-center gap-2 shadow-2xl">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>LifeOrbit Engine v2.6 Pro</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Section 2: Interactive Procedural Soundscape Studio Preview */}
        <section id="audio-synth" className="mt-24 sm:mt-32">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>ZERO EXTERNAL ASSETS • 100% OFFLINE WEB AUDIO</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Binaural Neuro-Focus & Procedural Soundscapes
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Listen to the actual synthesizers built directly into LifeOrbit. Click any frequency to preview live sound generation without leaving the page.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                id: "binaural-alpha" as AmbientSoundType,
                title: "Binaural Alpha (10Hz)",
                desc: "Relaxed alertness & creative problem solving",
                color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30",
                badge: "Alpha State",
              },
              {
                id: "binaural-gamma" as AmbientSoundType,
                title: "Binaural Gamma (40Hz)",
                desc: "High-intensity analytical deep work & retention",
                color: "from-amber-500/20 to-orange-500/10 border-amber-500/30",
                badge: "Peak Focus",
              },
              {
                id: "space" as AmbientSoundType,
                title: "Deep Space Orbit",
                desc: "Zero-gravity ambient low-frequency drones",
                color: "from-cyan-500/20 to-blue-500/10 border-cyan-500/30",
                badge: "Cosmic Drone",
              },
              {
                id: "zen" as AmbientSoundType,
                title: "Zen Temple Chimes",
                desc: "Gentle pentatonic sine bowls & harmonic resonance",
                color: "from-purple-500/20 to-indigo-500/10 border-purple-500/30",
                badge: "Mindfulness",
              },
            ].map((sound) => {
              const isPlayingThis = previewSound === sound.id && isPlayingAudio;
              return (
                <div
                  key={sound.id}
                  className={`p-6 rounded-3xl bg-gradient-to-b ${sound.color} border backdrop-blur-xl space-y-4 flex flex-col justify-between transition-all hover:scale-[1.02]`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/10 text-white">
                        {sound.badge}
                      </span>
                      {isPlayingThis && (
                        <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          SYNTHESIZING
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-white">{sound.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{sound.desc}</p>
                  </div>

                  <button
                    onClick={() => handleToggleSound(sound.id)}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isPlayingThis
                        ? "bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)]"
                        : "bg-white/10 hover:bg-white/20 text-white border border-white/15"
                    }`}
                  >
                    {isPlayingThis ? (
                      <>
                        <VolumeX className="w-4 h-4" />
                        <span>Stop Preview</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4" />
                        <span>Preview Live Audio</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 3: Interactive Spheres Gravity Playground */}
        <section id="features" className="mt-24 sm:mt-32">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-[#090b14]/90 to-[#04060b]/90 backdrop-blur-3xl p-6 sm:p-10 shadow-[0_0_80px_rgba(0,0,0,0.6)]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left text & sliders */}
              <div className="lg:col-span-6 space-y-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-mono">
                    <Orbit className="w-3.5 h-3.5" />
                    <span>INTERACTIVE GRAVITY RADAR</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                    Balance Your Ambitions in Real-Time
                  </h2>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Adjust the sliders below to see how LifeOrbit dynamically balances your trajectory. As one area flourishes, the radar map recalibrates equilibrium to prevent burnout.
                  </p>
                </div>

                <div className="space-y-3.5 font-mono">
                  {Object.entries(interactiveSpheres).map(([sphere, val]) => (
                    <div key={sphere} className="space-y-1 bg-white/[0.02] p-3 rounded-xl border border-white/5">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300 font-bold">{sphere} Sphere</span>
                        <span className="text-amber-300 font-bold">{val}% Velocity</span>
                      </div>
                      <input
                        type="range"
                        min={10}
                        max={100}
                        value={val}
                        onChange={(e) =>
                          setInteractiveSpheres((prev) => ({
                            ...prev,
                            [sphere]: Number(e.target.value),
                          }))
                        }
                        className="w-full accent-amber-400 h-1.5 bg-white/10 rounded-lg cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Right interactive radar output card */}
              <div className="lg:col-span-6 bg-[#030408] border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6 text-center">
                <div className="space-y-2">
                  <div className="text-xs font-mono text-slate-400">CALCULATED EQUILIBRIUM INDEX</div>
                  <div className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-amber-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                    {equilibriumIndex}/100
                  </div>
                  <div className="text-xs font-mono text-emerald-400">
                    STATUS: PEAK MULTIDIMENSIONAL HARMONY
                  </div>
                </div>

                {/* Visual Orb Clusters */}
                <div className="relative h-44 flex items-center justify-center">
                  <div className="absolute w-36 h-36 rounded-full border border-dashed border-amber-400/30 animate-[spin_20s_linear_infinite]" />
                  <div className="absolute w-28 h-28 rounded-full border border-cyan-400/30 animate-[spin_14s_linear_infinite_reverse]" />
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 via-emerald-400 to-cyan-400 shadow-[0_0_35px_rgba(245,158,11,0.5)] flex items-center justify-center text-black font-extrabold text-xs">
                    ORBIT
                  </div>
                </div>

                <button
                  onClick={() => {
                    focusAudio.playLevelUp();
                    onOpenAuth("signup");
                  }}
                  className="w-full py-3.5 rounded-xl font-extrabold text-xs sm:text-sm text-black bg-gradient-to-r from-amber-400 to-emerald-300 hover:from-amber-300 hover:to-emerald-200 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95"
                >
                  <Crown className="w-4 h-4 fill-black" />
                  <span>Lock in Your Life Spheres Trajectory</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Architecture Comparison Matrix ("Built Different") */}
        <section id="architecture" className="mt-24 sm:mt-32">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono">
              <Shield className="w-3.5 h-3.5" />
              <span>THE SOVEREIGN ARCHITECTURE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Why LifeOrbit Is Built Different
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Standard task apps treat life as a flat todo list. LifeOrbit is an integrated space-grade operating system designed for human mastery.
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-white/10 bg-[#07090F]/90 backdrop-blur-2xl">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02]">
                  <th className="p-4 sm:p-5 font-mono text-slate-400 font-semibold">CAPABILITY</th>
                  <th className="p-4 sm:p-5 font-mono text-rose-400/90 font-semibold">TRADITIONAL APPS</th>
                  <th className="p-4 sm:p-5 font-mono text-amber-300 font-extrabold bg-amber-400/[0.03]">
                    LIFEORBIT ROYAL OS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {comparisons.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 sm:p-5 font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>{row.feature}</span>
                    </td>
                    <td className="p-4 sm:p-5 text-slate-400">
                      <div className="flex items-center gap-2">
                        <X className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>{row.traditional}</span>
                      </div>
                    </td>
                    <td className="p-4 sm:p-5 text-emerald-300 font-semibold bg-amber-400/[0.03]">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{row.lifeorbit}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 5: Interactive Focus Hours & Deep Work ROI Calculator */}
        <section id="calculator" className="mt-24 sm:mt-32">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0a0d18] via-[#05070d] to-[#0a0d18] p-6 sm:p-10 shadow-[0_0_80px_rgba(0,0,0,0.7)]">
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono">
                <BarChart3 className="w-3.5 h-3.5" />
                <span>ANNUAL COMPOUNDING CALCULATOR</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Calculate Your Deep Work Velocity
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm">
                Move the slider to estimate how much structured focus and momentum LifeOrbit yields for your personal year.
              </p>
            </div>

            <div className="max-w-xl mx-auto space-y-6">
              <div className="bg-white/[0.03] p-5 rounded-2xl border border-white/10 space-y-3">
                <div className="flex justify-between items-center text-sm font-mono">
                  <span className="text-slate-300">Target Deep Work / Week:</span>
                  <span className="text-xl font-extrabold text-amber-300">{focusHoursSlider} Hours</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={45}
                  value={focusHoursSlider}
                  onChange={(e) => setFocusHoursSlider(Number(e.target.value))}
                  className="w-full accent-emerald-400 h-2 bg-white/10 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>5 hrs (Casual)</span>
                  <span>25 hrs (Founder / Scholar)</span>
                  <span>45 hrs (Extreme Sprint)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-center space-y-1">
                  <div className="text-[11px] font-mono text-emerald-400">ANNUAL FOCUS GAINED</div>
                  <div className="text-2xl font-black text-white">+{deepWorkHoursGained}h</div>
                  <div className="text-[10px] text-slate-400">Equivalent to 48 extra productive days</div>
                </div>

                <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 text-center space-y-1">
                  <div className="text-[11px] font-mono text-cyan-400">VELOCITY ACCELERATION</div>
                  <div className="text-2xl font-black text-white">+{velocityGain}%</div>
                  <div className="text-[10px] text-slate-400">Trajectory completion rate</div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-center space-y-1">
                  <div className="text-[11px] font-mono text-amber-400">XP & REWARDS YIELD</div>
                  <div className="text-2xl font-black text-white">{xpPotential.toLocaleString()} XP</div>
                  <div className="text-[10px] text-slate-400">Tier 50 Master Leveling</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Interactive AI Schedule Generator Demo */}
        <section className="mt-24 sm:mt-32">
          <div className="rounded-3xl border border-cyan-500/25 bg-gradient-to-b from-[#060914] to-[#020409] p-6 sm:p-10 shadow-[0_0_80px_rgba(6,182,212,0.15)] relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>GEMINI CIRCADIAN SYNTHESIS</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Autonomous AI Life Scheduling
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Test the Gemini life coach right now. Click the button to synthesize an optimal deep-work schedule tailored for circadian energy peaks and cognitive recovery.
                </p>

                <button
                  onClick={handleSimulateAiSchedule}
                  disabled={isGeneratingAiPlan}
                  className="px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-black bg-gradient-to-r from-cyan-300 via-teal-300 to-emerald-300 hover:from-cyan-200 hover:to-emerald-200 transition-all flex items-center gap-2 cursor-pointer shadow-lg active:scale-95 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isGeneratingAiPlan ? "Synthesizing Neural Schedule..." : "Run AI Trajectory Simulation"}</span>
                </button>
              </div>

              <div className="lg:col-span-6 bg-[#03050a] border border-white/10 rounded-2xl p-5 sm:p-6 font-mono text-xs text-slate-300 min-h-[200px] flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-slate-500 border-b border-white/5 pb-2">
                    <span>COACH_TELEMETRY.LOG</span>
                    <span className="text-emerald-400">ONLINE</span>
                  </div>
                  {simulatedAiPlan ? (
                    <div className="whitespace-pre-line text-emerald-300 leading-relaxed pt-2">
                      {simulatedAiPlan}
                    </div>
                  ) : (
                    <div className="text-slate-500 italic pt-6 text-center">
                      Click "Run AI Trajectory Simulation" to generate a live circadian execution plan.
                    </div>
                  )}
                </div>
                <div className="text-[10px] text-slate-500 pt-4">
                  Integrated with Gemini 2.5 & Circadian Rhythm pacing
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 7: Interactive FAQ Accordion */}
        <section id="faq" className="mt-24 sm:mt-32 max-w-3xl mx-auto">
          <div className="text-center space-y-3 mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-mono">
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>FREQUENTLY ASKED QUESTIONS</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white">Everything You Need to Know</h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden transition-colors hover:border-white/20"
                >
                  <button
                    onClick={() => {
                      focusAudio.playClick();
                      setActiveFaq(isOpen ? null : idx);
                    }}
                    className="w-full p-4 sm:p-5 text-left font-bold text-sm sm:text-base flex items-center justify-between text-white cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? "rotate-180 text-amber-300" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5 pt-3"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* Royal Grand Finale CTA Banner */}
        <section className="mt-24 sm:mt-32 text-center relative">
          <div className="rounded-3xl border border-amber-400/30 bg-gradient-to-b from-amber-500/15 via-[#060810] to-[#040508] p-8 sm:p-14 backdrop-blur-3xl shadow-[0_0_100px_rgba(245,158,11,0.25)] relative overflow-hidden space-y-6">
            <div className="w-16 h-16 rounded-2xl mx-auto p-1 bg-gradient-to-tr from-amber-400 via-emerald-400 to-cyan-400 shadow-[0_0_30px_rgba(245,158,11,0.4)]">
              <img
                src={RoyalLogoImg}
                alt="Emblem"
                className="w-full h-full object-cover rounded-xl"
                referrerPolicy="no-referrer"
              />
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Begin your sovereign trajectory today.
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
              Join founders, researchers, and creators using LifeOrbit to master their hours, goals, and daily flow.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <button
                onClick={() => {
                  focusAudio.playLevelUp();
                  onOpenAuth("signup");
                }}
                className="w-full sm:w-auto px-8 py-4 text-base font-extrabold text-black bg-gradient-to-r from-amber-400 via-emerald-300 to-cyan-300 hover:from-amber-300 hover:to-cyan-200 rounded-2xl shadow-[0_0_40px_rgba(245,158,11,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Crown className="w-5 h-5 fill-black" />
                <span>Create Your Space-Grade Account</span>
              </button>

              <button
                onClick={() => {
                  focusAudio.playClick();
                  onEnterWorkspaceAsGuest();
                }}
                className="w-full sm:w-auto px-6 py-4 text-base font-semibold text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-2xl transition-all cursor-pointer active:scale-95"
              >
                <span>Launch Free Sandbox</span>
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4 font-mono">
          <div className="flex items-center gap-2">
            <span>© 2026 LifeOrbit OS • Space-Grade Sovereignty & Focus</span>
          </div>
          <div className="flex items-center gap-5">
            <button
              onClick={() => {
                focusAudio.playClick();
                onOpenAuth("login");
              }}
              className="hover:text-amber-300 transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => {
                focusAudio.playClick();
                onOpenAuth("signup");
              }}
              className="hover:text-emerald-300 transition-colors cursor-pointer"
            >
              Create Account
            </button>
            <button
              onClick={() => {
                focusAudio.playClick();
                onEnterWorkspaceAsGuest();
              }}
              className="hover:text-cyan-300 transition-colors cursor-pointer"
            >
              Guest Sandbox
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
}

