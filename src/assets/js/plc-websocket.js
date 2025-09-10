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
        
        // Gửi lệnh lấy trạng thái hiện tại
        this.sendCommand({ command: 'get_status' });
    }
    
    onDisconnected() {
        // Cập nhật UI khi mất kết nối
        this.updateConnectionStatus(false, 'PLC Disconnected');
    }
    
    onDataReceived(data) {
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
        // Cập nhật các giá trị AC (Khung A)
        this.updateValue('power-ac', data.powerAC);
        this.updateValue('energy-ac', data.energyAC);
        this.updateValue('kwh-ac', data.kwhAC);
        
        // Cập nhật các giá trị DC (Khung B)
        this.updateValue('voltage', data.voltageDC);
        this.updateValue('current', data.currentDC);
        this.updateValue('power', data.powerDC);
        this.updateValue('energy', data.energyDC);
        this.updateValue('battery-percent', data.socDC);
        this.updateValue('kwh-dc', data.kwhDC);
        
        // Cập nhật timestamp
        if (data.timestamp) {
            const timeElement = document.getElementById('plc-timestamp');
            if (timeElement) {
                const date = new Date(data.timestamp * 1000);
                timeElement.textContent = date.toLocaleTimeString();
            }
        }
        
        // Log dữ liệu để debug
        console.log('PLC Data Updated:', {
            // AC Data (Khung A)
            powerAC: data.powerAC,
            energyAC: data.energyAC,
            kwhAC: data.kwhAC,
            // DC Data (Khung B)
            voltage: data.voltageDC,
            current: data.currentDC,
            power: data.powerDC,
            energy: data.energyDC,
            soc: data.socDC + '%',
            kwhDC: data.kwhDC,
            connected: data.connected
        });
    }
    
    updateChargingStatus(data) {
        // Không còn cần update charging status vì đã bỏ register 0,1
        // Có thể thêm logic khác ở đây nếu cần
    }
    
    updateValue(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
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
}

// Khởi tạo client khi trang load
let plcClient;

document.addEventListener('DOMContentLoaded', () => {
    // Chỉ khởi tạo trên các trang có dữ liệu sạc
    if (document.getElementById('voltage') || document.getElementById('current') || 
        document.getElementById('power') || document.getElementById('energy') ||
        document.getElementById('power-ac') || document.getElementById('energy-ac') ||
        document.getElementById('kwh-ac') || document.getElementById('kwh-dc')) {
        
        console.log('Initializing PLC WebSocket client...');
        plcClient = new PLCWebSocketClient();
        plcClient.connect();
        
        // Export để sử dụng global
        window.PLCClient = plcClient;
    }
});

// Export class để sử dụng trong các module khác
window.PLCWebSocketClient = PLCWebSocketClient;
