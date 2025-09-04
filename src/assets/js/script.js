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
  
  // Nếu đang ở trang 2 và nhấn phím 1
  if (currentPage === 'trang2.html' && event.key === '1') {
    window.location.href = 'src/pages/trang2_1.html';
  }
  
  // Nếu đang ở trang 2 và nhấn phím 2
  if (currentPage === 'trang2.html' && event.key === '2') {
    window.location.href = 'src/pages/trang2_2.html';
  }
  
  // Nếu đang ở trang 2_1 và nhấn phím 0
  if (currentPage === 'trang2_1.html' && event.key === '0') {
    window.location.href = 'src/pages/trang2.html';
  }
  
  // Nếu đang ở trang 2_2 và nhấn phím 0
  if (currentPage === 'trang2_2.html' && event.key === '0') {
    window.location.href = 'src/pages/trang2.html';
  }
  
  // Nếu đang ở trang 2_1_TTTT và nhấn phím 0
  if (currentPage === 'trang2_1_TTTT.html' && event.key === '0') {
    window.location.href = 'src/pages/trang2.html';
  }
  
  // Nếu đang ở trang 2_1_app và nhấn phím 0
  if (currentPage === 'trang2_1_app.html' && event.key === '0') {
    window.location.href = 'src/pages/trang2.html';
  }
  
  // Nếu đang ở trang 2_2_TTTT và nhấn phím 0
  if (currentPage === 'trang2_2_TTTT.html' && event.key === '0') {
    window.location.href = 'src/pages/trang2.html';
  }
  
  // Nếu đang ở trang 2_2_app và nhấn phím 0
  if (currentPage === 'trang2_2_app.html' && event.key === '0') {
    window.location.href = 'src/pages/trang2.html';
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
    // Chốt số đã nhập - có thể thêm logic xử lý ở đây
    let finalValue = inputText.textContent;
    console.log('Số tiền đã chốt:', finalValue);
    
    // Hiển thị thông báo hoặc xử lý logic khác
    alert('Đã chốt số tiền: ' + finalValue);
    
    // Ẩn bàn phím sau khi chốt
    hideKeyboard();
  }
}
  