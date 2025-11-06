# LINE Messaging API 申請與設定教學

> 📅 建立日期：2025-11-06  
> 🎯 目的：為跑步揪團平台新增 LINE 群組推播功能

## 📋 前置準備

- ✅ LINE Developers 帳號（您已經有了，因為有 LINE Login）
- ✅ 一個 LINE 群組（用於接收通知）
- ⏱️ 預計時間：10-15 分鐘

---

## 🚀 步驟 1：建立 LINE Messaging API Channel

### 1.1 登入 LINE Developers Console
🔗 https://developers.line.biz/console/

### 1.2 選擇您的 Provider
- 選擇現有的 Provider（與 LINE Login 相同的 Provider）
- 或建立新的 Provider（建議使用現有的）

### 1.3 建立新的 Channel
1. 點擊 **「Create a new channel」**
2. 選擇 **「Messaging API」**
3. 填寫以下資訊：

| 欄位 | 填寫內容 | 說明 |
|------|---------|------|
| **Channel type** | Messaging API | 自動選擇 |
| **Provider** | 選擇您的 Provider | 與 LINE Login 同一個 |
| **Channel icon** | 上傳圖片 | 機器人頭像（可選） |
| **Channel name** | 板橋跑團通知機器人 | 機器人名稱 |
| **Channel description** | 跑步活動通知推播 | 簡短描述 |
| **Category** | Sports & Recreation | 選擇分類 |
| **Subcategory** | Sports | 選擇子分類 |
| **Email address** | 您的 Email | 接收通知用 |

4. 勾選同意條款
5. 點擊 **「Create」**

---

## 🔑 步驟 2：取得 Channel Access Token

### 2.1 進入新建立的 Channel
1. 點擊剛建立的「板橋跑團通知機器人」
2. 進入 **「Messaging API」** 頁籤

### 2.2 發行 Channel Access Token
1. 找到 **「Channel access token (long-lived)」** 區塊
2. 點擊 **「Issue」** 按鈕
3. 複製產生的 Token（很長的字串）

```
範例格式：
eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ...（很長的字串）
```

⚠️ **重要：請妥善保管這個 Token，不要公開分享！**

### 2.3 取得 Channel Secret
1. 切換到 **「Basic settings」** 頁籤
2. 找到 **「Channel secret」**
3. 點擊 **「Show」** 並複製

```
範例格式：
c9e0f79dcb97d076096fb9bd89412b27
```

---

## 🤖 步驟 3：設定機器人

### 3.1 關閉自動回應訊息（重要！）
1. 在 **「Messaging API」** 頁籤
2. 找到 **「LINE Official Account features」** 區塊
3. 點擊 **「Edit」** 連結
4. 關閉以下功能：
   - ❌ **Auto-reply messages**（自動回應訊息）
   - ❌ **Greeting messages**（歡迎訊息）
   - ✅ **Webhooks**（保持開啟）

### 3.2 允許加入群組
1. 在 **「Messaging API」** 頁籤
2. 找到 **「Bot settings」**
3. 確認以下設定：
   - ✅ **Allow bot to join group chats** = Enabled
   - ✅ **Use webhooks** = Enabled

---

## 👥 步驟 4：將機器人加入 LINE 群組

### 4.1 取得機器人的 QR Code 或 LINE ID
1. 在 **「Messaging API」** 頁籤
2. 找到 **「Bot basic ID」** 或 **「QR code」**
3. 方法 A：掃描 QR Code 加為好友
4. 方法 B：搜尋 Bot basic ID（格式：@xxx）

### 4.2 將機器人加入群組
1. 打開您的 LINE 群組
2. 點擊右上角 **「≡」** → **「邀請」**
3. 搜尋並選擇剛加入的機器人
4. 確認邀請

✅ 機器人成功加入群組！

---

## 🆔 步驟 5：取得群組 ID

這一步比較技術性，有兩種方法：

### 方法 A：設定臨時 Webhook（簡單）

1. **回到 LINE Developers Console**
2. 在 **「Messaging API」** 頁籤找到 **「Webhook URL」**
3. 暫時設定為：`https://banqiaorun2025.netlify.app/.netlify/functions/line-webhook`
   （我們稍後會建立這個 Function）
4. 點擊 **「Verify」** 旁的 **「Use webhook」** = Enabled

### 方法 B：使用 LINE Bot SDK（進階）
等我們開發 Webhook Function 時，在群組中發送任意訊息，就能從 Log 中看到 Group ID。

---

## 📝 步驟 6：記錄重要資訊

請將以下資訊記錄下來（待會要設定到 Netlify 環境變數）：

```
✅ 需要記錄的資訊：

1. LINE_MESSAGING_CHANNEL_ACCESS_TOKEN
   = （您在步驟 2.2 取得的 Token）

2. LINE_MESSAGING_CHANNEL_SECRET
   = （您在步驟 2.3 取得的 Secret）

3. LINE_MESSAGING_CHANNEL_ID
   = （在 Basic settings 頁籤的 Channel ID，純數字）

4. LINE_GROUP_ID
   = （稍後透過 Webhook 取得，格式：Cxxxxx）
```

---

## ✅ 完成檢查清單

申請完成後，請確認：

- [ ] ✅ 已建立 Messaging API Channel
- [ ] ✅ 已取得 Channel Access Token
- [ ] ✅ 已取得 Channel Secret
- [ ] ✅ 已取得 Channel ID
- [ ] ✅ 已關閉自動回應訊息
- [ ] ✅ 機器人已加入 LINE 群組
- [ ] ✅ 已記錄所有重要資訊

---

## 🎯 下一步

完成申請後，請回覆我：

1. ✅ 已完成 LINE Messaging API 申請
2. 提供以下資訊（可以私密分享）：
   - Channel Access Token
   - Channel Secret
   - Channel ID

我會幫您：
1. 建立 Webhook Function 來取得群組 ID
2. 設定 Netlify 環境變數
3. 開發完整的推播功能

---

## 🆘 遇到問題？

### 問題 1：找不到建立 Channel 的按鈕
- 確認您已登入 LINE Developers Console
- 確認您有 Provider（沒有的話先建立）

### 問題 2：機器人加入群組後沒反應
- 確認 Webhook 已啟用
- 確認已關閉自動回應訊息

### 問題 3：Token 或 Secret 看不到
- Channel Access Token 需要先點擊「Issue」按鈕
- Channel Secret 需要點擊「Show」才會顯示

---

## 📚 相關資源

- [LINE Messaging API 官方文件](https://developers.line.biz/en/docs/messaging-api/)
- [LINE Developers Console](https://developers.line.biz/console/)
- [LINE Bot SDK](https://github.com/line/line-bot-sdk-nodejs)

---

**準備好後就可以開始開發了！** 🚀

