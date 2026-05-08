$installerPath = "C:\Users\Yan\Desktop\apk LUMINA\LIFE OS\android-studio-installer.exe"
$downloadUrl = "https://redirector.gvt1.com/edgedl/android/studio/install/2024.2.1.12/android-studio-2024.2.1.12-windows.exe"

Write-Host "Downloading Android Studio using BITS..."
Start-BitsTransfer -Source $downloadUrl -Destination $installerPath -DisplayName "Android Studio" -Description "Downloading Android Studio Installer"

if (Test-Path $installerPath) {
    $size = (Get-Item $installerPath).Length / 1GB
    Write-Host "Download complete! Size: $([math]::Round($size, 2)) GB"
    Write-Host "Starting installation..."
    Start-Process -FilePath $installerPath -ArgumentList "/S" -Wait
    Write-Host "Installation complete!"
} else {
    Write-Host "Download failed!"
}
