import { motion } from 'motion/react';
import { ChevronLeft, Zap, AlertCircle, Lightbulb, Heart, Brain, Activity } from 'lucide-react';
import { useNavigate } from 'react-router';

const issues = [
  { text: 'Недостаток сна (7ч 10м вместо 8ч)', severity: 'high' },
  { text: 'Низкое потребление белка (75г из 120г)', severity: 'medium' },
  { text: 'Пропущена тренировка', severity: 'low' },
  { text: 'Мало воды (1.2л из 2.5л)', severity: 'medium' },
];

const recommendations = [
  { text: 'Ложитесь на 30 минут раньше сегодня', icon: Moon },
  { text: 'Добавьте 25г белка к обеду (творог, протеин)', icon: Apple },
  { text: 'Запланируйте 20-минутную тренировку на утро', icon: Activity },
  { text: 'Выпейте ещё 2 стакана воды сегодня', icon: Droplets },
];

export function AIAnalysis() {
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
          onClick={() => navigate('/')}
          className="w-10 h-10 rounded-[12px] glass-card flex items-center justify-center active:scale-95 transition-transform"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl">AI Анализ</h1>
          <p className="text-white/50 text-xs mt-1">LifeOS Intelligence</p>
        </div>
      </motion.div>

      {/* Energy Score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-[24px] p-6 mb-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#F59E0B]/10 rounded-full blur-[60px]" />

        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 rounded-[16px] bg-gradient-to-br from-[#F59E0B] to-[#F59E0B]/60 flex items-center justify-center">
            <Zap className="w-7 h-7" />
          </div>

          <div className="flex-1">
            <p className="text-white/60 text-sm mb-1">Уровень энергии</p>
            <div className="flex items-end gap-2">
              <span className="text-4xl tracking-tight">68</span>
              <span className="text-xl text-white/40 mb-1">/ 100</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-[20px] p-4 text-center"
        >
          <Heart className="w-6 h-6 text-[#EF4444] mx-auto mb-2" />
          <p className="text-white/50 text-xs mb-1">Восстановление</p>
          <p className="text-2xl font-bold">72%</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass-card rounded-[20px] p-4 text-center"
        >
          <Brain className="w-6 h-6 text-[#4DA3FF] mx-auto mb-2" />
          <p className="text-white/50 text-xs mb-1">Стресс</p>
          <p className="text-2xl font-bold">45%</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-[20px] p-4 text-center"
        >
          <Activity className="w-6 h-6 text-[#22C55E] mx-auto mb-2" />
          <p className="text-white/50 text-xs mb-1">Активность</p>
          <p className="text-2xl font-bold">58%</p>
        </motion.div>
      </div>

      {/* Detected Issues */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-[#F59E0B]" />
          <h2 className="text-lg">Проблемы</h2>
        </div>

        <div className="space-y-3">
          {issues.map((issue, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.05 }}
              className="glass-card rounded-[16px] px-4 py-3 flex items-center gap-3"
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  issue.severity === 'high'
                    ? 'bg-red-500'
                    : issue.severity === 'medium'
                    ? 'bg-[#F59E0B]'
                    : 'bg-yellow-500'
                }`}
              />
              <span className="text-sm">{issue.text}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-[#4DA3FF]" />
          <h2 className="text-lg">Рекомендации на завтра</h2>
        </div>

        <div className="space-y-3">
          {recommendations.map((rec, index) => {
            const Icon = rec.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.05 }}
                className="glass-card rounded-[16px] px-4 py-3 flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-[#4DA3FF]/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-[#4DA3FF]" />
                </div>
                <span className="text-sm text-white/90">{rec.text}</span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* AI Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-6 glass-card rounded-[24px] p-6 bg-gradient-to-br from-[#4DA3FF]/10 to-[#22C55E]/5"
      >
        <h3 className="text-lg mb-3">Общая сводка</h3>
        <p className="text-white/70 text-sm leading-relaxed">
          Ваш общий показатель энергии снизился на 12% по сравнению с прошлой неделей. 
          Основные причины: недостаток сна и низкое потребление белка. 
          Увеличьте продолжительность сна до 8 часов и добавьте протеиновый коктейль 
          после тренировки для улучшения восстановления.
        </p>
      </motion.div>
    </div>
  );
}

function Moon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  );
}

function Apple({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  );
}

function Droplets({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
    </svg>
  );
}
