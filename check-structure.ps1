$paths = @(
    'C:\Users\Yan\Desktop\apk LUMINA\LIFE OS\android-sdk',
    'C:\Users\Yan\Desktop\apk LUMINA\LIFE OS\android-sdk\cmdline-tools',
    'C:\Users\Yan\Desktop\apk LUMINA\LIFE OS\android-sdk\cmdline-tools\latest',
    'C:\Users\Yan\Desktop\apk LUMINA\LIFE OS\android-sdk\cmdline-tools\latest\bin'
)

foreach ($path in $paths) {
    $exists = Test-Path $path
    Write-Host "$path - Exists: $exists"
}

$files = Get-ChildItem 'C:\Users\Yan\Desktop\apk LUMINA\LIFE OS\android-sdk' -Recurse -File -Filter '*.bat'
Write-Host "BAT files found: $($files.Count)"
$files | ForEach-Object { Write-Host $_.FullName }
