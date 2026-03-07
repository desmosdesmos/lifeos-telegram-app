import { motion } from "motion/react";
import { ChevronLeft, Plus, Scan } from "lucide-react";
import { useNavigate } from "react-router";

const macros = [
  { name: "Protein", current: 75, target: 120, unit: "g", color: "#4DA3FF" },
  { name: "Fat", current: 45, target: 65, unit: "g", color: "#F59E0B" },
  { name: "Carbs", current: 180, target: 250, unit: "g", color: "#22C55E" },
];

export function Nutrition() {
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
          onClick={() => navigate("/app")}
          className="w-10 h-10 rounded-[12px] glass-card flex items-center justify-center active:scale-95 transition-transform"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-3xl">Nutrition</h1>
      </motion.div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-[16px] p-4 flex items-center gap-3 active:scale-95 transition-transform"
        >
          <div className="w-10 h-10 rounded-[10px] bg-[#4DA3FF]/20 flex items-center justify-center">
            <Plus className="w-5 h-5 text-[#4DA3FF]" />
          </div>
          <span className="text-sm">Add meal</span>
        </motion.button>

        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-[16px] p-4 flex items-center gap-3 active:scale-95 transition-transform"
        >
          <div className="w-10 h-10 rounded-[10px] bg-[#22C55E]/20 flex items-center justify-center">
            <Scan className="w-5 h-5 text-[#22C55E]" />
          </div>
          <span className="text-sm">Scan food</span>
        </motion.button>
      </div>

      {/* Nutrition Score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-[24px] p-6 mb-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#22C55E]/10 rounded-full blur-[60px]" />
        
        <div className="relative z-10">
          <p className="text-white/60 text-sm mb-2">Nutrition Score</p>
          <div className="flex items-end gap-2">
            <span className="text-5xl tracking-tight">80</span>
            <span className="text-2xl text-white/40 mb-1">/ 100</span>
          </div>
        </div>
      </motion.div>

      {/* Macros */}
      <div className="space-y-4">
        <p className="text-white/60 text-sm">Daily Macros</p>
        
        {macros.map((macro, index) => {
          const percentage = (macro.current / macro.target) * 100;
          
          return (
            <motion.div
              key={macro.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              className="glass-card rounded-[20px] p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-white/90">{macro.name}</span>
                <span className="text-white/60 text-sm">
                  {macro.current} / {macro.target} {macro.unit}
                </span>
              </div>
              
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, delay: 0.4 + index * 0.05 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: macro.color }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
