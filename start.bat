@echo off
REM ============================================================
REM Broll Studio — Start script
REM Buka API + Web UI di window terpisah
REM ============================================================

setlocal

REM Get absolute path of this script
set "ROOT=%~dp0"
set "ROOT=%ROOT:~0,-1%"

echo.
echo ============================================================
echo   Broll Studio — Starting
echo ============================================================
echo.

REM Check if already running
netstat -aon | findstr ":3001" | findstr "LISTENING" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
  echo API sudah jalan di port 3001.
) else (
  echo Starting API server...
  start "Broll API" /MIN cmd /k "pushd ""%ROOT%\api"" ^&^& node server.mjs"
  timeout /t 3 /nobreak >nul
)

netstat -aon | findstr ":5173" | findstr "LISTENING" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
  echo Web UI sudah jalan di port 5173.
) else (
  echo Starting Web UI...
  start "Broll Web" /MIN cmd /k "pushd ""%ROOT%\web"" ^&^& npm run dev"
  timeout /t 5 /nobreak >nul
)

echo.
echo ============================================================
echo.
echo   API:  http://127.0.0.1:3001
echo   Web:  http://127.0.0.1:5173
echo.
echo   Browser akan terbuka otomatis...
echo   Tekan Ctrl+C di window API atau Web untuk stop.
echo ============================================================
echo.

timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:5173"

endlocal
exit /b 0
