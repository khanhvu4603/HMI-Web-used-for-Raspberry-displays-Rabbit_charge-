# Hướng Dẫn Triển Khai HMI Web Starter

## Mục Lục
1. [Chạy trên thiết bị local (cùng mạng)](#chạy-trên-thiết-bị-local-cùng-mạng)
2. [Chạy trên Raspberry Pi](#chạy-trên-raspberry-pi)
3. [Chạy trên thiết bị di động](#chạy-trên-thiết-bị-di-động)
4. [Deploy lên cloud miễn phí](#deploy-lên-cloud-miễn-phí)
5. [Chạy offline (không cần internet)](#chạy-offline-không-cần-internet)
6. [Troubleshooting](#troubleshooting)
7. [Tối ưu hóa](#tối-ưu-hóa)

---

## Chạy trên thiết bị local (cùng mạng)

### Bước 1: Tìm IP của máy chủ

**Windows:**
```cmd
ipconfig
```
Tìm dòng **IPv4 Address** (ví dụ: `192.168.1.100`)

**Linux/Mac:**
```bash
ifconfig
# hoặc
ip addr show
```

### Bước 2: Khởi động server

**Cách 1: Sử dụng Python**
```bash
# Vào thư mục project
cd hmi-web-starter

# Khởi động server
python -m http.server 8000

# Hoặc cho Python 3
python3 -m http.server 8000
```

**Cách 2: Sử dụng Node.js**
```bash
# Cài đặt dependencies (nếu cần)
npm install

# Khởi động server
npm start
```

**Cách 3: Sử dụng PHP**
```bash
php -S 0.0.0.0:8000
```

### Bước 3: Truy cập từ thiết bị khác

- **Máy tính khác**: Mở browser → `http://192.168.1.100:8000`
- **Điện thoại**: Mở browser → `http://192.168.1.100:8000`
- **Tablet**: Mở browser → `http://192.168.1.100:8000`

### Bước 4: Mở firewall (nếu cần)

**Windows:**
```cmd
# Mở Command Prompt as Administrator
netsh advfirewall firewall add rule name="HMI Web" dir=in action=allow protocol=TCP localport=8000
```

**Linux:**
```bash
sudo ufw allow 8000
```

---

## Chạy trên Raspberry Pi

### Bước 1: Chuẩn bị Raspberry Pi

**Cài đặt hệ điều hành:**
1. Tải Raspberry Pi OS từ [raspberrypi.org](https://www.raspberrypi.org/downloads/)
2. Sử dụng Raspberry Pi Imager để ghi vào thẻ SD
3. Cắm thẻ SD vào Raspberry Pi và khởi động

**Cài đặt Python:**
```bash
# Cập nhật hệ thống
sudo apt update && sudo apt upgrade -y

# Cài đặt Python (thường đã có sẵn)
python3 --version
```

### Bước 2: Copy project lên Raspberry Pi

**Cách 1: Sử dụng SCP**
```bash
# Từ máy Windows/Linux
scp -r hmi-web-starter pi@192.168.1.50:/home/pi/
```

**Cách 2: Clone từ GitHub**
```bash
# SSH vào Raspberry Pi
ssh pi@192.168.1.50

# Clone project
git clone https://github.com/khanhvu4603/HMI-Web-used-for-Raspberry-displays-Rabbit_charge-.git
cd HMI-Web-used-for-Raspberry-displays-Rabbit_charge-
```

**Cách 3: Copy qua USB**
1. Copy thư mục project vào USB
2. Cắm USB vào Raspberry Pi
3. Copy từ USB vào thư mục home

### Bước 3: Khởi động server

```bash
# Vào thư mục project
cd hmi-web-starter

# Khởi động server
python3 -m http.server 8000
```

### Bước 4: Tự động khởi động khi boot

**Tạo service file:**
```bash
sudo nano /etc/systemd/system/hmi-web.service
```

**Nội dung file service:**
```ini
[Unit]
Description=HMI Web Application
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/hmi-web-starter
ExecStart=/usr/bin/python3 -m http.server 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

**Kích hoạt service:**
```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable service
sudo systemctl enable hmi-web.service

# Start service
sudo systemctl start hmi-web.service

# Kiểm tra status
sudo systemctl status hmi-web.service
```

### Bước 5: Cấu hình tự động mở browser

**Cài đặt Chromium:**
```bash
sudo apt install chromium-browser -y
```

**Tạo script khởi động:**
```bash
nano ~/start-hmi.sh
```

**Nội dung script:**
```bash
#!/bin/bash
# Chờ mạng khởi động
sleep 10

# Khởi động HMI service
sudo systemctl start hmi-web.service

# Chờ service khởi động
sleep 5

# Mở browser fullscreen
chromium-browser --kiosk --disable-infobars --disable-session-crashed-bubble --disable-web-security --user-data-dir=/tmp/chrome_dev_session http://localhost:8000
```

**Cấp quyền thực thi:**
```bash
chmod +x ~/start-hmi.sh
```

**Thêm vào autostart:**
```bash
# Tạo file desktop
mkdir -p ~/.config/autostart
nano ~/.config/autostart/hmi-web.desktop
```

**Nội dung file desktop:**
```ini
[Desktop Entry]
Type=Application
Name=HMI Web Starter
Exec=/home/pi/start-hmi.sh
Hidden=false
NoDisplay=false
X-GNOME-Autostart-enabled=true
```

---

## Chạy trên thiết bị di động

### Android - Sử dụng Termux

**Bước 1: Cài đặt Termux**
1. Tải Termux từ [F-Droid](https://f-droid.org/packages/com.termux/) (khuyến nghị)
2. Hoặc từ Google Play Store

**Bước 2: Cài đặt dependencies**
```bash
# Cập nhật packages
pkg update && pkg upgrade

# Cài đặt Python và Git
pkg install python git

# Cài đặt Node.js (tùy chọn)
pkg install nodejs npm
```

**Bước 3: Clone và chạy project**
```bash
# Clone project
git clone https://github.com/khanhvu4603/HMI-Web-used-for-Raspberry-displays-Rabbit_charge-.git
cd HMI-Web-used-for-Raspberry-displays-Rabbit_charge-

# Khởi động server
python -m http.server 8000
```

**Bước 4: Truy cập**
- Mở browser trên Android → `http://localhost:8000`
- Hoặc từ thiết bị khác → `http://[IP-Android]:8000`

### iOS - Sử dụng iSH

**Bước 1: Cài đặt iSH**
1. Tải iSH từ App Store
2. Mở iSH

**Bước 2: Cài đặt dependencies**
```bash
# Cập nhật packages
apk update

# Cài đặt Python và Git
apk add python3 git

# Cài đặt Node.js (tùy chọn)
apk add nodejs npm
```

**Bước 3: Clone và chạy project**
```bash
# Clone project
git clone https://github.com/khanhvu4603/HMI-Web-used-for-Raspberry-displays-Rabbit_charge-.git
cd HMI-Web-used-for-Raspberry-displays-Rabbit_charge-

# Khởi động server
python3 -m http.server 8000
```

---

## Deploy lên cloud miễn phí

### GitHub Pages

**Bước 1: Chuẩn bị repository**
```bash
# Tạo branch gh-pages
git checkout -b gh-pages

# Copy file index.html vào root
cp index.html ./

# Commit và push
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages
```

**Bước 2: Kích hoạt GitHub Pages**
1. Vào repository trên GitHub
2. Settings → Pages
3. Source: Deploy from a branch
4. Branch: gh-pages
5. Save

**Truy cập:** `https://[username].github.io/[repository-name]`

### Netlify

**Cách 1: Drag & Drop**
1. Truy cập [netlify.com](https://netlify.com)
2. Đăng ký/đăng nhập
3. Kéo thả thư mục project vào vùng "Deploy manually"
4. Nhận URL miễn phí

**Cách 2: Kết nối GitHub**
1. New site from Git
2. Chọn GitHub repository
3. Build command: `echo "No build needed"`
4. Publish directory: `.`
5. Deploy site

### Vercel

**Cách 1: Sử dụng Vercel CLI**
```bash
# Cài đặt Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts
```

**Cách 2: Kết nối GitHub**
1. Truy cập [vercel.com](https://vercel.com)
2. Import project từ GitHub
3. Deploy

### Firebase Hosting

**Bước 1: Cài đặt Firebase CLI**
```bash
npm install -g firebase-tools
```

**Bước 2: Khởi tạo project**
```bash
firebase login
firebase init hosting
```

**Bước 3: Deploy**
```bash
firebase deploy
```

---

## Chạy offline (không cần internet)

### Tạo file HTML standalone

**Bước 1: Tạo file offline.html**
```html
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HMI Web - Offline</title>
    <style>
        /* Copy toàn bộ CSS từ src/assets/css/styles.css vào đây */
        *{margin:0;padding:0;box-sizing:border-box}
        :root{
          --bg:#2c2c2c;
          --fg:#ffffff;
          --arrowSize: clamp(44px, 6vmin, 80px);
        }
        /* ... (copy toàn bộ CSS) ... */
    </style>
</head>
<body>
    <main class="stage">
        <!-- Copy toàn bộ HTML từ index.html vào đây -->
        <img class="slide-img" src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..." alt="Trang hiển thị" />
        <!-- ... (copy toàn bộ HTML) ... -->
    </main>

    <script>
        // Copy toàn bộ JavaScript từ src/assets/js/script.js vào đây
        document.querySelectorAll('.nav-arrow').forEach(btn => {
            btn.addEventListener('click', () => {
                const url = btn.dataset.goto;
                if (url && url !== '#') window.location.href = url;
            });
        });
        // ... (copy toàn bộ JavaScript) ...
    </script>
</body>
</html>
```

**Bước 2: Chuyển đổi ảnh thành base64**
```bash
# Sử dụng online tool hoặc script
# Ví dụ: https://www.base64-image.de/
```

**Bước 3: Lưu và chạy**
- Lưu file `offline.html`
- Mở bằng browser bất kỳ
- Không cần server, chạy trực tiếp

---

## Troubleshooting

### Lỗi không truy cập được từ thiết bị khác

**Kiểm tra IP:**
```bash
# Windows
ipconfig | findstr "IPv4"

# Linux/Mac
hostname -I
```

**Kiểm tra firewall:**
```bash
# Windows
netsh advfirewall show allprofiles

# Linux
sudo ufw status
```

**Kiểm tra port:**
```bash
# Windows
netstat -an | findstr :8000

# Linux
netstat -tulpn | grep :8000
```

### Lỗi CORS

**Sử dụng flag --cors:**
```bash
python -m http.server 8000 --cors
```

**Hoặc sử dụng Node.js server:**
```bash
npx http-server -p 8000 --cors
```

### Lỗi chậm

**Sử dụng port khác:**
```bash
python -m http.server 8080
```

**Tối ưu ảnh:**
- Nén ảnh trước khi sử dụng
- Sử dụng format WebP
- Giảm kích thước ảnh

### Lỗi trên Raspberry Pi

**Kiểm tra service:**
```bash
sudo systemctl status hmi-web.service
sudo journalctl -u hmi-web.service -f
```

**Restart service:**
```bash
sudo systemctl restart hmi-web.service
```

---

## Tối ưu hóa

### Cho touchscreen

**Thêm vào package.json:**
```json
{
  "scripts": {
    "touch": "python -m http.server 8000 --bind 0.0.0.0",
    "kiosk": "python -m http.server 8000 --bind 0.0.0.0 --cors"
  }
}
```

**Cấu hình browser cho kiosk mode:**
```bash
# Chrome/Chromium
chromium-browser --kiosk --disable-infobars --disable-session-crashed-bubble --disable-web-security --user-data-dir=/tmp/chrome_dev_session http://localhost:8000

# Firefox
firefox -kiosk http://localhost:8000
```

### Cho performance

**Nén CSS và JS:**
```bash
# Cài đặt minifier
npm install -g clean-css-cli uglify-js

# Nén CSS
cleancss -o src/assets/css/styles.min.css src/assets/css/styles.css

# Nén JS
uglifyjs src/assets/js/script.js -o src/assets/js/script.min.js
```

**Tối ưu ảnh:**
```bash
# Cài đặt ImageMagick
# Windows: Tải từ imagemagick.org
# Linux: sudo apt install imagemagick

# Nén ảnh
magick convert src/assets/images/trang1.jpg -quality 80 -resize 1920x1080 src/assets/images/trang1_optimized.jpg
```

### Cho production

**Tạo file .htaccess (Apache):**
```apache
# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache static files
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
</IfModule>
```

---

## Kết luận

Với hướng dẫn này, bạn có thể:
- ✅ Chạy project trên bất kỳ thiết bị nào
- ✅ Deploy lên cloud miễn phí
- ✅ Chạy offline không cần internet
- ✅ Tối ưu hóa cho production
- ✅ Troubleshoot các lỗi thường gặp

**Lưu ý:** Luôn test trên thiết bị thật trước khi deploy production!

---

*Tạo bởi: HMI Web Starter Team*  
*Cập nhật: 2025*
