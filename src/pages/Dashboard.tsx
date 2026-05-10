import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { Apple, Moon, Dumbbell, DollarSign, Target, TrendingUp, Zap, Sparkles, ChevronRight, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useMemo } from 'react';

// Выносим статические данные за пределы компонента
const LIFE_AREAS_CONFIG = [
  { id: 'nutrition', name: 'Питание', icon: Apple, path: '/nutrition', color: '#22C55E' },
  { id: 'sleep', name: 'Сон', icon: Moon, path: '/sleep', color: '#4DA3FF' },
  { id: 'fitness', name: 'Фитнес', icon: Dumbbell, path: '/fitness', color: '#F59E0B' },
  { id: 'finances', name: 'Финансы', icon: DollarSign, path: '/finances', color: '#10B981' },
  { id: 'goals', name: 'Цели', icon: Target, path: '/goals', color: '#8B5CF6' },
];

export function Dashboard() {
  const navigate = useNavigate();
  const { state, lifeScore } = useApp();

  // Мемоизируем данные сфер жизни
  const lifeAreas = useMemo(() => {
    return LIFE_AREAS_CONFIG.map(area => {
      let score = 0;
      let trend = '0';
      
      switch(area.id) {
        case 'nutrition':
          score = state.meals.length > 0 ? Math.min(100, state.meals.length * 20) : 0;
          trend = state.meals.length > 0 ? `+${state.meals.length}` : '0';
          break;
        case 'sleep':
          score = state.sleepDays.length > 0 ? Math.round(state.sleepDays.reduce((sum, s) => sum + s.quality, 0) / state.sleepDays.length) : 0;
          trend = state.sleepDays.length > 0 ? `${score}%` : '0%';
          break;
        case 'fitness':
          score = state.workouts.filter(w => w.completed).length * 20;
          trend = `+${state.workouts.filter(w => w.completed).length}`;
          break;
        case 'finances':
          score = state.transactions.length > 0 ? 60 : 0;
          trend = state.transactions.length > 0 ? 'Активно' : '0';
          break;
        case 'goals':
          score = state.goals.length > 0 ? Math.round((state.goals.filter(g => g.completed).length / state.goals.length) * 100) : 0;
          trend = `${state.goals.filter(g => g.completed).length}/${state.goals.length}`;
          break;
      }
      return { ...area, score, trend };
    });
  }, [state]);

  const hasAnyData = useMemo(() => 
    state.meals.length > 0 || state.workouts.length > 0 || state.transactions.length > 0 || state.goals.length > 0 || state.profile.name !== '',
    [state]
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="w-full min-h-screen bg-background px-5 pt-12 pb-10 safe-area-top"
    >
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white/90">
            {state.profile.name ? `Привет, ${state.profile.name.split(' ')[0]}!` : 'LifeOS'}
          </h1>
          <p className="text-white/40 text-xs mt-0.5">
            {hasAnyData ? 'Система оптимизирована' : 'Настройте ваш профиль'}
          </p>
        </div>
        <motion.button 
          whileTap={{ scale: 0.9 }} 
          onClick={() => navigate('/profile')} 
          className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center backdrop-blur-md"
        >
          <User className="w-5 h-5 text-white/60" />
        </motion.button>
      </header>

      {/* Life Score Card - Simplified Premium Hero */}
      <section className="relative mb-10">
        <div className="relative p-8 bg-white/[0.02] border border-white/5 rounded-[32px] overflow-hidden">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[11px] font-bold text-white/30 uppercase tracking-[0.2em]">Индекс здоровья системы</span>
          </div>

          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-7xl font-bold tracking-tighter text-white">{lifeScore}</span>
            <span className="text-2xl text-white/20 font-medium">/ 100</span>
          </div>

          <div className="space-y-4">
            <div className="h-1.5 w-full bg-white/[0.05] rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: `${lifeScore}%` }} 
                transition={{ duration: 1.2, ease: "circOut" }}
                className="h-full rounded-full bg-primary shadow-[0_0_12px_rgba(77,163,255,0.4)]"
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[11px] text-white/40 font-semibold tracking-wider">
                {lifeScore >= 80 ? 'ОТЛИЧНО' : lifeScore >= 60 ? 'ОПТИМАЛЬНО' : 'НУЖНА СИНХР.'}
              </span>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                <span className="text-[11px] text-green-500 font-bold">+12% за неделю</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Life Areas List - Better Readability */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-5 px-1">
          <h2 className="text-lg font-bold text-white/90">Сферы жизни</h2>
          <ChevronRight className="w-5 h-5 text-white/20" />
        </div>
        
        <div className="space-y-3">
          {lifeAreas.map((area, index) => (
            <motion.button
              key={area.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              onClick={() => navigate(area.path)}
              whileTap={{ scale: 0.98 }}
              className="w-full p-4 flex items-center gap-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-colors"
            >
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${area.color}15` }}
              >
                <area.icon className="w-6 h-6" style={{ color: area.color }} strokeWidth={2} />
              </div>
              
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-sm font-semibold text-white/80">{area.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-white">{area.score}</span>
                    <span className="text-[10px] text-white/20">/100</span>
                  </div>
                </div>
                
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${area.score}%` }}
                    transition={{ duration: 1, delay: 0.4 + index * 0.1 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: area.color }}
                  />
                </div>
              </div>

              <div className="text-right ml-2">
                <span className="text-[10px] font-bold text-white/30 block mb-0.5 uppercase tracking-wider">Тренд</span>
                <span className="text-xs font-bold text-white/60">{area.trend}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Empty State */}
      <AnimatePresence>
        {!hasAnyData && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-8 rounded-[32px] bg-gradient-to-br from-[#4DA3FF]/10 to-transparent border border-[#4DA3FF]/20 text-center mb-8"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#4DA3FF]/20 flex items-center justify-center mx-auto mb-4 backdrop-blur-xl">
              <Sparkles className="w-8 h-8 text-[#4DA3FF]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Добро пожаловать!</h3>
            <p className="text-white/50 text-sm mb-6 leading-relaxed">Начните заполнять данные, чтобы AI помощник смог оптимизировать вашу жизнь.</p>
            <button 
              onClick={() => navigate('/profile')} 
              className="w-full py-4 bg-[#4DA3FF] text-white font-bold rounded-2xl shadow-[0_8px_20px_rgba(77,163,255,0.3)] active:scale-[0.98] transition-transform"
            >
              Настроить профиль
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Insights */}
      <section className="pb-4">
        <h2 className="text-lg font-semibold text-white/80 mb-4 px-1">AI Инсайты</h2>
        <div className="space-y-3">
          <button 
            onClick={() => navigate('/analysis')}
            className="w-full flex items-center gap-4 p-4 rounded-[24px] bg-white/[0.03] border border-white/10 hover:bg-white/[0.05] transition-colors text-left"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#4DA3FF]/10 flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6 text-[#4DA3FF]" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-white/90">Анализ активности</h4>
              <p className="text-xs text-white/40 truncate">Готов новый отчет по эффективности</p>
            </div>
            <ChevronRight className="w-5 h-5 text-white/20" />
          </button>
        </div>
      </section>
    </motion.div>
  );
}
