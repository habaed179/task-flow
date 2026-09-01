import React, { useState } from 'react';
import {
  Check,
  Calendar,
  Tag,
  Edit2,
  Trash2,
  GripVertical,
  AlertCircle,
  MoreVertical,
} from 'lucide-react';
import { CATEGORIES, PRIORITIES } from '../utils/constants';
import { formatDate, getDueDateStatus } from '../utils/taskHelpers';

export default function TaskCard({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
  dragHandleProps = null,
  isDragging = false,
}) {
  const [showActions, setShowActions] = useState(false);

  const categoryObj = CATEGORIES.find((c) => c.id === task.category) || CATEGORIES[0];
  const priorityObj = PRIORITIES.find((p) => p.id === task.priority) || PRIORITIES[1];
  const dueStatus = getDueDateStatus(task.dueDate, task.completed);

  return (
    <div
      className={`group relative p-4 sm:p-5 rounded-2xl transition-all duration-200 border bg-white dark:bg-slate-900 ${
        isDragging
          ? 'shadow-2xl border-brand-500 ring-2 ring-brand-500/20 scale-[1.02] z-30'
          : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm hover:shadow-md'
      } ${task.completed ? 'opacity-75 bg-slate-50/50 dark:bg-slate-900/40' : ''}`}
    >
      <div className="flex items-start gap-3.5">
        {/* Drag Handle */}
        {dragHandleProps && (
          <div
            {...dragHandleProps}
            className="mt-0.5 cursor-grab active:cursor-grabbing text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400 transition-colors p-0.5"
            title="Drag to reorder"
          >
            <GripVertical className="w-4 h-4" />
          </div>
        )}

        {/* Custom Checkbox */}
        <button
          type="button"
          onClick={() => onToggleComplete(task.id)}
          className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-all shrink-0 ${
            task.completed
              ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm shadow-emerald-500/30'
              : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-brand-500 dark:hover:border-brand-500'
          }`}
          aria-label={task.completed ? 'Mark task as active' : 'Mark task as completed'}
        >
          {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        {/* Content Body */}
        <div className="flex-1 min-w-0">
          {/* Header Row: Title & Badges */}
          <div className="flex items-start justify-between gap-2">
            <h4
              onClick={() => onToggleComplete(task.id)}
              className={`text-base font-semibold text-slate-900 dark:text-white cursor-pointer transition-colors line-clamp-2 ${
                task.completed ? 'line-through text-slate-400 dark:text-slate-500 font-normal' : ''
              }`}
            >
              {task.title}
            </h4>

            {/* Quick Actions (Desktop & Mobile) */}
            <div className="flex items-center gap-1 shrink-0 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onEdit(task)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Edit task"
                aria-label="Edit task"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(task)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Delete task"
                aria-label="Delete task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <p
              className={`mt-1 text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed ${
                task.completed ? 'line-through text-slate-400/80 dark:text-slate-600' : ''
              }`}
            >
              {task.description}
            </p>
          )}

          {/* Metadata Badges Footer */}
          <div className="mt-3.5 flex flex-wrap items-center gap-2 text-xs">
            {/* Category Badge */}
            <span
              className={`px-2.5 py-1 rounded-lg font-medium border ${categoryObj.bgLight} ${categoryObj.bgDark}`}
            >
              {categoryObj.label}
            </span>

            {/* Priority Badge */}
            <span
              className={`px-2.5 py-1 rounded-lg font-medium border ${priorityObj.badgeClass}`}
            >
              {priorityObj.label}
            </span>

            {/* Due Date Indicator */}
            {task.dueDate && (
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium border ${
                  dueStatus
                    ? dueStatus.color
                    : 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  {dueStatus ? dueStatus.label : `Due: ${formatDate(task.dueDate)}`}
                </span>
              </span>
            )}

            {/* Tags list */}
            {task.tags && task.tags.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap ml-auto">
                {task.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
