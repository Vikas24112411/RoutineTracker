import React, { useState, useEffect } from 'react';
import type { Routine, RoutineFormData } from '../types/index';
import { ROUTINE_COLORS } from '../types/index';

interface AddRoutineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (routineData: RoutineFormData, id?: string) => void;
  editingRoutine?: Routine;
}

export const AddRoutineModal: React.FC<AddRoutineModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingRoutine,
}) => {
  const [formData, setFormData] = useState<RoutineFormData>({
    name: '',
    description: '',
    color: ROUTINE_COLORS[0].value,
  });
  const [errors, setErrors] = useState<{ name?: string; description?: string; color?: string }>({});

  useEffect(() => {
    if (editingRoutine) {
      setFormData({
        name: editingRoutine.name,
        description: editingRoutine.description || '',
        color: editingRoutine.color,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        color: ROUTINE_COLORS[0].value,
      });
    }
    setErrors({});
  }, [editingRoutine, isOpen]);

  const handleInputChange = (field: keyof RoutineFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: { name?: string; description?: string; color?: string } = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Routine name is required.';
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'Routine name cannot exceed 50 characters.';
    }
    if (formData.description && formData.description.length > 200) {
      newErrors.description = 'Description cannot exceed 200 characters.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData, editingRoutine?.id);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold drop-shadow-lg" style={{ color: 'var(--text-primary)' }}>
              {editingRoutine ? 'Edit Routine' : 'Add New Routine'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl transition-all duration-200 hover:opacity-80"
              style={{ color: 'var(--text-muted)' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-base font-semibold mb-2 drop-shadow-sm" style={{ color: 'var(--text-primary)' }}>
                Routine Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 border-2 rounded-xl focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500 transition-all duration-200 text-base ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                }}
                placeholder="e.g., Gym, Drink Water, Study"
                maxLength={50}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 drop-shadow-sm">{errors.name}</p>
              )}
            </div>

            {/* Description Field */}
            <div>
              <label htmlFor="description" className="block text-base font-semibold mb-2 drop-shadow-sm" style={{ color: 'var(--text-primary)' }}>
                Description (Optional)
              </label>
              <textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={`w-full px-3 py-2 border-2 rounded-xl focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500 transition-all duration-200 resize-none text-base ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                }}
                placeholder="Add a description for your routine..."
                rows={2}
                maxLength={200}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 drop-shadow-sm">{errors.description}</p>
              )}
              <p className="mt-1 text-xs drop-shadow-sm" style={{ color: 'var(--text-muted)' }}>
                {(formData.description || '').length}/200 characters
              </p>
            </div>

            {/* Color Selection - Single Row */}
            <div>
              <label className="block text-base font-semibold mb-3 drop-shadow-sm" style={{ color: 'var(--text-primary)' }}>
                Choose Color
              </label>
              <div className="grid grid-cols-8 gap-3">
                {ROUTINE_COLORS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => handleInputChange('color', color.value)}
                    className={`w-10 h-10 rounded-xl border-2 transition-all duration-200 transform hover:scale-110 ${
                      formData.color === color.value
                        ? 'border-purple-500 scale-110 shadow-lg'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: color.value }}
                    aria-label={`Select ${color.name} color`}
                  />
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 px-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/30"
                style={{
                  background: 'var(--bg-nav)',
                  color: 'var(--text-primary)',
                  border: 'none',
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-purple-500/30"
                style={{
                  background: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                  backdropFilter: 'blur(25px) saturate(200%)',
                  border: '1px solid var(--border-primary)',
                }}
              >
                {editingRoutine ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}; 