// Vercel Edge Function для AI запросов к GigaChat
// Обходит CORS ограничения для текста и фото
// Работает в РФ бесплатно

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405,
      headers: corsHeaders
    });
  }

  try {
    const { messages, systemPrompt, imageBase64, prompt } = await request.json();

    const clientId = process.env.GIGACHAT_CLIENT_ID;
    const clientSecret = process.env.GIGACHAT_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('GigaChat credentials not configured');
    }

    // Получаем OAuth токен
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
      const authError = await authResponse.text();
      console.error('GigaChat auth error:', authError);
      throw new Error(`Auth failed: ${authResponse.status}`);
    }

    const authData = await authResponse.json();
    const accessToken = authData.access_token;

    if (!accessToken) {
      throw new Error('No access token received');
    }

    // Формируем запрос к GigaChat
    let requestBody: any;

    if (imageBase64) {
      // Запрос с изображением
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
      console.error('GigaChat API error:', errorData);
      throw new Error(`GigaChat error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error('Chat error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error'
    }), { 
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}
