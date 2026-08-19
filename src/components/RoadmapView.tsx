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
} from "lucide-react";
import { motion } from "motion/react";
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
    const progressPercent = updatedMilestones.length > 0
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
      {/* Header Banner */}
      <div className="bg-[#0D0D0D] rounded-3xl p-6 sm:p-8 border border-white/5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 mb-1">
            <Flag className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Project Horizons</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Milestone & Project Roadmap
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Track multi-phase goals, key deliverables, and quantifiable targets across your timeline.
          </p>
        </div>

        <button
          onClick={onOpenCreate}
          className={`flex items-center space-x-2 px-5 py-2.5 ${currentTheme.buttonBg} ${currentTheme.buttonHover} ${currentTheme.buttonText} rounded-xl text-xs sm:text-sm font-bold shadow-md transition cursor-pointer active:scale-95`}
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Project / Milestone</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="bg-[#0D0D0D] rounded-2xl p-4 border border-white/5 flex items-center space-x-1.5 overflow-x-auto scrollbar-none text-xs">
        {["all", "career", "creative", "learning", "finance", "health", "personal"].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl font-semibold cursor-pointer active:scale-95 transition-all shrink-0 capitalize ${
              selectedCategory === cat
                ? "bg-white/15 text-white shadow-xs"
                : "bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10"
            }`}
          >
            {cat === "all" ? "All Spheres" : cat}
          </button>
        ))}
      </div>

      {/* Roadmap Cards Timeline */}
      {filtered.length === 0 ? (
        <div className="bg-[#0D0D0D] p-12 rounded-3xl border border-white/5 text-center space-y-3">
          <Layers className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No Roadmap Endeavors</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Create milestone-based projects or quantifiable meters to visualize roadmap checkpoints.
          </p>
          <button
            onClick={onOpenCreate}
            className={`px-4 py-2 ${currentTheme.buttonBg} ${currentTheme.buttonText} font-bold rounded-xl text-xs shadow-md transition cursor-pointer`}
          >
            + Create Milestone Project
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {filtered.map((endeavor) => {
            const endeavorColor = endeavor.color || "#6366f1";
            const percent = endeavor.archetype === "milestone"
              ? endeavor.currentValue
              : Math.min(100, Math.round(((endeavor.currentValue - endeavor.startValue) / (endeavor.targetValue - endeavor.startValue || 1)) * 100));

            const completedMilestonesCount = endeavor.milestones.filter((m) => m.completed).length;

            return (
              <div
                key={endeavor.id}
                className="bg-[#0D0D0D] rounded-3xl p-6 sm:p-7 border border-white/5 hover:border-white/15 shadow-xl transition-all space-y-5"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start space-x-3.5">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 text-white font-bold shadow-md"
                      style={{ backgroundColor: endeavorColor }}
                    >
                      <Flag className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                          {endeavor.title}
                        </h3>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/5">
                          {endeavor.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{endeavor.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 self-end sm:self-center">
                    <div className="text-right">
                      <div className="text-lg font-black text-white font-mono">{percent}%</div>
                      <div className="text-[10px] text-slate-500 font-medium">
                        {endeavor.archetype === "milestone"
                          ? `${completedMilestonesCount} / ${endeavor.milestones.length} milestones`
                          : `${endeavor.currentValue} / ${endeavor.targetValue} ${endeavor.unit}`}
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectEndeavorDetail(endeavor)}
                      className="p-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl border border-white/5 cursor-pointer active:scale-95 transition"
                      title="Edit / Inspect Project"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar Track */}
                <div className="w-full h-3 bg-[#141414] rounded-full overflow-hidden p-0.5 border border-white/5">
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
                <div className="space-y-2.5 pt-1">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Phase Checkpoints & Milestones
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {endeavor.milestones.map((milestone) => (
                      <div
                        key={milestone.id}
                        onClick={() => handleToggleMilestone(endeavor, milestone.id)}
                        className={`p-3 rounded-2xl border transition cursor-pointer flex items-center space-x-3 active:scale-[0.99] ${
                          milestone.completed
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                            : "bg-[#141414] border-white/5 hover:border-white/15 text-slate-200"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-lg flex items-center justify-center transition shrink-0 ${
                            milestone.completed
                              ? "bg-emerald-500 text-black font-bold"
                              : "border border-white/20 text-transparent"
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                        <span
                          className={`text-xs font-medium truncate ${
                            milestone.completed ? "line-through opacity-80" : ""
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
                      placeholder="Add another phase checkpoint..."
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
                      className="flex-1 bg-[#141414] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddMilestone(endeavor)}
                      className="px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 font-bold rounded-xl text-xs border border-indigo-500/30 cursor-pointer active:scale-95 transition"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
