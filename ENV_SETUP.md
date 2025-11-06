# 環境變數設定指南

這份文件說明如何取得和設定所需的環境變數。

## 必要的環境變數

建立 `.env` 檔案（複製 `.env.example`），並填入以下資訊：

## 1. Firebase 設定

### 取得步驟：

1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 建立新專案或選擇現有專案
3. 點擊「專案設定」（齒輪圖示）
4. 向下滾動到「您的應用程式」區塊
5. 如果還沒有 Web 應用程式，點擊 Web 圖示 `</>`
6. 註冊應用程式（可以命名為「跑步揪團平台」）
7. 複製 Firebase SDK configuration 中的值

### 需要填入的變數：

\`\`\`env
VITE_FIREBASE_API_KEY=AIzaSy...（您的 API Key）
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef...
\`\`\`

### 啟用 Firebase 服務：

#### Firestore Database
1. 在 Firebase Console 左側選單點選「Firestore Database」
2. 點擊「建立資料庫」
3. 選擇「測試模式開始」（之後記得改成正式的安全規則）
4. 選擇地區（建議選擇 asia-east1 或 asia-northeast1）
5. 在「規則」頁籤，貼上以下規則：

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /activities/{activityId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        request.auth.uid == resource.data.creatorId;
    }
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
\`\`\`

#### Authentication
1. 在 Firebase Console 左側選單點選「Authentication」
2. 點擊「開始使用」
3. 在「Sign-in method」頁籤，啟用以下登入方式（任選）：
   - **Google**（推薦，最簡單）
   - Email/Password
   - 或其他您偏好的方式

**注意**：LINE Login 需要額外的後端處理，目前可先使用 Google 登入測試。

## 2. LINE Login 設定（選用）

### 取得步驟：

1. 前往 [LINE Developers Console](https://developers.line.biz/)
2. 使用 LINE 帳號登入
3. 如果沒有 Provider，建立一個新的 Provider
   - 名稱：例如「跑步揪團」
4. 在 Provider 下建立新的 Channel
   - Channel 類型：選擇「LINE Login」
   - Channel 名稱：例如「跑步揪團平台」
   - Channel 描述：「提供跑步愛好者發起揪團活動和報名參加的平台」
5. 建立完成後，在 Channel 設定頁面：
   - 找到「Channel ID」並複製
   - 找到「Channel Secret」並複製（需要時）

### 設定 Callback URL：

在 LINE Login 設定頁面：
- **開發環境**：`http://localhost:3000/auth/callback`
- **正式環境**：`https://your-domain.netlify.app/auth/callback`

### 需要填入的變數：

\`\`\`env
VITE_LINE_CHANNEL_ID=1234567890
VITE_LINE_CALLBACK_URL=http://localhost:3000/auth/callback
\`\`\`

**重要提示**：
- LINE Login 完整整合需要後端 API 來處理 token 交換
- 目前程式碼中已預留架構，但需要搭配 Netlify Functions 或其他 serverless 服務
- 開發初期可以先使用 Firebase 的 Google 登入進行測試

## 3. Netlify 部署環境變數

部署到 Netlify 時，需要在 Netlify Dashboard 設定環境變數：

1. 登入 [Netlify](https://www.netlify.com/)
2. 選擇您的 site
3. 前往「Site settings」→「Environment variables」
4. 點擊「Add a variable」
5. 逐一新增所有環境變數（與 `.env` 檔案相同）
6. **重要**：記得更新 `VITE_LINE_CALLBACK_URL` 為正式網址

### 範例：

| Key | Value |
|-----|-------|
| VITE_FIREBASE_API_KEY | AIzaSy... |
| VITE_FIREBASE_AUTH_DOMAIN | your-project.firebaseapp.com |
| VITE_FIREBASE_PROJECT_ID | your-project-id |
| VITE_FIREBASE_STORAGE_BUCKET | your-project.appspot.com |
| VITE_FIREBASE_MESSAGING_SENDER_ID | 123456789 |
| VITE_FIREBASE_APP_ID | 1:123456789:web:abc... |
| VITE_LINE_CHANNEL_ID | 1234567890 |
| VITE_LINE_CALLBACK_URL | https://your-app.netlify.app/auth/callback |

## 檢查清單

設定完成後，請確認：

- [ ] Firebase 專案已建立
- [ ] Firestore Database 已啟用並設定規則
- [ ] Firebase Authentication 已啟用至少一種登入方式
- [ ] Firebase Config 已複製到 `.env`
- [ ] LINE Developers Channel 已建立（選用）
- [ ] LINE Login Callback URL 已設定
- [ ] 本地開發環境可以正常運行（`npm run dev`）
- [ ] Netlify 環境變數已設定（部署時）

## 常見問題

### Q: Firebase 設定後仍無法連線？
A: 確認：
1. `.env` 檔案在專案根目錄
2. 所有變數都以 `VITE_` 開頭
3. 重新啟動開發伺服器（`npm run dev`）

### Q: LINE Login 按鈕點擊後沒反應？
A: LINE Login 需要後端支援。建議：
1. 先使用 Firebase 的 Google 登入測試功能
2. 之後再整合 Netlify Functions 處理 LINE Login

### Q: 部署到 Netlify 後環境變數沒生效？
A: 確認：
1. 在 Netlify Dashboard 正確設定所有環境變數
2. 變數名稱正確（包含 `VITE_` 前綴）
3. 重新部署（Deploys → Trigger deploy → Deploy site）

### Q: Firestore 權限被拒絕？
A: 確認：
1. Firebase Console → Firestore → Rules
2. 規則已正確設定（參考上方規則）
3. Authentication 已啟用且使用者已登入

## 安全注意事項

⚠️ **重要**：
- 不要將 `.env` 檔案提交到 Git（已在 `.gitignore` 中）
- Firebase API Key 可以公開（有使用限制保護）
- LINE Channel Secret 必須保密（不要放在前端）
- 正式環境記得更新 Firestore 安全規則

## 需要幫助？

如果遇到問題：
1. 檢查瀏覽器 Console 的錯誤訊息
2. 檢查 Firebase Console 的使用情況和錯誤日誌
3. 確認所有環境變數拼寫正確
4. 參考 README.md 的疑難排解章節
\`\`\`



