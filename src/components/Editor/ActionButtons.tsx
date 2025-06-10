import React from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';

interface ActionButtonsProps {
  onAdd: () => void;
  onRemove?: () => void;
  showRemove?: boolean;
  addLabel: string;
  className?: string;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onAdd,
  onRemove,
  showRemove = false,
  addLabel,
  className = ''
}) => {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <button
        type="button"
        onClick={onAdd}
        className="flex items-center space-x-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
      >
        <Plus className="h-4 w-4" />
        <span>{addLabel}</span>
      </button>
      
      {showRemove && onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="h-4 w-4" />
          <span>Remove</span>
        </button>
      )}
    </div>
  );
};