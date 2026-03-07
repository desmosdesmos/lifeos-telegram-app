import { motion } from 'motion/react';
import type { LucideIcon } from 'lucide-react';

interface SystemCardProps {
  name: string;
  score: number;
  icon: LucideIcon;
  color: string;
  trend?: string;
  onClick?: () => void;
}

export function SystemCard({ name, score, icon: Icon, color, trend, onClick }: SystemCardProps) {
  const isPositiveTrend = trend ? trend.startsWith('+') : true;

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className="glass-card rounded-[24px] p-5 text-left relative overflow-hidden group w-full"
    >
      {/* Hover gradient effect */}
      <div
        className="absolute top-0 right-0 w-28 h-28 rounded-full blur-[60px] opacity-0 group-active:opacity-30 transition-opacity duration-300"
        style={{ backgroundColor: color }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div
            className="w-11 h-11 rounded-[14px] flex items-center justify-center backdrop-blur-xl"
            style={{ backgroundColor: `${color}15` }}
          >
            <Icon className="w-5 h-5" style={{ color }} strokeWidth={2.5} />
          </div>
          {trend && (
            <div className={`px-2 py-0.5 rounded-full text-[10px] ${
              isPositiveTrend ? 'bg-[#22C55E]/15 text-[#22C55E]' : 'bg-[#F59E0B]/15 text-[#F59E0B]'
            }`}>
              {trend}
            </div>
          )}
        </div>

        <p className="text-white/50 text-xs mb-1.5 tracking-wide">{name}</p>
        <div className="flex items-end gap-1">
          <p className="text-3xl leading-none tracking-tight">{score}</p>
          <p className="text-lg text-white/30 mb-0.5">/100</p>
        </div>

        {/* Mini progress bar */}
        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1 }}
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
          />
        </div>
      </div>
    </motion.button>
  );
}
