import React, { useState } from "react";
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
  Play
} from "lucide-react";

interface PublicLandingPageProps {
  onOpenAuth: (mode: "login" | "signup") => void;
  onEnterWorkspaceAsGuest: () => void;
}

export function PublicLandingPage({
  onOpenAuth,
  onEnterWorkspaceAsGuest,
}: PublicLandingPageProps) {
  const [activeFeatureTab, setActiveFeatureTab] = useState<number>(0);

  const features = [
    {
      id: "spheres",
      title: "Life Spheres & Orbit Topology",
      subtitle: "Multi-dimensional Life Architecture",
      desc: "Organize your ambitions across Career, Health, Finance, Mindfulness, and Creative spheres. Every pursuit visualizes real progress velocity and gravity.",
      badge: "Cosmic Geometry",
      icon: Orbit,
      stats: "7 Core Dimensions",
      previewHighlight: "Dynamic orbital radar with realtime balance indexing",
    },
    {
      id: "focus",
      title: "Tactile Focus Engine & Soundscapes",
      subtitle: "Neuro-Optimized Pomodoro & Deep Work",
      desc: "Built-in binaural audio synth, pink noise, and 20-20-20 optic wellness reminders designed for sustainable, distraction-free execution.",
      badge: "Web Audio Synthesizer",
      icon: Zap,
      stats: "0 Distractions",
      previewHighlight: "Live frequency oscillation with gentle bell chimes",
    },
    {
      id: "copilot",
      title: "Autonomous AI Life Coach",
      subtitle: "Contextual Guidance & Time-Blocking",
      desc: "Generates tailored daily schedules, streaks momentum strategies, and cognitive load pacing directly based on your active energy levels.",
      badge: "Gemini Intelligence",
      icon: Cpu,
      stats: "Instant Synthesis",
      previewHighlight: "Real-time daily telemetry & circadian smart planning",
    },
    {
      id: "cloud",
      title: "Encrypted Cloud Sync & Profiles",
      subtitle: "Like Notion & Obsidian combined",
      desc: "Seamless profile switching, multi-device Firestore synchronization, full JSON exports, and zero data lock-in.",
      badge: "Cloud Firestore",
      icon: ShieldCheck,
      stats: "100% Data Sovereignty",
      previewHighlight: "Dual local-first cache + authenticated cloud persistence",
    },
  ];

  return (
    <div className="min-h-screen bg-[#040508] text-white selection:bg-emerald-500/30 selection:text-emerald-300 relative overflow-hidden font-sans">
      {/* Dynamic Starfield & Nebula Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-[140px]" />
        <div className="absolute top-[40%] right-[-5%] w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[130px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[700px] h-[700px] rounded-full bg-purple-500/10 blur-[150px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      {/* Navigation Header */}
      <header className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between border-b border-white/5 backdrop-blur-md bg-[#040508]/60 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-400 p-0.5 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
            <div className="w-full h-full bg-[#07090e] rounded-[14px] flex items-center justify-center">
              <Orbit className="w-5 h-5 text-emerald-400 animate-[spin_16s_linear_infinite]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-wider text-base bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                LIFEORBIT
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                PRO 2026
              </span>
            </div>
            <p className="text-[11px] text-slate-400">The Space-Grade Life OS</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => onOpenAuth("login")}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white rounded-xl hover:bg-white/5 transition-all flex items-center gap-1.5"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </button>
          <button
            onClick={() => onOpenAuth("signup")}
            className="px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-black bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 hover:from-emerald-300 hover:to-cyan-200 rounded-xl shadow-[0_0_25px_rgba(16,185,129,0.35)] hover:shadow-[0_0_35px_rgba(16,185,129,0.5)] transition-all flex items-center gap-2 transform active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Account</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-20">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-slate-300 text-xs font-medium backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Obsidian-grade local control meets Notion-style cloud accounts</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1]"
          >
            Architect your life.
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
              Track every ambition.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            A high-performance workspace engineered for high-agency individuals. Unify habit streaks, milestone roadmaps, Pomodoro flow synthesis, and cloud sync across all your devices.
          </motion.p>

          {/* CTA Group */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4"
          >
            <button
              onClick={() => onOpenAuth("signup")}
              className="w-full sm:w-auto px-8 py-4 text-sm sm:text-base font-extrabold text-black bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 hover:from-emerald-300 hover:to-cyan-200 rounded-2xl shadow-[0_0_35px_rgba(16,185,129,0.45)] hover:shadow-[0_0_45px_rgba(16,185,129,0.6)] transition-all flex items-center justify-center gap-2 group"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onEnterWorkspaceAsGuest}
              className="w-full sm:w-auto px-6 py-4 text-sm sm:text-base font-semibold text-slate-300 hover:text-white bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 text-emerald-400" />
              <span>Explore Live Demo Space</span>
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center justify-center gap-6 text-xs text-slate-400 pt-2"
          >
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Email verification supported
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              End-to-end cloud Firestore
            </span>
            <span className="flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-purple-400" />
              Works on any browser
            </span>
          </motion.div>
        </div>

        {/* Interactive App Showcase Window */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-14 sm:mt-20 rounded-3xl border border-white/10 bg-[#080a10]/80 backdrop-blur-2xl shadow-[0_0_80px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.1)] p-4 sm:p-6 overflow-hidden relative group"
        >
          {/* Top Window Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-3 text-xs font-mono text-slate-400">lifeorbit.app / workspace / active-trajectory</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                DATABASE ONLINE
              </span>
            </div>
          </div>

          {/* Interactive Feature Matrix Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              const isActive = activeFeatureTab === idx;
              return (
                <button
                  key={feat.id}
                  onClick={() => setActiveFeatureTab(idx)}
                  className={`text-left p-3.5 rounded-2xl border transition-all ${
                    isActive
                      ? "bg-emerald-500/10 border-emerald-500/30 text-white shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                      : "bg-white/[0.02] border-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <Icon className={`w-4 h-4 ${isActive ? "text-emerald-400" : "text-slate-500"}`} />
                    <span className="text-xs font-bold truncate">{feat.badge}</span>
                  </div>
                  <div className="text-xs text-slate-400 line-clamp-1">{feat.title}</div>
                </button>
              );
            })}
          </div>

          {/* Active Preview Showcase */}
          <div className="rounded-2xl bg-[#040508] border border-white/5 p-6 sm:p-8 min-h-[280px] flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10 max-w-xl space-y-3">
              <div className="text-xs font-mono uppercase tracking-widest text-emerald-400">
                {features[activeFeatureTab].subtitle}
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                {features[activeFeatureTab].title}
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {features[activeFeatureTab].desc}
              </p>
              <div className="pt-2 flex items-center gap-3">
                <span className="text-xs font-mono bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-slate-300">
                  {features[activeFeatureTab].stats}
                </span>
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  {features[activeFeatureTab].previewHighlight}
                </span>
              </div>
            </div>

            <div className="relative z-10 mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs text-slate-400">Ready to build your personal trajectory?</span>
              <button
                onClick={() => onOpenAuth("signup")}
                className="px-4 py-2 text-xs font-bold text-black bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all flex items-center gap-1.5"
              >
                <span>Launch Your Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Feature Trio Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-3 hover:border-white/10 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Lock className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-bold text-white">Security & Cloud Isolation</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Every user receives an isolated Firestore workspace with rules-enforced ownership. Only you can read and write your data.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-3 hover:border-white/10 transition-all">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-bold text-white">Multi-Persona Profiles</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Maintain separate work, athletics, creative, and personal spaces with distinct color palettes, mottos, and custom metrics.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-3 hover:border-white/10 transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Flame className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-bold text-white">Streak Mathematics</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Calculates daily momentum, milestone completion weightings, and leveling XP to transform daily discipline into rewarding game loops.
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div>© 2026 LifeOrbit OS. Built for deep focus and life mastery.</div>
          <div className="flex items-center gap-4">
            <button onClick={() => onOpenAuth("login")} className="hover:text-white transition-colors">
              Sign In
            </button>
            <button onClick={() => onOpenAuth("signup")} className="hover:text-white transition-colors">
              Create Account
            </button>
            <button onClick={onEnterWorkspaceAsGuest} className="hover:text-white transition-colors">
              Guest Sandbox
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
}
