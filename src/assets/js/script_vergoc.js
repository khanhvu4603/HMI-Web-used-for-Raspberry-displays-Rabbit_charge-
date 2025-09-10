// Ngăn context menu chuột phải và các phím tắt không mong muốn
document.addEventListener('contextmenu', function(e) {
  e.preventDefault();
  return false;
});

// Ngăn các phím tắt F12, Ctrl+Shift+I, Ctrl+U, v.v.
document.addEventListener('keydown', function(e) {
  // Ngăn F12 (Developer Tools)
  if (e.key === 'F12') {
    e.preventDefault();
    return false;
  }
  
  // Ngăn Ctrl+Shift+I (Developer Tools)
  if (e.ctrlKey && e.shiftKey && e.key === 'I') {
    e.preventDefault();
    return false;
  }
  
  // Ngăn Ctrl+U (View Source)
  if (e.ctrlKey && e.key === 'u') {
    e.preventDefault();
    return false;
  }
  
  // Ngăn Ctrl+S (Save)
  if (e.ctrlKey && e.key === 's') {
    e.preventDefault();
    return false;
  }
  
  // Ngăn Ctrl+A (Select All)
  if (e.ctrlKey && e.key === 'a') {
    e.preventDefault();
    return false;
  }
});

// Điều hướng: chỉnh data-goto trên mỗi nút cho đúng trang của bạn
document.querySelectorAll('.nav-arrow').forEach(btn => {
    btn.addEventListener('click', () => {
      const url = btn.dataset.goto;
      if (url && url !== '#') window.location.href = url;
    });
  });

// Điều hướng cho nút trong khung trống
document.querySelectorAll('.khung-button').forEach(btn => {
    btn.addEventListener('click', () => {
      const url = btn.dataset.goto;
      if (url && url !== '#') window.location.href = url;
    });
  });

