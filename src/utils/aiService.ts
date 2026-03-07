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
      const totalCalories = userData.meals?.reduce((sum: number, m: any) => sum + m.calories, 0) || 0;
      const totalProtein = userData.meals?.reduce((sum: number, m: any) => sum + m.protein, 0) || 0;
      const totalFat = userData.meals?.reduce((sum: number, m: any) => sum + m.fat, 0) || 0;
      const totalCarbs = userData.meals?.reduce((sum: number, m: any) => sum + m.carbs, 0) || 0;
      const mealsCount = userData.meals?.length || 0;
      
      // Последние приёмы пищи
      const recentMeals = userData.meals?.slice(-5).map((m: any) => 
        `• ${m.name}: ${m.calories} ккал (Б:${m.protein}г Ж:${m.fat}г У:${m.carbs}г) ${m.time}`
      ).join('\n') || 'Нет записей';
      
      userDataContext = `
📊 ДАННЫЕ ПИТАНИЯ:
Профиль: ${userData.profile?.name || 'Пользователь'}, ${userData.profile?.age || '?'} лет, вес ${userData.profile?.weight || '?'} кг, рост ${userData.profile?.height || '?'} см
Цель: ${userData.profile?.goal || 'Не указана'}
Образ жизни: ${userData.profile?.lifestyle || 'Не указан'}

📈 ИТОГИ ЗА СЕГОДНЯ:
• Калории: ${totalCalories} ккал
• Белки: ${totalProtein}г (${Math.round(totalProtein * 4 / Math.max(totalCalories, 1) * 100)}% от калорий)
• Жиры: ${totalFat}г (${Math.round(totalFat * 9 / Math.max(totalCalories, 1) * 100)}% от калорий)
• Углеводы: ${totalCarbs}г (${Math.round(totalCarbs * 4 / Math.max(totalCalories, 1) * 100)}% от калорий)
• Приёмов пищи: ${mealsCount}

🍽 ПОСЛЕДНИЕ ПРИЁМЫ ПИЩИ:
${recentMeals}

⚠️ ПРОБЛЕМЫ:
${totalCalories < 1200 && totalCalories > 0 ? '• Критически мало калорий (<1200)' : ''}
${totalProtein < 60 && mealsCount > 0 ? '• Недостаток белка' : ''}
${totalFat < 30 && mealsCount > 0 ? '• Недостаток жиров' : ''}
${totalCarbs < 100 && mealsCount > 0 ? '• Недостаток углеводов' : ''}
${mealsCount < 3 && mealsCount > 0 ? '• Слишком мало приёмов пищи' : ''}
${mealsCount === 0 ? '• Нет данных о питании' : ''}
`;
    } else if (context.type === 'sleep') {
      const avgQuality = userData.sleepDays?.length > 0 
        ? Math.round(userData.sleepDays.reduce((sum: number, d: any) => sum + d.quality, 0) / userData.sleepDays.length)
        : 0;
      const totalDays = userData.sleepDays?.length || 0;
      
      // Детали последнего сна
      const lastSleep = userData.sleepDays?.[userData.sleepDays.length - 1];
      
      // Сон за последние 7 дней
      const last7Days = userData.sleepDays?.slice(-7).map((d: any) => 
        `• ${d.date}: ${d.duration}, качество ${d.quality}%, глубокий ${d.deepSleep}, REM ${d.remSleep}`
      ).join('\n') || 'Нет записей';
      
      userDataContext = `
😴 ДАННЫЕ СНА:
Профиль: ${userData.profile?.name || 'Пользователь'}, ${userData.profile?.age || '?'} лет

📈 ОБЩАЯ СТАТИСТИКА:
• Дней записей: ${totalDays}
• Среднее качество: ${avgQuality}%
• Оценка: ${avgQuality >= 80 ? 'Отлично' : avgQuality >= 60 ? 'Нормально' : 'Плохо'}

🌙 ПОСЛЕДНИЙ СОН:
${lastSleep ? `• Дата: ${lastSleep.date}
• Отбой: ${lastSleep.bedtime}
• Подъём: ${lastSleep.wakeTime}
• Продолжительность: ${lastSleep.duration}
• Качество: ${lastSleep.quality}%
• Глубокий сон: ${lastSleep.deepSleep}
• REM сон: ${lastSleep.remSleep}
• Лёгкий сон: ${lastSleep.lightSleep}` : 'Нет данных'}

📊 СОН ЗА ПОСЛЕДНИЕ 7 ДНЕЙ:
${last7Days}

⚠️ ПРОБЛЕМЫ:
${totalDays === 0 ? '• Нет данных о сне' : ''}
${avgQuality < 60 && avgQuality > 0 ? '• Критически низкое качество сна (<60%)' : ''}
${avgQuality >= 60 && avgQuality < 80 ? '• Качество сна ниже оптимального' : ''}
${lastSleep && parseInt(lastSleep.duration) < 7 ? '• Недостаточная продолжительность (<7ч)' : ''}
${lastSleep && parseInt(lastSleep.duration) > 9 ? '• Избыточная продолжительность (>9ч)' : ''}
`;
    } else if (context.type === 'fitness') {
      const completedWorkouts = userData.workouts?.filter((w: any) => w.completed) || [];
      const plannedWorkouts = userData.workouts?.filter((w: any) => !w.completed) || [];
      const totalCaloriesBurned = completedWorkouts.reduce((sum: number, w: any) => sum + w.calories, 0);
      const totalDuration = completedWorkouts.reduce((sum: number, w: any) => sum + w.duration, 0);
      
      // Последние тренировки
      const recentWorkouts = completedWorkouts.slice(-5).map((w: any) => 
        `• ${w.name} (${w.date}): ${w.duration} мин, ${w.calories} ккал, ${w.exercises} упр.`
      ).join('\n') || 'Нет тренировок';
      
      userDataContext = `
💪 ДАННЫЕ ФИТНЕСА:
Профиль: ${userData.profile?.name || 'Пользователь'}, цель: ${userData.profile?.goal || 'Не указана'}

📈 ОБЩАЯ СТАТИСТИКА:
• Выполнено тренировок: ${completedWorkouts.length}
• Запланировано: ${plannedWorkouts.length}
• Всего сожжено: ${totalCaloriesBurned} ккал
• Общая длительность: ${totalDuration} мин (${Math.round(totalDuration / 60)}ч ${totalDuration % 60}мин)
• Среднее за тренировку: ${completedWorkouts.length > 0 ? Math.round(totalCaloriesBurned / completedWorkouts.length) : 0} ккал

🏋️ ПОСЛЕДНИЕ ТРЕНИРОВКИ:
${recentWorkouts}

📅 ПЛАНЫ:
${plannedWorkouts.length > 0 ? plannedWorkouts.map((w: any) => `• ${w.name}: ${w.duration} мин, ~${w.calories} ккал`).join('\n') : 'Нет запланированных'}

⚠️ ПРОБЛЕМЫ:
${completedWorkouts.length === 0 ? '• Нет выполненных тренировок' : ''}
${completedWorkouts.length < 2 ? '• Мало активности (<2 в неделю)' : ''}
${completedWorkouts.length >= 5 ? '• Отличная активность!' : ''}
`;
    } else if (context.type === 'finance') {
      const income = userData.transactions?.filter((t: any) => t.type === 'income') || [];
      const expenses = userData.transactions?.filter((t: any) => t.type === 'expense') || [];
      const totalIncome = income.reduce((sum: number, t: any) => sum + t.amount, 0);
      const totalExpenses = expenses.reduce((sum: number, t: any) => sum + t.amount, 0);
      const savings = totalIncome - totalExpenses;
      const savingsRate = totalIncome > 0 ? Math.round((savings / totalIncome) * 100) : 0;
      
      // Расходы по категориям
      const expensesByCategory: Record<string, number> = {};
      expenses.forEach((t: any) => {
        expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
      });
      const topCategories = Object.entries(expensesByCategory)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([cat, amount]) => `• ${cat}: ${amount.toLocaleString()}₽`)
        .join('\n') || 'Нет данных';
      
      // Последние операции
      const recentTransactions = userData.transactions?.slice(-10).reverse().map((t: any) => 
        `• ${t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}₽ — ${t.name} (${t.category}, ${t.date})`
      ).join('\n') || 'Нет операций';
      
      userDataContext = `
💰 ФИНАНСОВЫЕ ДАННЫЕ:

📈 ОБЩАЯ СТАТИСТИКА:
• Доходы: ${totalIncome.toLocaleString()}₽
• Расходы: ${totalExpenses.toLocaleString()}₽
• Баланс: ${savings >= 0 ? '+' : ''}${savings.toLocaleString()}₽
• Процент накоплений: ${savingsRate}%
• Операций всего: ${userData.transactions?.length || 0}

📊 ТОП РАСХОДОВ ПО КАТЕГОРИЯМ:
${topCategories}

📋 ПОСЛЕДНИЕ ОПЕРАЦИИ:
${recentTransactions}

⚠️ ПРОБЛЕМЫ:
${userData.transactions?.length === 0 ? '• Нет финансовых записей' : ''}
${savings < 0 ? '• Расходы превышают доходы!' : ''}
${savingsRate < 10 && savingsRate >= 0 ? '• Мало откладываете (<10%)' : ''}
${savingsRate >= 10 && savingsRate < 20 ? '• Нормально, но можно лучше (10-20%)' : ''}
${savingsRate >= 20 ? '• Отличные накопления! (20%+)' : ''}
`;
    } else if (context.type === 'goals') {
      const activeGoals = userData.goals?.filter((g: any) => !g.completed) || [];
      const completedGoals = userData.goals?.filter((g: any) => g.completed) || [];
      
      // Прогресс по активным целям
      const goalsProgress = activeGoals.map((g: any) => {
        const percentage = g.target > 0 ? Math.round((g.progress / g.target) * 100) : 0;
        return `• ${g.title}: ${g.progress}/${g.target} ${g.unit} (${percentage}%)
  Дедлайн: ${g.deadline || 'Не указан'}
  ${g.description || ''}`;
      }).join('\n\n') || 'Нет активных целей';
      
      // Выполненные цели
      const completedList = completedGoals.map((g: any) => 
        `• ${g.title} ✓`
      ).join('\n') || 'Нет выполненных';
      
      userDataContext = `
🎯 ЦЕЛИ:

📈 ОБЩАЯ СТАТИСТИКА:
• Активных целей: ${activeGoals.length}
• Выполнено: ${completedGoals.length}
• Процент выполнения: ${userData.goals?.length > 0 ? Math.round((completedGoals.length / userData.goals.length) * 100) : 0}%

🎯 АКТИВНЫЕ ЦЕЛИ:
${goalsProgress}

✅ ВЫПОЛНЕННЫЕ ЦЕЛИ:
${completedList}

⚠️ ПРОБЛЕМЫ:
${userData.goals?.length === 0 ? '• Нет поставленных целей' : ''}
${activeGoals.length > 5 ? '• Слишком много целей (>5)' : ''}
${activeGoals.length === 0 && completedGoals.length === 0 ? '• Нет движения к целям' : ''}
${activeGoals.some((g: any) => g.progress === 0) ? '• Есть цели без прогресса' : ''}
`;
    } else if (context.type === 'analysis') {
      // Полный анализ всех сфер
      const nutritionScore = Math.min(100, (userData.meals?.length || 0) * 20);
      const sleepScore = userData.sleepDays?.length > 0 
        ? Math.round(userData.sleepDays.reduce((sum: number, d: any) => sum + d.quality, 0) / userData.sleepDays.length)
        : 0;
      const fitnessScore = Math.min(100, (userData.workouts?.filter((w: any) => w.completed).length || 0) * 20);
      
      const totalIncome = userData.transactions?.filter((t: any) => t.type === 'income').reduce((sum: number, t: any) => sum + t.amount, 0) || 0;
      const totalExpenses = userData.transactions?.filter((t: any) => t.type === 'expense').reduce((sum: number, t: any) => sum + t.amount, 0) || 0;
      const financeScore = totalIncome > 0 ? Math.min(100, Math.round(((totalIncome - totalExpenses) / totalIncome) * 100 * 1.5)) : 0;
      
      const goalsScore = userData.goals?.length > 0 
        ? Math.round((userData.goals.filter((g: any) => g.completed).length / userData.goals.length) * 100)
        : 0;
      
      userDataContext = `
📊 ПОЛНЫЙ АНАЛИЗ ЖИЗНИ:

🍽 ПИТАНИЕ: ${nutritionScore}/100
• Приёмов пищи: ${userData.meals?.length || 0}
${nutritionScore < 40 ? '• Критически мало данных' : ''}
${nutritionScore >= 40 && nutritionScore < 70 ? '• Нужно больше записей' : ''}
${nutritionScore >= 70 ? '• Хороший учёт питания' : ''}

😴 СОН: ${sleepScore}/100
• Дней записей: ${userData.sleepDays?.length || 0}
${sleepScore === 0 ? '• Нет данных о сне' : ''}
${sleepScore > 0 && sleepScore < 60 ? '• Плохое качество сна' : ''}
${sleepScore >= 60 && sleepScore < 80 ? '• Среднее качество' : ''}
${sleepScore >= 80 ? '• Отличное качество сна' : ''}

💪 ФИТНЕС: ${fitnessScore}/100
• Тренировок выполнено: ${userData.workouts?.filter((w: any) => w.completed).length || 0}
${fitnessScore === 0 ? '• Нет тренировок' : ''}
${fitnessScore > 0 && fitnessScore < 40 ? '• Мало активности' : ''}
${fitnessScore >= 40 && fitnessScore < 70 ? '• Средняя активность' : ''}
${fitnessScore >= 70 ? '• Отличная активность' : ''}

💰 ФИНАНСЫ: ${financeScore}/100
• Доходы: ${totalIncome.toLocaleString()}₽
• Расходы: ${totalExpenses.toLocaleString()}₽
${financeScore < 50 ? '• Расходы близки к доходам' : ''}
${financeScore >= 50 && financeScore < 70 ? '• Нормальные накопления' : ''}
${financeScore >= 70 ? '• Отличные накопления' : ''}

🎯 ЦЕЛИ: ${goalsScore}/100
• Активных: ${userData.goals?.filter((g: any) => !g.completed).length || 0}
• Выполнено: ${userData.goals?.filter((g: any) => g.completed).length || 0}
${goalsScore === 0 ? '• Нет целей или прогресса' : ''}
${goalsScore > 0 && goalsScore < 50 ? '• Движение медленное' : ''}
${goalsScore >= 50 ? '• Хороший прогресс' : ''}

🔴 ГЛАВНЫЕ ПРОБЛЕМЫ:
${nutritionScore < 40 ? '1. Питание — критически мало данных\n' : ''}
${sleepScore < 60 && sleepScore > 0 ? '2. Сон — низкое качество\n' : ''}
${fitnessScore < 40 ? '3. Фитнес — мало активности\n' : ''}
${financeScore < 50 ? '4. Финансы — мало откладываете\n' : ''}
${goalsScore === 0 ? '5. Цели — нет движения\n' : ''}
`;
    }
  }
  
  return `${userDataContext}

ВОПРОС ПОЛЬЗОВАТЕЛЯ: ${message}

ОТВЕТ (2-4 предложения, конкретно, с цифрами):`;
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
