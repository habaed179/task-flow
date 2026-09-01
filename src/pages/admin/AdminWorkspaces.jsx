import React from 'react';
import { Building2, Search, CheckCircle2 } from 'lucide-react';
import { useWorkspace } from '../../hooks/useWorkspace';

export default function AdminWorkspaces() {
  const { workspaces } = useWorkspace();

  return (
    <div className="space-y-6 animate-fadeIn text-slate-100">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Building2 className="w-6 h-6 text-rose-500" />
          Workspace Management ({workspaces.length})
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Inspect active SaaS workspaces, member rosters, subscription plans, and resource utilization.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {workspaces.map((ws) => (
          <div key={ws.id} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold">
                  {ws.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{ws.name}</h3>
                  <p className="text-xs text-slate-400">ID: {ws.id}</p>
                </div>
              </div>

              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-brand-500/10 text-brand-400 border border-brand-500/20">
                {ws.plan || 'Pro'} Plan
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {ws.description || 'No description available.'}
            </p>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950">
                <span className="text-slate-400 block font-medium">Members</span>
                <span className="text-sm font-bold text-white mt-0.5 block">{ws.members?.length || 1} users</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950">
                <span className="text-slate-400 block font-medium">Status</span>
                <span className="text-sm font-bold text-emerald-400 mt-0.5 block">Active</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
