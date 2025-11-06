# Cron Job 設定教學 - 每日活動通知

> 📅 建立日期：2025-11-06  
> 🎯 目的：設定兩個定時推播通知
> 🔗 服務：cron-job.org（免費）

---

## 📋 需要設定的兩個通知

### 1️⃣ 今日活動通知 🌅
- **時間**：每天早上 06:00
- **內容**：推播今天的活動列表
- **Function URL**：
  ```
  https://banqiaorun2025.netlify.app/.netlify/functions/scheduled-daily-notification
  ```

### 2️⃣ 明日活動通知 🌙
- **時間**：每天晚上 20:00
- **內容**：推播明天的活動預告
- **Function URL**：
  ```
  https://banqiaorun2025.netlify.app/.netlify/functions/scheduled-tomorrow-notification
  ```

---

## 🚀 完整設定步驟

### 步驟 1：登入 cron-job.org

1. 前往：https://cron-job.org/
2. 點擊右上角 **「Login」**
3. 輸入您的帳號密碼登入

---

### 步驟 2：建立第一個 Cron Job（今日活動通知）

#### 2.1 進入建立頁面

1. 登入後，點擊 **「Cronjobs」** 頁籤
2. 點擊右上角綠色按鈕 **「Create cronjob」**

#### 2.2 填寫基本資訊

**Title（標題）**：
```
跑團今日活動通知
```

**Address（網址）**：
```
https://banqiaorun2025.netlify.app/.netlify/functions/scheduled-daily-notification
```

#### 2.3 設定執行時間

**Schedule（排程）**：

- 點擊 **「Every day」**（每天）
- Time（時間）：選擇 **06:00**
- Timezone（時區）：搜尋並選擇 **「Asia/Taipei」**

或使用 Cron 表達式：
```
0 6 * * *
```

#### 2.4 進階設定（可選）

展開 **「Advanced」** 區塊：

- **Request method**：GET（預設）
- **Request timeout**：30 seconds
- **Retry on failure**：✅ 勾選
- **Number of retries**：3

#### 2.5 通知設定（可選）

展開 **「Notifications」** 區塊：

- **On failure**：✅ 勾選（失敗時寄信通知）
- **On success**：❌ 不勾選（成功不通知，避免太多信件）

#### 2.6 儲存

點擊底部綠色按鈕 **「Create cronjob」**

✅ **完成！第一個 Cron Job 已建立！**

---

### 步驟 3：建立第二個 Cron Job（明日活動通知）

#### 3.1 再次建立新的 Cron Job

點擊右上角 **「Create cronjob」**

#### 3.2 填寫基本資訊

**Title（標題）**：
```
跑團明日活動預告
```

**Address（網址）**：
```
https://banqiaorun2025.netlify.app/.netlify/functions/scheduled-tomorrow-notification
```

#### 3.3 設定執行時間

**Schedule（排程）**：

- 點擊 **「Every day」**（每天）
- Time（時間）：選擇 **20:00**（晚上 8 點）
- Timezone（時區）：搜尋並選擇 **「Asia/Taipei」**

或使用 Cron 表達式：
```
0 20 * * *
```

#### 3.4 進階設定（可選）

與第一個相同：
- Request method：GET
- Request timeout：30 seconds
- Retry on failure：✅ 勾選

#### 3.5 儲存

點擊 **「Create cronjob」**

✅ **完成！兩個 Cron Job 都已建立！**

---

## 📊 確認設定

### 檢查 Cronjobs 列表

在 **「Cronjobs」** 頁面應該看到兩個項目：

```
✅ 跑團今日活動通知
   URL: .../scheduled-daily-notification
   Schedule: Every day at 06:00 Asia/Taipei
   Status: Enabled

✅ 跑團明日活動預告
   URL: .../scheduled-tomorrow-notification
   Schedule: Every day at 20:00 Asia/Taipei
   Status: Enabled
```

---

## 🧪 立即測試（不等排程）

### 測試今日活動通知

1. 在 Cronjobs 列表找到「跑團今日活動通知」
2. 點擊右側的 **「▶ Run」** 按鈕
3. 立即執行一次
4. 檢查 LINE 群組是否收到通知

### 測試明日活動通知

1. 在 Cronjobs 列表找到「跑團明日活動預告」
2. 點擊右側的 **「▶ Run」** 按鈕
3. 立即執行一次
4. 檢查 LINE 群組是否收到通知

---

## 📝 通知訊息格式

### 今日活動通知（早上 6:00）

```
🌅 早安！今天的跑步活動
📅 11月7日 (四)
━━━━━━━━━━━━━━━━

1️⃣ 活動 #123
⏰ 時間：06:00
⏱️ 配速：5:30
📏 距離：10K
👤 主揪：王小明
🗺️ 路線：河濱公園

━━━━━━━━━━━━━━━━
💪 一起來跑步吧！
🔗 https://banqiaorun2025.netlify.app/
```

