#!/bin/bash
# Автоматическая установка GigaChat Proxy на Timeweb VPS
# Использование: bash install-gigachat-proxy.sh

set -e

echo "🚀 Установка GigaChat Proxy на VPS..."

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Проверка root
if [ "$EUID" -ne 0 ]; then 
  echo -e "${RED}❌ Пожалуйста, запустите от root (sudo -i)${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Запуск от root${NC}"

# Обновление
echo -e "${YELLOW}📦 Обновление пакетов...${NC}"
apt update -qq
apt upgrade -y -qq

# Установка Node.js
echo -e "${YELLOW}📦 Установка Node.js 20...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | bash - > /dev/null 2>&1
apt install -y nodejs > /dev/null 2>&1

echo -e "${GREEN}✅ Node.js $(node -v) установлен${NC}"

# Установка PM2
echo -e "${YELLOW}📦 Установка PM2...${NC}"
npm install -g pm2 > /dev/null 2>&1
echo -e "${GREEN}✅ PM2 установлен${NC}"

# Создание директории
PROXY_DIR="/opt/gigachat-proxy"
mkdir -p $PROXY_DIR
cd $PROXY_DIR

# Создание package.json
echo -e "${YELLOW}📝 Создание package.json...${NC}"
cat > package.json << 'EOF'
{
  "name": "gigachat-proxy",
  "version": "1.0.0",
  "main": "proxy-server-ru.js",
  "scripts": {
    "start": "node proxy-server-ru.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"
  }
}
EOF

# Создание proxy-server-ru.js
echo -e "${YELLOW}📝 Создание proxy-server-ru.js...${NC}"
cat > proxy-server-ru.js << 'EOF'
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

const CLIENT_ID = process.env.GIGACHAT_CLIENT_ID || '019d1576-7f92-706a-a2f8-0adad5994c20';
const CLIENT_SECRET = process.env.GIGACHAT_CLIENT_SECRET || '4920293f-44df-4dfb-9dc0-73a201323a01';

app.use(cors());
app.use(express.json({ limit: '10mb' }));

let accessToken = null;
let tokenExpiry = 0;

async function getAccessToken() {
  if (accessToken && Date.now() < tokenExpiry) return accessToken;
  
  const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  const response = await fetch('https://ngw.devices.sberbank.ru:9443/api/v2/oauth', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'RqUID': crypto.randomUUID(),
    },
    body: 'scope=GIGACHAT_API_PERS',
  });
  
  if (!response.ok) throw new Error(`Auth: ${response.status}`);
  
  const data = await response.json();
  accessToken = data.access_token;
  tokenExpiry = Date.now() + 30 * 60 * 1000;
  return accessToken;
}

app.post('/api/chat', async (req, res) => {
  try {
    const { messages, systemPrompt, imageBase64, prompt } = req.body;
    const token = await getAccessToken();
    
    let requestBody = imageBase64 
      ? {
          model: 'GigaChat-Pro',
          messages: [{
            role: 'user',
            content: [
              { type: 'text', text: prompt || 'Analiziruy' },
              { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }
            ]
          }],
          temperature: 0.7,
          max_tokens: 1000,
        }
      : {
          model: 'GigaChat',
          messages: [
            { role: 'system', content: systemPrompt || 'Pomoshchnik.' },
            ...(messages || [])
          ],
          temperature: 0.7,
          max_tokens: 500,
        };
    
    const response = await fetch('https://gigachat.devices.sberbank.ru/api/v2/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    
    if (!response.ok) throw new Error(`GigaChat: ${response.status}`);
    
    res.json(await response.json());
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 GigaChat Proxy on port ${PORT}`);
});
EOF

# Установка зависимостей
echo -e "${YELLOW}📦 Установка зависимостей...${NC}"
npm install --production > /dev/null 2>&1
echo -e "${GREEN}✅ Зависимости установлены${NC}"

# Создание .env
echo -e "${YELLOW}📝 Создание .env...${NC}"
cat > .env << EOF
GIGACHAT_CLIENT_ID=019d1576-7f92-706a-a2f8-0adad5994c20
GIGACHAT_CLIENT_SECRET=4920293f-44df-4dfb-9dc0-73a201323a01
PORT=3000
EOF

# Настройка firewall
echo -e "${YELLOW}🔒 Настройка firewall...${NC}"
ufw allow 3000/tcp > /dev/null 2>&1 || true
ufw --force enable > /dev/null 2>&1 || true

# Запуск через PM2
echo -e "${YELLOW}🚀 Запуск прокси...${NC}"
pm2 start proxy-server-ru.js --name gigachat-proxy
pm2 save
pm2 startup | tail -1 | bash 2>/dev/null || true

echo -e "${GREEN}✅ Прокси запущен!${NC}"
echo ""
echo -e "${YELLOW}📊 Статус:${NC}"
pm2 status
echo ""
echo -e "${YELLOW}🔗 Health check: http://localhost:3000/health${NC}"
echo -e "${YELLOW}📝 Логи: pm2 logs gigachat-proxy${NC}"
echo ""
echo -e "${YELLOW}⚠️  Далее настройте Nginx для HTTPS:${NC}"
echo "   bash setup-nginx.sh api.npdetail.ru"
