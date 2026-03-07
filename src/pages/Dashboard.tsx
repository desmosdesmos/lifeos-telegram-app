import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { Apple, Moon, Dumbbell, DollarSign, Target, TrendingUp, Zap } from 'lucide-react';

const lifeAreas = [
  { name: 'Питание', score: 80, icon: Apple, path: '/nutrition', color: '#22C55E', trend: '+5' },
  { name: 'Сон', score: 65, icon: Moon, path: '/sleep', color: '#4DA3FF', trend: '-3' },
  { name: 'Фитнес', score: 70, icon: Dumbbell, path: '/fitness', color: '#F59E0B', trend: '+8' },
  { name: 'Финансы', score: 60, icon: DollarSign, path: '/finances', color: '#22C55E', trend: '+2' },
  { name: 'Цели', score: 85, icon: Target, path: '/goals', color: '#4DA3FF', trend: '+12' },
];

export function Dashboard() {
  const navigate = useNavigate();
  const lifeScore = 74;

  return (
    <div className="w-full min-h-screen bg-[#0B0B0F] px-5 pt-8 pb-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-1">
          <div>
            <h1 className="text-3xl mb-1 tracking-tight">Контроль жизни</h1>
            <p className="text-white/40 text-sm">Панель оптимизации</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="w-11 h-11 rounded-[14px] glass-card flex items-center justify-center"
          >
            <Zap className="w-5 h-5 text-[#F59E0B]" fill="#F59E0B" />
          </motion.button>
        </div>
      </motion.div>

      {/* Life Score Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-[28px] p-7 mb-5 relative overflow-hidden"
      >
        {/* Animated background gradient */}
        <motion.div
          className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#4DA3FF]/20 to-[#22C55E]/10 rounded-full blur-[80px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
            <p className="text-white/50 text-sm tracking-wide uppercase">Статус системы</p>
          </div>

          <div className="flex items-end gap-3 mb-5">
            <span className="text-7xl tracking-tighter leading-none">{lifeScore}</span>
            <div className="mb-2">
              <span className="text-3xl text-white/30">/</span>
              <span className="text-3xl text-white/30 ml-1">100</span>
            </div>
            <div className="mb-3 ml-2 px-2.5 py-1 rounded-full bg-[#22C55E]/20 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-[#22C55E]" />
              <span className="text-[#22C55E] text-xs">+8%</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="relative">
            <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden backdrop-blur-sm">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${lifeScore}%` }}
                transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-[#4DA3FF] via-[#22C55E] to-[#22C55E] rounded-full relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse" />
              </motion.div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-3">
            <p className="text-white/40 text-xs">Общий баланс</p>
            <p className="text-white/40 text-xs">Отлично</p>
          </div>
        </div>
      </motion.div>

      {/* Life Areas Section */}
      <div className="mb-4">
        <div className="flex items-center justify-between px-1 mb-3">
          <h2 className="text-lg text-white/70">Сферы жизни</h2>
          <button className="text-[#4DA3FF] text-sm">Все</button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {lifeAreas.map((area, index) => {
            const Icon = area.icon;
            const isPositiveTrend = area.trend.startsWith('+');

            return (
              <motion.button
                key={area.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                onClick={() => navigate(area.path)}
                whileTap={{ scale: 0.97 }}
                className="glass-card rounded-[24px] p-5 text-left relative overflow-hidden group"
              >
                <div
                  className="absolute top-0 right-0 w-28 h-28 rounded-full blur-[60px] opacity-0 group-active:opacity-30 transition-opacity duration-300"
                  style={{ backgroundColor: area.color }}
                />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className="w-11 h-11 rounded-[14px] flex items-center justify-center backdrop-blur-xl"
                      style={{ backgroundColor: `${area.color}15` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: area.color }} strokeWidth={2.5} />
                    </div>
                    <div className={`px-2 py-0.5 rounded-full text-[10px] ${
                      isPositiveTrend ? 'bg-[#22C55E]/15 text-[#22C55E]' : 'bg-[#F59E0B]/15 text-[#F59E0B]'
                    }`}>
                      {area.trend}%
                    </div>
                  </div>

                  <p className="text-white/50 text-xs mb-1.5 tracking-wide">{area.name}</p>
                  <div className="flex items-end gap-1">
                    <p className="text-3xl leading-none tracking-tight">{area.score}</p>
                    <p className="text-lg text-white/30 mb-0.5">/100</p>
                  </div>

                  {/* Mini progress bar */}
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${area.score}%` }}
                      transition={{ duration: 1, delay: 0.3 + index * 0.05 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: area.color }}
                    />
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-4"
      >
        <h2 className="text-lg text-white/70 px-1 mb-3">Быстрые действия</h2>
        <div className="glass-card rounded-[24px] p-4 space-y-2">
          <button 
            onClick={() => navigate('/analysis')}
            className="w-full flex items-center justify-between p-3 rounded-[16px] hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[12px] bg-[#4DA3FF]/15 flex items-center justify-center">
                <Zap className="w-5 h-5 text-[#4DA3FF]" />
              </div>
              <span className="text-sm">Получить AI рекомендации</span>
            </div>
            <svg className="w-5 h-5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button 
            onClick={() => navigate('/goals')}
            className="w-full flex items-center justify-between p-3 rounded-[16px] hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[12px] bg-[#22C55E]/15 flex items-center justify-center">
                <Target className="w-5 h-5 text-[#22C55E]" />
              </div>
              <span className="text-sm">Поставить новую цель</span>
            </div>
            <svg className="w-5 h-5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
