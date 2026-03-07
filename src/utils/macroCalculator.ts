export interface MacroTargets {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

interface UserProfile {
  weight: number;
  height: number;
  age: number;
  gender: 'male' | 'female';
  goal: string;
  lifestyle: string;
}

// Расчёт базального метаболизма (Mifflin-St Jeor)
function calculateBMR(profile: UserProfile): number {
  const { weight, height, age, gender } = profile;
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
}

// Коэффициент активности
function getActivityMultiplier(lifestyle: string): number {
  const multipliers: Record<string, number> = {
    'Сидячий': 1.2,
    'Умеренно активный': 1.55,
    'Активный': 1.725,
    'Очень активный': 1.9,
  };
  return multipliers[lifestyle] || 1.55;
}

// Расчёт целевых калорий
function calculateTargetCalories(bmr: number, activityMultiplier: number, goal: string): number {
  const tdee = bmr * activityMultiplier;
  
  switch (goal) {
    case 'Похудение':
      return Math.round(tdee - 500); // Дефицит 500 ккал
    case 'Набор мышечной массы':
      return Math.round(tdee + 300); // Профицит 300 ккал
    case 'Поддержание веса':
      return Math.round(tdee);
    case 'Улучшение здоровья':
      return Math.round(tdee);
    case 'Повышение продуктивности':
      return Math.round(tdee);
    case 'Выносливость':
      return Math.round(tdee + 200);
    default:
      return Math.round(tdee);
  }
}

// Расчёт БЖУ на основе цели
export function calculateMacroTargets(profile: UserProfile): MacroTargets {
  const bmr = calculateBMR(profile);
  const activityMultiplier = getActivityMultiplier(profile.lifestyle);
  const calories = calculateTargetCalories(bmr, activityMultiplier, profile.goal);
  
  let proteinPerKg: number;
  let fatPerKg: number;
  
  // Расчёт макронутриентов на основе цели
  switch (profile.goal) {
    case 'Набор мышечной массы':
      proteinPerKg = 1.8;
      fatPerKg = 1.0;
      break;
    case 'Похудение':
      proteinPerKg = 2.0;
      fatPerKg = 0.9;
      break;
    case 'Поддержание веса':
      proteinPerKg = 1.6;
      fatPerKg = 1.0;
      break;
    default:
      proteinPerKg = 1.5;
      fatPerKg = 1.0;
  }
  
  const { weight } = profile;
  
  // Расчёт в граммах
  let protein = Math.round(weight * proteinPerKg);
  let fat = Math.round(weight * fatPerKg);
  
  // Углеводы рассчитываем из оставшихся калорий
  const proteinCalories = protein * 4;
  const fatCalories = fat * 9;
  const remainingCalories = calories - proteinCalories - fatCalories;
  let carbs = Math.round(remainingCalories / 4);
  
  // Корректировка если углеводы слишком низкие или высокие
  if (carbs < weight * 2) {
    carbs = Math.round(weight * 2);
  }
  
  return {
    calories,
    protein,
    fat,
    carbs,
  };
}

// Рекомендации по БЖУ
export function getMacroRecommendations(profile: UserProfile): string[] {
  const targets = calculateMacroTargets(profile);
  const recommendations: string[] = [];
  
  switch (profile.goal) {
    case 'Набор мышечной массы':
      recommendations.push(
        `🎯 Для набора массы вам нужно ${targets.calories} ккал в день`,
        `💪 Белок: ${targets.protein}г (${(targets.protein * 4 / targets.calories * 100).toFixed(0)}% калорий)`,
        `🥑 Жиры: ${targets.fat}г (${(targets.fat * 9 / targets.calories * 100).toFixed(0)}% калорий)`,
        `🍚 Углеводы: ${targets.carbs}г (${(targets.carbs * 4 / targets.calories * 100).toFixed(0)}% калорий)`,
        '',
        '📌 Советы для набора:',
        '• Создайте профицит калорий (+300 ккал от нормы)',
        '• Потребляйте 1.6-2.2г белка на кг веса',
        '• Не забывайте про углеводы — это энергия для тренировок',
        '• Ешьте больше сложных углеводов (крупы, макароны)'
      );
      break;
      
    case 'Похудение':
      recommendations.push(
        `🎯 Для похудения вам нужно ${targets.calories} ккал в день`,
        `💪 Белок: ${targets.protein}г (${(targets.protein * 4 / targets.calories * 100).toFixed(0)}% калорий)`,
        `🥑 Жиры: ${targets.fat}г (${(targets.fat * 9 / targets.calories * 100).toFixed(0)}% калорий)`,
        `🍚 Углеводы: ${targets.carbs}г (${(targets.carbs * 4 / targets.calories * 100).toFixed(0)}% калорий)`,
        '',
        '📌 Советы для похудения:',
        '• Создайте дефицит калорий (-500 ккал от нормы)',
        '• Высокий белок поможет сохранить мышцы',
        '• Уменьшите простые углеводы (сахар, мучное)',
        '• Пейте больше воды (30-40мл на кг веса)'
      );
      break;
      
    default:
      recommendations.push(
        `🎯 Ваша норма: ${targets.calories} ккал в день`,
        `💪 Белок: ${targets.protein}г`,
        `🥑 Жиры: ${targets.fat}г`,
        `🍚 Углеводы: ${targets.carbs}г`,
        '',
        '📌 Общие рекомендации:',
        '• Поддерживайте баланс макронутриентов',
        '• Ешьте больше овощей и фруктов',
        '• Пейте достаточно воды',
        '• Следите за качеством сна'
      );
  }
  
  return recommendations;
}

// Гайд по подсчёту БЖУ
export const bjuGuide = `
🤔 Как правильно считать БЖУ (белки/жиры/углеводы) в своем рационе?

Чтобы посчитать БЖУ за день, нужно соблюдать несколько простых правил:

1️⃣ Взвешивай еду ДО приготовления
Взвешивай продукты на кухонных весах в том виде, в котором они были в упаковке: например, рис в сухом виде или курицу в сыром. Это важно, потому что во время готовки продукты изменяют массу, и если не учитывать это, ты получишь ошибочные данные.

2️⃣ Используй калькулятор калорий
Самый популярный калькулятор – FatSecret. Внеси вручную данные о каждом продукте, а не полагайся на шаблоны, так как они могут содержать ошибки.

3️⃣ Записывай все ингредиенты
Не забывай учитывать масла, соусы и добавки – их калорийность тоже важна!

4️⃣ Не пугайся, если сначала это будет занимать много времени
Через пару недель у тебя это займет не больше 5 минут в день. Привыкаешь, и все идет по накатанной.

5️⃣ Заполни 7 дней рациона
Это нужно для того, чтобы проанализировать свой рацион и увидеть среднее значение по БЖУ. Обрати внимание на дни с провалами по макроэлементам и старайся избегать их в будущем.

🤔 Зачем это нужно?

Если ты хочешь качественно набирать – тебе нужен небольшой профицит калорий, а для сушки – дефицит. Без точного подсчета ты рискуешь либо слишком много есть, либо не добирать нужные калории, что затруднит твои цели. Интуитивное питание вряд ли даст тебе нужные результаты, так что лучше рассчитывать БЖУ!

💡 На какие цифры ориентироваться для набора массы?

Каждый организм индивидуален, но вот несколько общих рекомендаций:

• Белки (Б): минимум 1.5-2 г на кг веса (для женщин — 1-1.2 г).
• Жиры (Ж): 0.8-1 г на кг веса (для женщин — 1-1.5 г).
• Углеводы (У): не менее 5 г на кг веса. Это основное топливо для твоей массы!

Важно: всегда отсчитывай БЖУ от своего текущего веса. Например, если ты весишь 85 кг, а считаешь, как будто ты весишь 80 кг, то результат будет неверным.
`;
