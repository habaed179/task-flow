import React, { useState } from 'react';
import { Search, X, CheckSquare, FolderKanban, Users, ArrowRight } from 'lucide-react';
import { useTasks } from '../../hooks/useTasks';
import { useProjects } from '../../hooks/useProjects';
import { useWorkspace } from '../../hooks/useWorkspace';
import { useNavigate } from 'react-router-dom';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const { tasks } = useTasks();
  const { projects } = useProjects();
  const { currentWorkspace } = useWorkspace();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const q = typeof query === 'string' ? query.toLowerCase().trim() : '';

  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const safeProjects = Array.isArray(projects) ? projects : [];
  const safeMembers = Array.isArray(currentWorkspace?.members) ? currentWorkspace.members : [];

  const matchedTasks = q
    ? safeTasks.filter((t) => (t.title || '').toLowerCase().includes(q) || (t.description || '').toLowerCase().includes(q))
    : [];

  const matchedProjects = q
    ? safeProjects.filter((p) => (p.name || '').toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q))
    : [];

  const matchedMembers = q
    ? safeMembers.filter((m) => (m.name || '').toLowerCase().includes(q) || (m.email || '').toLowerCase().includes(q))
    : [];

  const hasResults = matchedTasks.length > 0 || matchedProjects.length > 0 || matchedMembers.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-scaleUp">
        {/* Search Bar Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 mr-3" />
          <input
            type="text"
            placeholder="Search tasks, projects, members... (Type 'login')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results Area */}
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-6">
          {!q && (
            <div className="py-8 text-center text-slate-400 text-sm">
              Type to search across tasks, projects, and team members...
            </div>
          )}

          {q && !hasResults && (
            <div className="py-8 text-center text-slate-400 text-sm">
              No results matching "{query}"
            </div>
          )}

          {/* Tasks Group */}
          {matchedTasks.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5" />
                Tasks ({matchedTasks.length})
              </p>
              <div className="space-y-1">
                {matchedTasks.slice(0, 5).map((t) => (
                  <div
                    key={t.id}
                    onClick={() => {
                      onClose();
                      navigate('/tasks');
                    }}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
                  >
                    <div>
                      <h5 className="text-xs font-semibold text-slate-900 dark:text-white">{t.title}</h5>
                      <p className="text-[11px] text-slate-400 truncate">{t.description}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects Group */}
          {matchedProjects.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <FolderKanban className="w-3.5 h-3.5" />
                Projects ({matchedProjects.length})
              </p>
              <div className="space-y-1">
                {matchedProjects.slice(0, 5).map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      onClose();
                      navigate(`/projects/${p.id}`);
                    }}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
                  >
                    <div>
                      <h5 className="text-xs font-semibold text-slate-900 dark:text-white">{p.name}</h5>
                      <p className="text-[11px] text-slate-400 truncate">{p.description}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Members Group */}
          {matchedMembers.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                Members ({matchedMembers.length})
              </p>
              <div className="space-y-1">
                {matchedMembers.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => {
                      onClose();
                      navigate(`/team/${m.id}`);
                    }}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-xs">
                        {(m.name || 'M').charAt(0)}
                      </div>
                      <div>
                        <h5 className="text-xs font-semibold text-slate-900 dark:text-white">{m.name}</h5>
                        <p className="text-[11px] text-slate-400">{m.email}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
