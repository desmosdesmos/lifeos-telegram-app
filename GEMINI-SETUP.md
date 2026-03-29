# Настройка Google Gemini AI API

## Что изменилось

Раньше использовался **GigaChat (Сбер)**, который работал только из РФ.  
Теперь используется **Google Gemini API** — работает глобально, включая РФ.

## Преимущества Gemini

✅ **Работает из России** — без VPN и ограничений  
✅ **Текст + Анализ фото** — мультимодальная модель  
✅ **Бесплатный тариф** — 15 запросов/минуту (Gemini 2.0 Flash)  
✅ **Высокое качество** — одна из лучших моделей 2026 года  

## Получение API ключа

### Шаг 1: Перейдите на Google AI Studio
https://aistudio.google.com/apikey

### Шаг 2: Войдите через Google аккаунт
Любой Google аккаунт подходит (включая российский)

### Шаг 3: Создайте API ключ
1. Нажмите **"Create API Key"**
2. Скопируйте ключ (начинается с `AIza...`)
3. Сохраните в безопасном месте

### Шаг 4: Проверьте квоты
- **Gemini 2.0 Flash**: 15 запросов/минуту бесплатно
- **Gemini 2.0 Pro**: 2 запроса/минуту бесплатно
- Лимиты: https://aistudio.google.com/app/apikey

## Настройка на Vercel

### Шаг 1: Зайдите в проект на Vercel
1. https://vercel.com/dashboard
2. Выберите проект "LIFE OS"

### Шаг 2: Добавьте Environment Variable
1. **Settings** → **Environment Variables**
2. Добавьте переменную:

   **GEMINI_API_KEY**
   - Value: `AIzaSyDfbZui6D1AoO13yRZwi5uvA03NB62LC8U`
   - Environments: ✅ Production, ✅ Preview, ✅ Development

### Шаг 3: Задеплойте
1. **Deployments** → **Redeploy**
2. Дождитесь завершения

## Локальная разработка

### Шаг 1: Создайте `.env`
```bash
cp .env.example .env
```

### Шаг 2: Добавьте ключ
```env
GEMINI_API_KEY=AIzaSyDfbZui6D1AoO13yRZwi5uvA03NB62LC8U
```

### Шаг 3: Запустите
```bash
npm install
npm run dev
```

## Структура API

```
┌─────────────────────────────────────────────────────┐
│  Фронтенд (React)                                   │
│  src/utils/aiService.ts                             │
│  AI_PROXY = '/api/chat'                             │
└──────────────────┬──────────────────────────────────┘
                   │ POST /api/chat
                   ▼
┌─────────────────────────────────────────────────────┐
│  Vercel Serverless Function                         │
│  api/chat.ts                                        │
│  - Gemini API авторизация                           │
│  - Запрос к Gemini API                              │
└──────────────────┬──────────────────────────────────┘
                   │ HTTPS
                   ▼
┌─────────────────────────────────────────────────────┐
│  Google Gemini API                                  │
│  generativelanguage.googleapis.com                  │
│  - gemini-2.0-flash (текст + изображения)           │
└─────────────────────────────────────────────────────┘
```

## Доступные модели

| Модель | Скорость | Качество | Бесплатно |
|--------|----------|----------|-----------|
| `gemini-2.0-flash` | ⚡⚡⚡ | Хорошее | ✅ 15/min |
| `gemini-2.0-pro` | ⚡⚡ | Отличное | ✅ 2/min |
| `gemini-2.0-flash-lite` | ⚡⚡⚡⚡ | Базовое | ✅ 60/min |

## Бесплатные лимиты (2026)

| Модель | RPM | TPM | FPM |
|--------|-----|-----|-----|
| Gemini 2.0 Flash | 15 | 32,000 | 1,000,000 |
| Gemini 2.0 Pro | 2 | 4,000 | 50,000 |
| Gemini 2.0 Flash-Lite | 60 | 128,000 | 4,000,000 |

**RPM** = запросов/минуту | **TPM** = токенов/минуту | **FPM** = токенов/день

## Troubleshooting

### Ошибка "Gemini API key not configured"
- Проверьте переменную `GEMINI_API_KEY` в Vercel
- Убедитесь, что имя точное
- Сделайте Redeploy

### Ошибка "API key not valid"
- Проверьте ключ на https://aistudio.google.com/apikey
- Убедитесь, что ключ не отозван
- Проверьте, нет ли лишних пробелов

### Ошибка "Quota exceeded"
- Проверьте лимиты на https://aistudio.google.com/app/apikey
- Подождите минуту (лимиты сбрасываются)
- Или используйте более медленную модель

### Ошибка "Cannot connect to Gemini API"
- Проверьте интернет
- Google API может быть временно недоступен
- Проверьте логи Vercel: Dashboard → Functions → /api/chat

## Стоимость

**Бесплатный тариф:**
- Gemini 2.0 Flash: 15 запросов/мин бесплатно
- Gemini 2.0 Pro: 2 запроса/мин бесплатно

**Платный тариф (после превышения):**
- $0.075 / 1M входных токенов (Flash)
- $0.30 / 1M входных токенов (Pro)

Для большинства проектов бесплатных лимитов достаточно!

## Ссылки

- [Google AI Studio](https://aistudio.google.com/)
- [Gemini API Документация](https://ai.google.dev/gemini-api/docs)
- [Модели и цены](https://ai.google.dev/gemini-api/docs/models/gemini)
- [Лимиты API](https://aistudio.google.com/app/apikey)
