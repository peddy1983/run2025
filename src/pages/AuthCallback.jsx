import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/config';
import { signInWithCustomToken } from 'firebase/auth';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleLineCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const savedState = sessionStorage.getItem('line_login_state');

      // 驗證 state
      if (!state || state !== savedState) {
        setError('驗證失敗：狀態不匹配');
        setLoading(false);
        return;
      }

      if (!code) {
        setError('驗證失敗：缺少授權碼');
        setLoading(false);
        return;
      }

      try {
        console.log('🔄 開始處理 LINE 登入回調...');
        
        // 步驟 1: 調用 Netlify Function 處理 LINE 登入
        const callbackUrl = sessionStorage.getItem('line_callback_url') || 
                           `${window.location.origin}/auth/callback`;
        
        const response = await fetch('/.netlify/functions/line-login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            code: code,
            redirectUri: callbackUrl
          })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || '登入失敗');
        }

        console.log('✅ 後端處理成功，取得 Custom Token');

        // 步驟 2: 使用 Custom Token 登入 Firebase
        await signInWithCustomToken(auth, data.customToken);
        console.log('✅ Firebase 登入成功:', data.user.displayName);

        // 清理 session storage
        sessionStorage.removeItem('line_login_state');
        sessionStorage.removeItem('line_callback_url');

        // 導向首頁
        console.log('🎉 LINE 登入完成，導向首頁');
        navigate('/');
        
      } catch (error) {
        console.error('❌ LINE 登入失敗:', error);
        setError(error.message || '登入失敗，請稍後再試');
        setLoading(false);
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



