# Banana Pro 部署指南

## 📋 專案特性

此專案是**純靜態網頁應用**：
- 無後端伺服器需求
- 所有處理在瀏覽器端完成
- API Key 由使用者提供，在客戶端使用
- 適合部署到任何靜態網站託管平台

---

## 🚀 推薦部署方案

### 方案 1：Cloudflare Pages（最推薦）

**優點：**
- ✅ 完全免費，無限流量
- ✅ 全球 CDN，速度極快
- ✅ 自動 HTTPS
- ✅ 可綁定自訂網域
- ✅ 支援 Git 自動部署

#### 使用 Wrangler CLI 部署

```bash
# 1. 安裝 Wrangler CLI
npm install -g wrangler

# 2. 登入 Cloudflare
wrangler login

# 3. 進入專案目錄
cd /Users/donpanic/Documents/programming/my_project/ppt_bananapro

# 4. 部署
wrangler pages deploy . --project-name=banana-pro
```

#### 使用 Cloudflare Dashboard 部署

1. 登入 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 前往 **Pages** > **Create a project**
3. 選擇 **Upload assets**
4. 上傳整個專案資料夾
5. 完成！

#### 綁定自訂網域

1. 在 Cloudflare Pages 專案中，點選 **Custom domains**
2. 點選 **Set up a custom domain**
3. 輸入您的網域（例如：ppt.yourdomain.com）
4. 如果網域已在 Cloudflare DNS，會自動設定
5. 如果不在，按照指示設定 CNAME 記錄

---

### 方案 2：Vercel（也很推薦）

**優點：**
- ✅ 完全免費（有頻寬限制但通常夠用）
- ✅ 速度快，自動 HTTPS
- ✅ 可綁定網域
- ✅ Git 自動部署

#### 部署步驟

```bash
# 1. 安裝 Vercel CLI
npm install -g vercel

# 2. 進入專案目錄
cd /Users/donpanic/Documents/programming/my_project/ppt_bananapro

# 3. 登入並部署
vercel

# 4. 按照提示完成設定
# - Project Name: banana-pro
# - Directory: ./ (當前目錄)
```

#### 綁定自訂網域

```bash
# 綁定網域
vercel domains add yourdomain.com

# 按照提示設定 DNS 記錄
```

---

### 方案 3：GitHub Pages

**優點：**
- ✅ 完全免費
- ✅ 可綁定網域
- ✅ 從 Git 自動部署

#### 部署步驟

```bash
# 1. 建立 Git 倉庫（如果還沒有）
cd /Users/donpanic/Documents/programming/my_project/ppt_bananapro
git init
git add .
git commit -m "Initial commit"

# 2. 推送到 GitHub
git remote add origin https://github.com/你的用戶名/banana-pro.git
git push -u origin main

# 3. 在 GitHub 倉庫設定中啟用 GitHub Pages
# Settings > Pages > Source: main branch > Save
```

#### 綁定自訂網域

1. 在 GitHub 倉庫設定中，前往 **Pages**
2. 在 **Custom domain** 輸入您的網域
3. 在網域的 DNS 設定中加入 CNAME 記錄：
   ```
   CNAME  ppt  你的用戶名.github.io
   ```

---

### 方案 4：Zeabur（可以但不推薦）

Zeabur 主要針對需要後端的應用，對於純靜態網站：
- ⚠️ 功能過剩
- ⚠️ 有免費額度限制
- ✅ 但如果您已經熟悉 Zeabur，也可以使用

#### 部署步驟

```bash
# 1. 安裝 Zeabur CLI
npm install -g @zeabur/cli

# 2. 登入
zeabur login

# 3. 部署
zeabur deploy
```

---

## 🌐 DNS 設定指南

### 如果使用 Cloudflare DNS

1. 登入 Cloudflare
2. 選擇您的網域
3. 前往 **DNS** > **Records**
4. 新增 CNAME 記錄：
   ```
   Type: CNAME
   Name: ppt (或您想要的子網域)
   Target: your-project.pages.dev (Cloudflare Pages 提供的網址)
   Proxy status: Proxied (橙色雲朵)
   ```

### 如果使用其他 DNS 服務商

新增 CNAME 記錄：
```
主機名稱: ppt
記錄類型: CNAME
記錄值: your-project.pages.dev
```

等待 DNS 傳播（通常 5-30 分鐘）

---

## 🔒 安全性考量

### API Key 保護

此應用在客戶端使用 API Key，請提醒使用者：

1. **不要將 API Key 硬編碼**在程式碼中
2. **使用 API 限制功能**：
   - 在 Google Cloud Console 中設定 API Key 限制
   - 限制只能從您的網域呼叫
   - 設定每日配額上限

### 設定 API Key 網域限制

1. 前往 [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. 選擇您的 API Key
3. 在 **Application restrictions** 中選擇 **HTTP referrers**
4. 新增您的網域：
   ```
   https://yourdomain.com/*
   https://ppt.yourdomain.com/*
   ```
5. 儲存

---

## 📝 部署檢查清單

部署前確認：

- [ ] 所有檔案都已提交到 Git
- [ ] 測試過本地版本可正常運作
- [ ] 已準備好網域設定
- [ ] 已了解 API Key 的安全設定

部署後確認：

- [ ] 網站可正常開啟
- [ ] 上傳圖片功能正常
- [ ] API 呼叫功能正常
- [ ] PDF 下載功能正常
- [ ] 自訂網域已綁定成功
- [ ] HTTPS 正常啟用

---

## 🛠️ 本地測試

部署前建議先在本地測試：

```bash
# 使用 Python 簡易伺服器
cd /Users/donpanic/Documents/programming/my_project/ppt_bananapro
python3 -m http.server 8000

# 或使用 Node.js
npx http-server -p 8000

# 然後在瀏覽器開啟
# http://localhost:8000
```

---

## 📊 建議的部署流程

1. **本地測試** → 確保所有功能正常
2. **選擇平台** → 推薦 Cloudflare Pages
3. **部署專案** → 使用 CLI 或 Web 介面
4. **綁定網域** → 設定自訂網域
5. **設定 DNS** → 新增 CNAME 記錄
6. **安全設定** → 設定 API Key 限制
7. **最終測試** → 確認線上版本正常運作

---

## 🎯 總結

**最推薦：Cloudflare Pages**
- 完全免費
- 速度最快
- 無限流量
- 最適合靜態網站

**如果您已經熟悉 Vercel → 選擇 Vercel**

**如果想要簡單 → 選擇 GitHub Pages**

**不推薦 Zeabur**（除非您有其他後端需求）

---

## 💡 需要幫助？

如果部署過程中遇到問題：

1. 檢查瀏覽器 Console 是否有錯誤訊息
2. 確認 API Key 設定正確
3. 檢查網域 DNS 記錄是否正確
4. 確認 HTTPS 已啟用

**建議在 README.md 中加入部署後的網址，方便使用者訪問。**
