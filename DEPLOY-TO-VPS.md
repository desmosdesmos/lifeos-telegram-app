# 🚀 Развёртывание GigaChat Proxy на api.npdetail.ru

## Ваш домен
- **Домен:** npdetail.ru
- **Поддомен:** api.npdetail.ru
- **IP:** 37.252.21.153 (Timeweb)
- **DNS запись:** A api.npdetail.ru → 37.252.21.153 ✅

---

## 📋 Шаг 1: Подключиться к VPS

```bash
ssh root@37.252.21.153
```

> Если не знаете пароль от сервера — проверьте в панели Timeweb Cloud

---

## 📋 Шаг 2: Загрузить скрипты на сервер

**С локального компьютера (PowerShell/CMD):**

```powershell
scp install-gigachat-proxy.sh setup-nginx.sh root@37.252.21.153:/root/
```

**Или скопируйте содержимое файлов вручную:**

На сервере выполните:
```bash
cd /root
```

---

## 📋 Шаг 3: Запустить установку

```bash
# Сделать скрипты исполняемыми
chmod +x install-gigachat-proxy.sh setup-nginx.sh

# Запустить установку прокси
bash install-gigachat-proxy.sh
```

Скрипт автоматически:
- ✅ Установит Node.js 20
- ✅ Установит PM2
- ✅ Создаст прокси-сервер
- ✅ Настроит firewall
- ✅ Запустит сервис

---

## 📋 Шаг 4: Настроить HTTPS

```bash
# Настроить Nginx + SSL сертификат
bash setup-nginx.sh api.npdetail.ru
```

Скрипт:
- ✅ Установит Nginx
- ✅ Получит SSL сертификат от Let's Encrypt
- ✅ Настроит HTTPS

---

## 📋 Шаг 5: Проверить работу

```bash
# Проверить статус прокси
pm2 status

# Проверить логи
pm2 logs gigachat-proxy

# Тест Health check
curl http://localhost:3000/health

# Тест API
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Привет!"}]}'
```

---

## 📋 Шаг 6: Обновить фронтенд

Измените `src/utils/aiService.ts`:

```typescript
// Было:
const AI_PROXY = '/api/chat';

// Стало:
const AI_PROXY = 'https://api.npdetail.ru/api/chat';
```

---

## 📋 Шаг 7: Задеплоить на Vercel

```bash
vercel --prod --yes
```

---

## 🔧 Управление прокси

```bash
# Статус
pm2 status

# Логи в реальном времени
pm2 logs gigachat-proxy --lines 100

# Перезапуск
pm2 restart gigachat-proxy

# Остановка
pm2 stop gigachat-proxy

# Запуск
pm2 start gigachat-proxy

# Автозагрузка при старте сервера
pm2 startup
pm2 save
```

---

## 🛡️ Безопасность

### Firewall (UFW)
```bash
# Проверить статус
ufw status

# Разрешить только нужные порты
ufw allow 22/tcp      # SSH
ufw allow 80/tcp      # HTTP
ufw allow 443/tcp     # HTTPS
ufw enable
```

### Обновление системы
```bash
apt update && apt upgrade -y
```

---

## 🆘 Troubleshooting

### Прокси не запускается
```bash
# Проверить логи PM2
pm2 logs gigachat-proxy

# Перезапустить
pm2 restart gigachat-proxy
```

### HTTPS не работает
```bash
# Проверить Nginx
systemctl status nginx

# Переполучить сертификат
certbot --nginx -d api.npdetail.ru

# Проверить конфиг
nginx -t
systemctl restart nginx
```

### GigaChat не отвечает
```bash
# Проверить доступность API
curl -I https://gigachat.devices.sberbank.ru

# Проверить credentials
cat /opt/gigachat-proxy/.env
```

---

## 📊 Мониторинг

```bash
# Использование памяти
pm2 monit

# Статистика
pm2 show gigachat-proxy
```

---

## 💰 Стоимость

- **VPS Timeweb:** ~200₽/мес (уже оплачено)
- **Домен:** ~200₽/год (уже оплачено)
- **SSL сертификат:** Бесплатно (Let's Encrypt)

**Итого:** 0₽ дополнительных расходов! ✅

---

## 📁 Расположение файлов

| Файл | Путь |
|------|------|
| Прокси сервер | `/opt/gigachat-proxy/proxy-server-ru.js` |
| Конфиг PM2 | `/root/.pm2/pm2.json` |
| Nginx конфиг | `/etc/nginx/sites-available/gigachat-proxy` |
| SSL сертификаты | `/etc/letsencrypt/live/api.npdetail.ru/` |
| Логи Nginx | `/var/log/nginx/` |

---

## ✅ Чеклист

- [ ] Подключиться к VPS по SSH
- [ ] Запустить `install-gigachat-proxy.sh`
- [ ] Запустить `setup-nginx.sh api.npdetail.ru`
- [ ] Проверить `curl http://localhost:3000/health`
- [ ] Обновить `AI_PROXY` во фронтенде
- [ ] Задеплоить на Vercel
- [ ] Протестировать AI консультантов
