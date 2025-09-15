import asyncio
import websockets
import json
from pymodbus.client import ModbusTcpClient
import time
from datetime import datetime

class PLCWebSocketServer:
    def __init__(self):
        self.plc_client = ModbusTcpClient('192.168.0.8', port=502)
        self.connected_clients = set()
        self.charging_data = {
            # Khung A - AC Parameters
            'powerAC': 0,             # Register 2: P (AC)
            'energyAC': 0,            # Register 3: E (AC)
            'kwhAC': 0,               # Register 4: kWh (AC)
            
            # Khung B - DC Parameters  
            'kwhDC': 0,               # Register 5: kWh (DC)
            'socDC': 0,               # Register 6: SOC (DC) - x%
            'voltageDC': 0,           # Register 7: U (DC)
            'currentDC': 0,           # Register 8: I (DC)
            'powerDC': 0,             # Register 9: P (DC)
            'energyDC': 0,            # Register 10: E (DC)
            
            'timestamp': None,
            'connected': False
        }
        
        # Trạng thái cắm sạc cho WebSocket client
        self.charging_status = {
            'khungA': 0,  # Register 0: 0 = chưa cắm, 1 = đã cắm
            'khungB': 0   # Register 1: 0 = chưa cắm, 1 = đã cắm
        }
        
    async def register_client(self, websocket):
        """Đăng ký client mới"""
        self.connected_clients.add(websocket)
        print(f"Client connected. Total: {len(self.connected_clients)}")
        
    async def unregister_client(self, websocket):
        """Hủy đăng ký client"""
        self.connected_clients.discard(websocket)
        print(f"Client disconnected. Total: {len(self.connected_clients)}")
        
    async def read_plc_data(self):
        """Đọc dữ liệu từ PLC - địa chỉ 0-10 trong một lần"""
        try:
            if not self.plc_client.is_socket_open():
                if not self.plc_client.connect():
                    self.charging_data['connected'] = False
                    return None
            
            # Đọc tất cả 11 Holding Registers từ địa chỉ 0-10 trong một lần
            try:
                response = self.plc_client.read_holding_registers(address=0, count=11)
                
                if not response.isError():
                    registers = response.registers
                    
                    # Cập nhật trạng thái cắm sạc
                    self.charging_status['khungA'] = registers[0]  # Register 0
                    self.charging_status['khungB'] = registers[1]  # Register 1
                    
                    # Mapping dữ liệu theo bảng địa chỉ mới
                    self.charging_data = {
                        # Trạng thái cắm sạc
                        'register0': registers[0],               # Register 0: Khung A (AC) - 0=chưa cắm, 1=đã cắm
                        'register1': registers[1],               # Register 1: Khung B (DC) - 0=chưa cắm, 1=đã cắm
                        
                        # Khung A - AC Parameters
                        'powerAC': registers[2],               # Register 2: P (AC)
                        'energyAC': registers[3],              # Register 3: E (AC)
                        'kwhAC': registers[4],                 # Register 4: kWh (AC)
                        
                        # Khung B - DC Parameters
                        'kwhDC': registers[5],                 # Register 5: kWh (DC)
                        'socDC': registers[6],                 # Register 6: SOC (DC) - x%
                        'voltageDC': registers[7],             # Register 7: U (DC)
                        'currentDC': registers[8],             # Register 8: I (DC)
                        'powerDC': registers[9],               # Register 9: P (DC)
                        'energyDC': registers[10],              # Register 10: E (DC)
                        
                        'timestamp': time.time(),
                        'connected': True
                    }
                    
                    # Log dữ liệu để debug
                    print(f"📊 All registers: 0={registers[0]}, 1={registers[1]} | AC: P={registers[2]}, E={registers[3]}, kWh={registers[4]} | DC: U={registers[7]}, I={registers[8]}, P={registers[9]}, E={registers[10]}, SOC={registers[6]}%")
                    
                    return self.charging_data
                else:
                    print(f"❌ Lỗi khi đọc thanh ghi 0-10: {response}")
                    # Giữ nguyên dữ liệu cũ nếu không đọc được
                    self.charging_data['connected'] = False
                    return self.charging_data
                    
            except Exception as e:
                print(f"❌ Lỗi đọc thanh ghi 0-10: {e}")
                # Giữ nguyên dữ liệu cũ nếu có lỗi
                self.charging_data['connected'] = False
                return self.charging_data
                
        except Exception as e:
            print(f"❌ Lỗi đọc PLC: {e}")
            self.charging_data['connected'] = False
            return self.charging_data
            
    async def broadcast_data(self):
        """Gửi dữ liệu đến tất cả client - tất cả trong một message"""
        if self.connected_clients:
            # Gửi tất cả dữ liệu trong một message duy nhất
            data = json.dumps(self.charging_data)
            
            # Gửi đến tất cả client kết nối
            disconnected = set()
            for client in self.connected_clients:
                try:
                    # Gửi một message duy nhất chứa tất cả dữ liệu
                    await client.send(data)
                    
                    # Log để debug
                    print(f"📤 Sent to client: Reg0={self.charging_data.get('register0', 0)}, Reg1={self.charging_data.get('register1', 0)} | AC P={self.charging_data.get('powerAC', 0)}, E={self.charging_data.get('energyAC', 0)} | DC U={self.charging_data.get('voltageDC', 0)}, I={self.charging_data.get('currentDC', 0)}")
                    
                except websockets.exceptions.ConnectionClosed:
                    disconnected.add(client)
                except Exception as e:
                    print(f"❌ Lỗi gửi dữ liệu đến client: {e}")
                    
            # Xóa các client đã ngắt kết nối
            for client in disconnected:
                await self.unregister_client(client)
                
    async def handle_client(self, websocket, path):
        """Xử lý kết nối client"""
        await self.register_client(websocket)
        try:
            async for message in websocket:
                # Xử lý lệnh từ client (nếu cần)
                try:
                    data = json.loads(message)
                    print(f"Received from client: {data}")
                    
                    # Có thể thêm xử lý lệnh từ frontend ở đây
                    if data.get('command') == 'get_status':
                        await websocket.send(json.dumps(self.charging_data))
                        
                except json.JSONDecodeError:
                    print(f"Invalid JSON from client: {message}")
                    
        except websockets.exceptions.ConnectionClosed:
            pass
        finally:
            await self.unregister_client(websocket)
            
    async def main_loop(self):
        """Vòng lặp chính - đọc PLC và gửi dữ liệu"""
        while True:
            try:
                # Đọc dữ liệu từ PLC
                await self.read_plc_data()
                
                # Gửi đến tất cả client
                await self.broadcast_data()
                
                # Chờ 1 giây trước khi đọc tiếp
                await asyncio.sleep(1)
                
            except Exception as e:
                print(f"Lỗi trong main loop: {e}")
                await asyncio.sleep(5)  # Chờ 5 giây nếu có lỗi
            
    async def start_server(self, host='localhost', port=8765):
        """Khởi động WebSocket server"""
        print(f"Starting PLC WebSocket server on {host}:{port}")
        print("Reading PLC registers 0-10:")
        print("  Trạng thái cắm sạc:")
        print("    0: Khung A (AC) - 0=chưa cắm, 1=đã cắm")
        print("    1: Khung B (DC) - 0=chưa cắm, 1=đã cắm")
        print("  Khung A (AC):")
        print("    2: P (AC) - Công suất AC")
        print("    3: E (AC) - Năng lượng AC")
        print("    4: kWh (AC) - Kilowatt-hour AC")
        print("  Khung B (DC):")
        print("    5: kWh (DC) - Kilowatt-hour DC")
        print("    6: SOC (DC) - Phần trăm pin")
        print("    7: U (DC) - Điện áp DC")
        print("    8: I (DC) - Dòng điện DC")
        print("    9: P (DC) - Công suất DC")
        print("    10: E (DC) - Năng lượng DC")
        
        # Khởi động server
        server = await websockets.serve(self.handle_client, host, port)
        
        # Chạy vòng lặp đọc PLC song song
        asyncio.create_task(self.main_loop())
        
        # Chờ server
        await server.wait_closed()

# Chạy server
if __name__ == "__main__":
    server = PLCWebSocketServer()
    try:
        asyncio.run(server.start_server())
    except KeyboardInterrupt:
        print("\nDừng server theo yêu cầu người dùng.")
    finally:
        if server.plc_client.is_socket_open():
            server.plc_client.close()
        print("Đã đóng kết nối với PLC.")
