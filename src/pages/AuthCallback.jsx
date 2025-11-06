import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/config';
import { signInWithCustomToken } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleLineCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const savedState = sessionStorage.getItem('line_login_state');

      // 驗證 state
      if (!state || state !== savedState) {
        setError('驗證失敗：狀態不匹配');
        return;
      }

      if (!code) {
        setError('驗證失敗：缺少授權碼');
        return;
      }

      try {
        // 這裡需要後端 API 來處理 LINE 登入
        // 由於 Netlify 是靜態託管，您需要使用 Netlify Functions 或其他 serverless 服務
        // 暫時的解決方案：使用 Firebase Auth 的其他登入方式
        
        // TODO: 實作 LINE Login 的後端處理
        // 1. 用 code 向 LINE 換取 access token
        // 2. 用 access token 取得使用者資料
        // 3. 在 Firebase 中建立或更新使用者
        // 4. 用 Firebase Custom Token 登入
        
        alert('LINE Login 整合需要後端支援。目前請使用 Firebase 的其他登入方式。');
        navigate('/');
        
      } catch (error) {
        console.error('登入失敗:', error);
        setError('登入失敗，請稍後再試');
      } finally {
        sessionStorage.removeItem('line_login_state');
      }
    };

    handleLineCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">登入失敗</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            返回首頁
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
        <p className="text-gray-600">正在處理登入...</p>
      </div>
    </div>
  );
};

export default AuthCallback;



