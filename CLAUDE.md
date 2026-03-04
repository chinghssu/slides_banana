# CLAUDE.md - Banana Pro 簡報生成器專案指引

## 專案概述

此專案是一個基於 Google Gemini 3 Pro Image API 的簡報生成工具,使用 AI 生成視覺風格一致的專業簡報圖片。

**核心技術棧:**
- 前端: HTML + JavaScript (Vanilla JS)
- API: Google Gemini 3 Pro Image API
- 簡報生成: PptxGenJS 庫
- 部署: 靜態網頁 (可直接開啟 HTML 或本地伺服器)

## 開發原則

### 1. 最小變更原則 (Minimal Change Principle)
- 修改現有程式碼時,僅變更必要的部分
- 避免重構未受影響的程式碼區塊
- 保持現有的程式碼風格和結構
- 不新增不必要的功能或抽象化

### 2. 檔案結構保持
```
ppt_bananapro/
├── index.html          # 主頁面 - UI 結構
├── app.js              # 核心邏輯 - API 整合、生成控制
├── start.sh            # 啟動腳本
├── examples/           # 範例檔案目錄
└── *.md                # 文件檔案
```

### 3. 程式碼修改規範

**編輯 app.js 時:**
- 核心函數: `callGeminiAPI()` - 處理 API 呼叫
- 生成控制: `generatePresentation()` - 主要生成流程
- 保持現有的錯誤處理機制
- 維持 2 秒間隔的 API 限流控制

**編輯 index.html 時:**
- 保持現有的 UI/UX 設計
- 維持響應式佈局
- 不改變現有的樣式類別名稱

### 4. API 相關注意事項

**Gemini 3 Pro Image API:**
- 端點: `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image:generateContent`
- 需要 API Key 認證
- 免費額度: 500 請求/天
- 固定種子 (seed) 確保風格一致性
- 每次請求間隔 2 秒避免限流

**API 呼叫參數:**
```javascript
{
  contents: [{ parts: [{ text: prompt }] }],
  generationConfig: {
    temperature: 0.8,
    seed: masterSeed
  }
}
```

## 任務處理流程

### 新功能開發
1. **需求分析**: 先撰寫需求文件 (requirements.md)
2. **設計階段**: 建立設計文件 (design.md)
3. **任務分解**: 建立任務清單 (tasks.md)
4. **徵求許可**: 在實際編寫程式碼前取得使用者確認
5. **實作開發**: 按照任務清單逐步實作
6. **測試驗證**: 確認功能正常運作

### Bug 修復
1. **問題重現**: 先理解和重現問題
2. **根因分析**: 找出問題的根本原因
3. **最小修改**: 只修改必要的程式碼
4. **驗證修復**: 確認問題已解決且無副作用

### 程式碼審查
1. 檢查是否符合專案現有風格
2. 確認 API 呼叫的正確性
3. 驗證錯誤處理機制
4. 檢查效能影響 (特別是 API 呼叫頻率)

## 常見任務指引

### 修改 API 整合
- 位置: `app.js` 中的 `callGeminiAPI()` 函數
- 注意保持種子 (seed) 機制
- 維持錯誤處理和重試邏輯
- 不改變函數簽章除非必要

### 調整 UI 介面
- 位置: `index.html`
- 保持現有的表單結構
- 維持輸入驗證邏輯
- 確保響應式設計不被破壞

### 優化生成流程
- 位置: `app.js` 中的 `generatePresentation()` 函數
- 保持 2 秒間隔控制
- 維持進度回饋機制
- 不改變生成順序邏輯

### 新增範例
- 位置: `examples/` 目錄
- 使用 YAML 格式的風格檔案
- 使用純文字格式的版面模版
- 在 README.md 中新增對應說明

## 安全性考量

1. **API Key 保護**
   - 永遠在客戶端使用 API Key
   - 不將 API Key 硬編碼在程式碼中
   - 使用者的 API Key 僅存於瀏覽器記憶體

2. **輸入驗證**
   - 驗證使用者輸入的合理性
   - 限制投影片數量上限
   - 清理提示詞中的特殊字元

3. **錯誤處理**
   - 妥善處理 API 錯誤
   - 提供清晰的錯誤訊息
   - 避免暴露敏感資訊

## 效能考量

1. **API 呼叫最佳化**
   - 維持 2 秒間隔避免限流
   - 實作適當的重試機制
   - 考慮批次處理的可行性

2. **前端效能**
   - 避免阻塞 UI 主執行緒
   - 使用非同步操作
   - 適當的載入狀態回饋

## 測試方針

### 手動測試檢查清單
- [ ] API Key 驗證機制
- [ ] 簡報生成流程
- [ ] 風格一致性檢查
- [ ] PPTX 下載功能
- [ ] 錯誤處理機制
- [ ] UI 響應性

### 測試環境
- Chrome/Safari/Firefox 最新版本
- 本地伺服器 (推薦 Python http.server)
- 有效的 Gemini API Key

## 除錯技巧

1. **瀏覽器開發者工具**
   - Console: 查看錯誤訊息和 API 回應
   - Network: 監控 API 請求狀態
   - Application: 檢查 localStorage 資料

2. **常見問題**
   - API 403 錯誤 → 檢查 API Key 有效性
   - 生成失敗 → 檢查提示詞格式
   - 風格不一致 → 檢查種子值設定

## 文件維護

- 修改功能時同步更新 README.md
- 重大變更需更新相關的 .md 文件
- 範例檔案需保持最新和可用

## 版本控制建議

- 使用描述性的 commit 訊息
- 功能開發使用功能分支
- 保持 main 分支穩定可用

## 聯絡與支援

- 專案文件: 參考 README.md
- API 文件: [Gemini API Docs](https://ai.google.dev/gemini-api/docs/image-generation)

---

**最後更新**: 2026-02-05
**適用版本**: 當前開發版本
