#!/bin/bash

echo "Starting PLC WebSocket Server..."
echo

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Python3 is not installed"
    echo "Please install Python 3.7+ and try again"
    exit 1
fi

# Install requirements if needed
echo "Installing Python dependencies..."
pip3 install -r requirements.txt

echo
echo "Starting PLC WebSocket Server on localhost:8765"
echo "Reading PLC registers 0-9 from 192.168.0.8:502"
echo "Press Ctrl+C to stop"
echo

# Start the PLC server
python3 ketnoi.py

