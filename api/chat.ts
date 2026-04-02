// API Route для AI запросов к Groq API
// Документация: https://console.groq.com/docs
// Модели: llama, mixtral, gemma

import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
  api: {
    bodyParser: true,
    externalResolver: true,
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
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

    const apiKey = process.env.GROQ_API_KEY;

    console.log('=== Groq API Request ===');
    console.log('API Key exists:', !!apiKey);

    if (!apiKey) {
      console.error('❌ No API key configured');
      return res.status(500).json({ error: 'Groq API key not configured' });
    }

    // Groq не поддерживает изображения напрямую, только текст
    if (imageBase64) {
      console.log('⚠️ Image analysis not supported by Groq');
      return res.status(400).json({ 
        error: 'Groq не поддерживает анализ изображений. Используйте Gemini для этой функции.' 
      });
    }

    // Формируем сообщения в формате OpenAI (совместим с Groq)
    const groqMessages = [];

    // System prompt
    if (systemPrompt) {
      groqMessages.push({ role: 'system', content: systemPrompt });
    }

    // Добавляем сообщения пользователя
    for (const msg of messages || []) {
      groqMessages.push({ role: msg.role, content: msg.content });
    }

    console.log('📡 Calling Groq API...');
    console.log('Messages:', JSON.stringify(groqMessages, null, 2).substring(0, 500));

    let response: Response;
    try {
      response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.1-70b-versatile',
          messages: groqMessages,
          max_tokens: 500,
          temperature: 0.7,
          top_p: 1,
          stream: false,
        }),
        signal: AbortSignal.timeout(30000),
      });
    } catch (fetchError: any) {
      console.error('❌ Groq API fetch failed:', fetchError.message);
      return res.status(500).json({
        error: 'Cannot connect to Groq API',
        details: fetchError.message
      });
    }

    console.log('Groq response status:', response.status);

    const responseText = await response.text();
    console.log('Groq raw response:', responseText.substring(0, 500));

    if (!response.ok) {
      console.error('❌ Groq API error:', responseText);
      let errorMessage = `Groq error: ${response.status}`;

      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.error?.message || errorMessage;
      } catch {
        errorMessage = responseText || errorMessage;
      }

      return res.status(500).json({ error: errorMessage });
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ Failed to parse Groq response:', parseError);
      return res.status(500).json({
        error: 'Invalid response from Groq API',
        rawResponse: responseText.substring(0, 200)
      });
    }

    console.log('✅ Groq response success');

    // Возвращаем в формате совместимом с aiService.ts
    const openaiFormat = {
      id: data.id || '',
      choices: [{
        message: {
          content: data.choices?.[0]?.message?.content || 'Извините, я не могу ответить сейчас.'
        }
      }],
      usage: data.usage ? {
        prompt_tokens: data.usage.prompt_tokens || 0,
        completion_tokens: data.usage.completion_tokens || 0,
        total_tokens: data.usage.total_tokens || 0,
      } : undefined,
    };

    return res.status(200).json(openaiFormat);
  } catch (error) {
    console.error('❌ Chat error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return res.status(500).json({
      error: errorMessage,
    });
  }
}
