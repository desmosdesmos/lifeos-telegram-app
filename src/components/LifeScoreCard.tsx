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
      initial={{ opacity: 0, scale: 0.92, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className="glass-card rounded-[32px] p-7 mb-5 relative overflow-hidden glow-blue"
    >
      {/* Animated background gradient orbs */}
      <motion.div
        className="absolute -top-20 -right-20 w-56 h-56 bg-gradient-to-br from-[#4DA3FF]/30 to-[#22C55E]/20 rounded-full blur-[100px]"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3],
          rotate: [0, 180, 360]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute -bottom-20 -left-20 w-48 h-48 bg-gradient-to-tr from-[#22C55E]/25 to-[#4DA3FF]/15 rounded-full blur-[80px]"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
          rotate: [360, 180, 0]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />

      <div className="relative z-10">
        <motion.div
          className="flex items-center gap-2.5 mb-4"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            className="w-2.5 h-2.5 rounded-full bg-[#22C55E]"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <p className="text-white/50 text-sm tracking-wide uppercase font-medium">{title}</p>
        </motion.div>

        <div className="flex items-end gap-3 mb-6">
          <motion.span
            className="text-7xl tracking-tighter leading-none font-bold glow-text-blue"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
          >
            {score}
          </motion.span>
          <div className="mb-2">
            <span className="text-3xl text-white/30">/</span>
            <span className="text-3xl text-white/30 ml-1">100</span>
          </div>
          <motion.div
            className="mb-3 ml-2 px-3 py-1.5 rounded-full bg-[#22C55E]/20 flex items-center gap-1.5 glow-green"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: 'spring' }}
          >
            <TrendingUp className="w-4 h-4 text-[#22C55E]" />
            <span className="text-[#22C55E] text-xs font-semibold">{trend}</span>
          </motion.div>
        </div>

        {/* Progress bar with shimmer */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden progress-track">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              transition={{ duration: 1.8, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="h-full bg-gradient-to-r from-[#4DA3FF] via-[#22C55E] to-[#22C55E] rounded-full progress-fill glow-blue"
            />
          </div>
        </motion.div>

        <motion.div
          className="flex items-center justify-between mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-white/40 text-xs">{subtitle}</p>
          <motion.p
            className={`text-xs font-semibold ${
              score >= 80 ? 'text-[#22C55E]' : score >= 60 ? 'text-[#4DA3FF]' : 'text-[#F59E0B]'
            }`}
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {score >= 80 ? '✦ Отлично' : score >= 60 ? '◇ Хорошо' : '○ Нужно работать'}
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
}
