// GigaChat Proxy Server для российского VPS
// Запуск: node proxy-server-ru.js
// Порт: 3000 (или укажите свой)

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Ваши credentials от GigaChat
const CLIENT_ID = process.env.GIGACHAT_CLIENT_ID || '019d1576-7f92-706a-a2f8-0adad5994c20';
const CLIENT_SECRET = process.env.GIGACHAT_CLIENT_SECRET || '4920293f-44df-4dfb-9dc0-73a201323a01';

app.use(cors());
app.use(express.json({ limit: '10mb' }));

let accessToken = null;
let tokenExpiry = 0;

// Получение OAuth токена
async function getAccessToken() {
  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken;
  }

  const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

  console.log('📡 Запрос OAuth токена...');

  const response = await fetch('https://ngw.devices.sberbank.ru:9443/api/v2/oauth', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'RqUID': crypto.randomUUID(),
    },
    body: 'scope=GIGACHAT_API_PERS',
  });

  console.log('OAuth статус:', response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ OAuth ошибка:', errorText);
    throw new Error(`Auth failed: ${response.status}`);
  }

  const data = await response.json();
  accessToken = data.access_token;
  tokenExpiry = Date.now() + 30 * 60 * 1000; // 30 минут

  console.log('✅ Токен получен');
  return accessToken;
}

// POST /api/chat
app.post('/api/chat', async (req, res) => {
  try {
    console.log('📥 Входящий запрос:', JSON.stringify(req.body).substring(0, 100));

    const { messages, systemPrompt, imageBase64, prompt } = req.body;

    const token = await getAccessToken();

    let requestBody;

    if (imageBase64) {
      // Анализ изображения (GigaChat-Pro с vision)
      console.log('📸 Анализ изображения...');
      requestBody = {
        model: 'GigaChat-Pro',
        messages: [{
          role: 'user',
          content: [
            { type: 'text', text: prompt || 'Проанализируй изображение' },
            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }
          ]
        }],
        temperature: 0.7,
        max_tokens: 1000,
      };
    } else {
      // Текстовый чат
      console.log('💬 Текстовый запрос...');
      const allMessages = [
        { role: 'system', content: systemPrompt || 'Ты полезный ассистент.' },
        ...(messages || [])
      ];

      requestBody = {
        model: 'GigaChat',
        messages: allMessages,
        temperature: 0.7,
        max_tokens: 500,
      };
    }

    console.log('📡 Запрос к GigaChat API...');

    const response = await fetch('https://gigachat.devices.sberbank.ru/api/v2/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('GigaChat статус:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ GigaChat ошибка:', errorText);
      return res.status(500).json({ error: `GigaChat error: ${response.status}` });
    }

    const data = await response.json();
    console.log('✅ Успех!');

    res.json(data);

  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Запуск сервера
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 GigaChat Proxy запущен на порту ${PORT}`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🔗 Health: http://localhost:${PORT}/health`);
});
