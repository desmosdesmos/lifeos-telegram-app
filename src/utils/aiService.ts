// AI Service - Proxy Implementation
import { CapacitorHttp } from '@capacitor/core';
import type { HttpResponse } from '@capacitor/core';

// Используем локальный или деплоенный адрес прокси-сервера
// В режиме разработки Vercel обычно это http://localhost:3000
const PROXY_URL = import.meta.env.VITE_PROXY_URL || 'https://apk-lumina-server.vercel.app';
const GIGACHAT_ENDPOINT = `${PROXY_URL}/api/gigachat`;

export interface AIResponse {
  text: string;
}

export async function sendMessage(
  message: string,
  _context: {
    type: 'nutrition' | 'sleep' | 'fitness' | 'finance' | 'goals' | 'analysis';
    userData?: any;
  }
): Promise<AIResponse> {
  try {
    const options = {
      url: GIGACHAT_ENDPOINT,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      data: {
        model: 'GigaChat',
        messages: [
          { role: 'system', content: 'Ты краткий AI помощник на русском языке.' },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
      },
      connectTimeout: 20000,
      readTimeout: 20000,
    };

    const response: HttpResponse = await CapacitorHttp.post(options);

    if (response.status !== 200) {
      // Если прокси вернул ошибку, выводим детали
      const errorDetail = response.data?.error || response.data?.message || `Status ${response.status}`;
      throw new Error(errorDetail);
    }

    const text = response.data.choices?.[0]?.message?.content || 'Ответ пуст';
    return { text: text.replace(/\*/g, '').trim() };

  } catch (error: any) {
    console.error('AI Service Error:', error);
    return {
      text: `⚠️ Не удалось связаться с AI.\n\nПричина: ${error.message}\n\nПожалуйста, убедитесь, что прокси-сервер запущен и доступен.`
    };
  }
}

export function getQuickTip(_type: any): string {
  return 'Двигайтесь к своей цели!';
}

export async function analyzeFoodImage(_base64: string): Promise<any> {
  // Теперь можно реализовать через тот же прокси
  try {
    const options = {
      url: GIGACHAT_ENDPOINT,
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        model: 'GigaChat-2-Max',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Что на этом изображении еды? Оцени калорийность и БЖУ кратко.' },
              { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${_base64}` } }
            ]
          }
        ]
      }
    };
    const response: HttpResponse = await CapacitorHttp.post(options);
    return response.data;
  } catch (e) {
    console.error('Vision Error:', e);
    throw e;
  }
}

