# HMI Kiosk App - Raspberry Pi Setup Guide

Hướng dẫn triển khai HMI Kiosk App trên Raspberry Pi với Ubuntu/Raspberry Pi OS.

## 🍓 Yêu cầu hệ thống

### Raspberry Pi
- **Raspberry Pi 4** (khuyến nghị) hoặc Pi 3B+
- **RAM**: Tối thiểu 2GB, khuyến nghị 4GB+
- **Storage**: 16GB+ microSD card
- **OS**: Raspberry Pi OS hoặc Ubuntu 20.04+

### Màn hình
- **Resolution**: 1920x1080 (Full HD) hoặc cao hơn
- **Touchscreen**: Tùy chọn, hỗ trợ touch input

## 🚀 Cài đặt nhanh

### Bước 1: Chuẩn bị Raspberry Pi
```bash
# Cập nhật hệ thống
sudo apt update && sudo apt upgrade -y

# Cài đặt Git (nếu chưa có)
sudo apt install git -y
```

### Bước 2: Tải project
```bash
# Clone project
git clone <your-repo-url>
cd hmi-web-starter

# Hoặc tải file ZIP và giải nén
```

### Bước 3: Chạy script cài đặt
```bash
# Cấp quyền thực thi
chmod +x install-raspberry.sh

# Chạy script cài đặt
./install-raspberry.sh
```

### Bước 4: Khởi động ứng dụng
```bash
# Chế độ kiosk đầy đủ
./start-kiosk.sh

# Hoặc chế độ đơn giản
./start-simple.sh
```

## 🔧 Cài đặt thủ công

### 1. Cài đặt Chromium
```bash
# Raspberry Pi OS
sudo apt install chromium-browser -y

# Ubuntu
sudo apt install chromium-browser -y
# Hoặc cài Chrome
wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" | sudo tee /etc/apt/sources.list.d/google-chrome.list
sudo apt update
sudo apt install google-chrome-stable -y
```

### 2. Cài đặt Python3
```bash
sudo apt install python3 python3-pip -y
```

### 3. Cài đặt các package cần thiết
```bash
sudo apt install curl lsof -y
```

## ⚙️ Cấu hình

### Autostart (Tự động khởi động)
```bash
# Tạo desktop file
mkdir -p ~/.config/autostart
cat > ~/.config/autostart/hmi-kiosk.desktop << EOF
[Desktop Entry]
Type=Application
Name=HMI Kiosk App
Comment=HMI Thanh Toan Tu Dong
Exec=/path/to/your/hmi-web-starter/start-kiosk.sh
Path=/path/to/your/hmi-web-starter
Hidden=false
NoDisplay=false
X-GNOME-Autostart-enabled=true
EOF
```

### Cấu hình màn hình
```bash
# Hiển thị thông tin màn hình
xrandr

# Thiết lập độ phân giải (nếu cần)
xrandr --output HDMI-1 --mode 1920x1080

# Tắt screensaver
xset s off
xset -dpms
xset s noblank
```

### Cấu hình Chromium cho Raspberry Pi
```bash
# Tạo file cấu hình
mkdir -p ~/.config/chromium/Default
cat > ~/.config/chromium/Default/Preferences << EOF
{
  "profile": {
    "default_content_setting_values": {
      "notifications": 2
    }
  }
}
EOF
```

## 🎮 Sử dụng

### Khởi động
```bash
# Chế độ kiosk đầy đủ (khuyến nghị)
./start-kiosk.sh

# Chế độ đơn giản
./start-simple.sh
```

### Dừng ứng dụng
- **Ctrl+C** trong terminal
- **Alt+F4** trong Chrome
- **Ctrl+Alt+T** để mở terminal mới

### Debug
```bash
# Mở terminal mới
Ctrl+Alt+T

# Kiểm tra process
ps aux | grep chrome
ps aux | grep python

# Kill process
pkill chrome
pkill python3
```

## 🔧 Troubleshooting

### Chrome không mở
```bash
# Kiểm tra Chrome
which chromium-browser
which google-chrome

# Chạy với debug
chromium-browser --no-sandbox --disable-gpu --remote-debugging-port=9222
```

### Port 8080 bị chiếm
```bash
# Kiểm tra port
sudo lsof -i :8080

# Kill process
sudo fuser -k 8080/tcp
```

### Lỗi quyền
```bash
# Cấp quyền thực thi
chmod +x *.sh

# Chạy với sudo (nếu cần)
sudo ./start-kiosk.sh
```

### Màn hình không hiển thị đúng
```bash
# Kiểm tra độ phân giải
xrandr

# Thiết lập độ phân giải
xrandr --output HDMI-1 --mode 1920x1080

# Tắt overscan
sudo raspi-config
# Advanced Options > Overscan > Disable
```

### Performance chậm
```bash
# Tăng GPU memory
sudo raspi-config
# Advanced Options > Memory Split > 128

# Tắt desktop (chỉ chạy kiosk)
sudo systemctl set-default multi-user.target
```

## 📱 Touchscreen Support

### Cấu hình touchscreen
```bash
# Kiểm tra touchscreen
xinput list

# Calibrate touchscreen
sudo apt install xinput-calibrator -y
xinput_calibrator
```

### Cấu hình rotation
```bash
# Xoay màn hình 90 độ
xrandr --output HDMI-1 --rotate left

# Xoay màn hình 180 độ
xrandr --output HDMI-1 --rotate inverted

# Xoay màn hình 270 độ
xrandr --output HDMI-1 --rotate right
```

## 🔄 Auto-restart

### Tạo service systemd
```bash
# Tạo service file
sudo nano /etc/systemd/system/hmi-kiosk.service
```

```ini
[Unit]
Description=HMI Kiosk App
After=graphical.target

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/hmi-web-starter
ExecStart=/home/pi/hmi-web-starter/start-kiosk.sh
Restart=always
RestartSec=10

[Install]
WantedBy=graphical.target
```

```bash
# Enable service
sudo systemctl enable hmi-kiosk.service
sudo systemctl start hmi-kiosk.service

# Kiểm tra status
sudo systemctl status hmi-kiosk.service
```

## 📊 Monitoring

### Log files
```bash
# Xem logs
journalctl -u hmi-kiosk.service -f

# Xem logs Chrome
tail -f ~/.config/chromium/chrome_debug.log
```

### Performance monitoring
```bash
# CPU usage
top

# Memory usage
free -h

# Disk usage
df -h
```

## 🎯 Tối ưu hóa

### Raspberry Pi 4
- **GPU Memory**: 128MB
- **Overclock**: Tùy chọn
- **Cooling**: Quạt tản nhiệt

### Raspberry Pi 3B+
- **GPU Memory**: 64MB
- **Không overclock**
- **Cooling**: Tản nhiệt passive

### Network
```bash
# Cấu hình static IP
sudo nano /etc/dhcpcd.conf

# Thêm vào cuối file
interface eth0
static ip_address=192.168.1.100/24
static routers=192.168.1.1
static domain_name_servers=8.8.8.8
```

## 🚨 Lưu ý quan trọng

1. **Backup**: Luôn backup SD card trước khi cài đặt
2. **Power**: Sử dụng nguồn 5V/3A chính hãng
3. **Cooling**: Cần tản nhiệt cho Pi 4
4. **Storage**: Sử dụng SD card Class 10 trở lên
5. **Network**: Cấu hình mạng ổn định

## 📞 Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra logs: `journalctl -u hmi-kiosk.service -f`
2. Restart service: `sudo systemctl restart hmi-kiosk.service`
3. Reboot Pi: `sudo reboot`
4. Liên hệ team phát triển



