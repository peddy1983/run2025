// LINE Login Netlify Function
// 處理 LINE 授權碼交換 access token 並建立 Firebase 使用者

const axios = require('axios');
const admin = require('firebase-admin');

// 初始化 Firebase Admin（使用環境變數）
if (!admin.apps.length) {
  try {
    // 處理 Private Key：移除引號並正確處理換行符
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;
    
    // 移除可能的外層引號
    if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
      privateKey = privateKey.slice(1, -1);
    }
    
    // 替換 \n 字串為實際換行符
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
    // 解析請求 body
    const { code, redirectUri } = JSON.parse(event.body);

    if (!code) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: '缺少授權碼' })
      };
    }

    console.log('🔄 開始處理 LINE 登入...');
    console.log('授權碼:', code.substring(0, 10) + '...');

    // 步驟 1: 向 LINE 換取 access token
    const tokenResponse = await axios.post(
      'https://api.line.me/oauth2/v2.1/token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
        client_id: process.env.LINE_CHANNEL_ID,
        client_secret: process.env.LINE_CHANNEL_SECRET
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    const { access_token, id_token } = tokenResponse.data;
    console.log('✅ 成功取得 LINE access token');

    // 步驟 2: 使用 access token 取得使用者資料
    const profileResponse = await axios.get('https://api.line.me/v2/profile', {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });

    const lineUser = profileResponse.data;
    console.log('✅ 成功取得 LINE 使用者資料:', lineUser.displayName);

    // 步驟 3: 在 Firebase 建立或更新使用者
    const uid = `line_${lineUser.userId}`;
    
    try {
      // 嘗試取得現有使用者
      await admin.auth().getUser(uid);
      console.log('ℹ️ 使用者已存在，更新資料');
    } catch (error) {
      // 使用者不存在，建立新使用者
      if (error.code === 'auth/user-not-found') {
        await admin.auth().createUser({
          uid: uid,
          displayName: lineUser.displayName,
          photoURL: lineUser.pictureUrl || '',
          email: `${lineUser.userId}@line.user` // LINE 不一定提供 email
        });
        console.log('✅ 建立新使用者');
      } else {
        throw error;
      }
    }

    // 更新使用者資料
    await admin.auth().updateUser(uid, {
      displayName: lineUser.displayName,
      photoURL: lineUser.pictureUrl || ''
    });

    // 步驟 4: 建立 Firebase Custom Token
    const customToken = await admin.auth().createCustomToken(uid, {
      lineUserId: lineUser.userId,
      provider: 'line'
    });
    console.log('✅ 成功建立 Firebase Custom Token');

    // 步驟 5: 在 Firestore 儲存使用者資料
    const db = admin.firestore();
    await db.collection('users').doc(uid).set({
      displayName: lineUser.displayName,
      photoURL: lineUser.pictureUrl || '',
      email: `${lineUser.userId}@line.user`,
      lineUserId: lineUser.userId,
      provider: 'line',
      lastLogin: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    console.log('✅ 使用者資料已儲存到 Firestore');

    // 返回成功結果
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        customToken: customToken,
        user: {
          uid: uid,
          displayName: lineUser.displayName,
          photoURL: lineUser.pictureUrl || '',
          lineUserId: lineUser.userId
        }
      })
    };

  } catch (error) {
    console.error('❌ LINE 登入失敗:', error);
    
    let errorMessage = '登入失敗，請稍後再試';
    if (error.response) {
      console.error('錯誤詳情:', error.response.data);
      errorMessage = error.response.data.error_description || errorMessage;
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

