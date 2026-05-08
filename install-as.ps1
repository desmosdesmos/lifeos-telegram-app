$ProgressPreference = 'SilentlyContinue'
$installerPath = "C:\Users\Yan\Desktop\apk LUMINA\LIFE OS\android-studio-installer.exe"
$downloadUrl = "https://redirector.gvt1.com/edgedl/android/studio/install/2024.2.1.12/android-studio-2024.2.1.12-windows.exe"

Write-Host "Downloading Android Studio..."
Invoke-WebRequest -Uri $downloadUrl -OutFile $installerPath -UseBasicParsing

Write-Host "Download complete: $installerPath"
Write-Host "Installing..."
Start-Process -FilePath $installerPath -ArgumentList "/S" -Wait

Write-Host "Installation complete!"
