// Импорт транзакций из различных источников
// Поддержка: CSV, SMS, скриншотов (OCR)

import Papa from 'papaparse';
import Tesseract from 'tesseract.js';

export interface ImportedTransaction {
  name: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  source?: string;
}

// ============================================
// CSV Импорт (выгрузки из банков)
// ============================================

export interface CSVFormat {
  name: string;
  bank: string;
  description: string;
  hasHeader: boolean;
  delimiter: string;
  encoding?: string;
  // Маппинг колонок (индексы или названия)
  columns: {
    date?: number | string;
    name?: number | string;
    amount?: number | string;
    type?: number | string;
    category?: number | string;
  };
  // Формат даты: 'DD.MM.YYYY', 'YYYY-MM-DD', 'MM/DD/YYYY'
  dateFormat: string;
  // Обработка типа транзакции
  typeMapping?: {
    positive: 'income';
    negative: 'expense';
    // Или строковые значения
    text?: Record<string, 'income' | 'expense'>;
  };
}

// Предустановленные форматы для российских банков
export const bankFormats: Record<string, CSVFormat> = {
  sberbank: {
    name: 'Сбербанк',
    bank: 'Sberbank',
    description: 'Выгрузка из Сбербанк Онлайн',
    hasHeader: true,
    delimiter: ';',
    encoding: 'windows-1251',
    columns: {
      date: 'Дата операции',
      name: 'Описание операции',
      amount: 'Сумма операции',
      type: 'Тип операции',
      category: 'Категория',
    },
    dateFormat: 'DD.MM.YYYY',
    typeMapping: {
      positive: 'income',
      negative: 'expense',
      text: {
        'ПОПОЛНЕНИЕ': 'income',
        'СПИСАНИЕ': 'expense',
        'ПЕРЕВОД': 'income',
        'ОПЛАТА': 'expense',
      },
    },
  },
  tinkoff: {
    name: 'Тинькофф',
    bank: 'Tinkoff',
    description: 'Выгрузка из Тинькофф Банка',
    hasHeader: true,
    delimiter: ';',
    encoding: 'windows-1251',
    columns: {
      date: 'Дата',
      name: 'Описание',
      amount: 'Сумма',
      type: 'Тип',
      category: 'Категория',
    },
    dateFormat: 'DD.MM.YYYY',
    typeMapping: {
      positive: 'income',
      negative: 'expense',
    },
  },
  alfa: {
    name: 'Альфа-Банк',
    bank: 'Alfa-Bank',
    description: 'Выгрузка из Альфа-Банка',
    hasHeader: true,
    delimiter: ';',
    encoding: 'windows-1251',
    columns: {
      date: 'Дата',
      name: 'Место совершения',
      amount: 'Сумма',
      type: 'Дебет/Кредит',
      category: 'Категория',
    },
    dateFormat: 'DD.MM.YYYY',
    typeMapping: {
      positive: 'income',
      negative: 'expense',
      text: {
        'Дебет': 'expense',
        'Кредит': 'income',
      },
    },
  },
  vtb: {
    name: 'ВТБ',
    bank: 'VTB',
    description: 'Выгрузка из ВТБ',
    hasHeader: true,
    delimiter: ';',
    encoding: 'windows-1251',
    columns: {
      date: 'Дата',
      name: 'Название',
      amount: 'Сумма',
      category: 'Категория',
    },
    dateFormat: 'DD.MM.YYYY',
    typeMapping: {
      positive: 'income',
      negative: 'expense',
    },
  },
  generic: {
    name: 'Универсальный',
    bank: 'Generic',
    description: 'Автоматическое определение формата',
    hasHeader: true,
    delimiter: ',',
    columns: {
      date: 0,
      name: 1,
      amount: 2,
      type: 3,
      category: 4,
    },
    dateFormat: 'auto',
    typeMapping: {
      positive: 'income',
      negative: 'expense',
    },
  },
};

