import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const { registerWithEmail, loginWithLine } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 驗證
    if (!formData.email || !formData.password || !formData.displayName) {
      setError('請填寫所有必填欄位');
      return;
    }

    if (formData.password.length < 6) {
      setError('密碼至少需要 6 個字元');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('兩次輸入的密碼不一致');
      return;
    }

    setLoading(true);
    const result = await registerWithEmail(formData.email, formData.password, formData.displayName);
    
    if (result.success) {
      alert('註冊成功！歡迎加入跑步揪團！');
      navigate('/');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">註冊新帳號</h1>
          <p className="text-gray-600">加入跑步揪團社群</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="label">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
                className="input-field"
              />
            </div>

            {/* 暱稱 */}
            <div>
              <label htmlFor="displayName" className="label">
                暱稱 <span className="text-red-500">*</span>
                <span className="text-sm text-gray-500 font-normal ml-2">
                  (請與 LINE ID 相同)
                </span>
              </label>
              <input
                type="text"
                id="displayName"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                placeholder="您的暱稱"
                required
                className="input-field"
              />
              <p className="text-xs text-gray-500 mt-1">
                💡 建議使用您的 LINE ID，方便其他跑友聯繫您
              </p>
            </div>

            {/* 密碼 */}
            <div>
              <label htmlFor="password" className="label">
                密碼 <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="至少 6 個字元"
                required
                minLength="6"
                className="input-field"
              />
            </div>

            {/* 確認密碼 */}
            <div>
              <label htmlFor="confirmPassword" className="label">
                確認密碼 <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="再次輸入密碼"
                required
                minLength="6"
                className="input-field"
              />
            </div>

            {/* 錯誤訊息 */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* 送出按鈕 */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? '註冊中...' : '註冊'}
            </button>
          </form>

          {/* 分隔線 */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">或使用以下方式註冊</span>
            </div>
          </div>

          {/* LINE 登入按鈕 */}
          <button
            type="button"
            onClick={loginWithLine}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-[#06C755] hover:bg-[#05b34b] text-white"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
              <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
            </svg>
            <span className="font-medium">使用 LINE 註冊</span>
          </button>

          {/* 登入連結 */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              已經有帳號了？{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                立即登入
              </Link>
            </p>
          </div>
        </div>

        {/* 提示資訊 */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-sm text-blue-800">
            <span className="font-medium">💡 提示：</span>
            註冊後即可發起揪團活動和參加其他跑友的活動！
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;



