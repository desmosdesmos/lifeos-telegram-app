import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, TrendingUp, TrendingDown, PiggyBank, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { useApp } from '../context/AppContext';

const categories = ['Еда', 'Транспорт', 'Спорт', 'Развлечения', 'Здоровье', 'Образование', 'Другое'];

export function Finances() {
  const navigate = useNavigate();
  const { state, addTransaction, removeTransaction } = useApp();
  const [showAdd, setShowAdd] = useState(false);

  const income = state.transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expenses = state.transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const savings = income - expenses;
  const savingsRate = income > 0 ? Math.round((savings / income) * 100) : 0;
  const financeScore = income > 0 ? Math.min(100, Math.round(savingsRate * 1.5)) : 0;

  const expensesByCategory = categories.map(cat => {
    const amount = state.transactions.filter(t => t.type === 'expense' && t.category === cat).reduce((sum, t) => sum + t.amount, 0);
    return { name: cat, amount, limit: 10000, color: getCategoryColor(cat) };
  }).filter(c => c.amount > 0);

  return (
    <div className="w-full min-h-screen bg-[#0B0B0F] px-6 pt-12 pb-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="w-10 h-10 rounded-[12px] glass-card flex items-center justify-center active:scale-95 transition-transform">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl">Финансы</h1>
        </div>
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowAdd(true)} className="w-11 h-11 rounded-[14px] bg-[#4DA3FF] flex items-center justify-center text-white">
          <Plus className="w-5 h-5" />
        </motion.button>
      </motion.div>

      {/* Finance Score */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="glass-card rounded-[24px] p-6 mb-6">
        <p className="text-white/60 text-sm mb-2">Финансовое здоровье</p>
        <div className="flex items-end gap-2">
          <span className="text-5xl tracking-tight">{financeScore}</span>
          <span className="text-2xl text-white/40 mb-1">/ 100</span>
        </div>
      </motion.div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-[20px] p-4 text-center">
          <TrendingUp className="w-6 h-6 text-[#22C55E] mx-auto mb-2" />
          <p className="text-white/50 text-xs mb-1">Доходы</p>
          <p className="text-lg font-bold">{income.toLocaleString()} ₽</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card rounded-[20px] p-4 text-center">
          <TrendingDown className="w-6 h-6 text-[#EF4444] mx-auto mb-2" />
          <p className="text-white/50 text-xs mb-1">Расходы</p>
          <p className="text-lg font-bold">{expenses.toLocaleString()} ₽</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-[20px] p-4 text-center">
          <PiggyBank className="w-6 h-6 text-[#4DA3FF] mx-auto mb-2" />
          <p className="text-white/50 text-xs mb-1">Накопления</p>
          <p className="text-lg font-bold">{savings.toLocaleString()} ₽</p>
        </motion.div>
      </div>

      {/* Savings Progress */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card rounded-[24px] p-6 mb-6 bg-gradient-to-br from-[#22C55E]/10 to-[#4DA3FF]/5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white/60 text-sm">Откладываем</p>
            <p className="text-2xl font-bold">{savingsRate}%</p>
          </div>
          <div className="text-right">
            <p className="text-white/60 text-xs">Цель: 50%</p>
            <p className={`text-sm ${savingsRate >= 50 ? 'text-[#22C55E]' : 'text-white/60'}`}>{savingsRate >= 50 ? '✓ Достигнуто' : 'В процессе'}</p>
          </div>
        </div>
        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, savingsRate * 2)}%` }} transition={{ duration: 1 }} className="h-full bg-gradient-to-r from-[#22C55E] to-[#4DA3FF]" />
        </div>
      </motion.div>

      {/* Categories */}
      {expensesByCategory.length > 0 && (
        <div className="space-y-3 mb-6">
          <p className="text-white/60 text-sm px-1">Категории расходов</p>
          {expensesByCategory.map((cat, index) => (
            <motion.div key={cat.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + index * 0.05 }} className="glass-card rounded-[20px] p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white/90">{cat.name}</span>
                <span className="text-white/60 text-sm">{cat.amount.toLocaleString()} ₽</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, (cat.amount / cat.limit) * 100)}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full" style={{ backgroundColor: cat.color }} />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Transactions */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between px-1">
          <p className="text-white/60 text-sm">Операции</p>
          <button onClick={() => setShowAdd(true)} className="text-[#4DA3FF] text-sm flex items-center gap-1">
            <Plus className="w-4 h-4" /> Добавить
          </button>
        </div>

        {state.transactions.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card rounded-[20px] p-8 text-center">
            <div className="w-16 h-16 rounded-[20px] bg-[#22C55E]/20 flex items-center justify-center mx-auto mb-4">
              <PiggyBank className="w-8 h-8 text-[#22C55E]" />
            </div>
            <p className="text-white/70 mb-2">Нет записей о финансах</p>
            <button onClick={() => setShowAdd(true)} className="px-6 py-3 bg-[#22C55E] rounded-[16px] text-white font-medium">
              Добавить операцию
            </button>
          </motion.div>
        ) : (
          state.transactions.slice(0, 10).map((t, index) => (
            <motion.div key={t.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + index * 0.05 }} className="glass-card rounded-[20px] p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center ${t.type === 'income' ? 'bg-[#22C55E]/20' : 'bg-[#EF4444]/20'}`}>
                  {t.type === 'income' ? <TrendingUp className="w-5 h-5 text-[#22C55E]" /> : <TrendingDown className="w-5 h-5 text-[#EF4444]" />}
                </div>
                <div>
                  <p className="text-white/90 font-medium">{t.name}</p>
                  <p className="text-white/40 text-xs">{t.category} • {t.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p className={`text-lg font-bold ${t.type === 'income' ? 'text-[#22C55E]' : 'text-white'}`}>
                  {t.type === 'income' ? '+' : '-'}{t.amount.toLocaleString()} ₽
                </p>
                <button onClick={() => removeTransaction(t.id)} className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center hover:bg-red-500/30 transition-colors">
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowAdd(false)}>
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} onClick={(e) => e.stopPropagation()} className="glass-card rounded-t-[32px] w-full max-w-md p-6 pb-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl">Добавить операцию</h2>
                <button onClick={() => setShowAdd(false)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">✕</button>
              </div>
              <AddTransactionForm onAdd={(t) => { addTransaction(t); setShowAdd(false); }} onCancel={() => setShowAdd(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function getCategoryColor(cat: string): string {
  const colors: Record<string, string> = { Еда: '#EF4444', Транспорт: '#4DA3FF', Спорт: '#22C55E', Развлечения: '#F59E0B', Здоровье: '#EF4444', Образование: '#4DA3FF' };
  return colors[cat] || '#888888';
}

function AddTransactionForm({ onAdd, onCancel }: { onAdd: (t: any) => void; onCancel: () => void }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('Еда');

  const handleSubmit = () => {
    if (!name || !amount) return;
    onAdd({ name, amount: Number(amount), type, category, date: new Date().toISOString().split('T')[0] });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3 mb-4">
        <button onClick={() => setType('expense')} className={`flex-1 py-3 rounded-[16px] font-medium ${type === 'expense' ? 'bg-[#EF4444] text-white' : 'glass-card'}`}>Расход</button>
        <button onClick={() => setType('income')} className={`flex-1 py-3 rounded-[16px] font-medium ${type === 'income' ? 'bg-[#22C55E] text-white' : 'glass-card'}`}>Доход</button>
      </div>
      <div>
        <label className="text-white/60 text-sm mb-2 block">Название</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Например: Супермаркет" className="w-full glass-card rounded-[16px] px-4 py-3 bg-white/5 outline-none focus:ring-2 focus:ring-[#4DA3FF]" />
      </div>
      <div>
        <label className="text-white/60 text-sm mb-2 block">Сумма (₽)</label>
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" className="w-full glass-card rounded-[16px] px-4 py-3 bg-white/5 outline-none focus:ring-2 focus:ring-[#4DA3FF]" />
      </div>
      <div>
        <label className="text-white/60 text-sm mb-2 block">Категория</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full glass-card rounded-[16px] px-4 py-3 bg-white/5 outline-none focus:ring-2 focus:ring-[#4DA3FF]">
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="flex gap-3 pt-4">
        <button onClick={onCancel} className="flex-1 py-4 glass-card rounded-[20px] text-white font-medium">Отмена</button>
        <button onClick={handleSubmit} className={`flex-1 py-4 rounded-[20px] text-white font-medium ${type === 'income' ? 'bg-[#22C55E]' : 'bg-[#EF4444]'}`}>Добавить</button>
      </div>
    </div>
  );
}
