import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, orderBy, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';
import ActivityCard from '../components/ActivityCard';

const MyActivities = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myCreatedActivities, setMyCreatedActivities] = useState([]);
  const [myJoinedActivities, setMyJoinedActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('created'); // 'created' or 'joined'

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    // 監聽我創建的活動
    const createdQuery = query(
      collection(db, 'activities'),
      where('creatorId', '==', user.uid)
    );

    const unsubscribeCreated = onSnapshot(
      createdQuery, 
      (snapshot) => {
        const activities = [];
        snapshot.forEach((doc) => {
          activities.push({
            id: doc.id,
            ...doc.data()
          });
        });
        // 在客戶端排序
        activities.sort((a, b) => new Date(b.date) - new Date(a.date));
        setMyCreatedActivities(activities);
        setLoading(false);
      },
      (error) => {
        console.error('取得我創建的活動失敗:', error);
        setLoading(false);
      }
    );

    // 監聽所有活動，篩選出我參加的
    const allActivitiesQuery = query(collection(db, 'activities'));

    const unsubscribeJoined = onSnapshot(
      allActivitiesQuery, 
      (snapshot) => {
        const activities = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          // 篩選出有我參加的活動（但不包含我創建的）
          if (data.participants?.some(p => p.uid === user.uid) && data.creatorId !== user.uid) {
            activities.push({
              id: doc.id,
              ...data
            });
          }
        });
        // 在客戶端排序
        activities.sort((a, b) => new Date(b.date) - new Date(a.date));
        setMyJoinedActivities(activities);
      },
      (error) => {
        console.error('取得我參加的活動失敗:', error);
      }
    );

    return () => {
      unsubscribeCreated();
      unsubscribeJoined();
    };
  }, [user, navigate]);

  const handleDelete = async (activityId) => {
    if (!confirm('確定要刪除這個活動嗎？此操作無法復原。')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'activities', activityId));
      alert('活動已刪除');
    } catch (error) {
      console.error('刪除失敗:', error);
      alert('刪除失敗，請稍後再試');
    }
  };

  const handleEdit = (activityId) => {
    // 導向編輯頁面
    navigate(`/edit-activity/${activityId}`);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* 頁面標題 */}
        <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <span className="text-3xl mr-2">📋</span>
          我的活動
        </h1>

        {/* 分頁切換 */}
        <div className="flex space-x-2 mb-6 bg-white rounded-lg p-1 shadow-sm">
          <button
            onClick={() => setActiveTab('created')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              activeTab === 'created'
                ? 'bg-primary-600 text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            我發起的 ({myCreatedActivities.length})
          </button>
          <button
            onClick={() => setActiveTab('joined')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              activeTab === 'joined'
                ? 'bg-primary-600 text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            我參加的 ({myJoinedActivities.length})
          </button>
        </div>

        {/* 活動列表 */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">載入中...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeTab === 'created' ? (
              myCreatedActivities.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                  <div className="text-6xl mb-4">📝</div>
                  <p className="text-gray-600 text-lg">您還沒有發起任何活動</p>
                  <button
                    onClick={() => navigate('/create')}
                    className="mt-4 btn-primary inline-block"
                  >
                    立即發起揪團
                  </button>
                </div>
              ) : (
                myCreatedActivities.map((activity) => (
                  <div key={activity.id}>
                    <ActivityCard activity={activity} />
                    <div className="flex space-x-2 mt-2">
                      <button
                        onClick={() => handleEdit(activity.id)}
                        className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                      >
                        ✏️ 編輯
                      </button>
                      <button
                        onClick={() => handleDelete(activity.id)}
                        className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                      >
                        🗑️ 刪除
                      </button>
                    </div>
                  </div>
                ))
              )
            ) : (
              myJoinedActivities.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                  <div className="text-6xl mb-4">🏃</div>
                  <p className="text-gray-600 text-lg">您還沒有參加任何活動</p>
                  <button
                    onClick={() => navigate('/')}
                    className="mt-4 btn-primary inline-block"
                  >
                    瀏覽活動
                  </button>
                </div>
              ) : (
                myJoinedActivities.map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyActivities;

