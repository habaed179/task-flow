import React, { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { CATEGORIES, PRIORITIES } from '../utils/constants';
import ThemeToggle from '../components/ThemeToggle';
import ConfirmModal from '../components/ConfirmModal';
import {
  Palette,
  Sliders,
  Database,
  Trash2,
  RotateCcw,
  Check,
  ShieldAlert,
} from 'lucide-react';

export default function Settings() {
  const {
    settings,
    updateSettings,
    clearAllTasks,
    resetDemoData,
    tasks,
  } = useTasks();

  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const handlePriorityChange = (e) => {
    updateSettings({ defaultPriority: e.target.value });
  };

  const handleCategoryChange = (e) => {
    updateSettings({ defaultCategory: e.target.value });
  };

  return (
    <div className="max-w-3xl space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Settings & Preferences
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage application themes, default task preferences, and local dataset options.
        </p>
      </div>

      {/* 1. Appearance Settings Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Appearance
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Customize interface color theme and visual style
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              Theme Preference
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Toggle between Light and Dark mode
            </p>
          </div>
          <ThemeToggle showLabel={true} />
        </div>
      </div>

      {/* 2. Task Default Preferences Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Task Defaults
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Set default choices when creating new tasks
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Default Priority */}
          <div>
            <label
              htmlFor="def-priority"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2"
            >
              Default Priority
            </label>
            <select
              id="def-priority"
              value={settings.defaultPriority || 'Medium'}
              onChange={handlePriorityChange}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
            >
              {PRIORITIES.map((p) => (
                <option key={p.id} value={p.id} className="dark:bg-slate-900">
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* Default Category */}
          <div>
            <label
              htmlFor="def-category"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2"
            >
              Default Category
            </label>
            <select
              id="def-category"
              value={settings.defaultCategory || 'Work'}
              onChange={handleCategoryChange}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id} className="dark:bg-slate-900">
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 3. Data Management Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Data & Storage
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage local data persistence, clear tasks, or restore demo data
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Reset Demo Data */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Reset Demo Tasks
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Restore initial sample tasks (5 sample items)
              </p>
            </div>
            <button
              onClick={() => setIsResetModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-medium text-xs transition-colors shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo Data</span>
            </button>
          </div>

          {/* Clear All Tasks */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-rose-500/5 dark:bg-rose-950/20 border border-rose-500/20">
            <div>
              <p className="text-sm font-semibold text-rose-700 dark:text-rose-300">
                Clear All Tasks
              </p>
              <p className="text-xs text-rose-600/80 dark:text-rose-400/80">
                Permanently remove all ({tasks.length}) tasks from LocalStorage
              </p>
            </div>
            <button
              onClick={() => setIsClearModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs transition-colors shadow-sm shadow-rose-600/20 shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modals */}
      <ConfirmModal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        onConfirm={clearAllTasks}
        title="Clear All Tasks?"
        message={`Are you sure you want to delete all ${tasks.length} tasks? This operation cannot be undone.`}
        confirmText="Clear All Data"
        cancelText="Cancel"
        isDestructive={true}
      />

      <ConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={resetDemoData}
        title="Reset to Demo Data?"
        message="This will overwrite current task changes and reload the 5 initial sample tasks."
        confirmText="Reset Demo Data"
        cancelText="Cancel"
        isDestructive={false}
      />
    </div>
  );
}
