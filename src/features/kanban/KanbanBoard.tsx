import React, { useState } from 'react';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { TaskStatus } from '../../types';
import { KanbanColumn } from './KanbanColumn';
import { useKanbanStore } from '../../store/useKanbanStore';
import { Button, Modal, Input } from '../../components/ui';
import { Plus } from 'lucide-react';

export const KanbanBoard = () => {
  const { tasks, moveTask, addTask } = useKanbanStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskContent, setNewTaskContent] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetting: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const task = tasks.find(t => t.id === activeId);
    if (!task) return;

    // If the overId is a column ID
    const statusMap: Record<string, TaskStatus> = {
      todo: 'todo',
      doing: 'doing',
      done: 'done',
    };

    if (statusMap[overId]) {
      moveTask(activeId, statusMap[overId]);
    } else {
      // The overId is another card. We move the task to the status of the over-card.
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
      </DndContext>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nova Tarefa"
      >
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
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddTask}>
              Adicionar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
