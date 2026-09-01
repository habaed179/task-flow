import React from 'react';
import { CATEGORIES, PRIORITIES, STATUS_FILTERS } from '../utils/constants';
import { Filter, RotateCcw } from 'lucide-react';

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
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
      {/* Status Pills */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none w-full sm:w-auto">
        {STATUS_FILTERS.map((tab) => {
          const isActive = selectedStatus === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onStatusChange(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Select Filter Controls (Category & Priority) */}
      <div className="flex items-center gap-2 ml-auto w-full sm:w-auto justify-end">
        {/* Category Select */}
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          aria-label="Filter by Category"
          className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:border-brand-500 cursor-pointer"
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id} className="dark:bg-slate-900">
              {cat.label}
            </option>
          ))}
        </select>

        {/* Priority Select */}
        <select
          value={selectedPriority}
          onChange={(e) => onPriorityChange(e.target.value)}
          aria-label="Filter by Priority"
          className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:border-brand-500 cursor-pointer"
        >
          <option value="all">All Priorities</option>
          {PRIORITIES.map((p) => (
            <option key={p.id} value={p.id} className="dark:bg-slate-900">
              {p.label}
            </option>
          ))}
        </select>

        {/* Reset Filters button */}
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            title="Reset filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
}
