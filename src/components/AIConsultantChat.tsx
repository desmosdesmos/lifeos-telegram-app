import { useState, useRef, useEffect } from 'react';
import { Send, X, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useBottomBar } from '../context/BottomBarContext';
import { useSubscription } from '../context/SubscriptionContext';
import { sendMessage, getQuickTip, analyzeImageWithContext, fileToBase64 } from '../utils/aiService';

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
    gradient: 'from-[#22C55E]/20 to-[#22C55E]/5',
  },
  sleep: {
    name: 'Доктор Сон',
    title: 'AI Сомнолог',
    specialty: 'Качество сна и восстановление',
    avatar: '🌙',
    color: '#4DA3FF',
    gradient: 'from-[#4DA3FF]/20 to-[#4DA3FF]/5',
  },
  fitness: {
    name: 'Алекс',
    title: 'AI Тренер',
    specialty: 'Тренировки и прогресс',
    avatar: '💪',
    color: '#F59E0B',
    gradient: 'from-[#F59E0B]/20 to-[#F59E0B]/5',
  },
  finance: {
    name: 'Виктор',
    title: 'AI Финансист',
    specialty: 'Бюджет и инвестиции',
    avatar: '💰',
    color: '#22C55E',
    gradient: 'from-[#22C55E]/20 to-[#22C55E]/5',
  },
  goals: {
    name: 'Коуч Макс',
    title: 'AI Коуч',
    specialty: 'Достижение целей',
    avatar: '🎯',
    color: '#4DA3FF',
    gradient: 'from-[#4DA3FF]/20 to-[#4DA3FF]/5',
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
  const { isPremium, showPaywall, incrementAiUsage } = useSubscription();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'ai',
      text: `Привет! Я ${consultant.name}, ваш ${consultant.title.toLowerCase()}. ${getQuickTip(type)} Чем могу помочь?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
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

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isPremium) {
      showPaywall('photo-analysis');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (!incrementAiUsage()) {
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessages(prev => [...prev, {
        type: 'ai',
        text: '❌ Файл слишком большой. Максимальный размер: 5MB'
      }]);
      return;
    }

    try {
      setIsAnalyzingImage(true);

      setMessages(prev => [...prev, {
        type: 'user',
        text: `📸 Загружено фото для анализа (${(file.size / 1024).toFixed(1)} KB)`
      }]);

      const base64 = await fileToBase64(file);
      const context = type === 'sleep' || type === 'goals' ? 'other' : type;
      const response = await analyzeImageWithContext(base64, context);

      setMessages(prev => [...prev, { type: 'ai', text: response.text }]);
    } catch (error) {
      console.error('Photo analysis error:', error);
      setMessages(prev => [...prev, {
        type: 'ai',
        text: `❌ Ошибка анализа фото: ${error instanceof Error ? error.message : 'Попробуйте снова'}`
      }]);
    } finally {
      setIsAnalyzingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    if (!incrementAiUsage()) return;

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
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Backdrop with strong blur */}
        <motion.div
          className="absolute inset-0 bg-black/70 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Chat Panel */}
        <motion.div
          className="glass-card-ultra rounded-[32px] w-full max-w-md h-[80vh] max-h-[600px] flex flex-col relative overflow-hidden"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 400 }}
        >
          {/* Animated gradient background */}
          <div className={`absolute inset-0 bg-gradient-to-b ${consultant.gradient} pointer-events-none`} />
          
          {/* Floating orbs */}
          <motion.div 
            className="absolute -top-20 -right-20 w-56 h-56 rounded-full blur-[80px] opacity-30 pointer-events-none"
            style={{ backgroundColor: consultant.color }}
            animate={{ 
              scale: [1, 1.2, 1],
              x: [0, -20, 0],
              y: [0, 10, 0]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div 
            className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full blur-[80px] opacity-20 pointer-events-none"
            style={{ backgroundColor: consultant.color }}
            animate={{ 
              scale: [1.2, 1, 1.2],
              x: [0, 20, 0],
              y: [0, -10, 0]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />

          {/* Header */}
          <motion.div 
            className="relative z-10 flex items-center justify-between p-6 border-b border-white/10"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3">
              <motion.div
                className="w-14 h-14 rounded-[20px] flex items-center justify-center text-2xl relative overflow-hidden"
                style={{ 
                  background: `linear-gradient(135deg, ${consultant.color}30, ${consultant.color}10)`,
                  boxShadow: `0 8px 24px ${consultant.color}40`
                }}
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                {consultant.avatar}
              </motion.div>
              <div>
                <h3 className="text-lg font-bold text-white">{consultant.name}</h3>
                <p className="text-xs text-white/50">{consultant.title}</p>
              </div>
            </div>
            <motion.button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all duration-300 backdrop-blur-sm"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-5 h-5" />
            </motion.button>
          </motion.div>

          {/* Messages */}
          <div className="relative z-10 flex-1 overflow-y-auto p-6 space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <motion.div
                    className={`max-w-[85%] rounded-[24px] px-5 py-3.5 backdrop-blur-xl ${
                      message.type === 'user'
                        ? 'bg-gradient-to-br from-[#4DA3FF] to-[#4DA3FF]/80 text-white shadow-lg'
                        : 'bg-white/10 border border-white/10'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-line">{message.text}</p>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex justify-start"
              >
                <div className="bg-white/10 rounded-[24px] px-5 py-4 backdrop-blur-xl border border-white/10">
                  <div className="flex items-center gap-1.5">
                    <motion.div 
                      className="w-2.5 h-2.5 bg-white/50 rounded-full"
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                    />
                    <motion.div 
                      className="w-2.5 h-2.5 bg-white/50 rounded-full"
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
                    />
                    <motion.div 
                      className="w-2.5 h-2.5 bg-white/50 rounded-full"
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <motion.div 
              className="relative z-10 px-6 pb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-white/50 text-xs mb-3 font-medium">Быстрые вопросы:</p>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {questions.map((q, i) => (
                  <motion.button
                    key={i}
                    onClick={() => handleSend(q)}
                    className="px-4 py-2.5 rounded-[16px] bg-white/5 text-xs whitespace-nowrap transition-all duration-300 border border-white/10 hover:bg-white/10 backdrop-blur-sm"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    {q}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Photo Upload Button */}
          <motion.div
            className="relative z-10 px-6 pb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button
              onClick={() => fileInputRef.current?.click()}
              disabled={isAnalyzingImage}
              className="w-full py-3.5 bg-[#4DA3FF]/20 border border-[#4DA3FF]/40 rounded-[20px] text-[#4DA3FF] text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#4DA3FF]/30 transition-all duration-300 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isAnalyzingImage ? (
                <>
                  <motion.div 
                    className="w-5 h-5 border-2 border-[#4DA3FF] border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                  <span>Анализирую фото...</span>
                </>
              ) : (
                <>
                  <Camera className="w-5 h-5" />
                  <span>📸 Сделать фото для AI анализа</span>
                </>
              )}
            </motion.button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </motion.div>

          {/* Input */}
          <motion.div
            className="relative z-10 p-4 border-t border-white/10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2.5">
              <motion.input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                placeholder="Задайте вопрос..."
                className="flex-1 bg-white/5 rounded-[20px] px-5 py-3.5 text-sm outline-none focus:ring-2 focus:ring-[#4DA3FF]/50 placeholder:text-white/40 backdrop-blur-sm border border-white/10 transition-all duration-300"
                whileFocus={{ scale: 1.01 }}
              />
              <motion.button
                onClick={() => handleSend(input)}
                disabled={!input.trim() || isTyping}
                className="w-13 h-13 rounded-[20px] bg-gradient-to-br from-[#4DA3FF] to-[#4DA3FF]/80 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Send className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
