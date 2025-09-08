#!/bin/bash

# HMI Kiosk App - Raspberry Pi Installation Script
# Chạy: chmod +x install-raspberry.sh && ./install-raspberry.sh

echo "========================================"
echo "   HMI KIOSK APP - RASPBERRY PI SETUP"
echo "========================================"
echo

# Cập nhật hệ thống
echo "[1/6] Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Cài đặt Chromium
echo "[2/6] Installing Chromium browser..."
sudo apt install chromium-browser -y

# Cài đặt Python3 (thường đã có sẵn)
echo "[3/6] Installing Python3..."
sudo apt install python3 python3-pip -y

# Cài đặt các package cần thiết
echo "[4/6] Installing required packages..."
sudo apt install curl lsof -y

# Cài đặt Node.js (tùy chọn, cho development)
echo "[5/6] Installing Node.js (optional)..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs -y

# Cấu hình autostart (tùy chọn)
echo "[6/6] Setting up autostart (optional)..."
read -p "Do you want to auto-start the kiosk app on boot? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Tạo desktop file cho autostart
    cat > ~/.config/autostart/hmi-kiosk.desktop << EOF
[Desktop Entry]
Type=Application
Name=HMI Kiosk App
Comment=HMI Thanh Toan Tu Dong
Exec=$(pwd)/start-kiosk.sh
Path=$(pwd)
Hidden=false
NoDisplay=false
X-GNOME-Autostart-enabled=true
EOF
    echo "✓ Autostart configured"
fi

# Cấu hình quyền
echo "Setting permissions..."
chmod +x start-kiosk.sh
chmod +x start-simple.sh

echo
echo "========================================"
echo "    INSTALLATION COMPLETED!"
echo "========================================"
echo
echo "To start the application:"
echo "  ./start-kiosk.sh"
echo
echo "To start simple mode:"
echo "  ./start-simple.sh"
echo
echo "To stop: Press Ctrl+C or Alt+F4"
echo
echo "For troubleshooting, check the logs above."



