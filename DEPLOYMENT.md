# Banana Pro 部署指南

## 專案現況

此專案是純靜態網頁應用，正式站點 `banana-pro` 目前使用 Cloudflare Workers 靜態資產模式部署。

這代表部署時不能直接把整個專案根目錄上傳，必須先整理出只包含公開檔案的資產目錄。

## Cloudflare 正確部署方式

### 必要條件

1. 已安裝 `wrangler`
2. 已設定 `CLOUDFLARE_API_TOKEN`
3. token 至少具備以下權限：
   - `Account -> Workers Scripts -> Edit` 或 `Write`
   - `Account -> Cloudflare Pages -> Edit` 或 `Write`

建議額外加入：

- `Account -> Workers Tail -> Read`
- `User -> Memberships -> Read`
- `User -> User Details -> Read`

### 專案內建部署檔案

- [wrangler.toml](/Users/donpanic/Documents/programming/my_project/ppt_bananapro/wrangler.toml)
- [scripts/prepare-cloudflare-assets.sh](/Users/donpanic/Documents/programming/my_project/ppt_bananapro/scripts/prepare-cloudflare-assets.sh)
- [scripts/deploy-cloudflare.sh](/Users/donpanic/Documents/programming/my_project/ppt_bananapro/scripts/deploy-cloudflare.sh)

### 部署步驟

在專案根目錄執行：

```bash
./scripts/deploy-cloudflare.sh
```

這支腳本會先做兩件事：

1. 清空並重建 `.cloudflare-deploy/`
2. 只複製站點需要的公開檔案到 `.cloudflare-deploy/`

然後再透過：

```bash
wrangler deploy
```

把資產部署到 `banana-pro`。

## 驗證與排查

### 驗證 token

```bash
wrangler whoami
```

### 驗證 Pages 專案列表

```bash
wrangler pages project list
```

說明：`banana-pro` 不一定會出現在這個列表中。這次實測可成功部署，但它未必會被 `pages project list` 列出。

### 常見錯誤

#### `Project not found`

如果執行：

```bash
wrangler pages deploy . --project-name=banana-pro
```

出現 `Project not found`，請不要再用這條指令。改用專案內建的部署腳本。

#### `Authentication error [code: 10000]`

優先檢查 `CLOUDFLARE_API_TOKEN` 是否具備：

- `Workers Scripts -> Edit` 或 `Write`

#### `The request to Cloudflare's API timed out`

這通常是暫時性 timeout。直接重試部署即可。

## 本地測試

```bash
python3 -m http.server 8000
```

然後開啟 `http://localhost:8000`

## 部署後檢查

- 網站首頁可正常開啟
- API 呼叫功能正常
- 圖片上傳功能正常
- PDF 下載功能正常
- 自訂網域 `slides.jinzailab.com` 正常解析

## 補充文件

這次修正的完整背景與操作摘要，見 [CLOUDFLARE_DEPLOYMENT_REPORT.md](/Users/donpanic/Documents/programming/my_project/ppt_bananapro/CLOUDFLARE_DEPLOYMENT_REPORT.md)。
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
