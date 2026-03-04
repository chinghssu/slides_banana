# ✅ Gemini API 認證與限制確認總結

## 🎯 您的問題確認

### Q1: API 認證方式是 Credential JSON 還是 API Key？

**答案：API Key** ✅

根據官方文件確認：
- **Gemini API 主要使用 API Key** 進行認證
- Service Account JSON 是進階選項，用於企業環境
- **我們的簡報生成器使用 API Key 方式**，這是正確的選擇

**官方文件來源**：
- [API Keys 文件](https://ai.google.dev/gemini-api/docs/api-key)
- [Authentication 範例](https://github.com/google-gemini/cookbook/blob/main/quickstarts/Authentication.ipynb)

**使用方式**：
```javascript
// URL 參數方式（我們採用）
https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image:generateContent?key=YOUR_API_KEY

// 或環境變數方式
export GEMINI_API_KEY="your-api-key"
```

---

### Q2: 簡報頁數的最大範圍是多少？

**答案：取決於使用者的 API 層級**

#### Free Tier（免費層級）

**官方限制**：
- **2 RPM**（每分鐘 2 次請求）
- **50 RPD**（每日 50 次請求）

**實際建議**：
- ✅ **建議範圍：5-15 張**
- ⚠️ 生成時間：每張約 30 秒（因為 2 RPM = 每 30 秒 1 次請求）
- ⚠️ 10 張簡報需要約 **5 分鐘**

**我們的介面設定**：
```html
<!-- 已更新為 max="15" -->
<input type="range" min="5" max="15" value="10">
```

#### Tier 1（付費層級）

**官方限制**：
- **10 RPM**
- **1,500 RPD**

**建議範圍**：
- ✅ **10-30 張**
- 生成時間：每張約 6 秒
- 20 張簡報約需 **2 分鐘**

#### Tier 2+（進階付費）

**官方限制**：
- **30+ RPM**
- **10,000+ RPD**

**建議範圍**：
- ✅ **20-50 張**
- 快速生成，無明顯限制

---

## 📊 官方 Rate Limits 確認

### Gemini 3 Pro Image (Nano Banana Pro) 限制

| 層級 | RPM | RPD | 建議頁數 | 生成時間（10張） |
|------|-----|-----|---------|----------------|
| **Free** | 2 | 50 | 5-15 張 | ~5 分鐘 |
| **Tier 1** | 10 | 1,500 | 10-30 張 | ~1 分鐘 |
| **Tier 2** | 30 | 10,000 | 20-50 張 | ~20 秒 |
| **Tier 3** | 60 | 30,000 | 無限制 | ~10 秒 |

**資料來源**：
- [Rate Limits 官方頁面](https://ai.google.dev/gemini-api/docs/rate-limits)
- 最後更新：2025-12-23 UTC

---

## 🔧 已更新的專案配置

### 1. 投影片數量上限

**更新前**：
```html
<input type="range" min="5" max="25" value="10">
```

**更新後**：
```html
<input type="range" min="5" max="15" value="10">
<p class="mt-2 text-xs text-slate-500">
    免費層級建議：5-15 張（2 RPM 限制）
</p>
```

### 2. API 請求延遲

**更新前**：
```javascript
await new Promise(resolve => setTimeout(resolve, 2000)); // 2 秒
```

**更新後**：
```javascript
// Free tier 為 2 RPM，每 30 秒 1 張
await new Promise(resolve => setTimeout(resolve, 30000)); // 30 秒
```

### 3. 提示訊息

新增清楚的說明：
- 免費層級限制說明
- 預估生成時間
- 每日配額提醒

---

## ⚠️ 重要提醒

### 免費層級使用注意事項

1. **生成速度慢**：
   - 2 RPM = 每 30 秒才能生成 1 張
   - 10 張簡報需要約 5 分鐘
   - 15 張簡報需要約 7.5 分鐘

2. **每日配額限制**：
   - 每天最多 50 次請求
   - 等於每天最多 50 張投影片
   - 配額在太平洋時間午夜重置

3. **建議優化**：
   - 測試時使用較少頁數（5-10 張）
   - 正式使用建議升級到 Tier 1
   - 或考慮批次處理（非即時生成）

### 付費層級建議

如果需要：
- 快速生成（分鐘級）
- 大量簡報（20+ 張）
- 商業用途

**建議升級到 Tier 1**：
- 啟用 Cloud Billing
- 每張成本約 $0.13-0.24
- 10 RPM，大幅提升效率

---

## 📝 給使用者的說明

### 介面上應該顯示的資訊

```
🎯 使用說明：

免費層級限制：
- 每分鐘最多 2 次請求
- 每天最多 50 次請求
- 建議生成 5-15 張投影片

預估生成時間：
- 5 張：約 2.5 分鐘
- 10 張：約 5 分鐘
- 15 張：約 7.5 分鐘

如需快速生成或大量簡報，請升級到付費層級。
```

---

## 🔗 官方資源

- [取得 API Key](https://aistudio.google.com/apikey)
- [Rate Limits 文件](https://ai.google.dev/gemini-api/docs/rate-limits)
- [使用層級說明](https://ai.google.dev/gemini-api/docs/rate-limits#usage-tiers)
- [定價資訊](https://ai.google.dev/gemini-api/docs/pricing)

---

## ✅ 總結

### 認證方式

✅ **確認使用 API Key**
- 不是 Service Account JSON
- 取得方式：Google AI Studio
- 使用方式：URL 參數

### 簡報頁數限制

✅ **已根據官方限制調整**
- 免費層級：5-15 張（max="15"）
- 付費層級：可設定 20-30 張
- 請求延遲：30 秒/張（免費）

### 使用者體驗

✅ **已優化提示訊息**
- 清楚說明限制
- 顯示預估時間
- 建議升級選項

---

**確認完成** ✓
- 認證方式：API Key ✓
- 頁數限制：5-15 張（免費）✓
- 程式碼已更新 ✓
- 文件已補充 ✓