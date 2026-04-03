import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ID = 'prj_qa4996h7o';
const TEAM_ID = 'team_qa4996h7o';

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
      target: ['production', 'preview'],
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
          console.error(`❌ Ошибка: ${res.statusCode}`);
          console.error(body);
          reject(new Error(body));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  const token = getVercelToken();
  const groqKey = process.env.GROQ_API_KEY || 'your_groq_api_key_here';

  if (groqKey === 'your_groq_api_key_here') {
    console.error('❌ Установите GROQ_API_KEY в переменные окружения');
    process.exit(1);
  }

  try {
    await addEnvVar(token, 'GROQ_API_KEY', groqKey);
    console.log('✅ Готово! Сделайте редиплой для применения.');
  } catch (e) {
    console.error('❌ Ошибка:', e.message);
  }
}

main();