// Парсинг CSV файла
export async function parseCSV(
  file: File,
  format: CSVFormat = bankFormats.generic
): Promise<ImportedTransaction[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const csvText = event.target?.result as string;
        
        Papa.parse(csvText, {
          header: format.hasHeader,
          delimiter: format.delimiter,
          skipEmptyLines: true,
          complete: (results: any) => {
            try {
              const transactions = mapCSVToTransactions(results.data, format);
              resolve(transactions);
            } catch (error) {
              reject(error);
            }
          },
          error: (error: any) => reject(error),
        });
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Ошибка чтения файла'));
    reader.readAsText(file, format.encoding || 'utf-8');
  });
}

// Маппинг CSV данных в транзакции
function mapCSVToTransactions(
  data: any[],
  format: CSVFormat
): ImportedTransaction[] {
  const transactions: ImportedTransaction[] = [];
  
  if (data.length === 0) return transactions;
  
  // Определяем, является ли первая строка заголовком
  const hasHeader = format.hasHeader;
  const startIndex = hasHeader ? 1 : 0;
  
  // Если есть заголовки, создаём маппинг по названиям
  const headers = hasHeader ? data[0] : null;
  const getColumnIndex = (colDef: number | string | undefined): number => {
    if (colDef === undefined) return -1;
    if (typeof colDef === 'number') return colDef;
    if (headers) {
      const index = headers.findIndex((h: any) => 
        String(h).toLowerCase().includes(String(colDef).toLowerCase())
      );
      return index !== -1 ? index : -1;
    }
    return -1;
  };
  
  const dateIdx = getColumnIndex(format.columns.date);
  const nameIdx = getColumnIndex(format.columns.name);
  const amountIdx = getColumnIndex(format.columns.amount);
  const typeIdx = getColumnIndex(format.columns.type);
  const categoryIdx = getColumnIndex(format.columns.category);
  
  for (let i = startIndex; i < data.length; i++) {
    const row = data[i];
    if (!row || row.length === 0) continue;
    
    try {
      // Дата
      let date = dateIdx >= 0 ? String(row[dateIdx] || '') : new Date().toISOString().split('T')[0];
      date = parseDate(date, format.dateFormat);
      
      // Название
      const name = nameIdx >= 0 ? String(row[nameIdx] || 'Транзакция') : 'Транзакция';
      
      // Сумма
      let amountStr = amountIdx >= 0 ? String(row[amountIdx] || '0') : '0';
      amountStr = amountStr.replace(/\s/g, '').replace(',', '.');
      const amount = Math.abs(parseFloat(amountStr) || 0);
      
      // Тип транзакции
      let type: 'income' | 'expense' = 'expense';
      if (typeIdx >= 0 && row[typeIdx] !== undefined) {
        const typeValue = String(row[typeIdx]);
        const typeNum = parseFloat(typeValue.replace(/\s/g, '').replace(',', '.'));
        
        if (format.typeMapping?.text) {
          const mappedType = format.typeMapping.text[typeValue.toUpperCase()];
          if (mappedType) type = mappedType;
        }
        
        if (!isNaN(typeNum)) {
          type = typeNum >= 0 
            ? (format.typeMapping?.positive || 'income') 
            : (format.typeMapping?.negative || 'expense');
        }
      } else if (amountIdx >= 0) {
        // Определяем по знаку суммы
        const rawAmount = parseFloat(amountStr);
        type = rawAmount >= 0 
          ? (format.typeMapping?.positive || 'income') 
          : (format.typeMapping?.negative || 'expense');
      }
      
      // Категория
      let category = categoryIdx >= 0 ? String(row[categoryIdx] || '') : '';
      category = categorizeTransaction(name, category);
      
      transactions.push({
        name: cleanTransactionName(name),
        amount,
        type,
        category,
        date,
        source: format.bank,
      });
    } catch (error) {
      console.warn('Ошибка парсинга строки:', row, error);
    }
  }
  
  return transactions;
}

