import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Читаем .env файл
const envPath = path.resolve(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf8');

// Парсим переменные
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    const value = match[2].trim();
    if (key.startsWith('TELEGRAM_')) {
      envVars[key] = value;
    }
  }
});

const PROJECT_ID = 'prj_qa4996h7o-desmosdesmos-projects';
const TEAM_ID = 'team_qa4996h7o';

// Получаем токен из ~/.vercel/auth.json
function getVercelToken() {
  const homeDir = process.platform === 'win32' 
    ? process.env.USERPROFILE 
    : process.env.HOME;
  const authPath = path.join(homeDir, '.vercel', 'auth.json');
  
  try {
    const authData = JSON.parse(fs.readFileSync(authPath, 'utf8'));
    return authData.token || authData?.org?.token;
  } catch (e) {
    console.error('❌ Не найден токен Vercel. Выполните: vercel login');
    process.exit(1);
  }
}

async function addEnvVar(token, key, value) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      key,
      value,
      type: 'encrypted',
      target: ['production', 'preview', 'development'],
      gitBranch: null
    });

    const options = {
      hostname: 'api.vercel.com',
      port: 443,
      path: `/v10/projects/${PROJECT_ID}/env?teamId=${TEAM_ID}`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode === 201 || res.statusCode === 200) {
          console.log(`✅ Добавлена переменная: ${key}`);
          resolve();
        } else {
          console.error(`❌ Ошибка при добавлении ${key}: ${res.statusCode}`);
          console.error(body);
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  console.log('🚀 Добавляем Telegram переменные на Vercel...\n');
  
  const token = getVercelToken();
  
  console.log('Переменные для добавления:');
  Object.entries(envVars).forEach(([key, value]) => {
    const maskedValue = value.length > 10 
      ? value.substring(0, 6) + '...' + value.substring(value.length - 4)
      : '***';
    console.log(`  ${key} = ${maskedValue}`);
  });
  console.log();

  for (const [key, value] of Object.entries(envVars)) {
    try {
      await addEnvVar(token, key, value);
    } catch (e) {
      console.error(`Пропущена переменная ${key}`);
    }
  }

  console.log('\n✅ Готово! Vercel автоматически пересоберёт проект с новыми переменными.');
  console.log('\n📱 Проверьте деплой: https://vercel.com/desmosdesmos-projects/life-os');
}

main().catch(console.error);
