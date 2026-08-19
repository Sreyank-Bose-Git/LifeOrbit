import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Plus,
  CheckCircle2,
  Circle,
  Sparkles,
  Bot,
  Loader2,
  Zap,
  Flame,
  Layers,
  Trash2,
  Sun,
} from "lucide-react";
import { TimeBlock, Endeavor } from "../types";
import confetti from "canvas-confetti";

interface TimelineViewProps {
  timeBlocks: TimeBlock[];
  endeavors: Endeavor[];
  onToggleTimeBlock: (id: string) => void;
  onAddTimeBlock: (block: Omit<TimeBlock, "id">) => void;
  onDeleteTimeBlock: (id: string) => void;
  onSetTimeBlocks: (blocks: TimeBlock[]) => void;
  onStartFocus: (endeavor: Endeavor) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  timeBlocks,
  endeavors,
  onToggleTimeBlock,
  onAddTimeBlock,
  onDeleteTimeBlock,
  onSetTimeBlocks,
  onStartFocus,
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [isAiScheduling, setIsAiScheduling] = useState(false);
  const [userEnergy, setUserEnergy] = useState<"high" | "medium" | "low">("high");
  const [showAddForm, setShowAddForm] = useState(false);

  // New Block Form
  const [title, setTitle] = useState("");
  const [endeavorId, setEndeavorId] = useState(endeavors[0]?.id || "");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [energyLevel, setEnergyLevel] = useState<"deep" | "medium" | "light">("deep");
  const [notes, setNotes] = useState("");