// ============================================
// Парсинг SMS от банков
// ============================================

export interface SMSMessage {
  text: string;
  date?: string;
  sender?: string;
}

// Паттерны для российских банков
const bankSMSPatterns: Record<string, RegExp[]> = {
  sberbank: [
    // Сбербанк: "Карта *1234: +5000.00 RUB. Баланс: 15000.00 RUB. 12.03.24 14:30"
    /Карта\s+\*\d{4}:\s*([+-]?\d[\d\s.,]*)\s*(RUB|₽|руб).*?(\d{2}\.\d{2}\.\d{2})\s+(\d{2}:\d{2})/i,
    /Сбербанк.*?([+-]?\d[\d\s.,]*)\s*(RUB|₽|руб).*?(\d{2}\.\d{2}\.\d{2})/i,
  ],
  tinkoff: [
    // Тинькофф: "Tinkoff: -1500 ₽. Покупка: Магазин Продукты. 12.03.2024"
    /Tinkoff.*?([+-]?\d[\d\s.,]*)\s*(₽|RUB|руб).*?Покупка:\s*(.+?)\.?\s*(\d{2}\.\d{2}\.\d{4})/i,
    /Тинькофф.*?([+-]?\d[\d\s.,]*)\s*(₽|RUB|руб)/i,
  ],
  alfa: [
    // Альфа: "Alfa-Bank: -2500 руб. Оплата: RESTORAN. Баланс: 50000 руб."
    /Alfa-Bank.*?([+-]?\d[\d\s.,]*)\s*(руб|₽|RUB).*?(Оплата|Покупка):\s*(.+?)(?:\.|\s|$)/i,
  ],
  vtb: [
    // ВТБ: "ВТБ: +10000 рублей. Перевод от IVANOV I. 12.03.2024"
    /ВТБ.*?([+-]?\d[\d\s.,]*)\s*(рублей|руб|₽|RUB).*?(\d{2}\.\d{2}\.\d{4})/i,
  ],
};

export function parseSMS(messages: SMSMessage[]): ImportedTransaction[] {
  const transactions: ImportedTransaction[] = [];
  
  for (const msg of messages) {
    const text = msg.text;
    let matched = false;
    
    // Пробуем каждый банк
    for (const [bank, patterns] of Object.entries(bankSMSPatterns)) {
      for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) {
          const amount = Math.abs(parseFloat(match[1].replace(/\s/g, '').replace(',', '.')));
          const isIncome = match[1].startsWith('+') || text.includes('Пополнение') || text.includes('Перевод от');
          const date = match[3] ? parseDate(match[3], 'DD.MM.YY') : new Date().toISOString().split('T')[0];
          
          // Извлекаем название из SMS
          let name = 'Транзакция';
          const nameMatch = text.match(/(Покупка|Оплата|Перевод|Пополнение):\s*(.+?)(?:\.|\s|$)/i);
          if (nameMatch) {
            name = nameMatch[2].trim();
          } else {
            // Пытаемся найти название магазина
            const merchantMatch = text.match(/(?:Магазин|Ресторан|Аптека|АЗС|Такси)[:\s]+(.+?)(?:\.|\s|$)/i);
            if (merchantMatch) {
              name = merchantMatch[1].trim();
            }
          }
          
          transactions.push({
            name,
            amount,
            type: isIncome ? 'income' : 'expense',
            category: categorizeTransaction(name, ''),
            date,
            source: bank,
          });
          
          matched = true;
          break;
        }
      }
      if (matched) break;
    }
    
    // Если не нашли паттерн, пробуем универсальный парсинг
    if (!matched) {
      const universalMatch = text.match(/([+-]?\d[\d\s.,]*)\s*(руб|₽|RUB|рублей)/i);
      if (universalMatch) {
        const amount = Math.abs(parseFloat(universalMatch[1].replace(/\s/g, '').replace(',', '.')));
        const isIncome = text.includes('+') || text.includes('Пополнение') || text.includes('Перевод от');
        
        transactions.push({
          name: extractNameFromSMS(text),
          amount,
          type: isIncome ? 'income' : 'expense',
          category: 'Другое',
          date: new Date().toISOString().split('T')[0],
          source: 'unknown',
        });
      }
    }
  }
  
  return transactions;
}

