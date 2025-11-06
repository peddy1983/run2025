# Netlify 部署指南 - LINE Login 完整版

這份文件說明如何將具有 LINE Login 功能的應用程式部署到 Netlify。

## 📋 前置準備

在部署前，請確認您已經：

- ✅ LINE Developers Channel 已建立
- ✅ Firebase 專案已建立
- ✅ Firebase Admin SDK 服務帳戶已建立
- ✅ Netlify 帳號已註冊

## 🔑 步驟 1：取得 Firebase Admin SDK 金鑰

### 1.1 前往 Firebase Console

1. 打開 [Firebase Console](https://console.firebase.google.com/)
2. 選擇您的專案
3. 點擊左側齒輪圖示 → 「專案設定」

### 1.2 建立服務帳戶金鑰

1. 切換到「服務帳戶」頁籤
2. 點擊「產生新的私密金鑰」
3. 確認並下載 JSON 檔案
4. **重要**：妥善保管此檔案，不要上傳到 Git！

### 1.3 從 JSON 檔案取得資訊

打開下載的 JSON 檔案，您會看到類似以下內容：

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBg...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "...",
  "token_uri": "...",
  "auth_provider_x509_cert_url": "...",
  "client_x509_cert_url": "..."
}
```

您需要記下：
- `project_id`
- `client_email`
- `private_key`（整個內容，包含 `\n`）

## 🔑 步驟 2：取得 LINE Channel Secret

1. 前往 [LINE Developers Console](https://developers.line.biz/)
2. 選擇您的 LINE Login Channel
3. 切換到「Basic settings」頁籤
4. 找到並複製 **Channel secret**

## 🌐 步驟 3：設定 Netlify 環境變數

### 3.1 前往 Netlify Dashboard

1. 登入 [Netlify](https://app.netlify.com/)
2. 選擇您的網站（或先從 Git 部署）
3. 前往「Site settings」
4. 點擊「Environment variables」
5. 點擊「Add a variable」

### 3.2 新增前端環境變數（VITE_ 開頭）

| Key | Value | 說明 |
|-----|-------|------|
| VITE_FIREBASE_API_KEY | AIzaSy... | Firebase 前端 API Key |
| VITE_FIREBASE_AUTH_DOMAIN | your-project.firebaseapp.com | Firebase Auth Domain |
| VITE_FIREBASE_PROJECT_ID | your-project-id | Firebase 專案 ID |
| VITE_FIREBASE_STORAGE_BUCKET | your-project.appspot.com | Firebase Storage Bucket |
| VITE_FIREBASE_MESSAGING_SENDER_ID | 123456789 | Firebase Messaging Sender ID |
| VITE_FIREBASE_APP_ID | 1:123456789:web:abc... | Firebase App ID |
| VITE_LINE_CHANNEL_ID | 2006558795 | LINE Channel ID |
| VITE_LINE_CALLBACK_URL | https://banqiaorun2025.netlify.app/auth/callback | LINE Callback URL（使用您的網址）|

### 3.3 新增後端環境變數（Functions 專用）

| Key | Value | 說明 |
|-----|-------|------|
| FIREBASE_PROJECT_ID | your-project-id | Firebase 專案 ID（與上方相同）|
| FIREBASE_CLIENT_EMAIL | firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com | Firebase Admin Service Account Email |
| FIREBASE_PRIVATE_KEY | "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n" | Firebase Admin Private Key（**包含引號和 \n**）|
| LINE_CHANNEL_ID | 2006558795 | LINE Channel ID（與上方相同）|
| LINE_CHANNEL_SECRET | abcdef1234567890... | LINE Channel Secret（**不要外洩**）|

### ⚠️ FIREBASE_PRIVATE_KEY 設定注意事項

這個變數最容易設定錯誤，請注意：

1. **包含引號**：整個值要用引號包起來
2. **保留 \n**：不要替換成實際換行
3. **完整內容**：從 `-----BEGIN` 到 `-----END`

**正確範例**：
```
"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

**錯誤範例** ❌：
- 沒有引號
- 把 `\n` 替換成實際換行
- 只複製部分內容

## 🔧 步驟 4：更新 LINE Developers 設定

1. 回到 LINE Developers Console
2. 選擇您的 LINE Login Channel
3. 前往「LINE Login」頁籤
4. 在「Callback URL」中新增：
   ```
   https://your-app-name.netlify.app/auth/callback
   ```
   （替換成您的實際 Netlify 網址）

## 🚀 步驟 5：部署到 Netlify

