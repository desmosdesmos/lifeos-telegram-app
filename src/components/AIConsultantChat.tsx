import { useState } from 'react';
import { Send, X } from 'lucide-react';

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

const aiResponses: Record<string, Record<string, string>> = {
  nutrition: {
    'Как набрать мышечную массу?': 'Для набора массы нужен профицит калорий (на 300-500 ккал больше нормы) и достаточное количество белка (1.6-2.2г на кг веса). Рекомендую: 1) Увеличьте калорийность рациона 2) Ешьте 4-6 раз в день 3) Добавьте сложные углеводы 4) Тренируйтесь с отягощениями 3-4 раза в неделю.',
    'Сколько калорий мне нужно?': 'Расчёт зависит от ваших параметров. Для мужчины 75 кг, 180 см, 28 лет при умеренной активности: ~2450 ккал для поддержания, ~2750 для набора, ~1950 для похудения. Используйте формулу Миффлина-Сан Жеора для точного расчёта.',
    'Как похудеть без вреда?': 'Безопасное похудение — 0.5-1 кг в неделю. Создайте дефицит 500 ккал, потребляйте 2г белка на кг веса, не опускайтесь ниже 1200 ккал (женщины) / 1500 ккал (мужчины), добавьте кардио и силовые тренировки.',
    'Что есть до/после тренировки?': 'До тренировки (за 1-2 часа): сложные углеводы + белок (овсянка + яйца). После (в течение 2 часов): белок + углеводы для восстановления (курица + рис, протеиновый коктейль + банан).',
  },
  sleep: {
    'Как улучшить качество сна?': '1) Ложитесь в одно и то же время 2) Избегайте экранов за 1-2 часа до сна 3) Поддерживайте температуру 18-20°C 4) Не ешьте за 3 часа до сна 5) Избегайте кофеина после 14:00 6) Создайте ритуал отхода ко сну.',
    'Сколько часов нужно спать?': 'Взрослому человеку нужно 7-9 часов сна. Важно не только количество, но и качество: глубокий сон (15-25%), REM-сон (20-25%), лёгкий сон (50-60%). Регулярность важнее продолжительности.',
    'Почему я не высыпаюсь?': 'Возможные причины: 1) Недостаточная продолжительность 2) Плохое качество сна (апноэ, шум) 3) Нерегулярный график 4) Синий свет перед сном 5) Стресс 6) Кофеин/алкоголь. Ведите дневник сна для выявления проблемы.',
    'Как бороться с бессонницей?': '1) Когнитивно-поведенческая терапия (КПТ-И) 2) Ограничьте время в кровати только сном 3) Вставайте в одно время 4) Не спите днём 5) Расслабляющие техники (медитация, дыхание) 6) При хронической — обратитесь к врачу.',
  },
  fitness: {
    'Как начать тренироваться?': 'Начните с 3 тренировок в неделю по 45-60 минут. Программа для новичков: 1) Разминка 5-10 мин 2) Базовые упражнения (присед, тяга, жим) 3) Заминка и растяжка. Первые 2-4 недели работайте над техникой с лёгкими весами.',
    'Сколько раз в неделю тренироваться?': 'Оптимально 3-5 раз в неделю. Новичкам: 3 раза (full body). Средний уровень: 4 раза (сплит верх/низ). Продвинутые: 5-6 раз (сплит по группам мышц). Важно: 1-2 дня отдыха для восстановления.',
    'Как набрать массу?': '1) Профицит калорий (+300-500 ккал) 2) Белок 1.6-2.2г/кг 3) Углеводы 4-7г/кг 4) Тренировки с прогрессией нагрузки 5) 8-12 повторений в подходе 6) 3-5 подходов на упражнение 7) Сон 7-9 часов 8) Минимум кардио.',
    'Что лучше: кардио или силовые?': 'Зависит от цели. Для похудения: комбинация (силовые 3-4 раза + кардио 2-3 раза). Для набора массы: акцент на силовые, кардио 1-2 раза для здоровья. Для выносливости: кардио 4-5 раз + лёгкие силовые. Идеально — сочетать оба типа.',
  },
  finance: {
    'Как начать копить деньги?': '1) Правило 50/30/20: 50% нужды, 30% желания, 20% накопления 2) Автоматизируйте отчисления 3) Создайте подушку (3-6 месяцев расходов) 4) Ведите учёт расходов 5) Откажитесь от импульсивных покупок 6) Используйте кэшбэки.',
    'Сколько откладывать от дохода?': 'Минимум 10%, оптимально 20-30%. Если откладываете меньше 10% — пересмотрите бюджет. Формула: сначала отложите, потом тратьте. При доходе 100к: 20к на накопления, 50к на нужды, 30к на желания.',
    'Как вести бюджет?': '1) Записывайте все расходы 2) Категоризируйте (еда, транспорт, развлечения) 3) Установите лимиты по категориям 4) Анализируйте в конце месяца 5) Используйте приложения (CoinKeeper, Moneon) или таблицы.',
    'Куда инвестировать?': 'Для новичков: 1) Облигации федерального займа (ОФЗ) — надёжно 2) ETF на индекс Мосбиржи — диверсификация 3) Вклады — ликвидность. Распределение: 60% облигации, 40% акции. Избегайте: криптовалюты, форекс, бинарные опционы.',
  },
  goals: {
    'Как поставить правильную цель?': 'Используйте SMART: Specific (конкретная), Measurable (измеримая), Achievable (достижимая), Relevant (значимая), Time-bound (ограниченная по времени). Пример: не «похудеть», а «похудеть на 5 кг к 1 мая, тренируясь 3 раза в неделю».',
    'Что делать если нет мотивации?': '1) Найдите своё «зачем» — глубинную причину 2) Разбейте цель на маленькие шаги 3) Визуализируйте результат 4) Найдите партнёра 5) Отслеживайте прогресс 6) Награждайте себя за этапы 7) Помните: дисциплина важнее мотивации.',
    'Как не бросить цель?': '1) Публичное обязательство 2) Трекер привычек 3) Минимальное действие в день (даже 5 минут) 4) Напоминания 5) Поддержка окружения 6) Визуализация прогресса 7) Прощайте срывы и продолжайте.',
    'Сколько целей иметь одновременно?': 'Оптимально 3-5 активных целей. Больше — расфокусировка. Меньше — недоиспользование потенциала. Распределите по сферам: 1 здоровье, 1-2 карьера/финансы, 1 отношения, 1 саморазвитие. Фокусируйтесь на 1 главной цели в месяц.',
  },
};

