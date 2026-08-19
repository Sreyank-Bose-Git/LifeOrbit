import React, { useState, useEffect } from "react";
import { Search, Plus, Play, CheckCircle2, Sparkles, Calendar, BarChart3, Settings, X, Compass, Users } from "lucide-react";
import { Endeavor, ViewTab } from "../types";

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  endeavors: Endeavor[];
  onNavigateTab: (tab: ViewTab) => void;
  onOpenCreate: () => void;
  onStartFocus: (endeavor: Endeavor) => void;
  onQuickCheckIn: (endeavorId: string) => void;
  onOpenProfileHub?: () => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  endeavors,
  onNavigateTab,
  onOpenCreate,
  onStartFocus,
  onQuickCheckIn,
  onOpenProfileHub,
}) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open triggered from parent or global listener
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredEndeavors = endeavors.filter(
    (e) =>
      e.title.toLowerCase().includes(query.toLowerCase()) ||
      e.category.toLowerCase().includes(query.toLowerCase()) ||
      e.archetype.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="w-full max-w-xl bg-[#111111] border border-white/15 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Box */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/10">
          <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search goals, habits, meters..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 text-slate-500 hover:text-white rounded-lg cursor-pointer transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results / Navigation Commands */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-3">
          {/* Global App Actions */}
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase px-3 py-1 tracking-wider">
              Quick Actions
            </div>
            <div className="space-y-1">
              <button
                onClick={() => {
                  onClose();
                  onOpenCreate();
                }}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 rounded-xl cursor-pointer transition text-left"
              >
                <span className="flex items-center space-x-2.5">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Plus className="w-3.5 h-3.5" />
                  </div>
                  <span>Create New Goal or Habit</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">N</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onNavigateTab("copilot");
                }}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 rounded-xl cursor-pointer transition text-left"
              >
                <span className="flex items-center space-x-2.5">
                  <div className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <span>Ask AI Strategy Coach</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">AI</span>
              </button>

              {onOpenProfileHub && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenProfileHub();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 rounded-xl cursor-pointer transition text-left"
                >
                  <span className="flex items-center space-x-2.5">
                    <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                      <Users className="w-3.5 h-3.5" />
                    </div>
                    <span>Switch Profile / Workspace (Netflix Hub)</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">P</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Tab Jumps */}
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase px-3 py-1 tracking-wider">
              Switch Workspace View
            </div>
            <div className="grid grid-cols-2 gap-1">
              <button
                onClick={() => {
                  onClose();
                  onNavigateTab("tracker");
                }}
                className="flex items-center space-x-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-white/5 rounded-xl cursor-pointer transition"
              >
                <Compass className="w-4 h-4 text-emerald-400" />
                <span>Life Orbit Tracker</span>
              </button>
              <button
                onClick={() => {
                  onClose();
                  onNavigateTab("timeline");
                }}
                className="flex items-center space-x-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-white/5 rounded-xl cursor-pointer transition"
              >
                <Calendar className="w-4 h-4 text-blue-400" />
                <span>Timeline Schedule</span>
              </button>
              <button
                onClick={() => {
                  onClose();
                  onNavigateTab("focus");
                }}
                className="flex items-center space-x-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-white/5 rounded-xl cursor-pointer transition"
              >
                <Play className="w-4 h-4 text-amber-400" />
                <span>Focus Sprint Timer</span>
              </button>
              <button
                onClick={() => {
                  onClose();
                  onNavigateTab("insights");
                }}
                className="flex items-center space-x-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-white/5 rounded-xl cursor-pointer transition"
              >
                <BarChart3 className="w-4 h-4 text-purple-400" />
                <span>Analytics & Insights</span>
              </button>
            </div>
          </div>

          {/* Goals / Endeavors List */}
          {filteredEndeavors.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase px-3 py-1 tracking-wider">
                Endeavors ({filteredEndeavors.length})
              </div>
              <div className="space-y-1">
                {filteredEndeavors.slice(0, 6).map((endeavor) => (
                  <div
                    key={endeavor.id}
                    className="flex items-center justify-between px-3 py-2 hover:bg-white/5 rounded-xl transition group"
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: endeavor.color || "#10b981" }}
                      />
                      <div className="truncate">
                        <div className="text-xs font-semibold text-white truncate">{endeavor.title}</div>
                        <div className="text-[10px] text-slate-400 capitalize">
                          {endeavor.archetype} • {endeavor.category}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5 shrink-0">
                      <button
                        onClick={() => {
                          onQuickCheckIn(endeavor.id);
                          onClose();
                        }}
                        className="px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[11px] font-semibold rounded-lg cursor-pointer transition"
                        title="Fast Log Progress"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 inline mr-1" />
                        Log
                      </button>

                      <button
                        onClick={() => {
                          onStartFocus(endeavor);
                          onClose();
                        }}
                        className="px-2 py-1 bg-white/10 hover:bg-white/20 text-slate-200 text-[11px] font-semibold rounded-lg cursor-pointer transition"
                        title="Start Focus Timer"
                      >
                        <Play className="w-3 h-3 inline mr-1" />
                        Focus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Hint */}
        <div className="px-4 py-2 bg-black/40 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500">
          <span>Navigate with mouse or shortcuts</span>
          <span className="font-mono text-[10px] bg-white/5 px-1.5 py-0.5 rounded">ESC to dismiss</span>
        </div>
      </div>
    </div>
  );
};
