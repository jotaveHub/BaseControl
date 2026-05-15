import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Task, TaskStatus } from '../../types';
import { KanbanCard } from './KanbanCard';
import { cn } from '../../components/ui';

interface KanbanColumnProps {
  id: TaskStatus;
  title: string;
  tasks: Task[];
}

export const KanbanColumn = ({ id, title, tasks }: KanbanColumnProps) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className="flex flex-col w-80 shrink-0 h-full">
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="font-bold text-slate-900 flex items-center gap-2">
          <span className={cn(
            'w-2 h-2 rounded-full',
            id === 'todo' ? 'bg-gray-400' : id === 'doing' ? 'bg-blue-500' : 'bg-green-500'
          )} />
          {title}
          <span className="ml-2 text-xs font-normal text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </h3>
      </div>
      <div
        ref={setNodeRef}
        className="flex-1 overflow-y-auto space-y-3 p-3 rounded-xl bg-gray-200/40 border-2 border-dashed border-gray-300 shadow-inner min-h-[150px] transition-colors hover:bg-gray-200/60"
      >
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <KanbanCard key={task.id} task={task} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};
