@echo off
echo Starting PLC WebSocket Server...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Python is not installed or not in PATH
    echo Please install Python 3.7+ and try again
    pause
    exit /b 1
)

REM Install requirements if needed
echo Installing Python dependencies...
pip install -r requirements.txt

echo.
echo Starting PLC WebSocket Server on localhost:8765
echo Reading PLC registers 0-9 from 192.168.0.8:502
echo Press Ctrl+C to stop
echo.

REM Start the PLC server
python ketnoi.py

pause

