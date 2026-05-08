# 📱 Инструкция по сборке Android APK

## Требования

1. **Android Studio** (скачать: https://developer.android.com/studio)
2. **Java JDK 17** (обычно идёт в комплекте с Android Studio)
3. **Android SDK** (устанавливается через Android Studio)

## Быстрая сборка

### Вариант 1: Через Android Studio (рекомендуется)

1. Откройте проект в Android Studio:
   ```bash
   npm run cap:open
   ```
   Или вручную откройте папку `android` в Android Studio.

2. Дождитесь синхронизации Gradle.

3. Для сборки **Debug APK**:
   - В меню: `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
   - APK будет создан в: `android/app/build/outputs/apk/debug/app-debug.apk`

4. Для сборки **Release APK**:
   - В меню: `Build` → `Generate Signed Bundle / APK`
   - Выберите `APK`
   - Создайте новый ключ (keystore) или используйте существующий
   - Выберите сборку `release`
   - APK будет создан в: `android/app/build/outputs/apk/release/`

### Вариант 2: Через командную строку (Gradle)

1. Синхронизируйте Capacitor:
   ```bash
   npm run android:build
   ```

2. Перейдите в Android папку:
   ```bash
   cd android
   ```

3. Сборка Debug APK (Windows):
   ```cmd
   gradlew.bat assembleDebug
   ```
   
   Или на Linux/Mac:
   ```bash
   ./gradlew assembleDebug
   ```

4. APK будет создан в:
   ```
   android/app/build/outputs/apk/debug/app-debug.apk
   ```

5. Сборка Release APK (требуется подпись):
   ```cmd
   gradlew.bat assembleRelease
   ```

## Установка на устройство

### Через USB:
1. Включите **Отладку по USB** на устройстве
2. Подключите устройство к компьютеру
3. Установите APK:
   ```bash
   adb install android/app/build/outputs/apk/debug/app-debug.apk
   ```

### Прямая установка:
- Скопируйте APK файл на устройство
- Откройте файл через файловый менеджер
- Разрешите установку из неизвестных источников
- Установите приложение

## Генерация ключа для подписи Release APK

```bash
keytool -genkey -v -keystore lumina-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias lumina
```

## Структура Android проекта

```
android/
├── app/
│   ├── src/main/
│   │   ├── assets/public/    # Веб-файлы приложения (из dist/)
│   │   ├── res/              # Ресурсы (иконки, стили)
│   │   └── AndroidManifest.xml
│   └── build/                # Выходные файлы (APK)
├── build.gradle
└── gradlew.bat
```

## Полезные команды

```bash
# Синхронизировать веб-сборку с Android
npm run cap:sync

# Открыть в Android Studio
npm run cap:open

# Полная пересборка
npm run build && npx cap sync android
```

## Решение проблем

### Ошибка: SDK location not found
Укажите путь к SDK в файле `android/local.properties`:
```
sdk.dir=C:\\Users\\YourName\\AppData\\Local\\Android\\Sdk
```

### Ошибка: Java version
Убедитесь, что используется Java 17:
```bash
java -version
```

### Ошибка: Недостаточно памяти
Увеличьте память для Gradle в `android/gradle.properties`:
```
org.gradle.jvmargs=-Xmx2048m
```

## Готово! 🎉

После сборки APK файл можно:
- Отправить пользователям
- Загрузить в Google Play Console
- Установить на устройство для тестирования
