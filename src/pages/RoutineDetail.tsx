import React from 'react';
import type { Routine } from '../types/index';
import { CalendarView } from '../components/CalendarView';

interface RoutineDetailProps {
  routine: Routine;
  onToggleDate: (routineId: string, date: Date) => void;
  onBack: () => void;
}

export const RoutineDetail: React.FC<RoutineDetailProps> = ({
  routine,
  onToggleDate,
  onBack,
}) => {
  return (
    <CalendarView
      routine={routine}
      onToggleDate={onToggleDate}
      onBack={onBack}
    />
  );
}; 