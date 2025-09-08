// assets/js/api.js
// API helper và Store cho HMI Web Application
// File này được nhúng sau config.js

const API = {
  // Lấy base URL từ config, loại bỏ dấu / cuối
  base() { 
    return window.HMI_CONFIG.API_BASE_URL.replace(/\/$/, ''); 
  },

  // POST request với error handling
  async post(path, body) {
    try {
      const response = await fetch(`${this.base()}${path}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(body || {}),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`POST ${path} ${response.status}: ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      window.HMI_UTILS.log('error', 'API POST failed', { path, error: error.message });
      throw error;
    }
  },

  // GET request với error handling
  async get(path) {
    try {
      const response = await fetch(`${this.base()}${path}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`GET ${path} ${response.status}: ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      window.HMI_UTILS.log('error', 'API GET failed', { path, error: error.message });
      throw error;
    }
  },

  // PUT request với error handling
  async put(path, body) {
    try {
      const response = await fetch(`${this.base()}${path}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(body || {}),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`PUT ${path} ${response.status}: ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      window.HMI_UTILS.log('error', 'API PUT failed', { path, error: error.message });
      throw error;
    }
  },

  // DELETE request với error handling
  async delete(path) {
    try {
      const response = await fetch(`${this.base()}${path}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`DELETE ${path} ${response.status}: ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      window.HMI_UTILS.log('error', 'API DELETE failed', { path, error: error.message });
      throw error;
    }
  },

  // API Endpoints cho HMI

  // Tạo ticket mới
  createTicket({ amount, chargePointId, connectorId, paymentMethod = 'vnpay' }) {
    return this.post('/tickets', { 
      amount, 
      chargePointId, 
      connectorId, 
      paymentMethod,
      timestamp: new Date().toISOString()
    });
  },

  // Lấy thông tin ticket
  getTicket(ticketId) {
    return this.get(`/tickets/${encodeURIComponent(ticketId)}`);
  },

  // Cập nhật trạng thái ticket
  updateTicket(ticketId, status, data = {}) {
    return this.put(`/tickets/${encodeURIComponent(ticketId)}`, {
      status,
      ...data,
      updatedAt: new Date().toISOString()
    });
  },

  // Lấy session theo ticket
  getSessionByTicket(ticketId) {
    return this.get(`/sessions?ticketId=${encodeURIComponent(ticketId)}`);
  },

  // Lấy chi tiết session
  getSessionDetail(sessionId) {
    return this.get(`/sessions/${encodeURIComponent(sessionId)}`);
  },

  // Tạo session mới
  createSession({ ticketId, chargePointId, connectorId, startTime }) {
    return this.post('/sessions', {
      ticketId,
      chargePointId,
      connectorId,
      startTime: startTime || new Date().toISOString()
    });
  },

  // Cập nhật session
  updateSession(sessionId, data) {
    return this.put(`/sessions/${encodeURIComponent(sessionId)}`, {
      ...data,
      updatedAt: new Date().toISOString()
    });
  },

  // Kết thúc session
  endSession(sessionId, endTime, finalData = {}) {
    return this.put(`/sessions/${encodeURIComponent(sessionId)}/end`, {
      endTime: endTime || new Date().toISOString(),
      ...finalData
    });
  },

  // Lấy danh sách charge points
  getChargePoints() {
    return this.get('/charge-points');
  },

  // Lấy thông tin charge point
  getChargePoint(chargePointId) {
    return this.get(`/charge-points/${encodeURIComponent(chargePointId)}`);
  },

  // Lấy trạng thái charge point
  getChargePointStatus(chargePointId) {
    return this.get(`/charge-points/${encodeURIComponent(chargePointId)}/status`);
  },

  // Bắt đầu sạc
  startCharging({ chargePointId, connectorId, sessionId }) {
    return this.post('/charging/start', {
      chargePointId,
      connectorId,
      sessionId,
      startTime: new Date().toISOString()
    });
  },

  // Dừng sạc
  stopCharging({ chargePointId, connectorId, sessionId }) {
    return this.post('/charging/stop', {
      chargePointId,
      connectorId,
      sessionId,
      stopTime: new Date().toISOString()
    });
  },

  // Lấy trạng thái sạc
  getChargingStatus(sessionId) {
    return this.get(`/charging/status/${encodeURIComponent(sessionId)}`);
  },

  // Xử lý thanh toán
  processPayment({ ticketId, amount, paymentMethod, cardInfo = null }) {
    return this.post('/payment/process', {
      ticketId,
      amount,
      paymentMethod,
      cardInfo,
      timestamp: new Date().toISOString()
    });
  },

  // Kiểm tra trạng thái thanh toán
  getPaymentStatus(paymentId) {
    return this.get(`/payment/status/${encodeURIComponent(paymentId)}`);
  },

  // Hủy thanh toán
  cancelPayment(paymentId) {
    return this.post(`/payment/cancel/${encodeURIComponent(paymentId)}`);
  },

  // Lấy lịch sử giao dịch
  getTransactionHistory(limit = 50, offset = 0) {
    return this.get(`/transactions?limit=${limit}&offset=${offset}`);
  },

  // Lấy báo cáo
  getReport(type, startDate, endDate) {
    return this.get(`/reports/${type}?start=${startDate}&end=${endDate}`);
  },

  // Health check
  healthCheck() {
    return this.get('/health');
  },

  // Lấy cấu hình hệ thống
  getSystemConfig() {
    return this.get('/config');
  }
};

// Lưu trữ dùng chung giữa các trang
const Store = {
  // Các method cơ bản
  set(key, value) { 
    try {
      localStorage.setItem(key, JSON.stringify(value));
      window.HMI_UTILS.log('debug', 'Store set', { key, value });
    } catch (error) {
      window.HMI_UTILS.log('error', 'Store set failed', { key, error: error.message });
    }
  },

  get(key) { 
    try { 
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      window.HMI_UTILS.log('error', 'Store get failed', { key, error: error.message });
      return null;
    }
  },

  del(key) { 
    try {
      localStorage.removeItem(key);
      window.HMI_UTILS.log('debug', 'Store delete', { key });
    } catch (error) {
      window.HMI_UTILS.log('error', 'Store delete failed', { key, error: error.message });
    }
  },

  clear() {
    try {
      localStorage.clear();
      window.HMI_UTILS.log('info', 'Store cleared');
    } catch (error) {
      window.HMI_UTILS.log('error', 'Store clear failed', { error: error.message });
    }
  },

  // Các method cho ticket
  setTicketId(id) { 
    this.set('ticketId', id);
    window.HMI_UTILS.log('info', 'Ticket ID set', { ticketId: id });
  },

  getTicketId() { 
    return this.get('ticketId'); 
  },

  setTicketData(data) {
    this.set('ticketData', data);
  },

  getTicketData() {
    return this.get('ticketData');
  },

  // Các method cho session
  setSessionId(id) { 
    this.set('sessionId', id);
    window.HMI_UTILS.log('info', 'Session ID set', { sessionId: id });
  },

  getSessionId() { 
    return this.get('sessionId'); 
  },

  setSessionData(data) {
    this.set('sessionData', data);
  },

  getSessionData() {
    return this.get('sessionData');
  },

  // Các method cho charge point
  setChargePointId(id) {
    this.set('chargePointId', id);
  },

  getChargePointId() {
    return this.get('chargePointId');
  },

  setConnectorId(id) {
    this.set('connectorId', id);
  },

  getConnectorId() {
    return this.get('connectorId');
  },

  // Các method cho payment
  setPaymentId(id) {
    this.set('paymentId', id);
  },

  getPaymentId() {
    return this.get('paymentId');
  },

  setPaymentData(data) {
    this.set('paymentData', data);
  },

  getPaymentData() {
    return this.get('paymentData');
  },

  // Các method cho user
  setUserId(id) {
    this.set('userId', id);
  },

  getUserId() {
    return this.get('userId');
  },

  setUserData(data) {
    this.set('userData', data);
  },

  getUserData() {
    return this.get('userData');
  },

  // Các method cho settings
  setSettings(settings) {
    this.set('settings', settings);
  },

  getSettings() {
    return this.get('settings') || {};
  },

  updateSetting(key, value) {
    const settings = this.getSettings();
    settings[key] = value;
    this.setSettings(settings);
  },

  // Các method cho history
  addToHistory(item) {
    const history = this.getHistory();
    history.unshift({
      ...item,
      timestamp: new Date().toISOString()
    });
    // Giới hạn lịch sử 100 items
    if (history.length > 100) {
      history.splice(100);
    }
    this.set('history', history);
  },

  getHistory() {
    return this.get('history') || [];
  },

  clearHistory() {
    this.del('history');
  },

  // Các method cho cache
  setCache(key, data, ttl = 300000) { // 5 phút mặc định
    const cacheData = {
      data,
      timestamp: Date.now(),
      ttl
    };
    this.set(`cache_${key}`, cacheData);
  },

  getCache(key) {
    const cacheData = this.get(`cache_${key}`);
    if (!cacheData) return null;

    const now = Date.now();
    if (now - cacheData.timestamp > cacheData.ttl) {
      this.del(`cache_${key}`);
      return null;
    }

    return cacheData.data;
  },

  clearCache() {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('cache_')) {
        this.del(key);
      }
    });
  },

  // Utility methods
  getAllKeys() {
    return Object.keys(localStorage);
  },

  getSize() {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    return total;
  },

  exportData() {
    const data = {};
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        data[key] = this.get(key);
      }
    }
    return data;
  },

  importData(data) {
    try {
      for (let key in data) {
        this.set(key, data[key]);
      }
      window.HMI_UTILS.log('info', 'Data imported successfully');
    } catch (error) {
      window.HMI_UTILS.log('error', 'Data import failed', { error: error.message });
    }
  }
};

// Khởi tạo logging
window.HMI_UTILS.log('info', 'API and Store loaded successfully');

// Export cho sử dụng global
window.API = API;
window.Store = Store;





