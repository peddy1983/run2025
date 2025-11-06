# 🚀 Netlify 部署檢查清單

## 📋 部署前準備

### 1. Firebase Admin SDK 設定

- [ ] 已下載 Firebase Service Account JSON 檔案
- [ ] 已記下 `project_id`
- [ ] 已記下 `client_email`
- [ ] 已記下 `private_key`（完整內容）

**取得方式**：
Firebase Console → 專案設定 → 服務帳戶 → 產生新的私密金鑰

### 2. LINE Developers 設定

- [ ] LINE Login Channel 已建立
- [ ] 已取得 Channel ID
- [ ] 已取得 Channel Secret
- [ ] Callback URL 已設定為：`https://your-app.netlify.app/auth/callback`

**取得方式**：
LINE Developers Console → 您的 Channel → Basic settings

### 3. 本地測試

- [ ] 本地開發伺服器可以正常運行
- [ ] Email 登入功能正常
- [ ] LINE 登入按鈕顯示正常

## 🌐 Netlify 環境變數設定

### 前端變數（8 個）

在 Netlify Dashboard → Site settings → Environment variables 中新增：

- [ ] `VITE_FIREBASE_API_KEY` = `你的Firebase API Key`
- [ ] `VITE_FIREBASE_AUTH_DOMAIN` = `your-project.firebaseapp.com`
- [ ] `VITE_FIREBASE_PROJECT_ID` = `your-project-id`
- [ ] `VITE_FIREBASE_STORAGE_BUCKET` = `your-project.appspot.com`
- [ ] `VITE_FIREBASE_MESSAGING_SENDER_ID` = `123456789`
- [ ] `VITE_FIREBASE_APP_ID` = `1:123456789:web:abc...`
- [ ] `VITE_LINE_CHANNEL_ID` = `你的LINE Channel ID`
- [ ] `VITE_LINE_CALLBACK_URL` = `https://your-app.netlify.app/auth/callback`

### 後端變數（5 個）

**重要**：這些變數只在 Netlify Functions 中使用，不會暴露在前端

- [ ] `FIREBASE_PROJECT_ID` = `your-project-id`
- [ ] `FIREBASE_CLIENT_EMAIL` = `firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com`
- [ ] `FIREBASE_PRIVATE_KEY` = `"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"`
      ⚠️ **重要**：必須包含引號和 \n，完整複製 JSON 檔案中的 private_key 值
- [ ] `LINE_CHANNEL_ID` = `你的LINE Channel ID`（與前端相同）
- [ ] `LINE_CHANNEL_SECRET` = `你的LINE Channel Secret`

## 🔧 LINE Developers 最終設定

- [ ] Callback URL 已更新為正式網址：
  ```
  https://your-actual-domain.netlify.app/auth/callback
  ```
- [ ] 已點擊「Update」儲存設定

## 📦 部署步驟

### 方法 1：Git 自動部署（推薦）

```bash
# 1. 確認所有變更
git status

# 2. 提交變更
git add .
git commit -m "Complete LINE Login integration with Netlify Functions"

# 3. 推送到 GitHub
git push origin main
```

然後在 Netlify Dashboard：
- [ ] 已連接 GitHub repository
- [ ] 已觸發自動部署
- [ ] 部署成功（Status: Published）

### 方法 2：手動部署

```bash
# 1. 建置專案
npm run build

# 2. 使用 Netlify CLI 部署
npx netlify-cli deploy --prod
```

## ✅ 部署後驗證

### 1. 檢查 Functions

- [ ] Netlify Dashboard → Functions 頁籤
- [ ] 看到 `line-login` function
- [ ] 狀態顯示為 Active

### 2. 測試登入流程

1. 訪問 `https://your-app.netlify.app/login`
   - [ ] 頁面正常載入
   - [ ] LINE 登入按鈕顯示正常

2. 點擊「使用 LINE 登入」
   - [ ] 導向 LINE 授權頁面
   - [ ] 使用 LINE 帳號授權
   - [ ] 返回您的網站
   - [ ] 成功登入，顯示使用者資訊
   - [ ] 導向首頁

3. 檢查登入狀態
   - [ ] 導覽列顯示使用者名稱
   - [ ] 可以建立活動
   - [ ] 可以報名活動

### 3. 檢查 Logs（如果有問題）

- [ ] Netlify Dashboard → Functions → line-login → View logs
- [ ] 查看是否有錯誤訊息

## 🐛 常見問題快速檢查

### ❌ 問題：Function 執行失敗

檢查：
- [ ] 所有環境變數都已設定
- [ ] `FIREBASE_PRIVATE_KEY` 格式正確（包含引號和 \n）
- [ ] Function logs 中的錯誤訊息

### ❌ 問題：LINE Token 交換失敗

檢查：
- [ ] `LINE_CHANNEL_ID` 正確
- [ ] `LINE_CHANNEL_SECRET` 正確
- [ ] LINE Callback URL 與實際網址一致

### ❌ 問題：Firebase 初始化失敗

檢查：
- [ ] `FIREBASE_PROJECT_ID` 正確
- [ ] `FIREBASE_CLIENT_EMAIL` 正確
- [ ] `FIREBASE_PRIVATE_KEY` 完整且格式正確

## 📊 監控建議

部署成功後，建議：

- [ ] 定期檢查 Netlify Functions 使用量
- [ ] 監控錯誤日誌
- [ ] 測試不同裝置和瀏覽器
- [ ] 確認手機版 LINE 登入正常

## 🎉 完成！

如果所有檢查項目都已完成，恭喜您成功部署 LINE Login 功能！

---

**需要幫助？**

- 詳細設定步驟：查看 `NETLIFY_DEPLOYMENT.md`
- LINE 設定指南：查看 `LINE_LOGIN_SETUP.md`
- 環境變數範本：查看 `ENV_TEMPLATE.txt`

