import React from 'react';
import type { Routine } from '../types/index';
import { formatDate } from '../utils/dateUtils';

interface RoutineCardProps {
  routine: Routine;
  onEdit: (routine: Routine) => void;
  onDelete: (routineId: string) => void;
  onClick: (routine: Routine) => void;
}

export const RoutineCard: React.FC<RoutineCardProps> = ({
  routine,
  onEdit,
  onDelete,
  onClick,
}) => {
  const today = formatDate(new Date());
  const isCompletedToday = routine.completedDates.includes(today);
  const completionRate = routine.completedDates.length;

  return (
    <div 
      className="routine-card"
      onClick={() => onClick(routine)}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div 
            className="w-4 h-4 rounded-full shadow-lg"
            style={{ backgroundColor: routine.color }}
          />
          <h3 className="text-lg font-bold drop-shadow-md" style={{ color: 'var(--text-primary)' }}>
            {routine.name}
          </h3>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(routine);
            }}
            className="p-2 rounded-xl transition-all duration-200 hover:scale-110 hover:opacity-80"
            style={{ color: 'var(--text-primary)' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(routine.id);
            }}
            className="p-2 rounded-xl transition-all duration-200 hover:scale-110 hover:opacity-80 text-red-500 hover:text-red-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      
      {routine.description && (
        <p className="text-base mb-3 drop-shadow-sm" style={{ color: 'var(--text-secondary)' }}>
          {routine.description}
        </p>
      )}
      
      <div className="flex items-center justify-between">
        <div className="stats-badge">
          <span className="font-semibold text-xs drop-shadow-sm" style={{ color: 'var(--text-primary)' }}>
            {completionRate} days completed
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="font-medium text-xs drop-shadow-sm" style={{ color: 'var(--text-secondary)' }}>
            Today:
          </span>
          <div className={`w-3 h-3 rounded-full shadow-sm ${isCompletedToday ? 'bg-green-500' : 'bg-gray-300'}`} />
        </div>
      </div>
    </div>
  );
}; 