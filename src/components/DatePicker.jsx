import { useState, useRef, useEffect } from 'react';
import { format, addDays, isSameDay, startOfDay } from 'date-fns';

const DatePicker = ({ selectedDate, onDateChange, activities = [] }) => {
  const [displayStartIndex, setDisplayStartIndex] = useState(0);
  const scrollContainerRef = useRef(null);
  
  // 生成日期陣列（今天往後 30 天）
  const generateDates = () => {
    const dates = [];
    const today = startOfDay(new Date());
    for (let i = 0; i < 30; i++) {
      dates.push(addDays(today, i));
    }
    return dates;
  };

  const dates = generateDates();
  const today = startOfDay(new Date());

  // 顯示的日期（7個）
  const visibleDates = dates.slice(displayStartIndex, displayStartIndex + 7);

  const handlePrevious = () => {
    if (displayStartIndex > 0) {
      setDisplayStartIndex(displayStartIndex - 1);
    }
  };

  const handleNext = () => {
    if (displayStartIndex < dates.length - 7) {
      setDisplayStartIndex(displayStartIndex + 1);
    }
  };

  const getDateLabel = (date) => {
    if (isSameDay(date, today)) {
      return '今天';
    }
    return format(date, 'MM/dd');
  };

  const getWeekdayLabel = (date) => {
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    return `星期${weekdays[date.getDay()]}`;
  };

  // 判斷是否為週末
  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // 0=星期日, 6=星期六
  };

  const isSaturday = (date) => date.getDay() === 6;
  const isSunday = (date) => date.getDay() === 0;

  // 檢查某個日期是否有活動
  const hasActivities = (date) => {
    return activities.some(activity => 
      isSameDay(new Date(activity.date), date)
    );
  };

  return (
    <div className="bg-white shadow-md sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* 當前選擇的日期顯示 */}
        <div className="text-center mb-4">
          <div className="text-lg font-medium text-gray-900">
            {format(selectedDate, 'yyyy/MM/dd')} {getWeekdayLabel(selectedDate)}
          </div>
        </div>

        {/* 日期選擇器 */}
        <div className="flex items-center space-x-2">
          {/* 左箭頭 */}
          <button
            onClick={handlePrevious}
            disabled={displayStartIndex === 0}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* 日期格子 */}
          <div 
            ref={scrollContainerRef}
            className="flex-1 flex space-x-2 overflow-x-auto scrollbar-hide"
            style={{ scrollBehavior: 'smooth' }}
          >
            {visibleDates.map((date, index) => {
              const isSelected = isSameDay(date, selectedDate);
              const isToday = isSameDay(date, today);
              const saturday = isSaturday(date);
              const sunday = isSunday(date);
              const hasActivity = hasActivities(date);
              
              return (
                <button
                  key={index}
                  onClick={() => onDateChange(date)}
                  className={`relative flex-1 min-w-[70px] py-3 px-2 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'bg-primary-600 border-primary-600 text-white shadow-md'
                      : isToday
                      ? 'bg-primary-50 border-primary-300 text-primary-700'
                      : sunday
                      ? 'bg-red-50 border-red-200 text-red-700 hover:border-red-300'
                      : saturday
                      ? 'bg-green-50 border-green-200 text-green-700 hover:border-green-300'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-primary-300'
                  } ${hasActivity ? 'ring-2 ring-primary-400 ring-offset-1' : ''}`}
                >
                  {/* 有活動的指示器 */}
                  {hasActivity && (
                    <div className="absolute top-1 right-1">
                      <span className="text-lg animate-bounce">🏃</span>
                    </div>
                  )}
                  
                  {/* 日期顯示 */}
                  <div className="flex flex-col items-center">
                    <div className={`text-xs ${isSelected ? 'text-white' : 'text-gray-500'}`}>
                      {format(date, 'MM/dd')}
                    </div>
                    <div className={`text-xs mt-0.5 ${isSelected ? 'text-white' : sunday ? 'text-red-600' : saturday ? 'text-green-600' : 'text-gray-700'}`}>
                      {getWeekdayLabel(date).replace('星期', '')}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* 右箭頭 */}
          <button
            onClick={handleNext}
            disabled={displayStartIndex >= dates.length - 7}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DatePicker;