// Điều hướng bằng phím số
document.addEventListener('keydown', (event) => {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  // Thoát ứng dụng bằng Ctrl+Q hoặc Escape (chỉ dành cho admin)
  if ((event.ctrlKey && event.key === 'q') || event.key === 'Escape') {
    // Xác nhận trước khi thoát
    if (confirm('Bạn có chắc chắn muốn thoát ứng dụng?')) {
      // Đóng cửa sổ Chrome App
      if (chrome && chrome.app && chrome.app.window) {
        chrome.app.window.current().close();
      } else {
        // Fallback cho trường hợp không phải Chrome App
        window.close();
      }
    }
    return;
  }
  
  
  // Nếu đang ở trang 2 và nhấn phím 1
  if (currentPage === 'trang2.html' && event.key === '1') {
    window.location.href = 'trang2_1.html';
  }
  
  // Nếu đang ở trang 2 và nhấn phím 2
  if (currentPage === 'trang2.html' && event.key === '2') {
    window.location.href = 'trang2_2.html';
  }
  
  // Nếu đang ở trang 2_1 và nhấn phím 0
  if (currentPage === 'trang2_1.html' && event.key === '0') {
    window.location.href = 'trang2.html';
  }
  
  // Nếu đang ở trang 2_2 và nhấn phím 0
  if (currentPage === 'trang2_2.html' && event.key === '0') {
    window.location.href = 'trang2.html';
  }
  
  // Nếu đang ở trang 2_1_TTTT và nhấn phím 0
  if (currentPage === 'trang2_1_TTTT.html' && event.key === '0') {
    window.location.href = 'trang2.html';
  }
  
  // Nếu đang ở trang 2_1_app và nhấn phím 0
  if (currentPage === 'trang2_1_app.html' && event.key === '0') {
    window.location.href = 'trang2.html';
  }
  
  // Nếu đang ở trang 2_2_TTTT và nhấn phím 0
  if (currentPage === 'trang2_2_TTTT.html' && event.key === '0') {
    window.location.href = 'trang2.html';
  }
  
  // Nếu đang ở trang 2_2_app và nhấn phím 0
  if (currentPage === 'trang2_2_app.html' && event.key === '0') {
    window.location.href = 'trang2.html';
  }
//////////////////////////////////////////////////////////////////////////////////////////////////  
  // Nếu đang ở trang dual và nhấn phím 0 - quay về trang 2
  if ((currentPage === 'trang2_dual.html' || 
       currentPage === 'trang2_dual_TTTT.html' || 
       currentPage === 'trang2_dual_app.html') && event.key === '0') {
    window.location.href = 'trang2.html';
  }
  
  // Nếu đang ở trang dual và nhấn phím 1 - chỉ hiển thị khung A
  if (currentPage === 'trang2_dual.html' && event.key === '1') {
    window.location.href = 'trang2_1.html';
  }
  if (currentPage === 'trang2_dual_TTTT.html' && event.key === '1') {
    window.location.href = 'trang2_1_TTTT.html';
  }
  if (currentPage === 'trang2_dual_app.html' && event.key === '1') {
    window.location.href = 'trang2_1_app.html';
  }
  
  // Nếu đang ở trang dual và nhấn phím 2 - chỉ hiển thị khung B
  if (currentPage === 'trang2_dual.html' && event.key === '2') {
    window.location.href = 'trang2_2.html';
  }
  if (currentPage === 'trang2_dual_TTTT.html' && event.key === '2') {
    window.location.href = 'trang2_2_TTTT.html';
  }
  if (currentPage === 'trang2_dual_app.html' && event.key === '2') {
    window.location.href = 'trang2_2_app.html';
  }
  
  // Chuyển từ trang 2_1 sang trang 2_2 (phím 2) - hiển thị cả hai
  if ((currentPage === 'trang2_1.html' || 
       currentPage === 'trang2_1_TTTT.html' || 
       currentPage === 'trang2_1_app.html') && event.key === '2') {
    // Xác định trang dual tương ứng
    if (currentPage === 'trang2_1_TTTT.html') {
      window.location.href = 'trang2_dual_TTTT.html';
    } else if (currentPage === 'trang2_1_app.html') {
      window.location.href = 'trang2_dual_app.html';
    } else {
      window.location.href = 'trang2_dual.html';
    }
  }
  
  // Chuyển từ trang 2_2 sang trang 2_1 (phím 1) - hiển thị cả hai
  if ((currentPage === 'trang2_2.html' || 
       currentPage === 'trang2_2_TTTT.html' || 
       currentPage === 'trang2_2_app.html') && event.key === '1') {
    // Xác định trang dual tương ứng
    if (currentPage === 'trang2_2_TTTT.html') {
      window.location.href = 'trang2_dual_TTTT.html';
    } else if (currentPage === 'trang2_2_app.html') {
      window.location.href = 'trang2_dual_app.html';
    } else {
      window.location.href = 'trang2_dual.html';
    }
  }
  
  // Chuyển từ trang 2_1_TTTT sang trang 2_dual_TTTT_Buttons_A (phím 2) - khung A TTTT, khung B Buttons
  if (currentPage === 'trang2_1_TTTT.html' && event.key === '2') {
    window.location.href = 'trang2_dual_TTTT_Buttons_A.html';
  }
  
  // Chuyển từ trang 2_2_TTTT sang trang 2_dual_TTTT_Buttons_B (phím 1) - khung A Buttons, khung B TTTT
  if (currentPage === 'trang2_2_TTTT.html' && event.key === '1') {
    window.location.href = 'trang2_dual_TTTT_Buttons_B.html';
  }
  
  // Chuyển từ trang 2_1_app sang trang 2_2_app (phím 2) - hiển thị cả hai
  if (currentPage === 'trang2_1_app.html' && event.key === '2') {
    window.location.href = 'trang2_dual_app.html';
  }
  
  // Chuyển từ trang 2_2_app sang trang 2_1_app (phím 1) - hiển thị cả hai
  if (currentPage === 'trang2_2_app.html' && event.key === '1') {
    window.location.href = 'trang2_dual_app.html';
  }
  
  // Chuyển từ trang 2_1_TTTT sang trang 2_1_TrangThaiSac (phím 4) - sau khi hiện QR
  if (currentPage === 'trang2_1_TTTT.html' && event.key === '4') {
    window.location.href = 'trang2_1_TrangThaiSac.html';
  }
  
  // Chuyển từ trang 2_2_TTTT sang trang 2_2_TrangThaiSac (phím 4) - sau khi hiện QR
  if (currentPage === 'trang2_2_TTTT.html' && event.key === '4') {
    window.location.href = 'trang2_2_TrangThaiSac.html';
  }
  
  // Chuyển từ trang 2_2_TTTT sang trang 2_2_TrangThaiSac (phím 5) - sau khi hiện QR
  if (currentPage === 'trang2_2_TTTT.html' && event.key === '5') {
    window.location.href = 'trang2_2_TrangThaiSac.html';
  }
  
  // Chuyển từ trang 2_1 sang trang 2_dual (phím 2) - hiển thị cả hai khung cơ bản
  if (currentPage === 'trang2_1.html' && event.key === '2') {
    window.location.href = 'trang2_dual.html';
  }
  
  // // Chuyển từ trang 2_1_TTTT sang trang 2_dual_QR_Buttons_B (phím 2) - khung A có QR, khung B có nút thanh toán
  // if (currentPage === 'trang2_1_TTTT.html' && event.key === '2') {
  //   window.location.href = 'trang2_dual_QR_Buttons_B.html';
  // }
  
  // Chuyển từ trang 2_1_TTTT sang trang 2_dual_TTTT_Buttons_B (phím 1) - khung A có nút thanh toán, khung B TTTT
  if (currentPage === 'trang2_1_TTTT.html' && event.key === '1') {
    window.location.href = 'trang2_dual_TTTT_Buttons_A.html';
  }
  
  // Chuyển từ trang 2_1_TrangThaiSac sang trang 2_dual_TrangThaiDangSac_A (phím 2) - khung A đang sạc, khung B có nút thanh toán
  if (currentPage === 'trang2_1_TrangThaiSac.html' && event.key === '2') {
    window.location.href = 'trang2_dual_TrangThaiDangSac_A.html';
  }
  
  // Chuyển từ trang 2_2 sang trang 2_dual (phím 1) - hiển thị cả hai khung cơ bản
  if (currentPage === 'trang2_2.html' && event.key === '1') {
    window.location.href = 'trang2_dual.html';
  }
  
  // Chuyển từ trang 2_2_TTTT sang trang 2_dual_TTTT_Buttons_B (phím 2) - khung A TTTT, khung B có nút thanh toán
  if (currentPage === 'trang2_2_TTTT.html' && event.key === '2') {
    window.location.href = 'trang2_dual_TTTT_Buttons_B.html';
  }
  
  // Chuyển từ trang 2_2_TrangThaiSac sang trang 2_dual_TrangThaiDangSac_B (phím 1) - khung A có nút thanh toán, khung B đang sạc
  if (currentPage === 'trang2_2_TrangThaiSac.html' && event.key === '1') {
    window.location.href = 'trang2_dual_TrangThaiDangSac_B.html';
  }
  
  // Chuyển từ trang 2_dual_TrangThaiDangSac về trang đơn lẻ (phím 0)
  if (currentPage === 'trang2_dual_TrangThaiDangSac.html' && event.key === '0') {
    // Có thể quay về trang2.html hoặc trang trước đó
    window.location.href = 'trang2.html';
  }
  
  // Chuyển từ trang 2_dual_TrangThaiDangSac sang trang 2_1_TrangThaiSac (phím 1)
  if (currentPage === 'trang2_dual_TrangThaiDangSac.html' && event.key === '1') {
    window.location.href = 'trang2_1_TrangThaiSac.html';
  }
  
  // Chuyển từ trang 2_dual_TrangThaiDangSac sang trang 2_2_TrangThaiSac (phím 2)
  if (currentPage === 'trang2_dual_TrangThaiDangSac.html' && event.key === '2') {
    window.location.href = 'trang2_2_TrangThaiSac.html';
  }
  
  // Chuyển từ trang 2_dual_TrangThaiDangSac_A về trang 2_1_TrangThaiSac (phím 1)
  if (currentPage === 'trang2_dual_TrangThaiDangSac_A.html' && event.key === '1') {
    window.location.href = 'trang2_1_TrangThaiSac.html';
  }
  
  // Chuyển từ trang 2_dual_TrangThaiDangSac_A về trang2.html (phím 0)
  if (currentPage === 'trang2_dual_TrangThaiDangSac_A.html' && event.key === '0') {
    window.location.href = 'trang2.html';
  }
  
  // Chuyển từ trang 2_dual_TrangThaiDangSac_B về trang 2_2_TrangThaiSac (phím 2)
  if (currentPage === 'trang2_dual_TrangThaiDangSac_B.html' && event.key === '2') {
    window.location.href = 'trang2_2_TrangThaiSac.html';
  }
  
  // Chuyển từ trang 2_dual_TrangThaiDangSac_B về trang2.html (phím 0)
  if (currentPage === 'trang2_dual_TrangThaiDangSac_B.html' && event.key === '0') {
    window.location.href = 'trang2.html';
  }
  
  // Chuyển từ trang 2_dual_TrangThaiDangSac_A sang trang2_dual_TrangThaiDangSac (phím 5) - khi đang hiển thị QR
  if (currentPage === 'trang2_dual_TrangThaiDangSac_A.html' && event.key === '5') {
    window.location.href = 'trang2_dual_TrangThaiDangSac.html';
  }
  
  // Chuyển từ trang 2_dual_TrangThaiDangSac_B sang trang2_dual_TrangThaiDangSac (phím 5) - khi đang hiển thị QR
  if (currentPage === 'trang2_dual_TrangThaiDangSac_B.html' && event.key === '5') {
    window.location.href = 'trang2_dual_TrangThaiDangSac.html';
  }
  
  // Chuyển từ trang 2_dual_TTTT_Buttons_A sang trang 2_dual_TTTT_Buttons_B (phím 2)
  if (currentPage === 'trang2_dual_TTTT_Buttons_A.html' && event.key === '2') {
    window.location.href = 'trang2_dual_TTTT_Buttons_B.html';
  }
  
  // Chuyển từ trang 2_dual_TTTT_Buttons_A về trang 2_1_TTTT (phím 1)
  if (currentPage === 'trang2_dual_TTTT_Buttons_A.html' && event.key === '1') {
    window.location.href = 'trang2_1_TTTT.html';
  }
  
  // Chuyển từ trang 2_dual_TTTT_Buttons_A về trang2.html (phím 0)
  if (currentPage === 'trang2_dual_TTTT_Buttons_A.html' && event.key === '0') {
    window.location.href = 'trang2.html';
  }
  
  // Chuyển từ trang 2_dual_TTTT_Buttons_B sang trang 2_dual_TTTT_Buttons_A (phím 1)
  if (currentPage === 'trang2_dual_TTTT_Buttons_B.html' && event.key === '1') {
    window.location.href = 'trang2_dual_TTTT_Buttons_A.html';
  }
  
  // Chuyển từ trang 2_dual_TTTT_Buttons_B về trang 2_2_TTTT (phím 2)
  if (currentPage === 'trang2_dual_TTTT_Buttons_B.html' && event.key === '2') {
    window.location.href = 'trang2_2_TTTT.html';
  }
  
  // Chuyển từ trang 2_dual_TTTT_Buttons_B về trang2.html (phím 0)
  if (currentPage === 'trang2_dual_TTTT_Buttons_B.html' && event.key === '0') {
    window.location.href = 'trang2.html';
  }
  
  // Navigation cho trang 2_dual_QR_Buttons_B
  if (currentPage === 'trang2_dual_QR_Buttons_B.html' && event.key === '0') {
    window.location.href = 'trang2.html';
  }
  
  if (currentPage === 'trang2_dual_QR_Buttons_B.html' && event.key === '1') {
    window.location.href = 'trang2_1_TTTT.html';
  }
  
  // Navigation từ trang có QR ở khung A, nhấn phím 4 → A charging, B buttons
  if (currentPage === 'trang2_dual_QR_Buttons_B.html' && event.key === '4') {
    window.location.href = 'trang2_dual_ChargingA_ButtonsB.html';
  }
  
  // Navigation từ trang có QR ở khung B, nhấn phím 5 → A buttons, B charging  
  if (currentPage === 'trang2_dual_QR_Buttons_A.html' && event.key === '5') {
    window.location.href = 'trang2_dual_ButtonsA_ChargingB.html';
  }
  
  // Navigation cho trang 2_dual_ChargingA_ButtonsB
  if (currentPage === 'trang2_dual_ChargingA_ButtonsB.html' && event.key === '0') {
    window.location.href = 'trang2.html';
  }
  
  if (currentPage === 'trang2_dual_ChargingA_ButtonsB.html' && event.key === '2') {
    window.location.href = 'trang2_dual_TrangThaiDangSac_A.html';
  }
  
  // Navigation cho trang 2_dual_ButtonsA_ChargingB
  if (currentPage === 'trang2_dual_ButtonsA_ChargingB.html' && event.key === '0') {
    window.location.href = 'trang2.html';
  }
  
  if (currentPage === 'trang2_dual_ButtonsA_ChargingB.html' && event.key === '1') {
    window.location.href = 'trang2_dual_TrangThaiDangSac_B.html';
  }
  
});
  
  // Thời gian realtime (dd/mm/yy hh:mm:ss), cập nhật mỗi giây
  function fmt(n){ return String(n).padStart(2,'0'); }
  function renderClock(){
    const now = new Date();
    const dd = fmt(now.getDate());
    const mm = fmt(now.getMonth()+1);
    const yy = String(now.getFullYear()).slice(-2);
    const hh = fmt(now.getHours());
    const mi = fmt(now.getMinutes());
    const ss = fmt(now.getSeconds());
    document.getElementById('current-time').textContent = `${dd}/${mm}/${yy} ${hh}:${mi}:${ss}`;
  }
  renderClock();
  setInterval(renderClock, 1000);

