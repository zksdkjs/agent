#!/bin/bash
# Simple watch alternative for macOS

echo "📊 LIVE STATUS MONITOR"
echo "Press Ctrl+C to stop"
echo ""

while true; do
    clear
    echo "📊 zkSDK Build Status - $(date '+%Y-%m-%d %H:%M:%S')"
    echo "=================================================="
    echo ""
    
    ./check-real-status.sh
    
    echo ""
    echo "↻ Refreshing in 10 seconds... (Ctrl+C to stop)"
    sleep 10
done
