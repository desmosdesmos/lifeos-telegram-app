import { motion } from 'motion/react';
import { TrendingUp } from 'lucide-react';

interface LifeScoreCardProps {
  score: number;
  trend?: string;
  title?: string;
  subtitle?: string;
}

export function LifeScoreCard({ score, trend = '+8%', title = 'System Status', subtitle = 'Overall Balance' }: LifeScoreCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card rounded-[28px] p-7 mb-5 relative overflow-hidden"
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#4DA3FF]/20 to-[#22C55E]/10 rounded-full blur-[80px]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
          <p className="text-white/50 text-sm tracking-wide uppercase">{title}</p>
        </div>

        <div className="flex items-end gap-3 mb-5">
          <span className="text-7xl tracking-tighter leading-none">{score}</span>
          <div className="mb-2">
            <span className="text-3xl text-white/30">/</span>
            <span className="text-3xl text-white/30 ml-1">100</span>
          </div>
          <div className="mb-3 ml-2 px-2.5 py-1 rounded-full bg-[#22C55E]/20 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-[#22C55E]" />
            <span className="text-[#22C55E] text-xs">{trend}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative">
          <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden backdrop-blur-sm">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-[#4DA3FF] via-[#22C55E] to-[#22C55E] rounded-full relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse" />
            </motion.div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          <p className="text-white/40 text-xs">{subtitle}</p>
          <p className="text-white/40 text-xs">
            {score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Work'}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
