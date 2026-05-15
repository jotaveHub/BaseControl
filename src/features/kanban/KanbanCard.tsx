import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../../types';
import { Card } from '../../components/ui';
import { Trash2 } from 'lucide-react';
import { useKanbanStore } from '../../store/useKanbanStore';
import { cn } from '../../components/ui';

interface KanbanCardProps {
  task: Task;
}

export const KanbanCard = ({ task }: KanbanCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });
  const deleteTask = useKanbanStore(state => state.deleteTask);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const statusColors = {
    todo: 'border-l-4 border-l-gray-400 bg-gray-50',
    doing: 'border-l-4 border-l-blue-500 bg-blue-50/50',
    done: 'border-l-4 border-l-green-500 bg-green-50/50',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card className={cn(
        'group cursor-grab active:cursor-grabbing relative hover:border-blue-400 transition-all',
        statusColors[task.status as keyof typeof statusColors]
      )}>
        <p className="text-sm font-medium text-slate-900 pr-6">{task.content}</p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteTask(task.id);
          }}
          className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 size={14} />
        </button>
      </Card>
    </div>
  );
};
