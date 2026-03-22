// GigaChat AI Service (Сбер)
// API: https://developers.sber.ru/docs/ru/gigachat
// Работает в РФ через собственный прокси-сервер
// Сервер: http://37.252.21.153:3000

const AI_PROXY = 'http://37.252.21.153:3000/api/chat';

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

// Конвертация файла в base64
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1] || result;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
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

// Отправка сообщения в GigaChat через прокси
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
    console.log('Sending to GigaChat:', prompt.substring(0, 100));

    const response = await fetch(AI_PROXY, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        systemPrompt,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    console.log('Proxy response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Proxy error:', errorData);
      throw new Error(`AI ошибка: ${errorData.error || response.status}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || 'Извините, я не могу ответить сейчас.';

    return { text: cleanResponse(text) };
  } catch (error) {
    console.error('AI Chat error:', error);
    throw error;
  }
}

// Анализ фото через GigaChat Vision API (через прокси)
export async function analyzeFoodImage(
  imageBase64: string,
  prompt: string = 'Проанализируй это блюдо. Оцени:\n1. Что это за еда\n2. Примерные КБЖУ на порцию\n3. Качество еды\n4. Рекомендации\n\nОтветь кратко.'
): Promise<AIResponse & { nutrition?: ImageAnalysis['nutrition'] }> {
  console.log('Image analysis requested, size:', imageBase64.length);

  try {
    const response = await fetch(AI_PROXY, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageBase64,
        prompt,
      }),
    });

    console.log('Proxy response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Proxy error:', errorData);
      throw new Error(`Анализ фото не удался: ${errorData.error || response.status}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || 'Извините, я не могу проанализировать изображение.';

    const nutrition = extractNutritionFromText(text);

    return { text: cleanResponse(text), nutrition };
  } catch (error) {
    console.error('Image analysis error:', error);
    throw error;
  }
}

// Извлечение КБЖУ из текстового ответа
function extractNutritionFromText(text: string): ImageAnalysis['nutrition'] | undefined {
  const caloriesMatch = text.match(/калори[ия][мй]?\s*[:=]?\s*(\d+)/i);
  const proteinMatch = text.match(/белк[иа][мй]?\s*[:=]?\s*(\d+)/i);
  const fatMatch = text.match(/жир[аы][мй]?\s*[:=]?\s*(\d+)/i);
  const carbsMatch = text.match(/углевод[аы][мй]?\s*[:=]?\s*(\d+)/i);

  if (caloriesMatch || proteinMatch || fatMatch || carbsMatch) {
    return {
      calories: caloriesMatch ? parseInt(caloriesMatch[1]) : 0,
      protein: proteinMatch ? parseInt(proteinMatch[1]) : 0,
      fat: fatMatch ? parseInt(fatMatch[1]) : 0,
      carbs: carbsMatch ? parseInt(carbsMatch[1]) : 0,
    };
  }

  return undefined;
}

// Анализ изображения с контекстом (для разных типов консультантов)
export async function analyzeImageWithContext(
  imageBase64: string,
  context: 'nutrition' | 'fitness' | 'finance' | 'other',
  customPrompt?: string
): Promise<AIResponse> {
  const prompts = {
    nutrition: 'Проанализируй это блюдо. Оцени КБЖУ, качество еды и дай рекомендации по улучшению.',
    fitness: 'Проанализируй это изображение (упражнение, форма, прогресс). Дай рекомендации по технике и улучшению.',
    finance: 'Проанализируй это изображение (чек, документ, график). Извлеки ключевую информацию и дай рекомендации.',
    other: 'Опиши что ты видишь на этом изображении и дай полезные рекомендации.',
  };

  const prompt = customPrompt || prompts[context];

  return analyzeFoodImage(imageBase64, prompt);
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
