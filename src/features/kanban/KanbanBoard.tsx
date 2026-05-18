import React, { useState } from 'react';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { TaskStatus, Task } from '../../types';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';
import { useKanbanStore } from '../../store/useKanbanStore';
import { Button, Modal, Input } from '../../components/ui';
import { Plus } from 'lucide-react';

export const KanbanBoard = () => {
  const { tasks, moveTask, addTask } = useKanbanStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskContent, setNewTaskContent] = useState('');
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find(t => t.id === event.active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const task = tasks.find(t => t.id === activeId);
    if (!task) return;

    const statusMap: Record<string, TaskStatus> = {
      todo: 'todo',
      doing: 'doing',
      done: 'done',
    };

    if (statusMap[overId]) {
      moveTask(activeId, statusMap[overId]);
    } else {
      const overTask = tasks.find(t => t.id === overId);
      if (overTask) {
        moveTask(activeId, overTask.status);
      }
    }
  };

  const handleAddTask = () => {
    if (newTaskContent.trim()) {
      addTask(newTaskContent);
      setNewTaskContent('');
      setIsModalOpen(false);
    }
  };

  const columns: { id: TaskStatus; title: string }[] = [
    { id: 'todo', title: 'A fazer' },
    { id: 'doing', title: 'Em andamento' },
    { id: 'done', title: 'Concluído' },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Controle de Ações</h1>
          <p className="text-slate-600">Organize e acompanhe suas tarefas diárias.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 shadow-md">
          <Plus size={18} /> Nova Tarefa
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 h-full items-start overflow-x-auto pb-4">
          {columns.map(col => (
            <KanbanColumn
              key={col.id}
              id={col.id}
              title={col.title}
              tasks={tasks.filter(t => t.status === col.id)}
            />
          ))}
        </div>

        <DragOverlay dropAnimation={{
          duration: 200,
          easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
        }}>
          {activeTask ? (
            <div style={{ transform: 'rotate(2deg)', opacity: 0.95 }}>
              <KanbanCard task={activeTask} isDragging />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nova Tarefa">
        <div className="space-y-4">
          <Input
            label="O que precisa ser feito?"
            placeholder="Ex: Finalizar relatório mensal..."
            value={newTaskContent}
            onChange={(e) => setNewTaskContent(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
            autoFocus
          />
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleAddTask}>Adicionar</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
