import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  Orbit,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Plus,
  StickyNote,
  Link as LinkIcon,
  Play,
  Pause,
  Sliders,
  Sparkles,
  Flame,
  CheckCircle2,
  Timer,
  Layers,
  Trash2,
  Pin,
  PinOff,
  Move,
  Grid,
  Eye,
  Activity,
  Zap,
  Radio,
  Share2,
  RefreshCw,
  Compass,
  Target,
  Flag,
  ArrowRight,
  Shield,
  HelpCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  Endeavor,
  UserProfile,
  UserStats,
  SandboxStickyNote,
  SandboxConnection,
  SandboxNodePosition,
  SandboxSettings,
} from "../types";
import { getEndeavorIcon, getCategoryBadge, getArchetypeInfo } from "../lib/icons";
import { focusAudio } from "../lib/audio";
import { SPHERE_DEFINITIONS } from "./LifeSphereOrb";
import confetti from "canvas-confetti";

interface SandboxViewProps {
  endeavors: Endeavor[];
  profile: UserProfile;
  stats: UserStats;
  onQuickLog: (endeavor: Endeavor, value: number, note?: string) => void;
  onOpenLogModal: (endeavor: Endeavor) => void;
  onStartFocus: (endeavor: Endeavor) => void;
  onOpenDetail: (endeavor: Endeavor) => void;
  onOpenCreate: () => void;
}

const DEFAULT_SANDBOX_SETTINGS: SandboxSettings = {
  gravityEnabled: true,
  gravityStrength: 0.05,
  repulsionStrength: 80,
  orbitCenterPull: true,
  starfieldIntensity: 3,
  showConstellations: true,
  showGrid: true,
  snapToGrid: false,
};

const NOTE_COLORS = [
  { name: "Nebula Amber", bg: "bg-amber-500/15 border-amber-500/30 text-amber-200", hex: "#f59e0b" },
  { name: "Cyan Horizon", bg: "bg-cyan-500/15 border-cyan-500/30 text-cyan-200", hex: "#06b6d4" },
  { name: "Emerald Orbit", bg: "bg-emerald-500/15 border-emerald-500/30 text-emerald-200", hex: "#10b981" },
  { name: "Violet Pulsar", bg: "bg-purple-500/15 border-purple-500/30 text-purple-200", hex: "#8b5cf6" },
  { name: "Obsidian Core", bg: "bg-white/10 border-white/20 text-slate-200", hex: "#64748b" },
];

