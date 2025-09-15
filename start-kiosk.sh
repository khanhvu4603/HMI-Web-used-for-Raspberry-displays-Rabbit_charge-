#!/bin/bash

# HMI Kiosk App - Linux/Raspberry Pi
# Chạy: chmod +x start-kiosk.sh && ./start-kiosk.sh

echo "========================================"
echo "   HMI THANH TOAN TU DONG - KIOSK APP"
echo "========================================"
echo

# Kiểm tra Chrome/Chromium
echo "[1/4] Checking Chrome/Chromium installation..."
if command -v google-chrome &> /dev/null; then
    CHROME_CMD="google-chrome"
elif command -v chromium-browser &> /dev/null; then
    CHROME_CMD="chromium-browser"
elif command -v chromium &> /dev/null; then
    CHROME_CMD="chromium"
else
    echo "ERROR: Chrome/Chromium not found!"
    echo "Please install Chrome or Chromium first:"
    echo "  Ubuntu/Debian: sudo apt install chromium-browser"
    echo "  Raspberry Pi OS: sudo apt install chromium-browser"
    echo "  Or download Chrome: https://www.google.com/chrome/"
    exit 1
fi
echo "✓ Chrome/Chromium found: $CHROME_CMD"

# Kiểm tra Python
echo "[2/4] Checking Python installation..."
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python3 not found!"
    echo "Please install Python3 first:"
    echo "  sudo apt update && sudo apt install python3"
    exit 1
fi
echo "✓ Python3 found"

# Kiểm tra port 8080
echo "[3/4] Checking port 8080..."
if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "WARNING: Port 8080 is already in use!"
    echo "Trying to kill existing process..."
    sudo fuser -k 8080/tcp 2>/dev/null || true
    sleep 2
fi

# Khởi động server HTTP
echo "[4/4] Starting HTTP server..."
python3 -m http.server 8080 &
SERVER_PID=$!

# Đợi server khởi động
echo "Waiting for server to start..."
sleep 3

# Kiểm tra server
echo "Testing server connection..."
if curl -s http://localhost:8080 >/dev/null 2>&1; then
    echo "✓ Server is running"
else
    echo "WARNING: Server might not be ready, but continuing..."
fi

# Khởi động Chrome Kiosk
echo
echo "Starting Chrome in Kiosk mode..."
echo
echo "========================================"
echo "    APPLICATION IS STARTING..."
echo "========================================"
echo
echo "To exit: Press Alt+F4 or Ctrl+Alt+T then kill process"
echo "To debug: Press Ctrl+Alt+T to open terminal"
echo

# Lệnh Chrome tối ưu cho Raspberry Pi
$CHROME_CMD --kiosk --app=http://localhost:8080 \
    --user-data-dir="/tmp/hmi-kiosk-data" \
    --disable-web-security \
    --no-first-run \
    --disable-default-apps \
    --disable-features=VizDisplayCompositor \
    --disable-background-timer-throttling \
    --disable-renderer-backgrounding \
    --disable-backgrounding-occluded-windows \
    --disable-ipc-flooding-protection \
    --disable-hang-monitor \
    --disable-prompt-on-repost \
    --disable-sync \
    --disable-translate \
    --disable-logging \
    --silent-launch \
    --no-report-upload \
    --disable-breakpad \
    --disable-client-side-phishing-detection \
    --disable-component-extensions-with-background-pages \
    --disable-domain-reliability \
    --disable-features=TranslateUI \
    --memory-pressure-off \
    --max_old_space_size=4096 \
    --disable-gpu-sandbox \
    --disable-software-rasterizer \
    --disable-background-networking \
    --disable-background-timer-throttling \
    --disable-renderer-backgrounding \
    --disable-backgrounding-occluded-windows \
    --disable-features=TranslateUI \
    --disable-ipc-flooding-protection \
    --disable-renderer-backgrounding \
    --disable-backgrounding-occluded-windows &

CHROME_PID=$!

# Cleanup function
cleanup() {
    echo
    echo "Shutting down..."
    kill $CHROME_PID 2>/dev/null || true
    kill $SERVER_PID 2>/dev/null || true
    echo "Application closed."
    exit 0
}

# Trap signals for cleanup
trap cleanup SIGINT SIGTERM

# Wait for Chrome to exit
wait $CHROME_PID

# Cleanup
cleanup



