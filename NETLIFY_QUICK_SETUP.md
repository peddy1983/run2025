# Netlify 快速重建指南

> 🎯 **使用情境**：當 Netlify 網站額度超過，需要建立新網站但保持網址不變時使用本指南

## 📋 重建前準備檢查清單

在開始重建之前，請確認以下資訊已備妥：

- [ ] Firebase Admin SDK JSON 檔案（`run2025-7734c-firebase-adminsdk-fbsvc-c02c7a196b.json`）
- [ ] LINE Channel ID 和 Channel Secret
- [ ] 自訂網域名稱（如：banqiaorun2025.netlify.app）
- [ ] Git Repository 連結

---

## 🚀 步驟 1：建立新的 Netlify 網站

### 1.1 從 Git 部署

1. 登入 [Netlify Dashboard](https://app.netlify.com/)
2. 點擊「Add new site」
3. 選擇「Import an existing project」
4. 連接 GitHub/GitLab 並選擇此專案的 repository
5. 建置設定會自動偵測（使用 `netlify.toml`）：
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`
6. **暫時不要點擊部署**，先前往步驟 2 設定環境變數

---

## 🔑 步驟 2：設定環境變數（13 個）

### 方法 A：使用批量匯入（推薦）

1. 在 Netlify Dashboard 前往「Site settings」→「Environment variables」
2. 點擊「Import from a .env file」
3. 將以下內容完整複製貼上：

```env
# ========================================
# 前端變數 (8 個) - VITE_ 開頭
# ========================================
VITE_FIREBASE_API_KEY=AIzaSyCGUVokZQGbMLd0KIU1_22zWRh2TQA4GyM
VITE_FIREBASE_AUTH_DOMAIN=run2025-7734c.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=run2025-7734c
VITE_FIREBASE_STORAGE_BUCKET=run2025-7734c.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=184417306883
VITE_FIREBASE_APP_ID=1:184417306883:web:e9a58ab406a280ad4d8136
VITE_LINE_CHANNEL_ID=2008428213
VITE_LINE_CALLBACK_URL=https://banqiaorun2025.netlify.app/auth/callback

# ========================================
# 後端變數 (5 個) - Functions 專用
# ========================================
FIREBASE_PROJECT_ID=run2025-7734c
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@run2025-7734c.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCSRXobg56dlKS8\nplwEglK9ZawILj21fxc0A90+KJhiAp0pCNYEErNaKZtT/FohrR5IdpK4k+AN08kz\n+bhG0w5PP1SSyYnVQfR+k4UPNGhEl4BvAsmMsbhtfK7x0PTNBBQbQwTVRA9raGt3\nKPELb9bwUzC1RaTLVzNUqgrD+RCL7HgsP7GrfkGt0Iggy6DW4+5rrmR6mdCFEIpm\nqrIuN+4rX509GjHoFkIltkWr0nI7Oy6aUph+4vQUz5Xg/MhuEI2ibkKOqgwbymVw\nV+pzhuT6joQJhmxdYViXXlsFKJylLw7nJV0XQHd0BS0G5I0k8xwKyEwuDXBkW0f+\n445XVteHAgMBAAECggEAEkN4jqzthjGELEX9YVbAbAOg6liTvfDDfewpmNRKypoW\n84O17UZEfLKLQX5V5rSN/nBHu6JDLJbQHZxFpRo/RCfdMILXofgdRhy3VYGurznX\ngITxk46xP4J8+ZakqmCi/hBtLw/TeQ7NtFA5YLszNEi+4TNz8yvNLfoZZATaSw4o\nUo5cp50OZ+XUfn4Gp0UDPTcd/VLBxqxMYM4IcOckKnT7iyg0BLwR4SLACcIN/A/P\nkX2XVwGkF7oxJQGiM6JvYFtvZms+rSIXa3AB34WNllcoeSl7G+cbeGeUjw30R9aB\nOOY9xj0Trpf+KoaiK2um4jM6tkzAKQsd9n3e1xcOYQKBgQDEtZpiFJawMqQFWbvQ\n2jhJ1oSqws+gjRQDfZ7NMB4nCMYBd7hjY2VaYwd0g+oLs3SCh/sDxXr1dV5dmFz0\n/+ujgiXGSNlTC3ZGePl71AYKS67jjCrdA7V37OkSs0GvKlIXCdzemhc7nLkpOhSZ\nS6YpdJtzfEihXw/9mhAbZNcJ8QKBgQC+XABXgVPPxQ9ndMyD5OehYnCcA+mgBA9T\nydfUYfEzLDMe8Sgk5Xtrzi0DQe76cHG/JUuiuI/pDm4ocpVm1XTghz7ziIZTYLSV\nrIX3QbMP7rOdmfv6TK5+arr0NSq93yLjDDH6xEZsr6t4kYDgC0xwAqJyeMkUin6I\nwX7Yf2BA9wKBgAtZQtfnwi3WLhpU6/4HqPmxk6Paa2oi2YW+CJxj60lrOyk4g/3P\n7TgCwJpbRfR43P7u4297RDXHGLOjp7FG1oxvZMiEyWz+G0vDjPk06UhMx4E/Q/XO\nUfjiRSwcBW0arvO/UOvSzgZVa2VSgX+6mpKHtLQ79mDBAEYsTkOWVMWxAoGAYI7U\nUY61T6+6p5S0ZLbI07DWRB0r9VH54FuDEiT4LyfdanWTElwhJcb4SC26pehBml61\npf2Oaf463GN66yWdWoLf6LI4yLRGBaH0dj4qMQu4qlnAWe9pl5BV8qfBXXyA+sBl\n3biPrHPTO546y+qPREXh1sTz4mp50q6rw++giHMCgYBmIT9QiKdQl/wfaeGNPuka\nUGOCbGmVSJYFOgMOo8RUv4kMHTZKSkP06MN9ausfUJ/Z5GD1UBjYvTSKwnHzdZ/o\nna6dl+xOa/4PXPT5MDF5r9c0ssmjusMs0UqGkO5D2u/0oZfdnSE19e0mXpSjvO0E\nCPRDf3bUnllP6+sjQnv/WQ==\n-----END PRIVATE KEY-----\n"
LINE_CHANNEL_ID=2008428213
LINE_CHANNEL_SECRET=c9e0f79dcb97d076096fb9bd89412b27
```

4. 勾選「Contains secret values」
5. 點擊「Import variables」

### 方法 B：手動新增

如果批量匯入失敗，請逐一新增以下變數：

#### 前端變數（8 個）

| 變數名稱 | 值 |
|---------|-----|
| `VITE_FIREBASE_API_KEY` | `AIzaSyCGUVokZQGbMLd0KIU1_22zWRh2TQA4GyM` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `run2025-7734c.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `run2025-7734c` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `run2025-7734c.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `184417306883` |
| `VITE_FIREBASE_APP_ID` | `1:184417306883:web:e9a58ab406a280ad4d8136` |
| `VITE_LINE_CHANNEL_ID` | `2008428213` |
| `VITE_LINE_CALLBACK_URL` | `https://banqiaorun2025.netlify.app/auth/callback` |

#### 後端變數（5 個）

| 變數名稱 | 值 | 注意事項 |
|---------|-----|---------|
| `FIREBASE_PROJECT_ID` | `run2025-7734c` | |
| `FIREBASE_CLIENT_EMAIL` | `firebase-adminsdk-fbsvc@run2025-7734c.iam.gserviceaccount.com` | |
| `FIREBASE_PRIVATE_KEY` | 見下方 | ⚠️ 包含引號和 \n |
| `LINE_CHANNEL_ID` | `2008428213` | |
| `LINE_CHANNEL_SECRET` | `c9e0f79dcb97d076096fb9bd89412b27` | 🔒 敏感資訊 |

**FIREBASE_PRIVATE_KEY 完整內容**：
```
"-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCSRXobg56dlKS8\nplwEglK9ZawILj21fxc0A90+KJhiAp0pCNYEErNaKZtT/FohrR5IdpK4k+AN08kz\n+bhG0w5PP1SSyYnVQfR+k4UPNGhEl4BvAsmMsbhtfK7x0PTNBBQbQwTVRA9raGt3\nKPELb9bwUzC1RaTLVzNUqgrD+RCL7HgsP7GrfkGt0Iggy6DW4+5rrmR6mdCFEIpm\nqrIuN+4rX509GjHoFkIltkWr0nI7Oy6aUph+4vQUz5Xg/MhuEI2ibkKOqgwbymVw\nV+pzhuT6joQJhmxdYViXXlsFKJylLw7nJV0XQHd0BS0G5I0k8xwKyEwuDXBkW0f+\n445XVteHAgMBAAECggEAEkN4jqzthjGELEX9YVbAbAOg6liTvfDDfewpmNRKypoW\n84O17UZEfLKLQX5V5rSN/nBHu6JDLJbQHZxFpRo/RCfdMILXofgdRhy3VYGurznX\ngITxk46xP4J8+ZakqmCi/hBtLw/TeQ7NtFA5YLszNEi+4TNz8yvNLfoZZATaSw4o\nUo5cp50OZ+XUfn4Gp0UDPTcd/VLBxqxMYM4IcOckKnT7iyg0BLwR4SLACcIN/A/P\nkX2XVwGkF7oxJQGiM6JvYFtvZms+rSIXa3AB34WNllcoeSl7G+cbeGeUjw30R9aB\nOOY9xj0Trpf+KoaiK2um4jM6tkzAKQsd9n3e1xcOYQKBgQDEtZpiFJawMqQFWbvQ\n2jhJ1oSqws+gjRQDfZ7NMB4nCMYBd7hjY2VaYwd0g+oLs3SCh/sDxXr1dV5dmFz0\n/+ujgiXGSNlTC3ZGePl71AYKS67jjCrdA7V37OkSs0GvKlIXCdzemhc7nLkpOhSZ\nS6YpdJtzfEihXw/9mhAbZNcJ8QKBgQC+XABXgVPPxQ9ndMyD5OehYnCcA+mgBA9T\nydfUYfEzLDMe8Sgk5Xtrzi0DQe76cHG/JUuiuI/pDm4ocpVm1XTghz7ziIZTYLSV\nrIX3QbMP7rOdmfv6TK5+arr0NSq93yLjDDH6xEZsr6t4kYDgC0xwAqJyeMkUin6I\nwX7Yf2BA9wKBgAtZQtfnwi3WLhpU6/4HqPmxk6Paa2oi2YW+CJxj60lrOyk4g/3P\n7TgCwJpbRfR43P7u4297RDXHGLOjp7FG1oxvZMiEyWz+G0vDjPk06UhMx4E/Q/XO\nUfjiRSwcBW0arvO/UOvSzgZVa2VSgX+6mpKHtLQ79mDBAEYsTkOWVMWxAoGAYI7U\nUY61T6+6p5S0ZLbI07DWRB0r9VH54FuDEiT4LyfdanWTElwhJcb4SC26pehBml61\npf2Oaf463GN66yWdWoLf6LI4yLRGBaH0dj4qMQu4qlnAWe9pl5BV8qfBXXyA+sBl\n3biPrHPTO546y+qPREXh1sTz4mp50q6rw++giHMCgYBmIT9QiKdQl/wfaeGNPuka\nUGOCbGmVSJYFOgMOo8RUv4kMHTZKSkP06MN9ausfUJ/Z5GD1UBjYvTSKwnHzdZ/o\nna6dl+xOa/4PXPT5MDF5r9c0ssmjusMs0UqGkO5D2u/0oZfdnSE19e0mXpSjvO0E\nCPRDf3bUnllP6+sjQnv/WQ==\n-----END PRIVATE KEY-----\n"
```

⚠️ **重要提醒**：
- 必須包含開頭和結尾的雙引號 `"`
- 保留所有 `\n` 字元，不要替換成實際換行
- 從 `-----BEGIN` 到 `-----END` 必須完整複製

---

## 🌐 步驟 3：設定自訂網域

### 3.1 設定 Netlify 網域

1. 在 Netlify Dashboard 前往「Domain management」
2. 點擊「Options」→「Edit site name」
3. 將網站名稱改為：`banqiaorun2025`
4. 完整網址會變成：`https://banqiaorun2025.netlify.app`

### 3.2 如果有自訂網域

如果您有購買自己的網域：

1. 在「Domain management」點擊「Add custom domain」
2. 輸入您的網域名稱
3. 依照指示設定 DNS 記錄（A 記錄或 CNAME）
4. 等待 DNS 生效（通常需要 24-48 小時）

---

## 🔧 步驟 4：確認 netlify.toml 設定

確認專案根目錄的 `netlify.toml` 檔案內容如下：

```toml
# Netlify 設定檔

[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"

# Netlify Functions 設定
[functions]
  node_bundler = "esbuild"

# SPA 路由設定
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# 環境變數（實際值需在 Netlify Dashboard 設定）
[build.environment]
  NODE_VERSION = "18"
```

---

## 🔗 步驟 5：更新 LINE Developers 設定

### 5.1 確認 Callback URL

1. 前往 [LINE Developers Console](https://developers.line.biz/)
2. 選擇您的 Channel（Channel ID: 2008428213）
3. 前往「LINE Login」→「Callback URL」
4. 確認已新增：
   ```
   https://banqiaorun2025.netlify.app/auth/callback
   ```

### 5.2 如果需要更新

如果新的 Netlify 網站使用不同的網址：
1. 在 LINE Developers Console 新增新的 Callback URL
2. 更新 Netlify 環境變數中的 `VITE_LINE_CALLBACK_URL`
3. 重新部署網站

---

## ✅ 步驟 6：部署並驗證

### 6.1 觸發部署

1. 在 Netlify Dashboard 點擊「Deploy site」或「Trigger deploy」
2. 等待建置完成（通常需要 2-5 分鐘）
3. 查看「Deploy log」確認沒有錯誤

### 6.2 驗證清單

部署完成後，請依序檢查：

- [ ] 網站可以正常訪問
- [ ] 首頁活動列表正常顯示
- [ ] 點擊「使用 LINE 登入」會導向 LINE 授權頁面
- [ ] LINE 登入後可以成功返回並顯示使用者資訊
- [ ] 可以建立新活動
- [ ] 可以報名參加活動
- [ ] 可以查看「我的活動」

### 6.3 檢查 Functions

1. 在 Netlify Dashboard 前往「Functions」頁籤
2. 確認看到 `line-login` function
3. 狀態顯示為「Active」
4. 可以點擊查看執行日誌

---

## 🐛 常見問題排查

### 問題 1：環境變數匯入失敗

**解決方案**：
- 檢查是否勾選「Contains secret values」
- 確認格式正確（每行一個變數，格式為 `KEY=VALUE`）
- 嘗試使用方法 B 手動逐一新增

### 問題 2：FIREBASE_PRIVATE_KEY 格式錯誤

**症狀**：Function 執行時出現 Firebase Admin 初始化錯誤

**解決方案**：
- 確認包含開頭和結尾的雙引號
- 確認所有 `\n` 都存在
- 重新從 `netlify-env-ready.txt` 複製完整內容

### 問題 3：LINE Login 失敗

**症狀**：點擊登入按鈕後出現錯誤或無法返回

**解決方案**：
1. 確認 LINE Developers Console 的 Callback URL 正確
2. 確認 `VITE_LINE_CALLBACK_URL` 與 Callback URL 一致
3. 確認 `LINE_CHANNEL_SECRET` 正確無誤
4. 查看 Netlify Functions logs 找出詳細錯誤訊息

### 問題 4：Functions 無法執行

**症狀**：登入時出現 500 錯誤

**解決方案**：
1. 檢查 Functions logs：Dashboard → Functions → line-login → View logs
2. 確認所有 5 個後端環境變數都已設定
3. 確認 `netlify/functions/line-login.js` 檔案存在
4. 嘗試重新部署

### 問題 5：網域無法訪問

**症狀**：網站顯示 404 或無法連線

**解決方案**：
1. 確認部署狀態為「Published」
2. 檢查 DNS 設定（如使用自訂網域）
3. 清除瀏覽器快取並重新整理
4. 等待 CDN 刷新（可能需要 5-10 分鐘）

---

## 📊 監控與維護

### 查看使用量

1. Netlify Dashboard → 「Team」→「Billing」
2. 監控項目：
   - **Bandwidth**（頻寬）：免費方案每月 100GB
   - **Build minutes**（建置時間）：免費方案每月 300 分鐘
   - **Functions invocations**（Functions 執行次數）：免費方案每月 125K 次
   - **Functions runtime**（Functions 執行時間）：免費方案每月 125K 秒

### 優化建議

如果接近額度上限：
1. **減少重新部署次數**：合併多個變更後再部署
2. **啟用快取**：Netlify 會自動快取靜態資源
3. **監控 Functions**：避免不必要的 API 呼叫
4. **考慮升級方案**：如果網站流量持續成長

---

## 📁 重要檔案備份清單

建議定期備份以下檔案（不要上傳到 Git）：

- [ ] Firebase Admin SDK JSON 檔案
- [ ] LINE Channel Secret
- [ ] Netlify 環境變數設定（本文件）
- [ ] 自訂網域 DNS 設定記錄

---

## 🎯 快速重建流程總結

需要快速重建時，按照以下順序操作：

1. ✅ 建立新的 Netlify 網站（從 Git 連結）
2. ✅ 匯入 13 個環境變數（使用批量匯入）
3. ✅ 設定網站名稱為 `banqiaorun2025`
4. ✅ 確認 LINE Callback URL 設定
5. ✅ 觸發部署
6. ✅ 驗證所有功能正常運作

**預估時間**：10-15 分鐘

---

## 📞 需要協助？

如果遇到無法解決的問題：

1. 查看 Netlify Deploy logs
2. 查看 Netlify Functions logs
3. 查看瀏覽器 Console 錯誤訊息
4. 參考 `NETLIFY_DEPLOYMENT.md` 詳細說明

---

**文件版本**：v1.0  
**最後更新**：2025-11-06  
**適用專案**：跑步揪團平台（run2025-7734c）

