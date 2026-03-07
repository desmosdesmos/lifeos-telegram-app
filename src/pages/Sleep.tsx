import { motion } from 'motion/react';
import { ChevronLeft, Moon, Sun, Droplets, Edit2, Save } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { useApp } from '../context/AppContext';

export function Sleep() {
  const navigate = useNavigate();
  const { state, updateSleep } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    bedtime: state.sleep.bedtime,
    wakeTime: state.sleep.wakeTime,
    quality: state.sleep.quality,
  });

  const handleSave = () => {
    // Calculate duration
    const bed = editData.bedtime.split(':').map(Number);
    const wake = editData.wakeTime.split(':').map(Number);
    let hours = wake[0] - bed[0];
    let minutes = wake[1] - bed[1];
    if (minutes < 0) { hours--; minutes += 60; }
    if (hours < 0) { hours += 24; }
    
    updateSleep({
      ...editData,
      duration: `${hours}ч ${minutes}м`,
    });
    setIsEditing(false);
  };

  return (
    <div className="w-full min-h-screen bg-[#0B0B0F] px-6 pt-12 pb-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="w-10 h-10 rounded-[12px] glass-card flex items-center justify-center active:scale-95 transition-transform"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl">Сон</h1>
        </div>
        
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className={`w-11 h-11 rounded-[14px] flex items-center justify-center transition-colors ${
            isEditing ? 'bg-[#22C55E] text-white' : 'glass-card text-[#4DA3FF]'
          }`}
        >
          {isEditing ? <Save className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
        </motion.button>
      </motion.div>

      {isEditing && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-[24px] p-6 mb-6"
        >
          <h3 className="text-lg mb-4">Редактировать данные</h3>
          <div className="space-y-4">
            <div>
              <label className="text-white/60 text-sm mb-2 block">Время отхода ко сну</label>
              <input
                type="time"
                value={editData.bedtime}
                onChange={(e) => setEditData({ ...editData, bedtime: e.target.value })}
                className="w-full glass-card rounded-[16px] px-4 py-3 bg-white/5 outline-none focus:ring-2 focus:ring-[#4DA3FF]"
              />
            </div>
            <div>
              <label className="text-white/60 text-sm mb-2 block">Время подъёма</label>
              <input
                type="time"
                value={editData.wakeTime}
                onChange={(e) => setEditData({ ...editData, wakeTime: e.target.value })}
                className="w-full glass-card rounded-[16px] px-4 py-3 bg-white/5 outline-none focus:ring-2 focus:ring-[#4DA3FF]"
              />
            </div>
            <div>
              <label className="text-white/60 text-sm mb-2 block">Качество сна (%)</label>
              <input
                type="range"
                min="0"
                max="100"
                value={editData.quality}
                onChange={(e) => setEditData({ ...editData, quality: Number(e.target.value) })}
                className="w-full"
              />
              <p className="text-center text-white/60 mt-2">{editData.quality}%</p>
            </div>
            <button
              onClick={handleSave}
              className="w-full py-4 bg-[#4DA3FF] rounded-[20px] text-white font-medium"
            >
              Сохранить
            </button>
          </div>
        </motion.div>
      )}

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
            <span className="text-5xl tracking-tight">{state.sleep.quality}</span>
            <span className="text-2xl text-white/40 mb-1">/ 100</span>
          </div>
        </div>
      </motion.div>

      {/* Sleep Duration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-[24px] p-6 mb-6 text-center"
      >
        <p className="text-white/60 text-sm mb-3">Продолжительность</p>
        <div className="text-5xl mb-1 tracking-tight">{state.sleep.duration}</div>
        <p className="text-white/40 text-xs">Прошлой ночью</p>
      </motion.div>

      {/* Sleep Times */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-[20px] p-5"
        >
          <div className="w-10 h-10 rounded-[12px] bg-[#F59E0B]/20 flex items-center justify-center mb-3">
            <Moon className="w-5 h-5 text-[#F59E0B]" />
          </div>
          <p className="text-white/60 text-xs mb-1">Отбой</p>
          <p className="text-2xl">{state.sleep.bedtime}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-[20px] p-5"
        >
          <div className="w-10 h-10 rounded-[12px] bg-[#22C55E]/20 flex items-center justify-center mb-3">
            <Sun className="w-5 h-5 text-[#22C55E]" />
          </div>
          <p className="text-white/60 text-xs mb-1">Подъём</p>
          <p className="text-2xl">{state.sleep.wakeTime}</p>
        </motion.div>
      </div>

      {/* Sleep Stages */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card rounded-[24px] p-6 mb-6"
      >
        <h3 className="text-lg mb-4">Фазы сна</h3>
        <div className="space-y-4">
          <SleepStage icon={Droplets} name="Глубокий" value={state.sleep.deepSleep} color="#4DA3FF" />
          <SleepStage icon={Moon} name="REM" value={state.sleep.remSleep} color="#F59E0B" />
          <SleepStage icon={Sun} name="Лёгкий" value={state.sleep.lightSleep} color="#22C55E" />
        </div>
      </motion.div>
    </div>
  );
}

function SleepStage({ icon: Icon, name, value, color }: any) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-[12px]" style={{ backgroundColor: `${color}20` }}>
          <Icon className="w-5 h-5 mx-auto py-2" style={{ color }} />
        </div>
        <div>
          <p className="text-sm">{name}</p>
          <p className="text-white/50 text-xs">Фаза сна</p>
        </div>
      </div>
      <p className="text-lg font-bold">{value}</p>
    </div>
  );
}
