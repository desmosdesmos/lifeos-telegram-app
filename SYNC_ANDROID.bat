@echo off
echo [1/3] Building Web Assets...
call npm run build
echo [2/3] Syncing to Android Studio...
call npx cap sync android

echo [3/3] Patching Java versions for compatibility...
powershell -Command "(Get-Content -Path 'android/app/capacitor.build.gradle') -replace 'VERSION_21', 'VERSION_17' | Set-Content -Path 'android/app/capacitor.build.gradle'"
powershell -Command "(Get-Content -Path 'android/capacitor-cordova-android-plugins/build.gradle') -replace 'VERSION_21', 'VERSION_17' | Set-Content -Path 'android/capacitor-cordova-android-plugins/build.gradle'"

echo Done! Now press 'Run' in Android Studio.
pause
