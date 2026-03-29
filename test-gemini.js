// Тест Gemini API ключа
// Запуск: node test-gemini.js

const API_KEY = 'AIzaSyB8Ct1MgpEMGOPoDQ4Z2Pa2Rogpxp45WPY';

async function testGemini() {
  console.log('🧪 Тестирование Gemini API...\n');
  console.log('API Key:', API_KEY.substring(0, 10) + '...');

  const model = 'gemini-2.0-flash';
  
  // Тест 1: Текстовый запрос
  console.log('\n📝 Тест 1: Текстовый запрос');
  const textRequest = {
    contents: [{
      parts: [{ text: 'Привет! Ответь кратко на русском.' }]
    }],
    generationConfig: {
      maxOutputTokens: 50,
      temperature: 0.7,
    },
  };

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(textRequest),
        signal: AbortSignal.timeout(30000),
      }
    );

    console.log(`Статус: ${response.status}`);
    const text = await response.text();
    
    if (response.ok) {
      const data = JSON.parse(text);
      console.log('✅ УСПЕХ!');
      console.log('Ответ модели:', data.candidates?.[0]?.content?.parts?.[0]?.text);
    } else {
      console.log('❌ Ошибка API:', text.substring(0, 200));
    }
  } catch (error) {
    console.log('❌ Ошибка соединения:', error.message);
  }

  // Тест 2: Проверка лимитов
  console.log('\n📊 Проверка лимитов:');
  console.log('Бесплатный тариф: 15 запросов/мин (Gemini 2.0 Flash)');
  console.log('Проверить квоты: https://aistudio.google.com/app/apikey');
}

testGemini();
