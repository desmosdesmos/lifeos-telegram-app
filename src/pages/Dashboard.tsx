import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { Apple, Moon, Dumbbell, DollarSign, Target, TrendingUp, Zap, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function Dashboard() {
  const navigate = useNavigate();
  const { state } = useApp();

  const calculateLifeScore = () => {
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
  };

  const lifeScore = calculateLifeScore();

  const lifeAreas = [
    { name: 'Питание', score: state.meals.length > 0 ? Math.min(100, state.meals.length * 20) : 0, icon: Apple, path: '/nutrition', color: '#22C55E', trend: state.meals.length > 0 ? `+${state.meals.length}` : '0' },
    { name: 'Сон', score: state.sleepDays.length > 0 ? Math.round(state.sleepDays.reduce((sum, s) => sum + s.quality, 0) / state.sleepDays.length) : 0, icon: Moon, path: '/sleep', color: '#4DA3FF', trend: state.sleepDays.length > 0 ? `${Math.round(state.sleepDays.reduce((sum, s) => sum + s.quality, 0) / state.sleepDays.length)}%` : '0%' },
    { name: 'Фитнес', score: state.workouts.filter(w => w.completed).length * 20, icon: Dumbbell, path: '/fitness', color: '#F59E0B', trend: `+${state.workouts.filter(w => w.completed).length}` },
    { name: 'Финансы', score: state.transactions.length > 0 ? 60 : 0, icon: DollarSign, path: '/finances', color: '#22C55E', trend: state.transactions.length > 0 ? 'Активно' : '0' },
    { name: 'Цели', score: state.goals.length > 0 ? Math.round((state.goals.filter(g => g.completed).length / state.goals.length) * 100) : 0, icon: Target, path: '/goals', color: '#4DA3FF', trend: `${state.goals.filter(g => g.completed).length}/${state.goals.length}` },
  ];

  const hasAnyData = state.meals.length > 0 || state.workouts.length > 0 || state.transactions.length > 0 || state.goals.length > 0 || state.profile.name !== '';

  return (
    <div className="w-full min-h-screen px-5 pt-8 pb-6 relative">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-1">
          <div>
            <motion.h1 
              className="text-3xl mb-1 tracking-tight font-bold bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              Привет, {state.profile.name ? state.profile.name.split(' ')[0] : 'Друг'}!
            </motion.h1>
            <motion.p 
              className="text-white/40 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {hasAnyData ? 'Панель оптимизации' : 'Начните заполнять данные'}
            </motion.p>
          </div>
          <motion.button 
            whileTap={{ scale: 0.92, rotate: -10 }}
            whileHover={{ scale: 1.05, rotate: 10 }}
            onClick={() => navigate('/profile')} 
            className="w-12 h-12 rounded-[18px] glass-card flex items-center justify-center glow-amber"
          >
            <Zap className="w-6 h-6 text-[#F59E0B]" fill="#F59E0B" />
          </motion.button>
        </div>
      </motion.div>

      {/* Life Score Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.92, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        transition={{ delay: 0.15, duration: 0.6, ease: [0.4, 0, 0.2, 1] }} 
        className="glass-card rounded-[32px] p-7 mb-5 relative overflow-hidden glow-blue"
      >
        {/* Animated gradient orbs */}
        <motion.div 
          className="absolute -top-20 -right-20 w-56 h-56 bg-gradient-to-br from-[#4DA3FF]/30 to-[#22C55E]/20 rounded-full blur-[100px]" 
          animate={{ 
            scale: [1, 1.3, 1], 
            opacity: [0.3, 0.5, 0.3],
            rotate: [0, 180, 360]
          }} 
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} 
        />
        <motion.div 
          className="absolute -bottom-20 -left-20 w-48 h-48 bg-gradient-to-tr from-[#22C55E]/25 to-[#4DA3FF]/15 rounded-full blur-[80px]" 
          animate={{ 
            scale: [1.2, 1, 1.2], 
            opacity: [0.2, 0.4, 0.2],
            rotate: [360, 180, 0]
          }} 
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} 
        />
        
        <div className="relative z-10">
          <motion.div 
            className="flex items-center gap-2 mb-4"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div 
              className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" 
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <p className="text-white/50 text-sm tracking-wide uppercase font-medium">Статус системы</p>
          </motion.div>
          
          <motion.div 
            className="flex items-end gap-3 mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <motion.span 
              className="text-7xl tracking-tighter leading-none font-bold glow-text-blue"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.5 }}
            >
              {lifeScore}
            </motion.span>
            <div className="mb-2">
              <span className="text-3xl text-white/30">/</span>
              <span className="text-3xl text-white/30 ml-1">100</span>
            </div>
            {lifeScore > 0 && (
              <motion.div 
                className="mb-3 ml-2 px-3 py-1.5 rounded-full bg-[#22C55E]/20 flex items-center gap-1.5 glow-green"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
              >
                <TrendingUp className="w-4 h-4 text-[#22C55E]" />
                <span className="text-[#22C55E] text-xs font-semibold">Активно</span>
              </motion.div>
            )}
          </motion.div>
          
          <motion.div 
            className="relative"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden progress-track">
              <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: `${lifeScore}%` }} 
                transition={{ duration: 1.8, delay: 0.4, ease: [0.4, 0, 0.2, 1] }} 
                className="h-full bg-gradient-to-r from-[#4DA3FF] via-[#22C55E] to-[#22C55E] rounded-full progress-fill glow-blue"
              />
            </div>
          </motion.div>
          
          <motion.div 
            className="flex items-center justify-between mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <p className="text-white/40 text-xs">Общий баланс</p>
            <motion.p 
              className={`text-xs font-semibold ${
                lifeScore >= 80 ? 'text-[#22C55E]' : lifeScore >= 60 ? 'text-[#4DA3FF]' : 'text-[#F59E0B]'
              }`}
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {lifeScore >= 80 ? '✦ Отлично' : lifeScore >= 60 ? '◇ Хорошо' : lifeScore >= 40 ? '△ Нормально' : '○ Нужно работать'}
            </motion.p>
          </motion.div>
        </div>
      </motion.div>

      {/* Empty State */}
      {!hasAnyData && (
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.3, duration: 0.6 }} 
          className="glass-card rounded-[28px] p-8 mb-5 text-center relative overflow-hidden"
        >
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-[#4DA3FF]/10 to-[#22C55E]/5"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <div className="relative z-10">
            <motion.div 
              className="w-20 h-20 rounded-[24px] bg-gradient-to-br from-[#4DA3FF]/25 to-[#4DA3FF]/10 flex items-center justify-center mx-auto mb-5 glow-blue"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="w-10 h-10 text-[#4DA3FF]" />
            </motion.div>
            <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              Начните прямо сейчас!
            </h3>
            <p className="text-white/60 text-sm mb-6 leading-relaxed">
              Заполните данные в разделах ниже, чтобы получить персональные рекомендации
            </p>
            <motion.button 
              onClick={() => navigate('/profile')} 
              className="px-8 py-4 bg-gradient-to-r from-[#4DA3FF] to-[#22C55E] rounded-[20px] text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              Заполнить профиль
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Life Areas Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mb-4"
      >
        <div className="flex items-center justify-between px-1 mb-4">
          <h2 className="text-lg text-white/70 font-semibold">Сферы жизни</h2>
          <motion.button 
            className="text-[#4DA3FF] text-sm font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Все →
          </motion.button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {lifeAreas.map((area, index) => {
            const Icon = area.icon;
            const isPositiveTrend = !area.trend.startsWith('-');
            return (
              <motion.button 
                key={area.name} 
                initial={{ opacity: 0, y: 20, scale: 0.95 }} 
                animate={{ opacity: 1, y: 0, scale: 1 }} 
                transition={{ delay: 0.5 + index * 0.08, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                onClick={() => navigate(area.path)} 
                whileTap={{ scale: 0.96 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="glass-card rounded-[28px] p-5 text-left relative overflow-hidden group"
              >
                {/* Animated gradient background on hover */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle at top right, ${area.color}20, transparent 70%)`
                  }}
                />
                
                {/* Animated orb */}
                <motion.div 
                  className="absolute -top-10 -right-10 w-24 h-24 rounded-full blur-[50px] opacity-0 group-hover:opacity-50 transition-opacity duration-500"
                  style={{ backgroundColor: area.color }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <motion.div 
                      className="w-12 h-12 rounded-[16px] flex items-center justify-center backdrop-blur-xl"
                      style={{ backgroundColor: `${area.color}20` }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      <Icon className="w-6 h-6" style={{ color: area.color }} strokeWidth={2.5} />
                    </motion.div>
                    <motion.div 
                      className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                        isPositiveTrend ? 'bg-[#22C55E]/20 text-[#22C55E]' : 'bg-[#F59E0B]/20 text-[#F59E0B]'
                      }`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.7 + index * 0.08, type: 'spring' }}
                    >
                      {area.trend}
                    </motion.div>
                  </div>
                  <p className="text-white/50 text-xs mb-2 tracking-wide font-medium">{area.name}</p>
                  <div className="flex items-end gap-1">
                    <motion.p 
                      className="text-3xl leading-none tracking-tight font-bold"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 + index * 0.08 }}
                    >
                      {area.score}
                    </motion.p>
                    <p className="text-lg text-white/30 mb-0.5">/100</p>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mt-3 progress-track">
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: `${area.score}%` }} 
                      transition={{ duration: 1.2, delay: 0.7 + index * 0.08, ease: [0.4, 0, 0.2, 1] }} 
                      className="h-full rounded-full progress-fill"
                      style={{ 
                        background: `linear-gradient(90deg, ${area.color}, ${area.color}aa)`
                      }}
                    />
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.7, duration: 0.6 }}
        className="mt-6"
      >
        <h2 className="text-lg text-white/70 px-1 mb-4 font-semibold">Быстрые действия</h2>
        <div className="glass-card rounded-[28px] p-4 space-y-2">
          <motion.button 
            onClick={() => navigate('/analysis')} 
            className="w-full flex items-center justify-between p-4 rounded-[20px] hover:bg-white/5 transition-all duration-300 group"
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-3">
              <motion.div 
                className="w-11 h-11 rounded-[16px] bg-[#4DA3FF]/20 flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: -5 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <Zap className="w-5 h-5 text-[#4DA3FF]" />
              </motion.div>
              <span className="text-sm font-medium">Получить AI рекомендации</span>
            </div>
            <motion.svg 
              className="w-5 h-5 text-white/30 group-hover:text-[#4DA3FF] transition-colors" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </motion.svg>
          </motion.button>
          
          <motion.button 
            onClick={() => navigate('/goals')} 
            className="w-full flex items-center justify-between p-4 rounded-[20px] hover:bg-white/5 transition-all duration-300 group"
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-3">
              <motion.div 
                className="w-11 h-11 rounded-[16px] bg-[#22C55E]/20 flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <Target className="w-5 h-5 text-[#22C55E]" />
              </motion.div>
              <span className="text-sm font-medium">Поставить новую цель</span>
            </div>
            <motion.svg 
              className="w-5 h-5 text-white/30 group-hover:text-[#22C55E] transition-colors" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3, delay: 0.5 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </motion.svg>
          </motion.button>
          
          <motion.button 
            onClick={() => navigate('/statistics')} 
            className="w-full flex items-center justify-between p-4 rounded-[20px] hover:bg-white/5 transition-all duration-300 group"
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-3">
              <motion.div 
                className="w-11 h-11 rounded-[16px] bg-[#F59E0B]/20 flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: -5 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <TrendingUp className="w-5 h-5 text-[#F59E0B]" />
              </motion.div>
              <span className="text-sm font-medium">Статистика и графики</span>
            </div>
            <motion.svg 
              className="w-5 h-5 text-white/30 group-hover:text-[#F59E0B] transition-colors" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3, delay: 1 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </motion.svg>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
