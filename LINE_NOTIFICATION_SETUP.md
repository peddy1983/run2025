# LINE 群組通知功能 - 環境變數設定與部署指南

> 📅 建立日期：2025-11-06  
> 🎯 功能：新增活動通知 + 每日定時通知

---

## 📋 功能說明

### ✅ 已完成的功能

1. **新增活動即時通知** 🔔
   - 當使用者在網站建立新活動時
   - 自動推播活動資訊到 LINE 群組
   - 包含日期、時間、配速、距離、路線等資訊

2. **每日定時活動通知** ⏰
   - 每天早上固定時間
   - 自動推播當天的活動列表
   - 如果當天沒有活動則不發送

3. **Webhook 接收器** 📨
   - 接收 LINE 平台的事件
   - 用於取得群組 ID
   - 記錄所有互動事件

---

## 🔧 已建立的 Netlify Functions

### 1. `line-webhook.js`
- **路徑**: `netlify/functions/line-webhook.js`
- **URL**: `https://banqiaorun2025.netlify.app/.netlify/functions/line-webhook`
- **用途**: 接收 LINE Webhook 事件，取得群組 ID
- **觸發**: LINE 平台自動調用

### 2. `send-line-notification.js`
- **路徑**: `netlify/functions/send-line-notification.js`
- **URL**: `https://banqiaorun2025.netlify.app/.netlify/functions/send-line-notification`
- **用途**: 發送活動通知到 LINE 群組
- **觸發**: 前端建立活動時調用

### 3. `scheduled-daily-notification.js`
- **路徑**: `netlify/functions/scheduled-daily-notification.js`
- **用途**: 每日定時推播當天活動
- **觸發**: Netlify Scheduled Functions（需手動設定排程）

---

## 🔐 環境變數設定

### 需要新增的環境變數（Netlify）

請到 Netlify Dashboard → Site settings → Environment variables 新增以下變數：

| 變數名稱 | 值 | 說明 |
|---------|---|------|
| `LINE_MESSAGING_CHANNEL_ACCESS_TOKEN` | `85Vr/88pWX8trE5gXauAXqkBIfHCwmi48ydDlOBjqwYCdECSUZZnUzb7Tt8LJUW1vhMaF7crbSXn1Ld0kdu9Vi7/vcoQxF9kr5uY3+XnTHcSpoB1QEHanwnf7AQUE/tT8ol0Fcf8pdsBnofLHHpy5AdB04t89/1O/w1cDnyilFU=` | LINE Bot Channel Access Token |
| `LINE_MESSAGING_CHANNEL_SECRET` | `a3aa83ddb7def561d684ee3f2aa7f11e` | LINE Bot Channel Secret |
| `LINE_MESSAGING_CHANNEL_ID` | `2008432643` | LINE Bot Channel ID |
| `LINE_GROUP_ID` | `（待取得）` | LINE 群組 ID（稍後設定） |

### 現有環境變數（保持不變）

以下是 Firebase 和 LINE Login 的環境變數，**請保持原樣，不要修改**：

```
✅ 前端變數（8個）：
- VITE_FIREBASE_API_KEY
- VITE_FIREBASE_AUTH_DOMAIN
- VITE_FIREBASE_PROJECT_ID
- VITE_FIREBASE_STORAGE_BUCKET
- VITE_FIREBASE_MESSAGING_SENDER_ID
- VITE_FIREBASE_APP_ID
- VITE_LINE_CHANNEL_ID
- VITE_LINE_CALLBACK_URL

✅ 後端變數（5個）：
- FIREBASE_PROJECT_ID
- FIREBASE_CLIENT_EMAIL
- FIREBASE_PRIVATE_KEY
- LINE_CHANNEL_ID
- LINE_CHANNEL_SECRET
```

---

## 🚀 部署步驟

### 步驟 1：設定 Netlify 環境變數

1. 登入 Netlify Dashboard
2. 選擇您的站點：**banqiaorun2025**
3. 進入 **Site settings** → **Environment variables**
4. 點擊 **Add a variable** 新增以下變數：

```
變數 1:
Key: LINE_MESSAGING_CHANNEL_ACCESS_TOKEN
Value: 85Vr/88pWX8trE5gXauAXqkBIfHCwmi48ydDlOBjqwYCdECSUZZnUzb7Tt8LJUW1vhMaF7crbSXn1Ld0kdu9Vi7/vcoQxF9kr5uY3+XnTHcSpoB1QEHanwnf7AQUE/tT8ol0Fcf8pdsBnofLHHpy5AdB04t89/1O/w1cDnyilFU=
Scopes: All scopes

變數 2:
Key: LINE_MESSAGING_CHANNEL_SECRET
Value: a3aa83ddb7def561d684ee3f2aa7f11e
Scopes: All scopes

變數 3:
Key: LINE_MESSAGING_CHANNEL_ID
Value: 2008432643
Scopes: All scopes

變數 4:（稍後設定）
Key: LINE_GROUP_ID
Value: （待取得）
Scopes: All scopes
```

