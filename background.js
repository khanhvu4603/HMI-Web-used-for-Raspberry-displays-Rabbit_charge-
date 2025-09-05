chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('index.html', {
    id: 'hmi-main-window',
    bounds: {
      width: screen.width,
      height: screen.height,
      left: 0,
      top: 0
    },
    state: 'fullscreen',
    resizable: false,
    frame: 'none',
    alwaysOnTop: true,
    kiosk: true,
    hidden: false,
    focused: true,
    // Cấu hình để ẩn hoàn toàn thanh tiêu đề
    type: 'shell'
  }, function(createdWindow) {
    // Ẩn thanh tiêu đề hoàn toàn
    createdWindow.setAlwaysOnTop(true);
    
    // Ẩn thanh tiêu đề bằng cách set frame
    createdWindow.setFrame('none');
    
    // Tắt hoàn toàn chức năng đóng cửa sổ bằng chuột
    createdWindow.onClosed.addListener(function() {
      // Ngăn không cho đóng cửa sổ
      chrome.app.window.create('index.html', {
        id: 'hmi-main-window',
        bounds: {
          width: screen.width,
          height: screen.height,
          left: 0,
          top: 0
        },
        state: 'fullscreen',
        resizable: false,
        frame: 'none',
        alwaysOnTop: true,
        kiosk: true,
        hidden: false,
        focused: true,
        type: 'shell'
      });
    });
  });
});

