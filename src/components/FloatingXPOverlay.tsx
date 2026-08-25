import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Zap, Flame } from "lucide-react";

export interface FloatingXPItem {
  id: string;
  x: number;
  y: number;
  amount: number;
  reason?: string;
  combo?: number;
}

interface FloatingXPOverlayProps {
  items: FloatingXPItem[];
}

export const FloatingXPOverlay: React.FC<FloatingXPOverlayProps> = ({ items }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-999 overflow-hidden">
      <AnimatePresence>
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{
              opacity: 0,
              scale: 0.5,
              x: item.x - 60,
              y: item.y - 20,
            }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0.5, 1.15, 1, 0.9],
              y: item.y - 95,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
            className="absolute select-none flex flex-col items-center drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]"
          >
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#06070B]/95 border border-amber-400/80 backdrop-blur-md shadow-[0_0_20px_rgba(251,191,36,0.6)]">
              {item.combo && item.combo > 1 ? (
                <Flame className="w-4 h-4 text-orange-400 animate-pulse fill-orange-400" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              )}
              <span className="text-sm font-black font-mono text-amber-300 tracking-wider">
                +{item.amount} XP
              </span>
              {item.combo && item.combo > 1 && (
                <span className="text-[10px] font-black font-mono px-1.5 py-0.5 rounded-md bg-orange-500/30 border border-orange-400/60 text-orange-300">
                  {item.combo}x COMBO
                </span>
              )}
            </div>
            {item.reason && (
              <span className="text-[10px] font-bold text-amber-200/90 font-mono mt-1 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-center max-w-[160px] truncate">
                {item.reason}
              </span>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
