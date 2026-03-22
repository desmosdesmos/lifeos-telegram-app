// Vercel Edge Function для анализа изображений через GigaChat Vision
// Обходит CORS ограничения, вызывая GigaChat с сервера Vercel
// Работает в РФ бесплатно

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request): Promise<Response> {
  // Разрешаем CORS для всех доменов
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
    const { imageBase64, prompt } = await request.json();

    if (!imageBase64) {
      return new Response(JSON.stringify({ error: 'imageBase64 required' }), { 
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    const clientId = process.env.GIGACHAT_CLIENT_ID;
    const clientSecret = process.env.GIGACHAT_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('GigaChat credentials not configured');
    }

    // Шаг 1: Получаем OAuth токен GigaChat
    // Используем базовую авторизацию Client ID:Client Secret
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
      throw new Error(`Auth failed: ${authResponse.status} - ${authError}`);
    }

    const authData = await authResponse.json();
    const accessToken = authData.access_token;

    if (!accessToken) {
      throw new Error('No access token received');
    }

    // Шаг 2: Анализ изображения через GigaChat Vision
    const visionResponse = await fetch('https://gigachat.devices.sberbank.ru/api/v2/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'GigaChat-Pro',
        messages: [{
          role: 'user',
          content: [
            { 
              type: 'text', 
              text: prompt || 'Проанализируй это изображение подробно. Опиши что видишь и дай рекомендации.' 
            },
            { 
              type: 'image_url', 
              image_url: { 
                url: `data:image/jpeg;base64,${imageBase64}` 
              } 
            }
          ]
        }],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!visionResponse.ok) {
      const visionError = await visionResponse.text();
      console.error('GigaChat Vision error:', visionError);
      throw new Error(`Vision API error: ${visionResponse.status} - ${visionError}`);
    }

    const data = await visionResponse.json();
    
    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error('Analyze image error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : undefined
    }), { 
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}
