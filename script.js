// Điều hướng: chỉnh data-goto trên mỗi nút cho đúng trang của bạn
document.querySelectorAll('.nav-arrow').forEach(btn => {
    btn.addEventListener('click', () => {
      const url = btn.dataset.goto;
      if (url && url !== '#') window.location.href = url;
    });
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
  