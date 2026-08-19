@echo off
setlocal

REM ============================================================
REM ZAID PRD Motion Engine — Setup lokal
REM Install dependencies root dan Web UI
REM ============================================================

set "ROOT=%~dp0"
cd /d "%ROOT%"

echo.
echo ============================================================
echo   ZAID PRD Motion Engine — Setup
echo ============================================================
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Node.js belum terinstall.
  echo Download Node.js 18+ dari https://nodejs.org
  pause
  exit /b 1
)

echo Node version:
node --version
echo.

echo [1/2] Installing engine dependencies...
call npm install
if errorlevel 1 goto fail

echo.
echo [2/2] Installing Web UI dependencies...
call npm --prefix web install
if errorlevel 1 goto fail

echo.
echo ============================================================
echo   Setup selesai!
echo.
echo   Sekarang klik start.bat untuk membuka Motion Engine.
echo ============================================================
pause
exit /b 0

:fail
echo.
echo [ERROR] Install gagal. Cek koneksi internet lalu jalankan setup.bat lagi.
pause
exit /b 1
