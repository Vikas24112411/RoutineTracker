import React, { useState, useEffect, useMemo } from 'react';
import type { Routine } from '../types/index';
import type { DateInfo } from '../utils/dateUtils';
import { getDaysInMonth, getMonthName, getCurrentMonth, addMonths, formatDate } from '../utils/dateUtils';
import { DayCell } from './DayCell';

interface CalendarViewProps {
  routine: Routine;
  onToggleDate: (routineId: string, date: Date) => void;
  onBack: () => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  routine,
  onToggleDate,
  onBack,
}) => {
  const [currentMonth, setCurrentMonth] = useState(() => getCurrentMonth());
  const [localCompletedDates, setLocalCompletedDates] = useState<string[]>(routine.completedDates);
  
  const days = getDaysInMonth(currentMonth.year, currentMonth.month);
  
  // Update local state when routine changes
  useEffect(() => {
    setLocalCompletedDates(routine.completedDates);
  }, [routine.completedDates]);
  
  // Mark completed days - use local state for immediate updates
  const daysWithCompletion = useMemo(() => {
    return days.map(day => ({
      ...day,
      isCompleted: localCompletedDates.includes(formatDate(day.date))
    }));
  }, [days, localCompletedDates]);

  const handleToggleDate = (date: Date) => {
    const dateString = formatDate(date);
    const isCompleted = localCompletedDates.includes(dateString);
    
    // Update local state immediately for instant feedback
    if (isCompleted) {
      setLocalCompletedDates(prev => prev.filter(d => d !== dateString));
    } else {
      setLocalCompletedDates(prev => [...prev, dateString]);
    }
    
    // Call the parent handler
    onToggleDate(routine.id, date);
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(addMonths(currentMonth.year, currentMonth.month, -1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth.year, currentMonth.month, 1));
  };

  const goToCurrentMonth = () => {
    setCurrentMonth(getCurrentMonth());
  };

  return (
    <div className="mobile-container">
      {/* Routine Info Card */}
      <div className="floating-card mb-4">
        <div className="flex items-center space-x-3 mb-2">
          <div 
            className="w-5 h-5 rounded-full shadow-lg"
            style={{ backgroundColor: routine.color }}
          />
          <h3 className="text-lg font-bold drop-shadow-md" style={{ color: 'var(--text-primary)' }}>
            {routine.name}
          </h3>
        </div>
        {routine.description && (
          <p className="text-sm mb-2 drop-shadow-sm" style={{ color: 'var(--text-secondary)' }}>
            {routine.description}
          </p>
        )}
        <div className="stats-badge inline-block">
          <span className="font-semibold text-xs drop-shadow-sm" style={{ color: 'var(--text-primary)' }}>
            Completed {localCompletedDates.length} days
          </span>
        </div>
      </div>

      {/* Calendar Navigation - Centered and shrunk by 30% */}
      <div className="flex items-center justify-center mb-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={goToPreviousMonth}
            className="nav-button"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="text-center">
            <h2 className="text-lg font-bold drop-shadow-lg" style={{ color: 'var(--text-primary)' }}>
              {getMonthName(currentMonth.month)} {currentMonth.year}
            </h2>
            <button
              onClick={goToCurrentMonth}
              className="font-medium text-xs drop-shadow-sm hover:opacity-80 transition-opacity"
              style={{ color: 'var(--text-secondary)' }}
            >
              Today
            </button>
          </div>
          
          <button
            onClick={goToNextMonth}
            className="nav-button"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="floating-card">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2 mb-6">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-semibold py-3 drop-shadow-sm" style={{ color: 'var(--text-secondary)' }}>
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {daysWithCompletion.map((day, index) => (
            <DayCell
              key={index}
              dayInfo={day}
              routineColor={routine.color}
              onToggle={handleToggleDate}
            />
          ))}
        </div>
      </div>

      {/* Home Button - Fixed at bottom left */}
      <div className="fixed bottom-4 left-4 z-50">
        <button
          onClick={onBack}
          className="nav-button"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </button>
      </div>
    </div>
  );
}; 