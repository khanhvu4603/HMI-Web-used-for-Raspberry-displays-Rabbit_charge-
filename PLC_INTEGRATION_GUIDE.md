# Hướng dẫn tích hợp PLC Real-time với HMI Web

## Tổng quan
Hệ thống tích hợp PLC với HMI Web sử dụng WebSocket để truyền dữ liệu real-time từ PLC đến giao diện web.

## Kiến trúc hệ thống
```
PLC (192.168.0.8:502) ←→ Python WebSocket Server (localhost:8765) ←→ HMI Web Frontend
```

## Cài đặt và chạy

### 1. Cài đặt Python dependencies
```bash
pip install -r requirements.txt
```

### 2. Chạy PLC WebSocket Server

**Windows:**
```bash
start-plc-server.bat
```

**Linux/Mac:**
```bash
./start-plc-server.sh
```

**Hoặc chạy trực tiếp:**
```bash
python ketnoi.py
```

### 3. Mở HMI Web
- Mở file `src/pages/trang2_dual_TrangThaiDangSac.html` trong browser
- Dữ liệu sẽ cập nhật real-time từ PLC

## Mapping địa chỉ Modbus

| Register | Thông số | Mô tả | Khung |
|----------|----------|-------|-------|
| 2 | powerAC | P (AC) - Công suất AC | A |
| 3 | energyAC | E (AC) - Năng lượng AC | A |
| 4 | kwhAC | kWh (AC) - Kilowatt-hour AC | A |
| 5 | kwhDC | kWh (DC) - Kilowatt-hour DC | B |
| 6 | socDC | SOC (DC) - Phần trăm pin (x%) | B |
| 7 | voltageDC | U (DC) - Điện áp DC | B |
| 8 | currentDC | I (DC) - Dòng điện DC | B |
| 9 | powerDC | P (DC) - Công suất DC | B |
| 10 | energyDC | E (DC) - Năng lượng DC | B |

## Cấu hình

### Thay đổi địa chỉ PLC
Sửa trong file `ketnoi.py`:
```python
self.plc_client = ModbusTcpClient('192.168.0.8', port=502)
```

### Thay đổi địa chỉ WebSocket
Sửa trong file `src/assets/js/plc-websocket.js`:
```javascript
this.ws = new WebSocket('ws://localhost:8765');
```

### Thay đổi tần suất đọc dữ liệu
Sửa trong file `ketnoi.py`:
```python
await asyncio.sleep(1)  # 1 giây
```

## Giao diện hiển thị

### Khung A (AC Parameters)
- **P (W)**: Công suất AC từ register 2
- **E (kWh)**: Năng lượng AC từ register 3  
- **kWh (AC)**: Kilowatt-hour AC từ register 4

### Khung B (DC Parameters)
- **kWh (DC)**: Kilowatt-hour DC từ register 5
- **SOC**: Phần trăm pin từ register 6
- **U (V)**: Điện áp DC từ register 7
- **I (A)**: Dòng điện DC từ register 8
- **P (W)**: Công suất DC từ register 9
- **E (kWh)**: Năng lượng DC từ register 10

## Scaling Factors

Nếu dữ liệu từ PLC cần chia/chia để đúng đơn vị, sửa trong `ketnoi.py`:

```python
# Ví dụ: nếu voltage cần chia 10
'voltageDC': registers[6] / 10.0,

# Ví dụ: nếu current cần chia 100  
'currentDC': registers[7] / 100.0,
```

## Troubleshooting

### 1. Không kết nối được PLC
- Kiểm tra IP và port PLC
- Kiểm tra kết nối mạng
- Kiểm tra PLC có đang chạy không

### 2. WebSocket không kết nối
- Kiểm tra Python server có đang chạy không
- Kiểm tra port 8765 có bị chiếm không
- Kiểm tra firewall

### 3. Dữ liệu không hiển thị
- Mở Developer Tools (F12) xem console log
- Kiểm tra WebSocket connection status
- Kiểm tra element IDs trong HTML

## Log và Debug

### Python Server Log
Server sẽ in log ra console:
```
PLC Data: Status=2, U=220, I=15, P=3300, E=2.5, SOC=75%
```

### Browser Console Log
Mở F12 → Console để xem:
```
✅ Connected to PLC WebSocket
PLC Data Updated: {status: 2, voltage: 220, current: 15, ...}
```

## Các trang hỗ trợ

Hiện tại WebSocket client sẽ tự động kích hoạt trên các trang có các element:
- `voltage`, `current`, `power`, `energy`
- `battery-percent`, `kwh-dc`
- `charging-status`

## Mở rộng

### Thêm trang mới
1. Thêm các element với ID tương ứng
2. Include `plc-websocket.js` trong trang
3. Dữ liệu sẽ tự động cập nhật

### Thêm thông số mới
1. Sửa `ketnoi.py` để đọc thêm register
2. Sửa `plc-websocket.js` để hiển thị thông số mới
3. Thêm element HTML với ID tương ứng

## Liên hệ hỗ trợ
Nếu có vấn đề, kiểm tra:
1. Console log của Python server
2. Browser console log
3. Network tab trong Developer Tools
