// Vercel Edge Function для проксирования запросов к GigaChat
// Работает ближе к РФ (Europe)

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  // Handle CORS
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const body = await request.json();
    const { messages, systemPrompt, imageBase64, prompt } = body;

    // Получаем credentials
    const clientId = process.env.GIGACHAT_CLIENT_ID;
    const clientSecret = process.env.GIGACHAT_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return new Response(JSON.stringify({ error: 'Credentials not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // OAuth для получения токена
    const credentials = btoa(`${clientId}:${clientSecret}`);
    
    const authResponse = await fetch('https://ngw.devices.sberbank.ru:9443/api/v2/oauth', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'RqUID': crypto.randomUUID(),
      },
      body: 'scope=GIGACHAT_API_PERS',
    });

    if (!authResponse.ok) {
      const errorText = await authResponse.text();
      console.error('Auth error:', errorText);
      return new Response(JSON.stringify({ error: `Auth failed: ${authResponse.status}` }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const authData = await authResponse.json();
    const accessToken = authData.access_token;

    // Формируем запрос к GigaChat
    let requestBody: any;

    if (imageBase64) {
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
    const response = await fetch('https://gigachat.devices.sberbank.ru/api/v2/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('GigaChat error:', errorData);
      return new Response(JSON.stringify({ error: `GigaChat error: ${response.status}` }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('Handler error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}
