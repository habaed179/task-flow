import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import { SORT_OPTIONS } from '../utils/constants';

export default function SortDropdown({ value, onChange }) {
  return (
    <div className="relative inline-flex items-center">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
        <ArrowUpDown className="w-3.5 h-3.5" />
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Sort tasks"
        className="pl-9 pr-8 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-brand-500 shadow-sm transition-colors cursor-pointer appearance-none"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.id} value={opt.id} className="dark:bg-slate-900 font-normal">
            Sort: {opt.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </div>
    </div>
  );
}
