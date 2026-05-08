# 📱 Lumina LifeOS - Android APK

## ✅ Проект готов к сборке!

Веб-приложение полностью перенесено в Android с помощью **Capacitor**. Весь функционал Telegram Mini App сохранён без изменений.

---

## 🚀 Быстрая сборка APK

### Способ 1: Через Android Studio (РЕКОМЕНДУЕТСЯ)

1. **Запустите скрипт сборки:**
   ```bash
   build-android-apk.bat
   ```
   
   ИЛИ выполните команду:
   ```bash
   npm run cap:open
   ```

2. **Дождитесь загрузки Android Studio**

3. **Соберите APK:**
   - Меню `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`

4. **Готово!** APK находится в:
   ```
   android\app\build\outputs\apk\debug\app-debug.apk
   ```

---

### Способ 2: Автоматическая установка Android Studio

Если Android Studio не установлена, выполните:

```bash
winget install Google.AndroidStudio
```

После установки запустите:
```bash
npm run cap:open
```

---

## 📋 Команды

| Команда | Описание |
|---------|----------|
| `npm run cap:open` | Открыть проект в Android Studio |
| `npm run android:build` | Сборка веб-приложения + синхронизация |
| `npm run cap:sync` | Синхронизировать изменения с Android |
| `build-android-apk.bat` | Мастер сборки APK |

---

## 📁 Структура

```
LIFE OS/
├── dist/                          # Веб-сборка приложения
├── android/                       # Android проект
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── assets/public/    # Веб-файлы (из dist/)
│   │   │   ├── java/             # Native код
│   │   │   ├── res/              # Ресурсы (иконки, стили)
│   │   │   └── AndroidManifest.xml
│   │   └── build/outputs/apk/    # Готовые APK файлы
│   └── build.gradle
├── capacitor.config.ts           # Настройки Capacitor
├── package.json                  # NPM скрипты
└── КАК_СОБРАТЬ_APK.md            # Инструкция (русский)
```

---

## ⚙️ Настройки

### Разрешения (AndroidManifest.xml)
- ✅ Интернет (INTERNET)
- ✅ Камера (CAMERA)
- ✅ Хранилище (READ/WRITE_EXTERNAL_STORAGE)
- ✅ Media Images (READ_MEDIA_IMAGES)

### Тема приложения
- Background: #0B0B0F
- Blue Accent: #4DA3FF
- Green Accent: #22C55E

### Версии SDK
- minSdkVersion: 24 (Android 7.0)
- targetSdkVersion: 34 (Android 14)
- compileSdkVersion: 34

---

## 🔧 Требования

1. **Java JDK 17** ✅ Установлен
   - Путь: `C:\Program Files\Microsoft\jdk-17.0.18.8-hotspot`

2. **Android Studio** ⏳ Устанавливается
   - Скачать: https://developer.android.com/studio

3. **Node.js** ✅ Установлен
   - Для сборки веб-приложения

---

## 📱 Установка на устройство

### Через USB:
1. Включите **Отладку по USB** на устройстве
2. Подключите устройство к компьютеру
3. Установите APK:
   ```bash
   adb install android/app/build/outputs/apk/debug/app-debug.apk
   ```

### Прямая установка:
- Скопируйте APK файл на устройство
- Откройте через файловый менеджер
- Разрешите установку из неизвестных источников

---

## ❓ Решение проблем

### "SDK location not found"
Android Studio автоматически настроит SDK при первом запуске.

### "Java not found"
Java JDK 17 уже установлен в системе.

### "Gradle sync failed"
- Откройте Android Studio
- File → Invalidate Caches → Restart
- Попробуйте снова

### "Build failed"
- Проверьте что все зависимости установлены
- Попробуйте: `npm install && npm run build`

---

## 📞 Поддержка

Если возникли проблемы:
1. Проверьте что Android Studio установлена
2. Запустите `build-android-apk.bat`
3. Следуйте инструкциям в окне

---

## 🎉 Готово!

После сборки вы получите APK файл который можно:
- Установить на любое Android устройство
- Отправить пользователям для тестирования
- Загрузить в Google Play Console

**Весь функционал Telegram Mini App полностью сохранён!**
