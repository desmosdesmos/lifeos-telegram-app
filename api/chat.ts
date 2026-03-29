// API Route для AI запросов к Google Gemini API
// Документация: https://ai.google.dev/gemini-api/docs

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

    const apiKey = process.env.GEMINI_API_KEY;

    console.log('=== Gemini API Request ===');
    console.log('API Key exists:', !!apiKey);

    if (!apiKey) {
      console.error('❌ No API key configured');
      return res.status(500).json({ error: 'Gemini API key not configured' });
    }

    // Формируем запрос к Gemini API
    let requestBody: any;
    let model = 'gemini-2.0-flash';

    if (imageBase64) {
      console.log('📸 Processing image analysis request');
      model = 'gemini-2.0-flash';
      requestBody = {
        contents: [{
          parts: [
            { text: prompt || 'Проанализируй изображение' },
            { inline_data: { mime_type: 'image/jpeg', data: imageBase64 } }
          ]
        }],
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.7,
        },
      };
    } else {
      console.log('💬 Processing text request');
      model = 'gemini-2.0-flash';
      
      // Формируем сообщения в формате Gemini
      const contents = [];
      
      // System prompt как первое сообщение
      if (systemPrompt) {
        contents.push({
          role: 'user',
          parts: [{ text: `Инструкция: ${systemPrompt}` }]
        });
        contents.push({
          role: 'model',
          parts: [{ text: 'Понял, буду следовать инструкции.' }]
        });
      }
      
      // Добавляем сообщения пользователя
      for (const msg of messages || []) {
        contents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        });
      }

      requestBody = {
        contents,
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.7,
        },
      };
    }

    // Вызов Gemini API
    console.log('📡 Calling Gemini API...');
    let response: Response;
    try {
      response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: AbortSignal.timeout(30000),
      });
    } catch (fetchError: any) {
      console.error('❌ Gemini API fetch failed:', fetchError.message);
      return res.status(500).json({
        error: 'Cannot connect to Gemini API',
        details: fetchError.message
      });
    }

    console.log('Gemini response status:', response.status);

    const responseText = await response.text();
    console.log('Gemini raw response:', responseText.substring(0, 500));

    if (!response.ok) {
      console.error('❌ Gemini API error:', responseText);
      let errorMessage = `Gemini error: ${response.status}`;
      
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
      console.error('❌ Failed to parse Gemini response:', parseError);
      return res.status(500).json({ 
        error: 'Invalid response from Gemini API',
        rawResponse: responseText.substring(0, 200)
      });
    }
    
    console.log('✅ Gemini response success');

    // Конвертируем ответ Gemini в формат OpenAI для совместимости
    const openaiFormat = {
      id: data.candidates?.[0]?.content?.parts?.[0]?.text || '',
      choices: [{
        message: {
          content: data.candidates?.[0]?.content?.parts?.[0]?.text || 'Извините, я не могу ответить сейчас.'
        }
      }],
      usage: data.usageMetadata ? {
        prompt_tokens: data.usageMetadata.promptTokenCount || 0,
        completion_tokens: data.usageMetadata.candidatesTokenCount || 0,
        total_tokens: data.usageMetadata.totalTokenCount || 0,
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
