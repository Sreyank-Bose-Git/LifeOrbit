import React, { useState, useEffect, useRef } from "react";
import {
  Bot,
  Sparkles,
  Zap,
  ArrowRight,
  Send,
  Loader2,
  RefreshCw,
  Cpu,
  Trash2,
  Calendar,
  CheckCircle2,
  Compass,
  Flame,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Endeavor, AICoachFeedback } from "../types";

interface AICopilotViewProps {
  endeavors: Endeavor[];
  onStartFocus: (endeavor: Endeavor) => void;
  onNavigateToSchedule: () => void;
}

interface ChatMessage {
  id: string;
  role: "user" | "coach";
  text: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  { label: "⚡ 25-min Sprint Plan", query: "Give me an intense 25-minute sprint plan for my highest priority goal today." },
  { label: "🎯 Prioritize My Day", query: "Look at my active goals and tell me the top 2 things I should focus on right now." },
  { label: "🔥 Habit Streak Advice", query: "How do I protect my habit streaks when I have low motivation or little time?" },
  { label: "🌙 Low-Energy Strategy", query: "I feel tired and have low energy right now. What micro-commitments can I do without burning out?" },
  { label: "💡 Break Down Milestones", query: "Help me break down my hardest milestone project into 3 easy immediate steps." },
  { label: "🧠 Optimize Daily Routine", query: "How should I structure my deep work blocks and recovery breaks for maximum output?" },
];

