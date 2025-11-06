# 跑步揪團平台 🏃

一個讓跑步愛好者輕鬆發起和參加跑步活動的社群平台。

## 功能特色

- 📱 **手機優先設計** - 針對行動裝置優化的使用體驗
- 🔐 **LINE 登入整合** - 方便快速的身份驗證
- 📅 **日期選擇器** - 直覺的橫向滑動日期選擇
- 🏃 **活動管理** - 發起、參加、編輯和刪除跑步活動
- 👥 **參加者管理** - 查看活動參加者名單
- ⚡ **即時更新** - Firebase Firestore 即時同步資料

## 技術棧

- **前端框架**: React 18 + Vite
- **樣式**: Tailwind CSS
- **路由**: React Router v6
- **後端服務**: Firebase (Authentication + Firestore)
- **登入整合**: LINE Login API
- **日期處理**: date-fns
- **部署**: Netlify

## 開始使用

### 1. 安裝依賴

\`\`\`bash
npm install
\`\`\`

### 2. 設定環境變數

複製 \`.env.example\` 並重新命名為 \`.env\`，然後填入以下資訊：

\`\`\`env
# Firebase 設定（從 Firebase Console 取得）
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id

# LINE Login 設定（從 LINE Developers Console 取得）
VITE_LINE_CHANNEL_ID=your-line-channel-id
VITE_LINE_CALLBACK_URL=https://your-domain.netlify.app/auth/callback
\`\`\`

### 3. Firebase 設定

1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 建立新專案
3. 啟用以下服務：
   - **Authentication** → 啟用 Email/Password 或 Google 登入
   - **Firestore Database** → 建立資料庫（選擇「測試模式」開始）
4. 在專案設定中找到 Firebase Config，複製到 \`.env\`

#### Firestore 安全規則

在 Firebase Console → Firestore Database → 規則，設定以下規則：

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 活動集合
    match /activities/{activityId} {
      // 所有人都可以讀取
      allow read: if true;
      
      // 只有登入使用者可以建立
      allow create: if request.auth != null;
      
      // 只有活動建立者可以更新和刪除
      allow update, delete: if request.auth != null && 
        request.auth.uid == resource.data.creatorId;
    }
    
    // 使用者集合
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
\`\`\`

### 4. LINE Login 設定

1. 前往 [LINE Developers Console](https://developers.line.biz/)
2. 建立 Provider 和 LINE Login Channel
3. 設定 Callback URL：
   - 開發：\`http://localhost:3000/auth/callback\`
   - 正式：\`https://your-domain.netlify.app/auth/callback\`
4. 複製 Channel ID 到 \`.env\`

**注意**: LINE Login 完整整合需要後端 API 支援。目前程式碼中提供了基本架構，您可以：
- 使用 Netlify Functions 建立 serverless API
- 或先使用 Firebase 的其他登入方式（Google、Email）

### 5. 啟動開發伺服器

\`\`\`bash
npm run dev
\`\`\`

網站會在 http://localhost:3000 啟動

## 部署到 Netlify

### 方式一：透過 Git 部署（推薦）

1. 將程式碼推送到 GitHub
2. 登入 [Netlify](https://www.netlify.com/)
3. 點擊「Add new site」→「Import an existing project」
4. 選擇您的 GitHub repository
5. 設定建置設定：
   - **Build command**: \`npm run build\`
   - **Publish directory**: \`dist\`
6. 新增環境變數（Environment variables）：
   - 將 \`.env\` 中的所有變數新增到 Netlify
7. 點擊「Deploy site」

### 方式二：手動部署

\`\`\`bash
# 建置專案
npm run build

# 安裝 Netlify CLI（如果還沒安裝）
npm install -g netlify-cli

# 登入 Netlify
netlify login

# 部署
netlify deploy --prod --dir=dist
\`\`\`

### 部署後設定

1. **更新 LINE Login Callback URL**
   - 在 LINE Developers Console 更新 Callback URL 為您的 Netlify 網址
   - 例如：\`https://your-app.netlify.app/auth/callback\`

2. **更新環境變數**
   - 在 Netlify 的 Site settings → Environment variables
   - 更新 \`VITE_LINE_CALLBACK_URL\` 為正式網址

3. **設定自訂網域（選用）**
   - 在 Netlify 的 Domain settings 可設定自訂網域

## 專案結構

\`\`\`
run/
├── src/
│   ├── components/          # React 組件
│   │   ├── Navbar.jsx      # 導航列
│   │   ├── DatePicker.jsx  # 日期選擇器
│   │   └── ActivityCard.jsx # 活動卡片
│   ├── pages/              # 頁面
│   │   ├── Home.jsx        # 首頁（活動列表）
│   │   ├── CreateActivity.jsx # 發起揪團
│   │   ├── MyActivities.jsx   # 我的活動
│   │   └── AuthCallback.jsx   # LINE 登入回調
│   ├── contexts/           # React Context
│   │   └── AuthContext.jsx # 認證狀態管理
│   ├── firebase/           # Firebase 設定
│   │   └── config.js
│   ├── App.jsx            # 主應用程式
│   ├── main.jsx           # 入口檔案
│   └── index.css          # 全域樣式
├── public/                # 靜態資源
├── index.html            # HTML 模板
├── package.json          # 專案依賴
├── vite.config.js        # Vite 設定
├── tailwind.config.js    # Tailwind 設定
└── README.md            # 說明文件
\`\`\`

## 功能說明

### 首頁
- 橫向滑動日期選擇器
- 顯示選定日期的活動列表
- 點擊活動卡片的參加人數可展開/收合參加者名單
- 未登入使用者可瀏覽活動

### 我要揪團
- 需登入才能訪問
- 填寫活動資訊（日期、時間、配速、距離、路線、提醒）
- 自動帶入主揪人資訊

### 我的活動
- 需登入才能訪問
- **我發起的**：可編輯和刪除自己的活動
- **我參加的**：顯示已參加的活動，可取消參加

## 疑難排解

### Firebase 連線錯誤
- 確認 \`.env\` 中的 Firebase 設定正確
- 確認 Firebase 專案已啟用 Firestore 和 Authentication

### LINE Login 無法使用
- 確認 Callback URL 設定正確
- 確認 Channel ID 正確
- LINE Login 需要 HTTPS（本地開發可用 HTTP）
- 完整功能需要後端 API 支援

### 部署後無法運作
- 確認 Netlify 環境變數已正確設定
- 檢查瀏覽器 Console 是否有錯誤訊息
- 確認 Firebase 安全規則已正確設定

## 開發建議

### 後續可以新增的功能
- 🔔 活動提醒通知（使用 LINE Messaging API）
- 📍 地圖整合（Google Maps）
- 💬 活動留言功能
- ⭐ 評分和回饋系統
- 📊 個人跑步統計
- 🏆 成就系統
- 👥 好友系統
- 🔍 活動搜尋和篩選

### 效能優化
- 使用 React.memo 減少不必要的重新渲染
- 實作虛擬滾動（活動列表很長時）
- 圖片 lazy loading
- 使用 Service Worker 實作離線功能

## 授權

MIT License

## 聯絡資訊

如有問題或建議，歡迎聯繫開發者。

---

**祝您跑步愉快！** 🏃‍♂️🏃‍♀️
\`\`\`