### 步驟 2：推送程式碼到 GitHub

```bash
# 確認目前在 develop 分支
git checkout develop

# 查看修改的檔案
git status

# 加入所有修改
git add .

# 提交變更
git commit -m "feat: 新增 LINE 群組通知功能 - 新增活動通知 + 每日定時通知"

# 推送到 GitHub
git push origin develop
```

### 步驟 3：等待 Netlify 自動部署

1. 推送後，Netlify 會自動開始建置
2. 到 Netlify Dashboard → Deploys 查看進度
3. 等待建置完成（約 1-2 分鐘）
4. 確認狀態顯示 "Published"

---

## 🆔 取得 LINE 群組 ID

### 步驟 1：設定 Webhook URL

1. 回到 **LINE Developers Console**
2. 選擇您的 Messaging API Channel
3. 進入 **Messaging API** 頁籤
4. 找到 **Webhook settings** 區塊
5. 點擊 **Edit** 設定 Webhook URL：

```
https://banqiaorun2025.netlify.app/.netlify/functions/line-webhook
```

6. 點擊 **Verify** 驗證（應該會顯示成功）
7. 確認 **Use webhook** 已開啟（綠色）

### 步驟 2：機器人加入群組

1. 打開您的 LINE 應用程式
2. 在 LINE Developers Console 找到機器人的 QR Code
3. 掃描 QR Code 加機器人為好友
4. 將機器人邀請到您的跑團群組：
   - 進入群組
   - 點擊右上角「≡」
   - 選擇「邀請」
   - 搜尋並選擇您的機器人
   - 確認邀請

### 步驟 3：觸發事件取得群組 ID

1. 機器人加入群組後，在群組中發送任意訊息（例如：「測試」）
2. 到 Netlify Dashboard → Functions → line-webhook → Logs
3. 在 Log 中找到類似以下的訊息：

```
🎯 群組 ID: Cxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

4. 複製這個群組 ID

### 步驟 4：設定群組 ID 環境變數

1. 回到 Netlify Dashboard → Environment variables
2. 新增或更新 `LINE_GROUP_ID` 變數：

```
Key: LINE_GROUP_ID
Value: Cxxxxxxxxxxxxxxxxxxxxxxxxxxxxx（剛才取得的群組 ID）
Scopes: All scopes
```

3. 點擊 **Save**
4. 重新部署網站（Trigger deploy）

---

## ⏰ 設定每日定時通知

### 方法 A：使用 Netlify Scheduled Functions（推薦）

Netlify 支援在 `netlify.toml` 中設定 Scheduled Functions：

1. 更新 `netlify.toml` 檔案，新增：

```toml
[[functions]]
  name = "scheduled-daily-notification"
  schedule = "0 22 * * *"  # 每天早上 6:00 (UTC+8 = 22:00 UTC 前一天)
```

2. 推送到 GitHub 後 Netlify 會自動設定排程

**時區說明**：
- Netlify Scheduled Functions 使用 UTC 時間
- 台灣時區是 UTC+8
- 如果想要早上 6:00 推播 → 設定為 22:00 UTC (前一天)
- 如果想要早上 7:00 推播 → 設定為 23:00 UTC (前一天)
- 如果想要早上 8:00 推播 → 設定為 00:00 UTC

### 方法 B：使用外部 Cron Job 服務（備案）

如果 Netlify Scheduled Functions 不可用，可使用免費的 Cron Job 服務：

1. 註冊 https://cron-job.org/
2. 建立新的 Cron Job：
   - URL: `https://banqiaorun2025.netlify.app/.netlify/functions/scheduled-daily-notification`
   - Schedule: 每天早上 6:00 (台灣時間)
   - Method: GET
3. 啟用 Cron Job

---

## ✅ 測試功能

### 測試 1：新增活動通知

1. 登入網站：https://banqiaorun2025.netlify.app/
2. 點擊「我要揪團」建立新活動
3. 填寫活動資訊並提交
4. 檢查 LINE 群組是否收到通知
5. 通知內容應包含：
   - 活動序號
   - 日期時間
   - 配速、距離
   - 路線規劃（如有填寫）
   - 主揪人
   - 活動連結

### 測試 2：每日定時通知

#### 手動測試（不等排程）

可以手動觸發 Function 測試：

```bash
# 使用 curl 測試
curl -X POST https://banqiaorun2025.netlify.app/.netlify/functions/scheduled-daily-notification
```

或直接在瀏覽器訪問（會執行 Function）：
```
https://banqiaorun2025.netlify.app/.netlify/functions/scheduled-daily-notification
```

#### 自動測試（等排程）

