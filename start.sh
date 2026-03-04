#!/bin/bash

# Banana Pro 簡報生成器 - 快速啟動腳本

echo "🚀 Banana Pro 簡報生成器"
echo "================================"
echo ""

# 檢查作業系統
OS="$(uname -s)"
case "${OS}" in
    Linux*)     MACHINE=Linux;;
    Darwin*)    MACHINE=Mac;;
    CYGWIN*)    MACHINE=Cygwin;;
    MINGW*)     MACHINE=MinGw;;
    *)          MACHINE="UNKNOWN:${OS}"
esac

echo "作業系統: $MACHINE"
echo ""

# 選擇啟動方式
echo "請選擇啟動方式："
echo "1) 使用 Python 內建伺服器 (推薦)"
echo "2) 使用 Node.js http-server"
echo "3) 直接在瀏覽器中開啟 HTML"
echo ""
read -p "請輸入選項 (1-3): " choice

case $choice in
    1)
        echo ""
        echo "🐍 使用 Python 啟動本地伺服器..."
        echo "網址: http://localhost:8000"
        echo ""
        echo "按 Ctrl+C 停止伺服器"
        echo ""
        
        # 檢查 Python 版本
        if command -v python3 &> /dev/null; then
            python3 -m http.server 8000
        elif command -v python &> /dev/null; then
            python -m SimpleHTTPServer 8000
        else
            echo "❌ 錯誤: 未找到 Python"
            echo "請安裝 Python 或選擇其他啟動方式"
            exit 1
        fi
        ;;
    
    2)
        echo ""
        echo "📦 使用 Node.js 啟動伺服器..."
        echo "網址: http://localhost:8000"
        echo ""
        
        if command -v npx &> /dev/null; then
            npx http-server -p 8000
        else
            echo "❌ 錯誤: 未找到 Node.js/npx"
            echo "請安裝 Node.js 或選擇其他啟動方式"
            exit 1
        fi
        ;;
    
    3)
        echo ""
        echo "🌐 在瀏覽器中開啟..."
        echo ""
        
        if [ "$MACHINE" == "Mac" ]; then
            open index.html
        elif [ "$MACHINE" == "Linux" ]; then
            xdg-open index.html
        else
            echo "請手動在瀏覽器中開啟 index.html"
        fi
        
        echo "✓ 已開啟應用程式"
        ;;
    
    *)
        echo "❌ 無效的選項"
        exit 1
        ;;
esac