### 明日活動通知（晚上 8:00）

```
🌙 明日跑步活動預告
📅 11月8日 (五)
━━━━━━━━━━━━━━━━

1️⃣ 活動 #124
⏰ 時間：06:00
⏱️ 配速：6:00
📏 距離：5K
👤 主揪：李小華

━━━━━━━━━━━━━━━━
💪 提前準備，明天見！
🔗 https://banqiaorun2025.netlify.app/
```

---

## 📈 查看執行歷史

### 檢視執行記錄

1. 點擊 Cronjob 名稱
2. 進入詳細頁面
3. 查看 **「Execution history」**
4. 可以看到：
   - 執行時間
   - 執行結果（Success / Failed）
   - HTTP 狀態碼
   - 回應內容

### 查看 Netlify Function Logs

如果需要更詳細的日誌：

1. 登入 Netlify Dashboard
2. 進入 **Functions** 頁籤
3. 點擊對應的 Function
4. 查看 **Logs**

---

## ⚙️ 調整執行時間

### 修改通知時間

如果想要調整時間（例如改成早上 5:30）：

1. 在 Cronjobs 列表點擊 Cronjob 名稱
2. 點擊右上角 **「Edit」**
3. 修改 Schedule 時間
4. 點擊 **「Save changes」**

### 常見時間設定

**早晨通知選項**：
- 05:00 - 很早的晨跑
- 05:30 - 早晨晨跑
- 06:00 - 一般晨跑（推薦）
- 06:30 - 稍晚晨跑

**晚間通知選項**：
- 19:00 - 晚餐前
- 20:00 - 晚餐後（推薦）
- 21:00 - 睡前
- 22:00 - 睡前最後提醒

---

## 🔧 管理 Cronjobs

### 暫停 Cronjob

如果需要暫時停止通知：

1. 點擊 Cronjob 進入詳細頁面
2. 點擊 **「Disable」** 按鈕
3. Cronjob 會暫停執行

### 重新啟用

1. 點擊 **「Enable」** 按鈕
2. Cronjob 恢復執行

### 刪除 Cronjob

如果不再需要：

1. 點擊 Cronjob 進入詳細頁面
2. 點擊 **「Delete」** 按鈕
3. 確認刪除

---

## 📊 監控和維護

### 每週檢查

建議每週檢查一次：

- ✅ Cronjobs 是否正常執行
- ✅ 執行歷史中有無錯誤
- ✅ LINE 群組是否正常收到通知

### 常見問題排查

**問題 1：沒有收到通知**

檢查項目：
1. Cronjob 是否 Enabled
2. 時區設定是否正確（Asia/Taipei）
3. Function URL 是否正確
4. Netlify Function Logs 是否有錯誤
5. 當天/明天是否真的有活動

**問題 2：通知內容錯誤**

可能原因：
1. 活動資料不完整
2. 時區計算錯誤
3. 查看 Netlify Function Logs 確認問題

**問題 3：通知重複發送**

可能原因：
1. 重複建立了相同的 Cronjob
2. 檢查 Cronjobs 列表，刪除重複的

---

## 💰 費用說明

### cron-job.org 免費方案

**免費額度**：
- ✅ 無限制的 Cronjobs
- ✅ 每分鐘最多 1 次執行
- ✅ 完全夠用

**付費方案（如需要）**：
- 更高頻率執行
- 更多進階功能
- 但對於我們的需求，免費方案已足夠

---

## ✅ 設定完成檢查清單

請確認以下所有項目：

### Netlify 部署
- [ ] 新的 Function 已部署（scheduled-tomorrow-notification）
- [ ] 部署狀態為 Published
- [ ] 兩個 Function URL 都可以訪問

### cron-job.org 設定
- [ ] 已建立「跑團今日活動通知」Cronjob
- [ ] 已建立「跑團明日活動預告」Cronjob
- [ ] 兩個 Cronjob 都是 Enabled 狀態
- [ ] 時區設定為 Asia/Taipei
- [ ] 已測試執行並收到通知

### LINE 群組
- [ ] 機器人已加入群組
- [ ] LINE_GROUP_ID 環境變數已設定
- [ ] 可以正常收到通知

---

## 🎉 完成！

設定完成後，您的跑團將會：

- 🌅 **每天早上 6:00** 自動推播今天的活動
- 🌙 **每天晚上 8:00** 自動推播明天的活動預告

讓跑友們不會錯過任何一場跑步活動！🏃‍♂️

---

## 📚 相關文件

- [cron-job.org 官方文件](https://cron-job.org/en/documentation/)
- [Netlify Functions 文件](https://docs.netlify.com/functions/overview/)
- [LINE Messaging API 文件](https://developers.line.biz/en/docs/messaging-api/)

---

**有任何問題隨時查看這份文件！** 📖

