#!/bin/bash

# LifeOS Proxy Setup Script
# Run this on the server with: curl -fsSL setup.sh | bash

echo "🚀 Setting up LifeOS Proxy..."

# Create directory
mkdir -p /opt/lifeos-proxy
cd /opt/lifeos-proxy

# Create server.js
cat > server.js << 'ENDOFFILE'
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

const CLIENT_ID = '019d1576-7f92-706a-a2f8-0adad5994c20';
const CLIENT_SECRET = '4920293f-44df-4dfb-9dc0-73a201323a01';

app.use(cors());
app.use(express.json({ limit: '10mb' }));

let accessToken = null;
let tokenExpiry = 0;

async function getAccessToken() {
  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken;
  }

  const credentials = Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64');
  
  const response = await fetch('https://ngw.devices.sberbank.ru:9443/api/v2/oauth', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + credentials,
      'Content-Type': 'application/x-www-form-urlencoded',
      'RqUID': crypto.randomUUID(),
    },
    body: 'scope=GIGACHAT_API_PERS',
  });

  if (!response.ok) {
    throw new Error('Auth failed: ' + response.status);
  }

  const data = await response.json();
  accessToken = data.access_token;
  tokenExpiry = Date.now() + 30 * 60 * 1000;
  
  console.log('New access token received');
  return accessToken;
}

app.post('/api/chat', async (req, res) => {
  try {
    const { messages, systemPrompt, imageBase64, prompt } = req.body;
    
    const token = await getAccessToken();
    
    let requestBody;
    if (imageBase64) {
      requestBody = {
        model: 'GigaChat-Pro',
        messages: [{
          role: 'user',
          content: [
            { type: 'text', text: prompt || 'Проанализируй изображение' },
            { type: 'image_url', image_url: { url: 'data:image/jpeg;base64,' + imageBase64 } }
          ]
        }],
        temperature: 0.7,
        max_tokens: 1000,
      };
    } else {
      requestBody = {
        model: 'GigaChat',
        messages: [
          { role: 'system', content: systemPrompt || 'Ты полезный ассистент.' },
          ...(messages || [])
        ],
        temperature: 0.7,
        max_tokens: 500,
      };
    }

    const response = await fetch('https://gigachat.devices.sberbank.ru/api/v2/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('GigaChat error:', error);
      return res.status(500).json({ error: 'GigaChat error: ' + response.status });
    }

    const data = await response.json();
    console.log('GigaChat response success');
    res.json(data);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('Proxy server running on port ' + PORT);
});
ENDOFFILE

# Create package.json
cat > package.json << 'ENDOFFILE'
{
  "name": "lifeos-proxy",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"
  }
}
ENDOFFILE

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install PM2 globally
echo "📦 Installing PM2..."
npm install -g pm2

# Start the server
echo "🚀 Starting proxy server..."
pm2 start server.js --name lifeos-proxy

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup

echo ""
echo "✅ Setup complete!"
echo "📡 Proxy URL: http://37.252.21.153:3000/api/chat"
echo ""
echo "Useful commands:"
echo "  pm2 status          - Check server status"
echo "  pm2 logs            - View logs"
echo "  pm2 restart all     - Restart server"
