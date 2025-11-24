import { useState } from 'react';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase/config';

const ActivityCard = ({ activity, onUpdate, showFullDate = false, showLineNotify = false }) => {
  const { user } = useAuth();
  const [showParticipants, setShowParticipants] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifying, setNotifying] = useState(false);

  const isParticipating = user && activity.participants?.some(p => p.uid === user.uid);
  const isCreator = user && activity.creatorId === user.uid;
  const isPastActivity = new Date(activity.date) < new Date(); // 判斷是否為過去的活動

  const handleJoin = async () => {
    if (!user) {
      alert('請先登入才能參加活動');
      return;
    }

    if (isParticipating) {
      // 取消參加
      if (!confirm('確定要取消參加嗎？')) return;
    }

    setLoading(true);
    try {
      const activityRef = doc(db, 'activities', activity.id);
      
      if (isParticipating) {
        // 找到當前用戶在參與者列表中的資料
        const myParticipant = activity.participants.find(p => p.uid === user.uid);
        
        if (myParticipant) {
          // 使用找到的完全相同的物件來移除
          await updateDoc(activityRef, {
            participants: arrayRemove(myParticipant)
          });
          console.log('✅ 取消參加成功');
        } else {
          // 如果找不到，直接用當前用戶資料重建參與者列表
          const newParticipants = activity.participants.filter(p => p.uid !== user.uid);
          await updateDoc(activityRef, {
            participants: newParticipants
          });
          console.log('✅ 取消參加成功（使用備用方法）');
        }
      } else {
        // 確保 displayName 有值
        const displayName = user.displayName || user.email?.split('@')[0] || '跑者';
        
        // 新增參加者
        await updateDoc(activityRef, {
          participants: arrayUnion({
            uid: user.uid,
            displayName: displayName,
            photoURL: user.photoURL || ''
          })
        });
        console.log('✅ 加入成功');
      }
      
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('操作失敗詳細錯誤:', error);
      console.error('錯誤代碼:', error.code);
      console.error('錯誤訊息:', error.message);
      
      // 根據錯誤類型提供更明確的訊息
      if (error.code === 'permission-denied') {
        alert('❌ 權限不足\n\n請確認：\n1. 已正確登入\n2. Firestore 規則已正確設定');
      } else if (error.code === 'not-found') {
        alert('❌ 找不到此活動\n\n活動可能已被刪除');
      } else {
        alert(`❌ 操作失敗\n\n錯誤：${error.message}\n\n請稍後再試或聯繫管理員`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLineNotify = async () => {
    if (!confirm('確定要推播此活動到 LINE 群組嗎？')) {
      return;
    }

    setNotifying(true);
    try {
      const response = await fetch('/.netlify/functions/send-line-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          activity: {
            activityNumber: activity.activityNumber || activity.runNumber,
            creatorName: activity.creatorName,
            date: activity.date,
            pace: activity.pace,
            distance: activity.distance,
            route: activity.route,
            notes: activity.notes
          }
        })
      });

      const result = await response.json();

      if (response.ok) {
        alert('✅ LINE 通知已發送！');
      } else {
        throw new Error(result.error || '發送失敗');
      }
    } catch (error) {
      console.error('❌ 發送 LINE 通知失敗:', error);
      alert(`❌ 推播失敗\n\n${error.message}\n\n請稍後再試`);
    } finally {
      setNotifying(false);
    }
  };

  return (
    <div className="card hover:shadow-lg transition-shadow">
      {/* 標題列 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold text-primary-600">
            揪團場次 #{activity.activityNumber || activity.runNumber}
          </span>
          {showFullDate ? (
            <span className="text-gray-600">
              {format(new Date(activity.date), 'MM/dd(E) HH:mm', { locale: undefined })}
            </span>
          ) : (
            <span className="text-gray-600">
              {format(new Date(activity.date), 'HH:mm')}
            </span>
          )}
        </div>
        {isCreator && (
          <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
            我發起的
          </span>
        )}
      </div>

      {/* 主揪人 */}
      <div className="flex items-center space-x-2 mb-3">
        {activity.creatorPhotoURL && (
          <img 
            src={activity.creatorPhotoURL} 
            alt={activity.creatorName}
            className="w-6 h-6 rounded-full"
          />
        )}
        <span className="text-sm text-gray-600">
          主揪：<span className="font-medium text-gray-900">{activity.creatorName}</span>
        </span>
      </div>

      {/* 活動資訊 */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 text-sm">
            <span>⚡</span>
            <span className="text-gray-600">配速：</span>
            <span className="font-medium">{activity.pace}</span>
          </div>
          <button
            onClick={() => setShowParticipants(!showParticipants)}
            className="flex items-center space-x-1 text-sm hover:text-primary-600 transition-colors"
          >
            <span>👥</span>
            <span className="text-gray-600">參加人數：</span>
            <span className="font-medium text-primary-600">
              {activity.participants?.length || 0}
              {activity.maxParticipants && `/${activity.maxParticipants}`}
            </span>
            <svg 
              className={`w-4 h-4 transition-transform ${showParticipants ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        
        <div className="flex items-center space-x-1 text-sm">
          <span>📏</span>
          <span className="text-gray-600">距離：</span>
          <span className="font-medium">{activity.distance}</span>
        </div>
        
        {activity.route && (
          <div className="flex items-start space-x-1 text-sm">
            <span className="mt-0.5">🗺️</span>
            <div className="flex-1">
              <span className="text-gray-600">路線：</span>
              <p className="text-gray-900 whitespace-pre-wrap">{activity.route}</p>
            </div>
          </div>
        )}
        
        {activity.notes && (
          <div className="flex items-start space-x-1 text-sm">
            <span className="mt-0.5">💡</span>
            <div className="flex-1">
              <span className="text-gray-600">其他提醒：</span>
              <p className="text-gray-900 whitespace-pre-wrap">{activity.notes}</p>
            </div>
          </div>
        )}
      </div>

      {/* 參加者列表（可展開） */}
      {showParticipants && activity.participants && activity.participants.length > 0 && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-sm font-medium text-gray-700 mb-2">參加者名單</div>
          <div className="space-y-2">
            {activity.participants.map((participant, index) => (
              <div key={index} className="flex items-center space-x-2">
                {participant.photoURL && (
                  <img 
                    src={participant.photoURL} 
                    alt={participant.displayName}
                    className="w-6 h-6 rounded-full"
                  />
                )}
                <span className="text-sm text-gray-900">{participant.displayName}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 操作按鈕 */}
      <div className="flex space-x-2">
        {isPastActivity ? (
          <div className="flex-1 py-2 text-center text-sm text-gray-500 bg-gray-100 border border-gray-200 rounded-lg">
            ⏰ 活動已結束
          </div>
        ) : !isCreator ? (
          <button
            onClick={handleJoin}
            disabled={loading}
            className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
              isParticipating
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                : 'bg-primary-600 text-white hover:bg-primary-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? '處理中...' : isParticipating ? '✓ 已參加' : '加入'}
          </button>
        ) : (
          <span className="flex-1 py-2 text-center text-sm text-gray-500 border border-gray-200 rounded-lg">
            這是您發起的活動
          </span>
        )}
        
        {/* LINE 推播按鈕（只給建立者使用） */}
        {showLineNotify && isCreator && (
          <button
            onClick={handleLineNotify}
            disabled={notifying}
            className="py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
            title="推播活動到 LINE 群組"
          >
            {notifying ? (
              <>
                <span className="animate-spin">⏳</span>
                <span>推播中...</span>
              </>
            ) : (
              <>
                <span>📢</span>
                <span>LINE通知</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default ActivityCard;

