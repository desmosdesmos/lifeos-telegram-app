@echo off
echo [1/2] Building Web Assets...
call npm run build
echo [2/2] Syncing to Android Studio...
call npx cap sync android
echo Done! Now press 'Run' in Android Studio.
pause