export const SandboxView: React.FC<SandboxViewProps> = ({
  endeavors,
  profile,
  stats,
  onQuickLog,
  onOpenLogModal,
  onStartFocus,
  onOpenDetail,
  onOpenCreate,
}) => {
  // Canvas Viewport Pan & Zoom State
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  // Sandbox Physics & Settings
  const [settings, setSettings] = useState<SandboxSettings>(() => {
    try {
      const saved = localStorage.getItem("lifeorbit_sandbox_settings");
      return saved ? JSON.parse(saved) : DEFAULT_SANDBOX_SETTINGS;
    } catch {
      return DEFAULT_SANDBOX_SETTINGS;
    }
  });
  const [isControlsOpen, setIsControlsOpen] = useState(false);
  const [isSimulationRunning, setIsSimulationRunning] = useState(true);
  const [nodeDisplayMode, setNodeDisplayMode] = useState<"spheres" | "cards">(() => {
    try {
      const saved = localStorage.getItem("lifeorbit_sandbox_node_mode");
      return (saved as "spheres" | "cards") || "spheres";
    } catch {
      return "spheres";
    }
  });

  // Draggable Node Positions
  const [nodePositions, setNodePositions] = useState<Record<string, SandboxNodePosition>>(() => {
    try {
      const saved = localStorage.getItem("lifeorbit_sandbox_node_positions");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Cosmic Sticky Notes
  const [stickyNotes, setStickyNotes] = useState<SandboxStickyNote[]>(() => {
    try {
      const saved = localStorage.getItem("lifeorbit_sandbox_sticky_notes");
      if (saved) return JSON.parse(saved);
      return [
        {
          id: "note-welcome",
          x: -280,
          y: -180,
          text: "✨ **Cosmic Sandbox Playground**\n- Drag nodes freely across space\n- Toggle orbital gravity simulation\n- Connect endeavors into constellations\n- Double-click anywhere to drop cosmic notes",
          color: "#06b6d4",
          tag: "TUTORIAL",
          width: 260,
        },
        {
          id: "note-synergy",
          x: 240,
          y: -160,
          text: "⚡ **Habit Synergy Matrix**\nStack morning meditation right before deep work sprints for maximum flow state!",
          color: "#f59e0b",
          tag: "FOCUS LOOP",
          width: 240,
        },
      ];
    } catch {
      return [];
    }
  });

  // Constellation Connections
  const [connections, setConnections] = useState<SandboxConnection[]>(() => {
    try {
      const saved = localStorage.getItem("lifeorbit_sandbox_connections");
      if (saved) return JSON.parse(saved);
      return [];
    } catch {
      return [];
    }
  });

  // Linking Tool State
  const [isLinkMode, setIsLinkMode] = useState(false);
  const [linkSourceNodeId, setLinkSourceNodeId] = useState<string | null>(null);

  // Dragging active item state
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [draggingNoteId, setDraggingNoteId] = useState<string | null>(null);
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Selected item for inspector preview
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Save changes to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem("lifeorbit_sandbox_settings", JSON.stringify(settings));
    } catch (e) {}
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem("lifeorbit_sandbox_node_positions", JSON.stringify(nodePositions));
    } catch (e) {}
  }, [nodePositions]);

  useEffect(() => {
    try {
      localStorage.setItem("lifeorbit_sandbox_sticky_notes", JSON.stringify(stickyNotes));
    } catch (e) {}
  }, [stickyNotes]);

  useEffect(() => {
    try {
      localStorage.setItem("lifeorbit_sandbox_connections", JSON.stringify(connections));
    } catch (e) {}
  }, [connections]);

  // Initialize node positions if not present
  useEffect(() => {
    const updated = { ...nodePositions };
    let hasChanges = false;

    endeavors.forEach((endeavor, index) => {
      if (!updated[endeavor.id]) {
        hasChanges = true;
        // Distribute in concentric orbits based on category or priority
        const angle = (index / Math.max(1, endeavors.length)) * Math.PI * 2;
        const radius = 220 + (index % 3) * 110;
        updated[endeavor.id] = {
          id: endeavor.id,
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          fixed: false,
        };
      }
    });

    if (hasChanges) {
      setNodePositions(updated);
    }
  }, [endeavors]);

  // Physics Simulation Step (Orbital Gravity + Inter-Node Repulsion + Damping)
  useEffect(() => {
    if (!isSimulationRunning || !settings.gravityEnabled) return;

    const interval = setInterval(() => {
      setNodePositions((prev) => {
        const next = { ...prev };
        const endeavorIds = Object.keys(next);

        endeavorIds.forEach((idA) => {
          const nodeA = next[idA];
          if (!nodeA || nodeA.fixed || draggingNodeId === idA) return;

          let fx = 0;
          let fy = 0;

          // 1. Orbital pull towards center (North Star)
          if (settings.orbitCenterPull) {
            const distCenter = Math.sqrt(nodeA.x * nodeA.x + nodeA.y * nodeA.y) || 1;
            const targetOrbitRadius = 240;
            const radialDelta = distCenter - targetOrbitRadius;
            
            // Radial restoring spring force
            fx -= (nodeA.x / distCenter) * radialDelta * settings.gravityStrength * 0.15;
            fy -= (nodeA.y / distCenter) * radialDelta * settings.gravityStrength * 0.15;

            // Gentle orbital tangential velocity (perpendicular push)
            fx += (-nodeA.y / distCenter) * 0.25;
            fy += (nodeA.x / distCenter) * 0.25;
          }

          // 2. Node-to-node repulsion
          endeavorIds.forEach((idB) => {
            if (idA === idB) return;
            const nodeB = next[idB];
            if (!nodeB) return;

            const dx = nodeA.x - nodeB.x;
            const dy = nodeA.y - nodeB.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const minDist = 140;

            if (dist < minDist) {
              const repulseForce = (settings.repulsionStrength / (dist * dist + 100)) * (minDist - dist);
              fx += (dx / dist) * repulseForce * 0.6;
              fy += (dy / dist) * repulseForce * 0.6;
            }
          });

          // 3. Update velocity with damping
          const vx = ((nodeA.vx || 0) + fx) * 0.92;
          const vy = ((nodeA.vy || 0) + fy) * 0.92;

          next[idA] = {
            ...nodeA,
            x: nodeA.x + vx,
            y: nodeA.y + vy,
            vx,
            vy,
          };
        });

        return next;
      });
    }, 33); // ~30 fps physics update

    return () => clearInterval(interval);
  }, [isSimulationRunning, settings, draggingNodeId]);

  // Canvas Mouse / Touch Handlers for Panning & Dragging
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".sandbox-interactive-item")) {
      return;
    }
    if (e.button === 0 || e.button === 1) {
      setIsPanning(true);
      panStartRef.current = {
        x: e.clientX - pan.x,
        y: e.clientY - pan.y,
      };
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStartRef.current.x,
        y: e.clientY - panStartRef.current.y,
      });
      return;
    }

    if (draggingNodeId) {
      const rect = canvasContainerRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const mouseCanvasX = (e.clientX - rect.left - rect.width / 2 - pan.x) / zoom;
      const mouseCanvasY = (e.clientY - rect.top - rect.height / 2 - pan.y) / zoom;

      setNodePositions((prev) => ({
        ...prev,
        [draggingNodeId]: {
          ...(prev[draggingNodeId] || { id: draggingNodeId, vx: 0, vy: 0 }),
          x: mouseCanvasX - dragOffsetRef.current.x,
          y: mouseCanvasY - dragOffsetRef.current.y,
          vx: 0,
          vy: 0,
        },
      }));
    }

    if (draggingNoteId) {
      const rect = canvasContainerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const mouseCanvasX = (e.clientX - rect.left - rect.width / 2 - pan.x) / zoom;
      const mouseCanvasY = (e.clientY - rect.top - rect.height / 2 - pan.y) / zoom;

      setStickyNotes((prev) =>
        prev.map((note) =>
          note.id === draggingNoteId
            ? {
                ...note,
                x: mouseCanvasX - dragOffsetRef.current.x,
                y: mouseCanvasY - dragOffsetRef.current.y,
              }
            : note
        )
      );
    }
  };

  const handleCanvasMouseUp = () => {
    setIsPanning(false);
    setDraggingNodeId(null);
    setDraggingNoteId(null);
  };

  const handleCanvasWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
    setZoom((prev) => Math.min(2.5, Math.max(0.3, prev * zoomFactor)));
  };

  // Double Click Canvas to Add Sticky Note
  const handleCanvasDoubleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".sandbox-interactive-item")) {
      return;
    }
    const rect = canvasContainerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const canvasX = (e.clientX - rect.left - rect.width / 2 - pan.x) / zoom;
    const canvasY = (e.clientY - rect.top - rect.height / 2 - pan.y) / zoom;

    const newNote: SandboxStickyNote = {
      id: `note-${Date.now()}`,
      x: canvasX - 80,
      y: canvasY - 50,
      text: "⚡ **New Cosmic Thought**\nClick to write inspiration or milestones...",
      color: NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)].hex,
      tag: "SANDBOX",
      width: 220,
    };

    setStickyNotes((prev) => [...prev, newNote]);
    focusAudio.playClick();
  };

  // Node Drag Initiation
  const startDragNode = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (isLinkMode) {
      handleLinkNodeClick(id);
      return;
    }
    setDraggingNodeId(id);
    const pos = nodePositions[id] || { x: 0, y: 0 };
    const rect = canvasContainerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseCanvasX = (e.clientX - rect.left - rect.width / 2 - pan.x) / zoom;
    const mouseCanvasY = (e.clientY - rect.top - rect.height / 2 - pan.y) / zoom;

    dragOffsetRef.current = {
      x: mouseCanvasX - pos.x,
      y: mouseCanvasY - pos.y,
    };
  };

  // Note Drag Initiation
  const startDragNote = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDraggingNoteId(id);
    const note = stickyNotes.find((n) => n.id === id);
    if (!note) return;

    const rect = canvasContainerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseCanvasX = (e.clientX - rect.left - rect.width / 2 - pan.x) / zoom;
    const mouseCanvasY = (e.clientY - rect.top - rect.height / 2 - pan.y) / zoom;

    dragOffsetRef.current = {
      x: mouseCanvasX - note.x,
      y: mouseCanvasY - note.y,
    };
  };

  // Link / Constellation creation
  const handleLinkNodeClick = (nodeId: string) => {
    if (!linkSourceNodeId) {
      setLinkSourceNodeId(nodeId);
      focusAudio.playClick();
    } else if (linkSourceNodeId !== nodeId) {
      // Create connection
      const exists = connections.some(
        (c) =>
          (c.fromId === linkSourceNodeId && c.toId === nodeId) ||
          (c.fromId === nodeId && c.toId === linkSourceNodeId)
      );

      if (!exists) {
        const newConn: SandboxConnection = {
          id: `conn-${Date.now()}`,
          fromId: linkSourceNodeId,
          toId: nodeId,
          label: "Synergy",
          style: "glow",
        };
        setConnections((prev) => [...prev, newConn]);
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
      }

      setLinkSourceNodeId(null);
      setIsLinkMode(false);
      focusAudio.playSuccess();
    }
  };

  const deleteConnection = (id: string) => {
    setConnections((prev) => prev.filter((c) => c.id !== id));
    focusAudio.playClick();
  };

  const deleteStickyNote = (id: string) => {
    setStickyNotes((prev) => prev.filter((n) => n.id !== id));
    focusAudio.playClick();
  };

  const updateStickyNoteText = (id: string, text: string) => {
    setStickyNotes((prev) => prev.map((n) => (n.id === id ? { ...n, text } : n)));
  };

  const togglePinNode = (id: string) => {
    setNodePositions((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || { id, x: 0, y: 0 }),
        fixed: !prev[id]?.fixed,
      },
    }));
    focusAudio.playClick();
  };

  // Auto Layout Presets
  const applyLayoutPreset = (preset: "solar" | "grid" | "clusters" | "reset") => {
    focusAudio.playClick();
    const updated: Record<string, SandboxNodePosition> = {};

    if (preset === "solar") {
      // Concentric Planetary Rings
      endeavors.forEach((e, idx) => {
        const ring = Math.floor(idx / 4) + 1;
        const totalInRing = Math.min(4, endeavors.length - (ring - 1) * 4);
        const indexInRing = idx % 4;
        const radius = ring * 160;
        const angle = (indexInRing / totalInRing) * Math.PI * 2 + (ring * 0.5);

        updated[e.id] = {
          id: e.id,
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
          vx: 0,
          vy: 0,
          fixed: false,
        };
      });
    } else if (preset === "grid") {
      // Bento Matrix Grid
      const cols = Math.ceil(Math.sqrt(endeavors.length));
      const spacingX = 260;
      const spacingY = 180;
      const offsetX = ((cols - 1) * spacingX) / 2;
      const offsetY = ((Math.ceil(endeavors.length / cols) - 1) * spacingY) / 2;

      endeavors.forEach((e, idx) => {
        const r = Math.floor(idx / cols);
        const c = idx % cols;
        updated[e.id] = {
          id: e.id,
          x: c * spacingX - offsetX,
          y: r * spacingY - offsetY,
          vx: 0,
          vy: 0,
          fixed: true,
        };
      });
    } else if (preset === "clusters") {
      // Category Nebula Clusters
      const categories: string[] = Array.from(new Set(endeavors.map((e) => e.category)));
      const clusterCenters: Record<string, { x: number; y: number }> = {};

      categories.forEach((cat: string, i: number) => {
        const angle = (i / categories.length) * Math.PI * 2;
        clusterCenters[cat] = {
          x: Math.cos(angle) * 320,
          y: Math.sin(angle) * 320,
        };
      });

      endeavors.forEach((e, idx) => {
        const center = clusterCenters[e.category] || { x: 0, y: 0 };
        const localAngle = (idx * 1.5) % (Math.PI * 2);
        const localDist = 70 + (idx % 3) * 35;
        updated[e.id] = {
          id: e.id,
          x: center.x + Math.cos(localAngle) * localDist,
          y: center.y + Math.sin(localAngle) * localDist,
          vx: 0,
          vy: 0,
          fixed: false,
        };
      });
    } else if (preset === "reset") {
      setPan({ x: 0, y: 0 });
      setZoom(1);
      return;
    }

    setNodePositions(updated);
  };

  const selectedEndeavor = useMemo(() => {
    return endeavors.find((e) => e.id === selectedNodeId) || null;
  }, [selectedNodeId, endeavors]);

  return (
    <div
      id="sandbox-infinite-canvas"
      className="relative w-full h-[760px] lg:h-[820px] rounded-[32px] bg-[#030407] border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.95),inset_0_1px_1px_rgba(255,255,255,0.15)] overflow-hidden select-none flex flex-col font-mono text-slate-200"
    >
      {/* Top Floating Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between pointer-events-none">
        {/* Left: Sandbox Mode Badge & North Star */}
        <div className="flex items-center space-x-2 pointer-events-auto bg-[#06070B]/90 backdrop-blur-2xl px-3.5 py-2 rounded-2xl border border-white/15 shadow-2xl">
          <div className="w-7 h-7 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Orbit className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-extrabold text-white tracking-tight">
                Cosmic Sandbox Canvas
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                PLAYGROUND
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              {endeavors.length} Orbital Nodes • {connections.length} Constellations
            </p>
          </div>
        </div>

        {/* Center: Quick Creation & Tool Controls */}
        <div className="flex items-center space-x-1.5 pointer-events-auto bg-[#06070B]/90 backdrop-blur-2xl p-1.5 rounded-2xl border border-white/15 shadow-2xl">
          {/* Add Goal Node */}
          <button
            onClick={onOpenCreate}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-xs uppercase shadow-[0_0_15px_rgba(52,211,153,0.3)] active:scale-95 transition cursor-pointer"
            title="Create new orbital node"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>New Node</span>
          </button>

          {/* Add Sticky Note */}
          <button
            onClick={() => {
              const newNote: SandboxStickyNote = {
                id: `note-${Date.now()}`,
                x: -pan.x / zoom - 40,
                y: -pan.y / zoom - 40,
                text: "✨ **Cosmic Note**\nWrite habit triggers, ideas or reminders...",
                color: NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)].hex,
                tag: "NOTE",
                width: 220,
              };
              setStickyNotes((prev) => [...prev, newNote]);
              focusAudio.playClick();
            }}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold active:scale-95 transition cursor-pointer"
            title="Drop cosmic sticky note onto canvas"
          >
            <StickyNote className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Add Note</span>
          </button>

          {/* Constellation Link Mode Toggle */}
          <button
            onClick={() => {
              setIsLinkMode(!isLinkMode);
              setLinkSourceNodeId(null);
              focusAudio.playClick();
            }}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold active:scale-95 transition cursor-pointer ${
              isLinkMode
                ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.3)] animate-pulse"
                : "bg-white/5 hover:bg-white/10 text-slate-300 border-white/10"
            }`}
            title="Connect two endeavors into a constellation link"
          >
            <LinkIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">{isLinkMode ? "Click 2 Nodes" : "Link Constellation"}</span>
          </button>

          {/* View Mode Switcher: Spheres vs Cards */}
          <div className="flex items-center bg-white/5 p-0.5 rounded-xl border border-white/10">
            <button
              onClick={() => {
                setNodeDisplayMode("spheres");
                localStorage.setItem("lifeorbit_sandbox_node_mode", "spheres");
                focusAudio.playClick();
              }}
              className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                nodeDisplayMode === "spheres"
                  ? "bg-emerald-400 text-black font-bold shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Render endeavors as 3D Celestial Planetary Spheres"
            >
              <Orbit className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Spheres</span>
            </button>
            <button
              onClick={() => {
                setNodeDisplayMode("cards");
                localStorage.setItem("lifeorbit_sandbox_node_mode", "cards");
                focusAudio.playClick();
              }}
              className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                nodeDisplayMode === "cards"
                  ? "bg-emerald-400 text-black font-bold shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Render endeavors as Detailed Glass Cards"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Cards</span>
            </button>
          </div>

          {/* Physics Simulation Toggle */}
          <button
            onClick={() => {
              setIsSimulationRunning(!isSimulationRunning);
              focusAudio.playClick();
            }}
            className={`p-1.5 rounded-xl border text-xs cursor-pointer transition ${
              isSimulationRunning
                ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                : "bg-white/5 text-slate-400 border-white/10"
            }`}
            title={isSimulationRunning ? "Pause Gravity Physics" : "Resume Gravity Physics"}
          >
            {isSimulationRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          {/* Physics & Settings Drawer Toggle */}
          <button
            onClick={() => setIsControlsOpen(!isControlsOpen)}
            className={`p-1.5 rounded-xl border text-xs cursor-pointer transition ${
              isControlsOpen
                ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                : "bg-white/5 text-slate-400 hover:text-white border-white/10"
            }`}
            title="Sandbox Physics & Layout Config"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Layout Presets & Zoom Navigation */}
        <div className="hidden sm:flex items-center space-x-1.5 pointer-events-auto bg-[#06070B]/90 backdrop-blur-2xl p-1.5 rounded-2xl border border-white/15 shadow-2xl">
          <button
            onClick={() => applyLayoutPreset("solar")}
            className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-[11px] font-semibold transition cursor-pointer"
            title="Solar System Concentric Orbits"
          >
            Solar Orbit
          </button>
          <button
            onClick={() => applyLayoutPreset("clusters")}
            className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-[11px] font-semibold transition cursor-pointer"
            title="Category Nebula Clusters"
          >
            Clusters
          </button>
          <button
            onClick={() => applyLayoutPreset("grid")}
            className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-[11px] font-semibold transition cursor-pointer"
            title="Bento Sandbox Grid"
          >
            Bento Grid
          </button>

          <div className="w-[1px] h-4 bg-white/10 mx-1" />

          <button
            onClick={() => setZoom((z) => Math.min(2.5, z + 0.15))}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] text-slate-400 font-bold min-w-[34px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.max(0.3, z - 0.15))}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => applyLayoutPreset("reset")}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer"
            title="Reset Pan & 100% Zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Interactive Pan/Zoom Canvas Area */}
      <div
        ref={canvasContainerRef}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onWheel={handleCanvasWheel}
        onDoubleClick={handleCanvasDoubleClick}
        className={`relative flex-1 w-full h-full cursor-grab active:cursor-grabbing overflow-hidden ${
          isLinkMode ? "cursor-crosshair" : ""
        }`}
      >
        {/* Dynamic Deep Space Cosmic Grid Background */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            backgroundImage: settings.showGrid
              ? `radial-gradient(rgba(255, 255, 255, 0.15) 1.2px, transparent 1.2px)`
              : undefined,
            backgroundSize: `${32 * zoom}px ${32 * zoom}px`,
            backgroundPosition: `${pan.x}px ${pan.y}px`,
            opacity: 0.4,
          }}
        />

        {/* Concentric Celestial Orbit Guide Rings */}
        <div
          className="absolute left-1/2 top-1/2 pointer-events-none"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          }}
        >
          {/* North Star Core Halo */}
          <div className="absolute -top-36 -left-36 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-cyan-500/15 blur-2xl animate-pulse" />

          {/* Concentric Orbit Distance Rings */}
          {[160, 320, 480, 640].map((radius, i) => (
            <div
              key={radius}
              className="absolute rounded-full border border-dashed border-white/[0.06] -translate-x-1/2 -translate-y-1/2 flex items-center justify-end pr-2"
              style={{
                width: `${radius * 2}px`,
                height: `${radius * 2}px`,
              }}
            >
              <span className="text-[9px] text-slate-600 font-mono select-none">
                ORBIT #{i + 1} • {radius}AU
              </span>
            </div>
          ))}
        </div>

        {/* Canvas World Container (Transformed via Pan & Zoom) */}
        <div
          className="absolute left-1/2 top-1/2 w-0 h-0"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "0 0",
          }}
        >
          {/* Constellation Link Lines (SVG Overlay) */}
          <svg className="absolute -top-[2000px] -left-[2000px] w-[4000px] h-[4000px] pointer-events-none overflow-visible">
            {connections.map((conn) => {
              const posA = nodePositions[conn.fromId];
              const posB = nodePositions[conn.toId];
              if (!posA || !posB) return null;

              // Adjust for 2000px SVG offset
              const x1 = posA.x + 2000;
              const y1 = posA.y + 2000;
              const x2 = posB.x + 2000;
              const y2 = posB.y + 2000;
              const midX = (x1 + x2) / 2;
              const midY = (y1 + y2) / 2;

              return (
                <g key={conn.id} className="pointer-events-auto">
                  {/* Glowing energy line */}
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="rgba(34, 211, 238, 0.4)"
                    strokeWidth="3"
                    strokeDasharray={conn.style === "dashed" ? "6,6" : undefined}
                    className="animate-pulse"
                  />
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="rgba(255, 255, 255, 0.8)"
                    strokeWidth="1.2"
                  />
                  {/* Midpoint Synergy Pill */}
                  <circle
                    cx={midX}
                    cy={midY}
                    r="8"
                    fill="#06070B"
                    stroke="#22d3ee"
                    strokeWidth="2"
                    className="cursor-pointer hover:scale-125 transition-transform"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConnection(conn.id);
                    }}
                  />
                </g>
              );
            })}
          </svg>

          {/* Central North Star / Profile Core Beacon - Stylized 3D Celestial Hyper-Sphere */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 sandbox-interactive-item z-10"
            style={{ left: 0, top: 0 }}
          >
            <div className="relative group cursor-pointer flex flex-col items-center">
              {/* Outer Atmospheric Solar Flare Corona */}
              <div className="absolute -inset-6 rounded-full bg-emerald-500/25 blur-2xl animate-pulse pointer-events-none" />
              <div className="absolute -inset-10 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />

              {/* Tilted Planetary Orbit Rings around North Star */}
              <div
                className="absolute pointer-events-none rotate-[-26deg]"
                style={{ width: "160px", height: "55px", top: "12px" }}
              >
                <div className="w-full h-full rounded-[100%] border-2 border-emerald-400/50 shadow-[0_0_20px_rgba(52,211,153,0.5)] bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent animate-spin-slow" />
              </div>

              {/* 3D Radiant Solar Sphere Core */}
              <div
                className="relative w-20 h-20 rounded-full flex items-center justify-center shadow-2xl overflow-hidden ring-2 ring-emerald-300/80 transform group-hover:scale-110 transition-transform duration-300"
                style={{
                  background: "radial-gradient(circle at 30% 28%, #a7f3d0 0%, #34d399 35%, #059669 70%, #022c22 100%)",
                  boxShadow: "inset -6px -6px 14px rgba(0,0,0,0.85), inset 4px 4px 10px rgba(255,255,255,0.7), 0 0 35px rgba(52,211,153,0.7)",
                }}
              >
                {/* Specular Light Crescent */}
                <div
                  className="absolute top-1.5 left-2.5 w-10 h-6 rounded-full pointer-events-none"
                  style={{
                    background: "radial-gradient(ellipse at center, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.1) 60%, transparent 85%)",
                    transform: "rotate(-25deg)",
                  }}
                />

                {/* Bottom Shadow */}
                <div
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{
                    background: "radial-gradient(circle at 75% 80%, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 50%, transparent 75%)",
                  }}
                />

                {/* Avatar Icon */}
                <span className="relative z-10 text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] select-none">
                  {profile.avatarIcon || "🚀"}
                </span>
              </div>

              {/* Floating North Star Banner */}
              <div className="mt-3 whitespace-nowrap bg-[#06070B]/95 px-3 py-1 rounded-xl border border-emerald-500/40 text-[10px] font-bold text-emerald-300 shadow-[0_0_20px_rgba(0,0,0,0.8)] flex items-center space-x-1.5 backdrop-blur-xl">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>{profile.northStarMotto || "NORTH STAR CORE"}</span>
              </div>
            </div>
          </div>

          {/* Cosmic Sticky Notes */}
          {stickyNotes.map((note) => (
            <div
              key={note.id}
              onMouseDown={(e) => startDragNote(e, note.id)}
              className="absolute sandbox-interactive-item z-20 cursor-grab active:cursor-grabbing group/note"
              style={{
                left: `${note.x}px`,
                top: `${note.y}px`,
                width: `${note.width || 220}px`,
              }}
            >
              <div
                className="p-3.5 rounded-2xl bg-[#06070B]/90 backdrop-blur-2xl border shadow-[0_0_30px_rgba(0,0,0,0.85)] text-xs relative overflow-hidden transition-all duration-200 hover:shadow-[0_0_40px_rgba(255,255,255,0.15)]"
                style={{ borderColor: `${note.color || "#06b6d4"}55` }}
              >
                <div className="flex items-center justify-between pb-2 border-b border-white/10 text-[9px] font-bold uppercase tracking-wider">
                  <span style={{ color: note.color || "#06b6d4" }}>
                    {note.tag || "COSMIC THOUGHT"}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteStickyNote(note.id);
                    }}
                    className="opacity-0 group-hover/note:opacity-100 p-0.5 text-slate-400 hover:text-rose-400 transition cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                <textarea
                  value={note.text}
                  onChange={(e) => updateStickyNoteText(note.id, e.target.value)}
                  onMouseDown={(e) => e.stopPropagation()}
                  rows={3}
                  className="w-full mt-2 bg-transparent text-slate-200 text-xs focus:outline-none resize-none font-sans leading-relaxed"
                />
              </div>
            </div>
          ))}

          {/* Draggable Endeavor Nodes */}
          {endeavors.map((endeavor) => {
            const pos = nodePositions[endeavor.id] || { x: 0, y: 0, fixed: false };
            const isHovered = hoveredNodeId === endeavor.id;
            const isSelected = selectedNodeId === endeavor.id;
            const isLinkingSource = linkSourceNodeId === endeavor.id;
            const Icon = getEndeavorIcon(endeavor.icon);

            // Progress percentage
            let percentage = 0;
            if (endeavor.archetype === "milestone" && endeavor.milestones.length > 0) {
              const comp = endeavor.milestones.filter((m) => m.completed).length;
              percentage = Math.round((comp / endeavor.milestones.length) * 100);
            } else if (endeavor.targetValue > 0) {
              percentage = Math.min(100, Math.max(0, Math.round((endeavor.currentValue / endeavor.targetValue) * 100)));
            }

            const sphereDef = SPHERE_DEFINITIONS[endeavor.category] || SPHERE_DEFINITIONS.personal;

            return (
              <div
                key={endeavor.id}
                onMouseDown={(e) => startDragNode(e, endeavor.id)}
                onMouseEnter={() => setHoveredNodeId(endeavor.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isLinkMode) {
                    handleLinkNodeClick(endeavor.id);
                  } else {
                    setSelectedNodeId(isSelected ? null : endeavor.id);
                  }
                }}
                className={`absolute sandbox-interactive-item -translate-x-1/2 -translate-y-1/2 z-20 cursor-grab active:cursor-grabbing transition-transform duration-100 ${
                  isHovered || isSelected ? "scale-105 z-30" : ""
                }`}
                style={{
                  left: `${pos.x}px`,
                  top: `${pos.y}px`,
                }}
              >
                {/* Node Rendering: 3D Celestial Sphere vs Detailed Glass Card */}
                {nodeDisplayMode === "spheres" ? (
                  /* 3D CELESTIAL PLANETARY SPHERE NODE */
                  <div className="relative group/sphere flex flex-col items-center select-none">
                    {/* Atmospheric Glow Corona */}
                    <div
                      className={`absolute -inset-3 rounded-full blur-xl transition-all duration-300 pointer-events-none ${
                        isLinkingSource
                          ? "bg-cyan-400/60 scale-150 animate-pulse"
                          : isSelected
                          ? "bg-emerald-400/50 scale-140"
                          : isHovered
                          ? "bg-white/30 scale-125"
                          : "opacity-30"
                      }`}
                      style={{
                        backgroundColor: endeavor.color || sphereDef.glowColor,
                      }}
                    />

                    {/* Outer Selection Pulsar Ring */}
                    {isSelected && (
                      <div
                        className="absolute -inset-2.5 rounded-full border border-dashed border-emerald-400 animate-spin-slow pointer-events-none"
                      />
                    )}

                    {/* Saturn-Style Planetary Orbit Ring */}
                    <div
                      className={`absolute pointer-events-none transition-transform duration-300 ${
                        isHovered || isSelected ? "rotate-[-28deg] scale-120" : "rotate-[-24deg] scale-100"
                      }`}
                      style={{
                        width: "100px",
                        height: "36px",
                        top: "14px",
                      }}
                    >
                      <div
                        className="w-full h-full rounded-[100%] border-[2px] shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                        style={{
                          borderColor: endeavor.color || sphereDef.ringColor,
                          background: `linear-gradient(90deg, transparent 5%, ${endeavor.color || sphereDef.ringColor} 50%, transparent 95%)`,
                          opacity: isSelected || isHovered ? 0.95 : 0.5,
                        }}
                      />
                    </div>

                    {/* 3D Realistic Sphere Orb */}
                    <div
                      className={`relative w-16 h-16 rounded-full flex items-center justify-center shadow-2xl overflow-hidden ring-1 transition-all duration-300 transform ${
                        isLinkingSource
                          ? "ring-4 ring-cyan-400 scale-115 shadow-[0_0_35px_rgba(34,211,238,0.7)] animate-pulse"
                          : isSelected
                          ? "ring-2 ring-white scale-110 shadow-[0_0_30px_rgba(255,255,255,0.6)]"
                          : "ring-white/20 group-hover/sphere:scale-110 group-hover/sphere:ring-white/50"
                      }`}
                      style={{
                        background: sphereDef.surfaceGradient,
                        boxShadow: "inset -6px -6px 14px rgba(0,0,0,0.85), inset 3px 3px 8px rgba(255,255,255,0.7), 0 10px 25px rgba(0,0,0,0.7)",
                      }}
                    >
                      {/* Specular Light Crescent */}
                      <div
                        className="absolute top-1 left-1.5 w-8 h-4 rounded-full pointer-events-none"
                        style={{
                          background: "radial-gradient(ellipse at center, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.1) 60%, transparent 85%)",
                          transform: "rotate(-25deg)",
                        }}
                      />

                      {/* Deep Bottom Shadow */}
                      <div
                        className="absolute inset-0 rounded-full pointer-events-none"
                        style={{
                          background: "radial-gradient(circle at 75% 78%, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 40%, transparent 70%)",
                        }}
                      />

                      {/* Icon */}
                      <Icon className="relative z-10 w-6 h-6 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]" />
                    </div>

                    {/* Orbiting Satellite Moons (For Streak & Milestones) */}
                    {endeavor.streakCount > 0 && (
                      <div
                        className="absolute -top-1.5 -right-1.5 z-20 flex items-center space-x-0.5 bg-amber-400 text-black text-[9px] font-black px-1.5 py-0.5 rounded-full border border-amber-200 shadow-[0_0_10px_rgba(251,191,36,0.6)] animate-bounce"
                        style={{ animationDuration: "2s" }}
                      >
                        <Flame className="w-2.5 h-2.5 fill-current" />
                        <span>{endeavor.streakCount}</span>
                      </div>
                    )}

                    {/* Progress Percentage Ring / Badge */}
                    <div className="absolute -bottom-1 -left-1 z-20 bg-[#06070B] text-emerald-400 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full border border-emerald-500/40 shadow-lg">
                      {percentage}%
                    </div>

                    {/* Floating Planetary Telemetry Capsule Label */}
                    <div className="mt-2.5 flex flex-col items-center pointer-events-auto">
                      <div className="bg-[#06070B]/95 backdrop-blur-xl px-3 py-1 rounded-xl border border-white/15 text-center shadow-xl max-w-[180px]">
                        <span className="block font-bold text-white text-xs tracking-tight truncate">
                          {endeavor.title}
                        </span>
                        <div className="flex items-center justify-center space-x-1.5 mt-0.5 text-[9px] font-mono text-slate-400">
                          <span className="uppercase">{endeavor.category}</span>
                          <span>•</span>
                          <span>{endeavor.currentValue}/{endeavor.targetValue}</span>
                        </div>
                      </div>

                      {/* Hover / Selected Interactive Control Dock */}
                      {(isHovered || isSelected) && (
                        <div className="mt-2 flex items-center space-x-1 bg-[#06070B]/95 backdrop-blur-2xl p-1 rounded-xl border border-white/20 shadow-2xl animate-in fade-in zoom-in-95 duration-150 z-30">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onQuickLog(endeavor, 1);
                              confetti({ particleCount: 25, spread: 40, origin: { y: 0.8 } });
                            }}
                            className="flex items-center space-x-1 px-2 py-1 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-[10px] uppercase shadow-xs active:scale-95 transition cursor-pointer"
                          >
                            <Plus className="w-3 h-3 stroke-[2.5]" />
                            <span>Log</span>
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onStartFocus(endeavor);
                            }}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-amber-300 border border-white/10 text-[10px] active:scale-95 transition cursor-pointer"
                            title="Launch Focus Sprint"
                          >
                            <Timer className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePinNode(endeavor.id);
                            }}
                            className={`p-1.5 rounded-lg transition cursor-pointer ${
                              pos.fixed ? "text-emerald-400 bg-emerald-500/20 border border-emerald-500/40" : "text-slate-400 hover:text-white bg-white/5 border border-white/10"
                            }`}
                            title={pos.fixed ? "Unpin Sphere" : "Pin Sphere Position"}
                          >
                            {pos.fixed ? <Pin className="w-3.5 h-3.5" /> : <PinOff className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenDetail(endeavor);
                            }}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-[10px] active:scale-95 transition cursor-pointer"
                            title="Mission Details"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* DETAILED GLASS CARD NODE */
                  <div
                    className={`w-[220px] p-3 rounded-2xl bg-[#06070B]/95 backdrop-blur-2xl border shadow-2xl transition-all duration-200 group/card relative ${
                      isLinkingSource
                        ? "border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.5)] animate-pulse"
                        : isSelected
                        ? "border-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.4)] ring-1 ring-emerald-400"
                        : "border-white/15 hover:border-white/30"
                    }`}
                    style={{
                      borderLeftWidth: "4px",
                      borderLeftColor: endeavor.color || "#10b981",
                    }}
                  >
                    {/* Header: Icon, Category & Pin */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-7 h-7 rounded-xl flex items-center justify-center text-black font-bold text-xs shadow-md"
                          style={{ backgroundColor: endeavor.color || "#10b981" }}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate max-w-[90px]">
                          {endeavor.category}
                        </span>
                      </div>

                      <div className="flex items-center space-x-1">
                        {endeavor.streakCount > 0 && (
                          <span className="flex items-center space-x-0.5 text-[9px] font-bold text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                            <Flame className="w-2.5 h-2.5 text-amber-400 fill-current" />
                            <span>{endeavor.streakCount}d</span>
                          </span>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePinNode(endeavor.id);
                          }}
                          className={`p-1 rounded-md transition cursor-pointer ${
                            pos.fixed ? "text-emerald-400 bg-emerald-500/20" : "text-slate-500 hover:text-slate-300"
                          }`}
                          title={pos.fixed ? "Unpin Node (Allow Physics Motion)" : "Pin Node to Position"}
                        >
                          {pos.fixed ? <Pin className="w-3 h-3" /> : <PinOff className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>

                    {/* Title */}
                    <h4 className="font-bold text-white text-xs tracking-tight mt-2 truncate">
                      {endeavor.title}
                    </h4>

                    {/* Progress Bar & Telemetry */}
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between text-[9px] text-slate-400">
                        <span>{percentage}%</span>
                        <span>
                          {endeavor.currentValue} / {endeavor.targetValue} {endeavor.unit}
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: endeavor.color || "#10b981",
                          }}
                        />
                      </div>
                    </div>

                    {/* Quick Action Overlay (Visible on hover or selected) */}
                    <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickLog(endeavor, 1);
                          confetti({ particleCount: 25, spread: 40, origin: { y: 0.8 } });
                        }}
                        className="flex items-center space-x-1 px-2 py-1 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-[10px] uppercase shadow-xs active:scale-95 transition cursor-pointer"
                      >
                        <Plus className="w-3 h-3 stroke-[2.5]" />
                        <span>Log</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onStartFocus(endeavor);
                        }}
                        className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-amber-300 border border-white/10 text-[10px] active:scale-95 transition cursor-pointer"
                        title="Launch Focus Sprint"
                      >
                        <Timer className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenDetail(endeavor);
                        }}
                        className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-[10px] active:scale-95 transition cursor-pointer"
                        title="Mission Details"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Physics Controls Side Drawer */}
      <AnimatePresence>
        {isControlsOpen && (
          <motion.div
            initial={{ opacity: 0, x: 260 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 260 }}
            className="absolute top-16 right-4 bottom-16 z-30 w-72 bg-[#06070B]/95 backdrop-blur-3xl rounded-3xl border border-white/15 shadow-[0_0_50px_rgba(0,0,0,0.9)] p-5 overflow-y-auto font-mono text-xs space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="font-extrabold text-white uppercase tracking-wider flex items-center space-x-1.5">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span>Sandbox Physics</span>
              </span>
              <button
                onClick={() => setIsControlsOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            {/* Gravity Master Toggle */}
            <div className="flex items-center justify-between bg-white/5 p-3 rounded-2xl border border-white/10">
              <div>
                <span className="font-bold text-white block">Celestial Gravity</span>
                <span className="text-[10px] text-slate-400">Orbital physics forces</span>
              </div>
              <button
                onClick={() =>
                  setSettings((prev) => ({ ...prev, gravityEnabled: !prev.gravityEnabled }))
                }
                className={`w-10 h-6 rounded-full p-1 transition cursor-pointer ${
                  settings.gravityEnabled ? "bg-emerald-400" : "bg-white/20"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-black transition-transform ${
                    settings.gravityEnabled ? "translate-x-4" : ""
                  }`}
                />
              </button>
            </div>

            {/* Gravity Strength Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] text-slate-300">
                <span>Central Core Pull</span>
                <span className="font-bold text-emerald-400">
                  {Math.round(settings.gravityStrength * 1000)}
                </span>
              </div>
              <input
                type="range"
                min="0.01"
                max="0.15"
                step="0.01"
                value={settings.gravityStrength}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    gravityStrength: parseFloat(e.target.value),
                  }))
                }
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>

            {/* Node Repulsion Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] text-slate-300">
                <span>Node Repulsion</span>
                <span className="font-bold text-cyan-400">{settings.repulsionStrength}</span>
              </div>
              <input
                type="range"
                min="20"
                max="200"
                step="5"
                value={settings.repulsionStrength}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    repulsionStrength: parseInt(e.target.value),
                  }))
                }
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* Grid & Constellation Display Toggles */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <label className="flex items-center justify-between text-[11px] text-slate-300 cursor-pointer">
                <span>Show Starfield Grid</span>
                <input
                  type="checkbox"
                  checked={settings.showGrid}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, showGrid: e.target.checked }))
                  }
                  className="accent-emerald-400 rounded"
                />
              </label>

              <label className="flex items-center justify-between text-[11px] text-slate-300 cursor-pointer">
                <span>Orbit Center Pull</span>
                <input
                  type="checkbox"
                  checked={settings.orbitCenterPull}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, orbitCenterPull: e.target.checked }))
                  }
                  className="accent-emerald-400 rounded"
                />
              </label>
            </div>

            {/* Clear All Connections Button */}
            <div className="pt-2">
              <button
                onClick={() => {
                  setConnections([]);
                  focusAudio.playClick();
                }}
                className="w-full py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl text-[10px] font-bold uppercase transition cursor-pointer"
              >
                Clear Constellations
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Status Hint Bar */}
      <div className="absolute bottom-3 left-4 right-4 z-20 flex items-center justify-between pointer-events-none text-[10px] text-slate-500">
        <div className="flex items-center space-x-3 pointer-events-auto bg-[#06070B]/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
          <span>💡 Double click canvas to drop sticky note</span>
          <span>•</span>
          <span>Scroll to Zoom</span>
          <span>•</span>
          <span>Drag canvas to Pan</span>
        </div>

        <div className="flex items-center space-x-2 pointer-events-auto bg-[#06070B]/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-emerald-400">
          <Activity className="w-3 h-3 animate-pulse" />
          <span>REAL-TIME PHYSICS ENGINE ACTIVE</span>
        </div>
      </div>
    </div>
  );
};
