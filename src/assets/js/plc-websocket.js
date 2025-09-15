// src/assets/js/plc-websocket.js
// WebSocket client để kết nối với PLC server real-time

class PLCWebSocketClient {
    constructor() {
        this.ws = null;
        this.reconnectInterval = 5000; // 5 giây
        this.maxReconnectAttempts = 10;
        this.reconnectAttempts = 0;
        this.isConnected = false;
        this.lastData = null;
        this.connectionStatusElement = null;
        this.lastDebugInfo = null;
        
        // Trạng thái cắm sạc: 0 = chưa cắm, 1 = đã cắm
        this.chargingStatus = {
            khungA: 0, // Thanh ghi 0 - AC
            khungB: 0  // Thanh ghi 1 - DC
        };
    }
    
    connect() {
        try {
            console.log('Connecting to PLC WebSocket...');
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.onopen = () => {
                console.log('✅ Connected to PLC WebSocket');
                this.isConnected = true;
                this.reconnectAttempts = 0;
                this.onConnected();
            };
            
            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    this.lastData = data;
                    this.onDataReceived(data);
                } catch (error) {
                    console.error('Error parsing PLC data:', error);
                }
            };
            
            this.ws.onclose = () => {
                console.log('❌ PLC WebSocket disconnected');
                this.isConnected = false;
                this.onDisconnected();
                this.attemptReconnect();
            };
            
