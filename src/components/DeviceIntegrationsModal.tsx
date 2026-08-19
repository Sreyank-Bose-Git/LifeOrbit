import React, { useState } from "react";
import {
  X,
  Zap,
  CheckCircle2,
  RefreshCw,
  Cpu,
  Activity,
  DollarSign,
  BookOpen,
  ArrowUpRight,
  ShieldCheck,
  Check,
} from "lucide-react";
import confetti from "canvas-confetti";

interface DeviceIntegrationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSimulatePassiveSync: (type: string) => void;
}

interface Connector {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: any;
  color: string;
  connected: boolean;
  lastEvent: string;
}

export const DeviceIntegrationsModal: React.FC<DeviceIntegrationsModalProps> = ({
  isOpen,
  onClose,
  onSimulatePassiveSync,
}) => {
  const [connectors, setConnectors] = useState<Connector[]>([
    {
      id: "github",
      name: "GitHub / GitLab",
      category: "Code & Career",
      description: "Auto-advances SaaS milestones when PRs are merged or commits are pushed.",
      icon: Cpu,
      color: "bg-slate-900 text-white",
      connected: true,
      lastEvent: "PR #14 'Auth & Stripe' merged 2h ago -> +15% to AI SaaS",
    },
    {
      id: "health",
      name: "Apple Health & Garmin",
      category: "Fitness & Vitality",
      description: "Auto-completes 5K runs and aerobic sessions from your smartwatch.",
      icon: Activity,
      color: "bg-red-500 text-white",
      connected: true,
      lastEvent: "Logged 5.2 km morning run at 06:45 -> Habit checked",
    },
    {
      id: "plaid",
      name: "Plaid / Banking Hub",
      category: "Wealth & Finance",
      description: "Auto-updates Emergency Fund and Savings meters when balance increases.",
      icon: DollarSign,
      color: "bg-emerald-600 text-white",
      connected: true,
      lastEvent: "Deposit $600 detected -> +$600 to Emergency Liquid Fund",
    },
    {
      id: "kindle",
      name: "Kindle & Audible Sync",
      category: "Intellect & Learning",
      description: "Reads finished eBooks and audio chapters to increment reading meters.",
      icon: BookOpen,
      color: "bg-indigo-600 text-white",
      connected: false,
      lastEvent: "Ready to connect",
    },
  ]);

  const [syncingId, setSyncingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleToggleConnect = (id: string) => {
    setConnectors((prev) =>
      prev.map((c) => (c.id === id ? { ...c, connected: !c.connected } : c))
    );
  };

  const handleTriggerSync = (id: string) => {
    setSyncingId(id);
    setTimeout(() => {
      onSimulatePassiveSync(id);
      setSyncingId(null);
      confetti({ particleCount: 40, spread: 60 });
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#0D0D0D] rounded-3xl max-w-2xl w-full border border-white/10 shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/5">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-black font-bold flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Autonomous Passive Tracking Hub</h3>
              <p className="text-xs text-slate-400">Zero-friction automated activity sensing via MCP & APIs</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 text-xs text-emerald-300 leading-relaxed">
            <strong className="text-emerald-400 font-bold">The 2026 Anti-Fatigue Engine:</strong> Instead of manual checkboxes, LifeOrbit connects to your devices, wearable sensors, and developer tools to automatically detect your efforts and update progress bars in the background.
          </div>

          <div className="space-y-3">
            {connectors.map((c) => {
              const IconComp = c.icon;
              const isSyncing = syncingId === c.id;

              return (
                <div
                  key={c.id}
                  className="bg-[#141414] rounded-2xl p-4 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-white/10 transition"
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-10 h-10 rounded-xl ${c.color} flex items-center justify-center shrink-0`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-white text-sm">{c.name}</h4>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                          {c.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{c.description}</p>
                      {c.connected && (
                        <span className="inline-block text-[11px] text-emerald-400 font-medium mt-1 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                          Last Signal: {c.lastEvent}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 self-end sm:self-center shrink-0">
                    {c.connected ? (
                      <>
                        <button
                          onClick={() => handleTriggerSync(c.id)}
                          disabled={isSyncing}
                          className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-200 font-semibold text-xs rounded-xl flex items-center space-x-1.5 border border-white/5 transition"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin text-emerald-400" : ""}`} />
                          <span>{isSyncing ? "Sensing..." : "Trigger Sync"}</span>
                        </button>
                        <button
                          onClick={() => handleToggleConnect(c.id)}
                          className="px-3 py-1.5 text-xs text-slate-400 hover:text-red-400 font-medium"
                        >
                          Disconnect
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleToggleConnect(c.id)}
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-xl shadow-xs transition"
                      >
                        Connect API
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
