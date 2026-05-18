import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task, TaskStatus } from '../../types';
import { Card } from '../../components/ui';
import { Trash2, ArrowRight, ChevronRight } from 'lucide-react';
import { useKanbanStore } from '../../store/useKanbanStore';
import { cn } from '../../components/ui';

interface KanbanCardProps {
  task: Task;
  isDragging?: boolean;
}

const statusSequence: TaskStatus[] = ['todo', 'doing', 'done'];
const statusLabels: Record<TaskStatus, string> = {
  todo: 'A fazer',
  doing: 'Em andamento',
  done: 'Concluído',
};

export const KanbanCard = ({ task, isDragging = false }: KanbanCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging: isSortableDragging } = useSortable({ id: task.id });
  const deleteTask = useKanbanStore(state => state.deleteTask);
  const moveTask = useKanbanStore(state => state.moveTask);
  const [showMoveMenu, setShowMoveMenu] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0 : 1,
  };

  const statusColors = {
    todo: 'border-l-4 border-l-gray-400 bg-gray-50',
    doing: 'border-l-4 border-l-blue-500 bg-blue-50/50',
    done: 'border-l-4 border-l-green-500 bg-green-50/50',
  };

  const otherStatuses = statusSequence.filter(s => s !== task.status);

  const handleMove = (e: React.MouseEvent, status: TaskStatus) => {
    e.stopPropagation();
    moveTask(task.id, status);
    setShowMoveMenu(false);
  };

  if (isDragging) {
    return (
      <Card className={cn(
        'cursor-grabbing relative shadow-2xl',
        statusColors[task.status as keyof typeof statusColors]
      )}>
        <p className="text-sm font-medium text-slate-900 pr-6">{task.content}</p>
      </Card>
    );
  }

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <Card className={cn(
        'group cursor-grab active:cursor-grabbing relative hover:border-blue-400 transition-all',
        statusColors[task.status as keyof typeof statusColors]
      )}>
        <div {...attributes} {...listeners} className="pr-14">
          <p className="text-sm font-medium text-slate-900">{task.content}</p>
        </div>

        {/* Action buttons */}
        <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Move button */}
          <div className="relative">
            <button
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                setShowMoveMenu(prev => !prev);
              }}
              className="p-1 text-gray-400 hover:text-blue-500 transition-colors rounded"
              title="Mover para etapa"
            >
              <ArrowRight size={14} />
            </button>

            {showMoveMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onMouseDown={(e) => { e.stopPropagation(); setShowMoveMenu(false); }}
                />
                <div className="absolute right-0 top-7 z-20 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[160px]">
                  <p className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Mover para</p>
                  {otherStatuses.map(status => (
                    <button
                      key={status}
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={(e) => handleMove(e, status)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2 transition-colors"
                    >
                      <span className={cn(
                        'w-2 h-2 rounded-full flex-shrink-0',
                        status === 'todo' ? 'bg-gray-400' : status === 'doing' ? 'bg-blue-500' : 'bg-green-500'
                      )} />
                      {statusLabels[status]}
                      <ChevronRight size={12} className="ml-auto" />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Delete button */}
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              deleteTask(task.id);
            }}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors rounded"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </Card>
    </div>
  );
};
