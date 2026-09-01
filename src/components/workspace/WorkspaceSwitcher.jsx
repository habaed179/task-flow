import React, { useState } from 'react';
import { useWorkspace } from '../../hooks/useWorkspace';
import { useAuth } from '../../hooks/useAuth';
import { ChevronDown, Plus, Building2, Check, Crown, Shield } from 'lucide-react';

export default function WorkspaceSwitcher({ onOpenNewWorkspaceModal }) {
  const { workspaces, currentWorkspace, switchWorkspace } = useWorkspace();
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const getWorkspaceUserRole = (ws) => {
    if (ws.ownerId === currentUser?.uid) return 'Workspace Leader';
    const member = ws.members?.find((m) => m.id === currentUser?.uid || m.email === currentUser?.email);
    if (member?.role === 'Owner') return 'Workspace Leader';
    if (member?.role === 'Admin') return 'Admin';
    if (member?.role === 'Manager') return 'Manager';
    if (member?.role === 'Viewer') return 'Viewer';
    return 'Team Member';
  };

  return (
    <div className="relative font-sans">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200/70 dark:hover:bg-slate-800 text-left transition-colors border border-slate-200/60 dark:border-slate-700/60 group"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-brand-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
            {currentWorkspace?.name ? currentWorkspace.name.charAt(0).toUpperCase() : 'W'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-slate-900 dark:text-white truncate leading-tight">
              {currentWorkspace?.name || 'My Workspace'}
            </p>
            <p className="text-[10px] text-slate-400 truncate uppercase tracking-wider font-semibold">
              {currentWorkspace?.plan || 'free'} Plan • {getWorkspaceUserRole(currentWorkspace || {})}
            </p>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 right-0 mt-2 z-50 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-1 animate-scaleUp">
            <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Your Workspaces ({workspaces.length})
            </p>

            <div className="max-h-56 overflow-y-auto space-y-1">
              {workspaces.map((ws) => {
                const isSelected = ws.id === currentWorkspace?.id;
                const roleName = getWorkspaceUserRole(ws);
                return (
                  <button
                    key={ws.id}
                    onClick={() => {
                      switchWorkspace(ws.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                      isSelected
                        ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Building2 className="w-3.5 h-3.5 shrink-0" />
                      <div className="truncate text-left">
                        <p className="truncate leading-none">{ws.name}</p>
                        <p className="text-[9px] text-slate-400 font-medium mt-0.5">{roleName}</p>
                      </div>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3] shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="pt-1 mt-1 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenNewWorkspaceModal();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-brand-600 dark:text-brand-400 hover:bg-brand-500/10 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>Create Workspace</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
