# Gemini API 認證方式與限制確認（官方文件）

## 📌 認證方式確認

根據官方文件，Gemini API 支援**兩種主要認證方式**：

### 1. API Key（推薦用於簡報生成器）✅

**取得方式**：
- 前往 [Google AI Studio](https://aistudio.google.com/apikey)
- 點擊「Create API Key」
- 選擇或建立 Google Cloud 專案
- 複製 API Key

**使用方式**：
```bash
# 環境變數（推薦）
export GEMINI_API_KEY="your-api-key-here"
# 或
export GOOGLE_API_KEY="your-api-key-here"
```

**程式碼範例**：
```javascript
// REST API 呼叫
fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image:generateContent?key=${apiKey}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({...})
});
```

**適用情境**：
- ✅ 個人開發、測試
- ✅ 快速原型開發
- ✅ **簡報生成器（本專案採用）**
- ✅ 瀏覽器端應用

### 2. Service Account JSON（企業級應用）

**取得方式**：
- 建立 Google Cloud Service Account
- 下載 JSON 憑證檔案
- 設定環境變數：`GOOGLE_APPLICATION_CREDENTIALS="/path/to/keyfile.json"`

**使用方式**：
```python
# Python 範例
from google.oauth2 import service_account
credentials = service_account.Credentials.from_service_account_file(
    'path/to/service-account-key.json'
)
```

**適用情境**：
- ✅ 生產環境
- ✅ 企業應用
- ✅ CI/CD 流程
- ✅ 後端服務

### 3. OAuth 2.0（進階用途）

**適用情境**：
- 需要存取使用者資料
- 需要精細的權限控制
- 企業級應用

---

## 📊 API 配額與限制（2025年最新）

### 使用層級

| 層級 | 資格要求 | 升級條件 |
|------|----------|----------|
| **Free** | 所有使用者 | - |
| **Tier 1** | 啟用 Cloud Billing | 連結付費帳戶 |
| **Tier 2** | 累積消費 > $250 | 且至少 30 天 |
| **Tier 3** | 累積消費 > $1,000 | 且至少 30 天 |

### 限制維度說明

1. **RPM (Requests Per Minute)**：每分鐘請求數
2. **TPM (Tokens Per Minute)**：每分鐘處理的 Token 數
3. **RPD (Requests Per Day)**：每日請求數
4. **IPM (Images Per Minute)**：每分鐘生成圖片數（僅圖像生成模型）

---

## 🍌 Gemini 3 Pro Image (Nano Banana Pro) 具體限制

根據官方文件 [rate-limits 頁面](https://ai.google.dev/gemini-api/docs/rate-limits)：

### Free Tier（免費層級）

| 限制類型 | 數值 |
|---------|------|
| RPM | **2 RPM** |
| RPD | **50 RPD** |
| TPM | 資料未明確列出 |

**實際應用**：
- 每 30 秒可生成 1 張圖片
- 每天最多生成 50 張圖片
- 適合：測試、個人專案

### Tier 1（付費層級）

| 限制類型 | 數值 |
|---------|------|
| RPM | **10 RPM** |
| RPD | **1,500 RPD** |
| Batch Enqueued Tokens | 2,000,000 |

**實際應用**：
- 每 6 秒可生成 1 張圖片
- 每天最多生成 1,500 張圖片
- 適合：中小型商業專案

### Tier 2（進階付費）

| 限制類型 | 數值 |
|---------|------|
| RPM | **30 RPM** |
| RPD | **10,000 RPD** |
| Batch Enqueued Tokens | 270,000,000 |

**實際應用**：
- 每 2 秒可生成 1 張圖片
- 每天最多生成 10,000 張圖片
- 適合：大型商業應用

### Tier 3（企業級）

| 限制類型 | 數值 |
|---------|------|
| RPM | **60 RPM** |
| RPD | **30,000 RPD** |
| Batch Enqueued Tokens | 1,000,000,000 |

---

## 🎯 簡報頁數建議範圍

基於 API 限制，建議的簡報頁數範圍：

### Free Tier（免費）

**建議頁數：5-15 張**

| 頁數 | 生成時間 | 是否可行 |
|------|----------|----------|
| 5 張 | ~2.5 分鐘 | ✅ 推薦 |
| 10 張 | ~5 分鐘 | ✅ 推薦 |
| 15 張 | ~7.5 分鐘 | ✅ 可行 |
| 20 張 | ~10 分鐘 | ⚠️ 接近限制 |
| 25 張+ | ~12.5 分鐘+ | ❌ 超過 RPM 限制 |

**計算邏輯**：
- 2 RPM = 每 30 秒 1 張
- 加上 API 回應時間和緩衝，實際約 30-45 秒/張
- 建議單次生成不超過 15 張

### Tier 1（付費）

**建議頁數：10-30 張**

| 頁數 | 生成時間 | 是否可行 |
|------|----------|----------|
| 10 張 | ~1 分鐘 | ✅ 快速 |
| 20 張 | ~2 分鐘 | ✅ 推薦 |
| 30 張 | ~3 分鐘 | ✅ 推薦 |
| 50 張 | ~5 分鐘 | ⚠️ 可行但較慢 |

### Tier 2+（進階付費）

**建議頁數：無明顯限制**

- 30 RPM 可快速生成大量投影片
- 建議：20-50 張/次，避免單次生成過久

---

## 💰 成本估算

### Gemini 3 Pro Image (Nano Banana Pro) 定價

根據官方定價頁面：

| 層級 | 每張圖片成本 | 備註 |
|------|-------------|------|
| Free | $0 | 每日 50 張限制 |
| Tier 1+ | **$0.134 - $0.24** | 視解析度而定 |

**實際計算範例**：

| 簡報頁數 | 免費額度 | Tier 1 成本 |
|----------|---------|------------|
| 5 張 | ✅ 免費 | $0.67 - $1.20 |
| 10 張 | ✅ 免費 | $1.34 - $2.40 |
| 20 張 | ✅ 免費 | $2.68 - $4.80 |
| 50 張 | ❌ 超額 | $6.70 - $12.00 |

---

## 🔄 更新專案配置建議

### 1. 修改預設投影片數量上限

```javascript
// app.js 更新
<input type="range" id="slideCount" 
       min="5" 
       max="15"  // Free tier: 改為 15
       value="10">

// 付費用戶可設定為 30 或 50
```

### 2. 顯示層級資訊

在介面中新增用戶層級顯示：

```html
<div class="tier-info">
  <p>當前層級：<span id="currentTier">Free</span></p>
  <p>建議頁數：<span id="recommendedMax">5-15 張</span></p>
  <p>每日剩餘配額：<span id="dailyRemaining">50 / 50</span></p>
</div>
```

### 3. 智能限流建議

```javascript
// 根據層級自動調整延遲
const RATE_LIMITS = {
  free: { rpm: 2, delay: 30000 },    // 30 秒
  tier1: { rpm: 10, delay: 6000 },   // 6 秒
  tier2: { rpm: 30, delay: 2000 },   // 2 秒
  tier3: { rpm: 60, delay: 1000 }    // 1 秒
};
```

---

## ⚠️ 關鍵注意事項

### 1. 認證方式選擇

✅ **本專案應使用：API Key**
- 簡單、快速、適合瀏覽器端
- 無需下載 JSON 檔案
- 用戶自行提供 API Key

❌ **不建議：Service Account JSON**
- 需要上傳檔案
- 安全性風險（瀏覽器端暴露）
- 設定複雜

### 2. 配額限制

⚠️ **免費層級限制**：
- **2 RPM** 非常嚴格
- 建議設定最大 15 張投影片
- 自動加入 30 秒延遲

⚠️ **RPD 重置時間**：
- 每日配額在**太平洋時間午夜**重置
- 台灣時間為下午 4:00 PM（冬令時）或 3:00 PM（夏令時）

### 3. 錯誤處理

遇到 **429 Too Many Requests** 時：

```javascript
if (response.status === 429) {
  // 指數退避策略
  const retryAfter = response.headers.get('Retry-After') || 60;
  await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
  // 重試
}
```

---

## 📝 結論

### 認證方式確認

✅ **使用 API Key**（不是 Service Account JSON）
- 取得方式：Google AI Studio
- 使用方式：URL 參數 `?key=YOUR_API_KEY`
- 安全性：瀏覽器端可用（但要提醒用戶保護 API Key）

### 簡報頁數建議

| 用戶類型 | 建議頁數 | 最大限制 |
|---------|---------|---------|
| **免費用戶** | 5-10 張 | 15 張 |
| **Tier 1** | 10-20 張 | 30 張 |
| **Tier 2+** | 20-50 張 | 無明顯限制 |

### 實作建議

1. **預設值**：10 張投影片
2. **滑桿範圍**：5-15 張（Free）或 5-30 張（Paid）
3. **自動延遲**：30 秒/張（Free）或 6 秒/張（Tier 1）
4. **提示訊息**：明確告知用戶預估時間和配額限制

---

## 🔗 官方資源連結

- [API Key 取得](https://aistudio.google.com/apikey)
- [Rate Limits 文件](https://ai.google.dev/gemini-api/docs/rate-limits)
- [Pricing 資訊](https://ai.google.dev/gemini-api/docs/pricing)
- [Gemini 3 Pro Image 模型](https://ai.google.dev/gemini-api/docs/image-generation)

---

**最後更新**：2025-01-08
**資料來源**：Google AI for Developers 官方文件