function extractNameFromSMS(text: string): string {
  // Удаляем технические фразы
  const cleaned = text
    .replace(/(Сбербанк|Тинькофф|Альфа|ВТБ|Tinkoff|Alfa-Bank|Vtb|Карта\s+\*\d{4})/gi, '')
    .replace(/(Баланс|Balance|Остаток):.*$/i, '')
    .replace(/[+-]?\d[\d\s.,]*\s*(руб|₽|RUB|рублей)/gi, '')
    .trim();
  
  return cleaned.substring(0, 50) || 'Транзакция';
}

// ============================================
// OCR для скриншотов
// ============================================

export async function parseScreenshot(
  imageFile: File
): Promise<ImportedTransaction[]> {
  try {
    const result = await Tesseract.recognize(imageFile, 'rus+eng', {
      logger: (m) => console.log('OCR progress:', m),
    });
    
    const text = result.data.text;
    console.log('OCR result:', text);
    
    // Парсим распознанный текст как SMS
    const transactions = parseSMS([{ text }]);
    
    // Если не нашли, пробуем найти числа с валютой
    if (transactions.length === 0) {
      const amountMatches = text.matchAll(/([+-]?\d[\d\s.,]*)\s*(руб|₽|RUB|рублей)/gi);
      for (const match of amountMatches) {
        const amount = Math.abs(parseFloat(match[1].replace(/\s/g, '').replace(',', '.')));
        const isIncome = match[0].includes('+') || text.includes('Пополнение');
        
        transactions.push({
          name: 'Транзакция (скриншот)',
          amount,
          type: isIncome ? 'income' : 'expense',
          category: 'Другое',
          date: new Date().toISOString().split('T')[0],
          source: 'ocr',
        });
      }
    }
    
    return transactions;
  } catch (error) {
    console.error('OCR error:', error);
    throw new Error('Не удалось распознать текст с изображения');
  }
}

// ============================================
// Вспомогательные функции
// ============================================

function parseDate(dateStr: string, format: string): string {
  if (!dateStr) return new Date().toISOString().split('T')[0];
  
  dateStr = dateStr.trim();
  
  // Авто-определение формата
  if (format === 'auto') {
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr; // YYYY-MM-DD
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(dateStr)) {
      // DD.MM.YYYY
      const [d, m, y] = dateStr.split('.');
      return `${y}-${m}-${d}`;
    }
    if (/^\d{2}\.\d{2}\.\d{2}$/.test(dateStr)) {
      // DD.MM.YY
      const [d, m, y] = dateStr.split('.');
      const fullYear = parseInt(y) > 50 ? `19${y}` : `20${y}`;
      return `${fullYear}-${m}-${d}`;
    }
  }
  
  if (format === 'DD.MM.YYYY') {
    const [d, m, y] = dateStr.split('.');
    return `${y}-${m}-${d}`;
  }
  
  if (format === 'DD.MM.YY') {
    const [d, m, y] = dateStr.split('.');
    const fullYear = parseInt(y) > 50 ? `19${y}` : `20${y}`;
    return `${fullYear}-${m}-${d}`;
  }
  
  if (format === 'YYYY-MM-DD') {
    return dateStr;
  }
  
  if (format === 'MM/DD/YYYY') {
    const [m, d, y] = dateStr.split('/');
    return `${y}-${m}-${d}`;
  }
  
  return dateStr;
}

