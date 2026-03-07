import { motion } from 'motion/react';
import { ChevronLeft, Moon, Sun, Droplets } from 'lucide-react';
import { useNavigate } from 'react-router';

export function Sleep() {
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
        <h1 className="text-3xl">Сон</h1>
      </motion.div>

      {/* Sleep Score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-[24px] p-6 mb-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#4DA3FF]/10 rounded-full blur-[60px]" />

        <div className="relative z-10">
          <p className="text-white/60 text-sm mb-2">Качество сна</p>
          <div className="flex items-end gap-2">
            <span className="text-5xl tracking-tight">65</span>
            <span className="text-2xl text-white/40 mb-1">/ 100</span>
          </div>
          <p className="text-white/50 text-xs mt-2">Ниже вашей цели (85)</p>
        </div>
      </motion.div>

      {/* Sleep Duration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-[24px] p-6 mb-6 text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-[#4DA3FF]/10 rounded-full blur-[80px]" />

        <div className="relative z-10">
          <div className="w-12 h-12 rounded-[16px] bg-[#4DA3FF]/20 flex items-center justify-center mx-auto mb-3">
            <Moon className="w-6 h-6 text-[#4DA3FF]" />
          </div>
          <p className="text-white/60 text-sm mb-3">Продолжительность сна</p>
          <div className="text-5xl mb-1 tracking-tight">7ч 10м</div>
          <p className="text-white/40 text-xs">Прошлой ночью</p>
        </div>
      </motion.div>

      {/* Sleep Times */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-[20px] p-5 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#F59E0B]/10 rounded-full blur-[50px]" />

          <div className="relative z-10">
            <div className="w-10 h-10 rounded-[12px] bg-[#F59E0B]/20 flex items-center justify-center mb-3">
              <Moon className="w-5 h-5 text-[#F59E0B]" />
            </div>
            <p className="text-white/60 text-xs mb-1">Отбой</p>
            <p className="text-2xl">23:30</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-[20px] p-5 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#22C55E]/10 rounded-full blur-[50px]" />

          <div className="relative z-10">
            <div className="w-10 h-10 rounded-[12px] bg-[#22C55E]/20 flex items-center justify-center mb-3">
              <Sun className="w-5 h-5 text-[#22C55E]" />
            </div>
            <p className="text-white/60 text-xs mb-1">Подъём</p>
            <p className="text-2xl">06:40</p>
          </div>
        </motion.div>
      </div>

      {/* Sleep Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card rounded-[24px] p-6 mb-6"
      >
        <h3 className="text-lg mb-4">Статистика сна</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[12px] bg-[#4DA3FF]/15 flex items-center justify-center">
                <Droplets className="w-5 h-5 text-[#4DA3FF]" />
              </div>
              <div>
                <p className="text-sm">Глубокий сон</p>
                <p className="text-white/50 text-xs">Фаза восстановления</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold">1ч 45м</p>
              <p className="text-white/40 text-xs">24% от сна</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[12px] bg-[#F59E0B]/15 flex items-center justify-center">
                <Moon className="w-5 h-5 text-[#F59E0B]" />
              </div>
              <div>
                <p className="text-sm">REM сон</p>
                <p className="text-white/50 text-xs">Фаза сновидений</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold">2ч 10м</p>
              <p className="text-white/40 text-xs">30% от сна</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[12px] bg-[#22C55E]/15 flex items-center justify-center">
                <Sun className="w-5 h-5 text-[#22C55E]" />
              </div>
              <div>
                <p className="text-sm">Лёгкий сон</p>
                <p className="text-white/50 text-xs">Поверхностная фаза</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold">3ч 15м</p>
              <p className="text-white/40 text-xs">46% от сна</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* AI Recommendation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card rounded-[24px] p-6 bg-gradient-to-br from-[#4DA3FF]/10 to-[#22C55E]/5"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-[12px] bg-[#4DA3FF]/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-[#4DA3FF]" />
          </div>
          <h3 className="text-lg">Рекомендация AI</h3>
        </div>
        <p className="text-white/70 text-sm leading-relaxed">
          Ваш сон стал короче на 40 минут по сравнению с прошлой неделей. 
          Попробуйте ложиться на 30 минут раньше сегодня и избегайте синего света 
          за час до сна. Это поможет улучшить качество отдыха.
        </p>
      </motion.div>
    </div>
  );
}

function Sparkles({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}
