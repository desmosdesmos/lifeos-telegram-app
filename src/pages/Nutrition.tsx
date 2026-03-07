import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Plus, Scan, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { useApp } from '../context/AppContext';

const macrosTargets = [
  { name: 'Белки', target: 120, unit: 'г', color: '#4DA3FF' },
  { name: 'Жиры', target: 65, unit: 'г', color: '#F59E0B' },
  { name: 'Углеводы', target: 250, unit: 'г', color: '#22C55E' },
];

export function Nutrition() {
  const navigate = useNavigate();
  const { state, addMeal, removeMeal } = useApp();
  const [showAddMeal, setShowAddMeal] = useState(false);

  // Calculate totals
  const totalCalories = state.meals.reduce((sum, m) => sum + m.calories, 0);
  const totalProtein = state.meals.reduce((sum, m) => sum + m.protein, 0);
  const totalFat = state.meals.reduce((sum, m) => sum + m.fat, 0);
  const totalCarbs = state.meals.reduce((sum, m) => sum + m.carbs, 0);

  const nutritionScore = Math.min(100, Math.round((state.meals.length / 3) * 50 + (totalProtein / 120) * 50));

  return (
    <div className="w-full min-h-screen bg-[#0B0B0F] px-6 pt-12 pb-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="w-10 h-10 rounded-[12px] glass-card flex items-center justify-center active:scale-95 transition-transform"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl">Питание</h1>
        </div>
        
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddMeal(true)}
          className="w-11 h-11 rounded-[14px] bg-[#4DA3FF] flex items-center justify-center text-white"
        >
          <Plus className="w-5 h-5" />
        </motion.button>
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
          <span className="text-sm">Добавить еду</span>
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
          <span className="text-sm">Сканировать</span>
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
            <span className="text-5xl tracking-tight">{nutritionScore}</span>
            <span className="text-2xl text-white/40 mb-1">/ 100</span>
          </div>
          <p className="text-white/50 text-xs mt-2">
            {state.meals.length} приём(ов) пищи за сегодня
          </p>
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
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 rounded-[16px] bg-white/5">
            <p className="text-white/50 text-xs mb-1">Калории</p>
            <p className="text-2xl font-bold">{totalCalories}</p>
            <p className="text-white/40 text-xs">ккал</p>
          </div>
          <div className="text-center p-4 rounded-[16px] bg-white/5">
            <p className="text-white/50 text-xs mb-1">Белки</p>
            <p className="text-2xl font-bold text-[#4DA3FF]">{totalProtein}г</p>
            <p className="text-white/40 text-xs">из 120г</p>
          </div>
          <div className="text-center p-4 rounded-[16px] bg-white/5">
            <p className="text-white/50 text-xs mb-1">Жиры</p>
            <p className="text-2xl font-bold text-[#F59E0B]">{totalFat}г</p>
            <p className="text-white/40 text-xs">из 65г</p>
          </div>
          <div className="text-center p-4 rounded-[16px] bg-white/5">
            <p className="text-white/50 text-xs mb-1">Углеводы</p>
            <p className="text-2xl font-bold text-[#22C55E]">{totalCarbs}г</p>
            <p className="text-white/40 text-xs">из 250г</p>
          </div>
        </div>
      </motion.div>

      {/* Macros */}
      <div className="space-y-4 mb-6">
        <p className="text-white/60 text-sm px-1">Макронутриенты</p>

        {macrosTargets.map((macro, index) => {
          const current = index === 0 ? totalProtein : index === 1 ? totalFat : totalCarbs;
          const percentage = Math.min(100, (current / macro.target) * 100);

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
                  {current} / {macro.target} {macro.unit}
                </span>
              </div>

              <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
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
        <div className="flex items-center justify-between px-1">
          <p className="text-white/60 text-sm">Приёмы пищи</p>
          <button 
            onClick={() => setShowAddMeal(true)}
            className="text-[#4DA3FF] text-sm flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Добавить
          </button>
        </div>

        {state.meals.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card rounded-[20px] p-8 text-center"
          >
            <div className="w-16 h-16 rounded-[20px] bg-[#4DA3FF]/20 flex items-center justify-center mx-auto mb-4">
              <Apple className="w-8 h-8 text-[#4DA3FF]" />
            </div>
            <p className="text-white/70 mb-2">Нет записей о приёмах пищи</p>
            <p className="text-white/40 text-sm mb-4">Добавьте первый приём пищи</p>
            <button
              onClick={() => setShowAddMeal(true)}
              className="px-6 py-3 bg-[#4DA3FF] rounded-[16px] text-white font-medium"
            >
              Добавить еду
            </button>
          </motion.div>
        ) : (
          state.meals.map((meal, index) => (
            <motion.div
              key={meal.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.05 }}
              className="glass-card rounded-[20px] p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex-1">
                  <p className="text-white/90 font-medium">{meal.name}</p>
                  <p className="text-white/40 text-xs">{meal.time}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-lg font-bold">{meal.calories}</p>
                    <p className="text-white/40 text-xs">ккал</p>
                  </div>
                  <button
                    onClick={() => removeMeal(meal.id)}
                    className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center hover:bg-red-500/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-white/50">
                <span>Б: {meal.protein}г</span>
                <span>Ж: {meal.fat}г</span>
                <span>У: {meal.carbs}г</span>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add Meal Modal */}
      <AnimatePresence>
        {showAddMeal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowAddMeal(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card rounded-t-[32px] w-full max-w-md p-6 pb-10 max-h-[90vh] overflow-y-auto"
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

              <AddMealForm
                onAdd={(meal) => {
                  addMeal(meal);
                  setShowAddMeal(false);
                }}
                onCancel={() => setShowAddMeal(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AddMealForm({ onAdd, onCancel }: { onAdd: (meal: any) => void; onCancel: () => void }) {
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [fat, setFat] = useState('');
  const [carbs, setCarbs] = useState('');

  const handleSubmit = () => {
    if (!name || !calories) return;
    
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    onAdd({
      name,
      calories: Number(calories),
      protein: Number(protein) || 0,
      fat: Number(fat) || 0,
      carbs: Number(carbs) || 0,
      time,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-white/60 text-sm mb-2 block">Название блюда</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Например: Овсянка с ягодами"
          className="w-full glass-card rounded-[16px] px-4 py-3 bg-white/5 outline-none focus:ring-2 focus:ring-[#4DA3FF]"
        />
      </div>

      <div>
        <label className="text-white/60 text-sm mb-2 block">Калории</label>
        <input
          type="number"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
          placeholder="0"
          className="w-full glass-card rounded-[16px] px-4 py-3 bg-white/5 outline-none focus:ring-2 focus:ring-[#4DA3FF]"
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-white/60 text-sm mb-2 block">Белки (г)</label>
          <input
            type="number"
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
            placeholder="0"
            className="w-full glass-card rounded-[16px] px-4 py-3 bg-white/5 outline-none focus:ring-2 focus:ring-[#4DA3FF]"
          />
        </div>
        <div>
          <label className="text-white/60 text-sm mb-2 block">Жиры (г)</label>
          <input
            type="number"
            value={fat}
            onChange={(e) => setFat(e.target.value)}
            placeholder="0"
            className="w-full glass-card rounded-[16px] px-4 py-3 bg-white/5 outline-none focus:ring-2 focus:ring-[#4DA3FF]"
          />
        </div>
        <div>
          <label className="text-white/60 text-sm mb-2 block">Углеводы (г)</label>
          <input
            type="number"
            value={carbs}
            onChange={(e) => setCarbs(e.target.value)}
            placeholder="0"
            className="w-full glass-card rounded-[16px] px-4 py-3 bg-white/5 outline-none focus:ring-2 focus:ring-[#4DA3FF]"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={onCancel}
          className="flex-1 py-4 glass-card rounded-[20px] text-white font-medium"
        >
          Отмена
        </button>
        <button
          onClick={handleSubmit}
          className="flex-1 py-4 bg-[#4DA3FF] rounded-[20px] text-white font-medium"
        >
          Добавить
        </button>
      </div>
    </div>
  );
}

function Apple({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  );
}
