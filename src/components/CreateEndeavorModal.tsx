import React, { useState } from "react";
import {
  X,
  Sparkles,
  Layers,
  Target,
  Flame,
  CheckCircle2,
  Plus,
  Trash2,
  Bot,
  Loader2,
  Calendar,
  Clock,
  Zap,
  Orbit,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Endeavor, EndeavorArchetype, Category, MilestoneItem } from "../types";

interface CreateEndeavorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    endeavor: Omit<
      Endeavor,
      "id" | "createdAt" | "updatedAt" | "history" | "streakCount" | "bestStreak"
    >
  ) => void;
}

const CATEGORIES: { id: Category; label: string }[] = [
  { id: "health", label: "Health & Fitness" },
  { id: "career", label: "Career & Tech" },
  { id: "learning", label: "Learning & Intellect" },
  { id: "finance", label: "Wealth & Finance" },
  { id: "creative", label: "Creative & Arts" },
  { id: "mindfulness", label: "Mindfulness & Zen" },
  { id: "personal", label: "Personal Growth" },
];

const ICONS = [
  "Target",
  "BookOpen",
  "Sparkles",
  "Cpu",
  "DollarSign",
  "Activity",
  "Flame",
  "Briefcase",
  "GraduationCap",
  "Heart",
  "Smile",
  "Zap",
  "Award",
];

const COLORS = [
  "#6366f1", // Indigo
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#ef4444", // Rose/Red
  "#8b5cf6", // Violet
  "#06b6d4", // Cyan
  "#ec4899", // Pink
  "#3b82f6", // Blue
];

