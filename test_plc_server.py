#!/usr/bin/env python3
"""
Script test để kiểm tra PLC WebSocket server
"""

import asyncio
import websockets
import json
import time

async def test_client():
    """Test client kết nối đến PLC server"""
    uri = "ws://localhost:8765"
    
    try:
        async with websockets.connect(uri) as websocket:
            print("✅ Connected to PLC WebSocket server")
            
            # Lắng nghe dữ liệu trong 30 giây
            timeout = 30
            start_time = time.time()
            
            while time.time() - start_time < timeout:
                try:
                    # Nhận dữ liệu với timeout 1 giây
                    message = await asyncio.wait_for(websocket.recv(), timeout=1.0)
                    data = json.loads(message)
                    
                    # Hiển thị tất cả dữ liệu trong một message
                    print(f"📊 All data: Reg0={data.get('register0', 0)}, Reg1={data.get('register1', 0)} | AC P={data.get('powerAC', 0)}, E={data.get('energyAC', 0)}, kWh={data.get('kwhAC', 0)} | DC U={data.get('voltageDC', 0)}, I={data.get('currentDC', 0)}, P={data.get('powerDC', 0)}, E={data.get('energyDC', 0)}, SOC={data.get('socDC', 0)}%")
                        
                except asyncio.TimeoutError:
                    print("⏳ Waiting for data...")
                    continue
                except Exception as e:
                    print(f"❌ Error receiving data: {e}")
                    break
                    
            print("✅ Test completed")
            
    except Exception as e:
        print(f"❌ Connection failed: {e}")

if __name__ == "__main__":
    print("🧪 Testing PLC WebSocket server...")
    asyncio.run(test_client())
