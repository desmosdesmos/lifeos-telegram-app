import { motion } from 'motion/react';
import { ChevronLeft, Send, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';

interface Message {
  type: 'user' | 'ai';
  text: string;
}

const initialMessages: Message[] = [
  {
    type: 'ai',
    text: 'Привет! Я ваш AI-помощник LifeOS. Я могу помочь вам понять данные о здоровье и дать персональные рекомендации. Чем могу помочь?',
  },
];

const quickQuestions = [
  'Почему я чувствую усталость сегодня?',
  'Как улучшить качество сна?',
  'Сколько белка мне нужно есть?',
  'Когда лучше тренироваться?',
];

export function AIChat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const getAIResponse = (question: string): string => {
    const responses: Record<string, string> = {
      'Почему я чувствую усталость сегодня?':
        'Судя по вашим данным, вы спали всего 7ч 10м прошлой ночью — это на 40 минут меньше вашей цели в 8 часов. Кроме того, потребление белка (75г) значительно ниже целевого (120г). Это влияет на восстановление мышц и общий уровень энергии. Рекомендую: 1) Лечь спать на 30 минут раньше сегодня 2) Добавить протеиновый коктейль после тренировки 3) Выпить ещё 1-1.5л воды',
      
      'Как улучшить качество сна?':
        'Вот мои рекомендации на основе ваших данных:\n\n🌙 Создайте ритуал отхода ко сну:\n- За 1 час до сна исключите синий свет (телефон, ТВ)\n- Примите тёплый душ за 2 часа до сна\n- Поддерживайте температуру 18-20°C\n\n☕ Избегайте кофеина после 14:00\n\n📱 Используйте режим «Не беспокоить» с 22:00\n\nВаш текущий показатель качества сна: 65/100. При соблюдении этих рекомендаций можно поднять до 80+ за 2 недели.',
      
      'Сколько белка мне нужно есть?':
        'Для вашей цели «Набор мышечной массы» и веса 75 кг:\n\n🎯 Целевое потребление: 120-150г белка в день\n\nЭто 1.6-2.0г на кг веса тела.\n\nСейчас вы потребляете ~75г — это только 62% от цели.\n\nИсточники белка:\n• Куриная грудка (100г) = 31г белка\n• Творог (100г) = 18г белка\n• Протеиновый коктейль (1 порция) = 25г белка\n• Яйца (2 шт) = 12г белка\n\nПопробуйте добавить протеиновый коктейль утром и после тренировки.',
      
      'Когда лучше тренироваться?':
        'На основе ваших данных о сне и активности:\n\n🌅 Утро (07:00-09:00):\n+ Высокий уровень тестостерона\n+ Меньше людей в зале\n+ Заряд энергии на весь день\n- Требуется больше разминки\n\n🌆 Вечер (18:00-20:00):\n+ Пиковая физическая производительность\n+ Выше температура тела\n- Может влиять на сон если тренироваться позже\n\nРекомендация: Учитывая ваш график сна (подъём в 06:40), вечерние тренировки с 18:00 до 19:30 будут оптимальны. Завершайте тренировку минимум за 3 часа до сна.',
    };

    return responses[question] || 'Спасибо за вопрос! Я анализирую ваши данные и дам развёрнутый ответ в ближайшее время.';
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages([...messages, { type: 'user', text: userMessage }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = getAIResponse(userMessage);
      setMessages((prev) => [...prev, { type: 'ai', text: response }]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickQuestion = (question: string) => {
    setMessages([...messages, { type: 'user', text: question }]);
    setIsTyping(true);

    setTimeout(() => {
      const response = getAIResponse(question);
      setMessages((prev) => [...prev, { type: 'ai', text: response }]);
      setIsTyping(false);
    }, 1500);
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
            <h1 className="text-xl">AI Помощник</h1>
            <p className="text-white/50 text-xs">Всегда на связи</p>
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
            transition={{ delay: index * 0.1 }}
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
                key={question}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                onClick={() => handleQuickQuestion(question)}
                className="w-full glass-card rounded-[16px] px-4 py-3 text-sm text-white/70 hover:text-white transition-colors text-left"
              >
                {question}
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="px-6 pb-28 pt-4">
        <div className="glass-card rounded-[20px] p-2 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Задайте вопрос..."
            className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-white/40"
          />
          <button
            onClick={handleSend}
            className="w-10 h-10 rounded-[14px] bg-[#4DA3FF] flex items-center justify-center active:scale-95 transition-transform disabled:opacity-50"
            disabled={!input.trim() || isTyping}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
