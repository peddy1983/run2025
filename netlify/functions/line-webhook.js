// LINE Webhook Function
// 接收 LINE 訊息事件，用於取得群組 ID 和處理訊息

const crypto = require('crypto');
const axios = require('axios');

// 發送 LINE 訊息的函數
async function sendLineMessage(replyToken, messages) {
  const accessToken = process.env.LINE_MESSAGING_CHANNEL_ACCESS_TOKEN;
  
  try {
    const response = await axios.post(
      'https://api.line.me/v2/bot/message/reply',
      {
        replyToken: replyToken,
        messages: messages
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
    
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(`LINE API 錯誤: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    }
    throw error;
  }
}

exports.handler = async (event, context) => {
  // 設定 CORS 標頭
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, X-Line-Signature',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // 處理 OPTIONS 請求（CORS preflight）
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // 只接受 POST 請求
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const body = event.body;
    const signature = event.headers['x-line-signature'];
    
    // 驗證 LINE Signature
    const channelSecret = process.env.LINE_MESSAGING_CHANNEL_SECRET;
    const hash = crypto
      .createHmac('SHA256', channelSecret)
      .update(body)
      .digest('base64');

    if (hash !== signature) {
      console.error('❌ Signature 驗證失敗');
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Invalid signature' })
      };
    }

    console.log('✅ Signature 驗證成功');

    // 解析事件資料
    const data = JSON.parse(body);
    const events = data.events || [];

    console.log('📨 收到事件數量:', events.length);

    // 處理每個事件
    for (const evt of events) {
      console.log('事件類型:', evt.type);
      console.log('來源類型:', evt.source.type);
      
      // 如果是群組訊息
      if (evt.source.type === 'group') {
        console.log('🎯 群組 ID:', evt.source.groupId);
        console.log('📝 請將此群組 ID 設定到環境變數 LINE_GROUP_ID');
      }
      
      // 如果是使用者訊息
      if (evt.source.type === 'user') {
        console.log('👤 使用者 ID:', evt.source.userId);
      }

      // 記錄訊息內容（如果有）
      if (evt.type === 'message' && evt.message.type === 'text') {
        console.log('💬 訊息內容:', evt.message.text);
      }

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
    }

    // 返回成功（LINE 要求返回 200）
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true })
    };

  } catch (error) {
    console.error('❌ Webhook 處理失敗:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};

