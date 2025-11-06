# 🚀 部署指南

## ✅ 部署資料夾已準備完成

`dist` 資料夾已經生成，包含所有必要的部署檔案！

---

## 📦 部署資料夾內容

```
dist/
├── index.html          # 主頁面
├── running-icon.svg    # 圖示
└── assets/            # 打包後的 CSS 和 JS
    ├── index-xxx.css
    └── index-xxx.js
```

---

## 🌐 部署到 Netlify（方法一：拖曳上傳）

### 步驟 1：登入 Netlify
前往：https://app.netlify.com/

### 步驟 2：拖曳上傳
1. 找到「**Sites**」頁面
2. 直接將整個 `dist` 資料夾**拖曳**到頁面中央的上傳區域
3. 等待上傳完成（約 10-30 秒）

### 步驟 3：取得網址
- 上傳完成後，Netlify 會自動給您一個網址
- 例如：`https://random-name-12345.netlify.app`

### 步驟 4：設定環境變數
1. 進入您的網站設定
2. 點擊「**Site configuration**」→「**Environment variables**」
3. 新增以下變數：

```
VITE_FIREBASE_API_KEY=AIzaSyCGUVokZQGbMLd0KIU1_22zWRh2TQA4GyM
VITE_FIREBASE_AUTH_DOMAIN=run2025-7734c.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=run2025-7734c
VITE_FIREBASE_STORAGE_BUCKET=run2025-7734c.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=184417306883
VITE_FIREBASE_APP_ID=1:184417306883:web:e9a58ab406a280ad4d8136
VITE_LINE_CHANNEL_ID=your-line-channel-id
VITE_LINE_CALLBACK_URL=https://您的網址.netlify.app/auth/callback
```

4. 儲存後，點擊「**Trigger deploy**」重新部署

---

## 🔗 部署到 Netlify（方法二：GitHub 連結）

### 步驟 1：上傳到 GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/您的帳號/您的專案.git
git push -u origin main
```

### 步驟 2：在 Netlify 連結 GitHub
1. 登入 Netlify
2. 點擊「**Add new site**」→「**Import an existing project**」
3. 選擇「**GitHub**」
4. 選擇您的專案
5. Build settings 會自動偵測：
   - Build command: `npm run build`
   - Publish directory: `dist`
6. 設定環境變數（同上方法一步驟 4）
7. 點擊「**Deploy site**」

---

## ⚠️ 重要：Firebase 授權網域設定

部署後，您需要在 Firebase Console 新增授權網域：

### 前往 Firebase Console
```
https://console.firebase.google.com/project/run2025-7734c/authentication/settings
```

### 新增授權網域
1. 在「**授權網域**」區塊
2. 點擊「**新增網域**」
3. 輸入您的 Netlify 網址（不含 https://）
   - 例如：`random-name-12345.netlify.app`
4. 儲存

---

## 🧪 測試 Google 登入

部署完成並設定好授權網域後：

1. 前往您的 Netlify 網址
2. 點擊「登入」
3. 選擇「使用 Google 登入」
4. 完成授權
5. 確認能成功登入

---

## 📱 測試功能清單

- [ ] Email/Password 註冊
- [ ] Email/Password 登入
- [ ] Google 登入（需先設定授權網域）
- [ ] 建立活動
- [ ] 加入活動
- [ ] 查看我的活動
- [ ] 週末日期顯示（六綠、日紅）
- [ ] 活動序號累進

---

## 🔄 更新部署

如果修改了程式碼，需要重新部署：

### 方法一（拖曳）
```bash
npm run build
```
然後重新拖曳 `dist` 資料夾到 Netlify

### 方法二（GitHub）
```bash
git add .
git commit -m "更新描述"
git push
```
Netlify 會自動重新部署

---

## 💡 提示

1. **第一次部署**建議使用「方法一：拖曳上傳」最快速
2. **長期維護**建議使用「方法二：GitHub 連結」方便管理
3. **環境變數**一定要設定，否則無法連接 Firebase
4. **授權網域**一定要新增，否則 Google 登入會失敗

---

## 📞 需要協助？

如果部署遇到問題，請檢查：
- [ ] Netlify 環境變數是否正確設定
- [ ] Firebase 授權網域是否已新增
- [ ] Netlify 部署狀態是否成功（沒有錯誤）

---

🎉 **部署資料夾已準備完成！現在可以上傳到 Netlify 了！**



