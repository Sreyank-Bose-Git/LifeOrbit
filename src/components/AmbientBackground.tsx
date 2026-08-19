import React, { useEffect, useRef } from "react";
import { BackgroundAnimationMode, ThemeAccent } from "../types";
import { motion } from "motion/react";

interface AmbientBackgroundProps {
  mode: BackgroundAnimationMode;
  accent: ThemeAccent;
}

export const AmbientBackground: React.FC<AmbientBackgroundProps> = ({ mode, accent }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Accent color map
  const colorMap: Record<ThemeAccent, { primary: string; secondary: string; glow: string; particle: string; cyber: string }> = {
    emerald: {
      primary: "rgba(16, 185, 129, 0.14)",
      secondary: "rgba(5, 150, 105, 0.09)",
      glow: "rgba(16, 185, 129, 0.06)",
      particle: "rgba(52, 211, 153, 0.45)",
      cyber: "#10b981",
    },
    violet: {
      primary: "rgba(139, 92, 246, 0.15)",
      secondary: "rgba(99, 102, 241, 0.10)",
      glow: "rgba(168, 85, 247, 0.07)",
      particle: "rgba(192, 132, 252, 0.45)",
      cyber: "#8b5cf6",
    },
    amber: {
      primary: "rgba(245, 158, 11, 0.14)",
      secondary: "rgba(217, 119, 6, 0.09)",
      glow: "rgba(251, 191, 36, 0.06)",
      particle: "rgba(252, 211, 77, 0.45)",
      cyber: "#f59e0b",
    },
    cyan: {
      primary: "rgba(6, 182, 212, 0.14)",
      secondary: "rgba(14, 165, 233, 0.09)",
      glow: "rgba(34, 211, 238, 0.06)",
      particle: "rgba(103, 232, 249, 0.45)",
      cyber: "#06b6d4",
    },
    rose: {
      primary: "rgba(244, 63, 94, 0.14)",
      secondary: "rgba(225, 29, 72, 0.09)",
      glow: "rgba(251, 113, 133, 0.06)",
      particle: "rgba(253, 164, 175, 0.45)",
      cyber: "#f43f5e",
    },
    slate: {
      primary: "rgba(148, 163, 184, 0.11)",
      secondary: "rgba(100, 116, 139, 0.07)",
      glow: "rgba(203, 213, 225, 0.05)",
      particle: "rgba(226, 232, 240, 0.35)",
      cyber: "#94a3b8",
    },
  };

  const themeColors = colorMap[accent] || colorMap.emerald;

  // Canvas particle starfield / constellation / cyber scan loop
  useEffect(() => {
    if (mode === "none") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Particle nodes
    const count = mode === "particles" ? 50 : mode === "cyberpunk" ? 35 : 25;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      color?: string;
    }> = [];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (mode === "cyberpunk" ? 0.8 : 0.4),
        vy: (Math.random() - 0.5) * (mode === "cyberpunk" ? 0.8 : 0.4),
        radius: Math.random() * 2 + 0.8,
        alpha: Math.random() * 0.6 + 0.2,
      });
    }

    let scanlineY = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Cyberpunk mode: draw neon perspective grid & moving laser scanline
      if (mode === "cyberpunk") {
        scanlineY = (scanlineY + 1.2) % height;

        // Draw glowing horizontal scan beam
        const gradient = ctx.createLinearGradient(0, scanlineY - 40, 0, scanlineY + 40);
        gradient.addColorStop(0, "transparent");
        gradient.addColorStop(0.5, themeColors.particle.replace("0.45", "0.08"));
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, scanlineY - 40, width, 80);

        // Thin laser line
        ctx.strokeStyle = themeColors.particle.replace("0.45", "0.25");
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, scanlineY);
        ctx.lineTo(width, scanlineY);
        ctx.stroke();
      }

      // Draw constellation connections
      if (mode === "particles" || mode === "mesh" || mode === "cyberpunk") {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 120) {
              const lineAlpha = (1 - dist / 120) * (mode === "cyberpunk" ? 0.2 : 0.15);
              ctx.strokeStyle = themeColors.particle.replace("0.45", String(lineAlpha));
              ctx.lineWidth = 0.75;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }
      }

      // Draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = themeColors.particle.replace("0.45", String(p.alpha));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [mode, accent, themeColors]);

  if (mode === "none") {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none" aria-hidden="true">
      {/* Aurora Ambient Mesh Glow Orbs */}
      {(mode === "aurora" || mode === "mesh" || mode === "cyberpunk") && (
        <div className="absolute inset-0">
          {/* Top-Right Orb */}
          <motion.div
            animate={{
              x: [0, 40, -20, 0],
              y: [0, -30, 20, 0],
              scale: [1, 1.15, 0.95, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              background: `radial-gradient(circle, ${themeColors.primary} 0%, transparent 70%)`,
            }}
            className="absolute -top-[15%] -right-[10%] w-[55vw] h-[55vw] max-w-[700px] max-h-[700px] rounded-full blur-[100px] opacity-75"
          />

          {/* Bottom-Left Orb */}
          <motion.div
            animate={{
              x: [0, -30, 30, 0],
              y: [0, 40, -20, 0],
              scale: [1, 0.9, 1.1, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              background: `radial-gradient(circle, ${themeColors.secondary} 0%, transparent 70%)`,
            }}
            className="absolute -bottom-[20%] -left-[10%] w-[60vw] h-[60vw] max-w-[750px] max-h-[750px] rounded-full blur-[120px] opacity-65"
          />

          {/* Center Subtle Accent Pulse */}
          <motion.div
            animate={{
              opacity: [0.3, 0.65, 0.3],
              scale: [0.95, 1.05, 0.95],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              background: `radial-gradient(circle, ${themeColors.glow} 0%, transparent 60%)`,
            }}
            className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full blur-[90px]"
          />
        </div>
      )}

      {/* Interactive / Constellation / Cyber Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Subtle Matrix Noise Grid Overlay */}
      <div
        className="absolute inset-0 opacity-[0.025] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"
        aria-hidden="true"
      />
    </div>
  );
};
