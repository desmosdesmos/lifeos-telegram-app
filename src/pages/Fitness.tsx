import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Dumbbell, Play, Calendar, Flame, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { useApp } from '../context/AppContext';

export function Fitness() {
  const navigate = useNavigate();
  const { state, addWorkout, removeWorkout } = useApp();
  const [showAddWorkout, setShowAddWorkout] = useState(false);

  const completedWorkouts = state.workouts.filter(w => w.completed);
  const fitnessScore = Math.min(100, completedWorkouts.length * 20);

  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  const today = new Date().getDay();

  return (
    <div className="w-full min-h-screen bg-[#0B0B0F] px-6 pt-12 pb-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="w-10 h-10 rounded-[12px] glass-card flex items-center justify-center active:scale-95 transition-transform">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl">Фитнес</h1>
        </div>
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowAddWorkout(true)} className="w-11 h-11 rounded-[14px] bg-[#4DA3FF] flex items-center justify-center text-white">
          <Plus className="w-5 h-5" />
        </motion.button>
      </motion.div>

      {/* Fitness Score */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="glass-card rounded-[24px] p-6 mb-6">
        <p className="text-white/60 text-sm mb-2">Активность</p>
        <div className="flex items-end gap-2">
          <span className="text-5xl tracking-tight">{fitnessScore}</span>
          <span className="text-2xl text-white/40 mb-1">/ 100</span>
        </div>
        <p className="text-white/50 text-xs mt-2">{completedWorkouts.length} тренировок выполнено</p>
      </motion.div>

      {/* Weekly Overview */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-[24px] p-6 mb-6">
        <h3 className="text-lg mb-4">Эта неделя</h3>
        <div className="flex justify-between">
          {weekDays.map((day, index) => {
            const isToday = index === (today === 0 ? 6 : today - 1);
            const workout = completedWorkouts.find(w => {
              const wDate = new Date(w.date);
              return wDate.getDay() - 1 === index;
            });
            return (
              <div key={day} className="flex flex-col items-center gap-2">
                <span className={`text-xs ${isToday ? 'text-white font-bold' : 'text-white/30'}`}>{day}</span>
                <div className={`w-8 h-12 rounded-full flex items-center justify-center ${workout ? 'bg-gradient-to-t from-[#F59E0B] to-[#F59E0B]/60' : 'bg-white/5'}`}>
                  {workout && <Flame className="w-4 h-4 text-white" />}
                </div>
                <span className="text-xs text-white/40">{workout ? workout.calories : '-'}</span>
              </div>
            );
          })}
        </div>
        <div className="mt-4 pt-4 border-t border-white/10 flex justify-between text-sm">
          <span className="text-white/50">Тренировок</span>
          <span className="text-white">{completedWorkouts.length}</span>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <motion.button initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} onClick={() => setShowAddWorkout(true)} className="glass-card rounded-[20px] p-4 flex flex-col items-center gap-3 active:scale-95 transition-transform">
          <div className="w-12 h-12 rounded-[16px] bg-[#4DA3FF]/20 flex items-center justify-center">
            <Play className="w-6 h-6 text-[#4DA3FF]" />
          </div>
          <span className="text-sm font-medium">Начать тренировку</span>
        </motion.button>
        <motion.button initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-[20px] p-4 flex flex-col items-center gap-3 active:scale-95 transition-transform">
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
          <button onClick={() => setShowAddWorkout(true)} className="text-[#4DA3FF] text-sm flex items-center gap-1">
            <Plus className="w-4 h-4" /> Добавить
          </button>
        </div>

        {state.workouts.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card rounded-[20px] p-8 text-center">
            <div className="w-16 h-16 rounded-[20px] bg-[#F59E0B]/20 flex items-center justify-center mx-auto mb-4">
              <Dumbbell className="w-8 h-8 text-[#F59E0B]" />
            </div>
            <p className="text-white/70 mb-2">Нет записей о тренировках</p>
            <button onClick={() => setShowAddWorkout(true)} className="px-6 py-3 bg-[#F59E0B] rounded-[16px] text-white font-medium">
              Добавить тренировку
            </button>
          </motion.div>
        ) : (
          state.workouts.map((workout, index) => (
            <motion.div key={workout.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + index * 0.05 }} className={`glass-card rounded-[20px] p-5 ${!workout.completed ? 'opacity-60' : ''}`}>
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
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-lg font-bold">{workout.calories}</p>
                    <p className="text-white/40 text-xs">ккал</p>
                  </div>
                  <button onClick={() => removeWorkout(workout.id)} className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center hover:bg-red-500/30 transition-colors">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-white/50">
                <span className="flex items-center gap-1"><Play className="w-3 h-3" /> {workout.duration} мин</span>
                <span className="flex items-center gap-1"><Dumbbell className="w-3 h-3" /> {workout.exercises} упражнений</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${workout.completed ? 'bg-[#22C55E]/20 text-[#22C55E]' : 'bg-white/10 text-white/40'}`}>
                  {workout.completed ? 'Выполнено' : 'Запланировано'}
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add Workout Modal */}
      <AnimatePresence>
        {showAddWorkout && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowAddWorkout(false)}>
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} onClick={(e) => e.stopPropagation()} className="glass-card rounded-t-[32px] w-full max-w-md p-6 pb-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl">Добавить тренировку</h2>
                <button onClick={() => setShowAddWorkout(false)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">✕</button>
              </div>
              <AddWorkoutForm onAdd={(w) => { addWorkout(w); setShowAddWorkout(false); }} onCancel={() => setShowAddWorkout(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AddWorkoutForm({ onAdd, onCancel }: { onAdd: (w: any) => void; onCancel: () => void }) {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [exercises, setExercises] = useState('');
  const [calories, setCalories] = useState('');

  const handleSubmit = () => {
    if (!name || !duration) return;
    onAdd({
      name,
      duration: Number(duration),
      exercises: Number(exercises) || 0,
      calories: Number(calories) || 0,
      date: new Date().toISOString().split('T')[0],
      completed: true,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-white/60 text-sm mb-2 block">Название</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Например: Грудь + Трицепс" className="w-full glass-card rounded-[16px] px-4 py-3 bg-white/5 outline-none focus:ring-2 focus:ring-[#F59E0B]" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-white/60 text-sm mb-2 block">Длительность (мин)</label>
          <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="60" className="w-full glass-card rounded-[16px] px-4 py-3 bg-white/5 outline-none focus:ring-2 focus:ring-[#F59E0B]" />
        </div>
        <div>
          <label className="text-white/60 text-sm mb-2 block">Ккал</label>
          <input type="number" value={calories} onChange={(e) => setCalories(e.target.value)} placeholder="300" className="w-full glass-card rounded-[16px] px-4 py-3 bg-white/5 outline-none focus:ring-2 focus:ring-[#F59E0B]" />
        </div>
      </div>
      <div>
        <label className="text-white/60 text-sm mb-2 block">Упражнений</label>
        <input type="number" value={exercises} onChange={(e) => setExercises(e.target.value)} placeholder="8" className="w-full glass-card rounded-[16px] px-4 py-3 bg-white/5 outline-none focus:ring-2 focus:ring-[#F59E0B]" />
      </div>
      <div className="flex gap-3 pt-4">
        <button onClick={onCancel} className="flex-1 py-4 glass-card rounded-[20px] text-white font-medium">Отмена</button>
        <button onClick={handleSubmit} className="flex-1 py-4 bg-[#F59E0B] rounded-[20px] text-white font-medium">Добавить</button>
      </div>
    </div>
  );
}
