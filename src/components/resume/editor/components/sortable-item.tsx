'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import { GripVertical } from 'lucide-react';
import React from 'react';

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
  accentColor?: 'cyan' | 'amber' | 'rose' | 'violet';
}

const accentColors = {
  cyan: {
    handle: 'bg-cyan-500/10 border-cyan-500/20 hover:bg-cyan-500/20',
    icon: 'text-cyan-400',
  },
  amber: {
    handle: 'bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20',
    icon: 'text-amber-400',
  },
  rose: {
    handle: 'bg-rose-500/10 border-rose-500/20 hover:bg-rose-500/20',
    icon: 'text-rose-400',
  },
  violet: {
    handle: 'bg-violet-500/10 border-violet-500/20 hover:bg-violet-500/20',
    icon: 'text-violet-400',
  },
};

export function SortableItem({ id, children, accentColor = 'cyan' }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  const colors = accentColors[accentColor];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative group mb-2 sm:mb-3',
        isDragging && 'opacity-90 shadow-2xl'
      )}
    >
      {/* Drag Handle - hidden on mobile, visible on hover on desktop */}
      <div
        {...attributes}
        {...listeners}
        className={cn(
          'absolute -left-1 sm:-left-3 top-3 sm:top-1/2 sm:-translate-y-1/2',
          'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
          'z-10 cursor-grab active:cursor-grabbing',
          'hidden sm:block'
        )}
      >
        <div className={cn(
          'rounded-lg p-1 sm:p-1.5 border',
          colors.handle
        )}>
          <GripVertical className={cn('h-3 w-3 sm:h-4 sm:w-4', colors.icon)} />
        </div>
      </div>
      
      {children}
    </div>
  );
}
