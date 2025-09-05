@echo off
title HMI Kiosk App
color 0A
echo.
echo ========================================
echo    HMI THANH TOAN TU DONG - KIOSK APP
echo ========================================
echo.

REM Kiểm tra Chrome có tồn tại không
echo [1/4] Checking Chrome installation...
if not exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    if not exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
        echo ERROR: Chrome not found!
        echo Please install Google Chrome first.
        echo Download from: https://www.google.com/chrome/
        pause
        exit
    ) else (
        set CHROME_PATH="C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
    )
) else (
    set CHROME_PATH="C:\Program Files\Google\Chrome\Application\chrome.exe"
)
echo ✓ Chrome found: %CHROME_PATH%

REM Kiểm tra Python
echo [2/4] Checking Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python not found!
    echo Please install Python first.
    echo Download from: https://www.python.org/downloads/
    pause
    exit
)
echo ✓ Python found

REM Kiểm tra port 8080
echo [3/4] Checking port 8080...
netstat -an | find "8080" >nul
if not errorlevel 1 (
    echo WARNING: Port 8080 is already in use!
    echo Trying to kill existing process...
    for /f "tokens=5" %%a in ('netstat -ano ^| find "8080"') do taskkill /f /pid %%a >nul 2>&1
    timeout /t 2 /nobreak >nul
)

REM Khởi động server HTTP
echo [4/4] Starting HTTP server...
start /min python -m http.server 8080

REM Đợi server khởi động
echo Waiting for server to start...
timeout /t 3 /nobreak >nul

REM Kiểm tra server
echo Testing server connection...
curl -s http://localhost:8080 >nul 2>&1
if errorlevel 1 (
    echo WARNING: Server might not be ready, but continuing...
)

REM Khởi động Chrome Kiosk
echo.
echo Starting Chrome in Kiosk mode...
echo.
echo ========================================
echo    APPLICATION IS STARTING...
echo ========================================
echo.
echo To exit: Press Alt+F4
echo To debug: Press F12 (before kiosk mode)
echo.

REM Lệnh Chrome tối ưu
%CHROME_PATH% --kiosk --app=http://localhost:8080 --disable-web-security --no-first-run --disable-default-apps --disable-features=VizDisplayCompositor --disable-background-timer-throttling --disable-renderer-backgrounding --disable-backgrounding-occluded-windows --disable-ipc-flooding-protection --disable-hang-monitor --disable-prompt-on-repost --disable-sync --disable-translate --disable-logging --silent-launch --no-report-upload --disable-breakpad --disable-client-side-phishing-detection --disable-component-extensions-with-background-pages --disable-domain-reliability --disable-features=TranslateUI --disable-ipc-flooding-protection --disable-renderer-backgrounding --disable-backgrounding-occluded-windows --disable-features=TranslateUI --disable-ipc-flooding-protection --disable-renderer-backgrounding --disable-backgrounding-occluded-windows


echo.
echo Application closed.
pause