            this.ws.onerror = (error) => {
                console.error('PLC WebSocket error:', error);
                this.updateConnectionStatus(false, 'Connection Error');
            };
            
        } catch (error) {
            console.error('Failed to connect to PLC WebSocket:', error);
            this.attemptReconnect();
        }
    }
    
    attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`🔄 Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
            this.updateConnectionStatus(false, `Reconnecting... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
            setTimeout(() => this.connect(), this.reconnectInterval);
        } else {
            console.error('❌ Max reconnection attempts reached');
            this.updateConnectionStatus(false, 'Connection Failed');
        }
    }
    
    onConnected() {
        // Cập nhật UI khi kết nối thành công
        this.updateConnectionStatus(true, 'PLC Connected');
        
        // Khởi tạo giá trị mặc định cho tất cả các element
        this.initializeDefaultValues();
        
        // Gửi lệnh lấy trạng thái hiện tại
        this.sendCommand({ command: 'get_status' });
        
        // Đăng ký đọc thanh ghi 0 và 1 (trạng thái cắm sạc)
        this.sendCommand({ 
            command: 'subscribe_registers', 
            registers: [0, 1] 
        });
    }
    
    onDisconnected() {
        // Cập nhật UI khi mất kết nối
        this.updateConnectionStatus(false, 'PLC Disconnected');
    }
    
    // Khởi tạo giá trị mặc định cho tất cả các element
    initializeDefaultValues() {
        console.log('🔄 Initializing default values for all elements');
        
        // Danh sách các element cần khởi tạo
        const elementsToInit = [
            'power-ac', 'energy-ac', 'kwh-ac',
            'voltage', 'current', 'power', 'energy', 'battery-percent', 'kwh-dc'
        ];
        
        // Khởi tạo tất cả các element với giá trị 0
        elementsToInit.forEach(elementId => {
            this.updateValue(elementId, 0);
        });
        
        console.log('✅ Default values initialized');
    }
    
    onDataReceived(data) {
        console.log('📨 PLC Data Received:', data);
        
        // Lưu debug info để hiển thị với Ctrl+D
        this.lastDebugInfo = {
            timestamp: new Date().toLocaleTimeString(),
            data: data,
            registerDetected: data.register0 !== undefined || data.register1 !== undefined,
            register0: data.register0,
            register1: data.register1
        };
        
        // Xử lý trạng thái cắm sạc từ register0 và register1
        const currentPage = window.location.pathname.split('/').pop();
        
        // Cập nhật trạng thái khung A từ register0
        if (data.register0 !== undefined) {
            this.chargingStatus.khungA = data.register0;
            console.log(`🔄 Register 0 = ${data.register0} → ${data.register0 === 0 ? 'Hiện "Vui lòng cắm sạc để bắt đầu"' : 'Hiện nút "Bắt đầu"'}`);
            
            // Chỉ cập nhật khung A nếu trang hiện tại có khung A dùng PLC
            if (currentPage === 'trang2.html' || currentPage === 'trang2_2.html' || currentPage === 'trang2_2_TTTT.html') {
                this.updateKhungAStatus();
            } else {
                console.log('⏭️ Bỏ qua cập nhật khung A (trang không dùng PLC cho khung A)');
            }
        }
        
        // Cập nhật trạng thái khung B từ register1
        if (data.register1 !== undefined) {
            this.chargingStatus.khungB = data.register1;
            console.log(`🔄 Register 1 = ${data.register1} → ${data.register1 === 0 ? 'Hiện "Vui lòng cắm sạc để bắt đầu"' : 'Hiện nút "Bắt đầu"'}`);
            
            // Chỉ cập nhật khung B nếu trang hiện tại có khung B dùng PLC
            if (currentPage === 'trang2.html' || currentPage === 'trang2_1.html' || currentPage === 'trang2_1_TTTT.html') {
                this.updateKhungBStatus();
            } else {
                console.log('⏭️ Bỏ qua cập nhật khung B (trang không dùng PLC cho khung B)');
            }
        }
        
        // Hiển thị thông báo tổng hợp
        const msg = `📊 All data: Reg0=${data.register0 || 0}, Reg1=${data.register1 || 0} | AC P=${data.powerAC || 0}, E=${data.energyAC || 0} | DC U=${data.voltageDC || 0}, I=${data.currentDC || 0}`;
        this.showTempNotification(msg);
        
        // Cập nhật UI với dữ liệu mới từ PLC
        this.updateChargingDisplay(data);
        this.updateChargingStatus(data);
    }
    
    updateConnectionStatus(connected, message) {
        // Tìm hoặc tạo element hiển thị trạng thái kết nối
        if (!this.connectionStatusElement) {
            this.connectionStatusElement = document.getElementById('plc-connection-status');
            if (!this.connectionStatusElement) {
                // Tạo element nếu chưa có
                const statusDiv = document.createElement('div');
                statusDiv.id = 'plc-connection-status';
                statusDiv.style.cssText = 'position: fixed; top: 10px; right: 10px; z-index: 1000; padding: 5px 10px; border-radius: 5px; font-size: 12px; font-weight: bold;';
                document.body.appendChild(statusDiv);
                this.connectionStatusElement = statusDiv;
            }
        }
        
        if (this.connectionStatusElement) {
            this.connectionStatusElement.textContent = message;
            this.connectionStatusElement.style.backgroundColor = connected ? '#28a745' : '#dc3545';
            this.connectionStatusElement.style.color = 'white';
        }
    }
    
    updateChargingDisplay(data) {
        // Kiểm tra dữ liệu có tồn tại không
        if (!data) {
            console.log('⚠️ No PLC data received');
            return;
        }
        
        console.log('🔄 Updating charging display with data:', data);
        
        // Cập nhật các giá trị AC (Khung A) - với giá trị mặc định nếu không có
        console.log('📊 AC Values:', {
            powerAC: data.powerAC,
            energyAC: data.energyAC,
            kwhAC: data.kwhAC
        });
        
        this.updateValue('power-ac', data.powerAC || 0);
        this.updateValue('energy-ac', data.energyAC || 0);
        this.updateValue('kwh-ac', data.kwhAC || 0);
        
        // Cập nhật các giá trị DC (Khung B) - với giá trị mặc định nếu không có
        console.log('📊 DC Values:', {
            voltageDC: data.voltageDC,
            currentDC: data.currentDC,
            powerDC: data.powerDC,
            energyDC: data.energyDC,
            socDC: data.socDC,
            kwhDC: data.kwhDC
        });
        
        this.updateValue('voltage', data.voltageDC || 0);
        this.updateValue('current', data.currentDC || 0);
        this.updateValue('power', data.powerDC || 0);
        this.updateValue('energy', data.energyDC || 0);
        this.updateValue('battery-percent', data.socDC || 0);
        this.updateValue('kwh-dc', data.kwhDC || 0);
        
        // Cập nhật timestamp
        if (data.timestamp) {
            const timeElement = document.getElementById('plc-timestamp');
            if (timeElement) {
                const date = new Date(data.timestamp * 1000);
                timeElement.textContent = date.toLocaleTimeString();
            }
        }
        
        // Log dữ liệu để debug
        console.log('✅ PLC Data Updated:', {
            // AC Data (Khung A)
            powerAC: data.powerAC || 0,
            energyAC: data.energyAC || 0,
            kwhAC: data.kwhAC || 0,
            // DC Data (Khung B)
            voltage: data.voltageDC || 0,
            current: data.currentDC || 0,
            power: data.powerDC || 0,
            energy: data.energyDC || 0,
            soc: (data.socDC || 0) + '%',
            kwhDC: data.kwhDC || 0,
            connected: data.connected || false
        });
    }
    
    updateChargingStatus(data) {
        // Không còn cần update charging status vì đã bỏ register 0,1
        // Có thể thêm logic khác ở đây nếu cần
    }
    
    // Cập nhật trạng thái khung A (AC)
    updateKhungAStatus() {
        console.log('🔄 Updating Khung A status, value:', this.chargingStatus.khungA);
        let khungA = document.querySelector('.khung-a-trong .tttt-content');
        if (!khungA) {
            // Tạo element nếu chưa có
            const khungAContainer = document.querySelector('.khung-a-trong');
            if (khungAContainer) {
                khungA = document.createElement('div');
                khungA.className = 'tttt-content';
                khungAContainer.appendChild(khungA);
                console.log('✅ Created Khung A content element');
            } else {
                console.log('❌ Khung A container not found!');
                return;
            }
        }
        
        if (this.chargingStatus.khungA === 1) {
            console.log('✅ Khung A: Showing button');
            // Đã cắm sạc - hiện nút Bắt đầu
            this.updateKhungAWithButton(khungA);
        } else {
            console.log('📝 Khung A: Showing message');
            // Chưa cắm sạc - hiện thông báo
            this.updateKhungAWithMessage(khungA);
        }
    }
    
    // Cập nhật trạng thái khung B (DC)
    updateKhungBStatus() {
        console.log('🔄 Updating Khung B status, value:', this.chargingStatus.khungB);
        let khungB = document.querySelector('.khung-b-trong .tttt-content');
        if (!khungB) {
            // Tạo element nếu chưa có
            const khungBContainer = document.querySelector('.khung-b-trong');
            if (khungBContainer) {
                khungB = document.createElement('div');
                khungB.className = 'tttt-content';
                khungBContainer.appendChild(khungB);
                console.log('✅ Created Khung B content element');
            } else {
                console.log('❌ Khung B container not found!');
                return;
            }
        }
        
        if (this.chargingStatus.khungB === 1) {
            console.log('✅ Khung B: Showing button');
            // Đã cắm sạc - hiện nút Bắt đầu
            this.updateKhungBWithButton(khungB);
        } else {
            console.log('📝 Khung B: Showing message');
            // Chưa cắm sạc - hiện thông báo
            this.updateKhungBWithMessage(khungB);
        }
    }
    
    // Cập nhật khung A với nút Bắt đầu (đặt ở đáy khung)
    updateKhungAWithButton(khungA) {
        khungA.innerHTML = `
            <div style="position:absolute; bottom: 6%; left:50%; transform:translateX(-50%); width:80%; text-align:center;">
                <button class="start-button" onclick="startChargingA()" 
                    style="background:#28a745; color:#fff; border:none; padding:14px 22px; border-radius:8px; cursor:pointer; font-size:18px; width:100%; max-width:320px;">
                    Bắt đầu
                </button>
            </div>
        `;
        console.log('✅ Hiển thị nút "Bắt đầu" cho Khung A');
    }
    
    // Cập nhật khung A với thông báo chưa cắm sạc (để ảnh khungA.jpg hiển thị text có sẵn)
    updateKhungAWithMessage(khungA) {
        khungA.innerHTML = ''; // Để trống để ảnh khungA.jpg hiển thị text có sẵn
        console.log('✅ Hiển thị ảnh khungA.jpg với text "Vui lòng cắm sạc để bắt đầu" có sẵn');
    }
    
    // Cập nhật khung B với nút Bắt đầu (đặt ở đáy khung)
    updateKhungBWithButton(khungB) {
        khungB.innerHTML = `
            <div style="position:absolute; bottom: 6%; left:50%; transform:translateX(-50%); width:80%; text-align:center;">
                <button class="start-button" onclick="startChargingB()" 
                    style="background:#28a745; color:#fff; border:none; padding:14px 22px; border-radius:8px; cursor:pointer; font-size:18px; width:100%; max-width:320px;">
                    Bắt đầu
                </button>
            </div>
        `;
        console.log('✅ Hiển thị nút "Bắt đầu" cho Khung B');
    }
    
    // Cập nhật khung B với thông báo chưa cắm sạc (để ảnh khungB.jpg hiển thị text có sẵn)
    updateKhungBWithMessage(khungB) {
        khungB.innerHTML = ''; // Để trống để ảnh khungB.jpg hiển thị text có sẵn
        console.log('✅ Hiển thị ảnh khungB.jpg với text "Vui lòng cắm sạc để bắt đầu" có sẵn');
    }
    
    updateValue(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            // Kiểm tra giá trị hợp lệ trước khi format
            if (value === null || value === undefined || isNaN(value) || value === '') {
                // Hiển thị 0 hoặc dấu gạch ngang nếu không có dữ liệu
                element.textContent = '0';
                console.log(`🔧 ${elementId}: Set to 0 (invalid value: ${value})`);
                return;
            }
            
            // Format số dựa trên loại dữ liệu
            let formattedValue = value;
            
            if (elementId === 'battery-percent') {
                formattedValue = Math.round(value) + '%';
            } else if (elementId === 'voltage' || elementId === 'current') {
                formattedValue = value.toFixed(1);
            } else if (elementId.includes('power') || elementId.includes('energy') || elementId.includes('kwh')) {
                formattedValue = Math.round(value);
            } else {
                formattedValue = value.toFixed(1);
            }
            
            element.textContent = formattedValue;
            console.log(`✅ ${elementId}: Updated to ${formattedValue} (original: ${value})`);
        } else {
            console.log(`❌ Element not found: ${elementId}`);
        }
    }
    
    sendCommand(command) {
        if (this.ws && this.isConnected) {
            this.ws.send(JSON.stringify(command));
        } else {
            console.warn('WebSocket not connected, cannot send command:', command);
        }
    }
    
    getLastData() {
        return this.lastData;
    }
    
    disconnect() {
        if (this.ws) {
            this.ws.close();
        }
    }
    
    // Method để lấy dữ liệu hiện tại (cho các trang khác sử dụng)
    getChargingData() {
        return this.lastData;
    }
    
    // Method để lấy trạng thái cắm sạc
    getChargingStatus() {
        return this.chargingStatus;
    }
    
    // Method để kiểm tra khung A có cắm sạc không
    isKhungAConnected() {
        return this.chargingStatus.khungA === 1;
    }
    
    // Method để kiểm tra khung B có cắm sạc không
    isKhungBConnected() {
        return this.chargingStatus.khungB === 1;
    }
    
    // Method để hiển thị thông báo nhanh ở góc màn hình
    showTempNotification(message) {
        // Xóa notification cũ
        const oldNotif = document.getElementById('temp-notification');
        if (oldNotif) {
            oldNotif.remove();
        }

        // Tạo notification mới
        const notif = document.createElement('div');
        notif.id = 'temp-notification';
        notif.style.cssText = `
            position: fixed;
            top: 60px;
            right: 20px;
            background: rgba(0,0,0,0.9);
            color: #00ff00;
            padding: 10px 15px;
            border-radius: 6px;
            font-family: monospace;
            font-size: 14px;
            z-index: 9999;
            border: 2px solid #00ff00;
            box-shadow: 0 4px 12px rgba(0,0,0,0.7);
        `;
        
        notif.textContent = message;
        document.body.appendChild(notif);

        // Tự động xóa sau 3 giây
        setTimeout(() => {
            if (notif.parentNode) {
                notif.remove();
            }
        }, 3000);
    }
    
    // Method để hiển thị debug info trên màn hình
    showDebugInfo() {
        // Xóa debug panel cũ nếu có
        const oldPanel = document.getElementById('plc-debug-panel');
        if (oldPanel) {
            oldPanel.remove();
        }

        // Tạo debug panel
        const panel = document.createElement('div');
        panel.id = 'plc-debug-panel';
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.95);
            color: white;
            padding: 20px;
            border-radius: 12px;
            font-family: monospace;
            font-size: 14px;
            z-index: 10000;
            max-width: 600px;
            border: 3px solid #00ff00;
            box-shadow: 0 8px 32px rgba(0,0,0,0.8);
        `;

        let html = '<h2 style="margin:0 0 15px 0; color:#00ff00; text-align:center;">🔧 PLC DEBUG INFO</h2>';
        
        // Connection status
        html += '<div style="margin-bottom: 15px;">';
        html += '<strong style="color:#ffff00;">Connection:</strong> ';
        html += this.isConnected ? '<span style="color:#00ff00;">✅ Connected</span>' : '<span style="color:#ff0000;">❌ Disconnected</span>';
        html += '</div>';
        
        // Charging status
        html += '<div style="margin-bottom: 15px;">';
        html += '<strong style="color:#ffff00;">Charging Status:</strong><br>';
        html += `🅰️ Khung A (Register 0): ${this.chargingStatus.khungA} ${this.chargingStatus.khungA === 1 ? '(Cắm sạc)' : '(Chưa cắm)'}<br>`;
        html += `🅱️ Khung B (Register 1): ${this.chargingStatus.khungB} ${this.chargingStatus.khungB === 1 ? '(Cắm sạc)' : '(Chưa cắm)'}`;
        html += '</div>';
        
        // Last received data
        if (this.lastDebugInfo) {
            html += '<div style="margin-bottom: 15px;">';
            html += '<strong style="color:#ffff00;">Last PLC Data:</strong><br>';
            html += `Time: ${this.lastDebugInfo.timestamp}<br>`;
            html += `Register Detected: ${this.lastDebugInfo.registerDetected ? '✅' : '❌'}<br>`;
            if (this.lastDebugInfo.registerDetected) {
                html += `Register 0: ${this.lastDebugInfo.register0}<br>`;
                html += `Register 1: ${this.lastDebugInfo.register1}<br>`;
            }
            html += `Raw Data: ${JSON.stringify(this.lastDebugInfo.data)}`;
            html += '</div>';
        } else {
            html += '<div style="margin-bottom: 15px;">';
            html += '<strong style="color:#ffff00;">Last PLC Data:</strong> No data received yet';
            html += '</div>';
        }
        
        // Elements check
        html += '<div style="margin-bottom: 15px;">';
        html += '<strong style="color:#ffff00;">Elements Check:</strong><br>';
        const khungA = document.querySelector('.khung-a-trong .tttt-content');
        const khungB = document.querySelector('.khung-b-trong .tttt-content');
        html += `Khung A Element: ${khungA ? '✅ Found' : '❌ Not Found'}<br>`;
        html += `Khung B Element: ${khungB ? '✅ Found' : '❌ Not Found'}`;
        html += '</div>';

        html += '<button onclick="document.getElementById(\'plc-debug-panel\').remove()" style="background:#ff4444;color:white;border:none;padding:8px 16px;border-radius:6px;cursor:pointer;width:100%;margin-top:10px;">Đóng</button>';

        panel.innerHTML = html;
        document.body.appendChild(panel);

        // Tự động đóng sau 15 giây
        setTimeout(() => {
            if (panel.parentNode) {
                panel.remove();
            }
        }, 15000);
    }
}

// Khởi tạo client khi trang load
let plcClient;

document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing PLC WebSocket client...');
    plcClient = new PLCWebSocketClient();
    
    // Khởi tạo giá trị mặc định ngay lập tức
    plcClient.initializeDefaultValues();
    
    plcClient.connect();
    
    // Export để sử dụng global
    window.PLCClient = plcClient;
    
    // Cập nhật trạng thái ban đầu cho trang có khung A/B
    setTimeout(() => {
        const currentPage = window.location.pathname.split('/').pop();
        
        if (currentPage === 'trang2.html') {
            // Trang2: cập nhật cả 2 khung
            console.log('🔄 Khởi tạo trang2.html - cả 2 khung');
            plcClient.updateKhungAStatus();
            plcClient.updateKhungBStatus();
        } else if (currentPage === 'trang2_1.html' || currentPage === 'trang2_1_TTTT.html') {
            // Trang2_1: chỉ cập nhật khung B (khung A giữ nguyên buttons/TTTT)
            console.log(`🔄 Khởi tạo ${currentPage} - chỉ khung B (khung A không PLC)`);
            plcClient.updateKhungBStatus();
        } else if (currentPage === 'trang2_2.html' || currentPage === 'trang2_2_TTTT.html') {
            // Trang2_2: chỉ cập nhật khung A (khung B giữ nguyên buttons/TTTT)
            console.log(`🔄 Khởi tạo ${currentPage} - chỉ khung A (khung B không PLC)`);
            plcClient.updateKhungAStatus();
        }
    }, 1000);
});

// Event listener cho Ctrl+D để hiển thị debug info
document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key === 'd') {
        event.preventDefault();
        if (window.PLCClient) {
            window.PLCClient.showDebugInfo();
        } else {
            alert('PLC Client chưa được khởi tạo!');
        }
    }
});

// Export class để sử dụng trong các module khác
window.PLCWebSocketClient = PLCWebSocketClient;

// Global functions để xử lý nút Bắt đầu (chức năng động giống phím 1 và 2)
window.startChargingA = function() {
    if (window.PLCClient && window.PLCClient.isKhungAConnected()) {
        // Nút Bắt đầu Khung A có chức năng giống phím 1 tùy theo trang hiện tại
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        if (currentPage === 'trang2.html') {
            console.log('✅ Nút Bắt đầu Khung A từ trang2 → trang2_1.html (giống phím 1)');
            window.location.href = 'trang2_1.html';
        } else if (currentPage === 'trang2_2.html') {
            console.log('✅ Nút Bắt đầu Khung A từ trang2_2 → trang2_dual.html (giống phím 1)');
            window.location.href = 'trang2_dual.html';
        } else if (currentPage === 'trang2_2_TTTT.html') {
            // Trên trang2_2_TTTT: kiểm tra QR trong khung B giống phím 1
            const paymentAmount = Store ? Store.get('paymentAmount') : null;
            const selectedKhung = Store ? Store.get('selectedKhung') : null;
            
            console.log('🔍 Nút Bắt đầu Khung A từ trang2_2_TTTT - kiểm tra QR khung B:', {
                paymentAmount, selectedKhung, hasQR: paymentAmount && selectedKhung === 'B'
            });
            
            if (paymentAmount && selectedKhung === 'B') {
                console.log('✅ Nút Bắt đầu Khung A → trang2_dual_QR_Buttons_B.html (CÓ QR khung B)');
                window.location.href = 'trang2_dual_QR_Buttons_B.html';
            } else {
                console.log('✅ Nút Bắt đầu Khung A → trang2_dual_TTTT_Buttons_B.html (CHƯA CÓ QR khung B)');
                window.location.href = 'trang2_dual_TTTT_Buttons_B.html';
            }
        } else {
            // Mặc định cho các trang khác
            console.log('✅ Nút Bắt đầu Khung A → trang2_1.html (mặc định)');
            window.location.href = 'trang2_1.html';
        }
    } else {
        alert('Vui lòng cắm sạc trước khi bắt đầu!');
    }
};

window.startChargingB = function() {
    if (window.PLCClient && window.PLCClient.isKhungBConnected()) {
        // Nút Bắt đầu Khung B có chức năng giống phím 2 tùy theo trang hiện tại
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        if (currentPage === 'trang2.html') {
            console.log('✅ Nút Bắt đầu Khung B từ trang2 → trang2_2.html (giống phím 2)');
            window.location.href = 'trang2_2.html';
        } else if (currentPage === 'trang2_1.html') {
            console.log('✅ Nút Bắt đầu Khung B từ trang2_1 → trang2_dual.html (giống phím 2)');
            window.location.href = 'trang2_dual.html';
        } else if (currentPage === 'trang2_1_TTTT.html') {
            // Trên trang2_1_TTTT: kiểm tra QR trong khung A giống phím 2
            const paymentAmount = Store ? Store.get('paymentAmount') : null;
            const selectedKhung = Store ? Store.get('selectedKhung') : null;
            
            console.log('🔍 Nút Bắt đầu Khung B từ trang2_1_TTTT - kiểm tra QR khung A:', {
                paymentAmount, selectedKhung, hasQR: paymentAmount && selectedKhung === 'A'
            });
            
            if (paymentAmount && selectedKhung === 'A') {
                console.log('✅ Nút Bắt đầu Khung B → trang2_dual_QR_Buttons_A.html (CÓ QR khung A)');
                window.location.href = 'trang2_dual_QR_Buttons_A.html';
            } else {
                console.log('✅ Nút Bắt đầu Khung B → trang2_dual_TTTT_Buttons_A.html (CHƯA CÓ QR khung A)');
                window.location.href = 'trang2_dual_TTTT_Buttons_A.html';
            }
        } else {
            // Mặc định cho các trang khác
            console.log('✅ Nút Bắt đầu Khung B → trang2_2.html (mặc định)');
            window.location.href = 'trang2_2.html';
        }
    } else {
        alert('Vui lòng cắm sạc trước khi bắt đầu!');
    }
};
