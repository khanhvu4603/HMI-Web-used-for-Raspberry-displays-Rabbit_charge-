// assets/js/config.js
// Cấu hình chung cho HMI Web Application
// File này được nhúng ở mọi trang HMI trước các script khác

window.HMI_CONFIG = {
  // ĐỔI về địa chỉ backend của bạn (có thể là http://raspberry:3000 hoặc domain)
  API_BASE_URL: 'http://localhost:3000',

  // Cấu hình polling intervals
  POLL_TICKET_MS: 2500,    // poll ticket 2.5s/lần
  POLL_SESSION_MS: 5000,   // poll session 5s/lần

  // Cấu hình timeout
  REQUEST_TIMEOUT_MS: 10000,  // 10 giây timeout cho API requests

  // Cấu hình retry
  MAX_RETRY_ATTEMPTS: 3,      // Số lần thử lại tối đa
  RETRY_DELAY_MS: 1000,       // Delay giữa các lần retry (1 giây)

  // Cấu hình UI
  SHOW_DEBUG_INFO: false,     // Hiển thị thông tin debug
  AUTO_REFRESH_ENABLED: true, // Tự động refresh trang

  // Cấu hình logging
  LOG_LEVEL: 'info',          // debug, info, warn, error
  LOG_TO_CONSOLE: true,       // Log ra console
  LOG_TO_SERVER: false,       // Gửi log lên server

  // Cấu hình session
  SESSION_TIMEOUT_MS: 300000, // 5 phút timeout cho session
  SESSION_WARNING_MS: 60000,  // Cảnh báo trước khi hết session (1 phút)

  // Cấu hình payment
  PAYMENT_TIMEOUT_MS: 300000, // 5 phút timeout cho thanh toán
  PAYMENT_RETRY_MS: 5000,     // 5 giây retry cho payment status

  // Cấu hình charging
  CHARGING_POLL_MS: 2000,     // 2 giây poll cho trạng thái sạc
  CHARGING_TIMEOUT_MS: 3600000, // 1 giờ timeout cho session sạc

  // Cấu hình notification
  NOTIFICATION_DURATION_MS: 5000, // 5 giây hiển thị notification
  SOUND_ENABLED: true,        // Bật âm thanh thông báo

  // Cấu hình error handling
  SHOW_ERROR_DIALOG: true,    // Hiển thị dialog lỗi
  ERROR_RECOVERY_ENABLED: true, // Tự động khôi phục lỗi

  // Cấu hình network
  NETWORK_CHECK_INTERVAL_MS: 30000, // 30 giây kiểm tra kết nối
  OFFLINE_MODE_ENABLED: false,      // Chế độ offline

  // Cấu hình security
  ENABLE_HTTPS_ONLY: false,   // Chỉ cho phép HTTPS
  ENABLE_CORS: true,          // Bật CORS
  ALLOWED_ORIGINS: ['*'],     // Các origin được phép

  // Cấu hình performance
  ENABLE_CACHING: true,       // Bật cache
  CACHE_DURATION_MS: 300000,  // 5 phút cache
  ENABLE_COMPRESSION: true,   // Bật nén dữ liệu

  // Cấu hình monitoring
  ENABLE_ANALYTICS: false,    // Bật analytics
  ENABLE_PERFORMANCE_MONITORING: false, // Bật monitoring hiệu suất
  ENABLE_ERROR_REPORTING: false,        // Bật báo cáo lỗi

  // Cấu hình development
  IS_DEVELOPMENT: true,       // Chế độ development
  ENABLE_HOT_RELOAD: false,   // Bật hot reload
  ENABLE_DEBUG_TOOLS: false,  // Bật debug tools
};

// Utility functions
window.HMI_UTILS = {
  // Lấy cấu hình
  getConfig: function(key) {
    return window.HMI_CONFIG[key];
  },

  // Cập nhật cấu hình
  setConfig: function(key, value) {
    window.HMI_CONFIG[key] = value;
  },

  // Kiểm tra kết nối mạng
  isOnline: function() {
    return navigator.onLine;
  },

  // Log với level
  log: function(level, message, data) {
    if (window.HMI_CONFIG.LOG_TO_CONSOLE) {
      const timestamp = new Date().toISOString();
      const logMessage = `[HMI ${timestamp}] ${message}`;
      
      switch (level) {
        case 'debug':
          if (window.HMI_CONFIG.LOG_LEVEL === 'debug') {
            console.log(logMessage, data);
          }
          break;
        case 'info':
          if (['debug', 'info'].includes(window.HMI_CONFIG.LOG_LEVEL)) {
            console.info(logMessage, data);
          }
          break;
        case 'warn':
          if (['debug', 'info', 'warn'].includes(window.HMI_CONFIG.LOG_LEVEL)) {
            console.warn(logMessage, data);
          }
          break;
        case 'error':
          console.error(logMessage, data);
          break;
      }
    }
  },

  // Gửi request API
  apiRequest: function(endpoint, options = {}) {
    const url = window.HMI_CONFIG.API_BASE_URL + endpoint;
    const defaultOptions = {
      timeout: window.HMI_CONFIG.REQUEST_TIMEOUT_MS,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    return fetch(url, { ...defaultOptions, ...options })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .catch(error => {
        window.HMI_UTILS.log('error', 'API Request failed', { endpoint, error: error.message });
        throw error;
      });
  },

  // Retry mechanism
  retry: function(fn, maxAttempts = window.HMI_CONFIG.MAX_RETRY_ATTEMPTS) {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      
      const attempt = () => {
        attempts++;
        fn()
          .then(resolve)
          .catch(error => {
            if (attempts < maxAttempts) {
              window.HMI_UTILS.log('warn', `Retry attempt ${attempts}/${maxAttempts}`, { error: error.message });
              setTimeout(attempt, window.HMI_CONFIG.RETRY_DELAY_MS);
            } else {
              reject(error);
            }
          });
      };
      
      attempt();
    });
  }
};

// Initialize logging
window.HMI_UTILS.log('info', 'HMI Config loaded', window.HMI_CONFIG);
