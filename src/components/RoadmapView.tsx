import React, { useState } from "react";
import {
  Compass,
  Layers,
  CheckCircle2,
  Plus,
  Calendar,
  Flag,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  Target,
  Edit2,
  Trash2,
  Orbit,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import { Endeavor, MilestoneItem, UserProfile } from "../types";
import { THEME_ACCENTS } from "../lib/theme";

interface RoadmapViewProps {
  endeavors: Endeavor[];
  profile: UserProfile;
  onUpdateEndeavor: (endeavor: Endeavor) => void;
  onOpenCreate: () => void;
  onSelectEndeavorDetail: (endeavor: Endeavor) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  endeavors,
  profile,
  onUpdateEndeavor,
  onOpenCreate,
  onSelectEndeavorDetail,
}) => {
  const currentTheme = THEME_ACCENTS[profile.themeConfig?.accent] || THEME_ACCENTS.emerald;
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [newMilestoneText, setNewMilestoneText] = useState<Record<string, string>>({});

  // Filter milestone and meter projects
  const roadmapEndeavors = endeavors.filter(
    (e) => e.archetype === "milestone" || e.archetype === "meter"
  );

  const filtered = roadmapEndeavors.filter(
    (e) => selectedCategory === "all" || e.category === selectedCategory
  );

  const handleToggleMilestone = (endeavor: Endeavor, milestoneId: string) => {
    const updatedMilestones = endeavor.milestones.map((m) => {
      if (m.id === milestoneId) {
        const next = !m.completed;
        if (next) {
          confetti({ particleCount: 40, spread: 60 });
        }
        return {
          ...m,
          completed: next,
          completedAt: next ? new Date().toISOString() : undefined,
        };
      }
      return m;
    });

    const completedCount = updatedMilestones.filter((m) => m.completed).length;
    const progressPercent =
      updatedMilestones.length > 0
        ? Math.round((completedCount / updatedMilestones.length) * 100)
        : endeavor.currentValue;

    const updated: Endeavor = {
      ...endeavor,
      milestones: updatedMilestones,
      currentValue: endeavor.archetype === "milestone" ? progressPercent : endeavor.currentValue,
      updatedAt: new Date().toISOString(),
    };

    onUpdateEndeavor(updated);
  };

  const handleAddMilestone = (endeavor: Endeavor) => {
    const text = (newMilestoneText[endeavor.id] || "").trim();
    if (!text) return;

    const newMilestone: MilestoneItem = {
      id: "ms-" + Date.now(),
      title: text,
      completed: false,
    };

    const updatedMilestones = [...endeavor.milestones, newMilestone];
    const completedCount = updatedMilestones.filter((m) => m.completed).length;
    const progressPercent = Math.round((completedCount / updatedMilestones.length) * 100);

    const updated: Endeavor = {
      ...endeavor,
      milestones: updatedMilestones,
      currentValue: endeavor.archetype === "milestone" ? progressPercent : endeavor.currentValue,
      updatedAt: new Date().toISOString(),
    };

    onUpdateEndeavor(updated);
    setNewMilestoneText({ ...newMilestoneText, [endeavor.id]: "" });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner - Interstellar Horizon Deck */}
      <div className="relative bg-[#06070B]/90 md:bg-[#06070B]/75 backdrop-blur-3xl rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.12)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden">
        {/* Ambient Cosmic Mesh */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full blur-3xl opacity-20 bg-indigo-500/30" />
          <div className="absolute top-1/2 -right-20 w-56 h-56 rounded-full blur-3xl opacity-15 bg-cyan-500/25" />
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:18px_18px] opacity-25" />
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center space-x-2 text-indigo-400 mb-1 font-mono">
            <Flag className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              HORIZON TRAJECTORIES // SEC-05
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase">
            Milestone & Project Trajectory
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl font-normal">
            Track multi-phase goals, key deliverables, and quantifiable targets across your timeline.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={onOpenCreate}
          className={`relative z-10 flex items-center space-x-2 px-5 py-2.5 ${currentTheme.buttonBg} ${currentTheme.buttonHover} ${currentTheme.buttonText} rounded-xl text-xs sm:text-sm font-bold shadow-[0_0_25px_rgba(52,211,153,0.35)] transition cursor-pointer font-mono`}
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Trajectory</span>
        </motion.button>
      </div>

      {/* Category Pills */}
      <div className="bg-[#06070B]/85 backdrop-blur-2xl rounded-2xl p-3 border border-white/10 flex items-center space-x-1.5 overflow-x-auto scrollbar-none text-xs font-mono">
        {["all", "career", "creative", "learning", "finance", "health", "personal"].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl font-bold cursor-pointer active:scale-95 transition shrink-0 uppercase tracking-wider text-[10px] ${
              selectedCategory === cat
                ? "bg-white/15 text-white border border-white/20 shadow-xs"
                : "bg-white/[0.02] text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent"
            }`}
          >
            {cat === "all" ? "ALL SPHERES" : cat}
          </button>
        ))}
      </div>

      {/* Roadmap Cards Timeline */}
      {filtered.length === 0 ? (
        <div className="bg-[#06070B]/85 backdrop-blur-2xl p-12 rounded-[28px] border border-white/10 text-center space-y-3 shadow-[0_0_30px_rgba(0,0,0,0.6)]">
          <Layers className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white uppercase font-mono">
            No Roadmap Trajectories
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Create milestone-based projects or quantifiable meters to visualize roadmap checkpoints.
          </p>
          <button
            onClick={onOpenCreate}
            className={`px-4 py-2 ${currentTheme.buttonBg} ${currentTheme.buttonText} font-bold rounded-xl text-xs shadow-md transition cursor-pointer font-mono`}
          >
            + Create Milestone Project
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {filtered.map((endeavor) => {
            const endeavorColor = endeavor.color || "#6366f1";
            const percent =
              endeavor.archetype === "milestone"
                ? endeavor.currentValue
                : Math.min(
                    100,
                    Math.round(
                      ((endeavor.currentValue - endeavor.startValue) /
                        (endeavor.targetValue - endeavor.startValue || 1)) *
                        100
                    )
                  );

            const completedMilestonesCount = endeavor.milestones.filter((m) => m.completed).length;

            return (
              <motion.div
                key={endeavor.id}
                whileHover={{ y: -2 }}
                className="bg-[#06070B]/90 backdrop-blur-3xl rounded-[28px] p-6 sm:p-7 border border-white/10 hover:border-white/20 shadow-[0_0_40px_rgba(0,0,0,0.7)] transition-all space-y-5 relative overflow-hidden"
              >
                {/* Subtle ambient light */}
                <div
                  className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-15 pointer-events-none"
                  style={{ backgroundColor: endeavorColor }}
                />

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                  <div className="flex items-start space-x-3.5">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 text-white font-bold shadow-lg"
                      style={{
                        backgroundColor: endeavorColor,
                        boxShadow: `0 0 15px ${endeavorColor}60`,
                      }}
                    >
                      <Flag className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                          {endeavor.title}
                        </h3>
                        <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-white/5 text-slate-400 border border-white/10">
                          {endeavor.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 font-normal">
                        {endeavor.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 self-end sm:self-center">
                    <div className="text-right font-mono">
                      <div className="text-lg font-bold text-white">{percent}%</div>
                      <div className="text-[10px] text-slate-500 font-medium">
                        {endeavor.archetype === "milestone"
                          ? `${completedMilestonesCount} / ${endeavor.milestones.length} PHASES`
                          : `${endeavor.currentValue} / ${endeavor.targetValue} ${endeavor.unit}`}
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectEndeavorDetail(endeavor)}
                      className="p-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl border border-white/10 cursor-pointer active:scale-95 transition"
                      title="Edit / Inspect Project"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar Track */}
                <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5 relative z-10">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${percent}%`,
                      backgroundColor: endeavorColor,
                      boxShadow: `0 0 12px ${endeavorColor}80`,
                    }}
                  />
                </div>

                {/* Interactive Milestone Checkpoints */}
                <div className="space-y-2.5 pt-1 relative z-10">
                  <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                    PHASE CHECKPOINTS & MILESTONES
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {endeavor.milestones.map((milestone) => (
                      <div
                        key={milestone.id}
                        onClick={() => handleToggleMilestone(endeavor, milestone.id)}
                        className={`p-3 rounded-2xl border transition cursor-pointer flex items-center space-x-3 active:scale-[0.99] ${
                          milestone.completed
                            ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                            : "bg-white/[0.03] border-white/5 hover:border-white/15 text-slate-200"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-lg flex items-center justify-center transition shrink-0 ${
                            milestone.completed
                              ? "bg-emerald-400 text-black font-bold shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                              : "border border-white/20 text-transparent"
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                        <span
                          className={`text-xs font-medium truncate ${
                            milestone.completed ? "line-through opacity-75" : ""
                          }`}
                        >
                          {milestone.title}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Add New Milestone Inline Input */}
                  <div className="flex items-center space-x-2 pt-2">
                    <input
                      type="text"
                      placeholder="Add another trajectory phase checkpoint..."
                      value={newMilestoneText[endeavor.id] || ""}
                      onChange={(e) =>
                        setNewMilestoneText({
                          ...newMilestoneText,
                          [endeavor.id]: e.target.value,
                        })
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddMilestone(endeavor);
                      }}
                      className="flex-1 bg-[#06070B] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddMilestone(endeavor)}
                      className="px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 font-bold rounded-xl text-xs border border-indigo-500/30 cursor-pointer active:scale-95 transition font-mono"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
