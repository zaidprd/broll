@echo off
REM ============================================================
REM Broll Studio — Stop script
REM ============================================================

echo Stopping Broll services...

for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3001" ^| findstr "LISTENING"') do (
  echo Killing API process %%a
  taskkill /F /PID %%a 2>nul
)

for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173" ^| findstr "LISTENING"') do (
  echo Killing Web process %%a
  taskkill /F /PID %%a 2>nul
)

echo.
echo Done.
pause
