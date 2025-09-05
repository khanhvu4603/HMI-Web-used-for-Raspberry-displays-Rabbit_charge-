# Hướng dẫn cài đặt Chrome Kiosk App

## 🚀 Cách 1: Cài đặt từ Chrome Web Store (Khuyến nghị)

### Bước 1: Chuẩn bị ứng dụng
1. Đóng tất cả cửa sổ Chrome
2. Mở Chrome và truy cập `chrome://extensions/`
3. Bật "Developer mode" (Chế độ nhà phát triển)
4. Click "Load unpacked" (Tải tiện ích chưa đóng gói)
5. Chọn thư mục chứa file `manifest.json`

### Bước 2: Cài đặt Kiosk App
1. Mở Command Prompt với quyền Administrator
2. Chạy lệnh:
```bash
"C:\Program Files\Google\Chrome\Application\chrome.exe" --app-id=YOUR_APP_ID --kiosk
```

## 🖥️ Cách 2: Chạy trực tiếp (Đơn giản hơn)

### Bước 1: Tạo shortcut
1. Tạo shortcut cho Chrome
2. Click chuột phải → Properties
3. Thêm vào Target:
```
"C:\Program Files\Google\Chrome\Application\chrome.exe" --kiosk --app=http://localhost:8080
```

### Bước 2: Chạy ứng dụng
1. Chạy server: `python -m http.server 8080`
2. Double-click shortcut vừa tạo

## ⚙️ Cách 3: Cài đặt tự động khởi động

### Tạo file batch:
```batch
@echo off
cd /d "E:\SOLARZ\ManHinh_ThanhToanTuDong\hmi-web-starter"
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --kiosk --app=http://localhost:8080
python -m http.server 8080
```

## 🔧 Các tùy chọn Chrome Kiosk

### Tham số hữu ích:
- `--kiosk`: Chế độ kiosk toàn màn hình
- `--app=URL`: Mở URL như ứng dụng
- `--disable-web-security`: Tắt bảo mật web (nếu cần)
- `--disable-features=VizDisplayCompositor`: Tối ưu hiệu suất
- `--no-first-run`: Bỏ qua setup lần đầu
- `--disable-default-apps`: Tắt ứng dụng mặc định

### Ví dụ lệnh hoàn chỉnh:
```bash
chrome.exe --kiosk --app=http://localhost:8080 --disable-web-security --no-first-run --disable-default-apps
```

## 🛡️ Bảo mật và kiểm soát

### Thoát khỏi Kiosk:
- **Alt + F4**: Thoát ứng dụng
- **Ctrl + Alt + Delete**: Mở Task Manager
- **Alt + Tab**: Chuyển ứng dụng (nếu không bị vô hiệu hóa)

### Khóa hoàn toàn:
- Sử dụng phần mềm khóa bàn phím
- Cài đặt Windows Kiosk Mode
- Sử dụng Group Policy

## 📱 Tối ưu cho màn hình cảm ứng

### Thêm vào HTML:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
```

## 🔄 Tự động khởi động với Windows

### Tạo file registry:
```reg
Windows Registry Editor Version 5.00

[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Run]
"HMI-Kiosk"="C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe --kiosk --app=http://localhost:8080"
```

## ⚠️ Lưu ý quan trọng

1. **Backup dữ liệu**: Luôn backup trước khi cài đặt
2. **Test kỹ**: Test trên máy khác trước khi triển khai
3. **Cập nhật**: Thường xuyên cập nhật Chrome
4. **Giám sát**: Có kế hoạch giám sát từ xa
5. **Sao lưu**: Sao lưu cấu hình và dữ liệu

## 🎯 Kết quả mong đợi

- ✅ Tự động mở toàn màn hình
- ✅ Không có thanh địa chỉ
- ✅ Không có menu Chrome
- ✅ Tự động khởi động với Windows
- ✅ Khó thoát khỏi chế độ kiosk
- ✅ Giao diện chuyên nghiệp

