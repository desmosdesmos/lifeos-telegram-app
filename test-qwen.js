// Тест Qwen API ключа
// Запуск: node test-qwen.js

const API_KEY = process.env.QWEN_API_KEY || 'sk-fe7020d75d9d41dab3449a42e1534cfd';

async function testQwen() {
  console.log('🧪 Тестирование Qwen API...\n');
  console.log('API Key:', API_KEY.substring(0, 10) + '...');

  const endpoints = [
    'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
    'https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions',
  ];

  const requestBody = {
    model: 'qwen-turbo',
    messages: [
      { role: 'system', content: 'Ты полезный ассистент.' },
      { role: 'user', content: 'Привет! Ответь кратко.' }
    ],
    max_tokens: 50,
  };

  for (const endpoint of endpoints) {
    console.log(`\n📡 Тестирование endpoint: ${endpoint}`);
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: AbortSignal.timeout(30000),
      });

      console.log(`Статус: ${response.status}`);
      
      const text = await response.text();
      console.log(`Ответ: ${text.substring(0, 300)}`);

      if (response.ok) {
        const data = JSON.parse(text);
        console.log('✅ УСПЕХ!');
        console.log('Ответ модели:', data.choices?.[0]?.message?.content);
        return;
      } else {
        console.log('❌ Ошибка API');
      }
    } catch (error) {
      console.log('❌ Ошибка соединения:', error.message);
    }
  }

  console.log('\n❌ Все endpoint-ы не сработали');
  console.log('\nВозможные причины:');
  console.log('1. Неверный API ключ');
  console.log('2. Закончились бесплатные токены');
  console.log('3. Ключ не активирован');
  console.log('4. Блокировка по IP');
  console.log('\nПроверьте: https://dashscope.console.aliyun.com/');
}

testQwen();
