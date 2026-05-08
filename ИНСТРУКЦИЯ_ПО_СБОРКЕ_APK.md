# 📱 Инструкция по сборке APK - Lumina LifeOS

## ✅ Проект готов к сборке!

Веб-приложение Telegram Mini App полностью перенесено в Android с помощью **Capacitor**.

---

## 🚀 Быстрая сборка APK

### Вариант 1: Через Android Studio (РЕКОМЕНДУЕТСЯ)

**Android Studio уже запущена!**

1. **Откройте проект в Android Studio:**
   - В окне Android Studio нажмите **Open** 
   - Выберите папку: `C:\Users\Yan\Desktop\apk LUMINA\LIFE OS\android`
   - ИЛИ через меню: `File` → `Open` → выберите папку `android`

2. **Дождитесь синхронизации Gradle** (может занять 2-5 минут при первом запуске)

3. **Соберите APK:**
   - Меню `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`

4. **Готово!** APK находится в:
   ```
   C:\Users\Yan\Desktop\apk LUMINA\LIFE OS\android\app\build\outputs\apk\debug\app-debug.apk
   ```

---

### Вариант 2: Через командную строку (если SDK установлен)

```bash
cd C:\Users\Yan\Desktop\apk LUMINA\LIFE OS\android
gradlew.bat assembleDebug
```

---

## 📋 Установка на устройство

### Через USB:
1. Включите **Отладку по USB** на устройстве
2. Подключите устройство к компьютеру
3. Установите APK:
   ```bash
   adb install C:\Users\Yan\Desktop\apk LUMINA\LIFE OS\android\app\build\outputs\apk\debug\app-debug.apk
   ```

### Прямая установка:
- Скопируйте файл `app-debug.apk` на устройство
- Откройте через файловый менеджер
- Разрешите установку из неизвестных источников

---

## 📁 Расположение файлов

| Файл | Путь |
|------|------|
| Исходный код | `C:\Users\Yan\Desktop\apk LUMINA\LIFE OS\src\` |
| Веб-сборка | `C:\Users\Yan\Desktop\apk LUMINA\LIFE OS\dist\` |
| Android проект | `C:\Users\Yan\Desktop\apk LUMINA\LIFE OS\android\` |
| Готовый APK | `android\app\build\outputs\apk\debug\app-debug.apk` |

---

## ⚙️ Настройки приложения

- **Название:** Lumina LifeOS
- **Package ID:** com.lumina.lifeos
- **Min SDK:** Android 7.0 (API 24)
- **Target SDK:** Android 14 (API 34)

---

## 🔧 Полезные команды

```bash
# Пересобрать веб-приложение и синхронизировать
npm run android:build

# Открыть в Android Studio
npm run cap:open

# Синхронизировать изменения
npx cap sync android
```

---

## ❓ Решение проблем

### "SDK location not found"
1. Откройте Android Studio
2. При первом запуске мастер настройки автоматически установит SDK
3. Или укажите путь в `android\local.properties`:
   ```
   sdk.dir=C:\\Users\\Yan\\AppData\\Local\\Android\\Sdk
   ```

### "Java not found"
Java JDK 17 требуется для сборки. Установите из:
https://www.oracle.com/java/technologies/downloads/#jdk17-windows

### "Gradle sync failed"
- Меню `File` → `Invalidate Caches` → `Restart`
- Попробуйте снова собрать проект

---

## 🎉 Готово!

После сборки вы получите APK файл который можно:
- ✅ Установить на любое Android устройство
- ✅ Отправить пользователям для тестирования
- ✅ Загрузить в Google Play Console

**Весь функционал Telegram Mini App полностью сохранён!**
