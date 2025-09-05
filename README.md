# HMI Thanh Toán Tự Động - Kiosk App

Hệ thống giao diện người dùng (HMI) cho trạm sạc xe điện với chế độ kiosk tự động.

## 🚀 Khởi động nhanh

### Windows
```bash
# Cách 1: Kiosk Mode (Khuyến nghị)
start-kiosk.bat

# Cách 2: Simple Mode
start-simple.bat
```

### Linux/Raspberry Pi
```bash
# Cấp quyền thực thi
chmod +x *.sh

# Cài đặt tự động
./install-raspberry.sh

# Khởi động
./start-kiosk.sh
```

## 📁 Cấu trúc dự án

```
hmi-web-starter/
├── index.html                    # Trang chính
├── src/
│   ├── assets/
│   │   ├── css/
│   │   │   └── styles.css        # CSS chính
│   │   ├── js/
│   │   │   ├── script.js         # JavaScript chính
│   │   │   ├── config.js         # Cấu hình
│   │   │   └── api.js            # API functions
│   │   └── images/               # Ảnh giao diện
│   └── pages/                    # Các trang con
├── start-kiosk.bat              # Script khởi động kiosk
├── start-simple.bat             # Script khởi động đơn giản
├── manifest.json                # Chrome app manifest
└── background.js                # Chrome app background
```

## 🎯 Navigation Flow

```
index → trang2 → trang3 → trang0 → index
```

### Phím tắt

**Trang 2:**
- Phím `1` → trang2_1 (khung A)
- Phím `2` → trang2_2 (khung B)

**Trang con:**
- Phím `0` → về trang2

**Chuyển đổi giữa TTTT:**
- `trang2_1_TTTT` + phím `2` → `trang2_2_TTTT`
- `trang2_2_TTTT` + phím `1` → `trang2_1_TTTT`

## 🖥️ Các trang

### Trang chính
- **index.html** - Trang chính (ảnh trang1.jpg)
- **trang2.html** - Trang 2 (ảnh trang2.jpg)
- **trang3.html** - Trang 3 (ảnh trang3.jpg)
- **trang0.html** - Trang 0 (ảnh trang0.jpg)

### Trang con trang 2
- **trang2_1.html** - Trang 2.1 (khung A)
- **trang2_1_TTTT.html** - Thanh toán trực tiếp 2.1
- **trang2_1_app.html** - App Rabbit EVC 2.1
- **trang2_2.html** - Trang 2.2 (khung B)
- **trang2_2_TTTT.html** - Thanh toán trực tiếp 2.2
- **trang2_2_app.html** - App Rabbit EVC 2.2

### Trang thanh toán
- **payment.html** - Trang thanh toán
- **monitor.html** - Trang giám sát

## ⌨️ Bàn phím ảo

**Chức năng:**
- Click vào ô nhập số tiền → Hiện bàn phím ảo
- Nhập số → Format với dấu phẩy
- ⌫ → Xóa ký tự cuối
- Xóa → Xóa toàn bộ
- Enter → Chốt số tiền
- Đóng → Ẩn bàn phím

## 🔧 Cài đặt

### Windows
**Yêu cầu:**
- Windows 10/11
- Google Chrome
- Python 3.x

**Cài đặt:**
1. Tải và cài đặt [Google Chrome](https://www.google.com/chrome/)
2. Tải và cài đặt [Python](https://www.python.org/downloads/)
3. Clone hoặc tải project này
4. Chạy `start-kiosk.bat`

### Linux/Raspberry Pi
**Yêu cầu:**
- Ubuntu 20.04+ hoặc Raspberry Pi OS
- Chromium/Chrome
- Python 3.x

**Cài đặt:**
1. Clone project: `git clone <repo-url>`
2. Chạy script cài đặt: `./install-raspberry.sh`
3. Khởi động: `./start-kiosk.sh`

**Chi tiết:** Xem [RASPBERRY_PI_GUIDE.md](RASPBERRY_PI_GUIDE.md)

## 🎮 Sử dụng

### Khởi động Kiosk Mode
1. Chạy `start-kiosk.bat`
2. Ứng dụng sẽ tự động mở Chrome ở chế độ kiosk
3. Để thoát: Nhấn `Alt + F4`

### Điều hướng
- **Mũi tên trái/phải**: Chuyển trang
- **Phím số**: Điều hướng nhanh
- **Click**: Tương tác với giao diện

## 🎨 Tùy chỉnh

### Thay đổi ảnh
- Thay thế file ảnh trong `src/assets/images/`
- Đảm bảo tên file trùng với tên trang

### Thay đổi layout
- Chỉnh sửa `src/assets/css/styles.css`
- Khung A: `top: 19.8%; left: 21.3%`
- Khung B: `top: 19.6%; right: 21.2%`

### Thay đổi logic
- Chỉnh sửa `src/assets/js/script.js`
- Thêm phím tắt mới trong event listener

## 🐛 Troubleshooting

### Chrome không mở
- Kiểm tra Chrome đã cài đặt chưa
- Thử chạy `start-simple.bat`

### Port 8080 bị chiếm
- Script sẽ tự động kill process cũ
- Hoặc thay đổi port trong script

### Bàn phím ảo không hiện
- Kiểm tra JavaScript console (F12)
- Đảm bảo file script.js được load

## 📝 License

MIT License - Xem file LICENSE để biết thêm chi tiết.

## 🤝 Hỗ trợ

Nếu gặp vấn đề, vui lòng tạo issue hoặc liên hệ: khanhvu4603@gmail.com