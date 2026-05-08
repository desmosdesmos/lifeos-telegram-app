$files = Get-ChildItem 'C:\Android\cmdline-tools\latest' -Recurse -File
$files | Select-Object -First 20 FullName | Out-File 'C:\Users\Yan\Desktop\apk LUMINA\LIFE OS\android-files.txt'
Write-Host "Files found: $($files.Count)"