export function AIConsultantChat({ type, onClose }: AIConsultantProps) {
  const consultant = consultants[type];
  const questions = quickQuestions[type];
  const responses = aiResponses[type];

  const getGreeting = (type: string) => {
    const greetings: Record<string, string> = {
      nutrition: `Привет! Я ${consultants.nutrition.name}, ваш AI нутрициолог. Помогу рассчитать калории, составить план питания и ответить на вопросы о БЖУ. Что вас интересует?`,
      sleep: `Здравствуйте! Я ${consultants.sleep.name}, AI сомнолог. Помогу улучшить качество сна и режим. Расскажите о вашей проблеме?`,
      fitness: `Привет! Я ${consultants.fitness.name}, ваш AI тренер. Помогу с программой тренировок, техникой и прогрессом. Какая у вас цель?`,
      finance: `Добрый день! Я ${consultants.finance.name}, AI финансовый советник. Помогу с бюджетом, накоплениями и инвестициями. Что вас интересует?`,
      goals: `Привет! Я ${consultants.goals.name}, ваш AI коуч. Помогу поставить и достичь цели. Над чем работаем?`,
    };
    return greetings[type];
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'ai',
      text: getGreeting(type),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    setMessages([...messages, { type: 'user', text }]);
    setInput('');
    setIsTyping(true);

    // Ищем готовый ответ или генерируем общий
    setTimeout(() => {
      const response = responses[text] || getGenericResponse(type, text);
      setMessages((prev) => [...prev, { type: 'ai', text: response }]);
      setIsTyping(false);
    }, 1500);
  };

  const getGenericResponse = (_type: string, _question: string): string => {
    const genericResponses: Record<string, string[]> = {
      nutrition: [
        'Интересный вопрос! Для точного ответа мне нужно больше информации о вашем рационе. Можете рассказать, что вы обычно едите за день?',
        'Это зависит от многих факторов: веса, роста, активности, цели. Давайте рассчитаем вашу норму калорий и БЖУ индивидуально.',
      ],
      sleep: [
        'Расскажите подробнее о вашем режиме сна. Во сколько ложитесь и встаёте?',
        'Для рекомендации мне нужно знать: сколько часов спите, как часто просыпаетесь, чувствуете ли себя отдохнувшим утром?',
      ],
      fitness: [
        'Какой у вас опыт тренировок? Были ли травмы? Какое оборудование доступно?',
        'Для составления программы нужны данные: сколько раз в неделю можете тренироваться, какая основная цель?',
      ],
      finance: [
        'Какой у вас доход и расходы? Есть ли кредиты?',
        'Для совета по инвестициям нужно знать: какой суммы располагаете, на какой срок готовы вложить, какая толерантность к риску?',
      ],
      goals: [
        'Расскажите о вашей цели подробнее. Почему она важна для вас?',
        'Какие шаги уже предприняли? Что мешает движению к цели?',
      ],
    };
    const options = genericResponses[type];
    return options[Math.floor(Math.random() * options.length)];
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/60 backdrop-blur-sm">
      <div className="glass-card rounded-t-[32px] w-full max-w-md h-[85vh] flex flex-col pb-24">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-[16px] flex items-center justify-center text-2xl" style={{ backgroundColor: `${consultant.color}20` }}>
              {consultant.avatar}
            </div>
            <div>
              <h3 className="text-lg font-bold">{consultant.name}</h3>
              <p className="text-xs text-white/50">{consultant.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
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
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white/10 rounded-[20px] px-5 py-3">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Questions */}
        {messages.length === 1 && (
          <div className="px-6 pb-4">
            <p className="text-white/50 text-xs mb-3">Быстрые вопросы:</p>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {questions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q)}
                  className="px-4 py-2 rounded-[12px] bg-white/5 text-xs whitespace-nowrap hover:bg-white/10 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
              placeholder="Задайте вопрос..."
              className="flex-1 bg-white/5 rounded-[16px] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#4DA3FF]"
            />
            <button
              onClick={() => handleSend(input)}
              disabled={!input.trim() || isTyping}
              className="w-12 h-12 rounded-[16px] bg-[#4DA3FF] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
