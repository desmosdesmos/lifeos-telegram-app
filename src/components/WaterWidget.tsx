import { motion } from 'motion/react';
import { Droplets, Plus, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useMemo } from 'react';

export function WaterWidget() {
  const { state, addWater, resetWater } = useApp();
  
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  
  const todayWater = useMemo(() => {
    return (state.waterLogs || [])
      .filter(w => w.date === today)
      .reduce((sum, w) => sum + w.amount, 0);
  }, [state.waterLogs, today]);

  const target = 2000; // 2 Liters goal
  const percentage = Math.min(100, Math.round((todayWater / target) * 100));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-[32px] p-6 mb-8 relative overflow-hidden bg-gradient-to-br from-[#4DA3FF]/10 to-transparent border border-white/10"
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#4DA3FF]/20 flex items-center justify-center">
            <Droplets className="w-5 h-5 text-[#4DA3FF]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white/90">Водный баланс</h3>
            <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Цель: 2.0л</p>
          </div>
        </div>
        <button 
          onClick={resetWater}
          className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center active:rotate-[-45deg] transition-transform"
        >
          <RotateCcw className="w-4 h-4 text-white/20" />
        </button>
      </div>

      <div className="flex items-center gap-6 mb-6">
        <div className="relative w-24 h-24 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-white/5"
            />
            <motion.circle
              cx="48"
              cy="48"
              r="40"
              stroke="#4DA3FF"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={251.2}
              initial={{ strokeDashoffset: 251.2 }}
              animate={{ strokeDashoffset: 251.2 - (251.2 * percentage) / 100 }}
              transition={{ duration: 1, ease: "easeOut" }}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold">{percentage}%</span>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-3xl font-bold">{(todayWater / 1000).toFixed(1)}</span>
            <span className="text-sm text-white/40 font-medium">л</span>
          </div>
          <p className="text-xs text-white/40">Осталось {(Math.max(0, target - todayWater) / 1000).toFixed(1)}л</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => addWater(250)}
          className="py-3 bg-[#4DA3FF] rounded-2xl text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#4DA3FF]/20"
        >
          <Plus className="w-4 h-4" />
          250 мл
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => addWater(500)}
          className="py-3 glass-card rounded-2xl text-white font-bold flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          500 мл
        </motion.button>
      </div>
    </motion.div>
  );
}