1. 建立今天的活動（測試用）
2. 等待設定的時間（例如早上 6:00）
3. 檢查 LINE 群組是否收到每日通知
4. 通知內容應包含：
   - 今天日期
   - 所有今天的活動列表
   - 每個活動的詳細資訊
   - 活動連結

### 測試 3：查看 Function Logs

到 Netlify Dashboard → Functions 查看 Logs：

- **line-webhook**: 查看 Webhook 接收記錄
- **send-line-notification**: 查看即時通知發送記錄
- **scheduled-daily-notification**: 查看定時通知發送記錄

---

## 📊 功能運作流程

### 流程 1：新增活動通知

```
使用者建立活動
    ↓
前端調用 addDoc() 儲存到 Firestore
    ↓
前端調用 /.netlify/functions/send-line-notification
    ↓
Function 組合通知訊息
    ↓
Function 調用 LINE Messaging API 發送訊息
    ↓
LINE 推播訊息到群組
    ↓
群組成員收到通知 ✅
```

### 流程 2：每日定時通知

```
每天早上 6:00 (排程觸發)
    ↓
Netlify 執行 scheduled-daily-notification
    ↓
Function 查詢 Firestore 今天的活動
    ↓
如果有活動：組合通知訊息
    ↓
Function 調用 LINE Messaging API 發送訊息
    ↓
LINE 推播訊息到群組
    ↓
群組成員收到每日活動通知 ✅
```

---

## 🔍 疑難排解

### 問題 1：LINE 通知沒有發送

**可能原因**：
- ❌ 環境變數未設定或設定錯誤
- ❌ 群組 ID 不正確
- ❌ Channel Access Token 過期或無效

**解決方法**：
1. 檢查 Netlify 環境變數是否正確
2. 查看 Function Logs 確認錯誤訊息
3. 重新產生 Channel Access Token
4. 確認機器人已加入群組

### 問題 2：Webhook 驗證失敗

**可能原因**：
- ❌ Webhook URL 設定錯誤
- ❌ Function 尚未部署

**解決方法**：
1. 確認 URL 是否正確：`https://banqiaorun2025.netlify.app/.netlify/functions/line-webhook`
2. 確認 Netlify 已完成部署
3. 手動訪問 Function URL 測試是否可用
4. 檢查 LINE Channel Secret 是否正確

### 問題 3：定時通知沒有執行

**可能原因**：
- ❌ Scheduled Function 未正確設定
- ❌ netlify.toml 設定錯誤

**解決方法**：
1. 檢查 netlify.toml 的 schedule 語法
2. 確認時區計算正確（UTC vs 台灣時間）
3. 手動測試 Function 是否可用
4. 考慮使用外部 Cron Job 服務

### 問題 4：通知訊息格式錯誤

**可能原因**：
- ❌ 活動資料不完整
- ❌ 日期時間格式問題

**解決方法**：
1. 查看 Function Logs 確認錯誤
2. 檢查活動資料是否完整
3. 測試日期時間格式化邏輯

---

## 📝 後續優化建議

### 功能增強

1. **Rich Message 支援**
   - 使用 LINE Flex Message 建立更美觀的通知
   - 加入圖片、按鈕等互動元素

2. **個人化通知**
   - 根據使用者報名狀態發送個人化訊息
   - 活動前一天提醒已報名的使用者

3. **互動功能**
   - 支援在 LINE 中直接報名活動
   - 使用 Quick Reply 快速回覆

4. **統計功能**
   - 記錄通知發送狀態
   - 統計群組互動數據

### 管理功能

1. **通知開關**
   - 在網站後台控制通知開關
   - 設定靜音時段

2. **多群組支援**
   - 支援多個 LINE 群組
   - 不同群組接收不同類型的活動

3. **通知模板**
   - 自訂通知訊息模板
   - 支援多語言

---

## 📚 相關文件

- [LINE Messaging API 文件](https://developers.line.biz/en/docs/messaging-api/)
- [Netlify Functions 文件](https://docs.netlify.com/functions/overview/)
- [Netlify Scheduled Functions](https://docs.netlify.com/functions/scheduled-functions/)
- [Firebase Firestore 文件](https://firebase.google.com/docs/firestore)

---

## ✅ 檢查清單

部署完成後，請確認：

- [ ] ✅ 已設定所有 Netlify 環境變數（4 個新變數）
- [ ] ✅ 已推送程式碼到 GitHub
- [ ] ✅ Netlify 自動部署成功
- [ ] ✅ 已設定 LINE Webhook URL
- [ ] ✅ 機器人已加入 LINE 群組
- [ ] ✅ 已取得並設定群組 ID
- [ ] ✅ 已設定每日定時通知（排程或 Cron Job）
- [ ] ✅ 測試新增活動通知成功
- [ ] ✅ 測試每日定時通知成功

---

**🎉 完成後，您的 LINE 群組通知功能就完全運作了！**

有任何問題請參考疑難排解章節，或查看 Netlify Function Logs。