### 方法 1：從 Git 自動部署（推薦）

1. 將程式碼推送到 GitHub
   ```bash
   git add .
   git commit -m "Add LINE Login with Netlify Functions"
   git push
   ```

2. 在 Netlify Dashboard：
   - 點擊「Add new site」
   - 選擇「Import an existing project」
   - 連接您的 GitHub repository
   - 設定會自動偵測（使用 netlify.toml）
   - 點擊「Deploy site」

### 方法 2：手動部署

```bash
# 建置專案
npm run build

# 使用 Netlify CLI 部署
npx netlify-cli deploy --prod
```

## ✅ 步驟 6：驗證部署

### 6.1 檢查 Functions 是否部署成功

1. 在 Netlify Dashboard 查看「Functions」頁籤
2. 應該會看到 `line-login` function
3. 狀態應該是「Active」

### 6.2 測試 LINE 登入

1. 訪問 `https://your-app.netlify.app/login`
2. 點擊「使用 LINE 登入」按鈕
3. 應該會導向 LINE 授權頁面
4. 授權後應該成功登入並返回首頁

## 🐛 疑難排解

### 問題 1：Function 執行失敗

**錯誤訊息**：「500 Internal Server Error」

**解決方案**：
1. 在 Netlify Dashboard 查看 Functions logs
2. 檢查環境變數是否正確設定
3. 確認 `FIREBASE_PRIVATE_KEY` 格式正確

### 問題 2：Firebase Admin 初始化失敗

**錯誤訊息**：「Error initializing Firebase Admin」

**解決方案**：
1. 確認 `FIREBASE_PRIVATE_KEY` 包含完整的 private key
2. 確認 `FIREBASE_CLIENT_EMAIL` 正確
3. 確認 `FIREBASE_PROJECT_ID` 與 Firebase 專案一致

### 問題 3：LINE Token 交換失敗

**錯誤訊息**：「invalid_grant」或「invalid_client」

**解決方案**：
1. 確認 `LINE_CHANNEL_ID` 和 `LINE_CHANNEL_SECRET` 正確
2. 確認 LINE Developers Console 中的 Callback URL 已設定
3. 確認 Callback URL 與實際網址一致

### 問題 4：CORS 錯誤

**錯誤訊息**：「Access to fetch has been blocked by CORS policy」

**解決方案**：
Function 已經設定 CORS 標頭，如果仍有問題：
1. 確認是從正確的網域訪問
2. 清除瀏覽器快取
3. 檢查 Network tab 查看實際錯誤

## 📊 監控與日誌

### 查看 Function 執行日誌

1. Netlify Dashboard → Functions → line-login
2. 點擊「View logs」
3. 可以看到所有執行記錄和錯誤訊息

### 重要日誌訊息

✅ 成功的登入流程應該看到：
```
🔄 開始處理 LINE 登入...
✅ 成功取得 LINE access token
✅ 成功取得 LINE 使用者資料
✅ 建立新使用者 或 使用者已存在，更新資料
✅ 成功建立 Firebase Custom Token
✅ 使用者資料已儲存到 Firestore
```

## 🔐 安全性注意事項

1. **永遠不要**將 Firebase Private Key 或 LINE Channel Secret 提交到 Git
2. **只在 Netlify Dashboard** 設定後端環境變數
3. **定期更換** Channel Secret 和 Service Account Key
4. **監控** Functions 的執行次數，避免異常使用

## 📝 環境變數檢查清單

部署前請確認：

### 前端變數（8 個）
- [ ] VITE_FIREBASE_API_KEY
- [ ] VITE_FIREBASE_AUTH_DOMAIN
- [ ] VITE_FIREBASE_PROJECT_ID
- [ ] VITE_FIREBASE_STORAGE_BUCKET
- [ ] VITE_FIREBASE_MESSAGING_SENDER_ID
- [ ] VITE_FIREBASE_APP_ID
- [ ] VITE_LINE_CHANNEL_ID
- [ ] VITE_LINE_CALLBACK_URL

### 後端變數（5 個）
- [ ] FIREBASE_PROJECT_ID
- [ ] FIREBASE_CLIENT_EMAIL
- [ ] FIREBASE_PRIVATE_KEY（**含引號和 \n**）
- [ ] LINE_CHANNEL_ID
- [ ] LINE_CHANNEL_SECRET

## 🎉 完成！

如果所有步驟都正確完成，您的 LINE Login 功能應該可以正常運作了！

---

**更新日期**：2025-11-06  
**版本**：v2.0（含 Netlify Functions）

