import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Dumbbell, Calendar, Flame, Plus, Trash2, Timer, CheckCircle, Clock, BarChart3, Brain, MessageCircle, Camera, Image } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { AIConsultantChat } from '../components/AIConsultantChat';

const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const workoutTemplates = [
  { name: 'Грудь + Трицепс', exercises: 8, duration: 60, calories: 350 },
  { name: 'Спина + Бицепс', exercises: 9, duration: 65, calories: 380 },
  { name: 'Ноги + Плечи', exercises: 10, duration: 75, calories: 450 },
  { name: 'Кардио', exercises: 5, duration: 45, calories: 400 },
  { name: 'Full Body', exercises: 12, duration: 70, calories: 420 },
];

export function Fitness() {
  const navigate = useNavigate();
  const { state, addWorkout, removeWorkout, addProgressPhoto, removeProgressPhoto } = useApp();
  const [showAddWorkout, setShowAddWorkout] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [showWeekPlan, setShowWeekPlan] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showPhotos, setShowPhotos] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Timer logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timerActive) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const completedWorkouts = state.workouts.filter(w => w.completed);
  const fitnessScore = Math.min(100, completedWorkouts.length * 20);
  const totalCaloriesBurned = completedWorkouts.reduce((sum, w) => sum + w.calories, 0);

  // Weekly plan state
  const [weeklyPlan, setWeeklyPlan] = useState<Record<number, string>>({});

  return (
    <div className="w-full min-h-screen bg-[#0B0B0F] px-6 pt-12 pb-6 overflow-y-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="w-10 h-10 rounded-[12px] glass-card flex items-center justify-center active:scale-95 transition-transform">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-3xl">Фитнес</h1>
          </div>
          <motion.button 
            whileTap={{ scale: 0.95 }} 
            onClick={() => setShowChat(true)} 
            className="px-3 py-2 bg-gradient-to-r from-[#F59E0B] to-[#EF4444] rounded-[12px] text-white font-bold flex items-center gap-1.5 shadow-lg shadow-[#F59E0B]/30"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-xs">AI</span>
          </motion.button>
        </div>
        <div className="flex items-center gap-2">
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowTimer(true)} className="w-10 h-10 rounded-[12px] glass-card flex items-center justify-center text-[#F59E0B]">
            <Timer className="w-5 h-5" />
          </motion.button>
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowAddWorkout(true)} className="w-10 h-10 rounded-[14px] bg-[#F59E0B] flex items-center justify-center text-white">
            <Plus className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>

      {/* AI Trainer */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-[20px] p-4 mb-6 bg-gradient-to-r from-[#F59E0B]/10 to-[#EF4444]/5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[12px] bg-[#F59E0B]/20 flex items-center justify-center">
              <Brain className="w-5 h-5 text-[#F59E0B]" />
            </div>
            <div>
              <h3 className="text-sm font-bold">AI Тренер</h3>
              <p className="text-xs text-white/50">Персональные тренировки</p>
            </div>
          </div>
          <button 
            onClick={() => setShowChat(true)}
            className="px-3 py-1.5 bg-[#F59E0B]/20 hover:bg-[#F59E0B]/30 transition-colors rounded-[12px] text-[#F59E0B] text-xs font-bold flex items-center gap-1"
          >
            <MessageCircle className="w-3 h-3" />
            Чат
          </button>
        </div>
        <AITrainer workouts={state.workouts} />
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-[20px] p-4 text-center">
          <Flame className="w-6 h-6 text-[#F59E0B] mx-auto mb-2" />
          <p className="text-white/50 text-xs mb-1">Ккал</p>
          <p className="text-lg font-bold">{totalCaloriesBurned}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card rounded-[20px] p-4 text-center">
          <CheckCircle className="w-6 h-6 text-[#22C55E] mx-auto mb-2" />
          <p className="text-white/50 text-xs mb-1">Тренировки</p>
          <p className="text-lg font-bold">{completedWorkouts.length}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-[20px] p-4 text-center">
          <BarChart3 className="w-6 h-6 text-[#4DA3FF] mx-auto mb-2" />
          <p className="text-white/50 text-xs mb-1">Активность</p>
          <p className="text-lg font-bold">{fitnessScore}%</p>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <motion.button initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} onClick={() => setShowTimer(true)} className="glass-card rounded-[16px] p-3 flex flex-col items-center gap-2 active:scale-95 transition-transform">
          <div className="w-10 h-10 rounded-[10px] bg-[#F59E0B]/20 flex items-center justify-center">
            <Timer className="w-5 h-5 text-[#F59E0B]" />
          </div>
          <span className="text-xs">Таймер</span>
        </motion.button>

        <motion.button initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} onClick={() => setShowWeekPlan(true)} className="glass-card rounded-[16px] p-3 flex flex-col items-center gap-2 active:scale-95 transition-transform">
          <div className="w-10 h-10 rounded-[10px] bg-[#4DA3FF]/20 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-[#4DA3FF]" />
          </div>
          <span className="text-xs">План</span>
        </motion.button>

        <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} onClick={() => setShowPhotos(true)} className="glass-card rounded-[16px] p-3 flex flex-col items-center gap-2 active:scale-95 transition-transform">
          <div className="w-10 h-10 rounded-[10px] bg-[#22C55E]/20 flex items-center justify-center">
            <Image className="w-5 h-5 text-[#22C55E]" />
          </div>
          <span className="text-xs">Фото</span>
        </motion.button>

        <motion.button initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} onClick={() => setShowAddWorkout(true)} className="glass-card rounded-[16px] p-3 flex flex-col items-center gap-2 active:scale-95 transition-transform">
          <div className="w-10 h-10 rounded-[10px] bg-[#22C55E]/20 flex items-center justify-center">
            <Plus className="w-5 h-5 text-[#22C55E]" />
          </div>
          <span className="text-xs">Добавить</span>
        </motion.button>
      </div>

      {/* Weekly Overview */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-[24px] p-5 mb-6">
        <h3 className="text-lg mb-4">Эта неделя</h3>
        <div className="flex justify-between">
          {weekDays.map((day, index) => {
            const hasWorkout = completedWorkouts.some(w => {
              const wDate = new Date(w.date);
              const dayOfWeek = wDate.getDay();
              return dayOfWeek === 0 ? index === 6 : dayOfWeek - 1 === index;
            });
            const isToday = index === (new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
            return (
              <div key={day} className="flex flex-col items-center gap-2">
                <span className={`text-xs ${isToday ? 'text-white font-bold' : 'text-white/30'}`}>{day}</span>
                <div className={`w-9 h-14 rounded-full flex items-center justify-center ${hasWorkout ? 'bg-gradient-to-t from-[#F59E0B] to-[#F59E0B]/60' : 'bg-white/5'}`}>
                  {hasWorkout ? <Flame className="w-4 h-4 text-white" /> : <span className="text-white/20">-</span>}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Workouts History */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between px-1">
          <p className="text-white/60 text-sm">История тренировок</p>
          <button onClick={() => setShowAddWorkout(true)} className="text-[#F59E0B] text-sm flex items-center gap-1">
            <Plus className="w-4 h-4" /> Добавить
          </button>
        </div>

        {state.workouts.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card rounded-[24px] p-8 text-center">
            <div className="w-16 h-16 rounded-[20px] bg-[#F59E0B]/20 flex items-center justify-center mx-auto mb-4">
              <Dumbbell className="w-8 h-8 text-[#F59E0B]" />
            </div>
            <h3 className="text-xl font-bold mb-2">Нет записей о тренировках</h3>
            <p className="text-white/60 text-sm mb-4">Добавьте первую тренировку</p>
            <button onClick={() => setShowAddWorkout(true)} className="px-6 py-3 bg-[#F59E0B] rounded-[16px] text-white font-medium">Добавить тренировку</button>
          </motion.div>
        ) : (
          state.workouts.slice().reverse().map((workout, index) => (
            <motion.div key={workout.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + index * 0.05 }} className={`glass-card rounded-[20px] p-4 ${!workout.completed ? 'opacity-60' : ''}`}>
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
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {workout.duration} мин</span>
                <span className="flex items-center gap-1"><Dumbbell className="w-3 h-3" /> {workout.exercises} упр.</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${workout.completed ? 'bg-[#22C55E]/20 text-[#22C55E]' : 'bg-white/10 text-white/40'}`}>
                  {workout.completed ? 'Выполнено' : 'Запланировано'}
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showAddWorkout && <AddWorkoutModal onClose={() => setShowAddWorkout(false)} onAdd={addWorkout} />}
        {showTimer && <TimerModal onClose={() => setShowTimer(false)} time={timerSeconds} active={timerActive} setActive={setTimerActive} setTime={setTimerSeconds} onAddWorkout={addWorkout} />}
        {showWeekPlan && <WeekPlanModal onClose={() => setShowWeekPlan(false)} plan={weeklyPlan} setPlan={setWeeklyPlan} />}
        {showChat && <AIConsultantChat type="fitness" onClose={() => setShowChat(false)} userData={{ workouts: state.workouts }} />}
        {showPhotos && <ProgressPhotosModal onClose={() => setShowPhotos(false)} photos={state.progressPhotos} onAdd={addProgressPhoto} onRemove={removeProgressPhoto} fileInputRef={fileInputRef} />}
      </AnimatePresence>
    </div>
  );
}

function AITrainer({ workouts }: { workouts: any[] }) {
  const completed = workouts.filter(w => w.completed).length;
  
  const getAdvice = () => {
    if (workouts.length === 0) {
      return 'Добавьте первую тренировку для получения рекомендаций.';
    }
    if (completed >= 3) {
      return 'Отличная работа! Вы выполнили достаточно тренировок на этой неделе. Не забывайте про восстановление.';
    }
    if (completed >= 1) {
      return 'Хороший прогресс! Добавьте ещё 1-2 тренировки для оптимального результата.';
    }
    return 'Начните с 3 тренировок в неделю: грудь+трицепс, спина+бицепс, ноги+плечи.';
  };

  return (
    <div className="space-y-2">
      <p className="text-sm text-white/80">{getAdvice()}</p>
      {completed === 0 && workouts.length > 0 && (
        <p className="text-xs text-[#F59E0B]">⚠️ Запланированы тренировки, но ещё не выполнены</p>
      )}
    </div>
  );
}

function TimerModal({ onClose, time, active, setActive, setTime, onAddWorkout }: { onClose: () => void; time: number; active: boolean; setActive: (v: boolean) => void; setTime: (v: number) => void; onAddWorkout: (w: any) => void }) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFinish = () => {
    const now = new Date();
    onAddWorkout({
      name: `Тренировка ${now.toLocaleDateString()}`,
      duration: Math.floor(time / 60),
      exercises: 8,
      calories: Math.floor(time / 60 * 6),
      date: now.toISOString().split('T')[0],
      completed: true,
    });
    setActive(false);
    setTime(0);
    onClose();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={(e) => e.stopPropagation()} className="glass-card rounded-[32px] w-full max-w-sm p-8 text-center">
        <h2 className="text-2xl font-bold mb-6">Таймер тренировки</h2>
        
        <div className="text-7xl font-mono font-bold mb-8">{formatTime(time)}</div>
        
        <div className="flex gap-3 mb-6">
          <button onClick={() => setActive(!active)} className={`flex-1 py-4 rounded-[20px] font-bold text-lg ${active ? 'bg-[#EF4444]' : 'bg-[#22C55E]'} text-white`}>
            {active ? 'Пауза' : 'Старт'}
          </button>
          <button onClick={() => { setActive(false); setTime(0); }} className="py-4 px-6 glass-card rounded-[20px] text-white font-bold">
            Сброс
          </button>
        </div>
        
        {time > 60 && (
          <button onClick={handleFinish} className="w-full py-4 bg-[#F59E0B] rounded-[20px] text-white font-bold">
            Завершить и сохранить
          </button>
        )}
        
        <button onClick={onClose} className="w-full py-3 mt-3 glass-card rounded-[20px] text-white/70">
          Закрыть
        </button>
      </motion.div>
    </motion.div>
  );
}

function WeekPlanModal({ onClose, plan, setPlan }: { onClose: () => void; plan: Record<number, string>; setPlan: (v: Record<number, string>) => void }) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const handleSelectWorkout = (workout: any) => {
    if (selectedDay !== null) {
      setPlan({ ...plan, [selectedDay]: workout.name });
      setSelectedDay(null);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} onClick={(e) => e.stopPropagation()} className="glass-card rounded-t-[32px] w-full max-w-md p-6 pb-8 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl">План на неделю</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">✕</button>
        </div>

        <div className="space-y-3 mb-6">
          {weekDays.map((day, index) => (
            <button key={day} onClick={() => setSelectedDay(index)} className="w-full glass-card rounded-[16px] p-4 flex items-center justify-between hover:bg-white/10 transition-colors">
              <span className="text-white/90 font-medium">{day}</span>
              <span className="text-white/60 text-sm">{plan[index] || 'Нет тренировки'}</span>
            </button>
          ))}
        </div>

        {selectedDay !== null && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-[20px] p-4 mb-4">
            <h3 className="text-lg mb-3">Выберите тренировку для {weekDays[selectedDay]}</h3>
            <div className="space-y-2">
              {workoutTemplates.map((workout, i) => (
                <button key={i} onClick={() => handleSelectWorkout(workout)} className="w-full glass-card rounded-[12px] p-3 flex items-center justify-between hover:bg-white/10 transition-colors">
                  <span className="text-white/90">{workout.name}</span>
                  <span className="text-white/40 text-xs">{workout.duration} мин</span>
                </button>
              ))}
            </div>
            <button onClick={() => setSelectedDay(null)} className="w-full py-3 mt-3 glass-card rounded-[16px] text-white/70">Отмена</button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

function AddWorkoutModal({ onClose, onAdd }: { onClose: () => void; onAdd: (w: any) => void }) {
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
    onClose();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} onClick={(e) => e.stopPropagation()} className="glass-card rounded-t-[32px] w-full max-w-md p-6 pb-32 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl">Добавить тренировку</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">✕</button>
        </div>
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
              <input type="number" value={calories} onChange={(e) => setCalories(e.target.value)} placeholder="350" className="w-full glass-card rounded-[16px] px-4 py-3 bg-white/5 outline-none focus:ring-2 focus:ring-[#F59E0B]" />
            </div>
          </div>
          <div>
            <label className="text-white/60 text-sm mb-2 block">Упражнений</label>
            <input type="number" value={exercises} onChange={(e) => setExercises(e.target.value)} placeholder="8" className="w-full glass-card rounded-[16px] px-4 py-3 bg-white/5 outline-none focus:ring-2 focus:ring-[#F59E0B]" />
          </div>
          <div className="flex gap-3 pt-4">
            <button onClick={onClose} className="flex-1 py-4 glass-card rounded-[20px] text-white font-medium">Отмена</button>
            <button onClick={handleSubmit} className="flex-1 py-4 bg-[#F59E0B] rounded-[20px] text-white font-medium">Добавить</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProgressPhotosModal({ onClose, photos, onAdd, onRemove, fileInputRef }: { onClose: () => void; photos: any[]; onAdd: (p: any) => void; onRemove: (id: number) => void; fileInputRef: React.RefObject<HTMLInputElement | null> }) {
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          onAdd({
            date: new Date().toISOString().split('T')[0],
            photo: reader.result as string,
            weight: Number(weight) || 0,
            notes,
          });
          setWeight('');
          setNotes('');
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        };
        reader.onerror = () => {
          console.error('Error reading file');
        };
        reader.readAsDataURL(file);
      } catch (err) {
        console.error('File error:', err);
      }
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[90] flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} onClick={(e) => e.stopPropagation()} className="glass-card rounded-t-[32px] w-full max-w-md p-6 pb-40 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl">Фото прогресса</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">✕</button>
        </div>

        {/* Add Photo Section */}
        <div className="glass-card rounded-[20px] p-4 mb-6">
          <h3 className="text-lg mb-4">Добавить фото</h3>
          <input ref={fileInputRef} type="file" accept="image/*" capture="user" onChange={handleFileChange} className="hidden" />
          <div className="space-y-3">
            <button onClick={() => fileInputRef.current?.click()} className="w-full py-3 bg-[#22C55E] rounded-[16px] text-white font-medium flex items-center justify-center gap-2">
              <Camera className="w-5 h-5" />
              Сделать фото
            </button>
            <div className="grid grid-cols-2 gap-3">
              <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Вес (кг)" className="glass-card rounded-[12px] px-3 py-2 bg-white/5 outline-none focus:ring-2 focus:ring-[#22C55E]" />
              <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Заметка" className="glass-card rounded-[12px] px-3 py-2 bg-white/5 outline-none focus:ring-2 focus:ring-[#22C55E]" />
            </div>
          </div>
        </div>

        {/* Photos Grid */}
        <div className="space-y-4">
          <h3 className="text-lg">История фото</h3>
          {photos.length === 0 ? (
            <p className="text-white/50 text-center py-8">Нет фото. Добавьте первое фото прогресса!</p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {photos.slice().reverse().map((photo) => (
                <div key={photo.id} className="glass-card rounded-[16px] overflow-hidden">
                  <img src={photo.photo} alt={photo.date} className="w-full h-48 object-cover" />
                  <div className="p-3">
                    <p className="text-sm text-white/90">{photo.date}</p>
                    {photo.weight > 0 && <p className="text-xs text-white/50">{photo.weight} кг</p>}
                    {photo.notes && <p className="text-xs text-white/40 mt-1">{photo.notes}</p>}
                    <button onClick={() => onRemove(photo.id)} className="w-full mt-2 py-2 bg-red-500/20 rounded-[8px] text-red-500 text-xs">Удалить</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
