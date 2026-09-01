import React from 'react';
import { CheckSquare, Trash2 } from 'lucide-react';
import { useTasks } from '../../hooks/useTasks';

export default function AdminTasks() {
  const { tasks, deleteTask } = useTasks();

  return (
    <div className="space-y-6 animate-fadeIn text-slate-100">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <CheckSquare className="w-6 h-6 text-rose-500" />
          Global Tasks Control ({tasks.length})
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          System-wide task registry and status monitoring.
        </p>
      </div>

      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 uppercase font-bold text-[10px] border-b border-slate-800">
            <tr>
              <th className="p-4">Task Title</th>
              <th className="p-4">Assignee</th>
              <th className="p-4">Status</th>
              <th className="p-4">Priority</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {tasks.map((t) => (
              <tr key={t.id} className="hover:bg-slate-800/50">
                <td className="p-4 font-bold text-white max-w-xs truncate">{t.title}</td>
                <td className="p-4 text-slate-300">{t.assigneeName || 'Unassigned'}</td>
                <td className="p-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 border border-slate-700 text-slate-200">
                    {t.status || 'Todo'}
                  </span>
                </td>
                <td className="p-4 text-slate-400">{t.priority || 'Medium'}</td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => deleteTask(t.id)}
                    className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10"
                    title="Delete task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
