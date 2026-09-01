import React, { useState } from 'react';
import { Check, Plus, Trash2, CheckSquare } from 'lucide-react';

export default function SubtaskChecklist({ subtasks = [], onChange }) {
  const [newSubtask, setNewSubtask] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newSubtask.trim()) return;

    const item = {
      id: `sub-${Date.now()}`,
      title: newSubtask.trim(),
      completed: false,
    };

    onChange([...subtasks, item]);
    setNewSubtask('');
  };

  const handleToggle = (id) => {
    const updated = subtasks.map((s) =>
      s.id === id ? { ...s, completed: !s.completed } : s
    );
    onChange(updated);
  };

  const handleDelete = (id) => {
    const updated = subtasks.filter((s) => s.id !== id);
    onChange(updated);
  };

  const completedCount = subtasks.filter((s) => s.completed).length;
  const progressPercent = subtasks.length > 0 ? Math.round((completedCount / subtasks.length) * 100) : 0;

  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 uppercase tracking-wider">
          <CheckSquare className="w-4 h-4 text-brand-500" />
          Subtasks ({completedCount}/{subtasks.length})
        </span>
        {subtasks.length > 0 && (
          <span className="text-[11px] font-semibold text-slate-400 font-mono">
            {progressPercent}% completed
          </span>
        )}
      </div>

      {/* Progress Bar */}
      {subtasks.length > 0 && (
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-brand-500 h-full transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}

      {/* Subtasks List */}
      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
        {subtasks.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-xs transition-colors hover:border-slate-300 dark:hover:border-slate-700"
          >
            <div
              onClick={() => handleToggle(item.id)}
              className="flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer"
            >
              <div
                className={`w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ${
                  item.completed
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                }`}
              >
                {item.completed && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <span
                className={`truncate font-medium ${
                  item.completed
                    ? 'line-through text-slate-400 dark:text-slate-500'
                    : 'text-slate-800 dark:text-slate-200'
                }`}
              >
                {item.title}
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleDelete(item.id)}
              className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
              title="Delete subtask"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Add Subtask Form */}
      <form onSubmit={handleAdd} className="flex items-center gap-2 pt-1">
        <input
          type="text"
          placeholder="Add subtask item..."
          value={newSubtask}
          onChange={(e) => setNewSubtask(e.target.value)}
          className="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
        />
        <button
          type="submit"
          disabled={!newSubtask.trim()}
          className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </form>
    </div>
  );
}
