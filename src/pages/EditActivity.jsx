import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';

const EditActivity = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activity, setActivity] = useState(null);
  
  const [formData, setFormData] = useState({
    date: '',
    pace: '',
    distance: '',
    route: '',
    notes: ''
  });

  useEffect(() => {
    const loadActivity = async () => {
      if (!user) {
        navigate('/');
        return;
      }

      try {
        const docRef = doc(db, 'activities', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          
          // 檢查是否為活動創建者
          if (data.creatorId !== user.uid) {
            alert('❌ 您沒有權限編輯此活動');
            navigate('/my-activities');
            return;
          }

          setActivity(data);
          
          // 將日期轉換為 datetime-local 格式
          const activityDate = new Date(data.date);
          const formattedDate = format(activityDate, "yyyy-MM-dd'T'HH:mm");
          
          setFormData({
            date: formattedDate,
            pace: data.pace || '',
            distance: data.distance || '',
            route: data.route || '',
            notes: data.notes || ''
          });
        } else {
          alert('❌ 找不到此活動');
          navigate('/my-activities');
        }
      } catch (error) {
        console.error('載入活動失敗:', error);
        alert('❌ 載入活動失敗');
        navigate('/my-activities');
      } finally {
        setLoading(false);
      }
    };

    loadActivity();
  }, [id, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.date || !formData.pace || !formData.distance) {
      alert('請填寫必填欄位（日期時間、配速、距離）');
      return;
    }

    setSaving(true);
    try {
      const activityDate = new Date(formData.date);
      
      const docRef = doc(db, 'activities', id);
      await updateDoc(docRef, {
        date: activityDate.toISOString(),
        pace: formData.pace,
        distance: formData.distance,
        route: formData.route,
        notes: formData.notes
      });

      alert('✅ 活動已更新！');
      navigate('/my-activities');
    } catch (error) {
      console.error('更新活動失敗:', error);
      
      if (error.code === 'permission-denied') {
        alert('❌ 權限不足\n\n請確認 Firestore 規則已正確設定');
      } else {
        alert(`❌ 更新失敗\n\n錯誤：${error.message}`);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">載入中...</p>
        </div>
      </div>
    );
  }

  if (!user || !activity) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <span className="text-3xl mr-2">✏️</span>
          編輯活動
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 活動序號 */}
          <div>
            <label className="label">揪團場次</label>
            <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
              <span className="font-bold text-primary-600">
                #{activity.activityNumber || activity.runNumber}
              </span>
            </div>
          </div>

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

          {/* 參加人數資訊 */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">👥</span>
              <span className="text-sm text-blue-800">
                目前參加人數：
                <span className="font-bold text-lg ml-1">
                  {activity.participants?.length || 0}
                </span> 人
              </span>
            </div>
          </div>

          {/* 送出按鈕 */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/my-activities')}
              className="flex-1 btn-secondary"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 btn-primary"
            >
              {saving ? '儲存中...' : '💾 儲存變更'}
            </button>
          </div>
        </form>
      </div>

      {/* 提示資訊 */}
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <p className="text-sm text-yellow-800">
          <span className="font-medium">⚠️ 注意：</span>
          編輯活動會影響所有已參加的成員。建議重大變更時通知參加者。
        </p>
      </div>
    </div>
  );
};

export default EditActivity;


