import React, { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { Routine, RoutineFormData } from './types/index';
import { Home } from './pages/Home';
import { RoutineDetail } from './pages/RoutineDetail';
import { formatDate } from './utils/dateUtils';
import { ThemeToggle } from './components/ThemeToggle';
import './App.css';

type AppView = 'home' | 'detail';

interface AppState {
  view: AppView;
  selectedRoutine?: Routine;
}

function App() {
  const [routines, setRoutines] = useLocalStorage<Routine[]>('routines', []);
  const [appState, setAppState] = useState<AppState>({ view: 'home' });

  const addRoutine = (routineData: RoutineFormData) => {
    const newRoutine: Routine = {
      id: Date.now().toString(),
      name: routineData.name,
      description: routineData.description,
      color: routineData.color,
      createdAt: new Date(),
      completedDates: [],
    };
    setRoutines(prev => [...prev, newRoutine]);
  };

  const editRoutine = (updatedRoutine: Routine) => {
    setRoutines(prev =>
      prev.map(routine =>
        routine.id === updatedRoutine.id ? updatedRoutine : routine
      )
    );
  };

  const deleteRoutine = (routineId: string) => {
    setRoutines(prev => prev.filter(routine => routine.id !== routineId));
    if (appState.selectedRoutine?.id === routineId) {
      setAppState({ view: 'home' });
    }
  };

  const toggleDate = (routineId: string, date: Date) => {
    const dateString = formatDate(date);
    setRoutines(prev =>
      prev.map(routine => {
        if (routine.id === routineId) {
          const isCompleted = routine.completedDates.includes(dateString);
          const updatedDates = isCompleted
            ? routine.completedDates.filter(d => d !== dateString)
            : [...routine.completedDates, dateString];

          return { ...routine, completedDates: updatedDates };
        }
        return routine;
      })
    );
  };

  const navigateToRoutine = (routine: Routine) => {
    setAppState({ view: 'detail', selectedRoutine: routine });
  };

  const navigateBack = () => {
    setAppState({ view: 'home' });
  };

  return (
    <div className="min-h-screen">
      {/* Theme toggle positioned at bottom-right to avoid calendar navigation interference */}
      <div className="fixed bottom-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      {appState.view === 'home' ? (
        <Home
          routines={routines}
          onAddRoutine={addRoutine}
          onEditRoutine={editRoutine}
          onDeleteRoutine={deleteRoutine}
          onRoutineClick={navigateToRoutine}
        />
      ) : appState.selectedRoutine ? (
        <RoutineDetail
          routine={appState.selectedRoutine}
          onToggleDate={toggleDate}
          onBack={navigateBack}
        />
      ) : (
        <Home
          routines={routines}
          onAddRoutine={addRoutine}
          onEditRoutine={editRoutine}
          onDeleteRoutine={deleteRoutine}
          onRoutineClick={navigateToRoutine}
        />
      )}
    </div>
  );
}

export default App;
