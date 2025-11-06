import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';

const CreateActivity = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    pace: '',
    distance: '',
    route: '',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('請先登入');
      return;
    }

    if (!formData.date || !formData.pace || !formData.distance) {
      alert('請填寫必填欄位（日期時間、配速、距離）');
      return;
    }

    setLoading(true);
    try {
      const activityDate = new Date(formData.date);
      
      // 取得目前最大的活動序號
      let nextActivityNumber = 1;
      try {
        const q = query(
          collection(db, 'activities'),
          orderBy('activityNumber', 'desc'),
          limit(1)
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const lastActivity = snapshot.docs[0].data();
          nextActivityNumber = (lastActivity.activityNumber || 0) + 1;
        }
      } catch (error) {
        console.log('取得序號失敗，使用預設值:', error);
      }
      
      // 建立活動
      const activityData = {
        activityNumber: nextActivityNumber,
        creatorId: user.uid,
        creatorName: user.displayName,
        creatorPhotoURL: user.photoURL || '',
        date: activityDate.toISOString(),
        pace: formData.pace,
        distance: formData.distance,
        route: formData.route,
        notes: formData.notes,
        participants: [],
        createdAt: serverTimestamp()
      };
      
      await addDoc(collection(db, 'activities'), activityData);

      // 發送 LINE 通知到群組
      try {
        const response = await fetch('/.netlify/functions/send-line-notification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            activity: {
              activityNumber: nextActivityNumber,
              creatorName: user.displayName,
              date: activityDate.toISOString(),
              pace: formData.pace,
              distance: formData.distance,
              route: formData.route,
              notes: formData.notes
            }
          })
        });

        const result = await response.json();
        
        if (result.success) {
          console.log('✅ LINE 通知已發送');
        } else {
          console.warn('⚠️ LINE 通知發送失敗:', result.error);
        }
      } catch (lineError) {
        console.error('❌ LINE 通知發送錯誤:', lineError);
        // 不影響活動建立，只記錄錯誤
      }

      alert(`活動建立成功！（活動序號 #${nextActivityNumber}）`);
      navigate('/');
    } catch (error) {
      console.error('建立活動失敗:', error);
      alert('建立活動失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <p className="text-xl text-gray-600 mb-4">請先登入才能發起活動</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <span className="text-3xl mr-2">➕</span>
          我要揪團
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 主揪人 */}
          <div>
            <label className="label">主揪人</label>
            <div className="flex items-center space-x-2 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
              {user.photoURL && (
                <img 
                  src={user.photoURL} 
                  alt={user.displayName}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <span className="font-medium">{user.displayName}</span>
            </div>
          </div>

          {/* 揪跑日期時間 */}
          <div>
            <label htmlFor="date" className="label">
              揪跑日期時間 <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>

          {/* 目標配速 */}
          <div>
            <label htmlFor="pace" className="label">
              目標配速 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="pace"
              name="pace"
              value={formData.pace}
              onChange={handleChange}
              placeholder="例如：5:30 或 6:00-6:30"
              required
              className="input-field"
            />
            <p className="text-xs text-gray-500 mt-1">格式範例：5:30 或 6:00-6:30</p>
          </div>

          {/* 目標距離 */}
          <div>
            <label htmlFor="distance" className="label">
              目標距離 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="distance"
              name="distance"
              value={formData.distance}
              onChange={handleChange}
              placeholder="例如：10K 或 半馬"
              required
              className="input-field"
            />
            <p className="text-xs text-gray-500 mt-1">格式範例：10K、15K、半馬、全馬</p>
          </div>

          {/* 路線規劃 */}
          <div>
            <label htmlFor="route" className="label">路線規劃</label>
            <textarea
              id="route"
              name="route"
              value={formData.route}
              onChange={handleChange}
              placeholder="描述跑步路線，例如起點、終點、路線說明等"
              rows="3"
              className="input-field resize-none"
            />
          </div>

          {/* 其他提醒 */}
          <div>
            <label htmlFor="notes" className="label">其他提醒</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="例如：天氣注意事項、攜帶物品、集合地點詳細說明等"
              rows="4"
              className="input-field resize-none"
            />
          </div>

          {/* 送出按鈕 */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 btn-secondary"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary"
            >
              {loading ? '建立中...' : '發起揪團'}
            </button>
          </div>
        </form>
      </div>

      {/* 提示資訊 */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <span className="font-medium">💡 提示：</span>
          發起活動後，您可以在「我的活動」頁面中管理和修改活動資訊。
        </p>
      </div>
    </div>
  );
};

export default CreateActivity;

