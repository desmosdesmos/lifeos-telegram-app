Set WshShell = CreateObject("WScript.Shell")
Set objFSO = CreateObject("Scripting.FileSystemObject")

strProject = "C:\Users\Yan\Desktop\apk LUMINA\LIFE OS"
strAndroid = strProject & "\android"

' Check if java exists
strJava = "C:\Program Files\Microsoft\jdk-17.0.18.8-hotspot\bin\java.exe"
If Not objFSO.FileExists(strJava) Then
    MsgBox "Java not found!", 16, "Error"
    WScript.Quit 1
End If

' Set environment
WshShell.Environment("PROCESS")("JAVA_HOME") = "C:\Program Files\Microsoft\jdk-17.0.18.8-hotspot"

' Change to android directory
WshShell.CurrentDirectory = strAndroid

' Run gradle
strCmd = "cmd.exe /c gradlew.bat assembleDebug --console=plain"
intReturn = WshShell.Run(strCmd, 1, True)

If intReturn = 0 Then
    strApk = strAndroid & "\app\build\outputs\apk\debug\app-debug.apk"
    If objFSO.FileExists(strApk) Then
        MsgBox "APK created successfully!" & vbCrLf & vbCrLf & strApk, 64, "Success"
        ' Open folder
        WshShell.Run "explorer /select," & strApk, 1, False
    Else
        MsgBox "Build completed but APK not found. Check console output.", 48, "Warning"
    End If
Else
    MsgBox "Build failed with error code: " & intReturn, 16, "Error"
End If
