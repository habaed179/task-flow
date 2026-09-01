import React from 'react';
import { CheckCircle2, SearchX, Inbox, Sparkles, Plus } from 'lucide-react';

export default function EmptyState({ type = 'no-tasks', onAction }) {
  const configs = {
    'no-tasks': {
      icon: Sparkles,
      title: "You're all caught up 🎉",
      description: 'No tasks available right now. Take a breath or add a new task to stay organized.',
      actionText: 'Create New Task',
    },
    'no-results': {
      icon: SearchX,
      title: 'No tasks found',
      description: 'Try adjusting your search query or clear active filters to find what you need.',
      actionText: 'Clear Filters',
    },
    'no-completed': {
      icon: CheckCircle2,
      title: 'No completed tasks yet',
      description: 'Finish a task to see it show up here. You got this!',
      actionText: 'View Active Tasks',
    },
    'no-active': {
      icon: Inbox,
      title: 'No active tasks',
      description: 'Awesome job! All your tasks are completed.',
      actionText: 'Add New Task',
    },
  };

  const config = configs[type] || configs['no-tasks'];
  const IconComponent = config.icon;

  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 my-4 shadow-sm animate-fadeIn">
      <div className="w-16 h-16 rounded-2xl bg-brand-500/10 dark:bg-brand-500/15 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-4">
        <IconComponent className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight mb-1">
        {config.title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6 leading-relaxed">
        {config.description}
      </p>
      {onAction && (
        <button
          onClick={onAction}
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-medium text-sm transition-all duration-200 shadow-md shadow-brand-500/20"
        >
          <Plus className="w-4 h-4" />
          {config.actionText}
        </button>
      )}
    </div>
  );
}
