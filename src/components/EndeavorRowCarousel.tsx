import React, { useRef, useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Flame,
  Layers,
  Sparkles,
  Zap,
  CheckCircle2,
  Target,
  ArrowRight,
} from "lucide-react";
import { Endeavor } from "../types";
import { EndeavorCard } from "./EndeavorCard";

interface EndeavorRowCarouselProps {
  title: string;
  subtitle?: string;
  icon?: React.FC<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
  endeavors: Endeavor[];
  onQuickLog: (endeavor: Endeavor, value: number, note?: string) => void;
  onOpenLogModal: (endeavor: Endeavor) => void;
  onToggleMilestone: (endeavorId: string, milestoneId: string) => void;
  onStartFocus: (endeavor: Endeavor) => void;
  onEdit: (endeavor: Endeavor) => void;
  onDelete: (endeavorId: string) => void;
  onOpenDetail?: (endeavor: Endeavor) => void;
  onViewAll?: () => void;
}

export const EndeavorRowCarousel: React.FC<EndeavorRowCarouselProps> = ({
  title,
  subtitle,
  icon: Icon = Layers,
  badge,
  badgeColor = "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  endeavors,
  onQuickLog,
  onOpenLogModal,
  onToggleMilestone,
  onStartFocus,
  onEdit,
  onDelete,
  onOpenDetail,
  onViewAll,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [endeavors]);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -420 : 420;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      setTimeout(checkScroll, 300);
    }
  };

  if (endeavors.length === 0) return null;

  return (
    <section className="space-y-3.5 relative group/carousel">
      {/* Row Header (Netflix / Prime style) */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/15 text-white flex items-center justify-center shadow-[0_0_15px_rgba(52,211,153,0.15)] shrink-0">
            <Icon className="w-4 h-4 text-emerald-400 stroke-[2.2] drop-shadow-[0_0_6px_rgba(52,211,153,0.5)]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base sm:text-lg font-display font-bold text-white tracking-tight">
                {title}
              </h3>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/10">
                {endeavors.length}
              </span>
              {badge && (
                <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border shadow-xs ${badgeColor}`}>
                  {badge}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-slate-400 mt-0.5 font-sans">{subtitle}</p>
            )}
          </div>
        </div>

        {/* View All button */}
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="flex items-center space-x-1 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition cursor-pointer"
          >
            <span>Explore All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Horizontal Carousel Container with Left/Right Scroll Arrows */}
      <div className="relative">
        {/* Left Arrow Button */}
        {canScrollLeft && (
          <button
            onClick={() => handleScroll("left")}
            className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#06070B]/90 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-2xl hover:bg-white/20 active:scale-90 transition cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Scrollable Track */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="flex space-x-4 overflow-x-auto pb-3 pt-1 px-1 scroll-smooth scrollbar-none snap-x"
        >
          {endeavors.map((endeavor) => (
            <div
              key={endeavor.id}
              className="w-[310px] sm:w-[340px] shrink-0 snap-start h-full"
            >
              <EndeavorCard
                endeavor={endeavor}
                onQuickLog={onQuickLog}
                onOpenLogModal={onOpenLogModal}
                onToggleMilestone={onToggleMilestone}
                onStartFocus={onStartFocus}
                onEdit={onEdit}
                onDelete={onDelete}
                onOpenDetail={onOpenDetail}
              />
            </div>
          ))}
        </div>

        {/* Right Arrow Button */}
        {canScrollRight && (
          <button
            onClick={() => handleScroll("right")}
            className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#06070B]/90 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-2xl hover:bg-white/20 active:scale-90 transition cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </section>
  );
};
