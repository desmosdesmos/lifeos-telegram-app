import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Camera, Edit2, RotateCcw, Sparkles, Trophy, TrendingUp, Apple, Dumbbell, DollarSign, LogOut, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { useApp, type UserProfile } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { CustomSelect } from '../components/CustomSelect';

const goals = ['Набор мышечной массы', 'Похудение', 'Поддержание веса', 'Улучшение здоровья', 'Повышение продуктивности', 'Выносливость', 'Сушка'];
const lifestyles = ['Сидячий', 'Умеренно активный', 'Активный', 'Очень активный'];
const genders = ['Мужской', 'Женский'];

interface ProfileField {
  label: string;
  value: string | number;
  key: keyof UserProfile;
  color: string;
  type: 'select' | 'number';
  options?: string[];
  suffix?: string;
}

export function Profile() {
  const navigate = useNavigate();
  const { state, updateProfile, resetAllData } = useApp();
  const { user, logout, signInWithGoogle } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [editedName, setEditedName] = useState(state.profile.name);

  const handleFieldChange = (key: keyof UserProfile, value: string | number) => {
    updateProfile({ [key]: value });
  };

  const handleNameBlur = () => {
    updateProfile({ name: editedName });
    setIsEditing(false);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        updateProfile({ avatarUrl: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const profileFields: ProfileField[] = [
    { label: 'Пол', value: state.profile.gender === 'male' ? 'Мужской' : 'Женский', key: 'gender', color: '#4DA3FF', type: 'select', options: genders },
    { label: 'Возраст', value: state.profile.age, key: 'age', color: '#F59E0B', type: 'number', suffix: ' лет' },
    { label: 'Вес', value: state.profile.weight, key: 'weight', color: '#4DA3FF', type: 'number', suffix: ' кг' },
    { label: 'Рост', value: state.profile.height, key: 'height', color: '#22C55E', type: 'number', suffix: ' см' },
    { label: 'Цель', value: state.profile.goal, key: 'goal', color: '#F59E0B', type: 'select', options: goals },
    { label: 'Образ жизни', value: state.profile.lifestyle, key: 'lifestyle', color: '#4DA3FF', type: 'select', options: lifestyles },
  ];

  return (
    <div className="w-full min-h-screen bg-[#0B0B0F] px-6 pt-16 pb-12 safe-area-top">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="w-10 h-10 rounded-[12px] glass-card flex items-center justify-center active:scale-95 transition-transform">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-bold">Профиль</h1>
        </div>

        <div className="flex items-center gap-2">
          <motion.button 
            whileTap={{ scale: 0.95 }} 
            onClick={() => setShowGuide(true)} 
            className="px-4 py-2 rounded-xl glass-card text-primary text-xs font-bold flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Гайд
          </motion.button>
        </div>
      </motion.div>

      {/* Avatar Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-[32px] p-6 mb-6 bg-gradient-to-br from-[#4DA3FF]/10 to-[#22C55E]/5 border border-white/10"
      >
        <div className="flex items-center gap-5">
          <div className="relative">
            {state.profile.avatarUrl ? (
              <img src={state.profile.avatarUrl} alt="Avatar" className="w-20 h-20 rounded-[24px] object-cover border-2 border-primary/30" />
            ) : (
              <div className="w-20 h-20 rounded-[24px] bg-gradient-to-br from-primary to-[#22C55E] flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-primary/30">
                {state.profile.name?.[0] || 'U'}
              </div>
            )}
            <label className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary flex items-center justify-center cursor-pointer border-2 border-[#0B0B0F]">
              <Camera className="w-4 h-4 text-white" />
              <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            </label>
          </div>

          <div className="flex-1">
            {isEditing ? (
              <input
                autoFocus
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onBlur={handleNameBlur}
                onKeyDown={(e) => e.key === 'Enter' && handleNameBlur()}
                className="w-full bg-white/5 border border-primary/30 rounded-xl px-3 py-2 text-lg font-bold outline-none"
              />
            ) : (
              <div className="flex items-center gap-2" onClick={() => setIsEditing(true)}>
                <h2 className="text-2xl font-bold">{state.profile.name || 'Ваше имя'}</h2>
                <Edit2 className="w-4 h-4 text-white/20" />
              </div>
            )}
            <p className="text-white/40 text-xs mt-1">Данные сохраняются автоматически</p>
          </div>
        </div>
      </motion.div>

      {/* Navigation Shortcuts */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <motion.button 
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/leaderboard')}
          className="glass-card rounded-[24px] p-4 flex items-center gap-3 border-primary/20"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-primary" />
          </div>
          <div className="text-left">
            <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Рейтинг</p>
            <p className="text-sm font-bold">Топ 100</p>
          </div>
        </motion.button>

        <motion.button 
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/statistics')}
          className="glass-card rounded-[24px] p-4 flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-left">
            <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Прогресс</p>
            <p className="text-sm font-bold">Аналитика</p>
          </div>
        </motion.button>
      </div>

      {/* Profile Fields */}
      <div className="space-y-4 mb-8">
        <p className="text-white/40 text-[11px] font-bold uppercase tracking-[0.2em] px-1 mb-4">Личные параметры</p>
        
        {profileFields.map((item: ProfileField, index: number) => {
          const fieldKey = item.key;
          if (item.type === 'select') {
            return (
              <motion.div
                key={fieldKey}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <CustomSelect
                  label={item.label}
                  value={fieldKey === 'gender' ? (state.profile.gender === 'male' ? 'Мужской' : 'Женский') : (state.profile[fieldKey as keyof typeof state.profile] as string)}
                  options={item.options || []}
                  onChange={(val) => {
                    if (fieldKey === 'gender') {
                      handleFieldChange('gender', val === 'Мужской' ? 'male' : 'female');
                    } else {
                      handleFieldChange(fieldKey, val);
                    }
                  }}
                />
              </motion.div>
            );
          }

          return (
            <motion.div
              key={fieldKey}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="glass-card rounded-[24px] p-5 flex items-center gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider">{item.label}</p>
                  {item.suffix && <span className="text-[10px] text-white/20 font-bold">{item.suffix}</span>}
                </div>
                <input 
                  type="text" 
                  inputMode="decimal"
                  pattern="[0-9]*"
                  value={state.profile[fieldKey] === 0 ? '' : state.profile[fieldKey] as string | number} 
                  placeholder="0"
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9.]/g, '');
                    if (item.type === 'number') {
                      handleFieldChange(fieldKey, val === '' ? 0 : Number(val));
                    } else {
                      handleFieldChange(fieldKey, val);
                    }
                  }} 
                  className="w-full bg-transparent text-lg font-bold outline-none border-b border-white/5 focus:border-primary/50"
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Account Settings */}
      <div className="space-y-3 mb-8">
        <p className="text-white/40 text-[11px] font-bold uppercase tracking-[0.2em] px-1 mb-4">Настройки аккаунта</p>
        
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-[24px] p-5"
        >
          {user ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-1">Авторизован как</p>
                <p className="text-sm font-bold text-white/90">{user.email || 'Пользователь Google'}</p>
              </div>
              <button 
                onClick={logout}
                className="px-4 py-2 bg-red-500/20 text-red-500 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-red-500/30 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Выйти
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-1">Режим</p>
                <p className="text-sm font-bold text-white/90">Локальный (без синхронизации)</p>
              </div>
              <button 
                onClick={signInWithGoogle}
                className="px-4 py-2 bg-primary/20 text-primary rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-primary/30 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Войти
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showGuide && <GuideModal onClose={() => setShowGuide(false)} />}
      </AnimatePresence>

      <motion.button
        onClick={resetAllData}
        className="w-full py-5 rounded-[24px] border border-red-500/20 flex items-center justify-center gap-3 active:scale-95 transition-all mb-12"
      >
        <RotateCcw className="w-5 h-5 text-red-500" />
        <span className="text-red-500 font-bold">Сбросить все данные</span>
      </motion.button>
    </div>
  );
}

function GuideModal({ onClose }: { onClose: () => void }) {
  const features = [
    { title: 'AI Ассистент', desc: 'Задавайте любые вопросы по здоровью и продуктивности. AI видит ваши данные и дает советы.', icon: Sparkles, color: '#4DA3FF' },
    { title: 'Контроль питания', desc: 'Сканируйте штрих-коды и следите за БЖУ. Система рассчитает норму под ваши цели.', icon: Apple, color: '#22C55E' },
    { title: 'Тренировки', desc: 'Добавляйте упражнения, ведите таймер и делайте фото прогресса для визуального контроля.', icon: Dumbbell, color: '#F59E0B' },
    { title: 'Финансы', desc: 'Управляйте доходами и расходами, чтобы видеть полную картину вашей жизни.', icon: DollarSign, color: '#10B981' },
    { title: 'Рейтинг', desc: 'Участвуйте в мировом топе пользователей, повышая свой Life Score.', icon: Trophy, color: '#8B5CF6' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-end justify-center bg-black/80 backdrop-blur-md" onClick={onClose}>
      <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} onClick={(e) => e.stopPropagation()} className="glass-card rounded-t-[40px] w-full max-w-md p-8 pb-12 max-h-[90vh] overflow-y-auto">
        <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-8" />
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Гайд по LifeOS</h2>
            <p className="text-white/40 text-sm">Как выжать максимум из приложения</p>
          </div>
        </div>

        <div className="space-y-6">
          {features.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex gap-5">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${f.color}15` }}>
                <f.icon className="w-6 h-6" style={{ color: f.color }} />
              </div>
              <div>
                <h4 className="font-bold text-white/90 mb-1">{f.title}</h4>
                <p className="text-xs text-white/50 leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <button onClick={onClose} className="w-full py-4 bg-primary rounded-[20px] text-white font-bold mt-10 shadow-lg shadow-primary/20">
          Понятно, поехали!
        </button>
      </motion.div>
    </motion.div>
  );
}
