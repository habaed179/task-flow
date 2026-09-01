import React from 'react';
import { Menu, Plus, Search, Bell } from 'lucide-react';
import { useTasks } from '../hooks/useTasks';
import { useNotifications } from '../hooks/useNotifications';
import { Link } from 'react-router-dom';

export default function Header({ onOpenSidebar, onOpenNewTaskModal, onOpenSearchModal, title = 'Dashboard' }) {
  const { tasks } = useTasks();
  const { unreadCount } = useNotifications();

  const activeCount = tasks.filter((t) => !t.completed && t.status !== 'Done').length;

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Open mobile navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          {title}
        </h1>
      </div>

      {/* Center Search Bar Trigger */}
      <button
        onClick={onOpenSearchModal}
        className="hidden md:flex items-center justify-between gap-3 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 w-64 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Search className="w-3.5 h-3.5" />
          <span>Quick search...</span>
        </div>
        <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-200 dark:bg-slate-800 text-slate-500">
          /
        </kbd>
      </button>

      {/* Action Controls */}
      <div className="flex items-center gap-3">
        {/* Notifications Icon Button */}
        <Link
          to="/notifications"
          className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-950" />
          )}
        </Link>

        {/* Add Task Primary CTA Button */}
        <button
          onClick={onOpenNewTaskModal}
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white text-sm font-semibold transition-all shadow-md shadow-brand-600/25 active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span className="hidden sm:inline">Add Task</span>
        </button>
      </div>
    </header>
  );
}
