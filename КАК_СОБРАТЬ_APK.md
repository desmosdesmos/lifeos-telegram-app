# 🚀 Как собрать APK для Android

## ✅ Всё готово!

Проект настроен для сборки в Android APK с помощью **Capacitor**. Весь функционал Telegram Mini App полностью перенесён без изменений.

---

## 📋 Варианты сборки

### Вариант 1: Через Android Studio (РЕКОМЕНДУЕТСЯ)

1. **Откройте проект в Android Studio:**
   ```bash
   npm run cap:open
   ```

2. **Дождитесь загрузки** (Gradle синхронизируется)

3. **Соберите APK:**
   - Меню `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
   
4. **Готово!** APK находится в папке:
   ```
   android\app\build\outputs\apk\debug\app-debug.apk
   ```

---

### Вариант 2: Если уже установлена Java

1. **Соберите через командную строку:**
   ```bash
   cd android
   gradlew.bat assembleDebug
   ```

2. **APK готов!** Файл в той же папке.

---

## 🔧 Если Java не установлена

### Установите JDK 17:

1. Скачайте с официального сайта: https://www.oracle.com/java/technologies/downloads/
2. Или используйте OpenJDK: https://adoptium.net/
3. После установки перезапустите терминал

### Или установите Android Studio:
- Скачайте: https://developer.android.com/studio
- Android Studio автоматически установит нужную версию Java

---

## 📱 Установка на телефон

1. Подключите телефон по USB
2. Включите **Отладку по USB** в настройках разработчика
3. Установите через ADB:
   ```bash
   adb install android/app/build/outputs/apk/debug/app-debug.apk
   ```

**Или просто:**
- Скопируйте APK файл на телефон
- Откройте через файловый менеджер
- Установите как обычное приложение

---

## 🎯 Новые команды в package.json

```bash
# Полная сборка + синхронизация
npm run android:build

# Открыть в Android Studio
npm run cap:open

# Синхронизировать изменения
npm run cap:sync
```

---

## 📁 Структура

```
LIFE OS/
├── dist/                    # Веб-сборка приложения
├── android/                 # Android проект (Capacitor)
│   └── app/
│       └── src/main/
│           ├── assets/public/  # Сюда копируется dist/
│           └── AndroidManifest.xml
├── capacitor.config.ts    # Настройки Capacitor
└── ANDROID_BUILD.md       # Подробная инструкция
```

---

## ✨ Что было сделано

- ✅ Установлен Capacitor с поддержкой Android
- ✅ Настроен `capacitor.config.ts` 
- ✅ Добавлены разрешения на камеру и хранилище
- ✅ Настроены цвета темы (#0B0B0F фон, #4DA3FF акцент)
- ✅ Добавлены скрипты для удобной сборки
- ✅ Веб-файлы автоматически копируются в Android проект

---

## 🎉 Готово!

Теперь вы можете собрать APK и установить приложение на любое Android устройство.

**Весь функционал Telegram Mini App полностью сохранён!**
