import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Moon, Plus, Trash2, Brain, TrendingUp, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AIConsultantChat } from '../components/AIConsultantChat';

export function Sleep() {
  const navigate = useNavigate();
  const { state, addSleepDay, removeSleepDay } = useApp();
  const [showAddDay, setShowAddDay] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [editData, setEditData] = useState({
    bedtime: '23:00',
    wakeTime: '07:00',
    quality: 70,
  });

  // Calculate average sleep quality
  const avgQuality = state.sleepDays.length > 0 
    ? Math.round(state.sleepDays.reduce((sum, s) => sum + s.quality, 0) / state.sleepDays.length)
    : 0;

  const handleSave = () => {
    const bed = editData.bedtime.split(':').map(Number);
    const wake = editData.wakeTime.split(':').map(Number);
    let hours = wake[0] - bed[0];
    let minutes = wake[1] - bed[1];
    if (minutes < 0) { hours--; minutes += 60; }
    if (hours < 0) { hours += 24; }
    
    addSleepDay({
      date: new Date().toISOString().split('T')[0],
      bedtime: editData.bedtime,
      wakeTime: editData.wakeTime,
      duration: `${hours}ч ${minutes}м`,
      quality: editData.quality,
      deepSleep: `${Math.round(hours * 0.2)}ч ${Math.round(minutes * 0.2)}м`,
      remSleep: `${Math.round(hours * 0.25)}ч ${Math.round(minutes * 0.25)}м`,
      lightSleep: `${Math.round(hours * 0.55)}ч ${Math.round(minutes * 0.55)}м`,
    });
    setShowAddDay(false);
  };

  return (
    <div className="w-full min-h-screen bg-[#0B0B0F] px-6 pt-12 pb-6 overflow-y-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="w-10 h-10 rounded-[12px] glass-card flex items-center justify-center active:scale-95 transition-transform">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-3xl">Сон</h1>
          </div>
          <motion.button 
            whileTap={{ scale: 0.95 }} 
            onClick={() => setShowChat(true)} 
            className="px-4 py-3 bg-gradient-to-r from-[#4DA3FF] to-[#22C55E] rounded-[16px] text-white font-bold flex items-center gap-2 shadow-lg shadow-[#4DA3FF]/30"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm">AI-консультант</span>
          </motion.button>
        </div>
        <div className="flex items-center gap-2">
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowAddDay(true)} className="w-10 h-10 rounded-[14px] bg-[#4DA3FF] flex items-center justify-center text-white">
            <Plus className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>

      {/* AI Sleep Doctor */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-[20px] p-4 mb-6 bg-gradient-to-r from-[#4DA3FF]/10 to-[#22C55E]/5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[12px] bg-[#4DA3FF]/20 flex items-center justify-center">
              <Brain className="w-5 h-5 text-[#4DA3FF]" />
            </div>
            <div>
              <h3 className="text-sm font-bold">AI Сомнолог</h3>
              <p className="text-xs text-white/50">Персональные рекомендации по сну</p>
            </div>
          </div>
          <button 
            onClick={() => setShowChat(true)}
            className="px-3 py-1.5 bg-[#4DA3FF]/20 hover:bg-[#4DA3FF]/30 transition-colors rounded-[12px] text-[#4DA3FF] text-xs font-bold flex items-center gap-1"
          >
            <MessageCircle className="w-3 h-3" />
            Чат
          </button>
        </div>
        <AISleepDoctor avgQuality={avgQuality} sleepDays={state.sleepDays} />
      </motion.div>

      {/* Sleep Score */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="glass-card rounded-[24px] p-6 mb-6">
        <p className="text-white/60 text-sm mb-2">Среднее качество сна</p>
        <div className="flex items-end gap-2">
          <span className="text-5xl tracking-tight">{avgQuality}</span>
          <span className="text-2xl text-white/40 mb-1">/ 100</span>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <TrendingUp className={`w-4 h-4 ${avgQuality >= 70 ? 'text-[#22C55E]' : 'text-[#F59E0B]'}`} />
          <span className={`text-sm ${avgQuality >= 70 ? 'text-[#22C55E]' : 'text-[#F59E0B]'}`}>
            {avgQuality >= 70 ? 'Хороший сон' : avgQuality >= 50 ? 'Среднее качество' : 'Нужно улучшить'}
          </span>
        </div>
      </motion.div>

      {/* Sleep History */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between px-1">
          <p className="text-white/60 text-sm">История сна</p>
          <button onClick={() => setShowAddDay(true)} className="text-[#4DA3FF] text-sm flex items-center gap-1">
            <Plus className="w-4 h-4" /> Добавить
          </button>
        </div>

        {state.sleepDays.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-[24px] p-8 text-center">
            <div className="w-16 h-16 rounded-[20px] bg-[#4DA3FF]/20 flex items-center justify-center mx-auto mb-4">
              <Moon className="w-8 h-8 text-[#4DA3FF]" />
            </div>
            <h3 className="text-xl font-bold mb-2">Нет записей о сне</h3>
            <p className="text-white/60 text-sm mb-4">Добавьте данные о сне за прошлые дни</p>
            <button onClick={() => setShowAddDay(true)} className="px-6 py-3 bg-[#4DA3FF] rounded-[16px] text-white font-medium">Добавить сон</button>
          </motion.div>
        ) : (
          state.sleepDays.slice().reverse().map((sleepDay) => (
            <SleepDayCard key={sleepDay.id} sleepDay={sleepDay} onDelete={() => removeSleepDay(sleepDay.id)} />
          ))
        )}
      </div>
      
      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showAddDay && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowAddDay(false)}>
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} onClick={(e) => e.stopPropagation()} className="glass-card rounded-t-[32px] w-full max-w-md p-6 pb-32 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl">Добавить данные о сне</h2>
                <button onClick={() => setShowAddDay(false)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">✕</button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-white/60 text-sm mb-2 block">Дата</label>
                  <input type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full glass-card rounded-[16px] px-4 py-3 bg-white/5 outline-none focus:ring-2 focus:ring-[#4DA3FF]" />
                </div>
                <div>
                  <label className="text-white/60 text-sm mb-2 block">Время отхода ко сну</label>
                  <input type="time" value={editData.bedtime} onChange={(e) => setEditData({ ...editData, bedtime: e.target.value })} className="w-full glass-card rounded-[16px] px-4 py-3 bg-white/5 outline-none focus:ring-2 focus:ring-[#4DA3FF]" />
                </div>
                <div>
                  <label className="text-white/60 text-sm mb-2 block">Время подъёма</label>
                  <input type="time" value={editData.wakeTime} onChange={(e) => setEditData({ ...editData, wakeTime: e.target.value })} className="w-full glass-card rounded-[16px] px-4 py-3 bg-white/5 outline-none focus:ring-2 focus:ring-[#4DA3FF]" />
                </div>
                <div>
                  <label className="text-white/60 text-sm mb-2 block">Качество сна (%)</label>
                  <input type="range" min="0" max="100" value={editData.quality} onChange={(e) => setEditData({ ...editData, quality: Number(e.target.value) })} className="w-full" />
                  <p className="text-center text-white/60 mt-2">{editData.quality}%</p>
                </div>
                <div className="flex gap-3 pt-4">
                  <button onClick={() => setShowAddDay(false)} className="flex-1 py-4 glass-card rounded-[20px] text-white font-medium">Отмена</button>
                  <button onClick={handleSave} className="flex-1 py-4 bg-[#4DA3FF] rounded-[20px] text-white font-medium">Сохранить</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
        {showChat && <AIConsultantChat type="sleep" onClose={() => setShowChat(false)} userData={{ avgQuality, sleepDays: state.sleepDays }} />}
      </AnimatePresence>
    </div>
  );
}

function SleepDayCard({ sleepDay, onDelete }: { sleepDay: any; onDelete: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-[20px] p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[12px] bg-[#4DA3FF]/20 flex items-center justify-center">
            <Moon className="w-5 h-5 text-[#4DA3FF]" />
          </div>
          <div>
            <p className="text-white/90 font-medium">{sleepDay.date}</p>
            <p className="text-white/40 text-xs">{sleepDay.bedtime} - {sleepDay.wakeTime}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-lg font-bold">{sleepDay.quality}</p>
            <p className="text-white/40 text-xs">из 100</p>
          </div>
          <button onClick={onDelete} className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center hover:bg-red-500/30 transition-colors">
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-4 text-xs text-white/50">
        <span>🌙 {sleepDay.duration}</span>
        <span>😴 Глубокий: {sleepDay.deepSleep}</span>
      </div>
    </motion.div>
  );
}

function AISleepDoctor({ avgQuality, sleepDays }: { avgQuality: number; sleepDays: any[] }) {
  const getAdvice = () => {
    if (sleepDays.length === 0) {
      return 'Добавьте данные о сне, чтобы получить персональные рекомендации.';
    }
    if (avgQuality >= 80) {
      return 'Отличное качество сна! Продолжайте соблюдать режим и избегать синего света перед сном.';
    }
    if (avgQuality >= 60) {
      return 'Хороший сон, но есть куда расти. Попробуйте ложиться в одно и то же время и создайте ритуал отхода ко сну.';
    }
    return 'Качество сна требует улучшения. Рекомендую: ложиться до 23:00, избегать кофеина после 14:00, проветривать комнату перед сном.';
  };

  return (
    <div className="space-y-2">
      <p className="text-sm text-white/80">{getAdvice()}</p>
      {avgQuality < 60 && avgQuality > 0 && (
        <p className="text-xs text-[#F59E0B]">⚠️ Низкое качество сна. Обратите внимание на гигиену сна.</p>
      )}
    </div>
  );
}
