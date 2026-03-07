import { motion } from 'motion/react';
import { ChevronLeft, User, Ruler, Weight, Target, Zap, Edit2, Save, X } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';

interface ProfileData {
  name: string;
  age: string;
  weight: string;
  height: string;
  goal: string;
  lifestyle: string;
}

const initialData: ProfileData = {
  name: 'Алексей Иванов',
  age: '28',
  weight: '75',
  height: '180',
  goal: 'Набор мышечной массы',
  lifestyle: 'Активный',
};

const goals = [
  'Набор мышечной массы',
  'Похудение',
  'Поддержание веса',
  'Улучшение здоровья',
  'Повышение продуктивности',
  'Выносливость',
];

const lifestyles = [
  'Сидячий',
  'Умеренно активный',
  'Активный',
  'Очень активный',
];

export function Profile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState<ProfileData>(initialData);
  const [editedData, setEditedData] = useState<ProfileData>(initialData);

  const handleSave = () => {
    setData(editedData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedData(data);
    setIsEditing(false);
  };

  const profileFields = [
    { label: 'Имя', value: isEditing ? editedData.name : data.name, key: 'name', icon: User, color: '#4DA3FF', type: 'text' as const },
    { label: 'Возраст', value: isEditing ? editedData.age : data.age, key: 'age', icon: Zap, color: '#F59E0B', type: 'number' as const, suffix: ' лет' },
    { label: 'Вес', value: isEditing ? editedData.weight : data.weight, key: 'weight', icon: Weight, color: '#4DA3FF', type: 'number' as const, suffix: ' кг' },
    { label: 'Рост', value: isEditing ? editedData.height : data.height, key: 'height', icon: Ruler, color: '#22C55E', type: 'number' as const, suffix: ' см' },
    { label: 'Цель', value: isEditing ? editedData.goal : data.goal, key: 'goal', icon: Target, color: '#F59E0B', type: 'select' as const, options: goals },
    { label: 'Образ жизни', value: isEditing ? editedData.lifestyle : data.lifestyle, key: 'lifestyle', icon: Zap, color: '#4DA3FF', type: 'select' as const, options: lifestyles },
  ];

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
          <h1 className="text-3xl">Профиль</h1>
        </div>
        
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className={`w-11 h-11 rounded-[14px] flex items-center justify-center transition-colors ${
            isEditing 
              ? 'bg-[#22C55E] text-white' 
              : 'glass-card text-[#4DA3FF]'
          }`}
        >
          {isEditing ? <Save className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
        </motion.button>
      </motion.div>

      {/* User Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-[24px] p-6 mb-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#4DA3FF]/10 rounded-full blur-[60px]" />

        <div className="relative z-10 flex items-center gap-4">
          <div className="w-16 h-16 rounded-[20px] bg-gradient-to-br from-[#4DA3FF] to-[#22C55E] flex items-center justify-center">
            <User className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl mb-1">{data.name}</h2>
            <p className="text-white/60 text-sm">В LifeOS с марта 2026</p>
          </div>
        </div>
      </motion.div>

      {/* Cancel/Save Buttons when editing */}
      {isEditing && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-3 mb-6"
        >
          <button
            onClick={handleCancel}
            className="flex-1 py-3 glass-card rounded-[16px] flex items-center justify-center gap-2 text-white/70"
          >
            <X className="w-4 h-4" />
            Отмена
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 bg-[#4DA3FF] rounded-[16px] flex items-center justify-center gap-2 text-white font-medium"
          >
            <Save className="w-4 h-4" />
            Сохранить
          </button>
        </motion.div>
      )}

      {/* Profile Info */}
      <div className="space-y-3 mb-6">
        <p className="text-white/60 text-sm px-1">Личная информация</p>

        {profileFields.map((item, index) => {
          const Icon = item.icon;
          const isSelect = item.type === 'select';
          const isNumber = item.type === 'number';

          return (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              className="glass-card rounded-[20px] p-5 flex items-center gap-4"
            >
              <div
                className="w-12 h-12 rounded-[14px] flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${item.color}20` }}
              >
                <Icon className="w-6 h-6" style={{ color: item.color }} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-white/60 text-xs mb-1">{item.label}</p>
                {isEditing && isSelect ? (
                  <select
                    value={editedData[item.key as keyof ProfileData]}
                    onChange={(e) => setEditedData({ ...editedData, [item.key]: e.target.value })}
                    className="w-full bg-white/5 rounded-[12px] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#4DA3FF]"
                  >
                    {item.options?.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : isEditing && isNumber ? (
                  <input
                    type="number"
                    value={editedData[item.key as keyof ProfileData]}
                    onChange={(e) => setEditedData({ ...editedData, [item.key]: e.target.value })}
                    className="w-full bg-white/5 rounded-[12px] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#4DA3FF]"
                  />
                ) : isEditing ? (
                  <input
                    type="text"
                    value={editedData[item.key as keyof ProfileData]}
                    onChange={(e) => setEditedData({ ...editedData, [item.key]: e.target.value })}
                    className="w-full bg-white/5 rounded-[12px] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#4DA3FF]"
                  />
                ) : (
                  <p className="text-lg truncate">{item.value}{item.suffix}</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Stats Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card rounded-[24px] p-6 mb-6"
      >
        <h3 className="text-lg mb-4">Расчётные показатели</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 rounded-[16px] bg-white/5">
            <p className="text-white/50 text-xs mb-1">ИМТ</p>
            <p className="text-2xl font-bold">23.1</p>
            <p className="text-[#22C55E] text-xs mt-1">Норма</p>
          </div>
          <div className="text-center p-4 rounded-[16px] bg-white/5">
            <p className="text-white/50 text-xs mb-1">Калории в день</p>
            <p className="text-2xl font-bold">2,450</p>
            <p className="text-white/40 text-xs mt-1">ккал</p>
          </div>
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="w-full glass-card rounded-[20px] p-5 text-center active:scale-95 transition-transform border-red-500/20"
      >
        <span className="text-[#EF4444] text-sm">Сбросить все данные</span>
      </motion.button>

      {/* Version */}
      <p className="text-center text-white/30 text-xs mt-6">LifeOS v1.0.0</p>
    </div>
  );
}
