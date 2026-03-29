# Развёртывание GigaChat Proxy на российском VPS

## Проблема
Vercel находится в США, а GigaChat API (`gigachat.devices.sberbank.ru`) блокирует запросы из-за рубежа.

## Решение
Запустить простой прокси-сервер на российском VPS.

---

## 📋 Шаг 1: Арендовать VPS в РФ

**Рекомендуемые провайдеры:**

| Провайдер | Цена | Ссылка |
|-----------|------|--------|
| Timeweb Cloud | ~200₽/мес | https://timeweb.cloud |
| Selectel | ~250₽/мес | https://selectel.ru |
| Reg.ru | ~200₽/мес | https://www.reg.ru/vps |
| Beget | ~250₽/мес | https://beget.ru/vps |

**Минимальная конфигурация:**
- CPU: 1 ядро
- RAM: 512 MB
- Disk: 10 GB
- OS: Ubuntu 22.04

---

## 📋 Шаг 2: Подключиться к серверу

```bash
ssh root@ваш-ip-сервера
```

---

## 📋 Шаг 3: Установить Node.js

```bash
# Обновить пакеты
apt update && apt upgrade -y

# Установить Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Проверить версию
node -v  # должно быть v20.x
npm -v
```

---

## 📋 Шаг 4: Загрузить файлы прокси

**Способ 1: Через git**
```bash
apt install -y git
git clone <ваш-репозиторий> /opt/gigachat-proxy
cd /opt/gigachat-proxy
```

**Способ 2: Через SCP с локальной машины**
```bash
# С локального компьютера
scp proxy-server-ru.js package.json root@ваш-ip-сервера:/opt/gigachat-proxy/
```

**Способ 3: Создать файлы вручную**
```bash
mkdir -p /opt/gigachat-proxy
cd /opt/gigachat-proxy

# Создать package.json
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

# Создать proxy-server-ru.js (скопировать содержимое файла)
```

---

## 📋 Шаг 5: Установить зависимости

```bash
cd /opt/gigachat-proxy
npm install --production
```

---

## 📋 Шаг 6: Настроить переменные окружения

```bash
# Создать .env файл
cat > .env << 'EOF'
GIGACHAT_CLIENT_ID=019d1576-7f92-706a-a2f8-0adad5994c20
GIGACHAT_CLIENT_SECRET=4920293f-44df-4dfb-9dc0-73a201323a01
PORT=3000
EOF
```

---

## 📋 Шаг 7: Установить PM2 (менеджер процессов)

```bash
npm install -g pm2

# Запустить сервер
pm2 start proxy-server-ru.js --name gigachat-proxy

# Запустить автозагрузку
pm2 startup
pm2 save
```

---

## 📋 Шаг 8: Настроить firewall

```bash
# Разрешить порт 3000
ufw allow 3000/tcp
ufw enable
```

---

## 📋 Шаг 9: Проверить работу

```bash
# Проверить статус
pm2 status

# Проверить логи
pm2 logs gigachat-proxy

# Тестовый запрос
curl http://localhost:3000/health

# Тест API
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Привет!"}]}'
```

---

## 📋 Шаг 10: Настроить HTTPS (опционально, но рекомендуется)

```bash
# Установить Certbot
apt install -y certbot python3-certbot-nginx

# Получить сертификат (нужен домен)
certbot certonly --standalone -d ваш-домен.ru

# Настроить Nginx как reverse proxy
apt install -y nginx

cat > /etc/nginx/sites-available/gigachat-proxy << 'EOF'
server {
    listen 80;
    server_name ваш-домен.ru;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

ln -s /etc/nginx/sites-available/gigachat-proxy /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

---

## 📋 Шаг 11: Обновить фронтенд

Измените `AI_PROXY` в `src/utils/aiService.ts`:

```typescript
const AI_PROXY = 'https://ваш-домен.ru:3000/api/chat';
// или для HTTP
const AI_PROXY = 'http://ваш-ip-сервера:3000/api/chat';
```

---

## 📋 Шаг 12: Задеплоить на Vercel

```bash
vercel --prod --yes
```

---

## 🔧 Команды управления

```bash
# Статус
pm2 status

# Логи
pm2 logs gigachat-proxy

# Перезапуск
pm2 restart gigachat-proxy

# Остановка
pm2 stop gigachat-proxy

# Удаление
pm2 delete gigachat-proxy
```

---

## 💰 Стоимость

| Провайдер | Тариф | Цена/мес |
|-----------|-------|----------|
| Timeweb | VM-1 | ~199₽ |
| Selectel | Cloud-1 | ~245₽ |
| Reg.ru | VPS-1 | ~199₽ |

**Итого:** ~200-250₽/мес за стабильную работу GigaChat API.

---

## 🆘 Troubleshooting

### "Connection refused" при запросе к GigaChat
- Убедитесь, что сервер в РФ
- Проверьте firewall: `ufw status`

### "Auth failed: 401"
- Проверьте credentials в `.env`
- Убедитесь, что приложение активно на https://developers.sber.ru

### Сервер упал
- `pm2 restart gigachat-proxy`
- Проверьте логи: `pm2 logs`
