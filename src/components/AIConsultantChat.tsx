import { useState, useRef, useEffect } from 'react';
import { Send, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useBottomBar } from '../context/BottomBarContext';
import { sendMessage, getQuickTip } from '../utils/aiService';

interface Message {
  type: 'user' | 'ai';
  text: string;
}

interface AIConsultantProps {
  type: 'nutrition' | 'sleep' | 'fitness' | 'finance' | 'goals';
  onClose: () => void;
  userData?: any;
}

const consultants = {
  nutrition: {
    name: 'Анна',
    title: 'AI Нутрициолог',
    specialty: 'Питание и макронутриенты',
    avatar: '🥗',
    color: '#22C55E',
  },
  sleep: {
    name: 'Доктор Сон',
    title: 'AI Сомнолог',
    specialty: 'Качество сна и восстановление',
    avatar: '🌙',
    color: '#4DA3FF',
  },
  fitness: {
    name: 'Алекс',
    title: 'AI Тренер',
    specialty: 'Тренировки и прогресс',
    avatar: '💪',
    color: '#F59E0B',
  },
  finance: {
    name: 'Виктор',
    title: 'AI Финансист',
    specialty: 'Бюджет и инвестиции',
    avatar: '💰',
    color: '#22C55E',
  },
  goals: {
    name: 'Коуч Макс',
    title: 'AI Коуч',
    specialty: 'Достижение целей',
    avatar: '🎯',
    color: '#4DA3FF',
  },
};

const quickQuestions = {
  nutrition: [
    'Как набрать мышечную массу?',
    'Сколько калорий мне нужно?',
    'Как похудеть без вреда?',
    'Что есть до/после тренировки?',
  ],
  sleep: [
    'Как улучшить качество сна?',
    'Сколько часов нужно спать?',
    'Почему я не высыпаюсь?',
    'Как бороться с бессонницей?',
  ],
  fitness: [
    'Как начать тренироваться?',
    'Сколько раз в неделю тренироваться?',
    'Как набрать массу?',
    'Что лучше: кардио или силовые?',
  ],
  finance: [
    'Как начать копить деньги?',
    'Сколько откладывать от дохода?',
    'Как вести бюджет?',
    'Куда инвестировать?',
  ],
  goals: [
    'Как поставить правильную цель?',
    'Что делать если нет мотивации?',
    'Как не бросить цель?',
    'Сколько целей иметь одновременно?',
  ],
};

export function AIConsultantChat({ type, onClose, userData }: AIConsultantProps) {
  const consultant = consultants[type];
  const questions = quickQuestions[type];
  const { hide, show } = useBottomBar();
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'ai',
      text: `Привет! Я ${consultant.name}, ваш ${consultant.title.toLowerCase()}. ${getQuickTip(type)} Чем могу помочь?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    hide();
    return () => show();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    setMessages([...messages, { type: 'user', text }]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await sendMessage(text, { type, userData });
      setMessages((prev) => [...prev, { type: 'ai', text: response.text }]);
    } catch (error) {
      setMessages((prev) => [...prev, { type: 'ai', text: 'Произошла ошибка. Попробуйте снова.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-end justify-center bg-black/60 backdrop-blur-sm">
      <div className="glass-card rounded-t-[32px] w-full max-w-md h-[85vh] flex flex-col pb-24">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-[16px] flex items-center justify-center text-2xl" 
              style={{ backgroundColor: `${consultant.color}20` }}
            >
              {consultant.avatar}
            </div>
            <div>
              <h3 className="text-lg font-bold">{consultant.name}</h3>
              <p className="text-xs text-white/50">{consultant.title}</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-[20px] px-5 py-3 ${
                  message.type === 'user'
                    ? 'bg-[#4DA3FF] text-white'
                    : 'bg-white/10'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-line">{message.text}</p>
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-white/10 rounded-[20px] px-5 py-3">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        {messages.length === 1 && (
          <div className="px-6 pb-4">
            <p className="text-white/50 text-xs mb-3">Быстрые вопросы:</p>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {questions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q)}
                  className="px-4 py-2 rounded-[12px] bg-white/5 text-xs whitespace-nowrap hover:bg-white/10 transition-colors border border-white/10"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Photo Upload for Nutrition - скрыто, т.к. CORS не работает */}
        {/* type === 'nutrition' && (
          <div className="px-6 pb-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 bg-[#22C55E]/20 border border-[#22C55E]/30 rounded-[16px] text-[#22C55E] text-sm font-medium flex items-center justify-center gap-2 hover:bg-[#22C55E]/30 transition-colors"
            >
              📸 Сфотографировать еду для анализа
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>
        ) */}

        {/* Input */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
              placeholder="Задайте вопрос..."
              className="flex-1 bg-white/5 rounded-[16px] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#4DA3FF] placeholder:text-white/40"
            />
            <button
              onClick={() => handleSend(input)}
              disabled={!input.trim() || isTyping}
              className="w-12 h-12 rounded-[16px] bg-[#4DA3FF] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#4DA3FF]/90 transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
