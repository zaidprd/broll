@echo off
setlocal

REM ============================================================
REM ZAID PRD Motion Engine — Start lokal
REM Jalankan API + Web UI dari root project dengan npm run ui
REM ============================================================

set "ROOT=%~dp0"

echo.
echo ============================================================
echo   ZAID PRD Motion Engine — Starting
echo ============================================================
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Node.js belum ditemukan.
  echo Install Node.js 18+ dari https://nodejs.org
  pause
  exit /b 1
)

if not exist "%ROOT%node_modules" (
  echo [ERROR] Dependencies belum diinstall.
  echo Klik setup.bat terlebih dahulu, lalu coba start.bat lagi.
  pause
  exit /b 1
)

if not exist "%ROOT%web\node_modules" (
  echo [ERROR] Dependencies web belum diinstall.
  echo Klik setup.bat terlebih dahulu, lalu coba start.bat lagi.
  pause
  exit /b 1
)

netstat -aon | findstr ":3001" | findstr "LISTENING" >nul 2>&1
set "API_RUNNING=%ERRORLEVEL%"
netstat -aon | findstr ":5173" | findstr "LISTENING" >nul 2>&1
set "WEB_RUNNING=%ERRORLEVEL%"

if "%API_RUNNING%"=="0" if "%WEB_RUNNING%"=="0" (
  echo Motion Engine sudah berjalan.
  start "" "http://127.0.0.1:5173"
  exit /b 0
)

echo Menjalankan API dan Web UI...
echo Window baru akan terbuka. Biarkan window tersebut tetap menyala.
echo.

REM /D memastikan npm run ui selalu berjalan dari root project.
start "ZAID PRD Motion Engine" /D "%ROOT%" cmd /k "npm run ui"

timeout /t 4 /nobreak >nul
start "" "http://127.0.0.1:5173"

endlocal
exit /b 0
