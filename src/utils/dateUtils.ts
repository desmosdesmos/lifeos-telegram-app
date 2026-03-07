// Утилиты для работы с датами и группировки по месяцам

export const MONTHS = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

// Получить список месяцев из данных
export function getAvailableMonths<T extends { date: string }>(items: T[]): string[] {
  const months = new Set<string>();
  items.forEach(item => {
    const date = new Date(item.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    months.add(monthKey);
  });
  return Array.from(months).sort().reverse();
}

// Фильтровать данные по месяцу
export function filterByMonth<T extends { date: string }>(items: T[], monthKey: string): T[] {
  return items.filter(item => {
    const date = new Date(item.date);
    const itemMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    return itemMonth === monthKey;
  });
}

// Получить отображение месяца
export function getMonthDisplay(monthKey: string): string {
  const [year, month] = monthKey.split('-');
  const monthIndex = parseInt(month, 10) - 1;
  return `${MONTHS[monthIndex]} ${year}`;
}

// Получить текущий месяц в формате YYYY-MM
export function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

// Группировать данные по месяцам
export function groupByMonth<T extends { date: string }>(items: T[]): Record<string, T[]> {
  const grouped: Record<string, T[]> = {};
  items.forEach(item => {
    const date = new Date(item.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!grouped[monthKey]) {
      grouped[monthKey] = [];
    }
    grouped[monthKey].push(item);
  });
  return grouped;
}
