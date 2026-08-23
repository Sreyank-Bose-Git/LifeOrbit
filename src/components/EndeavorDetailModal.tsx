import React, { useState } from "react";
import {
  X,
  Flame,
  Target,
  Sparkles,
  CheckCircle2,
  Calendar,
  Trash2,
  Plus,
  ArrowRight,
  TrendingUp,
  Loader2,
  Award,
  Play,
  Orbit,
  Radio,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Endeavor, MilestoneItem } from "../types";
import confetti from "canvas-confetti";

interface EndeavorDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  endeavor: Endeavor | null;
  onUpdateEndeavor: (endeavor: Endeavor) => void;
  onDeleteEndeavor: (id: string) => void;
  onStartFocus: (endeavor: Endeavor) => void;
  onQuickLog: (endeavorId: string, value: number, note?: string) => void;
}

export const EndeavorDetailModal: React.FC<EndeavorDetailModalProps> = ({
  isOpen,
  onClose,
  endeavor,
  onUpdateEndeavor,
  onDeleteEndeavor,
  onStartFocus,
  onQuickLog,
}) => {
  const [newMilestoneText, setNewMilestoneText] = useState("");
  const [logValueInput, setLogValueInput] = useState("1");
  const [logNoteInput, setLogNoteInput] = useState("");
  const [isGeneratingAiTips, setIsGeneratingAiTips] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<"overview" | "milestones" | "ai" | "history">(
    "overview"
  );

  if (!isOpen || !endeavor) return null;

  // Toggle milestone completion
  const handleToggleMilestone = (milestoneId: string) => {
    const updatedMilestones = endeavor.milestones.map((m) => {
      if (m.id === milestoneId) {
        const nextState = !m.completed;
        if (nextState) {
          confetti({ particleCount: 35, spread: 50, origin: { y: 0.7 } });
        }
        return {
          ...m,
          completed: nextState,
          completedAt: nextState ? new Date().toISOString() : undefined,
        };
      }
      return m;
    });

    // If milestone archetype, calculate progress percentage
    let nextCurrentValue = endeavor.currentValue;
    if (endeavor.archetype === "milestone" && updatedMilestones.length > 0) {
      const completedCount = updatedMilestones.filter((m) => m.completed).length;
      nextCurrentValue = Math.round((completedCount / updatedMilestones.length) * 100);
    }

    onUpdateEndeavor({
      ...endeavor,
      milestones: updatedMilestones,
      currentValue: nextCurrentValue,
      updatedAt: new Date().toISOString(),
    });
  };

  // Add new milestone
  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestoneText.trim()) return;

    const newItem: MilestoneItem = {
      id: "m-" + Date.now(),
      title: newMilestoneText.trim(),
      completed: false,
    };

    const nextMilestones = [...(endeavor.milestones || []), newItem];
    let nextVal = endeavor.currentValue;
    if (endeavor.archetype === "milestone") {
      const completedCount = nextMilestones.filter((m) => m.completed).length;
      nextVal = Math.round((completedCount / nextMilestones.length) * 100);
    }

    onUpdateEndeavor({
      ...endeavor,
      milestones: nextMilestones,
      currentValue: nextVal,
      updatedAt: new Date().toISOString(),
    });

    setNewMilestoneText("");
  };

  // Remove milestone
  const handleDeleteMilestone = (milestoneId: string) => {
    const nextMilestones = endeavor.milestones.filter((m) => m.id !== milestoneId);
    let nextVal = endeavor.currentValue;
    if (endeavor.archetype === "milestone") {
      const completedCount = nextMilestones.filter((m) => m.completed).length;
      nextVal =
        nextMilestones.length > 0 ? Math.round((completedCount / nextMilestones.length) * 100) : 0;
    }

    onUpdateEndeavor({
      ...endeavor,
      milestones: nextMilestones,
      currentValue: nextVal,
      updatedAt: new Date().toISOString(),
    });
  };

  // Quick manual log from inside detail view
  const handleManualLog = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(logValueInput) || 1;
    onQuickLog(endeavor.id, val, logNoteInput);
    setLogNoteInput("");
    confetti({ particleCount: 30, spread: 45, origin: { y: 0.8 } });
  };

  // AI strategy generator for this endeavor
  const handleGenerateAiMicroHabits = async () => {
    setIsGeneratingAiTips(true);
    try {
      const prompt = `Give 3 atomic, 2-to-5 minute daily micro-actions to make effortless progress on this goal:
Title: "${endeavor.title}"
Description: "${endeavor.description || "General pursuit"}"
Archetype: ${endeavor.archetype}
Current progress: ${endeavor.currentValue} / ${endeavor.targetValue} ${endeavor.unit}.
Return exactly 3 concise, highly actionable bullet points formatted without preamble.`;

      const res = await fetch("/api/ai/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.insights && Array.isArray(data.insights)) {
          setAiSuggestions(data.insights);
        } else if (data.text) {
          const lines = data.text
            .split("\n")
            .filter((l: string) => l.trim().length > 3)
            .map((l: string) => l.replace(/^[-*•\d.]+\s*/, "").trim());
          setAiSuggestions(lines.slice(0, 3));
        }
      } else {
        setAiSuggestions([
          `Start with a 2-minute non-negotiable micro-session of "${endeavor.title}" every morning.`,
          `Place physical/digital trigger cues where you can see them before starting your day.`,
          `Track only showing up on difficult days — consistency beats intensity.`,
        ]);
      }
    } catch {
      setAiSuggestions([
        `Start with a 2-minute non-negotiable micro-session of "${endeavor.title}" every morning.`,
        `Place physical/digital trigger cues where you can see them before starting your day.`,
        `Track only showing up on difficult days — consistency beats intensity.`,
      ]);
    } finally {
      setIsGeneratingAiTips(false);
    }
  };

  // 14 days history array
  const last14Days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    const dStr = d.toISOString().split("T")[0];
    return {
      date: dStr,
      label: d.toLocaleDateString("en-US", { weekday: "narrow" }),
      value: endeavor.history?.[dStr] || 0,
    };
  });

  const progressPercent = Math.min(
    100,
    Math.round(
      ((endeavor.currentValue - endeavor.startValue) /
        (endeavor.targetValue - endeavor.startValue || 1)) *
        100
    )
  );

  return (
    <div className="fixed inset-0 z-[65] flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl animate-in fade-in duration-150">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-2xl bg-[#06070B]/95 backdrop-blur-3xl border border-white/15 rounded-[32px] shadow-[0_0_80px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col max-h-[90vh] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Cosmic Mesh */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          <div
            className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-20"
            style={{ backgroundColor: endeavor.color || "#10b981" }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
        </div>

        {/* Top Header */}
        <div className="p-6 border-b border-white/10 bg-white/[0.02] flex items-start justify-between relative z-10">
          <div className="flex items-start space-x-3.5">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg"
              style={{
                backgroundColor: endeavor.color || "#10b981",
                boxShadow: `0 0 20px ${endeavor.color || "#10b981"}60`,
              }}
            >
              <Target className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center space-x-2 font-mono">
                <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-md bg-white/10 text-slate-300 border border-white/10">
                  {endeavor.archetype}
                </span>
                <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-md bg-white/10 text-slate-300 border border-white/10">
                  {endeavor.category}
                </span>
                {endeavor.streakCount > 0 && (
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center space-x-1 shadow-[0_0_8px_rgba(251,191,36,0.3)]">
                    <Flame className="w-3 h-3 text-amber-400" />
                    <span>{endeavor.streakCount}D STREAK</span>
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold text-white mt-1 tracking-tight">{endeavor.title}</h2>
              {endeavor.description && (
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-2 font-normal">
                  {endeavor.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 font-mono">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onStartFocus(endeavor)}
              className="px-3.5 py-1.5 bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-[0_0_15px_rgba(52,211,153,0.4)] transition"
              title="Launch Focus Session"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              <span>SPRINT</span>
            </motion.button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl cursor-pointer active:scale-90 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center px-6 pt-3 border-b border-white/10 bg-[#06070B] space-x-4 text-xs font-mono font-bold relative z-10">
          <button
            onClick={() => setActiveSubTab("overview")}
            className={`pb-2.5 cursor-pointer transition border-b-2 uppercase tracking-wider text-[11px] ${
              activeSubTab === "overview"
                ? "text-emerald-400 border-emerald-400 font-bold"
                : "text-slate-400 border-transparent hover:text-slate-200"
            }`}
          >
            Overview & Log
          </button>
          <button
            onClick={() => setActiveSubTab("milestones")}
            className={`pb-2.5 cursor-pointer transition border-b-2 uppercase tracking-wider text-[11px] ${
              activeSubTab === "milestones"
                ? "text-emerald-400 border-emerald-400 font-bold"
                : "text-slate-400 border-transparent hover:text-slate-200"
            }`}
          >
            Milestones ({endeavor.milestones?.length || 0})
          </button>
          <button
            onClick={() => {
              setActiveSubTab("ai");
              if (aiSuggestions.length === 0) handleGenerateAiMicroHabits();
            }}
            className={`pb-2.5 cursor-pointer transition border-b-2 flex items-center space-x-1 uppercase tracking-wider text-[11px] ${
              activeSubTab === "ai"
                ? "text-cyan-400 border-cyan-400 font-bold"
                : "text-slate-400 border-transparent hover:text-slate-200"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Strategy</span>
          </button>
          <button
            onClick={() => setActiveSubTab("history")}
            className={`pb-2.5 cursor-pointer transition border-b-2 uppercase tracking-wider text-[11px] ${
              activeSubTab === "history"
                ? "text-emerald-400 border-emerald-400 font-bold"
                : "text-slate-400 border-transparent hover:text-slate-200"
            }`}
          >
            14-Day Timeline
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10 font-mono">
          {/* TAB 1: OVERVIEW & QUICK MANUAL LOG */}
          {activeSubTab === "overview" && (
            <div className="space-y-6">
              {/* Progress Summary Card */}
              <div className="bg-[#06070B] rounded-2xl p-4 border border-white/10 space-y-3 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-slate-400 uppercase text-[10px]">Accumulated Orbit Progress</span>
                  <span className="text-emerald-400 font-bold text-xs">
                    {endeavor.currentValue} / {endeavor.targetValue} {endeavor.unit} (
                    {progressPercent}%)
                  </span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden p-0.5 border border-white/5">
                  <div
                    className="bg-emerald-400 h-full rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>
                    START: {endeavor.startValue} {endeavor.unit}
                  </span>
                  <span>
                    TARGET: {endeavor.targetValue} {endeavor.unit}
                  </span>
                </div>
              </div>

              {/* Fast Progress Logger Form */}
              <form
                onSubmit={handleManualLog}
                className="bg-[#06070B] rounded-2xl p-4 border border-white/10 space-y-3 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
              >
                <h4 className="text-xs font-bold text-white flex items-center space-x-1.5 uppercase">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>Log Activity Telemetry</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1 uppercase">
                      {endeavor.archetype === "habit"
                        ? "Days/Check-in"
                        : `Amount (${endeavor.unit})`}
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={logValueInput}
                      onChange={(e) => setLogValueInput(e.target.value)}
                      className="w-full px-3 py-2 bg-black/60 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/50"
                      placeholder="1"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] text-slate-400 mb-1 uppercase">
                      Quick Note / Reflection
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={logNoteInput}
                        onChange={(e) => setLogNoteInput(e.target.value)}
                        placeholder="e.g. Completed morning session..."
                        className="flex-1 px-3 py-2 bg-black/60 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/50 font-sans"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-emerald-400 hover:bg-emerald-300 active:scale-95 text-black font-bold text-xs rounded-xl cursor-pointer transition shadow-[0_0_15px_rgba(52,211,153,0.3)] shrink-0"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </form>

              {/* Stats Highlights Grid */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-[#06070B] p-3 rounded-2xl border border-white/10">
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                    Current Streak
                  </span>
                  <div className="text-xl font-bold text-amber-400 mt-0.5">
                    {endeavor.streakCount}d
                  </div>
                </div>
                <div className="bg-[#06070B] p-3 rounded-2xl border border-white/10">
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                    Best Streak
                  </span>
                  <div className="text-xl font-bold text-slate-200 mt-0.5">
                    {endeavor.bestStreak || endeavor.streakCount}d
                  </div>
                </div>
                <div className="bg-[#06070B] p-3 rounded-2xl border border-white/10">
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                    Frequency
                  </span>
                  <div className="text-xl font-bold text-emerald-400 capitalize mt-0.5">
                    {endeavor.frequency}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MILESTONES & BREAKDOWNS */}
          {activeSubTab === "milestones" && (
            <div className="space-y-4">
              <form onSubmit={handleAddMilestone} className="flex space-x-2">
                <input
                  type="text"
                  value={newMilestoneText}
                  onChange={(e) => setNewMilestoneText(e.target.value)}
                  placeholder="Add next sub-goal or milestone phase..."
                  className="flex-1 px-3 py-2.5 bg-[#06070B] border border-white/15 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 font-sans"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-400 hover:bg-emerald-300 active:scale-95 text-black font-bold text-xs rounded-xl cursor-pointer transition shadow-xs flex items-center space-x-1 shrink-0"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Add</span>
                </button>
              </form>

              <div className="space-y-2">
                {endeavor.milestones && endeavor.milestones.length > 0 ? (
                  endeavor.milestones.map((m) => (
                    <div
                      key={m.id}
                      className={`p-3 rounded-xl border flex items-center justify-between transition ${
                        m.completed
                          ? "bg-emerald-500/10 border-emerald-500/25 text-slate-400"
                          : "bg-[#06070B] border-white/10 text-white hover:border-white/20"
                      }`}
                    >
                      <button
                        onClick={() => handleToggleMilestone(m.id)}
                        className="flex items-center space-x-3 text-left flex-1 cursor-pointer"
                      >
                        <div
                          className={`w-5 h-5 rounded-lg flex items-center justify-center transition shrink-0 ${
                            m.completed
                              ? "bg-emerald-400 text-black font-bold shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                              : "border border-white/20 hover:border-emerald-400"
                          }`}
                        >
                          {m.completed && <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />}
                        </div>
                        <span
                          className={`text-xs font-medium font-sans ${
                            m.completed ? "line-through text-slate-500" : "text-slate-200"
                          }`}
                        >
                          {m.title}
                        </span>
                      </button>

                      <button
                        onClick={() => handleDeleteMilestone(m.id)}
                        className="p-1.5 text-slate-600 hover:text-red-400 rounded-lg cursor-pointer transition ml-2"
                        title="Delete milestone"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-500 text-xs bg-[#06070B] rounded-2xl border border-white/10">
                    No milestones configured yet. Add your first step above!
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: AI STRATEGY & ATOMIC HABITS */}
          {activeSubTab === "ai" && (
            <div className="space-y-4">
              <div className="bg-cyan-950/20 border border-cyan-500/30 rounded-2xl p-4 flex items-center justify-between shadow-[0_0_20px_rgba(34,211,238,0.1)]">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shadow-[0_0_10px_rgba(34,211,238,0.3)]">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-cyan-300 uppercase">
                      AI Micro-Habit Strategy
                    </h4>
                    <p className="text-[10px] text-cyan-400/80 font-normal">
                      Tailored 2-minute actionable execution tactics
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleGenerateAiMicroHabits}
                  disabled={isGeneratingAiTips}
                  className="px-3 py-1.5 bg-cyan-400 hover:bg-cyan-300 active:scale-95 text-black text-xs font-bold rounded-xl cursor-pointer transition disabled:opacity-50 flex items-center space-x-1"
                >
                  {isGeneratingAiTips ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  <span>Recalibrate</span>
                </button>
              </div>

              {isGeneratingAiTips ? (
                <div className="p-10 flex flex-col items-center justify-center space-y-2">
                  <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
                  <span className="text-xs text-slate-400">
                    Synthesizing behavioral momentum blueprint...
                  </span>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {aiSuggestions.map((suggestion, idx) => (
                    <div
                      key={idx}
                      className="bg-[#06070B] border border-white/10 hover:border-cyan-500/30 p-3.5 rounded-2xl flex items-start space-x-3 transition group"
                    >
                      <div className="w-6 h-6 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-slate-200 leading-relaxed font-normal font-sans">
                          {suggestion}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setNewMilestoneText(suggestion);
                          setActiveSubTab("milestones");
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-cyan-400 rounded-lg cursor-pointer transition text-[10px] flex items-center space-x-1"
                        title="Add to Milestones"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Add</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: 14-DAY TIMELINE HISTORY */}
          {activeSubTab === "history" && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-white flex items-center space-x-1.5 uppercase">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>Last 14 Days Activity History</span>
              </h4>

              <div className="grid grid-cols-7 gap-2">
                {last14Days.map((d, i) => {
                  const hasActivity = d.value > 0;
                  return (
                    <div
                      key={i}
                      className={`h-16 rounded-xl p-2 flex flex-col justify-between border select-none transition-all ${
                        hasActivity
                          ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                          : "bg-[#06070B] border-white/5 text-slate-600"
                      }`}
                    >
                      <span className="text-[10px] font-bold uppercase">{d.label}</span>
                      <span className="text-xs font-bold">{hasActivity ? `+${d.value}` : "0"}</span>
                      <span className="text-[9px] text-slate-500 truncate">{d.date.slice(5)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Footer Actions */}
        <div className="p-4 border-t border-white/10 bg-[#06070B] flex items-center justify-between relative z-10 font-mono">
          <button
            onClick={() => {
              if (window.confirm(`Are you sure you want to remove "${endeavor.title}"?`)) {
                onDeleteEndeavor(endeavor.id);
                onClose();
              }
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl cursor-pointer active:scale-95 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Endeavor</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-bold rounded-xl cursor-pointer transition"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};
