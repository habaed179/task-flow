import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import EmptyState from './EmptyState';

export default function TaskList({
  tasks,
  onToggleComplete,
  onEdit,
  onDelete,
  onReorder,
  emptyType = 'no-results',
  onEmptyAction,
  isDragDisabled = false,
}) {
  if (tasks.length === 0) {
    return <EmptyState type={emptyType} onAction={onEmptyAction} />;
  }

  const handleDragEnd = (result) => {
    if (!result.destination || !onReorder) return;
    if (result.destination.index === result.source.index) return;

    const reordered = Array.from(tasks);
    const [movedItem] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, movedItem);

    onReorder(reordered);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="task-list-droppable" isDropDisabled={isDragDisabled}>
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-3 min-h-[50px]"
          >
            {tasks.map((task, index) => (
              <Draggable
                key={task.id}
                draggableId={task.id}
                index={index}
                isDragDisabled={isDragDisabled}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    style={provided.draggableProps.style}
                  >
                    <TaskCard
                      task={task}
                      onToggleComplete={onToggleComplete}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      dragHandleProps={isDragDisabled ? null : provided.dragHandleProps}
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
    </DragDropContext>
  );
}
