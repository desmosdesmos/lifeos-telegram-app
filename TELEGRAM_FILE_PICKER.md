# Настройка Telegram File Picker для iOS

## Проблема
Telegram на iOS блокирует стандартный HTML `<input type="file">` в WebView. Для работы с файлами нужно использовать Telegram WebApp API.

## Решение 1: Telegram WebApp MainButton (автоматически)

Приложение уже настроено на использование Telegram MainButton для iOS устройств.

**Как это работает:**
1. На iOS кнопка меняется на "Через Telegram"
2. При нажатии открывается Telegram MainButton
3. Пользователь выбирает фото через интерфейс Telegram
4. Фото передаётся в приложение

**Требуется:** Telegram WebApp версии 7.0+

## Решение 2: Настройка через @BotFather

### Шаг 1: Открой @BotFather в Telegram

1. Найди бота [@BotFather](https://t.me/BotFather)
2. Отправь `/mybots`
3. Выбери своего бота

### Шаг 2: Включи File Picker

1. Отправь `/setmenubutton`
2. Выбери своего бота
3. Отправь `Open File Picker` или выбери из меню

### Шаг 3: Настрой WebApp

1. Отправь `/setappurl`
2. Выбери своего бота
3. Отправь URL твоего приложения: `https://life-os-seven-khaki.vercel.app`

### Шаг 4: Проверь настройки

1. Отправь `/mybots`
2. Выбери бота
3. Нажми **Bot Settings** → **Menu Button**
4. Убедись, что указано **Open File Picker**

## Решение 3: Альтернативы для iOS

Если File Picker не работает:

### Вариант A: Открыть в Safari
1. Скопируй URL: `https://life-os-seven-khaki.vercel.app`
2. Открой в Safari на iPhone
3. Загрузи фото через Safari (работает без ограничений)

### Вариант B: Использовать Android
На Android Telegram работает без ограничений.

### Вариант C: Desktop версия
Используй Telegram Desktop (Windows/Mac/Linux) — там загрузка фото работает.

## Проверка работы

После настройки:

1. Открой бота в Telegram на iOS
2. Перейди в **Фитнес → Фото прогресса**
3. Нажми **Через Telegram**
4. Должно открыться окно выбора фото

Если всё ещё чёрный экран:
- Проверь версию Telegram (должна быть последней)
- Перезапусти Telegram
- Попробуй открыть в Safari

## Технические детали

**Почему это происходит:**
- iOS WebView блокирует доступ к файловой системе
- Telegram предоставляет свой API для работы с медиа
- `URL.createObjectURL()` используется вместо base64 для экономии памяти

**Код:**
```typescript
// Определяем iOS
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

// Используем Telegram MainButton
if (isIOS && isTelegram) {
  webApp.MainButton.setText('📸 Выбрать фото');
  webApp.MainButton.show();
}
```

## Поддержка

Если проблемы остались:
1. Проверь консоль Safari (Settings → Safari → Advanced → Web Inspector)
2. Посмотри логи в консоли
3. Пришли скриншот ошибки
