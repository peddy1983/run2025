# LINE Login 設定指南

您的應用程式現在已經整合了 LINE 登入功能！以下是完整的設定步驟。

## 📋 設定步驟

### 第 1 步：建立 LINE Developers 帳號

1. 前往 [LINE Developers Console](https://developers.line.biz/)
2. 使用您的 LINE 帳號登入
3. 同意開發者條款

### 第 2 步：建立 Provider

1. 在 LINE Developers Console 首頁，點擊「Create」或「建立」
2. 選擇「Create a new provider」
3. 填寫 Provider 名稱，例如：「跑步揪團」
4. 點擊「Create」建立

### 第 3 步：建立 LINE Login Channel

1. 在您剛建立的 Provider 頁面，點擊「Create a LINE Login channel」
2. 填寫以下資訊：

   **基本資訊**
   - **Channel name**（中文）：跑步揪團平台
   - **Channel description**（中文）：提供跑步愛好者發起揪團活動和報名參加的平台
   - **App types**：選擇「Web app」
   
   **聯絡資訊**
   - **Email address**：您的聯絡信箱

3. 勾選同意 LINE Login API 條款
4. 點擊「Create」建立 Channel

### 第 4 步：設定 Channel

1. 進入您建立的 LINE Login Channel
2. 前往「LINE Login」頁籤

   **設定 Callback URL：**
   
   在「Callback URL」欄位中新增以下網址：
   
   - **開發環境**：`http://localhost:5173/auth/callback`
   - **正式環境**（部署後）：`https://your-domain.netlify.app/auth/callback`
   
   ⚠️ **重要**：兩個網址都要添加！

3. 前往「Basic settings」頁籤
   - 複製 **Channel ID**（稍後會用到）
   - 複製 **Channel secret**（如果需要後端整合）

### 第 5 步：設定環境變數

在專案根目錄建立 `.env` 檔案（如果還沒有），填入以下內容：

```env
# Firebase 設定（必填）
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef

# LINE Login 設定（必填）
VITE_LINE_CHANNEL_ID=你的-LINE-Channel-ID
VITE_LINE_CALLBACK_URL=http://localhost:5173/auth/callback
```

將 `VITE_LINE_CHANNEL_ID` 替換為您在第 4 步複製的 Channel ID。

### 第 6 步：重新啟動開發伺服器

```bash
# 停止目前的開發伺服器（Ctrl + C）
# 重新啟動
npm run dev
```

### 第 7 步：測試 LINE 登入

1. 打開瀏覽器訪問 `http://localhost:5173/login`
2. 點擊綠色的「使用 LINE 登入」按鈕
3. 系統會導向 LINE 登入頁面
4. 使用您的 LINE 帳號登入並授權

## 🚀 部署到 Netlify

### 設定 Netlify 環境變數

1. 登入 [Netlify Dashboard](https://app.netlify.com/)
2. 選擇您的網站
3. 前往「Site settings」→「Environment variables」
4. 點擊「Add a variable」
5. 逐一新增以下環境變數：

| Key | Value |
|-----|-------|
| VITE_FIREBASE_API_KEY | 您的 Firebase API Key |
| VITE_FIREBASE_AUTH_DOMAIN | your-project.firebaseapp.com |
| VITE_FIREBASE_PROJECT_ID | your-project-id |
| VITE_FIREBASE_STORAGE_BUCKET | your-project.appspot.com |
| VITE_FIREBASE_MESSAGING_SENDER_ID | 123456789 |
| VITE_FIREBASE_APP_ID | 1:123456789:web:abc |
| VITE_LINE_CHANNEL_ID | 您的 LINE Channel ID |
| VITE_LINE_CALLBACK_URL | https://your-app.netlify.app/auth/callback |

⚠️ **重要**：記得將 `VITE_LINE_CALLBACK_URL` 改為您的正式網址！

### 更新 LINE Developers Console

1. 回到 LINE Developers Console
2. 進入您的 LINE Login Channel
3. 前往「LINE Login」頁籤
4. 在「Callback URL」中確認已新增正式環境網址：
   - `https://your-actual-domain.netlify.app/auth/callback`

### 重新部署

```bash
git add .
git commit -m "Add LINE Login integration"
git push
```

或在 Netlify Dashboard 手動觸發部署：
- Deploys → Trigger deploy → Deploy site

## 🔧 目前功能狀態

### ✅ 已完成
- LINE 登入按鈕介面
- LINE 登入授權流程
- 前端 LINE Login 整合
- **Netlify Functions 後端整合**
- **LINE Token 交換**
- **LINE 使用者資料取得**
- **Firebase Custom Token 登入**
- **完整的端對端登入流程**

✅ **功能已完整實作，可以直接部署使用！**

## 📝 注意事項

### 關於後端整合

✅ **後端整合已完成！**使用 Netlify Functions 處理完整流程：

1. ✅ 使用者點擊「使用 LINE 登入」
2. ✅ 導向 LINE 授權頁面
3. ✅ 使用者授權後返回您的網站（帶有 authorization code）
4. ✅ **Netlify Function**：用 code 向 LINE 換取 access token
5. ✅ **Netlify Function**：用 access token 取得使用者資料
6. ✅ **Netlify Function**：在 Firebase 建立或更新使用者
7. ✅ **Netlify Function**：產生 Firebase Custom Token
8. ✅ **前端**：使用 Custom Token 登入 Firebase

### 技術架構

我們使用 **Netlify Functions** 作為後端 serverless 服務：

- **安全性**：Channel Secret 儲存在 Netlify 環境變數中，不會暴露
- **免費額度**：每月 125,000 次 function 調用
- **自動擴展**：無需管理伺服器
- **與前端整合**：部署在同一個網域下

### 未來串接 LINE 群組

如果您計劃串接 LINE 群組功能，需要：

1. 建立 LINE Messaging API Channel（不是 LINE Login Channel）
2. 取得 Bot Token
3. 實作 Webhook 接收群組訊息
4. 整合群組管理功能

這部分可以在後端服務建置完成後再進行。

## 🆘 疑難排解

### Q: 點擊 LINE 登入按鈕後出現錯誤訊息
A: 檢查：
- `.env` 檔案中的 `VITE_LINE_CHANNEL_ID` 是否正確
- LINE Developers Console 中的 Callback URL 是否已設定
- 開發伺服器是否已重新啟動

### Q: LINE 授權後無法登入
A: 目前這是預期行為，因為需要後端支援來完成登入流程。您會看到提示訊息說明需要後端整合。

### Q: 如何快速測試登入功能？
A: 建議使用 Email/Password 登入方式測試應用程式的其他功能，待後端服務建置完成後再啟用 LINE Login。

## 📞 需要協助？

如有任何問題，請檢查：
1. `.env` 檔案設定
2. LINE Developers Console 設定
3. 瀏覽器 Console 的錯誤訊息
4. Firebase Console 的登入方式設定

---

**更新日期**：2025-11-06
**版本**：v1.0

