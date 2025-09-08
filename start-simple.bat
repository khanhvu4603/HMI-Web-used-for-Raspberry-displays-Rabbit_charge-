@echo off
title HMI Simple Start
echo Starting HMI Application...

REM Khởi động server HTTP
start /min python -m http.server 8080

REM Đợi 3 giây
timeout /t 3 /nobreak >nul

REM Mở Chrome kiosk
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --kiosk --app=http://localhost:8080

echo Done! Press Alt+F4 to exit.