export const CreateEndeavorModal: React.FC<CreateEndeavorModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [tab, setTab] = useState<"ai" | "manual">("ai");
  const [aiPrompt, setAiPrompt] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>("learning");
  const [archetype, setArchetype] = useState<EndeavorArchetype>("meter");
  const [targetValue, setTargetValue] = useState<number>(30);
  const [startValue, setStartValue] = useState<number>(0);
  const [currentValue, setCurrentValue] = useState<number>(0);
  const [unit, setUnit] = useState("units");
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "custom">("daily");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");
  const [color, setColor] = useState("#6366f1");
  const [icon, setIcon] = useState("Target");
  const [scheduledTime, setScheduledTime] = useState("08:00");
  const [milestones, setMilestones] = useState<MilestoneItem[]>([
    { id: "m1", title: "Initial Setup & Foundation", completed: false, weight: 25 },
    { id: "m2", title: "Execution Phase", completed: false, weight: 50 },
    { id: "m3", title: "Final Review & Completion", completed: false, weight: 25 },
  ]);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState("");

  if (!isOpen) return null;

  const handleAiParse = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);
    setAiError("");

    try {
      const res = await fetch("/api/ai/parse-endeavor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt }),
      });

      if (!res.ok) {
        throw new Error("Failed to parse prompt with AI");
      }

      const data = await res.json();
      setTitle(data.title || aiPrompt);
      setDescription(data.description || "");
      if (data.category) setCategory(data.category);
      if (data.archetype) setArchetype(data.archetype);
      if (data.targetValue !== undefined) setTargetValue(Number(data.targetValue));
      if (data.startValue !== undefined) setStartValue(Number(data.startValue));
      if (data.currentValue !== undefined) setCurrentValue(Number(data.currentValue));
      if (data.unit) setUnit(data.unit);
      if (data.frequency) setFrequency(data.frequency);
      if (data.milestones && Array.isArray(data.milestones)) {
        setMilestones(
          data.milestones.map((m: any, i: number) => ({
            id: `m-${Date.now()}-${i}`,
            title: m.title || `Milestone ${i + 1}`,
            completed: Boolean(m.completed),
            weight: m.weight || 25,
          }))
        );
      }

      // Switch to manual view to let user review and tweak
      setTab("manual");
    } catch {
      // Local client heuristic parser for static hosting (GitHub Pages)
      const lower = aiPrompt.toLowerCase();
      let arch: "habit" | "meter" | "milestone" = "habit";
      let cat: Category = "personal";
      let targetVal = 30;
      let startVal = 0;
      let unitStr = "days";

      if (
        lower.includes("$") ||
        lower.includes("save") ||
        lower.includes("invest") ||
        lower.includes("dollar") ||
        lower.includes("fund")
      ) {
        arch = "meter";
        cat = "finance";
        unitStr = "USD";
        const match = aiPrompt.match(/\d+[\d,]*/);
        targetVal = match ? parseInt(match[0].replace(/,/g, ""), 10) : 1000;
      } else if (
        lower.includes("read") ||
        lower.includes("book") ||
        lower.includes("page") ||
        lower.includes("learn") ||
        lower.includes("study")
      ) {
        arch = "meter";
        cat = "learning";
        unitStr = lower.includes("page") ? "pages" : "books";
        const match = aiPrompt.match(/\d+/);
        targetVal = match ? parseInt(match[0], 10) : 12;
      } else if (
        lower.includes("run") ||
        lower.includes("km") ||
        lower.includes("mile") ||
        lower.includes("gym") ||
        lower.includes("workout") ||
        lower.includes("pushup") ||
        lower.includes("weight")
      ) {
        arch = "meter";
        cat = "health";
        unitStr = lower.includes("km") ? "km" : lower.includes("mile") ? "miles" : "sessions";
        const match = aiPrompt.match(/\d+/);
        targetVal = match ? parseInt(match[0], 10) : 50;
      } else if (
        lower.includes("build") ||
        lower.includes("launch") ||
        lower.includes("saas") ||
        lower.includes("app") ||
        lower.includes("project")
      ) {
        arch = "milestone";
        cat = "career";
        unitStr = "%";
        targetVal = 100;
        setMilestones([
          { id: `m-${Date.now()}-1`, title: "Architecture & Research", completed: false, weight: 25 },
          { id: `m-${Date.now()}-2`, title: "Core Sprint Execution", completed: false, weight: 50 },
          { id: `m-${Date.now()}-3`, title: "Testing, Polish & Release", completed: false, weight: 25 },
        ]);
      }

      setTitle(aiPrompt.slice(0, 45));
      setDescription(`Structured target: ${aiPrompt}`);
      setArchetype(arch);
      setCategory(cat);
      setTargetValue(targetVal);
      setStartValue(startVal);
      setCurrentValue(startVal);
      setUnit(unitStr);
      setTab("manual");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleAddMilestone = () => {
    if (!newMilestoneTitle.trim()) return;
    setMilestones([
      ...milestones,
      {
        id: `m-${Date.now()}`,
        title: newMilestoneTitle.trim(),
        completed: false,
        weight: 20,
      },
    ]);
    setNewMilestoneTitle("");
  };

  const handleRemoveMilestone = (id: string) => {
    setMilestones(milestones.filter((m) => m.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      description: description.trim(),
      category,
      archetype,
      targetValue: Number(targetValue) || 1,
      startValue: Number(startValue) || 0,
      currentValue: Number(currentValue) || Number(startValue) || 0,
      unit:
        unit.trim() ||
        (archetype === "habit" ? "days" : archetype === "milestone" ? "%" : "units"),
      frequency,
      status: "active",
      priority,
      color,
      icon,
      scheduledTime,
      reminderEnabled: true,
      milestones: archetype === "milestone" ? milestones : [],
      difficulty: "medium",
      tags: [category, archetype],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-black/85 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-[#06070B]/95 backdrop-blur-3xl rounded-[32px] max-w-xl w-full border border-white/15 shadow-[0_0_80px_rgba(0,0,0,0.95)] overflow-hidden max-h-[92vh] flex flex-col text-slate-200 relative"
      >
        {/* Ambient Grid overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />

        {/* Header */}
        <div className="relative z-10 px-6 py-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02] font-mono">
          <div>
            <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-0.5 flex items-center space-x-1.5">
              <Orbit className="w-3.5 h-3.5" />
              <span>ORBIT PROTOCOL // INITIALIZATION</span>
            </div>
            <h2 className="text-lg font-bold text-white uppercase tracking-tight">
              Create New Orbit Endeavor
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-white/10 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="relative z-10 px-6 pt-3 pb-2 border-b border-white/10 bg-[#06070B] flex space-x-2 font-mono">
          <button
            type="button"
            onClick={() => setTab("ai")}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
              tab === "ai"
                ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Parser</span>
          </button>
          <button
            type="button"
            onClick={() => setTab("manual")}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
              tab === "manual"
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(52,211,153,0.2)]"
                : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200"
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>Manual Telemetry</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="relative z-10 p-6 overflow-y-auto flex-1 font-mono">
          {tab === "ai" ? (
            <div className="space-y-4">
              <div className="bg-[#06070B] border border-white/10 rounded-2xl p-4 text-xs text-slate-300 space-y-2 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                <div className="flex items-center space-x-2 font-bold text-cyan-400 uppercase">
                  <Bot className="w-4 h-4 text-cyan-400" />
                  <span>Natural Language Mission Specifier</span>
                </div>
                <p className="text-slate-400 leading-relaxed font-sans text-xs">
                  Describe what you want to achieve or track. LifeOrbit OS will automatically classify
                  the archetype (Target Meter, Daily Habit, or Milestone Project) and generate telemetry steps.
                </p>
                <div className="pt-1 flex flex-wrap gap-1.5 font-mono">
                  <button
                    type="button"
                    onClick={() =>
                      setAiPrompt("Read 30 pages of non-fiction books every day before bed")
                    }
                    className="text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition cursor-pointer"
                  >
                    "Read 30 pages daily"
                  </button>
                  <button
                    type="button"
                    onClick={() => setAiPrompt("Save $10,000 for emergency fund in 10 months")}
                    className="text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition cursor-pointer"
                  >
                    "Save $10,000 for fund"
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setAiPrompt("Build and launch my full-stack web application in 5 phases")
                    }
                    className="text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition cursor-pointer"
                  >
                    "Launch web app in 5 phases"
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Your Activity / Endeavor Goal
                </label>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g., I want to run 150 km this summer starting from 10km, tracking my runs 3 times a week at 7:00 AM..."
                  rows={4}
                  className="w-full px-3.5 py-2.5 bg-[#06070B] border border-white/15 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition font-sans"
                />
              </div>

              {aiError && <p className="text-xs text-rose-400">{aiError}</p>}

              <button
                type="button"
                onClick={handleAiParse}
                disabled={isAiLoading || !aiPrompt.trim()}
                className="w-full flex items-center justify-center space-x-2 py-3 bg-cyan-400 hover:bg-cyan-300 active:scale-98 text-black rounded-xl font-bold text-xs uppercase shadow-[0_0_20px_rgba(34,211,238,0.3)] transition disabled:opacity-50 cursor-pointer"
              >
                {isAiLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing Flight Trajectory...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Auto-Generate Flight Plan</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title & Description */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Endeavor Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Master Rust, Daily 5km Run, Launch SaaS"
                  className="w-full px-3.5 py-2 bg-[#06070B] border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500/50 font-sans"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Description / Purpose
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Why is this orbit meaningful to you?"
                  className="w-full px-3.5 py-2 bg-[#06070B] border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500/50 font-sans"
                />
              </div>

              {/* Archetype Selector */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Endeavor Archetype
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "meter", label: "Progress Meter", desc: "Quantifiable units" },
                    { id: "habit", label: "Daily Habit", desc: "Streak check-ins" },
                    { id: "milestone", label: "Milestone", desc: "Step-by-step phases" },
                  ].map((arch) => (
                    <button
                      key={arch.id}
                      type="button"
                      onClick={() => setArchetype(arch.id as EndeavorArchetype)}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                        archetype === arch.id
                          ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-[0_0_10px_rgba(52,211,153,0.2)]"
                          : "bg-white/[0.02] border-white/10 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <div className="text-xs font-bold text-white uppercase">{arch.label}</div>
                      <div className="text-[9px] text-slate-500 leading-tight">{arch.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Archetype Config Fields */}
              {archetype === "meter" && (
                <div className="grid grid-cols-3 gap-2 bg-[#06070B] p-3 rounded-2xl border border-white/10">
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 mb-1 uppercase">
                      Target
                    </label>
                    <input
                      type="number"
                      value={targetValue}
                      onChange={(e) => setTargetValue(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 bg-black/60 border border-white/15 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 mb-1 uppercase">
                      Current
                    </label>
                    <input
                      type="number"
                      value={currentValue}
                      onChange={(e) => setCurrentValue(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 bg-black/60 border border-white/15 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 mb-1 uppercase">
                      Unit
                    </label>
                    <input
                      type="text"
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      placeholder="e.g. books, USD, km"
                      className="w-full px-2.5 py-1.5 bg-black/60 border border-white/15 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500/50 font-sans"
                    />
                  </div>
                </div>
              )}

              {archetype === "habit" && (
                <div className="grid grid-cols-2 gap-2 bg-[#06070B] p-3 rounded-2xl border border-white/10">
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 mb-1 uppercase">
                      Streak Goal (Days)
                    </label>
                    <input
                      type="number"
                      value={targetValue}
                      onChange={(e) => setTargetValue(Number(e.target.value))}
                      placeholder="30"
                      className="w-full px-2.5 py-1.5 bg-black/60 border border-white/15 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 mb-1 uppercase">
                      Frequency
                    </label>
                    <select
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 bg-black/60 border border-white/15 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500/50"
                    >
                      <option value="daily">Every Day</option>
                      <option value="weekly">Weekly Target</option>
                      <option value="custom">Custom Schedule</option>
                    </select>
                  </div>
                </div>
              )}

              {archetype === "milestone" && (
                <div className="space-y-2 bg-[#06070B] p-3 rounded-2xl border border-white/10">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">
                    Project Milestone Phases
                  </label>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {milestones.map((m) => (
                      <div
                        key={m.id}
                        className="flex items-center justify-between bg-white/[0.02] px-2.5 py-1.5 rounded-lg border border-white/10 text-xs"
                      >
                        <span className="font-medium text-slate-200 font-sans">{m.title}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveMilestone(m.id)}
                          className="text-slate-500 hover:text-red-400 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex space-x-1.5 pt-1">
                    <input
                      type="text"
                      value={newMilestoneTitle}
                      onChange={(e) => setNewMilestoneTitle(e.target.value)}
                      placeholder="Add another phase..."
                      className="flex-1 px-2.5 py-1.5 bg-black/60 border border-white/15 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 font-sans"
                    />
                    <button
                      type="button"
                      onClick={handleAddMilestone}
                      className="px-3 py-1.5 bg-emerald-400 hover:bg-emerald-300 text-black rounded-lg text-xs font-bold cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}

              {/* Category and Scheduled Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">
                    Life Sphere
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full px-3 py-2 bg-[#06070B] border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/50"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">
                    Scheduled Time
                  </label>
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full px-3 py-2 bg-[#06070B] border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/50"
                  >
                  </input>
                </div>
              </div>

              {/* Color & Icon picker */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">
                    Beacon Color
                  </label>
                  <div className="flex space-x-1.5">
                    {COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setColor(c)}
                        className={`w-5 h-5 rounded-full transition cursor-pointer ${
                          color === c
                            ? "ring-2 ring-offset-2 ring-offset-[#06070B] ring-emerald-400 scale-110 relative z-10"
                            : "relative z-0"
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">
                    Icon Symbol
                  </label>
                  <select
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#06070B] border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/50"
                  >
                    {ICONS.map((ic) => (
                      <option key={ic} value={ic}>
                        {ic}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-400 hover:bg-emerald-300 active:scale-98 text-black rounded-xl font-bold text-xs uppercase shadow-[0_0_20px_rgba(52,211,153,0.35)] transition cursor-pointer"
                >
                  Initiate Orbit Telemetry
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};
