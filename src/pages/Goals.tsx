import { motion } from 'motion/react';
import { ChevronLeft, Target, Check, Plus, Calendar, Trophy, Flame } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';

interface Goal {
  id: number;
  title: string;
  description: string;
  progress: number;
  target: number;
  unit: string;
  deadline: string;
  category: 'health' | 'fitness' | 'finance' | 'learning';
  completed: boolean;
}

const initialGoals: Goal[] = [
  {
    id: 1,
    title: 'Похудеть до 70 кг',
    description: 'Снизить вес с 75 кг до 70 кг для улучшения здоровья',
    progress: 5,
    target: 5,
    unit: 'кг',
    deadline: '1 мая 2026',
    category: 'health',
    completed: false,
  },
  {
    id: 2,
    title: 'Накопить 500 000 ₽',
    description: 'Финансовая подушка безопасности на 6 месяцев',
    progress: 127000,
    target: 500000,
    unit: '₽',
    deadline: '1 дек 2026',
    category: 'finance',
    completed: false,
  },
  {
    id: 3,
    title: 'Пробежать полумарафон',
    description: 'Подготовиться и пробежать 21.1 км',
    progress: 1,
    target: 3,
    unit: 'тренировки/нед',
    deadline: '15 июн 2026',
    category: 'fitness',
    completed: false,
  },
  {
    id: 4,
    title: 'Прочитать 24 книги',
    description: '2 книги в месяц для саморазвития',
    progress: 3,
    target: 24,
    unit: 'книг',
    deadline: '31 дек 2026',
    category: 'learning',
    completed: false,
  },
];

const categoryColors = {
  health: '#EF4444',
  fitness: '#F59E0B',
  finance: '#22C55E',
  learning: '#4DA3FF',
};

const categoryIcons = {
  health: Flame,
  fitness: Trophy,
  finance: Target,
  learning: Calendar,
};

