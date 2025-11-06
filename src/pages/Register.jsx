import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const { registerWithEmail } = useAuth();
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



