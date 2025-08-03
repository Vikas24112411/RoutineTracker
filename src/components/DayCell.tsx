import React, { useState, useCallback, memo } from 'react';
import type { DateInfo } from '../utils/dateUtils';

interface DayCellProps {
  dayInfo: DateInfo;
  routineColor: string;
  onToggle: (date: Date) => void;
}

export const DayCell: React.FC<DayCellProps> = memo(({
  dayInfo,
  routineColor,
  onToggle,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = useCallback(() => {
    if (dayInfo.isCurrentMonth) {
      setIsAnimating(true);
      onToggle(dayInfo.date);
      
      // Reset animation after a short delay
      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    }
  }, [dayInfo.isCurrentMonth, dayInfo.date, onToggle]);

  return (
    <button
      onClick={handleClick}
      disabled={!dayInfo.isCurrentMonth}
      className={`
        calendar-day
        ${dayInfo.isCurrentMonth 
          ? 'hover:scale-110 cursor-pointer' 
          : 'cursor-default'
        }
        ${dayInfo.isToday ? 'ring-2 ring-purple-400 ring-offset-2' : ''}
        ${dayInfo.isCompleted 
          ? 'text-white shadow-lg border-2 border-white/30' 
          : dayInfo.isCurrentMonth 
            ? 'hover:opacity-80' 
            : ''
        }
        ${isAnimating ? 'marked' : ''}
      `}
      style={{
        backgroundColor: dayInfo.isCompleted ? routineColor : undefined,
        color: dayInfo.isCompleted ? 'white' : dayInfo.isCurrentMonth ? 'var(--text-primary)' : 'var(--text-muted)',
        transition: 'all 0.2s ease-in-out',
      }}
    >
      <span className="block text-xs font-semibold drop-shadow-sm">{dayInfo.day}</span>
    </button>
  );
}); 