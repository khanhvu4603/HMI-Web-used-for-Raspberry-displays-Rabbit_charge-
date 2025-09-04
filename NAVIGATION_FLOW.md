# 🔄 Sơ đồ điều hướng Project

## 📍 **Cấu trúc điều hướng chính:**

```
index.html (Trang 1)
    ↕️
trang0.html ← → trang2.html ← → trang3.html
    ↕️
index.html (Quay về)
```

## 🎯 **Chi tiết điều hướng:**

### **1. Trang chính (index.html):**
- **Mũi tên trái** → `src/pages/trang0.html`
- **Mũi tên phải** → `src/pages/trang2.html`

### **2. Trang 0 (trang0.html):**
- **Mũi tên trái** → `trang3.html` (trong cùng thư mục)
- **Mũi tên phải** → `../index.html` (quay về trang chính)

### **3. Trang 2 (trang2.html):**
- **Mũi tên trái** → `../index.html` (quay về trang chính)
- **Mũi tên phải** → `trang3.html` (trong cùng thư mục)
- **Phím 1** → `trang2_1.html`
- **Phím 2** → `trang2_2.html`

### **4. Trang 3 (trang3.html):**
- **Mũi tên trái** → `trang2.html` (trong cùng thư mục)
- **Mũi tên phải** → `../index.html` (quay về trang chính)

## 🔄 **Điều hướng vòng tròn:**

```
index.html → trang0.html → trang3.html → index.html
     ↑                                    ↓
     ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ←
```

## 📱 **Trang con (không có navigation arrows):**

### **Trang 2_1, 2_2:**
- **Chỉ có phím 0** → Quay về `trang2.html`
- **Click nút** → Vào trang TTTT hoặc App

### **Trang TTTT, App:**
- **Chỉ có phím 0** → Quay về `trang2.html`
- **Không có navigation arrows**

## ✅ **Đã sửa:**

1. **Trang 3** → **index.html**: `data-goto="../../index.html"` (sửa đường dẫn)
2. **Trang 0** → **index.html**: `data-goto="../../index.html"` (sửa đường dẫn)
3. **Trang 2** → **index.html**: `data-goto="../../index.html"` (sửa đường dẫn)
4. **Xóa navigation arrows** khỏi tất cả trang con
5. **Sửa script.js** để điều hướng từ trang con về trang 2 đúng
6. **Sửa script.js** để điều hướng từ trang 2 đến trang con đúng (loại bỏ đường dẫn lặp)
7. **Test** server đang chạy trên port 8080 (Status: 200 OK)

## 🚀 **Test:**

1. Mở `http://localhost:8080`
2. Click mũi tên phải → Vào trang 2
3. Click mũi tên phải → Vào trang 3  
4. Click mũi tên phải → **Quay về trang chính** ✅
