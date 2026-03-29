# Настройка GigaChat API на Vercel

## Проблема
Фронтенд использовал внешний прокси `https://api.npdetail.ru:3000/api/chat`, который не работает.

## Решение
Теперь используется встроенный Vercel API route `/api/chat`, который:
- Работает на сервере Vercel (не зависит от внешних прокси)
- Обходит CORS проблемы
- Использует OAuth для получения токена GigaChat

## Что было изменено

### 1. `src/utils/aiService.ts`
Изменён `AI_PROXY` с:
```typescript
const AI_PROXY = 'https://api.npdetail.ru:3000/api/chat';
```
на:
```typescript
const AI_PROXY = '/api/chat';
```

### 2. `vercel.json`
Добавлен rewrite для API routes:
```json
{
  "rewrites": [
    { "source": "/api/:path*", "destination": "/api/:path*" },
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

### 3. `.env` и `.env.example`
Добавлены переменные для серверной части (без префикса `VITE_`):
```
GIGACHAT_CLIENT_ID=your_client_id
GIGACHAT_CLIENT_SECRET=your_client_secret
```

## Настройка на Vercel

### Шаг 1: Зайдите в проект на Vercel
1. Откройте https://vercel.com/dashboard
2. Выберите ваш проект "LIFE OS"

### Шаг 2: Добавьте Environment Variables
1. Перейдите в **Settings** → **Environment Variables**
2. Добавьте две переменные:

   **GIGACHAT_CLIENT_ID**
   - Value: `019d1576-7f92-706a-a2f8-0adad5994c20`
   - Environments: ✅ Production, ✅ Preview, ✅ Development

   **GIGACHAT_CLIENT_SECRET**
   - Value: `4920293f-44df-4dfb-9dc0-73a201323a01`
   - Environments: ✅ Production, ✅ Preview, ✅ Development

### Шаг 3: Задеплойте изменения
1. Вернитесь на вкладку **Deployments**
2. Нажмите **Redeploy** на последнем деплое (или запушьте новые изменения)
3. Дождитесь завершения деплоя

## Проверка работы

### Локально:
```bash
npm run dev
```
Откройте http://localhost:5173 и проверьте работу AI консультантов.

### На Vercel:
После деплоя откройте ваш сайт на Vercel и протестируйте AI функции.

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
│  - OAuth авторизация (Sber)                         │
│  - Получение access token                           │
│  - Запрос к GigaChat API                            │
└──────────────────┬──────────────────────────────────┘
                   │ HTTPS
                   ▼
┌─────────────────────────────────────────────────────┐
│  GigaChat API (Сбер)                                │
│  https://gigachat.devices.sberbank.ru               │
│  https://ngw.devices.sberbank.ru:9443               │
└─────────────────────────────────────────────────────┘
```

## Преимущества этого решения

✅ **Не зависит от внешних прокси** — работает напрямую через Vercel
✅ **Безопасно** — credentials хранятся на сервере, не в браузере
✅ **Обходит CORS** — серверный запрос не имеет CORS ограничений
✅ **Работает в РФ** — Vercel + GigaChat доступны из России
✅ **Бесплатно** — Vercel Hobby тариф включает 100GB часов функций/мес

## Troubleshooting

### Ошибка "GigaChat credentials not configured"
- Проверьте, что переменные добавлены в Vercel Environment Variables
- Убедитесь, что имена точные: `GIGACHAT_CLIENT_ID` и `GIGACHAT_CLIENT_SECRET`
- Сделайте Redeploy после добавления переменных

### Ошибка "Auth failed: 401"
- Проверьте правильность Client ID и Client Secret
- Убедитесь, что приложение зарегистрировано на https://developers.sber.ru
- Проверьте, что scope `GIGACHAT_API_PERS` доступен вашему приложению

### Ошибка "Cannot connect to GigaChat API"
- GigaChat API может быть временно недоступен
- Проверьте логи в Vercel Dashboard → Functions → /api/chat