// Bàn phím ảo
function showKeyboard() {
  const keyboard = document.getElementById('keyboard');
  if (keyboard) {
    keyboard.style.display = 'block';
  }
}

function hideKeyboard() {
  const keyboard = document.getElementById('keyboard');
  if (keyboard) {
    keyboard.style.display = 'none';
  }
}

function inputKey(key) {
  const inputText = document.getElementById('inputValue');
  if (inputText) {
    if (inputText.textContent === 'Nhập số tiền') {
      inputText.textContent = key;
      inputText.style.color = '#000000';
    } else {
      // Chỉ cho phép nhập số
      if (key >= '0' && key <= '9') {
        let currentText = inputText.textContent;
        
        // Nếu nhấn số, thêm vào và format
        let numberText = currentText.replace(/[^\d]/g, ''); // Lấy chỉ số
        numberText += key;
        
        // Format số với dấu phẩy
        let formattedNumber = formatNumber(numberText);
        inputText.textContent = formattedNumber;
      }
    }
  }
}

function formatNumber(num) {
  // Chuyển số thành chuỗi và thêm dấu phẩy phân cách hàng nghìn
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function backspace() {
  const inputText = document.getElementById('inputValue');
  if (inputText && inputText.textContent !== 'Nhập số tiền') {
    let currentText = inputText.textContent;
    
    // Xóa ký tự cuối
    currentText = currentText.slice(0, -1);
    
    if (currentText === '') {
      inputText.textContent = 'Nhập số tiền';
      inputText.style.color = '#666666';
    } else {
      // Format lại số
      let numberText = currentText.replace(/[^\d]/g, '');
      if (numberText) {
        inputText.textContent = formatNumber(numberText);
      } else {
        inputText.textContent = currentText;
      }
    }
  }
}

function clearInput() {
  const inputText = document.getElementById('inputValue');
  if (inputText) {
    inputText.textContent = 'Nhập số tiền';
    inputText.style.color = '#666666';
  }
}

async function enterInput() {
  const inputText = document.getElementById('inputValue');
  if (inputText && inputText.textContent !== 'Nhập số tiền') {
    let finalValue = inputText.textContent;
    console.log('Số tiền đã chốt:', finalValue);
    
    // Lưu số tiền vào Store
    const amount = parseInt(finalValue.replace(/,/g, ''));
    if (amount && amount >= 10000) {
      Store.set('paymentAmount', amount);
      
      // Ẩn bàn phím trước
      hideKeyboard();
      
      // Hiển thị loading
      showPaymentLoading();
      
      try {
        // Gọi API tạo ticket VNPAY
        const chargePointId = Store.getChargePointId() || 'CP-001';
        const connectorId = Store.getConnectorId() || 1;
        
        const response = await API.createTicket({ 
          amount, 
          chargePointId, 
          connectorId, 
          paymentMethod: 'vnpay' 
        });
        
        // Hiển thị QR code trong khung
        showPaymentQR(response, amount);
        
      } catch (error) {
        console.error('Lỗi tạo ticket VNPAY:', error);
        alert('Không tạo được QR VNPAY. Kiểm tra kết nối hoặc backend.');
        hidePaymentLoading();
      }
    } else {
      alert('Số tiền không hợp lệ. Vui lòng nhập số tiền từ 10,000 VND trở lên.');
    }
  }
}

// Hiển thị loading cho thanh toán
function showPaymentLoading() {
  const content = document.querySelector('.tttt-content');
  if (content) {
    content.innerHTML = `
      <div style="text-align: center; padding: 20px;">
        <div class="loading" style="display: inline-block; width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #007bff; border-radius: 50%; animation: spin 1s linear infinite;"></div>
        <p style="margin-top: 15px; color: #666;">Đang tạo QR VNPAY...</p>
      </div>
    `;
  }
}

// Ẩn loading cho thanh toán
function hidePaymentLoading() {
  const content = document.querySelector('.tttt-content');
  if (content) {
    content.innerHTML = `
      <h2 class="tttt-title">THANH TOÁN TRỰC TIẾP</h2>
      <h3 class="tttt-subtitle">CHI PHÍ SẠC</h3>
      <p class="tttt-price">6.000đ/Kwh</p>
      <div class="input-box" onclick="showKeyboard()">
        <span class="input-text" id="inputValue">Nhập số tiền mà quý khách muốn nạp</span>
      </div>
    `;
  }
}

// Hiển thị QR code cho thanh toán
function showPaymentQR(response, amount) {
  const content = document.querySelector('.tttt-content');
  if (content) {
    let qrImageUrl = '';
    
    if (response.qrImageDataUrl) {
      qrImageUrl = response.qrImageDataUrl;
    } else if (response.payUrl) {
      qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(response.payUrl)}`;
    } else if (response.qrCode) {
      qrImageUrl = `data:image/png;base64,${response.qrCode}`;
    }
    
    content.innerHTML = `
      <h2 class="tttt-title" style="margin-top: -15px;">THANH TOÁN VNPAY</h2>
      <h3 class="tttt-subtitle" style="margin-top: -10px;">Số tiền: ${formatNumber(amount)} VND</h3>
      <div style="margin: 150px 0; margin-left: 140px;">
        <img src="${qrImageUrl}" alt="QR VNPAY" style="width: 190px; height: 190px; border: 2px solid #ddd; border-radius: 8px;" />
      </div>
      <p style="color: #666; font-size: 14px; margin-top: -130px; margin-bottom: 15px; margin-left: 150px;">Quét mã QR để thanh toán</p>
      <button onclick="resetPaymentInput()" style="background: #6c757d; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 14px; margin-left: 190px;">Nhập lại</button>
    `;
    
    // Bắt đầu theo dõi thanh toán
    if (response.ticketId) {
      startPaymentPolling(response.ticketId);
    }
  }
}

// Reset input thanh toán về trạng thái ban đầu
function resetPaymentInput() {
  const content = document.querySelector('.tttt-content');
  if (content) {
    content.innerHTML = `
      <h2 class="tttt-title">THANH TOÁN TRỰC TIẾP</h2>
      <h3 class="tttt-subtitle">CHI PHÍ SẠC</h3>
      <p class="tttt-price">6.000đ/Kwh</p>
      <div class="input-box" onclick="showKeyboard()">
        <span class="input-text" id="inputValue">Nhập số tiền mà quý khách muốn nạp</span>
      </div>
    `;
  }
}

// Theo dõi thanh toán
function startPaymentPolling(ticketId) {
  const pollInterval = setInterval(async () => {
    try {
      const ticket = await API.getTicket(ticketId);
      if (ticket.status === 'paid') {
        clearInterval(pollInterval);
        showPaymentSuccess();
      }
    } catch (error) {
      console.warn('Lỗi poll ticket:', error);
    }
  }, 3000);
}

// Hiển thị thông báo thanh toán thành công
function showPaymentSuccess() {
  const content = document.querySelector('.tttt-content');
  if (content) {
    content.innerHTML = `
      <div style="text-align: center; padding: 20px;">
        <div style="color: #28a745; font-size: 48px; margin-bottom: 15px;">✓</div>
        <h2 style="color: #28a745; margin-bottom: 10px;">THANH TOÁN THÀNH CÔNG</h2>
        <p style="color: #666; margin-bottom: 15px;">Vui lòng cắm sạc để bắt đầu</p>
        <button onclick="resetPaymentInput()" style="background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">Tiếp tục</button>
      </div>
    `;
  }
}
  