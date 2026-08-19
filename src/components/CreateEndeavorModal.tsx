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
} from "lucide-react";
import { Endeavor, EndeavorArchetype, Category, MilestoneItem } from "../types";

interface CreateEndeavorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (endeavor: Omit<Endeavor, "id" | "createdAt" | "updatedAt" | "history" | "streakCount" | "bestStreak">) => void;
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
    } catch (err: any) {
      setAiError(err.message || "Could not analyze prompt. You can enter details manually.");
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
      unit: unit.trim() || (archetype === "habit" ? "days" : archetype === "milestone" ? "%" : "units"),
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
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#141414] rounded-3xl max-w-xl w-full border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col text-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-[#0D0D0D]">
          <div>
            <h2 className="text-lg font-bold text-white">Add New Endeavor</h2>
            <p className="text-xs text-slate-400">Track any habit, quantifiable metric, or project roadmap</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-slate-200 hover:bg-white/5 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-3 pb-2 border-b border-white/5 bg-[#141414] flex space-x-2">
          <button
            type="button"
            onClick={() => setTab("ai")}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-xl text-xs font-semibold transition ${
              tab === "ai"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-xs"
                : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200"
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>AI Natural Language Parser</span>
          </button>
          <button
            type="button"
            onClick={() => setTab("manual")}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-xl text-xs font-semibold transition ${
              tab === "manual"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-xs"
                : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200"
            }`}
          >
            <Layers className="w-4 h-4 text-slate-400" />
            <span>Detailed Custom Setup</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {tab === "ai" ? (
            <div className="space-y-4">
              <div className="bg-[#0D0D0D] border border-white/5 rounded-2xl p-4 text-xs text-slate-300 space-y-2">
                <div className="flex items-center space-x-2 font-semibold text-emerald-400">
                  <Bot className="w-4 h-4 text-emerald-400" />
                  <span>Just describe what you want to achieve or track</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Our AI automatically detects whether your endeavor is a <strong className="text-white">Quantifiable Target</strong> (e.g. Save $5,000, Read 20 books), a <strong className="text-white">Daily Habit</strong> (e.g. 15min meditation, no junk food), or a <strong className="text-white">Milestone Project</strong> (e.g. Launch a SaaS app, Pass AWS Certification).
                </p>
                <div className="pt-1 flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setAiPrompt("Read 30 pages of non-fiction books every day before bed")}
                    className="text-[11px] bg-white/5 border border-white/5 px-2 py-1 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition"
                  >
                    "Read 30 pages daily"
                  </button>
                  <button
                    type="button"
                    onClick={() => setAiPrompt("Save $10,000 for emergency fund in 10 months")}
                    className="text-[11px] bg-white/5 border border-white/5 px-2 py-1 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition"
                  >
                    "Save $10,000 for fund"
                  </button>
                  <button
                    type="button"
                    onClick={() => setAiPrompt("Build and launch my full-stack web application in 5 phases")}
                    className="text-[11px] bg-white/5 border border-white/5 px-2 py-1 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition"
                  >
                    "Launch web app in 5 phases"
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Your Activity / Endeavor Goal
                </label>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g., I want to run 150 km this summer starting from 10km, tracking my runs 3 times a week at 7:00 AM..."
                  rows={4}
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition"
                />
              </div>

              {aiError && <p className="text-xs text-rose-400">{aiError}</p>}

              <button
                type="button"
                onClick={handleAiParse}
                disabled={isAiLoading || !aiPrompt.trim()}
                className="w-full flex items-center justify-center space-x-2 py-3 bg-emerald-500 hover:bg-emerald-400 active:scale-98 text-black rounded-xl font-bold text-sm shadow-xs transition disabled:opacity-50"
              >
                {isAiLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing & Designing Roadmap...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Auto-Generate Plan & Configure</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title & Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Read 24 Books This Year"
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Why is this important to you?"
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              {/* Archetype Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Activity Archetype
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setArchetype("meter");
                      setUnit("units");
                    }}
                    className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition ${
                      archetype === "meter"
                        ? "border-emerald-500/50 bg-emerald-500/10 text-white font-semibold"
                        : "border-white/5 bg-black/30 text-slate-400 hover:bg-white/5 hover:text-slate-200"
                    }`}
                  >
                    <Target className="w-4 h-4 text-emerald-400 mb-1" />
                    <span className="text-xs font-bold">Meter</span>
                    <span className="text-[10px] text-slate-500 font-normal">Quantifiable numbers</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setArchetype("habit");
                      setUnit("days");
                    }}
                    className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition ${
                      archetype === "habit"
                        ? "border-amber-500/50 bg-amber-500/10 text-white font-semibold"
                        : "border-white/5 bg-black/30 text-slate-400 hover:bg-white/5 hover:text-slate-200"
                    }`}
                  >
                    <Flame className="w-4 h-4 text-amber-400 mb-1" />
                    <span className="text-xs font-bold">Habit</span>
                    <span className="text-[10px] text-slate-500 font-normal">Daily/weekly streak</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setArchetype("milestone");
                      setUnit("%");
                    }}
                    className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition ${
                      archetype === "milestone"
                        ? "border-blue-500/50 bg-blue-500/10 text-white font-semibold"
                        : "border-white/5 bg-black/30 text-slate-400 hover:bg-white/5 hover:text-slate-200"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-blue-400 mb-1" />
                    <span className="text-xs font-bold">Project</span>
                    <span className="text-[10px] text-slate-500 font-normal">Multi-stage roadmap</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Archetype Metrics */}
              {archetype === "meter" && (
                <div className="grid grid-cols-3 gap-2 bg-black/40 p-3 rounded-2xl border border-white/5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Target</label>
                    <input
                      type="number"
                      required
                      value={targetValue}
                      onChange={(e) => setTargetValue(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 bg-[#141414] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Current</label>
                    <input
                      type="number"
                      value={currentValue}
                      onChange={(e) => setCurrentValue(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 bg-[#141414] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Unit</label>
                    <input
                      type="text"
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      placeholder="e.g. books, USD, km"
                      className="w-full px-2.5 py-1.5 bg-[#141414] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>
                </div>
              )}

              {archetype === "habit" && (
                <div className="grid grid-cols-2 gap-2 bg-black/40 p-3 rounded-2xl border border-white/5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Streak Goal (Days)</label>
                    <input
                      type="number"
                      value={targetValue}
                      onChange={(e) => setTargetValue(Number(e.target.value))}
                      placeholder="30"
                      className="w-full px-2.5 py-1.5 bg-[#141414] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Frequency</label>
                    <select
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 bg-[#141414] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500/50"
                    >
                      <option value="daily">Every Day</option>
                      <option value="weekly">Weekly Target</option>
                      <option value="custom">Custom Schedule</option>
                    </select>
                  </div>
                </div>
              )}

              {archetype === "milestone" && (
                <div className="space-y-2 bg-black/40 p-3 rounded-2xl border border-white/5">
                  <label className="block text-xs font-semibold text-slate-400">Project Milestone Phases</label>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {milestones.map((m) => (
                      <div key={m.id} className="flex items-center justify-between bg-[#141414] px-2.5 py-1.5 rounded-lg border border-white/5 text-xs">
                        <span className="font-medium text-slate-200">{m.title}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveMilestone(m.id)}
                          className="text-slate-500 hover:text-red-400"
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
                      className="flex-1 px-2.5 py-1.5 bg-[#141414] border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
                    />
                    <button
                      type="button"
                      onClick={handleAddMilestone}
                      className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black rounded-lg text-xs font-bold"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}

              {/* Category and Scheduled Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Life Sphere</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500/50"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Scheduled Time</label>
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
              </div>

              {/* Color & Icon picker */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Theme Color</label>
                  <div className="flex space-x-1.5">
                    {COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setColor(c)}
                        className={`w-6 h-6 rounded-full transition ${color === c ? "ring-2 ring-offset-2 ring-offset-[#141414] ring-emerald-400 scale-110" : ""}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Icon Symbol</label>
                  <select
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/50"
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
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 active:scale-98 text-black rounded-xl font-bold text-sm shadow-xs transition"
                >
                  Create & Start Tracking
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
