import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { auth, db } from '../firebase/config';
import { 
  onAuthStateChanged, 
  signOut as firebaseSignOut, 
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth 必須在 AuthProvider 內使用');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 儲存使用者資料到 Firestore（使用 useCallback 確保引用穩定）
  const saveUserToFirestore = useCallback(async (user) => {
    try {
      console.log('🔄 儲存使用者資料到 Firestore...');
      await setDoc(doc(db, 'users', user.uid), {
        displayName: user.displayName,
        photoURL: user.photoURL,
        email: user.email,
        lastLogin: serverTimestamp()
      }, { merge: true });
      console.log('✅ 使用者資料已儲存到 Firestore');
      return true;
    } catch (firestoreError) {
      console.error('⚠️ 儲存到 Firestore 失敗（但登入仍然成功）:', firestoreError);
      console.error('錯誤詳情:', firestoreError.code, firestoreError.message);
      return false;
    }
  }, []);

  // Email/Password 註冊
  const registerWithEmail = async (email, password, displayName) => {
    try {
      console.log('🔄 開始 Email 註冊流程...');
      const result = await createUserWithEmailAndPassword(auth, email, password);
      console.log('✅ Email 註冊成功:', result.user.email);
      
      // 儲存使用者資料到 Firestore（包含暱稱）
      try {
        await setDoc(doc(db, 'users', result.user.uid), {
          displayName: displayName || email.split('@')[0],
          email: result.user.email,
          photoURL: '',
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp()
        });
        console.log('✅ 使用者資料已儲存');
      } catch (firestoreError) {
        console.error('⚠️ Firestore 儲存失敗:', firestoreError);
      }
      
      return { success: true };
    } catch (error) {
      console.error('❌ Email 註冊失敗:', error);
      let errorMessage = '註冊失敗';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = '此 Email 已被註冊';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email 格式不正確';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = '密碼強度不足（至少需要 6 個字元）';
      }
      return { success: false, error: errorMessage };
    }
  };

  // Email/Password 登入
  const loginWithEmail = async (email, password) => {
    try {
      console.log('🔄 開始 Email 登入流程...');
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Email 登入成功:', result.user.email);
      
      // 更新最後登入時間
      try {
        await setDoc(doc(db, 'users', result.user.uid), {
          lastLogin: serverTimestamp()
        }, { merge: true });
      } catch (firestoreError) {
        console.error('⚠️ 更新登入時間失敗:', firestoreError);
      }
      
      return { success: true };
    } catch (error) {
      console.error('❌ Email 登入失敗:', error);
      let errorMessage = '登入失敗';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMessage = 'Email 或密碼錯誤';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email 格式不正確';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = '嘗試次數過多，請稍後再試';
      }
      return { success: false, error: errorMessage };
    }
  };

  // Google 登入 - 使用重新導向方式（部署後測試）
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    
    try {
      console.log('🔄 開始 Google 登入流程（使用重新導向方式）...');
      await signInWithRedirect(auth, provider);
      console.log('🔄 正在導向 Google 登入頁面...');
    } catch (error) {
      console.error('❌ 啟動登入失敗:', error);
      alert('啟動登入失敗：' + (error.message || '請稍後再試'));
    }
  };

  // LINE Login
  const loginWithLine = () => {
    const lineChannelId = import.meta.env.VITE_LINE_CHANNEL_ID;
    const callbackUrl = import.meta.env.VITE_LINE_CALLBACK_URL || 
                        `${window.location.origin}/auth/callback`;
    
    if (!lineChannelId || lineChannelId === 'your-line-channel-id') {
      alert('LINE Login 尚未設定完成\n\n請確認 .env 檔案中的 VITE_LINE_CHANNEL_ID 已設定');
      return;
    }
    
    const state = Math.random().toString(36).substring(7);
    
    // 儲存 state 和 callback URL 用於驗證
    sessionStorage.setItem('line_login_state', state);
    sessionStorage.setItem('line_callback_url', callbackUrl);
    
    // 導向 LINE 登入頁面
    const lineAuthUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${lineChannelId}&redirect_uri=${encodeURIComponent(callbackUrl)}&state=${state}&scope=profile%20openid%20email`;
    
    console.log('🔄 導向 LINE 登入頁面...');
    window.location.href = lineAuthUrl;
  };

  // 登出
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
    } catch (error) {
      console.error('登出失敗:', error);
    }
  };

  // 監聽認證狀態
  useEffect(() => {
    let isProcessingRedirect = false;
    
    // 檢查是否有重新導向的登入結果
    const checkRedirectResult = async () => {
      if (isProcessingRedirect) {
        console.log('⏭️ 已經在處理重新導向結果，跳過');
        return;
      }
      
      try {
        isProcessingRedirect = true;
        console.log('🔍 檢查重新導向登入結果...');
        const result = await getRedirectResult(auth);
        if (result) {
          console.log('✅ Google 登入成功（重新導向）:', result.user.email);
          console.log('👤 使用者資料:', {
            uid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName
          });
          // 嘗試儲存使用者資料到 Firestore（但不依賴它）
          saveUserToFirestore(result.user).catch(err => {
            console.warn('⚠️ Firestore 儲存失敗，但不影響登入:', err.message);
          });
        } else {
          console.log('ℹ️ 沒有重新導向登入結果');
        }
      } catch (error) {
        console.error('❌ 處理重新導向結果失敗:', error);
        console.error('錯誤代碼:', error.code);
        console.error('錯誤訊息:', error.message);
        if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
          alert('登入失敗：' + (error.message || '請稍後再試'));
        }
      } finally {
        isProcessingRedirect = false;
      }
    };
    
    checkRedirectResult();
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        console.log('✅ Firebase Authentication 使用者已登入:', firebaseUser.email);
        console.log('📝 設定使用者狀態...');
        
        // 直接使用 Auth 資料設定使用者（不依賴 Firestore）
        const userData = {
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName || firebaseUser.email,
          photoURL: firebaseUser.photoURL || '',
          email: firebaseUser.email
        };
        
        setUser(userData);
        console.log('✅ 使用者狀態已設定:', userData.email);
        
        // 在背景嘗試與 Firestore 同步（但不影響登入）
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            console.log('✅ 從 Firestore 更新使用者資料');
            setUser({
              uid: firebaseUser.uid,
              ...userDoc.data()
            });
          } else {
            console.log('ℹ️ Firestore 中沒有使用者資料，嘗試儲存...');
            await saveUserToFirestore(firebaseUser);
          }
        } catch (error) {
          console.warn('⚠️ Firestore 操作失敗（不影響登入）:', error.message);
        }
      } else {
        console.log('ℹ️ 使用者未登入');
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [saveUserToFirestore]);

  const value = {
    user,
    loading,
    registerWithEmail,
    loginWithEmail,
    loginWithGoogle,
    loginWithLine,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

