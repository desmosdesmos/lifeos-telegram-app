import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Plus, Utensils, Moon, Dumbbell, CreditCard, Target, Zap, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AddMealModal } from './Nutrition';
import { AddTransactionModal } from './Finances';

const categories = [
  { 
    id: 'health',
    name: 'Здоровье',
    gradient: 'from-[#22C55E] to-[#22C55E]/60',
    icon: Zap,
    items: [
      { id: 'meal', name: 'Приём пищи', icon: Utensils, color: '#22C55E', description: 'Завтрак, обед, ужин' },
      { id: 'sleep', name: 'Сон', icon: Moon, color: '#4DA3FF', description: 'Качество и длительность' },
    ]
  },
  { 
    id: 'fitness',
    name: 'Фитнес',
    gradient: 'from-[#F59E0B] to-[#F59E0B]/60',
    icon: Dumbbell,
    items: [
      { id: 'workout', name: 'Тренировка', icon: Dumbbell, color: '#F59E0B', description: 'Упражнения и прогресс' },
    ]
  },
  { 
    id: 'finance',
    name: 'Финансы',
    gradient: 'from-[#22C55E] to-[#22C55E]/60',
    icon: CreditCard,
    items: [
      { id: 'income', name: 'Доход', icon: Zap, color: '#22C55E', description: 'Поступление средств' },
      { id: 'expense', name: 'Расход', icon: CreditCard, color: '#EF4444', description: 'Траты и покупки' },
    ]
  },
  { 
    id: 'goals',
    name: 'Цели',
    gradient: 'from-[#4DA3FF] to-[#4DA3FF]/60',
    icon: Target,
    items: [
      { id: 'goal', name: 'Новая цель', icon: Target, color: '#4DA3FF', description: 'Поставить задачу' },
    ]
  },
];

export function QuickAdd() {
  const navigate = useNavigate();
  const { state, addTransaction } = useApp();
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [showAddFinance, setShowAddFinance] = useState(false);

  const todayStats = {
    meals: state.meals.length,
    workouts: state.workouts.filter(w => w.completed).length,
    sleepHours: state.sleepDays.length > 0 
      ? Math.round(state.sleepDays.reduce((sum, d) => {
          const parts = d.duration?.split('ч') || ['0', '0'];
          return sum + parseFloat(parts[0]) + (parseFloat(parts[1]) || 0) / 60;
        }, 0) / state.sleepDays.length * 10) / 10
      : 0,
  };

  const handleQuickAdd = (actionId: string) => {
    switch (actionId) {
      case 'meal':
        setShowAddMeal(true);
        break;
      case 'income':
      case 'expense':
        setShowAddFinance(true);
        break;
      case 'sleep':
        navigate('/sleep');
        break;
      case 'workout':
        navigate('/fitness');
        break;
      case 'goal':
        navigate('/goals');
        break;
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0B0B0F] px-6 pt-12 pb-6 overflow-y-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate('/')} className="w-10 h-10 rounded-[12px] glass-card flex items-center justify-center active:scale-95 transition-transform">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Добавить</h1>
            <p className="text-white/50 text-sm mt-0.5">Быстрое добавление данных</p>
          </div>
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => navigate('/chat')} className="px-3 py-2 bg-gradient-to-r from-[#4DA3FF] to-[#22C55E] rounded-[12px] text-white font-bold flex items-center gap-1.5 shadow-lg shadow-[#4DA3FF]/30">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs">AI</span>
          </motion.button>
        </div>

        {/* Today's Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Приёмов пищи', value: todayStats.meals, icon: Utensils, color: '#22C55E' },
            { label: 'Тренировок', value: todayStats.workouts, icon: Dumbbell, color: '#F59E0B' },
            { label: 'Часов сна', value: todayStats.sleepHours, icon: Moon, color: '#4DA3FF' },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card rounded-[16px] p-3 text-center">
              <stat.icon className="w-5 h-5 mx-auto mb-1.5" style={{ color: stat.color }} strokeWidth={2.5} />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-white/40 text-[10px]">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Categories */}
      <div className="space-y-6">
        {categories.map((category, catIndex) => {
          const CategoryIcon = category.icon;
          return (
            <motion.div key={category.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: catIndex * 0.1 }}>
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-8 h-8 rounded-[10px] bg-gradient-to-br ${category.gradient} flex items-center justify-center`}>
                  <CategoryIcon className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
                <h2 className="text-lg font-bold">{category.name}</h2>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {category.items.map((item, itemIndex) => {
                  const ItemIcon = item.icon;
                  return (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: catIndex * 0.1 + itemIndex * 0.05 }}
                      onClick={() => handleQuickAdd(item.id)}
                      className="glass-card rounded-[20px] p-4 flex items-center gap-4 active:scale-98 transition-transform group"
                    >
                      <div className="w-14 h-14 rounded-[16px] flex items-center justify-center transition-transform group-active:scale-90" style={{ backgroundColor: `${item.color}20` }}>
                        <ItemIcon className="w-7 h-7 transition-transform group-active:scale-110" style={{ color: item.color }} strokeWidth={2.5} />
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="text-lg font-bold group-hover:text-white transition-colors">{item.name}</h3>
                        <p className="text-white/50 text-sm">{item.description}</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                        <Plus className="w-5 h-5 text-white/70" strokeWidth={2.5} />
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Tip */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-8 glass-card rounded-[24px] p-5 bg-gradient-to-r from-[#4DA3FF]/10 to-[#22C55E]/5 border border-white/10">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-[16px] bg-gradient-to-br from-[#4DA3FF] to-[#22C55E] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#4DA3FF]/30">
            <Sparkles className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <h4 className="text-base font-bold mb-2">Совет дня</h4>
            <p className="text-sm text-white/60 leading-relaxed">
              Регулярно вносите данные во все разделы — так AI сможет дать более точные рекомендации!
            </p>
          </div>
        </div>
      </motion.div>

      {/* Bottom CTA */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-6 mb-8">
        <button onClick={() => navigate('/analysis')} className="w-full glass-card rounded-[20px] p-4 flex items-center justify-between group active:scale-98 transition-transform">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[12px] bg-[#4DA3FF]/15 flex items-center justify-center">
              <Zap className="w-5 h-5 text-[#4DA3FF]" strokeWidth={2.5} />
            </div>
            <div className="text-left">
              <p className="font-bold">AI Анализ</p>
              <p className="text-white/40 text-xs">Получить рекомендации</p>
            </div>
          </div>
          <svg className="w-5 h-5 text-white/30 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {showAddMeal && <AddMealModal onClose={() => setShowAddMeal(false)} />}
        {showAddFinance && <AddTransactionModal onClose={() => setShowAddFinance(false)} onAdd={addTransaction} />}
      </AnimatePresence>
    </div>
  );
}
