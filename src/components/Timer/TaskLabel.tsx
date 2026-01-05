/**
 * Task Label Component
 * Allows users to label what they're working on
 */

import React, { useState } from 'react';
import { FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import { sanitizeTaskLabel } from '@/utils/validation';
import './TaskLabel.css';

interface TaskLabelProps {
  taskLabel: string | null;
  onTaskLabelChange: (label: string | null) => void;
  disabled?: boolean;
}

export const TaskLabel: React.FC<TaskLabelProps> = ({
  taskLabel,
  onTaskLabelChange,
  disabled = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(taskLabel || '');

  const handleSave = () => {
    const sanitized = sanitizeTaskLabel(inputValue);
    onTaskLabelChange(sanitized || null);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setInputValue(taskLabel || '');
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="task-label-input-container">
        <input
          type="text"
          className="task-label-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What are you working on?"
          maxLength={100}
          autoFocus
        />
        <div className="task-label-actions">
          <button className="task-label-btn save" onClick={handleSave} aria-label="Save">
            <FaCheck />
          </button>
          <button className="task-label-btn cancel" onClick={handleCancel} aria-label="Cancel">
            <FaTimes />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="task-label-container">
      {taskLabel ? (
        <div className="task-label-display">
          <span className="task-label-text">{taskLabel}</span>
          {!disabled && (
            <button
              className="task-label-btn edit"
              onClick={() => setIsEditing(true)}
              aria-label="Edit task"
            >
              <FaEdit />
            </button>
          )}
        </div>
      ) : (
        !disabled && (
          <button
            className="task-label-add"
            onClick={() => setIsEditing(true)}
            aria-label="Add task label"
          >
            + Add task label
          </button>
        )
      )}
    </div>
  );
};
