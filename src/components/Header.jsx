import React from 'react';
import { Menu, Plus, Zap, Bell, CheckCircle } from 'lucide-react';
import { useTasks } from '../hooks/useTasks';

export default function Header({ onOpenSidebar, onOpenNewTaskModal, title = 'Dashboard' }) {
  const { tasks } = useTasks();
  const activeCount = tasks.filter((t) => !t.completed).length;

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Toggle */}
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Open mobile navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Page Title & Status Subtitle */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {title}
          </h1>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-3">
        {/* Quick Stats Pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{activeCount} Active Tasks</span>
        </div>

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
