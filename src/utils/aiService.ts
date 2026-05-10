// AI Service - Proxy Implementation
import { CapacitorHttp } from '@capacitor/core';
import type { HttpResponse } from '@capacitor/core';
import type { Meal, SleepDay, Workout, Transaction, Goal, UserProfile } from '../context/AppContext';
import type { MacroTargets } from './macroCalculator';

// Используем локальный или деплоенный адрес прокси-сервера
const PROXY_URL = import.meta.env.VITE_PROXY_URL || 'https://apk-lumina-server.vercel.app';
const GIGACHAT_ENDPOINT = `${PROXY_URL}/api/gigachat`;

export interface AIResponse {
  text: string;
}

export interface AIContext {
  type: 'nutrition' | 'sleep' | 'fitness' | 'finance' | 'goals' | 'analysis';
  userData?: {
    meals?: Meal[];
    sleepDays?: SleepDay[];
    workouts?: Workout[];
    transactions?: Transaction[];
    goals?: Goal[];
    profile?: UserProfile;
    // Computed properties for specific consultants
    income?: number;
    expenses?: number;
    savings?: number;
    savingsRate?: number;
    macros?: {
      protein: number;
      fat: number;
      carbs: number;
      calories: number;
    };
    targets?: MacroTargets;
    avgQuality?: number;
  };
}

export async function sendMessage(
  message: string,
  _context: AIContext
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

export function getQuickTip(_type: AIContext['type']): string {
  return 'Двигайтесь к своей цели!';
}