export const AICopilotView: React.FC<AICopilotViewProps> = ({
  endeavors,
  onStartFocus,
  onNavigateToSchedule,
}) => {
  const [feedback, setFeedback] = useState<AICoachFeedback | null>(null);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [userEnergy, setUserEnergy] = useState<"high" | "medium" | "low">("high");
  const [customQuestion, setCustomQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      role: "coach",
      text: `Greetings, Commander! I am your LifeOrbit Autonomous AI Strategist.\n\nI am actively tracking your ${
        endeavors.filter((e) => e.status === "active").length
      } active endeavor(s) and tailored to your ${userEnergy} energy level. Ask me anything — from breaking down big milestones, planning intense focus sprints, overcoming procrastination, to optimizing your daily habits and schedules!`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isChatLoading]);

  // Fetch top trajectory analysis banner
  const fetchTrajectoryAnalysis = async () => {
    setIsAnalysisLoading(true);
    try {
      const activeList = endeavors.filter((e) => e.status === "active");
      const res = await fetch("/api/ai/coach-advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endeavors: activeList,
          userEnergy,
          question: `Provide a real-time trajectory analysis and strategic focus directive for a user at ${userEnergy} energy with ${activeList.length} active goals.`,
        }),
      });

      if (!res.ok) throw new Error("Failed to fetch trajectory advice");
      const data: AICoachFeedback = await res.json();
      setFeedback(data);
    } catch {
      const topGoal = endeavors.find((e) => e.priority === "high") || endeavors[0];
      const activeCount = endeavors.filter((e) => e.status === "active").length;
      setFeedback({
        headline:
          userEnergy === "high"
            ? "High Peak Energy: Channel momentum directly into your highest-leverage endeavor."
            : userEnergy === "medium"
            ? "Steady Velocity: Protect consistency and maintain active streaks today."
            : "Cognitive Bandwidth Conservation: Prioritize micro-commitments and restorative pacing.",
        insights: [
          topGoal
            ? `Prime Sprint: Allocate a dedicated 25-35 minute focus block to "${topGoal.title}".`
            : "Define a primary focus endeavor in your workspace to anchor your daily trajectory.",
          `Streak Continuity: You have ${activeCount} active pursuit${activeCount === 1 ? "" : "s"}. Micro-progress beats zero progress.`,
          "Optic & Energy Pacing: Use 20-20-20 eye comfort rests and sync tasks with circadian energy.",
        ],
        actionRecommendation: topGoal
          ? `Initiate a 25-minute deep focus sprint on "${topGoal.title}".`
          : "Create a new endeavor or activate a Life Sphere to begin tracking.",
        motivationalQuote: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
      });
    } finally {
      setIsAnalysisLoading(false);
    }
  };

  useEffect(() => {
    fetchTrajectoryAnalysis();
  }, [userEnergy]);

  // Conversational Chat with AI Copilot
  const sendChatMessage = async (queryText: string) => {
    if (!queryText.trim() || isChatLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: queryText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChatHistory((prev) => [...prev, userMsg]);
    setIsChatLoading(true);

    try {
      const activeList = endeavors.filter((e) => e.status === "active");
      const res = await fetch("/api/ai/copilot-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: queryText,
          messages: chatHistory.concat(userMsg).map((m) => ({ role: m.role, text: m.text })),
          endeavors: activeList,
          userEnergy,
        }),
      });

      if (!res.ok) throw new Error("Chat request failed");
      const data = await res.json();
      const replyText = data.reply || data.text || "I processed your request, commander. Let's execute on your next priority!";

      const coachMsg: ChatMessage = {
        id: `coach-${Date.now()}`,
        role: "coach",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setChatHistory((prev) => [...prev, coachMsg]);
    } catch {
      const activeList = endeavors.filter((e) => e.status === "active");
      const topGoal = activeList.find((e) => e.priority === "high") || activeList[0];
      const goalTitle = topGoal ? `"${topGoal.title}"` : "your top priority";

      const fallbackReply = `Here is my direct recommendation for **"${queryText}"**:\n\n• **Immediate Action**: Take 1 concrete action on ${goalTitle} right now.\n• **Energy Pacing**: Tailored for ${userEnergy} energy — keep execution frictionless.\n• **Continuity**: Log your progress directly on your LifeOrbit dashboard to maintain momentum.\n\nLet me know if you would like me to break down this endeavor or time-block it!`;

      const coachMsg: ChatMessage = {
        id: `coach-${Date.now()}`,
        role: "coach",
        text: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setChatHistory((prev) => [...prev, coachMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim()) return;
    const q = customQuestion;
    setCustomQuestion("");
    sendChatMessage(q);
  };

  const handleClearChat = () => {
    setChatHistory([
      {
        id: `welcome-${Date.now()}`,
        role: "coach",
        text: "Chat history cleared. What goal, milestone, or strategy shall we tackle next, commander?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  const topPriorityEndeavor = endeavors.find((e) => e.priority === "high") || endeavors[0];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Top Banner - Interstellar Neural AI Strategist */}
      <div className="relative bg-[#06070B]/90 md:bg-[#06070B]/75 backdrop-blur-3xl rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.12)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden">
        {/* Ambient Cosmic Mesh */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full blur-3xl opacity-20 bg-cyan-500/30" />
          <div className="absolute top-1/2 -right-20 w-56 h-56 rounded-full blur-3xl opacity-15 bg-emerald-500/25" />
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:18px_18px] opacity-25" />
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/25 px-3 py-1 rounded-full text-cyan-400 text-[10px] font-bold font-mono tracking-widest uppercase">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>NEURAL STRATEGIST // ACTIVE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white uppercase">
            Autonomous Co-Pilot & Coach
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg font-normal leading-relaxed">
            Dynamic workload optimization, natural language planning, and real-time habit calibration.
          </p>
        </div>

        {/* Energy Filter Toggle */}
        <div className="relative z-10 bg-[#06070B] p-1.5 rounded-2xl border border-white/15 flex items-center space-x-1 text-xs font-mono shrink-0">
          <span className="text-slate-500 px-2 font-bold text-[10px]">ENERGY:</span>
          <button
            onClick={() => setUserEnergy("high")}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition text-xs cursor-pointer ${
              userEnergy === "high"
                ? "bg-amber-400/20 text-amber-300 border border-amber-400/40 shadow-[0_0_10px_rgba(251,191,36,0.3)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            High ⚡
          </button>
          <button
            onClick={() => setUserEnergy("medium")}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition text-xs cursor-pointer ${
              userEnergy === "medium"
                ? "bg-cyan-400/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(34,211,238,0.3)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Medium 🌤️
          </button>
          <button
            onClick={() => setUserEnergy("low")}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition text-xs cursor-pointer ${
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
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

        <div className="flex items-center justify-between relative z-10 font-mono">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_12px_rgba(34,211,238,0.2)]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm uppercase">Real-Time Trajectory Analysis</h3>
              <p className="text-[11px] text-slate-400">
                Calibrated to your {endeavors.filter((e) => e.status === "active").length} active orbital goals
              </p>
            </div>
          </div>

          <button
            onClick={() => fetchTrajectoryAnalysis()}
            disabled={isAnalysisLoading}
            className="flex items-center space-x-1.5 text-xs text-cyan-300 hover:bg-white/5 px-3.5 py-1.5 rounded-xl border border-cyan-500/30 transition cursor-pointer active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAnalysisLoading ? "animate-spin" : ""}`} />
            <span>Recalibrate</span>
          </button>
        </div>

        {isAnalysisLoading && !feedback ? (
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
              <span className="text-[10px] uppercase font-mono font-bold text-cyan-400 tracking-widest">
                STRATEGIC FOCUS DIRECTIVE
              </span>
              <h4 className="text-base sm:text-lg font-bold text-white mt-1.5 leading-snug">
                "{feedback.headline}"
              </h4>
            </div>

            {/* Tactical Insights */}
            <div className="space-y-3">
              <h5 className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-widest">
                ACTIONABLE TACTICAL INSIGHTS
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
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
                <span className="text-[10px] uppercase font-mono font-bold text-amber-400 tracking-widest flex items-center space-x-1">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>IMMEDIATE ACTION STEP</span>
                </span>
                <p className="text-sm font-semibold text-white">{feedback.actionRecommendation}</p>
              </div>

              <div className="flex items-center space-x-2.5">
                {topPriorityEndeavor && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => onStartFocus(topPriorityEndeavor)}
                    className="px-4 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-bold font-mono rounded-xl shadow-[0_0_15px_rgba(52,211,153,0.4)] transition flex items-center space-x-2 shrink-0 cursor-pointer"
                  >
                    <span>Launch Sprint</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </motion.button>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={onNavigateToSchedule}
                  className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold font-mono rounded-xl border border-white/15 transition flex items-center space-x-1.5 shrink-0 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Timeline</span>
                </motion.button>
              </div>
            </div>

            {/* Motivational Quote */}
            {feedback.motivationalQuote && (
              <p className="text-xs italic text-slate-400 text-center pt-2 font-mono">
                "{feedback.motivationalQuote}"
              </p>
            )}
          </div>
        ) : null}
      </div>

      {/* Interactive AI Strategist Live Conversation */}
      <div className="bg-[#06070B]/90 backdrop-blur-3xl rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.7)] space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2.5">
              <Bot className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-white text-base uppercase font-mono tracking-wide">
                Live AI Copilot Dialogue
              </h3>
            </div>
            <p className="text-xs text-slate-400 font-normal mt-1">
              Engage in multi-turn coaching, ask questions, or request bespoke strategies tailored to your endeavors.
            </p>
          </div>

          <button
            onClick={handleClearChat}
            className="flex items-center space-x-1 text-xs text-slate-500 hover:text-rose-400 px-3 py-1.5 rounded-xl hover:bg-white/5 transition cursor-pointer font-mono border border-transparent hover:border-white/10"
            title="Clear dialogue"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Chat</span>
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-[10px] text-slate-500 font-mono font-bold shrink-0">PROMPTS:</span>
          {QUICK_PROMPTS.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => sendChatMessage(qp.query)}
              disabled={isChatLoading}
              className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-cyan-500/10 hover:border-cyan-500/40 border border-white/10 text-slate-300 hover:text-cyan-300 text-xs font-mono whitespace-nowrap transition cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {qp.label}
            </button>
          ))}
        </div>

        {/* Live Chat Stream Box */}
        <div
          ref={chatContainerRef}
          className="space-y-4 max-h-[420px] min-h-[240px] overflow-y-auto p-5 bg-[#06070B] rounded-2xl border border-white/10 text-xs custom-scrollbar"
        >
          {chatHistory.map((msg) => (
            <div
              key={msg.id}
              className={`p-4 sm:p-5 rounded-2xl max-w-2xl transition-all ${
                msg.role === "user"
                  ? "bg-cyan-500/15 text-cyan-100 border border-cyan-500/30 font-medium ml-auto shadow-[0_0_15px_rgba(34,211,238,0.1)]"
                  : "bg-white/[0.03] text-slate-200 border border-white/10 mr-auto"
              }`}
            >
              <div className="flex items-center justify-between font-mono text-[10px] uppercase opacity-75 mb-2 pb-1.5 border-b border-white/10">
                <span className="font-bold text-cyan-400 flex items-center space-x-1.5">
                  {msg.role === "user" ? <span>You</span> : <span>LifeOrbit Strategist</span>}
                </span>
                <span className="text-slate-500 text-[10px]">{msg.timestamp}</span>
              </div>
              <div className="whitespace-pre-line leading-relaxed text-slate-200 font-sans text-xs sm:text-sm">
                {msg.text}
              </div>
            </div>
          ))}

          {isChatLoading && (
            <div className="p-4 rounded-2xl max-w-sm bg-white/[0.03] border border-cyan-500/30 text-cyan-300 flex items-center space-x-3 font-mono text-xs">
              <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
              <span>Strategist is synthesizing intelligent response...</span>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleAskQuestion} className="flex gap-2.5 pt-1">
          <input
            type="text"
            value={customQuestion}
            onChange={(e) => setCustomQuestion(e.target.value)}
            placeholder="Ask anything (e.g. 'How can I stay consistent with my workouts?' or 'Plan my sprint')..."
            className="flex-1 px-4 py-3 bg-[#06070B] border border-white/15 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 font-mono transition"
          />
          <button
            type="submit"
            disabled={isChatLoading || !customQuestion.trim()}
            className="px-6 py-3 bg-cyan-400 hover:bg-cyan-300 active:scale-95 text-black rounded-2xl font-bold font-mono text-xs flex items-center space-x-2 disabled:opacity-50 transition shadow-[0_0_15px_rgba(34,211,238,0.3)] cursor-pointer shrink-0"
          >
            {isChatLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};

