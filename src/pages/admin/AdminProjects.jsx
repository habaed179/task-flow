import React from 'react';
import { FolderKanban, Trash2 } from 'lucide-react';
import { useProjects } from '../../hooks/useProjects';

export default function AdminProjects() {
  const { projects, removeProject } = useProjects();

  return (
    <div className="space-y-6 animate-fadeIn text-slate-100">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <FolderKanban className="w-6 h-6 text-rose-500" />
          Projects Control ({projects.length})
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          System-wide overview of active, planned, and archived projects.
        </p>
      </div>

      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 uppercase font-bold text-[10px] border-b border-slate-800">
            <tr>
              <th className="p-4">Project Name</th>
              <th className="p-4">Status</th>
              <th className="p-4">Priority</th>
              <th className="p-4">Due Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {projects.map((p) => (
              <tr key={p.id} className="hover:bg-slate-800/50">
                <td className="p-4 font-bold text-white">{p.name}</td>
                <td className="p-4">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-brand-500/10 text-brand-400 border border-brand-500/20">
                    {p.status || 'Active'}
                  </span>
                </td>
                <td className="p-4 text-slate-300">{p.priority || 'Medium'}</td>
                <td className="p-4 text-slate-400">{p.dueDate || 'No date'}</td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => removeProject(p.id)}
                    className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10"
                    title="Delete project"
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
