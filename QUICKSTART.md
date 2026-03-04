# 🚀 快速啟動指南

## 立即開始使用

### 方法 1：使用啟動腳本（推薦）

```bash
cd /Users/donpanic/Documents/programming/my_project/ppt_bananapro
chmod +x start.sh
./start.sh
```

選擇啟動方式，然後在瀏覽器中開啟應用程式。

### 方法 2：使用 Python

```bash
cd /Users/donpanic/Documents/programming/my_project/ppt_bananapro
python3 -m http.server 8000
```

然後在瀏覽器開啟：http://localhost:8000

### 方法 3：直接開啟

```bash
cd /Users/donpanic/Documents/programming/my_project/ppt_bananapro
open index.html
```

## 第一次使用

### 步驟 1：取得 API Key

1. 前往 https://aistudio.google.com/app/apikey
2. 使用 Google 帳號登入
3. 點擊「Create API Key」
4. 選擇或建立專案
5. 複製 API Key

### 步驟 2：測試範例

1. 在應用程式中貼上 API Key
2. 輸入簡報主題：`FamilyMart 品牌介紹`
3. 點擊「載入範例」按鈕（風格設計和版面模版）
4. 設定投影片數量：10 張
5. 點擊「開始生成簡報」
6. 等待 2-3 分鐘
7. 點擊「下載 PPTX」取得簡報

### 步驟 3：客製化您的簡報

修改以下設定：

**簡報主題**
```
您的公司名稱 - 產品發表會
```

**整體風格設計**
```yaml
# 複製 examples/familymart_style.yaml 並修改
Color_Palette:
  Primary: "#您的品牌色"
  Secondary: "#輔助色"
```

**版面模版**
```
# 參考 examples/familymart_layout.txt
# 描述每一頁的視覺佈局
```

## 預期效果

✅ **生成速度**：每張投影片約 2-3 秒
✅ **風格一致性**：使用固定種子確保視覺統一
✅ **可編輯性**：下載為 .pptx 格式，可在 PowerPoint 中編輯
✅ **高品質**：1920x1080 解析度圖片

## 疑難排解

### 問題：API Key 無效

**解決方案**：
- 確認 API Key 完整複製（無空格）
- 檢查是否啟用 Gemini API
- 確認 API Key 未過期

### 問題：生成很慢

**原因**：
- 每張圖片需要 2-4 秒生成時間
- 包含 2 秒 API 限流間隔

**正常情況**：
- 10 張投影片約需 2-3 分鐘

### 問題：風格不一致

**解決方案**：
1. 使用更詳細的風格描述
2. 在所有投影片描述中重複關鍵視覺元素
3. 明確指定色彩代碼（#0066CC）而非色彩名稱（藍色）

## 成本估算

| 使用情境 | API 呼叫 | 費用（付費方案） |
|---------|---------|----------------|
| 10 張簡報 | 10 次 | ~$1.50-2.50 |
| 20 張簡報 | 20 次 | ~$3.00-5.00 |
| 100 張簡報 | 100 次 | ~$15.00-25.00 |

💡 **免費額度**：每天 500 次請求，足夠生成 50 份簡報

## 下一步

📖 閱讀完整文件：[README.md](README.md)
🎨 瀏覽範例檔案：`examples/` 資料夾
💬 遇到問題？檢查瀏覽器控制台錯誤訊息

---

**開始創建您的第一份 AI 生成簡報吧！** 🎉