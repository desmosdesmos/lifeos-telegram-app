import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Target, Plus, Calendar, Trophy, Trash2, Edit2, Brain, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AIConsultantChat } from '../components/AIConsultantChat';

const categoryColors: Record<string, string> = {
  health: '#EF4444',
  fitness: '#F59E0B',
  finance: '#22C55E',
  learning: '#4DA3FF',
};

const categoryLabels: Record<string, string> = {
  health: 'Здоровье',
  fitness: 'Фитнес',
  finance: 'Финансы',
  learning: 'Обучение',
};

export function Goals() {
  const navigate = useNavigate();
  const { state, addGoal, updateGoal, removeGoal } = useApp();
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const completedCount = state.goals.filter(g => g.completed).length;
  const totalCount = state.goals.length;

  const toggleGoalComplete = (id: number) => {
    const goal = state.goals.find(g => g.id === id);
    if (goal) {
      updateGoal(id, { completed: !goal.completed });
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0B0B0F] px-6 pt-12 pb-6 overflow-y-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="w-10 h-10 rounded-[12px] glass-card flex items-center justify-center active:scale-95 transition-transform">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl">Цели</h1>
        </div>
        <div className="flex items-center gap-2">
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowChat(true)} className="w-10 h-10 rounded-[12px] glass-card flex items-center justify-center text-[#4DA3FF]">
            <MessageCircle className="w-5 h-5" />
          </motion.button>
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowAddGoal(true)} className="w-10 h-10 rounded-[14px] bg-[#4DA3FF] flex items-center justify-center text-white">
            <Plus className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>

      {/* AI Coach */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-[20px] p-4 mb-6 bg-gradient-to-r from-[#4DA3FF]/10 to-[#22C55E]/5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-[12px] bg-[#4DA3FF]/20 flex items-center justify-center">
            <Brain className="w-5 h-5 text-[#4DA3FF]" />
          </div>
          <div>
            <h3 className="text-sm font-bold">AI Коуч</h3>
            <p className="text-xs text-white/50">Мотивация и стратегии</p>
          </div>
        </div>
        <AICoach goals={state.goals} />
      </motion.div>

      {/* Progress Summary */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="glass-card rounded-[24px] p-6 mb-6">
        <p className="text-white/60 text-sm mb-4">Общий прогресс</p>
        <div className="flex items-end gap-3 mb-4">
          <span className="text-5xl tracking-tight">{completedCount}</span>
          <span className="text-2xl text-white/40 mb-1">/ {totalCount}</span>
        </div>
        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden mb-2">
          <motion.div initial={{ width: 0 }} animate={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }} transition={{ duration: 1 }} className="h-full bg-gradient-to-r from-[#4DA3FF] to-[#22C55E]" />
        </div>
        <p className="text-white/40 text-xs">{totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}% целей выполнено</p>
      </motion.div>

      {/* Active Goals */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between px-1">
          <p className="text-white/60 text-sm">Активные цели</p>
          <span className="text-white/40 text-sm">{totalCount - completedCount}</span>
        </div>

        {state.goals.filter(g => !g.completed).length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-[24px] p-8 text-center">
            <div className="w-16 h-16 rounded-[20px] bg-[#4DA3FF]/20 flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-[#4DA3FF]" />
            </div>
            <h3 className="text-xl font-bold mb-2">Нет активных целей</h3>
            <p className="text-white/60 text-sm mb-4">Поставьте первую цель для начала</p>
            <button onClick={() => setShowAddGoal(true)} className="px-6 py-3 bg-[#4DA3FF] rounded-[16px] text-white font-medium">
              Добавить цель
            </button>
          </motion.div>
        ) : (
          state.goals.filter(g => !g.completed).map((goal, index) => (
            <motion.div key={goal.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + index * 0.05 }} className="glass-card rounded-[24px] p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-12 h-12 rounded-[16px] flex items-center justify-center" style={{ backgroundColor: `${categoryColors[goal.category]}20` }}>
                    <Target className="w-6 h-6" style={{ color: categoryColors[goal.category] }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium mb-1 truncate">{goal.title}</h3>
                    <p className="text-white/50 text-sm truncate">{goal.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setEditingId(goal.id)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                    <Edit2 className="w-4 h-4 text-white/60" />
                  </button>
                  <button onClick={() => removeGoal(goal.id)} className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center hover:bg-red-500/30 transition-colors">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-white/60">Прогресс</span>
                  <span className="text-white font-medium">{goal.progress} / {goal.target} {goal.unit}</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${goal.target > 0 ? Math.min(100, (goal.progress / goal.target) * 100) : 0}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full" style={{ backgroundColor: categoryColors[goal.category] }} />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-white/40">
                  <Calendar className="w-3 h-3" />
                  <span>Дедлайн: {goal.deadline}</span>
                </div>
                <button onClick={() => toggleGoalComplete(goal.id)} className="px-4 py-2 rounded-full bg-[#22C55E]/20 text-[#22C55E] text-sm font-medium hover:bg-[#22C55E]/30 transition-colors">
                  Выполнено
                </button>
              </div>

              {/* Edit Modal */}
              <AnimatePresence>
                {editingId === goal.id && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={() => setEditingId(null)}>
                    <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} onClick={(e) => e.stopPropagation()} className="glass-card rounded-t-[32px] w-full max-w-md p-6 pb-8 max-h-[85vh] overflow-y-auto">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl">Редактировать цель</h2>
                        <button onClick={() => setEditingId(null)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">✕</button>
                      </div>
                      <EditGoalForm goal={goal} onSave={(data) => { updateGoal(goal.id, data); setEditingId(null); }} onCancel={() => setEditingId(null)} />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        )}
      </div>

      {/* Completed Goals */}
      {completedCount > 0 && (
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between px-1">
            <p className="text-white/60 text-sm">Выполненные</p>
            <span className="text-[#22C55E] text-sm">{completedCount}</span>
          </div>
          {state.goals.filter(g => g.completed).map((goal, index) => (
            <motion.div key={goal.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + index * 0.05 }} className="glass-card rounded-[24px] p-5 opacity-60">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-[16px] bg-[#22C55E]/20 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-[#22C55E]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium line-through text-white/50">{goal.title}</h3>
                  <p className="text-[#22C55E] text-sm">✓ Выполнено</p>
                </div>
                <button onClick={() => removeGoal(goal.id)} className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center hover:bg-red-500/30 transition-colors">
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Goal Modal */}
      <AnimatePresence>
        {showAddGoal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowAddGoal(false)}>
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} onClick={(e) => e.stopPropagation()} className="glass-card rounded-t-[32px] w-full max-w-md p-6 pb-32 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl">Новая цель</h2>
                <button onClick={() => setShowAddGoal(false)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">✕</button>
              </div>
              <AddGoalForm onAdd={(g) => { addGoal(g); setShowAddGoal(false); }} onCancel={() => setShowAddGoal(false)} />
            </motion.div>
          </motion.div>
        )}
        {showChat && <AIConsultantChat type="goals" onClose={() => setShowChat(false)} userData={{ goals: state.goals }} />}
      </AnimatePresence>
    </div>
  );
}

function AICoach({ goals }: { goals: any[] }) {
  const completed = goals.filter(g => g.completed).length;
  const active = goals.filter(g => !g.completed);
  
  const getAdvice = () => {
    if (goals.length === 0) {
      return 'Поставьте первую цель! Начните с маленькой — это поможет сформировать привычку достижения.';
    }
    if (active.length > 5) {
      return '⚠️ Слишком много активных целей! Сфокусируйтесь на 3-5 самых важных.';
    }
    if (completed > 0 && active.length === 0) {
      return 'Поздравляю! Вы выполнили все цели. Время поставить новые!';
    }
    if (active.some(g => g.progress === 0)) {
      return 'Есть цели без прогресса. Начните с маленьких шагов — главное начать!';
    }
    return 'Продолжайте в том же духе! Регулярность важнее интенсивности.';
  };

  return (
    <div className="space-y-2">
      <p className="text-sm text-white/80">{getAdvice()}</p>
      {active.length > 0 && (
        <div className="mt-2">
          <p className="text-xs text-white/60 mb-1">💡 Совет для текущих целей:</p>
          <p className="text-xs text-white/70">Разбейте большую цель "{active[0]?.title}" на маленькие шаги и выполняйте по одному в день.</p>
        </div>
      )}
    </div>
  );
}

function AddGoalForm({ onAdd, onCancel }: { onAdd: (g: any) => void; onCancel: () => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [progress, setProgress] = useState('');
  const [target, setTarget] = useState('');
  const [unit, setUnit] = useState('');
  const [category, setCategory] = useState<'health' | 'fitness' | 'finance' | 'learning'>('fitness');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = () => {
    if (!title || !target) return;
    onAdd({ title, description, progress: Number(progress) || 0, target: Number(target), unit, category, deadline, completed: false });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-white/60 text-sm mb-2 block">Название цели</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Например: Пробежать марафон" className="w-full glass-card rounded-[16px] px-4 py-3 bg-white/5 outline-none focus:ring-2 focus:ring-[#4DA3FF]" />
      </div>
      <div>
        <label className="text-white/60 text-sm mb-2 block">Описание</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Опишите вашу цель..." rows={3} className="w-full glass-card rounded-[16px] px-4 py-3 bg-white/5 outline-none focus:ring-2 focus:ring-[#4DA3FF] resize-none" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-white/60 text-sm mb-2 block">Прогресс</label>
          <input type="number" value={progress} onChange={(e) => setProgress(e.target.value)} placeholder="0" className="w-full glass-card rounded-[16px] px-4 py-3 bg-white/5 outline-none focus:ring-2 focus:ring-[#4DA3FF]" />
        </div>
        <div>
          <label className="text-white/60 text-sm mb-2 block">Цель</label>
          <input type="number" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="100" className="w-full glass-card rounded-[16px] px-4 py-3 bg-white/5 outline-none focus:ring-2 focus:ring-[#4DA3FF]" />
        </div>
        <div>
          <label className="text-white/60 text-sm mb-2 block">Ед. изм.</label>
          <input type="text" value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="км" className="w-full glass-card rounded-[16px] px-4 py-3 bg-white/5 outline-none focus:ring-2 focus:ring-[#4DA3FF]" />
        </div>
      </div>
      <div>
        <label className="text-white/60 text-sm mb-2 block">Категория</label>
        <div className="grid grid-cols-4 gap-2">
          {(Object.keys(categoryLabels) as Array<keyof typeof categoryLabels>).map((key) => (
            <button key={key} onClick={() => setCategory(key as typeof category)} className={`p-3 rounded-[12px] flex flex-col items-center gap-1 transition-colors ${category === key ? 'bg-white/20' : 'bg-white/5 hover:bg-white/10'}`}>
              <Target className="w-5 h-5" style={{ color: categoryColors[key] }} />
              <span className="text-[10px]">{categoryLabels[key]}</span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-white/60 text-sm mb-2 block">Дедлайн</label>
        <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="w-full glass-card rounded-[16px] px-4 py-3 bg-white/5 outline-none focus:ring-2 focus:ring-[#4DA3FF]" />
      </div>
      <div className="flex gap-3 pt-4">
        <button onClick={onCancel} className="flex-1 py-4 glass-card rounded-[20px] text-white font-medium">Отмена</button>
        <button onClick={handleSubmit} className="flex-1 py-4 bg-[#4DA3FF] rounded-[20px] text-white font-medium">Создать</button>
      </div>
    </div>
  );
}

function EditGoalForm({ goal, onSave, onCancel }: { goal: any; onSave: (data: any) => void; onCancel: () => void }) {
  const [title, setTitle] = useState(goal.title);
  const [progress, setProgress] = useState(goal.progress);
  const [target, setTarget] = useState(goal.target);

  const handleSubmit = () => {
    onSave({ title, progress: Number(progress), target: Number(target) });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-white/60 text-sm mb-2 block">Название</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full glass-card rounded-[16px] px-4 py-3 bg-white/5 outline-none focus:ring-2 focus:ring-[#4DA3FF]" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-white/60 text-sm mb-2 block">Прогресс</label>
          <input type="number" value={progress} onChange={(e) => setProgress(e.target.value)} className="w-full glass-card rounded-[16px] px-4 py-3 bg-white/5 outline-none focus:ring-2 focus:ring-[#4DA3FF]" />
        </div>
        <div>
          <label className="text-white/60 text-sm mb-2 block">Цель</label>
          <input type="number" value={target} onChange={(e) => setTarget(e.target.value)} className="w-full glass-card rounded-[16px] px-4 py-3 bg-white/5 outline-none focus:ring-2 focus:ring-[#4DA3FF]" />
        </div>
      </div>
      <div className="flex gap-3 pt-4">
        <button onClick={onCancel} className="flex-1 py-4 glass-card rounded-[20px] text-white font-medium">Отмена</button>
        <button onClick={handleSubmit} className="flex-1 py-4 bg-[#4DA3FF] rounded-[20px] text-white font-medium">Сохранить</button>
      </div>
    </div>
  );
}
