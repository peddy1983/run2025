# LINE 機器人歡迎訊息設定教學

## 📝 功能說明

當 LINE 機器人被加入到群組時，會自動發送一則歡迎訊息，向群組成員介紹機器人的功能。

## ✨ 已實現功能

### 1. 自動偵測加入事件
- 當機器人被加入群組時，系統會自動偵測 `join` 事件
- 記錄新群組的 Group ID 到日誌中

### 2. 自動發送歡迎訊息
機器人會自動發送以下歡迎訊息：

```
🎉 大家好！我是板橋路跑小幫手！

我可以幫助大家：
✅ 查看最新的路跑活動
✅ 接收活動提醒通知
✅ 管理報名活動

歡迎大家一起來參加板橋路跑活動！💪🏃‍♂️
```

## 🔧 技術實作

### 更新內容

1. **新增 sendLineMessage 函數**
   - 使用 axios 發送 LINE Reply API 請求
   - 處理錯誤回應並記錄詳細資訊

2. **處理 join 事件**
   - 偵測機器人被加入群組
   - 使用 replyToken 立即回覆歡迎訊息
   - 錯誤處理：即使發送失敗也不影響 webhook 正常運作

### 程式碼位置

檔案：`netlify/functions/line-webhook.js`

關鍵程式碼：
```javascript
// 處理加入事件 - 發送歡迎訊息
if (evt.type === 'join') {
  console.log('🎉 機器人被加入群組');
  if (evt.source.type === 'group') {
    console.log('🎯 新群組 ID:', evt.source.groupId);
    
    // 發送歡迎訊息
    try {
      await sendLineMessage(evt.replyToken, [
        {
          type: 'text',
          text: '🎉 大家好！我是板橋路跑小幫手！\n\n' +
                '我可以幫助大家：\n' +
                '✅ 查看最新的路跑活動\n' +
                '✅ 接收活動提醒通知\n' +
                '✅ 管理報名活動\n\n' +
                '歡迎大家一起來參加板橋路跑活動！💪🏃‍♂️'
        }
      ]);
      console.log('✅ 歡迎訊息已發送');
    } catch (error) {
      console.error('❌ 發送歡迎訊息失敗:', error.message);
    }
  }
}
```

## 🚀 部署步驟

### 1. 確認環境變數

確保 Netlify 環境變數中已設定：

```
LINE_MESSAGING_CHANNEL_ACCESS_TOKEN=你的存取權杖
LINE_MESSAGING_CHANNEL_SECRET=你的頻道密鑰
```

### 2. 部署到 Netlify

```bash
# 提交變更
git add netlify/functions/line-webhook.js
git commit -m "新增 LINE 機器人歡迎訊息功能"
git push

# Netlify 會自動部署
```

### 3. 驗證 Webhook URL

確保 LINE Developers Console 中的 Webhook URL 設定正確：

```
https://你的網站.netlify.app/.netlify/functions/line-webhook
```

## 🧪 測試方法

### 方法一：實際測試（推薦）

1. 將機器人從現有群組中移除（如果已加入）
2. 重新將機器人加入群組
3. 確認機器人立即發送歡迎訊息

### 方法二：查看日誌

1. 前往 Netlify Dashboard
2. 選擇你的專案
3. 點選 "Functions" → "line-webhook"
4. 查看 "Function log" 確認執行狀態

應該看到類似以下的日誌：
```
✅ Signature 驗證成功
📨 收到事件數量: 1
事件類型: join
來源類型: group
🎉 機器人被加入群組
🎯 新群組 ID: Cxxxxxxxxxxxxxxxxxxxx
✅ 歡迎訊息已發送
```

## 🎨 自訂歡迎訊息

如果想要修改歡迎訊息內容，編輯 `netlify/functions/line-webhook.js` 檔案中第 121-126 行：

