import React, { useState } from 'react';
import type { Routine } from '../types/index';
import { RoutineCard } from '../components/RoutineCard';
import { AddRoutineModal } from '../components/AddRoutineModal';

interface HomeProps {
  routines: Routine[];
  onAddRoutine: (routineData: any) => void;
  onEditRoutine: (routine: Routine) => void;
  onDeleteRoutine: (routineId: string) => void;
  onRoutineClick: (routine: Routine) => void;
}

export const Home: React.FC<HomeProps> = ({
  routines,
  onAddRoutine,
  onEditRoutine,
  onDeleteRoutine,
  onRoutineClick,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<Routine | undefined>();

  const handleEdit = (routine: Routine) => {
    setEditingRoutine(routine);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingRoutine(undefined);
    setIsModalOpen(true);
  };

  const handleSaveRoutine = (routineData: any) => {
    if (editingRoutine) {
      onEditRoutine({
        ...editingRoutine,
        ...routineData,
      });
    } else {
      onAddRoutine(routineData);
    }
  };

  const handleDelete = (routineId: string) => {
    if (window.confirm('Are you sure you want to delete this routine? This action cannot be undone.')) {
      onDeleteRoutine(routineId);
    }
  };

  return (
    <div className="mobile-container">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 drop-shadow-lg" style={{ color: 'var(--text-primary)' }}>
          My Routines
        </h1>
        <p className="text-lg drop-shadow-md" style={{ color: 'var(--text-secondary)' }}>
          Track your daily habits and goals
        </p>
      </div>

      {/* Add Routine Button - Only show when there are routines */}
      {routines.length > 0 && (
        <div className="mb-8">
          <button
            onClick={handleAddNew}
            className="w-full flex items-center justify-center space-x-3 py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-purple-500/30"
            style={{
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              backdropFilter: 'blur(35px) saturate(250%)',
              border: '1px solid var(--border-primary)',
            }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-lg">Add New Routine</span>
          </button>
        </div>
      )}

      {/* Routines List */}
      {routines.length === 0 ? (
        <div className="floating-card text-center py-16">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500/30 to-indigo-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--text-primary)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-3 drop-shadow-lg" style={{ color: 'var(--text-primary)' }}>
            No routines yet
          </h3>
          <p className="mb-8 text-lg drop-shadow-md" style={{ color: 'var(--text-secondary)' }}>
            Create your first routine to start tracking your habits
          </p>
          <button
            onClick={handleAddNew}
            className="py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-purple-500/30"
            style={{
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              backdropFilter: 'blur(35px) saturate(250%)',
              border: '1px solid var(--border-primary)',
            }}
          >
            Create Your First Routine
          </button>
        </div>
      ) : (
        <div className="space-y-4 pb-20">
          {routines.map((routine) => (
            <RoutineCard
              key={routine.id}
              routine={routine}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onClick={onRoutineClick}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <AddRoutineModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveRoutine}
        editingRoutine={editingRoutine}
      />
    </div>
  );
}; 