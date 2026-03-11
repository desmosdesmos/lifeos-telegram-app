import { motion } from 'motion/react';
import { ChevronLeft, User, Ruler, Weight, Target, Zap, Edit2, Save, X, RotateCcw, Camera } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useBottomBar } from '../context/BottomBarContext';
import { useTelegramWebApp } from '../hooks/useTelegramWebApp';

const goals = ['Набор мышечной массы', 'Похудение', 'Поддержание веса', 'Улучшение здоровья', 'Повышение продуктивности', 'Выносливость', 'Сушка'];
const lifestyles = ['Сидячий', 'Умеренно активный', 'Активный', 'Очень активный'];
const genders = ['Мужской', 'Женский'];

export function Profile() {
  const navigate = useNavigate();
  const { state, updateProfile, resetAllData } = useApp();
  const { hide, show } = useBottomBar();
  const { userAvatar: telegramAvatar } = useTelegramWebApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    ...state.profile,
    gender: state.profile.gender || 'male',
  });

  // Инициализируем аватарку из Telegram или из профиля
  const [avatarUrl, setAvatarUrl] = useState<string | null>(() => {
    return state.profile.avatarUrl || telegramAvatar || null;
  });

  // Сохраняем аватарку из Telegram при первой загрузке
  useEffect(() => {
    if (telegramAvatar && !state.profile.avatarUrl) {
      setAvatarUrl(telegramAvatar);
      updateProfile({ avatarUrl: telegramAvatar });
    }
  }, [telegramAvatar]);

  // Скрываем нижний бар при редактировании
  useEffect(() => {
    if (isEditing) {
      hide();
    } else {
      show();
    }
    return () => show();
  }, [isEditing]);

  const handleSave = () => {
    updateProfile({ ...editedData, avatarUrl: avatarUrl || undefined });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedData(state.profile);
    setAvatarUrl(state.profile.avatarUrl || telegramAvatar || null);
    setIsEditing(false);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setAvatarUrl(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitials = () => {
    if (editedData.name) {
      return editedData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return 'U';
  };

  const profileFields = [
    { label: 'Пол', value: editedData.gender === 'male' ? 'Мужской' : 'Женский', key: 'gender', icon: User, color: '#4DA3FF', type: 'select' as const, options: genders },
    { label: 'Возраст', value: editedData.age, key: 'age', icon: Zap, color: '#F59E0B', type: 'number' as const, suffix: ' лет' },
    { label: 'Вес', value: editedData.weight, key: 'weight', icon: Weight, color: '#4DA3FF', type: 'number' as const, suffix: ' кг' },
    { label: 'Рост', value: editedData.height, key: 'height', icon: Ruler, color: '#22C55E', type: 'number' as const, suffix: ' см' },
    { label: 'Цель', value: editedData.goal, key: 'goal', icon: Target, color: '#F59E0B', type: 'select' as const, options: goals },
    { label: 'Образ жизни', value: editedData.lifestyle, key: 'lifestyle', icon: Zap, color: '#4DA3FF', type: 'select' as const, options: lifestyles },
  ];

  const baseCalories = editedData.weight > 0 && editedData.height > 0 && editedData.age > 0
    ? Math.round(10 * editedData.weight + 6.25 * editedData.height - 5 * editedData.age + (editedData.gender === 'male' ? 5 : -161))
    : 0;
  const bmi = editedData.height > 0 ? Math.round((editedData.weight / ((editedData.height / 100) ** 2)) * 10) / 10 : 0;

  const getBmiStatus = (bmi: number) => {
    if (bmi < 18.5) return { text: 'Недостаток', color: '#F59E0B' };
    if (bmi < 25) return { text: 'Норма', color: '#22C55E' };
    if (bmi < 30) return { text: 'Избыток', color: '#F59E0B' };
    return { text: 'Ожирение', color: '#EF4444' };
  };

  const bmiStatus = getBmiStatus(bmi);

  return (
    <div className="w-full min-h-screen bg-[#0B0B0F] px-6 pt-12 pb-6 overflow-y-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="w-10 h-10 rounded-[12px] glass-card flex items-center justify-center active:scale-95 transition-transform">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl">Профиль</h1>
        </div>

        <div className="flex items-center gap-2">
          {!isEditing ? (
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => setIsEditing(true)} className="w-11 h-11 rounded-[14px] glass-card text-[#4DA3FF] flex items-center justify-center">
              <Edit2 className="w-5 h-5" />
            </motion.button>
          ) : (
            <>
              <motion.button whileTap={{ scale: 0.95 }} onClick={handleCancel} className="w-11 h-11 rounded-[14px] glass-card text-white/70 flex items-center justify-center">
                <X className="w-5 h-5" />
              </motion.button>
              <motion.button whileTap={{ scale: 0.95 }} onClick={handleSave} className="w-11 h-11 rounded-[14px] bg-[#22C55E] text-white flex items-center justify-center">
                <Save className="w-5 h-5" />
              </motion.button>
            </>
          )}
        </div>
      </motion.div>

      {/* Avatar Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-[24px] p-6 mb-6 bg-gradient-to-br from-[#4DA3FF]/10 to-[#22C55E]/5 border border-white/10"
      >
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-20 h-20 rounded-[20px] object-cover border-2 border-[#4DA3FF]/30" />
            ) : (
              <div className="w-20 h-20 rounded-[20px] bg-gradient-to-br from-[#4DA3FF] to-[#22C55E] flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-[#4DA3FF]/30">
                {getInitials()}
              </div>
            )}
            {isEditing && (
              <label className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#4DA3FF] flex items-center justify-center cursor-pointer border-2 border-[#0B0B0F]">
                <Camera className="w-4 h-4 text-white" />
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </label>
            )}
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-1">{editedData.name || 'Заполните имя'}</h2>
            <p className="text-white/50 text-sm">LifeOS с {new Date().toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}</p>
            {isEditing && (
              <input
                type="text"
                value={editedData.name || ''}
                onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                placeholder="Ваше имя"
                className="mt-2 w-full glass-card rounded-[12px] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#4DA3FF]"
              />
            )}
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-3 gap-3 mb-6"
      >
        <div className="glass-card rounded-[16px] p-3 text-center">
          <p className="text-white/40 text-xs mb-1">Возраст</p>
          <p className="text-xl font-bold">{editedData.age || '-'}</p>
        </div>
        <div className="glass-card rounded-[16px] p-3 text-center border-l border-white/10">
          <p className="text-white/40 text-xs mb-1">Вес</p>
          <p className="text-xl font-bold">{editedData.weight || '-'}<span className="text-xs text-white/40 ml-0.5">кг</span></p>
        </div>
        <div className="glass-card rounded-[16px] p-3 text-center border-l border-white/10">
          <p className="text-white/40 text-xs mb-1">Рост</p>
          <p className="text-xl font-bold">{editedData.height || '-'}<span className="text-xs text-white/40 ml-0.5">см</span></p>
        </div>
      </motion.div>

      {/* Profile Fields */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between px-1">
          <p className="text-white/60 text-sm">Основная информация</p>
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="text-[#4DA3FF] text-xs flex items-center gap-1">
              <Edit2 className="w-3 h-3" /> Изменить
            </button>
          )}
        </div>

        {profileFields.map((item, index) => {
          const Icon = item.icon;
          const isSelect = item.type === 'select';
          const isNumber = item.type === 'number';
          return (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              className="glass-card rounded-[20px] p-5 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-[14px] flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${item.color}20` }}>
                <Icon className="w-6 h-6" style={{ color: item.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white/60 text-xs mb-1">{item.label}</p>
                {isEditing && isSelect ? (
                  <select value={editedData[item.key as keyof typeof editedData]} onChange={(e) => setEditedData({ ...editedData, [item.key]: e.target.value })} className="w-full bg-white/5 rounded-[12px] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#4DA3FF]">
                    {item.options?.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : isEditing && isNumber ? (
                  <input type={item.type} value={editedData[item.key as keyof typeof editedData] || ''} onChange={(e) => setEditedData({ ...editedData, [item.key]: item.type === 'number' ? Number(e.target.value) : e.target.value })} className="w-full bg-white/5 rounded-[12px] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#4DA3FF]" />
                ) : isEditing ? (
                  <input type="text" value={editedData[item.key as keyof typeof editedData]} onChange={(e) => setEditedData({ ...editedData, [item.key]: e.target.value })} className="w-full bg-white/5 rounded-[12px] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#4DA3FF]" />
                ) : (
                  <p className="text-lg truncate">{item.value || '-'}{item.suffix}</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Stats Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card rounded-[24px] p-6 mb-6 bg-gradient-to-br from-[#4DA3FF]/5 to-[#22C55E]/5">
        <h3 className="text-lg font-bold mb-4">Расчётные показатели</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 rounded-[16px] bg-white/5">
            <p className="text-white/50 text-xs mb-2">ИМТ</p>
            <p className="text-3xl font-bold">{bmi || '-'}</p>
            <p className="text-xs mt-2" style={{ color: bmiStatus.color }}>{bmiStatus.text}</p>
          </div>
          <div className="text-center p-4 rounded-[16px] bg-white/5">
            <p className="text-white/50 text-xs mb-2">Калории</p>
            <p className="text-3xl font-bold">{baseCalories || '-'}</p>
            <p className="text-white/40 text-xs mt-2">ккал/день</p>
          </div>
        </div>
        <p className="text-white/40 text-xs mt-4 text-center">Расчёт основан на ваших параметрах и цели</p>
      </motion.div>

      {/* Reset Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        onClick={resetAllData}
        className="w-full glass-card rounded-[20px] p-5 flex items-center justify-center gap-3 active:scale-98 transition-transform border border-red-500/20"
      >
        <RotateCcw className="w-5 h-5 text-[#EF4444]" />
        <span className="text-[#EF4444] font-medium">Сбросить все данные</span>
      </motion.button>

      <p className="text-center text-white/30 text-xs mt-6 mb-4">LifeOS v1.0.0</p>
    </div>
  );
}
