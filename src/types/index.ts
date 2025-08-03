export interface Routine {
  id: string;
  name: string;
  description?: string;
  color: string;
  createdAt: Date;
  completedDates: string[]; // ISO date strings
}

export interface RoutineFormData {
  name: string;
  description?: string;
  color: string;
}

export const ROUTINE_COLORS = [
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Green', value: '#10B981' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Orange', value: '#F59E0B' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Indigo', value: '#6366F1' },
  { name: 'Teal', value: '#14B8A6' },
] as const; 