export function Goals() {
  const navigate = useNavigate();
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [showAddGoal, setShowAddGoal] = useState(false);

  const toggleGoalComplete = (id: number) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { ...goal, completed: !goal.completed } : goal
    ));
  };

  const completedCount = goals.filter(g => g.completed).length;
  const totalCount = goals.length;

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
          <h1 className="text-3xl">Цели</h1>
        </div>
        
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddGoal(true)}
          className="w-11 h-11 rounded-[14px] bg-[#4DA3FF] flex items-center justify-center text-white"
        >
          <Plus className="w-5 h-5" />
        </motion.button>
      </motion.div>

      {/* Progress Summary */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-[24px] p-6 mb-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#4DA3FF]/10 rounded-full blur-[60px]" />

        <div className="relative z-10">
          <p className="text-white/60 text-sm mb-4">Общий прогресс</p>
          
          <div className="flex items-end gap-3 mb-4">
            <span className="text-5xl tracking-tight">{completedCount}</span>
            <span className="text-2xl text-white/40 mb-1">/ {totalCount}</span>
          </div>

          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden mb-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / totalCount) * 100}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-full bg-gradient-to-r from-[#4DA3FF] to-[#22C55E] rounded-full"
            />
          </div>
          <p className="text-white/40 text-xs">
            {Math.round((completedCount / totalCount) * 100)}% целей выполнено
          </p>
        </div>
      </motion.div>

      {/* Active Goals */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between px-1">
          <p className="text-white/60 text-sm">Активные цели</p>
          <span className="text-white/40 text-sm">{totalCount - completedCount}</span>
        </div>

        {goals.filter(g => !g.completed).map((goal, index) => {
          const percentage = Math.round((goal.progress / goal.target) * 100);
          const Icon = categoryIcons[goal.category];
          const color = categoryColors[goal.category];

          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              className="glass-card rounded-[24px] p-5"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className="w-12 h-12 rounded-[16px] flex items-center justify-center"
                    style={{ backgroundColor: `${color}20` }}
                  >
                    <Icon className="w-6 h-6" style={{ color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium mb-1">{goal.title}</h3>
                    <p className="text-white/50 text-sm">{goal.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleGoalComplete(goal.id)}
                  className="w-8 h-8 rounded-full border-2 border-white/20 flex items-center justify-center hover:border-[#22C55E] hover:bg-[#22C55E]/20 transition-colors"
                >
                  <Check className="w-5 h-5 text-white/40" />
                </button>
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-white/60">Прогресс</span>
                  <span className="text-white font-medium">
                    {goal.progress} / {goal.target} {goal.unit}
                  </span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, delay: 0.3 + index * 0.05 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: color }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-white/40">
                <Calendar className="w-3 h-3" />
                <span>Дедлайн: {goal.deadline}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Completed Goals */}
      {completedCount > 0 && (
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between px-1">
            <p className="text-white/60 text-sm">Выполненные</p>
            <span className="text-[#22C55E] text-sm">{completedCount}</span>
          </div>

          {goals.filter(g => g.completed).map((goal, index) => {
            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="glass-card rounded-[24px] p-5 opacity-60"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-[16px] bg-[#22C55E]/20 flex items-center justify-center"
                  >
                    <Trophy className="w-6 h-6 text-[#22C55E]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium line-through text-white/50">{goal.title}</h3>
                    <p className="text-[#22C55E] text-sm">✓ Выполнено</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Add Goal Modal */}
      {showAddGoal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            className="glass-card rounded-t-[32px] w-full max-w-md p-6 pb-10 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl">Новая цель</h2>
              <button
                onClick={() => setShowAddGoal(false)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-white/60 text-sm mb-2 block">Название цели</label>
                <input
                  type="text"
                  placeholder="Например: Пробежать марафон"
                  className="w-full glass-card rounded-[16px] px-4 py-3 bg-white/5 outline-none focus:ring-2 focus:ring-[#4DA3FF]"
                />
              </div>

              <div>
                <label className="text-white/60 text-sm mb-2 block">Описание</label>
                <textarea
                  placeholder="Опишите вашу цель..."
                  rows={3}
                  className="w-full glass-card rounded-[16px] px-4 py-3 bg-white/5 outline-none focus:ring-2 focus:ring-[#4DA3FF] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white/60 text-sm mb-2 block">Прогресс</label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full glass-card rounded-[16px] px-4 py-3 bg-white/5 outline-none focus:ring-2 focus:ring-[#4DA3FF]"
                  />
                </div>
                <div>
                  <label className="text-white/60 text-sm mb-2 block">Цель</label>
                  <input
                    type="number"
                    placeholder="100"
                    className="w-full glass-card rounded-[16px] px-4 py-3 bg-white/5 outline-none focus:ring-2 focus:ring-[#4DA3FF]"
                  />
                </div>
              </div>

              <div>
                <label className="text-white/60 text-sm mb-2 block">Категория</label>
                <div className="grid grid-cols-4 gap-2">
                  {Object.entries(categoryColors).map(([key, color]) => (
                    <button
                      key={key}
                      className="p-3 rounded-[12px] bg-white/5 flex flex-col items-center gap-1 hover:bg-white/10 transition-colors"
                    >
                      {(() => {
                        const CatIcon = categoryIcons[key as keyof typeof categoryIcons];
                        return <CatIcon className="w-5 h-5" style={{ color }} />;
                      })()}
                      <span className="text-[10px] capitalize">{key}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-white/60 text-sm mb-2 block">Дедлайн</label>
                <input
                  type="date"
                  className="w-full glass-card rounded-[16px] px-4 py-3 bg-white/5 outline-none focus:ring-2 focus:ring-[#4DA3FF]"
                />
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-[#4DA3FF] rounded-[20px] text-white font-medium mt-4"
                onClick={() => setShowAddGoal(false)}
              >
                Создать цель
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
