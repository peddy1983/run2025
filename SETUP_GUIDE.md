# 快速設定指南 🚀

這是一個快速入門指南，幫助您在 15 分鐘內完成設定並開始使用。

## 📋 步驟總覽

1. ✅ 安裝依賴
2. ✅ 設定 Firebase
3. ✅ 設定環境變數
4. ✅ 啟動開發伺服器
5. ✅ 部署到 Netlify

---

## 步驟 1：安裝依賴

```bash
npm install
```

---

## 步驟 2：設定 Firebase

### 2.1 建立 Firebase 專案

1. 前往 https://console.firebase.google.com/
2. 點擊「新增專案」
3. 輸入專案名稱：「跑步揪團」
4. 停用 Google Analytics（可選）
5. 點擊「建立專案」

### 2.2 啟用 Firestore Database

1. 左側選單 → 「Firestore Database」
2. 點擊「建立資料庫」
3. 選擇「以測試模式開始」
4. 選擇地區：`asia-east1` 或 `asia-northeast1`
5. 點擊「啟用」

### 2.3 設定 Firestore 規則

在「規則」頁籤，複製以下內容：

```javascript
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
```

點擊「發布」。

### 2.4 啟用 Authentication

1. 左側選單 → 「Authentication」
2. 點擊「開始使用」
3. 選擇「Google」登入方式
4. 啟用開關
5. 選擇專案的公開名稱
6. 選擇支援電子郵件
7. 點擊「儲存」

### 2.5 取得 Firebase Config

1. 點擊專案設定（齒輪圖示）
2. 向下滾動到「您的應用程式」
3. 點擊「</> Web」圖示
4. 輸入應用程式暱稱：「跑步揪團 Web」
5. **不要**勾選 Firebase Hosting
6. 點擊「註冊應用程式」
7. 複製 `firebaseConfig` 物件中的值

---

## 步驟 3：設定環境變數

### 3.1 建立 .env 檔案

在專案根目錄建立 `.env` 檔案（或複製 `.env.example`）：

```bash
cp .env.example .env
```

### 3.2 填入 Firebase 設定

編輯 `.env`，填入剛才從 Firebase 複製的值：

```env
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

# LINE Login（先保持預設值，稍後再設定）
VITE_LINE_CHANNEL_ID=your-line-channel-id
VITE_LINE_CALLBACK_URL=http://localhost:3000/auth/callback
```

---

## 步驟 4：啟動開發伺服器

```bash
npm run dev
```

開啟瀏覽器前往 http://localhost:3000

🎉 **恭喜！您的網站已經可以運作了！**

---

## 步驟 5：測試功能

### 5.1 測試登入

1. 點擊右上角「LINE 登入」按鈕旁的選項
2. 由於 LINE Login 需要後端支援，請先使用 Firebase 測試
3. 可以暫時修改 `Navbar.jsx` 加入 Google 登入按鈕

### 5.2 暫時啟用 Google 登入（測試用）

在 `src/contexts/AuthContext.jsx` 新增：

```javascript
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

// 在 AuthProvider 中新增
const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error('登入失敗:', error);
    alert('登入失敗');
  }
};
```

並在 return 的 value 中加入 `loginWithGoogle`。

然後在 `src/components/Navbar.jsx` 中將 `onClick={loginWithLine}` 改為 `onClick={loginWithGoogle}`，按鈕文字改為「Google 登入」。

### 5.3 測試建立活動

1. 登入後，點擊「我要揪團」
2. 填寫活動資訊
3. 點擊「發起揪團」
4. 回到首頁應該會看到您建立的活動

---

## 步驟 6：部署到 Netlify

### 6.1 推送到 GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/running-group.git
git push -u origin main
```

### 6.2 在 Netlify 部署

1. 前往 https://www.netlify.com/
2. 點擊「Add new site」→「Import an existing project」
3. 選擇「GitHub」
4. 授權並選擇您的 repository
5. 建置設定：
   - Build command: `npm run build`
   - Publish directory: `dist`
6. 點擊「Advanced」→「New variable」
7. 新增所有 `.env` 中的環境變數
8. 點擊「Deploy site」

### 6.3 更新環境變數

部署完成後：

1. 複製 Netlify 給您的網址（例如：`https://your-app.netlify.app`）
2. 在 Netlify → Site settings → Environment variables
3. 更新 `VITE_LINE_CALLBACK_URL` 為：
   ```
   https://your-app.netlify.app/auth/callback
   ```
4. 點擊「Deploys」→「Trigger deploy」→「Deploy site」

---

## 🎯 下一步

### 必要設定

- [ ] 設定 LINE Login（參考 `ENV_SETUP.md`）
- [ ] 更新 Firestore 安全規則（正式環境）
- [ ] 設定自訂網域（選用）

### 建議改進

- [ ] 新增 Google 登入選項（較簡單）
- [ ] 新增活動圖片上傳功能
- [ ] 新增活動搜尋功能
- [ ] 整合 Google Maps
- [ ] 新增推播通知

---

## ❗ 常見問題

### Q: 開發伺服器啟動失敗？

```bash
# 刪除 node_modules 重新安裝
rm -rf node_modules
npm install
```

### Q: Firebase 連線失敗？

1. 確認 `.env` 檔案存在且格式正確
2. 確認所有變數都以 `VITE_` 開頭
3. 重新啟動開發伺服器

### Q: 無法登入？

- 確認 Firebase Authentication 已啟用 Google 登入
- 檢查瀏覽器 Console 的錯誤訊息
- 確認防火牆沒有阻擋 Firebase

### Q: Netlify 部署後網站空白？

1. 檢查 Netlify 的 Deploy log
2. 確認所有環境變數都已設定
3. 確認 `netlify.toml` 設定正確

---

## 📚 更多資源

- [完整 README](README.md)
- [環境變數詳細說明](ENV_SETUP.md)
- [Firebase 文件](https://firebase.google.com/docs)
- [Netlify 文件](https://docs.netlify.com/)

---

**需要協助？** 歡迎查看詳細文件或提出問題！

祝您使用愉快！ 🏃‍♂️🏃‍♀️



