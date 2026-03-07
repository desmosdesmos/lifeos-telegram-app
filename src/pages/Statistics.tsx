import { motion } from 'motion/react';
import { ChevronLeft, TrendingUp, TrendingDown, Activity, Moon, Flame, Droplets } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getAvailableMonths, filterByMonth, getMonthDisplay, getCurrentMonth } from '../utils/dateUtils';

export function Statistics() {
  const navigate = useNavigate();
  const { state } = useApp();
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());

  // Get available months from all data
  const allData = [
    ...state.progressPhotos,
    ...state.sleepDays,
    ...state.workouts,
  ];
  const availableMonths = allData.length > 0 ? getAvailableMonths(allData) : [];
  
  // Filter data by selected month
  const filteredSleep = filterByMonth(state.sleepDays, selectedMonth);
  const filteredWorkouts = filterByMonth(state.workouts, selectedMonth);
  const filteredPhotos = filterByMonth(state.progressPhotos, selectedMonth);
  const filteredMeals = state.meals.filter(m => {
    try {
      const mealDate = new Date(m.time);
      const mealMonth = `${mealDate.getFullYear()}-${String(mealDate.getMonth() + 1).padStart(2, '0')}`;
      return mealMonth === selectedMonth;
    } catch {
      return false;
    }
  });

  // Calculate trends
  const getWeightTrend = () => {
    if (filteredPhotos.length < 2) return 0;
    const sorted = [...filteredPhotos].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    const first = sorted[0].weight;
    const last = sorted[sorted.length - 1].weight;
    return last - first;
  };

  const getSleepTrend = () => {
    if (filteredSleep.length < 2) return 0;
    const avg = filteredSleep.reduce((sum, d) => sum + d.quality, 0) / filteredSleep.length;
    return avg - 50; // Compare to baseline
  };

  const weightTrend = getWeightTrend();
  const sleepTrend = getSleepTrend();

  // Get last 7 days data for charts
  const getLast7DaysSleep = () => {
    const sorted = [...filteredSleep].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    return sorted.slice(-7);
  };

  const getLast7DaysWorkouts = () => {
    const sorted = [...filteredWorkouts].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    return sorted.slice(-7);
  };

  const sleepData = getLast7DaysSleep();
  const workoutData = getLast7DaysWorkouts();

  const maxSleep = sleepData.length > 0 ? Math.max(...sleepData.map(d => d.quality || 0), 100) : 100;
  const maxWorkoutCalories = workoutData.length > 0 ? Math.max(...workoutData.map(w => w.calories || 0), 100) : 100;

  return (
    <div className="w-full min-h-screen bg-[#0B0B0F] px-6 pt-12 pb-6 overflow-y-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-center gap-3">
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
            {filteredPhotos.length > 0 
              ? filteredPhotos[filteredPhotos.length - 1].weight 
              : '-'}
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
            <Moon className="w-5 h-5 text-[#4DA3FF]" />
            <span className="text-white/60 text-xs">Сон</span>
          </div>
          <p className="text-2xl font-bold">
            {filteredSleep.length > 0 
              ? Math.round(filteredSleep.reduce((sum, d) => sum + d.quality, 0) / filteredSleep.length)
              : '-'}
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

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-[20px] p-4">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-5 h-5 text-[#F59E0B]" />
            <span className="text-white/60 text-xs">Тренировки</span>
          </div>
          <p className="text-2xl font-bold">{filteredWorkouts.length}</p>
          <p className="text-xs text-white/40 mt-1">за {getMonthDisplay(selectedMonth)}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card rounded-[20px] p-4">
          <div className="flex items-center gap-2 mb-2">
            <Droplets className="w-5 h-5 text-[#22C55E]" />
            <span className="text-white/60 text-xs">Питание</span>
          </div>
          <p className="text-2xl font-bold">{filteredMeals.length}</p>
          <p className="text-xs text-white/40 mt-1">приёмов пищи</p>
        </motion.div>
      </div>

      {/* Sleep Chart */}
      {sleepData.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-[24px] p-5 mb-6">
          <h3 className="text-lg mb-4">Качество сна (7 дней)</h3>
          <div className="flex items-end justify-between h-32 gap-2">
            {sleepData.map((day, index) => {
              const height = (day.quality / maxSleep) * 100;
              const date = new Date(day.date);
              const dayName = date.toLocaleDateString('ru-RU', { weekday: 'short' });
              return (
                <div key={index} className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-full bg-[#4DA3FF]/20 rounded-t-[8px] relative" style={{ height: `${height}%` }}>
                    <div className="absolute bottom-0 left-0 right-0 top-0 bg-gradient-to-t from-[#4DA3FF] to-[#4DA3FF]/60 rounded-t-[8px]" />
                  </div>
                  <span className="text-xs text-white/50">{dayName}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Workout Chart */}
      {workoutData.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card rounded-[24px] p-5 mb-6">
          <h3 className="text-lg mb-4">Сожжённые калории (7 дней)</h3>
          <div className="flex items-end justify-between h-32 gap-2">
            {workoutData.map((workout, index) => {
              const height = (workout.calories / maxWorkoutCalories) * 100;
              const date = new Date(workout.date);
              const dayName = date.toLocaleDateString('ru-RU', { weekday: 'short' });
              return (
                <div key={index} className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-full bg-[#F59E0B]/20 rounded-t-[8px] relative" style={{ height: `${height}%` }}>
                    <div className="absolute bottom-0 left-0 right-0 top-0 bg-gradient-to-t from-[#F59E0B] to-[#F59E0B]/60 rounded-t-[8px]" />
                  </div>
                  <span className="text-xs text-white/50">{dayName}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Progress Photos Summary */}
      {filteredPhotos.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card rounded-[24px] p-5 mb-6">
          <h3 className="text-lg mb-4">Прогресс тела за {getMonthDisplay(selectedMonth)}</h3>
          <div className="grid grid-cols-3 gap-3">
            {filteredPhotos.slice(-3).reverse().map((photo) => (
              <div key={photo.id} className="aspect-square rounded-[16px] overflow-hidden">
                <img src={photo.photo} alt={photo.date} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <p className="text-white/40 text-xs mt-3 text-center">
            {filteredPhotos.length} фото за месяц
          </p>
        </motion.div>
      )}

      {/* Export Data */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card rounded-[24px] p-5">
        <h3 className="text-lg mb-3">Экспорт данных</h3>
        <p className="text-white/60 text-sm mb-4">
          Сохраните все свои данные в формате JSON для резервной копии или переноса
        </p>
        <button 
          onClick={() => exportData(state)}
          className="w-full py-3 bg-[#4DA3FF] rounded-[16px] text-white font-medium"
        >
          Скачать данные (JSON)
        </button>
      </motion.div>
    </div>
  );
}

function exportData(state: any) {
  const dataStr = JSON.stringify(state, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `lifeos-data-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
}
