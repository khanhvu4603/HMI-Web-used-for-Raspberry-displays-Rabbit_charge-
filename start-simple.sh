#!/bin/bash

# HMI Simple Start - Linux/Raspberry Pi
# Chạy: chmod +x start-simple.sh && ./start-simple.sh

echo "Starting HMI Application..."

# Tìm Chrome/Chromium
if command -v google-chrome &> /dev/null; then
    CHROME_CMD="google-chrome"
elif command -v chromium-browser &> /dev/null; then
    CHROME_CMD="chromium-browser"
elif command -v chromium &> /dev/null; then
    CHROME_CMD="chromium"
else
    echo "ERROR: Chrome/Chromium not found!"
    exit 1
fi

# Khởi động server HTTP
python3 -m http.server 8080 &
SERVER_PID=$!

# Đợi 3 giây
sleep 3

# Mở Chrome kiosk
$CHROME_CMD --kiosk --app=http://localhost:8080 &
CHROME_PID=$!

# Cleanup function
cleanup() {
    kill $CHROME_PID 2>/dev/null || true
    kill $SERVER_PID 2>/dev/null || true
    exit 0
}

trap cleanup SIGINT SIGTERM

echo "Done! Press Ctrl+C to exit."
wait $CHROME_PID
cleanup



