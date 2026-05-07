import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { Apple, Moon, Dumbbell, DollarSign, Target, TrendingUp, Zap, Sparkles, ChevronRight } from 'lucide-react';
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
  const { state } = useApp();

  // Мемоизируем расчет Life Score
  const lifeScore = useMemo(() => {
    const nutritionScore = Math.min(20, (state.meals.length / 3) * 20);
    const sleepScore = state.sleepDays.length > 0 
      ? (state.sleepDays.reduce((sum, s) => sum + s.quality, 0) / state.sleepDays.length / 100) * 20 
      : 0;
    const fitnessScore = Math.min(20, (state.workouts.filter(w => w.completed).length / 3) * 20);
    const income = state.transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = state.transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const financeScore = income > 0 ? Math.min(20, ((income - expenses) / income) * 20) : 0;
    const goalsScore = state.goals.length > 0 ? (state.goals.filter(g => g.completed).length / state.goals.length) * 20 : 0;
    return Math.round(nutritionScore + sleepScore + fitnessScore + financeScore + goalsScore);
  }, [state]);

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
      className="w-full min-h-screen bg-[#0B0B0F] px-5 pt-8 pb-6 overflow-y-auto"
    >
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white/90">
            {state.profile.name ? `Привет, ${state.profile.name.split(' ')[0]}!` : 'LifeOS'}
          </h1>
          <p className="text-white/40 text-sm mt-0.5">
            {hasAnyData ? 'Система оптимизирована' : 'Настройте ваш профиль'}
          </p>
        </div>
        <motion.button 
          whileTap={{ scale: 0.9 }} 
          onClick={() => navigate('/profile')} 
          className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center backdrop-blur-md"
        >
          <Zap className="w-5 h-5 text-[#F59E0B]" fill="#F59E0B" />
        </motion.button>
      </header>

      {/* Life Score Card */}
      <section className="relative mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-[#4DA3FF]/10 to-[#22C55E]/10 rounded-[32px] blur-2xl" />
        <div className="relative p-7 bg-white/[0.03] border border-white/10 rounded-[32px] backdrop-blur-xl overflow-hidden group">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#4DA3FF]/20 rounded-full blur-[60px] group-hover:bg-[#4DA3FF]/30 transition-colors duration-700" />
          
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E] shadow-[0_0_8px_#22C55E]" />
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">System integrity</span>
          </div>

          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-7xl font-bold tracking-tighter text-white">{lifeScore}</span>
            <span className="text-2xl text-white/20 font-medium">/ 100</span>
          </div>

          <div className="space-y-3">
            <div className="h-3 w-full bg-white/[0.05] rounded-full overflow-hidden p-0.5">
              <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: `${lifeScore}%` }} 
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="h-full rounded-full bg-gradient-to-r from-[#4DA3FF] to-[#22C55E] relative"
              >
                <div className="absolute inset-0 bg-white/20 blur-sm" />
              </motion.div>
            </div>
            <div className="flex justify-between items-center px-1">
              <span className="text-[11px] text-white/30 font-medium tracking-wide">
                {lifeScore >= 80 ? 'EXCELLENT' : lifeScore >= 60 ? 'OPTIMAL' : 'NEED SYNC'}
              </span>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-3 h-3 text-[#22C55E]" />
                <span className="text-[11px] text-[#22C55E] font-bold">+12% vs last week</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Life Areas Grid */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-lg font-semibold text-white/80">Сферы жизни</h2>
          <ChevronRight className="w-5 h-5 text-white/20" />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {lifeAreas.map((area, index) => (
            <motion.button
              key={area.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              onClick={() => navigate(area.path)}
              whileTap={{ scale: 0.96 }}
              className="relative p-5 text-left bg-white/[0.02] border border-white/10 rounded-[28px] overflow-hidden group hover:bg-white/[0.04] transition-colors"
            >
              <div 
                className="absolute -top-10 -right-10 w-24 h-24 rounded-full blur-3xl opacity-20 transition-opacity group-hover:opacity-40" 
                style={{ backgroundColor: area.color }} 
              />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-start justify-between mb-4">
                  <div 
                    className="w-10 h-10 rounded-2xl flex items-center justify-center border border-white/5"
                    style={{ backgroundColor: `${area.color}15` }}
                  >
                    <area.icon className="w-5 h-5" style={{ color: area.color }} strokeWidth={2.5} />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-white/5 text-white/60">
                    {area.trend}
                  </span>
                </div>
                
                <h3 className="text-[13px] font-medium text-white/50 mb-1">{area.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-white/90">{area.score}</span>
                  <span className="text-xs text-white/20">/100</span>
                </div>
                
                <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${area.score}%` }}
                    transition={{ duration: 1, delay: 0.4 + index * 0.1 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: area.color }}
                  />
                </div>
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
