const https = require('https');

// Скрипт для добавления environment variables через Vercel API
// Используем токен из Vercel CLI сессии

const PROJECT_ID = 'prj_qa4996h7o';
const TEAM_ID = 'team_qa4996h7o';

const envVars = [
  {
    key: 'GIGACHAT_CLIENT_ID',
    value: '019d1576-7f92-706a-a2f8-0adad5994c20',
  },
  {
    key: 'GIGACHAT_CLIENT_SECRET',
    value: '4920293f-44df-4dfb-9dc0-73a201323a01',
  },
];

// Получаем токен из cookie или localStorage через версел CLI
// Для этого нужно сначала сделать версел login

console.log('❗ Vercel CLI не позволяет программно добавлять env vars из соображений безопасности.');
console.log('');
console.log('📋 Пожалуйста, сделайте это вручную:');
console.log('');
console.log('1. Откройте: https://vercel.com/desmosdesmos-projects/life-os/settings/environment-variables');
console.log('');
console.log('2. Добавьте переменные:');
console.log('   GIGACHAT_CLIENT_ID     = 019d1576-7f92-706a-a2f8-0adad5994c20');
console.log('   GIGACHAT_CLIENT_SECRET = 4920293f-44df-4dfb-9dc0-73a201323a01');
console.log('');
console.log('3. Выберите все среды: Production, Preview, Development');
console.log('');
console.log('4. Сохраните и сделайте Redeploy');
console.log('');

// Альтернативно - используем версел env add в интерактивном режиме
console.log('Или через CLI (интерактивно):');
console.log('  vercel env add GIGACHAT_CLIENT_ID production');
console.log('  vercel env add GIGACHAT_CLIENT_SECRET production');
