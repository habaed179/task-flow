import React from 'react';
import { useTasks } from '../hooks/useTasks';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ showLabel = true, className = '' }) {
  const { theme, toggleTheme } = useTasks();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${
        isDark
          ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
          : 'bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 shadow-sm'
      } ${className}`}
      aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
      title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
    >
      <div className="flex items-center gap-2.5">
        {isDark ? (
          <Moon className="w-4 h-4 text-sky-400 transition-transform duration-300 rotate-0" />
        ) : (
          <Sun className="w-4 h-4 text-amber-500 transition-transform duration-300 rotate-0" />
        )}
        {showLabel && <span>{isDark ? 'Dark Mode' : 'Light Mode'}</span>}
      </div>

      <div
        className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 ${
          isDark ? 'bg-sky-600' : 'bg-slate-300'
        }`}
      >
        <div
          className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${
            isDark ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </div>
    </button>
  );
}
