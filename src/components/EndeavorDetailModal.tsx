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
} from "lucide-react";
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
  const [activeSubTab, setActiveSubTab] = useState<"overview" | "milestones" | "ai" | "history">("overview");

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
      nextVal = nextMilestones.length > 0 ? Math.round((completedCount / nextMilestones.length) * 100) : 0;
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
      ((endeavor.currentValue - endeavor.startValue) / (endeavor.targetValue - endeavor.startValue || 1)) * 100
    )
  );

  return (
    <div className="fixed inset-0 z-[65] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-[#0F0F0F] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-6 border-b border-white/5 bg-[#141414] flex items-start justify-between">
          <div className="flex items-start space-x-3.5">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md"
              style={{ backgroundColor: endeavor.color || "#10b981" }}
            >
              <Target className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white/10 text-slate-300">
                  {endeavor.archetype}
                </span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white/10 text-slate-300">
                  {endeavor.category}
                </span>
                {endeavor.streakCount > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center space-x-1">
                    <Flame className="w-3 h-3 text-amber-400" />
                    <span>{endeavor.streakCount} Day Streak</span>
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold text-white mt-1">{endeavor.title}</h2>
              {endeavor.description && (
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{endeavor.description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => onStartFocus(endeavor)}
              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer active:scale-95 transition shadow-sm"
              title="Launch Focus Session"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              <span>Sprint</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl cursor-pointer active:scale-90 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center px-6 pt-3 border-b border-white/5 bg-[#111111] space-x-4 text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab("overview")}
            className={`pb-2.5 cursor-pointer transition border-b-2 ${
              activeSubTab === "overview"
                ? "text-emerald-400 border-emerald-400 font-bold"
                : "text-slate-400 border-transparent hover:text-slate-200"
            }`}
          >
            Overview & Log
          </button>
          <button
            onClick={() => setActiveSubTab("milestones")}
            className={`pb-2.5 cursor-pointer transition border-b-2 ${
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
            className={`pb-2.5 cursor-pointer transition border-b-2 flex items-center space-x-1 ${
              activeSubTab === "ai"
                ? "text-purple-400 border-purple-400 font-bold"
                : "text-slate-400 border-transparent hover:text-slate-200"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>AI Strategy</span>
          </button>
          <button
            onClick={() => setActiveSubTab("history")}
            className={`pb-2.5 cursor-pointer transition border-b-2 ${
              activeSubTab === "history"
                ? "text-emerald-400 border-emerald-400 font-bold"
                : "text-slate-400 border-transparent hover:text-slate-200"
            }`}
          >
            14-Day Timeline
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: OVERVIEW & QUICK MANUAL LOG */}
          {activeSubTab === "overview" && (
            <div className="space-y-6">
              {/* Progress Summary Card */}
              <div className="bg-[#141414] rounded-2xl p-4 border border-white/5 space-y-3">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-slate-400">Total Accumulated Progress</span>
                  <span className="text-emerald-400 font-bold text-sm">
                    {endeavor.currentValue} / {endeavor.targetValue} {endeavor.unit} ({progressPercent}%)
                  </span>
                </div>
                <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Start: {endeavor.startValue} {endeavor.unit}</span>
                  <span>Goal: {endeavor.targetValue} {endeavor.unit}</span>
                </div>
              </div>

              {/* Fast Progress Logger Form */}
              <form onSubmit={handleManualLog} className="bg-[#141414] rounded-2xl p-4 border border-white/5 space-y-3">
                <h4 className="text-xs font-bold text-white flex items-center space-x-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>Log Activity Entry</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      {endeavor.archetype === "habit" ? "Days/Check-in" : `Amount (${endeavor.unit})`}
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={logValueInput}
                      onChange={(e) => setLogValueInput(e.target.value)}
                      className="w-full px-3 py-2 bg-[#0A0A0A] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/50"
                      placeholder="1"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] text-slate-400 mb-1">Quick Note / Reflection</label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={logNoteInput}
                        onChange={(e) => setLogNoteInput(e.target.value)}
                        placeholder="e.g. Read chapter 4, completed morning run..."
                        className="flex-1 px-3 py-2 bg-[#0A0A0A] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/50"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-black font-bold text-xs rounded-xl cursor-pointer transition shadow-xs shrink-0"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </form>

              {/* Stats Highlights Grid */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-[#141414] p-3 rounded-2xl border border-white/5">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">Current Streak</span>
                  <div className="text-xl font-bold text-amber-400 mt-0.5">{endeavor.streakCount}d</div>
                </div>
                <div className="bg-[#141414] p-3 rounded-2xl border border-white/5">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">Best Streak</span>
                  <div className="text-xl font-bold text-slate-200 mt-0.5">{endeavor.bestStreak || endeavor.streakCount}d</div>
                </div>
                <div className="bg-[#141414] p-3 rounded-2xl border border-white/5">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">Frequency</span>
                  <div className="text-xl font-bold text-emerald-400 capitalize mt-0.5">{endeavor.frequency}</div>
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
                  className="flex-1 px-3 py-2.5 bg-[#141414] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-black font-bold text-xs rounded-xl cursor-pointer transition shadow-xs flex items-center space-x-1 shrink-0"
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
                      className={`p-3 rounded-xl border flex items-center justify-between transition-all duration-150 ${
                        m.completed
                          ? "bg-emerald-500/5 border-emerald-500/20 text-slate-400"
                          : "bg-[#141414] border-white/5 text-white hover:border-white/15"
                      }`}
                    >
                      <button
                        onClick={() => handleToggleMilestone(m.id)}
                        className="flex items-center space-x-3 text-left flex-1 cursor-pointer"
                      >
                        <div
                          className={`w-5 h-5 rounded-lg flex items-center justify-center transition-all ${
                            m.completed
                              ? "bg-emerald-500 text-black font-bold"
                              : "border-2 border-slate-600 hover:border-emerald-400"
                          }`}
                        >
                          {m.completed && <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />}
                        </div>
                        <span className={`text-xs font-semibold ${m.completed ? "line-through text-slate-500" : "text-slate-200"}`}>
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
                  <div className="p-8 text-center text-slate-500 text-xs bg-[#141414] rounded-2xl border border-white/5">
                    No milestones configured yet. Add your first step above!
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: AI STRATEGY & ATOMIC HABITS */}
          {activeSubTab === "ai" && (
            <div className="space-y-4">
              <div className="bg-purple-950/20 border border-purple-500/30 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-purple-300">AI Micro-Habit Strategy</h4>
                    <p className="text-[11px] text-purple-400/80">Tailored 2-minute actionable execution tactics</p>
                  </div>
                </div>

                <button
                  onClick={handleGenerateAiMicroHabits}
                  disabled={isGeneratingAiTips}
                  className="px-3 py-1.5 bg-purple-500 hover:bg-purple-400 active:scale-95 text-black text-xs font-bold rounded-xl cursor-pointer transition disabled:opacity-50 flex items-center space-x-1"
                >
                  {isGeneratingAiTips ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  <span>Regenerate</span>
                </button>
              </div>

              {isGeneratingAiTips ? (
                <div className="p-10 flex flex-col items-center justify-center space-y-2">
                  <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
                  <span className="text-xs text-slate-400">Synthesizing behavioral momentum blueprint...</span>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {aiSuggestions.map((suggestion, idx) => (
                    <div
                      key={idx}
                      className="bg-[#141414] border border-white/5 hover:border-purple-500/30 p-3.5 rounded-2xl flex items-start space-x-3 transition group"
                    >
                      <div className="w-6 h-6 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-slate-200 leading-relaxed">{suggestion}</p>
                      </div>
                      <button
                        onClick={() => {
                          setNewMilestoneText(suggestion);
                          setActiveSubTab("milestones");
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-purple-400 rounded-lg cursor-pointer transition text-[11px] flex items-center space-x-1"
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
              <h4 className="text-xs font-bold text-white flex items-center space-x-1.5">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>Last 14 Days Activity</span>
              </h4>

              <div className="grid grid-cols-7 gap-2">
                {last14Days.map((d, i) => {
                  const hasActivity = d.value > 0;
                  return (
                    <div
                      key={i}
                      className={`h-16 rounded-xl p-2 flex flex-col justify-between border select-none transition-all duration-150 ${
                        hasActivity
                          ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                          : "bg-[#141414] border-white/5 text-slate-600"
                      }`}
                    >
                      <span className="text-[10px] font-bold uppercase">{d.label}</span>
                      <span className="text-xs font-mono font-bold">
                        {hasActivity ? `+${d.value}` : "0"}
                      </span>
                      <span className="text-[9px] text-slate-500 truncate">{d.date.slice(5)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Footer Actions */}
        <div className="p-4 border-t border-white/5 bg-[#111111] flex items-center justify-between">
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
            className="px-4 py-2 bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-semibold rounded-xl cursor-pointer transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
