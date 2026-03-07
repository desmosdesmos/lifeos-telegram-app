import { motion } from 'motion/react';
import { ChevronLeft, Plus, Scan } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';

const macros = [
  { name: 'Белки', current: 75, target: 120, unit: 'г', color: '#4DA3FF' },
  { name: 'Жиры', current: 45, target: 65, unit: 'г', color: '#F59E0B' },
  { name: 'Углеводы', current: 180, target: 250, unit: 'г', color: '#22C55E' },
];

const meals = [
  { id: 1, name: 'Овсянка с ягодами', calories: 320, protein: 12, fat: 8, carbs: 52, time: '08:30' },
  { id: 2, name: 'Куриная грудка с рисом', calories: 450, protein: 45, fat: 10, carbs: 55, time: '13:00' },
];

export function Nutrition() {
  const navigate = useNavigate();
  const [showAddMeal, setShowAddMeal] = useState(false);

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
        <h1 className="text-3xl">Питание</h1>
      </motion.div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => setShowAddMeal(true)}
          className="glass-card rounded-[16px] p-4 flex items-center gap-3 active:scale-95 transition-transform"
        >
          <div className="w-10 h-10 rounded-[10px] bg-[#4DA3FF]/20 flex items-center justify-center">
            <Plus className="w-5 h-5 text-[#4DA3FF]" />
          </div>
          <span className="text-sm">Добавить приём пищи</span>
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
          <span className="text-sm">Сканировать продукт</span>
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
          <p className="text-white/60 text-sm mb-2">Оценка питания</p>
          <div className="flex items-end gap-2">
            <span className="text-5xl tracking-tight">80</span>
            <span className="text-2xl text-white/40 mb-1">/ 100</span>
          </div>
        </div>
      </motion.div>

      {/* Daily Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-[24px] p-6 mb-6"
      >
        <h3 className="text-lg mb-4">За сегодня</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-white/50 text-xs mb-1">Калории</p>
            <p className="text-2xl font-bold">1,840</p>
            <p className="text-white/40 text-xs">из 2,200</p>
          </div>
          <div>
            <p className="text-white/50 text-xs mb-1">Белки</p>
            <p className="text-2xl font-bold text-[#4DA3FF]">75г</p>
            <p className="text-white/40 text-xs">из 120г</p>
          </div>
          <div>
            <p className="text-white/50 text-xs mb-1">Вода</p>
            <p className="text-2xl font-bold">1.2л</p>
            <p className="text-white/40 text-xs">из 2.5л</p>
          </div>
        </div>
      </motion.div>

      {/* Macros */}
      <div className="space-y-4 mb-6">
        <p className="text-white/60 text-sm px-1">Макронутриенты</p>

        {macros.map((macro, index) => {
          const percentage = (macro.current / macro.target) * 100;

          return (
            <motion.div
              key={macro.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.05 }}
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

      {/* Meals List */}
      <div className="space-y-3 mb-6">
        <p className="text-white/60 text-sm px-1">Приёмы пищи</p>
        
        {meals.map((meal, index) => (
          <motion.div
            key={meal.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.05 }}
            className="glass-card rounded-[20px] p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/90 font-medium">{meal.name}</span>
              <span className="text-white/40 text-xs">{meal.time}</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-white/50">
              <span>{meal.calories} ккал</span>
              <span>Б: {meal.protein}г</span>
              <span>Ж: {meal.fat}г</span>
              <span>У: {meal.carbs}г</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Meal Modal */}
      {showAddMeal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="glass-card rounded-t-[32px] w-full max-w-md p-6 pb-10"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl">Добавить приём пищи</h2>
              <button
                onClick={() => setShowAddMeal(false)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-white/60 text-sm mb-2 block">Название блюда</label>
                <input
                  type="text"
                  placeholder="Например: Овсянка с ягодами"
                  className="w-full glass-card rounded-[16px] px-4 py-3 bg-white/5 outline-none focus:ring-2 focus:ring-[#4DA3FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white/60 text-sm mb-2 block">Калории</label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full glass-card rounded-[16px] px-4 py-3 bg-white/5 outline-none focus:ring-2 focus:ring-[#4DA3FF]"
                  />
                </div>
                <div>
                  <label className="text-white/60 text-sm mb-2 block">Белки (г)</label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full glass-card rounded-[16px] px-4 py-3 bg-white/5 outline-none focus:ring-2 focus:ring-[#4DA3FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white/60 text-sm mb-2 block">Жиры (г)</label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full glass-card rounded-[16px] px-4 py-3 bg-white/5 outline-none focus:ring-2 focus:ring-[#4DA3FF]"
                  />
                </div>
                <div>
                  <label className="text-white/60 text-sm mb-2 block">Углеводы (г)</label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full glass-card rounded-[16px] px-4 py-3 bg-white/5 outline-none focus:ring-2 focus:ring-[#4DA3FF]"
                  />
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-[#4DA3FF] rounded-[20px] text-white font-medium mt-4"
                onClick={() => setShowAddMeal(false)}
              >
                Добавить
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
