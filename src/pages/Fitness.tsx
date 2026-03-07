import { motion } from 'motion/react';
import { ChevronLeft, Dumbbell, Play, Calendar, TrendingUp, Flame } from 'lucide-react';
import { useNavigate } from 'react-router';

const workouts = [
  { id: 1, name: 'Грудь + Трицепс', duration: '65 мин', exercises: 8, calories: 320, date: 'Сегодня' },
  { id: 2, name: 'Спина + Бицепс', duration: '70 мин', exercises: 9, calories: 350, date: 'Вчера' },
  { id: 3, name: 'Ноги + Плечи', duration: '80 мин', exercises: 10, calories: 420, date: '15 мар' },
];

const weeklyStats = [
  { day: 'Пн', done: true, calories: 320 },
  { day: 'Вт', done: true, calories: 350 },
  { day: 'Ср', done: false, calories: 0 },
  { day: 'Чт', done: false, calories: 0 },
  { day: 'Пт', done: false, calories: 0 },
  { day: 'Сб', done: false, calories: 0 },
  { day: 'Вс', done: false, calories: 0 },
];

export function Fitness() {
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
        <h1 className="text-3xl">Фитнес</h1>
      </motion.div>

      {/* Fitness Score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-[24px] p-6 mb-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#F59E0B]/10 rounded-full blur-[60px]" />

        <div className="relative z-10">
          <p className="text-white/60 text-sm mb-2">Активность</p>
          <div className="flex items-end gap-2">
            <span className="text-5xl tracking-tight">70</span>
            <span className="text-2xl text-white/40 mb-1">/ 100</span>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <TrendingUp className="w-4 h-4 text-[#22C55E]" />
            <span className="text-[#22C55E] text-sm">+8% к прошлой неделе</span>
          </div>
        </div>
      </motion.div>

      {/* Weekly Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-[24px] p-6 mb-6"
      >
        <h3 className="text-lg mb-4">Эта неделя</h3>
        <div className="flex justify-between">
          {weeklyStats.map((day, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <span className={`text-xs ${day.done ? 'text-white/70' : 'text-white/30'}`}>{day.day}</span>
              <div className={`w-8 h-12 rounded-full flex items-center justify-center ${
                day.done 
                  ? 'bg-gradient-to-t from-[#F59E0B] to-[#F59E0B]/60' 
                  : 'bg-white/5'
              }`}>
                {day.done && <Flame className="w-4 h-4 text-white" />}
              </div>
              <span className="text-xs text-white/40">{day.calories > 0 ? day.calories : '-'}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-white/10 flex justify-between text-sm">
          <span className="text-white/50">Тренировок</span>
          <span className="text-white">2 из 5</span>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-[20px] p-4 flex flex-col items-center gap-3 active:scale-95 transition-transform"
        >
          <div className="w-12 h-12 rounded-[16px] bg-[#4DA3FF]/20 flex items-center justify-center">
            <Play className="w-6 h-6 text-[#4DA3FF]" />
          </div>
          <span className="text-sm font-medium">Начать тренировку</span>
        </motion.button>

        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-[20px] p-4 flex flex-col items-center gap-3 active:scale-95 transition-transform"
        >
          <div className="w-12 h-12 rounded-[16px] bg-[#22C55E]/20 flex items-center justify-center">
            <Calendar className="w-6 h-6 text-[#22C55E]" />
          </div>
          <span className="text-sm font-medium">План на неделю</span>
        </motion.button>
      </div>

      {/* Workouts History */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between px-1">
          <p className="text-white/60 text-sm">История тренировок</p>
          <button className="text-[#4DA3FF] text-sm">Все</button>
        </div>

        {workouts.map((workout, index) => (
          <motion.div
            key={workout.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.05 }}
            className="glass-card rounded-[20px] p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[12px] bg-[#F59E0B]/20 flex items-center justify-center">
                  <Dumbbell className="w-5 h-5 text-[#F59E0B]" />
                </div>
                <div>
                  <p className="text-white/90 font-medium">{workout.name}</p>
                  <p className="text-white/40 text-xs">{workout.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">{workout.calories}</p>
                <p className="text-white/40 text-xs">ккал</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-white/50">
              <span className="flex items-center gap-1">
                <Play className="w-3 h-3" />
                {workout.duration}
              </span>
              <span className="flex items-center gap-1">
                <Dumbbell className="w-3 h-3" />
                {workout.exercises} упражнений
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* AI Recommendation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card rounded-[24px] p-6 bg-gradient-to-br from-[#F59E0B]/10 to-[#EF4444]/5"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-[12px] bg-[#F59E0B]/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-[#F59E0B]" />
          </div>
          <h3 className="text-lg">Совет AI</h3>
        </div>
        <p className="text-white/70 text-sm leading-relaxed">
          Вы пропустили тренировку ног на этой неделе. Учитывая ваш график, 
          рекомендую провести её в четверг вечером. Добавьте 5 минут разминки 
          перед основной тренировкой для лучшей мобильности.
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
