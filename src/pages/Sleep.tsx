import { motion } from 'motion/react';
import { ChevronLeft, Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router';

export function Sleep() {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-[#0B0B0F] px-6 pt-12 pb-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center gap-3"
      >
        <button
          onClick={() => navigate('/')}
          className="w-10 h-10 rounded-[12px] glass-card flex items-center justify-center active:scale-95 transition-transform"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-3xl">Sleep</h1>
      </motion.div>

      {/* Sleep Score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-[24px] p-6 mb-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#4DA3FF]/10 rounded-full blur-[60px]" />

        <div className="relative z-10">
          <p className="text-white/60 text-sm mb-2">Sleep Score</p>
          <div className="flex items-end gap-2">
            <span className="text-5xl tracking-tight">65</span>
            <span className="text-2xl text-white/40 mb-1">/ 100</span>
          </div>
        </div>
      </motion.div>

      {/* Sleep Duration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-[24px] p-6 mb-6 text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-[#4DA3FF]/10 rounded-full blur-[80px]" />

        <div className="relative z-10">
          <p className="text-white/60 text-sm mb-3">Total Sleep</p>
          <div className="text-5xl mb-1 tracking-tight">7h 10m</div>
          <p className="text-white/40 text-xs">Last night</p>
        </div>
      </motion.div>

      {/* Sleep Times */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-[20px] p-5 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#F59E0B]/10 rounded-full blur-[50px]" />

          <div className="relative z-10">
            <div className="w-10 h-10 rounded-[12px] bg-[#F59E0B]/20 flex items-center justify-center mb-3">
              <Moon className="w-5 h-5 text-[#F59E0B]" />
            </div>
            <p className="text-white/60 text-xs mb-1">Bedtime</p>
            <p className="text-2xl">23:30</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-[20px] p-5 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#22C55E]/10 rounded-full blur-[50px]" />

          <div className="relative z-10">
            <div className="w-10 h-10 rounded-[12px] bg-[#22C55E]/20 flex items-center justify-center mb-3">
              <Sun className="w-5 h-5 text-[#22C55E]" />
            </div>
            <p className="text-white/60 text-xs mb-1">Wake Time</p>
            <p className="text-2xl">06:40</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
