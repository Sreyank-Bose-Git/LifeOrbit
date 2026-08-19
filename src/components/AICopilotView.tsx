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
} from "lucide-react";
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
            text: `${data.headline}\n\n${data.insights.join("\n• ")}\n\nAction: ${data.actionRecommendation}`,
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
      {/* Top Banner */}
      <div className="bg-[#0D0D0D] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-white/5">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-emerald-400 text-xs font-semibold">
              <Bot className="w-3.5 h-3.5 text-emerald-400" />
              <span>AI Performance Strategist</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Autonomous Co-Pilot & Coach
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg">
              Dynamic workload optimization, cognitive energy matching, and frictionless catch-up strategies.
            </p>
          </div>

          {/* Energy Filter Toggle */}
          <div className="bg-[#141414] p-1.5 rounded-2xl border border-white/10 flex items-center space-x-1 text-xs">
            <span className="text-slate-400 px-2 font-medium">My Energy:</span>
            <button
              onClick={() => setUserEnergy("high")}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                userEnergy === "high" ? "bg-amber-400 text-black shadow-xs" : "text-slate-400 hover:text-white"
              }`}
            >
              High ⚡
            </button>
            <button
              onClick={() => setUserEnergy("medium")}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                userEnergy === "medium" ? "bg-blue-400 text-black shadow-xs" : "text-slate-400 hover:text-white"
              }`}
            >
              Medium 🌤️
            </button>
            <button
              onClick={() => setUserEnergy("low")}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                userEnergy === "low" ? "bg-purple-400 text-black shadow-xs" : "text-slate-400 hover:text-white"
              }`}
            >
              Light 🌙
            </button>
          </div>
        </div>
      </div>

      {/* Main Analysis Card */}
      <div className="bg-[#0D0D0D] rounded-3xl p-6 sm:p-8 border border-white/5 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Real-Time Performance Analysis</h3>
              <p className="text-xs text-slate-400">Tailored to your {endeavors.length} active goals</p>
            </div>
          </div>

          <button
            onClick={() => fetchCoachAdvice()}
            disabled={isLoading}
            className="flex items-center space-x-1.5 text-xs text-emerald-400 hover:bg-white/5 px-3 py-1.5 rounded-xl border border-emerald-500/20 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Recalibrate</span>
          </button>
        </div>

        {isLoading && !feedback ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
            <p className="text-xs text-slate-400 font-medium">Synthesizing velocity, milestones, and energy levels...</p>
          </div>
        ) : feedback ? (
          <div className="space-y-6">
            {/* Headline Banner */}
            <div className="bg-[#141414] border border-white/5 rounded-2xl p-5">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                Strategic Focus for Today
              </span>
              <h4 className="text-lg font-bold text-white mt-1 leading-snug">
                "{feedback.headline}"
              </h4>
            </div>

            {/* Tactical Insights */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Actionable Tactical Insights</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {feedback.insights.map((insight, idx) => (
                  <div key={idx} className="bg-[#141414] border border-white/5 rounded-2xl p-4 flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-black font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">{insight}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended High-Impact Action */}
            <div className="bg-[#141414] border border-emerald-500/20 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider flex items-center space-x-1">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Immediate Action Step</span>
                </span>
                <p className="text-sm font-semibold text-white">{feedback.actionRecommendation}</p>
              </div>

              {topPriorityEndeavor && (
                <button
                  onClick={() => onStartFocus(topPriorityEndeavor)}
                  className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-black text-xs font-bold rounded-xl shadow-xs transition flex items-center space-x-2 shrink-0"
                >
                  <span>Launch Deep Sprint</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              )}
            </div>

            {/* Quote */}
            {feedback.motivationalQuote && (
              <p className="text-xs italic text-slate-400 text-center pt-2">
                "{feedback.motivationalQuote}"
              </p>
            )}
          </div>
        ) : null}
      </div>

      {/* Interactive Coach Q&A */}
      <div className="bg-[#0D0D0D] rounded-3xl p-6 sm:p-8 border border-white/5 shadow-xs space-y-4">
        <h3 className="font-bold text-white text-base">Ask Your AI Strategist</h3>
        <p className="text-xs text-slate-400">
          Ask questions like "How do I catch up on my book reading target?" or "Suggest a weekend routine"
        </p>

        {/* Chat Stream if any */}
        {chatHistory.length > 0 && (
          <div className="space-y-3 max-h-64 overflow-y-auto p-3 bg-black/40 rounded-2xl border border-white/5 text-xs">
            {chatHistory.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl max-w-xl ${
                  msg.role === "user"
                    ? "bg-emerald-500 text-black font-semibold ml-auto"
                    : "bg-[#141414] text-slate-200 border border-white/5"
                }`}
              >
                <div className="font-bold mb-1 opacity-80">
                  {msg.role === "user" ? "You" : "LifeOrbit Coach"}
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
            className="flex-1 px-4 py-3 bg-black/40 border border-white/10 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
          <button
            type="submit"
            disabled={isLoading || !customQuestion.trim()}
            className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-black rounded-2xl font-bold text-xs flex items-center space-x-1.5 disabled:opacity-50 transition"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span className="hidden sm:inline">Ask</span>
          </button>
        </form>
      </div>
    </div>
  );
};
