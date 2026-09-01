import React from 'react';
import { Filter, X, Bookmark } from 'lucide-react';
import { CATEGORIES, PRIORITIES, STATUS_FILTERS } from '../utils/constants';

export default function FilterBar({
  selectedStatus,
  onStatusChange,
  selectedCategory,
  onCategoryChange,
  selectedPriority,
  onPriorityChange,
  onResetFilters,
  hasActiveFilters,
}) {
  const filterPresets = [
    {
      id: 'preset-overdue',
      name: 'High Priority Bugs',
      apply: () => {
        onStatusChange('all');
        onCategoryChange('Development');
        onPriorityChange('High');
      },
    },
    {
      id: 'preset-urgent',
      name: 'Urgent Work',
      apply: () => {
        onStatusChange('active');
        onCategoryChange('Work');
        onPriorityChange('Urgent');
      },
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors font-sans">
      {/* Status Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
        {STATUS_FILTERS.map((s) => {
          const isActive = selectedStatus === s.id;
          return (
            <button
              key={s.id}
              onClick={() => onStatusChange(s.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      {/* Select Filter Dropdowns */}
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 focus:outline-none"
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>

        <select
          value={selectedPriority}
          onChange={(e) => onPriorityChange(e.target.value)}
          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 focus:outline-none"
        >
          <option value="all">All Priorities</option>
          {PRIORITIES.map((p) => (
            <option key={p.id} value={p.id}>{p.label}</option>
          ))}
        </select>

        {/* Filter Presets */}
        <div className="hidden sm:flex items-center gap-1.5">
          {filterPresets.map((p) => (
            <button
              key={p.id}
              onClick={p.apply}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 hover:bg-brand-500/20 transition-colors"
            >
              <Bookmark className="w-3 h-3" />
              <span>{p.name}</span>
            </button>
          ))}
        </div>

        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-semibold hover:bg-rose-500/20 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
}
