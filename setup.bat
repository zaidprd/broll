@echo off
REM ============================================================
REM Broll Studio — Setup script
REM Install semua dependencies (root + api + web)
REM ============================================================

echo.
echo ============================================================
echo   Broll Studio — Setup
echo ============================================================
echo.

REM Check Node
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
  echo [ERROR] Node.js belum terinstall.
  echo Download dari https://nodejs.org
  pause
  exit /b 1
)

echo Node version:
node --version
echo.

REM Root dependencies
echo [1/3] Installing root dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 goto fail

REM API dependencies
echo.
echo [2/3] Installing API dependencies...
cd /d "%~dp0api"
call npm install
if %ERRORLEVEL% NEQ 0 goto fail

REM Web dependencies
echo.
echo [3/3] Installing Web dependencies...
cd /d "%~dp0web"
call npm install
if %ERRORLEVEL% NEQ 0 goto fail

echo.
echo ============================================================
echo   Setup selesai!
echo.
echo   Run start.bat untuk mulai.
echo ============================================================
pause
exit /b 0

:fail
echo.
echo [ERROR] Install gagal. Cek koneksi internet lalu coba lagi.
pause
exit /b 1
