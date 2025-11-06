# Netlify 環境變數完整清單

> 📅 更新日期：2025-11-06  
> 🎯 包含：Firebase + LINE Login + LINE Messaging API

---

## 📋 環境變數總覽

總共需要設定 **17 個環境變數**（原有 13 個 + 新增 4 個）

---

## 🔥 Firebase 相關（8 個）

### 前端變數（需要 VITE_ 前綴）

```bash
VITE_FIREBASE_API_KEY=（您的 Firebase API Key）
VITE_FIREBASE_AUTH_DOMAIN=run2025-7734c.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=run2025-7734c
VITE_FIREBASE_STORAGE_BUCKET=run2025-7734c.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=（您的 Sender ID）
VITE_FIREBASE_APP_ID=（您的 App ID）
```

### 後端變數（Functions 使用）

```bash
FIREBASE_PROJECT_ID=run2025-7734c
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@run2025-7734c.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

⚠️ **注意**：FIREBASE_PRIVATE_KEY 必須保留外層引號和 \n 字元

---

## 🔐 LINE Login 相關（2 個）

### 前端變數

```bash
VITE_LINE_CHANNEL_ID=2008428213
VITE_LINE_CALLBACK_URL=https://banqiaorun2025.netlify.app/auth/callback
```

### 後端變數

```bash
LINE_CHANNEL_ID=2008428213
LINE_CHANNEL_SECRET=c9e0f79dcb97d076096fb9bd89412b27
```

---

## 📱 LINE Messaging API 相關（4 個 - 新增）

### 後端變數

```bash
LINE_MESSAGING_CHANNEL_ACCESS_TOKEN=85Vr/88pWX8trE5gXauAXqkBIfHCwmi48ydDlOBjqwYCdECSUZZnUzb7Tt8LJUW1vhMaF7crbSXn1Ld0kdu9Vi7/vcoQxF9kr5uY3+XnTHcSpoB1QEHanwnf7AQUE/tT8ol0Fcf8pdsBnofLHHpy5AdB04t89/1O/w1cDnyilFU=

LINE_MESSAGING_CHANNEL_SECRET=a3aa83ddb7def561d684ee3f2aa7f11e

LINE_MESSAGING_CHANNEL_ID=2008432643

LINE_GROUP_ID=（機器人加入群組後取得，格式：Cxxxxx...）
```

---

## ⚙️ 其他設定（1 個）

```bash
SECRETS_SCAN_ENABLED=false
```

用途：關閉 Netlify 的敏感資訊掃描（因為 VITE_ 變數會出現在前端程式碼）

---

## 🚀 如何設定環境變數

### 方法 1：透過 Netlify Dashboard（推薦）

1. 登入 **Netlify Dashboard**
2. 選擇網站：**banqiaorun2025**
3. 進入 **Site settings** → **Environment variables**
4. 點擊 **Add a variable**
5. 輸入 Key 和 Value
6. Scopes 選擇 **All scopes**
7. 點擊 **Save**
8. 完成後點擊 **Trigger deploy** 重新部署

### 方法 2：透過 Netlify CLI

```bash
# 安裝 Netlify CLI
npm install -g netlify-cli

# 登入
netlify login

# 設定環境變數
netlify env:set VARIABLE_NAME "value" --context production
```

---

## ✅ 設定檢查清單

### Firebase 變數（8 個）
- [ ] VITE_FIREBASE_API_KEY
- [ ] VITE_FIREBASE_AUTH_DOMAIN
- [ ] VITE_FIREBASE_PROJECT_ID
- [ ] VITE_FIREBASE_STORAGE_BUCKET
- [ ] VITE_FIREBASE_MESSAGING_SENDER_ID
- [ ] VITE_FIREBASE_APP_ID
- [ ] FIREBASE_PROJECT_ID
- [ ] FIREBASE_CLIENT_EMAIL
- [ ] FIREBASE_PRIVATE_KEY

### LINE Login 變數（4 個）
- [ ] VITE_LINE_CHANNEL_ID
- [ ] VITE_LINE_CALLBACK_URL
- [ ] LINE_CHANNEL_ID
- [ ] LINE_CHANNEL_SECRET

### LINE Messaging 變數（4 個 - 新增）
- [ ] LINE_MESSAGING_CHANNEL_ACCESS_TOKEN
- [ ] LINE_MESSAGING_CHANNEL_SECRET
- [ ] LINE_MESSAGING_CHANNEL_ID
- [ ] LINE_GROUP_ID（機器人加入群組後設定）

### 其他設定（1 個）
- [ ] SECRETS_SCAN_ENABLED

---

## 🔍 變數用途說明

| 變數名稱 | 用途 | 使用位置 |
|---------|------|---------|
| VITE_* | 前端使用的變數 | React 應用程式 |
| FIREBASE_* | Firebase Admin SDK | Netlify Functions |
| LINE_CHANNEL_* | LINE Login 功能 | line-login.js |
| LINE_MESSAGING_* | LINE Bot 推播 | send-line-notification.js, scheduled-daily-notification.js |
| LINE_GROUP_ID | LINE 群組識別 | 推播訊息目標 |

---

## ⚠️ 安全注意事項

1. **絕不要將環境變數直接寫在程式碼中**
2. **不要將 .env 檔案推送到 GitHub**
3. **VITE_ 開頭的變數會出現在前端程式碼中（這是正常的）**
4. **定期更換敏感 Token（如 Channel Access Token）**
5. **妥善保管 FIREBASE_PRIVATE_KEY**

---

## 🆘 疑難排解

### 問題：環境變數更新後沒有生效

**解決方法**：
1. 確認已儲存變數
2. 點擊 **Trigger deploy** 重新部署
3. 等待部署完成（約 1-2 分鐘）
4. 清除瀏覽器快取

### 問題：FIREBASE_PRIVATE_KEY 格式錯誤

**正確格式**：
```
"-----BEGIN PRIVATE KEY-----\nMIIEvQIBA...\n-----END PRIVATE KEY-----\n"
```

**注意**：
- 外層必須有雙引號
- \n 是字串，不是實際換行
- 完整的 Key 字串（包含 BEGIN 和 END）

### 問題：LINE 通知沒有發送

**檢查項目**：
1. LINE_MESSAGING_CHANNEL_ACCESS_TOKEN 是否正確
2. LINE_GROUP_ID 是否已設定
3. 機器人是否已加入群組
4. 查看 Netlify Function Logs

---

## 📚 相關文件

- [Netlify 環境變數文件](https://docs.netlify.com/environment-variables/overview/)
- [Vite 環境變數文件](https://vitejs.dev/guide/env-and-mode.html)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [LINE Messaging API](https://developers.line.biz/en/docs/messaging-api/)

---

**✅ 設定完成後，請記得重新部署網站！**

