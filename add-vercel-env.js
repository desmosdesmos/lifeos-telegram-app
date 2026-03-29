const https = require('https');

// Получаем токен из ~/.vercel/auth.json или используем login
// Для простоты - используем версионный API

const PROJECT_ID = 'prj_qa4996h7o-desmosdesmos-projects';
const TEAM_ID = 'team_qa4996h7o'; // или используем user

const envVars = [
  {
    key: 'GIGACHAT_CLIENT_ID',
    value: '019d1576-7f92-706a-a2f8-0adad5994c20',
    type: 'encrypted'
  },
  {
    key: 'GIGACHAT_CLIENT_SECRET',
    value: '4920293f-44df-4dfb-9dc0-73a201323a01',
    type: 'encrypted'
  }
];

console.log('Adding environment variables to Vercel...');
console.log('Project:', PROJECT_ID);
console.log('Variables:', envVars.map(e => e.key).join(', '));
console.log('\n⚠️  Please run: vercel env add <name> <value> manually');
console.log('Or use Vercel Dashboard: https://vercel.com/desmosdesmos-projects/life-os/settings/environment-variables');
