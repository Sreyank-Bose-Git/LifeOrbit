import React, { useState, useEffect } from "react";
import {
  Bot,
  Sparkles,
  Zap,
  ArrowRight,
  TrendingUp,
  Flame,
  CheckCircle2,
  Send,
  Loader2,
  RefreshCw,
  Clock,
  Compass,
  Cpu,
  Orbit,
  Radio,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Endeavor, AICoachFeedback } from "../types";

interface AICopilotViewProps {
  endeavors: Endeavor[];
  onStartFocus: (endeavor: Endeavor) => void;
  onNavigateToSchedule: () => void;
}

export const AICopilotView: React.FC<AICopilotViewProps> = ({
  endeavors,
  onStartFocus,
  onNavigateToSchedule,
}) => {
  const [feedback, setFeedback] = useState<AICoachFeedback | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userEnergy, setUserEnergy] = useState<"high" | "medium" | "low">("high");
  const [customQuestion, setCustomQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: "user" | "coach"; text: string }[]>([]);

  const fetchCoachAdvice = async (customPrompt?: string) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/ai/coach-advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endeavors: endeavors.filter((e) => e.status === "active"),
          userEnergy,
          question: customPrompt || "Analyze my current progress, streaks, and prioritize my day.",
        }),
      });

      if (!res.ok) throw new Error("Failed to get coaching advice");
      const data: AICoachFeedback = await res.json();
      setFeedback(data);

      if (customPrompt) {
        setChatHistory((prev) => [
          ...prev,
          { role: "user", text: customPrompt },
          {
            role: "coach",
            text: `${data.headline}\n\n${data.insights.join("\n• ")}\n\nAction: ${
              data.actionRecommendation
            }`,
          },
        ]);
      }
    } catch (err) {
      console.error("Coach error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoachAdvice();
  }, [userEnergy]);

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim() || isLoading) return;
    const q = customQuestion.trim();
    setCustomQuestion("");
    fetchCoachAdvice(q);
  };

  const topPriorityEndeavor = endeavors.find((e) => e.priority === "high") || endeavors[0];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner - Interstellar Neural AI Strategist */}
      <div className="relative bg-[#06070B]/90 md:bg-[#06070B]/75 backdrop-blur-3xl rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.12)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden">
        {/* Ambient Cosmic Mesh */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full blur-3xl opacity-20 bg-cyan-500/30" />
          <div className="absolute top-1/2 -right-20 w-56 h-56 rounded-full blur-3xl opacity-15 bg-emerald-500/25" />
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:18px_18px] opacity-25" />
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>

        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/25 px-3 py-1 rounded-full text-cyan-400 text-[10px] font-bold font-mono tracking-widest uppercase">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>NEURAL STRATEGIST // SEC-08</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white uppercase">
            Autonomous Co-Pilot & Coach
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg font-normal">
            Dynamic workload optimization, cognitive energy matching, and frictionless catch-up strategies.
          </p>
        </div>

        {/* Energy Filter Toggle */}
        <div className="relative z-10 bg-[#06070B] p-1.5 rounded-2xl border border-white/15 flex items-center space-x-1 text-xs font-mono">
          <span className="text-slate-500 px-2 font-bold text-[10px]">ENERGY:</span>
          <button
            onClick={() => setUserEnergy("high")}
            className={`px-3 py-1.5 rounded-xl font-bold transition text-xs ${
              userEnergy === "high"
                ? "bg-amber-400/20 text-amber-300 border border-amber-400/40 shadow-[0_0_10px_rgba(251,191,36,0.3)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            High ⚡
          </button>
          <button
            onClick={() => setUserEnergy("medium")}
            className={`px-3 py-1.5 rounded-xl font-bold transition text-xs ${
              userEnergy === "medium"
                ? "bg-cyan-400/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(34,211,238,0.3)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Medium 🌤️
          </button>
          <button
            onClick={() => setUserEnergy("low")}
            className={`px-3 py-1.5 rounded-xl font-bold transition text-xs ${
              userEnergy === "low"
                ? "bg-purple-400/20 text-purple-300 border border-purple-400/40 shadow-[0_0_10px_rgba(192,132,252,0.3)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Light 🌙
          </button>
        </div>
      </div>

      {/* Main Analysis Card */}
      <div className="relative bg-[#06070B]/90 md:bg-[#06070B]/75 backdrop-blur-3xl rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.7)] space-y-6 overflow-hidden">
        {/* Subtle top light */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

        <div className="flex items-center justify-between relative z-10 font-mono">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_10px_rgba(34,211,238,0.2)]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm uppercase">Real-Time Trajectory Analysis</h3>
              <p className="text-[10px] text-slate-400">
                Calibrated to your {endeavors.length} active orbital goals
              </p>
            </div>
          </div>

          <button
            onClick={() => fetchCoachAdvice()}
            disabled={isLoading}
            className="flex items-center space-x-1.5 text-[11px] text-cyan-300 hover:bg-white/5 px-3 py-1.5 rounded-xl border border-cyan-500/30 transition cursor-pointer active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Recalibrate</span>
          </button>
        </div>

        {isLoading && !feedback ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-3 font-mono">
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
            <p className="text-xs text-slate-400 font-medium">
              Synthesizing orbital velocity, milestones, and energy matrix...
            </p>
          </div>
        ) : feedback ? (
          <div className="space-y-6 relative z-10">
            {/* Headline Banner */}
            <div className="bg-[#06070B] border border-cyan-500/20 rounded-2xl p-5 shadow-[0_0_20px_rgba(34,211,238,0.05)]">
              <span className="text-[9px] uppercase font-mono font-bold text-cyan-400 tracking-widest">
                STRATEGIC FOCUS DIRECTIVE
              </span>
              <h4 className="text-base sm:text-lg font-bold text-white mt-1 leading-snug">
                "{feedback.headline}"
              </h4>
            </div>

            {/* Tactical Insights */}
            <div className="space-y-3">
              <h5 className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-widest">
                ACTIONABLE TACTICAL INSIGHTS
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {feedback.insights.map((insight, idx) => (
                  <div
                    key={idx}
                    className="bg-[#06070B] border border-white/10 rounded-2xl p-4 flex items-start space-x-3 hover:border-white/20 transition"
                  >
                    <div className="w-6 h-6 rounded-full bg-cyan-400 text-black font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-[0_0_8px_rgba(34,211,238,0.6)] font-mono">
                      {idx + 1}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-normal">{insight}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended High-Impact Action */}
            <div className="bg-[#06070B] border border-emerald-500/30 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-[0_0_25px_rgba(16,185,129,0.1)]">
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-mono font-bold text-amber-400 tracking-widest flex items-center space-x-1">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>IMMEDIATE ACTION STEP</span>
                </span>
                <p className="text-sm font-semibold text-white">{feedback.actionRecommendation}</p>
              </div>

              {topPriorityEndeavor && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => onStartFocus(topPriorityEndeavor)}
                  className="px-4 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-bold font-mono rounded-xl shadow-[0_0_15px_rgba(52,211,153,0.4)] transition flex items-center space-x-2 shrink-0 cursor-pointer"
                >
                  <span>Launch Deep Sprint</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </motion.button>
              )}
            </div>

            {/* Quote */}
            {feedback.motivationalQuote && (
              <p className="text-xs italic text-slate-400 text-center pt-2 font-mono">
                "{feedback.motivationalQuote}"
              </p>
            )}
          </div>
        ) : null}
      </div>

      {/* Interactive Coach Q&A */}
      <div className="bg-[#06070B]/90 backdrop-blur-3xl rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.7)] space-y-4">
        <h3 className="font-bold text-white text-base uppercase font-mono">
          Ask Your Autonomous Strategist
        </h3>
        <p className="text-xs text-slate-400 font-normal">
          Ask questions like "How do I catch up on my book reading target?" or "Suggest a weekend routine"
        </p>

        {/* Chat Stream if any */}
        {chatHistory.length > 0 && (
          <div className="space-y-3 max-h-64 overflow-y-auto p-3 bg-[#06070B] rounded-2xl border border-white/10 text-xs">
            {chatHistory.map((msg, i) => (
              <div
                key={i}
                className={`p-3.5 rounded-xl max-w-xl ${
                  msg.role === "user"
                    ? "bg-cyan-500/20 text-cyan-200 border border-cyan-500/30 font-semibold ml-auto"
                    : "bg-white/[0.04] text-slate-200 border border-white/10"
                }`}
              >
                <div className="font-bold mb-1 opacity-80 font-mono text-[10px] uppercase">
                  {msg.role === "user" ? "You" : "LifeOrbit Strategist"}
                </div>
                <div className="whitespace-pre-line leading-relaxed">{msg.text}</div>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleAskQuestion} className="flex gap-2">
          <input
            type="text"
            value={customQuestion}
            onChange={(e) => setCustomQuestion(e.target.value)}
            placeholder="Ask anything regarding your schedule, goals, or habit momentum..."
            className="flex-1 px-4 py-3 bg-[#06070B] border border-white/15 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 font-mono"
          />
          <button
            type="submit"
            disabled={isLoading || !customQuestion.trim()}
            className="px-5 py-3 bg-cyan-400 hover:bg-cyan-300 active:scale-95 text-black rounded-2xl font-bold font-mono text-xs flex items-center space-x-1.5 disabled:opacity-50 transition shadow-[0_0_15px_rgba(34,211,238,0.3)] cursor-pointer"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span className="hidden sm:inline">Ask</span>
          </button>
        </form>
      </div>
    </div>
  );
};
