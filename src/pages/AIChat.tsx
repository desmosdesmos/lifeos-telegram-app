import { motion } from 'motion/react';
import { ChevronLeft, Send, Sparkles, Camera } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useBottomBar } from '../context/BottomBarContext';
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

  // Скрытие нижнего бара при открытии клавиатуры
  useEffect(() => {
    const handleFocusIn = () => hide();
    const handleFocusOut = () => show();

    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);

    return () => {
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
    };
  }, []);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Проверка размера (макс 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessages(prev => [...prev, { 
        type: 'ai', 
        text: '❌ Файл слишком большой. Максимальный размер: 5MB' 
      }]);
      return;
    }

    try {
      setIsAnalyzingImage(true);

      // Добавляем сообщение о загрузке
      setMessages(prev => [...prev, { 
        type: 'user', 
        text: `📸 Загружено фото для анализа (${(file.size / 1024).toFixed(1)} KB)` 
      }]);

      // Конвертация в base64
      const base64 = await fileToBase64(file);

      // Анализ изображения с общим контекстом
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

    setMessages([...messages, { type: 'user', text }]);
    setInput('');
    setIsTyping(true);

    try {
      console.log('Sending message to AI:', text);
      console.log('User data:', {
        mealsCount: state.meals.length,
        sleepDaysCount: state.sleepDays.length,
        workoutsCount: state.workouts.length,
        transactionsCount: state.transactions.length,
        goalsCount: state.goals.length,
      });

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

      console.log('AI response:', response);
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
    <div className="w-full min-h-screen bg-[#0B0B0F] flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 pt-12 pb-4 flex items-center gap-3 border-b border-white/5"
      >
        <button
          onClick={() => navigate('/')}
          className="w-10 h-10 rounded-[12px] glass-card flex items-center justify-center active:scale-95 transition-transform"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-[#4DA3FF] to-[#22C55E] flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl">AI Ассистент</h1>
            <p className="text-white/50 text-xs">Анализ всех сфер жизни</p>
          </div>
        </div>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 px-6 py-6 space-y-4 overflow-y-auto">
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
                  : 'glass-card'
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
            <div className="glass-card rounded-[20px] px-5 py-3">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
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
            <p className="text-white/50 text-sm px-1">Быстрые вопросы:</p>
            {quickQuestions.map((question, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                onClick={() => handleSend(question)}
                className="w-full glass-card rounded-[16px] px-4 py-3 text-sm text-white/70 hover:text-white transition-colors text-left"
              >
                {question}
              </motion.button>
            ))}
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-6 pb-28 pt-4 space-y-3">
        {/* Photo Upload Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isAnalyzingImage || isTyping}
          className="w-full py-3 bg-[#4DA3FF]/20 border border-[#4DA3FF]/30 rounded-[16px] text-[#4DA3FF] text-sm font-medium flex items-center justify-center gap-2 hover:bg-[#4DA3FF]/30 transition-colors disabled:opacity-50"
        >
          {isAnalyzingImage ? (
            <>
              <div className="w-4 h-4 border-2 border-[#4DA3FF] border-t-transparent rounded-full animate-spin" />
              <span>Анализирую фото...</span>
            </>
          ) : (
            <>
              <Camera className="w-4 h-4" />
              <span>📸 Сделать фото для AI анализа</span>
            </>
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handlePhotoUpload}
          className="hidden"
        />

        {/* Text Input */}
        <div className="glass-card rounded-[20px] p-2 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
            placeholder="Задайте вопрос..."
            className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-white/40"
          />
          <button
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isTyping}
            className="w-10 h-10 rounded-[14px] bg-[#4DA3FF] flex items-center justify-center active:scale-95 transition-transform disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
