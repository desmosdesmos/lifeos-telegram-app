import { motion } from 'motion/react';
import { ChevronLeft, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';
import { useNavigate } from 'react-router';

const transactions = [
  { id: 1, name: 'Зарплата', amount: 150000, type: 'income', category: 'Доход', date: '1 мар' },
  { id: 2, name: 'Супермаркет', amount: 8500, type: 'expense', category: 'Еда', date: '3 мар' },
  { id: 3, name: 'Тренажёрный зал', amount: 3500, type: 'expense', category: 'Спорт', date: '5 мар' },
  { id: 4, name: 'Кафе', amount: 2300, type: 'expense', category: 'Еда', date: '6 мар' },
];

const categories = [
  { name: 'Еда', amount: 10800, limit: 15000, color: '#EF4444' },
  { name: 'Транспорт', amount: 3200, limit: 5000, color: '#4DA3FF' },
  { name: 'Спорт', amount: 3500, limit: 5000, color: '#22C55E' },
  { name: 'Развлечения', amount: 1500, limit: 5000, color: '#F59E0B' },
];

export function Finances() {
  const navigate = useNavigate();
  const totalIncome = 150000;
  const totalExpenses = 23450;
  const savings = totalIncome - totalExpenses;
  const savingsRate = Math.round((savings / totalIncome) * 100);

  return (
    <div className="w-full min-h-screen bg-[#0B0B0F] px-6 pt-12 pb-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center gap-3"
      >
        <button
          onClick={() => navigate('/')}
          className="w-10 h-10 rounded-[12px] glass-card flex items-center justify-center active:scale-95 transition-transform"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-3xl">Финансы</h1>
      </motion.div>

      {/* Finance Score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-[24px] p-6 mb-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#22C55E]/10 rounded-full blur-[60px]" />

        <div className="relative z-10">
          <p className="text-white/60 text-sm mb-2">Финансовое здоровье</p>
          <div className="flex items-end gap-2">
            <span className="text-5xl tracking-tight">60</span>
            <span className="text-2xl text-white/40 mb-1">/ 100</span>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <TrendingUp className="w-4 h-4 text-[#22C55E]" />
            <span className="text-[#22C55E] text-sm">+2% к прошлому месяцу</span>
          </div>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-[20px] p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-[10px] bg-[#22C55E]/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-[#22C55E]" />
            </div>
            <span className="text-white/60 text-xs">Доходы</span>
          </div>
          <p className="text-2xl font-bold">150 000 ₽</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-[20px] p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-[10px] bg-[#EF4444]/20 flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-[#EF4444]" />
            </div>
            <span className="text-white/60 text-xs">Расходы</span>
          </div>
          <p className="text-2xl font-bold">23 450 ₽</p>
        </motion.div>
      </div>

      {/* Savings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-[24px] p-6 mb-6 bg-gradient-to-br from-[#22C55E]/10 to-[#4DA3FF]/5"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-[16px] bg-[#22C55E]/20 flex items-center justify-center">
              <PiggyBank className="w-6 h-6 text-[#22C55E]" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Накопления</p>
              <p className="text-2xl font-bold">{savings.toLocaleString()} ₽</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white/60 text-xs">Откладываем</p>
            <p className="text-xl font-bold text-[#22C55E]">{savingsRate}%</p>
          </div>
        </div>
        
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${savingsRate}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-full bg-gradient-to-r from-[#22C55E] to-[#4DA3FF] rounded-full"
          />
        </div>
        <p className="text-white/40 text-xs mt-2">Цель: 50% от дохода</p>
      </motion.div>

      {/* Categories */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between px-1">
          <p className="text-white/60 text-sm">Категории расходов</p>
          <button className="text-[#4DA3FF] text-sm">Все</button>
        </div>

        {categories.map((category, index) => {
          const percentage = Math.round((category.amount / category.limit) * 100);

          return (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              className="glass-card rounded-[20px] p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-white/90">{category.name}</span>
                <span className="text-white/60 text-sm">
                  {category.amount.toLocaleString()} / {category.limit.toLocaleString()} ₽
                </span>
              </div>

              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, delay: 0.4 + index * 0.05 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: category.color }}
                />
              </div>
              <p className="text-white/40 text-xs mt-2">{percentage}% от лимита</p>
            </motion.div>
          );
        })}
      </div>

      {/* Transactions */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between px-1">
          <p className="text-white/60 text-sm">Последние операции</p>
          <button className="text-[#4DA3FF] text-sm">Все</button>
        </div>

        {transactions.map((transaction, index) => (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.05 }}
            className="glass-card rounded-[20px] p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center ${
                transaction.type === 'income' 
                  ? 'bg-[#22C55E]/20' 
                  : 'bg-[#EF4444]/20'
              }`}>
                {transaction.type === 'income' 
                  ? <TrendingUp className="w-5 h-5 text-[#22C55E]" />
                  : <TrendingDown className="w-5 h-5 text-[#EF4444]" />
                }
              </div>
              <div>
                <p className="text-white/90 font-medium">{transaction.name}</p>
                <p className="text-white/40 text-xs">{transaction.category} • {transaction.date}</p>
              </div>
            </div>
            <p className={`text-lg font-bold ${
              transaction.type === 'income' 
                ? 'text-[#22C55E]' 
                : 'text-white'
            }`}>
              {transaction.type === 'income' ? '+' : '-'}{transaction.amount.toLocaleString()} ₽
            </p>
          </motion.div>
        ))}
      </div>

      {/* AI Recommendation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="glass-card rounded-[24px] p-6 bg-gradient-to-br from-[#4DA3FF]/10 to-[#22C55E]/5"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-[12px] bg-[#4DA3FF]/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-[#4DA3FF]" />
          </div>
          <h3 className="text-lg">Совет AI</h3>
        </div>
        <p className="text-white/70 text-sm leading-relaxed">
          Вы откладываете 84% дохода — это отличный показатель! 
          Рекомендую рассмотреть инвестиционные инструменты для приумножения savings. 
          Также обратите внимание: расходы на еду (10 800 ₽) составляют 72% от лимита — 
          вы в хорошей форме.
        </p>
      </motion.div>
    </div>
  );
}

function Sparkles({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}
