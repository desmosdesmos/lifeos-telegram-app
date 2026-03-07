// База продуктов с КБЖУ на 100г
export const productsDatabase = [
  // Крупы и злаки
  { id: 1, name: 'Овсянка (сухая)', calories: 366, protein: 12, fat: 6, carbs: 60, category: 'Крупы' },
  { id: 2, name: 'Гречка (сухая)', calories: 343, protein: 13, fat: 3, carbs: 72, category: 'Крупы' },
  { id: 3, name: 'Рис белый (сухой)', calories: 365, protein: 7, fat: 1, carbs: 80, category: 'Крупы' },
  { id: 4, name: 'Рис бурый (сухой)', calories: 337, protein: 7, fat: 3, carbs: 77, category: 'Крупы' },
  { id: 5, name: 'Макароны (сухие)', calories: 350, protein: 12, fat: 2, carbs: 75, category: 'Крупы' },
  { id: 6, name: 'Хлеб цельнозерновой', calories: 250, protein: 8, fat: 4, carbs: 45, category: 'Хлеб' },
  { id: 7, name: 'Хлеб белый', calories: 265, protein: 8, fat: 3, carbs: 50, category: 'Хлеб' },
  
  // Мясо и птица
  { id: 8, name: 'Куриная грудка (сырая)', calories: 113, protein: 23, fat: 2, carbs: 0, category: 'Мясо' },
  { id: 9, name: 'Куриное бедро (сырое)', calories: 177, protein: 18, fat: 11, carbs: 0, category: 'Мясо' },
  { id: 10, name: 'Индейка филе', calories: 115, protein: 24, fat: 2, carbs: 0, category: 'Мясо' },
  { id: 11, name: 'Говядина постная', calories: 158, protein: 22, fat: 7, carbs: 0, category: 'Мясо' },
  { id: 12, name: 'Свинина постная', calories: 190, protein: 20, fat: 11, carbs: 0, category: 'Мясо' },
  { id: 13, name: 'Фарш говяжий', calories: 215, protein: 18, fat: 15, carbs: 0, category: 'Мясо' },
  
  // Рыба и морепродукты
  { id: 14, name: 'Лосось', calories: 208, protein: 20, fat: 13, carbs: 0, category: 'Рыба' },
  { id: 15, name: 'Тунец консервированный', calories: 116, protein: 26, fat: 1, carbs: 0, category: 'Рыба' },
  { id: 16, name: 'Тилапия', calories: 96, protein: 20, fat: 2, carbs: 0, category: 'Рыба' },
  { id: 17, name: 'Креветки', calories: 99, protein: 24, fat: 1, carbs: 0, category: 'Морепродукты' },
  
  // Молочные продукты
  { id: 18, name: 'Творог 5%', calories: 121, protein: 17, fat: 5, carbs: 2, category: 'Молочное' },
  { id: 19, name: 'Творог 9%', calories: 159, protein: 14, fat: 9, carbs: 2, category: 'Молочное' },
  { id: 20, name: 'Творог обезжиренный', calories: 72, protein: 18, fat: 0, carbs: 2, category: 'Молочное' },
  { id: 21, name: 'Молоко 2.5%', calories: 52, protein: 3, fat: 2, carbs: 5, category: 'Молочное' },
  { id: 22, name: 'Кефир 2.5%', calories: 53, protein: 3, fat: 2, carbs: 4, category: 'Молочное' },
  { id: 23, name: 'Йогурт греческий', calories: 59, protein: 10, fat: 0, carbs: 4, category: 'Молочное' },
  { id: 24, name: 'Сыр чеддер', calories: 403, protein: 25, fat: 33, carbs: 1, category: 'Молочное' },
  { id: 25, name: 'Сыр моцарелла', calories: 280, protein: 22, fat: 20, carbs: 2, category: 'Молочное' },
  { id: 26, name: 'Яйцо куриное (1 шт)', calories: 155, protein: 13, fat: 11, carbs: 1, category: 'Молочное', unit: 'шт' },
  
  // Овощи
  { id: 27, name: 'Огурцы', calories: 15, protein: 1, fat: 0, carbs: 3, category: 'Овощи' },
  { id: 28, name: 'Помидоры', calories: 18, protein: 1, fat: 0, carbs: 4, category: 'Овощи' },
  { id: 29, name: 'Брокколи', calories: 34, protein: 3, fat: 0, carbs: 7, category: 'Овощи' },
  { id: 30, name: 'Цветная капуста', calories: 25, protein: 2, fat: 0, carbs: 5, category: 'Овощи' },
  { id: 31, name: 'Морковь', calories: 41, protein: 1, fat: 0, carbs: 10, category: 'Овощи' },
  { id: 32, name: 'Перец болгарский', calories: 27, protein: 1, fat: 0, carbs: 6, category: 'Овощи' },
  { id: 33, name: 'Картофель', calories: 77, protein: 2, fat: 0, carbs: 17, category: 'Овощи' },
  { id: 34, name: 'Лук репчатый', calories: 40, protein: 1, fat: 0, carbs: 9, category: 'Овощи' },
  
  // Фрукты
  { id: 35, name: 'Яблоко', calories: 52, protein: 0, fat: 0, carbs: 14, category: 'Фрукты' },
  { id: 36, name: 'Банан', calories: 89, protein: 1, fat: 0, carbs: 23, category: 'Фрукты' },
  { id: 37, name: 'Апельсин', calories: 47, protein: 1, fat: 0, carbs: 12, category: 'Фрукты' },
  { id: 38, name: 'Грейпфрут', calories: 42, protein: 1, fat: 0, carbs: 11, category: 'Фрукты' },
  { id: 39, name: 'Виноград', calories: 67, protein: 1, fat: 0, carbs: 17, category: 'Фрукты' },
  { id: 40, name: 'Клубника', calories: 32, protein: 1, fat: 0, carbs: 8, category: 'Фрукты' },
  
  // Орехи и семена
  { id: 41, name: 'Миндаль', calories: 579, protein: 21, fat: 50, carbs: 22, category: 'Орехи' },
  { id: 42, name: 'Грецкий орех', calories: 654, protein: 15, fat: 65, carbs: 14, category: 'Орехи' },
  { id: 43, name: 'Арахис', calories: 567, protein: 26, fat: 49, carbs: 16, category: 'Орехи' },
  { id: 44, name: 'Семечки подсолнечника', calories: 584, protein: 21, fat: 51, carbs: 20, category: 'Орехи' },
  
  // Масла
  { id: 45, name: 'Масло оливковое', calories: 884, protein: 0, fat: 100, carbs: 0, category: 'Масла' },
  { id: 46, name: 'Масло подсолнечное', calories: 884, protein: 0, fat: 100, carbs: 0, category: 'Масла' },
  { id: 47, name: 'Масло сливочное', calories: 717, protein: 1, fat: 81, carbs: 1, category: 'Масла' },
  
  // Бобовые
  { id: 48, name: 'Чечевица (сухая)', calories: 353, protein: 25, fat: 1, carbs: 63, category: 'Бобовые' },
  { id: 49, name: 'Нут (сухой)', calories: 364, protein: 19, fat: 6, carbs: 61, category: 'Бобовые' },
  { id: 50, name: 'Фасоль (сухая)', calories: 347, protein: 22, fat: 1, carbs: 63, category: 'Бобовые' },
];

// Категории продуктов
export const productCategories = [
  'Все',
  'Крупы',
  'Мясо',
  'Рыба',
  'Морепродукты',
  'Молочное',
  'Овощи',
  'Фрукты',
  'Орехи',
  'Масла',
  'Бобовые',
  'Хлеб',
];

// Поиск продуктов
export function searchProducts(query: string): typeof productsDatabase {
  const lowerQuery = query.toLowerCase();
  return productsDatabase.filter(p => 
    p.name.toLowerCase().includes(lowerQuery) ||
    p.category.toLowerCase().includes(lowerQuery)
  );
}

// Получение продукта по ID
export function getProductById(id: number): typeof productsDatabase[0] | undefined {
  return productsDatabase.find(p => p.id === id);
}
