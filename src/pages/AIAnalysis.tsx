import { motion } from 'motion/react';
import { ChevronLeft, Zap, AlertCircle, Lightbulb, Heart, Brain, Activity } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';

export function AIAnalysis() {
  const navigate = useNavigate();
  const { state } = useApp();

  // Calculate metrics based on actual data
  const nutritionScore = state.meals.length > 0 ? Math.min(100, state.meals.length * 25) : 0;
  const sleepScore = state.sleepDays.length > 0 
    ? Math.round(state.sleepDays.reduce((sum, s) => sum + s.quality, 0) / state.sleepDays.length)
    : 0;
  const fitnessScore = state.workouts.filter(w => w.completed).length * 25;
  
  const avgEnergy = Math.round((nutritionScore + sleepScore + fitnessScore) / 3);
  const recoveryScore = Math.round((sleepScore + nutritionScore) / 2);
  const stressLevel = 100 - avgEnergy;

  // Generate issues based on data
  const issues: Array<{ text: string; severity: 'high' | 'medium' | 'low' }> = [];
  
  if (sleepScore < 70 && sleepScore > 0) {
    issues.push({ text: `Недостаток сна (качество: ${sleepScore}%)`, severity: 'high' });
  }
  if (nutritionScore < 50 && state.meals.length > 0) {
    issues.push({ text: 'Низкое потребление калорий', severity: 'medium' });
  }
  if (state.workouts.filter(w => w.completed).length < 2) {
    issues.push({ text: 'Мало физической активности', severity: 'medium' });
  }
  if (state.goals.length === 0) {
    issues.push({ text: 'Нет поставленных целей', severity: 'low' });
  }
  if (state.transactions.length === 0) {
    issues.push({ text: 'Не ведётся учёт финансов', severity: 'low' });
  }

  // Generate recommendations
  const recommendations: string[] = [];
  if (sleepScore < 70 && sleepScore > 0) {
    recommendations.push('Ложитесь на 30 минут раньше сегодня');
    recommendations.push('Избегайте экранов за 1 час до сна');
  }
  if (nutritionScore < 50) {
    recommendations.push('Добавьте ещё 1-2 приёма пищи');
    recommendations.push('Увеличьте потребление белка');
  }
  if (state.workouts.filter(w => w.completed).length < 2) {
    recommendations.push('Запланируйте тренировку на этой неделе');
  }
  if (state.goals.length === 0) {
    recommendations.push('Поставьте хотя бы одну цель в любой сфере');
  }
  if (recommendations.length === 0 && avgEnergy > 0) {
    recommendations.push('Отличная работа! Продолжайте в том же духе');
    recommendations.push('Поддерживайте текущий режим');
  }

  return (
    <div className="w-full min-h-screen bg-[#0B0B0F] px-6 pt-12 pb-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center gap-3">
        <button onClick={() => navigate('/')} className="w-10 h-10 rounded-[12px] glass-card flex items-center justify-center active:scale-95 transition-transform">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl">AI Анализ</h1>
          <p className="text-white/50 text-xs mt-1">LifeOS Intelligence</p>
        </div>
      </motion.div>

      {/* Energy Score */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="glass-card rounded-[24px] p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-[16px] bg-gradient-to-br from-[#F59E0B] to-[#F59E0B]/60 flex items-center justify-center">
            <Zap className="w-7 h-7" />
          </div>
          <div className="flex-1">
            <p className="text-white/60 text-sm mb-1">Уровень энергии</p>
            <div className="flex items-end gap-2">
              <span className="text-4xl tracking-tight">{avgEnergy || '-'}</span>
              <span className="text-xl text-white/40 mb-1">/ 100</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-[20px] p-3 text-center">
          <Heart className="w-5 h-5 text-[#EF4444] mx-auto mb-1" />
          <p className="text-white/50 text-[10px] mb-1">Восстан.</p>
          <p className="text-xl font-bold">{recoveryScore || '-'}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card rounded-[20px] p-3 text-center">
          <Brain className="w-5 h-5 text-[#4DA3FF] mx-auto mb-1" />
          <p className="text-white/50 text-[10px] mb-1">Стресс</p>
          <p className="text-xl font-bold">{stressLevel > 0 ? stressLevel : '-'}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-[20px] p-3 text-center">
          <Activity className="w-5 h-5 text-[#22C55E] mx-auto mb-1" />
          <p className="text-white/50 text-[10px] mb-1">Активн.</p>
          <p className="text-xl font-bold">{fitnessScore > 0 ? fitnessScore : '-'}</p>
        </motion.div>
      </div>

      {/* Detected Issues */}
      {issues.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-[#F59E0B]" />
            <h2 className="text-lg">Проблемы</h2>
          </div>
          <div className="space-y-3">
            {issues.map((issue, index) => (
              <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + index * 0.05 }} className="glass-card rounded-[16px] px-4 py-3 flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${issue.severity === 'high' ? 'bg-red-500' : issue.severity === 'medium' ? 'bg-[#F59E0B]' : 'bg-yellow-500'}`} />
                <span className="text-sm">{issue.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-[#4DA3FF]" />
            <h2 className="text-lg">Рекомендации</h2>
          </div>
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 + index * 0.05 }} className="glass-card rounded-[16px] px-4 py-3 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#4DA3FF]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[#4DA3FF] text-xs">{index + 1}</span>
                </div>
                <span className="text-sm text-white/90">{rec}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {avgEnergy === 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card rounded-[24px] p-8 text-center">
          <div className="w-16 h-16 rounded-[20px] bg-[#4DA3FF]/20 flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-[#4DA3FF]" />
          </div>
          <h3 className="text-xl font-bold mb-2">Недостаточно данных</h3>
          <p className="text-white/60 text-sm mb-4">Заполните данные в разделах питания, сна и фитнеса для получения анализа</p>
          <button onClick={() => navigate('/')} className="px-6 py-3 bg-[#4DA3FF] rounded-[16px] text-white font-medium">На главную</button>
        </motion.div>
      )}
    </div>
  );
}
