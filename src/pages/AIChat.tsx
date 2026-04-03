import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Send, Sparkles, Camera } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useBottomBar } from '../context/BottomBarContext';
import { useSubscription } from '../context/SubscriptionContext';
import { sendMessage, analyzeImageWithContext, fileToBase64 } from '../utils/aiService';

interface Message {
  type: 'user' | 'ai';
  text: string;
}

const initialMessages: Message[] = [
  {
    type: 'ai',
    text: 'Привет! Я ваш AI-помощник LifeOS. Я вижу все ваши данные: питание, сон, тренировки, финансы, цели. Задайте любой вопрос о здоровье и продуктивности!',
  },
];

const quickQuestions = [
  'Почему я чувствую усталость сегодня?',
  'Как улучшить качество сна?',
  'Сколько калорий мне нужно?',
  'Как начать тренироваться?',
];

export function AIChat() {
  const navigate = useNavigate();
  const { state } = useApp();
  const { hide, show } = useBottomBar();
  const { isPremium, showPaywall, incrementAiUsage } = useSubscription();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleFocusIn = () => hide();
    const handleFocusOut = () => show();

    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);

    return () => {
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
      show();
    };
  }, []);

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
      const response = await analyzeImageWithContext(base64, 'other',
        'Проанализируй это изображение подробно. Что ты видишь? Какие рекомендации можешь дать пользователю LifeOS на основе этого фото? Ответь структурированно и полезно.'
      );

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
      const response = await sendMessage(text, {
        type: 'analysis',
        userData: {
          meals: state.meals,
          sleepDays: state.sleepDays,
          workouts: state.workouts,
          transactions: state.transactions,
          goals: state.goals,
          profile: state.profile,
        },
      });

      setMessages((prev) => [...prev, { type: 'ai', text: response.text }]);
    } catch (error) {
      console.error('AI Chat error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      setMessages((prev) => [
        ...prev,
        {
          type: 'ai',
          text: `❌ Ошибка: ${errorMessage}\n\nПроверьте:\n• Интернет-соединение\n• Доступ к API\n• Попробуйте позже`,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0B0B0F] flex flex-col relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="gradient-orb gradient-orb-1" style={{ top: '5%', left: '-10%', width: '250px', height: '250px' }} />
        <div className="gradient-orb gradient-orb-2" style={{ bottom: '30%', right: '-5%', width: '200px', height: '200px' }} />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 px-6 pt-12 pb-4 flex items-center gap-3 border-b border-white/5"
      >
        <motion.button
          onClick={() => navigate('/')}
          className="w-11 h-11 rounded-[16px] glass-card flex items-center justify-center active:scale-95 transition-transform"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>
        <div className="flex items-center gap-2">
          <motion.div 
            className="w-11 h-11 rounded-[16px] bg-gradient-to-br from-[#4DA3FF] to-[#22C55E] flex items-center justify-center glow-blue"
            initial={{ scale: 0.8, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          >
            <Sparkles className="w-6 h-6" />
          </motion.div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">AI Ассистент</h1>
            <p className="text-white/50 text-xs">Анализ всех сфер жизни</p>
          </div>
        </div>
      </motion.div>

      {/* Messages */}
      <div className="relative z-10 flex-1 px-6 py-6 space-y-4 overflow-y-auto">
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
                    ? 'bg-gradient-to-br from-[#4DA3FF] to-[#4DA3FF]/80 text-white shadow-lg glow-blue'
                    : 'glass-card border border-white/10'
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
            <div className="glass-card rounded-[24px] px-5 py-4 backdrop-blur-xl border border-white/10">
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

        {/* Quick Questions */}
        {messages.length === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <p className="text-white/50 text-sm px-1 font-medium">Быстрые вопросы:</p>
            {quickQuestions.map((question, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                onClick={() => handleSend(question)}
                className="w-full glass-card rounded-[20px] px-4 py-3.5 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 text-left"
                whileHover={{ x: 4, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                {question}
              </motion.button>
            ))}
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="relative z-10 px-6 pb-28 pt-4 space-y-3">
        {/* Photo Upload Button */}
        <motion.button
          onClick={() => fileInputRef.current?.click()}
          disabled={isAnalyzingImage || isTyping}
          className="w-full py-3.5 bg-[#4DA3FF]/20 border border-[#4DA3FF]/40 rounded-[20px] text-[#4DA3FF] text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#4DA3FF]/30 transition-all duration-300 backdrop-blur-sm disabled:opacity-50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
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

        {/* Text Input */}
        <motion.div 
          className="glass-card rounded-[24px] p-2.5 flex items-center gap-2.5 backdrop-blur-xl border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
            placeholder="Задайте вопрос..."
            className="flex-1 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-white/40"
          />
          <motion.button
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isTyping}
            className="w-12 h-12 rounded-[18px] bg-gradient-to-br from-[#4DA3FF] to-[#4DA3FF]/80 flex items-center justify-center active:scale-95 transition-transform disabled:opacity-50 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
