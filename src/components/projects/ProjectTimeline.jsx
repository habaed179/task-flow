import React from 'react';
import { Calendar, Clock, User } from 'lucide-react';
import { formatDate } from '../../utils/taskHelpers';

export default function ProjectTimeline({ tasks = [] }) {
  if (tasks.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 text-xs bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        No scheduled tasks available for timeline visualization.
      </div>
    );
  }

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-brand-500" />
          Project Schedule & Timeline Gantt
        </h3>
        <span className="text-xs font-semibold text-slate-400 font-mono">
          {tasks.length} tasks scheduled
        </span>
      </div>

      <div className="space-y-3">
        {tasks.map((task, idx) => {
          const isDone = (task.status || task.completed) === 'Done' || task.completed;

          return (
            <div
              key={task.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-2"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-xs font-mono">
                    {idx + 1}
                  </span>
                  <h4 className={`text-sm font-bold ${isDone ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                    {task.title}
                  </h4>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {task.status || 'Todo'}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                    {task.priority || 'Medium'}
                  </span>
                </div>
              </div>

              {/* Visual Schedule Bar */}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    {task.assigneeName || 'Unassigned'}
                  </span>
                  <span className="flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Due: {task.dueDate ? formatDate(task.dueDate) : 'Flexible'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
