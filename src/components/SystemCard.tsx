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
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      onClick={onClick}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      className="glass-card rounded-[28px] p-5 text-left relative overflow-hidden group w-full"
    >
      {/* Animated gradient orb */}
      <motion.div
        className="absolute -top-10 -right-10 w-28 h-28 rounded-full blur-[60px] opacity-0 group-hover:opacity-40 transition-opacity duration-500"
        style={{ backgroundColor: color }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      
      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div 
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at top right, ${color}30, transparent 70%)`
          }}
        />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <motion.div
            className="w-12 h-12 rounded-[16px] flex items-center justify-center backdrop-blur-xl"
            style={{ backgroundColor: `${color}20` }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <Icon className="w-5 h-5" style={{ color }} strokeWidth={2.5} />
          </motion.div>
          {trend && (
            <motion.div 
              className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                isPositiveTrend ? 'bg-[#22C55E]/20 text-[#22C55E]' : 'bg-[#F59E0B]/20 text-[#F59E0B]'
              }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, delay: 0.2 }}
            >
              {trend}
            </motion.div>
          )}
        </div>

        <p className="text-white/50 text-xs mb-2 tracking-wide font-medium">{name}</p>
        <div className="flex items-end gap-1">
          <motion.p 
            className="text-3xl leading-none tracking-tight font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {score}
          </motion.p>
          <p className="text-lg text-white/30 mb-0.5">/100</p>
        </div>

        {/* Mini progress bar with glow */}
        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mt-3.5 progress-track">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
            className="h-full rounded-full progress-fill"
            style={{ 
              background: `linear-gradient(90deg, ${color}, ${color}aa)`,
              boxShadow: `0 0 10px ${color}80`
            }}
          />
        </div>
      </div>
    </motion.button>
  );
}
