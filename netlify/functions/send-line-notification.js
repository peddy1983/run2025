// 發送 LINE 推播通知 Function
// 用於新增活動時推播訊息到 LINE 群組

const axios = require('axios');

exports.handler = async (event, context) => {
  // 設定 CORS 標頭
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
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
    // 解析請求資料
    const { activity } = JSON.parse(event.body);

    if (!activity) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: '缺少活動資料' })
      };
    }

    console.log('📢 準備發送活動通知:', activity.activityNumber);

    // 取得環境變數
    const channelAccessToken = process.env.LINE_MESSAGING_CHANNEL_ACCESS_TOKEN;
    const groupId = process.env.LINE_GROUP_ID;

    if (!channelAccessToken) {
      throw new Error('缺少 LINE_MESSAGING_CHANNEL_ACCESS_TOKEN 環境變數');
    }

    if (!groupId) {
      throw new Error('缺少 LINE_GROUP_ID 環境變數');
    }

    // 格式化日期時間（確保使用台灣時區）
    const activityDate = new Date(activity.date);
    const dateStr = activityDate.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      weekday: 'short',
      timeZone: 'Asia/Taipei'
    });
    const timeStr = activityDate.toLocaleTimeString('zh-TW', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Taipei'
    });

    // 組合通知訊息
    let message = `🏃‍♂️ 新活動通知 #${activity.activityNumber}\n\n`;
    message += `📅 日期時間：${dateStr} ${timeStr}\n`;
    message += `⏱️ 目標配速：${activity.pace}\n`;
    message += `📏 目標距離：${activity.distance}\n`;
    
    if (activity.route) {
      message += `🗺️ 路線規劃：${activity.route}\n`;
    }
    
    if (activity.notes) {
      message += `📝 其他提醒：${activity.notes}\n`;
    }
    
    message += `\n👤 主揪人：${activity.creatorName}\n`;
    message += `\n🔗 立即報名：https://banqiaorun2025.netlify.app/`;

    // 發送 LINE 推播訊息
    const response = await axios.post(
      'https://api.line.me/v2/bot/message/push',
      {
        to: groupId,
        messages: [
          {
            type: 'text',
            text: message
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${channelAccessToken}`
        }
      }
    );

    console.log('✅ LINE 通知發送成功');
    console.log('回應狀態:', response.status);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'LINE 通知已發送',
        activityNumber: activity.activityNumber
      })
    };

  } catch (error) {
    console.error('❌ 發送 LINE 通知失敗:', error);
    
    let errorMessage = '發送通知失敗';
    if (error.response) {
      console.error('LINE API 錯誤:', error.response.data);
      errorMessage = error.response.data.message || errorMessage;
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: errorMessage,
        details: error.message
      })
    };
  }
};

