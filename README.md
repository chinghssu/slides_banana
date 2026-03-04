# Banana Pro 簡報生成器

使用 Google Gemini 3 Pro Image (Nano Banana Pro) API 生成風格一致的專業簡報。

## 功能特色

✨ **AI 驅動生成**：使用 Gemini 3 Pro Image 模型生成高品質簡報圖片
🎨 **風格一致性**：透過固定種子值確保所有投影片視覺風格統一
📝 **客製化設計**：可自訂色彩、字型、版面配置等設計元素
🖼️ **模版系統**：支援逐頁佈局說明，精確控制每張投影片內容
💾 **一鍵下載**：自動組裝成可編輯的 PowerPoint 檔案 (.pptx)
🔒 **隱私保護**：API Key 僅在瀏覽器中使用，不會上傳到任何伺服器

## 快速開始

### 1. 取得 API Key

前往 [Google AI Studio](https://aistudio.google.com/app/apikey) 建立免費的 Gemini API Key。

**免費額度**：
- 每天 500 次請求
- 適合測試和小型專案

### 2. 開啟應用程式

有兩種方式：

**方式 A：直接開啟 HTML 檔案**
```bash
# 在瀏覽器中開啟
open index.html
# 或雙擊 index.html 檔案
```

**方式 B：使用本地伺服器（推薦）**
```bash
# 使用 Python 內建伺服器
python3 -m http.server 8000

# 或使用 Node.js
npx http-server -p 8000

# 然後在瀏覽器開啟
# http://localhost:8000
```

### 3. 開始生成

1. 輸入您的 Gemini API Key
2. 填寫簡報主題（例如：「企業品牌介紹」）
3. 調整投影片數量（建議 5-15 張）
4. 客製化風格設計或使用預設範例
5. 點擊「開始生成簡報」
6. 等待生成完成（每張約需 2-3 秒）
7. 點擊「下載 PPTX」取得簡報檔案

## 使用範例

### 範例 1：企業品牌簡報

**簡報主題**：
```
FamilyMart 全家便利商店品牌介紹
```

**整體風格設計**：
```yaml
Tone: "Professional, warm, friendly"
Color_Palette:
  Base: "#FFFFFF"
  Primary: "#0066CC (FamilyMart Blue)"
  Secondary: "#FFD700 (FamilyMart Yellow)"
  Text_Color: "#333333"
Typography:
  Heading: "Bold sans-serif, large size"
  Body_Text: "Gothic font, readable size"
Layout_Rules:
  Logo: "Top-left corner on every slide"
  Grid: "Flexible grid with whitespace"
  Style: "Flat illustration, friendly characters"
```

**版面模版**：
```
第1頁:開場封面
視覺佈局:
- 上方: FamilyMart Logo
- 中央: 年輕消費者插圖（手持商品）
- 背景: 藍黃雙色斜角分割
- 氛圍: 活力、友善

第2頁:品牌價值
視覺佈局:
- 上方: Logo
- 中央: 家庭用餐溫馨場景
- 文字: 品牌標語
- 背景: 幾何分割設計
```

### 範例 2：科技產品發表

**簡報主題**：
```
AI 創新產品發表會
```

**整體風格設計**：
```yaml
Tone: "Modern, tech, minimal"
Color_Palette:
  Base: "#000000 (dark mode)"
  Accent: "#00FF00 (neon green)"
  Text_Color: "#FFFFFF"
Typography:
  Heading: "Futuristic sans-serif, bold"
  Body_Text: "Monospace font for tech feel"
Layout_Rules:
  Style: "Dark mode with neon accents"
  Grid: "Asymmetric, dynamic"
  Elements: "Wireframe graphics, minimal icons"
```

## 技術細節

### 風格一致性機制

本專案使用以下技術確保多張投影片的視覺統一：

1. **固定種子值（Seed）**：每次生成使用相同的隨機種子
2. **統一提示詞模板**：所有投影片共用相同的風格指令
3. **參考前一張投影片**：後續投影片會參考前面的設計
4. **API 限流控制**：每次生成間隔 2 秒，避免 API 限制

### API 呼叫範例

```javascript
const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image:generateContent?key=${apiKey}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.8,
        seed: masterSeed  // 固定種子確保一致性
      }
    })
  }
);
```

### 檔案結構

```
ppt_bananapro/
├── index.html          # 主頁面
├── app.js              # 核心邏輯和 API 整合
├── README.md           # 本說明文件
└── examples/           # 範例檔案（可選）
    ├── familymart_style.yaml
    └── familymart_layout.txt
```

## 進階使用

### 客製化提示詞工程

**獲得更好結果的技巧**：

1. **具體描述視覺元素**：
   ```
   ✗ 簡單的圖示
   ✓ 扁平化設計的藍色圓形圖示，帶有白色線條圖案
   ```

2. **明確色彩規範**：
   ```
   ✗ 使用品牌色
   ✓ 主色 #0066CC，輔助色 #FFD700，背景 #F5F5F5
   ```

3. **指定情境和氛圍**：
   ```
   ✗ 產品展示
   ✓ 溫馨的家庭使用情境，自然光線，真實感插圖風格
   ```

### 效能最佳化

**減少生成時間**：
- 減少投影片數量（5-10 張較佳）
- 簡化提示詞內容
- 使用較低的 temperature 值（0.6-0.7）

**提高品質**：
- 提供詳細的視覺描述
- 使用參考圖片（如果 API 支援）
- 多次迭代調整提示詞

## 成本估算

| 方案 | 每月額度 | 每張成本 | 適用情境 |
|------|----------|----------|----------|
| 免費 | 500 請求/日 | $0 | 個人測試、小型專案 |
| API 付費 | 無限制 | ~$0.15-0.25 | 商業用途、大量生成 |

**範例計算**：
- 生成 10 張簡報 = 10 次 API 請求 = $1.50-2.50（付費方案）
- 使用免費額度可每天生成約 50 份簡報

## 常見問題

### Q: 為什麼生成速度很慢？

A: Gemini 3 Pro Image 是高品質模型，每張圖片生成需要 2-4 秒。本專案已加入 2 秒間隔以避免 API 限流。

### Q: 可以使用其他圖像生成 API 嗎？

A: 可以！修改 `app.js` 中的 `callGeminiAPI` 函數即可整合：
- DALL-E 3
- Midjourney API
- Stable Diffusion
- FLUX 系列模型

### Q: 生成的投影片可以編輯嗎？

A: 目前生成的是圖片檔案，無法直接編輯文字。建議：
1. 下載後在 PowerPoint 中添加文字層
2. 使用圖片作為背景，手動添加內容
3. 或將圖片匯出後在設計軟體中編輯

### Q: 如何確保更好的風格一致性？

A: 
1. 使用詳細的風格指南
2. 在所有投影片中重複關鍵視覺元素描述
3. 使用固定色彩代碼而非色彩名稱
4. 明確指定插圖風格（扁平化、3D、寫實等）

## 疑難排解

### 錯誤：API Key 無效

```
解決方案：
1. 確認 API Key 複製完整
2. 檢查是否啟用 Gemini API
3. 確認 API Key 權限包含圖像生成
```

### 錯誤：生成失敗

```
解決方案：
1. 檢查網路連線
2. 確認未超過 API 配額
3. 簡化提示詞內容
4. 檢查瀏覽器控制台錯誤訊息
```

### 問題：圖片品質不佳

```
解決方案：
1. 增加提示詞的視覺細節描述
2. 明確指定「high quality」、「professional」等關鍵字
3. 調整 temperature 值（降低以獲得更穩定結果）
```

## 技術限制

⚠️ **目前限制**：
- 每張投影片為靜態圖片，無法編輯文字
- 生成時間較長（10 張約需 20-30 秒）
- 依賴網路連線和 API 穩定性
- 風格一致性受 AI 模型限制

## 未來改進方向

🔮 **計劃功能**：
- [ ] 支援上傳參考圖片作為風格基準
- [ ] 批次生成模式（後台處理）
- [ ] 更多簡報模板庫
- [ ] 圖片後製編輯功能
- [ ] 匯出為可編輯 SVG 格式
- [ ] 整合其他 AI 模型（DALL-E、Midjourney）

## 授權

本專案為開源軟體，採用 MIT 授權。

## 相關資源

- [Gemini API 文件](https://ai.google.dev/gemini-api/docs/image-generation)
- [NotebookLM 簡報功能介紹](https://blog.google/technology/google-labs/8-ways-to-make-the-most-out-of-slide-decks-in-notebooklm/)
- [PptxGenJS 文件](https://gitbrent.github.io/PptxGenJS/)
- [提示詞工程最佳實踐](https://developers.googleblog.com/en/how-to-prompt-gemini-2-5-flash-image-generation-for-the-best-results/)

## 聯絡支援

如有問題或建議，請透過以下方式：
- GitHub Issues
- Email: your-email@example.com

---

**專案開發者**：Built with ❤️ using Gemini 3 Pro Image API