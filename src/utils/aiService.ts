// Groq AI Service
// API: https://console.groq.com/docs
// Быстрее Gemini, работает из РФ, бесплатно

const GROQ_API_KEY = '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';
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

// Анализ еды по фото (через Gemini Vision, так как Groq не поддерживает изображения)
export async function analyzeFoodImage(imageBase64: string): Promise<AIResponse & { nutrition?: ImageAnalysis['nutrition'] }> {
  // Используем Gemini только для анализа изображений
  const API_KEY = 'AIzaSyABqcAz2nMNzfgaOJobolRMbP3R-MoGi4w';
  const API_URL_VISION = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro-vision:generateContent';
  
  const prompt = `Проанализируй это блюдо. Определи:
1. Что это за блюдо
2. Примерный вес порции
3. КБЖУ на порцию (калории, белки, жиры, углеводы)

Ответ дай в формате:
Блюдо: [название]
Вес: [граммы]г
Калории: [число] ккал
Белки: [число]г
Жиры: [число]г
Углеводы: [число]г

Краткий комментарий по полезности.`;

  try {
    const response = await fetch(`${API_URL_VISION}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: 'image/jpeg',
                data: imageBase64.split(',')[1] || imageBase64,
              },
            },
          ],
        }],
        generationConfig: {
          temperature: 0.5,
          maxOutputTokens: 500,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini Vision API error:', errorData);
      // Если Gemini не работает, возвращаем заглушку
      return { 
        text: 'Не удалось проанализировать изображение. Попробуйте описать блюдо текстом.',
        nutrition: undefined
      };
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Не удалось проанализировать изображение.';
    
    const nutrition = parseNutrition(text);
    
    return { text: cleanResponse(text), nutrition };
  } catch (error) {
    console.error('Gemini Image API error:', error);
    return { 
      text: 'Не удалось проанализировать изображение. Попробуйте описать блюдо текстом.',
      nutrition: undefined
    };
  }
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

// Парсинг КБЖУ из текста
function parseNutrition(text: string): ImageAnalysis['nutrition'] | undefined {
  try {
    const calories = parseInt(text.match(/Калории:\s*(\d+)/i)?.[1] || '0');
    const protein = parseInt(text.match(/Белки:\s*(\d+)/i)?.[1] || '0');
    const fat = parseInt(text.match(/Жиры:\s*(\d+)/i)?.[1] || '0');
    const carbs = parseInt(text.match(/Углеводы:\s*(\d+)/i)?.[1] || '0');
    
    if (calories > 0) {
      return { calories, protein, fat, carbs };
    }
  } catch (e) {
    console.error('Parse nutrition error:', e);
  }
  return undefined;
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
