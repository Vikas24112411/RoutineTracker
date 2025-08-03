import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { Routine } from '../types/index';

import { getDaysInMonth, getMonthName, getCurrentMonth, addMonths, formatDate } from '../utils/dateUtils';
import { DayCell } from './DayCell';
import { RoutineAnalytics } from './RoutineAnalytics';

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

  // Calculate streak data
  const streakData = useMemo(() => {
    let currentStreak = 0;
    let maxStreak = 0;
    let tempStreak = 0;
    const now = new Date();
    
    // Calculate current streak (consecutive days from today backwards)
    let currentStreakCount = 0;
    for (let i = 0; i < 365; i++) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      const dateStr = formatDate(date);
      const isCompleted = localCompletedDates.includes(dateStr);
      
      if (isCompleted) {
        currentStreakCount++;
      } else {
        break; // Stop counting when we hit a non-completed day
      }
    }
    currentStreak = currentStreakCount;
    
    // Calculate max streak (longest consecutive streak in all data)
    for (let i = 0; i < 365; i++) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      const dateStr = formatDate(date);
      const isCompleted = localCompletedDates.includes(dateStr);
      
      if (isCompleted) {
        tempStreak++;
        maxStreak = Math.max(maxStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }
    
    return { currentStreak, maxStreak };
  }, [localCompletedDates]);
  
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

  const handleToggleDate = useCallback((date: Date) => {
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
  }, [localCompletedDates, onToggleDate, routine.id]);

  const goToPreviousMonth = useCallback(() => {
    setCurrentMonth(addMonths(currentMonth.year, currentMonth.month, -1));
  }, [currentMonth.year, currentMonth.month]);

  const goToNextMonth = useCallback(() => {
    setCurrentMonth(addMonths(currentMonth.year, currentMonth.month, 1));
  }, [currentMonth.year, currentMonth.month]);

  const goToCurrentMonth = useCallback(() => {
    setCurrentMonth(getCurrentMonth());
  }, []);

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
        <div className="flex items-center space-x-2">
          {/* Completed Days - 50% width */}
          <div className="w-1/2">
            <div className="stats-badge inline-block w-full text-center">
              <span className="font-semibold text-sm drop-shadow-sm" style={{ color: 'var(--text-primary)' }}>
                Completed {localCompletedDates.length} days
              </span>
            </div>
          </div>
          
          {/* Current Streak - 25% width */}
          <div className="w-1/4">
            <div className="flex items-center justify-center bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-lg px-2 py-2 border border-green-500/20">
              <div className="flex items-center space-x-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: routine.color }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <div className="text-center">
                  <div className="text-sm font-bold" style={{ color: routine.color }}>
                    {streakData.currentStreak}
                  </div>
                  <div className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                    Current
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Best Streak - 25% width */}
          <div className="w-1/4">
            <div className="flex items-center justify-center bg-gradient-to-r from-purple-500/10 to-purple-600/10 rounded-lg px-2 py-2 border border-purple-500/20">
              <div className="flex items-center space-x-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: routine.color }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                <div className="text-center">
                  <div className="text-sm font-bold" style={{ color: routine.color }}>
                    {streakData.maxStreak}
                  </div>
                  <div className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                    Best
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="floating-card mb-4">
        {/* Calendar Navigation - Inside the card */}
        <div className="flex items-center justify-center mb-6">
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

      {/* Analytics Card */}
      <RoutineAnalytics routine={{ ...routine, completedDates: localCompletedDates }} />

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