# ✅ GigaChat API — Готово к развёртыванию

## 📋 Что сделано

| Компонент | Статус | Файл |
|-----------|--------|------|
| Прокси сервер | ✅ Готов | `proxy-server-ru.js` |
| Скрипт установки | ✅ Готов | `install-gigachat-proxy.sh` |
| Скрипт HTTPS | ✅ Готов | `setup-nginx.sh` |
| Фронтенд | ✅ Обновлён | `src/utils/aiService.ts` |
| Vercel деплой | ✅ Готов | `https://life-os-seven-khaki.vercel.app` |

---

## 🚀 Быстрый старт (3 команды)

Подключитесь к серверу и выполните:

```bash
ssh root@37.252.21.153

# На сервере:
curl -O https://raw.githubusercontent.com/your-repo/life-os/main/install-gigachat-proxy.sh
curl -O https://raw.githubusercontent.com/your-repo/life-os/main/setup-nginx.sh

chmod +x *.sh
bash install-gigachat-proxy.sh
bash setup-nginx.sh api.npdetail.ru
```

---

## 📁 Файлы для загрузки на сервер

Скопируйте эти файлы на VPS (`/root/`):

1. **install-gigachat-proxy.sh** — установка Node.js + прокси
2. **setup-nginx.sh** — настройка Nginx + HTTPS
3. **proxy-server-ru.js** — сам прокси (если хотите вручную)

---

## 🔗 URLs

| Сервис | URL |
|--------|-----|
| Фронтенд (Vercel) | https://life-os-seven-khaki.vercel.app |
| Прокси (после установки) | https://api.npdetail.ru/api/chat |
| Health check | https://api.npdetail.ru/health |

---

## ✅ Проверка после установки

```bash
# На сервере:
pm2 status
curl http://localhost:3000/health

# Локально (после настройки):
curl https://api.npdetail.ru/health
curl -X POST https://api.npdetail.ru/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Привет!"}]}'
```

---

## 🎯 Следующие шаги

1. **Загрузить скрипты на сервер**
   ```powershell
   scp install-gigachat-proxy.sh setup-nginx.sh root@37.252.21.153:/root/
   ```

2. **Выполнить установку**
   ```bash
   ssh root@37.252.21.153
   cd /root
   chmod +x *.sh
   bash install-gigachat-proxy.sh
   bash setup-nginx.sh api.npdetail.ru
   ```

3. **Проверить работу**
   ```bash
   curl https://api.npdetail.ru/health
   ```

4. **Протестировать фронтенд**
   - Откройте https://life-os-seven-khaki.vercel.app
   - Попробуйте AI консультантов

---

## 📞 Если что-то пошло не так

```bash
# Логи прокси
pm2 logs gigachat-proxy

# Логи Nginx
tail -f /var/log/nginx/error.log

# Перезапуск
pm2 restart gigachat-proxy
systemctl restart nginx
```

---

## 🎉 Готово!

После выполнения инструкций GigaChat API будет работать через ваш российский сервер.
