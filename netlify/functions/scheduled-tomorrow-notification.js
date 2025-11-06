// 明日活動通知 Function
// 每天晚上推播明天的活動列表到 LINE 群組

const axios = require('axios');
const admin = require('firebase-admin');

// 初始化 Firebase Admin（使用環境變數）
if (!admin.apps.length) {
  try {
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;
    
    if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
      privateKey = privateKey.slice(1, -1);
    }
    
    privateKey = privateKey.replace(/\\n/g, '\n');
    
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey
      })
    });
    console.log('✅ Firebase Admin 初始化成功');
  } catch (error) {
    console.error('❌ Firebase Admin 初始化失敗:', error);
  }
}

exports.handler = async (event, context) => {
  console.log('⏰ 開始執行明日活動通知...');

  try {
    // 取得環境變數
    const channelAccessToken = process.env.LINE_MESSAGING_CHANNEL_ACCESS_TOKEN;
    const groupId = process.env.LINE_GROUP_ID;

    if (!channelAccessToken) {
      throw new Error('缺少 LINE_MESSAGING_CHANNEL_ACCESS_TOKEN 環境變數');
    }

    if (!groupId) {
      throw new Error('缺少 LINE_GROUP_ID 環境變數');
    }

    // 取得明天的日期範圍（00:00 ~ 23:59）
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

    console.log('📅 查詢日期:', tomorrow.toLocaleDateString('zh-TW'));

    // 查詢 Firestore 明天的活動
    const db = admin.firestore();
    const snapshot = await db.collection('activities')
      .where('date', '>=', tomorrow.toISOString())
      .where('date', '<', dayAfterTomorrow.toISOString())
      .orderBy('date', 'asc')
      .get();

    console.log('📊 找到活動數量:', snapshot.size);

    // 如果沒有活動，不發送通知
    if (snapshot.empty) {
      console.log('ℹ️ 明天沒有活動，不發送通知');
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          message: '明天沒有活動'
        })
      };
    }

    // 組合通知訊息
    let message = `🌙 明日跑步活動預告\n`;
    message += `📅 ${tomorrow.toLocaleDateString('zh-TW', { month: 'long', day: 'numeric', weekday: 'short' })}\n`;
    message += `━━━━━━━━━━━━━━━━\n\n`;

    const activities = [];
    snapshot.forEach(doc => {
      const activity = doc.data();
      activities.push({
        id: doc.id,
        ...activity
      });
    });

    // 格式化每個活動
    activities.forEach((activity, index) => {
      const activityDate = new Date(activity.date);
      const timeStr = activityDate.toLocaleTimeString('zh-TW', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Asia/Taipei'
      });

      message += `${index + 1}️⃣ 活動 #${activity.activityNumber}\n`;
      message += `⏰ 時間：${timeStr}\n`;
      message += `⏱️ 配速：${activity.pace}\n`;
      message += `📏 距離：${activity.distance}\n`;
      message += `👤 主揪：${activity.creatorName}\n`;
      
      if (activity.route) {
        message += `🗺️ 路線：${activity.route}\n`;
      }
      
      message += `\n`;
    });

    message += `━━━━━━━━━━━━━━━━\n`;
    message += `💪 提前準備，明天見！\n`;
    message += `🔗 https://banqiaorun2025.netlify.app/`;

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

    console.log('✅ 明日通知發送成功');
    console.log('活動數量:', activities.length);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: '明日通知已發送',
        activitiesCount: activities.length
      })
    };

  } catch (error) {
    console.error('❌ 明日通知發送失敗:', error);
    
    let errorMessage = '發送通知失敗';
    if (error.response) {
      console.error('LINE API 錯誤:', error.response.data);
      errorMessage = error.response.data.message || errorMessage;
    }

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: errorMessage,
        details: error.message
      })
    };
  }
};

