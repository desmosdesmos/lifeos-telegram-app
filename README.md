# LifeOS – AI Life Engineering System

Telegram Mini App для анализа и улучшения различных сфер жизни с помощью AI.

## 🚀 Запуск

```bash
# Установка зависимостей
npm install

# Запуск dev-сервера
npm run dev

# Сборка для продакшена
npm run build

# Предпросмотр сборки
npm run preview
```

## 📱 Структура проекта

```
src/
├── components/          # Reusable компоненты
│   ├── Layout.tsx       # Основной layout с навигацией
│   ├── LifeScoreCard.tsx
│   ├── SystemCard.tsx
│   ├── AIInsightCard.tsx
│   └── BottomNavigation.tsx
├── pages/               # Страницы приложения
│   ├── Dashboard.tsx    # Главная – Life Control Dashboard
│   ├── Nutrition.tsx    # Питание и макросы
│   ├── Sleep.tsx        # Сон и восстановление
│   ├── AIAnalysis.tsx   # AI анализ проблем
│   ├── AIChat.tsx       # AI чат-помощник
│   └── Profile.tsx      # Профиль пользователя
├── hooks/               # Custom React хуки
│   └── useTelegramWebApp.ts
├── utils/               # Утилиты
│   └── cn.ts
├── styles/              # Стили
│   ├── tailwind.css
│   └── theme.css
├── router.tsx           # Настройка роутинга
├── App.tsx
└── main.tsx
```

## 🎨 Дизайн-система

### Цвета
- **Background**: `#0B0B0F`
- **Blue Accent**: `#4DA3FF`
- **Green Accent**: `#22C55E`
- **Orange Accent**: `#F59E0B`

### Эффекты
- **Glassmorphism**: полупрозрачные карточки с blur
- **Анимации**: motion/react для плавных переходов

## 📄 Страницы

### 1. Dashboard
Главный экран с Life Score (общий баланс жизни) и карточками сфер. Использует централизованную логику расчета индекса здоровья.

### 2. Nutrition
- Добавление приёма пищи
- Сканирование еды
- Прогресс по макросам (белки, жиры, углеводы)

### 3. Sleep
- Время отхода ко сну и пробуждения
- Общая продолжительность сна
- Sleep Score
- AI рекомендации

### 4. Leaderboard (Рейтинг)
- Реальный топ-100 пользователей
- Синхронизация через Firebase Cloud
- Возможность участвовать в топе или оставаться анонимным

### 5. AI Analysis
- Energy Score
- Recovery Level
- Stress Level
- Обнаруженные проблемы
- Рекомендации

### 6. Profile
- Управление личными данными
- Настройка целей и образа жизни
- Синхронизация аккаунта (Google / Email)

## 🔐 Авторизация и Облако

Приложение поддерживает два режима:
1.  **Cloud Mode**: Синхронизация через Google или Email/Пароль. Ваши данные (Life Score, настройки, история) доступны на любом устройстве.
2.  **Local Mode**: Работа без аккаунта. Данные хранятся только в памяти браузера.

## 🛠 Технологии

- **React 19** с TypeScript
- **Firebase** (Auth & Firestore) – облачная база и авторизация
- **Capacitor 6** – нативная оболочка для Android
- **Vite** – сборщик
- **Tailwind CSS 4** – стилизация
- **React Router** – навигация
- **Motion** – анимации
- **Lucide React** – иконки

## 📱 Сборка Android APK

Для быстрой синхронизации изменений и сборки используйте:
👉 **`SYNC_ANDROID.bat`** (в папке `LIFE OS`)

Этот скрипт автоматически:
1. Собирает веб-версию
2. Синхронизирует ресурсы с Android Studio
3. Готовит проект к запуску.


## 📦 Сборка

После сборки файлы находятся в папке `dist/`. Для развёртывания в Telegram:

1. Задеплойте `dist/` на хостинг (Vercel, Netlify, GitHub Pages)
2. В @BotFather создайте бота и привяжите Web App к ссылке
3. Готово! 🎉
