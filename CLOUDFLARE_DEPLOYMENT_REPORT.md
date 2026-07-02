# Cloudflare 部署修正報告

## 這次處理的問題

1. `banana-pro` 在 Cloudflare Dashboard 中可見，但 `wrangler pages project list` 看不到它。
2. 直接使用 `wrangler pages deploy . --project-name=banana-pro` 會失敗。
3. 改用 `wrangler deploy --name banana-pro --assets=.` 後，會把整個專案目錄一起上傳，包含 `.git`、`.wrangler`、`.DS_Store`、壓縮檔等不該公開的檔案。
4. 原本 `app.js` 的註解文字與實際 Gemini endpoint 不一致。

## 原因判斷

- `banana-pro` 實際上要用 Workers 靜態資產模式部署，不是這次 CLI 可直接列出的舊式 Pages 專案。
- Cloudflare API token 一開始缺少部署所需權限，補上 `Workers Scripts` 權限後才能成功上傳資產。
- 專案根目錄同時放了程式、文件、Git 資訊與封存檔，部署時不能直接把整個目錄當成公開資產來源。

## 本次修正

### 程式修正

- 更新 [app.js](/Users/donpanic/Documents/programming/my_project/ppt_bananapro/app.js:2) 註解，改為 `Gemini 3.1 Flash Image API`。

### 部署修正

- 新增 [wrangler.toml](/Users/donpanic/Documents/programming/my_project/ppt_bananapro/wrangler.toml)：
  - `name = "banana-pro"`
  - `compatibility_date = "2026-07-02"`
  - `assets.directory = ".cloudflare-deploy"`
- 新增 [scripts/prepare-cloudflare-assets.sh](/Users/donpanic/Documents/programming/my_project/ppt_bananapro/scripts/prepare-cloudflare-assets.sh)，只複製站點需要的公開檔案到 `.cloudflare-deploy/`
- 新增 [scripts/deploy-cloudflare.sh](/Users/donpanic/Documents/programming/my_project/ppt_bananapro/scripts/deploy-cloudflare.sh)，作為固定部署入口
- 更新 [.gitignore](/Users/donpanic/Documents/programming/my_project/ppt_bananapro/.gitignore)，避免 `.wrangler/` 與 `.cloudflare-deploy/` 進版控

## Cloudflare 權限需求

目前可行的 token 至少需要這些權限：

- `Account -> Workers Scripts -> Edit` 或 `Write`
- `Account -> Cloudflare Pages -> Edit` 或 `Write`

建議額外加入：

- `Account -> Workers Tail -> Read`
- `User -> Memberships -> Read`
- `User -> User Details -> Read`

## 下次部署怎麼做

在專案根目錄執行：

```bash
./scripts/deploy-cloudflare.sh
```

腳本會先準備 `.cloudflare-deploy/`，再透過 `wrangler deploy` 發佈到 `banana-pro`。

## 驗證方式

可先確認 token 與專案可見性：

```bash
wrangler whoami
wrangler pages project list
```

正式部署：

```bash
./scripts/deploy-cloudflare.sh
```

## 已知觀察

- `wrangler pages project list` 不一定會列出 `banana-pro`，但 `wrangler deploy` 仍可對它成功部署。
- 如果再次出現 `Authentication error [code: 10000]`，優先檢查 API token 是否仍有 `Workers Scripts` 權限。
- 如果出現 timeout，可直接重試部署。
