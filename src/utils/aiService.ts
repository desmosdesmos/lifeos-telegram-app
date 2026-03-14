// Groq AI Service
// API: https://console.groq.com/docs
// Быстрее Gemini, работает из РФ, бесплатно

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export interface AIResponse {
  text: string;
  data?: any;
}

export interface ImageAnalysis {
  label: string;
  confidence: number;
  nutrition?: {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
  };
}

// Системные промпты для каждого консультанта
const systemPrompts = {
  nutrition: `Ты профессиональный AI нутрициолог с 10-летним опытом.
Твоя задача: анализировать рацион пользователя и давать персональные рекомендации.
Отвечай кратко (2-4 предложения), по делу, с конкретными цифрами.
Используй дружеский, поддерживающий тон.
Если видишь проблему — укажи на неё и предложи решение.`,

  sleep: `Ты AI сомнолог, эксперт по сну и восстановлению.
Твоя задача: анализировать качество сна и давать рекомендации по улучшению.
Отвечай кратко (2-4 предложения), с конкретными советами.
Используй научный, но доступный язык.`,

  fitness: `Ты сертифицированный AI тренер с опытом подготовки атлетов.
Твоя задача: анализировать тренировки и прогресс, давать рекомендации.
Отвечай кратко (2-4 предложения), с конкретными упражнениями и цифрами.
Мотивируй, но будь реалистом.`,

  finance: `Ты AI финансовый советник с опытом управления личными финансами.
Твоя задача: анализировать доходы/расходы и давать советы по оптимизации.
Отвечай кратко (2-4 предложения), с конкретными цифрами и процентами.
Будь практичным и реалистичным.`,

  goals: `Ты AI коуч по достижению целей, эксперт по мотивации и продуктивности.
Твоя задача: помогать ставить SMART-цели и достигать их.
Отвечай кратко (2-4 предложения), с конкретными шагами.
Мотивируй и поддерживай.`,

  analysis: `Ты AI аналитик жизни, объединяешь данные из всех сфер.
Твоя задача: давать общую оценку и приоритеты улучшений.
Отвечай кратко (3-5 предложений), структурированно.
Выдели 1-2 главных приоритета для работы.`,
};

// Отправка сообщения в Groq
export async function sendMessage(
  message: string,
  context: {
    type: 'nutrition' | 'sleep' | 'fitness' | 'finance' | 'goals' | 'analysis';
    userData?: any;
    conversationHistory?: Array<{role: string; content: string}>;
  }
): Promise<AIResponse> {
  const systemPrompt = systemPrompts[context.type as keyof typeof systemPrompts] || '';
  const prompt = buildPrompt(message, context);

  try {
    console.log('Sending to Groq:', prompt.substring(0, 100));

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500,
        top_p: 1,
        stream: false,
      }),
    });

    console.log('Groq response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Groq API error:', errorData);
      throw new Error(`Groq API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log('Groq response data:', data);

    const text = data.choices?.[0]?.message?.content || 'Извините, я не могу ответить сейчас.';

    return { text: cleanResponse(text) };
  } catch (error) {
    console.error('Groq API error:', error);
    return {
      text: 'Произошла ошибка. Проверьте соединение и попробуйте снова.\n\n' +
            (error instanceof Error ? error.message : 'Неизвестная ошибка')
    };
  }
}

// Анализ еды по фото (заглушка - CORS ограничения)
// Hugging Face, Gemini и другие не работают из браузера без своего прокси
export async function analyzeFoodImage(imageBase64: string): Promise<AIResponse & { nutrition?: ImageAnalysis['nutrition'] }> {
  console.log('Image analysis requested, size:', imageBase64.length);
  
  // Возвращаем заглушку с предложением описать еду текстом
  throw new Error('Анализ фото временно недоступен. Опишите блюдо текстом в чате.');
}

// Построение промпта с контекстом
function buildPrompt(message: string, context: any): string {
  let userDataContext = '';

  if (context.userData) {
    const { userData } = context;

    if (context.type === 'nutrition') {
      userDataContext = `
Данные пользователя:
- Съедено сегодня: ${userData.macros?.calories || 0} ккал (Б: ${userData.macros?.protein || 0}г, Ж: ${userData.macros?.fat || 0}г, У: ${userData.macros?.carbs || 0}г)
- Цель: ${userData.targets?.calories || 2000} ккал, Б: ${userData.targets?.protein || 120}г, Ж: ${userData.targets?.fat || 65}г, У: ${userData.targets?.carbs || 250}г
`;
    } else if (context.type === 'sleep') {
      userDataContext = `
Данные пользователя:
- Среднее качество сна: ${userData.avgQuality || 0}%
- Записей о сне: ${userData.sleepDays?.length || 0}
`;
    } else if (context.type === 'fitness') {
      userDataContext = `
Данные пользователя:
- Тренировок выполнено: ${userData.workouts?.filter((w: any) => w.completed).length || 0}
- Всего тренировок: ${userData.workouts?.length || 0}
`;
    } else if (context.type === 'finance') {
      userDataContext = `
Данные пользователя:
- Доходы: ${userData.income || 0}₽
- Расходы: ${userData.expenses || 0}₽
- Накопления: ${userData.savings || 0}₽ (${userData.savingsRate || 0}%)
`;
    } else if (context.type === 'goals') {
      userDataContext = `
Данные пользователя:
- Активных целей: ${userData.goals?.filter((g: any) => !g.completed).length || 0}
- Выполнено целей: ${userData.goals?.filter((g: any) => g.completed).length || 0}
`;
    }
  }

  return `${userDataContext}

Вопрос пользователя: ${message}

Ответ:`;
}

// Очистка ответа
function cleanResponse(text: string): string {
  return text
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/__/g, '')
    .replace(/_/g, '')
    .trim();
}

// Быстрые советы (кэшированные ответы для частых вопросов)
const quickTips = {
  nutrition: [
    'Пейте больше воды! Минимум 30-40мл на кг веса тела.',
    'Добавьте больше белка в каждый приём пищи.',
    'Не забывайте про овощи — минимум 400г в день.',
  ],
  sleep: [
    'Ложитесь в одно и то же время, даже в выходные.',
    'Избегайте экранов за 1-2 часа до сна.',
    'Поддерживайте температуру 18-20°C в спальне.',
  ],
  fitness: [
    'Прогрессия нагрузок — ключ к росту. Увеличивайте веса постепенно.',
    'Не забывайте про разминку перед тренировкой.',
    'Восстановление так же важно, как и тренировка.',
  ],
  finance: [
    'Правило 50/30/20: 50% нужды, 30% желания, 20% накопления.',
    'Ведите учёт всех трат хотя бы месяц — увидите, куда уходят деньги.',
    'Создайте подушку безопасности на 3-6 месяцев расходов.',
  ],
  goals: [
    'Разбейте большую цель на маленькие шаги. Двигайтесь постепенно.',
    'Отслеживайте прогресс — это мотивирует продолжать.',
    'Найдите «зачем» для вашей цели — это поможет не сдаться.',
  ],
};

export function getQuickTip(type: keyof typeof quickTips): string {
  const tips = quickTips[type];
  return tips[Math.floor(Math.random() * tips.length)];
}
