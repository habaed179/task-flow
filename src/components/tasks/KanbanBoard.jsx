import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { TASK_STATUSES } from '../../utils/constants';
import { useTasks } from '../../hooks/useTasks';
import TaskCard from '../TaskCard';
import { Plus } from 'lucide-react';

export default function KanbanBoard({ onEditTask, onDeleteTask, onOpenNewTaskModal }) {
  const { tasks, updateTaskStatus, toggleTaskComplete } = useTasks();

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    const newStatus = destination.droppableId; // e.g. "Todo", "In Progress", "Review", "Done"

    updateTaskStatus(draggableId, newStatus);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto pb-4">
        {TASK_STATUSES.map((statusObj) => {
          const columnTasks = tasks.filter((t) => (t.status || 'Todo') === statusObj.id);

          return (
            <div
              key={statusObj.id}
              className="flex flex-col rounded-2xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 p-3.5 min-w-[270px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between px-1 mb-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusObj.badge}`}>
                    {statusObj.label}
                  </span>
                  <span className="text-xs font-semibold text-slate-400 font-mono">
                    {columnTasks.length}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={onOpenNewTaskModal}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                  title="Add task to column"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Droppable Area */}
              <Droppable droppableId={statusObj.id}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`flex-1 space-y-3 min-h-[220px] rounded-xl transition-colors p-1 ${
                      snapshot.isDraggingOver ? 'bg-brand-500/10 dark:bg-brand-500/15 border-2 border-dashed border-brand-500/40' : ''
                    }`}
                  >
                    {columnTasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={provided.draggableProps.style}
                          >
                            <TaskCard
                              task={task}
                              onToggleComplete={toggleTaskComplete}
                              onEdit={onEditTask}
                              onDelete={onDeleteTask}
                              isDragging={snapshot.isDragging}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
