import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, TrendingUp, TrendingDown, PiggyBank, Plus, Trash2, Brain, Wallet, MessageCircle, Calendar, Upload, FileText, MessageSquare, Camera } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { AIConsultantChat } from '../components/AIConsultantChat';
import { getAvailableMonths, filterByMonth, getMonthDisplay, getCurrentMonth } from '../utils/dateUtils';
import { 
  parseCSV, 
  parseSMS, 
  parseScreenshot, 
  bankFormats, 
  previewImport,
  type ImportedTransaction,
  type SMSMessage,
} from '../utils/transactionImporter';

const categories = ['Еда', 'Транспорт', 'Спорт', 'Развлечения', 'Здоровье', 'Образование', 'Другое'];

export function Finances() {
  const navigate = useNavigate();
  const { state, addTransaction, removeTransaction } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());

  // Get available months from transactions
  const availableMonths = getAvailableMonths(state.transactions);
  
  // Filter transactions by selected month
  const filteredTransactions = filterByMonth(state.transactions, selectedMonth);

  const income = filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expenses = filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const savings = income - expenses;
  const savingsRate = income > 0 ? Math.round((savings / income) * 100) : 0;
  const financeScore = income > 0 ? Math.min(100, Math.round(savingsRate * 1.5)) : 0;

  const expensesByCategory = categories.map(cat => {
    const amount = state.transactions.filter(t => t.type === 'expense' && t.category === cat).reduce((sum, t) => sum + t.amount, 0);
    return { name: cat, amount, limit: 10000, color: getCategoryColor(cat) };
  }).filter(c => c.amount > 0);

  return (
    <div className="w-full min-h-screen bg-[#0B0B0F] px-6 pt-12 pb-6 overflow-y-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="w-10 h-10 rounded-[12px] glass-card flex items-center justify-center active:scale-95 transition-transform">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-3xl">Финансы</h1>
          </div>
          <motion.button 
            whileTap={{ scale: 0.95 }} 
            onClick={() => setShowChat(true)} 
            className="px-3 py-2 bg-gradient-to-r from-[#22C55E] to-[#4DA3FF] rounded-[12px] text-white font-bold flex items-center gap-1.5 shadow-lg shadow-[#22C55E]/30"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-xs">AI</span>
          </motion.button>
        </div>
        {/* Month Selector */}
        {availableMonths.length > 0 && (
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-white/50" />
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="glass-card rounded-[12px] px-3 py-2 bg-white/5 outline-none focus:ring-2 focus:ring-[#22C55E] text-sm flex-1"
            >
              {availableMonths.map(month => (
                <option key={month} value={month}>{getMonthDisplay(month)}</option>
              ))}
            </select>
          </div>
        )}
        <div className="flex items-center gap-2">
          <motion.button 
            whileTap={{ scale: 0.95 }} 
            onClick={() => setShowImport(true)} 
            className="w-10 h-10 rounded-[14px] bg-[#4DA3FF] flex items-center justify-center text-white"
          >
            <Upload className="w-5 h-5" />
          </motion.button>
          <motion.button 
            whileTap={{ scale: 0.95 }} 
            onClick={() => setShowAdd(true)} 
            className="w-10 h-10 rounded-[14px] bg-[#22C55E] flex items-center justify-center text-white"
          >
            <Plus className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>

      {/* AI Financial Advisor */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-[20px] p-4 mb-6 bg-gradient-to-r from-[#22C55E]/10 to-[#4DA3FF]/5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[12px] bg-[#22C55E]/20 flex items-center justify-center">
              <Brain className="w-5 h-5 text-[#22C55E]" />
            </div>
            <div>
              <h3 className="text-sm font-bold">AI Финансист</h3>
              <p className="text-xs text-white/50">Умные советы по бюджету</p>
            </div>
          </div>
          <button 
            onClick={() => setShowChat(true)}
            className="px-3 py-1.5 bg-[#22C55E]/20 hover:bg-[#22C55E]/30 transition-colors rounded-[12px] text-[#22C55E] text-xs font-bold flex items-center gap-1"
          >
            <MessageCircle className="w-3 h-3" />
            Чат
          </button>
        </div>
        <AIFinancialAdvisor savings={savings} savingsRate={savingsRate} transactions={filteredTransactions} />
      </motion.div>

      {/* Finance Score */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="glass-card rounded-[24px] p-6 mb-6">
        <p className="text-white/60 text-sm mb-2">Финансовое здоровье</p>
        <div className="flex items-end gap-2">
          <span className="text-5xl tracking-tight">{financeScore}</span>
          <span className="text-2xl text-white/40 mb-1">/ 100</span>
        </div>
        <p className="text-white/50 text-xs mt-2">{financeScore >= 70 ? 'Отлично' : financeScore >= 50 ? 'Хорошо' : 'Нужно улучшить'}</p>
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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card rounded-[24px] p-5 mb-6 bg-gradient-to-br from-[#22C55E]/10 to-[#4DA3FF]/5">
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
            <motion.div key={cat.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + index * 0.05 }} className="glass-card rounded-[20px] p-4">
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
          <p className="text-white/60 text-sm">Операции за {getMonthDisplay(selectedMonth)}</p>
          <button onClick={() => setShowAdd(true)} className="text-[#22C55E] text-sm flex items-center gap-1">
            <Plus className="w-4 h-4" /> Добавить
          </button>
        </div>

        {filteredTransactions.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card rounded-[24px] p-8 text-center">
            <div className="w-16 h-16 rounded-[20px] bg-[#22C55E]/20 flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-8 h-8 text-[#22C55E]" />
            </div>
            <h3 className="text-xl font-bold mb-2">Нет записей за этот месяц</h3>
            <p className="text-white/60 text-sm mb-4">Добавьте первую операцию</p>
            <button onClick={() => setShowAdd(true)} className="px-6 py-3 bg-[#22C55E] rounded-[16px] text-white font-medium">Добавить операцию</button>
          </motion.div>
        ) : (
          filteredTransactions.slice().reverse().slice(0, 20).map((t, index) => (
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
        {showAdd && <AddTransactionModal onClose={() => setShowAdd(false)} onAdd={addTransaction} />}
        {showImport && <ImportModal onClose={() => setShowImport(false)} onImport={(transactions) => {
          transactions.forEach(t => addTransaction(t));
        }} />}
        {showChat && <AIConsultantChat type="finance" onClose={() => setShowChat(false)} userData={{ income, expenses, savings, savingsRate, transactions: state.transactions }} />}
      </AnimatePresence>
    </div>
  );
}

function AIFinancialAdvisor({ savings, savingsRate, transactions }: { savings: number; savingsRate: number; transactions: any[] }) {
  const getAdvice = () => {
    if (transactions.length === 0) {
      return 'Добавьте данные о финансах для получения рекомендаций.';
    }
    if (savingsRate >= 50) {
      return 'Отлично! Вы откладываете больше половины дохода. Рассмотрите инвестиционные инструменты.';
    }
    if (savingsRate >= 30) {
      return 'Хороший результат! Попробуйте увеличить накопления до 50%.';
    }
    if (savings < 0) {
      return '⚠️ Расходы превышают доходы! Пересмотрите бюджет и сократите траты.';
    }
    return 'Стремитесь откладывать минимум 30% дохода для финансовой стабильности.';
  };

  return (
    <div className="space-y-2">
      <p className="text-sm text-white/80">{getAdvice()}</p>
      {savings < 0 && (
        <p className="text-xs text-[#EF4444]">⚠️ Отрицательный баланс! Нужно сократить расходы.</p>
      )}
    </div>
  );
}

function getCategoryColor(cat: string): string {
  const colors: Record<string, string> = { Еда: '#EF4444', Транспорт: '#4DA3FF', Спорт: '#22C55E', Развлечения: '#F59E0B', Здоровье: '#EF4444', Образование: '#4DA3FF' };
  return colors[cat] || '#888888';
}

function AddTransactionModal({ onClose, onAdd }: { onClose: () => void; onAdd: (t: any) => void }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('Еда');

  const handleSubmit = () => {
    if (!name || !amount) return;
    onAdd({ name, amount: Number(amount), type, category, date: new Date().toISOString().split('T')[0] });
    onClose();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} onClick={(e) => e.stopPropagation()} className="glass-card rounded-t-[32px] w-full max-w-md p-6 pb-32 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl">Добавить операцию</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">✕</button>
        </div>
        <div className="space-y-4">
          <div className="flex gap-3 mb-4">
            <button onClick={() => setType('expense')} className={`flex-1 py-3 rounded-[16px] font-medium ${type === 'expense' ? 'bg-[#EF4444] text-white' : 'glass-card'}`}>Расход</button>
            <button onClick={() => setType('income')} className={`flex-1 py-3 rounded-[16px] font-medium ${type === 'income' ? 'bg-[#22C55E] text-white' : 'glass-card'}`}>Доход</button>
          </div>
          <div>
            <label className="text-white/60 text-sm mb-2 block">Название</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Например: Супермаркет" className="w-full glass-card rounded-[16px] px-4 py-3 bg-white/5 outline-none focus:ring-2 focus:ring-[#22C55E]" />
          </div>
          <div>
            <label className="text-white/60 text-sm mb-2 block">Сумма (₽)</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" className="w-full glass-card rounded-[16px] px-4 py-3 bg-white/5 outline-none focus:ring-2 focus:ring-[#22C55E]" />
          </div>
          <div>
            <label className="text-white/60 text-sm mb-2 block">Категория</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full glass-card rounded-[16px] px-4 py-3 bg-white/5 outline-none focus:ring-2 focus:ring-[#22C55E]">
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <button onClick={onClose} className="flex-1 py-4 glass-card rounded-[20px] text-white font-medium">Отмена</button>
            <button onClick={handleSubmit} className={`flex-1 py-4 rounded-[20px] text-white font-medium ${type === 'income' ? 'bg-[#22C55E]' : 'bg-[#EF4444]'}`}>Добавить</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ImportModal({ onClose, onImport }: { onClose: () => void; onImport: (t: ImportedTransaction[]) => void }) {
  const [method, setMethod] = useState<'csv' | 'sms' | 'screenshot'>('csv');
  const [selectedBank, setSelectedBank] = useState('sberbank');
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<any>(null);
  const [error, setError] = useState('');
  const [smsText, setSmsText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const screenshotInputRef = useRef<HTMLInputElement>(null);

  const handleCSVUpload = async (file: File) => {
    setIsLoading(true);
    setError('');
    try {
      const format = bankFormats[selectedBank] || bankFormats.generic;
      const transactions = await parseCSV(file, format);
      const previewData = previewImport(transactions);
      setPreview(previewData);
    } catch (err) {
      setError('Ошибка при чтении CSV. Проверьте формат файла.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScreenshotUpload = async (file: File) => {
    setIsLoading(true);
    setError('');
    try {
      const transactions = await parseScreenshot(file);
      const previewData = previewImport(transactions);
      setPreview(previewData);
    } catch (err) {
      setError('Не удалось распознать текст. Попробуйте более чёткий скриншот.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSMSParse = () => {
    setIsLoading(true);
    setError('');
    try {
      const messages: SMSMessage[] = smsText.split('\n').filter(s => s.trim()).map(s => ({ text: s }));
      const transactions = parseSMS(messages);
      const previewData = previewImport(transactions);
      setPreview(previewData);
    } catch (err) {
      setError('Ошибка при парсинге SMS.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = () => {
    if (preview?.transactions) {
      onImport(preview.transactions);
      onClose();
    }
  };

  const resetImport = () => {
    setPreview(null);
    setError('');
    setSmsText('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (screenshotInputRef.current) screenshotInputRef.current.value = '';
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} onClick={(e) => e.stopPropagation()} className="glass-card rounded-t-[32px] w-full max-w-md p-6 pb-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl">Импорт транзакций</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">✕</button>
        </div>

        {/* Выбор метода */}
        {!preview && (
          <>
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setMethod('csv')}
                className={`flex-1 py-3 rounded-[16px] font-medium flex items-center justify-center gap-2 ${method === 'csv' ? 'bg-[#4DA3FF] text-white' : 'glass-card text-white/70'}`}
              >
                <FileText className="w-4 h-4" />
                CSV
              </button>
              <button
                onClick={() => setMethod('sms')}
                className={`flex-1 py-3 rounded-[16px] font-medium flex items-center justify-center gap-2 ${method === 'sms' ? 'bg-[#4DA3FF] text-white' : 'glass-card text-white/70'}`}
              >
                <MessageSquare className="w-4 h-4" />
                SMS
              </button>
              <button
                onClick={() => setMethod('screenshot')}
                className={`flex-1 py-3 rounded-[16px] font-medium flex items-center justify-center gap-2 ${method === 'screenshot' ? 'bg-[#4DA3FF] text-white' : 'glass-card text-white/70'}`}
              >
                <Camera className="w-4 h-4" />
                Скрин
              </button>
            </div>

            {/* CSV Метод */}
            {method === 'csv' && (
              <div className="space-y-4">
                <div>
                  <label className="text-white/60 text-sm mb-2 block">Выберите банк</label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full glass-card rounded-[16px] px-4 py-3 bg-white/5 outline-none focus:ring-2 focus:ring-[#4DA3FF]"
                  >
                    {Object.entries(bankFormats).map(([key, format]) => (
                      <option key={key} value={key}>{format.name}</option>
                    ))}
                  </select>
                  <p className="text-xs text-white/40 mt-2">{bankFormats[selectedBank]?.description}</p>
                </div>

                <div className="glass-card rounded-[16px] p-4 border-2 border-dashed border-white/20 text-center">
                  <Upload className="w-8 h-8 text-white/40 mx-auto mb-2" />
                  <p className="text-sm text-white/70 mb-2">Загрузите CSV файл</p>
                  <p className="text-xs text-white/40 mb-4">Выгрузите историю операций из банковского приложения</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.txt"
                    onChange={(e) => e.target.files?.[0] && handleCSVUpload(e.target.files[0])}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-[#4DA3FF] rounded-[12px] text-white text-sm font-medium"
                  >
                    Выбрать файл
                  </button>
                </div>

                <div className="glass-card rounded-[16px] p-4">
                  <p className="text-xs text-white/50 mb-2">📌 Как получить CSV:</p>
                  <ol className="text-xs text-white/40 space-y-1">
                    <li>• Сбербанк: Платёж → История → Экспорт</li>
                    <li>• Тинькофф: История → Экспорт → CSV</li>
                    <li>• Альфа: История → Настройки → Выписка</li>
                    <li>• ВТБ: История → Экспорт операций</li>
                  </ol>
                </div>
              </div>
            )}

            {/* SMS Метод */}
            {method === 'sms' && (
              <div className="space-y-4">
                <div>
                  <label className="text-white/60 text-sm mb-2 block">Вставьте SMS от банка</label>
                  <textarea
                    value={smsText}
                    onChange={(e) => setSmsText(e.target.value)}
                    placeholder="Карта *1234: +5000.00 RUB. Баланс: 15000.00 RUB. 12.03.24 14:30"
                    rows={6}
                    className="w-full glass-card rounded-[16px] px-4 py-3 bg-white/5 outline-none focus:ring-2 focus:ring-[#4DA3FF] text-sm resize-none"
                  />
                </div>
                <button
                  onClick={handleSMSParse}
                  disabled={!smsText.trim() || isLoading}
                  className="w-full py-4 bg-[#4DA3FF] rounded-[20px] text-white font-medium disabled:opacity-50"
                >
                  {isLoading ? 'Обработка...' : 'Распарсить SMS'}
                </button>
                <div className="glass-card rounded-[16px] p-4">
                  <p className="text-xs text-white/50 mb-2">📌 Поддерживаемые банки:</p>
                  <p className="text-xs text-white/40">Сбербанк, Тинькофф, Альфа-Банк, ВТБ</p>
                </div>
              </div>
            )}

            {/* Скриншот Метод */}
            {method === 'screenshot' && (
              <div className="space-y-4">
                <div className="glass-card rounded-[16px] p-4 border-2 border-dashed border-white/20 text-center">
                  <Camera className="w-8 h-8 text-white/40 mx-auto mb-2" />
                  <p className="text-sm text-white/70 mb-2">Загрузите скриншот</p>
                  <p className="text-xs text-white/40 mb-4">Распознаем текст с изображения (OCR)</p>
                  <input
                    ref={screenshotInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleScreenshotUpload(e.target.files[0])}
                    className="hidden"
                  />
                  <button
                    onClick={() => screenshotInputRef.current?.click()}
                    className="px-4 py-2 bg-[#4DA3FF] rounded-[12px] text-white text-sm font-medium"
                  >
                    Выбрать изображение
                  </button>
                </div>
                {isLoading && (
                  <div className="text-center py-4">
                    <p className="text-white/60 text-sm">Распознавание текста...</p>
                    <p className="text-white/40 text-xs mt-1">Это может занять несколько секунд</p>
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="glass-card rounded-[16px] p-3 bg-red-500/10 border border-red-500/20">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
          </>
        )}

        {/* Предпросмотр */}
        {preview && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 rounded-[14px] bg-white/5">
                <p className="text-white/50 text-xs mb-1">Всего</p>
                <p className="text-xl font-bold">{preview.total}</p>
              </div>
              <div className="text-center p-3 rounded-[14px] bg-[#22C55E]/10">
                <p className="text-white/50 text-xs mb-1">Доходы</p>
                <p className="text-xl font-bold text-[#22C55E]">{preview.income.toLocaleString()} ₽</p>
              </div>
              <div className="text-center p-3 rounded-[14px] bg-[#EF4444]/10">
                <p className="text-white/50 text-xs mb-1">Расходы</p>
                <p className="text-xl font-bold text-[#EF4444]">{preview.expenses.toLocaleString()} ₽</p>
              </div>
            </div>

            <div className="max-h-48 overflow-y-auto space-y-2">
              {preview.transactions.slice(0, 10).map((t: ImportedTransaction, i: number) => (
                <div key={i} className="glass-card rounded-[12px] p-3 flex items-center justify-between text-sm">
                  <div>
                    <p className="text-white/90">{t.name}</p>
                    <p className="text-white/40 text-xs">{t.date} • {t.category}</p>
                  </div>
                  <p className={`font-bold ${t.type === 'income' ? 'text-[#22C55E]' : 'text-white'}`}>
                    {t.type === 'income' ? '+' : '-'}{t.amount.toLocaleString()} ₽
                  </p>
                </div>
              ))}
              {preview.transactions.length > 10 && (
                <p className="text-white/40 text-xs text-center">+ ещё {preview.transactions.length - 10} транзакций</p>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button onClick={resetImport} className="flex-1 py-4 glass-card rounded-[20px] text-white font-medium">Назад</button>
              <button onClick={handleImport} className="flex-1 py-4 bg-[#22C55E] rounded-[20px] text-white font-medium">
                Импорт {preview.total} операций
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
