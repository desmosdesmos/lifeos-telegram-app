# 🎉 LifeOS – Готово!

## ✅ Все системы развёрнуты

### 🌐 Web App
**URL:** https://life-os-seven-khaki.vercel.app

### 📦 GitHub репозиторий
**URL:** https://github.com/desmosdesmos/lifeos-telegram-app

### 🤖 Telegram Bot
**Bot ID:** 8771751252

---

## 📋 Следующие шаги

### 1. Настройка бота в @BotFather

Откройте @BotFather и выполните:

```
/newapp
```

Затем:
- Выберите бота: `8771751252:AAF19pl3mtDEqyy-Srg74qwiSJndh_CWB10`
- Название: `LifeOS`
- Описание: `AI Life Engineering System`
- **Web App URL:** `https://life-os-seven-khaki.vercel.app`
- Короткое название: `LifeOS`

### 2. Настройка Menu Button

```
/mybots → Ваш бот → Bot Settings → Menu Button → Configure Menu Button
```

- URL: `https://life-os-seven-khaki.vercel.app`
- Название: `Открыть LifeOS`

---

## 📱 Структура приложения

```
src/
├── pages/
│   ├── Dashboard.tsx      # Главная с Life Score
│   ├── Nutrition.tsx      # Питание и макросы
│   ├── Sleep.tsx          # Сон и восстановление
│   ├── AIAnalysis.tsx     # AI анализ
│   ├── AIChat.tsx         # AI чат
│   └── Profile.tsx        # Профиль
├── components/
│   ├── Layout.tsx
│   ├── LifeScoreCard.tsx
│   ├── SystemCard.tsx
│   ├── AIInsightCard.tsx
│   └── BottomNavigation.tsx
├── hooks/
│   └── useTelegramWebApp.ts
└── styles/
    ├── tailwind.css
    └── theme.css
```

---

## 🔧 Команды

```bash
npm run dev      # Запуск dev-сервера
npm run build    # Сборка для продакшена
npm run preview  # Предпросмотр сборки
```

---

## 🎨 Дизайн

- **Dark mode** с glassmorphism эффектами
- **Цветовая палитра:**
  - Background: `#0B0B0F`
  - Blue: `#4DA3FF`
  - Green: `#22C55E`
  - Orange: `#F59E0B`

---

## 📊 Life Score Dashboard

Главный экран показывает:
- Общий Life Score (74/100)
- 5 сфер жизни: Nutrition, Sleep, Fitness, Finances, Goals
- Прогресс и тренды по каждой сфере
- Quick Actions для быстрых действий

---

**Создано:** 7 марта 2026
**Стек:** React + TypeScript + Tailwind CSS + Motion + Telegram WebApp
