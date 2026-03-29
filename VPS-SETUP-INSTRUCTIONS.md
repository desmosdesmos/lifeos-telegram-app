# 🔧 Настройка GigaChat Proxy на вашем VPS

## Ваши данные

| Параметр | Значение |
|----------|----------|
| Домен | npdetail.ru |
| Поддомен | api.npdetail.ru |
| IP сервера | 37.252.21.153 |
| Провайдер | Timeweb Cloud |
| SSH порт | 22 |

---

## ❗ Проблема: SSH не подключается

```
ssh: connect to host 37.252.21.153 port 22: Connection timed out
```

**Возможные причины:**
1. SSH не включён в панели Timeweb
2. Неправильный IP адрес
3. Firewall блокирует порт 22

---

## ✅ Решение

### Шаг 1: Проверить сервер в панели Timeweb

1. Зайдите в панель: https://timeweb.cloud
2. Перейдите в раздел **VPS**
3. Найдите сервер с IP `37.252.21.153`
4. Проверите статус — должен быть **Включён**
5. Проверите IP адрес в деталях сервера

### Шаг 2: Включить SSH (если нужно)

В панели Timeweb:
1. Выберите сервер
2. Перейдите в **Настройки** → **Доступ**
3. Убедитесь, что SSH включён
4. Проверите пароль root

### Шаг 3: Подключиться к серверу

**Windows (PowerShell):**
```powershell
ssh root@37.252.21.153
```

**Windows (CMD):**
```cmd
ssh root@37.252.21.153
```

**Если спросит пароль:**
- Введите пароль root (символы не отображаются)
- Или используйте SSH ключ из панели Timeweb

---

## 📁 Загрузка файлов на сервер

### Способ 1: Через SCP (рекомендуется)

Откройте PowerShell в папке проекта:

```powershell
cd "C:\Users\Yan\Desktop\vibe co\LIFE OS"

# Загрузить скрипты
scp install-gigachat-proxy.sh setup-nginx.sh root@37.252.21.153:/root/
```

### Способ 2: Через WinSCP / FileZilla

1. Скачайте WinSCP: https://winscp.net
2. Подключитесь:
   - Host: `37.252.21.153`
   - Username: `root`
   - Password: ваш пароль
3. Скопируйте файлы в `/root/`

### Способ 3: Через панель Timeweb

1. Зайдите в панель Timeweb
2. Выберите сервер → **Файловый менеджер**
3. Создайте файлы вручную и скопируйте содержимое

---

## 🚀 Установка на сервере

После подключения по SSH:

```bash
# Перейти в директорию
cd /root

# Сделать скрипты исполняемыми
chmod +x install-gigachat-proxy.sh setup-nginx.sh

# Запустить установку прокси
bash install-gigachat-proxy.sh

# Настроить HTTPS
bash setup-nginx.sh api.npdetail.ru
```

---

## ✅ Проверка

```bash
# Проверить статус прокси
pm2 status

# Проверить Health check
curl http://localhost:3000/health

# Проверить HTTPS
curl https://api.npdetail.ru/health
```

---

## 🔗 После установки

1. **Проверьте API:**
   ```bash
   curl -X POST https://api.npdetail.ru/api/chat \
     -H "Content-Type: application/json" \
     -d '{"messages":[{"role":"user","content":"Привет!"}]}'
   ```

2. **Фронтенд уже обновлён** и использует `https://api.npdetail.ru/api/chat`

3. **Vercel задеплоен:** https://life-os-seven-khaki.vercel.app

---

## 🆘 Если сервер не найден

### Проверьте IP в панели Timeweb

Возможно IP адрес изменился. Зайдите в панель и проверьте актуальный IP.

### Используйте консоль Timeweb

Если SSH не работает, используйте встроенную консоль в панели Timeweb:
1. Выберите сервер
2. Нажмите **Консоль** или **Terminal**
3. Выполните команды установки

---

## 📞 Поддержка Timeweb

Если не получается подключиться:
- Чат поддержки: https://timeweb.cloud/support
- Телефон: 8-800-555-10-37
