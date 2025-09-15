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
  console.log('🔍 Key pressed:', event.key, 'Current page:', currentPage);
  
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

  // Nếu đang ở trang2_1 và nhấn phím 2 sẽ sang trang2_dual với khung A Buttons, khung B Buttons
  if (currentPage === 'trang2_1.html' && event.key === '2') {
    window.location.href = 'trang2_dual.html';
  }

  // Nếu đang ở trang2_2 và nhấn phím 1 sẽ sang trang2_dual với khung A Buttons, khung B Buttons
  if (currentPage === 'trang2_2.html' && event.key === '1') {
    window.location.href = 'trang2_dual.html';
  }

  // Nếu đang ở trang2_1_TTTT mà khung A có QR và nhấn phím 2 thì sang trang dual QR_Buttons_A
  if (currentPage === 'trang2_1_TTTT.html' && event.key === '2') {
    // Kiểm tra xem có QR code đang hiển thị không (có paymentAmount trong Store)
    const paymentAmount = Store ? Store.get('paymentAmount') : null;
    if (paymentAmount) {
      window.location.href = 'trang2_dual_QR_Buttons_A.html';
    } else {
      // Nếu chưa có QR, chuyển sang trang dual TTTT_Buttons_A
      window.location.href = 'trang2_dual_TTTT_Buttons_A.html';
    }
  }

  // Nếu đang ở trang2_2_TTTT mà khung B có QR và nhấn phím 1 thì sang trang dual QR_Buttons_B
  if (currentPage === 'trang2_2_TTTT.html' && event.key === '1') {
    // Kiểm tra xem có QR code đang hiển thị không (có paymentAmount trong Store)
    const paymentAmount = Store ? Store.get('paymentAmount') : null;
    const selectedKhung = Store ? Store.get('selectedKhung') : null;
    
    console.log('🔍 Debug phím 1 trang2_2_TTTT:', { paymentAmount, selectedKhung });
    console.log('🔍 Store toàn bộ:', Store ? Store.getAll() : 'Store không tồn tại');
    
    if (paymentAmount) {
      console.log('✅ Có QR, chuyển đến trang2_dual_QR_Buttons_B.html');
      window.location.href = 'trang2_dual_QR_Buttons_B.html';
    } else {
      console.log('❌ Chưa có QR, chuyển đến trang2_dual_TTTT_Buttons_B.html');
      console.log('❌ Lý do: paymentAmount =', paymentAmount);
      // Nếu chưa có QR, chuyển sang trang dual TTTT_Buttons_B
      window.location.href = 'trang2_dual_TTTT_Buttons_B.html';
    }
  }

  // Nếu đang ở bất kỳ trang nào mà khung A có QR và nhấn phím 4 thì sang trang dual ChargingA_ButtonsB
  if (event.key === '4') {
    // Kiểm tra xem có QR code đang hiển thị trong khung A không
    const paymentAmount = Store ? Store.get('paymentAmount') : null;
    if (paymentAmount) {
      if(currentPage === 'trang2_1_TTTT.html') {
        window.location.href = 'trang2_1_TrangThaiSac.html';
      }
      if(currentPage === 'trang2_dual_TTTT_Buttons_A.html') {
        window.location.href = 'trang2_dual_TrangThaiDangSac_A.html';
      }
      if(currentPage === 'trang2_dual_QR_Buttons_A.html') {
        window.location.href = 'trang2_dual_TrangThaiDangSac_A.html';
      }
      if(currentPage === 'trang2_dual_QR_TTTT.html') {
        window.location.href = 'trang2_dual_TrangThaiDangSacA_TTTT.html';
      }
        if(currentPage === 'trang2_dual_TTTT.html') {
          window.location.href = 'trang2_dual_TrangThaiDangSac_QR.html';
        }
        if(currentPage === 'trang2_dual_QR_TrangThaiDangSac.html') {
          window.location.href = 'trang2_dual_TrangThaiDangSac.html';
        }
        if(currentPage === 'trang2_dual_TrangThaiDangSac_B.html') {
          window.location.href = 'trang2_dual_TrangThaiDangSac.html';
        }
      }
    }

    // Nếu đang ở bất kỳ trang nào mà khung B có QR và nhấn phím 5 thì sang trang dual ButtonsA_ChargingB
    if (event.key === '5') {
      // Kiểm tra xem có QR code đang hiển thị trong khung A không
      const paymentAmount = Store ? Store.get('paymentAmount') : null;
      if (paymentAmount) {
        if(currentPage === 'trang2_2_TTTT.html') {
          window.location.href = 'trang2_2_TrangThaiSac.html';
        }
        if(currentPage === 'trang2_dual_TTTT_Buttons_B.html') {
          window.location.href = 'trang2_dual_TrangThaiDangSac_B.html';
        }

        if(currentPage === 'trang2_dual_QR_Buttons_B.html') {
          window.location.href = 'trang2_dual_TrangThaiDangSac_B.html';
        }
        if(currentPage === 'trang2_dual_TTTT_QR.html') {
          window.location.href = 'trang2_dual_TTTT_TrangThaiDangSacB.html';
        }
        if(currentPage === 'trang2_dual_TTTT.html') {
          window.location.href = 'trang2_dual_QR_TrangThaiDangSac.html';
        }
        if(currentPage === 'trang2_dual_TrangThaiDangSac_QR.html') {
          window.location.href = 'trang2_dual_TrangThaiDangSac.html';
        }
        if(currentPage === 'trang2_dual_TrangThaiDangSac_A.html') {
          window.location.href = 'trang2_dual_TrangThaiDangSac.html';
        }
      }
    }

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Logic tổng quát: từ bất kỳ trang phụ nào của trang 2 nhấn phím 0 đều quay về trang2
    if (currentPage.startsWith('trang2_') && currentPage !== 'trang2.html' && event.key === '0') {
      window.location.href = 'trang2.html';
    }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////  
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
      
      // Xác định khung nào đang có TTTT dựa trên trang hiện tại
      if (currentPage === 'trang2_1_TTTT.html') {
        Store.set('selectedKhung', 'A'); // Khung A có TTTT
        console.log('💾 Đã lưu Store trang2_1_TTTT:', { amount, selectedKhung: 'A' });
      } else if (currentPage === 'trang2_2_TTTT.html') {
        Store.set('selectedKhung', 'B'); // Khung B có TTTT
        console.log('💾 Đã lưu Store trang2_2_TTTT:', { amount, selectedKhung: 'B' });
      }
      
      console.log('💾 Store sau khi lưu:', Store.getAll());
      
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
  