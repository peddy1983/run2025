import { useState, useEffect } from 'react';
import { startOfDay, endOfDay } from 'date-fns';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import DatePicker from '../components/DatePicker';
import ActivityCard from '../components/ActivityCard';

const Home = () => {
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
  const [activities, setActivities] = useState([]);
  const [allActivities, setAllActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('date'); // 'date' 或 'all'

  // 監聽所有未來活動（用於日期選擇器顯示）
  useEffect(() => {
    const today = startOfDay(new Date());
    
    const q = query(
      collection(db, 'activities'),
      where('date', '>=', today.toISOString()),
      orderBy('date', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const activitiesData = [];
      snapshot.forEach((doc) => {
        activitiesData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      setAllActivities(activitiesData);
    });

    return () => unsubscribe();
  }, []);

  // 監聽當前選定日期的活動
  useEffect(() => {
    const startDate = startOfDay(selectedDate);
    const endDate = endOfDay(selectedDate);

    // 從 allActivities 中篩選當天的活動
    const todayActivities = allActivities.filter(activity => {
      const activityDate = new Date(activity.date);
      return activityDate >= startDate && activityDate <= endDate;
    });
    
    setActivities(todayActivities);
    setLoading(false);
  }, [selectedDate, allActivities]);

  const handleDateChange = (newDate) => {
    setSelectedDate(startOfDay(newDate));
    setLoading(true);
  };

  // 顯示的活動列表（根據視圖模式）
  const displayActivities = viewMode === 'all' ? allActivities : activities;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 視圖切換按鈕 */}
      <div className="bg-white shadow-sm sticky top-16 z-30 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('date')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                viewMode === 'date'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              📅 按日期查看
            </button>
            <button
              onClick={() => setViewMode('all')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                viewMode === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              📋 全部活動
            </button>
          </div>
        </div>
      </div>

      {/* 日期選擇器（只在按日期查看時顯示） */}
      {viewMode === 'date' && (
        <DatePicker 
          selectedDate={selectedDate} 
          onDateChange={handleDateChange}
          activities={allActivities}
        />
      )}

      {/* 活動列表 */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* 全部活動模式的提示 */}
        {viewMode === 'all' && (
          <div className="mb-4 text-center">
            <h2 className="text-xl font-bold text-gray-900">未來所有活動</h2>
            <p className="text-sm text-gray-500 mt-1">
              共 {allActivities.length} 個活動
            </p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">載入中...</p>
          </div>
        ) : displayActivities.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏃</div>
            <p className="text-gray-600 text-lg">
              {viewMode === 'all' ? '目前沒有任何活動' : '這天還沒有活動'}
            </p>
            <p className="text-gray-500 text-sm mt-2">快來發起第一個揪團吧！</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayActivities.map((activity) => (
              <ActivityCard 
                key={activity.id} 
                activity={activity}
                showFullDate={viewMode === 'all'}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