```javascript
text: '🎉 大家好！我是板橋路跑小幫手！\n\n' +
      '我可以幫助大家：\n' +
      '✅ 查看最新的路跑活動\n' +
      '✅ 接收活動提醒通知\n' +
      '✅ 管理報名活動\n\n' +
      '歡迎大家一起來參加板橋路跑活動！💪🏃‍♂️'
```

### 進階：使用 Flex Message

如果想要更豐富的視覺效果，可以使用 LINE Flex Message：

```javascript
await sendLineMessage(evt.replyToken, [
  {
    type: 'flex',
    altText: '歡迎加入板橋路跑！',
    contents: {
      type: 'bubble',
      hero: {
        type: 'image',
        url: 'https://你的圖片網址.jpg',
        size: 'full',
        aspectRatio: '20:13',
        aspectMode: 'cover'
      },
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: '歡迎加入！',
            weight: 'bold',
            size: 'xl'
          },
          {
            type: 'text',
            text: '我是板橋路跑小幫手',
            size: 'sm',
            color: '#999999',
            margin: 'md'
          }
        ]
      }
    }
  }
]);
```

## 📊 相關 LINE 事件類型

除了 `join` 事件，webhook 還可以處理其他事件：

| 事件類型 | 說明 | 觸發時機 |
|---------|------|---------|
| `join` | 機器人加入群組 | 被加入群組或多人聊天室 |
| `leave` | 機器人離開群組 | 被踢出或自行離開 |
| `memberJoined` | 成員加入 | 有新成員加入群組 |
| `memberLeft` | 成員離開 | 有成員離開群組 |
| `message` | 接收訊息 | 收到文字、圖片等訊息 |
| `postback` | Postback 事件 | 使用者點擊互動按鈕 |

## ⚠️ 注意事項

1. **replyToken 只能使用一次**
   - 每個事件的 replyToken 只能用來回覆一次
   - 如果需要發送多則訊息，請在 messages 陣列中一次傳送

2. **訊息數量限制**
   - 每次 reply 最多可以發送 5 則訊息

3. **replyToken 有效期限**
   - replyToken 的有效期限為事件發生後的 1 分鐘
   - 超過時間就無法回覆

4. **Push vs Reply**
   - Reply API：使用 replyToken，免費
   - Push API：需要知道 userId 或 groupId，會計入收費訊息數

## 🔍 故障排除

### 問題：機器人沒有發送歡迎訊息

**可能原因 1：環境變數未設定**
- 檢查 `LINE_MESSAGING_CHANNEL_ACCESS_TOKEN` 是否正確

**可能原因 2：Webhook URL 未驗證**
- 前往 LINE Developers Console 驗證 Webhook URL

**可能原因 3：程式碼未部署**
- 確認 git push 成功且 Netlify 已完成部署

**可能原因 4：權限設定**
- 確認 LINE Bot 已開啟「Use webhooks」
- 確認「Join Group or Multi-person Chat」權限已啟用

### 問題：收到錯誤訊息

檢查 Netlify Function Log，常見錯誤：

- `401 Unauthorized`：Access Token 錯誤
- `400 Bad Request`：訊息格式錯誤
- `Invalid signature`：Channel Secret 錯誤

## 📚 參考資源

- [LINE Messaging API 文件](https://developers.line.biz/en/docs/messaging-api/)
- [Webhook 事件物件](https://developers.line.biz/en/reference/messaging-api/#webhook-event-objects)
- [Reply Message API](https://developers.line.biz/en/reference/messaging-api/#send-reply-message)
- [Flex Message Simulator](https://developers.line.biz/flex-simulator/)

## 🎯 下一步

完成歡迎訊息設定後，你可以：

1. 新增更多互動功能（如回應特定關鍵字）
2. 加入圖文選單（Rich Menu）
3. 實作更多自動回覆功能
4. 整合資料庫記錄群組資訊

---

**版本**：v1.0  
**最後更新**：2025-11-06  
**作者**：板橋路跑系統開發團隊

