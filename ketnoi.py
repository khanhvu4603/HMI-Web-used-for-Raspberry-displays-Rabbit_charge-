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
        
    async def register_client(self, websocket):
        """Đăng ký client mới"""
        self.connected_clients.add(websocket)
        print(f"Client connected. Total: {len(self.connected_clients)}")
        
    async def unregister_client(self, websocket):
        """Hủy đăng ký client"""
        self.connected_clients.discard(websocket)
        print(f"Client disconnected. Total: {len(self.connected_clients)}")
        
    async def read_plc_data(self):
        """Đọc dữ liệu từ PLC - địa chỉ 2-10"""
        try:
            if not self.plc_client.is_socket_open():
                if not self.plc_client.connect():
                    self.charging_data['connected'] = False
                    return None
                    
            # Đọc 9 Holding Registers từ địa chỉ 2-10
            response = self.plc_client.read_holding_registers(address=2, count=9)
            
            if not response.isError():
                registers = response.registers
                
                # Mapping dữ liệu theo bảng địa chỉ mới
                self.charging_data = {
                    # Khung A - AC Parameters
                    'powerAC': registers[0],               # Register 2: P (AC)
                    'energyAC': registers[1],              # Register 3: E (AC)
                    'kwhAC': registers[2],                 # Register 4: kWh (AC)
                    
                    # Khung B - DC Parameters
                    'kwhDC': registers[3],                 # Register 5: kWh (DC)
                    'socDC': registers[4],                 # Register 6: SOC (DC) - x%
                    'voltageDC': registers[5],             # Register 7: U (DC)
                    'currentDC': registers[6],             # Register 8: I (DC)
                    'powerDC': registers[7],               # Register 9: P (DC)
                    'energyDC': registers[8],              # Register 10: E (DC)
                    
                    'timestamp': time.time(),
                    'connected': True
                }
                
                # Log dữ liệu để debug
                print(f"AC: P={registers[0]}, E={registers[1]}, kWh={registers[2]} | DC: U={registers[5]}, I={registers[6]}, P={registers[7]}, E={registers[8]}, SOC={registers[4]}%")
                
                return self.charging_data
            else:
                print("Lỗi khi đọc dữ liệu từ PLC")
                self.charging_data['connected'] = False
                return None
                
        except Exception as e:
            print(f"Lỗi đọc PLC: {e}")
            self.charging_data['connected'] = False
            return None
            
    async def broadcast_data(self):
        """Gửi dữ liệu đến tất cả client"""
        if self.connected_clients:
            data = json.dumps(self.charging_data)
            # Gửi đến tất cả client kết nối
            disconnected = set()
            for client in self.connected_clients:
                try:
                    await client.send(data)
                except websockets.exceptions.ConnectionClosed:
                    disconnected.add(client)
                    
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
        print("Reading PLC registers 2-10:")
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