  const filteredBlocks = timeBlocks
    .filter((b) => b.date === selectedDate)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const handleAiAutoSchedule = async () => {
    setIsAiScheduling(true);
    try {
      const res = await fetch("/api/ai/smart-schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endeavors: endeavors.filter((e) => e.status === "active"),
          energyLevel: userEnergy,
          availableHours: 8,
        }),
      });

      if (!res.ok) throw new Error("Failed to auto-schedule");
      const data = await res.json();

      if (data.blocks && Array.isArray(data.blocks)) {
        const newBlocks: TimeBlock[] = data.blocks.map((b: any, idx: number) => ({
          id: `ai-block-${Date.now()}-${idx}`,
          endeavorId: b.endeavorId || endeavors[idx % endeavors.length]?.id,
          title: b.title,
          startTime: b.startTime || "09:00",
          endTime: b.endTime || "10:00",
          date: selectedDate,
          completed: false,
          energyLevel: b.energyLevel || "medium",
          notes: b.notes || "Optimized by LifeOrbit AI",
        }));

        onSetTimeBlocks([...timeBlocks.filter((b) => b.date !== selectedDate), ...newBlocks]);

        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 },
        });
      }
    } catch (err) {
      console.error("Schedule error:", err);
    } finally {
      setIsAiScheduling(false);
    }
  };

  const handleCreateBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTimeBlock({
      title: title.trim(),
      endeavorId: endeavorId || undefined,
      startTime,
      endTime,
      date: selectedDate,
      completed: false,
      energyLevel,
      notes: notes.trim(),
    });

    setTitle("");
    setShowAddForm(false);
  };

  const completedCount = filteredBlocks.filter((b) => b.completed).length;
  const progressPercent = filteredBlocks.length > 0 ? Math.round((completedCount / filteredBlocks.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-[#0D0D0D] rounded-3xl p-6 border border-white/5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 mb-1">
            <Calendar className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Visual Time Blocking</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Today's Daily Schedule</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Synchronize active endeavors into energy-aware, focused time blocks
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Energy selector */}
          <div className="flex items-center space-x-1 bg-white/5 p-1 rounded-xl text-xs font-semibold border border-white/5">
            <span className="text-slate-500 px-2 select-none">Energy:</span>
            <button
              onClick={() => setUserEnergy("high")}
              className={`px-2.5 py-1 rounded-lg cursor-pointer active:scale-95 transition-all duration-150 ${
                userEnergy === "high" ? "bg-amber-400/20 text-amber-300 border border-amber-400/30 font-bold" : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              High ⚡
            </button>
            <button
              onClick={() => setUserEnergy("medium")}
              className={`px-2.5 py-1 rounded-lg cursor-pointer active:scale-95 transition-all duration-150 ${
                userEnergy === "medium" ? "bg-blue-400/20 text-blue-300 border border-blue-400/30 font-bold" : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              Medium 🌤️
            </button>
            <button
              onClick={() => setUserEnergy("low")}
              className={`px-2.5 py-1 rounded-lg cursor-pointer active:scale-95 transition-all duration-150 ${
                userEnergy === "low" ? "bg-purple-400/20 text-purple-300 border border-purple-400/30 font-bold" : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              Light 🌙
            </button>
          </div>

          <button
            onClick={handleAiAutoSchedule}
            disabled={isAiScheduling}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-white/5 hover:bg-white/10 text-emerald-400 hover:text-emerald-300 border border-white/5 hover:border-emerald-500/30 rounded-xl text-xs font-bold cursor-pointer active:scale-95 transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isAiScheduling ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-emerald-400" />}
            <span>AI Auto-Plan Day</span>
          </button>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-black rounded-xl text-xs font-bold shadow-md hover:shadow-lg cursor-pointer transition-all duration-150"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Block</span>
          </button>
        </div>
      </div>

      {/* Progress Bar for the day */}
      {filteredBlocks.length > 0 && (
        <div className="bg-[#0D0D0D] rounded-2xl p-4 border border-white/5 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs">
              {progressPercent}%
            </div>
            <div>
              <span className="text-xs font-bold text-slate-200">
                Daily Completion: {completedCount} of {filteredBlocks.length} blocks checked
              </span>
              <p className="text-[11px] text-slate-500">Protecting your focus and momentum</p>
            </div>
          </div>

          <div className="flex-1 max-w-xs bg-white/5 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Add Block Form Drawer */}
      {showAddForm && (
        <form
          onSubmit={handleCreateBlock}
          className="bg-[#141414] rounded-3xl p-5 border border-white/10 shadow-2xl animate-in fade-in space-y-4"
        >
          <h3 className="font-bold text-white text-sm">Create New Focused Time Block</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Block Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Deep Work: AI MVP Coding"
                className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Associated Endeavor</label>
              <select
                value={endeavorId}
                onChange={(e) => setEndeavorId(e.target.value)}
                className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50"
              >
                <option value="">-- Standalone Task --</option>
                {endeavors.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.title} ({e.archetype})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Energy Intensity</label>
              <select
                value={energyLevel}
                onChange={(e) => setEnergyLevel(e.target.value as any)}
                className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50"
              >
                <option value="deep">Deep Work (High Intensity)</option>
                <option value="medium">Standard Execution</option>
                <option value="light">Light / Administrative</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">End Time</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/50"
              />
            </div>
            <div className="col-span-2 flex items-end space-x-2">
              <button
                type="submit"
                className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-xl shadow-xs transition"
              >
                Save Time Block
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-2 bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold rounded-xl transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Timeline List */}
      <div className="space-y-3">
        {filteredBlocks.length === 0 ? (
          <div className="bg-[#0D0D0D] rounded-3xl p-12 text-center border border-white/5">
            <Clock className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="font-bold text-slate-300 text-base">No time blocks scheduled for today</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              Block your calendar to align with your top endeavors and achieve effortless flow.
            </p>
            <button
              onClick={handleAiAutoSchedule}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl text-xs shadow-xs"
            >
              <Sparkles className="w-4 h-4" />
              <span>Let AI Plan My Day</span>
            </button>
          </div>
        ) : (
          filteredBlocks.map((block) => {
            const matchedEndeavor = endeavors.find((e) => e.id === block.endeavorId);

            return (
              <div
                key={block.id}
                className={`bg-[#141414] rounded-2xl p-4 border transition-all duration-150 flex items-center justify-between gap-3 ${
                  block.completed
                    ? "border-emerald-500/30 bg-emerald-500/5 opacity-75"
                    : block.energyLevel === "deep"
                    ? "border-amber-400/30 shadow-xs"
                    : "border-white/5 hover:border-white/15"
                }`}
              >
                {/* Left check & time */}
                <div className="flex items-center space-x-3.5">
                  <button
                    onClick={() => {
                      if (!block.completed) {
                        confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
                      }
                      onToggleTimeBlock(block.id);
                    }}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center cursor-pointer active:scale-90 hover:scale-105 transition-all duration-150 ${
                      block.completed
                        ? "bg-emerald-500 text-black font-bold shadow-xs"
                        : "border-2 border-slate-600 hover:border-emerald-400 bg-transparent"
                    }`}
                    title={block.completed ? "Mark as uncompleted" : "Check off block"}
                  >
                    {block.completed && <CheckCircle2 className="w-4 h-4 text-black stroke-[2.5]" />}
                  </button>

                  <div className="flex flex-col">
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md self-start border border-emerald-500/20 select-none">
                      {block.startTime} - {block.endTime}
                    </span>
                    <h4
                      className={`text-sm font-semibold mt-1 ${
                        block.completed ? "text-slate-500 line-through" : "text-white"
                      }`}
                    >
                      {block.title}
                    </h4>
                    {matchedEndeavor && (
                      <span className="text-[11px] text-slate-400 flex items-center space-x-1 mt-0.5">
                        <span
                          className="w-2 h-2 rounded-full inline-block"
                          style={{ backgroundColor: matchedEndeavor.color || "#10b981" }}
                        />
                        <span>{matchedEndeavor.title}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Energy badge & Actions */}
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md select-none ${
                      block.energyLevel === "deep"
                        ? "bg-amber-400/10 text-amber-400 border border-amber-400/20"
                        : block.energyLevel === "medium"
                        ? "bg-blue-400/10 text-blue-400 border border-blue-400/20"
                        : "bg-purple-400/10 text-purple-400 border border-purple-400/20"
                    }`}
                  >
                    {block.energyLevel === "deep" ? "Deep Focus" : block.energyLevel}
                  </span>

                  {matchedEndeavor && (
                    <button
                      onClick={() => onStartFocus(matchedEndeavor)}
                      className="hidden sm:inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg cursor-pointer active:scale-95 transition-all duration-150"
                      title="Launch Deep Focus Sprint"
                    >
                      <span>Focus</span>
                    </button>
                  )}

                  <button
                    onClick={() => onDeleteTimeBlock(block.id)}
                    className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg cursor-pointer active:scale-90 transition-all duration-150"
                    title="Remove Block"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
