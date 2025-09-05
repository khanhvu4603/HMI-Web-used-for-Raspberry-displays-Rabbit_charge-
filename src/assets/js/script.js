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
  
  // Chuyển từ trang 2_1 sang trang 2_2 (phím 2)
  if ((currentPage === 'trang2_1.html' || 
       currentPage === 'trang2_1_TTTT.html' || 
       currentPage === 'trang2_1_app.html') && event.key === '2') {
    window.location.href = 'trang2_2.html';
  }
  
  // Chuyển từ trang 2_2 sang trang 2_1 (phím 1)
  if ((currentPage === 'trang2_2.html' || 
       currentPage === 'trang2_2_TTTT.html' || 
       currentPage === 'trang2_2_app.html') && event.key === '1') {
    window.location.href = 'trang2_1.html';
  }
  
  // Chuyển từ trang 2_1_TTTT sang trang 2_2_TTTT (phím 2)
  if (currentPage === 'trang2_1_TTTT.html' && event.key === '2') {
    window.location.href = 'trang2_2_TTTT.html';
  }
  
  // Chuyển từ trang 2_2_TTTT sang trang 2_1_TTTT (phím 1)
  if (currentPage === 'trang2_2_TTTT.html' && event.key === '1') {
    window.location.href = 'trang2_1_TTTT.html';
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

function enterInput() {
  const inputText = document.getElementById('inputValue');
  if (inputText && inputText.textContent !== 'Nhập số tiền') {
    let finalValue = inputText.textContent;
    console.log('Số tiền đã chốt:', finalValue);
    
    // Lưu số tiền vào Store
    const amount = parseInt(finalValue.replace(/,/g, ''));
    if (amount && amount >= 10000) {
      Store.set('paymentAmount', amount);
      
      // Xác định đường dẫn chính xác dựa trên vị trí hiện tại
      const currentPath = window.location.pathname;
      let paymentPath = 'payment.html';
      
      if (currentPath.includes('/src/pages/')) {
        // Đang ở trong thư mục src/pages/
        paymentPath = 'payment.html';
      } else if (currentPath.includes('/src/')) {
        // Đang ở trong thư mục src/
        paymentPath = 'pages/payment.html';
      } else {
        // Đang ở thư mục gốc
        paymentPath = 'src/pages/payment.html';
      }
      
      console.log('Chuyển đến trang thanh toán:', paymentPath);
      window.location.href = paymentPath;
    } else {
      alert('Số tiền không hợp lệ. Vui lòng nhập số tiền từ 10,000 VND trở lên.');
    }
    
    // Ẩn bàn phím sau khi chốt
    hideKeyboard();
  }
}
  