// Автоматическая категоризация по названию
export function categorizeTransaction(name: string, existingCategory: string): string {
  if (existingCategory) {
    // Маппинг русских категорий
    const categoryMap: Record<string, string> = {
      'Продукты': 'Еда',
      'Супермаркеты': 'Еда',
      'Рестораны': 'Еда',
      'Кафе': 'Еда',
      'Фастфуд': 'Еда',
      'Такси': 'Транспорт',
      'АЗС': 'Транспорт',
      'Бензин': 'Транспорт',
      'Метро': 'Транспорт',
      'Автобус': 'Транспорт',
      'Развлечения': 'Развлечения',
      'Кино': 'Развлечения',
      'Театр': 'Развлечения',
      'Концерты': 'Развлечения',
      'Аптека': 'Здоровье',
      'Медицина': 'Здоровье',
      'Врач': 'Здоровье',
      'Спорт': 'Спорт',
      'Фитнес': 'Спорт',
      'Тренажёрный': 'Спорт',
      'Образование': 'Образование',
      'Книги': 'Образование',
      'Курсы': 'Образование',
    };
    
    return categoryMap[existingCategory] || existingCategory;
  }
  
  const lowerName = name.toLowerCase();
  
  // Категоризация по ключевым словам
  const categories: Record<string, string[]> = {
    'Еда': ['продукт', 'супермаркет', 'ресторан', 'кафе', 'пицц', 'суш', 'бургер', 'пирож', 'столов', 'вкусно', 'пятерочк', 'магнит', 'перекрест', 'лент', 'ашан'],
    'Транспорт': ['такси', 'убер', 'яндекс', 'азс', 'бензин', 'топлив', 'метро', 'автобус', 'трамвай', 'электрич', 'билет', 'парковк'],
    'Развлечения': ['кино', 'театр', 'концерт', 'музей', 'парк', 'клуб', 'бар', 'караок', 'боулинг', 'игра', 'подписк', 'netflix', 'spotify'],
    'Здоровье': ['аптек', 'лекарств', 'медицин', 'врач', 'больниц', 'клиник', 'стомат', 'анализ', 'массаж'],
    'Спорт': ['спорт', 'фитнес', 'тренаж', 'бассейн', 'йога', 'кроссовк', 'nike', 'adidas'],
    'Образование': ['книг', 'учеб', 'курс', 'школа', 'университет', 'репетитор', 'язык', 'english'],
    'Дом': ['мебель', 'ремонт', 'хоз', 'быт', 'посуд', 'текстиль'],
    'Одежда': ['одежд', 'обув', 'магазин', 'торговый', 'молл', 'lamoda', 'wildberri', 'ozon'],
    'Связь': ['мобиль', 'интернет', 'связь', 'телеком', 'beeline', 'mts', 'megafon', 'tele2'],
    'Коммуналка': ['квартплат', 'свет', 'вода', 'газ', 'отоплен', 'жкх', 'домофон'],
  };
  
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => lowerName.includes(keyword))) {
      return category;
    }
  }
  
  // Проверка на доход
  if (lowerName.includes('перевод') || lowerName.includes('зарплат') || lowerName.includes('пополнен')) {
    return 'Доход';
  }
  
  return 'Другое';
}

function cleanTransactionName(name: string): string {
  return name
    .replace(/\s+/g, ' ')
    .replace(/[<>]/g, '')
    .trim()
    .substring(0, 100);
}

// Предпросмотр импорта
export interface ImportPreview {
  total: number;
  income: number;
  expenses: number;
  byCategory: Record<string, number>;
  transactions: ImportedTransaction[];
  errors: string[];
}

export function previewImport(transactions: ImportedTransaction[]): ImportPreview {
  const preview: ImportPreview = {
    total: transactions.length,
    income: 0,
    expenses: 0,
    byCategory: {},
    transactions,
    errors: [],
  };
  
  for (const t of transactions) {
    if (t.type === 'income') {
      preview.income += t.amount;
    } else {
      preview.expenses += t.amount;
    }
    
    preview.byCategory[t.category] = (preview.byCategory[t.category] || 0) + t.amount;
  }
  
  return preview;
}
