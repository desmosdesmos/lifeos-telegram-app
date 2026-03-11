import { motion } from 'motion/react';
import { ChevronLeft, TrendingUp, TrendingDown, Activity, Moon, Flame } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getAvailableMonths, filterByMonth, getMonthDisplay, getCurrentMonth } from '../utils/dateUtils';

export function Statistics() {
  const navigate = useNavigate();
  const { state } = useApp();
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());

  // Защита от undefined
  const progressPhotos = state.progressPhotos || [];
  const sleepDays = state.sleepDays || [];
  const workouts = state.workouts || [];

  // Get available months
  const allData = [...progressPhotos, ...sleepDays, ...workouts].filter(Boolean);
  const availableMonths = allData.length > 0 ? getAvailableMonths(allData) : [];

  // Filter data
  const filteredSleep = filterByMonth(sleepDays, selectedMonth);
  const filteredWorkouts = filterByMonth(workouts, selectedMonth);
  const filteredPhotos = filterByMonth(progressPhotos, selectedMonth);

  // Calculate trends with protection
  const getWeightTrend = () => {
    if (filteredPhotos.length < 2) return 0;
    const sorted = [...filteredPhotos].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const first = sorted[0].weight || 0;
    const last = sorted[sorted.length - 1].weight || 0;
    return last - first;
  };

  const getSleepTrend = () => {
    if (filteredSleep.length < 2) return 0;
    const avg = filteredSleep.reduce((sum, d) => sum + (d.quality || 0), 0) / filteredSleep.length;
    return avg - 50;
  };

  const weightTrend = getWeightTrend();
  const sleepTrend = getSleepTrend();

  // Get last 7 days
  const sleepData = [...filteredSleep].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(-7);
  const workoutData = [...filteredWorkouts].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(-7);

  const maxSleep = sleepData.length > 0 ? Math.max(...sleepData.map(d => d.quality || 0), 100) : 100;
  const maxWorkoutCalories = workoutData.length > 0 ? Math.max(...workoutData.map(w => w.calories || 0), 100) : 100;

  return (
    <div className="w-full min-h-screen bg-[#0B0B0F] px-6 pt-12 pb-6 overflow-y-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center gap-3">
        <button onClick={() => navigate('/')} className="w-10 h-10 rounded-[12px] glass-card flex items-center justify-center active:scale-95 transition-transform">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl">Статистика</h1>
          {availableMonths.length > 0 && (
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="glass-card rounded-[12px] px-3 py-1 bg-white/5 outline-none focus:ring-2 focus:ring-[#F59E0B] text-sm mt-1"
            >
              {availableMonths.map(month => (
                <option key={month} value={month}>{getMonthDisplay(month)}</option>
              ))}
            </select>
          )}
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-[20px] p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-[#4DA3FF]" />
            <span className="text-white/60 text-xs">Вес</span>
          </div>
          <p className="text-2xl font-bold">
            {filteredPhotos.length > 0 ? filteredPhotos[filteredPhotos.length - 1].weight : '-'}
          </p>
          <div className="flex items-center gap-1 mt-1">
            {weightTrend !== 0 && (
              <>
                {weightTrend > 0 ? (
                  <TrendingUp className="w-3 h-3 text-[#F59E0B]" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-[#22C55E]" />
                )}
                <span className={`text-xs ${weightTrend > 0 ? 'text-[#F59E0B]' : 'text-[#22C55E]'}`}>
                  {weightTrend > 0 ? '+' : ''}{weightTrend.toFixed(1)} кг
                </span>
              </>
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card rounded-[20px] p-4">
          <div className="flex items-center gap-2 mb-2">
            <Moon className="w-5 h-5 text-[#F59E0B]" />
            <span className="text-white/60 text-xs">Сон</span>
          </div>
          <p className="text-2xl font-bold">
            {filteredSleep.length > 0 ? Math.round(filteredSleep.reduce((sum, d) => sum + (d.quality || 0), 0) / filteredSleep.length) : '-'}
          </p>
          <div className="flex items-center gap-1 mt-1">
            {sleepTrend !== 0 && (
              <>
                {sleepTrend > 0 ? (
                  <TrendingUp className="w-3 h-3 text-[#22C55E]" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-[#F59E0B]" />
                )}
                <span className={`text-xs ${sleepTrend > 0 ? 'text-[#22C55E]' : 'text-[#F59E0B]'}`}>
                  {sleepTrend > 0 ? '+' : ''}{sleepTrend.toFixed(0)}%
                </span>
              </>
            )}
          </div>
        </motion.div>
      </div>

      {/* Sleep Chart */}
      {sleepData.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-[24px] p-5 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-[12px] bg-[#F59E0B]/20 flex items-center justify-center">
              <Moon className="w-5 h-5 text-[#F59E0B]" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Качество сна</h3>
              <p className="text-white/40 text-xs">Последние 7 дней</p>
            </div>
          </div>
          <div className="flex items-end justify-between h-32 gap-2">
            {sleepData.map((day) => (
              <div key={day.id} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full bg-gradient-to-t from-[#F59E0B] to-[#F59E0B]/60 rounded-t-[8px] transition-all duration-500"
                  style={{ height: `${((day.quality || 0) / maxSleep) * 100}%` }}
                />
                <span className="text-white/30 text-[10px]">
                  {new Date(day.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Workout Chart */}
      {workoutData.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-[24px] p-5 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-[12px] bg-[#22C55E]/20 flex items-center justify-center">
              <Flame className="w-5 h-5 text-[#22C55E]" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Тренировки</h3>
              <p className="text-white/40 text-xs">Сожжённые калории</p>
            </div>
          </div>
          <div className="flex items-end justify-between h-32 gap-2">
            {workoutData.map((day) => (
              <div key={day.id} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full bg-gradient-to-t from-[#22C55E] to-[#22C55E]/60 rounded-t-[8px] transition-all duration-500"
                  style={{ height: `${((day.calories || 0) / maxWorkoutCalories) * 100}%` }}
                />
                <span className="text-white/30 text-[10px]">
                  {new Date(day.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {sleepData.length === 0 && workoutData.length === 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card rounded-[24px] p-8 text-center">
          <div className="w-16 h-16 rounded-[20px] bg-[#F59E0B]/20 flex items-center justify-center mx-auto mb-4">
            <Activity className="w-8 h-8 text-[#F59E0B]" />
          </div>
          <h3 className="text-xl font-bold mb-2">Нет данных</h3>
          <p className="text-white/60 text-sm mb-4">Добавьте данные о сне и тренировках для просмотра статистики</p>
          <button onClick={() => navigate('/quick-add')} className="px-6 py-3 bg-[#F59E0B] rounded-[16px] text-white font-medium">Добавить данные</button>
        </motion.div>
      )}
    </div>
  );
}
