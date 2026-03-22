// API Route для AI запросов к GigaChat
// Обходит CORS ограничения для текста и фото
// Работает в РФ бесплатно

import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
  api: {
    bodyParser: true,
    externalResolver: true,
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Разрешаем CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, systemPrompt, imageBase64, prompt } = req.body;

    const clientId = process.env.GIGACHAT_CLIENT_ID;
    const clientSecret = process.env.GIGACHAT_CLIENT_SECRET;

    console.log('Client ID exists:', !!clientId);
    console.log('Client Secret exists:', !!clientSecret);

    if (!clientId || !clientSecret) {
      console.error('No credentials configured');
      return res.status(500).json({ error: 'GigaChat credentials not configured' });
    }

    // Получаем OAuth токен
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    
    console.log('Requesting OAuth token...');
    
    const authResponse = await fetch('https://ngw.devices.sberbank.ru:9443/api/v2/oauth', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'RqUID': crypto.randomUUID(),
      },
      body: 'scope=GIGACHAT_API_PERS',
    });

    console.log('Auth response status:', authResponse.status);

    if (!authResponse.ok) {
      const authError = await authResponse.text();
      console.error('GigaChat auth error:', authError);
      return res.status(500).json({ error: `Auth failed: ${authResponse.status}` });
    }

    const authData = await authResponse.json();
    const accessToken = authData.access_token;

    console.log('Access token received:', !!accessToken);

    if (!accessToken) {
      return res.status(500).json({ error: 'No access token received' });
    }

    // Формируем запрос к GigaChat
    let requestBody: any;

    if (imageBase64) {
      // Запрос с изображением
      console.log('Processing image analysis request');
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
      // Текстовый запрос
      console.log('Processing text request');
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

    // Вызов GigaChat API
    console.log('Calling GigaChat API...');
    const response = await fetch('https://gigachat.devices.sberbank.ru/api/v2/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('GigaChat response status:', response.status);

    if (!response.ok) {
      const errorData = await response.text();
      console.error('GigaChat API error:', errorData);
      return res.status(500).json({ error: `GigaChat error: ${response.status}` });
    }

    const data = await response.json();
    console.log('GigaChat response success');
    
    return res.status(200).json(data);
  } catch (error) {
    console.error('Chat error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return res.status(500).json({ 
      error: errorMessage,
    });
  }
}
